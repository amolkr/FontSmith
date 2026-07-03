import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sea via-brass to-coral text-ink shadow-glow hover:brightness-105 disabled:opacity-60",
  secondary:
    "border border-ink/10 bg-white/70 text-ink shadow-card hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-paper dark:hover:bg-white/15",
  ghost: "text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-white/10",
  danger: "bg-coral text-white hover:brightness-105"
};

export function Button({ children, className = "", variant = "primary", loading, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

