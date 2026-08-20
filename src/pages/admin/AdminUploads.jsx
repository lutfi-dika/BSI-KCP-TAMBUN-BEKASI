import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiFile, FiTrash2, FiCopy, FiCheck, FiAlertCircle, FiImage, FiFileText } from "react-icons/fi";
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

function getFileIcon(name) {
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)) return FiImage;
  if (/\.pdf$/i.test(name)) return FiFileText;
  return FiFile;
}

export default function AdminUploads() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }

      const data = await apiRequest("/upload/multiple", {
        method: "POST",
        headers: {},
        body: formData,
      });

      const count = data.files?.length || 0;
      setUploaded((prev) => [...(data.files || []), ...prev]);
      showToast(`${count} file berhasil diupload`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast("Path berhasil disalin");
    setTimeout(() => setCopiedIdx(null), 2000);
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
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink">Upload File</h3>
        <p className="mt-1 text-sm text-ink-soft">Upload gambar atau dokumen untuk digunakan di website</p>
      </div>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          isDragOver
            ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]"
            : "border-line-strong bg-surface-card hover:border-emerald-500/50 hover:bg-emerald-500/[0.02]"
        }`}
      >
        <motion.div
          animate={isDragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted">
            <FiUpload size={28} className={`transition-colors ${isDragOver ? "text-emerald-500" : "text-ink-faint"}`} />
          </div>
        </motion.div>
        <p className="mt-4 text-sm font-medium text-ink-soft">
          {isDragOver ? "Lepaskan file di sini" : "Klik atau seret file ke sini"}
        </p>
        <p className="mt-1.5 text-xs text-ink-faint">JPG, PNG, GIF, WebP, SVG, PDF (maks 10MB)</p>

        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-emerald-500 font-medium">Mengupload file...</p>
          </div>
        )}
      </div>

      {/* Uploaded files */}
      <AnimatePresence>
        {uploaded.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-ink">File yang baru diupload</h4>
              <span className="text-xs text-ink-faint">{uploaded.length} file</span>
            </div>
            <div className="space-y-2">
              {uploaded.map((file, idx) => {
                const FileIcon = getFileIcon(file.originalname);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3 transition-all hover:border-emerald-500/30 hover:shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted">
                      <FileIcon size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{file.originalname}</p>
                      <p className="truncate text-xs text-ink-faint">{file.url}</p>
                    </div>
                    <span className="text-xs text-ink-faint shrink-0">
                      {file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${(file.size / 1024).toFixed(1)} KB`
                      }
                    </span>
                    <button
                      onClick={() => copyToClipboard(file.url, idx)}
                      title="Salin path"
                      className="rounded-lg p-1.5 text-ink-faint transition-all hover:text-emerald-500 hover:bg-emerald-500/10 opacity-60 group-hover:opacity-100"
                    >
                      {copiedIdx === idx ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
