import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "title_id", label: "Judul (ID)", type: "text" },
  { key: "title_en", label: "Judul (EN)", type: "text" },
  { key: "caption_id", label: "Caption (ID)", type: "textarea" },
  { key: "caption_en", label: "Caption (EN)", type: "textarea" },
  { key: "category_id", label: "Kategori (ID)", type: "text" },
  { key: "category_en", label: "Kategori (EN)", type: "text" },
  { key: "accent", label: "Accent (Tailwind)", type: "text" },
  { key: "image", label: "Path Gambar", type: "text" },
  { key: "icon", label: "Icon", type: "text" },
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminGallery() {
  return (
    <CrudTable
      endpoint="/admin/gallery"
      columns={COLUMNS}
      title="Galeri"
      description="Kelola foto dan gambar galeri"
      emptyText="Belum ada foto"
    />
  );
}
