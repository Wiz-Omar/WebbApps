import express from "express";
import { imageRouter } from "./router/imageRouter";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/image", imageRouter);

