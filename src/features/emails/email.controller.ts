import type { Context } from "hono";
import type { EmailService } from "./email.service.js";

export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  async testEmail(c: Context) {
    try {
      const result = await this.emailService.testEmailService();
      return c.json(result, result.success ? 200 : 500);
    } catch (error) {
      console.error("Test endpoint error:", error);
      return c.json({ success: false, message: "Internal server error" }, 500);
    }
  }
}
