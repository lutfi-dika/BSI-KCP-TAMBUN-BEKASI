import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMessageCircle, FiX, FiLoader } from "react-icons/fi";
import { usePublicData } from "../hooks/usePublicData";
import PageHeader from "../components/ui/PageHeader";
import CTA from "../components/home/CTA";
import Seo, { breadcrumb } from "../components/common/Seo";
import { fadeUp } from "../utils/animation";
import { useLanguage } from "../context/languageContext";

export default function FAQ() {
  const { t, tr } = useLanguage();
  const [query, setQuery] = useState("");
  const { data: faqs, loading, error } = usePublicData("/faqs", []);
  const [activeId, setActiveId] = useState(null);

  // Set the first active ID when data finishes loading
  useEffect(() => {
    if (faqs && faqs.length > 0 && !activeId) {
      setActiveId(faqs[0].id);
    }
  }, [faqs, activeId]);

  const filteredFaqs = useMemo(() => {
    if (!faqs) return [];
    if (!query) return faqs;
    const lower = query.toLowerCase();
    return faqs.filter(
      (f) =>
        tr(f.question).toLowerCase().includes(lower) ||
        tr(f.answer).toLowerCase().includes(lower),
    );
  }, [faqs, query, tr]);

  // Generate structured data for SEO
  const faqSchema = useMemo(() => {
    if (!faqs) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: tr(f.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: tr(f.answer),
        },
      })),
    };
  }, [faqs, tr]);

  return (
    <>
      <Seo
        title={t("seo.faq.title")}
        description={t("seo.faq.desc")}
        path="/faq"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.faq"), path: "/faq" },
        ])}
      />
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}

      <PageHeader
        kicker={t("faq.kicker")}
        title={t("faq.title")}
        description={t("faq.desc")}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-faint">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("faq.searchPlaceholder")}
              className="w-full rounded-2xl border border-line-strong bg-surface-card py-4 pl-12 pr-12 text-base text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-ink-faint hover:text-ink"
                >
                  <FiX size={20} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {loading ? (
            <div className="mt-16 flex h-32 items-center justify-center">
              <FiLoader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : error ? (
            <div className="mt-16 text-center text-red-500">{error}</div>
          ) : (
            <div className="mt-12 flex flex-col gap-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    className="overflow-hidden rounded-2xl border border-line bg-surface-card transition-colors hover:border-emerald-500/30"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveId((cur) => (cur === faq.id ? null : faq.id))
                      }
                      className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left focus-visible:bg-surface-muted focus-visible:outline-none"
                    >
                      <span className="text-base font-semibold leading-snug text-ink">
                        {tr(faq.question)}
                      </span>
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-emerald-500 transition-transform duration-300">
                        <span
                          className={`absolute h-px w-3 bg-current transition-transform duration-300 ${
                            activeId === faq.id ? "rotate-180" : ""
                          }`}
                        />
                        <span
                          className={`absolute h-3 w-px bg-current transition-transform duration-300 ${
                            activeId === faq.id ? "rotate-90" : ""
                          }`}
                        />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {activeId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-ink-soft">
                            {tr(faq.answer)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-ink-faint">
                    <FiMessageCircle size={32} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-ink">
                    {t("faq.notFoundTitle")}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {t("faq.notFoundDesc")}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
