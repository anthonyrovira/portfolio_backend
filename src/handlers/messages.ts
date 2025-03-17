import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** ContactMessage */
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

export const createMessage = async (data: ContactForm) => {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...data,
      createdAt: new Date().toISOString(),
    });

    await resend.emails.send({
      from: `Portfolio Contact <${process.env.RESEND_FROM_EMAIL}>`,
      to: "anthonyrov@gmail.com",
      subject: `Nouveau message de ${data.name} [${docRef.id}]`,
      html: `
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Nouveau message de:</h2>
            <p><strong>Nom :</strong>${data.name}</p>
            <p><strong>Email :</strong>${data.email}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
              <p>${data.message}</p>
            </div>
          </div>
        </body>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Firebase error:", error);
    throw new Error("Database error");
  }
};

export const getMessages = async () => {
  try {
    const q = query(collection(db, "messages"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase error:", error);
    throw new Error("Access denied");
  }
};
