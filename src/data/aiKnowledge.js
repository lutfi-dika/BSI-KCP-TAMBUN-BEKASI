// Pengetahuan lokal untuk AI Chatbot BSI KCP Tambun.
// Digunakan oleh chatbot, rekomendasi produk, dan kalkulator pembiayaan.

import { SERVICE_CATEGORIES } from "./services";
import { FAQS } from "./faq";

// ── Keyword mappings untuk chatbot ──
export const KEYWORD_MAP = {
  greeting: {
    keywords: ["halo", "hai", "hello", "hi", "selamat", "pagi", "siang", "sore", "malam", "assalamualaikum"],
    responses: {
      id: "Wa'alaikumussalam! Selamat datang di BSI KCP Tambun Bekasi. Ada yang bisa saya bantu hari ini?",
      en: "Wa'alaikumussalam! Welcome to BSI KCP Tambun Bekasi. How can I help you today?",
    },
  },
  products: {
    keywords: ["produk", "layanan", "services", "products", "apa saja", "ada apa", "tawaran", "offer"],
    responses: {
      id: "BSI KCP Tambun menyediakan berbagai produk:\n\nTabungan: BSI Easy, Haji, Umroh, Junior, TabunganKu\nPembiayaan: KUR Mikro, Griya, Oto, Mitra\nKartu: BSI Hasanah Card\nLayanan Digital: BYOND, BSI Net Banking, BEWIZE\nGadai Emas\n\nMau tahu lebih detail tentang produk tertentu?",
      en: "BSI KCP Tambun offers various products:\n\nSavings: BSI Easy, Hajj, Umrah, Junior, TabunganKu\nFinancing: KUR Micro, Griya, Oto, Mitra\nCards: BSI Hasanah Card\nDigital: BYOND, BSI Net Banking, BEWIZE\nGold Pawn\n\nWant to know more about a specific product?",
    },
  },
  savings: {
    keywords: ["tabungan", "savings", "menabung", "simpanan", "rekening", "account"],
    responses: {
      id: "Produk tabungan BSI:\n\n1. BSI Easy Mudharabah - Bebas biaya administrasi, setoran awal ringan\n2. BSI Tabungan Haji - Untuk perencanaan ibadah haji\n3. BSI Tabungan Umroh - Untuk perencanaan umroh\n4. BSI Tabungan Junior - Tabungan untuk anak\n5. TabunganKu - Setoran awal mulai Rp20.000\n\nSemua tabungan dijamin LPS hingga Rp2 miliar. Mau tahu detail produk mana?",
      en: "BSI savings products:\n\n1. BSI Easy Mudharabah - No admin fees, low initial deposit\n2. BSI Hajj Savings - For Hajj pilgrimage planning\n3. BSI Umrah Savings - For Umrah planning\n4. BSI Junior Savings - Savings for children\n5. TabunganKu - Initial deposit from IDR 20,000\n\nAll savings are LPS-guaranteed up to IDR 2 billion. Want details on which product?",
    },
  },
  financing: {
    keywords: ["pembiayaan", "financing", "kredit", "loan", "pinjaman", "kpr", "kredit rumah", "kredit mobil"],
    responses: {
      id: "Produk pembiayaan BSI:\n\n1. BSI KUR Mikro - Modal usaha UMKM, plafon hingga Rp100 juta\n2. BSI Griya - KPR rumah, DP mulai 0%\n3. BSI Oto - Kredit mobil/motor, tenor 1-7 tahun\n4. BSI Mitra - Modal kerja UMKM, hingga Rp25 miliar\n\nSemua pembiayaan menggunakan prinsip syariah tanpa riba. Mau tahu detail produk mana?",
      en: "BSI financing products:\n\n1. BSI KUR Micro - MSME business capital, up to IDR 100 million\n2. BSI Griya - Home financing, 0% down payment\n3. BSI Oto - Car/motorcycle financing, 1-7 year tenor\n4. BSI Mitra - Working capital, up to IDR 25 billion\n\nAll financing uses sharia principles without riba. Want details on which product?",
    },
  },
  gold: {
    keywords: ["emas", "gold", "gadai", "pawn", "cicil emas", "investasi emas"],
    responses: {
      id: "Layanan emas BSI:\n\n1. BSI Gadai Emas - Dana tunai cepat dengan jaminan emas, taksiran hingga 95%\n2. Cicil Emas - Miliki emas dengan cicilan tetap\n\nEmas diterima: batangan, koin dinar, perhiasan (minimal 16 karat). Biaya penyimpanan ringan. Mau tahu lebih lanjut?",
      en: "BSI gold services:\n\n1. BSI Gold Pawn - Quick cash with gold collateral, up to 95% valuation\n2. Gold Installment - Own gold with fixed installments\n\nAccepted gold: bars, dinar coins, jewelry (min 16 karats). Low storage fees. Want to know more?",
    },
  },
  digital: {
    keywords: ["digital", "online", "mobile", "aplikasi", "app", "byond", "internet banking", "e-banking"],
    responses: {
      id: "Layanan digital BSI:\n\n1. BYOND by BSI - Superapp mobile banking (transfer, QRIS, bayar tagihan, buka rekening online)\n2. BSI Net Banking - Internet banking untuk PC/laptop\n3. BEWIZE - Aplikasi untuk pelaku usaha\n\nSemua layanan tersedia 24 jam. Mau tahu detail layanan mana?",
      en: "BSI digital services:\n\n1. BYOND by BSI - Mobile banking superapp (transfers, QRIS, bill payments, online account opening)\n2. BSI Net Banking - Internet banking for PC/laptop\n3. BEWIZE - App for business owners\n\nAll services available 24/7. Want details on which service?",
    },
  },
  card: {
    keywords: ["kartu", "card", "kredit", "credit card", "hasanah"],
    responses: {
      id: "BSI Hasanah Card adalah kartu kredit berbasis syariah:\n\n- Tanpa bunga & bebas denda\n- Cicilan 0% hingga 12 bulan\n- Jaringan MasterCard global\n- Hanya merchant halal\n- Tersedia varian Gold & Platinum\n\nPenghasilan minimal Rp3 juta/bulan. Mau tahu cara pengajuannya?",
      en: "BSI Hasanah Card is a sharia credit card:\n\n- No interest & no penalties\n- 0% installments up to 12 months\n- Global MasterCard network\n- Halal merchants only\n- Gold & Platinum variants\n\nMinimum monthly income IDR 3 million. Want to know the application process?",
    },
  },
  hours: {
    keywords: ["jam", "hours", "buka", "open", "operasional", "jam berapa", "kapan buka", "jadwal"],
    responses: {
      id: "Jam operasional BSI KCP Tambun:\n\nSenin-Kamis: 08.00 - 16.00 WIB\nJumat: 07.30 - 16.00 WIB\n\nBSI Call 14040 tersedia 24 jam.",
      en: "BSI KCP Tambun operating hours:\n\nMonday-Thursday: 08:00 - 16:00 WIB\nFriday: 07:30 - 16:00 WIB\n\nBSI Call 14040 available 24 hours.",
    },
  },
  contact: {
    keywords: ["kontak", "contact", "telepon", "phone", "alamat", "address", "lokasi", "location", "dimana", "where"],
    responses: {
      id: "Hubungi BSI KCP Tambun:\n\nBSI Call: 14040 (24 jam, bebas pulsa)\nWhatsApp: 0811-1800-9497\nEmail: bsi.tambun@bankbsi.co.id\n\nAlamat: Jl. Jend. Ahmad Yani No.19, Tambun, Bekasi\nGoogle Maps tersedia di halaman Kontak.",
      en: "Contact BSI KCP Tambun:\n\nBSI Call: 14040 (24 hours, toll-free)\nWhatsApp: 0811-1800-9497\nEmail: bsi.tambun@bankbsi.co.id\n\nAddress: Jl. Jend. Ahmad Yani No.19, Tambun, Bekasi\nGoogle Maps available on the Contact page.",
    },
  },
  lps: {
    keywords: ["lps", "jaminan", "guarantee", "aman", "safe", "simpanan aman"],
    responses: {
      id: "Ya, simpanan di BSI dijamin oleh Lembaga Penjamin Simpanan (LPS) hingga Rp2 miliar per nasabah per bank. BSI juga berizin dan diawasi oleh OJK serta Bank Indonesia.",
      en: "Yes, deposits at BSI are guaranteed by the Deposit Insurance Corporation (LPS) up to IDR 2 billion per customer per bank. BSI is also licensed and supervised by OJK and Bank Indonesia.",
    },
  },
  riba: {
    keywords: ["riba", "interest", "bunga", "syariah", "haram", "halal"],
    responses: {
      id: "BSI beroperasi 100% sesuai prinsip syariah tanpa riba. Penghasilan bank berasal dari margin (murabahah), bagi hasil (mudharabah/musyarakah), dan biaya jasa (ijarah), bukan dari bunga.",
      en: "BSI operates 100% on sharia principles without riba. Bank income comes from margins (murabahah), profit sharing (mudharabah/musyarakah), and service fees (ijarah), not from interest.",
    },
  },
  simulation: {
    keywords: ["simulasi", "simulation", "kalkulator", "calculator", "cicilan", "installment", "angsuran", "berapa", "hitung", "calculate"],
    responses: {
      id: "Gunakan Kalkulator Simulasi Pembiayaan kami untuk menghitung estimasi cicilan, margin, dan tenor. Klik tombol 'Kalkulator' di bawah!",
      en: "Use our Financing Simulation Calculator to estimate installments, margins, and tenor. Click the 'Calculator' button below!",
    },
  },
  recommendation: {
    keywords: ["rekomendasi", "recommendation", "saran", "suggestion", "cocok", "suitable", "pilih", "choose", "mau yang", "butuh yang"],
    responses: {
      id: "Coba fitur Rekomendasi Produk kami! Jawab beberapa pertanyaan singkat dan kami akan bantu temukan produk BSI yang paling sesuai dengan kebutuhan Anda.",
      en: "Try our Product Recommendation feature! Answer a few quick questions and we'll help you find the BSI product that best suits your needs.",
    },
  },
};

// ── Rekomendasi produk berdasarkan profil ──
export const PRODUCT_RECOMMENDATIONS = [
  {
    profile: "karyawan",
    keywords: ["karyawan", "pegawai", "employee", "gaji", "salary", "kerja", "work", "kerja kantoran", "office"],
    recommended: [
      { name: "BSI Easy Mudharabah", reason: { id: "Tabungan tanpa biaya administrasi untuk transaksi harian", en: "Fee-free savings for daily transactions" } },
      { name: "BSI Hasanah Card", reason: { id: "Kartu kredit syariah untuk pengeluaran rutin", en: "Sharia credit card for regular expenses" } },
      { name: "BYOND by BSI", reason: { id: "Mobile banking untuk transfer dan pembayaran", en: "Mobile banking for transfers and payments" } },
    ],
  },
  {
    profile: "umkm",
    keywords: ["umkm", "usaha", "bisnis", "business", "dagang", "jual", "toko", "warung", "pedagang", "entrepreneur"],
    recommended: [
      { name: "BSI KUR Mikro", reason: { id: "Modal usaha dengan margin rendah hingga Rp100 juta", en: "Business capital with low margin up to IDR 100 million" } },
      { name: "BSI Mitra", reason: { id: "Modal kerja fleksibel hingga Rp25 miliar", en: "Flexible working capital up to IDR 25 billion" } },
      { name: "BEWIZE", reason: { id: "Aplikasi pengelolaan keuangan bisnis", en: "Business financial management app" } },
    ],
  },
  {
    profile: "keluarga",
    keywords: ["keluarga", "family", "rumah tangga", "household", "nikah", "married", "anak", "children"],
    recommended: [
      { name: "BSI Griya", reason: { id: "KPR rumah dengan DP mulai 0%", en: "Home financing with 0% down payment" } },
      { name: "BSI Tabungan Junior", reason: { id: "Tabungan edukasi untuk anak", en: "Educational savings for children" } },
      { name: "BSI Tabungan Haji", reason: { id: "Perencanaan ibadah haji keluarga", en: "Family Hajj pilgrimage planning" } },
    ],
  },
  {
    profile: "pensiunan",
    keywords: ["pensiun", "retiree", "pension", "lansia", "senior"],
    recommended: [
      { name: "BSI Easy Mudharabah", reason: { id: "Tabungan bebas biaya administrasi", en: "Fee-free savings account" } },
      { name: "BSI Gadai Emas", reason: { id: "Dana tunai cepat dari emas", en: "Quick cash from gold" } },
      { name: "TabunganKu", reason: { id: "Tabungan sederhana setoran ringan", en: "Simple savings with low deposits" } },
    ],
  },
  {
    profile: "generasi_muda",
    keywords: ["muda", "young", "mahasiswa", "student", "kuliah", "college", "anak muda", "gen z", "millennial", "gen-z"],
    recommended: [
      { name: "BSI Tabungan Junior", reason: { id: "Mulai menabung sejak dini", en: "Start saving early" } },
      { name: "BYOND by BSI", reason: { id: "Mobile banking lengkap dan mudah", en: "Complete and easy mobile banking" } },
      { name: "BSI Griya SiMuda", reason: { id: "KPR khusus milenial untuk rumah pertama", en: "Home financing for millennials' first home" } },
    ],
  },
  {
    profile: "investor",
    keywords: ["investasi", "investment", "invest", "emas", "gold", "menabung emas", "saving gold"],
    recommended: [
      { name: "Cicil Emas BSI", reason: { id: "Miliki emas dengan cicilan tetap", en: "Own gold with fixed installments" } },
      { name: "BSI Gadai Emas", reason: { id: "Dana tunai dari emas yang dimiliki", en: "Cash from your existing gold" } },
      { name: "BYOND by BSI", reason: { id: "Fitur investasi & cicil emas di aplikasi", en: "Gold investment & installment in the app" } },
    ],
  },
];

// ── Informasi kontak ──
export const CONTACT_INFO = {
  phone: "14040",
  whatsapp: "0811-1800-9497",
  email: "bsi.tambun@bankbsi.co.id",
  address: "Jl. Jend. Ahmad Yani No.19, Tambun, Bekasi",
  hours: {
    id: "Senin-Kamis: 08.00-16.00 WIB, Jumat: 07.30-16.00 WIB",
    en: "Monday-Thursday: 08:00-16:00 WIB, Friday: 07:30-16:00 WIB",
  },
};

// ── Fungsi untuk mencari jawaban dari FAQ ──
export function searchFAQ(query, lang = "id") {
  const q = query.toLowerCase();
  return FAQS.find((faq) => {
    const question = faq.question[lang]?.toLowerCase() || "";
    return question.includes(q) || q.includes(question.slice(0, 10));
  });
}

// ── Fungsi untuk mencari produk berdasarkan keyword ──
export function searchProducts(query, lang = "id") {
  const q = query.toLowerCase();
  const results = [];
  
  for (const cat of SERVICE_CATEGORIES) {
    for (const item of cat.items) {
      const name = item.name.toLowerCase();
      const desc = item.description[lang]?.toLowerCase() || "";
      if (name.includes(q) || q.includes(name) || desc.includes(q)) {
        results.push({
          name: item.name,
          category: cat.title[lang],
          description: item.description,
          link: item.link,
        });
      }
    }
  }
  
  return results;
}

// ── Fungsi untuk mendapatkan rekomendasi produk ──
export function getRecommendations(profile) {
  const q = profile.toLowerCase();
  
  for (const rec of PRODUCT_RECOMMENDATIONS) {
    if (rec.keywords.some((kw) => q.includes(kw))) {
      return rec.recommended;
    }
  }
  
  return null;
}

// ── Fungsi untuk menghitung simulasi pembiayaan murabahah ──
export function calculateMurabahah(harga, dp = 0, marginRate, tenorBulan) {
  const pokokPembiayaan = harga - dp;
  const totalMargin = pokokPembiayaan * (marginRate / 100) * (tenorBulan / 12);
  const totalPembiayaan = pokokPembiayaan + totalMargin;
  const angsuranPerBulan = totalPembiayaan / tenorBulan;
  
  return {
    harga,
    dp,
    pokokPembiayaan,
    marginRate,
    tenorBulan,
    totalMargin,
    totalPembiayaan,
    angsuranPerBulan: Math.ceil(angsuranPerBulan),
  };
}

// ── Fungsi untuk menghitung simulasi pembiayaan musyarakah ──
export function calculateMusyarakah(harga, pihak1 = 50, pihak2 = 50, marginRate, tenorBulan) {
  const bagianBSI = harga * (pihak1 / 100);
  const bagianNasabah = harga * (pihak2 / 100);
  const totalMargin = harga * (marginRate / 100) * (tenorBulan / 12);
  const totalPembiayaan = harga + totalMargin;
  const angsuranPerBulan = totalPembiayaan / tenorBulan;
  
  return {
    harga,
    pihak1,
    pihak2,
    bagianBSI,
    bagianNasabah,
    marginRate,
    tenorBulan,
    totalMargin,
    totalPembiayaan,
    angsuranPerBulan: Math.ceil(angsuranPerBulan),
  };
}
