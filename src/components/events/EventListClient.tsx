"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Calendar, User, Eye, Edit2, Trash2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventFormModal } from "@/components/events/EventFormModal";
import { EventWithSummary } from "@/repositories/eventRepository";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { EVENT_STATUS_LABELS } from "@/constants";
import { deleteEventAction } from "@/actions/eventActions";
import { Role } from "@prisma/client";

interface EventListClientProps {
  events: EventWithSummary[];
  userRole: Role;
  initialSearch: string;
  initialStatus: string;
}

export function EventListClient({
  events,
  userRole,
  initialSearch,
  initialStatus,
}: EventListClientProps) {
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithSummary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canManageEvent = userRole === "ADMIN" || userRole === "BENDAHARA";

  const filteredEvents = events.filter((evt) => {
    const matchSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.picName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? evt.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus event ini beserta seluruh transaksinya?")) {
      setDeletingId(id);
      await deleteEventAction(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Event & Kegiatan Organisasi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola laporan keuangan per kegiatan secara independen dan transparan
          </p>
        </div>

        {canManageEvent && (
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setIsFormOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Event Baru
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari event atau nama PIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:w-48"
          >
            <option value="">Semua Status</option>
            {Object.entries(EVENT_STATUS_LABELS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Events Grid Card Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <Calendar className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Tidak ada event ditemukan
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Coba sesuaikan kata kunci pencarian atau buat event kegiatan baru.
            </p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const statusConfig = EVENT_STATUS_LABELS[evt.status];

            return (
              <Card
                key={evt.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {evt.transactionCount} Transaksi
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/dashboard/events/${evt.id}`}
                      className="group flex items-center justify-between"
                    >
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {evt.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-600" />
                    </Link>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {evt.description || "Tidak ada deskripsi kegiatan."}
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-b border-slate-100 py-3 text-xs text-slate-600 dark:border-slate-800/80 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-emerald-600" />
                      <span>PIC: <strong>{evt.picName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      <span>
                        {formatTanggal(evt.startDate, "dd MMM")} - {formatTanggal(evt.endDate, "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Financial Stats Per Event */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="rounded-lg bg-emerald-500/10 p-2.5 dark:bg-emerald-950/40">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3" /> Pemasukan
                      </div>
                      <p className="mt-0.5 font-bold text-emerald-800 dark:text-emerald-300">
                        {formatRupiah(evt.totalIncome)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-rose-500/10 p-2.5 dark:bg-rose-950/40">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-400">
                        <TrendingDown className="h-3 w-3" /> Pengeluaran
                      </div>
                      <p className="mt-0.5 font-bold text-rose-800 dark:text-rose-300">
                        {formatRupiah(evt.totalExpense)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-100/70 p-3 dark:bg-slate-950/60">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Saldo Event:
                    </span>
                    <span
                      className={`text-sm font-extrabold ${
                        evt.balance >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {formatRupiah(evt.balance)}
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <Link href={`/dashboard/events/${evt.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      Detail Event
                    </Button>
                  </Link>

                  {canManageEvent && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEvent(evt);
                          setIsFormOpen(true);
                        }}
                        className="h-8 w-8 text-slate-600 hover:text-emerald-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === evt.id}
                        onClick={() => handleDelete(evt.id)}
                        className="h-8 w-8 text-slate-600 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal Form */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedEvent}
      />
    </div>
  );
}
