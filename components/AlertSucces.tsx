import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDemo({ description }: { description: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>¡Enhorabuena!</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
