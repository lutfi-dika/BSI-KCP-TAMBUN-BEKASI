/**
 * Section title — kicker badge + heading + optional description.
 * Used as the consistent header for every section on the site.
 */
export default function SectionTitle({
  kicker,
  title,
  description,
  align = "center",
}) {
  const alignClass =
    align === "center" ? "mx-auto text-center items-center" : "text-left items-start";

  return (
    <div className={`flex max-w-3xl flex-col ${alignClass}`}>
      {kicker && (
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {kicker}
        </span>
      )}
      <h2 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.5rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
