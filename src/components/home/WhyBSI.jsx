import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiShield,
  FiSmartphone,
  FiHeart,
} from "react-icons/fi";
import SectionTitle from "../common/SectionTitle";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

const FEATURES = [
  {
    number: "01",
    Icon: FiBookOpen,
    titleKey: "why.feat1Title",
    textKey: "why.feat1Text",
  },
  {
    number: "02",
    Icon: FiShield,
    titleKey: "why.feat2Title",
    textKey: "why.feat2Text",
  },
  {
    number: "03",
    Icon: FiSmartphone,
    titleKey: "why.feat3Title",
    textKey: "why.feat3Text",
  },
  {
    number: "04",
    Icon: FiHeart,
    titleKey: "why.feat4Title",
    textKey: "why.feat4Text",
  },
];

export default function WhyBSI() {
  const { t } = useLanguage();

  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <SectionTitle
          kicker={t("why.kicker")}
          title={t("why.title")}
          description={t("why.desc")}
        />

        <motion.ol
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-14 max-w-5xl"
        >
          {FEATURES.map(({ number, Icon, titleKey, textKey }, index) => (
            <motion.li
              key={number}
              variants={fadeUp}
              className={`group grid grid-cols-[auto_1fr] items-start gap-6 py-8 sm:grid-cols-[64px_64px_1fr] sm:gap-8 ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <span
                aria-hidden
                className="text-4xl font-extrabold leading-none text-transparent transition-all duration-300 sm:text-5xl [-webkit-text-stroke:1.5px_var(--color-emerald-500)] group-hover:[-webkit-text-stroke:2px_var(--color-emerald-500)]"
              >
                {number}
              </span>
              <span className="hidden h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-glow sm:flex">
                <Icon size={22} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
                  {t(textKey)}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
