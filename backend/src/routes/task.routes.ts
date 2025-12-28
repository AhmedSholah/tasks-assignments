import express from "express";
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../utils/validation/taskValidation.js";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, validateSchema(createTaskSchema), createTask)
  .get(isAuthenticated, listTasks);

router
  .route("/:id")
  .put(isAuthenticated, validateSchema(updateTaskSchema), updateTask)
  .delete(isAuthenticated, deleteTask);

export default router;
