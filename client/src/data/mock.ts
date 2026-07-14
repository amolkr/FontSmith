import { BadgeCheck, BrainCircuit, Download, ImagePlus, Sparkles, Wand2 } from "lucide-react";

export const features = [
  {
    title: "AI style analysis",
    copy: "Extracts spacing, pressure, slant, rhythm, and character proportions from real writing samples.",
    icon: BrainCircuit
  },
  {
    title: "Clean image pipeline",
    copy: "OpenCV removes background noise, shadows, and scan artifacts before glyph segmentation.",
    icon: ImagePlus
  },
  {
    title: "Installable font exports",
    copy: "Generate TTF and OTF files that work in design tools, word processors, and operating systems.",
    icon: Download
  },
  {
    title: "Editable previews",
    copy: "Test pangrams, brand phrases, signature blocks, and long passages before downloading.",
    icon: Wand2
  },
  {
    title: "Font history",
    copy: "Search, rename, favorite, download, and delete previous font generations from one studio.",
    icon: BadgeCheck
  },
  {
    title: "Future AI ready",
    copy: "Built for missing-character synthesis, multilingual expansion, and signature extraction.",
    icon: Sparkles
  }
];

export const processingStages = [
  "Uploading",
  "Cleaning image",
  "Removing background",
  "Detecting characters",
  "Extracting letters",
  "Generating vector glyphs",
  "Creating font",
  "Ready"
];

export const sampleFonts = [
  { name: "Avery Notes", mood: "Personal journal", downloads: 1842 },
  { name: "Studio Margin", mood: "Designer markup", downloads: 1264 },
  { name: "Mira Script", mood: "Warm signature", downloads: 974 }
];

export const testimonials = [
  {
    quote: "FontSmith turned a scanned notebook page into a brand font our campaign could actually install and ship.",
    author: "Leah Moreno",
    role: "Creative Director"
  },
  {
    quote: "The upload-to-preview flow feels polished, and the font history made iteration painless.",
    author: "Arjun Desai",
    role: "Product Designer"
  },
  {
    quote: "We used it for personalized worksheets. The generated alphabet preview helped us catch gaps early.",
    author: "Nina Shaw",
    role: "Education Founder"
  }
];

export const faqs = [
  {
    question: "Do I need to write every character?",
    answer: "A complete template gives the best result, but the pipeline is structured for future AI synthesis of missing glyphs."
  },
  {
    question: "Are the fonts installable?",
    answer: "Yes. FontSmith exports downloadable TTF and OTF files through the backend font generation service."
  },
  {
    question: "Can I delete generated fonts?",
    answer: "Yes. The dashboard includes history, favorites, renaming, download stats, and deletion controls."
  },
  {
    question: "Where does processing happen?",
    answer: "The FastAPI server performs upload validation, OpenCV image cleanup, glyph extraction, and font file generation."
  }
];