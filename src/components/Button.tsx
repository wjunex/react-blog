import Link from "next/link";
import { type ButtonHTMLAttributes, type ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-(--accent) text-white hover:opacity-85",
  secondary:
    "border border-(--border-strong) bg-(--surface-muted) text-(--text) hover:bg-(--surface) hover:text-(--accent)",
  danger:
    "bg-(--syntax-red) text-white hover:opacity-85",
  ghost:
    "text-(--text-soft) hover:bg-(--surface-muted)",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-1.5 text-xs font-medium",
  md: "rounded-lg px-4 py-2 text-sm font-medium",
  lg: "rounded-lg px-6 py-2.5 text-sm font-semibold",
};

export function buttonClasses(variant: ButtonVariant, size: ButtonSize, className = "") {
  return `appearance-none inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

export default function Button({
  variant = "primary",
  size = "sm",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "sm",
  className = "",
  children,
  ...props
}: { variant?: ButtonVariant; size?: ButtonSize } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {children}
    </Link>
  );
}
