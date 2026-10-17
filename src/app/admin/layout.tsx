import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { CalendarCheck, Clock, LayoutDashboard } from "lucide-react";
import { AdminNavTabs } from "./AdminNavTabs";

export const metadata = { title: "لوحة التحكم — shima clinic" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* ═══════════ Top bar ═══════════ */}
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-lalezar text-lg font-bold text-ink sm:text-xl"
          >
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span>لوحة التحكم</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full bg-cream-50 px-3 py-1.5 font-lalezar text-xs text-ink/70 ring-1 ring-ink/10 transition hover:bg-cream-100 sm:inline-flex"
            >
              العودة للموقع
            </Link>
            <UserButton />
          </div>
        </div>

        {/* ═══════════ Nav tabs ═══════════ */}
        <AdminNavTabs />
      </header>

      {/* ═══════════ Page content ═══════════ */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}