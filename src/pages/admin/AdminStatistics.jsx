import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "label_id", label: "Label (ID)", type: "text" },
  { key: "label_en", label: "Label (EN)", type: "text" },
  { key: "value", label: "Nilai", type: "text" },
  { key: "suffix_id", label: "Suffix (ID)", type: "text" },
  { key: "suffix_en", label: "Suffix (EN)", type: "text" },
  { key: "icon", label: "Icon", type: "text" },
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminStatistics() {
  return (
    <CrudTable
      endpoint="/admin/statistics"
      columns={COLUMNS}
      title="Statistik"
      description="Kelola angka statistik KPI"
      emptyText="Belum ada statistik"
    />
  );
}
