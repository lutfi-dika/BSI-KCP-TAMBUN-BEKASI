// Produk & layanan BSI yang tersedia di KCP Tambun.
// Data mengacu pada produk resmi Bank Syariah Indonesia.
// Text fields use bilingual `{ id, en }` objects.
// `link` menunjuk ke halaman resmi di situs Bank BSI.

export const SERVICE_CATEGORIES = [
  {
    id: "tabungan",
    title: { id: "Tabungan & Pendanaan", en: "Savings & Funding" },
    slug: "tabungan",
    description: {
      id: "Solusi simpanan syariah dengan prinsip Wadiah & Mudharabah untuk menunjang kebutuhan finansial Anda.",
      en: "Sharia savings solutions based on Wadiah & Mudharabah principles to support your financial needs.",
    },
    icon: "wallet",
    items: [
      {
        name: "BSI Tabungan Easy Mudharabah",
        description: {
          id: "Tabungan transaksional tanpa biaya administrasi bulanan.",
          en: "Transactional savings with no monthly administration fees.",
        },
        overview: [
          {
            id: "BSI Tabungan Easy Mudharabah adalah tabungan transaksional perorangan dengan akad Mudharabah Muthlaqah, yaitu seluruh dana nasabah dikelola oleh bank dan nasabah memperoleh bagi hasil sesuai nisbah yang disepakati. Produk ini dirancang untuk kebutuhan transaksi harian, sehingga penyetoran dan penarikan dana dapat dilakukan kapan saja selama jam layanan atau melalui jaringan ATM BSI di seluruh Indonesia.",
            en: "BSI Tabungan Easy Mudharabah is an individual transactional savings product under a Mudharabah Muthlaqah contract, where customer funds are managed by the bank and customers receive profit sharing according to the agreed ratio. It is designed for daily transactions, allowing deposits and withdrawals anytime during banking hours or through the BSI ATM network nationwide.",
          },
          {
            id: "Keunggulan utamanya adalah bebas biaya administrasi bulanan sehingga saldo tidak tergerus, setoran awal yang ringan, serta dilengkapi BSI Debit, buku tabungan, dan akses penuh ke seluruh kanal digital BSI seperti BYOND by BSI, BSI Net Banking, dan ATM. Simpanan juga dijamin oleh Lembaga Penjamin Simpanan (LPS) hingga Rp2 miliar.",
            en: "Its main advantages are no monthly administration fees so your balance is never eroded, a low initial deposit, and it comes with BSI Debit, a passbook, and full access to all BSI digital channels such as BYOND by BSI, BSI Net Banking, and ATMs. Deposits are guaranteed by the Indonesian Deposit Insurance Corporation (LPS) up to IDR 2 billion.",
          },
        ],
        benefits: [
          { id: "Bebas biaya administrasi bulanan", en: "No monthly administration fees" },
          { id: "Bagi hasil kompetitif dengan akad Mudharabah Muthlaqah", en: "Competitive profit sharing under Mudharabah Muthlaqah" },
          { id: "Setoran awal ringan", en: "Low initial deposit" },
          { id: "Dilengkapi BSI Debit, buku tabungan, dan e-channel", en: "Comes with BSI Debit, passbook, and e-channels" },
          { id: "Setoran & penarikan fleksibel (teller/ATM/kanal digital)", en: "Flexible deposits & withdrawals (teller/ATM/digital)" },
          { id: "Simpanan dijamin LPS hingga Rp2 miliar", en: "LPS-guaranteed up to IDR 2 billion" },
        ],
        requirements: [
          { id: "WNI, perseorangan, dan cakap hukum", en: "Indonesian citizen, individual, and legally competent" },
          { id: "KTP elektronik atau identitas lain yang berlaku", en: "Electronic ID card or other valid ID" },
          { id: "NPWP (jika ada)", en: "Tax ID (if applicable)" },
          { id: "Mengisi formulir pembukaan rekening di kantor cabang", en: "Fill out the account opening form at a branch" },
          { id: "Menyetorkan setoran awal sesuai ketentuan", en: "Make the initial deposit as required" },
        ],
        process: [
          { id: "Datang ke kantor cabang BSI terdekat atau lakukan reservasi online", en: "Visit the nearest BSI branch or make an online reservation" },
          { id: "Isi dan tandatangani formulir pembukaan rekening", en: "Fill out and sign the account opening form" },
          { id: "Setorkan setoran awal dan verifikasi data oleh petugas", en: "Deposit the initial amount and verify your data with the officer" },
          { id: "Rekening aktif; terima buku tabungan dan kartu BSI Debit", en: "Account activated; receive your passbook and BSI Debit card" },
        ],
        features: [
          { id: "Tanpa administrasi bulanan", en: "No monthly admin fee" },
          { id: "Bagi hasil kompetitif", en: "Competitive profit sharing" },
          { id: "Setoran awal ringan", en: "Low initial deposit" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/bsi-tabungan-easy-mudharabah",
      },
      {
        name: "BSI Tabungan Haji Indonesia",
        description: {
          id: "Tabungan perencanaan ibadah haji sesuai prinsip syariah.",
          en: "Savings for planning your Hajj pilgrimage in line with sharia principles.",
        },
        overview: [
          {
            id: "BSI Tabungan Haji Indonesia adalah tabungan khusus untuk mewujudkan rencana ibadah haji dalam mata uang Rupiah maupun Dolar AS dengan akad Mudharabah. Produk ini terhubung langsung dengan sistem SISKOHAT Kementerian Agama, sehingga saldo yang terkumpul dapat digunakan untuk setoran awal biaya penyelenggaraan ibadah haji dan memperoleh nomor porsi haji resmi.",
            en: "BSI Tabungan Haji Indonesia is a dedicated savings product to realize your Hajj plan in both Rupiah and US Dollars under a Mudharabah contract. It is directly connected to the Ministry of Religious Affairs' SISKOHAT system, allowing the accumulated balance to be used for the initial Hajj payment and to obtain an official Hajj queue number.",
          },
          {
            id: "Produk ini bebas biaya administrasi bulanan, setoran awal mulai Rp100.000 atau USD 50, dapat dibuka untuk semua usia mulai dari 0 tahun, serta dilengkapi BSI Debit Mabrur yang dapat digunakan hingga di Tanah Suci. Pendaftaran porsi hingga pelunasan biaya haji dapat dilakukan melalui kantor cabang maupun aplikasi BYOND by BSI.",
            en: "The product is free of monthly administration fees, requires an initial deposit starting from IDR 100,000 or USD 50, can be opened for all ages from 0 years old, and comes with the BSI Debit Mabrur usable even in the Holy Land. Hajj registration up to the final payment can be done through branches or the BYOND by BSI app.",
          },
        ],
        benefits: [
          { id: "Mendapatkan nomor porsi haji resmi (SISKOHAT)", en: "Get an official Hajj queue number (SISKOHAT)" },
          { id: "Bebas biaya administrasi bulanan", en: "No monthly administration fees" },
          { id: "Setoran awal ringan: Rp100.000 (IDR) atau USD 50", en: "Low initial deposit: IDR 100,000 or USD 50" },
          { id: "Bisa dibuka sejak usia 0 tahun", en: "Can be opened from age 0" },
          { id: "BSI Debit Mabrur untuk transaksi di Tanah Suci", en: "BSI Debit Mabrur for transactions in the Holy Land" },
          { id: "Daftar porsi & pelunasan via cabang atau BYOND by BSI", en: "Register and pay via branches or BYOND by BSI" },
        ],
        requirements: [
          { id: "KTP elektronik", en: "Electronic ID card" },
          { id: "Kartu Keluarga (KK)", en: "Family card (KK)" },
          { id: "NPWP (jika ada)", en: "Tax ID (if applicable)" },
          { id: "Mengisi formulir pembukaan rekening tabungan haji", en: "Fill out the Hajj savings account opening form" },
          { id: "Setoran awal minimal sesuai ketentuan", en: "Minimum initial deposit as required" },
        ],
        process: [
          { id: "Buka rekening BSI Tabungan Haji Indonesia di cabang BSI", en: "Open the Hajj savings account at a BSI branch" },
          { id: "Menabung hingga mencapai setoran awal haji yang ditetapkan pemerintah", en: "Save until you reach the government's initial Hajj deposit" },
          { id: "Daftarkan porsi via cabang, BSI Call 14040, atau BYOND (input ke SISKOHAT)", en: "Register via branch, BSI Call 14040, or BYOND (submitted to SISKOHAT)" },
          { id: "Terima nomor porsi sebagai bukti antrean keberangkatan haji", en: "Receive the queue number as proof of your Hajj waiting list" },
        ],
        features: [
          { id: "Estimasi rencana haji", en: "Hajj plan estimation" },
          { id: "Bimbingan pendaftaran haji", en: "Hajj registration guidance" },
          { id: "Setoran fleksibel", en: "Flexible deposits" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/bsi-tabungan-haji-indonesia",
      },
      {
        name: "BSI Tabungan Umroh",
        description: {
          id: "Tabungan khusus perencanaan ibadah umroh.",
          en: "Savings dedicated to planning your Umrah pilgrimage.",
        },
        overview: [
          {
            id: "BSI Tabungan Umroh adalah tabungan transaksional dalam mata uang Rupiah dan Dolar AS yang membantu nasabah merencanakan ibadah umroh secara terarah, sekaligus tetap dapat bertransaksi harian dalam satu rekening. Akad yang digunakan adalah Wadiah Yad Dhamanah, sehingga dana nasabah dijaga aman dan dapat ditarik sewaktu-waktu.",
            en: "BSI Tabungan Umroh is a transactional savings account in Rupiah and US Dollars that helps customers plan their Umrah pilgrimage in a structured way, while still allowing daily transactions in a single account. It uses a Wadiah Yad Dhamanah contract, keeping your funds safe and withdrawable at any time.",
          },
          {
            id: "Produk ini bebas biaya administrasi bulanan, setoran awal mulai Rp100.000 atau USD 10, dapat dibuka sejak usia 0 tahun, serta dilengkapi BSI Debit Mabrur. Nasabah juga dapat membeli paket umroh dari mitra resmi BSI melalui kantor cabang atau ekosistem umroh di aplikasi BYOND by BSI.",
            en: "This product has no monthly administration fees, an initial deposit starting from IDR 100,000 or USD 10, can be opened from age 0, and comes with BSI Debit Mabrur. Customers can also purchase Umrah packages from BSI's official partners through branches or the Umrah ecosystem in the BYOND by BSI app.",
          },
        ],
        benefits: [
          { id: "Satu rekening untuk tabungan & transaksi harian", en: "One account for savings & daily transactions" },
          { id: "Bebas biaya administrasi bulanan", en: "No monthly administration fees" },
          { id: "Setoran awal ringan: Rp100.000 (IDR) atau USD 10", en: "Low initial deposit: IDR 100,000 or USD 10" },
          { id: "Bisa dibuka sejak usia 0 tahun", en: "Can be opened from age 0" },
          { id: "BSI Debit Mabrur untuk transaksi di Tanah Suci", en: "BSI Debit Mabrur for transactions in the Holy Land" },
          { id: "Beli paket umroh dari mitra resmi BSI", en: "Buy Umrah packages from BSI official partners" },
        ],
        requirements: [
          { id: "Perorangan WNI (usia ≥17 tahun)", en: "Indonesian individual (17+) or parent/guardian for minors" },
          { id: "KTP elektronik (atau KTP orang tua/wali untuk anak di bawah umur)", en: "Electronic ID (or parent/guardian ID for minors)" },
          { id: "NPWP (jika ada)", en: "Tax ID (if applicable)" },
          { id: "Mengisi formulir pembukaan rekening", en: "Fill out the account opening form" },
          { id: "Setoran awal sesuai ketentuan", en: "Initial deposit as required" },
        ],
        process: [
          { id: "Datang ke kantor cabang BSI atau buka rekening melalui kanal resmi", en: "Visit a BSI branch or open an account through official channels" },
          { id: "Isi formulir pembukaan rekening dan lakukan setoran awal", en: "Fill out the form and make the initial deposit" },
          { id: "Terima buku tabungan dan BSI Debit Mabrur", en: "Receive your passbook and BSI Debit Mabrur" },
          { id: "Rencanakan & beli paket umroh melalui ekosistem mitra BSI", en: "Plan & purchase an Umrah package through the BSI partner ecosystem" },
        ],
        features: [
          { id: "Perencanaan umroh", en: "Umrah planning" },
          { id: "Fasilitas pembiayaan", en: "Financing facility" },
          { id: "Dikelola sesuai syariah", en: "Managed per sharia" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/bsi-tabungan-umrah",
      },
      {
        name: "BSI Tabungan Junior",
        description: {
          id: "Tabungan syariah untuk anak sebagai awal edukasi keuangan.",
          en: "Sharia savings for children as an introduction to financial literacy.",
        },
        overview: [
          {
            id: "BSI Tabungan Junior adalah tabungan syariah untuk anak-anak di bawah usia 17 tahun yang bertujuan menumbuhkan budaya menabung sejak dini. Setiap transaksi memberikan edukasi pengelolaan keuangan yang menyenangkan, dengan nama anak tercantum pada buku tabungan dan BSI Debit SABI Card yang desainnya dapat dikustomisasi.",
            en: "BSI Tabungan Junior is a sharia savings account for children under 17 aimed at building a saving habit from an early age. Every transaction provides a fun financial education, with the child's name printed on the passbook and the customizable BSI Debit SABI Card design.",
          },
          {
            id: "Produk ini bebas biaya administrasi bulanan, setoran awal Rp100.000 dengan saldo minimal Rp25.000, dan dilengkapi akses e-banking serta notifikasi transaksi ke orang tua. Orang tua/wali juga dapat melakukan transfer otomatis (standing order) ke rekening anak untuk melatih kedisiplinan menabung.",
            en: "This product is free of monthly administration fees, has an initial deposit of IDR 100,000 with a minimum balance of IDR 25,000, and includes e-banking access and transaction notifications to parents. Parents/guardians can also set up standing orders to the child's account to build saving discipline.",
          },
        ],
        benefits: [
          { id: "Edukasi menabung sejak dini", en: "Early saving education" },
          { id: "Nama anak tertera di buku & kartu", en: "Child's name on passbook & card" },
          { id: "Desain BSI Debit SABI Card dapat dikustomisasi", en: "Customizable BSI Debit SABI Card design" },
          { id: "Bebas biaya kelolaan rekening", en: "No account management fees" },
          { id: "SMS notifikasi transaksi ke orang tua", en: "SMS transaction notifications to parents" },
          { id: "Standing order dari rekening orang tua/wali", en: "Standing order from parent/guardian account" },
        ],
        requirements: [
          { id: "Anak WNI di bawah 17 tahun dan belum memiliki KTP", en: "Indonesian child under 17 with no ID card yet" },
          { id: "Fotokopi Kartu Keluarga (KK) dan identitas siswa", en: "Copy of Family Card (KK) and student ID" },
          { id: "KTP orang tua/wali", en: "Parent/guardian ID" },
          { id: "Mengisi formulir pembukaan rekening dan formulir Beneficial Owner", en: "Fill out the account opening and Beneficial Owner forms" },
          { id: "Setoran awal Rp100.000", en: "Initial deposit of IDR 100,000" },
        ],
        process: [
          { id: "Datang ke kantor cabang BSI bersama anak dan orang tua/wali", en: "Visit a BSI branch with the child and parent/guardian" },
          { id: "Lengkapi dokumen dan tandatangani formulir", en: "Complete the documents and sign the forms" },
          { id: "Lakukan setoran awal", en: "Make the initial deposit" },
          { id: "Rekening aktif dan terbitkan BSI Debit SABI Card", en: "Account activated and BSI Debit SABI Card issued" },
        ],
        features: [
          { id: "Khusus anak usia 0–17", en: "For children aged 0–17" },
          { id: "Desain kartu menarik", en: "Attractive card design" },
          { id: "Edukasi menabung sejak dini", en: "Early saving education" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/bsi-tabungan-junior",
      },
      {
        name: "TabunganKu BSI",
        description: {
          id: "Tabungan sederhana dengan setoran ringan untuk semua kalangan.",
          en: "A simple savings account with affordable deposits for everyone.",
        },
        overview: [
          {
            id: "TabunganKu BSI adalah tabungan perorangan dengan akad Wadiah Yad Dhamanah yang merupakan program literasi keuangan OJK dan diterbitkan bersama oleh bank-bank di Indonesia untuk menumbuhkan budaya menabung. Persyaratan pembukaannya sangat mudah dan ringan sehingga dapat diakses oleh seluruh kalangan masyarakat.",
            en: "TabunganKu BSI is an individual savings account under a Wadiah Yad Dhamanah contract, part of the OJK financial literacy program issued jointly by Indonesian banks to foster a saving culture. Its requirements are very simple and affordable, making it accessible to everyone.",
          },
          {
            id: "Produk ini bebas biaya administrasi bulanan, setoran awal mulai Rp20.000, serta dilengkapi BSI Debit, buku tabungan, dan akses e-channel seperti BYOND by BSI, BSI Net Banking, dan notifikasi transaksi. Simpanan tetap dijamin oleh Lembaga Penjamin Simpanan (LPS).",
            en: "This product is free of monthly administration fees, has an initial deposit starting from IDR 20,000, and comes with BSI Debit, a passbook, and e-channel access such as BYOND by BSI, BSI Net Banking, and transaction notifications. Deposits remain LPS-guaranteed.",
          },
        ],
        benefits: [
          { id: "Setoran awal sangat ringan (mulai Rp20.000)", en: "Very low initial deposit (from IDR 20,000)" },
          { id: "Bebas biaya administrasi bulanan", en: "No monthly administration fees" },
          { id: "Syarat pembukaan mudah", en: "Easy opening requirements" },
          { id: "Dilengkapi BSI Debit & akses e-banking", en: "Comes with BSI Debit & e-banking access" },
          { id: "Sesuai program OJK, dijamin LPS", en: "OJK program, LPS-guaranteed" },
        ],
        requirements: [
          { id: "Perorangan WNI dan cakap hukum", en: "Individual Indonesian citizen, legally competent" },
          { id: "KTP elektronik dan NPWP (jika ada)", en: "Electronic ID and tax ID (if applicable)" },
          { id: "Mengisi formulir pembukaan rekening", en: "Fill out the account opening form" },
          { id: "Setoran awal minimal sesuai ketentuan", en: "Minimum initial deposit as required" },
        ],
        process: [
          { id: "Datang ke kantor cabang BSI terdekat", en: "Visit the nearest BSI branch" },
          { id: "Isi formulir pembukaan rekening dan setoran awal", en: "Fill out the form and make the initial deposit" },
          { id: "Rekening aktif; terima buku tabungan dan BSI Debit", en: "Account activated; receive passbook and BSI Debit" },
        ],
        features: [
          { id: "Setoran awal terjangkau", en: "Affordable initial deposit" },
          { id: "Sesuai regulasi OJK", en: "Complies with OJK regulations" },
          { id: "Akses ATM BSI", en: "BSI ATM access" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/tipe/individu/kategori/tabungan",
      },
    ],
  },
  {
    id: "pembiayaan",
    title: { id: "Pembiayaan", en: "Financing" },
    slug: "pembiayaan",
    description: {
      id: "Pembiayaan syariah tanpa riba untuk kebutuhan konsumtif maupun produktif.",
      en: "Riba-free sharia financing for both consumer and productive needs.",
    },
    icon: "hands",
    items: [
      {
        name: "BSI KUR Mikro",
        description: {
          id: "Pembiayaan modal usaha untuk UMKM dengan akad Murabahah.",
          en: "Business capital financing for MSMEs under a Murabahah contract.",
        },
        overview: [
          {
            id: "BSI KUR Mikro adalah fasilitas pembiayaan program pemerintah bagi pelaku UMKM yang memiliki usaha layak dan produktif, dengan plafon di atas Rp10 juta hingga Rp100 juta untuk kebutuhan modal kerja maupun investasi. Akad yang digunakan adalah Murabahah (jual beli) sesuai prinsip syariah.",
            en: "BSI KUR Mikro is a government program financing facility for MSMEs running feasible and productive businesses, with limits above IDR 10 million up to IDR 100 million for working capital and investment needs. It uses a Murabahah (sale-purchase) contract in line with sharia principles.",
          },
          {
            id: "Keunggulannya antara lain margin murah (setara 6% efektif per tahun), bebas biaya administrasi dan provisi, serta proses yang cepat hingga lebih kurang 3 hari melalui aplikasi iKURMA. Pengajuan dapat dilakukan online melalui salamdigital.bankbsi.co.id atau langsung di kantor cabang BSI.",
            en: "Its advantages include a low margin (equivalent to 6% effective per year), no administration and provision fees, and a fast process of about 3 days via the iKURMA app. Applications can be submitted online at salamdigital.bankbsi.co.id or directly at a BSI branch.",
          },
        ],
        benefits: [
          { id: "Plafon hingga Rp100 juta", en: "Limit up to IDR 100 million" },
          { id: "Margin murah setara 6% efektif/tahun", en: "Low margin equivalent to 6% effective/year" },
          { id: "Bebas biaya administrasi & provisi", en: "No administration & provision fees" },
          { id: "Proses cepat (±3 hari)", en: "Fast process (±3 days)" },
          { id: "Pengajuan online maupun di cabang", en: "Apply online or at a branch" },
          { id: "Sesuai prinsip syariah (Murabahah)", en: "Sharia-compliant (Murabahah)" },
        ],
        requirements: [
          { id: "WNI cakap hukum, usia ≥21 tahun atau sudah menikah", en: "Indonesian, legally competent, 21+ or married" },
          { id: "Usaha telah berjalan minimal 6 bulan", en: "Business operating for at least 6 months" },
          { id: "KTP, KK/akta nikah, dan legalitas usaha", en: "ID, family card/marriage certificate, and business legality" },
          { id: "Fotokopi dokumen agunan (jika ada)", en: "Copy of collateral documents (if any)" },
        ],
        process: [
          { id: "Ajukan pembiayaan via cabang BSI atau salamdigital.bankbsi.co.id", en: "Apply via a BSI branch or salamdigital.bankbsi.co.id" },
          { id: "Lengkapi data dan dokumen usaha", en: "Complete your data and business documents" },
          { id: "Survei dan analisis kelayakan usaha", en: "Survey and business feasibility analysis" },
          { id: "Akad pembiayaan dan pencairan dana", en: "Sign the contract and receive the funds" },
        ],
        features: [
          { id: "Plafon hingga Rp100 juta", en: "Limit up to IDR 100 million" },
          { id: "Angsuran ringan", en: "Affordable installments" },
          { id: "Tidak ada biaya tersembunyi", en: "No hidden fees" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/tipe/individu/parent/produk/bsi-kur-mikro",
      },
      {
        name: "BSI Griya",
        description: {
          id: "Pembiayaan kepemilikan rumah, renovasi, hingga refinancing.",
          en: "Financing for home ownership, renovation, and refinancing.",
        },
        overview: [
          {
            id: "BSI Griya adalah fasilitas pembiayaan kepemilikan rumah dengan prinsip syariah untuk berbagai kebutuhan: pembelian rumah, ruko, rukan, maupun apartemen baru atau bekas (akad Murabahah), take over pembiayaan dari bank lain, top up, hingga refinancing (akad Musyarakah Mutanaqisah/MMQ).",
            en: "BSI Griya is a sharia home ownership financing facility covering various needs: purchasing a new or existing house, shop-house (ruko), town-house (rukan), or apartment (Murabahah contract), take-over from other banks, top up, and refinancing (Musyarakah Mutanaqisah/MMQ contract).",
          },
          {
            id: "Keunggulannya antara lain DP mulai 0% untuk pembelian rumah pertama, bebas biaya administrasi (untuk akad Murabahah), bebas biaya appraisal dan provisi, angsuran tetap hingga lunas, serta tenor hingga 30 tahun. Tersedia pula program BSI Griya SiMuda (untuk milenial) dan BSI Griya Mabrur dengan hadiah porsi haji.",
            en: "Its advantages include a 0% down payment for first home purchases, no administration fees (for Murabahah), no appraisal and provision fees, fixed installments until maturity, and tenors of up to 30 years. Programs like BSI Griya SiMuda (for millennials) and BSI Griya Mabrur with a Hajj seat prize are also available.",
          },
        ],
        benefits: [
          { id: "DP mulai 0% untuk rumah pertama", en: "0% down payment for first home" },
          { id: "Bebas biaya administrasi, appraisal & provisi", en: "No admin, appraisal & provision fees" },
          { id: "Angsuran tetap sampai lunas", en: "Fixed installments until maturity" },
          { id: "Tenor hingga 30 tahun", en: "Tenor up to 30 years" },
          { id: "Pembelian, take over, top up, dan refinancing", en: "Purchase, take over, top up, and refinancing" },
          { id: "Program Griya SiMuda & Griya Mabrur (porsi haji)", en: "SiMuda & Mabrur programs (Hajj seat)" },
        ],
        requirements: [
          { id: "KTP, NPWP, dan Kartu Keluarga", en: "ID card, tax ID, and family card" },
          { id: "Akta nikah (jika menikah)", en: "Marriage certificate (if married)" },
          { id: "Data pekerjaan: SK kerja, slip gaji, rekening koran", en: "Employment data: work letter, payslips, bank statements" },
          { id: "Data agunan: sertifikat, IMB, PBB", en: "Collateral data: certificate, building permit, land tax" },
          { id: "Formulir pengajuan pembiayaan yang lengkap", en: "Complete financing application form" },
        ],
        process: [
          { id: "Kunjungi kantor cabang BSI atau ajukan melalui rumahimpian.id", en: "Visit a BSI branch or apply via rumahimpian.id" },
          { id: "Isi aplikasi dan lengkapi seluruh dokumen", en: "Fill out the application and complete all documents" },
          { id: "Appraisal properti dan analisis pembiayaan", en: "Property appraisal and financing analysis" },
          { id: "Akad pembiayaan (Murabahah/MMQ) dan pencairan", en: "Financing contract (Murabahah/MMQ) and disbursement" },
          { id: "Angsuran dibayar otomatis (autodebet) dari rekening BSI", en: "Installments auto-debited from your BSI account" },
        ],
        features: [
          { id: "Akad Murabahah/Musyarakah", en: "Murabahah/Musyarakah contract" },
          { id: "DP ringan", en: "Low down payment" },
          { id: "Tenor hingga 20 tahun", en: "Tenor up to 20 years" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/tipe/individu/parent/produk/bsi-griya",
      },
      {
        name: "BSI Oto",
        description: {
          id: "Pembiayaan kendaraan bermotor baru maupun bekas.",
          en: "Financing for new and used motor vehicles.",
        },
        overview: [
          {
            id: "BSI Oto adalah fasilitas pembiayaan kendaraan bermotor dengan akad Murabahah yang bekerja sama dengan PT Mandiri Utama Finance Unit Usaha Syariah. Produk ini melayani pembiayaan mobil baru, mobil bekas, dan motor baru dengan plafon hingga Rp3 miliar dan jangka waktu 1 hingga 7 tahun.",
            en: "BSI Oto is a motor vehicle financing facility under a Murabahah contract in partnership with PT Mandiri Utama Finance Sharia Business Unit. It finances new cars, used cars, and new motorcycles with limits up to IDR 3 billion and terms of 1 to 7 years.",
          },
          {
            id: "Angsurannya tetap dan ringan, dapat disimulasikan terlebih dahulu sebelum mengajukan, serta dibayar otomatis dari rekening BSI. Pengajuan dapat dilakukan melalui aplikasi BYOND by BSI, BSI Mobile, website bsioto.muf.co.id, maupun kantor cabang BSI.",
            en: "Installments are fixed and affordable, can be simulated before applying, and are auto-debited from a BSI account. Applications can be submitted through the BYOND by BSI app, BSI Mobile, the bsioto.muf.co.id website, or a BSI branch.",
          },
        ],
        benefits: [
          { id: "Mobil baru, mobil bekas, dan motor baru", en: "New cars, used cars, and new motorcycles" },
          { id: "Plafon hingga Rp3 miliar", en: "Limit up to IDR 3 billion" },
          { id: "Tenor 1–7 tahun dengan angsuran tetap", en: "1–7 year tenor with fixed installments" },
          { id: "Simulasi angsuran sebelum pengajuan", en: "Installment simulation before applying" },
          { id: "Pengajuan via BYOND by BSI, website, atau cabang", en: "Apply via BYOND by BSI, website, or branch" },
          { id: "Autodebet angsuran dari rekening BSI", en: "Installments auto-debited from BSI account" },
        ],
        requirements: [
          { id: "Usia 21–55 tahun saat jatuh tempo", en: "Aged 21–55 at maturity" },
          { id: "Memiliki dan aktif menggunakan BYOND by BSI", en: "Own and actively use BYOND by BSI" },
          { id: "KTP, KK, NPWP, dan akta nikah/cerai", en: "ID, family card, tax ID, and marriage/divorce certificate" },
          { id: "Slip gaji 3 bulan dan rekening koran 3 bulan", en: "3 months of payslips and bank statements" },
          { id: "Tidak memiliki tunggakan pembiayaan", en: "No outstanding financing arrears" },
        ],
        process: [
          { id: "Buka aplikasi BYOND by BSI → menu Pembiayaan → BSI Oto", en: "Open BYOND by BSI → Financing menu → BSI Oto" },
          { id: "Cari & pilih kendaraan, lalu lengkapi simulasi angsuran", en: "Search & choose a vehicle, then complete the installment simulation" },
          { id: "Pilih jangka waktu dan kirim pengajuan", en: "Choose the tenor and submit the application" },
          { id: "Verifikasi, akad, dan pencairan dana", en: "Verification, contract signing, and disbursement" },
          { id: "Terima kendaraan dan mulai angsuran", en: "Receive the vehicle and start installments" },
        ],
        features: [
          { id: "Mobil & motor", en: "Cars & motorcycles" },
          { id: "Angsuran tetap", en: "Fixed installments" },
          { id: "Proses cepat", en: "Fast process" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/bsi-oto",
      },
      {
        name: "BSI Mitra",
        description: {
          id: "Pembiayaan modal kerja untuk pengusaha kecil dan menengah.",
          en: "Working capital financing for small and medium business owners.",
        },
        overview: [
          {
            id: "BSI Mitra adalah fasilitas pembiayaan modal kerja untuk perorangan maupun badan usaha yang membutuhkan dukungan finansial dalam mengembangkan usaha. Akad yang digunakan antara lain Murabahah, Musyarakah, dan Musyarakah Mutanaqisah (MMQ) sesuai kebutuhan nasabah.",
            en: "BSI Mitra is a working capital financing facility for both individuals and business entities in need of financial support to grow their business. The contracts used include Murabahah, Musyarakah, and Musyarakah Mutanaqisah (MMQ) tailored to customer needs.",
          },
          {
            id: "Limit pembiayaan mulai Rp200 juta hingga Rp25 miliar dengan jangka waktu hingga 5 tahun, disesuaikan dengan kebutuhan dan kemampuan bayar usaha nasabah. Proses pengajuan dilakukan melalui account officer BSI yang akan membimbing dari awal hingga pencairan.",
            en: "Financing limits range from IDR 200 million up to IDR 25 billion with terms of up to 5 years, adjusted to the business's needs and repayment capacity. Applications are handled by BSI account officers who guide you from start to disbursement.",
          },
        ],
        benefits: [
          { id: "Limit hingga Rp25 miliar", en: "Limit up to IDR 25 billion" },
          { id: "Akad Murabahah, Musyarakah, atau MMQ", en: "Murabahah, Musyarakah, or MMQ contracts" },
          { id: "Untuk perorangan & badan usaha", en: "For individuals & business entities" },
          { id: "Jangka waktu hingga 5 tahun", en: "Terms up to 5 years" },
          { id: "Fleksibel untuk modal kerja & investasi", en: "Flexible for working capital & investment" },
        ],
        requirements: [
          { id: "Perorangan atau badan usaha yang memiliki usaha", en: "Individuals or business entities owning a business" },
          { id: "Usaha berjalan dan memiliki prospek", en: "Operating business with good prospects" },
          { id: "Dokumen identitas dan legalitas usaha", en: "Identity and business legality documents" },
          { id: "Dokumen pendukung keuangan (laporan keuangan, dll.)", en: "Supporting financial documents (financial reports, etc.)" },
        ],
        process: [
          { id: "Ajukan pembiayaan ke kantor cabang BSI", en: "Submit your application at a BSI branch" },
          { id: "Account officer melakukan analisis usaha & kelayakan", en: "Account officer conducts business & feasibility analysis" },
          { id: "Akad pembiayaan sesuai prinsip syariah", en: "Sign the sharia-compliant financing contract" },
          { id: "Pencairan dana dan monitoring berkala", en: "Disbursement and periodic monitoring" },
        ],
        features: [
          { id: "Akad Murabahah", en: "Murabahah contract" },
          { id: "Plafon fleksibel", en: "Flexible limit" },
          { id: "Tanpa jaminan tambahan", en: "No additional collateral" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/tipe/bisnis/parent/produk/bsi-sme-mitra-modal-kerja",
      },
    ],
  },
  {
    id: "kartu",
    title: { id: "Kartu", en: "Cards" },
    slug: "kartu",
    description: {
      id: "Kartu pembayaran syariah dengan fasilitas lengkap dan transparan.",
      en: "Sharia payment cards with complete and transparent facilities.",
    },
    icon: "card",
    items: [
      {
        name: "BSI Hasanah Card",
        description: {
          id: "Kartu pembiayaan syariah (syariah card) untuk transaksi non-tunai sesuai kaidah Islam.",
          en: "A sharia card for cashless transactions in accordance with Islamic principles.",
        },
        overview: [
          {
            id: "BSI Hasanah Card adalah satu-satunya kartu kredit berbasis syariah yang diterbitkan oleh bank umum syariah di Indonesia, berdasarkan Fatwa DSN-MUI No.54/DSN-MUI/X/2006 dengan kombinasi akad Kafalah (penjaminan), Qard (pinjaman kebajikan), dan Ijarah (sewa jasa). Tersedia varian Gold dan Platinum dengan jaringan MasterCard yang diterima di seluruh dunia.",
            en: "BSI Hasanah Card is the only sharia-compliant credit card issued by a sharia commercial bank in Indonesia, based on DSN-MUI Fatwa No.54/DSN-MUI/X/2006 combining Kafalah (guarantee), Qard (benevolent loan), and Ijarah (fee-based service) contracts. Gold and Platinum variants are available with the globally accepted MasterCard network.",
          },
          {
            id: "Produk ini tidak menggunakan sistem bunga, bebas denda keterlambatan dan overlimit, biaya transparan berbasis monthly fee, serta hanya dapat digunakan di merchant halal. Dilengkapi fitur Smart Spending (cicilan 0% hingga 12 bulan), Smart Bill, Smart Sadaqah, dan Smart Fund untuk pengelolaan keuangan yang lebih baik.",
            en: "This product does not use an interest system, has no late-fee or overlimit penalties, transparent monthly fees, and can only be used at halal merchants. It comes with Smart Spending (0% installments up to 12 months), Smart Bill, Smart Sadaqah, and Smart Fund features for better financial management.",
          },
        ],
        benefits: [
          { id: "100% sesuai prinsip syariah (Fatwa DSN No.54)", en: "100% sharia-compliant (DSN Fatwa No.54)" },
          { id: "Tanpa bunga & bebas denda keterlambatan/overlimit", en: "No interest, no late/overlimit penalties" },
          { id: "Cicilan 0% hingga 12 bulan", en: "0% installments up to 12 months" },
          { id: "Jaringan MasterCard global", en: "Global MasterCard network" },
          { id: "Kurs kompetitif untuk transaksi luar negeri", en: "Competitive rates for foreign transactions" },
          { id: "Free Executive Lounge untuk varian Platinum", en: "Free Executive Lounge for Platinum" },
          { id: "Hanya merchant halal", en: "Halal merchants only" },
        ],
        requirements: [
          { id: "Usia 21–65 tahun", en: "Aged 21–65" },
          { id: "Penghasilan minimal Rp3 juta per bulan", en: "Minimum monthly income of IDR 3 million" },
          { id: "KTP, NPWP, dan dokumen penghasilan", en: "ID, tax ID, and income documents" },
          { id: "Reputasi kredit yang baik", en: "Good credit reputation" },
        ],
        process: [
          { id: "Ajukan melalui cabang BSI, telesales, atau website resmi BSI", en: "Apply via a BSI branch, telesales, or the official BSI website" },
          { id: "Lengkapi KTP, NPWP, dan bukti penghasilan", en: "Submit your ID, tax ID, and proof of income" },
          { id: "Verifikasi dan persetujuan bank", en: "Bank verification and approval" },
          { id: "Kartu dikirim dan diaktivasi via SMS 89600 atau BSI Call 14040", en: "Card delivered and activated via SMS 89600 or BSI Call 14040" },
        ],
        features: [
          { id: "Berbasis akad Kafalah", en: "Based on Kafalah contract" },
          { id: "Bebas denda & bunga", en: "No penalties or interest" },
          { id: "Jaringan global Visa", en: "Global Visa network" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/tipe/kartu",
      },
    ],
  },
  {
    id: "digital",
    title: { id: "Layanan Digital", en: "Digital Services" },
    slug: "digital",
    description: {
      id: "Akses perbankan kapan saja dan di mana saja melalui kanal digital BSI.",
      en: "Access banking anytime, anywhere through BSI digital channels.",
    },
    icon: "smartphone",
    items: [
      {
        name: "BYOND by BSI",
        description: {
          id: "Aplikasi mobile banking BSI untuk seluruh transaksi harian.",
          en: "BSI mobile banking app for all your daily transactions.",
        },
        overview: [
          {
            id: "BYOND by BSI adalah superapp layanan finansial, sosial, dan spiritual dari Bank Syariah Indonesia untuk mengakses rekening dan melakukan seluruh transaksi perbankan melalui ponsel — kapan saja dan di mana saja (#SemuaJadiMudah).",
            en: "BYOND by BSI is the financial, social, and spiritual superapp from Bank Syariah Indonesia for accessing your account and performing all banking transactions from your phone — anytime, anywhere (#SemuaJadiMudah).",
          },
          {
            id: "Fitur-fiturnya meliputi transfer antar bank dan BI-FAST, pembayaran tagihan, pembelian, QRIS, tarik tunai tanpa kartu, top up e-wallet, buka rekening online, investasi dan cicil emas, hingga fitur islami seperti pengingat salat, arah kiblat, dan Juz 'Amma, serta pembayaran zakat, infak, dan wakaf.",
            en: "Features include interbank and BI-FAST transfers, bill payments, purchases, QRIS, cardless cash withdrawal, e-wallet top up, online account opening, gold investment and installments, plus Islamic features such as prayer reminders, qibla direction, Juz 'Amma, and zakat, infaq, and waqf payments.",
          },
        ],
        benefits: [
          { id: "Transfer antar bank & BI-FAST", en: "Interbank & BI-FAST transfers" },
          { id: "QRIS dan tarik tunai tanpa kartu", en: "QRIS and cardless cash withdrawal" },
          { id: "Pembayaran, pembelian, & top up e-wallet", en: "Payments, purchases, & e-wallet top up" },
          { id: "Buka rekening online", en: "Open an account online" },
          { id: "Investasi & cicil emas", en: "Gold investment & installments" },
          { id: "Fitur islami: salat, kiblat, zakat, wakaf", en: "Islamic features: prayer, qibla, zakat, waqf" },
          { id: "Keamanan berlapis (FDS, HSM, PIN transaksi)", en: "Layered security (FDS, HSM, transaction PIN)" },
        ],
        requirements: [
          { id: "Nasabah BSI dengan rekening aktif", en: "BSI customer with an active account" },
          { id: "Unduh aplikasi dari App Store atau Google Play", en: "Download the app from the App Store or Google Play" },
          { id: "Aktivasi dengan kartu debit dan PIN", en: "Activate with your debit card and PIN" },
        ],
        process: [
          { id: "Unduh aplikasi BYOND by BSI", en: "Download the BYOND by BSI app" },
          { id: "Daftar dan aktivasi dengan kartu debit", en: "Register and activate with your debit card" },
          { id: "Buat PIN transaksi", en: "Create your transaction PIN" },
          { id: "Selesai — langsung bertransaksi", en: "Done — start transacting right away" },
        ],
        features: [
          { id: "Transfer antar bank", en: "Interbank transfer" },
          { id: "QRIS", en: "QRIS" },
          { id: "Pembayaran & top up", en: "Payments & top up" },
          { id: "Buka rekening online", en: "Open account online" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/byond-by-bsi",
      },
      {
        name: "BSI Net Banking",
        description: {
          id: "Internet banking untuk nasabah perorangan maupun korporasi.",
          en: "Internet banking for both individual and corporate customers.",
        },
        overview: [
          {
            id: "BSI Net Banking adalah layanan internet banking Bank Syariah Indonesia yang memungkinkan nasabah perorangan maupun korporasi melakukan transaksi perbankan melalui komputer atau laptop. Nasabah dapat memantau mutasi rekening, membayar tagihan, melakukan transfer antar bank, hingga mengatur transfer terjadwal.",
            en: "BSI Net Banking is Bank Syariah Indonesia's internet banking service enabling individual and corporate customers to perform banking transactions through a computer or laptop. Customers can monitor account mutations, pay bills, make interbank transfers, and set up scheduled transfers.",
          },
          {
            id: "Layanan ini cocok bagi nasabah yang membutuhkan ruang kerja lebih leluasa dibanding perangkat seluler, dengan keamanan transaksi menggunakan PIN dan token untuk memberikan perlindungan ganda.",
            en: "This service suits customers who need more workspace than a mobile device provides, with transaction security using PIN and token for double protection.",
          },
        ],
        benefits: [
          { id: "Monitoring mutasi transaksi real-time", en: "Real-time transaction monitoring" },
          { id: "Pembayaran tagihan rutin", en: "Recurring bill payments" },
          { id: "Transfer antar bank & transfer terjadwal", en: "Interbank & scheduled transfers" },
          { id: "Untuk perorangan & korporasi", en: "For individuals & corporates" },
        ],
        requirements: [
          { id: "Nasabah BSI dengan rekening aktif", en: "BSI customer with an active account" },
          { id: "Registrasi layanan e-banking", en: "e-banking service registration" },
          { id: "Perangkat dengan koneksi internet", en: "A device with internet connection" },
        ],
        process: [
          { id: "Registrasi BSI Net Banking di cabang atau kanal digital BSI", en: "Register for BSI Net Banking at a branch or via BSI digital channels" },
          { id: "Aktivasi user ID dan password", en: "Activate your user ID and password" },
          { id: "Login dan mulai bertransaksi", en: "Log in and start transacting" },
        ],
        features: [
          { id: "Monitoring transaksi", en: "Transaction monitoring" },
          { id: "Pembayaran tagihan", en: "Bill payments" },
          { id: "Transfer terjadwal", en: "Scheduled transfers" },
        ],
        link: "https://bsinet.bankbsi.co.id",
      },
      {
        name: "BEWIZE",
        description: {
          id: "Aplikasi digital untuk pelaku usaha mengelola keuangan bisnis.",
          en: "A digital app for business owners to manage business finances.",
        },
        overview: [
          {
            id: "BEWIZE adalah aplikasi digital dari Bank Syariah Indonesia yang dirancang khusus untuk pelaku usaha (UMKM dan bisnis) dalam mengelola keuangan bisnis. Fitur-fiturnya mencakup manajemen kas usaha, penerimaan dan pembayaran, hingga koneksi dengan mitra usaha sehingga arus kas bisnis tercatat rapi.",
            en: "BEWIZE is a digital app from Bank Syariah Indonesia designed specifically for business owners (MSMEs and larger businesses) to manage business finances. Its features include business cash management, receivables and payments, and connections with business partners, keeping your business cash flow well recorded.",
          },
          {
            id: "Aplikasi ini terintegrasi dengan ekosistem BSI sehingga membantu pengelolaan arus kas bisnis menjadi lebih praktis, akurat, dan dapat dipantau kapan saja.",
            en: "The app is integrated with the BSI ecosystem, making business cash flow management more practical, accurate, and monitorable at any time.",
          },
        ],
        benefits: [
          { id: "Manajemen kas usaha", en: "Business cash management" },
          { id: "Penerimaan & pembayaran mitra", en: "Partner receipts & payments" },
          { id: "QRIS merchant", en: "QRIS merchant" },
          { id: "Monitoring transaksi bisnis", en: "Business transaction monitoring" },
        ],
        requirements: [
          { id: "Pelaku usaha dengan rekening BSI", en: "Business owner with a BSI account" },
          { id: "Unduh aplikasi BEWIZE", en: "Download the BEWIZE app" },
          { id: "Registrasi & verifikasi data usaha", en: "Register & verify business data" },
        ],
        process: [
          { id: "Unduh dan daftar aplikasi BEWIZE", en: "Download and register on BEWIZE" },
          { id: "Verifikasi data usaha", en: "Verify your business data" },
          { id: "Mulai kelola keuangan bisnis", en: "Start managing your business finances" },
        ],
        features: [
          { id: "Manajemen kas", en: "Cash management" },
          { id: "Pembayaran mitra", en: "Partner payments" },
          { id: "QRIS merchant", en: "QRIS merchant" },
        ],
        link: "https://bewize.bankbsi.co.id",
      },
      {
        name: "BSI Call 14040",
        description: {
          id: "Layanan informasi dan pengaduan nasabah 24 jam.",
          en: "24-hour customer information and complaint service.",
        },
        overview: [
          {
            id: "BSI Call 14040 adalah layanan informasi dan pengaduan nasabah Bank Syariah Indonesia yang dapat dihubungi 24 jam dan bebas pulsa dari jaringan telepon di seluruh Indonesia. Melayani pertanyaan seputar produk, bantuan transaksi, kendala penggunaan layanan, hingga pengaduan nasabah.",
            en: "BSI Call 14040 is Bank Syariah Indonesia's customer information and complaint service, reachable 24 hours and toll-free from phone networks across Indonesia. It handles product inquiries, transaction assistance, service issues, and customer complaints.",
          },
          {
            id: "Layanan ini menjadi saluran utama nasabah untuk mendapatkan informasi resmi produk dan layanan BSI, sekaligus pintu pertama pengaduan yang diproses sesuai ketentuan OJK.",
            en: "This service is the primary channel for customers to get official information on BSI products and services, and the first door for complaints handled in accordance with OJK regulations.",
          },
        ],
        benefits: [
          { id: "24 jam, bebas pulsa di seluruh Indonesia", en: "24 hours, toll-free across Indonesia" },
          { id: "Informasi produk & layanan BSI", en: "BSI product & service information" },
          { id: "Bantuan transaksi & kendala layanan", en: "Transaction help & service issues" },
          { id: "Penerimaan pengaduan nasabah", en: "Customer complaint handling" },
        ],
        requirements: [
          { id: "Hubungi nomor 14040 dari telepon mana pun", en: "Call 14040 from any phone" },
        ],
        process: [
          { id: "Tekan 14040 dari telepon Anda", en: "Dial 14040 from your phone" },
          { id: "Pilih layanan yang dibutuhkan (informasi/pengaduan)", en: "Choose the needed service (information/complaint)" },
          { id: "Sampaikan pertanyaan atau kendala ke agen", en: "State your question or issue to the agent" },
        ],
        features: [
          { id: "Bebas pulsa", en: "Toll-free" },
          { id: "24 jam", en: "24 hours" },
          { id: "Layanan informasi produk", en: "Product information service" },
        ],
        link: "tel:14040",
      },
    ],
  },
  {
    id: "pawning",
    title: { id: "Gadai Emas", en: "Gold Pawn" },
    slug: "pawning",
    description: {
      id: "Gadai emas syariah untuk mendapatkan dana tunai cepat dengan emas sebagai jaminan.",
      en: "Sharia gold pawn for quick cash using your gold as collateral.",
    },
    icon: "gem",
    items: [
      {
        name: "BSI Gadai Emas",
        description: {
          id: "Gadai emas dengan akad Qardh & Ijarah sesuai prinsip syariah.",
          en: "Gold pawn under Qardh & Ijarah contracts in line with sharia principles.",
        },
        overview: [
          {
            id: "BSI Gadai Emas adalah fasilitas pembiayaan dengan jaminan emas (batangan, koin dinar, maupun perhiasan minimal kadar 16 karat) untuk memperoleh dana tunai dengan mudah, cepat, dan aman. Produk ini menggunakan akad Qardh (pinjaman kebajikan) dengan biaya penyimpanan (ujrah) berdasarkan akad Ijarah.",
            en: "BSI Gadai Emas is a financing facility secured by gold (bars, dinar coins, or jewelry of at least 16 karats) to obtain cash easily, quickly, and safely. It uses a Qardh (benevolent loan) contract with storage fees (ujrah) based on an Ijarah contract.",
          },
          {
            id: "Nilai taksirannya tinggi (hingga 95% dari nilai emas), biaya penyimpanan ringan, jangka waktu 4 bulan dan dapat diperpanjang, serta limit mulai Rp500 ribu. Emas nasabah disimpan aman dan diasuransikan. Produk ini juga melayani take over dan dapat diajukan secara online melalui BYOND by BSI atau BSI Mobile.",
            en: "It offers a high loan-to-value ratio (up to 95% of the gold value), low storage fees, a 4-month term renewable as needed, and a limit starting from IDR 500,000. Your gold is safely stored and insured. The product also supports take-over and can be applied for online via BYOND by BSI or BSI Mobile.",
          },
        ],
        benefits: [
          { id: "Proses mudah & cepat", en: "Easy & fast process" },
          { id: "Taksiran emas tinggi (hingga 95%)", en: "High gold valuation (up to 95%)" },
          { id: "Biaya penyimpanan ringan", en: "Low storage fees" },
          { id: "Emas tersimpan aman & diasuransikan", en: "Gold safely stored & insured" },
          { id: "Perpanjangan, top up, & pelunasan fleksibel", en: "Flexible extension, top up & repayment" },
          { id: "Pengajuan offline maupun online (BYOND)", en: "Apply offline or online (BYOND)" },
          { id: "Melayani take over", en: "Take-over supported" },
        ],
        requirements: [
          { id: "KTP elektronik (dan NPWP untuk pembiayaan di atas Rp50 juta)", en: "Electronic ID (and tax ID for financing above IDR 50 million)" },
          { id: "Emas fisik: batangan, koin dinar, atau perhiasan minimal 16 karat", en: "Physical gold: bars, dinar coins, or jewelry of at least 16 karats" },
          { id: "Mengisi formulir permohonan gadai", en: "Fill out the gold pawn application form" },
        ],
        process: [
          { id: "Bawa emas dan identitas ke kantor cabang BSI (atau reservasi online)", en: "Bring your gold and ID to a BSI branch (or reserve online)" },
          { id: "Taksir dan nilai emas Anda", en: "Appraise and value your gold" },
          { id: "Akad Qardh & terima dana tunai", en: "Sign the Qardh contract & receive cash" },
          { id: "Perpanjang, top up, atau lunasi sesuai kebutuhan", en: "Extend, top up, or repay as needed" },
        ],
        features: [
          { id: "Proses cepat", en: "Fast process" },
          { id: "Titip emas aman", en: "Safe gold custody" },
          { id: "Perpanjangan & pelunasan fleksibel", en: "Flexible extension & repayment" },
        ],
        link: "https://www.bankbsi.co.id/produk&layanan/produk/bsi-gadai-emas",
      },
    ],
  },
];

// Ringkasan 6 layanan utama untuk grid "Layanan Kami" di halaman depan.
export const SERVICE_OVERVIEW = [
  {
    id: "tabungan",
    title: { id: "Tabungan", en: "Savings" },
    description: {
      id: "Simpanan syariah untuk kebutuhan menabung Anda — dari tabungan reguler hingga program perencanaan.",
      en: "Sharia savings for your needs — from regular accounts to planning programs.",
    },
    icon: "wallet",
    href: "/services#tabungan",
  },
  {
    id: "pembiayaan",
    title: { id: "Pembiayaan", en: "Financing" },
    description: {
      id: "Solusi pembiayaan syariah tanpa riba untuk kebutuhan konsumtif maupun produktif.",
      en: "Riba-free sharia financing solutions for consumer and productive needs.",
    },
    icon: "hands",
    href: "/services#pembiayaan",
  },
  {
    id: "investasi",
    title: { id: "Investasi", en: "Investment" },
    description: {
      id: "Pilihan instrumen investasi yang dikelola sesuai prinsip-prinsip syariah.",
      en: "Investment instruments managed in line with sharia principles.",
    },
    icon: "trending",
    href: "/services#tabungan",
  },
  {
    id: "haji-umrah",
    title: { id: "Haji & Umrah", en: "Hajj & Umrah" },
    description: {
      id: "Tabungan perencanaan ibadah haji dan umroh yang dikelola sesuai prinsip syariah.",
      en: "Savings for planning Hajj and Umrah pilgrimages, managed per sharia principles.",
    },
    icon: "globe",
    href: "/services#tabungan",
  },
  {
    id: "digital",
    title: { id: "Digital Banking", en: "Digital Banking" },
    description: {
      id: "Akses perbankan kapan saja dan di mana saja melalui kanal digital BSI.",
      en: "Access banking anytime, anywhere through BSI digital channels.",
    },
    icon: "smartphone",
    href: "/services#digital",
  },
  {
    id: "bisnis",
    title: { id: "Layanan Bisnis", en: "Business Services" },
    description: {
      id: "Solusi perbankan untuk mendukung pengelolaan keuangan usaha Anda.",
      en: "Banking solutions to support the financial management of your business.",
    },
    icon: "briefcase",
    href: "/services#digital",
  },
];
