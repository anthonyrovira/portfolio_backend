import React from "react";
import { EmailLayout } from "./components/EmailLayout.js";
import { EmailHeader } from "./components/EmailHeader.js";
import type { ContactForm } from "../../messages/message.types.js";

interface MessageNotificationProps {
  data: ContactForm;
  messageId: string;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({ data, messageId }) => {
  return (
    <EmailLayout>
      <EmailHeader title={`New message from ${data.name} [${messageId}]`} />
      <div>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <p>{data.message}</p>
        </div>
      </div>
    </EmailLayout>
  );
};
