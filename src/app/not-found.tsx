import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10">
            <AlertTriangle className="h-8 w-8 text-brand-400" />
          </div>
          <h1 className="font-heading text-4xl font-700 gradient-text">404</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            La página que buscas no existe.
          </p>
          <Button asChild className="mt-6 bg-brand-500 hover:bg-brand-600 text-white">
            <Link href="/dashboard">Volver al dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
