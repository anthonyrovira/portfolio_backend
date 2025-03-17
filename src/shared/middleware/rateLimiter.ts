import { Ratelimit } from "@upstash/ratelimit";
import type { Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type MiddlewareHandler } from "hono";
import { AppError } from "../errors/AppError.js";

export const ratelimit = (options: { limit: number; timeframe: Duration }): MiddlewareHandler => {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.limit, options.timeframe),
  });

  return async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "127.0.0.1";
    const identifier = `${ip}:${c.req.path}`; // More granular rate limiting
    const { success, remaining, reset } = await limiter.limit(identifier);

    // Add rate limit headers
    c.header("X-RateLimit-Remaining", remaining.toString());
    c.header("X-RateLimit-Reset", reset.toString());

    if (!success) {
      throw new AppError(429, "Too many requests");
    }

    await next();
  };
};
