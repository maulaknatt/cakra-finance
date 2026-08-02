import { IncomeCategory, ExpenseCategory, Role, EventStatus } from "@prisma/client";

export const APP_CONFIG = {
  name: "Cakra Finance",
  organization: "Organisasi Kepemudaan Cakra",
  description: "Sistem Laporan & Manajemen Keuangan Organisasi Kepemudaan",
  version: "1.0.0",
};

export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  KAS_ANGGOTA: "Kas Anggota",
  DONASI: "Donasi",
  SPONSOR: "Sponsor",
  PENJUALAN: "Penjualan",
  IURAN: "Iuran",
  LAINNYA: "Lainnya",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  KONSUMSI: "Konsumsi",
  PERALATAN: "Peralatan",
  TRANSPORTASI: "Transportasi",
  HADIAH: "Hadiah",
  SEWA: "Sewa",
  ATK: "ATK (Alat Tulis Kantor)",
  DEKORASI: "Dekorasi",
  LAINNYA: "Lainnya",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  BENDAHARA: "Bendahara",
  KETUA: "Ketua (Read Only)",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  ONGOING: { label: "Berjalan", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "outline" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
};
