import express from "express";
import { imageRouter } from "./router/imageRouter";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use("/image", imageRouter);
app.use(cors());
