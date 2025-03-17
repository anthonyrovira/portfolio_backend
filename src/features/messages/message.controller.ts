import type { Context } from "hono";
import type { MessageService } from "./message.service.js";

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  async createMessage(c: Context) {
    try {
      const data = await c.req.json();
      const result = await this.messageService.createMessage(data);
      return c.json(result, 201);
    } catch (error) {
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
