"use client";

import { useState } from "react";
import { Download, Printer, Filter, Search, Calendar, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TransactionWithRelations } from "@/repositories/transactionRepository";
import { PrintableReportView } from "@/components/reports/PrintableReportView";

interface ReportViewClientProps {
  transactions: TransactionWithRelations[];
  eventsList: { id: string; title: string }[];
}

export function ReportViewClient({ transactions, eventsList }: ReportViewClientProps) {
  const [eventId, setEventId] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const filteredTransactions = transactions.filter((tx) => {
    const matchEvent = eventId ? tx.eventId === eventId : true;
    const matchType = type ? tx.type === type : true;
    const matchSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.event.title.toLowerCase().includes(search.toLowerCase());
    
    const txDate = new Date(tx.date);
    const matchYear = year ? txDate.getFullYear() === parseInt(year) : true;
    const matchMonth = month ? txDate.getMonth() + 1 === parseInt(month) : true;

    return matchEvent && matchType && matchSearch && matchYear && matchMonth;
  });

  const selectedEventObj = eventsList.find((e) => e.id === eventId);
  const eventNameStr = selectedEventObj ? selectedEventObj.title : "Semua Event Kegiatan";
  const periodTextStr = month && year
    ? `Bulan ${month} Tahun ${year}`
    : year
    ? `Tahun ${year}`
    : "Semua Periode";

  const handleExcelExport = () => {
    const params = new URLSearchParams();
    if (eventId) params.set("eventId", eventId);
    if (type) params.set("type", type);
    if (search) params.set("search", search);
    if (month) params.set("month", month);
    if (year) params.set("year", year);

    window.open(`/api/reports/excel?${params.toString()}`, "_blank");
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            Laporan Keuangan & Cetak 📄
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-400">
            Filter, cetak, dan ekspor laporan pertanggungjawaban kas ke format Excel dan PDF
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleExcelExport}
            variant="default"
            size="default"
            className="font-extrabold text-xs gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Ekspor Excel (.xlsx)
          </Button>

          <Button
            onClick={handlePrintPdf}
            variant="yellow"
            size="default"
            className="font-extrabold text-xs gap-2"
          >
            <Printer className="h-4 w-4" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>

      {/* Advanced Cartoon Filter Bar Controls */}
      <Card className="cartoon-card p-4 print:hidden">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Event Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-950 dark:text-slate-200">Pilih Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
            >
              <option value="">Semua Event</option>
              {eventsList.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-950 dark:text-slate-200">Pilih Bulan</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
            >
              <option value="">Semua Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-950 dark:text-slate-200">Tahun</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
            >
              <option value="">Semua Tahun</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-950 dark:text-slate-200">Jenis Transaksi</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
            >
              <option value="">Semua Jenis</option>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>

          {/* Search Query */}
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase text-slate-950 dark:text-slate-200">Pencarian</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400 z-10" />
              <Input
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs h-11"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Document Printable View Container */}
      <div className="overflow-auto py-4 bg-amber-50 dark:bg-slate-950 rounded-2xl p-4 print:p-0 print:bg-white border-[3px] border-slate-900 dark:border-slate-100 shadow-[5px_5px_0px_0px_#0f172a]">
        <PrintableReportView
          transactions={filteredTransactions}
          eventName={eventNameStr}
          periodText={periodTextStr}
        />
      </div>
    </div>
  );
}
