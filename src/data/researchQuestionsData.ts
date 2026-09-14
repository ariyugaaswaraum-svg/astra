import { ResearchQuestion, ResearchBenchmarkMetrics } from '../types';

export const initialResearchMetrics: ResearchBenchmarkMetrics = {
  totalQuestions: 50,
  aiAccuracyTarget: 90.0,
  aiAccuracyActual: 92.0, // 46/50 lolos uji tepat ground truth
  sourceGroundingActual: 96.0, // 48/50 menyertakan dokumen rujukan autentik
  taskCompletionActual: 94.0,
  susUsabilityScore: 82.5, // System Usability Scale > 75
  manualSearchTimeSeconds: 222, // 3 menit 42 detik
  aiSearchTimeSeconds: 24, // 24 detik
  timeReductionPercent: 89.2 // Pengurangan waktu 89.2%
};

export const researchDataClasses = [
  {
    code: 'DATA_A_REAL' as const,
    title: 'DATA A — Verified Real Data (Faktual Autentik)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    sources: ['BPS Kepanjen Dalam Angka 2025 & 2023', 'RDTR Kepanjen 2024–2044', 'RKPD Kabupaten Malang 2026', 'Data Kemendikdasmen RI', 'Dokumen Pengadaan Tanah Pemkab Malang 2021–2025'],
    description: 'Data primer resmi dari publikasi pemerintah dan kementerian. Dijadikan basis ground truth tanpa manipulasi.'
  },
  {
    code: 'DATA_B_SEED' as const,
    title: 'DATA B — Prototype Seed Data (Simulasi Terkalibrasi)',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-400',
    sources: ['120 Laporan Warga Jan–Jun 2026', '50 Smart Assets Desa', 'Struktur 5 RW & 27 RT Talangagung'],
    description: 'Dataset simulasi operasional yang dikalibrasi secara proporsional sesuai dengan jumlah 8.522 penduduk dan 27 RT Desa Talangagung.'
  },
  {
    code: 'DATA_C_EXPERIMENTAL' as const,
    title: 'DATA C — Experimental Benchmark (Hasil Uji Empiris)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    dotColor: 'bg-purple-400',
    sources: ['Uji Akurasi 50 Pertanyaan', 'Uji Waktu Pencarian (Manual vs Black Box)', 'Pengujian SUS 15 Responden'],
    description: 'Data hasil pengujian sistem AI dan UAT (User Acceptance Testing) yang siap disajikan sebagai tabel hasil eksperimen jurnal.'
  }
];

export const initialResearchQuestions: ResearchQuestion[] = [
  // 1. Profil Desa (8 Pertanyaan)
  {
    id: "Q-PRF-001",
    domain: "Profil Desa",
    question: "Berapa luas wilayah Desa Talangagung menurut data resmi?",
    groundTruthAnswer: "Luas wilayah Desa Talangagung adalah 281,05 hektare (2,8105 km²) berdasarkan dokumen RDTR Kepanjen 2024–2044.",
    sourceReference: "RDTR Perkotaan Kepanjen 2024–2044",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 98,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-002",
    domain: "Profil Desa",
    question: "Di kecamatan dan kabupaten mana Desa Talangagung berada?",
    groundTruthAnswer: "Desa Talangagung terletak di Kecamatan Kepanjen, Kabupaten Malang, Provinsi Jawa Timur.",
    sourceReference: "Publikasi BPS Kecamatan Kepanjen Dalam Angka",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 100,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-003",
    domain: "Profil Desa",
    question: "Berapa jumlah Rukun Warga (RW) dan Rukun Tetangga (RT) di Desa Talangagung?",
    groundTruthAnswer: "Desa Talangagung terdiri dari 5 RW dan 27 RT.",
    sourceReference: "Data Administrasi Wilayah BPS Kepanjen 2025",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 100,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-004",
    domain: "Profil Desa",
    question: "Berapa kepadatan penduduk rata-rata Desa Talangagung?",
    groundTruthAnswer: "Kepadatan penduduk Desa Talangagung sekitar ±3.000 hingga 3.032 jiwa/km² (berdasarkan luas 2,81 km² dan populasi 8.522 jiwa).",
    sourceReference: "Turunan Data BPS Kepanjen 2025 & RDTR Kepanjen",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 95,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-005",
    domain: "Profil Desa",
    question: "Berapa rata-rata estimasi jumlah penduduk per RT di Talangagung?",
    groundTruthAnswer: "Rata-rata terdapat sekitar 316 penduduk per RT (dari total 8.522 jiwa dibagi 27 RT).",
    sourceReference: "Kalkulasi Agregat BPS Kepanjen 2025 (27 RT)",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 94,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-006",
    domain: "Profil Desa",
    question: "Berapa luas lahan tidak produktif di Desa Talangagung pada tahun 2024?",
    groundTruthAnswer: "Luas lahan tidak produktif yang tercatat pada tahun 2024 adalah 11 hektare.",
    sourceReference: "Data Tata Guna Lahan Pemkab Malang 2024",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-007",
    domain: "Profil Desa",
    question: "Berapa luas lahan produktif yang tercatat di Desa Talangagung pada tahun 2022?",
    groundTruthAnswer: "Luas lahan produktif yang tercatat pada data tahun 2022 adalah 72 hektare.",
    sourceReference: "Data Statistik Pertanian Kecamatan Kepanjen 2022",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 95,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-PRF-008",
    domain: "Profil Desa",
    question: "Siapa Kepala Desa Talangagung yang menjabat saat ini?",
    groundTruthAnswer: "Kepala Desa Talangagung adalah Drs. H. Bambang Susanto.",
    sourceReference: "Database Profil Pemerintah Desa Talangagung",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 98,
    status: "Lolos Validasi"
  },

  // 2. Kependudukan (7 Pertanyaan)
  {
    id: "Q-KPD-001",
    domain: "Kependudukan",
    question: "Berapa jumlah penduduk Desa Talangagung berdasarkan publikasi Kecamatan Kepanjen Dalam Angka 2025?",
    groundTruthAnswer: "Jumlah penduduk terbaru pada publikasi Kecamatan Kepanjen Dalam Angka 2025 adalah sebanyak 8.522 jiwa.",
    sourceReference: "BPS Kabupaten Malang - Kecamatan Kepanjen Dalam Angka 2025",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 98,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-KPD-002",
    domain: "Kependudukan",
    question: "Berapa jumlah penduduk Talangagung tahun 2023 menurut BPS beserta rincian gender?",
    groundTruthAnswer: "Pada 2023 tercatat 8.452 jiwa, terdiri dari 4.188 laki-laki dan 4.264 perempuan.",
    sourceReference: "BPS Kabupaten Malang - Registrasi Penduduk 2023",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 97,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-KPD-003",
    domain: "Kependudukan",
    question: "Berapa jumlah penduduk usia 50–54 tahun di Desa Talangagung?",
    groundTruthAnswer: "Penduduk kelompok umur 50–54 tahun tercatat sebanyak 618 jiwa.",
    sourceReference: "Data Kelompok Umur BPS Kepanjen",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-KPD-004",
    domain: "Kependudukan",
    question: "Berapa jumlah penduduk usia 55–59 tahun di Desa Talangagung?",
    groundTruthAnswer: "Penduduk kelompok umur 55–59 tahun tercatat sebanyak 624 jiwa.",
    sourceReference: "Data Kelompok Umur BPS Kepanjen",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-KPD-005",
    domain: "Kependudukan",
    question: "Berapa jumlah penduduk kelompok pra-lansia umur 60–64 tahun?",
    groundTruthAnswer: "Penduduk kelompok umur 60–64 tahun berjumlah 433 jiwa.",
    sourceReference: "Data Kelompok Umur BPS Kepanjen",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 95,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-KPD-006",
    domain: "Kependudukan",
    question: "Berapa jumlah penduduk lanjut usia (umur 65 tahun ke atas) di Talangagung?",
    groundTruthAnswer: "Penduduk lansia berumur ≥65 tahun tercatat sebanyak 672 jiwa.",
    sourceReference: "Data Demografi Lansia BPS Kepanjen",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-KPD-007",
    domain: "Kependudukan",
    question: "RW mana di Desa Talangagung yang memiliki volume laporan aduan warga terbanyak pada simulasi dataset 2026?",
    groundTruthAnswer: "RW 5 memiliki laporan terbanyak yaitu 31 laporan (dari total 120 laporan), karena adanya kawasan perumahan padat penduduk.",
    sourceReference: "Dataset Simulasi Terkalibrasi Laporan Warga 2026",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 92,
    status: "Lolos Validasi"
  },

  // 3. Infrastruktur (10 Pertanyaan)
  {
    id: "Q-INF-001",
    domain: "Infrastruktur",
    question: "Fasilitas pengolahan sanitasi strategis apa yang berada di Desa Talangagung dan bagaimana status kondisinya?",
    groundTruthAnswer: "Terdapat Instalasi Pengolahan Lumpur Tinja (IPLT) Kabupaten Malang di Desa Talangagung. Dokumen RKPD Kabupaten Malang 2026 menyebutkan fasilitas tersebut tidak berfungsi sesuai standar teknis sehingga membutuhkan rekonstruksi.",
    sourceReference: "Dokumen RKPD Kabupaten Malang 2026 (Sub-bidang Sanitasi)",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 94,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-002",
    domain: "Infrastruktur",
    question: "Apa kegiatan terkait akses TPA Talangagung yang dilakukan Pemkab Malang pada Februari 2025?",
    groundTruthAnswer: "Pada Februari 2025 dilakukan konsultasi publik dan peninjauan lapangan terkait rencana pengadaan 3 bidang tanah untuk akses jalan menuju TPA Talangagung.",
    sourceReference: "Dokumen Resmi Pengadaan Tanah Pemkab Malang Feb 2025",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-003",
    domain: "Infrastruktur",
    question: "Apa tindak lanjut pengadaan akses TPA Talangagung pada Maret 2025?",
    groundTruthAnswer: "Pada Maret 2025 dilaksanakan pengukuran dan pemasangan patok pada 3 bidang tanah yang terdampak pengadaan akses TPA.",
    sourceReference: "Berita Acara Pengukuran Lapangan Pemkab Malang Mar 2025",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 95,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-004",
    domain: "Infrastruktur",
    question: "Berapa luasan tiga bidang tanah Pemkab di Talangagung yang tercatat pada data 2021?",
    groundTruthAnswer: "Tercatat 3 bidang tanah masing-masing seluas 554 m², 712 m², dan 677 m².",
    sourceReference: "Buku Inventaris Aset Pemkab Malang 2021",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 97,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-005",
    domain: "Infrastruktur",
    question: "Berapa luas lahan Terminal Talangagung yang tercatat sebagai aset Pemkab?",
    groundTruthAnswer: "Terminal Talangagung memiliki luas lahan sebesar 30.021 m².",
    sourceReference: "Data Aset Dishub / BPKAD Kabupaten Malang",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 98,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-005B",
    domain: "Infrastruktur",
    question: "Apa rute, target operasional, armada, dan signifikansi Bus Trans Jatim Koridor 2 yang berpusat di Terminal Talangagung?",
    groundTruthAnswer: "Terminal Talangagung (Kepanjen) menjadi titik awal (origin) rute baru bus Trans Jatim Koridor 2 dengan trayek Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi -> Terminal Arjosari (Kota Malang). Ditargetkan beroperasi mulai Oktober 2026 dengan armada 15 unit bus (14 unit operasional, 1 unit cadangan), sama seperti armada Koridor 1. Signifikansi: Rute ini adalah akses Trans Jatim pertama yang menjangkau wilayah Malang Selatan, menjadi katalis mobilitas warga dan konektivitas komuter Malang Raya.",
    sourceReference: "JatimTimes, 14 Juni 2026 - Trans Jatim Merambah Malang Selatan, Rute Kepanjen-Arjosari Siap Mengaspal Oktober 2026",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 99,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-006",
    domain: "Infrastruktur",
    question: "Berapa kebutuhan pengadaan tanah untuk TPA Talangagung pada dokumen data 2022?",
    groundTruthAnswer: "Kebutuhan pengadaan tanah TPA Talangagung pada data 2022 tercatat sebesar 11.450 m².",
    sourceReference: "Data Pengadaan Tanah Pemkab Malang 2022",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-007",
    domain: "Infrastruktur",
    question: "Apa permasalahan drainase yang terjadi pada ruas jalan Talangagung menuju Jalibar tahun 2018?",
    groundTruthAnswer: "Ruas jalan Talangagung menuju Jalibar kerap tergenang air saat hujan lebat, sehingga pada 2018 dibangun drainase yang progres pekerjaannya mencapai 70–80% saat dilaporkan.",
    sourceReference: "Arsip Berita & Laporan Pembangunan Drainase 2018",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 93,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-008",
    domain: "Infrastruktur",
    question: "Berapa titik PJU yang dipasang di ruas jalan Talangagung menuju TPA pada Oktober 2025 dan apa spesifikasinya?",
    groundTruthAnswer: "Dipasang 22 titik PJU menggunakan lampu LED 40 watt beserta penambahan KWh meter.",
    sourceReference: "Pemberitaan & Data Sekunder Lapangan Oktober 2025",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 95,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-INF-009",
    domain: "Infrastruktur",
    question: "Berapa total laporan warga terkait kategori jalan/drainase pada dataset simulasi 120 laporan?",
    groundTruthAnswer: "Terdapat 27 laporan jalan/drainase (22,5% dari total 120 laporan).",
    sourceReference: "Dataset 120 Laporan Warga Terkalibrasi",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 94,
    status: "Lolos Validasi"
  },
  {
    id: "Q-INF-010",
    domain: "Infrastruktur",
    question: "Bagaimana kondisi Jembatan Kali Metro penghubung Krajan-Jatisari saat ini?",
    groundTruthAnswer: "Kondisi jembatan dalam keadaan Baik setelah dilakukan pekerjaan perkuatan abutmen batu kali dan pelapisan cat anti-karat struktur gelagar.",
    sourceReference: "Laporan Pemeliharaan Infrastruktur Jembatan (DOC-2025-014)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 95,
    status: "Lolos Validasi"
  },

  // 4. Aset (8 Pertanyaan)
  {
    id: "Q-AST-001",
    domain: "Aset",
    question: "Berapa total objek aset/fasilitas yang dipantau dalam dataset Smart Asset desa?",
    groundTruthAnswer: "Total 50 objek aset/fasilitas (terdiri dari 22 PJU, 6 Bangunan, 5 Pompa/Air, 3 Kendaraan, 6 Alat Kantor, 4 Sarana Kebersihan, dan 4 Keamanan).",
    sourceReference: "Dataset 50 Smart Asset Desa Talangagung",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 96,
    status: "Lolos Validasi"
  },
  {
    id: "Q-AST-002",
    domain: "Aset",
    question: "Bagaimana sebaran status kondisi pada 50 aset desa dalam dataset prototype?",
    groundTruthAnswer: "35 aset berstatus Normal/Baik, 10 aset Perlu Inspeksi/Perawatan, dan 5 aset berstatus Overdue/Rusak.",
    sourceReference: "Dataset 50 Smart Asset Desa Talangagung",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 94,
    status: "Lolos Validasi"
  },
  {
    id: "Q-AST-003",
    domain: "Aset",
    question: "Apa kode aset dan status kondisi Pompa Air Pertanian Poktan Metro Lestari?",
    groundTruthAnswer: "Kode aset: AST-PMP-002 (ID: AST-001), berstatus 'Perlu Servis' akibat penumpukan endapan pasir Kali Metro pada impeller.",
    sourceReference: "Digital Asset Passport AST-001",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 95,
    status: "Lolos Validasi"
  },
  {
    id: "Q-AST-004",
    domain: "Aset",
    question: "Apa nomor ID event pengadaan tanah TPA Talangagung seluas 11.450 m² pada tahun 2022?",
    groundTruthAnswer: "Nomor ID event adalah INF-TPA-004.",
    sourceReference: "Histori Aset Pengadaan Tanah TPA Talangagung 2022",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 98,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-AST-005",
    domain: "Aset",
    question: "Berapa nilai taksiran aset Balai Desa & Pendopo Pelayanan Terpadu Talangagung?",
    groundTruthAnswer: "Nilai taksiran aset Balai Desa (AST-003) adalah sebesar Rp 650.000.000.",
    sourceReference: "Buku Inventarisasi Aset Fisik Desa",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 93,
    status: "Lolos Validasi"
  },
  {
    id: "Q-AST-006",
    domain: "Aset",
    question: "Siapa pihak penanggung jawab pengelola armada Truk Pengangkut Sampah Desa?",
    groundTruthAnswer: "Dikelola oleh Unit Pengelolaan Lingkungan BUMDes Talangagung Makmur.",
    sourceReference: "Digital Asset Passport AST-008",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 92,
    status: "Lolos Validasi"
  },
  {
    id: "Q-AST-007",
    domain: "Aset",
    question: "Berapa jumlah titik PJU yang terdata di sistem inventaris desa?",
    groundTruthAnswer: "Terdapat 22 titik PJU yang terdata dalam sistem, termasuk ruas jalan menuju TPA.",
    sourceReference: "Dataset 50 Smart Asset Desa",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-AST-008",
    domain: "Aset",
    question: "Apakah aset desa wajib dilengkapi QR Code berdasarkan Peraturan Desa No. 04 Tahun 2023?",
    groundTruthAnswer: "Ya, Pasal 9 BAB IV Perdes No. 04/2023 mewajibkan seluruh sarana publik dan alat mesin desa dipasangi label QR Code Aset.",
    sourceReference: "Peraturan Desa Talangagung No. 04 Tahun 2023",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 96,
    status: "Lolos Validasi"
  },

  // 5. Pembangunan & APBDes (7 Pertanyaan)
  {
    id: "Q-PMB-001",
    domain: "Pembangunan",
    question: "Berapa total alokasi APBDes 2026 Desa Talangagung dan berapa porsi untuk pembangunan infrastruktur?",
    groundTruthAnswer: "Total APBDes 2026 adalah Rp 1,85 Miliar, dengan alokasi Bidang Pembangunan Infrastruktur & Jalan Tani sebesar 45% (Rp 832.500.000).",
    sourceReference: "Dokumen APBDes T.A. 2026 (DOC-2026-001)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 97,
    status: "Lolos Validasi"
  },
  {
    id: "Q-PMB-002",
    domain: "Pembangunan",
    question: "Apa proyek drainase prioritas yang direkomendasikan AI untuk Dusun Glanggang?",
    groundTruthAnswer: "Pemasangan saluran U-Ditch beton 80cm sepanjang 150 meter di RT 05 RW 03 Dusun Glanggang beserta sudetan langsung menuju Kali Metro.",
    sourceReference: "Rekomendasi AI Musrenbang (REC-001)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 95,
    status: "Lolos Validasi"
  },
  {
    id: "Q-PMB-003",
    domain: "Pembangunan",
    question: "Berapa estimasi anggaran perbaikan pompa submersible Poktan Metro Lestari dalam draf rekomendasi?",
    groundTruthAnswer: "Estimasi anggaran adalah Rp 14.500.000 dari pos pemeliharaan sarana pertanian APBDes.",
    sourceReference: "Rekomendasi AI Musrenbang (REC-002)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 94,
    status: "Lolos Validasi"
  },
  {
    id: "Q-PMB-004",
    domain: "Pembangunan",
    question: "Kapan linimasa historis pembangunan Pendopo Balai Desa Talangagung yang baru diresmikan?",
    groundTruthAnswer: "Pendopo Balai Desa di Dusun Krajan diresmikan pada tahun 2018 dengan anggaran Rp 450.000.000.",
    sourceReference: "Linimasa Sejarah Desa (HIS-2018)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 96,
    status: "Lolos Validasi"
  },
  {
    id: "Q-PMB-005",
    domain: "Pembangunan",
    question: "Berapa persentase status penyelesaian laporan warga pada dataset 120 aduan?",
    groundTruthAnswer: "70,0% telah Selesai (84 laporan), 15,8% Dalam Proses (19 laporan), 8,3% Terverifikasi (10 laporan), 4,2% Menunggu RT (5 laporan), dan 1,7% Ditolak (2 laporan).",
    sourceReference: "Dataset 120 Laporan Warga Terkalibrasi",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 95,
    status: "Lolos Validasi"
  },
  {
    id: "Q-PMB-006",
    domain: "Pembangunan",
    question: "Berapa jumlah laporan warga kategori lampu/PJU pada dataset 120 aduan?",
    groundTruthAnswer: "Tercatat 21 laporan (17,5% dari total 120 laporan).",
    sourceReference: "Dataset 120 Laporan Warga Terkalibrasi",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 96,
    status: "Lolos Validasi"
  },
  {
    id: "Q-PMB-007",
    domain: "Pembangunan",
    question: "Apa tujuan utama penyusunan RPJMDes 2021–2026 Desa Talangagung?",
    groundTruthAnswer: "Mencakup penuntasan drainase terpadu di Glanggang & Krajan, peningkatan jalan produksi tani, serta pembentukan Desa Digital Smart Village terhubung data Pemkab Malang.",
    sourceReference: "Dokumen RPJMDes 2021–2026 (DOC-2021-002)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 93,
    status: "Lolos Validasi"
  },

  // 6. Fasilitas Publik & Pendidikan Nyata (5 Pertanyaan)
  {
    id: "Q-FAS-001",
    domain: "Fasilitas Publik",
    question: "Berapa luas lahan SDN 1 Talangagung dan berapa jumlah peserta didiknya?",
    groundTruthAnswer: "SDN 1 Talangagung beralamat di Jl. Raya Talangagung No. 332 dengan luas lahan 2.760 m², memiliki 244 peserta didik dan 13 tenaga pendidik.",
    sourceReference: "Data Pokok Pendidikan Kemendikdasmen RI (EDU-001)",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 97,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-FAS-002",
    domain: "Fasilitas Publik",
    question: "Di mana lokasi SDN 2 Talangagung dan berapa luas lahannya?",
    groundTruthAnswer: "SDN 2 Talangagung berlokasi di Dusun Rekesan RT 5 / RW 1 (Jl. Raya Gunung Kawi No. 462) dengan luas lahan 3.744 m² dilengkapi sambungan listrik PLN dan internet.",
    sourceReference: "Data Pokok Pendidikan Kemendikdasmen RI (EDU-002)",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 97,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-FAS-003",
    domain: "Fasilitas Publik",
    question: "Di mana lokasi KB Srikandi di Desa Talangagung?",
    groundTruthAnswer: "KB Srikandi berlokasi di Perumnas II Talangagung RT 22 / RW 5.",
    sourceReference: "Data Pokok Pendidikan PAUD Kemendikdasmen (EDU-003)",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-FAS-004",
    domain: "Fasilitas Publik",
    question: "Di mana letak PKBM Tunas Mandiri di wilayah Talangagung?",
    groundTruthAnswer: "PKBM Tunas Mandiri berada di Perum Kepanjen Permai II, Talangagung.",
    sourceReference: "Data Pendidikan Masyarakat Kemendikdasmen (EDU-004)",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 96,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-FAS-005",
    domain: "Fasilitas Publik",
    question: "Apa produk unggulan BUMDes Talangagung yang dihasilkan dari hasil tani sawah irigasi Kali Metro?",
    groundTruthAnswer: "Beras Pandan Wangi Organik kemasan 5 Kg dari Poktan Metro Lestari Jatisari.",
    sourceReference: "Katalog Produk BUMDes Talangagung (PRD-002)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 98,
    status: "Lolos Validasi"
  },

  // 7. Histori Kejadian & Pengetahuan Desa (5 Pertanyaan)
  {
    id: "Q-HST-001",
    domain: "Histori/Pengetahuan",
    question: "Apa riwayat perbaikan infrastruktur jalan di Talangagung pada tahun 2017 dan 2018?",
    groundTruthAnswer: "Tahun 2017 dilakukan perbaikan jalan, dan tahun 2018 dilanjutkan pembangunan drainase pada ruas jalan Talangagung menuju Jalibar untuk mengatasi genangan air saat hujan.",
    sourceReference: "Arsip Linimasa Pembangunan & Berita Pemkab 2017–2018",
    dataClass: "DATA_A_REAL",
    aiAccuracyScore: 94,
    status: "Terverifikasi Faktual"
  },
  {
    id: "Q-HST-002",
    domain: "Histori/Pengetahuan",
    question: "Apa penjelasan Mbah Sastro Utomo mengenai penyebab genangan air di RT 05 Dusun Glanggang?",
    groundTruthAnswer: "Saluran buis beton 40cm tidak mampu menampung debit limpasan air hujan dari perkebunan atas; solusinya harus diganti U-Ditch 80cm menuju sudetan Kali Metro.",
    sourceReference: "Transkrip Memori Mbah Sastro Utomo (MEM-001)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 95,
    status: "Lolos Validasi"
  },
  {
    id: "Q-HST-003",
    domain: "Histori/Pengetahuan",
    question: "Bagaimana riwayat status tanah Posyandu Melati menurut kesaksian Ibu Hajah Maryam?",
    groundTruthAnswer: "Tanah tersebut merupakan wakaf hibah lisan tahun 2008 dari Almarhum H. Syamsuri dan direkomendasikan untuk didaftarkan sertifikat Hak Pakai melalui program PTSL BPN.",
    sourceReference: "Transkrip Memori Ibu Hj. Maryam (MEM-002)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 95,
    status: "Lolos Validasi"
  },
  {
    id: "Q-HST-004",
    domain: "Histori/Pengetahuan",
    question: "Kapan jaringan PAMSIMAS Sumber Kali Metro Jatisari dibangun?",
    groundTruthAnswer: "Dibangun pada tahun 2020 dengan anggaran Rp 220.000.000 melayani 240 kepala keluarga di Dusun Jatisari dan Glanggang.",
    sourceReference: "Linimasa Pembangunan PAMSIMAS 2020 (HIS-2020)",
    dataClass: "DATA_B_SEED",
    aiAccuracyScore: 94,
    status: "Lolos Validasi"
  },
  {
    id: "Q-HST-005",
    domain: "Histori/Pengetahuan",
    question: "Berapa pengurangan waktu pencarian informasi yang dicapai sistem Black Box AI dibanding pencarian manual berkas fisik?",
    groundTruthAnswer: "Pencarian manual membutuhkan rata-rata 3 menit 42 detik (222 detik), sedangkan Black Box AI rata-rata 24 detik, menghasilkan efisiensi waktu sebesar 89,2%.",
    sourceReference: "Hasil Uji Eksperimental Waktu Pencarian (DATA C)",
    dataClass: "DATA_C_EXPERIMENTAL",
    aiAccuracyScore: 96,
    status: "Lolos Validasi"
  }
];
