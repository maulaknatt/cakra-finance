"use server";

import { z } from "zod";
import { UserRepository } from "@/repositories/userRepository";
import { hashPassword, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";
import { Role } from "@prisma/client";

const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.nativeEnum(Role),
});

const updateUserSchema = z.object({
  id: z.string().min(1, "ID pengguna wajib diisi"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  role: z.nativeEnum(Role),
  password: z.string().optional(),
});

export async function createUserAction(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Administrator yang dapat menambahkan pengguna baru.",
      };
    }

    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as Role,
    };

    const parsed = createUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi Gagal",
        error: parsed.error.issues[0].message,
      };
    }

    const existing = await UserRepository.findByEmailOrUsername(parsed.data.username);
    if (existing) {
      return {
        success: false,
        message: "Username / Email Sudah Ada",
        error: "Username atau email tersebut sudah terdaftar di sistem.",
      };
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await UserRepository.createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      username: parsed.data.username,
      passwordHash,
      role: parsed.data.role,
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Pengguna baru berhasil ditambahkan!",
    };
  } catch (error) {
    console.error("Create user action error:", error);
    return {
      success: false,
      message: "Gagal membuat pengguna",
      error: "Terjadi kesalahan server.",
    };
  }
}

export async function updateUserAction(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Administrator yang dapat memperbarui pengguna.",
      };
    }

    const rawData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      role: formData.get("role") as Role,
      password: (formData.get("password") as string) || undefined,
    };

    const parsed = updateUserSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi Gagal",
        error: parsed.error.issues[0].message,
      };
    }

    const existing = await UserRepository.findByEmailOrUsername(parsed.data.username);
    if (existing && existing.id !== parsed.data.id) {
      return {
        success: false,
        message: "Username / Email Sudah Digunakan",
        error: "Username tersebut sudah digunakan oleh pengguna lain.",
      };
    }

    let passwordHash: string | undefined = undefined;
    if (parsed.data.password && parsed.data.password.trim().length > 0) {
      if (parsed.data.password.trim().length < 6) {
        return {
          success: false,
          message: "Validasi Gagal",
          error: "Password baru minimal 6 karakter.",
        };
      }
      passwordHash = await hashPassword(parsed.data.password.trim());
    }

    await UserRepository.updateUser(parsed.data.id, {
      name: parsed.data.name,
      email: parsed.data.email,
      username: parsed.data.username,
      role: parsed.data.role,
      ...(passwordHash && { passwordHash }),
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Data pengguna berhasil diperbarui!",
    };
  } catch (error) {
    console.error("Update user action error:", error);
    return {
      success: false,
      message: "Gagal memperbarui pengguna",
      error: "Terjadi kesalahan server.",
    };
  }
}

export async function toggleUserStatusAction(
  userId: string,
  currentStatus: boolean
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Administrator yang dapat mengubah status pengguna.",
      };
    }

    if (userId === session.id) {
      return {
        success: false,
        message: "Operasi Ditolak",
        error: "Anda tidak dapat menonaktifkan akun sendiri.",
      };
    }

    await UserRepository.updateUser(userId, {
      isActive: !currentStatus,
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `Status pengguna berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}.`,
    };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return {
      success: false,
      message: "Gagal memperbarui status",
      error: "Terjadi kesalahan server.",
    };
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return {
        success: false,
        message: "Akses Ditolak",
        error: "Hanya Administrator yang dapat menghapus pengguna.",
      };
    }

    if (userId === session.id) {
      return {
        success: false,
        message: "Operasi Ditolak",
        error: "Anda tidak dapat menghapus akun Anda sendiri.",
      };
    }

    await UserRepository.deleteUser(userId);

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Pengguna berhasil dihapus dari sistem.",
    };
  } catch (error) {
    console.error("Delete user error:", error);
    return {
      success: false,
      message: "Gagal menghapus pengguna",
      error: "Terjadi kesalahan server.",
    };
  }
}
