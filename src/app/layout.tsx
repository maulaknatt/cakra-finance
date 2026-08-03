import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cakra Finance - Laporan Keuangan Organisasi Kepemudaan",
  description: "Sistem Manajemen & Laporan Keuangan Transparan Organisasi Kepemudaan",
  icons: {
    icon: [
      { url: "/logo-cakra.jpg" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logo-cakra.jpg",
    apple: "/logo-cakra.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" storageKey="cakra-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
