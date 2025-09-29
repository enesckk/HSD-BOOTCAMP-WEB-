import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/utils/constants";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: ["afet yönetimi", "teknoloji", "maraton", "huawei", "habitat", "gaziantep"],
  authors: [{ name: "Huawei Türkiye & Habitat Derneği" }],
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      return (
      <html lang="tr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
        >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
