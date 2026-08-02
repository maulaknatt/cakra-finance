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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Transaksi Keuangan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pencatatan pemasukan dan pengeluaran kas organisasi per kegiatan
          </p>
        </div>

        {canEditOrDelete && (
          <Button
            onClick={() => {
              setSelectedTransaction(null);
              setIsFormOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Transaksi Baru
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Pemasukan</span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatRupiah(totalIncome)}
          </p>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Pengeluaran</span>
            <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatRupiah(totalExpense)}
          </p>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saldo Netto</span>
            <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 dark:bg-teal-400/20 dark:text-teal-300">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`mt-3 text-xl font-extrabold ${
              overallBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatRupiah(overallBalance)}
          </p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari transaksi, event, atau inputer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={eventIdFilter}
              onChange={(e) => setEventIdFilter(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
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
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="">Semua Jenis Transaksi</option>
            <option value="INCOME">Pemasukan (Income)</option>
            <option value="EXPENSE">Pengeluaran (Expense)</option>
          </select>
        </div>
      </Card>

      {/* Transactions Data Table */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-slate-500">
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
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {formatTanggal(tx.date, "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {tx.event.title}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={isIncome ? "income" : "expense"}>
                          {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                        {categoryLabel}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="px-4 py-3.5">
                        {tx.attachments.length > 0 ? (
                          <button
                            onClick={() => setSelectedAttachmentUrl(tx.attachments[0].fileUrl)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                          >
                            <Paperclip className="h-3.5 w-3.5" /> Lihat Bukti
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {tx.createdBy.name}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-extrabold whitespace-nowrap ${
                          isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                      </td>
                      {canEditOrDelete && (
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedTransaction(tx);
                                setIsFormOpen(true);
                              }}
                              className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                              title="Edit Transaksi"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(tx.id)}
                              className="h-8 w-8 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="h-4 w-4" />
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
          <div className="relative max-w-2xl w-full rounded-2xl bg-white p-4 dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Bukti Foto Transaksi
              </h3>
              <button
                onClick={() => setSelectedAttachmentUrl(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-center max-h-[70vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedAttachmentUrl}
                alt="Bukti Transaksi"
                className="rounded-xl object-contain max-h-[60vh]"
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
