import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

import { Button } from "../ui/button";

export default function Branding() {
  return (
    <section>
      <Button
        className={cn("transition-transform ease-in-out duration-300 mb-1")}
        variant="link"
        asChild
      >
        <div className="flex items-center gap-2">
          <PawPrint className="w-6 h-6 mr-0" strokeWidth={3} />
          <h1
            className={cn(
              "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 translate-x-0 opacity-100"
            )}
          >
            pawpal
          </h1>
        </div>
      </Button>
      <p className="text-lg opacity-80">Gestiona tus mascotas con facilidad.</p>
    </section>
  );
}
