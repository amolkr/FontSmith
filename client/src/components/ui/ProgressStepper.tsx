import { Check, Circle } from "lucide-react";

export function ProgressStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="grid gap-3">
      {steps.map((step, index) => {
        const complete = index < current;
        const active = index === current;
        return (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition ${
              active
                ? "border-sea bg-sea/10 text-sea"
                : complete
                  ? "border-brass/40 bg-brass/10 text-brass"
                  : "border-ink/10 bg-white/50 text-ink/50 dark:border-white/10 dark:bg-white/5 dark:text-paper/45"
            }`}
          >
            {complete ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            <span className="text-sm font-bold">{step}</span>
          </div>
        );
      })}
    </div>
  );
}

