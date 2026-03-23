import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { BeforeUnloadHandler } from "@/components/BeforeUnloadHandler";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FraudShield | Financial Crime Intelligence",
  description: "Real-time transaction anomaly and fraud visualization dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
      </head>
      <body className="font-outfit antialiased selection:bg-primary-100 selection:text-primary-900">
        <BeforeUnloadHandler />
        {children}
      </body>
    </html>
  );
}
