import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { AdminNavTabs } from "./AdminNavTabs";
import { Analytics } from "@vercel/analytics/next"

export const metadata = { title: "لوحة التحكم — شوشو كلينك" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  return (
    <div className="min-h-screen bg-cream-100">
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

        <AdminNavTabs role={role ?? "user"} />
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}