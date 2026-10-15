import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const Badge = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-strong",
      className,
    )}
    {...props}
  />
);

export default Badge;
