import { ClerkProvider } from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo, Tajawal, Sacramento } from "next/font/google";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | تخسيس، علاج طبيعي، حجامة`,
  description: siteConfig.description,
};

interface Props {
  children: ReactNode;
}

declare global {
  interface Window {
    tiktok?: {
      embed?: {
        lib?: {
          render?: () => void;
        };
      };
    };
  }
}

const RootLayout = ({ children }: Props) => (
  <ClerkProvider localization={arSA}>
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${tajawal.variable} ${sacramento.variable} bg-figma-page font-sans text-figma-text antialiased`}
      >
        {children}
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;