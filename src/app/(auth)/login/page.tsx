"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wallet, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { loginAction } from "@/actions/authActions";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("password", password);

    const res = await loginAction(formData);
    setIsLoading(false);

    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setErrorMessage(res.error || res.message);
    }
  };

  const autofillCredentials = (userRole: "admin" | "bendahara" | "ketua") => {
    setIdentifier(userRole);
    setPassword("password123");
    setErrorMessage("");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#fffbeb] dark:bg-[#0b1120] px-4 py-12 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      {/* Cartoon Decorative Shapes */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-amber-400 rounded-3xl border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rotate-12 -z-0 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-400 rounded-3xl border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] -rotate-12 -z-0 hidden md:block" />

      <div className="z-10 w-full max-w-md space-y-6">
        {/* Back Link to Welcome Page */}
        <div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 font-bold">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Halaman Utama Profil
            </Button>
          </Link>
        </div>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-950 animate-cartoon-float">
            <Wallet className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            Cakra Finance 🔑
          </h1>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            Sistem Laporan Keuangan Organisasi
          </p>
        </div>

        {/* Card Form */}
        <Card className="bg-white dark:bg-slate-900 p-2">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-black text-slate-950 dark:text-white">Masuk ke Akun</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-xs font-bold">
              Masukkan Username / Email dan Password Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {errorMessage && (
              <div className="rounded-xl border-[2.5px] border-slate-900 bg-rose-200 dark:bg-rose-950 p-3 text-xs font-black text-rose-900 dark:text-rose-200 shadow-[3px_3px_0px_0px_#0f172a]">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                  Username / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 z-10" />
                  <Input
                    type="text"
                    placeholder="Contoh: admin atau bendahara"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-950 dark:text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 z-10" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 z-10"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="default"
                size="lg"
                className="w-full text-base font-extrabold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk Ke Sistem 🚀"
                )}
              </Button>
            </form>

            {/* Quick Autofill Helper for Demo/Testing */}
            <div className="space-y-3 border-t-[2.5px] border-slate-900 dark:border-slate-100 pt-4">
              <p className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Uji Coba Cepat (Auto-Fill Demo Credentials):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => autofillCredentials("admin")}
                  className="rounded-xl border-[2px] border-slate-900 bg-rose-200 dark:bg-rose-950 p-2 text-center text-xs font-black text-rose-950 dark:text-rose-200 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials("bendahara")}
                  className="rounded-xl border-[2px] border-slate-900 bg-emerald-200 dark:bg-emerald-950 p-2 text-center text-xs font-black text-emerald-950 dark:text-emerald-200 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  💼 Bendahara
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials("ketua")}
                  className="rounded-xl border-[2px] border-slate-900 bg-sky-200 dark:bg-sky-950 p-2 text-center text-xs font-black text-sky-950 dark:text-sky-200 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  🎓 Ketua
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
