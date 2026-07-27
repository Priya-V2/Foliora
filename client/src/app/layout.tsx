import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/redux-provider";
import "@/lib/axiosInterceptor";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Foliora",
  description: "Portfolio Generator Platform",
  // icons: {
  //   icon: "/icon.png",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <ReduxProvider>
        <body className={`min-h-full flex flex-col ${geist.className}`}>
          {children}
        </body>
      </ReduxProvider>
    </html>
  );
}
