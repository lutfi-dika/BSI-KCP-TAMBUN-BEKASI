// Galeri kegiatan BSI KCP Tambun.
// Koleksi ini menggunakan placeholder visual — ganti dengan foto resmi
// kantor/kegiatan sebelum deploy (mis. tambahkan field `image` berisi URL).
// Text fields use bilingual `{ id, en }` objects.

export const GALLERY = [
  {
    id: 1,
    title: { id: "Kantor BSI KCP Tambun", en: "BSI KCP Tambun Office" },
    caption: {
      id: "Tampak depan kantor cabang pembantu BSI Tambun",
      en: "The front view of the BSI Tambun sub-branch office",
    },
    category: { id: "Kantor", en: "Office" },
    accent: "from-[#00847D] to-[#063F3B]",
    image: "/gallery/kantor.webp",
    icon: "building",
  },
  {
    id: 2,
    title: { id: "Layanan Customer Service", en: "Customer Service" },
    caption: {
      id: "Tim layanan siap membantu kebutuhan perbankan Anda",
      en: "Our service team is ready to help with your banking needs",
    },
    category: { id: "Layanan", en: "Services" },
    accent: "from-[#00665F] to-[#00847D]",
    icon: "headset",
    image: "/gallery/layanan-cs.webp",
  },
  {
    id: 3,
    title: { id: "Pembukaan Rekening Online", en: "Online Account Opening" },
    caption: {
      id: "Buka rekening mudah melalui aplikasi BYOND",
      en: "Open an account easily through the BYOND app",
    },
    category: { id: "Digital", en: "Digital" },
    accent: "from-[#00847D] to-[#F2A93C]",
    icon: "smartphone",
    image: "/gallery/Pembukaan Rekening Online.png",
  },
  {
    id: 4,
    title: { id: "Ramadhan & Berbagi", en: "Ramadan & Sharing" },
    caption: {
      id: "Kegiatan sosial dan berbagi bersama masyarakat",
      en: "Social and sharing activities with the community",
    },
    category: { id: "Kegiatan", en: "Activities" },
    accent: "from-[#0A2B27] to-[#00847D]",
    icon: "handshake",
    image: "/gallery/ramadan-NEW-icon-746-×-560-e1740130488272.webp",
  },
  {
    id: 5,
    title: { id: "Area Teller", en: "Teller Area" },
    caption: {
      id: "Transaksi tunai dan setoran yang aman & nyaman",
      en: "Safe and comfortable cash and deposit transactions",
    },
    category: { id: "Kantor", en: "Office" },
    accent: "from-[#00847D] to-[#00665F]",
    icon: "bank",
    image: "/gallery/area-teller.webp",
  },
];
