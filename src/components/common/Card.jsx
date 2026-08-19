/**
 * Card — flexible container with modern glass/ghost/glow variants.
 */
export default function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  glass = false,
  as: Tag = "div",
}) {
  const classes = [
    "rounded-2xl border bg-surface-card p-6",
    glass
      ? "glass border-white/20 dark:border-white/8"
      : "border-line shadow-sm",
    hover &&
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-lg hover:border-emerald-500/20",
    glow && "glow-hover shadow-glow",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
