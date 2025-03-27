import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const envSchema = z.object({
  API_SECRET: z.string().min(32).optional(),

  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_MESSAGING_SENDER_ID: z.string(),
  FIREBASE_APP_ID: z.string(),
  FIREBASE_MEASUREMENT_ID: z.string(),

  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string().email(),

  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),

  ALLOWED_ORIGIN: z
    .string()
    .default("http://localhost:5173")
    .transform((str) => str.split(","))
    .pipe(z.array(z.string().url())),
});

export const env = envSchema.parse(process.env);
