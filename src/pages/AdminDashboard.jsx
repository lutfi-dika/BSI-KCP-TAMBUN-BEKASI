import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiFileText, FiHelpCircle, FiImage, FiBook,
  FiTag, FiMapPin, FiBarChart2, FiUsers, FiUpload,
  FiLogOut, FiMenu, FiX, FiSettings, FiChevronLeft,
  FiExternalLink, FiClock, FiAlertCircle, FiShield,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NAV_KONTEN = [
  { to: "/admin/dashboard", icon: FiHome, label: "Dashboard", desc: "Ringkasan" },
  { to: "/admin/news", icon: FiFileText, label: "Berita", desc: "Artikel & pengumuman" },
  { to: "/admin/faq", icon: FiHelpCircle, label: "FAQ", desc: "Pertanyaan umum" },
  { to: "/admin/gallery", icon: FiImage, label: "Galeri", desc: "Foto & gambar" },
  { to: "/admin/brochures", icon: FiBook, label: "Brosur", desc: "Dokumen produk" },
  { to: "/admin/promos", icon: FiTag, label: "Promo", desc: "Banner promosi" },
];

const NAV_UTILITAS = [
  { to: "/admin/services", icon: FiSettings, label: "Layanan", desc: "Produk & layanan" },
  { to: "/admin/contact", icon: FiMapPin, label: "Kontak", desc: "Info kontak" },
  { to: "/admin/statistics", icon: FiBarChart2, label: "Statistik", desc: "Data KPI" },
  { to: "/admin/organization", icon: FiUsers, label: "Organisasi", desc: "Struktur org" },
  { to: "/admin/uploads", icon: FiUpload, label: "Upload File", desc: "Manajemen file" },
  { to: "/admin/security", icon: FiShield, label: "Keamanan", desc: "Proteksi akses" },
];

const ALL_NAV = [...NAV_KONTEN, ...NAV_UTILITAS];

function NavItem({ to, icon: Icon, label, desc, isActive, onClick }) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-400 shadow-sm shadow-emerald-500/10"
            : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
        }`}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-emerald-500/20 text-emerald-400 shadow-inner"
              : "bg-white/[0.04] text-gray-500 group-hover:bg-white/[0.08] group-hover:text-gray-300"
          }`}
        >
          <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <p className={`truncate ${isActive ? "text-emerald-50 dark:text-emerald-50" : ""}`}>{label}</p>
          {desc && (
            <p className="truncate text-[10px] text-gray-500 mt-0.5">{desc}</p>
          )}
        </div>
        {isActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
        )}
      </NavLink>
    </li>
  );
}

function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute bottom-full left-0 right-0 mb-2 mx-2 rounded-xl border border-red-500/20 bg-gray-900 p-4 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
          <FiAlertCircle size={16} className="text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Konfirmasi Logout</p>
          <p className="mt-0.5 text-xs text-gray-400">Anda akan keluar dari panel admin</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/25"
        >
          Ya, Logout
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-white/10"
        >
          Batal
        </button>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentNav = ALL_NAV.find((n) => location.pathname.startsWith(n.to));
  const currentLabel = currentNav?.label || "Admin";
  const currentDesc = currentNav?.desc || "";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-out lg:translate-x-0 lg:relative lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white shrink-0`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
            <span className="text-sm font-bold text-white tracking-wide">BSI</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white tracking-tight">Admin Panel</p>
            <p className="text-[10px] text-gray-500 font-medium">KCP Tambun Bekasi</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:text-white lg:hidden transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {/* Kelola Konten */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500/80">
              Kelola Konten
            </p>
            <ul className="space-y-0.5">
              {NAV_KONTEN.map((item) => (
                <NavItem
                  key={item.to}
                  {...item}
                  isActive={location.pathname.startsWith(item.to)}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </ul>
          </div>

          {/* Utilitas */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500/80">
              Utilitas
            </p>
            <ul className="space-y-0.5">
              {NAV_UTILITAS.map((item) => (
                <NavItem
                  key={item.to}
                  {...item}
                  isActive={location.pathname.startsWith(item.to)}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </ul>
          </div>
        </nav>

        {/* View Website Link */}
        <div className="px-3 pb-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-xs font-medium text-gray-400 transition-all hover:border-emerald-500/20 hover:text-emerald-400 hover:bg-emerald-500/[0.05]"
          >
            <FiExternalLink size={14} />
            Lihat Website
          </a>
        </div>

        {/* User + Logout */}
        <div className="border-t border-white/[0.06] p-3 relative">
          <AnimatePresence>
            {showLogout && (
              <LogoutConfirm
                onConfirm={handleLogout}
                onCancel={() => setShowLogout(false)}
              />
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white shadow-md shadow-emerald-500/20">
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[10px] text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => setShowLogout(!showLogout)}
              title="Logout"
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
            >
              <FiLogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface-card/80 px-4 backdrop-blur-xl lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-ink-faint hover:text-ink hover:bg-surface-muted lg:hidden transition-colors"
          >
            <FiMenu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint font-medium">Admin</span>
            <span className="text-ink-faint/50">/</span>
            <h2 className="text-sm font-semibold text-ink">{currentLabel}</h2>
            {currentDesc && (
              <>
                <span className="text-ink-faint/30 hidden sm:inline">|</span>
                <span className="text-xs text-ink-faint hidden sm:inline">{currentDesc}</span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Back to website */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface-card px-3 py-1.5 text-xs font-medium text-ink-mid transition-all hover:border-emerald-500/30 hover:text-emerald-600 hover:shadow-sm"
            >
              <FiExternalLink size={12} />
              Website
            </a>

            {/* Status badge */}
            <div className="hidden sm:flex h-7 items-center rounded-full bg-emerald-500/10 px-2.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-line px-6 py-3 text-center text-[10px] text-ink-faint">
          <div className="flex items-center justify-center gap-1.5">
            <FiClock size={10} />
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            <span className="mx-1 text-ink-faint/30">|</span>
            BSI KCP Tambun Bekasi
          </div>
        </footer>
      </div>
    </div>
  );
}
