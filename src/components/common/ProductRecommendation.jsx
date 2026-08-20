import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";
import { getRecommendations } from "../../data/aiKnowledge";
import { fadeUp } from "../../utils/animation";

const PROFILES = [
  {
    id: "karyawan",
    icon: FiBriefcase,
    title: { id: "Karyawan / Pegawai", en: "Employee" },
    desc: {
      id: "Bekerja sebagai karyawan atau pegawai tetap",
      en: "Working as a permanent employee",
    },
  },
  {
    id: "umkm",
    icon: FiUser,
    title: { id: "Pelaku UMKM / Bisnis", en: "MSME / Business Owner" },
    desc: {
      id: "Memiliki atau menjalankan usaha sendiri",
      en: "Has or runs their own business",
    },
  },
  {
    id: "keluarga",
    icon: FiHome,
    title: { id: "Berkeluarga", en: "Family" },
    desc: {
      id: "Sudah berkeluarga dengan kebutuhan rumah tangga",
      en: "Married with household needs",
    },
  },
  {
    id: "pensiunan",
    icon: FiUsers,
    title: { id: "Pensiunan / Lansia", en: "Retiree / Senior" },
    desc: {
      id: "Sudah pensiun atau memasuki usia senior",
      en: "Retired or entering senior age",
    },
  },
  {
    id: "generasi_muda",
    icon: FiHeart,
    title: { id: "Generasi Muda / Mahasiswa", en: "Young Generation / Student" },
    desc: {
      id: "Masih dalam masa studi atau baru memulai karir",
      en: "Still studying or just starting a career",
    },
  },
  {
    id: "investor",
    icon: FiTrendingUp,
    title: { id: "Investor / Penabung Emas", en: "Investor / Gold Saver" },
    desc: {
      id: "Tertarik pada investasi dan menabung emas",
      en: "Interested in investment and gold savings",
    },
  },
];

export default function ProductRecommendation() {
  const { tr, lang } = useLanguage();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);

  const handleSelect = useCallback(
    (profileId) => {
      setSelected(profileId);
      const recs = getRecommendations(profileId);
      setResults(recs);
      setStep(1);
    },
    [],
  );

  const reset = () => {
    setStep(0);
    setSelected(null);
    setResults(null);
  };

  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}           className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
            {lang === "en" ? "AI Recommendation" : "Rekomendasi AI"}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
            {lang === "en" ? "Find the Right BSI Product" : "Temukan Produk BSI yang Tepat"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {lang === "en"
              ? "Tell us about yourself and we'll recommend the best BSI products for your needs."
              : "Ceritakan tentang diri Anda dan kami akan merekomendasikan produk BSI terbaik untuk kebutuhan Anda."}
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-4xl">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="profiles"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {PROFILES.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p.id)}
                      className="group flex flex-col items-start rounded-2xl border border-line bg-surface-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/25 hover:shadow-lg"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                        <Icon size={20} />
                      </span>
                      <h3 className="mt-4 text-sm font-bold text-ink transition-colors group-hover:text-emerald-500">
                        {tr(p.title)}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                        {tr(p.desc)}
                      </p>
                    </button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      {lang === "en" ? "Recommended for You" : "Rekomendasi untuk Anda"}
                    </h3>
                    <p className="mt-1 text-xs text-ink-soft">
                      {lang === "en"
                        ? `Based on your profile: ${PROFILES.find((p) => p.id === selected)?.title.en}`
                        : `Berdasarkan profil Anda: ${tr(PROFILES.find((p) => p.id === selected)?.title)}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-surface-card px-3 py-2 text-xs font-semibold text-ink-mid transition-colors hover:border-emerald-500 hover:text-emerald-500"
                  >
                    <FiRefreshCw size={13} />
                    {lang === "en" ? "Reset" : "Ulangi"}
                  </button>
                </div>

                {results && results.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {results.map((rec, i) => (
                      <motion.div
                        key={rec.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 rounded-2xl border border-line bg-surface-card p-5 transition-all duration-300 hover:border-emerald-500/25 hover:shadow-md"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                          <FiCheckCircle size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-ink">{rec.name}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                            {tr(rec.reason)}
                          </p>
                        </div>
                        <FiArrowRight size={16} className="mt-2 shrink-0 text-ink-faint" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-line bg-surface-card px-6 py-10 text-center">
                    <p className="text-sm text-ink-soft">
                      {lang === "en"
                        ? "No specific recommendations found. Please try another profile."
                        : "Belum ada rekomendasi spesifik. Silakan coba profil lain."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
