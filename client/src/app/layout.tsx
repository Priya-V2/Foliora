import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import AuthProvider from "@/features/auth/components/AuthProvider";
import ReduxProvider from "@/providers/redux-provider";
import "@/lib/axiosInterceptor";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Foliora",
  description: "Portfolio Generator Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <ReduxProvider>
        <AuthProvider>
          <body className={`min-h-full flex flex-col ${geist.className}`}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </body>
        </AuthProvider>
      </ReduxProvider>
    </html>
  );
}
