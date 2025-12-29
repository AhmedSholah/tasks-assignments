import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import type { z } from "zod";

export default function validateSchema(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        AppError.create("Invalid request body", 400, httpStatusText.FAIL)
      );
    }

    req.body = result.data;

    next();
  };
}
