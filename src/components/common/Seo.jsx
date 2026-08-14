import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";

export const SITE_URL = "https://bsi-kcp-tambun-bekasi.netlify.app";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (content) el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  if (href) el.setAttribute("href", href);
}

/**
 * Seo — updates document title, meta description, canonical URL, and
 * Open Graph / Twitter tags on every route change. Renders nothing.
 *
 * @param {string} title       Full document title (incl. brand).
 * @param {string} description Meta description.
 * @param {string} path        Route path for the canonical URL (defaults to current pathname).
 * @param {object} jsonLd      Optional JSON-LD object injected for this page.
 */
export default function Seo({ title, description, path, jsonLd }) {
  const { lang } = useLanguage();
  const location = useLocation();

  const cleanPath = path ?? location.pathname;
  const canonicalPath = cleanPath === "/" ? "" : cleanPath.replace(/\/+$/, "");
  const canonical = `${SITE_URL}${canonicalPath}`;
  const locale = lang === "en" ? "en_US" : "id_ID";

  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", OG_IMAGE);
    setMeta("property", "og:locale", locale);
    setMeta(
      "property",
      "og:locale:alternate",
      locale === "en_US" ? "id_ID" : "en_US",
    );
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", OG_IMAGE);
    setMeta("name", "twitter:url", canonical);
    setLink("canonical", canonical);
  }, [title, description, canonical, locale]);

  useEffect(() => {
    const previous = document.getElementById("page-jsonld");
    if (previous) previous.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-jsonld";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById("page-jsonld")?.remove();
    };
  }, [jsonLd]);

  return null;
}

/** Builds a schema.org BreadcrumbList from [{ name, path }]. */
// eslint-disable-next-line react-refresh/only-export-components
export function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
