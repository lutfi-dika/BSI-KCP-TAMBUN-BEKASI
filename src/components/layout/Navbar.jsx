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
    { label: t("nav.gallery"), to: "/gallery", end: false },
    { label: t("nav.contact"), to: "/contact", end: false },
  ];

  return (
    <>
      <div className="h-[108px] w-full" aria-hidden />

      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        {/* Utility Bar */}
        <div className="w-full bg-emerald-500 text-white/90 border-b border-emerald-600 dark:bg-surface-muted dark:text-ink-mid dark:border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs font-medium">
            <a
              href="tel:14040"
              className="flex items-center gap-1.5 hover:text-amber-300 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors shrink-0"
            >
              <FiPhoneCall size={12} />
              <span>{t("nav.bsiCall")}</span>
            </a>

            <div className="flex items-center gap-2 sm:gap-6 shrink-0">
              <DigitalClock
                showDate
                dateClassName="hidden min-[480px]:inline"
                className="text-white/95 dark:text-ink-mid font-mono text-[10px] sm:text-[11px]"
              />
              <span className="hidden sm:block h-3 w-px bg-white/20 dark:bg-line-strong" aria-hidden />

              <div className="hidden sm:flex items-center gap-3 md:gap-5 text-white/85 dark:text-ink-mid">
                <a
                  href="https://bsinet.bankbsi.co.id"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 dark:hover:text-emerald-400 transition-colors"
                >
                  {t("nav.netBanking")}
                </a>
                <a
                  href="https://bewize.bankbsi.co.id/site/login"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 dark:hover:text-emerald-400 transition-colors"
                >
                  {t("nav.bewize")}
                </a>
                <a
                  href="https://www.bankbsi.co.id/products-services/byond"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 dark:hover:text-emerald-400 transition-colors"
                >
                  {t("nav.byond")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`w-full h-[72px] transition-all duration-300 ${scrolled
              ? "bg-white/95 dark:bg-surface-muted/95 backdrop-blur-xl border-b border-gray-200/60 dark:border-line-strong/60 shadow-md"
              : "bg-surface border-b border-line"
            }`}
        >
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Logo Hanya Gambar */}
            <NavLink to="/" className="flex items-center shrink-0 group">
              <div className="p-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40">
                <img
                  src={bsiLogo}
                  alt="Logo BSI"
                  className="h-7 sm:h-8 w-auto object-contain rounded-md"
                />
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-1 bg-surface-muted/60 p-1.5 rounded-full border border-line/60">
              {navLinks.map((link) =>
                link.isHash ? (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={closeDropdown}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-ink-mid hover:text-emerald-500 hover:bg-white dark:hover:bg-surface-strong transition-all duration-200 block"
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
                        `flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${isActive
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-ink-mid hover:text-emerald-500 hover:bg-white dark:hover:bg-surface-strong"
                        }`
                      }
                    >
                      {link.label}
                      <FiChevronDown
                        size={13}
                        className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""
                          }`}
                      />
                    </NavLink>

                    {/* Mega Menu */}
                    <div
                      className={`absolute left-1/2 top-full z-50 w-[min(580px,92vw)] -translate-x-1/2 pt-3 transition-all duration-300 ${megaOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2 opacity-0"
                        }`}
                    >
                      <div className="rounded-3xl border border-line/80 bg-surface-card backdrop-blur-2xl p-4 shadow-2xl shadow-black/15 ring-1 ring-black/5 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {SERVICE_OVERVIEW.map((item) => {
                            const Icon = MEGA_ICONS[item.icon] ?? FiTrendingUp;
                            return (
                              <Link
                                key={item.id}
                                to={item.href}
                                onClick={() => setMegaOpen(false)}
                                className="group flex items-start gap-3.5 rounded-2xl p-3 text-left transition-all hover:bg-emerald-500/10 hover:translate-x-0.5"
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white shadow-sm">
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
                          className="mt-3 flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-2.5 text-xs font-bold text-emerald-500 transition-all hover:bg-emerald-500 hover:text-white group"
                        >
                          <span>{t("nav.allServices")}</span>
                          <FiArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
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
                        `px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 block ${isActive
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-ink-mid hover:text-emerald-500 hover:bg-white dark:hover:bg-surface-strong"
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
              <div className="hidden sm:flex items-center gap-1 bg-surface-muted/60 p-1 rounded-full border border-line/60">
                <ThemeToggle className="rounded-full text-ink-strong hover:bg-white dark:hover:bg-surface-strong p-2 transition-colors" />
                <LanguageToggle className="rounded-full text-ink-strong hover:bg-white dark:hover:bg-surface-strong p-2 transition-colors" />
              </div>

              {/* Tombol Hamburger Mobile */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label={t("nav.openMenu")}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink-strong transition-all hover:bg-gray-200 dark:hover:bg-surface-strong active:scale-95"
              >
                <FiMenu size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* Component Slide Mobile Menu */}
        <MobileMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          navLinks={navLinks}
        />
      </header>
    </>
  );
}