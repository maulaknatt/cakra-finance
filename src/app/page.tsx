import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Receipt,
  FileSpreadsheet,
  Users,
  Award,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  Lock,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

export default async function WelcomeProfilePage() {
  const session = await getSession();

  // Fetch real summary stats for the Welcome profile section
  let totalEvents = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let totalUsers = 0;

  try {
    totalEvents = await prisma.event.count();
    totalUsers = await prisma.user.count();

    const incomeAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    });
    const expenseAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    });

    totalIncome = Number(incomeAgg._sum.amount || 0);
    totalExpense = Number(expenseAgg._sum.amount || 0);
  } catch (error) {
    console.error("Welcome page stats fetch error:", error);
  }

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#fffbeb] text-slate-900 dark:bg-[#0b1120] dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Cartoon Top Header / Navbar */}
      <header className="sticky top-0 z-50 bg-amber-300/90 dark:bg-slate-900/90 backdrop-blur-md border-b-[3px] border-slate-900 dark:border-slate-100 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] group-hover:-translate-y-0.5 transition-transform overflow-hidden">
              <img src="/logo-cakra.jpg" alt="Logo Cakra" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-1.5">
                Cakra Finance
                <span className="inline-block animate-cartoon-wiggle text-base">✨</span>
              </span>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-emerald-400 uppercase tracking-widest">
                Organisasi Kepemudaan
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button variant="default" size="default" className="gap-2 font-extrabold">
                  <Smile className="h-5 w-5" />
                  Dashboard ({session.name.split(" ")[0]})
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="yellow" size="default" className="gap-2 font-extrabold">
                  <Lock className="h-4 w-4" />
                  Masuk Ke Sistem
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 space-y-16 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-8 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Headline & CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-slate-900 bg-amber-400 px-4 py-1.5 text-xs font-black text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] animate-cartoon-float">
                  <Sparkles className="h-4 w-4" />
                  PORTAL RESMI PROFIL & KEUANGAN ORGANISASI
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-950 dark:text-white">
                  Kelola Kas Organisasi Pemuda Lebih{" "}
                  <span className="bg-emerald-400 px-3 py-1 rounded-2xl border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] inline-block -rotate-1 text-slate-950">
                    Transparan
                  </span>{" "}
                  &{" "}
                  <span className="bg-rose-400 px-3 py-1 rounded-2xl border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] inline-block rotate-1 text-slate-950">
                    Seru! 🎉
                  </span>
                </h1>

                <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Selamat datang di <strong>Cakra Finance</strong>! Platform pencatatan keuangan modern berbasis komik/cartoon untuk mendukung transparansi anggaran event kegiatan, iuran kas, dan pelaporan keuangan kepemudaan.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  {session ? (
                    <Link href="/dashboard">
                      <Button variant="default" size="lg" className="gap-2">
                        Buka Dashboard Keuangan
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="default" size="lg" className="gap-2">
                        Masuk Ke Akun Anda
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}

                  <a href="#profile-section">
                    <Button variant="outline" size="lg" className="gap-2">
                      <HeartHandshake className="h-5 w-5 text-rose-500" />
                      Jelajahi Profil Cakra
                    </Button>
                  </a>
                </div>

                {/* Quick Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-black bg-cyan-300 dark:bg-cyan-900 dark:text-cyan-100 border-[2px] border-slate-900 px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#0f172a]">
                    <ShieldCheck className="h-4 w-4 text-slate-950 dark:text-cyan-300" />
                    Multi-Role Authorization
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black bg-emerald-300 dark:bg-emerald-900 dark:text-emerald-100 border-[2px] border-slate-900 px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#0f172a]">
                    <CheckCircle2 className="h-4 w-4 text-slate-950 dark:text-emerald-300" />
                    Real-time Audit Ledger
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Cartoon Card Visual */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Backdrop Decorative Cartoon Shapes */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400 rounded-3xl border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rotate-6 -z-10" />
                  <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-rose-400 rounded-3xl border-[3px] border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] -rotate-6 -z-10" />

                  {/* Main Hero Card */}
                  <Card className="p-6 bg-white dark:bg-slate-900 space-y-5 animate-cartoon-float">
                    <div className="flex items-center justify-between border-b-[2.5px] border-slate-900 dark:border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-violet-400 border-[2px] border-slate-900 flex items-center justify-center font-black text-white text-lg shadow-[2px_2px_0px_0px_#0f172a] overflow-hidden">
                          <img src="/logo-cakra.jpg" alt="Logo Cakra" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            Ringkasan Kas Cakra
                          </h3>
                          <p className="text-[11px] font-bold text-slate-500">Tahun Operasional 2026</p>
                        </div>
                      </div>
                      <Badge variant="yellow">LIVE</Badge>
                    </div>

                    {/* Balance Showcase - Privacy Protected */}
                    <div className="rounded-xl border-[2.5px] border-slate-900 bg-emerald-300 p-4 dark:bg-emerald-950 dark:text-emerald-100 shadow-[3px_3px_0px_0px_#0f172a]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-950 dark:text-emerald-400 tracking-wider">
                          Status Kas Organisasi
                        </span>
                        <span className="text-[10px] font-black bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-2 py-0.5 rounded-md">
                          PRIVASI 🔒
                        </span>
                      </div>
                      <p className="text-2xl font-black text-slate-950 dark:text-white mt-1">
                        Rp •••••••• 🔒
                      </p>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-emerald-300 mt-0.5">
                        Masuk ke akun untuk melihat rincian nominal saldo
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border-[2px] border-slate-900 bg-cyan-200 dark:bg-cyan-950 text-slate-950 dark:text-cyan-100 shadow-[2px_2px_0px_0px_#0f172a]">
                        <span className="text-[10px] font-black uppercase">Pemasukan</span>
                        <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                          Tercatat 🟢
                        </p>
                      </div>
                      <div className="p-3 rounded-xl border-[2px] border-slate-900 bg-rose-200 dark:bg-rose-950 text-slate-950 dark:text-rose-100 shadow-[2px_2px_0px_0px_#0f172a]">
                        <span className="text-[10px] font-black uppercase">Pengeluaran</span>
                        <p className="text-sm font-extrabold text-rose-700 dark:text-rose-400 mt-0.5">
                          Terverifikasi 📜
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ORGANIZATIONAL PROFILE & VISION MISSION */}
        <section id="profile-section" className="px-4 sm:px-8 max-w-7xl mx-auto pt-8">
          <div className="text-center space-y-3 mb-10">
            <Badge variant="cyan" className="text-sm py-1 px-4">
              PROFIL ORGANISASI
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              Mengenal Lebih Dekat Cakra Finance 🚀
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Wadah akuntabilitas dan efisiensi pengelolaan dana kepemudaan untuk melahirkan program kegiatan bermakna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-amber-100 dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-400 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center">
                <Award className="h-6 w-6 text-slate-950" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Visi Utama</h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                Mewujudkan tata kelola keuangan pemuda yang 100% terbuka, rapi, dan tepercaya untuk mendorong keberhasilan seluruh event organisasi.
              </p>
            </Card>

            <Card className="p-6 bg-cyan-100 dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-cyan-400 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-slate-950" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Misi Keuangan</h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                Mencatat setiap pemasukan iuran/sponsor dan belanja peralatan/konsumsi secara real-time dengan bukti nota terlampir secara digital.
              </p>
            </Card>

            <Card className="p-6 bg-emerald-100 dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-400 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center">
                <Users className="h-6 w-6 text-slate-950" />
              </div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white">Kolaborasi Tim</h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                Menghubungkan Pengurus, Bendahara, dan Ketua dalam satu ruang kontrol yang fleksibel dengan pembagian peran yang ketat dan jelas.
              </p>
            </Card>
          </div>
        </section>

        {/* SECTION: REAL-TIME COUNTER STATS */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl border-[3px] border-slate-900 bg-emerald-400 p-8 shadow-[6px_6px_0px_0px_#0f172a] dark:bg-emerald-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-slate-950">
              <div className="space-y-1">
                <span className="text-4xl sm:text-5xl font-black block">{totalEvents}</span>
                <span className="text-xs font-black uppercase tracking-wider">Event Kegiatan</span>
              </div>
              <div className="space-y-1">
                <span className="text-4xl sm:text-5xl font-black block">100%</span>
                <span className="text-xs font-black uppercase tracking-wider">Transparansi Kas</span>
              </div>
              <div className="space-y-1">
                <span className="text-4xl sm:text-5xl font-black block">100%</span>
                <span className="text-xs font-black uppercase tracking-wider">Akuntabilitas Audit</span>
              </div>
              <div className="space-y-1">
                <span className="text-4xl sm:text-5xl font-black block">{totalUsers}</span>
                <span className="text-xs font-black uppercase tracking-wider">Pengurus Terdaftar</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: KEY FEATURES GRID */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto pt-4">
          <div className="text-center space-y-3 mb-10">
            <Badge variant="yellow" className="text-sm py-1 px-4">
              FITUR UNGGULAN
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              Kemudahan Dalam Satu Aplikasi 🛠️
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-5 bg-white dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-400 border-[2px] border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]">
                <Calendar className="h-5 w-5 text-slate-950" />
              </div>
              <h4 className="text-lg font-black text-slate-950 dark:text-white">Manajemen Event</h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Kelola anggaran per event kegiatan lengkap dengan status Draft, Ongoing, dan Completed.
              </p>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-400 border-[2px] border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]">
                <Receipt className="h-5 w-5 text-slate-950" />
              </div>
              <h4 className="text-lg font-black text-slate-950 dark:text-white">Pencatatan Transaksi</h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Kategorisasi otomatis pemasukan & pengeluaran serta unggah bukti kuitansi nota.
              </p>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-400 border-[2px] border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]">
                <FileSpreadsheet className="h-5 w-5 text-slate-950" />
              </div>
              <h4 className="text-lg font-black text-slate-950 dark:text-white">Ekspor Laporan</h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Cetak laporan periodik ke format Excel (.xlsx) atau PDF siap pakai secara praktis.
              </p>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 cartoon-card-hover space-y-3">
              <div className="h-10 w-10 rounded-xl bg-violet-400 border-[2px] border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-black text-slate-950 dark:text-white">Role Security</h4>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Hak akses berlapis untuk Administrator, Bendahara Kas, dan Ketua Organisasi.
              </p>
            </Card>
          </div>
        </section>

        {/* SECTION: ROLES & TEAM SHOWCASE */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto pt-4">
          <div className="text-center space-y-3 mb-10">
            <Badge variant="pink" className="text-sm py-1 px-4">
              HAK AKSES PERAN
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              Struktur Akses Pengguna 👥
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-rose-100 dark:bg-slate-900 border-rose-500 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-rose-500 border-[2.5px] border-slate-900 flex items-center justify-center font-black text-white text-xl shadow-[3px_3px_0px_0px_#0f172a]">
                  👑
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">ADMINISTRATOR</h3>
                  <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400">Akses Penuh</span>
                </div>
              </div>
              <ul className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-2">
                <li className="flex items-center gap-2">✓ Kelola Pengguna & Hak Akses</li>
                <li className="flex items-center gap-2">✓ Buat & Edit Event Kegiatan</li>
                <li className="flex items-center gap-2">✓ Input, Edit & Hapus Transaksi</li>
                <li className="flex items-center gap-2">✓ Cetak Laporan Keuangan</li>
              </ul>
            </Card>

            <Card className="p-6 bg-emerald-100 dark:bg-slate-900 border-emerald-500 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-400 border-[2.5px] border-slate-900 flex items-center justify-center font-black text-slate-950 text-xl shadow-[3px_3px_0px_0px_#0f172a]">
                  💼
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">BENDAHARA KAS</h3>
                  <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">Pengelola Keuangan</span>
                </div>
              </div>
              <ul className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-2">
                <li className="flex items-center gap-2">✓ Buat & Edit Event Kegiatan</li>
                <li className="flex items-center gap-2">✓ Catat Transaksi Pemasukan/Pengeluaran</li>
                <li className="flex items-center gap-2">✓ Unggah Lampiran Nota Transaksi</li>
                <li className="flex items-center gap-2">✓ Cetak & Unduh Laporan Kas</li>
              </ul>
            </Card>

            <Card className="p-6 bg-sky-100 dark:bg-slate-900 border-sky-500 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-sky-400 border-[2.5px] border-slate-900 flex items-center justify-center font-black text-slate-950 text-xl shadow-[3px_3px_0px_0px_#0f172a]">
                  🎓
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">KETUA ORGANISASI</h3>
                  <span className="text-[11px] font-extrabold text-sky-700 dark:text-sky-400">Monitoring & Auditor</span>
                </div>
              </div>
              <ul className="text-xs font-bold text-slate-700 dark:text-slate-300 space-y-2">
                <li className="flex items-center gap-2">✓ Akses Dashboard Ringkasan Kas</li>
                <li className="flex items-center gap-2">✓ Monitoring Histori Transaksi</li>
                <li className="flex items-center gap-2">✓ Pantau Grafik Pemasukan/Pengeluaran</li>
                <li className="flex items-center gap-2">✓ Cetak Laporan untuk Rapat</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>

      {/* Cartoon Footer */}
      <footer className="border-t-[3px] border-slate-900 dark:border-slate-100 bg-amber-300 dark:bg-slate-950 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-400 border-[2px] border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center justify-center overflow-hidden">
              <img src="/logo-cakra.jpg" alt="Logo Cakra" className="h-full w-full object-cover" />
            </div>
            <span className="font-black text-slate-950 dark:text-white text-base">
              Cakra Finance &copy; 2026 - Organisasi Kepemudaan
            </span>
          </div>

          <p className="text-xs font-bold text-slate-800 dark:text-slate-400">
            Sistem Laporan Keuangan Organisasi | Didesain dengan gaya Cartoon Neubrutalism
          </p>
        </div>
      </footer>
    </div>
  );
}
