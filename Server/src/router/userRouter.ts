import express, { Request, Response } from "express";
import { IUserService } from "../service/userService.interface";
import { UserService } from "../service/userService";
import { User } from "../model/user";
import session, { Session } from "express-session";

const userService: IUserService = new UserService();

export const userRouter = express.Router();

export interface sessionData{
  username: string
}
interface registerRequest extends Request{
    body: {username: string, password: string}
}
interface loginRequest extends Request{
    params: {},
    session: Session & Partial<sessionData>,
    body: {username: string, password: string}
}

userRouter.get("/checkSession", (req, res) => {
  if (req.session.username) {
    res.status(200).json({ isAuthenticated: true, username: req.session.username });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

userRouter.post(
  "/",
  async (
    req: registerRequest,
    res: Response
  ) => {
    try {
      const {username: username, password} = req.body;
      if (typeof username !== "string" || typeof password !== "string" 
            || username === "" || password === "" || password.length < 8) {

        res.status(400).send("Invalid input data for username or password");
        return;
      }
      await userService.addUser(username, password);
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
        const {username: username, password} = req.body;
        if (typeof username !== "string" || typeof password !== "string" 
            || username === "" || password === "" || password.length < 8) {

          res.status(400).send("Invalid input data for username or password");
          return;
        }
        if (! (await userService.find(username, password))){
            res.status(401).send("Invalid username or password");
            return;
        }
        if (req.session.username && req.session.username === username){
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
                    req.session.username = username;
                    res.status(200).send({ message:"User successfully logged in"});
                    return;
                });
            });
        }
        req.session.username = username;
        console.log(session);
        console.log(req.session);
        console.log("Session created with username: " + req.session.username);
        res.status(200).send({ message:"User successfully logged in"});
        //TODO: do we need to save the session here?
        return;

      } catch (e: any) {
        res.status(500).send(e.message);
      }
    }
);