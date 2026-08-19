import { Router } from "express";
import db from "../db.js";
import { authenticate, requireAdmin } from "../auth.js";

const router = Router();

// All routes require auth + admin
router.use(authenticate, requireAdmin);

// ---------------------------------------------------------------------------
// Helper: generic CRUD factory
// ---------------------------------------------------------------------------
function createCrudRoutes(tableName, {
  idColumn = "id",
  jsonColumns = [],
  allowedFields = [],
} = {}) {
  const routes = Router();

  // GET all
  routes.get("/", (req, res) => {
    const rows = db.prepare(`SELECT * FROM ${tableName} ORDER BY sort_order ASC, ${idColumn} ASC`).all();
    res.json(rows);
  });

  // GET one
  routes.get(`/:id`, (req, res) => {
    const row = db.prepare(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  });

  // POST create
  routes.post("/", (req, res) => {
    const body = req.body || {};
    const fields = allowedFields.length > 0 ? allowedFields : Object.keys(body);
    const cols = [];
    const vals = [];

    for (const field of fields) {
      if (body[field] !== undefined) {
        let val = body[field];
        if (jsonColumns.includes(field) && typeof val === "object") {
          val = JSON.stringify(val);
        }
        cols.push(field);
        vals.push(val);
      }
    }

    if (cols.length === 0) {
      return res.status(400).json({ error: "No fields to insert" });
    }

    cols.push("created_at", "updated_at");
    vals.push(new Date().toISOString(), new Date().toISOString());

    const placeholders = cols.map(() => "?").join(", ");
    const sql = `INSERT INTO ${tableName} (${cols.join(", ")}) VALUES (${placeholders})`;
    const result = db.prepare(sql).run(...vals);
    const created = db.prepare(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`).get(result.lastInsertRowid);
    res.status(201).json(created);
  });

  // PUT update
  routes.put(`/:id`, (req, res) => {
    const body = req.body || {};
    const fields = allowedFields.length > 0 ? allowedFields : Object.keys(body);
    const sets = [];
    const vals = [];

    for (const field of fields) {
      if (body[field] !== undefined) {
        let val = body[field];
        if (jsonColumns.includes(field) && typeof val === "object") {
          val = JSON.stringify(val);
        }
        sets.push(`${field} = ?`);
        vals.push(val);
      }
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    sets.push("updated_at = ?");
    vals.push(new Date().toISOString());
    vals.push(req.params.id);

    const sql = `UPDATE ${tableName} SET ${sets.join(", ")} WHERE ${idColumn} = ?`;
    db.prepare(sql).run(...vals);

    const updated = db.prepare(`SELECT * FROM ${tableName} WHERE ${idColumn} = ?`).get(req.params.id);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  // DELETE
  routes.delete(`/:id`, (req, res) => {
    const result = db.prepare(`DELETE FROM ${tableName} WHERE ${idColumn} = ?`).run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  });

  return routes;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
router.use("/services", createCrudRoutes("services", {
  allowedFields: [
    "category_id", "category_title_id", "category_title_en", "category_slug",
    "category_description_id", "category_description_en", "category_icon",
    "item_name", "item_description_id", "item_description_en",
    "item_overview", "item_benefits", "item_requirements", "item_process",
    "item_features", "item_link", "sort_order",
  ],
}));

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
router.use("/faqs", createCrudRoutes("faqs", {
  allowedFields: ["question_id", "question_en", "answer_id", "answer_en", "sort_order"],
}));

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------
router.use("/news", createCrudRoutes("news", {
  allowedFields: [
    "title_id", "title_en", "category_id", "category_en", "date",
    "excerpt_id", "excerpt_en", "image_label_id", "image_label_en",
    "image_url", "sort_order",
  ],
}));

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
router.use("/gallery", createCrudRoutes("gallery", {
  allowedFields: [
    "title_id", "title_en", "caption_id", "caption_en",
    "category_id", "category_en", "accent", "image", "icon", "sort_order",
  ],
}));

// ---------------------------------------------------------------------------
// Brochures
// ---------------------------------------------------------------------------
router.use("/brochures", createCrudRoutes("brochures", {
  allowedFields: [
    "item_id", "title", "category", "subcategory", "icon",
    "description_id", "description_en", "image", "brochure_url", "sort_order",
  ],
}));

// ---------------------------------------------------------------------------
// Brochure Categories
// ---------------------------------------------------------------------------
router.use("/brochure-categories", createCrudRoutes("brochure_categories", {
  allowedFields: [
    "item_id", "title_id", "title_en", "icon",
    "description_id", "description_en", "subcategories", "sort_order",
  ],
}));

// ---------------------------------------------------------------------------
// Promos
// ---------------------------------------------------------------------------
router.use("/promos", createCrudRoutes("promos", {
  allowedFields: [
    "item_id", "label_id", "label_en", "title_id", "title_en",
    "description_id", "description_en", "cta_id", "cta_en",
    "href", "accent", "sort_order",
  ],
}));

// ---------------------------------------------------------------------------
// Contact (single row, id=1)
// ---------------------------------------------------------------------------
router.get("/contact", (req, res) => {
  const row = db.prepare("SELECT * FROM contact WHERE id = 1").get();
  res.json(row || {});
});

router.put("/contact", (req, res) => {
  const body = req.body || {};
  const allowed = [
    "branch_name", "branch_full_id", "branch_full_en", "address", "phone",
    "bsi_call", "whatsapp", "email", "operational_hours_id", "operational_hours_en",
    "maps_embed_url", "maps_link", "social_instagram", "social_facebook",
    "social_youtube", "social_twitter",
  ];
  const sets = [];
  const vals = [];

  for (const field of allowed) {
    if (body[field] !== undefined) {
      sets.push(`${field} = ?`);
      vals.push(body[field]);
    }
  }

  if (sets.length === 0) return res.status(400).json({ error: "No fields to update" });

  sets.push("updated_at = ?");
  vals.push(new Date().toISOString());

  const existing = db.prepare("SELECT id FROM contact WHERE id = 1").get();
  if (existing) {
    db.prepare(`UPDATE contact SET ${sets.join(", ")} WHERE id = 1`).run(...vals);
  } else {
    const cols = ["id", ...sets.map((s) => s.split(" = ")[0])];
    vals.unshift(1);
    db.prepare(`INSERT INTO contact (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`).run(...vals);
  }

  const updated = db.prepare("SELECT * FROM contact WHERE id = 1").get();
  res.json(updated);
});

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------
router.use("/statistics", createCrudRoutes("statistics", {
  allowedFields: ["label_id", "label_en", "value", "suffix_id", "suffix_en", "icon", "sort_order"],
}));

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------
router.use("/organization", createCrudRoutes("organization", {
  allowedFields: ["parent_id", "role_id", "role_en", "sub_role_id", "sub_role_en", "sort_order"],
}));

export default router;
