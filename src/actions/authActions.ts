"use server";

import { z } from "zod";
import { UserRepository } from "@/repositories/userRepository";
import { verifyPassword, setSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ActionResponse, UserSession } from "@/types";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function loginAction(
  formData: FormData
): Promise<ActionResponse<UserSession>> {
  try {
    const rawData = {
      identifier: formData.get("identifier") as string,
      password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi gagal",
        error: parsed.error.issues[0].message,
      };
    }

    const user = await UserRepository.findByEmailOrUsername(parsed.data.identifier);

    if (!user) {
      return {
        success: false,
        message: "Autentikasi Gagal",
        error: "Username/Email atau Password tidak ditemukan.",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: "Akun Dinonaktifkan",
        error: "Akun Anda telah dinonaktifkan oleh Administrator.",
      };
    }

    const isMatch = await verifyPassword(parsed.data.password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Autentikasi Gagal",
        error: "Username/Email atau Password salah.",
      };
    }

    const sessionUser: UserSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    await setSession(sessionUser);

    return {
      success: true,
      message: "Login Berhasil",
      data: sessionUser,
    };
  } catch (error) {
    console.error("Login Server Action error:", error);
    return {
      success: false,
      message: "Terjadi Kesalahan Server",
      error: "Gagal memproses autentikasi. Silakan coba lagi.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
