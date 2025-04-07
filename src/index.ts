import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { securityHeaders } from "./shared/middleware/security.js";
import { db } from "./core/config/firebase.js";
import { ratelimit } from "./shared/middleware/rateLimiter.js";
import { MessageService } from "./features/messages/message.service.js";
import { EmailService } from "./features/emails/email.service.js";
import { MessageController } from "./features/messages/message.controller.js";
import { EmailController } from "./features/emails/email.controller.js";
import { env } from "./core/config/env.js";
import { prometheus } from "@hono/prometheus";
import { collectDefaultMetrics } from "prom-client";
import { metricsMiddleware } from "./shared/middleware/metrics.middleware.js";

// Configure default metrics collection
collectDefaultMetrics();

export const app = new Hono({
  strict: false,
});

// Register Prometheus middleware
const { printMetrics, registerMetrics } = prometheus();
app.use("*", registerMetrics);
app.get("/metrics", printMetrics);

// Apply security headers globally
app.use(securityHeaders);

// CORS Middleware
app.use(
  cors({
    origin: env.ALLOWED_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply metrics middleware
app.use("*", metricsMiddleware);

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

// Initialize services
const emailService = new EmailService();
const emailController = new EmailController(emailService);
const messageService = new MessageService(db, emailService);
const messageController = new MessageController(messageService);

// Post Messages
app.post(
  "/messages",
  ratelimit({ limit: 5, timeframe: "1h" }),
  zValidator("json", contactSchema, (result, c) => {
    if (!result.success) {
      console.error(result.error.issues);
      return c.json({ errors: result.error.issues }, 400);
    }
  }),
  (c) => messageController.createMessage(c)
);

// Get Messages
app.get("/messages", (c) => messageController.getMessages(c));

// Email test route
app.post("/test/email", ratelimit({ limit: 5, timeframe: "1h" }), (c) => emailController.testEmail(c));

// Health check route
app.get("/health", (c) => {
  return c.json({ status: "OK" }, 200);
});

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal error" }, 500);
});
