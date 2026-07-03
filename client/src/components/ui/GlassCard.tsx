import type { HTMLAttributes } from "react";

export function GlassCard({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass rounded-lg shadow-card ${className}`} {...props} />;
}

