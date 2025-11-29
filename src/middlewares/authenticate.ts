import pkg from "jsonwebtoken"; // Import the entire jsonwebtoken module
const { verify } = pkg; // Destructure the 'verify' function from the imported package

import createHttpError from "http-errors";
import { config } from "../config/config.ts";
import type { NextFunction, Request, Response } from "express";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authentication token missing"));
  }

  const parsedToken = token.split(" ")[1];

  if (!parsedToken) {
    return next(createHttpError(401, "Invalid token format"));
  }

  try {
    const decoded = verify(parsedToken, config.jwtSecret as string);

    const _req = req as AuthRequest;
    _req.userId = (decoded as any).sub;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export default authenticate;
