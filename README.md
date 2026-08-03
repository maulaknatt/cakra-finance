# Cakra Finance 🎪

Sistem Laporan Keuangan Organisasi Kepemudaan dengan antarmuka Cartoon Neubrutalism dan integrasi database Supabase PostgreSQL.

## Fitur Utama
- **Welcome Profile Landing Page**: Halaman profil organisasi publik.
- **Cartoon Neubrutalism UI/UX**: Desain komik pop interaktif & responsif.
- **Manajemen Event Kegiatan**: Pelaporan kas per event/program kerja.
- **Pencatatan Transaksi**: Pemasukan & pengeluaran + lampiran nota.
- **Ekspor Laporan**: Cetak Laporan Keuangan ke format Excel (.xlsx) & PDF.
- **Role Security**: Multi-level access untuk Admin, Bendahara, & Ketua.

## Environment Variables
- `DATABASE_URL`: Supabase PostgreSQL connection pooler (port 6543 / 5432).
- `DIRECT_URL`: Supabase PostgreSQL direct connection (port 5432).
- `JWT_SECRET`: Secret key untuk JWT Session cookie.

## Getting Started
```bash
npm install
npx prisma generate
npm run dev
```

Deploy ke Vercel terhubung otomatis dengan Supabase PostgreSQL.
