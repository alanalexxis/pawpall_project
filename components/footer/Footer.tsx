"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="z-[3] items-center absolute bottom-5 left-0 right-0 mx-auto">
      <div className="flex flex-row justify-center">
        <Link href="/terms-of-service" passHref>
          <div className="mr-4 md:mr-[44px] text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm">
            Términos y condiciones
          </div>
        </Link>

        <Link href="/privacy-policy" passHref>
          <div className="mr-4 md:mr-[44px]">
            <div className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm">
              Política de privacidad
            </div>
          </div>
        </Link>

        <Link href="/cookie-policy" passHref>
          <div className="mr-4 md:mr-[44px]">
            <div className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm">
              Política de cookies
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
