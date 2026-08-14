// Produk unggulan yang ditampilkan di halaman depan.
// Detail lengkap ada di ./services.js — file ini subset untuk preview.
//
// REPLACE WITH VERIFIED OFFICIAL BSI PRODUCT INFORMATION
// Tagline/deskripsi di bawah bersifat placeholder untuk keperluan tampilan.
// Verifikasi nama & keterangan produk resmi via bankbsi.co.id sebelum deploy.
// Text fields use bilingual `{ id, en }` objects.

import { SERVICE_CATEGORIES } from "./services";

export const FEATURED_PRODUCTS = [
  {
    name: "BSI Tabungan Easy",
    tagline: { id: "Hemat biaya administrasi", en: "Save on admin fees" },
    category: { id: "Tabungan", en: "Savings" },
    href: "/services#tabungan",
    accent: "emerald",
  },
  {
    name: "BSI KUR Mikro",
    tagline: { id: "Modal usaha untuk UMKM", en: "Business capital for MSMEs" },
    category: { id: "Pembiayaan", en: "Financing" },
    href: "/services#pembiayaan",
    accent: "gold",
  },
  {
    name: "BSI Griya",
    tagline: { id: "Wujudkan rumah impian", en: "Realise your dream home" },
    category: { id: "Pembiayaan", en: "Financing" },
    href: "/services#pembiayaan",
    accent: "emerald",
  },
  {
    name: "BYOND by BSI",
    tagline: { id: "Banking dalam genggaman", en: "Banking at your fingertips" },
    category: { id: "Digital", en: "Digital" },
    href: "/services#digital",
    accent: "gold",
  },
  {
    name: "BSI Gadai",
    tagline: { id: "Dana cepat dengan emas", en: "Fast cash with gold" },
    category: { id: "Gadai Emas", en: "Gold Pawn" },
    href: "/services#pawning",
    accent: "emerald",
  },
  {
    name: "BSI Hasanah Card",
    tagline: { id: "Transaksi syariah non-tunai", en: "Cashless sharia transactions" },
    category: { id: "Kartu", en: "Cards" },
    href: "/services#kartu",
    accent: "gold",
  },
];

export default SERVICE_CATEGORIES;
