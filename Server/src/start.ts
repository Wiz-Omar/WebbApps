import express from "express";
import { imageRouter } from "./router/imageRouter"; // Assuming you have an imageRouter

export const app = express();

app.use(express.json()); // Middleware for parsing JSON bodies
app.use("/", imageRouter); // Use imageRouter for all requests to '/image'
