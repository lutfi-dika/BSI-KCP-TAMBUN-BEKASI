import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
  FiSmartphone,
  FiBriefcase,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { SERVICE_OVERVIEW } from "../../data/services";
import SectionTitle from "../common/SectionTitle";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

const ICONS = {
  wallet: FiDollarSign,
  hands: FiHeart,
  trending: FiTrendingUp,
  globe: FiGlobe,
  smartphone: FiSmartphone,
  briefcase: FiBriefcase,
  gem: FiZap,
};

export default function ServicesPreview() {
  const { t, tr } = useLanguage();
  const [featured, ...rest] = SERVICE_OVERVIEW;
  const FeaturedIcon = ICONS[featured.icon] ?? FiTrendingUp;

  return (
    <section id="layanan" className="scroll-mt-24 bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <SectionTitle
          kicker={t("servicesPreview.kicker")}
          title={t("servicesPreview.title")}
          description={t("servicesPreview.desc")}
        />

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {/* Featured service — large bento card */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-2 lg:row-span-2"
          >
            <Link
              to={featured.href}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/80 via-surface-card to-surface-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-lg sm:p-10 dark:from-surface-card dark:via-surface-card dark:to-surface-card"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl transition-transform duration-500 group-hover:scale-110" />
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-glow transition-all duration-300 group-hover:-translate-y-1">
                  <FeaturedIcon size={26} />
                </span>
                <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
                  {t("servicesPreview.featured")}
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-ink sm:text-3xl">
                  {tr(featured.title)}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-soft">
                  {tr(featured.description)}
                </p>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(0,132,125,0.5)] transition-all duration-300 group-hover:bg-emerald-600 group-hover:shadow-[0_12px_40px_-12px_rgba(0,132,125,0.6)]">
                  {t("common.more")}
                  <FiArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Supporting services */}
          {rest.map((cat) => {
            const Icon = ICONS[cat.icon] ?? FiTrendingUp;
            return (
              <motion.div key={cat.id} variants={fadeUp} className="h-full">
                <Link
                  to={cat.href}
                  className="group flex h-full flex-col rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-surface-strong/80 hover:shadow-glow-lg"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-glow">
                      <Icon size={20} />
                    </span>
                    <FiArrowRight
                      size={17}
                      className="text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-500"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">
                    {tr(cat.title)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {tr(cat.description)}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
