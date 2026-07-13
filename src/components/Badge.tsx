interface Props {
  variant?: "category" | "tag";
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = "tag", className = "", children }: Props) {
  const base = "rounded-full border px-2 py-0.5 text-xs";
  const variantClass =
    variant === "category"
      ? "border-(--border-strong) bg-(--surface-muted)"
      : "border-(--border) text-(--text-muted)";

  return <span className={`${base} ${variantClass} ${className}`}>{children}</span>;
}
