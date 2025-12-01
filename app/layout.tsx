import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart School ERP - Management System",
  description:
    "Comprehensive School Management System for modern educational institutions",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Smart School ERP - Management System",
    description:
      "Comprehensive School Management System for modern educational institutions",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Smart School ERP Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Smart School ERP - Management System",
    description:
      "Comprehensive School Management System for modern educational institutions",
    images: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
