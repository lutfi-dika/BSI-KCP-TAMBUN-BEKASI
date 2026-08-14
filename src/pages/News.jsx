import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { NEWS } from "../data/news";
import PageHeader from "../components/ui/PageHeader";
import CTA from "../components/home/CTA";
import Seo, { breadcrumb } from "../components/common/Seo";
import { formatDate } from "../utils/helpers";
import { fadeUp, staggerContainer } from "../utils/animation";
import { useLanguage } from "../context/languageContext";

export default function News() {
  const { t, tr, lang } = useLanguage();
  const locale = lang === "en" ? "en-GB" : "id-ID";

  return (
    <>
      <Seo
        title={t("seo.news.title")}
        description={t("seo.news.desc")}
        path="/news"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.news"), path: "/news" },
        ])}
      />
      <PageHeader
        kicker={t("news.kicker")}
        title={t("news.title")}
        description={t("news.desc")}
      />

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {NEWS.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeUp}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-900">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,163,157,0.4),transparent_55%)]" />
                  <span className="relative text-lg font-semibold text-white/90">
                    {tr(post.imageLabel)}
                  </span>
                  <span className="absolute left-4 top-4 rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-emerald-950">
                    {tr(post.category)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-1.5 text-xs text-ink-faint">
                    <FiCalendar size={13} />
                    {formatDate(post.date, locale)}
                  </p>
                  <h2 className="mt-3 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-emerald-500">
                    {tr(post.title)}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {tr(post.excerpt)}
                  </p>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500"
                  >
                    {t("news.contactLink")}
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <p className="mt-10 text-center text-xs text-ink-faint">
            {t("news.note")}
          </p>
        </div>
      </section>

      <CTA />
    </>
  );
}
