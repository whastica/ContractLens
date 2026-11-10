"use client";

import { useState, useCallback } from "react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useLastAnalysis } from "@/hooks/useLastAnalysis";
import { AnalysisSidebar } from "./AnalysisSidebar";
import { AnalysisLoader } from "./AnalysisLoader";
import { AnalysisResults } from "./AnalysisResults";
import { AnalysisEmpty } from "./AnalysisEmpty";
import { AREA_THEMES } from "@/constants";
import type { LegalArea } from "@/types";

export function AnalysisContainer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [area, setArea] = useState<LegalArea>("general");
  const [documentType, setDocumentType] = useState<string | null>(null);

  const { result: persistedResult, setResult, clearResult } = useLastAnalysis();

  const handleSuccess = useCallback(
    (result: Parameters<typeof setResult>[0]) => {
      setResult(result);
    },
    [setResult]
  );

  const { status, steps, uploadProgress, result, error, analyze, reset } =
    useAnalysis({ onSuccess: handleSuccess });

  const freshResult = status === "done" ? result : null;
  const activeResult = freshResult ?? (status === "idle" ? persistedResult : null);
  const showResults = !!(status === "done" && (freshResult || persistedResult));

  const theme = AREA_THEMES[area];

  const handleAreaChange = (newArea: LegalArea) => {
    setArea(newArea);
    setDocumentType(null);
  };

  const handleAnalyze = async () => {
    await analyze(selectedFile, text, undefined, area);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setText("");
    setArea("general");
    setDocumentType(null);
    clearResult();
  };

  // Show loader during analysis
  if (status === "uploading" || status === "analyzing") {
    return <AnalysisLoader steps={steps} uploadProgress={uploadProgress} status={status} />;
  }

  // Show results when done
  if (showResults && activeResult) {
    return <AnalysisResults result={activeResult} onReset={handleReset} />;
  }

  // Show error
  if (status === "error") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <h3 className="text-lg font-semibold text-destructive">
            Error en el analisis
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={handleReset}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // Show input form (idle state)
  if (status === "idle" && !activeResult) {
    return (
      <div
        className="rounded-2xl border transition-all duration-500 ease-in-out p-5 md:p-6"
        style={{
          background: theme.gradient,
          borderColor: theme.border,
          boxShadow: `0 0 40px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
      >
        <AnalysisSidebar
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onFileClear={() => setSelectedFile(null)}
          text={text}
          onTextChange={setText}
          area={area}
          onAreaChange={handleAreaChange}
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
          onAnalyze={handleAnalyze}
          disabled={!selectedFile && text.trim().length < 100}
        />
      </div>
    );
  }

  return <AnalysisEmpty />;
}
