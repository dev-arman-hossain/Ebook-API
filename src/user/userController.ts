import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //Validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  //Database call
  const user = await userModel.findOne({email});

    if (user) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }
    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    





  //process
  //response
  res.json({ message: "User created successfully" });
};

export { createUser };
