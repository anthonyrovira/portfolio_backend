import { z } from "zod";

export interface ContactForm {
  /**
   * Name
   * @minLength 2
   */
  name: string;
  /**
   * Email
   * @format email
   */
  email: string;
  /**
   * Message
   * @minLength 10
   */
  message: string;
  /** Createdat */
  createdAt?: string | null;
}

export const contactSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name is too long")
      .regex(/^[a-zA-Z\s]*$/, "Name must contain only letters"),
    email: z.string().email("Invalid email address").toLowerCase(),
    message: z.string().min(10, "Message must be at least 10 characters long").max(1000, "Message is too long").trim(),
  })
  .strict();
