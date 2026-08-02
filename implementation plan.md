# Cakra Finance - Enterprise Financial Management System
## System Architecture & Implementation Roadmap

> **Role**: Senior Full Stack Engineer (15+ Years Experience)  
> **Project**: Cakra Finance (Laporan Keuangan Organisasi Kepemudaan)  
> **Stack**: Next.js 15 (App Router), TypeScript (Strict), TailwindCSS v4, Prisma ORM, PostgreSQL, shadcn/ui, Zod, React Hook Form, TanStack Table, Recharts, ExcelJS, Lucide Icons.

---

## 📋 Tahap 1: Analisis Kebutuhan (Requirements Analysis)

### 1. Context & Business Domain
Organisasi kepemudaan (seperti Karang Taruna, Remaja Masjid, Komunitas Olahraga/Seni) memerlukan akuntabilitas dan transparansi tinggi dalam pengelolaan keuangan. Permasalahan utama yang diselesaikan oleh **Cakra Finance** meliputi:
- **Per-Event Isolation**: Keuangan setiap kegiatan (misal 17 Agustus, Bakti Sosial) harus terpisah namun tetap terintegrasi ke saldo keseluruhan organisasi.
- **Role-Based Workflows**: Bendahara berfokus pada eksekusi pencatatan, Ketua fokus pada monitoring & otorisasi laporan, dan Admin mengelola tata kelola sistem & pengguna.
- **Digital Audit Trail**: Setiap transaksi wajib dilampiri bukti foto/dokumen (kwitansi/nota) dan mencatat siapa yang memasukkan data (*Audit Logs* / *Input Oleh*).
- **Executive Exporting**: Laporan siap cetak formal (PDF dengan area TTD Bendahara & Ketua, serta Excel terformat rapat).

### 2. Actor Matrix & Matrix Hak Akses (RBAC)

| Modul / Fitur | Admin | Bendahara | Ketua (Read Only) |
| :--- | :---: | :---: | :---: |
| **Authentication & Profile** | Login, Change Password | Login, Change Password | Login, Change Password |
| **User Management** | CRUD User, Assign Role | Read Only | Read Only |
| **Event Management** | CRUD Event | Read Event | Read Event |
| **Transaksi (Pemasukan/Pengeluaran)** | CRUD Transaksi | CRUD Transaksi | Read Transaksi |
| **Upload Bukti Transaksi** | Upload & Delete | Upload | View Only |
| **Dashboard Analytics** | Full Access | Full Access | Full Access |
| **Export Excel & PDF** | Download | Download | Download |
| **Audit Log / Input Info** | Full View | View Own & Read All | View All |

### 3. Modul & Spesifikasi Kebutuhan Fungsional

#### A. Authentication & Security
- System Login berbasis Email/Username & Password.
- Role-based Access Control (RBAC) di tingkat middleware, server action, dan UI level.
- Session persisten aman dengan HTTP-Only Cookie.

#### B. Manajemen Event (Kegiatan Organisasi)
- **Atribut**: ID, Nama Event, Deskripsi, Tanggal Mulai, Tanggal Selesai, Status (`DRAFT`, `ONGOING`, `COMPLETED`, `CANCELLED`), Penanggung Jawab, IsActive, CreatedAt, UpdatedAt.
- **Kalkulasi Otomatis**: Total Pemasukan, Total Pengeluaran, dan Saldo Bersih per Event.

#### C. Manajemen Transaksi
- **Relasi**: Setiap transaksi **wajib** terhubung ke 1 Event.
- **Jenis Transaksi**: Pemasukan (`INCOME`) atau Pengeluaran (`EXPENSE`).
- **Kategori Pemasukan**: Kas Anggota, Donasi, Sponsor, Penjualan, Iuran, Lainnya.
- **Kategori Pengeluaran**: Konsumsi, Peralatan, Transportasi, Hadiah, Sewa, ATK, Dekorasi, Lainnya.
- **Bukti Transaksi**: Support JPG, JPEG, PNG, PDF (Upload ke Storage Cloud/Blob).

#### D. Dashboard & Visualisasi Analytics
- Modern Admin Layout dengan Dark Mode default/toggle, Sidebar navigation, Topbar breadcrumbs, User menu.
- Metric Cards: Total Event, Total Pemasukan, Total Pengeluaran, Saldo Keseluruhan, Total Transaksi.
- Visual Charts (Recharts): Tren Pemasukan vs Pengeluaran per Bulan, Grafik Saldo Kumulatif, Breakdown Kategori Pemasukan & Pengeluaran (Pie/Donut Chart).
- Recent Activity Feed.

#### E. Reporting & Exporting Engine
- Advanced Multi-filter: Filter berdasarkan Event, Range Tanggal (Awal - Akhir), Bulan, Tahun, Jenis, Kategori.
- **Export Excel (ExcelJS)**: Format profesional lengkap dengan Header Logo, Meta Info Organisasi, Data Tabel terformat akuntansi (Rupiah `Rp`), Subtotal, dan Saldo Akhir.
- **Export PDF**: Generasi PDF server-side/client-side dengan layout resmi corporate/organisasi, tabel ringkas, serta kolom tanda tangan (TTD) digital Bendahara dan Ketua.

---

## 🛣️ Master Implementation Roadmap

- [x] **Tahap 1**: Analisis Kebutuhan (Requirements Analysis)
- [x] **Tahap 2**: Arsitektur Sistem & Data Flow
- [x] **Tahap 3**: Entity Relationship Diagram (ERD) & Schema Planning
- [ ] **Tahap 4**: Database Setup & Prisma Schema Implementation
- [ ] **Tahap 5**: Folder Structure Enterprise & Architecture Design
- [ ] **Tahap 6**: UI System Design (shadcn/ui, Tailwind CSS v4, Layout, Dark Mode)
- [ ] **Tahap 7**: Authentication & Authorization Engine
- [ ] **Tahap 8**: CRUD Event & Service/Repository Layer
- [ ] **Tahap 9**: CRUD Transaksi & Upload Engine
- [ ] **Tahap 10**: Interactive Dashboard & Summary Cards
- [ ] **Tahap 11**: Interactive Charts & Analytics (Recharts)
- [ ] **Tahap 12**: Real-time Data Table Search & Sorting (TanStack Table)
- [ ] **Tahap 13**: Advanced Filter Engine
- [ ] **Tahap 14**: Export Engine - ExcelJS Integrator
- [ ] **Tahap 15**: Export Engine - PDF Document Generator
- [ ] **Tahap 16**: Bukti Transaksi Attachment & Cloud Storage
- [ ] **Tahap 17**: Vercel Deployment & Production Optimization
