import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Accordion from "../components/faq/Accordion";
import CTA from "../components/home/CTA";
import Seo, { breadcrumb } from "../components/common/Seo";
import { FAQS } from "../data/faq";
import { useLanguage } from "../context/languageContext";

export default function FAQ() {
  const { t, tr } = useLanguage();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: tr(f.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: tr(f.answer),
          },
        })),
      },
      breadcrumb([
        { name: t("nav.home"), path: "/" },
        { name: t("nav.faq"), path: "/faq" },
      ]),
    ],
  };

  return (
    <>
      <Seo
        title={t("seo.faq.title")}
        description={t("seo.faq.desc")}
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <PageHeader
        kicker={t("faq.kicker")}
        title={t("faq.title")}
        description={t("faq.desc")}
      />

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Accordion items={FAQS} />
          <p className="mt-10 text-center text-sm text-ink-soft">
            {t("faq.otherQuestion")}{" "}
            <a
              href="tel:14040"
              className="font-semibold text-emerald-500 hover:underline"
            >
              14040
            </a>{" "}
            {t("faq.orVisit")}{" "}
            <Link
              to="/contact"
              className="font-semibold text-emerald-500 hover:underline"
            >
              {t("faq.contact")}
            </Link>
            .
          </p>
        </div>
      </section>

      <CTA />
    </>
  );
}
