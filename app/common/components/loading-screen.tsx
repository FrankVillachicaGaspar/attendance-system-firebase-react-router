import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold tracking-tight">
          Cargando recursos...
        </h2>
        <p className="text-sm text-muted-foreground">
          Esto puede tomar unos segundos
        </p>
      </div>
    </div>
  );
}
