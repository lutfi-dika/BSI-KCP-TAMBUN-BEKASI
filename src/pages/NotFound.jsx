import { Link } from "react-router-dom";
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
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold text-emerald-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          {t("notFound.desc")}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          {t("notFound.back")}
        </Link>
      </section>
    </>
  );
}
