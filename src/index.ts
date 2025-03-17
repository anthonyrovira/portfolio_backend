// src/server.ts
import { Hono } from "hono";
import "dotenv/config";
import { z } from "zod";
import { Resend } from "resend";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { securityHeaders } from "./shared/middleware/security.js";
import { db } from "./config/firebase.js";
import { ratelimit } from "./shared/middleware/rateLimiter.js";
import { MessageService } from "./features/messages/message.service.js";
import { EmailService } from "./features/messages/email.service.js";
import { MessageController } from "./features/messages/message.controller.js";
import { env } from "./config/env.js";

const app = new Hono({
  strict: false,
});

// Apply security headers globally
app.use("*", securityHeaders);

// CORS Middleware
app.use(
  "/api/*",
  cors({
    origin: env.ALLOWED_ORIGIN,
    allowMethods: ["POST", "GET"],
  })
  // apiKeyAuth
);

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

// Initialize services
const resend = new Resend(env.RESEND_API_KEY);
const messageService = new MessageService(db, new EmailService());
const messageController = new MessageController(messageService);

// Main route
app.post("/api/messages", ratelimit({ limit: 5, timeframe: "1h" }), zValidator("json", contactSchema), (c) =>
  messageController.createMessage(c)
);

// Admin route (optional)
app.get("/api/messages", (c) => messageController.getMessages(c));

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal error" }, 500);
});

// Static Server (optional)
app.use("/*", serveStatic({ root: "./public" }));

serve(app, (info) => {
  console.log(`Server running on port ${info.port}`);
});
