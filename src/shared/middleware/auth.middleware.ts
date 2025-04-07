import type { MiddlewareHandler } from "hono";
import { env } from "../../core/config/env.js";

export const requireInternalSecret: MiddlewareHandler = async (c, next) => {
  const secret = c.req.header("X-Internal-Secret");

  if (!env.API_INTERNAL) {
    console.error("API_INTERNAL is not defined in environment variables.");
    return c.json({ error: "Configuration error" }, 500); // Internal server error
  }

  if (!secret || secret !== env.API_INTERNAL) {
    console.warn("Forbidden attempt to access /messages. Secret provided:", secret ? "***" : "None");
    return c.json({ error: "Forbidden" }, 403);
  }

  // Secret is valid, proceed to the next middleware/handler
  await next();
};
