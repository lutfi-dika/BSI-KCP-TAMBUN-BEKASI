import { FiMapPin, FiPhone, FiMail, FiClock, FiExternalLink, FiLoader } from "react-icons/fi";
import { usePublicData } from "../hooks/usePublicData";
import PageHeader from "../components/ui/PageHeader";
import CTA from "../components/home/CTA";
import Seo, { breadcrumb } from "../components/common/Seo";
import { fadeUp, staggerContainer } from "../utils/animation";
import { motion } from "framer-motion";
import { useLanguage } from "../context/languageContext";

export default function Contact() {
  const { t, tr } = useLanguage();
  const { data: contactData, loading, error } = usePublicData("/contact", null);

  const CONTACT_INFO = contactData || {};
  const SOCIAL_LINKS = contactData?.SOCIAL_LINKS || {};

  const INFO = [
    {
      Icon: FiMapPin,
      title: t("contact.address"),
      value: CONTACT_INFO.address,
    },
    {
      Icon: FiPhone,
      title: t("contact.phone"),
      value: CONTACT_INFO.phone,
      href: CONTACT_INFO.phone ? `tel:${CONTACT_INFO.phone.replace(/[^\\d,]/g, "")}` : null,
    },
    {
      Icon: FiMail,
      title: t("contact.email"),
      value: CONTACT_INFO.email,
      href: CONTACT_INFO.email ? `mailto:${CONTACT_INFO.email}` : null,
    },
    {
      Icon: FiClock,
      title: t("contact.hours"),
      value: CONTACT_INFO.operationalHours ? tr(CONTACT_INFO.operationalHours) : "",
    },
  ];

  return (
    <>
      <Seo
        title={t("seo.contact.title")}
        description={t("seo.contact.desc")}
        path="/contact"
        jsonLd={breadcrumb([
          { name: t("nav.home"), path: "/" },
          { name: t("nav.contact"), path: "/contact" },
        ])}
      />
      <PageHeader
        kicker={t("contact.kicker")}
        title={t("contact.title")}
        description={t("contact.desc")}
      />

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <FiLoader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer(0.08, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {INFO.map(({ Icon, title, value, href }) => {
                  if (!value) return null;
                  const inner = (
                    <>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Icon size={20} />
                      </span>
                      <h2 className="mt-4 text-sm font-semibold text-ink">
                        {title}
                      </h2>
                      <p className="mt-1.5 break-words text-sm leading-relaxed text-ink-soft">
                        {value}
                      </p>
                    </>
                  );
                  const cls =
                    "block rounded-2xl border border-line bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";
                  return href ? (
                    <motion.a key={title} variants={fadeUp} href={href} className={cls}>
                      {inner}
                    </motion.a>
                  ) : (
                    <motion.div key={title} variants={fadeUp} className={cls}>
                      {inner}
                    </motion.div>
                  );
                })}
              </motion.div>

              {CONTACT_INFO.mapsEmbedUrl && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-10 overflow-hidden rounded-2xl border border-line shadow-sm"
                >
                  <iframe
                    title={t("contact.mapTitle")}
                    src={CONTACT_INFO.mapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="h-[420px] w-full border-0"
                  />
                </motion.div>
              )}

              <div className="mt-10 flex flex-col items-center gap-4 text-center">
                <p className="text-sm text-ink-soft">
                  {t("contact.orFollow")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {CONTACT_INFO.mapsLink && (
                    <a
                      href={CONTACT_INFO.mapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      <FiMapPin size={16} />
                      {t("contact.openMaps")}
                      <FiExternalLink size={14} />
                    </a>
                  )}
                  {[
                    { label: "Instagram", href: SOCIAL_LINKS.instagram },
                    { label: "Facebook", href: SOCIAL_LINKS.facebook },
                    { label: "YouTube", href: SOCIAL_LINKS.youtube },
                  ].map((s) => s.href ? (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-500 transition-colors hover:bg-emerald-500 hover:text-white"
                    >
                      {s.label}
                      <FiExternalLink size={14} />
                    </a>
                  ) : null)}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
