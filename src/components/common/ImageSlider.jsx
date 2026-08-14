// src/components/common/ImageSlider.jsx

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLanguage } from "../../context/languageContext";

const EASE = [0.22, 1, 0.36, 1];

export default function ImageSlider({
    images = [],
    autoPlay = true,
    interval = 4000,
    className = "",
    alt = "",
}) {
    const { t } = useLanguage();
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    const goTo = useCallback(
        (newIndex) => {
            setDirection(newIndex > index ? 1 : -1);
            setIndex((newIndex + images.length) % images.length);
        },
        [index, images.length]
    );

    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const prev = useCallback(() => goTo(index - 1), [goTo, index]);

    // Autoplay with pause on hover
    useEffect(() => {
        if (!autoPlay || images.length <= 1 || isPaused) return;
        timerRef.current = setInterval(next, interval);
        return () => clearInterval(timerRef.current);
    }, [autoPlay, interval, next, images.length, isPaused]);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    if (images.length === 0) return null;

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%" }),
        center: { x: 0 },
        exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%" }),
    };

    return (
        <div
            className={`relative w-full overflow-hidden rounded-3xl border border-line bg-surface-card shadow-lg ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Tidak ada rasio/tinggi tetap — tinggi mengikuti gambar aslinya,
                lebar selalu penuh (edge-to-edge), gambar tidak pernah kepotong. */}
            <div className="relative w-full">
                {/* Placeholder tak terlihat untuk menjaga tinggi kontainer mengikuti gambar aktif */}
                <img
                    src={images[index]}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className="block h-auto w-full opacity-0"
                />
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                        key={index}
                        src={images[index]}
                        alt={alt}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6, ease: EASE }}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        decoding="async"
                        className="absolute inset-0 block h-full w-full object-contain"
                    />
                </AnimatePresence>
            </div>

            {/* Slide counter */}
            {images.length > 1 && (
                <div className="absolute bottom-4 right-4 rounded-full bg-black/30 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white/80 sm:bottom-5 sm:right-5">
                    {index + 1} / {images.length}
                </div>
            )}

            {/* Navigation buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label={t("slider.prev")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-white/60 hover:bg-white/20 sm:left-5 sm:h-12 sm:w-12"
                    >
                        <FiChevronLeft size={22} />
                    </button>
                    <button
                        onClick={next}
                        aria-label={t("slider.next")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-white/60 hover:bg-white/20 sm:right-5 sm:h-12 sm:w-12"
                    >
                        <FiChevronRight size={22} />
                    </button>
                </>
            )}

            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={t("slider.gotoSlide").replace("{n}", String(i + 1))}
                            className={`h-2 rounded-full transition-all duration-300 ${i === index
                                ? "w-8 bg-white shadow-md shadow-black/30"
                                : "w-2 bg-white/40 hover:bg-white/70"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}