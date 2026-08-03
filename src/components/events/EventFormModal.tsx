"use client";

import { useState, useEffect } from "react";
import { X, Calendar, User, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EventStatus } from "@prisma/client";
import { createEventAction, updateEventAction } from "@/actions/eventActions";
import { EVENT_STATUS_LABELS } from "@/constants";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    description?: string | null;
    startDate: Date;
    endDate: Date;
    status: EventStatus;
    picName: string;
  } | null;
}

export function EventFormModal({ isOpen, onClose, initialData }: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<EventStatus>("DRAFT");
  const [picName, setPicName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStartDate(new Date(initialData.startDate).toISOString().split("T")[0]);
      setEndDate(new Date(initialData.endDate).toISOString().split("T")[0]);
      setStatus(initialData.status);
      setPicName(initialData.picName);
    } else {
      setTitle("");
      setDescription("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate(new Date().toISOString().split("T")[0]);
      setStatus("DRAFT");
      setPicName("");
    }
    setErrorMessage("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("status", status);
    formData.append("picName", picName);

    const res = initialData
      ? await updateEventAction(initialData.id, formData)
      : await createEventAction(formData);

    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.error || res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs font-sans">
      <Card className="w-full max-w-lg border-[3px] border-slate-900 bg-white p-2 shadow-[6px_6px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b-[2px] border-slate-900 pb-3 dark:border-slate-100">
          <CardTitle className="text-lg font-black text-slate-950 dark:text-white">
            {initialData ? "Edit Event Kegiatan ✏️" : "Tambah Event Baru 🎪"}
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
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Nama Event / Kegiatan *
              </label>
              <Input
                placeholder="Contoh: Peringatan 17 Agustus 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Penanggung Jawab (PIC) *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                <Input
                  placeholder="Contoh: Rian Hidayat"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                  Tanggal Mulai *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                  Tanggal Selesai *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Status Event *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="flex h-11 w-full rounded-xl border-[2.5px] border-slate-900 bg-white px-3 py-2 text-xs font-extrabold shadow-[3px_3px_0px_0px_#0f172a] dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
              >
                {Object.entries(EVENT_STATUS_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                Deskripsi Kegiatan (Opsional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                <textarea
                  placeholder="Tulis rincian singkat kegiatan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-xl border-[2.5px] border-slate-900 bg-white pl-10 pr-3.5 py-2 text-xs font-bold text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 dark:border-slate-100 dark:bg-slate-950 dark:text-white dark:shadow-[3px_3px_0px_0px_#f8fafc]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-[2px] border-slate-900 dark:border-slate-100">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} variant="default">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Event 🚀"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
