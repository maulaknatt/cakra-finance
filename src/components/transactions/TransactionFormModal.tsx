"use client";

import { useState, useEffect } from "react";
import { X, Calendar, DollarSign, FileText, Upload, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TransactionType, IncomeCategory, ExpenseCategory } from "@prisma/client";
import { createTransactionAction, updateTransactionAction } from "@/actions/transactionActions";
import { INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS } from "@/constants";
import { formatRupiah, formatFileSize } from "@/lib/utils";
import { TransactionWithRelations } from "@/repositories/transactionRepository";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventsList: { id: string; title: string }[];
  defaultEventId?: string;
  initialData?: TransactionWithRelations | null;
}

export function TransactionFormModal({
  isOpen,
  onClose,
  eventsList,
  defaultEventId,
  initialData,
}: TransactionFormModalProps) {
  const [eventId, setEventId] = useState(defaultEventId || "");
  const [type, setType] = useState<TransactionType>("INCOME");
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>("KAS_ANGGOTA");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("KONSUMSI");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setEventId(initialData.eventId);
        setType(initialData.type);
        setIncomeCategory(initialData.incomeCategory || "KAS_ANGGOTA");
        setExpenseCategory(initialData.expenseCategory || "KONSUMSI");
        setAmount(initialData.amount.toString());
        setDate(new Date(initialData.date).toISOString().split("T")[0]);
        setDescription(initialData.description);
      } else {
        setEventId(defaultEventId || (eventsList.length > 0 ? eventsList[0].id : ""));
        setType("INCOME");
        setIncomeCategory("KAS_ANGGOTA");
        setExpenseCategory("KONSUMSI");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setDescription("");
      }
      setSelectedFile(null);
      setErrorMessage("");
    }
  }, [isOpen, defaultEventId, eventsList, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("type", type);
    if (type === "INCOME") {
      formData.append("incomeCategory", incomeCategory);
    } else {
      formData.append("expenseCategory", expenseCategory);
    }
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("description", description);

    if (selectedFile) {
      formData.append("files", selectedFile);
    }

    const res = isEdit && initialData
      ? await updateTransactionAction(initialData.id, formData)
      : await createTransactionAction(formData);

    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <Card className="w-full max-w-lg border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {isEdit ? "Edit Catatan Transaksi" : "Tambah Transaksi Keuangan"}
          </CardTitle>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="pt-4">
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/60 dark:text-red-300">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilih Event / Kegiatan *
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                required
              >
                <option value="" disabled>
                  -- Pilih Event --
                </option>
                {eventsList.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Selector (Income vs Expense) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Jenis Transaksi *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                    type === "INCOME"
                      ? "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                  }`}
                >
                  📈 Pemasukan (Income)
                </button>
                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                    type === "EXPENSE"
                      ? "border-rose-600 bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                      : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                  }`}
                >
                  📉 Pengeluaran (Expense)
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kategori Transaksi *
              </label>
              {type === "INCOME" ? (
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {Object.entries(INCOME_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nominal (Rp) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                {amount && (
                  <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Preview: {formatRupiah(parseFloat(amount) || 0)}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tanggal *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Keterangan / Rincian Transaksi *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  placeholder="Contoh: Pembelian 50 kotak nasi ayam untuk panitia"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isEdit ? "Ganti Bukti Nota (Opsional)" : "Upload Bukti Nota / Kwitansi (Opsional)"}
              </label>
              <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950/60 hover:bg-slate-100/50 transition-colors">
                <Upload className="h-6 w-6 text-slate-400" />
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Klik untuk unggah foto nota (JPG, PNG, PDF)
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="truncate font-medium">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-500">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Memperbarui..." : "Menyimpan..."}
                  </>
                ) : (
                  isEdit ? "Perbarui Transaksi" : "Simpan Transaksi"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
