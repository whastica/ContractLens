"use client";

import { useState, useCallback } from "react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useLastAnalysis } from "@/hooks/useLastAnalysis";
import { AnalysisSidebar } from "./AnalysisSidebar";
import { AnalysisLoader } from "./AnalysisLoader";
import { AnalysisResults } from "./AnalysisResults";
import { AnalysisEmpty } from "./AnalysisEmpty";

export function AnalysisContainer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [text, setText] = useState("");

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

  const handleAnalyze = async () => {
    await analyze(selectedFile, text);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setText("");
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
      <AnalysisSidebar
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
        onFileClear={() => setSelectedFile(null)}
        text={text}
        onTextChange={setText}
        onAnalyze={handleAnalyze}
        disabled={!selectedFile && text.trim().length < 100}
      />
    );
  }

  return <AnalysisEmpty />;
}
