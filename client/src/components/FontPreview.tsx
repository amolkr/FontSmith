import { PencilLine } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

export function FontPreview({ text, className = "" }: { text: string; className?: string }) {
  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="mb-5 flex items-center gap-3 text-sm font-bold text-coral">
        <PencilLine className="h-4 w-4" />
        Live font preview
      </div>
      <p className="font-preview break-words text-4xl font-black leading-tight text-ink dark:text-paper md:text-6xl">{text}</p>
      <div className="mt-6 grid grid-cols-6 gap-2 text-center text-xl font-black text-ink/70 dark:text-paper/70 md:grid-cols-13">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <span key={letter} className="rounded-md border border-ink/10 bg-white/45 py-2 dark:border-white/10 dark:bg-white/5">
            {letter}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

