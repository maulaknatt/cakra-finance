import ExcelJS from "exceljs";
import { TransactionWithRelations } from "@/repositories/transactionRepository";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { INCOME_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS, APP_CONFIG } from "@/constants";

export class ExportService {
  static async generateExcelBuffer(
    transactions: TransactionWithRelations[],
    metaInfo?: { eventName?: string; periodStr?: string }
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = APP_CONFIG.name;
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Laporan Keuangan", {
      views: [{ showGridLines: true }],
    });

    // 1. Header Title
    worksheet.mergeCells("A1:G1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `${APP_CONFIG.organization.toUpperCase()} - ${APP_CONFIG.name.toUpperCase()}`;
    titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF065F46" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("A2:G2");
    const subtitleCell = worksheet.getCell("A2");
    subtitleCell.value = `LAPORAN KEUANGAN: ${metaInfo?.eventName || "SEMUA EVENT KEGIATAN"}`;
    subtitleCell.font = { name: "Arial", size: 11, bold: true };
    subtitleCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.mergeCells("A3:G3");
    const periodCell = worksheet.getCell("A3");
    periodCell.value = `Periode Cetak: ${metaInfo?.periodStr || formatTanggal(new Date(), "dd MMMM yyyy")}`;
    periodCell.font = { name: "Arial", size: 9, italic: true };
    periodCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.addRow([]); // Blank line

    // 2. Table Headers
    const headerRow = worksheet.addRow([
      "No",
      "Tanggal",
      "Event Kegiatan",
      "Jenis",
      "Kategori",
      "Keterangan / Rincian",
      "Nominal (Rp)",
    ]);

    headerRow.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFF" } };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF059669" }, // Emerald 600
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    let totalIncome = 0;
    let totalExpense = 0;

    // 3. Add Data Rows
    transactions.forEach((tx, idx) => {
      const isIncome = tx.type === "INCOME";
      const amt = Number(tx.amount);

      if (isIncome) totalIncome += amt;
      else totalExpense += amt;

      const categoryLabel = isIncome
        ? tx.incomeCategory
          ? INCOME_CATEGORY_LABELS[tx.incomeCategory]
          : "-"
        : tx.expenseCategory
        ? EXPENSE_CATEGORY_LABELS[tx.expenseCategory]
        : "-";

      const row = worksheet.addRow([
        idx + 1,
        formatTanggal(tx.date, "dd/MM/yyyy"),
        tx.event.title,
        isIncome ? "Pemasukan" : "Pengeluaran",
        categoryLabel,
        tx.description,
        amt,
      ]);

      row.font = { name: "Arial", size: 10 };
      row.getCell(1).alignment = { horizontal: "center" };
      row.getCell(2).alignment = { horizontal: "center" };
      row.getCell(4).alignment = { horizontal: "center" };
      row.getCell(7).numFmt = '"Rp"#,##0';
    });

    worksheet.addRow([]); // Blank line

    // 4. Summary Totals Section
    const incomeRow = worksheet.addRow(["", "", "", "", "", "TOTAL PEMASUKAN", totalIncome]);
    incomeRow.font = { bold: true, color: { argb: "FF065F46" } };
    incomeRow.getCell(7).numFmt = '"Rp"#,##0';

    const expenseRow = worksheet.addRow(["", "", "", "", "", "TOTAL PENGELUARAN", totalExpense]);
    expenseRow.font = { bold: true, color: { argb: "FF9F1239" } };
    expenseRow.getCell(7).numFmt = '"Rp"#,##0';

    const balanceRow = worksheet.addRow(["", "", "", "", "", "SALDO AKHIR", totalIncome - totalExpense]);
    balanceRow.font = { bold: true, size: 11 };
    balanceRow.getCell(7).numFmt = '"Rp"#,##0';

    // Auto fit column widths
    worksheet.columns.forEach((col) => {
      col.width = 20;
    });
    worksheet.getColumn(1).width = 6;
    worksheet.getColumn(2).width = 14;
    worksheet.getColumn(6).width = 35;

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
