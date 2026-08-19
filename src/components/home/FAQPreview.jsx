import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { FAQS } from "../../data/faq";
import Accordion from "../faq/Accordion";
import SectionTitle from "../common/SectionTitle";
import { fadeIn, fadeUp } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

export default function FAQPreview() {
  const { t } = useLanguage();
  const preview = FAQS.slice(0, 4);

  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle
          kicker={t("faqPreview.kicker")}
          title={t("faqPreview.title")}
          description={t("faqPreview.desc")}
        />

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12"
        >
          <Accordion items={preview} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 text-center"
        >
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-500 transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:shadow-glow"
          >
            {t("faqPreview.all")}
            <FiArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
