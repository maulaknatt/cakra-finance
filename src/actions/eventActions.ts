"use server";

import { z } from "zod";
import { EventRepository } from "@/repositories/eventRepository";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";
import { EventStatus } from "@prisma/client";

const eventSchema = z.object({
  title: z.string().min(3, "Nama event minimal 3 karakter"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  status: z.nativeEnum(EventStatus),
  picName: z.string().min(2, "Nama penanggung jawab wajib diisi"),
});

export async function createEventAction(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Admin dan Bendahara yang memiliki hak akses menambah event.",
      };
    }

    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || undefined;
    const startDate = (formData.get("startDate") as string) || "";
    const endDate = (formData.get("endDate") as string) || "";
    const status = (formData.get("status") as EventStatus) || undefined;
    const picName = (formData.get("picName") as string) || "";

    const rawData = {
      title,
      description,
      startDate,
      endDate,
      status,
      picName,
    };

    const parsed = eventSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi Gagal",
        error: parsed.error.issues[0].message,
      };
    }

    await EventRepository.create({
      title: parsed.data.title,
      description: parsed.data.description,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      status: parsed.data.status,
      picName: parsed.data.picName,
      createdById: session.id,
    });

    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Event baru berhasil ditambahkan!",
    };
  } catch (error) {
    console.error("Create event action error:", error);
    return {
      success: false,
      message: "Gagal menyimpan event",
      error: "Terjadi kesalahan server.",
    };
  }
}

export async function updateEventAction(
  eventId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Admin dan Bendahara yang dapat mengubah data event.",
      };
    }

    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || undefined;
    const startDate = (formData.get("startDate") as string) || "";
    const endDate = (formData.get("endDate") as string) || "";
    const status = (formData.get("status") as EventStatus) || undefined;
    const picName = (formData.get("picName") as string) || "";

    const rawData = {
      title,
      description,
      startDate,
      endDate,
      status,
      picName,
    };

    const parsed = eventSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi Gagal",
        error: parsed.error.issues[0].message,
      };
    }

    await EventRepository.update(eventId, {
      title: parsed.data.title,
      description: parsed.data.description,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      status: parsed.data.status,
      picName: parsed.data.picName,
    });

    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${eventId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Data event berhasil diperbarui!",
    };
  } catch (error) {
    console.error("Update event action error:", error);
    return {
      success: false,
      message: "Gagal memperbarui event",
      error: "Terjadi kesalahan server.",
    };
  }
}

export async function deleteEventAction(eventId: string): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Admin dan Bendahara yang berhak menghapus event.",
      };
    }

    await EventRepository.delete(eventId);

    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Event beserta histori transaksi terkait telah berhasil dihapus.",
    };
  } catch (error) {
    console.error("Delete event action error:", error);
    return {
      success: false,
      message: "Gagal menghapus event",
      error: "Terjadi kesalahan server.",
    };
  }
}
