export function SectionHeading({
  eyebrow,
  title,
  copy
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">{eyebrow}</p> : null}
      <h2 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-paper md:text-5xl">{title}</h2>
      {copy ? <p className="mt-4 text-base leading-7 text-ink/68 dark:text-paper/68 md:text-lg">{copy}</p> : null}
    </div>
  );
}

