import { NavLink } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { CONTACT_INFO, SOCIAL_LINKS } from "../../data/contact";
import { useLanguage } from "../../context/languageContext";
import footerBg from "../../assets/footer-bg.png";
import bsiLogo from "../../assets/bsi-logo.png";

export default function Footer() {
  const { t, tr } = useLanguage();
  const year = new Date().getFullYear();

  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.services"), to: "/services" },
    { label: t("nav.products"), to: "/#produk" },
    { label: t("nav.brosur"), to: "/brosur" },
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
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-emerald-900 text-gray-200 dark:border-line dark:bg-[#0a0e13]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${footerBg})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900/80 via-emerald-900/90 to-emerald-950/95 dark:from-[#0a0e13]/80 dark:via-[#0a0e13]/90 dark:to-[#0a0e13]/95"
      />
      <div className="pointer-events-none absolute -top-40 right-[-5%] -z-10 h-[300px] w-[300px] rounded-full bg-emerald-400/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.4fr_1fr_1fr_1.2fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <img src={bsiLogo} alt="BSI Logo" className="h-8 w-8 rounded-lg" />
              </div>
              <span className="text-sm font-bold tracking-wide text-white">
                BSI KCP TAMBUN
              </span>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-gray-400">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-gray-500">
              {t("footer.regulatory")}
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{t("footer.navTitle")}</h3>
            <ul className="mt-5 flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-[13px] text-gray-400 transition-all duration-300 hover:pl-1.5 hover:text-white inline-flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-emerald-500/0 transition-all duration-300 group-hover:bg-emerald-400" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{t("footer.servicesTitle")}</h3>
            <ul className="mt-5 flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-[13px] text-gray-400 transition-all duration-300 hover:pl-1.5 hover:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{t("footer.contactTitle")}</h3>
            <ul className="mt-5 flex flex-col gap-3.5 text-[13px] text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FiMapPin size={14} />
                </span>
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FiPhone size={14} />
                </span>
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FiMail size={14} />
                </span>
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FiClock size={14} />
                </span>
                <span>{tr(CONTACT_INFO.operationalHours)}</span>
              </li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">{t("footer.socialTitle")}</h3>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-gray-400">
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-glow"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Regulatory badges */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[t("footer.regOjk"), t("footer.regBi"), t("footer.regLps")].map(
              (badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium text-gray-400 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
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
          <p className="text-xs text-gray-500">
            {t("footer.copyright").replace("{year}", String(year))}
            <span className="mx-2 opacity-40" aria-hidden="true">·</span>
            <NavLink to="/admin" className="link-underline transition-colors hover:text-emerald-400">
              {t("admin.kicker")}
            </NavLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
