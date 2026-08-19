import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiMenu,
  FiPhoneCall,
  FiChevronDown,
  FiDollarSign,
  FiHeart,
  FiTrendingUp,
  FiGlobe,
  FiSmartphone,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import DigitalClock from "../common/DigitalClock";
import useScroll from "../../hooks/useScroll";
import { useLanguage } from "../../context/languageContext";
import { SERVICE_OVERVIEW } from "../../data/services";
import bsiLogo from "../../assets/bsi-logo.png";

const MEGA_ICONS = {
  wallet: FiDollarSign,
  hands: FiHeart,
  trending: FiTrendingUp,
  globe: FiGlobe,
  smartphone: FiSmartphone,
  briefcase: FiBriefcase,
};

export default function Navbar() {
  const { t, tr } = useLanguage();
  const scrolled = useScroll(20);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const closeDropdown = () => {
    setMobileOpen(false);
    setMegaOpen(false);
  };

  const navLinks = [
    { label: t("nav.home"), to: "/", end: true },
    { label: t("nav.about"), to: "/about", end: false },
    { label: t("nav.services"), to: "/services", end: false, hasMega: true },
    { label: t("nav.products"), to: "/#produk", end: false, isHash: true },
    { label: t("nav.brosur"), to: "/brosur", end: false },
    { label: t("nav.gallery"), to: "/gallery", end: false },
    { label: t("nav.contact"), to: "/contact", end: false },
  ];

  return (
    <>
      <div className="h-[108px] w-full" aria-hidden />

      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-500">
        {/* Utility Bar */}
        <div className="w-full bg-emerald-700/95 backdrop-blur-sm text-white/85 border-b border-emerald-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] font-medium tracking-wide">
            <a
              href="tel:14040"
              className="flex items-center gap-1.5 hover:text-white transition-colors shrink-0"
            >
              <FiPhoneCall size={12} />
              <span>{t("nav.bsiCall")}</span>
            </a>

            <div className="flex items-center gap-2 sm:gap-6 shrink-0">
              <DigitalClock
                showDate
                dateClassName="hidden min-[480px]:inline"
                className="text-white/80 font-mono text-[10px] sm:text-[11px]"
              />
              <span className="hidden sm:block h-3 w-px bg-white/20" aria-hidden />

              <div className="hidden sm:flex items-center gap-3 md:gap-5 text-white/70">
                <a
                  href="https://bsinet.bankbsi.co.id"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline hover:text-white transition-colors"
                >
                  {t("nav.netBanking")}
                </a>
                <a
                  href="https://bewize.bankbsi.co.id/site/login"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline hover:text-white transition-colors"
                >
                  {t("nav.bewize")}
                </a>
                <a
                  href="https://www.bankbsi.co.id/products-services/byond"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline hover:text-white transition-colors"
                >
                  {t("nav.byond")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full h-[72px] transition-all duration-500 ${
            scrolled
              ? "glass border-b border-white/10 dark:border-line-strong/40 shadow-glow"
              : "bg-surface border-b border-line"
          }`}
        >
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center shrink-0 group">
              <div className="p-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-800/30 transition-all duration-300 group-hover:shadow-glow group-hover:border-emerald-500/30">
                <img
                  src={bsiLogo}
                  alt="Logo BSI"
                  className="h-7 sm:h-8 w-auto object-contain rounded-md"
                />
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-0.5 bg-surface-muted/60 dark:bg-surface-muted/40 p-1.5 rounded-full border border-line/50 backdrop-blur-sm">
              {navLinks.map((link) =>
                link.isHash ? (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={closeDropdown}
                      className="px-4 py-2 rounded-full text-[13px] font-medium text-ink-mid hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-surface-strong/80 transition-all duration-300 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : link.hasMega ? (
                  <li
                    key={link.to}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={closeDropdown}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "text-ink-mid hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-surface-strong/80"
                        }`
                      }
                    >
                      {link.label}
                      <FiChevronDown
                        size={13}
                        className={`transition-transform duration-300 ${
                          megaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </NavLink>

                    {/* Mega Menu */}
                    <div
                      className={`absolute left-1/2 top-full z-50 w-[min(580px,92vw)] -translate-x-1/2 pt-3 transition-all duration-300 ${
                        megaOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="glass rounded-3xl border border-line/60 p-4 shadow-2xl shadow-black/10 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {SERVICE_OVERVIEW.map((item) => {
                            const Icon = MEGA_ICONS[item.icon] ?? FiTrendingUp;
                            return (
                              <Link
                                key={item.id}
                                to={item.href}
                                onClick={() => setMegaOpen(false)}
                                className="group flex items-start gap-3.5 rounded-2xl p-3 text-left transition-all duration-300 hover:bg-emerald-500/8 hover:translate-x-0.5"
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-glow">
                                  <Icon size={16} />
                                </span>
                                <span>
                                  <span className="block text-xs font-bold text-ink group-hover:text-emerald-500 transition-colors">
                                    {tr(item.title)}
                                  </span>
                                  <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-soft line-clamp-2">
                                    {tr(item.description)}
                                  </span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        <Link
                          to="/services"
                          onClick={() => setMegaOpen(false)}
                          className="mt-3 flex items-center justify-between rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-500 transition-all duration-300 hover:bg-emerald-500 hover:text-white group"
                        >
                          <span>{t("nav.allServices")}</span>
                          <FiArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={closeDropdown}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 block ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "text-ink-mid hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-surface-strong/80"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1 bg-surface-muted/60 dark:bg-surface-muted/40 p-1 rounded-full border border-line/50 backdrop-blur-sm">
                <ThemeToggle className="rounded-full text-ink-strong hover:bg-white/80 dark:hover:bg-surface-strong/80 p-2 transition-all duration-300" />
                <LanguageToggle className="rounded-full text-ink-strong hover:bg-white/80 dark:hover:bg-surface-strong/80 p-2 transition-all duration-300" />
              </div>

              {/* Hamburger Mobile */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label={t("nav.openMenu")}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted/80 text-ink-strong transition-all duration-300 hover:bg-emerald-500 hover:text-white active:scale-95"
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          navLinks={navLinks}
        />
      </header>
    </>
  );
}
