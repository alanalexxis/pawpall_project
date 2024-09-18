import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { session, response } = await updateSession(request);
  const url = request.nextUrl.clone();

  // Protege la ruta `/clasificador`
  if (url.pathname === "/dashboard" && !session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  // Redirige a `/clasificador` si el usuario ya está autenticado y va a `/login`
  if (url.pathname === "/login" && session) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas, excepto para:
     * - Archivos estáticos (_next/static)
     * - Archivos de optimización de imágenes (_next/image)
     * - Favicon (favicon.ico)
     * - Archivos con extensiones de imágenes (svg, png, jpg, etc.)
     * cambiar por la siguiente línea para aplicar el middleware solo a la ruta /clasificador| para mejorar el rendimiento
     * export const config = {
       matcher: ["/clasificador"],
};

     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
