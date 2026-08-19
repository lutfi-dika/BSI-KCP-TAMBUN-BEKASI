import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSave, FiRefreshCw } from "react-icons/fi";
import { apiRequest } from "../../api/admin.js";

export default function AdminContact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

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
      setToast("Tersimpan!");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  if (loading) return <div className="py-12 text-center text-sm text-ink-soft">Memuat...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink">Kontak</h3>
          <p className="mt-1 text-sm text-ink-soft">Informasi kontak dan lokasi kantor</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
        >
          <FiSave size={14} />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="rounded-xl border border-line bg-surface-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Cabang" value={data?.branch_name} onChange={(v) => update("branch_name", v)} />
          <Field label="Cabang Lengkap (ID)" value={data?.branch_full_id} onChange={(v) => update("branch_full_id", v)} />
          <Field label="Cabang Lengkap (EN)" value={data?.branch_full_en} onChange={(v) => update("branch_full_en", v)} />
          <Field label="Alamat" value={data?.address} onChange={(v) => update("address", v)} />
          <Field label="Telepon" value={data?.phone} onChange={(v) => update("phone", v)} />
          <Field label="BSI Call" value={data?.bsi_call} onChange={(v) => update("bsi_call", v)} />
          <Field label="WhatsApp" value={data?.whatsapp} onChange={(v) => update("whatsapp", v)} />
          <Field label="Email" value={data?.email} onChange={(v) => update("email", v)} />
          <Field label="Jam Operasional (ID)" value={data?.operational_hours_id} onChange={(v) => update("operational_hours_id", v)} />
          <Field label="Jam Operasional (EN)" value={data?.operational_hours_en} onChange={(v) => update("operational_hours_en", v)} />
          <Field label="Maps Embed URL" value={data?.maps_embed_url} onChange={(v) => update("maps_embed_url", v)} full />
          <Field label="Maps Link" value={data?.maps_link} onChange={(v) => update("maps_link", v)} full />
          <Field label="Instagram" value={data?.social_instagram} onChange={(v) => update("social_instagram", v)} />
          <Field label="Facebook" value={data?.social_facebook} onChange={(v) => update("social_facebook", v)} />
          <Field label="YouTube" value={data?.social_youtube} onChange={(v) => update("social_youtube", v)} />
          <Field label="Twitter" value={data?.social_twitter} onChange={(v) => update("social_twitter", v)} />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-500/30 bg-elevated px-4 py-3 text-sm font-medium text-ink shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-semibold text-ink-mid">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus:border-emerald-500 focus:outline-none"
      />
    </div>
  );
}
