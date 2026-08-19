import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiFileText,
  FiHelpCircle,
  FiImage,
  FiBook,
  FiTag,
  FiMapPin,
  FiBarChart2,
  FiUsers,
  FiUpload,
  FiLogOut,
  FiMenu,
  FiX,
  FiSettings,
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

  const currentLabel =
    ALL_NAV.find((n) => location.pathname.startsWith(n.to))?.label || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:translate-x-0 lg:relative lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white border-r border-gray-200 shadow-sm shrink-0`}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-gray-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-sm shadow-sm">
            BSI
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Admin Panel</p>
            <p className="text-[10px] text-gray-400">KCP Tambun Bekasi</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {/* Kelola Konten */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
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
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={16}
                          className={`transition-colors ${
                            isActive
                              ? "text-emerald-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {label}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
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
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={16}
                          className={`transition-colors ${
                            isActive
                              ? "text-emerald-600"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {label}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User profile */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              {user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <span className="text-gray-300">/</span>
            <h2 className="font-semibold text-gray-700">{currentLabel}</h2>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
