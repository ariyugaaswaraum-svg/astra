import { 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  HistoryMilestone, 
  DecisionRecommendation, 
  VillageProfile,
  CitizenReport,
  LetterRequest,
  BroadcastAnnouncement,
  PreventiveTask,
  IoTSensorNode,
  JobVacancy,
  BumdesProduct
} from '../types';
import { initialSmart50Assets } from './smartAssetsData';
import { initialCalibratedReports } from './calibratedReportsData';
export { initialResearchQuestions, initialResearchMetrics, researchDataClasses } from './researchQuestionsData';

export const initialVillageProfile: VillageProfile = {
  name: "Desa Talangagung",
  subdistrict: "Kepanjen",
  regency: "Malang",
  province: "Jawa Timur",
  kadesName: "Drs. H. Bambang Susanto",
  secretaryName: "M. Arif Rahman, S.Sos",
  population: 8522, // Publikasi Kecamatan Kepanjen Dalam Angka 2025
  population2023: 8452, // BPS 2023 (4.188 L, 4.264 P)
  male2023: 4188,
  female2023: 4264,
  population2025: 8522,
  areaHa: 281.05, // RDTR Perkotaan Kepanjen 2024–2044
  areaKm2: 2.8105,
  totalRw: 5,
  totalRt: 27,
  densityPerKm2: 3032, // ±3.000 - 3.032 jiwa/km²
  avgPopPerRt: 316,
  ageCohorts: {
    age50_54: 618,
    age55_59: 624,
    age60_64: 433,
    age65Plus: 672
  },
  landStats: {
    unproductive2024Ha: 11,
    productive2022Ha: 72
  },
  rdtrSource: "RDTR Perkotaan Kepanjen 2024–2044",
  apbdesTotal: 1850000000, // Rp 1.85 Miliar
  blackBoxMemoryScore: 96,
  establishedYear: 1978
};

export const initialDocuments: DocumentItem[] = [
  {
    id: "DOC-TEFA-SMK-2026",
    title: "Profil Kemitraan Vokasi & Dokumen Kerjasama: SMK Muhammadiyah 1 Kepanjen (smkmuh1kepanjen.sch.id)",
    category: "Peraturan Desa",
    year: 2026,
    fileType: "PDF",
    summary: "Kemitraan strategis pendidikan vokasi dengan SMK Muhammadiyah 1 Kepanjen (Jl. KH. Ahmad Dahlan No. 34 Kepanjen). Memiliki 8 Kompetensi Keahlian (TPM, TOI, TKRO, TKJ, TBSM, MM/DKV, KI, TAB), kemitraan industri nasional (Astra, Denso, Hillcon, AHM), serta 4 Peran Siswa TeFa dalam Desa Black Box AI (Digitalisasi arsip, Pemetaan Web-GIS, Teknologi & IoT, Kurasi & Verifikasi Ground Truth).",
    keyEntities: ["SMK Muhammadiyah 1 Kepanjen", "8 Kompetensi Keahlian", "TPM, TOI, TKRO, TKJ, TBSM, DKV, KI, TAB", "Astra, Denso, Hillcon, AHM", "4 Peran Siswa TeFa", "smkmuh1kepanjen.sch.id"],
    tags: ["SMK Muhammadiyah 1 Kepanjen", "Teaching Factory", "TEFA", "Vokasi", "8 Jurusan", "Kepanjen", "Faktual"],
    content: "Dokumen Perjanjian Kerjasama (MoU) Kemitraan Vokasi dan Model Pembelajaran Teaching Factory antara Pemerintah Desa Talangagung dan SMK Muhammadiyah 1 Kepanjen (website: smkmuh1kepanjen.sch.id, alamat: Jl. KH. Ahmad Dahlan No. 34 Kepanjen). Memiliki 8 Kompetensi Keahlian: 1. Teknik Pemesinan (TPM), 2. Teknik Otomasi Industri (TOI), 3. Teknik Kendaraan Ringan Otomotif (TKRO), 4. Teknik Komputer dan Jaringan (TKJ), 5. Teknik dan Bisnis Sepeda Motor (TBSM), 6. Multimedia / Desain Komunikasi Visual (MM/DKV), 7. Kimia Industri (KI), 8. Teknik Alat Berat (TAB). Mitra Industri: PT Astra, Denso Manufacturing Indonesia, Hillcon, Astra Honda Motor (AHM). 4 Peran Siswa TeFa dalam Desa: 1. Digitalisasi (OCR/Metadata/Transkrip Sesepuh), 2. Pemetaan (GPS/Foto/QR Code/Web-GIS), 3. Teknologi (Frontend/REST API/Gemini AI/Sensor IoT), 4. Kurasi & Verifikasi (Audit Ground Truth 50 Soal Benchmark).",
    author: "SMK Muhammadiyah 1 Kepanjen & Pemdes Talangagung",
    createdAt: "2026-01-15",
    relatedObject: "Laboratorium Teaching Factory & Vokasi Desa",
    relatedParties: ["SMK Muhammadiyah 1 Kepanjen", "Pemerintah Desa Talangagung", "DUDI Mitra Industri"],
    relatedLinks: [
      { targetId: "DOC-2023-008", targetTitle: "Perdes Pengelolaan Aset & Inovasi", targetType: "doc", relationLabel: "Payung Hukum Kerjasama", year: 2023 }
    ]
  },
  {
    id: "DOC-IOT-FEEDER-2026",
    title: "Publikasi Riset & Berita Resmi: Smart Feeder & Kualitas Air Unikama di Pokdakan Molek Jaya Talangagung",
    category: "Laporan Pembangunan",
    year: 2026,
    fileType: "PDF",
    summary: "Inovasi IoT Smart Farming Smart Feeder dan Pemantau Kualitas Air Kolam Ikan binaan Pokdakan Molek Jaya dan Pokmas Anggrungan. Dikembangkan oleh Universitas PGRI Kanjuruhan Malang (Unikama) melalui Program PM-BEM 2025 Kemendikti Saintek RI. Diserahterimakan pada 23 November 2025 dan uji coba operasional lapangan pada 25 Agustus 2026. Dilengkapi 4 fitur: takaran pakan otomatis, sensor pH & suhu air real-time, remote aerator LoRa, dan panel surya mandiri 12V.",
    keyEntities: ["Smart Feeder Talangagung", "Pokdakan Molek Jaya", "Pokmas Anggrungan", "Universitas PGRI Kanjuruhan Malang (Unikama)", "PM-BEM 2025 Kemendikti Saintek", "Serah Terima 23 Nov 2025", "Uji Coba 25 Agustus 2026", "Panel Surya 12V"],
    tags: ["Smart Feeder", "IoT", "Pokdakan Molek Jaya", "Unikama", "PM-BEM", "25 Agustus 2026", "Faktual"],
    content: "Laporan Hasil Riset Terapan dan Implementasi Lapangan Inovasi Smart Feeder & Pemantau Kualitas Air Desa Talangagung. Dijalankan oleh Tim Pengabdian Universitas PGRI Kanjuruhan Malang (Unikama) didanai Kemendikti Saintek RI dalam skema Pengabdian Mahasiswa Berdampak (PM-BEM 2025). Serah terima alat: 23 November 2025. Uji coba operasional lapangan: 25 Agustus 2026. Kelompok Binaan: Pokdakan Molek Jaya & Pokmas Anggrungan Talangagung. 4 Fitur Utama: 1. Penjadwalan & takaran pakan presisi otomatis via mobile app, 2. Sensor derajat keasaman (pH 6.5-8.5) & suhu air kontinu real-time, 3. Kontrol aktivasi mesin aerator jarak jauh via LoRa/MQTT, 4. Catu daya mandiri Panel Surya Solar Cell 12V-13.4V bebas biaya listrik.",
    author: "Tim PM-BEM Unikama & Pokdakan Molek Jaya",
    createdAt: "2026-08-25",
    relatedObject: "Smart Feeder & Node Sensor Air Pokdakan Molek Jaya",
    relatedParties: ["Universitas PGRI Kanjuruhan Malang", "Kemendikti Saintek RI", "Pokdakan Molek Jaya", "Pemerintah Desa Talangagung"],
    relatedLinks: [
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 Desa Talangagung", targetType: "doc", relationLabel: "Dukungan Ketahanan Pangan Perikanan", year: 2026 }
    ]
  },
  {
    id: "DOC-KARNAVAL-2025",
    title: "Dokumentasi & Berita Resmi: Karnaval Desa Talangagung Peringatan HUT RI ke-80 (SudutKota.id)",
    category: "Laporan Pembangunan",
    year: 2025,
    fileType: "PDF",
    summary: "Dokumentasi resmi pelaksanaan Karnaval Desa Talangagung dalam rangka Peringatan HUT RI ke-80 pada Minggu, 31 Agustus 2025. Diikuti secara semarak oleh ribuan peserta dari 31 kontingen/kelompok yang mewakili seluruh RT, RW, sanggar seni budaya, dan kelembagaan desa. Penilaian juri berbobot 100%: Kreativitas (50% - Kunci Utama), Kesesuaian Tema (30%), Kerapian (10%), Sportivitas & Hormat pada Acara (10%).",
    keyEntities: ["Karnaval Desa Talangagung", "Peringatan HUT RI ke-80", "Minggu 31 Agustus 2025", "31 Kontingen Desa", "Kriteria Juri: Kreativitas 50%", "Kesesuaian Tema 30%", "SudutKota.id"],
    tags: ["Karnaval Desa", "HUT RI ke-80", "31 Kontingen", "31 Agustus 2025", "Kreativitas 50%", "SudutKota.id", "Faktual"],
    content: "Laporan Dokumentasi dan Berita Resmi Karnaval Desa Talangagung HUT RI ke-80. Waktu pelaksanaan: Minggu, 31 Agustus 2025. Jumlah peserta: Ribuan warga terbagi dalam 31 kontingen/kelompok dari 5 RW dan 27 RT serta lembaga sanggar seni desa. Tujuan: Pelestarian budaya nusantara, penguatan identitas bangsa, dan wadah generasi muda melestarikan warisan leluhur. 4 Kriteria Penilaian Juri: 1. Kreativitas (50% - Bobot Terbesar/Kunci Utama: inovasi koreografi, keunikan kostum tematik, aransemen musik), 2. Kesesuaian Tema (30%: tema kebangsaan & persatuan), 3. Kerapian (10%: barisan & keseragaman), 4. Sportivitas & Hormat pada Acara (10%: disiplin waktu & etika panggung kehormatan). Sumber Berita: SudutKota.id - Juri Karnaval Desa Talangagung Kepanjen Malang: Kreativitas Jadi Kunci Penilaian.",
    author: "Panitia Peringatan Hari Besar Nasional (PHBN) Desa Talangagung & SudutKota.id",
    createdAt: "2025-08-31",
    relatedObject: "Dokumentasi Budaya & Tradisi Desa Talangagung",
    relatedParties: ["Panitia PHBN Desa", "Juri Karnaval", "Pemerintah Desa Talangagung", "Seluruh Warga 31 Kontingen"],
    relatedLinks: [
      { targetId: "DOC-RDTR-2024", targetTitle: "RDTR Perkotaan Kepanjen 2024-2044", targetType: "doc", relationLabel: "Rute Karnaval Koridor Desa", year: 2024 }
    ]
  },
  {
    id: "DOC-BUMDES-MALANG-2025",
    title: "Publikasi JatimTimes & Data Legalitas Kemendes PDTT: Statistik BUMDes Kabupaten Malang (Februari 2025)",
    category: "Peraturan Desa",
    year: 2025,
    fileType: "PDF",
    summary: "Statistik dan legalitas BUMDes se-Kabupaten Malang per 21 Februari 2025. Dari 378 Desa di 33 kecamatan (100%), seluruhnya telah mendirikan BUMDes. Sebanyak 159 BUMDes telah mengantongi sertifikat Badan Hukum Resmi dari Kementerian Desa PDTT. Di Kecamatan Kepanjen, 4 BUMDes telah berbadan hukum lengkap termasuk BUMDes Talangagung Makmur.",
    keyEntities: ["378 Desa Memiliki BUMDes (100%)", "159 BUMDes Berbadan Hukum Resmi", "4 BUMDes Berbadan Hukum di Kec. Kepanjen", "BUMDes Talangagung Makmur", "Kemendes PDTT", "JatimTimes 2025"],
    tags: ["BUMDes", "Badan Hukum", "378 Desa", "159 Berbadan Hukum", "Kepanjen", "Kemendes PDTT", "Faktual"],
    content: "Data Rekapitulasi Legalitas dan Kelembagaan BUMDes Kabupaten Malang per Februari 2025. Publikasi resmi: JatimTimes (21 Februari 2025) - Akhirnya 378 Desa di Kabupaten Malang Miliki BUMDes. Capaian: 1. 378 Desa di 33 Kecamatan (100%) seluruhnya telah membentuk BUMDes. 2. 159 BUMDes telah berstatus Badan Hukum Resmi terdaftar di Kementerian Desa PDTT RI. 3. 4 BUMDes di Kecamatan Kepanjen telah berbadan hukum lengkap (salah satunya BUMDes Talangagung Makmur). Produk Unggulan BUMDes Talangagung: Beras Pandan Wangi Kali Metro 5kg (Rp 68.000), Pupuk Kompos Organik (Rp 25.000), Keripik Tempe Dusun Glanggang (Rp 15.000), Jasa Servis PAMSIMAS.",
    author: "Dinas PMD Kabupaten Malang & Kemendes PDTT RI",
    createdAt: "2025-02-21",
    relatedObject: "Etalase & Unit Usaha BUMDes Talangagung Makmur",
    relatedParties: ["Dinas PMD Kab. Malang", "Kemendes PDTT", "Pengurus BUMDes Talangagung Makmur"],
    relatedLinks: [
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 Desa Talangagung", targetType: "doc", relationLabel: "Penyertaan Modal BUMDes 25%", year: 2026 }
    ]
  },
  {
    id: "DOC-BPS-PROFIL-2025",
    title: "Publikasi BPS Kecamatan Kepanjen Dalam Angka 2025 & Monografi Profil Desa Talangagung",
    category: "Laporan Pembangunan",
    year: 2025,
    fileType: "PDF",
    summary: "Profil monografi dan statistik BPS resmi Desa Talangagung: 5 RW, 27 RT (rata-rata 316 jiwa/RT), cakupan sinyal 4G/LTE 100%, 6 unit Koperasi Simpan Pinjam (KSP), 3 sentra pertokoan, 1 pasar permanen, jalan aspal & beton lancar dilalui roda 4+, jumlah penduduk 8.522 jiwa (luas 281,05 Ha, kepadatan 3.032 jiwa/km²), batas 4 mata angin, aliran Sungai Metro & Molek, serta Terminal Talangagung (30.021 m²).",
    keyEntities: ["5 RW dan 27 RT", "Sinyal 4G/LTE 100%", "6 Koperasi Simpan Pinjam", "3 Pertokoan & 1 Pasar Permanen", "Jalan Aspal & Beton", "8.522 Jiwa", "Luas 281.05 Ha", "BPS Kepanjen 2025"],
    tags: ["BPS 2025", "Profil Desa", "5 RW 27 RT", "Sinyal 4G", "8522 Jiwa", "281.05 Ha", "Kepanjen", "Faktual"],
    content: "Publikasi BPS Kecamatan Kepanjen Dalam Angka 2025 dan Monografi Desa Talangagung. Indikator Utama: 5 Rukun Warga (RW) dan 27 Rukun Tetangga (RT). Sinyal seluler 4G/LTE Sangat Kuat di seluruh 27 RT (100% tercover). Lembaga keuangan: 6 Koperasi Simpan Pinjam (KSP). Sarana niaga: 3 sentra pertokoan dan 1 pasar permanen. Kondisi jalan: Aspal dan beton lancar dilalui kendaraan roda 4+ sepanjang tahun. Total penduduk: 8.522 jiwa (2025), luas wilayah 281,05 Hektare (2,8105 km²). Batas wilayah: Utara (Desa Penarukan & Sengguruh), Timur (Kel. Kepanjen & Ardirejo), Selatan (Desa Dilem & Mangunrejo), Barat (Sungai Metro & Desa Jatisari). Sumber irigasi utama: Sungai Metro dan Sungai Molek. Fasilitas transportasi: Terminal Talangagung Kepanjen seluas 30.021 m² (Origin Trans Jatim Koridor 2 Malang Raya).",
    author: "Badan Pusat Statistik (BPS) Kab. Malang & Pemdes Talangagung",
    createdAt: "2025-02-10",
    relatedObject: "Buku Monografi & Indikator Kesejahteraan BPS Desa",
    relatedParties: ["BPS Kabupaten Malang", "Pemerintah Desa Talangagung", "Kecamatan Kepanjen"],
    relatedLinks: [
      { targetId: "DOC-RDTR-2024", targetTitle: "RDTR Perkotaan Kepanjen 2024-2044", targetType: "doc", relationLabel: "Sinkronisasi Data Spasial & Demografi", year: 2024 }
    ]
  },
  {
    id: "DOC-TRANSJATIM-2026",
    title: "Pengembangan Rute Bus Trans Jatim Koridor 2: Origin Terminal Talangagung Kepanjen (Juni 2026)",
    category: "Laporan Pembangunan",
    year: 2026,
    fileType: "PDF",
    summary: "Terminal Talangagung di Kecamatan Kepanjen resmi ditetapkan menjadi titik awal (origin) rute baru bus Trans Jatim Koridor 2 yang menghubungkan Malang Selatan langsung ke Kota Malang (Rute: Terminal Talangagung -> Terminal Hamid Rusdi -> Terminal Arjosari). Ditargetkan beroperasi Oktober 2026 dengan armada 15 unit bus (14 unit operasional, 1 unit cadangan). Menjadi akses Trans Jatim pertama ke wilayah Malang Selatan.",
    keyEntities: ["Trans Jatim Koridor 2", "Origin Terminal Talangagung Kepanjen", "Terminal Hamid Rusdi", "Terminal Arjosari Malang Kota", "15 Unit Bus (14 Operasional, 1 Cadangan)", "Target Operasi Oktober 2026", "Akses Pertama Malang Selatan"],
    tags: ["Trans Jatim", "Koridor 2", "Terminal Talangagung", "Malang Selatan", "Kepanjen", "Oktober 2026", "Faktual"],
    content: "Laporan Perencanaan dan Pengoperasian Rute Bus Trans Jatim Koridor 2. Terminal Talangagung di Desa Talangagung, Kepanjen ditetapkan sebagai titik awal (origin) rute yang menghubungkan wilayah Malang Selatan langsung ke Kota Malang. Rute perjalanan: Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi -> Terminal Arjosari (Kota Malang). Ditargetkan beroperasi mulai Oktober 2026 dengan alokasi armada sebanyak 15 unit bus (14 unit operasional, 1 unit cadangan), sama seperti armada Koridor 1. Signifikansi: Rute ini adalah akses Trans Jatim pertama yang menjangkau wilayah Malang Selatan, menjadi katalis mobilitas warga dan konektivitas komuter Malang Raya. Sumber: JatimTimes, 14 Juni 2026 - Trans Jatim Merambah Malang Selatan, Rute Kepanjen-Arjosari Siap Mengaspal Oktober 2026.",
    author: "Dinas Perhubungan Provinsi Jawa Timur & Dishub Kab. Malang",
    createdAt: "2026-06-14",
    relatedObject: "Terminal Talangagung Kepanjen (Lahan 30.021 m²)",
    relatedParties: ["Dishub Provinsi Jawa Timur", "Dishub Kabupaten Malang", "Pemerintah Desa Talangagung"],
    relatedLinks: [
      { targetId: "INF-TRM-001", targetTitle: "Terminal Talangagung Kepanjen (Origin Trans Jatim Koridor 2)", targetType: "asset", relationLabel: "Aset Titik Awal (Origin)", year: 2026 },
      { targetId: "DOC-RDTR-2024", targetTitle: "RDTR Perkotaan Kepanjen 2024–2044", targetType: "doc", relationLabel: "Konektivitas Simpul Transportasi", year: 2024 }
    ]
  },
  {
    id: "DOC-2026-001",
    title: "APBDes T.A. 2026 Desa Talangagung Kepanjen",
    category: "APBDes",
    year: 2026,
    fileType: "PDF",
    summary: "Anggaran Pendapatan dan Belanja Desa tahun 2026 Desa Talangagung, Kec. Kepanjen, Kab. Malang. Total Pendapatan Rp 1,85 Miliar, dialokasikan untuk Bidang Pembangunan Infrastruktur & Jalan Tani (45%), Pemberdayaan UMKM & Petani (25%), Penyelenggaraan Pemerintahan & Layanan RT (20%), dan Kesehatan/Posyandu (10%).",
    keyEntities: ["Dana Desa Tahap I & II", "Silpa 2025", "Bagi Hasil Pajak Kab. Malang", "Operasional Kades & RT"],
    tags: ["Anggaran", "APBDes", "Keuangan", "2026", "Kepanjen", "Malang"],
    content: "Laporan Anggaran Pendapatan dan Belanja Desa (APBDes) Desa Talangagung, Kecamatan Kepanjen, Kabupaten Malang Tahun Anggaran 2026. Pendapatan Asli Desa (PADes): Rp 75.000.000. Dana Desa (DD): Rp 1.120.000.000. Alokasi Dana Desa (ADD Kab. Malang): Rp 580.000.000. Bagi Hasil Pajak & Retribusi Daerah: Rp 75.000.000. Total Belanja Pembangunan: Rp 832.500.000 mencakup perkerasan jalan usaha tani, drainase U-Ditch Dusun Glanggang, sarana irigasi Kali Metro, dan digitalisasi layanan warga.",
    author: "Sekretaris Desa (M. Arif Rahman)",
    createdAt: "2026-01-10",
    relatedObject: "Alokasi APBDes 2026 & Sarana Prasarana Desa",
    relatedParties: ["Pemerintah Desa Talangagung", "BPD Talangagung", "Dinas PMD Kab. Malang"],
    relatedLinks: [
      { targetId: "DOC-2021-002", targetTitle: "RPJMDes 2021-2026 Desa Talangagung", targetType: "doc", relationLabel: "Rencana Induk 6 Tahun", year: 2021 },
      { targetId: "DOC-RKPD-2026", targetTitle: "RKPD Kab. Malang (Evaluasi IPLT)", targetType: "doc", relationLabel: "Sinkronisasi APBD-APBDes", year: 2026 },
      { targetId: "MEM-001", targetTitle: "Memori Drainase RT 05 Glanggang (Mbah Sastro)", targetType: "memory", relationLabel: "Rujukan Faktual Pembangunan", year: 2019 }
    ]
  },
  {
    id: "DOC-RKPD-2026",
    title: "RKPD Kabupaten Malang Tahun 2026 (Status Evaluasi IPLT Talangagung)",
    category: "Laporan Pembangunan",
    year: 2026,
    fileType: "PDF",
    summary: "Dokumen Rencana Kerja Pemerintah Daerah Kabupaten Malang 2026 sub-bidang sanitasi dan lingkungan. Menyatakan secara eksplisit bahwa Instalasi Pengolahan Lumpur Tinja (IPLT) di Desa Talangagung tidak berfungsi sesuai standar teknis dan membutuhkan rekonstruksi.",
    keyEntities: ["IPLT Kabupaten Malang", "Desa Talangagung", "Dinas Cipta Karya", "Standar Sanitasi Nasional"],
    tags: ["IPLT", "Sanitasi", "RKPD 2026", "Talangagung", "Kabupaten Malang", "Faktual"],
    content: "Dokumen RKPD Kabupaten Malang Tahun Anggaran 2026 - Program Peningkatan Sarana dan Prasarana Pengolahan Air Limbah Domestik. Evaluasi Teknis: Fasilitas Instalasi Pengolahan Lumpur Tinja (IPLT) berlokasi di Desa Talangagung Kecamatan Kepanjen tercatat mengalami degradasi operasional dan tidak berfungsi sesuai standar teknis lingkungan, sehingga memerlukan rekonstruksi infrastruktur menyeluruh.",
    author: "Bappeda & Dinas PU Cipta Karya Kab. Malang",
    createdAt: "2026-01-05",
    relatedObject: "Instalasi Pengolahan Lumpur Tinja (IPLT) Talangagung",
    relatedParties: ["Bappeda Kab. Malang", "Dinas PU Cipta Karya Kab. Malang", "Dinas Lingkungan Hidup"],
    relatedLinks: [
      { targetId: "DOC-TPA-2025", targetTitle: "Pengadaan Tanah Akses TPA Talangagung", targetType: "doc", relationLabel: "Kawasan Berdampingan TPA", year: 2025 },
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 Desa Talangagung", targetType: "doc", relationLabel: "Usulan Program Bersama", year: 2026 }
    ]
  },
  {
    id: "DOC-RDTR-2024",
    title: "Rencana Detail Tata Ruang (RDTR) Perkotaan Kepanjen 2024–2044",
    category: "Peraturan Desa",
    year: 2024,
    fileType: "PDF",
    summary: "Dokumen resmi tata ruang menetapkan luas administrasi wilayah Desa Talangagung sebesar 281,05 hektare (2,8105 km²), mencakup zonasi pemukiman, koridor Jalibar, kawasan pertanian produktif, dan fasilitas TPA/Terminal.",
    keyEntities: ["Luas Wilayah 281.05 Ha", "RDTR Kepanjen", "Zonasi Jalibar", "Kawasan Hijau Kali Metro"],
    tags: ["RDTR", "Tata Ruang", "Luas Wilayah", "281.05 Ha", "Kepanjen", "Faktual"],
    content: "Peraturan Daerah Rencana Detail Tata Ruang Kawasan Perkotaan Kepanjen Tahun 2024-2044. Wilayah Desa Talangagung tercatat seluas 281,05 ha / 2,8105 km², berbatasan dengan Kali Metro di sisi timur, koridor lingkar barat Jalibar, dan pusat perkotaan Kepanjen. Terbagi atas 5 Rukun Warga (RW) dan 27 Rukun Tetangga (RT).",
    author: "Pemerintah Kabupaten Malang & Dinas Pertanahan",
    createdAt: "2024-06-15",
    relatedObject: "Wilayah Administrasi Desa Talangagung (281.05 Ha)",
    relatedParties: ["Pemerintah Kabupaten Malang", "Dinas Pertanahan & Tata Ruang", "BPN Kab. Malang"],
    relatedLinks: [
      { targetId: "DOC-2018-003", targetTitle: "Drainase Ruas Talangagung–Jalibar", targetType: "doc", relationLabel: "Koridor Jalibar Tata Ruang", year: 2018 },
      { targetId: "DOC-TPA-2025", targetTitle: "Pengadaan Tanah Akses TPA Talangagung", targetType: "doc", relationLabel: "Zonasi Khusus TPA", year: 2025 }
    ]
  },
  {
    id: "DOC-TPA-2025",
    title: "Berita Acara Pengadaan Tanah Akses TPA Talangagung (Februari–Maret 2025)",
    category: "Berita Acara",
    year: 2025,
    fileType: "Scan",
    summary: "Dokumen kronologi pengadaan 3 bidang tanah akses jalan menuju TPA Talangagung. Pada Februari 2025 dilaksanakan konsultasi publik dan peninjauan lapangan, dilanjutkan Maret 2025 pengukuran batas dan pemasangan patok tanda batas tanah terdampak.",
    keyEntities: ["Pengadaan Tanah 3 Bidang", "Akses Jalan TPA", "Konsultasi Publik Feb 2025", "Pemasangan Patok Mar 2025"],
    tags: ["TPA Talangagung", "Pengadaan Lahan", "Patok Batas", "2025", "Faktual"],
    content: "Berita Acara Konsultasi Publik dan Pengukuran Fisik Tanah Akses TPA Talangagung. Pelaksanaan: 1. Konsultasi publik dan sosialisasi kepada warga pemilik lahan pada 26 Februari 2025. 2. Pengukuran kadastral dan pemasangan patok batas 3 bidang tanah terdampak pada 4 Maret 2025 bekerjasama dengan BPN dan Pemkab Malang.",
    author: "Tim Pelaksana Pengadaan Tanah Pemkab Malang",
    createdAt: "2025-03-20",
    relatedObject: "TPA Wisata Edukasi Talangagung & Koridor Akses",
    relatedParties: ["Dinas Lingkungan Hidup Kab. Malang", "BPN Kabupaten Malang", "Warga Pemilik Lahan RT 01/RW 01"],
    relatedLinks: [
      { targetId: "DOC-TPA-MASTER", targetTitle: "Rekapitulasi Konsolidasi Luas Lahan & Fasilitas TPA Talangagung", targetType: "doc", relationLabel: "Master Data Lahan TPA", year: 2025 },
      { targetId: "DOC-PJU-2025", targetTitle: "22 Titik PJU LED 40W Ruas TPA", targetType: "doc", relationLabel: "Penerangan Jalur Akses", year: 2025 },
      { targetId: "DOC-RKPD-2026", targetTitle: "RKPD 2026 Evaluasi IPLT Talangagung", targetType: "doc", relationLabel: "Fasilitas Pengolahan Limbah Terpadu", year: 2026 },
      { targetId: "DOC-RDTR-2024", targetTitle: "RDTR Perkotaan Kepanjen 2024-2044", targetType: "doc", relationLabel: "Ketetapan Batas Zonasi", year: 2024 }
    ]
  },
  {
    id: "DOC-TPA-MASTER",
    title: "Rekapitulasi Konsolidasi Luas Lahan & Fasilitas Terpadu TPA Talangagung (2021–2025)",
    category: "Berita Acara",
    year: 2025,
    fileType: "PDF",
    summary: "Dokumen konsolidasi resmi kepemilikan dan pengadaan lahan TPA Talangagung menetapkan Total Luas Lahan Terdata saat ini adalah 13.393 m² (atau 1,3393 Hektare / ~1,34 Ha). Terdiri dari 2 tahap pengadaan utama: 1) Lahan Tapak Awal 2021 seluas 1.943 m² (3 bidang tanah: 554 m², 712 m², 677 m²; Aset INF-TPA-001 s/d 003) dan 2) Zona Perluasan 2022 seluas 11.450 m² (1,145 Ha; Aset INF-TPA-004), serta didukung pengadaan koridor akses jalan 3 bidang tanah (Februari–Maret 2025) dan 22 titik PJU LED 40W (Oktober 2025).",
    keyEntities: ["Total Luas 13.393 m²", "1,34 Hektare", "Lahan Awal 1.943 m² (2021)", "Zona Perluasan 11.450 m² (2022)", "Akses Jalan & 22 PJU (2025)"],
    tags: ["TPA Talangagung", "Total Luas", "13.393 m2", "1.34 Ha", "Konsolidasi Lahan", "Faktual"],
    content: "Buku Inventarisasi Aset & Rekapitulasi Historis Pengadaan Lahan TPA Talangagung 2021-2025. Total luas lahan TPA Talangagung yang terdaftar resmi dan terkonsolidasi adalah 13.393 m² (1,3393 Ha / ~1,34 Ha). Rincian tahap: Tahap 1 (2021) Lahan Tapak Awal Pemkab seluas 1.943 m² (Kavling A-554 554 m², Kavling B-712 712 m², Kavling C-677 677 m²; Aset INF-TPA-001 s/d 003); Tahap 2 (2022) Zona Perluasan seluas 11.450 m² / 1,145 Ha (Aset INF-TPA-004); dan Tahap 3 (2025) Koridor Akses Jalan 3 bidang tanah (Februari-Maret 2025, DOC-TPA-2025) serta pemasangan 22 Titik PJU LED 40W (Oktober 2025, DOC-PJU-2025). Fasilitas melayani gas biometana gratis ke 250+ KK warga sekitar.",
    author: "BPKAD & Dinas Lingkungan Hidup Kab. Malang",
    createdAt: "2025-10-31",
    relatedObject: "Kawasan Terpadu TPA Wisata Edukasi Talangagung (13.393 m²)",
    relatedParties: ["BPKAD Kab. Malang", "Dinas Lingkungan Hidup Kab. Malang", "BPN Kab. Malang", "Pemerintah Desa Talangagung"],
    relatedLinks: [
      { targetId: "DOC-TPA-2025", targetTitle: "Berita Acara Pengadaan Tanah Akses TPA", targetType: "doc", relationLabel: "Akses Jalan Masuk", year: 2025 },
      { targetId: "DOC-PJU-2025", targetTitle: "22 Titik PJU LED 40W Ruas TPA", targetType: "doc", relationLabel: "Penerangan Jalur Akses", year: 2025 },
      { targetId: "DOC-RDTR-2024", targetTitle: "RDTR Perkotaan Kepanjen 2024-2044", targetType: "doc", relationLabel: "Zonasi Wilayah Talangagung", year: 2024 }
    ]
  },
  {
    id: "DOC-PJU-2025",
    title: "Laporan Serah Terima 22 Titik PJU LED 40W Ruas Talangagung–TPA (Oktober 2025)",
    category: "Laporan Pembangunan",
    year: 2025,
    fileType: "PDF",
    summary: "Pemasangan 22 unit lampu Penerangan Jalan Umum (PJU) dengan spesifikasi lampu LED 40 watt beserta penambahan KWh meter baru di sepanjang ruas jalan utama Talangagung menuju Tempat Pemrosesan Akhir (TPA).",
    keyEntities: ["22 Titik PJU", "LED 40 Watt", "KWh Meter Baru", "Ruas Jalan Menuju TPA"],
    tags: ["PJU", "LED 40W", "22 Titik", "TPA Talangagung", "Okt 2025", "Faktual"],
    content: "Berita Acara Serah Terima Pekerjaan Pemasangan PJU Ruas Jalan Talangagung–TPA Tanggal 28 Oktober 2025. Telah diselesaikan pemasangan 22 tiang dan kap lampu LED 40 Watt hemat energi, penambahan sambungan daya listrik KWh meter PLN, dan uji nyala malam hari dalam kondisi 100% berfungsi normal.",
    author: "Dinas Perhubungan Kab. Malang & Tim Teknis Desa",
    createdAt: "2025-10-30",
    relatedObject: "22 Titik PJU Ruas Jalan Talangagung–TPA",
    relatedParties: ["Dinas Perhubungan Kab. Malang", "PLN UP3 Malang", "Pemerintah Desa Talangagung"],
    relatedLinks: [
      { targetId: "DOC-TPA-2025", targetTitle: "Pengadaan Tanah Akses TPA Talangagung", targetType: "doc", relationLabel: "Infrastruktur Koridor Akses", year: 2025 },
      { targetId: "DOC-2023-008", targetTitle: "Perdes No. 04/2023 Inventaris Aset Desa", targetType: "doc", relationLabel: "Pencatatan QR Aset PJU", year: 2023 }
    ]
  },
  {
    id: "DOC-2025-014",
    title: "Laporan Pemeliharaan Infrastruktur Jembatan Kali Metro Krajan No. 042/2024",
    category: "Laporan Pembangunan",
    year: 2024,
    fileType: "Scan",
    summary: "Laporan perbaikan konstruksi abutmen dan pengecatan gelagar baja Jembatan Kali Metro penghubung Dusun Krajan dan Dusun Jatisari pasca peningkatan debit air sungai hujan lebat. Total realisasi anggaran Rp 38.500.000.",
    keyEntities: ["Jembatan Kali Metro", "Tim Swakelola Dusun Krajan", "Pak Budi Teknisi Jembatan"],
    tags: ["Jembatan", "Kali Metro", "Pemeliharaan", "Krajan", "Kepanjen"],
    content: "Berita Acara dan Laporan Pekerjaan Servis Jembatan Kali Metro Desa Talangagung. Tanggal selesai: 22 Juli 2024. Pekerjaan mencakup penguatan pasangan batu kali pada talud sayap jembatan dan pelapisan anti-karat struktur gelagar. Kondisi terkini diserahterimakan dalam keadaan prima dan aman dilintasi armada hasil panen padi/tebu hingga tonase 6 ton.",
    author: "Kasi Kesejahteraan & Pembangunan (Eko Prasetyo)",
    createdAt: "2024-07-24",
    relatedObject: "Jembatan Kali Metro Krajan–Jatisari",
    relatedParties: ["Dinas PU Bina Marga Kab. Malang", "Tim Swakelola Dusun Krajan", "Kasi Pembangunan Desa"],
    relatedLinks: [
      { targetId: "MEM-003", targetTitle: "Musrenbangdes Perlindungan Sumber Kali Metro (Pak Sugeng)", targetType: "memory", relationLabel: "Kawasan Aliran Kali Metro", year: 2021 },
      { targetId: "DOC-2021-002", targetTitle: "RPJMDes 2021-2026 (Ketahanan Pangan Metro)", targetType: "doc", relationLabel: "Akses Transportasi Panen", year: 2021 }
    ]
  },
  {
    id: "DOC-2023-008",
    title: "Peraturan Desa No. 04 Tahun 2023 tentang Pengelolaan Aset & Inovasi Lingkungan",
    category: "Peraturan Desa",
    year: 2023,
    fileType: "PDF",
    summary: "Aturan hukum Pemerintah Desa Talangagung Kepanjen tentang tata kelola inventarisasi aset desa berbasis QR Code, pengelolaan tanah kas desa, serta penguatan edukasi energi ramah lingkungan.",
    keyEntities: ["Perdes Aset Desa", "BPD Talangagung", "Pengurus Aset Desa", "Kaur Keuangan"],
    tags: ["Aset", "Perdes", "Hukum Desa", "Inventaris", "Kepanjen"],
    content: "Peraturan Desa Talangagung Nomor 04 Tahun 2023. BAB IV Pasal 9: Setiap fasilitas publik, alat mesin pertanian, dan bangunan desa yang dibiayai APBDes atau bantuan Pemkab Malang wajib dipasangi kode QR Aset dan dicatat dalam Buku Inventaris Desa Black Box secara berkala.",
    author: "Kepala Desa & BPD Talangagung",
    createdAt: "2023-04-12",
    relatedObject: "Sistem Aset Digital QR Code & Fasilitas Desa",
    relatedParties: ["BPD Talangagung", "Kaur Keuangan & Aset", "Pengurus BUMDes"],
    relatedLinks: [
      { targetId: "MEM-002", targetTitle: "Status Tanah Hibah Posyandu Melati (Bu Hj. Maryam)", targetType: "memory", relationLabel: "Sertifikasi PTSL Aset Desa", year: 2008 },
      { targetId: "DOC-PJU-2025", targetTitle: "Serah Terima 22 Titik PJU Ruas TPA", targetType: "doc", relationLabel: "Inventarisasi Aset Baru", year: 2025 }
    ]
  },
  {
    id: "DOC-2021-002",
    title: "RPJMDes 2021-2026 Desa Talangagung Kecamatan Kepanjen",
    category: "RPJMDes",
    year: 2021,
    fileType: "PDF",
    summary: "Rencana Pembangunan Jangka Menengah Desa 6 Tahun. Prioritas: Penguatan ketahanan pangan irigasi Kali Metro, pemberdayaan UMKM olahan pangan Kepanjen, penurunan stunting posyandu, dan smart governance desa terintegrasi.",
    keyEntities: ["RPJMDes 6 Tahun", "Visi Misi Kades Kepanjen", "Rencana Tata Ruang Desa"],
    tags: ["RPJMDes", "Perencanaan", "Kepanjen", "Malang", "Visi Misi"],
    content: "Dokumen Perencanaan 6 Tahun Desa Talangagung Periode 2021-2026. Sasaran strategis: 1. Penuntasan drainase U-Ditch terpadu di Dusun Glanggang dan Krajan. 2. Peningkatan kapasitas jalan produksi tani RT 04 & RT 05. 3. Pembentukan Desa Digital Smart Village terhubung data Kabupaten Malang.",
    author: "Tim Penyusun RPJMDes Talangagung",
    createdAt: "2021-09-01",
    relatedObject: "Rencana Strategis Pembangunan Desa Talangagung",
    relatedParties: ["Tim Penyusun RPJMDes", "BPD Talangagung", "Dinas PMD Kab. Malang"],
    relatedLinks: [
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 Desa Talangagung", targetType: "doc", relationLabel: "Realisasi Tahunan", year: 2026 },
      { targetId: "DOC-2018-003", targetTitle: "Drainase Ruas Talangagung–Jalibar", targetType: "doc", relationLabel: "Kelanjutan Program Drainase", year: 2018 },
      { targetId: "MEM-003", targetTitle: "Memori Perlindungan Sumber Air Kali Metro", targetType: "memory", relationLabel: "Rujukan Air Bersih & Irigasi", year: 2021 }
    ]
  },
  {
    id: "DOC-2018-003",
    title: "Catatan Konstruksi Drainase Ruas Talangagung Menuju Jalibar (2018)",
    category: "Laporan Pembangunan",
    year: 2018,
    fileType: "Scan",
    summary: "Catatan penanganan genangan air hujan di jalan Talangagung–Jalibar tahun 2018 melalui pembangunan saluran drainase pinggir jalan yang mencapai progres fisik 70–80%.",
    keyEntities: ["Drainase Jalibar", "Genangan Air Hujan", "Talangagung–Jalibar", "Progres 70-80%"],
    tags: ["Drainase", "Jalibar", "2018", "Infrastruktur", "Faktual"],
    content: "Laporan Monitoring Pekerjaan Drainase Ruas Talangagung Menuju Jalibar Tahun 2018. Permasalahan: Badan jalan sering tergenang air saat hujan lebat akibat ketiadaan saluran samping. Solusi: Pembangunan saluran drainase pasangan batu dengan kemajuan fisik tercatat 70-80%.",
    author: "Dinas PU Bina Marga & Pemdes Talangagung",
    createdAt: "2018-11-10",
    relatedObject: "Drainase Jalan Poros Talangagung–Jalibar",
    relatedParties: ["Dinas PU Bina Marga Kab. Malang", "Pemerintah Desa Talangagung"],
    relatedLinks: [
      { targetId: "DOC-2019-005", targetTitle: "Berita Acara Luapan Irigasi Glanggang", targetType: "doc", relationLabel: "Dampak Limpasan Air", year: 2019 },
      { targetId: "MEM-001", targetTitle: "Memori Genangan Buis Beton RT 05 (Mbah Sastro)", targetType: "memory", relationLabel: "Analisis Teknis Aliran", year: 2019 }
    ]
  },
  {
    id: "DOC-2019-005",
    title: "Berita Acara Penanganan Luapan Air Saluran Irigasi Glanggang 2019",
    category: "Berita Acara",
    year: 2019,
    fileType: "Scan",
    summary: "Dokumen historis penanganan banjir luapan air hujan di pemukiman RT 05 Dusun Glanggang akibat gorong-gorong penyalur menuju Kali Metro mengalami sedimentasi dan ukuran terlalu sempit.",
    keyEntities: ["Gorong-gorong RT 05 Glanggang", "Kali Metro", "Kerja Bakti Warga RT 05"],
    tags: ["Irigasi", "Drainase", "Mitigasi", "Sejarah", "Glanggang"],
    content: "Berita Acara Musyawarah Tanggap Luapan Air Tanggal 18 November 2019. Luapan menggenangi 14 rumah di RT 05 RW 03 Dusun Glanggang. Kesimpulan: Saluran drainase selebar 40cm tidak mampu menampung debit limpasan air dari arah jalan raya dan persawahan atas. Solusi jangka panjang: Pelebaran menjadi box culvert / U-Ditch 80cm langsung menuju sudetan Kali Metro.",
    author: "Mantan Carik (Mbah Sastro Utomo)",
    createdAt: "2019-11-20",
    relatedObject: "Saluran Drainase & Gorong-gorong RT 05 Glanggang",
    relatedParties: ["Pengurus RW 03 Glanggang", "Mantan Carik (Mbah Sastro Utomo)", "Warga RT 05"],
    relatedLinks: [
      { targetId: "MEM-001", targetTitle: "Memori Solusi U-Ditch 80cm Mbah Sastro", targetType: "memory", relationLabel: "Kesaksian Historis", year: 2019 },
      { targetId: "DOC-2018-003", targetTitle: "Drainase Talangagung–Jalibar", targetType: "doc", relationLabel: "Hulu Saluran Air", year: 2018 },
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 (Alokasi Drainase Glanggang)", targetType: "doc", relationLabel: "Realisasi Rekonstruksi", year: 2026 }
    ]
  }
];

export const initialAssets: AssetItem[] = initialSmart50Assets;

export const initialHumanMemories: HumanMemory[] = [
  {
    id: "MEM-001",
    interviewee: "Mbah Sastro Utomo",
    role: "Mantan Carik (Sekdes) Talangagung Periode 1985-2010 & Tokoh Adat",
    period: "1985 - 2010",
    storyTitle: "Penyebab Genangan Berulang & Struktur Buis Beton Drainase RT 05 Glanggang",
    storyText: "Dusun Glanggang RT 05 letaknya berada di cekungan alami limpasan air dari arah perkebunan tebu atas dan perumahan. Pada tahun 2019 pernah dipasang buis beton 40cm, tetapi setiap curah hujan tinggi air tetap meluap karena salurannya menyempit sebelum masuk Kali Metro. Jika desa mau mengaspal kembali jalan tani tersebut, salurannya wajib diganti U-Ditch minimal lebar 80cm tembus ke Kali Metro agar aspal tidak rontok amblas setiap musim rendeng.",
    extractedKnowledge: {
      problem: "Genangan air berulang dan badan jalan RT 05 Glanggang mudah retak/amblas",
      location: "Dusun 3 (Glanggang) RT 05 / RW 03",
      solution: "Pemasangan saluran U-Ditch beton 80cm sepanjang 150 meter dan normalisasi sudetan ke Kali Metro",
      year: 2019,
      stakeholders: ["Mbah Sastro Utomo", "Pengurus RW 03 Glanggang", "Dinas PU Pengairan Kab. Malang"]
    },
    tags: ["Drainase", "RT 05", "Glanggang", "Kali Metro", "Mbah Sastro", "Kepanjen"],
    dateRecorded: "2026-02-01",
    relatedObject: "Saluran Drainase & Jalan Usaha Tani RT 05 Glanggang",
    relatedParties: ["Dinas PU Pengairan Kab. Malang", "Pengurus RW 03 Glanggang", "Mbah Sastro Utomo"],
    relatedLinks: [
      { targetId: "DOC-2019-005", targetTitle: "Berita Acara Luapan Irigasi Glanggang 2019", targetType: "doc", relationLabel: "Dokumen Peristiwa Banjir", year: 2019 },
      { targetId: "DOC-2018-003", targetTitle: "Drainase Talangagung–Jalibar", targetType: "doc", relationLabel: "Koneksi Saluran Utama", year: 2018 },
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 (Alokasi U-Ditch)", targetType: "doc", relationLabel: "Tindak Lanjut APBDes", year: 2026 }
    ]
  },
  {
    id: "MEM-002",
    interviewee: "Ibu Hajah Maryam",
    role: "Ketua Kader Posyandu Lansia & Tokoh Perempuan Dusun Glanggang",
    period: "2006 - Sekarang",
    storyTitle: "Status Tanah Hibah Posyandu Melati Dusun Glanggang",
    storyText: "Bangunan Posyandu Melati di Dusun Glanggang berdiri di atas tanah wakaf hibah lisan dari keluarga Almarhum H. Syamsuri pada tahun 2008. Surat penyerahan letter C dan bukti tanda tangan saksi tersimpan di lemari arsip Balai Desa. Untuk mencegah persoalan waris di kemudian hari, Pemerintah Desa Talangagung perlu mendaftarkan tanah tersebut ke BPN Kabupaten Malang melalui program PTSL.",
    extractedKnowledge: {
      problem: "Status hukum tanah Posyandu Melati belum bersertifikat Hak Pakai Pemdes",
      location: "Dusun 3 (Glanggang) RT 02 / RW 03",
      solution: "Penerbitan Sertifikat Hak Pakai Aset Desa via PTSL bekerjasama dengan Kantor BPN Kabupaten Malang",
      year: 2008,
      stakeholders: ["Keluarga Alm. H. Syamsuri", "Kaur Pemerintahan", "BPN Kab. Malang"]
    },
    tags: ["Posyandu", "Tanah Kas Desa", "Hibah", "Legalitas Aset", "PTSL"],
    dateRecorded: "2026-01-20",
    relatedObject: "Bangunan & Tanah Posyandu Melati Dusun Glanggang",
    relatedParties: ["Keluarga Alm. H. Syamsuri", "Kantor Pertanahan/BPN Kab. Malang", "Kaur Pemerintahan Desa", "Kader Posyandu"],
    relatedLinks: [
      { targetId: "DOC-2023-008", targetTitle: "Perdes No. 04/2023 Pengelolaan Aset Desa", targetType: "doc", relationLabel: "Dasar Hukum Sertifikasi Aset", year: 2023 },
      { targetId: "DOC-2026-001", targetTitle: "APBDes T.A. 2026 (Alokasi Posyandu)", targetType: "doc", relationLabel: "Alokasi Operasional Posyandu", year: 2026 }
    ]
  },
  {
    id: "MEM-003",
    interviewee: "Pak Sugeng Riyadi",
    role: "Ketua BPD Talangagung Periode 2018-2024",
    period: "2018-2024",
    storyTitle: "Kesepakatan Musrenbangdes Perlindungan Sumber Air Kali Metro",
    storyText: "Sumber mata air di bantaran Kali Metro Dusun Jatisari pernah diuji laboratorium Dinas Kesehatan Kabupaten Malang pada tahun 2021 dan terbukti jernih dengan baku mutu air minum tinggi. Telah disepakati dalam musyawarah desa bahwa sumber air tersebut dilindungi dengan Perdes dan dikelola secara mandiri oleh BUMDes Talangagung Makmur untuk melayani kebutuhan warga desa.",
    extractedKnowledge: {
      problem: "Potensi eksploitasi swasta atas sumber mata air jernih Kali Metro",
      location: "Bantaran Kali Metro Dusun 2 (Jatisari)",
      solution: "Penerbitan Perdes Perlindungan Sumber Daya Air & Penguatan Unit Air Bersih PAMSIMAS BUMDes",
      year: 2021,
      stakeholders: ["BPD Talangagung", "Dinkes Kab. Malang", "BUMDes Talangagung Makmur"]
    },
    tags: ["Mata Air", "Kali Metro", "BUMDes", "PAMDes", "Kepanjen"],
    dateRecorded: "2025-11-12",
    relatedObject: "Sumber Mata Air & Jaringan PAMSIMAS Kali Metro Jatisari",
    relatedParties: ["BPD Talangagung", "Dinas Kesehatan Kab. Malang", "BUMDes Talangagung Makmur", "Poktan Jatisari"],
    relatedLinks: [
      { targetId: "DOC-2025-014", targetTitle: "Laporan Pemeliharaan Jembatan Kali Metro", targetType: "doc", relationLabel: "Infrastruktur Bantaran Metro", year: 2024 },
      { targetId: "DOC-2021-002", targetTitle: "RPJMDes 2021-2026 (Air Bersih & Pangan)", targetType: "doc", relationLabel: "Perencanaan Jangka Menengah", year: 2021 },
      { targetId: "DOC-2023-008", targetTitle: "Perdes No. 04/2023 Pengelolaan Aset & Inovasi", targetType: "doc", relationLabel: "Regulasi Mandiri BUMDes", year: 2023 }
    ]
  }
];

export const initialHistoryMilestones: HistoryMilestone[] = [
  {
    id: "HIS-2017",
    year: 2017,
    title: "Perbaikan Infrastruktur Jalan Wilayah Desa Talangagung",
    category: "Infrastruktur",
    description: "Rehabilitasi berkala ruas jalan poros dan pengaspalan ruas penghubung permukiman di Desa Talangagung Kepanjen.",
    budget: 180000000,
    impact: "Memperlancar konektivitas transportasi harian dan mobilitas hasil bumi pertanian."
  },
  {
    id: "HIS-2018-DRN",
    year: 2018,
    title: "Pembangunan Drainase Ruas Jalan Talangagung Menuju Jalibar",
    category: "Infrastruktur",
    description: "Pembangunan saluran drainase pembuangan air hujan sepanjang jalur Talangagung–Jalibar untuk mencegah genangan air berulang dengan progres fisik 70–80%.",
    budget: 210000000,
    relatedDocIds: ["DOC-2018-003"],
    impact: "Mereduksi genangan banjir pada ruas jalan utama penghubung jalur lingkar barat."
  },
  {
    id: "HIS-2018",
    year: 2018,
    title: "Pembangunan & Peresmian Pendopo Balai Desa Talangagung Baru",
    category: "Pemerintahan",
    description: "Pemindahan dan perluasan pusat pelayanan administrasi desa ke kompleks balai desa berkonsep joglo terbuka terpadu di Dusun Krajan, Kepanjen.",
    budget: 450000000,
    relatedAssetIds: ["AST-003"],
    impact: "Mempercepat waktu pelayanan surat warga menjadi serba cepat 10-15 menit."
  },
  {
    id: "HIS-2020",
    year: 2020,
    title: "Pembangunan Jaringan PAMSIMAS Sumber Kali Metro Jatisari",
    category: "Kesejahteraan & Kesehatan",
    description: "Pemasangan instalasi pipa transmisi air bersih dan pompa submersible melayani 240 kepala keluarga di Dusun Jatisari dan Dusun Glanggang.",
    budget: 220000000,
    relatedAssetIds: ["AST-001", "AST-007"],
    impact: "Menuntaskan sanitasi air bersih warga dan mencukupi kebutuhan irigasi sayur/padi musim kemarau."
  },
  {
    id: "HIS-2021",
    year: 2021,
    title: "Pencatatan 3 Bidang Tanah Aset Pemkab di Talangagung (554 m², 712 m², 677 m²)",
    category: "Tata Kelola Aset",
    description: "Inventarisasi dan legalisasi 3 bidang tanah milik Pemerintah Kabupaten Malang di kawasan Talangagung seluas total 1.943 m².",
    budget: 0,
    relatedAssetIds: ["INF-TPA-001", "INF-TPA-002", "INF-TPA-003"],
    impact: "Memperkuat kepastian hukum tapak infrastruktur publik daerah."
  },
  {
    id: "HIS-2022",
    year: 2022,
    title: "Pengadaan Lahan Zona Perluasan TPA Talangagung Seluas 11.450 m²",
    category: "Lingkungan Hidup",
    description: "Pemerintah Kabupaten Malang merealisasikan pembebasan dan pengadaan tanah zona perluasan TPA Talangagung seluas 11.450 m².",
    budget: 5725000000,
    relatedAssetIds: ["INF-TPA-004"],
    impact: "Menjamin ketersediaan kapasitas pengolahan sampah dan edukasi energi biomassa di Kepanjen."
  },
  {
    id: "HIS-2023",
    year: 2023,
    title: "Digitalisasi UMKM Olahan Pertanian & Perdes QR Code Aset",
    category: "Teknologi & Ekonomi",
    description: "Pengesahan Perdes No. 04/2023 serta peluncuran katalog digital produk UMKM olahan singkong, keripik, dan hasil tani unggulan Kepanjen.",
    budget: 55000000,
    relatedDocIds: ["DOC-2023-008"],
    impact: "Pemberdayaan 50 pelaku UMKM lokal dan inventarisasi 50 aset fisik desa ber-QR Code."
  },
  {
    id: "HIS-2024",
    year: 2024,
    title: "Perkuatan & Renovasi Jembatan Kali Metro Krajan",
    category: "Infrastruktur",
    description: "Penguatan talud abutmen batu kali dan peremajaan lantai jembatan penghubung Dusun Krajan dan Jatisari pasca curah hujan tinggi.",
    budget: 38500000,
    relatedAssetIds: ["AST-004"],
    relatedDocIds: ["DOC-2025-014"],
    impact: "Menjamin kelancaran angkutan hasil panen padi seluas 140 hektar di wilayah Kepanjen."
  },
  {
    id: "HIS-2025-FEB",
    year: 2025,
    title: "Konsultasi Publik & Tinjau Lapangan Akses Jalan TPA Talangagung",
    category: "Pemerintahan & Lahan",
    description: "Pelaksanaan forum konsultasi publik dan peninjauan lapangan terkait rencana pengadaan 3 bidang tanah akses jalan TPA pada Februari 2025.",
    budget: 15000000,
    relatedDocIds: ["DOC-TPA-2025"],
    impact: "Tercapainya mufakat sosial antara warga terdampak dan Pemerintah Daerah."
  },
  {
    id: "HIS-2025-MAR",
    year: 2025,
    title: "Pengukuran Kadastral & Pemasangan Patok Batas Akses TPA",
    category: "Tata Kelola Aset",
    description: "Pelaksanaan pengukuran batas resmi dan pemasangan patok fisik pada 3 bidang tanah terdampak pengadaan akses TPA pada Maret 2025.",
    budget: 25000000,
    relatedDocIds: ["DOC-TPA-2025"],
    impact: "Ketepatan koordinat batas lahan akses TPA terverifikasi instansi pertanahan."
  },
  {
    id: "HIS-2025-OKT",
    year: 2025,
    title: "Pemasangan 22 Titik PJU LED 40W Ruas Jalan Talangagung–TPA",
    category: "Infrastruktur & Energi",
    description: "Pemasangan 22 tiang lampu LED 40 Watt hemat energi beserta instalasi meteran KWh baru di sepanjang jalan akses TPA pada Oktober 2025.",
    budget: 77000000,
    relatedDocIds: ["DOC-PJU-2025"],
    impact: "Meningkatkan keselamatan berkendara warga dan petugas kebersihan pada malam hari."
  },
  {
    id: "HIS-2026",
    year: 2026,
    title: "Penerapan Sistem Desa Black Box AI & Rekomendasi Rekonstruksi IPLT",
    category: "Smart Village Governance",
    description: "Integrasi memori digital desa dan asisten AI pintar berbasis Gemini untuk menjaga rekam jejak pembangunan, dokumen, dan tindak lanjut rekomendasi IPLT RKPD 2026.",
    budget: 30000000,
    relatedDocIds: ["DOC-RKPD-2026", "DOC-2026-001"],
    impact: "Memori dan kearifan desa tersimpan abadi serta memangkas birokrasi surat RT-RW-Desa menjadi 100% digital."
  },
  {
    id: "HIS-2026-TRM",
    year: 2026,
    title: "Penetapan Terminal Talangagung sebagai Origin Trans Jatim Koridor 2",
    category: "Infrastruktur & Transportasi",
    description: "Penetapan Terminal Talangagung Kepanjen sebagai titik awal (origin) rute baru bus Trans Jatim Koridor 2 (Terminal Talangagung Kepanjen -> Terminal Hamid Rusdi -> Terminal Arjosari Kota Malang) dengan target operasi Oktober 2026 dan 15 unit bus.",
    budget: 350000000,
    relatedAssetIds: ["INF-TRM-001"],
    relatedDocIds: ["DOC-TRANSJATIM-2026"],
    impact: "Akses Trans Jatim pertama yang menjangkau Malang Selatan, menjadi katalis mobilitas warga dan konektivitas komuter Malang Raya."
  }
];

export const initialRecommendations: DecisionRecommendation[] = [
  {
    id: "REC-001",
    title: "Pemasangan U-Ditch Drainase 80cm & Pengaspalan Jalan RT 05 Glanggang",
    category: "Infrastruktur & Mitigasi Banjir",
    urgencyScore: 94,
    urgencyLevel: "Sangat Tinggi",
    estimatedBudget: 75000000,
    rationale: "Berdasarkan analisis silang data kondisi Jalan Usaha Tani RT 05 (AST-002), Berita Acara Luapan Air 2019, dan kesaksian Mbah Sastro Utomo (MEM-001), kerusakan jalan terjadi karena gorong-gorong sempit (40cm). Perbaikan aspal tanpa memasang U-Ditch 80cm menuju Kali Metro akan menyebabkan jalan kembali amblas setiap musim hujan.",
    sourceAssets: ["Jalan Usaha Tani & Drainase RT 05 Glanggang (AST-002)"],
    sourceDocs: ["RPJMDes 2021-2026 (DOC-2021-002)"],
    sourceMemories: ["Wawancara Mbah Sastro Utomo - Penyebab Genangan Drainase RT 05 Glanggang (MEM-001)"],
    citizenImpact: "Mencegah genangan air di 14 rumah warga RT 05 Glanggang dan memperpanjang ketahanan jalan hingga 10 tahun.",
    draftProposalText: "USULAN RKP DESA 2027: Pekerjaan konstruksi saluran U-Ditch beton 80cm sepanjang 150 meter di RT 05 RW 03 Dusun Glanggang dilengkapi sudetan pengalir langsung ke Kali Metro dan pelapisan aspal hotmix agregat A.",
    status: "Draf AI"
  },
  {
    id: "REC-002",
    title: "Overhaul Mesin Pompa Submersible & Panel Listrik Poktan Metro Lestari",
    category: "Pertanian & Ketahanan Pangan",
    urgencyScore: 86,
    urgencyLevel: "Tinggi",
    estimatedBudget: 14500000,
    rationale: "Pompa Air Jatisari (AST-001) memiliki catatan servis berulang akibat pasir Kali Metro. Saat ini status 'Perlu Servis'. Perbaikan wajib selesai sebelum masuk musim tanam kemarau agar 72 hektar sawah produktif petani Dusun Jatisari tetap terairi.",
    sourceAssets: ["Pompa Air Pertanian Submersible Poktan Metro Lestari (AST-001)"],
    sourceDocs: ["APBDes 2026 Bidang Pembangunan (DOC-2026-001)"],
    sourceMemories: ["Kesepakatan Musrenbangdes Sumber Air Kali Metro (MEM-003)"],
    citizenImpact: "Menjamin ketersediaan air irigasi bagi 90 petani anggota Poktan Metro Lestari.",
    draftProposalText: "DRAF KEPUTUSAN KADES: Dialokasikan dana pemeliharaan darurat mesin pompa submersible Dusun Jatisari senilai Rp 14.500.000 dari Pos Belanja Pemeliharaan Sarana Pertanian T.A. 2026.",
    status: "Dalam Peninjauan"
  },
  {
    id: "REC-003",
    title: "Sertifikasi Hak Pakai BPN Kab. Malang untuk Tanah Posyandu Melati Glanggang",
    category: "Legalitas & Tata Kelola Aset",
    urgencyScore: 80,
    urgencyLevel: "Sedang",
    estimatedBudget: 9500000,
    rationale: "Mengacu pada memori Ibu Hajah Maryam (MEM-002) dan Perdes No. 04/2023 (DOC-2023-008), status hibah lisan tahun 2008 berisiko jika tidak segera disertifikatkan secara resmi atas nama Pemdes Talangagung.",
    sourceAssets: ["Balai Posyandu Melati Dusun Glanggang (AST-006)"],
    sourceDocs: ["Perdes Aset No. 04/2023 (DOC-2023-008)"],
    sourceMemories: ["Ibu Hajah Maryam - Hibah Tanah Posyandu 2008 (MEM-002)"],
    citizenImpact: "Memberikan kepastian hukum tetap bagi layanan kesehatan balita dan lansia Dusun Glanggang.",
    draftProposalText: "USULAN PROGRAM: Pengurusan Sertifikat Hak Pakai atas nama Pemerintah Desa Talangagung melalui skema PTSL bekerjasama dengan Kantor Pertanahan BPN Kabupaten Malang.",
    status: "Disetujui Kades"
  },
  {
    id: "REC-004",
    title: "Koordinasi Rekonstruksi Instalasi Pengolahan Lumpur Tinja (IPLT) dengan Pemkab",
    category: "Sanitasi & Lingkungan Hidup",
    urgencyScore: 92,
    urgencyLevel: "Sangat Tinggi",
    estimatedBudget: 450000000,
    rationale: "Dokumen RKPD Kabupaten Malang 2026 secara formal mencatat fasilitas IPLT di Talangagung tidak berfungsi sesuai standar teknis. Pemdes perlu melayangkan surat advokasi prioritas rekonstruksi ke Dinas PU Cipta Karya dan DLH Kab. Malang.",
    sourceAssets: ["Instalasi Pengolahan Lumpur Tinja Kabupaten Malang (INF-IPLT-001)"],
    sourceDocs: ["RKPD Kabupaten Malang 2026 (DOC-RKPD-2026)"],
    sourceMemories: [],
    citizenImpact: "Mencegah pencemaran air tanah bagi 8.522 penduduk Desa Talangagung dan permukiman sekitar Kepanjen.",
    draftProposalText: "SURAT ADVOKASI KADES: Permohonan percepatan lelang rekonstruksi instalasi unit IPLT Talangagung dalam alokasi APBD Kabupaten Malang 2026/2027.",
    status: "Draf AI"
  }
];

export const initialCitizenReports: CitizenReport[] = initialCalibratedReports;

export const initialLetterRequests: LetterRequest[] = [
  {
    id: "SRT-2026-001",
    citizenId: "WARGA-001",
    applicantName: "Pak Budi Santoso",
    nik: "3507051203850003",
    rtRw: "RT 02 / RW 01",
    dusun: "Dusun 1 (Krajan)",
    letterType: "Surat Keterangan Usaha (SKU)",
    purpose: "Pengajuan KUR Mikro Bank Jatim / BRI untuk usaha Warung Sembako Barokah RT 02",
    status: "Menunggu Persetujuan RT",
    requestedAt: "2026-08-20 08:15",
    dataClassification: "PROTOTYPE_SIMULATION",
    accessLevel: "RESTRICTED_PERSONAL"
  },
  {
    id: "SRT-2026-002",
    citizenId: "WARGA-001",
    applicantName: "Pak Budi Santoso",
    nik: "3507051203850003",
    rtRw: "RT 02 / RW 01",
    dusun: "Dusun 1 (Krajan)",
    letterType: "Surat Pengantar KTP/KK",
    purpose: "Pembaruan berkas Kartu Keluarga & e-KTP baru",
    status: "Disetujui RT",
    requestedAt: "2026-08-19 10:20",
    approvedAt: "2026-08-19 11:00",
    rtStampCode: "RT02-RW01-TALANGAGUNG-VERIFIED-7890",
    dataClassification: "PROTOTYPE_SIMULATION",
    accessLevel: "RESTRICTED_PERSONAL"
  },
  {
    id: "SRT-2026-003",
    citizenId: "WARGA-002",
    applicantName: "Dewi Lestari",
    nik: "3507054508950007",
    rtRw: "RT 05 / RW 03",
    dusun: "Dusun 3 (Glanggang)",
    letterType: "Surat Keterangan Domisili",
    purpose: "Persyaratan berkas lamaran kerja di kawasan industri Kepanjen Malang",
    status: "Disetujui RT",
    requestedAt: "2026-08-18 10:20",
    approvedAt: "2026-08-18 11:00",
    rtStampCode: "RT05-RW03-TALANGAGUNG-VERIFIED-7890",
    dataClassification: "PROTOTYPE_SIMULATION",
    accessLevel: "RESTRICTED_PERSONAL"
  },
  {
    id: "SRT-2026-004",
    citizenId: "WARGA-003",
    applicantName: "Kurniawan",
    nik: "3507051903880001",
    rtRw: "RT 03 / RW 02",
    dusun: "Dusun 2 (Jatisari)",
    letterType: "Surat Keterangan Tidak Mampu (SKTM)",
    purpose: "Pengajuan beasiswa KIP Kuliah di Perguruan Tinggi Negeri Malang",
    status: "Selesai di Pemerintah Desa",
    requestedAt: "2026-08-16 13:00",
    approvedAt: "2026-08-16 14:10",
    rtStampCode: "RT03-RW02-TALANGAGUNG-VERIFIED-1122",
    dataClassification: "PROTOTYPE_SIMULATION",
    accessLevel: "RESTRICTED_PERSONAL"
  }
];

export const initialAnnouncements: BroadcastAnnouncement[] = [
  {
    id: "ANN-001",
    title: "Jadwal Posyandu Balita & Lansia Melati Dusun Krajan",
    senderRole: "Bidan Desa",
    senderName: "Bidan Nurhalimah, Amd.Keb",
    targetScope: "Warga RT 02",
    content: "Diinformasikan kepada warga Dusun Krajan RT 02, Posyandu Balita & Lansia Melati buka besok Sabtu pukul 08.30 WIB di Pos Pertemuan RT 02. Tersedia imunisasi lengkap, cek tensi gula darah gratis, serta Pemberian Makanan Tambahan (PMT) sehat.",
    date: "2026-08-21",
    priority: "Penting",
    category: "Posyandu"
  },
  {
    id: "ANN-002",
    title: "Kerja Bakti Bersih Saluran Sudetan Kali Metro RW 01",
    senderRole: "Ketua RW",
    senderName: "Pak RW Sutrisno",
    targetScope: "Warga RW 01",
    content: "Menyambut musim hujan dan menjaga kelancaran aliran air, seluruh warga RT 01 s/d RT 05 RW 01 diimbau membawa cangkul & karung untuk kerja bakti membersihkan saluran sudetan Kali Metro hari Minggu pukul 06.30 WIB.",
    date: "2026-08-23",
    priority: "Info",
    category: "Kerja Bakti"
  },
  {
    id: "ANN-003",
    title: "Penyaluran Bantuan Cadangan Beras di Balai Desa Talangagung",
    senderRole: "Kepala Desa",
    senderName: "Drs. H. Bambang Susanto",
    targetScope: "Semua Warga Desa",
    content: "Bagi KPM terdaftar, penyaluran beras bantuan pangan 10kg dari Bapanas dilaksanakan di Pendopo Balai Desa Talangagung Kepanjen pada hari Senin pukul 08.00 WIB dengan membawa KTP dan KK asli.",
    date: "2026-08-25",
    priority: "Penting",
    category: "Bansos"
  }
];

// 1. Preventive Maintenance Tasks Data
export const initialPreventiveTasks: PreventiveTask[] = [
  {
    id: "PM-001",
    assetId: "AST-001",
    assetName: "Pompa Air Submersible Poktan Metro Lestari",
    category: "Mesin Pertanian",
    taskTitle: "Inspeksi Impeller & Penggantian Seal Pasir Kali Metro",
    intervalType: "Jam Operasional",
    currentHours: 245,
    nextDueHours: 250,
    dueDate: "2026-08-28",
    status: "Jatuh Tempo Segera",
    assignedTechnician: "Siswa TEFA SMK Mesin Kepanjen & Mekanik Desa",
    priority: "Kritis",
    checklist: [
      { item: "Uji arus start motor & tegangan induksi", done: true },
      { item: "Pembersihan endapan pasir Kali Metro pada kisi strainer", done: true },
      { item: "Pengecekan oli pendingin seal mechanical motor", done: false },
      { item: "Uji debit aliran air pipa transmisi 4 inch", done: false }
    ],
    estimatedCost: 350000
  },
  {
    id: "PM-002",
    assetId: "AST-TRK-01",
    assetName: "Truk Pengangkut Sampah & Residu Desa",
    category: "Armada Desa",
    taskTitle: "Ganti Oli Mesin, Filter Solar & Pengecekan Hidrolik Dump",
    intervalType: "Bulanan",
    dueDate: "2026-08-30",
    status: "Jatuh Tempo Segera",
    assignedTechnician: "Bengkel Mitra Otomotif Kepanjen",
    priority: "Tinggi",
    checklist: [
      { item: "Penggantian Oli Mesin 15W-40 Diesel", done: true },
      { item: "Penggantian Filter Solar Utama & Cadangan", done: false },
      { item: "Inspeksi Tekanan Hidrolik Bak Penampung", done: false },
      { item: "Pengecekan Kampas Rem Roda Belakang", done: false }
    ],
    estimatedCost: 1200000
  },
  {
    id: "PM-003",
    assetId: "AST-GEN-02",
    assetName: "Genset Silent 15 kVA Balai Desa",
    category: "Peralatan/Mesin",
    taskTitle: "Uji Beban Otomatis (ATS) & Pemanasan Berkala Mesin",
    intervalType: "Bulanan",
    dueDate: "2026-09-05",
    status: "Terjadwal",
    assignedTechnician: "Tim Listrik Desa Talangagung",
    priority: "Rutin",
    checklist: [
      { item: "Pengecekan tegangan baterai aki starter", done: true },
      { item: "Pengurasan endapan air separator bahan bakar", done: false },
      { item: "Uji coba perpindahan otomatis PLN ke Genset", done: false }
    ],
    estimatedCost: 250000
  },
  {
    id: "PM-004",
    assetId: "AST-TRC-01",
    assetName: "Traktor Roda Empat Brigade Alsintan Desa",
    category: "Mesin Pertanian",
    taskTitle: "Servis Transmisi Gardan & Gemuk Rotary Tillage",
    intervalType: "Musiman",
    dueDate: "2026-09-15",
    status: "Terjadwal",
    assignedTechnician: "Teknisi Poktan Krajan-Jatisari",
    priority: "Tinggi",
    checklist: [
      { item: "Pemberian grease pada seluruh nipple gardan roda", done: false },
      { item: "Pengencangan baut pisau bajak rotary", done: false },
      { item: "Pengecekan oli transmisi hidrolik pengangkat beban", done: false }
    ],
    estimatedCost: 650000
  }
];

// 2. Real-time IoT Sensor Nodes Data
export const initialIoTSensors: IoTSensorNode[] = [
  {
    id: "IOT-001",
    code: "NODE-WL-METRO-01",
    name: "Sensor Debit & Ketinggian Saluran Irigasi Kali Metro",
    assetName: "Saluran Irigasi Primer Kali Metro",
    type: "WaterLevel",
    dusun: "Dusun 2 (Jatisari)",
    rtRw: "RT 03 / RW 02",
    currentValue: 72,
    unit: "cm",
    normalRange: { min: 20, max: 90 },
    status: "Normal",
    batteryLevel: 94,
    lastUpdated: "1 menit yang lalu",
    history: [
      { time: "16:00", value: 55 },
      { time: "17:00", value: 58 },
      { time: "18:00", value: 62 },
      { time: "19:00", value: 68 },
      { time: "20:00", value: 72 }
    ]
  },
  {
    id: "IOT-002",
    code: "NODE-PUMP-FLOW-02",
    name: "Sensor Tekanan & Aliran Pompa Submersible",
    assetName: "Pompa Submersible Poktan Metro Lestari",
    type: "PumpFlow",
    dusun: "Dusun 2 (Jatisari)",
    rtRw: "RT 03 / RW 02",
    currentValue: 18.4,
    unit: "L/dtk",
    normalRange: { min: 15, max: 25 },
    status: "Peringatan",
    batteryLevel: 88,
    lastUpdated: "Baru saja",
    alertMessage: "Debit aliran menurun 15% terindikasi hambatan endapan pasir pada impeller.",
    history: [
      { time: "16:00", value: 22.1 },
      { time: "17:00", value: 21.0 },
      { time: "18:00", value: 19.8 },
      { time: "19:00", value: 19.1 },
      { time: "20:00", value: 18.4 }
    ]
  },
  {
    id: "IOT-003",
    code: "NODE-SOLAR-PJUTS-05",
    name: "Sensor Voltase Baterai PJUTS Jalur Lingkar RT 02",
    assetName: "Lampu Penerangan PJUTS Pos Ronda Krajan",
    type: "SolarVoltage",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 02 / RW 01",
    currentValue: 10.2,
    unit: "Volt",
    normalRange: { min: 11.8, max: 13.8 },
    status: "Bahaya / Butuh Tindakan",
    batteryLevel: 22,
    lastUpdated: "3 menit yang lalu",
    alertMessage: "Tegangan drop di bawah ambang batas (10.2V). Lampu mati saat malam.",
    history: [
      { time: "16:00", value: 12.8 },
      { time: "17:00", value: 12.1 },
      { time: "18:00", value: 11.4 },
      { time: "19:00", value: 10.8 },
      { time: "20:00", value: 10.2 }
    ]
  },
  {
    id: "IOT-004",
    code: "NODE-BIN-TRASH-01",
    name: "Smart Bin Ultrasonik TPS Organik Glanggang",
    assetName: "Tempat Pengolahan Sampah Organik Desa",
    type: "SmartBinTrash",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    currentValue: 84,
    unit: "% Penuh",
    normalRange: { min: 0, max: 75 },
    status: "Peringatan",
    batteryLevel: 91,
    lastUpdated: "5 menit yang lalu",
    alertMessage: "Kapasitas bak penampung sampah organik telah mencapai 84%. Perlu pengangkutan armada desa.",
    history: [
      { time: "16:00", value: 45 },
      { time: "17:00", value: 55 },
      { time: "18:00", value: 68 },
      { time: "19:00", value: 76 },
      { time: "20:00", value: 84 }
    ]
  },
  {
    id: "IOT-005",
    code: "NODE-FEEDER-MOLEKJAYA-01",
    name: "Smart Feeder & Kualitas Air Pokdakan Molek Jaya",
    assetName: "Kolam Budidaya Ikan Pokdakan Molek Jaya & Pokmas Anggrungan",
    type: "SmartFeeder",
    dusun: "Dusun 1 (Krajan / Anggrungan)",
    rtRw: "RT 01 / RW 01",
    currentValue: 7.2,
    unit: "pH Air",
    normalRange: { min: 6.5, max: 8.5 },
    status: "Normal",
    batteryLevel: 98,
    lastUpdated: "Baru saja",
    history: [
      { time: "16:00", value: 7.1 },
      { time: "17:00", value: 7.3 },
      { time: "18:00", value: 7.2 },
      { time: "19:00", value: 7.4 },
      { time: "20:00", value: 7.2 }
    ]
  }
];

// 3. Bursa Kerja Lokal & Kemitraan Industri Data
export const initialJobVacancies: JobVacancy[] = [
  {
    id: "JOB-001",
    title: "Teknisi Pemeliharaan Mesin & Mekanik Ringan",
    company: "CV Industri Logam & Mesin Kepanjen",
    location: "Kawasan Industri Jalur Lingkar Kepanjen",
    industryType: "Manufaktur",
    employmentType: "Full-Time",
    salaryRange: "Rp 2.800.000 - Rp 3.500.000 / bln",
    postedDate: "2026-08-15",
    deadline: "2026-09-10",
    requirements: [
      "Pendidikan SMK Mesin / Otomotif / Elektro",
      "Memahami perawatan motor listrik, bearing, dan hidrolik",
      "KTP Desa Talangagung / Area Kepanjen diutamakan",
      "Mampu bekerja sama dalam tim dan bersedia kerja sistem shift"
    ],
    slotsAvailable: 3,
    applicantsCount: 7,
    contactPerson: "Ibu Ratna (HRD) - 0813-2233-4455",
    isPriorityForLocal: true
  },
  {
    id: "JOB-002",
    title: "Program Magang TEFA: Teknisi IoT & Operator PAMSIMAS",
    company: "BUMDes Talangagung Makmur Bersama SMK Mitra",
    location: "Kantor BUMDes Talangagung Kepanjen",
    industryType: "Teknologi & Kreatif",
    employmentType: "Magang SMK",
    salaryRange: "Uang Saku Rp 1.200.000 / bln + Sertifikat",
    postedDate: "2026-08-18",
    deadline: "2026-09-01",
    requirements: [
      "Siswa aktif SMK Jurusan RPL / TKJ / Mekatronika",
      "Tertarik instalasi mikrokontroler sensor air dan panel surya",
      "Mendapat rekomendasi dari guru pembimbing sekolah"
    ],
    slotsAvailable: 4,
    applicantsCount: 5,
    contactPerson: "Pak Arif (Manager Unit BUMDes) - 0857-4455-6677",
    isPriorityForLocal: true
  },
  {
    id: "JOB-003",
    title: "Staf Pengepakan & Quality Control Keripik Singkong",
    company: "Sentra Olahan Pangan Sari Rasa Kepanjen",
    location: "Dusun 1 (Krajan), Desa Talangagung",
    industryType: "Agribisnis / Pertanian",
    employmentType: "Full-Time",
    salaryRange: "Rp 2.400.000 - Rp 2.900.000 / bln",
    postedDate: "2026-08-12",
    deadline: "2026-08-30",
    requirements: [
      "Pria / Wanita usia produktif (18 - 35 tahun)",
      "Pendidikan minimal SMA/SMK sederajat",
      "Teliti, jujur, dan menjaga standar higienitas makanan"
    ],
    slotsAvailable: 6,
    applicantsCount: 11,
    contactPerson: "Pak Hendro (Supervisor Produksi) - 0812-7788-9900",
    isPriorityForLocal: true
  },
  {
    id: "JOB-004",
    title: "Operator Pengolahan Pupuk Kompos Organik Desa",
    company: "Unit Pengelolaan Lingkungan BUMDes Talangagung",
    location: "TPS-3R Dusun Glanggang",
    industryType: "Agribisnis / Pertanian",
    employmentType: "Part-Time",
    salaryRange: "Rp 1.800.000 / bln (Insentif Tonase)",
    postedDate: "2026-08-10",
    deadline: "2026-09-15",
    requirements: [
      "Sehat jasmani dan terbiasa dengan aktivitas pertanian",
      "Diutamakan warga Dusun Glanggang / Jatisari"
    ],
    slotsAvailable: 2,
    applicantsCount: 3,
    contactPerson: "Pak Cecep - 0821-9988-7766",
    isPriorityForLocal: true
  }
];

// 4. Etalase Digital BUMDes & UMKM Data
export const initialBumdesProducts: BumdesProduct[] = [
  {
    id: "PRD-001",
    name: "Keripik Singkong Renyah Aneka Rasa Sari Rasa Kepanjen",
    category: "Olahan Pangan & Camilan",
    price: 15000,
    unit: "Bungkus 250gr",
    producer: "KWT Melati Dusun Krajan",
    dusun: "Dusun 1 (Krajan)",
    photoUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
    description: "Keripik singkong renyah kualitas super dari hasil tani lokal Talangagung tanpa pengawet. Tersedia rasa Original Gurih, Pedas Daun Jeruk, dan Balado Manis.",
    rating: 4.9,
    stock: 120,
    whatsappContact: "6281234567890",
    isBestSeller: true
  },
  {
    id: "PRD-002",
    name: "Beras Pandan Wangi Organik Poktan Metro Lestari",
    category: "Hasil Tani Segar",
    price: 72000,
    unit: "Kemasan 5 Kg",
    producer: "Poktan Metro Lestari Jatisari",
    dusun: "Dusun 2 (Jatisari)",
    photoUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    description: "Beras sehat pulen hasil sawah irigasi jernih Kali Metro. Ditanam dengan pupuk organik kompos desa tanpa pestisida sintetis berbahaya.",
    rating: 4.8,
    stock: 45,
    whatsappContact: "6282199887766",
    isBestSeller: true
  },
  {
    id: "PRD-003",
    name: "Pupuk Kompos Organik Butiran Granul Super",
    category: "Pupuk & Saprotan",
    price: 25000,
    unit: "Sak 20 Kg",
    producer: "Unit Pengolahan Sampah BUMDes Talangagung",
    dusun: "Dusun 3 (Glanggang)",
    photoUrl: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&auto=format&fit=crop&q=80",
    description: "Pupuk organik kaya unsur hara makro mikro hasil fermentasi sampah organik desa teruji laboratorium dinas pertanian.",
    rating: 4.7,
    stock: 80,
    whatsappContact: "6285733221100"
  },
  {
    id: "PRD-004",
    name: "Besek Anyaman Bambu Tradisional Serbaguna",
    category: "Kerajinan Tangan",
    price: 3500,
    unit: "Pcs (Min 10)",
    producer: "Pengrajin Bambu Dusun Jatisari",
    dusun: "Dusun 2 (Jatisari)",
    photoUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80",
    description: "Kotak wadah anyaman bambu rapi dan higienis, sangat cocok untuk kemasan hantaran syukuran, katering, dan oleh-oleh desa.",
    rating: 4.9,
    stock: 350,
    whatsappContact: "6281299881122"
  },
  {
    id: "PRD-005",
    name: "Jasa Servis & Pasang Pipa Air Bersih PAMSIMAS BUMDes",
    category: "Jasa Teknik & PAMSIMAS",
    price: 50000,
    unit: "Kunjungan Servis",
    producer: "Teknisi BUMDes Talangagung",
    dusun: "Lintas Dusun",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    description: "Layanan perbaikan pipa bocor, meteran air macet, dan pemasangan instalasi kran baru oleh tim teknisi bersertifikat BUMDes.",
    rating: 4.8,
    stock: 99,
    whatsappContact: "6285744556677"
  }
];
