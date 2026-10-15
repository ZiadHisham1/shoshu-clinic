import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",       // anything under /admin
  "/my-bookings(.*)", // customer's own bookings
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Not signed in → Clerk will redirect to sign-in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Admin-only: check role in public metadata
  if (isAdminRoute(req)) {
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};