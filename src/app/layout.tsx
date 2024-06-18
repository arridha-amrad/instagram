import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={cn(inter.className, "bg-background text-skin-base")}>
        <NextTopLoader showSpinner={false} color="#2B38C9" />
        <SessionProvider>
          <ThemeProvider enableColorScheme={false} attribute="class">
            {children}
          </ThemeProvider>
          <ToastContainer position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
