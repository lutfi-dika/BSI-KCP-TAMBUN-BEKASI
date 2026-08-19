import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "category_id", label: "ID Kategori", type: "text" },
  { key: "category_title_id", label: "Judul Kategori (ID)", type: "text" },
  { key: "category_title_en", label: "Judul Kategori (EN)", type: "text" },
  { key: "category_slug", label: "Slug", type: "text" },
  { key: "item_name", label: "Nama Produk", type: "text" },
  { key: "item_description_id", label: "Deskripsi (ID)", type: "textarea" },
  { key: "item_description_en", label: "Deskripsi (EN)", type: "textarea" },
  { key: "item_benefits", label: "Benefits (JSON)", type: "textarea" },
  { key: "item_requirements", label: "Requirements (JSON)", type: "textarea" },
  { key: "item_link", label: "Link Eksternal", type: "text" },
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminServices() {
  return (
    <CrudTable
      endpoint="/admin/services"
      columns={COLUMNS}
      title="Layanan"
      description="Kelola produk dan layanan BSI"
      emptyText="Belum ada layanan"
    />
  );
}
