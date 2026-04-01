import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    if (path.startsWith("/admin")) {
      if (role !== "global_admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (path.startsWith("/ai")) {
      const perms = (token?.permissions as string[]) || [];
      if (!perms.includes("ai.chat.access") && !perms.includes("system.full_access")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/ai/:path*", "/student/:path*"],
};
