// Pusat Brosur — data brosur produk & layanan BSI KCP Tambun.
//
// CARA MENAMBAH FILE BROSUR:
// 1. Letakkan file PDF di folder `public/brochures/` (buat folder jika belum ada).
// 2. Isi field `brochureUrl` pada entri brosur, contoh: "/brochures/bsi-griya.pdf".
// 3. (Opsional) Isi `image` dengan path cover brosur, contoh: "/brochures/griya.jpg".
//
// Jika `brochureUrl` bernilai `null`, UI otomatis menampilkan
// "Brosur akan segera tersedia" — tanpa tombol download yang error.
//
// Deskripsi produk hanya memuat data yang tersedia di project ini;
// tidak ada detail produk (margin, tenor, promo) yang diarang.
// Text fields use bilingual `{ id, en }` objects.

// Kategori utama pusat brosur.
export const BROSUR_CATEGORIES = [
  {
    id: "pembiayaan",
    title: { id: "Pembiayaan", en: "Financing" },
    icon: "trending",
    description: {
      id: "Pembiayaan syariah tanpa riba untuk kebutuhan konsumtif maupun produktif.",
      en: "Riba-free sharia financing for both consumer and productive needs.",
    },
    subcategories: [
      { id: "konsumer", title: { id: "Konsumer", en: "Consumer" } },
      { id: "mikro", title: { id: "Mikro", en: "Micro" } },
    ],
  },
  {
    id: "pendanaan",
    title: { id: "Pendanaan", en: "Funding" },
    icon: "save",
    description: {
      id: "Produk pendanaan dan simpanan syariah untuk menunjang perencanaan keuangan.",
      en: "Sharia funding and savings products to support your financial planning.",
    },
    subcategories: [],
  },
  {
    id: "emas",
    title: { id: "Cicil Emas & Gadai", en: "Gold Installment & Pawn" },
    icon: "award",
    description: {
      id: "Layanan emas: cicil emas dan gadai emas sesuai prinsip syariah.",
      en: "Gold services: gold installment and gold pawn in line with sharia principles.",
    },
    subcategories: [],
  },
];

// Daftar brosur. `category` merujuk pada id BROSUR_CATEGORIES.
export const BROSUR = [
  // ── Pembiayaan · Konsumer ──
  {
    id: "griya",
    title: "BSI Griya",
    category: "pembiayaan",
    subcategory: "konsumer",
    icon: "home",
    description: {
      id: "Pembiayaan syariah untuk kepemilikan rumah baru, bekas, maupun apartemen. Tersedia juga pembiayaan renovasi dan refinancing dengan prinsip murabahah atau ijarah muntahia bittamlik (IMBT). Nikmati cicilan ringan, tenor hingga 20 tahun, dan proses pengajuan mudah.",
      en: "Sharia financing for new and used home ownership, including apartments. Also available for renovation and refinancing using murabahah or ijarah muntahia bittamlik (IMBT) principles. Enjoy affordable installments, tenor up to 20 years, and easy application process.",
    },
    image: "/brochures/pembiayaan-griya.png",
    brochureUrl: null,
  },
  {
    id: "oto",
    title: "BSI Oto",
    category: "pembiayaan",
    subcategory: "konsumer",
    icon: "truck",
    description: {
      id: "Pembiayaan kepemilikan kendaraan bermotor (roda empat atau lebih) baru maupun bekas dengan prinsip syariah. Tersedia untuk pembelian di dealer resmi maupun perorangan, dengan tenor fleksibel hingga 5 tahun dan uang muka ringan.",
      en: "Sharia-compliant financing for new and used motor vehicles (four wheels or more). Available for purchases from authorized dealers or individuals, with flexible tenor up to 5 years and affordable down payment.",
    },
    image: "/brochures/pembiayaan-oto.png",
    brochureUrl: null,
  },
  {
    id: "oto-mobil",
    title: "BSI Oto — Kepemilikan Mobil",
    category: "pembiayaan",
    subcategory: "konsumer",
    icon: "truck",
    description: {
      id: "Pembiayaan khusus kepemilikan mobil baru dan bekas dari BSI. Nikmati cicilan tetap (flat) sejak awal sesuai prinsip murabahah, proses pengajuan cepat, serta jaringan dealer mitra BSI di seluruh Indonesia.",
      en: "Dedicated BSI financing for new and used car ownership. Enjoy fixed monthly installments (flat) based on murabahah principle, fast application process, and BSI partner dealers across Indonesia.",
    },
    image: "/brochures/pembiayaan-oto-mobil.png",
    brochureUrl: null,
  },
  {
    id: "pensiun",
    title: "BSI Pensiun",
    category: "pembiayaan",
    subcategory: "konsumer",
    icon: "users",
    description: {
      id: "Pembiayaan khusus bagi para pensiunan untuk memenuhi kebutuhan finansial pasca-pensiun. Dengan cicilan yang dipotong langsung dari pensiun, proses mudah dan tanpa agunan. Tersedia berbagai pilihan pembiayaan sesuai kebutuhan.",
      en: "Dedicated financing for retirees to meet post-retirement financial needs. With installments deducted directly from pension, easy process and unsecured. Available in various financing options to suit your needs.",
    },
    image: "/brochures/pembiayaan-pensiun.png",
    brochureUrl: null,
  },
  {
    id: "mitraguna",
    title: "BSI Mitraguna",
    category: "pembiayaan",
    subcategory: "konsumer",
    icon: "briefcase",
    description: {
      id: "Pembiayaan multiguna berbasis prinsip ijarah muntahia bittamlik (IMBT) yang ditujukan bagi pegawai negeri dan karyawan tetap. Dapatkan pembiayaan tanpa agunan dengan cicilan ringan yang dipotong langsung dari gaji.",
      en: "Multi-purpose financing based on ijarah muntahia bittamlik (IMBT) principle for civil servants and permanent employees. Get unsecured financing with affordable installments deducted directly from your salary.",
    },
    image: "/brochures/pembiayaan-mitraguna.jpeg",
    brochureUrl: null,
  },
  {
    id: "mitraguna-hakim",
    title: "BSI Mitraguna — Khusus Hakim",
    category: "pembiayaan",
    subcategory: "konsumer",
    icon: "briefcase",
    description: {
      id: "Pembiayaan multiguna khusus yang disediakan bagi pegawai instansi Mahkamah Agung RI (Hakim dan tenaga ahli). Nikmati pembiayaan syariah dengan limit lebih tinggi, tenor fleksibel, serta potongan cicilan langsung dari payroll.",
      en: "Dedicated multi-purpose financing for Supreme Court of RI officials (Judges and technical staff). Enjoy sharia financing with higher credit limit, flexible tenor, and installments deducted directly from payroll.",
    },
    image: "/brochures/pembiayaan-mitraguna-hakim.jpeg",
    brochureUrl: null,
  },

  // ── Pembiayaan · Mikro ──
  {
    id: "mikro",
    title: "Brosur Mikro",
    category: "pembiayaan",
    subcategory: "mikro",
    icon: "trending",
    description: {
      id: "Pembiayaan mikro untuk pelaku usaha kecil dan menengah berbasis prinsip syariah. Tersedia produk Qardhul Hasan, mudharabah, dan musyarakah untuk modal kerja maupun investasi. Proses cepat, bunga kompetitif, serta pendampingan usaha.",
      en: "Micro financing for small and medium business owners based on sharia principles. Available products include Qardhul Hasan, mudharabah, and musyarakah for working capital and investment. Fast process, competitive rates, and business mentoring.",
    },
    image: "/brochures/pembiayaan-mikro.png",
    brochureUrl: null,
  },

  // ── Pendanaan ──
  {
    id: "pendanaan",
    title: "Brosur Pendanaan",
    category: "pendanaan",
    subcategory: null,
    icon: "save",
    description: {
      id: "Produk pendanaan dan simpanan syariah dari BSI meliputi tabungan, deposito, dan rekening koran. Nikmati bagi hasil kompetitif, bebas biaya administrasi, serta kemudahan transaksi melalui jaringan kantor dan digital banking BSI.",
      en: "BSI sharia funding and savings products including savings accounts, deposits, and current accounts. Enjoy competitive profit sharing, free administration fees, and easy transactions through BSI branch network and digital banking.",
    },
    image: "/brochures/pembiayaan-pendanaan.jpeg",
    brochureUrl: null,
  },

  // ── Cicil Emas & Gadai ──
  {
    id: "cicil-emas",
    title: "Brosur Cicil Emas",
    category: "emas",
    subcategory: null,
    icon: "award",
    description: {
      id: "Layanan cicil emas dari BSI dengan prinsip murabahah. Miliki emas batangan atau perhiasan dengan cicilan tetap setiap bulan tanpa uang muka. Tersedia pilihan emas 1 gram hingga 100 gram dengan tenor 3 hingga 12 bulan.",
      en: "BSI gold installment service with murabahah principle. Own gold bars or jewelry with fixed monthly installments without down payment. Available gold options from 1 gram to 100 grams with tenor from 3 to 12 months.",
    },
    image: "/brochures/pembiayaan-cicil-emas.png",
    brochureUrl: null,
  },
  {
    id: "gadai-emas",
    title: "Brosur Gadai Emas",
    category: "emas",
    subcategory: null,
    icon: "star",
    description: {
      id: "Gadai emas syariah (rahn) untuk mendapatkan dana tunai cepat dengan emas sebagai jaminan. Nikmati biaya administrasi rendah, proses cepat dan mudah, serta jaminan emas yang aman. Tersedia di seluruh kantor cabang BSI.",
      en: "Sharia gold pawn (rahn) for quick cash using your gold as collateral. Enjoy low administration fees, fast and easy process, and secure gold storage. Available at all BSI branch offices.",
    },
    image: "/brochures/pembiayaan-gadai-emas.png",
    brochureUrl: null,
  },
];

/** Helper: jumlah brosur pada sebuah kategori. */
export function countByCategory(categoryId) {
  return BROSUR.filter((b) => b.category === categoryId).length;
}

/** Helper: jumlah brosur pada sebuah subkategori. */
export function countBySubcategory(subcategoryId) {
  return BROSUR.filter((b) => b.subcategory === subcategoryId).length;
}
