import express, { Request, Response } from "express";
import { IUserService } from "../service/userService.interface";
import { UserService } from "../service/userService";
import { User } from "../model/user";
import { Session } from "express-session";

const userService: IUserService = new UserService();

export const userRouter = express.Router();

export interface sessionData{
    userId: string
}
interface registerRequest extends Request{
    body: {userId: string, password: string}
}
interface loginRequest extends Request{
    params: {},
    session: Session & Partial<sessionData>,
    body: {userId: string, password: string}
}

userRouter.post(
  "/",
  async (
    req: registerRequest,
    res: Response
  ) => {
    try {
      const {userId, password} = req.body;
      if (typeof userId !== "string" || typeof password !== "string" 
            || userId === "" || password === "" || password.length < 8) {

        res.status(400).send("Invalid input data for userId or password");
        return;
      }
      await userService.addUser(userId, password);
      res.status(201).send({ message: "User successfully created" });
    } catch (e: any) {
        if (e.name === "UserExistsError") {
            res.status(409).send(e.message);
        }else{
            res.status(500).send(e.message); //something else went wrong
        }
    }
  }
);

userRouter.post(
    "/login",
    async (
      req: loginRequest,
      res: Response
    ) => {
      try {
        const {userId, password} = req.body;
        if (typeof userId !== "string" || typeof password !== "string" 
            || userId === "" || password === "" || password.length < 8) {

          res.status(400).send("Invalid input data for userId or password");
          return;
        }
        if (! (await userService.find(userId, password))){
            res.status(401).send("Invalid username or password");
            return;
        }
        if (req.session.userId && req.session.userId === userId){
            req.session.destroy((err: any) => { //asynchronous
                if (err){
                    res.status(500).send("Error logging out");
                    return;
                }
                req.session.regenerate((err: any) => { //asynchronous
                    if (err){
                        res.status(500).send("Error creating a new session");
                        return;
                    }
                    req.session.userId = userId;
                    res.status(200).send({ message:"User successfully logged in"});
                    return;
                });
            });
        }
        req.session.userId = userId;
        res.status(200).send({ message:"User successfully logged in"});
        //TODO: do we need to save the session here?
        return;

      } catch (e: any) {
        res.status(500).send(e.message);
      }
    }
);