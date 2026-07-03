import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Heart, History, Plus, Upload } from "lucide-react";
import { api } from "../api/http";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import type { FontAsset, HistoryEvent } from "../types";

export function Dashboard() {
  const [fonts, setFonts] = useState<FontAsset[]>([]);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [stats, setStats] = useState({ fontsCreated: 0, downloads: 0, favorites: 0, plan: "Creator" });

  useEffect(() => {
    Promise.all([api.fonts(), api.history(), api.stats()]).then(([fontRows, events, userStats]) => {
      setFonts(fontRows);
      setHistory(events);
      setStats(userStats);
    });
  }, []);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold">Open handwriting studio</h1>
          <p className="mt-3 text-ink/65 dark:text-paper/65">Upload samples, generate new fonts, and manage your handwriting library.</p>
        </div>
        <Link to="/upload">
          <Button>
            <Plus className="h-4 w-4" /> Generate new font
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Previous fonts", value: stats.fontsCreated, icon: History },
          { label: "Downloads", value: stats.downloads, icon: Download },
          { label: "Favorites", value: stats.favorites, icon: Heart },
          { label: "Workspace", value: stats.plan, icon: Upload }
        ].map(({ label, value, icon: Icon }) => (
          <GlassCard key={label} className="p-5">
            <Icon className="h-5 w-5 text-sea" />
            <p className="mt-5 text-3xl font-extrabold">{value}</p>
            <p className="text-sm text-ink/55 dark:text-paper/55">{label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold">Recent fonts</h2>
            <Link to="/gallery" className="text-sm font-bold text-coral">
              View gallery
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {(fonts.length ? fonts.slice(0, 5) : []).map((font) => (
              <div key={font.id} className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/45 p-4 dark:border-white/10 dark:bg-white/5">
                <div>
                  <p className="font-bold">{font.name}</p>
                  <p className="text-sm text-ink/55 dark:text-paper/55">{font.download_count} downloads</p>
                </div>
                <span className="rounded-md bg-sea/15 px-3 py-1 text-xs font-bold text-sea">{font.status}</span>
              </div>
            ))}
            {!fonts.length ? (
              <div className="rounded-lg border border-dashed border-ink/20 p-8 text-center dark:border-white/20">
                <p className="font-bold">No fonts yet</p>
                <p className="mt-2 text-sm text-ink/55 dark:text-paper/55">Upload a handwriting sample to create your first font.</p>
              </div>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-extrabold">Download history</h2>
          <div className="mt-5 grid gap-3">
            {history.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-lg border border-ink/10 bg-white/45 p-4 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="font-bold capitalize">{event.action.replaceAll("_", " ")}</p>
                <p className="mt-1 text-ink/55 dark:text-paper/55">{new Date(event.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {!history.length ? <p className="text-sm text-ink/55 dark:text-paper/55">Generation and download events will appear here.</p> : null}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
