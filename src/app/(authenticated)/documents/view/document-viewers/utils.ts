export type FileType = "pdf" | "csv" | "excel" | "word" | "unknown";

export function detectFileType(
  fileName: string,
  mimeType = "",
  url = ""
): FileType {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const mime = mimeType.toLowerCase();
  const urlLower = url.toLowerCase();

  const typePatterns = {
    pdf: [
      () => mime.includes("pdf"),
      () => ext === "pdf",
      () => urlLower.includes(".pdf"),
    ],
    csv: [
      () => ext === "csv",
      () => mime.includes("csv"),
      () => urlLower.match(/\.csv($|\?)/) !== null,
    ],
    excel: [
      () =>
        mime.includes("excel") ||
        mime.includes("spreadsheet") ||
        mime.includes("xlsx") ||
        mime.includes("xls") ||
        mime.includes("sheet"),
      () => ["xlsx", "xls"].includes(ext),
      () => urlLower.match(/\.(xlsx|xls)($|\?)/) !== null,
    ],
    word: [
      () =>
        mime.includes("word") ||
        mime.includes("document") ||
        mime.includes("docx") ||
        mime.includes("doc"),
      () => ["docx", "doc", "rtf"].includes(ext),
      () => urlLower.match(/\.(docx|doc|rtf)($|\?)/) !== null,
    ],
  };

  for (const [type, checks] of Object.entries(typePatterns)) {
    if (checks.some((check) => check())) {
      return type as FileType;
    }
  }

  return "unknown";
}
