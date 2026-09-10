import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { catchApiError, apiResponse, apiError } from "@/lib/api";
import { logger } from "@/lib/logger";

const MAX_SIZE_MB = Number(process.env.MAX_CONTRACT_SIZE_MB) || 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
};

export async function POST(request: NextRequest) {
  return catchApiError(async () => {
    const { userId } = await requireAuth();

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return apiError("BAD_REQUEST", "Se esperaba multipart/form-data");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("BAD_REQUEST", "No se proporcionó ningún archivo.");
    }

    // Validate file type
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isAccepted = Object.values(ACCEPTED_TYPES).some((exts) => exts.includes(ext));
    if (!isAccepted) {
      return apiError("BAD_REQUEST", `Tipo de archivo no soportado: ${ext}. Usa PDF o DOCX.`);
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return apiError("BAD_REQUEST", `El archivo supera el tamaño máximo de ${MAX_SIZE_MB}MB.`);
    }

    logger.info("Processing uploaded file", {
      fileName: file.name,
      fileType: ext,
      fileSize: file.size,
      userId,
    });

    // Extract text based on file type
    let text = "";
    let pages: number | undefined;

    if (ext === ".pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Dynamic import for pdf-parse
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
      pages = pdfData.numpages;
    } else if (ext === ".docx" || ext === ".doc") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Dynamic import for mammoth
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    if (!text || text.trim().length < 100) {
      return apiError(
        "UNPROCESSABLE",
        "No se pudo extraer suficiente texto del documento. Verifica que el archivo no esté vacío o sea una imagen escaneada."
      );
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    return apiResponse({
      text: text.trim(),
      metadata: {
        fileType: ext.replace(".", "") as "pdf" | "docx",
        fileName: file.name,
        fileSizeBytes: file.size,
        pages,
        wordCount,
        charCount,
      },
    });
  });
}
