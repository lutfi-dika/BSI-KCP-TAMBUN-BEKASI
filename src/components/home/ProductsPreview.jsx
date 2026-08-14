import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { FEATURED_PRODUCTS } from "../../data/products";
import SectionTitle from "../common/SectionTitle";
import { EASE, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

const ACCENT = {
  emerald: "from-emerald-400/20 to-emerald-600/5",
  gold: "from-gold-500/25 to-gold-500/5",
};

export default function ProductsPreview() {
  const { t, tr } = useLanguage();
  const [active, setActive] = useState("all");

  const categories = [
    { id: "all", label: { id: "Semua", en: "All" } },
    ...FEATURED_PRODUCTS.reduce((acc, p) => {
      const key = tr(p.category);
      if (!acc.some((c) => c.id === key)) {
        acc.push({ id: key, label: p.category });
      }
      return acc;
    }, []),
  ];

  const visible =
    active === "all"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => tr(p.category) === active);

  return (
    <section
      id="produk"
      className="relative isolate scroll-mt-24 overflow-hidden bg-surface py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[480px] w-[480px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%2300847D' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Cpath d='M42 14 L70 42 L42 70 L14 42 Z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker={t("products.kicker")}
          title={t("products.title")}
          description={t("products.desc")}
        />

        <div
          role="tablist"
          aria-label={t("products.categories")}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              id={`product-tab-${cat.id}`}
              aria-selected={active === cat.id}
              aria-controls="product-panel"
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                active === cat.id
                  ? "bg-emerald-500 text-white shadow-md"
                  : "border border-line-strong text-ink-mid hover:border-emerald-500 hover:text-emerald-500"
              }`}
            >
              {tr(cat.label)}
            </button>
          ))}
        </div>

        <div
          id="product-panel"
          role="tabpanel"
          aria-live="polite"
          className="mt-12"
        >
          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((product) => (
                <motion.div
                  key={product.name}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="h-full"
                >
                  <Link
                    to={product.href}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-xl"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${ACCENT[product.accent]}`}
                    />
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
                        {tr(product.category)}
                      </span>
                      <FiArrowUpRight
                        size={18}
                        className="text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-500"
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft">{tr(product.tagline)}</p>
                    <span className="mt-auto pt-6 text-xs font-semibold uppercase tracking-widest text-emerald-500/80 transition-colors group-hover:text-emerald-500">
                      {t("common.more")}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <p className="mt-10 text-center text-xs text-ink-faint">
          {t("products.footnote")}{" "}
          <a
            href="https://www.bankbsi.co.id"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-500 underline-offset-2 hover:underline"
          >
            bankbsi.co.id
          </a>{" "}
          {t("products.orCall")}
        </p>
      </div>
    </section>
  );
}
