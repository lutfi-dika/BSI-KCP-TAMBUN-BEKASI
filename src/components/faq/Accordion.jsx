import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";

/**
 * Accordion — expandable FAQ item.
 */
export default function Accordion({ items = [] }) {
  const { tr } = useLanguage();
  const [openId, setOpenId] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-emerald-500/20 bg-surface-card/80 backdrop-blur-sm shadow-glow"
                : "border-line/80 bg-surface-card/80 backdrop-blur-sm hover:border-emerald-500/10"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-semibold text-ink sm:text-base">
                {tr(item.question)}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  isOpen
                    ? "rotate-45 bg-emerald-500 text-white"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                <FiPlus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">
                    {tr(item.answer)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
