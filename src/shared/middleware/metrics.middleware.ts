import type { MiddlewareHandler } from "hono";
import { apiRequestCounter, messageEndpointResponseTime } from "../metrics/custom-metrics.js";

export const metricsMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  try {
    await next();

    const status = c.res?.status || 200;
    apiRequestCounter.inc({ method, path, status });

    // Record response time for message endpoints
    if (path.includes("/messages")) {
      const responseTimeInSeconds = (Date.now() - start) / 1000;
      messageEndpointResponseTime.observe({ method, route: "/messages", status_code: status }, responseTimeInSeconds);
    }
  } catch (error) {
    const status = 500;
    apiRequestCounter.inc({ method, path, status });
    throw error;
  }
};
