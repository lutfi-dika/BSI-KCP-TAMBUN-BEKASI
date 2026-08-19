# BSI KCP Tambun Bekasi

> Website resmi **Bank Syariah Indonesia Kantor Cabang Pembantu (KCP) Tambun Bekasi** — portal web modern, bilingual, dan responsif yang menampilkan produk perbankan syariah, layanan, harga emas real-time, jadwal sholat harian, simulasi gadai emas, panduan dokumen, dan galeri kegiatan kantor.

**Live:** [bsi-kcp-tambun-bekasi.vercel.app](https://bsi-kcp-tambun-bekasi.vercel.app)

---

## Fitur Utama

### Inti
- **Bilingual (ID / EN)** — Dukungan penuh Bahasa Indonesia dan Inggris melalui custom i18n context tanpa library pihak ketiga.
- **Dark / Light Mode** — Mendeteksi preferensi sistem; dapat di-toggle manual dengan View Transition API circle-reveal; tersimpan di localStorage.
- **Responsive Design** — Layout mobile-first dengan Tailwind CSS; diuji di desktop, tablet, dan mobile.
- **Animasi Halus** — Transisi halaman, scroll-triggered reveals, dan micro-interactions dengan Framer Motion.
- **SEO Optimized** — Meta tags per halaman, Open Graph / Twitter Card, JSON-LD structured data (BreadcrumbList, FAQPage, Organization, WebSite), canonical URL, XML sitemap, dan robots.txt.
- **PWA-Ready Manifest** — site.webmanifest dengan warna brand BSI dan ikon multi-resolusi.

### Fitur Interaktif
- **Harga Emas Real-Time** — Chart harga emas IDR/gram dari Yahoo Finance (via Express proxy), mendukung periode 7 hari sampai 1 tahun.
- **Jadwal Sholat Hari Ini** — Mengambil data waktu sholat dari Aladhan API untuk lokasi Tambun, Bekasi. Menampilkan 5 waktu sholat (Subuh, Dzuhur, Ashar, Maghrib, Isya), waktu terbit, tanggal Hijriah, dan indikator sholat berikutnya.
- **Simulasi Gadai Emas** — Kalkulator estimasi gadai emas dengan LTV 85%, margin 1.5%/bulan, preset jenis emas (Antam 1g–50g + custom), tenor 1–12 bulan, dan rincian biaya lengkap.
- **Kalkulator Pembiayaan Murabahah** — Menghitung cicilan bulanan dan total biaya untuk pembiayaan berbasis akad Murabahah BSI dengan preset (KPR, Mobil, Motor, UMKM).
- **Kuis Rekomendasi Produk** — Kuesioner interaktif yang merekomendasikan produk BSI sesuai kebutuhan pengguna (Karyawan, UMKM, Mahasiswa, Pensiunan, Pengusaha, Perencana Keluarga).
- **Chatbot AI** — Chatbot berbasis keyword matching dengan knowledge base produk BSI, layanan, dan FAQ, mendukung bilingual (ID/EN) dengan fallback ke WhatsApp.
- **Panduan Dokumen** — Daftar persyaratan dokumen untuk 5 layanan (Pembukaan Rekening, Gadai Emas, Pembiayaan, Haji & Umrah, Kartu Debit) dengan UI accordion.
- **Galeri Foto** — Galeri foto kantor dan kegiatan BSI KCP Tambun dengan 5 foto asli dan lightbox fullscreen.

### Utilitas
- **Admin Panel** (`/admin`) — Override atau mock data chart (consumer financing, micro financing, harga emas) yang disimpan di localStorage; tanpa autentikasi.

---

## Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework** | React | 19.x |
| **Build Tool** | Vite | 8.x |
| **Styling** | Tailwind CSS | 4.x (CSS-first config) |
| **Animasi** | Framer Motion | 13.x |
| **Routing** | React Router DOM | 7.x |
| **Ikon** | React Icons | 5.x (Feather, Font Awesome, Simple Icons) |
| **Backend** | Express | 5.x (Node.js) — proxy server harga emas |
| **Data Emas** | Yahoo Finance public API | Keyless |
| **Data Sholat** | Aladhan API | Keyless, method=20 (Kemenag RI) |
| **Deployment** | Vercel | SPA dengan rewrite rules |
| **Bahasa** | JavaScript (ES Modules) | — |

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

File `.env` bersifat opsional. Salin dari template jika diperlukan:

```bash
cp .env.example .env
```

| Variabel | Deskripsi | Default |
|---|---|---|
| `PORT` | Port untuk Express backend proxy | `3001` |

> **Catatan:** Tidak ada API key yang diperlukan. Yahoo Finance dan Aladhan API bersifat publik dan keyless.

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
npm run build          # Build production
npm run preview        # Preview build production secara lokal
npm run start          # Jalankan server production (NODE_ENV=production)
```

---

## Struktur Projek

```
bsi-kcp-tambun-bekasi/
├── public/                          # Aset statis
│   ├── brochures/                   # Gambar brosur produk (PNG/JPEG)
│   │   ├── pembiayaan-cicil-emas.png
│   │   ├── pembiayaan-gadai-emas.png
│   │   ├── pembiayaan-griya.png
│   │   ├── pembiayaan-mikro.png
│   │   ├── pembiayaan-mitraguna.jpeg
│   │   ├── pembiayaan-mitraguna-hakim.jpeg
│   │   ├── pembiayaan-oto.png
│   │   ├── pembiayaan-oto-mobil.png
│   │   ├── pembiayaan-pendanaan.jpeg
│   │   └── pembiayaan-pensiun.png
│   ├── gallery/                     # Foto asli kantor (WEBP/PNG)
│   │   ├── area-teller.webp
│   │   ├── kantor.webp
│   │   ├── layanan-cs.webp
│   │   ├── Pembukaan Rekening Online.png
│   │   └── Ramadhan.webp
│   ├── favicon.ico                  # Multi-resolusi favicon
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.png
│   ├── og-image.png                 # Gambar share Open Graph (1200x630)
│   ├── icons.svg
│   ├── robots.txt                   # Aturan crawling search engine
│   ├── sitemap.xml                  # XML sitemap
│   └── site.webmanifest             # PWA manifest
├── server/
│   └── index.js                     # Express backend — proxy harga emas Yahoo Finance
├── src/
│   ├── api/
│   │   └── gold.js                  # Client-side fetch wrapper untuk /api/gold
│   ├── assets/
│   │   ├── bsi-logo.png
│   │   ├── digital-banking.png
│   │   ├── Digital Banking.png
│   │   ├── footer-bg.png
│   │   ├── hero.png
│   │   ├── history.jpg
│   │   └── promo/                   # Gambar slider promo (slide-1..4.jpg)
│   ├── components/
│   │   ├── about/
│   │   │   └── OrganizationChart.jsx
│   │   ├── charts/
│   │   │   ├── ChartCanvas.jsx
│   │   │   ├── DataUnavailableCard.jsx
│   │   │   ├── GoldPriceChart.jsx
│   │   │   └── ServiceChart.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Chatbot.jsx          # Chatbot AI bilingual
│   │   │   ├── DigitalClock.jsx
│   │   │   ├── DocumentGuide.jsx    # Panduan dokumen persyaratan
│   │   │   ├── FinancingCalculator.jsx  # Kalkulator Murabahah
│   │   │   ├── GoldPawnCalculator.jsx   # Simulasi gadai emas
│   │   │   ├── ImageSlider.jsx
│   │   │   ├── LanguageToggle.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── PrayerTimes.jsx      # Jadwal sholat harian (Aladhan API)
│   │   │   ├── ProductRecommendation.jsx  # Kuis rekomendasi produk
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SectionTitle.jsx
│   │   │   ├── Seo.jsx              # SEO head tag manager
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── WhatsAppButton.jsx
│   │   ├── faq/
│   │   │   └── Accordion.jsx
│   │   ├── home/
│   │   │   ├── AboutPreview.jsx
│   │   │   ├── ContactPreview.jsx
│   │   │   ├── CTA.jsx
│   │   │   ├── DigitalBanking.jsx
│   │   │   ├── FAQPreview.jsx
│   │   │   ├── GalleryPreview.jsx
│   │   │   ├── HelpTiles.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── NewsPreview.jsx
│   │   │   ├── ProductsPreview.jsx
│   │   │   ├── PromoBanner.jsx
│   │   │   ├── ServicesPreview.jsx
│   │   │   ├── Statistics.jsx
│   │   │   └── WhyBSI.jsx
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── Navbar.jsx           # Fixed header dengan mega-menu
│   │   │   └── ScrollTop.jsx
│   │   └── ui/
│   │       └── PageHeader.jsx
│   ├── context/
│   │   ├── languageContext.jsx       # Provider bilingual i18n
│   │   └── themeContext.jsx          # Provider dark/light theme
│   ├── data/                         # Data statis bilingual
│   │   ├── aiKnowledge.js           # Knowledge base chatbot
│   │   ├── brochures.js             # Katalog brosur
│   │   ├── chartMock.js             # Data chart simulasi
│   │   ├── contact.js               # Info kontak & social media
│   │   ├── faq.js                   # Entri FAQ
│   │   ├── gallery.js               # Item galeri (5 foto asli)
│   │   ├── news.js                  # Artikel berita
│   │   ├── organization.js          # Struktur organisasi
│   │   ├── products.js              # Produk unggulan
│   │   ├── promos.js                # Promosi
│   │   ├── services.js              # Katalog layanan lengkap
│   │   └── statistics.js            # Metrik KPI utama
│   ├── hooks/
│   │   ├── useDarkMode.js           # Hook dark mode + View Transition API
│   │   └── useScroll.js             # Hook posisi scroll
│   ├── i18n/
│   │   └── translations.js          # Kamus i18n lengkap (~1400 baris)
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── About.jsx                # Profil BSI
│   │   ├── Services.jsx             # Katalog produk & layanan
│   │   ├── Brochures.jsx            # Brosur produk
│   │   ├── Gallery.jsx              # Galeri foto
│   │   ├── News.jsx                 # Artikel berita
│   │   ├── FAQ.jsx                  # FAQ
│   │   ├── Contact.jsx              # Kontak & peta
│   │   ├── Admin.jsx                # Admin panel
│   │   └── NotFound.jsx             # Halaman 404
│   ├── routes/
│   │   └── AppRoutes.jsx            # Definisi route dengan lazy loading
│   ├── utils/
│   │   ├── animation.js             # Preset animasi Framer Motion
│   │   ├── chartStore.js            # Store data chart (localStorage)
│   │   │   └── helpers.js           # Fungsi utilitas
│   ├── App.jsx                      # Komponen root
│   ├── index.css                    # Konfigurasi Tailwind + token brand
│   └── main.jsx                     # Entry point React
├── .env.example                     # Template variabel lingkungan
├── eslint.config.js                 # Konfigurasi ESLint flat config
├── index.html                       # Shell HTML (meta, OG, JSON-LD)
├── package.json
├── vercel.json                      # Konfigurasi rewrite SPA Vercel
└── vite.config.js                   # Plugin Vite + Tailwind + React
```

---

## Rute (Routes)

| Path | Halaman | Deskripsi |
|---|---|---|
| `/` | Home | Landing page: slider promo, jadwal sholat, harga emas, statistik, kalkulator gadai, kalkulator pembiayaan, panduan dokumen, kuis produk, chatbot |
| `/about` | About | Profil perusahaan, visi/misi, struktur organisasi |
| `/services` | Services | Katalog lengkap: Tabungan, Pembiayaan, Investasi, Haji & Umrah, Digital Banking, Bisnis |
| `/brosur` | Brochures | Jelajahi dan unduh gambar brosur produk |
| `/gallery` | Gallery | Galeri foto kantor dan layanan dengan lightbox fullscreen |
| `/news` | News | Artikel berita dan pengumuman |
| `/faq` | FAQ | Pertanyaan yang sering diajukan dengan UI accordion |
| `/contact` | Contact | Formulir kontak, alamat kantor, telepon, email, media sosial, Google Maps |
| `/admin` | Admin | Dashboard untuk override/mock data chart |
| `*` | 404 | Halaman "tidak ditemukan" kustom |

Semua komponen halaman di-**lazy-load** dengan `React.lazy()` dan dirender di dalam `<Suspense>` boundary dengan spinner `<Loader>`.

---

## Arsitektur & Alur Data

### Provider Hierarchy

```
BrowserRouter
└── MotionConfig (reducedMotion="user")
    └── ThemeProvider
        └── LanguageProvider
            ├── Navbar (fixed header + mega-menu + utility bar)
            ├── AppRoutes (lazy-loaded pages)
            ├── Footer
            ├── Chatbot (floating widget)
            └── ScrollTop (floating button)
```

### Arsitektur Data

| Komponen | Sumber Data | Metode |
|---|---|---|
| Layanan, Produk, FAQ, Berita | `src/data/*.js` | Static data objects, bilingual `{ id, en }` |
| Harga Emas | Yahoo Finance API | Via Express proxy (`/api/gold/history`) |
| Jadwal Sholat | Aladhan API | Client-side fetch langsung ke API publik |
| Chatbot | `src/data/aiKnowledge.js` | Keyword matching + FAQ search |
| Chart Overrides | localStorage | Admin panel write, chart components read |

### Konvensi Bilingual

Semua konten pengguna menggunakan salah satu dari dua pola:

1. **Translation keys** — untuk teks UI:
   ```js
   const { t } = useLanguage();
   <h2>{t("home.hero.title")}</h2>
   ```

2. **Bilingual data objects** — untuk data statis:
   ```js
   const { tr } = useLanguage();
   <h2>{tr(product.name)}</h2>
   // product.name = { id: "Tabungan Easy", en: "Easy Savings" }
   ```

---

## Backend — Proxy Harga Emas

Express server (`server/index.js`) berfungsi sebagai proxy ke **Yahoo Finance** public API:

- **Endpoint:** `GET /api/gold/history?period=7d`
- **Ticker:** GC=F (COMEX Gold Futures) + IDR=X (USD/IDR exchange rate)
- **Konversi:** `IDR/gram = (USD/oz × IDR/USD) / 31.1034768`
- **Validasi:** IDR/USD harus 8.000–40.000; per gram harus 100.000–10.000.000

| Periode | Yahoo Range | TTL Cache |
|---|---|---|
| `7d` | 1 month (dipotong ke 7 hari) | 3 jam |
| `1m` | 1 month | 3 jam |
| `3m` | 3 months | 6 jam |
| `6m` | 6 months | 12 jam |
| `1y` | 1 year | 24 jam |

**Fitur backend:**
- In-memory cache dengan single-flight deduplication (mencegah thundering herd)
- Stale-on-error fallback: jika Yahoo gagal, mengembalikan data cache terakhir
- Rate limiting per-IP: 120 request/menit
- CORS enabled untuk semua origin
- 20 second fetch timeout per request

Frontend memanggil melalui `src/api/gold.js`, yang di-proxy Vite dari `/api` ke `localhost:3001` selama development.

---

## Komponen Kunci

### Jadwal Sholat (`PrayerTimes.jsx`)

- Mengambil data dari **Aladhan API** (`method=20` — Kementerian Agama RI)
- Koordinat Tambun: `-6.263958, 107.066805`
- Menampilkan 5 waktu sholat (Subuh, Dzuhur, Ashar, Maghrib, Isya) dalam format 12-jam + "WIB"
- Indikator sholat berikutnya dengan highlight hijau
- Tanggal Hijriah (dari respons API)
- Auto-refresh indikator setiap 30 detik
- Loading skeleton, error state dengan retry button
- Refresh manual button

### Simulasi Gadai Emas (`GoldPawnCalculator.jsx`)

- LTV (Loan-to-Value): 85%
- Margin: 1.5% per bulan
- Biaya admin: Rp 10.000
- Biaya titip: 0.5% dari total nilai emas
- Preset jenis emas: Antam 1g, 5g, 10g, 25g, 50g + custom
- Tenor: 1, 2, 3, 6, 12 bulan
- Menampilkan: pinjaman maksimal, nilai total emas, margin, biaya admin, biaya titip, total pembayaran
- Rincian biaya (fee breakdown) lengkap

### Kalkulator Pembiayaan (`FinancingCalculator.jsx`)

- Preset: KPR/Rumah (Rp 350.000.000), Mobil (Rp 250.000.000), Motor (Rp 30.000.000), UMKM (Rp 50.000.000)
- Custom input harga, uang muka (DP), dan tenor
- Menghitung cicilan bulanan dan total biaya berdasarkan akad Murabahah

### Chatbot (`Chatbot.jsx`)

- Keyword matching terhadap knowledge base produk BSI
- FAQ search dengan fuzzy matching
- Quick reply buttons
- Bilingual response (ID/EN)
- Fallback ke WhatsApp jika tidak terjawab
- Floating widget dengan minimize/maximize

### Panduan Dokumen (`DocumentGuide.jsx`)

- 5 kategori layanan: Pembukaan Rekening, Gadai Emas, Pembiayaan, Haji & Umrah, Kartu Debit
- UI accordion dengan animasi Framer Motion
- Setiap kategori menampilkan daftar dokumen persyaratan
- CTA button ke WhatsApp untuk konsultasi

### SEO (`Seo.jsx`)

- Dynamic `<title>`, `<meta description>`, OG tags, Twitter Cards
- Canonical URL
- JSON-LD: BreadcrumbList (semua halaman), FAQPage (halaman FAQ)
- Helper `breadcrumb()` untuk generate schema.org BreadcrumbList

---

## Sistem Tema

- **Dark/Light mode** menggunakan strategi class-based Tailwind CSS v4
- **CSS-first config** — tidak ada `tailwind.config.js`; semua di `src/index.css` menggunakan `@theme`
- **Warna brand BSI:**
  - BSI Teal: `#00847D` (meng-override Tailwind emerald scale)
  - BSI Gold: `#c9972c`
- **Semantic tokens:** `surface`, `ink`, `line` — beralih otomatis antara light/dark
- **View Transition API:** Toggle theme dengan animasi circle-reveal dari posisi tombol
- **Prefers-reduced-motion:** Menghormati pengaturan aksesibilitas sistem

---

## Sistem Internasionalisasi (i18n)

- **Provider:** `src/context/languageContext.jsx`
- **Kamus:** `src/i18n/translations.js` (~1.400 baris, key dot-notation flat)
- **Persistensi:** localStorage key `"bsi-lang"`, default `"id"`
- **DOM sync:** Mengatur `document.documentElement.lang` pada setiap perubahan
- **API:**
  - `t(key)` — resolve key dari kamus aktif; fallback ke ID lalu raw key
  - `tr({ id, en })` — resolve objek bilingual berdasarkan bahasa aktif

---

## Galeri Foto

| # | Judul | Kategori | File |
|---|---|---|---|
| 1 | Kantor BSI KCP Tambun | Kantor | `kantor.webp` |
| 2 | Layanan Customer Service | Layanan | `layanan-cs.webp` |
| 3 | Pembukaan Rekening Online | Digital | `Pembukaan Rekening Online.png` |
| 4 | Ramadhan & Berbagi | Kegiatan | `Ramadhan.webp` |
| 5 | Area Teller | Kantor | `area-teller.webp` |

- Halaman `/gallery` menampilkan semua foto dalam grid dengan lightbox fullscreen
- Section galeri di Home menampilkan 4 foto teratas sebagai preview
- Mendukung keyboard navigation (Escape, Left/Right arrows) di lightbox

---

## Panel Admin

Navigasi ke `/admin` untuk mengakses dashboard admin sederhana:

- **Chart Consumer Financing:** Edit atau tambah data point (date, revenue, expenses)
- **Chart Micro Financing:** Sama seperti di atas
- **Chart Harga Emas:** Override tanggal tertentu untuk menyembunyikan atau mengganti data pasar
- Semua override disimpan di **localStorage** (per-browser, tanpa penyimpanan server-side)
- **Tanpa autentikasi** — tools ini untuk development/demo lokal

---

## Deployment

Projek ini di-deploy di **Vercel**:

- **Frontend:** Vite build output dilayani sebagai SPA statis
- **SPA Routing:** `vercel.json` rewrite semua route ke `/index.html`
- **Backend:** Express gold-price proxy berjalan secara terpisah (VPS, Railway, atau Render)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Build & Deploy

```bash
# Local build
npm run build

# Preview production build
npm run preview

# Production server (jika menjalankan backend)
NODE_ENV=production node --env-file-if-exists=.env server/index.js
```

---

## Scripts yang Tersedia

| Script | Deskripsi |
|---|---|
| `npm run dev` | Jalankan Vite dev server + Express backend secara bersamaan (concurrently) |
| `npm run dev:client` | Jalankan hanya Vite dev server |
| `npm run dev:server` | Jalankan hanya Express backend |
| `npm run build` | Build production via Vite |
| `npm run preview` | Preview build production secara lokal |
| `npm run lint` | Jalankan ESLint pada semua file JS/JSX |
| `npm run start` | Jalankan server production (NODE_ENV=production) |

---

## Aksesibilitas

- **prefers-reduced-motion** — Semua animasi Framer Motion dihormati
- **:focus-visible** — Outline visual untuk navigasi keyboard
- **sr-only heading** — `<h1>` tersembunyi untuk screen reader
- **aria-label** — Pada elemen interaktif utama
- **scroll-padding-top** — 6.75rem untuk kompensasi fixed navbar

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
- Gunakan `t("key")` untuk UI strings dan `tr({ id, en })` untuk data objects
- Dark mode dan light mode keduanya diuji
- Build berhasil (`npm run build`)
- Lint tidak ada error (`npm run lint`)

---

## Lisensi

Projek ini bersifat propietary milik **Bank Syariah Indonesia KCP Tambun Bekasi**. Untuk penggunaan internal saja.

---

## Pengakuan

- [Bank Syariah Indonesia](https://www.bankbsi.co.id/) — panduan brand dan informasi produk
- [Yahoo Finance](https://finance.yahoo.com/) — API data komoditas emas
- [Aladhan API](https://aladhan.com/prayer-times-api) — API jadwal sholat
- [Vercel](https://vercel.com/) — hosting dan deployment
- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework utility-first
- [Framer Motion](https://www.framer.com/motion/) — library animasi
