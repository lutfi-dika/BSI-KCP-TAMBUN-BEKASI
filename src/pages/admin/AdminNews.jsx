import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "title_id", label: "Judul (ID)", type: "text" },
  { key: "title_en", label: "Judul (EN)", type: "text" },
  { key: "category_id", label: "Kategori (ID)", type: "text" },
  { key: "category_en", label: "Kategori (EN)", type: "text" },
  { key: "date", label: "Tanggal", type: "date" },
  { key: "excerpt_id", label: "Ringkasan (ID)", type: "textarea" },
  { key: "excerpt_en", label: "Ringkasan (EN)", type: "textarea" },
  { key: "image_label_id", label: "Label Gambar (ID)", type: "text" },
  { key: "image_label_en", label: "Label Gambar (EN)", type: "text" },
  { key: "image_url", label: "URL Gambar", type: "text" },
];

export default function AdminNews() {
  return (
    <CrudTable
      endpoint="/admin/news"
      columns={COLUMNS}
      title="Berita"
      description="Kelola artikel berita dan pengumuman"
      emptyText="Belum ada berita"
    />
  );
}
