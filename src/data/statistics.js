// Statistik faktual yang dapat diverifikasi dari kanal resmi Bank Syariah
// Indonesia (bankbsi.co.id & BSI Call 14040). Tidak ada angka klaim cabang.
// Text fields use bilingual `{ id, en }` objects.

export const STATISTICS = [
  {
    label: { id: "Produk & Layanan", en: "Products & Services" },
    value: "100%",
    suffix: { id: "Syariah", en: "Sharia" },
    icon: "bank",
  },
  {
    label: { id: "Berizin & Diawasi", en: "Licensed & Supervised" },
    value: "OJK",
    suffix: { id: "+ Bank Indonesia", en: "+ Bank Indonesia" },
    icon: "shield",
  },
  {
    label: { id: "Simpanan Nasabah", en: "Customer Deposits" },
    value: { id: "Dijamin", en: "Guaranteed" },
    suffix: "LPS",
    icon: "users",
  },
  {
    label: { id: "Layanan Nasabah", en: "Customer Service" },
    value: "14040",
    suffix: { id: "24 Jam", en: "24 Hours" },
    icon: "atm",
  },
];
