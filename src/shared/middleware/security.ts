import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  // Add security headers
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  await next();
};

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  const apiKey = c.req.header("X-Api-Secret");
  if (!apiKey || apiKey !== process.env.API_SECRET) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  await next();
};
