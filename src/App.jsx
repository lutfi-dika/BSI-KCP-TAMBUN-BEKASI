import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollTop from "./components/layout/ScrollTop";
import Chatbot from "./components/common/Chatbot";
import { ThemeProvider } from "./context/themeContext";
import { LanguageProvider } from "./context/languageContext";
import AppRoutes from "./routes/AppRoutes";

/** Resets scroll position on route change, honouring hash anchors (e.g. /#produk). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <LanguageProvider>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col bg-surface text-ink transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
              <Chatbot />
              <ScrollTop />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
