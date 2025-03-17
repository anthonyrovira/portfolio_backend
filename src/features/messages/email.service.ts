import { Resend } from "resend";
import { env } from "../../config/env.js";
import type { ContactForm } from "./message.types.js";

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendNotificationEmail(data: ContactForm, messageId: string) {
    await this.resend.emails.send({
      from: `Portfolio Contact <${env.RESEND_FROM_EMAIL}>`,
      to: "anthonyrov@gmail.com",
      subject: `New message from ${data.name} [${messageId}]`,
      html: `
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">New message from:</h2>
            <p><strong>Name:</strong>${data.name}</p>
            <p><strong>Email:</strong>${data.email}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p>${data.message}</p>
            </div>
          </div>
        </body>
      `,
    });
  }
}
