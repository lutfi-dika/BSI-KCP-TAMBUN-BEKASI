import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiTruck,
  FiUsers,
  FiBriefcase,
  FiTrendingUp,
  FiSave,
  FiAward,
  FiStar,
  FiX,
  FiDownload,
  FiImage,
  FiFileText,
  FiSearch,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { usePublicData } from "../hooks/usePublicData";
import PageHeader from "../components/ui/PageHeader";
import SectionTitle from "../components/common/SectionTitle";
import SearchBar from "../components/common/SearchBar";
import CTA from "../components/home/CTA";
import Seo, { breadcrumb } from "../components/common/Seo";
import { fadeUp, staggerContainer } from "../utils/animation";
import { useLanguage } from "../context/languageContext";

const BROSUR_ICONS = {
  home: FiHome,
  truck: FiTruck,
  users: FiUsers,
  briefcase: FiBriefcase,
  trending: FiTrendingUp,
  save: FiSave,
  award: FiAward,
  star: FiStar,
};

const CATEGORY_ICONS = {
  pembiayaan: FiTrendingUp,
  pendanaan: FiSave,
  emas: FiAward,
};

function categoryById(id, categories) {
  return categories.find((c) => c.id === id);
}

function subcategoryById(cat, id) {
  return cat?.subcategories?.find((s) => s.id === id);
}

function countByCategory(categoryId, brochures) {
  return brochures.filter((b) => b.category === categoryId).length;
}

function buildHaystack(b, categories) {
  const cat = categoryById(b.category, categories);
  const sub = subcategoryById(cat, b.subcategory);
  return [
    b.title,
    b.description?.id ?? "",
    b.description?.en ?? "",
    cat?.title?.id ?? "",
    cat?.title?.en ?? "",
    sub?.title?.id ?? "",
    sub?.title?.en ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function BrochureModal({ brochure, categories, onClose, t, tr }) {
  const closeRef = useRef(null);
  const cat = categoryById(brochure.category, categories);
  const sub = subcategoryById(cat, brochure.subcategory);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const Icon = BROSUR_ICONS[brochure.icon] ?? FiFileText;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={brochure.title}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-elevated shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-surface-muted px-6 py-5">
          <div className="min-w-0">
            {cat && (
              <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
                {tr(cat.title)}
              </span>
            )}
            <h3 className="mt-2 text-xl font-bold leading-snug text-ink">
              {brochure.title}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("brosur.close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-surface-card text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            {tr(brochure.description)}
          </p>
          {sub && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
              {t("brosur.subcategory")}: {tr(sub.title)}
            </p>
          )}

          <div className="mt-5">
            {brochure.brochureUrl ? (
              <>
                <div className="overflow-hidden rounded-xl border border-line bg-surface-card">
                  <iframe
                    src={brochure.brochureUrl}
                    title={brochure.title}
                    className="h-[60vh] w-full"
                    loading="lazy"
                  />
                </div>
                <a
                  href={brochure.brochureUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <FiDownload size={15} />
                  {t("brosur.download")}
                </a>
              </>
            ) : brochure.image ? (
              <>
                <div className="overflow-hidden rounded-xl border border-line bg-surface-card">
                  <img
                    src={brochure.image}
                    alt={brochure.title}
                    className="h-[60vh] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <a
                  href={brochure.image}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <FiImage size={15} />
                  {t("brosur.downloadImage")}
                </a>
              </>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-surface-card px-6 py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Icon size={26} />
                </span>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {t("brosur.comingSoon")}
                </p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  {t("brosur.comingSoonDesc")}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

function BrochureCard({ brochure, categories, onOpen, t, tr }) {
  const cat = categoryById(brochure.category, categories);
  const sub = subcategoryById(cat, brochure.subcategory);
  const Icon = BROSUR_ICONS[brochure.icon] ?? FiFileText;

  return (
    <motion.article
      variants={fadeUp}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg focus-within:ring-2 focus-within:ring-emerald-500/30"
    >
      {/* Cover / thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface-muted">
        {brochure.image ? (
          <img
            src={brochure.image}
            alt={brochure.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/[0.08] via-surface-card to-gold-500/[0.08] transition-transform duration-500 group-hover:scale-[1.03]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
              <Icon size={26} />
            </span>
          </div>
        )}
        {cat && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
            {tr(cat.title)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-emerald-500">
          {brochure.title}
        </h3>
        {sub && (
          <span className="shrink-0 rounded-full border border-line-strong bg-surface-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-mid">
            {tr(sub.title)}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        {tr(brochure.description)}
      </p>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2 pt-5">
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-sm font-semibold text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white"
        >
          <FiFileText size={15} />
          {t("brosur.view")}
        </button>
        {brochure.brochureUrl || brochure.image ? (
          <a
            href={brochure.brochureUrl ?? brochure.image}
            download
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface-card px-4 py-2.5 text-sm font-semibold text-ink-strong transition-colors hover:border-emerald-500 hover:text-emerald-500"
          >
            {brochure.brochureUrl ? <FiDownload size={15} /> : <FiImage size={15} />}
            {brochure.brochureUrl ? t("brosur.download") : t("brosur.downloadImage")}
          </a>
        ) : (
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-4 py-2.5 text-xs font-medium text-ink-faint">
            {t("brosur.comingSoon")}
          </span>
        )}
      </div>
    </motion.article>
  );
}

export default function Brochures() {
  const { t, tr } = useLanguage();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const { data, loading, error } = usePublicData("/brochures", null);
  const categories = data?.categories || [];
  const brochures = data?.brochures || [];

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let result = brochures;
    if (q) result = result.filter((b) => buildHaystack(b, categories).includes(q));
    return result;
  }, [q, brochures, categories]);

  const grouped = !q;

  const resetAll = () => {
    setQuery("");
  };

  const countLabel = (n) =>
    n === 1 ? t("brosur.countOne") : t("brosur.countMany").replace("{n}", String(n));

  return (
    <>
      <Seo
        title={t("seo.brosur.title")}
        description={t("seo.brosur.desc")}
        path="/brosur"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.brosur"), path: "/brosur" },
        ])}
      />
      <PageHeader
        kicker={t("brosur.kicker")}
        title={t("brosur.title")}
        description={t("brosur.desc")}
      />

      {loading ? (
        <section className="bg-surface py-32">
          <div className="flex items-center justify-center">
            <FiLoader className="animate-spin text-emerald-500" size={32} />
          </div>
        </section>
      ) : error ? (
        <section className="bg-surface py-32">
          <div className="text-center text-red-500">{error}</div>
        </section>
      ) : (
        <>
          {/* Kategori utama */}
          <section className="bg-surface py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <SectionTitle
                kicker={t("brosur.categoriesKicker")}
                title={t("brosur.categoriesTitle")}
                description={t("brosur.categoriesDesc")}
              />

              <motion.div
                variants={staggerContainer(0.1, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3"
              >
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.id] ?? FiTrendingUp;
                  return (
                    <motion.div
                      key={cat.id}
                      variants={fadeUp}
                      className="group flex flex-col items-start rounded-2xl border border-line bg-surface-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                        <Icon size={22} />
                      </span>
                      <h3 className="mt-5 text-lg font-bold text-ink transition-colors group-hover:text-emerald-500">
                        {tr(cat.title)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {tr(cat.description)}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-mid">
                        {countLabel(countByCategory(cat.id, brochures))}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Pencarian, filter, dan daftar brosur */}
          <section
            id="brosur-results"
            className="scroll-mt-24 border-t border-line bg-surface-muted py-16 lg:py-20"
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="mx-auto max-w-xl">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder={t("brosur.searchPlaceholder")}
                />
              </div>

              {/* Hasil */}
              <div className="mt-10">
                {filtered.length > 0 ? (
                  grouped ? (
                    <div className="flex flex-col gap-12">
                      {categories.map((cat) => {
                        const items = brochures.filter((b) => b.category === cat.id);
                        if (items.length === 0) return null;

                        const hasSub =
                          cat.subcategories.length > 0 &&
                          cat.subcategories.some((s) =>
                            items.some((b) => b.subcategory === s.id)
                          );

                        return (
                          <div key={cat.id}>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-ink sm:text-2xl">
                                {tr(cat.title)}
                              </h3>
                              <span className="h-px flex-1 bg-line-strong" aria-hidden />
                              <span className="text-xs font-medium text-ink-faint">
                                {countLabel(items.length)}
                              </span>
                            </div>

                            {hasSub ? (
                              <div className="mt-8 flex flex-col gap-8">
                                {cat.subcategories.map((sub) => {
                                  const subItems = items.filter(
                                    (b) => b.subcategory === sub.id
                                  );
                                  if (subItems.length === 0) return null;
                                  return (
                                    <div key={sub.id}>
                                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600 dark:text-gold-500">
                                        {tr(sub.title)}
                                      </p>
                                      <motion.div
                                        variants={staggerContainer(0.08, 0.05)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, margin: "-60px" }}
                                        className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                      >
                                        {subItems.map((b) => (
                                          <BrochureCard
                                            key={b.id}
                                            brochure={b}
                                            categories={categories}
                                            onOpen={() => setActive(b)}
                                            t={t}
                                            tr={tr}
                                          />
                                        ))}
                                      </motion.div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <motion.div
                                variants={staggerContainer(0.08, 0.05)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-60px" }}
                                className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                              >
                                {items.map((b) => (
                                  <BrochureCard
                                    key={b.id}
                                    brochure={b}
                                    categories={categories}
                                    onOpen={() => setActive(b)}
                                    t={t}
                                    tr={tr}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <motion.div
                      variants={staggerContainer(0.06, 0.05)}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-60px" }}
                      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                      {filtered.map((b) => (
                        <BrochureCard
                          key={b.id}
                          brochure={b}
                          categories={categories}
                          onOpen={() => setActive(b)}
                          t={t}
                          tr={tr}
                        />
                      ))}
                    </motion.div>
                  )
                ) : (
                  <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface-card px-6 py-14 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <FiSearch size={24} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-ink">
                      {t("brosur.notFound")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {t("brosur.notFoundDesc")}
                    </p>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-2.5 text-sm font-semibold text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white"
                    >
                      <FiArrowRight size={15} />
                      {t("brosur.reset")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <CTA />

      <AnimatePresence>
        {active && (
          <BrochureModal
            brochure={active}
            categories={categories}
            onClose={() => setActive(null)}
            t={t}
            tr={tr}
          />
        )}
      </AnimatePresence>
    </>
  );
}
