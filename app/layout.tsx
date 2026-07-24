import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaseWish",
  description: "Write wishes. Share support on Base."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a62e7539d7d9c8ac32b3243" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
