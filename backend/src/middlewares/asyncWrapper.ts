import type { NextFunction, Request, Response } from "express";

export default function asyncWrapper(asyncFn: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFn(req, res, next).catch((err: unknown) => {
      next(err);
    });
  };
}
