import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "bsi-admin.db");

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Admin',
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,
    category_title_id TEXT NOT NULL,
    category_title_en TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    category_description_id TEXT DEFAULT '',
    category_description_en TEXT DEFAULT '',
    category_icon TEXT DEFAULT '',
    item_name TEXT NOT NULL,
    item_description_id TEXT DEFAULT '',
    item_description_en TEXT DEFAULT '',
    item_overview TEXT DEFAULT '[]',
    item_benefits TEXT DEFAULT '[]',
    item_requirements TEXT DEFAULT '[]',
    item_process TEXT DEFAULT '[]',
    item_features TEXT DEFAULT '[]',
    item_link TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_id TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category_id TEXT NOT NULL DEFAULT '',
    category_en TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL,
    excerpt_id TEXT DEFAULT '',
    excerpt_en TEXT DEFAULT '',
    image_label_id TEXT DEFAULT '',
    image_label_en TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    caption_id TEXT DEFAULT '',
    caption_en TEXT DEFAULT '',
    category_id TEXT NOT NULL DEFAULT '',
    category_en TEXT NOT NULL DEFAULT '',
    accent TEXT DEFAULT '',
    image TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS brochures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    description_id TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    image TEXT DEFAULT '',
    brochure_url TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS brochure_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT UNIQUE NOT NULL,
    title_id TEXT NOT NULL,
    title_en TEXT NOT NULL,
    icon TEXT DEFAULT '',
    description_id TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    subcategories TEXT DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS promos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id TEXT UNIQUE NOT NULL,
    label_id TEXT DEFAULT '',
    label_en TEXT DEFAULT '',
    title_id TEXT DEFAULT '',
    title_en TEXT DEFAULT '',
    description_id TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    cta_id TEXT DEFAULT '',
    cta_en TEXT DEFAULT '',
    href TEXT DEFAULT '',
    accent TEXT DEFAULT 'emerald',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    branch_name TEXT DEFAULT '',
    branch_full_id TEXT DEFAULT '',
    branch_full_en TEXT DEFAULT '',
    address TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    bsi_call TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    email TEXT DEFAULT '',
    operational_hours_id TEXT DEFAULT '',
    operational_hours_en TEXT DEFAULT '',
    maps_embed_url TEXT DEFAULT '',
    maps_link TEXT DEFAULT '',
    social_instagram TEXT DEFAULT '',
    social_facebook TEXT DEFAULT '',
    social_youtube TEXT DEFAULT '',
    social_twitter TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label_id TEXT NOT NULL,
    label_en TEXT NOT NULL,
    value TEXT DEFAULT '',
    suffix_id TEXT DEFAULT '',
    suffix_en TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS organization (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER DEFAULT NULL,
    role_id TEXT NOT NULL,
    role_en TEXT NOT NULL,
    sub_role_id TEXT DEFAULT '',
    sub_role_en TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value_id TEXT DEFAULT '',
    value_en TEXT DEFAULT '',
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// ---------------------------------------------------------------------------
// Seed data — only if tables are empty
// ---------------------------------------------------------------------------

function seedIfEmpty() {
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  if (userCount === 0) {
    const email = process.env.ADMIN_EMAIL || "admin@bsi-tambun.co.id";
    // Never ship a fixed, guessable default password (e.g. "admin123").
    // Use ADMIN_PASSWORD from env if provided; otherwise generate a strong
    // random one-time password and print it ONCE so the operator can log in
    // and change it immediately.
    const generatedPassword = crypto.randomBytes(9).toString("base64url"); // 12 chars, high entropy
    const password = process.env.ADMIN_PASSWORD || generatedPassword;
    const hash = bcrypt.hashSync(password, 12);
    db.prepare(
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
    ).run(email, hash, "Administrator", "admin");
    if (process.env.ADMIN_PASSWORD) {
      console.log(
        `[db] Default admin created: ${email} (password from ADMIN_PASSWORD env)`,
      );
    } else {
      console.log(`[db] Default admin created: ${email} / ${password}`);
      console.log(
        "[db] ⚠️  This password is shown ONLY this once. Log in and change it immediately, or set ADMIN_PASSWORD in .env before first run.",
      );
    }
  }

  const newsCount = db.prepare("SELECT COUNT(*) as c FROM news").get().c;
  if (newsCount === 0) {
    const insert = db.prepare(
      `INSERT INTO news (title_id, title_en, category_id, category_en, date, excerpt_id, excerpt_en, image_label_id, image_label_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const newsData = [
      [
        "BSI KCP Tambun Gelar Edukasi Keuangan Syariah untuk Pelajar",
        "BSI KCP Tambun Holds Sharia Financial Education for Students",
        "Edukasi",
        "Education",
        "2026-07-22",
        "Tim BSI KCP Tambun mengadakan sosialisasi literasi keuangan syariah bagi pelajar di wilayah Tambun Selatan untuk menumbuhkan budaya menabung sejak dini.",
        "The BSI KCP Tambun team held sharia financial literacy outreach for students in South Tambun to foster a culture of saving from an early age.",
        "Edukasi Pelajar",
        "Student Education",
        1,
      ],
      [
        "Kemudahan Buka Rekening via BYOND by BSI",
        "Easy Account Opening via BYOND by BSI",
        "Info Nasabah",
        "Customer Info",
        "2026-06-18",
        "Kini membuka rekening BSI semakin mudah melalui aplikasi BYOND by BSI — cukup dari genggaman tanpa perlu antre di kantor cabang.",
        "Opening a BSI account is now even easier through the BYOND by BSI app — right from your phone, no queuing at the branch required.",
        "BYOND by BSI",
        "BYOND by BSI",
        2,
      ],
      [
        "BSI Luncurkan Program Pembiayaan UMKM untuk Warga Tambun",
        "BSI Launches MSME Financing Program for Tambun Residents",
        "Berita",
        "News",
        "2026-05-30",
        "BSI KCP Tambun memperkenalkan program pembiayaan syariah khusus pelaku UMKM di sekitar Tambun dengan plafon kompetitif dan angsuran ringan.",
        "BSI KCP Tambun introduces a sharia financing program for MSMEs around Tambun with competitive limits and affordable installments.",
        "UMKM Tambun",
        "Tambun MSMEs",
        3,
      ],
      [
        "Tips Mengelola Keuangan Keluarga secara Syariah",
        "Tips for Managing Family Finances in a Sharia Way",
        "Edukasi",
        "Education",
        "2026-05-09",
        "Simak panduan sederhana mengelola keuangan keluarga sesuai prinsip syariah: dari menyusun anggaran, menabung, hingga merencanakan dana darurat.",
        "Read a simple guide to managing family finances according to sharia principles: from budgeting and saving to planning an emergency fund.",
        "Keuangan Keluarga",
        "Family Finances",
        4,
      ],
    ];
    for (const row of newsData) insert.run(...row);
    console.log("[db] Seeded 4 news articles");
  }

  const faqCount = db.prepare("SELECT COUNT(*) as c FROM faqs").get().c;
  if (faqCount === 0) {
    const insert = db.prepare(
      `INSERT INTO faqs (question_id, question_en, answer_id, answer_en, sort_order) VALUES (?, ?, ?, ?, ?)`,
    );
    const faqData = [
      [
        "Apa itu Bank Syariah Indonesia (BSI)?",
        "What is Bank Syariah Indonesia (BSI)?",
        "Bank Syariah Indonesia (BSI) adalah bank hasil merger tiga bank syariah BUMN — BRI Syariah, BNI Syariah, dan Mandiri Syariah — yang resmi beroperasi pada 1 Februari 2021. BSI menjadi bank syariah terbesar di Indonesia dengan jaringan yang menjangkau seluruh provinsi, termasuk KCP Tambun di Kabupaten Bekasi.",
        "Bank Syariah Indonesia (BSI) is the bank resulting from the merger of three state-owned Islamic banks — BRI Syariah, BNI Syariah, and Mandiri Syariah — officially operating on 1 February 2021. BSI is the largest Islamic bank in Indonesia, with a network reaching every province, including the KCP Tambun sub-branch in Bekasi Regency.",
        1,
      ],
      [
        "Apa perbedaan bank syariah dengan bank konvensional?",
        "What is the difference between Islamic and conventional banks?",
        "Bank syariah menjalankan seluruh kegiatan usahanya berdasarkan prinsip syariah tanpa riba (bunga). Skema yang digunakan berbasis bagi hasil (mudharabah), jual beli (murabahah), dan kerja sama (musyarakah). Penghasilan bank syariah berasal dari margin dan bagi hasil, bukan dari bunga.",
        "Islamic banks carry out all of their business based on sharia principles without riba (interest). The schemes used are based on profit sharing (mudharabah), trade (murabahah), and partnership (musyarakah). Islamic bank income comes from margins and profit sharing, not from interest.",
        2,
      ],
      [
        "Produk apa saja yang tersedia di BSI KCP Tambun?",
        "What products are available at BSI KCP Tambun?",
        "BSI KCP Tambun melayani produk tabungan (Easy, Haji, Umroh, Junior, TabunganKu), pembiayaan (KUR, Griya, Oto, Mitra), BSI Hasanah Card, BSI Gadai emas, serta layanan digital seperti BYOND by BSI, BSI Net Banking, dan BEWIZE.",
        "BSI KCP Tambun offers savings products (Easy, Hajj, Umrah, Junior, TabunganKu), financing (KUR, Griya, Oto, Mitra), the BSI Hasanah Card, BSI gold pawn, and digital services such as BYOND by BSI, BSI Net Banking, and BEWIZE.",
        3,
      ],
      [
        "Bagaimana cara membuka rekening BSI?",
        "How do I open a BSI account?",
        "Anda dapat membuka rekening langsung di BSI KCP Tambun dengan membawa KTP elektronik dan NPWP (jika ada). Alternatifnya, buka rekening secara online melalui aplikasi BYOND by BSI dengan mengikuti proses verifikasi video call dari petugas bank.",
        "You can open an account directly at BSI KCP Tambun by bringing your electronic ID card (e-KTP) and tax number (NPWP) if you have one. Alternatively, open an account online through the BYOND by BSI app, completing a video call verification with a bank officer.",
        4,
      ],
      [
        "Berapa jam operasional BSI KCP Tambun?",
        "What are the business hours of BSI KCP Tambun?",
        "Layanan kas BSI KCP Tambun beroperasi Senin–Kamis pukul 08.00–16.00 WIB dan Jumat pukul 07.30–16.00 WIB. Layanan BSI Call 14040 tersedia 24 jam setiap hari.",
        "Cash services at BSI KCP Tambun operate Monday–Thursday from 08.00–16.00 WIB and Friday from 07.30–16.00 WIB. The BSI Call 14040 service is available 24 hours every day.",
        5,
      ],
      [
        "Apakah simpanan di BSI dijamin oleh LPS?",
        "Are deposits at BSI guaranteed by LPS?",
        "Ya. Sesuai undang-undang, simpanan nasabah bank syariah dijamin oleh Lembaga Penjamin Simpanan (LPS) hingga batas maksimal yang berlaku. BSI juga berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta Bank Indonesia (BI).",
        "Yes. By law, customer deposits at Islamic banks are guaranteed by the Deposit Insurance Corporation (LPS) up to the applicable maximum limit. BSI is also licensed and supervised by the Financial Services Authority (OJK) and Bank Indonesia (BI).",
        6,
      ],
      [
        "Bagaimana cara mengajukan pembiayaan KUR BSI?",
        "How do I apply for BSI KUR financing?",
        "Kunjungi BSI KCP Tambun untuk konsultasi dengan petugas. Siapkan dokumen usaha (SIUP/NIB), KTP, dan dokumen pendukung lainnya. Proses analisa dilakukan sesuai ketentuan dan akad yang berlaku.",
        "Visit BSI KCP Tambun to consult with our officers. Prepare your business documents (SIUP/NIB), ID card, and other supporting documents. The analysis process follows the applicable terms and contracts.",
        7,
      ],
      [
        "Apakah ada layanan gadai emas di BSI KCP Tambun?",
        "Is gold pawn available at BSI KCP Tambun?",
        "Tersedia. BSI Gadai menerima emas batangan maupun perhiasan sebagai agunan untuk memperoleh dana tunai cepat dengan akad qardh dan ijarah yang sesuai prinsip syariah. Silakan hubungi kantor cabang untuk informasi plafon dan ketentuan.",
        "Yes, it is available. BSI Gadai accepts gold bars and jewellery as collateral to obtain quick cash under qardh and ijarah contracts that comply with sharia principles. Please contact the branch for information on limits and terms.",
        8,
      ],
    ];
    for (const row of faqData) insert.run(...row);
    console.log("[db] Seeded 8 FAQ entries");
  }

  const galleryCount = db.prepare("SELECT COUNT(*) as c FROM gallery").get().c;
  if (galleryCount === 0) {
    const insert = db.prepare(
      `INSERT INTO gallery (title_id, title_en, caption_id, caption_en, category_id, category_en, accent, image, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const galleryData = [
      [
        "Kantor BSI KCP Tambun",
        "BSI KCP Tambun Office",
        "Tampak depan kantor cabang pembantu BSI Tambun",
        "The front view of the BSI Tambun sub-branch office",
        "Kantor",
        "Office",
        "from-[#00847D] to-[#063F3B]",
        "/gallery/kantor.webp",
        "building",
        1,
      ],
      [
        "Layanan Customer Service",
        "Customer Service",
        "Tim layanan siap membantu kebutuhan perbankan Anda",
        "Our service team is ready to help with your banking needs",
        "Layanan",
        "Services",
        "from-[#00665F] to-[#00847D]",
        "/gallery/layanan-cs.webp",
        "headset",
        2,
      ],
      [
        "Pembukaan Rekening Online",
        "Online Account Opening",
        "Buka rekening mudah melalui aplikasi BYOND",
        "Open an account easily through the BYOND app",
        "Digital",
        "Digital",
        "from-[#00847D] to-[#F2A93C]",
        "/gallery/Pembukaan Rekening Online.png",
        "smartphone",
        3,
      ],
      [
        "Ramadhan & Berbagi",
        "Ramadan & Sharing",
        "Kegiatan sosial dan berbagi bersama masyarakat",
        "Social and sharing activities with the community",
        "Kegiatan",
        "Activities",
        "from-[#0A2B27] to-[#00847D]",
        "/gallery/Ramadhan.webp",
        "handshake",
        4,
      ],
      [
        "Area Teller",
        "Teller Area",
        "Transaksi tunai dan setoran yang aman & nyaman",
        "Safe and comfortable cash and deposit transactions",
        "Kantor",
        "Office",
        "from-[#00847D] to-[#00665F]",
        "/gallery/area-teller.webp",
        "bank",
        5,
      ],
    ];
    for (const row of galleryData) insert.run(...row);
    console.log("[db] Seeded 5 gallery items");
  }

  const promoCount = db.prepare("SELECT COUNT(*) as c FROM promos").get().c;
  if (promoCount === 0) {
    const insert = db.prepare(
      `INSERT INTO promos (item_id, label_id, label_en, title_id, title_en, description_id, description_en, cta_id, cta_en, href, accent, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const promoData = [
      [
        "weekend-banking",
        "Layanan Akhir Pekan",
        "Weekend Service",
        "Weekend Banking di BSI KCP Tambun",
        "Weekend Banking at BSI KCP Tambun",
        "Tetap bisa bertransaksi dan konsultasi produk syariah di akhir pekan sesuai jadwal layanan kantor kami.",
        "Keep transacting and consulting on sharia products on weekends according to our office service schedule.",
        "Lihat Jadwal",
        "See Schedule",
        "/contact",
        "emerald",
        1,
      ],
      [
        "buka-rekening",
        "Nasabah Baru",
        "New Customer",
        "Buka Rekening Tabungan Langsung di Kantor",
        "Open a Savings Account Directly at the Office",
        "Datang langsung ke KCP Tambun — tim kami bantu proses pembukaan rekening tabungan syariah dari awal sampai selesai.",
        "Come straight to KCP Tambun — our team will guide your sharia savings account opening from start to finish.",
        "Kunjungi Kami",
        "Visit Us",
        "/contact",
        "gold",
        2,
      ],
      [
        "pembiayaan-umkm",
        "Pelaku Usaha",
        "Business Owners",
        "Konsultasi Pembiayaan untuk UMKM Tambun",
        "Financing Consultation for Tambun MSMEs",
        "Sedang mengembangkan usaha? Diskusikan kebutuhan pembiayaan syariah Anda bersama tim BSI KCP Tambun.",
        "Growing your business? Discuss your sharia financing needs with the BSI KCP Tambun team.",
        "Konsultasi Sekarang",
        "Consult Now",
        "/services#pembiayaan",
        "emerald",
        3,
      ],
      [
        "haji-umrah",
        "Ibadah",
        "Pilgrimage",
        "Rencanakan Tabungan Haji & Umrah Anda",
        "Plan Your Hajj & Umrah Savings",
        "Mulai langkah menuju Tanah Suci dengan pendampingan perencanaan tabungan haji dan umrah di kantor kami.",
        "Take the first step toward the Holy Land with Hajj and Umrah savings planning assistance at our office.",
        "Pelajari Lebih Lanjut",
        "Learn More",
        "/services#tabungan",
        "gold",
        4,
      ],
    ];
    for (const row of promoData) insert.run(...row);
    console.log("[db] Seeded 4 promos");
  }

  const contactRow = db.prepare("SELECT COUNT(*) as c FROM contact").get().c;
  if (contactRow === 0) {
    db.prepare(
      `INSERT INTO contact (id, branch_name, branch_full_id, branch_full_en, address, phone, bsi_call, whatsapp, email, operational_hours_id, operational_hours_en, maps_embed_url, maps_link, social_instagram, social_facebook, social_youtube, social_twitter) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      "BSI KCP Tambun",
      "Bank Syariah Indonesia Kantor Cabang Pembantu Tambun",
      "Bank Syariah Indonesia Tambun Sub-Branch Office",
      "Jl. Sultan Hasanuddin No. 1, Tambun Selatan, Kab. Bekasi, Jawa Barat 17510",
      "(021) 88377632, 88377633, 88373097",
      "14040",
      "0815 8411 4040",
      "contactus@bankbsi.co.id",
      "Senin–Kamis 08.00–16.00 WIB, Jumat 07.30–16.00 WIB",
      "Mon–Thu 08.00–16.00 WIB, Fri 07.30–16.00 WIB",
      "https://www.google.com/maps?q=-6.263958,107.066805&z=15&output=embed",
      "https://www.google.com/maps/search/?api=1&query=-6.263958,107.066805",
      "https://www.instagram.com/banksyariahindonesia/",
      "https://web.facebook.com/bankBSI.ID/",
      "https://www.youtube.com/@BankSyariahIndonesia",
      "https://twitter.com/bankbsi_id",
    );
    console.log("[db] Seeded contact info");
  }

  const statsCount = db.prepare("SELECT COUNT(*) as c FROM statistics").get().c;
  if (statsCount === 0) {
    const insert = db.prepare(
      `INSERT INTO statistics (label_id, label_en, value, suffix_id, suffix_en, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    const statsData = [
      [
        "Produk & Layanan",
        "Products & Services",
        "100%",
        "Syariah",
        "Sharia",
        "bank",
        1,
      ],
      [
        "Berizin & Diawasi",
        "Licensed & Supervised",
        "OJK",
        "+ Bank Indonesia",
        "+ Bank Indonesia",
        "shield",
        2,
      ],
      [
        "Simpanan Nasabah",
        "Customer Deposits",
        "Dijamin",
        "LPS",
        "LPS",
        "users",
        3,
      ],
      [
        "Layanan Nasabah",
        "Customer Service",
        "14040",
        "24 Jam",
        "24 Hours",
        "atm",
        4,
      ],
    ];
    for (const row of statsData) insert.run(...row);
    console.log("[db] Seeded 4 statistics");
  }

  const brochuresCount = db
    .prepare("SELECT COUNT(*) as c FROM brochures")
    .get().c;
  if (brochuresCount === 0) {
    const insert = db.prepare(
      `INSERT INTO brochures (item_id, title, category, subcategory, icon, description_id, description_en, image, brochure_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const brochureData = [
      [
        "griya",
        "BSI Griya",
        "pembiayaan",
        "konsumer",
        "home",
        "Pembiayaan syariah untuk kepemilikan rumah baru, bekas, maupun apartemen.",
        "Sharia financing for new and used home ownership, including apartments.",
        "/brochures/pembiayaan-griya.png",
        "",
        1,
      ],
      [
        "oto",
        "BSI Oto",
        "pembiayaan",
        "konsumer",
        "truck",
        "Pembiayaan kepemilikan kendaraan bermotor baru maupun bekas dengan prinsip syariah.",
        "Sharia-compliant financing for new and used motor vehicles.",
        "/brochures/pembiayaan-oto.png",
        "",
        2,
      ],
      [
        "oto-mobil",
        "BSI Oto — Kepemilikan Mobil",
        "pembiayaan",
        "konsumer",
        "truck",
        "Pembiayaan khusus kepemilikan mobil baru dan bekas dari BSI.",
        "Dedicated BSI financing for new and used car ownership.",
        "/brochures/pembiayaan-oto-mobil.png",
        "",
        3,
      ],
      [
        "pensiun",
        "BSI Pensiun",
        "pembiayaan",
        "konsumer",
        "users",
        "Pembiayaan khusus bagi para pensiunan untuk memenuhi kebutuhan finansial pasca-pensiun.",
        "Dedicated financing for retirees to meet post-retirement financial needs.",
        "/brochures/pembiayaan-pensiun.png",
        "",
        4,
      ],
      [
        "mitraguna",
        "BSI Mitraguna",
        "pembiayaan",
        "konsumer",
        "briefcase",
        "Pembiayaan multiguna berbasis prinsip ijarah muntahia bittamlik (IMBT).",
        "Multi-purpose financing based on IMBT principle.",
        "/brochures/pembiayaan-mitraguna.jpeg",
        "",
        5,
      ],
      [
        "mitraguna-hakim",
        "BSI Mitraguna — Khusus Hakim",
        "pembiayaan",
        "konsumer",
        "briefcase",
        "Pembiayaan multiguna khusus bagi pegawai instansi Mahkamah Agung RI.",
        "Dedicated multi-purpose financing for Supreme Court of RI officials.",
        "/brochures/pembiayaan-mitraguna-hakim.jpeg",
        "",
        6,
      ],
      [
        "mikro",
        "Brosur Mikro",
        "pembiayaan",
        "mikro",
        "trending",
        "Pembiayaan mikro untuk pelaku usaha kecil dan menengah berbasis prinsip syariah.",
        "Micro financing for small and medium business owners based on sharia principles.",
        "/brochures/pembiayaan-mikro.png",
        "",
        7,
      ],
      [
        "pendanaan",
        "Brosur Pendanaan",
        "pendanaan",
        "",
        "save",
        "Produk pendanaan dan simpanan syariah dari BSI.",
        "BSI sharia funding and savings products.",
        "/brochures/pembiayaan-pendanaan.jpeg",
        "",
        8,
      ],
      [
        "cicil-emas",
        "Brosur Cicil Emas",
        "emas",
        "",
        "award",
        "Layanan cicil emas dari BSI dengan prinsip murabahah.",
        "BSI gold installment service with murabahah principle.",
        "/brochures/pembiayaan-cicil-emas.png",
        "",
        9,
      ],
      [
        "gadai-emas",
        "Brosur Gadai Emas",
        "emas",
        "",
        "star",
        "Gadai emas syariah (rahn) untuk mendapatkan dana tunai cepat.",
        "Sharia gold pawn (rahn) for quick cash using your gold as collateral.",
        "/brochures/pembiayaan-gadai-emas.png",
        "",
        10,
      ],
    ];
    for (const row of brochureData) insert.run(...row);
    console.log("[db] Seeded 10 brochures");
  }

  const brochureCatCount = db
    .prepare("SELECT COUNT(*) as c FROM brochure_categories")
    .get().c;
  if (brochureCatCount === 0) {
    const insert = db.prepare(
      `INSERT INTO brochure_categories (item_id, title_id, title_en, icon, description_id, description_en, subcategories, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const catData = [
      [
        "pembiayaan",
        "Pembiayaan",
        "Financing",
        "trending",
        "Pembiayaan syariah tanpa riba untuk kebutuhan konsumtif maupun produktif.",
        "Riba-free sharia financing for both consumer and productive needs.",
        '[{"id":"konsumer","title_id":"Konsumer","title_en":"Consumer"},{"id":"mikro","title_id":"Mikro","title_en":"Micro"}]',
        1,
      ],
      [
        "pendanaan",
        "Pendanaan",
        "Funding",
        "save",
        "Produk pendanaan dan simpanan syariah untuk menunjang perencanaan keuangan.",
        "Sharia funding and savings products to support your financial planning.",
        "[]",
        2,
      ],
      [
        "emas",
        "Cicil Emas & Gadai",
        "Gold Installment & Pawn",
        "award",
        "Layanan emas: cicil emas dan gadai emas sesuai prinsip syariah.",
        "Gold services: gold installment and gold pawn in line with sharia principles.",
        "[]",
        3,
      ],
    ];
    for (const row of catData) insert.run(...row);
    console.log("[db] Seeded 3 brochure categories");
  }
}

seedIfEmpty();

export default db;
