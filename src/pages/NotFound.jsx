import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import Seo, { breadcrumb } from "../components/common/Seo";
import { useLanguage } from "../context/languageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title={t("seo.notFound.title")}
        description={t("seo.notFound.desc")}
        path="/404"
        jsonLd={breadcrumb([{ name: t("nav.home"), path: "/" }])}
      />
      <section className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] -z-10 h-[360px] w-[360px] rounded-full bg-gold-500/[0.08] blur-[130px]" />

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
          {t("notFound.code")}
        </p>
        <p
          aria-hidden
          className="mt-4 select-none bg-gradient-to-b from-ink to-ink/10 bg-clip-text text-8xl font-extrabold leading-none tracking-tight text-transparent sm:text-9xl"
        >
          404
        </p>
        <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">
          {t("notFound.title")}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
          {t("notFound.desc")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(0,132,125,0.5)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 sm:w-auto"
          >
            <FiHome size={16} />
            {t("notFound.back")}
          </Link>
          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface-card px-7 py-3.5 text-sm font-semibold text-ink-strong transition-colors duration-300 hover:border-emerald-500/40 hover:text-emerald-500 sm:w-auto"
          >
            <FiArrowLeft size={16} />
            {t("nav.contact")}
          </Link>
        </div>
      </section>
    </>
  );
}
