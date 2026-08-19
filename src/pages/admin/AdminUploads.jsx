import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFile, FiTrash2, FiCopy, FiCheck } from "react-icons/fi";
import { apiRequest } from "../../api/admin.js";

export default function AdminUploads() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const fileRef = useRef(null);

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
        headers: {}, // Let browser set Content-Type with boundary
        body: formData,
      });

      setUploaded((prev) => [...(data.files || []), ...prev]);
    } catch (err) {
      alert(`Upload gagal: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-ink">Upload File</h3>
        <p className="mt-1 text-sm text-ink-soft">Upload gambar atau dokumen untuk digunakan di website</p>
      </div>

      {/* Upload area */}
      <div className="rounded-xl border-2 border-dashed border-line-strong bg-surface-card p-8 text-center transition-colors hover:border-emerald-500/50">
        <FiUpload size={32} className="mx-auto text-ink-faint" />
        <p className="mt-3 text-sm text-ink-soft">Klik atau seret file ke sini</p>
        <p className="mt-1 text-xs text-ink-faint">JPG, PNG, GIF, WebP, SVG, PDF (maks 10MB)</p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf"
          onChange={(e) => handleUpload(e.target.files)}
          className="mt-4 block mx-auto text-sm text-ink file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-600"
        />
        {uploading && (
          <p className="mt-3 text-sm text-emerald-500">Mengupload...</p>
        )}
      </div>

      {/* Uploaded files */}
      {uploaded.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-ink">File yang baru diupload</h4>
          <div className="space-y-2">
            {uploaded.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-lg border border-line bg-surface-card px-4 py-3"
              >
                <FiFile size={16} className="shrink-0 text-emerald-500" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{file.originalname}</p>
                  <p className="truncate text-xs text-ink-faint">{file.url}</p>
                </div>
                <span className="text-xs text-ink-faint">{(file.size / 1024).toFixed(1)} KB</span>
                <button
                  onClick={() => copyToClipboard(file.url, idx)}
                  title="Salin path"
                  className="rounded-lg p-1.5 text-ink-faint transition-colors hover:text-emerald-500"
                >
                  {copiedIdx === idx ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
