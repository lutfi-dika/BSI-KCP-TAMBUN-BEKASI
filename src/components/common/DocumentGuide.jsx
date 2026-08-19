import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiChevronDown,
  FiArrowRight,
  FiUser,
  FiHome,
  FiCreditCard,
  FiTruck,
  FiDollarSign,
} from "react-icons/fi";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";
import SectionTitle from "./SectionTitle";

const SERVICE_DOCS = [
  {
    id: "rekening",
    icon: FiUser,
    title: { id: "Pembukaan Rekening", en: "Account Opening" },
    docs: {
      id: [
        "KTP asli dan fotokopi",
        "NPWP (jika memiliki)",
        "Surat keterangan domisili (jika alamat berbeda dengan KTP)",
        "Setoran awal sesuai ketentuan produk",
      ],
      en: [
        "Original ID card (KTP) and photocopy",
        "Tax ID (NPWP) if applicable",
        "Proof of address (if different from ID)",
        "Initial deposit per product requirements",
      ],
    },
  },
  {
    id: "gadai-emas",
    icon: FiDollarSign,
    title: { id: "Gadai Emas", en: "Gold Pawn" },
    docs: {
      id: [
        "KTP asli dan fotokopi",
        "Emas fisik (logam mulia Antam/sertiﬁkat)",
        "Buku tabungan BSI (jika sudah memiliki)",
      ],
      en: [
        "Original ID card (KTP) and photocopy",
        "Physical gold (Antam bullion/certiﬁed)",
        "BSI savings book (if available)",
      ],
    },
  },
  {
    id: "pembiayaan",
    icon: FiHome,
    title: { id: "Pembiayaan (KPR/Kendaraan)", en: "Financing (Home/Vehicle)" },
    docs: {
      id: [
        "KTP asli dan fotokopi suami-istri",
        "KK (Kartu Keluarga)",
        "NPWP",
        "Slip gaji / SK pengangkatan / surat keterangan usaha",
        "Rekening koran 3 bulan terakhir",
        "SKPP / SKPNS (untuk pegawai negeri)",
        "Dokumen jaminan (SHM / BPKB)",
      ],
      en: [
        "Original ID cards (husband & wife) and photocopy",
        "Family card (KK)",
        "Tax ID (NPWP)",
        "Payslip / employment letter / business statement",
        "Bank statement (last 3 months)",
        "Retirement decree (for civil servants)",
        "Collateral documents (SHM / BPKB)",
      ],
    },
  },
  {
    id: "haji-umrah",
    icon: FiTruck,
    title: { id: "Pendaftaran Haji & Umrah", en: "Hajj & Umrah Registration" },
    docs: {
      id: [
        "KTP asli dan fotokopi",
        "KK (Kartu Keluarga)",
        "Paspor asli dan fotokopi",
        "Surat keterangan sehat dari dokter",
        "Pas foto 4x6 (latar putih)",
        "Setoran awal tabungan haji",
      ],
      en: [
        "Original ID card (KTP) and photocopy",
        "Family card (KK)",
        "Original passport and photocopy",
        "Medical certificate from doctor",
        "Passport photo 4x6 (white background)",
        "Initial deposit for hajj savings",
      ],
    },
  },
  {
    id: "kartu",
    icon: FiCreditCard,
    title: { id: "Pengajuan Kartu Debit", en: "Debit Card Application" },
    docs: {
      id: [
        "KTP asli dan fotokopi",
        "Buku tabungan BSI",
        "Mengisi formulir pengajuan kartu",
      ],
      en: [
        "Original ID card (KTP) and photocopy",
        "BSI savings book",
        "Fill out the card application form",
      ],
    },
  },
];

function AccordionItem({ item, isOpen, onToggle, t, tr }) {
  const Icon = item.icon;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isOpen
          ? "border-emerald-500/25 bg-surface-card shadow-md"
          : "border-line bg-surface-card hover:border-emerald-500/15"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            isOpen
              ? "bg-emerald-500 text-white"
              : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          <Icon size={16} />
        </span>
        <span className="flex-1 text-sm font-bold text-ink">
          {tr(item.title)}
        </span>
        <FiChevronDown
          size={16}
          className={`shrink-0 text-ink-faint transition-transform duration-300 ${
            isOpen ? "rotate-180 text-emerald-500" : ""
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="border-t border-line px-5 pb-5 pt-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
            {t("docGuide.requiredDocs")}
          </p>
          <ul className="flex flex-col gap-2">
            {(Array.isArray(tr(item.docs)) ? tr(item.docs) : []).map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <FiCheck
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                <span className="text-sm text-ink-mid">{doc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-ink-faint">
            {t("docGuide.tip")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function DocumentGuide() {
  const { t, tr } = useLanguage();
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section className="border-t border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionTitle
            kicker={t("docGuide.kicker")}
            title={t("docGuide.title")}
            description={t("docGuide.desc")}
          />
        </motion.div>

        <motion.div
          variants={staggerContainer(0.06, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-10 max-w-3xl"
        >
          <div className="flex flex-col gap-3">
            {SERVICE_DOCS.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <AccordionItem
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                  t={t}
                  tr={tr}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <a
            href="https://wa.me/6281584114040?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20persyaratan%20dokumen%20untuk%20layanan%20BSI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            {t("docGuide.askUs")}
            <FiArrowRight size={15} />
          </a>
          <p className="mt-3 text-xs text-ink-faint">
            {t("docGuide.orCall")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
