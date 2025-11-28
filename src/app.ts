import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middlewares/globalErrorhandler.ts";
import userRouter from "./user/userRouter.ts";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors());
morgan('dev')



//Routes
// http methods

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

//router register
app.use("/api/users", userRouter);

//global error handler
app.use(globalErrorHandler);

export default app;
