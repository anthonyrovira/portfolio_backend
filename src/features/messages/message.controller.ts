import type { Context } from "hono";
import type { MessageService } from "./message.service.js";
import { messageCreationCounter } from "../../shared/metrics/custom-metrics.js";

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  async createMessage(c: Context) {
    try {
      const data = await c.req.json();
      const result = await this.messageService.createMessage(data);
      messageCreationCounter.inc({ status: "success" });
      return c.json(result, 201);
    } catch (error) {
      messageCreationCounter.inc({ status: "error" });
      throw error;
    }
  }

  async getMessages(c: Context) {
    try {
      const messages = await this.messageService.getMessages();
      return c.json(messages, 200);
    } catch (error) {
      throw error;
    }
  }
}
