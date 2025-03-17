// src/server.ts
import { Hono } from "hono";
import "dotenv/config";
import { z } from "zod";
import { Resend } from "resend";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { ratelimit } from "./middlewares/rateLimiter.js";
import { createMessage, getMessages } from "./handlers/messages.js";

const app = new Hono({
  strict: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

// CORS Middleware
app.use(
  "/api/*",
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    allowMethods: ["POST", "GET"],
  }),
  async (c, next) => {
    const secret = c.req.header("X-Api-Secret");
    if (secret !== process.env.API_SECRET) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
  }
);

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

// Main route
app.post(
  "/api/messages",
  ratelimit({ limit: 5, timeframe: "1h" }),
  zValidator("json", contactSchema, (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error }, 400);
    }
  }),
  async (c) => {
    try {
      const data = await c.req.json();
      await createMessage(data);
      return c.json({ success: true }, 200);
    } catch (error) {
      return c.json({ error: "Server error" }, 500);
    }
  }
);

// Admin route (optional)
app.get("/api/messages", async (c) => {
  try {
    const messages = await getMessages();
    return c.json(messages, 200);
  } catch (error) {
    return c.json({ error: "Access denied" }, 403);
  }
});

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
