import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiClock, FiArrowRight } from "react-icons/fi";
import { CONTACT_INFO } from "../../data/contact";
import SectionTitle from "../common/SectionTitle";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

export default function ContactPreview() {
  const { t, tr } = useLanguage();

  const CARDS = [
    {
      Icon: FiMapPin,
      title: t("contact.address"),
      value: CONTACT_INFO.address,
    },
    {
      Icon: FiPhone,
      title: t("contact.phone"),
      value: CONTACT_INFO.phone,
    },
    {
      Icon: FiMail,
      title: t("contact.email"),
      value: CONTACT_INFO.email,
    },
    {
      Icon: FiClock,
      title: t("contact.hours"),
      value: tr(CONTACT_INFO.operationalHours),
    },
  ];

  return (
    <section id="kontak" className="scroll-mt-24 bg-surface-muted py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker={t("contactPreview.kicker")}
          title={t("contactPreview.title")}
          description={t("contactPreview.desc")}
        />

        <motion.div
          variants={staggerContainer(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CARDS.map(({ Icon, title, value }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-line/80 bg-surface-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 overflow-hidden rounded-2xl border border-line shadow-sm"
        >
          <iframe
            title={t("contact.mapTitle")}
            src={CONTACT_INFO.mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-[320px] w-full border-0"
          />
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgba(0,132,125,0.5)] transition-all duration-300 hover:bg-emerald-600 hover:shadow-[0_12px_40px_-12px_rgba(0,132,125,0.6)]"
          >
            {t("contactPreview.viewPage")}
            <FiArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
