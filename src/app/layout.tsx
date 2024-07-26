import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "./AppProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram",
  description: "Created by Arridha Amrad",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html suppressHydrationWarning lang="en">
      <body className={cn(inter.className, "bg-background text-skin-base")}>
        <NextTopLoader showSpinner={false} color="#2B38C9" />
        <AppProvider session={session}>
          <SessionProvider>
            <ThemeProvider enableColorScheme={false} attribute="class">
              {children}
            </ThemeProvider>
          </SessionProvider>
          <ToastContainer
            pauseOnHover={false}
            hideProgressBar={true}
            position="bottom-right"
          />
        </AppProvider>
      </body>
    </html>
  );
}
