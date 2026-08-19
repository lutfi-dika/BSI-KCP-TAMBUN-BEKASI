import ImageSlider from "../components/common/ImageSlider";
import slider1 from "../assets/promo/slide-1.jpg";
import slider2 from "../assets/promo/slide-2.jpg";
import slider3 from "../assets/promo/slide-3.jpg";
import slider4 from "../assets/promo/slide-4.jpg";
// import Hero from "../components/home/Hero";
import PromoBanner from "../components/home/PromoBanner";
import HelpTiles from "../components/home/HelpTiles";
import AboutPreview from "../components/home/AboutPreview";
import Statistics from "../components/home/Statistics";
import ServicesPreview from "../components/home/ServicesPreview";
import ProductsPreview from "../components/home/ProductsPreview";
import WhyBSI from "../components/home/WhyBSI";
import DigitalBanking from "../components/home/DigitalBanking";
import GalleryPreview from "../components/home/GalleryPreview";
import NewsPreview from "../components/home/NewsPreview";
import FAQPreview from "../components/home/FAQPreview";
import ContactPreview from "../components/home/ContactPreview";
import CTA from "../components/home/CTA";
import ProductRecommendation from "../components/common/ProductRecommendation";
import FinancingCalculator from "../components/common/FinancingCalculator";
import PrayerTimes from "../components/common/PrayerTimes";
import GoldPawnCalculator from "../components/common/GoldPawnCalculator";
import DocumentGuide from "../components/common/DocumentGuide";
import Seo, { breadcrumb } from "../components/common/Seo";
import { useLanguage } from "../context/languageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Seo
        title={t("seo.home.title")}
        description={t("seo.home.desc")}
        path="/"
        jsonLd={breadcrumb([{ name: t("nav.home"), path: "/" }])}
      />
      <h1 className="sr-only">{t("home.h1")}</h1>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <ImageSlider
          alt={t("slider.alt")}
          images={[slider1, slider2, slider3, slider4]}
        />
      </div>
      {/* <Hero /> */}
      <PromoBanner />
      <HelpTiles />
      <PrayerTimes />
      <AboutPreview />
      <Statistics />
      <ServicesPreview />
      <ProductsPreview />
      <WhyBSI />
      <DigitalBanking />
      <GalleryPreview />
      <NewsPreview />
      <FAQPreview />
      <ProductRecommendation />
      <GoldPawnCalculator />
      <FinancingCalculator />
      <DocumentGuide />
      <ContactPreview />
      <CTA />
    </>
  );
}
