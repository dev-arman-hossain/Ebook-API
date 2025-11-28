import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { config } from "../config/config.ts";
import type { User } from "./userTypes.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //Database call

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "error while getting user from db"));
  }

  //password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "error while creating user in db"));
  }

  //Token generation JWT

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    //response
    res.json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "error while signing the jwt token"));
  }
};

export { createUser };
