import type { FC, ReactNode } from "react";

interface EmailLayoutProps {
  children: ReactNode;
}

export const EmailLayout: FC<EmailLayoutProps> = ({ children }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Portfolio Contact</title>
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", padding: "20px", margin: 0 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>{children}</div>
      </body>
    </html>
  );
};
