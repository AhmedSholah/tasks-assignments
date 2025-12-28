import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
  registerSchema,
  loginSchema,
} from "../utils/validation/authValidation.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(validateSchema(registerSchema), register);
router.route("/login").post(validateSchema(loginSchema), login);

export default router;
