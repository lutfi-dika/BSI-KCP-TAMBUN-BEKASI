import { NavLink } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { CONTACT_INFO, SOCIAL_LINKS } from "../../data/contact";
import { useLanguage } from "../../context/languageContext";
import footerBg from "../../assets/footer-bg.png";

export default function Footer() {
  const { t, tr } = useLanguage();
  const year = new Date().getFullYear();

  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.services"), to: "/services" },
    { label: t("nav.products"), to: "/#produk" },
    { label: t("nav.gallery"), to: "/gallery" },
    { label: t("nav.news"), to: "/news" },
    { label: t("nav.faq"), to: "/faq" },
    { label: t("nav.contact"), to: "/contact" },
  ];

  const serviceLinks = [
    { label: tr({ id: "Pembiayaan", en: "Financing" }), to: "/services#pembiayaan" },
    { label: tr({ id: "Tabungan", en: "Savings" }), to: "/services#tabungan" },
    { label: tr({ id: "Kartu", en: "Cards" }), to: "/services#kartu" },
    { label: tr({ id: "Gadai Emas (Pawning)", en: "Gold Pawn (Pawning)" }), to: "/services#pawning" },
    { label: tr({ id: "Layanan Digital", en: "Digital Services" }), to: "/services#digital" },
  ];

  const socials = [
    { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: FaInstagram },
    { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FaFacebookF },
    { label: "YouTube", href: SOCIAL_LINKS.youtube, Icon: FaYoutube },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-emerald-900 text-gray-200 dark:border-line dark:bg-[#061512]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${footerBg})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-emerald-900/70 dark:bg-[#061512]/85"
      />
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.4fr_1fr_1fr_1.2fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white">
                BSI
              </span>
              <span className="text-sm font-semibold tracking-wide text-white">
                BSI KCP TAMBUN
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-300">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-gray-400">
              {t("footer.regulatory")}
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white">{t("footer.navTitle")}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-sm font-semibold text-white">{t("footer.servicesTitle")}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold text-white">{t("footer.contactTitle")}</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone size={16} className="shrink-0 text-gold-500" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail size={16} className="shrink-0 text-gold-500" />
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiClock size={16} className="shrink-0 text-gold-500" />
                <span>{tr(CONTACT_INFO.operationalHours)}</span>
              </li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="text-sm font-semibold text-white">{t("footer.socialTitle")}</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-300">
              {t("footer.socialDesc")}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-gray-300 transition-colors hover:border-gold-500 hover:text-gold-500"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Regulatory badges — mirrors the OJK / BI / LPS strip used on bankbsi.co.id */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[t("footer.regOjk"), t("footer.regBi"), t("footer.regLps")].map(
              (badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-gray-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {badge}
                </span>
              ),
            )}
          </div>
          <p className="max-w-sm text-[11px] leading-relaxed text-gray-500">
            {t("footer.noteLps")}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-400">
            {t("footer.copyright").replace("{year}", String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
