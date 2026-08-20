import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";
import Loader from "../components/common/Loader";
import { AuthProvider, useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Services = lazy(() => import("../pages/Services"));
const Brochures = lazy(() => import("../pages/Brochures"));
const Gallery = lazy(() => import("../pages/Gallery"));
const News = lazy(() => import("../pages/News"));
const FAQ = lazy(() => import("../pages/FAQ"));
const Contact = lazy(() => import("../pages/Contact"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AdminHome = lazy(() => import("../pages/admin/AdminHome"));
const AdminNews = lazy(() => import("../pages/admin/AdminNews"));
const AdminFAQ = lazy(() => import("../pages/admin/AdminFAQ"));
const AdminGallery = lazy(() => import("../pages/admin/AdminGallery"));
const AdminBrochures = lazy(() => import("../pages/admin/AdminBrochures"));
const AdminPromos = lazy(() => import("../pages/admin/AdminPromos"));
const AdminServices = lazy(() => import("../pages/admin/AdminServices"));
const AdminContact = lazy(() => import("../pages/admin/AdminContact"));
const AdminStatistics = lazy(() => import("../pages/admin/AdminStatistics"));
const AdminOrganization = lazy(() => import("../pages/admin/AdminOrganization"));
const AdminUploads = lazy(() => import("../pages/admin/AdminUploads"));
const AdminSecurity = lazy(() => import("../pages/admin/AdminSecurity"));
const NotFound = lazy(() => import("../pages/NotFound"));

function AdminAuthGate({ children }) {
    const { user, loading, sessionWarning, extendSession, needsSecretKey, secretKeyVerified } = useAuth();
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (sessionWarning) setShowWarning(true);
    }, [sessionWarning]);

    if (loading) return <Loader />;
    if (!user) return <AdminLogin />;

    // If secret key is needed but not verified, show secret key form
    if (needsSecretKey && !secretKeyVerified) {
        return <AdminLogin />;
    }

    return (
        <>
            {children}
            {/* Session timeout warning modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-sm rounded-2xl border border-amber-500/30 bg-surface-card p-6 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                                <FiAlertCircle size={20} className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-ink">Sesi Akan Berakhir</h3>
                                <p className="text-xs text-ink-soft mt-0.5">Session Anda akan expired dalam 2 menit</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={async () => {
                                    const ok = await extendSession();
                                    if (ok) setShowWarning(false);
                                }}
                                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                            >
                                Perpanjang Sesi
                            </button>
                            <button
                                onClick={() => setShowWarning(false)}
                                className="flex-1 rounded-xl border border-line-strong px-4 py-2.5 text-xs font-semibold text-ink-mid transition-colors hover:bg-surface-muted"
                            >
                                Abaikan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/brosur" element={<Brochures />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/news" element={<News />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin routes — single AuthProvider for all */}
                <Route path="/admin" element={
                    <AuthProvider>
                        <AdminAuthGate>
                            <AdminDashboard />
                        </AdminAuthGate>
                    </AuthProvider>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminHome />} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="faq" element={<AdminFAQ />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="brochures" element={<AdminBrochures />} />
                    <Route path="promos" element={<AdminPromos />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="contact" element={<AdminContact />} />
                    <Route path="statistics" element={<AdminStatistics />} />
                    <Route path="organization" element={<AdminOrganization />} />
                    <Route path="uploads" element={<AdminUploads />} />
                    <Route path="security" element={<AdminSecurity />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
