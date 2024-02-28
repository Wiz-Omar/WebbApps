import express from "express";
import { imageRouter } from "./router/imageRouter";
import cors from "cors";
import { likeRouter } from "./router/likeRouter";
import { userRouter } from "./router/userRouter";
import session from "express-session";


export const app = express();
//export const globablUserId = "defaultUser"; //Is it better to use this globally instead of writing the string "defaultUser" everywhere?

app.use(session({
    secret : "Your secret key", // TODO Move to separate file. DO NOT UPLOAD TO GITHUB!!!!
    resave : false,
    saveUninitialized : false
}));
app.use(cors({
    origin: true,
    credentials : true
}));
app.use(express.json());
app.use("/image", imageRouter);
app.use("/like", likeRouter);
app.use("/user", userRouter);
