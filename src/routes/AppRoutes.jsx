import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
const NotFound = lazy(() => import("../pages/NotFound"));

function AdminAuthGate({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <Loader />;
    if (!user) return <AdminLogin />;
    return children;
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
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
