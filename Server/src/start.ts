import express from "express";
import { imageRouter } from "./router/imageRouter";
import cors from "cors";
import { likeRouter } from "./router/likeRouter";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/image", imageRouter);
app.use("/like", likeRouter);
