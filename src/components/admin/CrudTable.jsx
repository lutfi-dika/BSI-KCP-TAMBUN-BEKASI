import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiTrash2, FiEdit3, FiRefreshCw, FiSave, FiX,
  FiSearch, FiCheck, FiAlertCircle, FiInbox, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
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
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

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

  useEffect(() => { setPage(1); }, [search]);

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some((col) => String(item[col.key] || "").toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await apiRequest(`${endpoint}/${editing.id}`, { method: "PUT", body: JSON.stringify(formData) });
        showToast(`${title} berhasil diperbarui`);
      } else {
        await apiRequest(endpoint, { method: "POST", body: JSON.stringify(formData) });
        showToast(`${title} berhasil ditambahkan`);
      }
      setEditing(null);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus item ini?")) return;
    try {
      await apiRequest(`${endpoint}/${id}`, { method: "DELETE" });
      showToast(`${title} berhasil dihapus`);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchItems}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-surface-card px-3.5 py-2 text-xs font-semibold text-ink-mid transition-all hover:border-emerald-500/30 hover:text-emerald-500 hover:shadow-sm"
          >
            <FiRefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setEditing({})}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30"
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
              className="w-full rounded-xl border border-line-strong bg-surface-card py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <FiAlertCircle size={16} />
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
            className="mb-6 overflow-hidden rounded-2xl border border-line bg-surface-card shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-surface-muted/30">
              <div>
                <h4 className="text-sm font-semibold text-ink">
                  {editing.id ? `Edit ${title}` : `Tambah ${title} Baru`}
                </h4>
                {editing.id && (
                  <p className="mt-0.5 text-xs text-ink-faint">ID: {editing.id}</p>
                )}
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-red-500/10 hover:text-red-500"
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
            <div key={i} className="shimmer h-14 rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface-card py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted">
            <FiInbox size={26} className="text-ink-faint" />
          </div>
          <p className="mt-4 text-sm font-medium text-ink-soft">{search ? "Tidak ada hasil ditemukan" : emptyText}</p>
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              Hapus pencarian
            </button>
          ) : (
            <button
              onClick={() => setEditing({})}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <FiPlus size={12} />
              Tambah {title} pertama
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-line shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-500/5 to-transparent border-b border-line">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">No</th>
                {columns.slice(0, 5).map((col) => (
                  <th key={col.key} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{col.label}</th>
                ))}
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-ink-faint">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {paginated.map((item, idx) => (
                <tr key={item.id} className="transition-colors hover:bg-emerald-500/[0.02] group">
                  <td className="px-4 py-3 text-ink-faint text-xs">
                    {(page - 1) * PER_PAGE + idx + 1}
                  </td>
                  {columns.slice(0, 5).map((col) => (
                    <td key={col.key} className="px-4 py-3 text-ink">
                      {renderCell(item[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
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

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <span className="text-xs text-ink-faint">
              Menampilkan {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} item
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-all hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                      p === page
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "border border-line-strong text-ink-mid hover:border-emerald-500 hover:text-emerald-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line-strong text-ink-faint transition-all hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            )}
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
                className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-ink transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder:text-ink-faint"
                placeholder={`Masukkan ${col.label.toLowerCase()}...`}
              />
            ) : col.type === "select" ? (
              <select
                value={formData[col.key] || ""}
                onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-ink transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
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
                className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-ink transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 placeholder:text-ink-faint"
                placeholder={`Masukkan ${col.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
        >
          <FiSave size={14} />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-mid transition-all hover:bg-surface-muted hover:text-ink"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function renderCell(value) {
  if (value === null || value === undefined) return <span className="text-ink-faint">-</span>;
  if (typeof value === "string" && value.length > 60) {
    return (
      <span className="inline-block max-w-[200px] truncate text-sm" title={value}>
        {value}
      </span>
    );
  }
  return <span className="text-sm">{String(value)}</span>;
}
