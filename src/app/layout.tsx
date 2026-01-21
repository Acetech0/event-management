import type { Metadata } from "next";
import { Inter } from "next/font/google"; // or local font
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Command Center",
  description: "Internal Notion-based Event Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex h-screen bg-background`}
      >
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
