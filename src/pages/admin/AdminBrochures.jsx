import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "item_id", label: "ID", type: "text" },
  { key: "title", label: "Judul", type: "text" },
  { key: "category", label: "Kategori", type: "select", options: [
    { value: "pembiayaan", label: "Pembiayaan" },
    { value: "pendanaan", label: "Pendanaan" },
    { value: "emas", label: "Emas" },
  ]},
  { key: "subcategory", label: "Sub Kategori", type: "select", options: [
    { value: "", label: "-" },
    { value: "konsumer", label: "Konsumer" },
    { value: "mikro", label: "Mikro" },
  ]},
  { key: "description_id", label: "Deskripsi (ID)", type: "textarea" },
  { key: "description_en", label: "Deskripsi (EN)", type: "textarea" },
  { key: "image", label: "Path Gambar", type: "text" },
  { key: "brochure_url", label: "URL Brosur (PDF)", type: "text" },
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminBrochures() {
  return (
    <CrudTable
      endpoint="/admin/brochures"
      columns={COLUMNS}
      title="Brosur"
      description="Kelola brosur produk dan layanan"
      emptyText="Belum ada brosur"
    />
  );
}
