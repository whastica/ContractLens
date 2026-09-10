import type { AnalysisResult } from "@/hooks/useAnalysis";

// Colors matching our navy/gold palette
const COLORS = {
  primary: [37, 99, 235] as [number, number, number],
  accent: [212, 168, 67] as [number, number, number],
  dark: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  destructive: [225, 29, 72] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightGray: [241, 245, 249] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: "CRITICO",
  review: "REVISION",
  ok: "OK",
  undetermined: "SIN DETERMINAR",
};

const SEVERITY_COLORS: Record<string, [number, number, number]> = {
  critical: COLORS.destructive,
  review: COLORS.warning,
  ok: COLORS.success,
  undetermined: COLORS.muted,
};

function downloadPDF(doc: ReturnType<typeof import("jspdf")["default"]>, filename: string) {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    doc.save(filename);
  }
}

export async function exportAnalysisToPDF(
  result: AnalysisResult,
  contractName?: string
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Helper: check page break ────────────────────────────────────────
  function checkPageBreak(needed: number) {
    if (y + needed > 270) {
      doc.addPage();
      y = margin;
    }
  }

  // ─── Helper: draw section title ──────────────────────────────────────
  function drawSectionTitle(title: string) {
    checkPageBreak(20);
    y += 6;
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(margin, y, contentWidth, 8, 1, 1, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 4, y + 5.5);
    y += 14;
  }

  // ─── Cover page ──────────────────────────────────────────────────────
  // Header bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INFORME DE PREAUDITORIA", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Analisis contractual asistido por IA", pageWidth / 2, 28, {
    align: "center",
  });

  // Gold accent line
  doc.setFillColor(...COLORS.accent);
  doc.rect(margin, 50, contentWidth, 1.5, "F");

  y = 62;

  // Contract name
  if (contractName) {
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(contractName, pageWidth / 2, y, { align: "center" });
    y += 10;
  }

  // Metadata table
  const meta = [
    ["Tipo de contrato", result.classification.type.replace(/_/g, " ")],
    ["Confianza de clasificacion", `${(result.classification.confidence * 100).toFixed(0)}%`],
    ["Razonamiento", result.classification.reasoning],
    ["Partes identificadas", String(result.structure.parties.length)],
    ["Clausulas extraidas", String(result.clauses.length)],
    ["Hallazgos totales", String(result.findings.length)],
    [
      "Hallazgos criticos",
      String(result.findings.filter((f) => f.severity === "critical").length),
    ],
    [
      "Para revision",
      String(result.findings.filter((f) => f.severity === "review").length),
    ],
    [
      "Sin observaciones",
      String(result.findings.filter((f) => f.severity === "ok").length),
    ],
    [
      "Fecha de analisis",
      new Date().toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    ],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Campo", "Valor"]],
    body: meta,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: COLORS.lightGray },
    tableWidth: "auto",
  });

  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;

  // ─── Contract Structure ──────────────────────────────────────────────
  drawSectionTitle("ESTRUCTURA DEL CONTRATO");

  const { structure } = result;

  // Parties
  if (structure.parties.length > 0) {
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Partes:", margin, y);
    y += 5;

    for (const party of structure.parties) {
      checkPageBreak(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.muted);
      doc.text("-", margin + 2, y);
      doc.setTextColor(...COLORS.dark);
      doc.text(`${party.name} (${party.role})`, margin + 6, y);
      y += 5;
    }
    y += 3;
  }

  // Info fields
  const infoFields = [
    ["Duracion", structure.duration],
    ["Valor total", structure.totalValue],
    ["Forma de pago", structure.paymentTerms],
    ["Renovacion", structure.renewalTerms],
    ["Terminacion", structure.terminationTerms],
    ["Jurisdiccion", structure.jurisdiction],
  ].filter(([, value]) => value);

  if (infoFields.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Campo", "Detalle"]],
      body: infoFields.map(([label, value]) => [label, value!]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: COLORS.dark,
        textColor: COLORS.white,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: COLORS.lightGray },
      tableWidth: "auto",
    });

    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 8;
  }

  // Key obligations
  if (structure.keyObligations.length > 0) {
    checkPageBreak(15);
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Obligaciones principales:", margin, y);
    y += 6;

    for (const obligation of structure.keyObligations) {
      checkPageBreak(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.muted);
      doc.text("-", margin + 2, y);
      doc.setTextColor(...COLORS.dark);
      const lines = doc.splitTextToSize(obligation, contentWidth - 10);
      doc.text(lines, margin + 6, y);
      y += lines.length * 4 + 2;
    }
    y += 3;
  }

  // ─── Findings ────────────────────────────────────────────────────────
  if (result.findings.length > 0) {
    doc.addPage();
    y = margin;

    drawSectionTitle("HALLAZGOS DE ANALISIS");

    for (const finding of result.findings) {
      checkPageBreak(40);

      const severityColor = SEVERITY_COLORS[finding.severity] ?? COLORS.muted;

      // Severity badge
      doc.setFillColor(...severityColor);
      doc.roundedRect(margin, y, 22, 6, 1, 1, "F");
      doc.setTextColor(...COLORS.white);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(
        SEVERITY_LABEL[finding.severity] ?? finding.severity.toUpperCase(),
        margin + 11,
        y + 4,
        { align: "center" }
      );

      // Title
      doc.setTextColor(...COLORS.dark);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(finding.title, margin + 25, y + 4.5);

      // Category
      doc.setTextColor(...COLORS.muted);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        finding.category.replace(/_/g, " ") +
          (finding.clauseReference ? ` - ${finding.clauseReference}` : ""),
        margin,
        y + 11
      );

      y += 15;

      // Evidence
      if (finding.evidenceText) {
        checkPageBreak(20);
        doc.setFillColor(...COLORS.lightGray);
        const evidenceLines = doc.splitTextToSize(
          finding.evidenceText,
          contentWidth - 12
        );
        const evidenceHeight = Math.min(evidenceLines.length * 4, 24);
        doc.roundedRect(margin, y, contentWidth, evidenceHeight + 4, 1, 1, "F");

        doc.setFillColor(...COLORS.primary);
        doc.rect(margin, y, 1.5, evidenceHeight + 4, "F");

        doc.setTextColor(...COLORS.muted);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(evidenceLines.slice(0, 6), margin + 5, y + 4);
        y += evidenceHeight + 8;
      }

      // Explanation
      if (finding.explanation) {
        checkPageBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.dark);
        doc.text("Que detectamos:", margin, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const expLines = doc.splitTextToSize(finding.explanation, contentWidth - 4);
        doc.text(expLines, margin + 2, y);
        y += expLines.length * 3.5 + 3;
      }

      // Recommendation
      if (finding.recommendation) {
        checkPageBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.primary);
        doc.text("Recomendacion:", margin, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.dark);
        const recLines = doc.splitTextToSize(finding.recommendation, contentWidth - 4);
        doc.text(recLines, margin + 2, y);
        y += recLines.length * 3.5 + 3;
      }

      // Legal reference
      if (finding.legalReference) {
        checkPageBreak(8);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.muted);
        doc.text(`Ref: ${finding.legalReference}`, margin + 2, y);
        y += 5;
      }

      // Separator
      y += 3;
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    }
  }

  // ─── Clauses ─────────────────────────────────────────────────────────
  if (result.clauses.length > 0) {
    doc.addPage();
    y = margin;

    drawSectionTitle("CLAUSULAS EXTRAIDAS");

    autoTable(doc, {
      startY: y,
      head: [["#", "Titulo", "Categoria", "Resumen"]],
      body: result.clauses.map((c, i) => [
        c.clauseNumber ?? String(i + 1),
        c.title,
        (c.category ?? "-").replace(/_/g, " "),
        c.summary ?? "-",
      ]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: COLORS.lightGray },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: "auto" },
      },
    });
  }

  // ─── Disclaimer (last page) ──────────────────────────────────────────
  checkPageBreak(30);
  y += 10;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.muted);
  doc.text(
    "Este informe es preliminar y no sustituye asesoria juridica profesional.",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text(
    "Los resultados dependen de la calidad del texto proporcionado y del modelo de IA utilizado.",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text(
    `Generado por ContractLens - ${new Date().toLocaleDateString("es-CO")}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );

  // ─── Save ────────────────────────────────────────────────────────────
  const filename = `ContractLens_${(contractName ?? "informe")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .slice(0, 50)}_${new Date().toISOString().slice(0, 10)}.pdf`;

  downloadPDF(doc, filename);
}
