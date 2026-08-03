"use client";

import { useState } from "react";
import { Plus, Search, Filter, Trash2, Edit2, Paperclip, TrendingUp, TrendingDown, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { TransactionWithRelations } from "@/repositories/transactionRepository";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS } from "@/constants";
import { deleteTransactionAction } from "@/actions/transactionActions";
import { Role } from "@prisma/client";

interface TransactionListClientProps {
  transactions: TransactionWithRelations[];
  eventsList: { id: string; title: string }[];
  userRole: Role;
  initialSearch: string;
  initialType: string;
  initialEventId: string;
}

export function TransactionListClient({
  transactions,
  eventsList,
  userRole,
  initialSearch,
  initialType,
  initialEventId,
}: TransactionListClientProps) {
  const [search, setSearch] = useState(initialSearch);
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [eventIdFilter, setEventIdFilter] = useState(initialEventId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRelations | null>(null);
  const [selectedAttachmentUrl, setSelectedAttachmentUrl] = useState<string | null>(null);

  const canEditOrDelete = userRole === "ADMIN" || userRole === "BENDAHARA";

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.event.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.createdBy.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter ? tx.type === typeFilter : true;
    const matchEvent = eventIdFilter ? tx.eventId === eventIdFilter : true;
    return matchSearch && matchType && matchEvent;
  });

  // Calculate summary metrics
  let totalIncome = 0;
  let totalExpense = 0;

  filteredTransactions.forEach((tx) => {
    const val = Number(tx.amount);
    if (tx.type === "INCOME") {
      totalIncome += val;
    } else {
      totalExpense += val;
    }
  });

  const overallBalance = totalIncome - totalExpense;

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan transaksi ini?")) {
      await deleteTransactionAction(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Transaksi Keuangan 💰
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-400">
            Pencatatan pemasukan dan pengeluaran kas organisasi per kegiatan
          </p>
        </div>

        {canEditOrDelete && (
          <Button
            onClick={() => {
              setSelectedTransaction(null);
              setIsFormOpen(true);
            }}
            variant="cyan"
            size="default"
            className="font-extrabold text-xs gap-2"
          >
            <Plus className="h-4 w-4" />
            Catat Transaksi Baru
          </Button>
        )}
      </div>

      {/* Cartoon Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="cartoon-card p-4 bg-cyan-100 dark:bg-slate-900 border-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Total Pemasukan</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-[2px] border-slate-900 bg-cyan-400 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
            {formatRupiah(totalIncome)}
          </p>
        </Card>

        <Card className="cartoon-card p-4 bg-rose-100 dark:bg-slate-900 border-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Total Pengeluaran</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-[2px] border-slate-900 bg-rose-400 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">
            {formatRupiah(totalExpense)}
          </p>
        </Card>

        <Card className="cartoon-card p-4 bg-amber-100 dark:bg-slate-900 border-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Saldo Netto</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-[2px] border-slate-900 bg-amber-400 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`mt-2 text-xl font-black ${
              overallBalance >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
            }`}
          >
            {formatRupiah(overallBalance)}
          </p>
        </Card>
      </div>

      {/* Cartoon Filter Bar */}
      <Card className="cartoon-card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder="Cari transaksi, event, atau inputer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={eventIdFilter}
              onChange={(e) => setEventIdFilter(e.target.value)}
              className="h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3.5 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
            >
              <option value="">Semua Event</option>
              {eventsList.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3.5 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
          >
            <option value="">Semua Jenis Transaksi</option>
            <option value="INCOME">Pemasukan (Income)</option>
            <option value="EXPENSE">Pengeluaran (Expense)</option>
          </select>
        </div>
      </Card>

      {/* Transactions Data Table */}
      <Card className="cartoon-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-extrabold">
            <thead className="bg-amber-300 text-slate-950 dark:bg-slate-950 dark:text-white border-b-[2.5px] border-slate-900 dark:border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Event</th>
                <th className="px-4 py-3.5">Jenis</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Keterangan</th>
                <th className="px-4 py-3.5">Bukti</th>
                <th className="px-4 py-3.5">Input Oleh</th>
                <th className="px-4 py-3.5 text-right">Nominal</th>
                {canEditOrDelete && <th className="px-4 py-3.5 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y-[2px] divide-slate-900 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs font-bold text-slate-500">
                    Tidak ada catatan transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === "INCOME";
                  const categoryLabel = isIncome
                    ? tx.incomeCategory
                      ? INCOME_CATEGORY_LABELS[tx.incomeCategory]
                      : "-"
                    : tx.expenseCategory
                    ? EXPENSE_CATEGORY_LABELS[tx.expenseCategory]
                    : "-";

                  return (
                    <tr key={tx.id} className="hover:bg-amber-100/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3.5 font-black text-slate-950 dark:text-white whitespace-nowrap">
                        {formatTanggal(tx.date, "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                        {tx.event.title}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={isIncome ? "income" : "expense"}>
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200">
                        {categoryLabel}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="px-4 py-3.5">
                        {tx.attachments.length > 0 ? (
                          <button
                            onClick={() => setSelectedAttachmentUrl(tx.attachments[0].fileUrl)}
                            className="inline-flex items-center gap-1 rounded-lg border-[1.5px] border-slate-900 bg-emerald-300 px-2 py-0.5 text-[11px] font-black text-slate-950 shadow-[1.5px_1.5px_0px_0px_#0f172a] hover:bg-emerald-200 transition-all"
                          >
                            <Paperclip className="h-3 w-3" /> Bukti ({tx.attachments.length})
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                        {tx.createdBy.name}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-black whitespace-nowrap ${
                          isIncome
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                      </td>
                      {canEditOrDelete && (
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="yellow"
                              size="icon"
                              onClick={() => {
                                setSelectedTransaction(tx);
                                setIsFormOpen(true);
                              }}
                              className="h-8 w-8"
                              title="Edit Transaksi"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(tx.id)}
                              className="h-8 w-8"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Attachment Preview Modal */}
      {selectedAttachmentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full rounded-2xl border-[3px] border-slate-900 bg-white p-4 dark:border-slate-100 dark:bg-slate-900 shadow-[6px_6px_0px_0px_#0f172a]">
            <div className="flex items-center justify-between border-b-[2px] border-slate-900 dark:border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white">
                📷 Bukti Foto Transaksi
              </h3>
              <button
                onClick={() => setSelectedAttachmentUrl(null)}
                className="rounded-xl border-[2px] border-slate-900 p-1 text-slate-900 hover:bg-rose-200 dark:text-white dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-center max-h-[70vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedAttachmentUrl}
                alt="Bukti Transaksi"
                className="rounded-xl border-[2px] border-slate-900 object-contain max-h-[60vh] shadow-[4px_4px_0px_0px_#0f172a]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal Form (Create & Edit) */}
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        eventsList={eventsList}
        initialData={selectedTransaction}
      />
    </div>
  );
}
