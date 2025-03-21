import { Resend } from "resend";
import type { ContactForm } from "../messages/message.types.js";
import { MessageNotification } from "./templates/MessageNotification.js";
import { env } from "../../core/config/env.js";
import { renderToString } from "react-dom/server";

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendNotificationEmail(data: ContactForm, messageId: string) {
    const html = renderToString(MessageNotification({ data, messageId }));

    await this.resend.emails.send({
      from: `Portfolio Contact <${env.RESEND_FROM_EMAIL}>`,
      to: "anthonyrov@gmail.com",
      subject: `New message from ${data.name} [${messageId}]`,
      html,
    });
  }

  async testEmailService(): Promise<{ success: boolean; message: string }> {
    try {
      const testData: ContactForm = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test email from the test endpoint.",
      };

      await this.sendNotificationEmail(testData, "test-" + Date.now());
      return { success: true, message: "Test email sent successfully" };
    } catch (error) {
      console.error("Test email error:", error);
      return { success: false, message: "Failed to send test email" };
    }
  }
}
