import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

const SIGN_IN_URL = "/sign-in";
const SIGN_UP_URL = "/sign-up";
const DEFAULT_AFTER_SIGN_IN_URL = "/profile";
const AUTH_PATH_PREFIXES = [SIGN_IN_URL, SIGN_UP_URL];
const PROTECTED_PATH_PREFIXES = [DEFAULT_AFTER_SIGN_IN_URL, "/admin/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTH_PATH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isProtectedRoute = PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to default after sign in page, if user has session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(DEFAULT_AFTER_SIGN_IN_URL, req.url));
  }

  // Redirect to sign in page (with callback url if it's a protected route), if user doesn't have session
  if (isProtectedRoute && !session) {
    let callbackUrl = pathname;
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    const signInWithCallbackUrl = `${SIGN_IN_URL}?callbackUrl=${encodedCallbackUrl}`;

    return NextResponse.redirect(new URL(signInWithCallbackUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  // Match all routes except for static files and Next.js internal routes
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
