import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { GALLERY } from "../../data/gallery";
import SectionTitle from "../common/SectionTitle";
import { fadeUp, staggerContainer } from "../../utils/animation";
import { useLanguage } from "../../context/languageContext";

export default function GalleryPreview() {
  const { t, tr } = useLanguage();
  const preview = GALLERY.slice(0, 4);

  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <SectionTitle
            align="left"
            kicker={t("galleryPreview.kicker")}
            title={t("galleryPreview.title")}
            description={t("galleryPreview.desc")}
          />
          <Link
            to="/gallery"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-500 transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:shadow-glow"
          >
            {t("common.seeAll")}
            <FiArrowRight size={16} />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {preview.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={tr(item.title)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.accent} transition-transform duration-500 group-hover:scale-105`}
                />
              )}
              <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                  {tr(item.category)}
                </p>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {tr(item.title)}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
