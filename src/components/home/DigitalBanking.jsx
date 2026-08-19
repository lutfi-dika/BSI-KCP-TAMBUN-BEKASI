import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCreditCard,
  FiPlusCircle,
  FiEye,
  FiSmartphone,
} from "react-icons/fi";
import SectionTitle from "../common/SectionTitle";
import { fadeLeft, fadeRight, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

// Import gambar dari folder assets
import digitalBankingImg from "../../assets/digital-banking.png";

const FEATURES = [
  { Icon: FiArrowUpRight, labelKey: "digital.transferAccounts" },
  { Icon: FiCreditCard, labelKey: "digital.payment" },
  { Icon: FiEye, labelKey: "digital.checkBalance" },
  { Icon: FiPlusCircle, labelKey: "digital.topUpReload" },
  { Icon: FiSmartphone, labelKey: "digital.easyTransactions" },
];

export default function DigitalBanking() {
  const { t } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-surface-muted py-16 lg:py-20">
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] -z-10 h-[380px] w-[380px] rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Copy */}
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <SectionTitle
              align="left"
              kicker={t("digital.kicker")}
              title={t("digital.title")}
              description={t("digital.desc")}
            />

            <motion.ul
              variants={staggerContainer(0.08, 0.1)}
              className="mt-8 flex flex-col gap-3"
            >
              {FEATURES.map(({ Icon, labelKey }) => (
                <motion.li
                  key={labelKey}
                  variants={fadeRight}
                  className="flex items-center gap-3 rounded-xl border border-line/80 bg-surface-card/80 backdrop-blur-sm px-4 py-3 shadow-sm transition-all duration-300 hover:border-emerald-500/20 hover:shadow-glow"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Icon size={15} />
                  </span>
                  <span className="text-sm text-ink-strong">{t(labelKey)}</span>
                </motion.li>
              ))}
            </motion.ul>

            <p className="mt-6 text-xs text-ink-faint">
              {t("digital.footnote")}
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative mx-auto flex w-full max-w-[260px] justify-center"
          >
            <img
              src={digitalBankingImg}
              alt={t("digital.imageAlt")}
              loading="lazy"
              width={480}
              height={992}
              className="h-auto w-full max-w-[240px] object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}