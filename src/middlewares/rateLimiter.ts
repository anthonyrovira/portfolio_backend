import { Ratelimit } from "@upstash/ratelimit";
import type { Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type MiddlewareHandler } from "hono";

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
    const { success } = await limiter.limit(ip);

    if (!success) {
      return c.json({ error: "Too many requests" }, 429);
    }

    await next();
  };
};
