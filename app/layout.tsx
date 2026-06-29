import type { Metadata } from "next";
import { LenisProvider } from "@/components/animation/lenis-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hallwicks.com";
const siteDescription =
  "Hallwicks Design Limited is a Hong Kong clinical interior design studio for medical centres, dental clinics, day procedure centres, laboratories, and veterinary hospitals across Hong Kong, China, and Singapore.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hallwicks Design Limited | Clinical Interior Architecture",
    template: "%s | Hallwicks Design Limited",
  },
  description: siteDescription,
  keywords: [
    "Hallwicks",
    "Hallwicks Design Limited",
    "medical interior design Hong Kong",
    "dental clinic design Hong Kong",
    "clinical interior architecture",
    "healthcare interior design",
    "veterinary hospital design",
    "day procedure centre design",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "zh-Hant": "/?lang=zh",
    },
  },
  openGraph: {
    title: "Hallwicks Design Limited | Clinical Interior Architecture",
    description: siteDescription,
    url: "/",
    siteName: "Hallwicks Design Limited",
    images: [
      {
        url: "/images/projects/great-people-shanghai-02.png",
        width: 1200,
        height: 800,
        alt: "Hallwicks clinical interior project",
      },
    ],
    locale: "en_HK",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Hallwicks Design Limited | Clinical Interior Architecture",
    description: siteDescription,
    images: ["/images/projects/great-people-shanghai-02.png"],
  },
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
