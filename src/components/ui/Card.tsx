import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// Hover lift is CSS-only so cards can stay Server Components.
export const cardStyles = (interactive = false) =>
  cn(
    "rounded-xl border border-border bg-surface/80 shadow-soft",
    interactive &&
      "transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lifted " +
        "motion-reduce:hover:translate-y-0 focus-visible:outline-none " +
        "focus-visible:ring-2 focus-visible:ring-primary",
  );

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
}

const Card = ({ interactive, className, ...props }: CardProps) => (
  <div className={cn(cardStyles(interactive), className)} {...props} />
);

export default Card;
