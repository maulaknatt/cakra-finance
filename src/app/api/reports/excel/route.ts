import { NextRequest, NextResponse } from "next/server";
import { TransactionRepository } from "@/repositories/transactionRepository";
import { EventRepository } from "@/repositories/eventRepository";
import { ExportService } from "@/services/exportService";
import { getSession } from "@/lib/auth";
import { TransactionType, IncomeCategory, ExpenseCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || undefined;
    const type = (searchParams.get("type") as TransactionType) || undefined;
    const incomeCategory = (searchParams.get("incomeCategory") as IncomeCategory) || undefined;
    const expenseCategory = (searchParams.get("expenseCategory") as ExpenseCategory) || undefined;
    const search = searchParams.get("search") || undefined;
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

    const transactions = await TransactionRepository.findAll({
      eventId,
      type,
      incomeCategory,
      expenseCategory,
      search,
      month,
      year,
    });

    let eventName = "Semua Event Kegiatan";
    if (eventId) {
      const evt = await EventRepository.findById(eventId);
      if (evt) eventName = evt.title;
    }

    const buffer = await ExportService.generateExcelBuffer(transactions, {
      eventName,
      periodStr: month && year ? `Bulan ${month} Tahun ${year}` : year ? `Tahun ${year}` : "Semua Periode",
    });

    const filename = `Laporan_Keuangan_Cakra_${Date.now()}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export excel error:", error);
    return NextResponse.json({ error: "Gagal membuat laporan Excel" }, { status: 500 });
  }
}
