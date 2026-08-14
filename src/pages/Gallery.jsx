import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GALLERY } from "../data/gallery";
import PageHeader from "../components/ui/PageHeader";
import Seo, { breadcrumb } from "../components/common/Seo";
import { fadeUp, staggerContainer } from "../utils/animation";
import { useLanguage } from "../context/languageContext";

export default function Gallery() {
  const { t, tr } = useLanguage();
  const [selected, setSelected] = useState(null);

  const close = useCallback(() => setSelected(null), []);
  const next = useCallback(
    () => setSelected((cur) => (cur === null ? null : (cur + 1) % GALLERY.length)),
    [],
  );
  const prev = useCallback(
    () =>
      setSelected((cur) =>
        cur === null ? null : (cur - 1 + GALLERY.length) % GALLERY.length,
      ),
    [],
  );

  // Keyboard navigation + scroll lock while modal is open
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected, close, next, prev]);

  return (
    <>
      <Seo
        title={t("seo.gallery.title")}
        description={t("seo.gallery.desc")}
        path="/gallery"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.gallery"), path: "/gallery" },
        ])}
      />
      <PageHeader
        kicker={t("gallery.kicker")}
        title={t("gallery.title")}
        description={t("gallery.desc")}
      />

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={staggerContainer(0.06, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {GALLERY.map((item, index) => (
              <motion.button
                key={item.id}
                variants={fadeUp}
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`${t("gallery.open")} ${tr(item.title)}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.accent} transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                    {tr(item.category)}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-white">
                    {tr(item.title)}
                  </h2>
                </div>
              </motion.button>
            ))}
          </motion.div>

          <p className="mt-10 text-center text-xs text-ink-faint">
            {t("gallery.note")}
          </p>
        </div>
      </section>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={tr(GALLERY[selected].title)}
            onClick={close}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-10"
          >
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl"
            >
              <div className="overflow-hidden rounded-2xl border border-white/15">
                <div
                  className={`relative aspect-[16/10] bg-gradient-to-br ${GALLERY[selected].accent}`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center px-8">
                    <span className="text-center text-4xl font-bold text-white/25 sm:text-5xl">
                      {tr(GALLERY[selected].title)}
                    </span>
                  </div>
                </div>
              </div>

              <figcaption className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                    {tr(GALLERY[selected].category)}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {tr(GALLERY[selected].title)}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {tr(GALLERY[selected].caption)}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-white/40">
                  {selected + 1} / {GALLERY.length}
                </p>
              </figcaption>

              {/* Controls */}
              <button
                type="button"
                onClick={close}
                aria-label={t("gallery.close")}
                className="absolute -top-3 right-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <FiX size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label={t("gallery.prev")}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:-left-14"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label={t("gallery.next")}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:-right-14"
              >
                <FiChevronRight size={20} />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
