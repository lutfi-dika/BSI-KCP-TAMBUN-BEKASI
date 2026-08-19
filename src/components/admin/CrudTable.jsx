import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiEdit3, FiRefreshCw, FiSave, FiX, FiSearch } from "react-icons/fi";
import { apiRequest } from "../../api/admin.js";

export default function CrudTable({
  endpoint,
  columns = [],
  emptyText = "Belum ada data",
  title = "Data",
  description = "",
  renderForm,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest(endpoint);
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [endpoint]);

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some((col) => String(item[col.key] || "").toLowerCase().includes(q));
  });

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await apiRequest(`${endpoint}/${editing.id}`, { method: "PUT", body: JSON.stringify(formData) });
      } else {
        await apiRequest(endpoint, { method: "POST", body: JSON.stringify(formData) });
      }
      setEditing(null);
      fetchItems();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus item ini?")) return;
    try {
      await apiRequest(`${endpoint}/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchItems}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface-card px-3 py-2 text-xs font-semibold text-ink-mid transition-all hover:border-emerald-500 hover:text-emerald-500 hover:shadow-sm"
          >
            <FiRefreshCw size={13} />
            Refresh
          </button>
          <button
            onClick={() => setEditing({})}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            <FiPlus size={13} />
            Tambah
          </button>
        </div>
      </div>

      {/* Search bar */}
      {!loading && items.length > 0 && (
        <div className="mb-4">
          <div className="relative max-w-sm">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder={`Cari ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-line-strong bg-surface-card py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-line bg-surface-card shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-surface-muted/50">
              <h4 className="text-sm font-semibold text-ink">
                {editing.id ? `Edit ${title}` : `Tambah ${title}`}
              </h4>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                <FiX size={16} />
              </button>
            </div>
            <div className="p-5">
              {renderForm ? (
                renderForm(editing, handleSave, () => setEditing(null))
              ) : (
                <DefaultForm
                  columns={columns}
                  item={editing}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer h-12 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-line-strong bg-surface-card py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted">
            <FiSearch size={22} className="text-ink-faint" />
          </div>
          <p className="mt-4 text-sm font-medium text-ink-soft">{search ? "Tidak ada hasil ditemukan" : emptyText}</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-xs font-semibold text-emerald-500 hover:text-emerald-600"
            >
              Hapus pencarian
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-500/5 to-transparent border-b border-line">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">No</th>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">{col.label}</th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-faint">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="transition-colors hover:bg-emerald-500/[0.02]">
                  <td className="px-4 py-3 text-ink-faint">{idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-ink">
                      {renderCell(item[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditing(item)}
                        title="Edit"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-all hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 hover:shadow-sm"
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-all hover:border-red-500 hover:bg-red-500/10 hover:text-red-500 hover:shadow-sm"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer count */}
          <div className="border-t border-line px-4 py-2.5 text-xs text-ink-faint">
            Menampilkan {filtered.length} dari {items.length} item
          </div>
        </div>
      )}
    </div>
  );
}

function DefaultForm({ columns, item, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState(() => {
    const initial = { ...item };
    delete initial.id;
    delete initial.created_at;
    delete initial.updated_at;
    return initial;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {columns.map((col) => (
          <div key={col.key} className={col.type === "textarea" ? "sm:col-span-2" : ""}>
            <label className="mb-1.5 block text-xs font-semibold text-ink-mid">{col.label}</label>
            {col.type === "textarea" ? (
              <textarea
                value={formData[col.key] || ""}
                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            ) : col.type === "select" ? (
              <select
                value={formData[col.key] || ""}
                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              >
                <option value="">Pilih...</option>
                {col.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={col.type || "text"}
                value={formData[col.key] || ""}
                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-ink transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
        >
          <FiSave size={14} />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-mid transition-all hover:bg-surface-muted hover:text-ink"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function renderCell(value) {
  if (value === null || value === undefined) return <span className="text-ink-faint">-</span>;
  if (typeof value === "string" && value.length > 80) {
    return <span className="line-clamp-1">{value}</span>;
  }
  return String(value);
}
