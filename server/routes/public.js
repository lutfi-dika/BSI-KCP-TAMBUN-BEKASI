import { Router } from "express";
import db from "../db.js";

const router = Router();

// ---------------------------------------------------------------------------
// Helper: parse JSON columns
// ---------------------------------------------------------------------------
function parseJson(row, columns) {
  if (!row) return row;
  const result = { ...row };
  for (const col of columns) {
    if (typeof result[col] === "string") {
      try { result[col] = JSON.parse(result[col]); } catch { /* keep as string */ }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// GET /api/public/services — all services grouped by category
// ---------------------------------------------------------------------------
router.get("/services", (req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC").all();
  const jsonCols = ["item_overview", "item_benefits", "item_requirements", "item_process", "item_features"];
  const parsed = rows.map((r) => parseJson(r, jsonCols));

  // Group by category
  const categories = new Map();
  for (const row of parsed) {
    const catId = row.category_id;
    if (!categories.has(catId)) {
      categories.set(catId, {
        id: catId,
        title: { id: row.category_title_id, en: row.category_title_en },
        slug: row.category_slug,
        description: { id: row.category_description_id, en: row.category_description_en },
        icon: row.category_icon,
        items: [],
      });
    }
    categories.get(catId).items.push({
      name: row.item_name,
      description: { id: row.item_description_id, en: row.item_description_en },
      overview: row.item_overview || [],
      benefits: row.item_benefits || [],
      requirements: row.item_requirements || [],
      process: row.item_process || [],
      features: row.item_features || [],
      link: row.item_link,
    });
  }

  res.json(Array.from(categories.values()));
});

// ---------------------------------------------------------------------------
// GET /api/public/faqs
// ---------------------------------------------------------------------------
router.get("/faqs", (req, res) => {
  const rows = db.prepare("SELECT * FROM faqs ORDER BY sort_order ASC").all();
  const mapped = rows.map((r) => ({
    id: r.id,
    question: { id: r.question_id, en: r.question_en },
    answer: { id: r.answer_id, en: r.answer_en },
  }));
  res.json(mapped);
});

// ---------------------------------------------------------------------------
// GET /api/public/news
// ---------------------------------------------------------------------------
router.get("/news", (req, res) => {
  const rows = db.prepare("SELECT * FROM news ORDER BY date DESC, sort_order ASC").all();
  const mapped = rows.map((r) => ({
    id: r.id,
    title: { id: r.title_id, en: r.title_en },
    category: { id: r.category_id, en: r.category_en },
    date: r.date,
    excerpt: { id: r.excerpt_id, en: r.excerpt_en },
    imageLabel: { id: r.image_label_id, en: r.image_label_en },
    imageUrl: r.image_url,
  }));
  res.json(mapped);
});

// ---------------------------------------------------------------------------
// GET /api/public/gallery
// ---------------------------------------------------------------------------
router.get("/gallery", (req, res) => {
  const rows = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC").all();
  const mapped = rows.map((r) => ({
    id: r.id,
    title: { id: r.title_id, en: r.title_en },
    caption: { id: r.caption_id, en: r.caption_en },
    category: { id: r.category_id, en: r.category_en },
    accent: r.accent,
    image: r.image,
    icon: r.icon,
  }));
  res.json(mapped);
});

// ---------------------------------------------------------------------------
// GET /api/public/brochures
// ---------------------------------------------------------------------------
router.get("/brochures", (req, res) => {
  const brochures = db.prepare("SELECT * FROM brochures ORDER BY sort_order ASC").all();
  const categories = db.prepare("SELECT * FROM brochure_categories ORDER BY sort_order ASC").all();

  const mappedBrochures = brochures.map((r) => ({
    id: r.item_id,
    title: r.title,
    category: r.category,
    subcategory: r.subcategory || null,
    icon: r.icon,
    description: { id: r.description_id, en: r.description_en },
    image: r.image,
    brochureUrl: r.brochure_url || null,
  }));

  const mappedCategories = categories.map((r) => {
    let subs = [];
    try { subs = JSON.parse(r.subcategories || "[]"); } catch { subs = []; }
    return {
      id: r.item_id,
      title: { id: r.title_id, en: r.title_en },
      icon: r.icon,
      description: { id: r.description_id, en: r.description_en },
      subcategories: subs.map((s) => ({ id: s.id, title: { id: s.title_id, en: s.title_en } })),
    };
  });

  res.json({ categories: mappedCategories, brochures: mappedBrochures });
});

// ---------------------------------------------------------------------------
// GET /api/public/promos
// ---------------------------------------------------------------------------
router.get("/promos", (req, res) => {
  const rows = db.prepare("SELECT * FROM promos ORDER BY sort_order ASC").all();
  const mapped = rows.map((r) => ({
    id: r.item_id,
    label: { id: r.label_id, en: r.label_en },
    title: { id: r.title_id, en: r.title_en },
    description: { id: r.description_id, en: r.description_en },
    cta: { id: r.cta_id, en: r.cta_en },
    href: r.href,
    accent: r.accent,
  }));
  res.json(mapped);
});

// ---------------------------------------------------------------------------
// GET /api/public/contact
// ---------------------------------------------------------------------------
router.get("/contact", (req, res) => {
  const row = db.prepare("SELECT * FROM contact WHERE id = 1").get();
  if (!row) return res.json({});

  res.json({
    branchName: row.branch_name,
    branchFull: { id: row.branch_full_id, en: row.branch_full_en },
    address: row.address,
    phone: row.phone,
    bsiCall: row.bsi_call,
    whatsapp: row.whatsapp,
    email: row.email,
    operationalHours: { id: row.operational_hours_id, en: row.operational_hours_en },
    mapsEmbedUrl: row.maps_embed_url,
    mapsLink: row.maps_link,
    SOCIAL_LINKS: {
      instagram: row.social_instagram,
      facebook: row.social_facebook,
      youtube: row.social_youtube,
      twitter: row.social_twitter,
    },
  });
});

// ---------------------------------------------------------------------------
// GET /api/public/statistics
// ---------------------------------------------------------------------------
router.get("/statistics", (req, res) => {
  const rows = db.prepare("SELECT * FROM statistics ORDER BY sort_order ASC").all();
  const mapped = rows.map((r) => ({
    label: { id: r.label_id, en: r.label_en },
    value: r.value,
    suffix: { id: r.suffix_id, en: r.suffix_en },
    icon: r.icon,
  }));
  res.json(mapped);
});

// ---------------------------------------------------------------------------
// GET /api/public/organization
// ---------------------------------------------------------------------------
router.get("/organization", (req, res) => {
  const rows = db.prepare("SELECT * FROM organization ORDER BY sort_order ASC").all();

  function buildTree(parentId = null) {
    return rows
      .filter((r) => r.parent_id === parentId)
      .map((r) => ({
        role: { id: r.role_id, en: r.role_en },
        subRole: r.sub_role_id ? { id: r.sub_role_id, en: r.sub_role_en } : undefined,
        children: buildTree(r.id),
      }));
  }

  const tree = buildTree(null);
  res.json(tree.length > 0 ? tree[0] : {});
});

export default router;
