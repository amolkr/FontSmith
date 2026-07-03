import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { api } from "../api/http";
import { GlassCard } from "../components/ui/GlassCard";
import type { HistoryEvent } from "../types";

export function HistoryPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    api.history().then(setEvents);
  }, []);

  return (
    <div className="pb-24 lg:pb-0">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">History</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">Download history</h1>
      <div className="mt-8 grid gap-4">
        {events.map((event) => (
          <GlassCard key={event.id} className="flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-sea/15 text-sea">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold capitalize">{event.action.replaceAll("_", " ")}</p>
              <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </GlassCard>
        ))}
        {!events.length ? <GlassCard className="p-8 text-center text-ink/55 dark:text-paper/55">No events yet.</GlassCard> : null}
      </div>
    </div>
  );
}
