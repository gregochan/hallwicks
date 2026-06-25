import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hallwicks Design Limited | Clinical Interior Architecture",
  description:
    "Hallwicks Design Limited creates precise medical, dental, and veterinary interiors across Hong Kong, Singapore, and China.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
