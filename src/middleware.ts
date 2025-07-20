import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(
    "__Secure-next-auth.session-token"
  )?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create-debate/:path*",
    "/debate/:path*",
    "/people/:path*",
    "/profile/:path*",
    "/scoreboard/:path*",
  ],
};
