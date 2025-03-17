import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(public statusCode: StatusCode, public message: string, public isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    return c.json({
      status: "error",
      message: err.message,
    });
  }

  // Log unexpected errors
  console.error("Unexpected error:", err);
  return c.json(
    {
      status: "error",
      message: "Internal server error",
    },
    500
  );
};
