import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/context/provider";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/context/Providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Soms",
  description: "SOMS - School management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider>
          <Providers>{children}</Providers>
        </Provider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
