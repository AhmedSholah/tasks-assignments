import bcryptjs from "bcryptjs";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { prisma } from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import generateJWT from "../utils/generateJWT.js";
import type { NextFunction, Request, Response } from "express";

const register = asyncWrapper(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;

  const oldUser = await prisma.user.findUnique({ where: { email } });

  if (oldUser) {
    return next(
      AppError.create("User Already Exists", 409, httpStatusText.FAIL)
    );
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const tokenPayload = {
    userId: newUser.id,
  };

  const token = await generateJWT(tokenPayload);

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { token, user: { name: name, email: email } },
  });
});

const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const foundUser = await prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      return next(
        AppError.create("Invalid Credentials", 404, httpStatusText.FAIL)
      );
    }

    const isCorretPassword = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!isCorretPassword) {
      return next(
        AppError.create("Invalid Credentials", 501, httpStatusText.FAIL)
      );
    }

    const tokenPayload = {
      userId: foundUser.id,
    };

    const token = await generateJWT(tokenPayload);

    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { token, user: { name: foundUser.name, email: foundUser.email } },
    });
  }
);

export { register, login };
