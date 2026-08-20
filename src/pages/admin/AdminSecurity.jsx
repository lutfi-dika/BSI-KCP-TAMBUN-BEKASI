import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiShield, FiKey, FiGlobe, FiLock, FiPlus, FiTrash2,
  FiCheck, FiX, FiLoader, FiAlertCircle, FiInfo, FiEye, FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/admin";

export default function AdminSecurity() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Secret key state
  const [newSecretKey, setNewSecretKey] = useState("");
  const [confirmSecretKey, setConfirmSecretKey] = useState("");
  const [secretHint, setSecretHint] = useState("");
  const [showNewSecretKey, setShowNewSecretKey] = useState(false);

  // IP whitelist state
  const [newIp, setNewIp] = useState("");
  const [newIpLabel, setNewIpLabel] = useState("");
  const [addingIp, setAddingIp] = useState(false);

  // Feedback
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const data = await apiRequest("/auth/security-settings");
      setSettings(data);
    } catch (err) {
      setError(err.message || "Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Toggle session binding
  const toggleSessionBinding = async () => {
    setSaving(true);
    try {
      await apiRequest("/auth/security-settings", {
        method: "PUT",
        body: JSON.stringify({
          sessionBinding: !settings.sessionBinding,
          ipWhitelistEnabled: settings.ipWhitelistEnabled,
        }),
      });
      setSettings((prev) => ({ ...prev, sessionBinding: !prev.sessionBinding }));
      showSuccess(settings.sessionBinding ? "Session binding dinonaktifkan" : "Session binding diaktifkan");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle IP whitelist
  const toggleIpWhitelist = async () => {
    setSaving(true);
    try {
      await apiRequest("/auth/security-settings", {
        method: "PUT",
        body: JSON.stringify({
          sessionBinding: settings.sessionBinding,
          ipWhitelistEnabled: !settings.ipWhitelistEnabled,
        }),
      });
      setSettings((prev) => ({ ...prev, ipWhitelistEnabled: !prev.ipWhitelistEnabled }));
      showSuccess(settings.ipWhitelistEnabled ? "IP Whitelist dinonaktifkan" : "IP Whitelist diaktifkan");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Set secret key
  const handleSetSecretKey = async (e) => {
    e.preventDefault();
    setError("");

    if (newSecretKey !== confirmSecretKey) {
      setError("Konfirmasi secret key tidak cocok");
      return;
    }
    if (newSecretKey.length < 4) {
      setError("Secret key minimal 4 karakter");
      return;
    }

    setSaving(true);
    try {
      await apiRequest("/auth/set-secret-key", {
        method: "POST",
        body: JSON.stringify({ secretKey: newSecretKey, hint: secretHint }),
      });
      setNewSecretKey("");
      setConfirmSecretKey("");
      setSecretHint("");
      setSettings((prev) => ({ ...prev, hasSecretKey: true, secretKeyHint: secretHint }));
      showSuccess("Secret key berhasil diatur");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Remove secret key
  const handleRemoveSecretKey = async () => {
    if (!confirm("Yakin ingin menghapus secret key?")) return;
    setSaving(true);
    try {
      await apiRequest("/auth/remove-secret-key", { method: "DELETE" });
      setSettings((prev) => ({ ...prev, hasSecretKey: false, secretKeyHint: "" }));
      showSuccess("Secret key berhasil dihapus");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add IP to whitelist
  const handleAddIp = async (e) => {
    e.preventDefault();
    setError("");
    setAddingIp(true);

    try {
      await apiRequest("/auth/whitelist-ip", {
        method: "POST",
        body: JSON.stringify({ ip: newIp, label: newIpLabel }),
      });
      setNewIp("");
      setNewIpLabel("");
      fetchSettings();
      showSuccess("IP berhasil ditambahkan");
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingIp(false);
    }
  };

  // Add current IP
  const handleAddMyIp = async () => {
    setSaving(true);
    try {
      const data = await apiRequest("/auth/whitelist-my-ip", {
        method: "POST",
        body: JSON.stringify({ label: "Device ini" }),
      });
      fetchSettings();
      showSuccess(`IP ${data.ip} berhasil ditambahkan`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Remove IP from whitelist
  const handleRemoveIp = async (id) => {
    if (!confirm("Hapus IP ini dari whitelist?")) return;
    setSaving(true);
    try {
      await apiRequest(`/auth/whitelist-ip/${id}`, { method: "DELETE" });
      fetchSettings();
      showSuccess("IP berhasil dihapus");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader size={24} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink">Pengaturan Keamanan</h2>
        <p className="text-sm text-ink-soft mt-1">
          Kelola lapisan keamanan untuk dashboard admin
        </p>
      </div>

      {/* Feedback */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600"
        >
          <FiCheck size={16} />
          {success}
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
        >
          <FiAlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {/* Session Binding */}
      <div className="rounded-2xl border border-line bg-surface-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <FiLock size={20} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">Session Binding</h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  Token hanya berlaku dari IP & browser yang sama. Jika ada yang mencuri token, tidak bisa dipakai di device lain.
                </p>
              </div>
              <button
                onClick={toggleSessionBinding}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  settings?.sessionBinding
                    ? "bg-emerald-500"
                    : "bg-surface-muted border border-line"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    settings?.sessionBinding ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-ink-faint">
              <FiInfo size={10} />
              <span>{settings?.sessionBinding ? "Aktif — token terikat ke device" : "Nonaktif"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Key */}
      <div className="rounded-2xl border border-line bg-surface-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <FiKey size={20} className="text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-ink">Admin Secret Key</h3>
            <p className="text-xs text-ink-soft mt-0.5">
              Layer keamanan tambahan — harus memasukkan secret key setelah login untuk mengakses dashboard.
            </p>

            {settings?.hasSecretKey ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-ink-mid">
                  <FiCheck size={14} className="text-emerald-500" />
                  <span>Secret key sudah diatur</span>
                  {settings?.secretKeyHint && (
                    <span className="text-ink-faint">— Hint: {settings.secretKeyHint}</span>
                  )}
                </div>
                <button
                  onClick={handleRemoveSecretKey}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  <FiTrash2 size={12} />
                  Hapus Secret Key
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetSecretKey} className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-mid">Secret Key Baru</label>
                  <div className="relative">
                    <FiKey size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                    <input
                      type={showNewSecretKey ? "text" : "password"}
                      value={newSecretKey}
                      onChange={(e) => setNewSecretKey(e.target.value)}
                      placeholder="Minimal 4 karakter"
                      className="w-full rounded-xl border border-line-strong bg-surface py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewSecretKey(!showNewSecretKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                    >
                      {showNewSecretKey ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-mid">Konfirmasi</label>
                  <input
                    type={showNewSecretKey ? "text" : "password"}
                    value={confirmSecretKey}
                    onChange={(e) => setConfirmSecretKey(e.target.value)}
                    placeholder="Ulangi secret key"
                    className="w-full rounded-xl border border-line-strong bg-surface py-2.5 px-9 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-mid">Hint (opsional)</label>
                  <input
                    type="text"
                    value={secretHint}
                    onChange={(e) => setSecretHint(e.target.value)}
                    placeholder="Petunjuk untuk mengingat secret key"
                    className="w-full rounded-xl border border-line-strong bg-surface py-2.5 px-3 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving || !newSecretKey || !confirmSecretKey}
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {saving ? <FiLoader size={14} className="animate-spin" /> : <FiKey size={14} />}
                  Atur Secret Key
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="rounded-2xl border border-line bg-surface-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <FiGlobe size={20} className="text-purple-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">IP Whitelist</h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  Hanya IP tertentu yang diizinkan mengakses panel admin. Aktifkan setelah menambahkan IP Anda.
                </p>
              </div>
              <button
                onClick={toggleIpWhitelist}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  settings?.ipWhitelistEnabled
                    ? "bg-emerald-500"
                    : "bg-surface-muted border border-line"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    settings?.ipWhitelistEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-ink-faint">
              <FiInfo size={10} />
              <span>{settings?.ipWhitelistEnabled ? "Aktif — hanya IP terdaftar yang bisa akses" : "Nonaktif"}</span>
            </div>

            {/* Add current IP */}
            <button
              onClick={handleAddMyIp}
              disabled={saving}
              className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
            >
              <FiPlus size={12} />
              Tambahkan IP Device Ini
            </button>

            {/* Add new IP */}
            <form onSubmit={handleAddIp} className="mt-4 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-ink-mid">IP Address</label>
                <input
                  type="text"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.1"
                  className="w-full rounded-xl border border-line-strong bg-surface py-2.5 px-3 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-ink-mid">Label</label>
                <input
                  type="text"
                  value={newIpLabel}
                  onChange={(e) => setNewIpLabel(e.target.value)}
                  placeholder="Kantor, Rumah"
                  className="w-full rounded-xl border border-line-strong bg-surface py-2.5 px-3 text-sm text-ink placeholder:text-ink-faint focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
              <button
                type="submit"
                disabled={addingIp || !newIp}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {addingIp ? <FiLoader size={14} className="animate-spin" /> : <FiPlus size={14} />}
              </button>
            </form>

            {/* Whitelisted IPs list */}
            {settings?.whitelistedIps?.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs font-semibold text-ink-mid">IP Terdaftar</label>
                {settings.whitelistedIps.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-line bg-surface-muted px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{item.ip}</p>
                      <p className="text-[10px] text-ink-faint">
                        {item.label || "Tanpa label"} — {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveIp(item.id)}
                      disabled={saving}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {settings?.whitelistedIps?.length === 0 && (
              <p className="mt-3 text-xs text-ink-faint italic">
                Belum ada IP terdaftar. Tambahkan IP Anda terlebih dahulu sebelum mengaktifkan whitelist.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <FiInfo size={16} className="mt-0.5 shrink-0 text-blue-500" />
          <div className="text-xs text-ink-mid space-y-1">
            <p className="font-semibold">Tentang Keamanan</p>
            <ul className="list-disc list-inside space-y-0.5 text-ink-soft">
              <li><strong>Session Binding</strong> — mengikat token ke IP + browser. Jika token dicuri, tidak bisa dipakai di tempat lain.</li>
              <li><strong>Secret Key</strong> — passphrase tambahan setelah login. Jika seseorang berhasil login, mereka masih butuh secret key.</li>
              <li><strong>IP Whitelist</strong> — hanya IP tertentu yang boleh mengakses admin. Paling ketat, tapi harus daftar IP dulu.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
