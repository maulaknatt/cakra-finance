"use server";

import { z } from "zod";
import { TransactionRepository } from "@/repositories/transactionRepository";
import { UploadService, UploadResult } from "@/services/uploadService";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";
import { TransactionType, IncomeCategory, ExpenseCategory } from "@prisma/client";

const transactionSchema = z.object({
  eventId: z.string().min(1, "Event wajib dipilih"),
  type: z.nativeEnum(TransactionType),
  incomeCategory: z.nativeEnum(IncomeCategory).optional(),
  expenseCategory: z.nativeEnum(ExpenseCategory).optional(),
  amount: z.number().positive("Nominal transaksi harus lebih besar dari 0"),
  date: z.string().min(1, "Tanggal transaksi wajib diisi"),
  description: z.string().min(3, "Keterangan transaksi minimal 3 karakter"),
});

export async function createTransactionAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Admin dan Bendahara yang memiliki hak akses mencatat transaksi.",
      };
    }

    const type = (formData.get("type") as TransactionType) || "INCOME";
    const incomeCatRaw = formData.get("incomeCategory") as string;
    const expenseCatRaw = formData.get("expenseCategory") as string;

    const incomeCat = incomeCatRaw ? (incomeCatRaw as IncomeCategory) : undefined;
    const expenseCat = expenseCatRaw ? (expenseCatRaw as ExpenseCategory) : undefined;

    const rawData = {
      eventId: (formData.get("eventId") as string) || "",
      type,
      incomeCategory: type === "INCOME" ? incomeCat : undefined,
      expenseCategory: type === "EXPENSE" ? expenseCat : undefined,
      amount: parseFloat((formData.get("amount") as string) || "0"),
      date: (formData.get("date") as string) || "",
      description: (formData.get("description") as string) || "",
    };

    const parsed = transactionSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi Gagal",
        error: parsed.error.issues[0].message,
      };
    }

    // Process optional attachment upload
    const attachmentFiles: UploadResult[] = [];
    const files = formData.getAll("files") as File[];

    for (const file of files) {
      if (file && file.size > 0 && file.name !== "undefined") {
        const result = await UploadService.uploadFile(file);
        attachmentFiles.push(result);
      }
    }

    await TransactionRepository.create({
      eventId: parsed.data.eventId,
      type: parsed.data.type,
      incomeCategory: parsed.data.incomeCategory,
      expenseCategory: parsed.data.expenseCategory,
      amount: parsed.data.amount,
      date: new Date(parsed.data.date),
      description: parsed.data.description,
      createdById: session.id,
      attachments: attachmentFiles.length > 0 ? attachmentFiles : undefined,
    });

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${parsed.data.eventId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Transaksi baru berhasil disimpan!",
    };
  } catch (error) {
    console.error("Create transaction action error:", error);
    return {
      success: false,
      message: "Gagal menyimpan transaksi",
      error: "Terjadi kesalahan server saat menyimpan transaksi.",
    };
  }
}

export async function updateTransactionAction(
  transactionId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Admin dan Bendahara yang berhak mengedit transaksi.",
      };
    }

    const type = (formData.get("type") as TransactionType) || "INCOME";
    const incomeCatRaw = formData.get("incomeCategory") as string;
    const expenseCatRaw = formData.get("expenseCategory") as string;

    const incomeCat = incomeCatRaw ? (incomeCatRaw as IncomeCategory) : undefined;
    const expenseCat = expenseCatRaw ? (expenseCatRaw as ExpenseCategory) : undefined;

    const rawData = {
      eventId: (formData.get("eventId") as string) || "",
      type,
      incomeCategory: type === "INCOME" ? incomeCat : undefined,
      expenseCategory: type === "EXPENSE" ? expenseCat : undefined,
      amount: parseFloat((formData.get("amount") as string) || "0"),
      date: (formData.get("date") as string) || "",
      description: (formData.get("description") as string) || "",
    };

    const parsed = transactionSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi Gagal",
        error: parsed.error.issues[0].message,
      };
    }

    await TransactionRepository.update(transactionId, {
      eventId: parsed.data.eventId,
      type: parsed.data.type,
      incomeCategory: parsed.data.type === "INCOME" ? parsed.data.incomeCategory : null,
      expenseCategory: parsed.data.type === "EXPENSE" ? parsed.data.expenseCategory : null,
      amount: parsed.data.amount,
      date: new Date(parsed.data.date),
      description: parsed.data.description,
    });

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/events");
    revalidatePath(`/dashboard/events/${parsed.data.eventId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Data transaksi berhasil diperbarui!",
    };
  } catch (error) {
    console.error("Update transaction action error:", error);
    return {
      success: false,
      message: "Gagal memperbarui transaksi",
      error: "Terjadi kesalahan server.",
    };
  }
}

export async function deleteTransactionAction(
  transactionId: string
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Admin dan Bendahara yang berhak menghapus transaksi.",
      };
    }

    await TransactionRepository.delete(transactionId);

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Transaksi berhasil dihapus.",
    };
  } catch (error) {
    console.error("Delete transaction action error:", error);
    return {
      success: false,
      message: "Gagal menghapus transaksi",
      error: "Terjadi kesalahan server.",
    };
  }
}
