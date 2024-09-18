import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { session, response } = await updateSession(request);
  const url = request.nextUrl.clone();

  // Protege la ruta `/dashboard`
  if (url.pathname === "/dashboard" && !session) {
    // Redirige al login si no hay sesión activa
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirige a `/dashboard` si el usuario ya está autenticado y va a `/login`
  if (url.pathname === "/login" && session) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware solo a rutas que requieren protección.
     * Excluye archivos estáticos e imágenes.
     */
    "/dashboard",
    "/login",
  ],
};
