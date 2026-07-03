import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { HandwritingDemo } from "../components/HandwritingDemo";
import { PublicNav } from "../components/layout/PublicNav";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import { faqs, features, sampleFonts, testimonials } from "../data/mock";

export function Home() {
  return (
    <div className="min-h-screen bg-mesh-light text-ink dark:bg-mesh-dark dark:text-paper">
      <PublicNav />
      <main>
        <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="inline-flex rounded-lg border border-coral/30 bg-coral/10 px-4 py-2 text-sm font-bold text-coral">
              AI handwriting-to-font generator
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] text-ink dark:text-paper md:text-7xl">
              Turn Your Handwriting Into A Real Font
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70 dark:text-paper/70">
              Upload your handwriting, let AI analyze your writing style, and download a fully installable custom font.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/upload">
                <Button className="w-full sm:w-auto">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#process">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Play className="h-4 w-4" /> Live Demo
                </Button>
              </a>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-ink/70 dark:text-paper/70 sm:grid-cols-3">
              {["TTF + OTF export", "OpenCV cleanup", "MongoDB history"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sea" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          <HandwritingDemo />
        </section>

        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="Production tools for personal type" copy="Everything needed to move from a scanned page to a downloadable font asset." />
          <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, copy, icon: Icon }) => (
              <GlassCard key={title} className="p-6">
                <Icon className="h-8 w-8 text-sea" />
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className="mt-3 leading-7 text-ink/65 dark:text-paper/65">{copy}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="process" className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How it works" title="From messy scan to clean glyphs" />
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-4">
            {["Upload a template", "Clean the image", "Extract characters", "Generate font files"].map((step, index) => (
              <GlassCard key={step} className="p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink">{index + 1}</span>
                <h3 className="mt-5 text-lg font-extrabold">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65 dark:text-paper/65">
                  {index === 0 && "Drag in a PNG or JPG handwriting sample with clear character rows."}
                  {index === 1 && "OpenCV removes shadows, denoises, thresholds, and prepares contours."}
                  {index === 2 && "Characters are segmented, normalized, and saved as reusable glyph assets."}
                  {index === 3 && "fontTools exports installable TTF and OTF font files."}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="gallery" className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="Sample Fonts" copy="A few styles that show how personal handwriting can become a practical type system." />
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
            {sampleFonts.map((font) => (
              <GlassCard key={font.name} className="p-6">
                <p className="text-sm font-bold text-coral">{font.mood}</p>
                <h3 className="mt-3 font-display text-3xl font-extrabold">{font.name}</h3>
                <p className="mt-6 text-4xl font-black">Aa Bb Cc</p>
                <p className="mt-4 text-sm text-ink/55 dark:text-paper/55">{font.downloads.toLocaleString()} downloads</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="Loved by creative teams" />
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <GlassCard key={item.author} className="p-6">
                <p className="leading-7 text-ink/75 dark:text-paper/75">"{item.quote}"</p>
                <p className="mt-5 font-bold">{item.author}</p>
                <p className="text-sm text-coral">{item.role}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="FAQ" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4">
            {faqs.map((faq) => (
              <GlassCard key={faq.question} className="p-6">
                <h3 className="text-lg font-extrabold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-ink/65 dark:text-paper/65">{faq.answer}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-ink/10 px-4 py-10 text-center text-sm text-ink/60 dark:border-white/10 dark:text-paper/60">
        FontSmith. Built for handwriting, typography, and future AI font workflows.
      </footer>
    </div>
  );
}
