"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Lock, User, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
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
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-600/20 blur-3xl" />

      <div className="z-10 w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white animate-bounce-slow">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Cakra Finance
          </h1>
          <p className="text-sm text-slate-400">
            Sistem Laporan Keuangan Organisasi Kepemudaan
          </p>
        </div>

        {/* Card Form */}
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold text-white">Masuk ke Akun</CardTitle>
            <CardDescription className="text-slate-400">
              Masukkan username/email dan kata sandi Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-3 text-xs font-medium text-red-300">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Username / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Contoh: admin atau bendahara@cakra.org"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-9 bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk Sistem"
                )}
              </Button>
            </form>

            {/* Quick Autofill Helper for Demo/Testing */}
            <div className="space-y-2 border-t border-slate-800/80 pt-4">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Uji Coba Cepat (Auto-Fill Demo Credentials):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => autofillCredentials("admin")}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center text-xs font-medium text-red-400 hover:bg-slate-800 transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials("bendahara")}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center text-xs font-medium text-emerald-400 hover:bg-slate-800 transition-colors"
                >
                  Bendahara
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials("ketua")}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-center text-xs font-medium text-sky-400 hover:bg-slate-800 transition-colors"
                >
                  Ketua
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
