import express, { NextFunction, Request, Response } from "express";
import { IUserService } from "../service/userService.interface";
import { UserService } from "../service/userService";
import { determineErrorResponse, determineUserErrorResponse } from "./userErrorHandler";
import { ensureAuthenticated, validateUserCredentials } from "./validators";
import { deleteRequest, loginRequest, registerRequest } from "./userRequests";
import { InvalidCredentialsError } from "../errors/userErrors";

const userService: IUserService = new UserService();
export const userRouter = express.Router();

/**
 * GET /user/checkSession
 * Checks if the user is logged in.
 * 
 * Responses:
 * - 200: Successfully checked if the user is logged in, with the username if logged in.
 */
userRouter.get("/checkSession", (req, res) => {
  if (req.session.username) {
    res
      .status(200)
      .json({ isAuthenticated: true, username: req.session.username });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

/**
 * POST /user
 * Registers a new user.
 * 
 * Request Body:
 * - username (string): The username of the new user.
 * - password (string): The password of the new user.
 * 
 * Responses:
 * - 201: Successfully created a new user.
 * - 404: The credentials are invalid.
 * - 409: The username is already in use.
 * - 500: Internal server error. Failed to create a new user.
 */
userRouter.post(
  "/",
  validateUserCredentials,
  async (req: registerRequest, res: Response, next: NextFunction) => {
    try {
      const { username: username, password } = req.body;
      await userService.addUser(username, password);
      res.status(201).send({ message: "User successfully created" });
    } catch (e: any) {
      next(e);
    }
  }
);

/**
 * POST /user/login
 * Logs in a user.
 * 
 * Request Body:
 * - username (string): The username of the user.
 * - password (string): The password of the user.
 * 
 * Responses:
 * - 200: Successfully logged in.
 * - 401: The credentials are invalid.
 * - 500: Internal server error. Failed to log in.
 */
userRouter.post(
  "/login",
  validateUserCredentials,
  async (req: loginRequest, res: Response, next: NextFunction) => {
    try {
      const { username: username, password } = req.body;
      if (!(await userService.find(username, password))) {
        next(new InvalidCredentialsError());
        return;
      }
      if (req.session.username && req.session.username === username) {
        req.session.destroy((err: any) => {
          //asynchronous
          if (err) {
            next(err);
          }
          req.session.regenerate((err: any) => {
            //asynchronous
            if (err) {
              next(err);
            }
            req.session.username = username;
            res.status(200).send({ message: "User successfully logged in" });
            return;
          });
        });
      }
      req.session.username = username;
      res.status(200).send({ message: "User successfully logged in" });
      return;
    } catch (e: any) {
      next(e);
    }
  }
);

/**
 * DELETE /user
 * Deletes a user.
 * 
 * Responses:
 * - 200: User successfully deleted.
 * - 401: User not logged in.
 * - 404: The requested user could not be found.
 * - 500: Internal server error. Failed to delete the user.
 */
userRouter.delete(
  "/delete",
  ensureAuthenticated,
  async (req: deleteRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.session.username) {
        next(new InvalidCredentialsError());
        return;
      }
      await userService.removeUser(req.session.username);
      req.session.destroy((err: any) => {
        if (err) {
          next(err);
        }
        res.status(200).send({ message: "User successfully deleted" });
        return;
      });
    } catch (e: any) {
      next(e);
    }
  }
);


/**
 * PATCH /user
 * Updates a user.
 * 
 * Responses:
 * - 501: Changing your credentials is not available yet.
 */
userRouter.patch('/', (req, res) => {
  res.status(501).send({ message: "Changing your credentials is not available yet" });
});

/**
 * POST /user/logout
 * Logs out a user.
 * 
 * Responses:
 * - 501: Logout is not available yet.
 */
userRouter.post('/logout', (req, res) => {
  res.status(501).send({ message: "Logout is not available yet" });
});


// Centralized error handling middleware
// Should be placed after all other middleware and routes
userRouter.use(
  (err: Error, req: Request, res: Response, _next: NextFunction) => {
    // Determine the type of error and set response status and message accordingly
    const { status, message } = determineUserErrorResponse(err);
    res.status(status).send({ error: message });
  }
);

