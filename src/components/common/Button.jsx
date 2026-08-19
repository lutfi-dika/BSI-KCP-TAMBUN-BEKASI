import { Link } from "react-router-dom";

const VARIANTS = {
  primary:
    "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_8px_30px_-12px_rgba(0,132,125,0.5)] hover:shadow-[0_12px_40px_-12px_rgba(0,132,125,0.6)] hover:-translate-y-0.5",
  gradient:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-[0_8px_30px_-12px_rgba(0,132,125,0.5)] hover:shadow-[0_12px_40px_-12px_rgba(0,132,125,0.6)] hover:-translate-y-0.5",
  outline:
    "border border-white/70 text-white hover:bg-white/10 backdrop-blur-sm",
  outlineDark:
    "border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/50",
  ghost: "text-emerald-500 hover:bg-emerald-500/5",
  glass:
    "glass border-white/20 text-white hover:bg-white/20 backdrop-blur-xl",
};

const SIZES = {
  sm: "px-4 py-2.5 text-sm rounded-lg",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

/**
 * Reusable button with modern variants. Renders a <Link> when `to` is provided,
 * an <a> when `href` is provided, otherwise a <button>.
 */
export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}) {
  const classes = `inline-flex items-center justify-center font-semibold transition-all duration-300 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
