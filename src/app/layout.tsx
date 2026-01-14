import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from '@/components/providers/SessionProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amaghor Admin - Admin Dashboard",
  description: "Admin dashboard for managing Amaghor tours, hotels, and bookings system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}