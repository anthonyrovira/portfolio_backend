import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { AppError } from "../../shared/errors/AppError.js";
import type { EmailService } from "../emails/email.service.js";
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
      if (error instanceof FirebaseError) {
        console.error("Firebase error details:", {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
        });

        if (error.code === "permission-denied") {
          throw new AppError(403, "Access denied");
        }
      }

      throw new AppError(500, "Failed to create message");
    }
  }

  async getMessages() {
    try {
      const messagesRef = collection(this.db, "messages");

      const querySnapshot = await getDocs(messagesRef);

      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase error details:", {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
        });

        if (error.code === "permission-denied") {
          throw new AppError(403, "Access denied");
        }
      }

      throw new AppError(500, "Failed to fetch messages");
    }
  }

  private async saveToDatabase(data: ContactForm) {
    if (!data.name || !data.email || !data.message) {
      throw new Error("Invalid email data");
    }

    return addDoc(collection(this.db, "messages"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}
