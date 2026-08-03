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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs font-sans">
      <Card className="w-full max-w-lg border-[3px] border-slate-900 bg-white p-2 shadow-[6px_6px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b-[2px] border-slate-900 pb-3 dark:border-slate-100 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <CardTitle className="text-lg font-black text-slate-950 dark:text-white">
            {isEdit ? "Edit Catatan Transaksi ✏️" : "Tambah Transaksi Keuangan 💸"}
          </CardTitle>
          <button
            onClick={onClose}
            className="rounded-xl border-[2px] border-slate-900 p-1 text-slate-900 hover:bg-rose-200 dark:text-white dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="pt-4">
          {errorMessage && (
            <div className="mb-4 rounded-xl border-[2px] border-slate-900 bg-rose-200 p-3 text-xs font-black text-rose-950 shadow-[2px_2px_0px_0px_#0f172a]">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Pilih Event / Kegiatan *
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
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
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Jenis Transaksi *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`flex h-11 items-center justify-center rounded-xl border-[2.5px] border-slate-900 text-xs font-black transition-all shadow-[2px_2px_0px_0px_#0f172a] ${
                    type === "INCOME"
                      ? "bg-emerald-400 text-slate-950 shadow-[4px_4px_0px_0px_#0f172a] -translate-x-0.5 -translate-y-0.5"
                      : "bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  }`}
                >
                  📈 Pemasukan (Income)
                </button>
                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`flex h-11 items-center justify-center rounded-xl border-[2.5px] border-slate-900 text-xs font-black transition-all shadow-[2px_2px_0px_0px_#0f172a] ${
                    type === "EXPENSE"
                      ? "bg-rose-400 text-slate-950 shadow-[4px_4px_0px_0px_#0f172a] -translate-x-0.5 -translate-y-0.5"
                      : "bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  }`}
                >
                  📉 Pengeluaran (Expense)
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Kategori Transaksi *
              </label>
              {type === "INCOME" ? (
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value as IncomeCategory)}
                  className="flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
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
                  className="flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
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
                <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                  Nominal (Rp) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {amount && (
                  <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                    Preview: {formatRupiah(parseFloat(amount) || 0)}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                  Tanggal *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Keterangan / Rincian Transaksi *
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                <textarea
                  placeholder="Contoh: Pembelian 50 kotak nasi ayam untuk panitia"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[70px] w-full rounded-xl border-[2.5px] border-slate-900 bg-white pl-10 pr-3.5 py-2 text-xs font-bold text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
                  required
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                {isEdit ? "Ganti Bukti Nota (Opsional)" : "Upload Bukti Nota / Kwitansi (Opsional)"}
              </label>
              <div className="relative flex flex-col items-center justify-center rounded-xl border-[2.5px] border-dashed border-slate-900 bg-amber-50 p-4 text-center dark:border-slate-100 dark:bg-slate-950/60 hover:bg-amber-100 transition-colors shadow-[2px_2px_0px_0px_#0f172a]">
                <Upload className="h-6 w-6 text-slate-950 dark:text-white" />
                <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-300">
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
                <div className="flex items-center justify-between rounded-xl border-[2px] border-slate-900 bg-emerald-200 p-2.5 text-xs font-black text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="h-4 w-4 shrink-0 text-slate-950" />
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-700">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-rose-700 hover:text-rose-900 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t-[2px] border-slate-900 dark:border-slate-100">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} variant="default">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Memperbarui..." : "Menyimpan..."}
                  </>
                ) : (
                  isEdit ? "Perbarui Transaksi 🚀" : "Simpan Transaksi 🚀"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
