import * as XLSX from "xlsx";

export function buildWorkbook(
  sheets: { name: string; rows: Record<string, unknown>[] }[]
): Buffer {
  const wb = XLSX.utils.book_new();
  for (const { name, rows } of sheets) {
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto column widths
    const cols = rows.length
      ? Object.keys(rows[0]).map((key) => ({
          wch: Math.max(
            key.length,
            ...rows.map((r) => String(r[key] ?? "").length)
          ) + 2,
        }))
      : [];
    ws["!cols"] = cols;

    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  }
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

export function xlsxResponse(buffer: Buffer, filename: string): Response {
  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
