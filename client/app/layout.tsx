import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import getSession from "@/lib/utils";
import RootProviders from "@/components/shared/RootProviders";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogLy | Modern Blogging Website",
  description: "A modern blogging website built with MENN stack.",
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session} refetchInterval={60 * 30}>
          <RootProviders>
            {children}
          </RootProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
