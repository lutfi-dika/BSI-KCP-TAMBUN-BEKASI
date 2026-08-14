// Banner promosi untuk KCP Tambun. Konten bersifat ajakan umum
// (bukan klaim promo nasional dengan angka/nominal spesifik) agar aman
// ditampilkan tanpa perlu verifikasi periode berlaku ke kantor pusat.
// Ganti dengan promo resmi cabang saat tersedia.
// Text fields use bilingual `{ id, en }` objects.

export const PROMOS = [
  {
    id: "weekend-banking",
    label: { id: "Layanan Akhir Pekan", en: "Weekend Service" },
    title: {
      id: "Weekend Banking di BSI KCP Tambun",
      en: "Weekend Banking at BSI KCP Tambun",
    },
    description: {
      id: "Tetap bisa bertransaksi dan konsultasi produk syariah di akhir pekan sesuai jadwal layanan kantor kami.",
      en: "Keep transacting and consulting on sharia products on weekends according to our office service schedule.",
    },
    cta: { id: "Lihat Jadwal", en: "See Schedule" },
    href: "/contact",
    accent: "emerald",
  },
  {
    id: "buka-rekening",
    label: { id: "Nasabah Baru", en: "New Customer" },
    title: {
      id: "Buka Rekening Tabungan Langsung di Kantor",
      en: "Open a Savings Account Directly at the Office",
    },
    description: {
      id: "Datang langsung ke KCP Tambun — tim kami bantu proses pembukaan rekening tabungan syariah dari awal sampai selesai.",
      en: "Come straight to KCP Tambun — our team will guide your sharia savings account opening from start to finish.",
    },
    cta: { id: "Kunjungi Kami", en: "Visit Us" },
    href: "/contact",
    accent: "gold",
  },
  {
    id: "pembiayaan-umkm",
    label: { id: "Pelaku Usaha", en: "Business Owners" },
    title: {
      id: "Konsultasi Pembiayaan untuk UMKM Tambun",
      en: "Financing Consultation for Tambun MSMEs",
    },
    description: {
      id: "Sedang mengembangkan usaha? Diskusikan kebutuhan pembiayaan syariah Anda bersama tim BSI KCP Tambun.",
      en: "Growing your business? Discuss your sharia financing needs with the BSI KCP Tambun team.",
    },
    cta: { id: "Konsultasi Sekarang", en: "Consult Now" },
    href: "/services#pembiayaan",
    accent: "emerald",
  },
  {
    id: "haji-umrah",
    label: { id: "Ibadah", en: "Pilgrimage" },
    title: {
      id: "Rencanakan Tabungan Haji & Umrah Anda",
      en: "Plan Your Hajj & Umrah Savings",
    },
    description: {
      id: "Mulai langkah menuju Tanah Suci dengan pendampingan perencanaan tabungan haji dan umrah di kantor kami.",
      en: "Take the first step toward the Holy Land with Hajj and Umrah savings planning assistance at our office.",
    },
    cta: { id: "Pelajari Lebih Lanjut", en: "Learn More" },
    href: "/services#tabungan",
    accent: "gold",
  },
];
