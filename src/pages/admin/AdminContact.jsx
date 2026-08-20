import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiRefreshCw, FiCheck, FiAlertCircle, FiMapPin, FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import { apiRequest } from "../../api/admin.js";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    error: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  };
  const icons = { success: FiCheck, error: FiAlertCircle };
  const Icon = icons[type] || FiCheck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-sm ${styles[type] || styles.success}`}
    >
      <Icon size={16} />
      {message}
    </motion.div>
  );
}

const FIELD_SECTIONS = [
  {
    title: "Informasi Cabang",
    icon: FiMapPin,
    fields: [
      { key: "branch_name", label: "Nama Cabang" },
      { key: "branch_full_id", label: "Cabang Lengkap (ID)" },
      { key: "branch_full_en", label: "Cabang Lengkap (EN)" },
      { key: "address", label: "Alamat", full: true },
    ],
  },
  {
    title: "Kontak",
    icon: FiPhone,
    fields: [
      { key: "phone", label: "Telepon" },
      { key: "bsi_call", label: "BSI Call" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "email", label: "Email", type: "email" },
    ],
  },
  {
    title: "Jam Operasional",
    icon: FiGlobe,
    fields: [
      { key: "operational_hours_id", label: "Jam Operasional (ID)", full: true },
      { key: "operational_hours_en", label: "Jam Operasional (EN)", full: true },
    ],
  },
  {
    title: "Peta & Media Sosial",
    icon: FiGlobe,
    fields: [
      { key: "maps_embed_url", label: "Maps Embed URL", full: true },
      { key: "maps_link", label: "Maps Link", full: true },
      { key: "social_instagram", label: "Instagram" },
      { key: "social_facebook", label: "Facebook" },
      { key: "social_youtube", label: "YouTube" },
      { key: "social_twitter", label: "Twitter" },
    ],
  },
];

export default function AdminContact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    apiRequest("/admin/contact")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await apiRequest("/admin/contact", { method: "PUT", body: JSON.stringify(data) });
      setData(updated);
      setToast({ message: "Kontak berhasil disimpan!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="shimmer h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink">Kontak</h3>
          <p className="mt-1 text-sm text-ink-soft">Informasi kontak dan lokasi kantor</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-surface-card px-3.5 py-2 text-xs font-semibold text-ink-mid transition-all hover:border-emerald-500/30 hover:text-emerald-500 hover:shadow-sm"
          >
            <FiRefreshCw size={13} />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
          >
            <FiSave size={14} />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Field Sections */}
      <div className="space-y-6">
        {FIELD_SECTIONS.map(({ title, icon: SectionIcon, fields }) => (
          <div key={title} className="rounded-2xl border border-line bg-surface-card overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 bg-surface-muted/30">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                <SectionIcon size={14} className="text-emerald-500" />
              </div>
              <h4 className="text-sm font-semibold text-ink">{title}</h4>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map(({ key, label, full, type }) => (
                  <div key={key} className={full ? "sm:col-span-2" : ""}>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-mid">{label}</label>
                    <input
                      type={type || "text"}
                      value={data?.[key] || ""}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm text-ink transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder:text-ink-faint"
                      placeholder={`Masukkan ${label.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
