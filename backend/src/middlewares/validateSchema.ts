import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";

export default function validateSchema(schema: any) {
  return (req: any, res: any, next: any) => {
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
