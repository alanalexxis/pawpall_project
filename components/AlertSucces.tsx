import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDemo({ description }: { description: string }) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>¡Enhorabuena!</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
