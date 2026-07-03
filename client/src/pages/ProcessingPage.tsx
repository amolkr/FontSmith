import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "../api/http";
import { ProgressStepper } from "../components/ui/ProgressStepper";
import { GlassCard } from "../components/ui/GlassCard";
import { processingStages } from "../data/mock";

export function ProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { uploadId?: string; fontName?: string } | null;
  const [current, setCurrent] = useState(0);
  const [message, setMessage] = useState("Preparing handwriting sample");

  useEffect(() => {
    if (!state?.uploadId) return;
    const timer = window.setInterval(() => {
      setCurrent((value) => Math.min(value + 1, processingStages.length - 2));
    }, 850);

    async function run() {
      try {
        setMessage("Running OpenCV cleanup and glyph extraction");
        await api.process(state!.uploadId!);
        setCurrent(5);
        setMessage("Building installable TTF and OTF files");
        const font = await api.generate(state!.uploadId!, state?.fontName ?? "My FontSmith");
        setCurrent(processingStages.length - 1);
        setTimeout(() => navigate(`/result/${font.id}`, { state: { font } }), 600);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Processing failed");
        navigate("/upload");
      } finally {
        window.clearInterval(timer);
      }
    }

    run();
    return () => window.clearInterval(timer);
  }, [navigate, state]);

  if (!state?.uploadId) {
    return <Navigate to="/upload" replace />;
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-4xl place-items-center pb-24 lg:pb-0">
      <GlassCard className="w-full p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Processing</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold">Crafting your font</h1>
            <p className="mt-3 text-ink/65 dark:text-paper/65">{message}</p>
          </div>
          <Loader2 className="h-12 w-12 animate-spin text-sea" />
        </div>
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sea via-brass to-coral transition-all duration-500"
            style={{ width: `${((current + 1) / processingStages.length) * 100}%` }}
          />
        </div>
        <div className="mt-8">
          <ProgressStepper steps={processingStages} current={current} />
        </div>
      </GlassCard>
    </div>
  );
}
