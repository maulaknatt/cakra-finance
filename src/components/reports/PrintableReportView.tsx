"use client";

import { TransactionWithRelations } from "@/repositories/transactionRepository";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS, APP_CONFIG } from "@/constants";

interface PrintableReportViewProps {
  transactions: TransactionWithRelations[];
  eventName: string;
  periodText: string;
}

export function PrintableReportView({
  transactions,
  eventName,
  periodText,
}: PrintableReportViewProps) {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount);
    if (tx.type === "INCOME") totalIncome += amt;
    else totalExpense += amt;
  });

  const finalBalance = totalIncome - totalExpense;

  return (
    <div className="printable-document font-sans text-slate-900 bg-white p-8 max-w-4xl mx-auto shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
      {/* Official Corporate Header */}
      <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white font-extrabold text-2xl shadow-md">
            CF
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-emerald-800 uppercase">
              {APP_CONFIG.organization}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Sistem Informasi Laporan Keuangan Organisasi Kepemudaan (Cakra Finance)
            </p>
            <p className="text-[11px] text-slate-500 italic mt-0.5">
              Alamat Sekretariat: Jl. Kepemudaan No. 1, Jakarta Selatan • Email: kontak@cakrafinance.org
            </p>
          </div>
        </div>
      </div>

      {/* Document Title Banner */}
      <div className="text-center my-6 space-y-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-wide uppercase underline">
          LAPORAN PERTANGGUNGJAWABAN KEUANGAN
        </h2>
        <p className="text-sm font-semibold text-emerald-700">
          EVENT: {eventName.toUpperCase()}
        </p>
        <p className="text-xs text-slate-500">
          Periode / Rentang Tanggal: {periodText}
        </p>
      </div>

      {/* Transactions Data Table */}
      <table className="w-full text-left border-collapse text-xs mb-6">
        <thead>
          <tr className="bg-emerald-700 text-white font-bold">
            <th className="border border-emerald-700 px-3 py-2 text-center w-10">No</th>
            <th className="border border-emerald-700 px-3 py-2 text-center w-24">Tanggal</th>
            <th className="border border-emerald-700 px-3 py-2 w-32">Jenis</th>
            <th className="border border-emerald-700 px-3 py-2 w-32">Kategori</th>
            <th className="border border-emerald-700 px-3 py-2">Keterangan / Rincian</th>
            <th className="border border-emerald-700 px-3 py-2 text-right w-32">Nominal (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="border p-4 text-center text-slate-500 italic">
                Tidak ada data transaksi untuk kriteria laporan ini.
              </td>
            </tr>
          ) : (
            transactions.map((tx, idx) => {
              const isIncome = tx.type === "INCOME";
              const categoryLabel = isIncome
                ? tx.incomeCategory
                  ? INCOME_CATEGORY_LABELS[tx.incomeCategory]
                  : "-"
                : tx.expenseCategory
                ? EXPENSE_CATEGORY_LABELS[tx.expenseCategory]
                : "-";

              return (
                <tr key={tx.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                  <td className="border px-3 py-2 text-center font-medium">{idx + 1}</td>
                  <td className="border px-3 py-2 text-center whitespace-nowrap">
                    {formatTanggal(tx.date, "dd/MM/yyyy")}
                  </td>
                  <td className="border px-3 py-2 font-semibold">
                    {isIncome ? "Pemasukan" : "Pengeluaran"}
                  </td>
                  <td className="border px-3 py-2">{categoryLabel}</td>
                  <td className="border px-3 py-2">{tx.description}</td>
                  <td
                    className={`border px-3 py-2 text-right font-bold whitespace-nowrap ${
                      isIncome ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isIncome ? "+" : "-"} {formatRupiah(tx.amount)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Summary Box */}
      <div className="flex justify-end mb-8">
        <div className="w-72 rounded-lg border border-slate-300 p-4 space-y-2 bg-slate-50 text-xs">
          <div className="flex justify-between text-slate-700">
            <span>Total Pemasukan:</span>
            <strong className="text-emerald-700">{formatRupiah(totalIncome)}</strong>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Total Pengeluaran:</span>
            <strong className="text-rose-700">{formatRupiah(totalExpense)}</strong>
          </div>
          <div className="border-t border-slate-300 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
            <span>SALDO AKHIR:</span>
            <span className={finalBalance >= 0 ? "text-emerald-700" : "text-rose-700"}>
              {formatRupiah(finalBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Official Signatures Section (TTD Bendahara & TTD Ketua) */}
      <div className="mt-12 grid grid-cols-2 gap-8 text-center text-xs pt-6 border-t border-dashed border-slate-300">
        <div className="space-y-16">
          <div>
            <p className="font-semibold text-slate-700">Mengetahui,</p>
            <p className="font-bold text-slate-900">Ketua Organisasi</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold underline text-slate-900">( Ahmad Ketua Organisasi )</p>
            <p className="text-[10px] text-slate-500">NIP / ID: KETUA-001</p>
          </div>
        </div>

        <div className="space-y-16">
          <div>
            <p className="font-semibold text-slate-700">Dibuat & Disahkan Oleh,</p>
            <p className="font-bold text-slate-900">Bendahara Organisasi</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold underline text-slate-900">( Budi Bendahara )</p>
            <p className="text-[10px] text-slate-500">NIP / ID: BND-002</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-10 text-center text-[10px] text-slate-400 border-t pt-3">
        Dokumen ini dibuat otomatis oleh Sistem Informasi Keuangan Cakra Finance pada {formatTanggal(new Date(), "dd MMMM yyyy HH:mm")} WIB.
      </div>
    </div>
  );
}
