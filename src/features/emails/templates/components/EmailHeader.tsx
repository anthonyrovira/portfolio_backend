import React from "react";

interface EmailHeaderProps {
  title: string;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ title }) => {
  return (
    <header style={{ marginBottom: "20px" }}>
      <h2 style={{ color: "#6366f1", margin: 0 }}>{title}</h2>
    </header>
  );
};
