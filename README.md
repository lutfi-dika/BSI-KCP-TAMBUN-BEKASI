# BSI KCP Tambun Bekasi

> Website resmi **Bank Syariah Indonesia Kantor Cabang Pembantu (KCP) Tambun Bekasi** — portal web modern, bilingual, dan responsif yang menampilkan produk perbankan syariah, layanan, harga emas real-time, dan galeri kegiatan kantor.

**Live:** [bsi-kcp-tambun-bekasi.vercel.app](https://bsi-kcp-tambun-bekasi.vercel.app)

---

## Fitur Utama

- **Bilingual (ID / EN)** — Dukungan penuh Bahasa Indonesia dan Inggris melalui custom i18n context (tanpa library pihak ketiga).
- **Dark / Light Mode** — Mendeteksi preferensi sistem; dapat di-toggle manual; tersimpan di localStorage.
- **Harga Emas Real-Time** — Mengambil data harga emas dari Yahoo Finance (via Express backend proxy) dan menampilkan tren dalam satuan IDR/gram.
- **Chatbot AI** — Chatbot berbasis keyword matching dengan knowledge base produk BSI, layanan, dan FAQ dalam Bahasa Indonesia.
- **Kuis Rekomendasi Produk** — Kuesioner interaktif yang merekomendasikan produk BSI sesuai kebutuhan dan tujuan pengguna.
- **Kalkulator Pembiayaan Murabahah** — Menghitung cicilan bulanan dan total biaya untuk pembiayaan berbasis akad Murabahah BSI.
- **Galeri Foto** — Galeri foto kantor dan kegiatan BSI KCP Tambun dengan 5 foto asli (Kantor, Customer Service, Pembukaan Rekening Online, Ramadhan & Berbagi, Area Teller) dan lightbox fullscreen.
- **Admin Panel** (`/admin`) — Override atau mock data chart harga emas (consumer & micro financing) yang disimpan di localStorage; tanpa autentikasi.
- **SEO Optimized** — Meta tags per halaman, Open Graph / Twitter Card, JSON-LD structured data (BreadcrumbList, FAQPage), canonical URL, XML sitemap, dan robots.txt.
- **Responsive Design** — Layout mobile-first dengan Tailwind CSS; diuji di desktop, tablet, dan mobile.
- **Animasi Halus** — Transisi halaman, scroll-triggered reveals, dan micro-interactions dengan Framer Motion.
- **PWA-Ready Manifest** — site.webmanifest dengan warna brand BSI dan ikon multi-resolusi.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 (class-based dark mode) |
| **Animasi** | Framer Motion |
| **Routing** | React Router DOM 7 |
| **Ikon** | React Icons (Feather, Font Awesome, Simple Icons) |
| **Backend** | Express 5 (Node.js) — proxy server harga emas |
| **Data Source** | Yahoo Finance public API (keyless) |
| **Deployment** | Vercel (SPA dengan rewrite rules) |
| **Bahasa** | JavaScript (ES modules) |

---

## Memulai

### Prasyarat

- **Node.js** >= 18.x
- **npm** >= 9.x (atau **yarn** / **pnpm**)

### Instalasi

```bash
# Clone repository
git clone https://github.com/your-username/bsi-kcp-tambun-bekasi.git
cd bsi-kcp-tambun-bekasi

# Install dependencies
npm install
```

### Variabel Lingkungan

Salin file contoh dan konfigurasikan sesuai kebutuhan:

```bash
cp .env.example .env
```

| Variabel | Deskripsi | Default |
|---|---|---|
| PORT | Port untuk Express backend proxy | 3001 |

### Development

Jalankan frontend dan backend secara bersamaan:

```bash
npm run dev
```

Ini akan menjalankan:
- **Vite dev server** di http://localhost:5173 (atau port berikutnya)
- **Express backend** di http://localhost:3001 (di-proxy melalui Vite di `/api`)

### Production Build

```bash
npm run build
npm run preview   # preview build production secara lokal
```

Script `build` menjalankan Vite production build. Di Vercel, `npm run build` adalah build command default dan SPA dilayani dengan rewrite rules ke `index.html`.

---

## Struktur Projek

```
bsi-kcp-tambun-bekasi/
├── public/                        # Aset statis
│   ├── brochures/                 # Gambar brosur produk (PNG/JPEG)
│   ├── gallery/                   # Gambar galeri (WEBP/PNG)
│   │   ├── kantor.webp
│   │   ├── layanan-cs.webp
│   │   ├── area-teller.webp
│   │   ├── Pembukaan Rekening Online.png
│   │   └── ramadan-NEW-icon-746-×-560-e1740130488272.webp
│   ├── favicon.ico                # Multi-resolusi favicon
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── og-image.png               # Gambar share Open Graph
│   ├── robots.txt                 # Aturan crawling search engine
│   ├── sitemap.xml                # XML sitemap
│   └── site.webmanifest           # PWA manifest
├── server/
│   └── index.js                   # Express backend — proxy harga emas Yahoo Finance
├── src/
│   ├── api/
│   │   └── gold.js                # Client-side fetch wrapper untuk /api/gold
│   ├── assets/
│   │   └── promo/                 # Gambar slider promo (slide-1..4.jpg)
│   ├── components/
│   │   ├── about/                 # OrganizationChart
│   │   ├── charts/                # GoldPriceChart, ChartCanvas, ServiceChart, DataUnavailableCard
│   │   ├── common/                # Chatbot, FinancingCalculator, ProductRecommendation,
│   │   │                          #   Seo, WhatsAppButton, ImageSlider, Button, Card,
│   │   │                          #   DigitalClock, LanguageToggle, ThemeToggle, Loader,
│   │   │                          #   SectionTitle, SearchBar
│   │   ├── faq/                   # Accordion
│   │   ├── home/                  # Hero, AboutPreview, ServicesPreview, ProductsPreview,
│   │   │                          #   Statistics, WhyBSI, HelpTiles, FAQPreview, CTA,
│   │   │                          #   DigitalBanking, PromoBanner, GalleryPreview,
│   │   │                          #   NewsPreview, ContactPreview
│   │   ├── layout/                # Navbar, MobileMenu, Footer, ScrollTop
│   │   └── ui/                    # PageHeader
│   ├── context/
│   │   ├── themeContext.jsx        # Provider dark/light theme
│   │   └── languageContext.jsx     # Provider bilingual i18n (ID/EN)
│   ├── data/                      # Data statis bilingual
│   │   ├── aiKnowledge.js         # Knowledge base chatbot
│   │   ├── brochures.js           # Katalog brosur
│   │   ├── chartMock.js           # Data chart simulasi
│   │   ├── contact.js             # Info kontak & social media
│   │   ├── faq.js                 # Entri FAQ
│   │   ├── gallery.js             # Item galeri (5 foto asli)
│   │   ├── news.js                # Artikel berita
│   │   ├── organization.js        # Struktur organisasi
│   │   ├── products.js            # Produk perbankan
│   │   ├── promos.js              # Promosi
│   │   ├── services.js            # Katalog layanan lengkap (6 kategori, 17+ produk)
│   │   └── statistics.js          # Metrik / KPI utama
│   ├── hooks/
│   │   ├── useDarkMode.js         # Hook dark mode sistem + manual
│   │   └── useScroll.js           # Hook posisi scroll
│   ├── i18n/
│   │   └── translations.js        # Kamus i18n lengkap (id/en)
│   ├── pages/
│   │   ├── Home.jsx               # Landing page (sections lazy-loaded)
│   │   ├── About.jsx              # Profil BSI, visi, misi, struktur organisasi
│   │   ├── Services.jsx           # Katalog produk & layanan lengkap
│   │   ├── Brochures.jsx          # Galeri brosur yang dapat diunduh
│   │   ├── Gallery.jsx            # Galeri foto kantor & kegiatan
│   │   ├── News.jsx               # Artikel berita & pengumuman
│   │   ├── FAQ.jsx                # Pertanyaan yang sering diajukan
│   │   ├── Contact.jsx            # Formulir kontak & info
│   │   ├── Admin.jsx              # Admin: override data chart
│   │   └── NotFound.jsx           # Halaman 404
│   ├── routes/
│   │   └── AppRoutes.jsx          # Definisi semua route dengan lazy loading
│   ├── utils/
│   │   ├── animation.js           # Preset animasi Framer Motion
│   │   ├── chartStore.js          # Store data chart berbasis localStorage
│   │   └── helpers.js             # Fungsi utilitas
│   ├── App.jsx                    # Komponen root (providers + layout)
│   ├── index.css                  # Konfigurasi Tailwind + token brand BSI
│   └── main.jsx                   # Entry point React
├── .env.example                   # Template variabel lingkungan
├── eslint.config.js               # Konfigurasi ESLint flat
├── index.html                     # Shell HTML (meta tags, OG, favicon)
├── package.json                   # Dependencies & scripts
├── vercel.json                    # Konfigurasi rewrite SPA Vercel
└── vite.config.js                 # Plugin Vite + Tailwind + React
```

---

## Rute (Routes)

| Path | Halaman | Deskripsi |
|---|---|---|
| `/` | Home | Landing page dengan slider promo, preview layanan, harga emas, statistik, galeri, dan lainnya |
| `/about` | About | Profil perusahaan, visi/misi, struktur organisasi |
| `/services` | Services | Katalog lengkap: Tabungan, Pembiayaan, Investasi, Haji & Umrah, Digital Banking, Bisnis |
| `/brosur` | Brochures | Jelajahi dan unduh gambar brosur produk |
| `/gallery` | Gallery | Galeri foto kantor dan layanan dengan lightbox fullscreen |
| `/news` | News | Artikel berita dan pengumuman |
| `/faq` | FAQ | Pertanyaan yang sering diajukan dengan UI accordion |
| `/contact` | Contact | Formulir kontak, alamat kantor, telepon, email, media sosial |
| `/admin` | Admin | Dashboard untuk override/mock data chart harga emas |
| `*` | 404 | Halaman "tidak ditemukan" kustom |

Semua komponen halaman di-**lazy-load** dengan `React.lazy()` dan dirender di dalam `<Suspense>` boundary dengan spinner `<Loader>`.

---

## Backend — Proxy Harga Emas

Express server (`server/index.js`) berfungsi sebagai proxy ke **Yahoo Finance** public API:

- **Endpoint:** `GET /api/gold/history`
- Mengambil ticker GC=F (Gold Futures) dari Yahoo Finance
- Mengkonversi harga USD/oz ke **IDR/gram** menggunakan kurs tukar
- Cache in-memory selama 3-24 jam (tergantung periode) untuk menghindari rate-limiting
- Mengembalikan array `{ date, price, change, changePercent }` untuk rendering chart
- Mendukung periode: 7 hari, 1 bulan, 3 bulan, 6 bulan, 1 tahun
- Rate limiting per-IP (120 request/menit)
- Fallback stale-on-error: jika provider gagal, mengembalikan data cache terakhir

Frontend memanggil melalui `src/api/gold.js`, yang di-proxy Vite dari `/api` ke `localhost:3001` selama development.

---

## Internasionalisasi (i18n)

Aplikasi menggunakan **sistem i18n custom** (tanpa react-intl, i18next, atau sejenisnya):

- **Provider:** `LanguageContext` di `src/context/languageContext.jsx`
- **Kamus:** `src/i18n/translations.js` — objek flat dengan key dot-notation
- **Toggle:** Komponen `LanguageToggle` di navbar untuk beralih antara `id` dan `en`
- **Penggunaan:** `const { t, tr } = useLanguage(); t("home.hero.title")`
- **Cakupan:** Semua teks UI, label navigasi, deskripsi produk, konten FAQ, respon chatbot

Semua file data konten (`src/data/*.js`) menggunakan objek bilingual `{ id, en }` untuk judul, deskripsi, dan label.

---

## Tema

- **Dark/Light mode** menggunakan strategi class-based dark mode Tailwind
- **ThemeContext** mengelola state dan persistensi preferensi di localStorage
- **Deteksi sistem:** Menghormati `prefers-color-scheme` pada kunjungan pertama
- **Toggle:** Komponen `ThemeToggle` (ikon sun/moon) di navbar
- **Warna brand:** BSI Teal (#00847D), BSI Gold (#c9972c), didefinisikan sebagai warna kustom Tailwind di `src/index.css`

---

## Panel Admin

Navigasi ke `/admin` untuk mengakses dashboard admin sederhana untuk pengelolaan data chart:

- **Chart Consumer Financing:** Edit atau tambah data point (date, revenue, expenses)
- **Chart Micro Financing:** Sama seperti di atas
- **Chart Harga Emas:** Override tanggal tertentu untuk menyembunyikan atau mengganti data pasar
- Semua override disimpan di **localStorage** (per-browser, tanpa penyimpanan server-side)
- **Tanpa autentikasi** —工具 ini untuk development/demo lokal

---

## SEO

Setiap halaman menyertakan SEO komprehensif melalui komponen `Seo.jsx`:

- **`<title>` per halaman** dan `<meta description>` (bilingual)
- **Tag Open Graph** (og:title, og:description, og:image, og:url)
- **Meta Twitter Card**
- **JSON-LD structured data:**
  - BreadcrumbList (di semua halaman)
  - FAQPage (di halaman FAQ)
- **Canonical URL** via `<link rel="canonical">`
- **XML Sitemap** di `/sitemap.xml`
- **robots.txt** mengizinkan semua crawler
- **Google Search Console** verification meta tag
- **Structured Data Organization** — informasi bank (alamat, telepon, kontak)
- **Structured Data WebSite** — informasi website (nama, deskripsi, publisher)

---

## Galeri Foto

Galeri menampilkan 5 foto asli BSI KCP Tambun:

| # | Judul | Kategori | File |
|---|---|---|---|
| 1 | Kantor BSI KCP Tambun | Kantor | `kantor.webp` |
| 2 | Layanan Customer Service | Layanan | `layanan-cs.webp` |
| 3 | Pembukaan Rekening Online | Digital | `Pembukaan Rekening Online.png` |
| 4 | Ramadhan & Berbagi | Kegiatan | `ramadan-NEW-icon-746-×-560-e1740130488272.webp` |
| 5 | Area Teller | Kantor | `area-teller.webp` |

- Halaman `/gallery` menampilkan semua foto dalam grid dengan lightbox fullscreen
- Section galeri di Home menampilkan 4 foto teratas sebagai preview
- Mendukung keyboard navigation (Escape, Left/Right arrows) di lightbox

---

## Deployment

Projek ini di-deploy di **Vercel**:

- **Frontend:** Vite build output dilayani sebagai SPA statis
- **SPA Routing:** `vercel.json` rewrite semua route ke `/index.html`
- **Backend:** Express gold-price proxy berjalan secara terpisah (misalnya di VPS, Railway, atau Render)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Script yang Tersedia

| Script | Deskripsi |
|---|---|
| `npm run dev` | Jalankan Vite dev server + Express backend secara bersamaan |
| `npm run build` | Build production via Vite |
| `npm run preview` | Preview build production secara lokal |
| `npm run lint` | Jalankan ESLint |
| `npm run start` | Jalankan server production (NODE_ENV=production) |

---

## Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m "feat: tambahkan fitur"`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buka Pull Request

Pastikan:
- Semua teks bilingual (Indonesia + Inggris) di UI dan file data
- Komponen baru mengikuti struktur file/folder yang ada
- Dark mode dan light mode keduanya diuji
- Build berhasil (`npm run build`)

---

## Lisensi

Projek ini bersifat propietary milik **Bank Syariah Indonesia KCP Tambun Bekasi**. Untuk penggunaan internal saja.

---

## Pengakuan

- [Bank Syariah Indonesia](https://www.bankbsi.co.id/) — panduan brand dan informasi produk
- [Yahoo Finance](https://finance.yahoo.com/) — API data komoditas emas
- [Vercel](https://vercel.com/) — hosting dan deployment
- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework utility-first
- [Framer Motion](https://www.framer.com/motion/) — library animasi
