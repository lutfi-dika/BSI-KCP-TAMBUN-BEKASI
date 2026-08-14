import { Link } from "react-router-dom";

const VARIANTS = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600",
    outline: "border border-white/70 text-white hover:bg-white/10",
    outlineDark:
        "border border-emerald-500 text-emerald-500 hover:bg-emerald-500/5",
    ghost: "text-emerald-500 hover:bg-emerald-500/5",
};

const SIZES = {
    sm: "px-4 py-2.5 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-7 py-3.5 text-base",
};

/**
 * Reusable button. Renders a <Link> when `to` is provided,
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
    const classes = `inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

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
