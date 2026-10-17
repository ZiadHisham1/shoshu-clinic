"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  role: string;
}

export function AdminNavTabs({ role }: Props) {
  const pathname = usePathname();
  const isAdmin = role === "admin";

  const tabs = [
    { href: "/admin", label: "نظرة عامة", icon: CalendarCheck, exact: true },
    { href: "/admin/bookings", label: "الحجوزات", icon: CalendarCheck },
    // Only admins see slots management
    ...(isAdmin
      ? [{ href: "/admin/slots", label: "المواعيد", icon: Clock }]
      : []),
  ];

  return (
    <nav className="mx-auto flex max-w-[1200px] items-center gap-1 overflow-x-auto px-4 sm:px-6">
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 font-lalezar text-sm transition sm:px-4 sm:py-3 sm:text-base",
              active
                ? "border-figma-header text-figma-header"
                : "border-transparent text-ink/60 hover:text-ink"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}