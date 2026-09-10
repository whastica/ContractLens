"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-heading text-2xl font-700">Algo salió mal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ocurrió un error inesperado. Por favor, intenta de nuevo.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground">
              Error: {error.digest}
            </p>
          )}
          <Button onClick={reset} className="mt-6 bg-brand-500 hover:bg-brand-600 text-white">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
