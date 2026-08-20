import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFileText, FiHelpCircle, FiImage, FiBook, FiTag,
  FiMapPin, FiBarChart2, FiUsers, FiArrowRight, FiClock,
  FiUpload, FiSettings, FiTrendingUp, FiActivity, FiGlobe,
  FiShield, FiZap,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/admin.js";
import { fadeUp, staggerContainer } from "../../utils/animation";

const STAT_CARDS = [
  { key: "news", label: "Berita", icon: FiFileText, endpoint: "/admin/news", color: "from-blue-500/10 to-blue-500/5", iconColor: "text-blue-500", iconBg: "bg-blue-500/10", to: "/admin/news" },
  { key: "faqs", label: "FAQ", icon: FiHelpCircle, endpoint: "/admin/faqs", color: "from-violet-500/10 to-violet-500/5", iconColor: "text-violet-500", iconBg: "bg-violet-500/10", to: "/admin/faq" },
  { key: "gallery", label: "Galeri", icon: FiImage, endpoint: "/admin/gallery", color: "from-pink-500/10 to-pink-500/5", iconColor: "text-pink-500", iconBg: "bg-pink-500/10", to: "/admin/gallery" },
  { key: "brochures", label: "Brosur", icon: FiBook, endpoint: "/admin/brochures", color: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-500", iconBg: "bg-amber-500/10", to: "/admin/brochures" },
  { key: "promos", label: "Promo", icon: FiTag, endpoint: "/admin/promos", color: "from-rose-500/10 to-rose-500/5", iconColor: "text-rose-500", iconBg: "bg-rose-500/10", to: "/admin/promos" },
  { key: "services", label: "Layanan", icon: FiSettings, endpoint: "/admin/services", color: "from-teal-500/10 to-teal-500/5", iconColor: "text-teal-500", iconBg: "bg-teal-500/10", to: "/admin/services" },
  { key: "statistics", label: "Statistik", icon: FiBarChart2, endpoint: "/admin/statistics", color: "from-cyan-500/10 to-cyan-500/5", iconColor: "text-cyan-500", iconBg: "bg-cyan-500/10", to: "/admin/statistics" },
  { key: "organization", label: "Organisasi", icon: FiUsers, endpoint: "/admin/organization", color: "from-indigo-500/10 to-indigo-500/5", iconColor: "text-indigo-500", iconBg: "bg-indigo-500/10", to: "/admin/organization" },
];

const QUICK_ACTIONS = [
  { label: "Tambah Berita", to: "/admin/news", icon: FiFileText, desc: "Artikel baru" },
  { label: "Kelola Galeri", to: "/admin/gallery", icon: FiImage, desc: "Foto & gambar" },
  { label: "Upload File", to: "/admin/uploads", icon: FiUpload, desc: "Gambar/dokumen" },
  { label: "Lihat Website", to: "/", icon: FiGlobe, desc: "Buka di tab baru", external: true },
];

export default function AdminHome() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    STAT_CARDS.forEach(async ({ key, endpoint }) => {
      try {
        const data = await apiRequest(endpoint);
        setCounts((prev) => ({ ...prev, [key]: Array.isArray(data) ? data.length : 0 }));
      } catch {
        setCounts((prev) => ({ ...prev, [key]: 0 }));
      }
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Siang" : "Selamat Malam";
  const totalContent = Object.values(counts).reduce((a, b) => a + (b || 0), 0);

  return (
    <motion.div
      variants={staggerContainer(0.06, 0.1)}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={fadeUp}
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20 sm:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5 blur-xl" />
        <div className="absolute right-20 bottom-8 h-20 w-20 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <FiZap size={14} className="text-emerald-200" />
            <p className="text-sm font-medium text-emerald-100">
              {greeting}
            </p>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">
            {user.name || "Admin"}
          </h1>
          <p className="mt-2 max-w-md text-sm text-emerald-100/80 leading-relaxed">
            Kelola konten website BSI KCP Tambun Bekasi dari satu tempat.
            Saat ini terdapat <span className="font-semibold text-white">{totalContent}</span> item konten aktif.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/60">
              <FiClock size={12} />
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-100/60">
              <FiShield size={12} />
              Status: Aktif
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, iconColor, iconBg, to }) => (
          <motion.div key={key} variants={fadeUp}>
            <NavLink
              to={to}
              className={`group block rounded-2xl border border-line bg-gradient-to-br ${color} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/30`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-emerald-500">
                  <span className="text-[10px] font-medium">Kelola</span>
                  <FiArrowRight size={12} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-ink tracking-tight">{counts[key] ?? "..."}</p>
              <p className="mt-1 text-sm text-ink-soft font-medium">{label}</p>
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <FiZap size={14} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-ink">Aksi Cepat</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {QUICK_ACTIONS.map(({ label, to, icon: Icon, desc, external }) => (
            external ? (
              <a
                key={to}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3 transition-all hover:border-emerald-500/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-ink-faint transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-500">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-mid">{label}</p>
                  <p className="text-[10px] text-ink-faint">{desc}</p>
                </div>
              </a>
            ) : (
              <NavLink
                key={to}
                to={to}
                className="group flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3 transition-all hover:border-emerald-500/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-ink-faint transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-500">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-mid">{label}</p>
                  <p className="text-[10px] text-ink-faint">{desc}</p>
                </div>
              </NavLink>
            )
          ))}
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div variants={fadeUp} className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <FiActivity size={14} className="text-emerald-500" />
          <h3 className="text-sm font-semibold text-ink">Status Sistem</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <FiShield size={14} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">Keamanan</p>
              <p className="text-[10px] text-emerald-500 font-medium">Aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <FiTrendingUp size={14} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">Database</p>
              <p className="text-[10px] text-emerald-500 font-medium">Terhubung</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-card px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <FiGlobe size={14} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">Website</p>
              <p className="text-[10px] text-emerald-500 font-medium">Online</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
