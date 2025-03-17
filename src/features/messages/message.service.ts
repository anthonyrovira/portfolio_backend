import { addDoc, collection, Firestore, getDocs, query } from "firebase/firestore";
import { AppError } from "../../shared/errors/AppError.js";
import type { EmailService } from "./email.service.js";
import type { ContactForm } from "./message.types.js";

interface MessageResponse {
  success: boolean;
  id: string;
}

export class MessageService {
  constructor(private readonly db: Firestore, private readonly emailService: EmailService) {}

  async createMessage(data: ContactForm): Promise<MessageResponse> {
    try {
      const docRef = await this.saveToDatabase(data);
      await this.emailService.sendNotificationEmail(data, docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      throw new AppError(500, "Failed to create message");
    }
  }

  async getMessages() {
    try {
      const q = query(collection(this.db, "messages"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new AppError(403, "Access denied");
    }
  }

  private async saveToDatabase(data: ContactForm) {
    return addDoc(collection(this.db, "messages"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}
