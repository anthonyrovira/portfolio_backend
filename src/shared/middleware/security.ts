import { type MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  // Add more security headers
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  c.header("Content-Security-Policy", "default-src 'self'");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  await next();
};

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  try {
    const apiKey = c.req.header("X-Api-Secret");
    // if (!apiKey || !(await verifyApiKey(apiKey))) {
    //   throw new HTTPException(401, { message: "Unauthorized" });
    // }
    await next();
  } catch (error) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
};
