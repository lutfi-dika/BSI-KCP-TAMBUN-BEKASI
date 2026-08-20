import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiPercent, FiClock, FiPieChart, FiSliders, FiRefreshCw } from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";
import { calculateMurabahah } from "../../data/aiKnowledge";
import { fadeUp } from "../../utils/animation";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const PRESETS = [
  { id: "kpr", label: { id: "KPR Rumah", en: "Home (KPR)" }, harga: 350000000, dp: 35000000, margin: 4.5, tenor: 240 },
  { id: "mobil", label: { id: "Kredit Mobil", en: "Car Loan" }, harga: 250000000, dp: 50000000, margin: 5, tenor: 60 },
  { id: "motor", label: { id: "Kredit Motor", en: "Motorcycle Loan" }, harga: 30000000, dp: 5000000, margin: 4, tenor: 36 },
  { id: "umkm", label: { id: "Modal UMKM", en: "MSME Capital" }, harga: 50000000, dp: 0, margin: 6, tenor: 24 },
];

export default function FinancingCalculator() {
  const { tr, lang } = useLanguage();
  const [harga, setHarga] = useState("");
  const [dp, setDp] = useState("");
  const [margin, setMargin] = useState("");
  const [tenor, setTenor] = useState("");
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setHarga(String(preset.harga));
    setDp(String(preset.dp));
    setMargin(String(preset.margin));
    setTenor(String(preset.tenor));
  };

  const reset = () => {
    setHarga("");
    setDp("");
    setMargin("");
    setTenor("");
    setActivePreset(null);
  };

  const result = useMemo(() => {
    const h = Number(harga);
    const d = Number(dp);
    const m = Number(margin);
    const t = Number(tenor);
    if (!h || h <= 0 || m <= 0 || t <= 0) return null;
    return calculateMurabahah(h, d || 0, m, t);
  }, [harga, dp, margin, tenor]);

  const inputClass =
    "w-full rounded-xl border border-line bg-surface-muted px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30";

  return (
    <section className="border-t border-line bg-surface-muted py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}           className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
            <FiSliders size={12} className="mr-1" />
            {lang === "en" ? "AI Calculator" : "Kalkulator AI"}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
            {lang === "en" ? "Financing Simulation Calculator" : "Kalkulator Simulasi Pembiayaan"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {lang === "en"
              ? "Calculate estimated installments, total margin, and financing details based on murabahah contract."
              : "Hitung estimasi cicilan, total margin, dan detail pembiayaan berdasarkan akad murabahah."}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}           className="mx-auto mt-10 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-line bg-surface-card p-5">
                <h3 className="mb-4 text-sm font-bold text-ink">
                  {lang === "en" ? "Quick Presets" : "Preset Cepat"}
                </h3>
                <div className="flex flex-col gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`rounded-xl px-4 py-2.5 text-left text-xs font-semibold transition-all ${
                        activePreset === p.id
                          ? "bg-emerald-500 text-white"
                          : "border border-line bg-surface-muted text-ink-mid hover:border-emerald-500/25 hover:text-emerald-500"
                      }`}
                    >
                      {tr(p.label)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-line bg-surface-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink">
                    {lang === "en" ? "Input Parameters" : "Masukkan Parameter"}
                  </h3>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-faint transition-colors hover:text-emerald-500"
                  >
                    <FiRefreshCw size={12} />
                    Reset
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-ink-mid">
                      <FiDollarSign size={12} />
                      {lang === "en" ? "Asset Price" : "Harga Aset"}
                    </label>
                    <input
                      type="number"
                      value={harga}
                      onChange={(e) => { setHarga(e.target.value); setActivePreset(null); }}
                      placeholder="350.000.000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-ink-mid">
                      <FiDollarSign size={12} />
                      {lang === "en" ? "Down Payment" : "Uang Muka (DP)"}
                    </label>
                    <input
                      type="number"
                      value={dp}
                      onChange={(e) => { setDp(e.target.value); setActivePreset(null); }}
                      placeholder="35.000.000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-ink-mid">
                      <FiPercent size={12} />
                      {lang === "en" ? "Margin (%/year)" : "Margin (%/tahun)"}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={margin}
                      onChange={(e) => { setMargin(e.target.value); setActivePreset(null); }}
                      placeholder="4.5"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-ink-mid">
                      <FiClock size={12} />
                      {lang === "en" ? "Tenor (months)" : "Tenor (bulan)"}
                    </label>
                    <input
                      type="number"
                      value={tenor}
                      onChange={(e) => { setTenor(e.target.value); setActivePreset(null); }}
                      placeholder="240"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-2 text-emerald-500">
                  <FiPieChart size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {lang === "en" ? "Financing Principal" : "Pokok Pembiayaan"}
                  </span>
                </div>
                <p className="mt-2 text-lg font-bold text-ink">{formatRupiah(result.pokokPembiayaan)}</p>
              </div>
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5">
                <div className="flex items-center gap-2 text-gold-600 dark:text-gold-500">
                  <FiPercent size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {lang === "en" ? "Total Margin" : "Total Margin"}
                  </span>
                </div>
                <p className="mt-2 text-lg font-bold text-ink">{formatRupiah(result.totalMargin)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-2 text-emerald-500">
                  <FiDollarSign size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {lang === "en" ? "Total Financing" : "Total Pembiayaan"}
                  </span>
                </div>
                <p className="mt-2 text-lg font-bold text-ink">{formatRupiah(result.totalPembiayaan)}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-card p-5">
                <div className="flex items-center gap-2 text-ink-mid">
                  <FiClock size={16} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    {lang === "en" ? "Monthly Installment" : "Angsuran/Bulan"}
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold text-emerald-500">{formatRupiah(result.angsuranPerBulan)}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
