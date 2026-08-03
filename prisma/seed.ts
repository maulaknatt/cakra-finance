import "dotenv/config";
import { PrismaClient, Role, EventStatus, TransactionType, IncomeCategory, ExpenseCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  await prisma.attachment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. Seed Users
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin Cakra",
      email: "admin@cakrafinance.org",
      username: "admin",
      password: defaultPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const bendahara = await prisma.user.create({
    data: {
      name: "Budi Bendahara",
      email: "bendahara@cakrafinance.org",
      username: "bendahara",
      password: defaultPassword,
      role: Role.BENDAHARA,
      isActive: true,
    },
  });

  const ketua = await prisma.user.create({
    data: {
      name: "Ahmad Ketua Organisasi",
      email: "ketua@cakrafinance.org",
      username: "ketua",
      password: defaultPassword,
      role: Role.KETUA,
      isActive: true,
    },
  });

  console.log("✅ Users created (Admin, Bendahara, Ketua)");

  // 2. Seed Events
  const event17Agustus = await prisma.event.create({
    data: {
      title: "Peringatan 17 Agustus 2026",
      description: "Peringatan Hari Kemerdekaan RI ke-81 dengan lomba antar RT & jalan sehat.",
      startDate: new Date("2026-08-10"),
      endDate: new Date("2026-08-18"),
      status: EventStatus.ONGOING,
      isActive: true,
      picName: "Rian Hidayat",
      createdById: admin.id,
    },
  });

  const eventSumpahPemuda = await prisma.event.create({
    data: {
      title: "Pentas Seni Sumpah Pemuda",
      description: "Acara kebudayaan dan keharmonisan pemuda daerah.",
      startDate: new Date("2026-10-25"),
      endDate: new Date("2026-10-28"),
      status: EventStatus.DRAFT,
      isActive: true,
      picName: "Siti Rahma",
      createdById: admin.id,
    },
  });

  const eventBaktiSosial = await prisma.event.create({
    data: {
      title: "Bakti Sosial & Pengobatan Gratis",
      description: "Penyaluran sembako dan pelayanan kesehatan gratis untuk lansia.",
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-05-16"),
      status: EventStatus.COMPLETED,
      isActive: true,
      picName: "Doni Prasetyo",
      createdById: admin.id,
    },
  });

  console.log("✅ Events created");

  // 3. Seed Transactions
  const transactionsData = [
    // Event 17 Agustus (Pemasukan)
    {
      eventId: event17Agustus.id,
      type: TransactionType.INCOME,
      incomeCategory: IncomeCategory.SPONSOR,
      amount: 5000000,
      date: new Date("2026-08-01"),
      description: "Sponsor dari PT Indofood Utama",
      createdById: bendahara.id,
    },
    {
      eventId: event17Agustus.id,
      type: TransactionType.INCOME,
      incomeCategory: IncomeCategory.DONASI,
      amount: 2500000,
      date: new Date("2026-08-03"),
      description: "Donasi alumni kepemudaan",
      createdById: bendahara.id,
    },
    {
      eventId: event17Agustus.id,
      type: TransactionType.INCOME,
      incomeCategory: IncomeCategory.KAS_ANGGOTA,
      amount: 1200000,
      date: new Date("2026-08-05"),
      description: "Iuran bulanan kas pemuda bulan Juli-Agustus",
      createdById: bendahara.id,
    },
    // Event 17 Agustus (Pengeluaran)
    {
      eventId: event17Agustus.id,
      type: TransactionType.EXPENSE,
      expenseCategory: ExpenseCategory.HADIAH,
      amount: 1800000,
      date: new Date("2026-08-06"),
      description: "Pembelian piala dan hadiah perlombaan anak-anak",
      createdById: bendahara.id,
    },
    {
      eventId: event17Agustus.id,
      type: TransactionType.EXPENSE,
      expenseCategory: ExpenseCategory.KONSUMSI,
      amount: 1500000,
      date: new Date("2026-08-07"),
      description: "Snack dan nasi kotak rapat panitia",
      createdById: bendahara.id,
    },
    {
      eventId: event17Agustus.id,
      type: TransactionType.EXPENSE,
      expenseCategory: ExpenseCategory.DEKORASI,
      amount: 800000,
      date: new Date("2026-08-08"),
      description: "Pembelian bendera, spanduk, dan umbul-umbul",
      createdById: bendahara.id,
    },

    // Event Bakti Sosial (Pemasukan & Pengeluaran)
    {
      eventId: eventBaktiSosial.id,
      type: TransactionType.INCOME,
      incomeCategory: IncomeCategory.DONASI,
      amount: 10000000,
      date: new Date("2026-05-01"),
      description: "Penggalangan dana donatur bakti sosial",
      createdById: bendahara.id,
    },
    {
      eventId: eventBaktiSosial.id,
      type: TransactionType.EXPENSE,
      expenseCategory: ExpenseCategory.PERALATAN,
      amount: 6500000,
      date: new Date("2026-05-10"),
      description: "Pembelian 100 paket sembako",
      createdById: bendahara.id,
    },
    {
      eventId: eventBaktiSosial.id,
      type: TransactionType.EXPENSE,
      expenseCategory: ExpenseCategory.TRANSPORTASI,
      amount: 750000,
      date: new Date("2026-05-12"),
      description: "Sewa mobil pikap angkut sembako",
      createdById: bendahara.id,
    },
  ];

  for (const item of transactionsData) {
    await prisma.transaction.create({
      data: item,
    });
  }

  console.log("✅ Seed transactions created successfully!");
  console.log("🔑 Default credentials for testing:");
  console.log("   - Admin     : admin / password123");
  console.log("   - Bendahara : bendahara / password123");
  console.log("   - Ketua     : ketua / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
