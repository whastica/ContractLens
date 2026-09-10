"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, X, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAX_CONTRACT_SIZE_MB } from "@/constants";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadZone({
  onFileSelect,
  selectedFile,
  onClear,
  disabled,
}: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        setError("Formato no soportado. Solo se aceptan archivos PDF y DOCX.");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > MAX_CONTRACT_SIZE_MB * 1024 * 1024) {
        setError(`El archivo supera el tamaño maximo de ${MAX_CONTRACT_SIZE_MB}MB.`);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled,
  });

  if (selectedFile) {
    const ext = selectedFile.name.split(".").pop()?.toUpperCase();
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {ext} - {formatFileSize(selectedFile.size)}
          </p>
        </div>
        {!disabled && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setError(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            isDragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">
          {isDragActive
            ? "Suelta el contrato aqui"
            : "Arrastra un contrato o haz clic para seleccionar"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF o DOCX (max. {MAX_CONTRACT_SIZE_MB}MB)
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
