import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Download, RefreshCcw, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { api, downloadUrl } from "../api/http";
import { FontPreview } from "../components/FontPreview";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { Input } from "../components/ui/Input";
import type { FontAsset } from "../types";

export function ResultPage() {
  const { fontId } = useParams();
  const location = useLocation();
  const [font, setFont] = useState<FontAsset | null>((location.state as { font?: FontAsset } | null)?.font ?? null);
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog");

  useEffect(() => {
    if (font) return;
    api.fonts().then((fonts) => setFont(fonts.find((item) => item.id === fontId) ?? fonts[0] ?? null));
  }, [font, fontId]);

  function share() {
    navigator.clipboard.writeText(window.location.href).then(() => toast.success("Result link copied"));
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Ready</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold">{font?.name ?? "Generated font"}</h1>
          <p className="mt-3 text-ink/65 dark:text-paper/65">Preview your alphabet, test custom text, and download installable font files.</p>
        </div>
        <Link to="/upload">
          <Button variant="secondary">
            <RefreshCcw className="h-4 w-4" /> Generate Again
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <FontPreview text="ABCDEFGHIJKLMNOPQRSTUVWXYZ" />
          <GlassCard className="p-6">
            <Input label="Editable text preview" value={previewText} onChange={(event) => setPreviewText(event.target.value)} />
            <p className="font-preview mt-6 break-words text-5xl font-black leading-tight">{previewText}</p>
          </GlassCard>
        </div>

        <GlassCard className="h-fit p-6">
          <h2 className="text-xl font-extrabold">Downloads</h2>
          <p className="mt-2 text-sm leading-6 text-ink/60 dark:text-paper/60">Use these files in design apps, operating systems, and editors that support custom fonts.</p>
          <div className="mt-6 grid gap-3">
            <a href={downloadUrl(font?.ttf_url)} target="_blank" rel="noreferrer">
              <Button className="w-full">
                <Download className="h-4 w-4" /> Download TTF
              </Button>
            </a>
            <a href={downloadUrl(font?.otf_url)} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="w-full">
                <Download className="h-4 w-4" /> Download OTF
              </Button>
            </a>
            <Button variant="ghost" onClick={share} className="w-full">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
          <div className="mt-6 rounded-lg border border-ink/10 bg-white/45 p-4 text-sm dark:border-white/10 dark:bg-white/5">
            <p className="font-bold">Generated alphabet preview</p>
            <p className="mt-3 break-words text-2xl font-black">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
