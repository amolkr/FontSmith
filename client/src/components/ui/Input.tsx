import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink/80 dark:text-paper/80">
      {label ? <span>{label}</span> : null}
      <input
        className={`h-12 rounded-lg border border-ink/10 bg-white/70 px-4 text-ink outline-none transition placeholder:text-ink/40 focus:border-sea focus:ring-4 focus:ring-sea/15 dark:border-white/10 dark:bg-white/10 dark:text-paper dark:placeholder:text-paper/40 ${className}`}
        {...props}
      />
    </label>
  );
}

