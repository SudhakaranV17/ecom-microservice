import type { NextFunction, Request, Response } from "express";
import logger from "./Logger";

export const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error({ err });
  const statusCode = res.statusCode != 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
};
