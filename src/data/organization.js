// Struktur organisasi BSI KCP Tambun (Kantor Cabang Pembantu).
// Struktur umum mengikuti standar KCP Bank Syariah Indonesia.
// Ganti nama/posisi dengan data resmi cabang sebelum deploy.
// Text fields use bilingual `{ id, en }` objects.

export const BRANCH_STRUCTURE = {
  role: { id: "Kepala Kantor Cabang BSI KCP BEKASI TAMBUN", en: "Head of BSI Branch Office (KCP) Bekasi Tambun" },
  subRole: { id: "Kepala KCP", en: "Sub-Branch Manager" },
  children: [
    {
      role: { id: "Service Manager", en: "Service Manager" },
      children: [
        { role: { id: "Customer Service", en: "Customer Service" }, children: [] },
        { role: { id: "Teller", en: "Teller" }, children: [] },
      ],
    },
    {
      role: { id: "Mantri / Marketing", en: "Marketing / Account Officer" },
      children: [
        { role: { id: "Mantri Pembiayaan", en: "Financing Officer" }, children: [] },
        { role: { id: "Mantri Funding", en: "Funding Officer" }, children: [] },
      ],
    },
    {
      role: { id: "Back Office & Operasional", en: "Back Office & Operations" },
      children: [
        { role: { id: "Operator", en: "Operator" }, children: [] },
      ],
    },
    {
      role: { id: "Layanan Pendukung", en: "Support Services" },
      children: [
        { role: { id: "Security", en: "Security" }, children: [] },
        { role: { id: "Driver", en: "Driver" }, children: [] },
        { role: { id: "Office Boy", en: "Office Boy" }, children: [] },
      ],
    },
  ],
};
