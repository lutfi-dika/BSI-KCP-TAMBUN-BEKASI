import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "item_id", label: "ID", type: "text" },
  { key: "label_id", label: "Label (ID)", type: "text" },
  { key: "label_en", label: "Label (EN)", type: "text" },
  { key: "title_id", label: "Judul (ID)", type: "text" },
  { key: "title_en", label: "Judul (EN)", type: "text" },
  { key: "description_id", label: "Deskripsi (ID)", type: "textarea" },
  { key: "description_en", label: "Deskripsi (EN)", type: "textarea" },
  { key: "cta_id", label: "CTA (ID)", type: "text" },
  { key: "cta_en", label: "CTA (EN)", type: "text" },
  { key: "href", label: "Link", type: "text" },
  { key: "accent", label: "Accent", type: "select", options: [
    { value: "emerald", label: "Emerald" },
    { value: "gold", label: "Gold" },
  ]},
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminPromos() {
  return (
    <CrudTable
      endpoint="/admin/promos"
      columns={COLUMNS}
      title="Promo"
      description="Kelola banner promosi"
      emptyText="Belum ada promo"
    />
  );
}
