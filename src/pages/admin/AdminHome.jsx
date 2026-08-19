import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFileText, FiHelpCircle, FiImage, FiBook, FiTag,
  FiMapPin, FiBarChart2, FiUsers, FiArrowRight, FiClock,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/admin.js";
import { fadeUp, staggerContainer } from "../../utils/animation";

const STAT_CARDS = [
  { key: "news", label: "Berita", icon: FiFileText, endpoint: "/admin/news", color: "emerald", to: "/admin/news" },
  { key: "faqs", label: "FAQ", icon: FiHelpCircle, endpoint: "/admin/faqs", color: "blue", to: "/admin/faq" },
  { key: "gallery", label: "Galeri", icon: FiImage, endpoint: "/admin/gallery", color: "purple", to: "/admin/gallery" },
  { key: "brochures", label: "Brosur", icon: FiBook, endpoint: "/admin/brochures", color: "amber", to: "/admin/brochures" },
  { key: "promos", label: "Promo", icon: FiTag, endpoint: "/admin/promos", color: "rose", to: "/admin/promos" },
  { key: "services", label: "Layanan", icon: FiMapPin, endpoint: "/admin/services", color: "teal", to: "/admin/services" },
  { key: "statistics", label: "Statistik", icon: FiBarChart2, endpoint: "/admin/statistics", color: "cyan", to: "/admin/statistics" },
  { key: "organization", label: "Organisasi", icon: FiUsers, endpoint: "/admin/organization", color: "indigo", to: "/admin/organization" },
];

const QUICK_ACTIONS = [
  { label: "Tambah Berita", to: "/admin/news" },
  { label: "Kelola Galeri", to: "/admin/gallery" },
  { label: "Upload File", to: "/admin/uploads" },
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
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <p className="text-sm font-medium text-emerald-100">
            {greeting}
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            {user.name || "Admin"}
          </h1>
          <p className="mt-2 max-w-md text-sm text-emerald-100/80">
            Kelola konten website BSI KCP Tambun Bekasi dari satu tempat.
            Saat ini terdapat <span className="font-semibold text-white">{totalContent}</span> item konten aktif.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/60">
            <FiClock size={13} />
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, to }) => (
          <motion.div key={key} variants={fadeUp}>
            <NavLink
              to={to}
              className="group block rounded-xl border border-line bg-surface-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/30"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-500 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={20} />
                </div>
                <FiArrowRight
                  size={14}
                  className="text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-emerald-500"
                />
              </div>
              <p className="mt-4 text-2xl font-bold text-ink">{counts[key] ?? "..."}</p>
              <p className="mt-1 text-sm text-ink-soft">{label}</p>
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-ink-mid">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={`inline-flex items-center gap-2 rounded-lg border border-line bg-surface-card px-4 py-2.5 text-xs font-semibold text-ink-mid transition-all hover:border-emerald-500/30 hover:text-emerald-600 hover:shadow-sm dark:hover:text-emerald-400`}
            >
              <FiArrowRight size={13} />
              {label}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
