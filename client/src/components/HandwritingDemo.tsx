import { motion } from "framer-motion";

export function HandwritingDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/12 bg-ink/80 p-6 shadow-glow"
    >
      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="grid h-full content-center gap-6">
        <svg viewBox="0 0 760 260" className="h-auto w-full" role="img" aria-label="Animated handwriting">
          <path
            className="handwriting-stroke"
            d="M42 116 C92 28, 126 216, 176 102 S246 42, 282 118 S360 205, 392 102 C425 0, 492 50, 472 148 C456 228, 570 222, 610 118 C640 40, 715 64, 700 152"
            fill="none"
            stroke="#f7f3ea"
            strokeLinecap="round"
            strokeWidth="14"
          />
          <path d="M72 210 H690" stroke="#31c7b7" strokeDasharray="10 16" strokeLinecap="round" strokeWidth="4" />
        </svg>
        <div className="grid grid-cols-3 gap-3">
          {["Capture", "Vectorize", "Install"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-center text-sm font-bold text-paper">
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

