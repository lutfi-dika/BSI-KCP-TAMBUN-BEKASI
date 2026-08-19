import { FaWhatsapp } from "react-icons/fa";
import { CONTACT_INFO } from "../../data/contact";
import { useLanguage } from "../../context/languageContext";

/**
 * WhatsAppButton — floating WhatsApp chat button, fixed bottom-right.
 */
export default function WhatsAppButton() {
  const { t } = useLanguage();
  const number = CONTACT_INFO.whatsapp.replace(/[^\d]/g, "");
  const href = `https://wa.me/62${number}?text=${encodeURIComponent(
    t("whatsapp.defaultMessage"),
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp.ariaLabel")}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_32px_-6px_rgba(37,211,102,0.6)]"
    >
      <FaWhatsapp size={26} />
    </a>
  );
}
