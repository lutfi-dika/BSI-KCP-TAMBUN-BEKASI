import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiHeadphones, FiUser, FiMoreVertical } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../../context/languageContext";
import { KEYWORD_MAP, searchFAQ, searchProducts } from "../../data/aiKnowledge";
import { CONTACT_INFO } from "../../data/contact";

function getResponse(input, lang) {
  const q = input.toLowerCase().trim();

  for (const [, data] of Object.entries(KEYWORD_MAP)) {
    if (data.keywords.some((kw) => q.includes(kw))) {
      return data.responses[lang] || data.responses.id;
    }
  }

  const faqHit = searchFAQ(q, lang);
  if (faqHit) {
    return faqHit.answer[lang] || faqHit.answer.id;
  }

  const products = searchProducts(q, lang);
  if (products.length > 0) {
    const list = products
      .map((p) => `${p.name}: ${p.description[lang] || p.description.id}`)
      .join("\n\n");
    return lang === "en" ? `I found the following products:\n\n${list}` : `Saya menemukan produk berikut:\n\n${list}`;
  }

  return lang === "en"
    ? "Sorry, I don't understand your question yet. You can ask about BSI products, operating hours, contact info, or try keywords like 'savings', 'financing', 'gold', 'digital'."
    : "Maaf, saya belum memahami pertanyaan Anda. Anda bisa bertanya tentang produk BSI, jam operasional, info kontak, atau coba kata kunci seperti 'tabungan', 'pembiayaan', 'emas', 'digital'.";
}

function QuickReply({ items, onClick }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-1 pt-1">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onClick(item.value)}
          className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:text-emerald-400"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:300ms]" />
    </div>
  );
}

export default function Chatbot() {
  const { t, lang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  const waNumber = CONTACT_INFO.whatsapp.replace(/[^\d]/g, "");
  const waHref = `https://wa.me/62${waNumber}?text=${encodeURIComponent(
    t("whatsapp.defaultMessage"),
  )}`;

  const quickReplies = lang === "en"
    ? [
        { label: "Products", value: "What products are available?" },
        { label: "Savings", value: "Tell me about savings" },
        { label: "Financing", value: "Tell me about financing" },
        { label: "Gold", value: "Gold services" },
        { label: "Hours", value: "Operating hours?" },
        { label: "Contact", value: "Contact info?" },
        { label: "Calculator", value: "I want to calculate financing" },
      ]
    : [
        { label: "Produk", value: "Apa saja produk BSI?" },
        { label: "Tabungan", value: "Ceritakan tentang tabungan" },
        { label: "Pembiayaan", value: "Ceritakan tentang pembiayaan" },
        { label: "Emas", value: "Layanan emas" },
        { label: "Jam Buka", value: "Jam berapa buka?" },
        { label: "Kontak", value: "Info kontak?" },
        { label: "Kalkulator", value: "Saya mau simulasi pembiayaan" },
      ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (messages.length === 0) {
        const greeting = lang === "en"
          ? "Hello! I'm BSI Virtual Assistant. How can I help you today?"
          : "Halo! Saya Asisten Virtual BSI. Ada yang bisa saya bantu hari ini?";
        setMessages([{ role: "bot", text: greeting }]);
      }
    }
  }, [chatOpen, lang, messages.length]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const onScroll = () => {};
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const openChat = () => {
    setMenuOpen(false);
    setChatOpen(true);
  };

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const reply = getResponse(trimmed, lang);
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
        setIsTyping(false);
      }, 600 + Math.random() * 800);
    },
    [lang],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Tombol "..." utama */}
      <motion.button
        type="button"
        onClick={() => { setMenuOpen((v) => !v); setChatOpen(false); }}
        aria-label="Menu"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-colors hover:bg-emerald-600 lg:bottom-8 lg:right-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {menuOpen || chatOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX size={22} />
            </motion.span>
          ) : (
            <motion.span key="dots" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <FiMoreVertical size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu popup WA & AI */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 lg:bottom-28 lg:right-8"
          >
            {/* Tombol WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105"
            >
              <FaWhatsapp size={18} />
              WhatsApp
            </a>

            {/* Tombol AI Chat */}
            <button
              type="button"
              onClick={openChat}
              className="flex items-center gap-2.5 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105"
            >
              <FiHeadphones size={18} />
              {lang === "en" ? "AI Assistant" : "Asisten AI"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-surface-card shadow-2xl sm:right-6 lg:bottom-28 lg:right-8"
          >
            <div className="flex items-center gap-3 border-b border-line bg-emerald-500 px-4 py-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <FiHeadphones size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">BSI Virtual Assistant</p>
                <p className="text-[11px] opacity-80">
                  {lang === "en" ? "Always ready to help" : "Selalu siap membantu"}
                </p>
              </div>
            </div>

            <div
              ref={chatRef}
              className="flex h-72 flex-col gap-2 overflow-y-auto p-3 sm:h-80"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <FiHeadphones size={13} />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-surface-muted text-ink"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <FiUser size={13} />
                    </span>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <FiHeadphones size={13} />
                  </span>
                  <div className="rounded-2xl bg-surface-muted">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="border-t border-line px-3 pb-2 pt-2">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
                  {lang === "en" ? "Quick questions" : "Pertanyaan cepat"}
                </p>
                <QuickReply items={quickReplies} onClick={sendMessage} />
              </div>
            )}

            {messages.length > 1 && (
              <div className="border-t border-line px-3 pb-1 pt-1">
                <QuickReply items={quickReplies.slice(0, 4)} onClick={sendMessage} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line p-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === "en" ? "Type your question..." : "Ketik pertanyaan Anda..."}
                className="flex-1 rounded-xl border border-line bg-surface-muted px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
              >
                <FiSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
