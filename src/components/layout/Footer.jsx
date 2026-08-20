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
    <footer className="relative isolate overflow-hidden bg-[#24A29F] text-white dark:bg-[#0a0e13]">
      {/* Thick gold/orange border top — BSI signature */}
      <div className="h-[34px] w-full bg-[#F6AD3C]" />

      {/* Background image overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${footerBg})` }}
      />

      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10 pt-10 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + Address */}
          <div className="lg:col-span-1">
            <img src={bsiLogo} alt="BSI Logo" className="mb-4 h-10 w-auto" />
            <p className="mt-2 max-w-[250px] text-sm leading-relaxed text-white/90">
              {CONTACT_INFO.address}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 hover:bg-[#F6AD3C] hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{t("footer.navTitle")}</h3>
            <div className="mb-4 h-[3px] w-12 bg-[#F6AD3C]" />
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-[#F6AD3C] hover:pl-1"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{t("footer.servicesTitle")}</h3>
            <div className="mb-4 h-[3px] w-12 bg-[#F6AD3C]" />
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-[#F6AD3C] hover:pl-1"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{t("footer.contactTitle")}</h3>
            <div className="mb-4 h-[3px] w-12 bg-[#F6AD3C]" />
            <ul className="flex flex-col gap-3.5 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-[#F6AD3C]" />
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={16} className="shrink-0 text-[#F6AD3C]" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={16} className="shrink-0 text-[#F6AD3C]" />
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiClock size={16} className="shrink-0 text-[#F6AD3C]" />
                <span>{tr(CONTACT_INFO.operationalHours)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright + Regulatory */}
        <div className="mt-10 border-t border-white/20 pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {[t("footer.regOjk"), t("footer.regBi"), t("footer.regLps")].map(
                (badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F6AD3C]" />
                    {badge}
                  </span>
                ),
              )}
            </div>
            <p className="text-xs text-white/60">
              {t("footer.copyright").replace("{year}", String(year))}
              <span className="mx-2 opacity-40" aria-hidden="true">·</span>
              <NavLink to="/admin" className="hover:text-[#F6AD3C] transition-colors">
                {t("admin.kicker")}
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
