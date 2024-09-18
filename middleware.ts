import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const { session, response } = await updateSession(request);
  const url = request.nextUrl.clone();

  // Si no hay sesión, redirige al login
  if (!session) {
    if (url.pathname === "/dashboard" || url.pathname === "/admin/dashboard") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else {
    // Obtener el rango del usuario desde el perfil
    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("range")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return response;
    }

    const userRange = profile.range;

    // Redirige a `/admin/dashboard` si el rango es 2
    if (url.pathname === "/dashboard" && userRange === 2) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    // Redirige a `/dashboard` si el rango es 1 y está en `/login`
    if (url.pathname === "https://www.pawpal.site/login" && userRange === 1) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    // Redirige a `/dashboard` si el rango es 1 y está en `/login`
    if (url.pathname === "https://www.pawpal.site/login" && userRange === 2) {
      url.pathname = "admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
