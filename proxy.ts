import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Instructor trying to access student routes
    if (path.startsWith("/student") && token?.role !== "student") {
      return NextResponse.redirect(new URL("/instructor/dashboard", req.url));
    }

    // Student trying to access instructor routes
    if (path.startsWith("/instructor") && token?.role !== "instructor") {
      return NextResponse.redirect(new URL("/student/assignments", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/instructor/:path*", "/student/:path*"],
};
