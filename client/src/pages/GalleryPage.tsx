import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download, Heart, Search, Trash2 } from "lucide-react";
import { api, downloadUrl } from "../api/http";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { Input } from "../components/ui/Input";
import type { FontAsset } from "../types";

export function GalleryPage() {
  const [fonts, setFonts] = useState<FontAsset[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.fonts().then(setFonts);
  }, []);

  const filtered = useMemo(
    () => fonts.filter((font) => font.name.toLowerCase().includes(query.toLowerCase())),
    [fonts, query]
  );

  async function remove(fontId: string) {
    await api.deleteFont(fontId);
    setFonts((items) => items.filter((item) => item.id !== fontId));
    toast.success("Font deleted");
  }

  async function toggleFavorite(font: FontAsset) {
    const updated = await api.favoriteFont(font.id, !font.favorite);
    setFonts((items) => items.map((item) => (item.id === font.id ? updated : item)));
  }

  async function rename(font: FontAsset) {
    const name = window.prompt("Rename font", font.name);
    if (!name) return;
    const updated = await api.renameFont(font.id, name);
    setFonts((items) => items.map((item) => (item.id === font.id ? updated : item)));
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Gallery</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold">Font gallery</h1>
          <p className="mt-3 text-ink/65 dark:text-paper/65">Search history, favorite styles, rename files, and track downloads.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45 dark:text-paper/45" />
          <Input className="pl-11" placeholder="Search fonts" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((font) => (
          <GlassCard key={font.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <button onClick={() => rename(font)} className="text-left">
                <h2 className="text-xl font-extrabold">{font.name}</h2>
                <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">{new Date(font.created_at).toLocaleDateString()}</p>
              </button>
              <button onClick={() => toggleFavorite(font)} className={`grid h-10 w-10 place-items-center rounded-lg ${font.favorite ? "bg-coral text-white" : "hover:bg-ink/5 dark:hover:bg-white/10"}`}>
                <Heart className="h-5 w-5" fill={font.favorite ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="font-preview mt-6 text-4xl font-black">Aa Bb Cc</p>
            <p className="mt-4 text-sm text-ink/55 dark:text-paper/55">{font.download_count} downloads</p>
            <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
              <a href={downloadUrl(font.ttf_url)} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4" /> TTF
                </Button>
              </a>
              <Button variant="danger" onClick={() => remove(font.id)} aria-label="Delete font">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
      {!filtered.length ? (
        <GlassCard className="p-8 text-center">
          <p className="font-bold">No fonts found</p>
          <p className="mt-2 text-sm text-ink/55 dark:text-paper/55">Generate a new font or adjust your search query.</p>
        </GlassCard>
      ) : null}
    </div>
  );
}
