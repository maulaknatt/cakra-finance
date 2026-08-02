import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cakra Finance - Laporan Keuangan Organisasi Kepemudaan",
  description: "Sistem Manajemen & Laporan Keuangan Transparan Organisasi Kepemudaan",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="cakra-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
