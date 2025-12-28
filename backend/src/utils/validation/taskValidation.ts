import { z } from "zod";

const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);

const createTaskSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    // status: taskStatusEnum.optional(),
  })
  .strict();

const updateTaskSchema = z
  .object({
    // title: z.string().min(1).optional(),
    // description: z.string().optional(),
    status: taskStatusEnum,
  })
  .strict();

export { createTaskSchema, updateTaskSchema };
