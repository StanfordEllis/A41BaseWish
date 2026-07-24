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
        <meta
          name="talentapp:project_verification"
          content="ba0d093629efef644be4bdf8b8c44b81239a3edabebf7e96712c029a21ae33fc127cd6e7b80176d13d008a56dc5907c73f737c4cbc4d83792a219ecbdda872fb"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
