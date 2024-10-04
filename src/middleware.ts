import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: !(process.env.SECURE_COOKIE === "false"),
  });

  const auth = req.nextUrl.clone();
  auth.pathname = "/login";
  const afterAuth = req.nextUrl.clone();
  const home = req.nextUrl.clone();
  const evaluation = req.nextUrl.clone();
  home.pathname = "/";
  afterAuth.pathname = "/";
  evaluation.pathname = "/evaluation";

  const currentUrl = req.nextUrl.pathname;
  if (currentUrl.startsWith("/api/auth")) return NextResponse.next();

  if (!session && currentUrl !== "/login") {
    return NextResponse.redirect(auth);
  } else if (session && currentUrl === "/login") {
    return NextResponse.redirect(home);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
