import express from "express";
import { createBook } from "./bookController.ts";


const bookRouter = express.Router();

//routes
bookRouter.post("/", createBook);

export default bookRouter;
