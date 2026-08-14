import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
  FiSmartphone,
  FiBriefcase,
  FiArrowRight,
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
};

/**
 * HelpTiles — "Ada yang Bisa Kami Bantu?" quick-intent picker, the same
 * job as the persona tiles (Individu / Bisnis / Kartu / Digital Banking)
 * on the official BSI homepage, scoped to this branch's site.
 */
export default function HelpTiles() {
  const { t, tr } = useLanguage();

  return (
    <section className="border-t border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          align="left"
          kicker={t("help.kicker")}
          title={t("help.title")}
          description={t("help.desc")}
        />

        <motion.div
          variants={staggerContainer(0.07, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {SERVICE_OVERVIEW.map((item) => {
            const Icon = ICONS[item.icon] ?? FiTrendingUp;
            return (
              <motion.div key={item.id} variants={fadeUp}>
                <Link
                  to={item.href}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line bg-surface-card px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:bg-surface-strong hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                    <Icon size={19} />
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {tr(item.title)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {t("help.see")}
                    <FiArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
