import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "parent_id", label: "Parent ID", type: "number" },
  { key: "role_id", label: "Role (ID)", type: "text" },
  { key: "role_en", label: "Role (EN)", type: "text" },
  { key: "sub_role_id", label: "Sub Role (ID)", type: "text" },
  { key: "sub_role_en", label: "Sub Role (EN)", type: "text" },
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminOrganization() {
  return (
    <CrudTable
      endpoint="/admin/organization"
      columns={COLUMNS}
      title="Organisasi"
      description="Kelola struktur organisasi kantor"
      emptyText="Belum ada data organisasi"
    />
  );
}
