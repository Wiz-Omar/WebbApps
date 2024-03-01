import express from "express";
import { imageRouter } from "./router/imageRouter";
import cors from "cors";
import { likeRouter } from "./router/likeRouter";
import path from "path";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/image", imageRouter);
app.use("/like", likeRouter);

console.log(path.join(__dirname, 'public'));

//app.use(express.static('public'))
app.use('/', express.static(path.join(__dirname, '../public')))
