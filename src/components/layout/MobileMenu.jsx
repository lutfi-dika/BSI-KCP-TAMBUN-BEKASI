import { NavLink, Link } from "react-router-dom";
import { FiX, FiArrowRight } from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";
import LanguageToggle from "../common/LanguageToggle";
import { useLanguage } from "../../context/languageContext";

export default function MobileMenu({ isOpen, onClose, navLinks }) {
  const { t } = useLanguage();

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
    >
      {/* 1. Backdrop Hitam Transparan */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* 2. Panel Slide Menu (Muncul dari Kanan) */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-surface/95 dark:bg-surface-muted/95 backdrop-blur-2xl border-l border-line/60 shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header Drawer Mobile */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-line">
            <span className="text-sm font-bold text-ink tracking-wide">
              {t("nav.menuTitle")}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-surface-muted text-ink-strong hover:bg-gray-200 dark:hover:bg-surface-strong transition-colors"
              aria-label={t("nav.closeMenu")}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* List Navigation Links */}
          <ul className="mt-6 space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                {link.isHash ? (
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-ink-mid hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all"
                  >
                    <span>{link.label}</span>
                    <FiArrowRight size={16} className="text-ink-soft" />
                  </Link>
                ) : (
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "text-ink-mid hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <FiArrowRight size={16} />
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Drawer (Theme & Language Switcher) */}
        <div className="pt-6 border-t border-line">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-muted/60 border border-line/60">
            <span className="text-xs font-medium text-ink-soft">
              {t("nav.displaySettings")}
            </span>
            <div className="flex items-center gap-1">
              <ThemeToggle className="rounded-full text-ink-strong hover:bg-white dark:hover:bg-surface-strong p-2 transition-colors" />
              <LanguageToggle className="rounded-full text-ink-strong hover:bg-white dark:hover:bg-surface-strong p-2 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}