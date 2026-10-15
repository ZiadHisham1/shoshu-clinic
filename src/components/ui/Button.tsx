import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold " +
  "transition duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-primary to-primary-strong text-white shadow-soft hover:shadow-lifted",
  secondary:
    "border border-border bg-surface text-primary-strong hover:border-primary",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
};

export const buttonStyles = ({ variant = "primary", size = "md" }: StyleProps = {}) =>
  cn(base, variants[variant], sizes[size]);

interface ButtonProps extends ComponentPropsWithoutRef<"button">, StyleProps {}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => (
  <button
    type="button"
    className={cn(buttonStyles({ variant, size }), className)}
    {...props}
  />
);

interface ButtonLinkProps extends ComponentPropsWithoutRef<"a">, StyleProps {}

export const ButtonLink = ({ variant, size, className, ...props }: ButtonLinkProps) => (
  <a className={cn(buttonStyles({ variant, size }), className)} {...props} />
);
