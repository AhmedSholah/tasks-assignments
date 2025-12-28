import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
import httpStatusText from "./utils/httpStatusText.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

// Middleware
app.use(express.json());
app.use(cors());
// app.use(cors({ origin: "*" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Not Found
// app.use("*", (req, res, next) => {
//   res.status(404).json({
//     status: httpStatusText.ERROR,
//     message: "Not Found.",
//     data: null,
//   });
// });

// Error Handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.statusCode || 500).json({
      status: err.statusText || httpStatusText.ERROR,
      message: err.message || "Internal Server Error",
      data: null,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default app;
