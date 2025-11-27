import express, { type NextFunction, type Request, type Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorhandler.ts";

const app = express();

//Routes
// http methods

app.get("/", (req, res, next) => {

  res.json({ message: "Welcome to elib apis" });
});

app.use(globalErrorHandler)

export default app;
