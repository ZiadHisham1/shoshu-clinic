import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isSlotsRoute = createRouteMatcher(["/admin/slots(.*)"]);
const isBookingsRoute = createRouteMatcher(["/admin/bookings(.*)"]);
const isAdminHome = createRouteMatcher(["/admin"]);

export default clerkMiddleware(async (auth, req) => {
  // ─── Any /admin/* route requires sign-in ───
  if (isAdminRoute(req)) {
    await auth.protect();
  }

  if (!isAdminRoute(req)) return;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  const isAdmin = role === "admin";
  const isManager = role === "manager";

  // ─── /admin/slots — ADMIN ONLY ───
  if (isSlotsRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/bookings", req.url));
  }

  // ─── /admin/bookings — admin OR manager ───
  if (isBookingsRoute(req) && !isAdmin && !isManager) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ─── /admin home — admin OR manager ───
  if (isAdminHome(req) && !isAdmin && !isManager) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};