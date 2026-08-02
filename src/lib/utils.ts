import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format Rupiah (Rp)
export function formatRupiah(amount: number | string | { toString(): string }): string {
  const numericAmount = typeof amount === "number" ? amount : parseFloat(amount.toString());
  if (isNaN(numericAmount)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

// Format Tanggal Bahasa Indonesia
export function formatTanggal(date: Date | string | number, formatStr: string = "dd MMMM yyyy"): string {
  try {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    return format(d, formatStr, { locale: id });
  } catch {
    return "-";
  }
}

// Format File Size Bytes -> KB/MB
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
