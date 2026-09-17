import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import MobileNav from "@/components/mobile-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SatFinder - Satellite Tracking",
  description: "Track and explore satellites in real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex overflow-hidden">
        <ThemeProvider>
          <Sidebar />
          <div className="flex-1 ml-0 lg:ml-64 flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-hidden pb-16 lg:pb-0">{children}</main>
          </div>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
