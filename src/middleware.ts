import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDashboardRoute = path.startsWith("/dashboard");
  const isLoginRoute = path === "/login" || path === "/";

  const sessionCookie = request.cookies.get("cakra_session")?.value;
  const session = sessionCookie ? await decryptToken(sessionCookie) : null;

  // 1. Proteksi Rute Dashboard (Wajib Login)
  if (isDashboardRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Jika sudah Login dan membuka /login -> Redirect ke Dashboard
  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Proteksi Rute Khusus Admin (/dashboard/users)
  if (path.startsWith("/dashboard/users") && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
