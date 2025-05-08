import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
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


export const viewport: Viewport = {
  themeColor: 'black',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "BlogLy | Modern Blogging Website",
  description: "A modern blogging website built with MERN stack, offering a seamless experience for readers and writers.",
  keywords: ["blogging", "modern blogs", "MERN stack", "BlogLy", "write blogs", "read blogs"],
  openGraph: {
    title: "BlogLy | Modern Blogging Website",
    description: "A modern blogging website built with MERN stack, offering a seamless experience for readers and writers.",
    url: "https://blogly.vercel.app",
    images: [
      {
        url: "https://blogly.vercel.app/public/assets/images/logo-dark.png",
        width: 1200,
        height: 630,
        alt: "BlogLy Open Graph Image",
      },
    ],
    type: "website",
    siteName: "BlogLy",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogLy | Modern Blogging Website",
    description: "A modern blogging website built with MERN stack, offering a seamless experience for readers and writers.",
    // images: "https://blogly.vercel.app/assets/icons/twitter-card.png",
  },
  robots: "index, follow",
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  return (
    <html lang="en" >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session} refetchInterval={3600}> {/* 1 hour */}
          <RootProviders>
            {children}
          </RootProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
