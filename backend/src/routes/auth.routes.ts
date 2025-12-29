import express from "express";
// Controllers
import { register, login } from "../controllers/auth.controller.js";

// Middlewares
import validateSchema from "../middlewares/validateSchema.js";

// Validation Schemas
import {
  registerSchema,
  loginSchema,
} from "../utils/validation/authValidation.js";

const router = express.Router();

router.route("/register").post(validateSchema(registerSchema), register);
router.route("/login").post(validateSchema(loginSchema), login);

export default router;
