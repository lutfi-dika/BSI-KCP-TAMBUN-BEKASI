import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiGift,
  FiPercent,
  FiClock,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";
import SectionTitle from "./SectionTitle";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const GOLD_TYPES = [
  {
    id: "antam-1g",
    label: { id: "Antam 1 gram", en: "Antam 1 gram" },
    weight: 1,
  },
  {
    id: "antam-5g",
    label: { id: "Antam 5 gram", en: "Antam 5 gram" },
    weight: 5,
  },
  {
    id: "antam-10g",
    label: { id: "Antam 10 gram", en: "Antam 10 gram" },
    weight: 10,
  },
  {
    id: "antam-25g",
    label: { id: "Antam 25 gram", en: "Antam 25 gram" },
    weight: 25,
  },
  {
    id: "antam-50g",
    label: { id: "Antam 50 gram", en: "Antam 50 gram" },
    weight: 50,
  },
  {
    id: "custom",
    label: { id: "Custom (isi berat sendiri)", en: "Custom (enter weight)" },
    weight: 0,
  },
];

const TENOR_OPTIONS = [
  { id: "1", label: { id: "1 Bulan", en: "1 Month" }, months: 1 },
  { id: "2", label: { id: "2 Bulan", en: "2 Months" }, months: 2 },
  { id: "3", label: { id: "3 Bulan", en: "3 Months" }, months: 3 },
  { id: "6", label: { id: "6 Bulan", en: "6 Months" }, months: 6 },
  { id: "12", label: { id: "12 Bulan", en: "12 Months" }, months: 12 },
];

export default function GoldPawnCalculator() {
  const { t, tr } = useLanguage();
  const [goldType, setGoldType] = useState("antam-5g");
  const [customWeight, setCustomWeight] = useState("");
  const [goldPrice, setGoldPrice] = useState("1050000");
  const [tenor, setTenor] = useState("3");

  const weight = useMemo(() => {
    const selected = GOLD_TYPES.find((g) => g.id === goldType);
    if (selected?.weight) return selected.weight;
    return Number(customWeight) || 0;
  }, [goldType, customWeight]);

  const result = useMemo(() => {
    const price = Number(goldPrice);
    const t = Number(tenor);
    if (!weight || !price || weight <= 0 || price <= 0) return null;

    const totalValue = weight * price;
    const ltvRatio = 0.85;
    const pinjamanMax = Math.floor(totalValue * ltvRatio);
    const biayaAdmin = 10000;
    const biayaTitip = Math.floor(totalValue * 0.005);
    const marginPerBulan = 1.5;
    const totalMargin = Math.floor(pinjamanMax * (marginPerBulan / 100) * t);
    const totalBayar = pinjamanMax + totalMargin + biayaAdmin;
    const rasioPinjaman = ((pinjamanMax / totalValue) * 100).toFixed(0);

    return {
      totalValue,
      pinjamanMax,
      biayaAdmin,
      biayaTitip,
      totalMargin,
      totalBayar,
      marginPerBulan,
      rasioPinjaman,
      tenorBulan: t,
    };
  }, [weight, goldPrice, tenor]);

  const inputClass =
    "w-full rounded-xl border border-line bg-surface-muted px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30";

  return (
    <section className="border-t border-line bg-surface-muted py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionTitle
            kicker={t("goldCalc.kicker")}
            title={t("goldCalc.title")}
            description={t("goldCalc.desc")}
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-10 max-w-5xl"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Input Panel */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-line bg-surface-card p-5">
                <h3 className="mb-4 text-sm font-bold text-ink">
                  {t("goldCalc.inputTitle")}
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Gold Type */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-ink-mid">
                      {t("goldCalc.goldType")}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {GOLD_TYPES.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoldType(g.id)}
                          className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                            goldType === g.id
                              ? "bg-emerald-500 text-white"
                              : "border border-line bg-surface-muted text-ink-mid hover:border-emerald-500/25"
                          }`}
                        >
                          {tr(g.label)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Weight */}
                  {goldType === "custom" && (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-medium text-ink-mid">
                        {t("goldCalc.weightGram")}
                      </label>
                      <input
                        type="number"
                        value={customWeight}
                        onChange={(e) => setCustomWeight(e.target.value)}
                        placeholder="10"
                        className={inputClass}
                      />
                    </div>
                  )}

                  {/* Gold Price */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-ink-mid">
                      {t("goldCalc.pricePerGram")}
                    </label>
                    <input
                      type="number"
                      value={goldPrice}
                      onChange={(e) => setGoldPrice(e.target.value)}
                      placeholder="1.050.000"
                      className={inputClass}
                    />
                    <p className="mt-1 text-[10px] text-ink-faint">
                      {t("goldCalc.priceHint")}
                    </p>
                  </div>

                  {/* Tenor */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-ink-mid">
                      {t("goldCalc.tenor")}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TENOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setTenor(opt.id)}
                          className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                            tenor === opt.id
                              ? "bg-emerald-500 text-white"
                              : "border border-line bg-surface-muted text-ink-mid hover:border-emerald-500/25"
                          }`}
                        >
                          {tr(opt.label)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Panel */}
            <div className="lg:col-span-3">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Main Result */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <FiDollarSign size={16} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        {t("goldCalc.loanAmount")}
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-ink">
                      {formatRupiah(result.pinjamanMax)}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {t("goldCalc.loanHint")} {result.rasioPinjaman}% {t("goldCalc.ofValue")}
                    </p>
                  </div>

                  {/* Detail Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-line bg-surface-card p-4">
                      <div className="flex items-center gap-2 text-gold-600 dark:text-gold-500">
                        <FiGift size={14} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {t("goldCalc.totalValue")}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-ink">
                        {formatRupiah(result.totalValue)}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-faint">
                        {weight}g x {formatRupiah(Number(goldPrice))}
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-surface-card p-4">
                      <div className="flex items-center gap-2 text-ink-mid">
                        <FiPercent size={14} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {t("goldCalc.margin")}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-ink">
                        {result.marginPerBulan}%/bln
                      </p>
                      <p className="mt-1 text-[11px] text-ink-faint">
                        {t("goldCalc.marginTotal")}: {formatRupiah(result.totalMargin)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-surface-card p-4">
                      <div className="flex items-center gap-2 text-ink-mid">
                        <FiClock size={14} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {t("goldCalc.tenorLabel")}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-ink">
                        {result.tenorBulan} {t("goldCalc.month")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-line bg-surface-card p-4">
                      <div className="flex items-center gap-2 text-ink-mid">
                        <FiDollarSign size={14} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {t("goldCalc.totalPay")}
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(result.totalBayar)}
                      </p>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="rounded-xl border border-line bg-surface-card p-4">
                    <h4 className="text-xs font-bold text-ink">
                      {t("goldCalc.feeBreakdown")}
                    </h4>
                    <ul className="mt-3 flex flex-col gap-2">
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-ink-soft">{t("goldCalc.adminFee")}</span>
                        <span className="font-medium text-ink">{formatRupiah(result.biayaAdmin)}</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-ink-soft">{t("goldCalc.custodyFee")}</span>
                        <span className="font-medium text-ink">{formatRupiah(result.biayaTitip)}</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <span className="text-ink-soft">{t("goldCalc.totalMarginLabel")}</span>
                        <span className="font-medium text-ink">{formatRupiah(result.totalMargin)}</span>
                      </li>
                      <li className="border-t border-line pt-2 flex items-center justify-between text-sm font-bold">
                        <span className="text-ink">{t("goldCalc.totalCost")}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{formatRupiah(result.totalBayar)}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Notes */}
                  <div className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
                    <FiAlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500" />
                    <div className="text-xs leading-relaxed text-ink-mid">
                      <p className="font-semibold text-ink">{t("goldCalc.noteTitle")}</p>
                      <p className="mt-1">{t("goldCalc.note")}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface-muted px-6 py-16 text-center">
                  <div>
                    <FiGift className="mx-auto h-8 w-8 text-ink-faint" />
                    <p className="mt-3 text-sm font-medium text-ink-mid">
                      {t("goldCalc.emptyState")}
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">
                      {t("goldCalc.emptyHint")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          <motion.div
            variants={staggerContainer(0.08, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-xl border border-line bg-surface-card p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  {i}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {t(`goldCalc.benefit${i}Title`)}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                    {t(`goldCalc.benefit${i}Desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
