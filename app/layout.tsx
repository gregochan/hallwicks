import type { Metadata } from "next";
import { LenisProvider } from "@/components/animation/lenis-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hallwicks Design Limited | Clinical Interior Architecture",
  description:
    "Hallwicks Design Limited creates precise medical, dental, and veterinary interiors across Hong Kong, China, and Singapore.",
  icons: {
    icon: [
      {
        url: "/images/brand/hallwicks-mark.png",
        type: "image/png",
      },
    ],
    shortcut: "/images/brand/hallwicks-mark.png",
    apple: "/images/brand/hallwicks-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
