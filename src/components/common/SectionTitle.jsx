/**
 * Section title — kicker badge + heading + optional description.
 * Modern design with gradient text option and animated kicker.
 */
export default function SectionTitle({
  kicker,
  title,
  description,
  align = "center",
  gradient = false,
}) {
  const alignClass =
    align === "center"
      ? "mx-auto text-center items-center"
      : "text-left items-start";

  return (
    <div className={`flex max-w-4xl flex-col ${alignClass}`}>
      {kicker && (
        <span className="group inline-flex items-center gap-2.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.07] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {kicker}
        </span>
      )}
      <h2
        className={`mt-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.6rem] ${
          gradient
            ? "gradient-text"
            : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
