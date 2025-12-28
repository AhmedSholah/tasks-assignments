import asyncWrapper from "../middlewares/asyncWrapper.js";
import { prisma } from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import type { NextFunction, Request, Response } from "express";

const createTask = asyncWrapper(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description, status } = req.body;
  const userId = (req as any).tokenPayload.userId;

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "PENDING",
      userId,
    },
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { task: newTask },
  });
});

const listTasks = asyncWrapper(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = (req as any).tokenPayload.userId;

  // Get pagination parameters from query
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Validate pagination parameters
  if (page < 1) {
    return next(
      AppError.create("Page must be greater than 0", 400, httpStatusText.FAIL)
    );
  }
  if (limit < 1 || limit > 100) {
    return next(
      AppError.create(
        "Limit must be between 1 and 100",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const totalTasks = await prisma.task.count({
    where: {
      userId,
      deletedAt: null,
    },
  });

  // Get paginated tasks
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });

  const totalPages = Math.ceil(totalTasks / limit);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      tasks,
      pagination: {
        currentPage: page,
        limit,
        totalTasks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

const updateTask = asyncWrapper(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = (req as any).tokenPayload.userId;

  if (!id) {
    return next(
      AppError.create("Task ID is required", 400, httpStatusText.FAIL)
    );
  }

  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id: id,
      userId,
      deletedAt: null,
    },
  });

  if (!existingTask) {
    return next(AppError.create("Task not found", 404, httpStatusText.FAIL));
  }

  const updatedTask = await prisma.task.update({
    where: { id: id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
    },
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { task: updatedTask },
  });
});

const deleteTask = asyncWrapper(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const userId = (req as any).tokenPayload.userId;

  if (!id) {
    return next(
      AppError.create("Task ID is required", 400, httpStatusText.FAIL)
    );
  }

  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id: id,
      userId,
      deletedAt: null,
    },
  });

  if (!existingTask) {
    return next(AppError.create("Task not found", 404, httpStatusText.FAIL));
  }

  // Soft delete
  await prisma.task.update({
    where: { id: id },
    data: {
      deletedAt: new Date(),
    },
  });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Task deleted successfully",
    data: null,
  });
});

export { createTask, listTasks, updateTask, deleteTask };
