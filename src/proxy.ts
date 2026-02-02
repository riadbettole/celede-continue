import { auth } from "@/shared/lib/auth/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  const isAuthenticated = !!session?.user;
  
  const privateRoutes = [
    "/dashboard",
  ];
  
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  
  
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  

  if (isPrivateRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/?callbackUrl=${callbackUrl}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};