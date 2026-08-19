import CrudTable from "../../components/admin/CrudTable.jsx";

const COLUMNS = [
  { key: "question_id", label: "Pertanyaan (ID)", type: "textarea" },
  { key: "question_en", label: "Pertanyaan (EN)", type: "textarea" },
  { key: "answer_id", label: "Jawaban (ID)", type: "textarea" },
  { key: "answer_en", label: "Jawaban (EN)", type: "textarea" },
  { key: "sort_order", label: "Urutan", type: "number" },
];

export default function AdminFAQ() {
  return (
    <CrudTable
      endpoint="/admin/faqs"
      columns={COLUMNS}
      title="FAQ"
      description="Kelola pertanyaan yang sering diajukan"
      emptyText="Belum ada FAQ"
    />
  );
}
