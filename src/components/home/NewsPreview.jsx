import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { NEWS } from "../../data/news";
import SectionTitle from "../common/SectionTitle";
import { formatDate } from "../../utils/helpers";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

export default function NewsPreview() {
  const { t, tr, lang } = useLanguage();
  const preview = NEWS.slice(0, 3);
  const locale = lang === "en" ? "en-GB" : "id-ID";

  return (
    <section className="bg-surface-muted py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <SectionTitle
            align="left"
            kicker={t("newsPreview.kicker")}
            title={t("newsPreview.title")}
            description={t("newsPreview.desc")}
          />
          <Link
            to="/news"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-500 transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:shadow-glow"
          >
            {t("newsPreview.allNews")}
            <FiArrowRight size={16} />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {preview.map((post) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-lg"
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
                <h3 className="mt-3 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-emerald-500">
                  {tr(post.title)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {tr(post.excerpt)}
                </p>
                <Link
                  to="/news"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500"
                >
                  {t("newsPreview.readMore")}
                  <FiArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
