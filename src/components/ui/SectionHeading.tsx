import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const SectionHeading = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn("text-xl font-extrabold text-foreground sm:text-2xl", className)}
    {...props}
  />
);

export default SectionHeading;
