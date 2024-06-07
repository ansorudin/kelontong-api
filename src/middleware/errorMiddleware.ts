import { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
}

export function errorMiddleware(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ status, message });
}
