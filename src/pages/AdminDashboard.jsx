import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiFileText, FiHelpCircle, FiImage, FiBook,
  FiTag, FiMapPin, FiBarChart2, FiUsers, FiUpload,
  FiLogOut, FiMenu, FiX, FiSettings,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NAV_KONTEN = [
  { to: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
  { to: "/admin/news", icon: FiFileText, label: "Berita" },
  { to: "/admin/faq", icon: FiHelpCircle, label: "FAQ" },
  { to: "/admin/gallery", icon: FiImage, label: "Galeri" },
  { to: "/admin/brochures", icon: FiBook, label: "Brosur" },
  { to: "/admin/promos", icon: FiTag, label: "Promo" },
];

const NAV_UTILITAS = [
  { to: "/admin/services", icon: FiSettings, label: "Layanan" },
  { to: "/admin/contact", icon: FiMapPin, label: "Kontak" },
  { to: "/admin/statistics", icon: FiBarChart2, label: "Statistik" },
  { to: "/admin/organization", icon: FiUsers, label: "Organisasi" },
  { to: "/admin/uploads", icon: FiUpload, label: "Upload File" },
];

const ALL_NAV = [...NAV_KONTEN, ...NAV_UTILITAS];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentLabel = ALL_NAV.find((n) => location.pathname.startsWith(n.to))?.label || "Admin";

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

      {/* Sidebar — fixed on mobile, static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:translate-x-0 lg:relative lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white shrink-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <span className="text-sm font-bold text-white">BSI</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Admin Panel</p>
            <p className="text-[10px] text-gray-400">KCP Tambun Bekasi</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-white lg:hidden"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Kelola Konten */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Kelola Konten
            </p>
            <ul className="space-y-0.5">
              {NAV_KONTEN.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/10"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300"
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                        {label}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Utilitas */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Utilitas
            </p>
            <ul className="space-y-0.5">
              {NAV_UTILITAS.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/10"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300"
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                        {label}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-white shadow-md shadow-emerald-500/20">
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[10px] text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
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
        {/* Top bar — always visible, never covered by sidebar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface-card/80 px-4 backdrop-blur-md lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-ink-faint hover:text-ink lg:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-faint">Admin</span>
            <span className="text-ink-faint">/</span>
            <h2 className="text-sm font-semibold text-ink">{currentLabel}</h2>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex h-7 items-center rounded-full bg-emerald-500/10 px-2.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
          </div>
        </header>

        {/* Page content — scrollable area */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
