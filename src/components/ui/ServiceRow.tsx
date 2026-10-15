import { ChevronLeft, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { cardStyles } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  icon: LucideIcon;
  href?: string;
}

const ServiceRow = ({ title, subtitle, badge, icon: Icon, href = siteConfig.bookingUrl }: Props) => (
  <a href={href} className={cn(cardStyles(true), "flex min-h-[4.5rem] items-center bg-figma-tab border border-black/10 gap-4 p-3 pe-4")}>
    <span className="grid size-14 shrink-0 place-items-center rounded-full text-primary-strong">
      <Icon className="size-6" aria-hidden />
    </span>
    <span className="min-w-0 flex-1 text-start">
      <span className="block font-extrabold text-foreground">{title}</span>
      {subtitle && <span className="mt-0.5 block text-sm text-muted">{subtitle}</span>}
      {badge && <Badge className="mt-1.5">{badge}</Badge>}
    </span>
    {/* ChevronLeft points forward in RTL, so no mirroring is needed. */}
    <ChevronLeft className="size-5 shrink-0 text-muted" aria-hidden />
  </a>
);

export default ServiceRow;
