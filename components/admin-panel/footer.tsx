import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          © 2023 Pawpal. Todos los derechos reservados. 2024-presente. Hecho con{" "}
          <Heart className="h-4 w-4 inline-block text-red-500" /> para mascotas
          de todo el mundo.
        </p>
      </div>
    </div>
  );
}
