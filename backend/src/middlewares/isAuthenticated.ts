import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import jwt from "jsonwebtoken";

export default function isAuthenticated(
  req: any,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const tokenPayload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
      req.tokenPayload = tokenPayload;
      return next();
    } catch (err) {
      return next(AppError.create("Unauthorized", 401, httpStatusText.ERROR));
    }
  } else {
    return next(AppError.create("Unauthorized", 401, httpStatusText.ERROR));
  }
}
