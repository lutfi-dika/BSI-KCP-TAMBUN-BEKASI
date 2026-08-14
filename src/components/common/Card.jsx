/**
 * Card — flexible container used across sections & pages.
 * `hover` adds a subtle lift; `as` lets it render as <article>/<div>.
 */
export default function Card({
  children,
  className = "",
  hover = false,
  as: Tag = "div",
}) {
  const classes = [
    "rounded-2xl border border-line bg-surface-card p-6 shadow-sm",
    hover &&
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/20",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
