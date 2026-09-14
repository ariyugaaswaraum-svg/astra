import { AssetItem, AssetCondition } from '../types';

/**
 * Dataset 50 Objek Smart Asset Desa Talangagung
 * Terdiri dari:
 * - 22 PJU (termasuk 22 titik LED 40W ruas Talangagung–TPA Okt 2025)
 * - 6 Bangunan/Fasilitas Desa (Balai Desa, Posyandu, dll.)
 * - 5 Pompa/Air/Drainase
 * - 3 Kendaraan Operasional
 * - 6 Peralatan Kantor & Teknologi
 * - 4 Sarana Kebersihan
 * - 4 Sarana Keamanan
 * Total = 50 Aset
 * 
 * Status Distribusi:
 * - 35 Baik/Normal
 * - 10 Perlu Servis/Inspeksi
 * - 5 Rusak Ringan/Rusak Berat
 */

export const initialSmart50Assets: AssetItem[] = [
  // ASET DEMONSTRASI CLOSED KNOWLEDGE LOOP (DATA B — SIMULASI PROTOTIPE)
  {
    id: "AST-DEMO-PJU-RT02-004",
    assetId: "AST-DEMO-PJU-RT02-004",
    scenarioId: "DEMO-CLOSED-LOOP-PJU-001",
    code: "AST-DEMO-PJU-RT02-004",
    name: "Lampu PJU Titik 04 RT 02/RW 01 — Aset Simulasi",
    category: "Fasilitas Umum",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 02 / RW 01",
    yearBuilt: 2024,
    condition: "Perlu Servis",
    photoUrl: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5684 },
    dataClassification: "PROTOTYPE_SIMULATION",
    validationStatus: "SIMULATION_ONLY",
    isSimulation: true,
    sourceIds: [],
    maintenanceHistory: [
      {
        id: "M-PJU-DEMO-01",
        date: "2025-08-14",
        type: "[DATA B — SIMULASI] Pembersihan Modul & Penggantian Sensor Otomatis",
        cost: 250000,
        technician: "Teknisi Simulasi Desa & Siswa TEFA SMK",
        notes: "[DATA B — SIMULASI] Pembersihan debu panel fotovoltaik contoh simulasi."
      },
      {
        id: "M-PJU-DEMO-02",
        date: "2025-11-20",
        type: "[DATA B — SIMULASI] Pemeriksaan Kelistrikan Rutin",
        cost: 120000,
        technician: "Teknisi BUMDes (Pak Agus)",
        notes: "[DATA B — SIMULASI] Pengecekan voltase aki 12V dan konektor terminal kabel contoh simulasi."
      }
    ],
    qrCodeValue: "QR DEMO — BUKAN IDENTITAS ASET RESMI",
    estimatedValue: 6500000,
    assignedManager: "Kaur Kesra & Tim Kelistrikan Desa (Contoh Simulasi)"
  },

  // 1. Fasilitas Strategis Nyata & Lahan Pemkab di Talangagung (Faktual)
  {
    id: "INF-TPA-001",
    code: "AST-LHN-TPA-01",
    name: "Bidang Tanah Aset TPA Talangagung (Kavling A-554)",
    category: "Lahan Kas Desa",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2021,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1390, lng: 112.5610 },
    maintenanceHistory: [
      { id: "M-TPA-01", date: "2021-08-15", type: "Pencatatan Aset Pemkab", cost: 0, technician: "BPKAD & Pemkab Malang", notes: "Sertifikasi bidang tanah seluas 554 m²" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-INF-TPA-001",
    estimatedValue: 277000000,
    assignedManager: "Dinas Lingkungan Hidup Kab. Malang / Pemdes"
  },
  {
    id: "INF-TPA-002",
    code: "AST-LHN-TPA-02",
    name: "Bidang Tanah Aset TPA Talangagung (Kavling B-712)",
    category: "Lahan Kas Desa",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2021,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1392, lng: 112.5615 },
    maintenanceHistory: [
      { id: "M-TPA-02", date: "2021-08-15", type: "Pencatatan Aset Pemkab", cost: 0, technician: "BPKAD & Pemkab Malang", notes: "Sertifikasi bidang tanah seluas 712 m²" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-INF-TPA-002",
    estimatedValue: 356000000,
    assignedManager: "Dinas Lingkungan Hidup Kab. Malang / Pemdes"
  },
  {
    id: "INF-TPA-003",
    code: "AST-LHN-TPA-03",
    name: "Bidang Tanah Aset TPA Talangagung (Kavling C-677)",
    category: "Lahan Kas Desa",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2021,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1395, lng: 112.5620 },
    maintenanceHistory: [
      { id: "M-TPA-03", date: "2021-08-15", type: "Pencatatan Aset Pemkab", cost: 0, technician: "BPKAD & Pemkab Malang", notes: "Sertifikasi bidang tanah seluas 677 m²" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-INF-TPA-003",
    estimatedValue: 338500000,
    assignedManager: "Dinas Lingkungan Hidup Kab. Malang / Pemdes"
  },
  {
    id: "INF-TPA-004",
    code: "AST-LHN-TPA-04",
    name: "Kawasan Pengadaan Lahan TPA Talangagung 2022 (11.450 m²)",
    category: "Lahan Kas Desa",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2022,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1400, lng: 112.5600 },
    maintenanceHistory: [
      { id: "M-TPA-04", date: "2022-11-20", type: "Pengadaan Lahan", cost: 5725000000, technician: "Tim Pengadaan Tanah Pemkab Malang", notes: "Pengadaan tanah perluasan zona TPA 11.450 m²" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-INF-TPA-004",
    estimatedValue: 5725000000,
    assignedManager: "Dinas Lingkungan Hidup Kab. Malang"
  },
  {
    id: "INF-IPLT-001",
    code: "AST-SAN-IPLT",
    name: "Instalasi Pengolahan Lumpur Tinja (IPLT) Kabupaten Malang di Talangagung",
    category: "Infrastruktur",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 05 / RW 03",
    yearBuilt: 2012,
    condition: "Rusak Berat",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1415, lng: 112.5590 },
    maintenanceHistory: [
      { id: "M-IPLT-01", date: "2024-04-10", type: "Kajian Teknis Rekonstruksi", cost: 0, technician: "Dinas Cipta Karya Kab. Malang", notes: "Dokumen RKPD 2026: Fasilitas tidak berfungsi sesuai standar teknis, butuh rekonstruksi menyeluruh." }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-INF-IPLT-001",
    estimatedValue: 1200000000,
    assignedManager: "Dinas PU Cipta Karya & Tata Ruang Kab. Malang"
  },
  {
    id: "INF-TRM-001",
    code: "AST-TRM-01",
    name: "Terminal Talangagung Kepanjen (Lahan 30.021 m² - Origin Trans Jatim Koridor 2)",
    category: "Fasilitas Umum",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2010,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1300, lng: 112.5700 },
    maintenanceHistory: [
      { id: "M-TRM-01", date: "2023-05-18", type: "Perawatan Jalur & Ruang Tunggu", cost: 45000000, technician: "Dishub Kab. Malang", notes: "Pengecatan marka dan perbaikan atap peron" },
      { 
        id: "M-TRM-02", 
        date: "2026-06-14", 
        type: "Penyiapan Origin Trans Jatim Koridor 2 (Kepanjen–Kota Malang)", 
        cost: 350000000, 
        technician: "Dishub Provinsi Jawa Timur & Dishub Kab. Malang", 
        notes: "Titik awal (origin) rute baru bus Trans Jatim Koridor 2: Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi -> Terminal Arjosari (Kota Malang). Target beroperasi: Oktober 2026. Armada: 15 unit bus (14 unit operasional, 1 unit cadangan). Signifikansi: Akses Trans Jatim pertama yang menjangkau wilayah Malang Selatan, menjadi katalis mobilitas warga dan konektivitas komuter Malang Raya. Sumber: JatimTimes, 14 Juni 2026 - Trans Jatim Merambah Malang Selatan, Rute Kepanjen-Arjosari Siap Mengaspal Oktober 2026." 
      }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-INF-TRM-001",
    estimatedValue: 15350000000,
    assignedManager: "Dinas Perhubungan Kabupaten Malang & Dishub Provinsi Jawa Timur"
  },

  // 2. Fasilitas Pendidikan Nyata Kemendikdasmen (EDU-001 s/d 004)
  {
    id: "EDU-001",
    code: "AST-EDU-SDN1",
    name: "SD Negeri 1 Talangagung (Lahan 2.760 m² - 244 Siswa, 13 Guru)",
    category: "Bangunan Desa",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 02 / RW 01",
    yearBuilt: 1982,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1328, lng: 112.5678 },
    maintenanceHistory: [
      { id: "M-EDU-01", date: "2024-06-20", type: "Pengecatan Gedung & Ruang Kelas", cost: 28000000, technician: "Komite Sekolah & Disdik", notes: "Pemeliharaan ruang kelas 1-6 dan perpustakaan" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-EDU-001",
    estimatedValue: 1850000000,
    assignedManager: "Kepala Sekolah SDN 1 Talangagung / Disdik Kab. Malang"
  },
  {
    id: "EDU-002",
    code: "AST-EDU-SDN2",
    name: "SD Negeri 2 Talangagung (Lahan 3.744 m² - Dusun Rekesan)",
    category: "Bangunan Desa",
    dusun: "Dusun 1 (Krajan / Rekesan)",
    rtRw: "RT 05 / RW 01",
    yearBuilt: 1985,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1315, lng: 112.5690 },
    maintenanceHistory: [
      { id: "M-EDU-02", date: "2023-11-12", type: "Instalasi Internet & Listrik PLN", cost: 12500000, technician: "PLN & Telkom Kepanjen", notes: "Peningkatan daya listrik dan fiber optik sekolah" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-EDU-002",
    estimatedValue: 2100000000,
    assignedManager: "Kepala Sekolah SDN 2 Talangagung / Disdik Kab. Malang"
  },
  {
    id: "EDU-003",
    code: "AST-EDU-PAUD1",
    name: "PAUD KB Srikandi Perumnas II",
    category: "Bangunan Desa",
    dusun: "Dusun 5 (Perumnas)",
    rtRw: "RT 22 / RW 05",
    yearBuilt: 2015,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1345, lng: 112.5740 },
    maintenanceHistory: [
      { id: "M-EDU-03", date: "2024-03-05", type: "Peremajaan Alat Permainan Edukatif", cost: 4500000, technician: "Pokja Bunda PAUD Desa", notes: "Pengadaan APE luar ruangan dan cat pagar" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-EDU-003",
    estimatedValue: 220000000,
    assignedManager: "Pengelola KB Srikandi / Bunda PAUD Desa"
  },
  {
    id: "EDU-004",
    code: "AST-EDU-PKBM",
    name: "PKBM Tunas Mandiri (Pendidikan Masyarakat Kepanjen Permai II)",
    category: "Bangunan Desa",
    dusun: "Dusun 5 (Perumahan)",
    rtRw: "RT 25 / RW 05",
    yearBuilt: 2017,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1355, lng: 112.5750 },
    maintenanceHistory: [
      { id: "M-EDU-04", date: "2025-01-15", type: "Pengadaan Sarana Kursus Vokasi", cost: 18000000, technician: "Disdik & Pengurus PKBM", notes: "Perangkat komputer pelatihan vokasi warga" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-EDU-004",
    estimatedValue: 310000000,
    assignedManager: "Pengurus PKBM Tunas Mandiri"
  },

  // 3. Bangunan Pemerintahan & Pelayanan Desa (Total 6 Bangunan Utama)
  {
    id: "AST-003",
    code: "AST-BLI-001",
    name: "Balai Desa & Pendopo Pelayanan Terpadu Talangagung",
    category: "Bangunan Desa",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2018,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5680 },
    maintenanceHistory: [
      { id: "M-301", date: "2024-10-18", type: "Pengecatan Pendopo & Instalasi Sound System", cost: 14500000, technician: "CV Karya Mandiri Kepanjen", notes: "Pengecatan pilar joglo pendopo" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-BLI-001",
    estimatedValue: 650000000,
    assignedManager: "Kaur Umum & Tata Usaha"
  },
  {
    id: "AST-006",
    code: "AST-PSY-001",
    name: "Gedung Posyandu Melati Dusun Glanggang",
    category: "Bangunan Desa",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 02 / RW 03",
    yearBuilt: 2008,
    condition: "Perlu Servis",
    photoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1370, lng: 112.5635 },
    maintenanceHistory: [
      { id: "M-601", date: "2023-04-10", type: "Perbaikan Genteng & Plafon Bocor", cost: 3500000, technician: "Swakelola RW 03", notes: "Perbaikan genteng teras posyandu" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-PSY-001",
    estimatedValue: 125000000,
    assignedManager: "Kader Posyandu Lansia / Kaur Kesra"
  },

  // 4. Pompa, Air & Drainase (5 Objek)
  {
    id: "AST-001",
    code: "AST-PMP-002",
    name: "Pompa Air Pertanian Submersible Poktan Metro Lestari",
    category: "Peralatan/Mesin",
    dusun: "Dusun 2 (Jatisari)",
    rtRw: "RT 03 / RW 02",
    yearBuilt: 2022,
    condition: "Perlu Servis",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1342, lng: 112.5695 },
    maintenanceHistory: [
      { id: "M-101", date: "2023-06-12", type: "Penggantian Kapasitor", cost: 500000, technician: "Pak Budi Bengkel", notes: "Kapasitor lemah" },
      { id: "M-102", date: "2025-03-10", type: "Pembersihan Impeller & Pasir", cost: 350000, technician: "Mekanik Pertanian", notes: "Pembersihan endapan pasir Kali Metro" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-PMP-002",
    estimatedValue: 24000000,
    assignedManager: "Poktan Metro Lestari"
  },
  {
    id: "AST-002",
    code: "AST-JLN-005",
    name: "Jalan Usaha Tani & Drainase RT 05 Glanggang",
    category: "Infrastruktur",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 05 / RW 03",
    yearBuilt: 2020,
    condition: "Rusak Ringan",
    photoUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1365, lng: 112.5642 },
    maintenanceHistory: [
      { id: "M-201", date: "2022-09-15", type: "Penambalan Retak Aspal", cost: 3200000, technician: "Swakelola RT 05", notes: "Penambalan aspal dingin" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-JLN-005",
    estimatedValue: 165000000,
    assignedManager: "Kasi Kesejahteraan & Pembangunan Desa"
  },
  {
    id: "AST-004",
    code: "AST-JMB-001",
    name: "Jembatan Kali Metro Penghubung Krajan-Jatisari",
    category: "Infrastruktur",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 03 / RW 01",
    yearBuilt: 2016,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1310, lng: 112.5710 },
    maintenanceHistory: [
      { id: "M-401", date: "2024-07-22", type: "Penguatan Abutmen Batu Kali & Pengecatan", cost: 38500000, technician: "Tim Swakelola Desa", notes: "Perbaikan talud sayap jembatan" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-JMB-001",
    estimatedValue: 310000000,
    assignedManager: "Kasi Pembangunan Desa"
  },
  {
    id: "AST-007",
    code: "AST-PAM-001",
    name: "Instalasi Pengolahan Air Bersih PAMSIMAS Jatisari",
    category: "Infrastruktur",
    dusun: "Dusun 2 (Jatisari)",
    rtRw: "RT 02 / RW 02",
    yearBuilt: 2020,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1335, lng: 112.5702 },
    maintenanceHistory: [
      { id: "M-701", date: "2024-08-14", type: "Kuras Tandon & Ganti Filter Pasir Silika", cost: 4200000, technician: "Teknisi BUMDes", notes: "Peremajaan media filtrasi tandon 5000L" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-PAM-001",
    estimatedValue: 220000000,
    assignedManager: "Unit Air Bersih BUMDes Makmur"
  },
  {
    id: "AST-008",
    code: "AST-DRN-002",
    name: "Saluran Drainase U-Ditch Jalibar Talangagung (2018)",
    category: "Infrastruktur",
    dusun: "Dusun 4 (Krajan Timur)",
    rtRw: "RT 01 / RW 04",
    yearBuilt: 2018,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1380, lng: 112.5685 },
    maintenanceHistory: [
      { id: "M-801", date: "2023-10-02", type: "Pembersihan Sedimen Saluran", cost: 6500000, technician: "Dinas PU Pengairan & Warga", notes: "Normalisasi saluran penampung limpasan Jalibar" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-DRN-002",
    estimatedValue: 340000000,
    assignedManager: "Dinas PU Bina Marga & Pemdes"
  },

  // 5. Kendaraan Operasional Desa (3 Kendaraan)
  {
    id: "AST-TRK-01",
    code: "AST-KND-001",
    name: "Truk Pengangkut Sampah & Residu Desa Talangagung",
    category: "Peralatan/Mesin",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2021,
    condition: "Perlu Servis",
    photoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1378, lng: 112.5625 },
    maintenanceHistory: [
      { id: "M-TRK-01", date: "2024-12-05", type: "Ganti Ban & Servis Hidrolik Dump", cost: 7800000, technician: "Bengkel Mitra Kepanjen", notes: "Perawatan hidrolik bak penampung sampah" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-KND-001",
    estimatedValue: 380000000,
    assignedManager: "Unit Kebersihan BUMDes"
  },
  {
    id: "AST-AMB-01",
    code: "AST-KND-002",
    name: "Mobil Siaga / Ambulans Desa Talangagung (Gratis Warga)",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2022,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1322, lng: 112.5681 },
    maintenanceHistory: [
      { id: "M-AMB-01", date: "2025-01-20", type: "Ganti Oli Mesin & Isi Oksigen Medis", cost: 1200000, technician: "Bengkel Resmi Daihatsu", notes: "Kondisi tabung oksigen & sirine prima" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-KND-002",
    estimatedValue: 245000000,
    assignedManager: "Kaur Kesra & Driver Siaga Desa"
  },
  {
    id: "AST-MTR-01",
    code: "AST-KND-003",
    name: "Sepeda Motor Patroli Linmas & Trantibum Desa",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2020,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1324, lng: 112.5683 },
    maintenanceHistory: [
      { id: "M-MTR-01", date: "2024-09-10", type: "Servis Rutin & Ganti Kampas Rem", cost: 350000, technician: "Bengkel AHASS Kepanjen", notes: "Kondisi siap patroli malam" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-KND-003",
    estimatedValue: 18000000,
    assignedManager: "Kasie Pemerintahan & Komandan Linmas"
  },

  // 6. Peralatan Kantor & Teknologi (6 Objek)
  {
    id: "AST-GEN-02",
    code: "AST-EQP-001",
    name: "Genset Silent 15 kVA Kantor Balai Desa",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2021,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1326, lng: 112.5684 },
    maintenanceHistory: [
      { id: "M-GEN-01", date: "2025-02-10", type: "Ganti Aki Starter & Filter Solar", cost: 1850000, technician: "Teknisi Genset Malang", notes: "Uji otomatis transfer switch normal" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-EQP-001",
    estimatedValue: 85000000,
    assignedManager: "Kaur Umum Desa"
  },
  {
    id: "AST-PC-001",
    code: "AST-EQP-002",
    name: "Server Mini & PC Layanan Terpadu Desa Black Box AI",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2024,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5681 },
    maintenanceHistory: [
      { id: "M-PC-01", date: "2025-01-05", type: "Backup Database & Update Sistem", cost: 0, technician: "Tim IT SMK Mitra Desa", notes: "Enkripsi memori digital desa terverifikasi" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-EQP-002",
    estimatedValue: 35000000,
    assignedManager: "Operator Smart Village"
  },
  {
    id: "AST-DRN-001",
    code: "AST-EQP-003",
    name: "Drone Pemetaan Tata Ruang & Pertanian Desa (DJI Enterprise)",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2023,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5681 },
    maintenanceHistory: [
      { id: "M-DRN-01", date: "2024-11-20", type: "Kalibrasi Gimbal & Baterai", cost: 1200000, technician: "Service Center DJI", notes: "Uji terbang pemetaan lahan produktif 72 Ha" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-EQP-003",
    estimatedValue: 42000000,
    assignedManager: "Kasi Pembangunan & Lab SMK TEFA"
  },
  {
    id: "AST-SND-001",
    code: "AST-EQP-004",
    name: "Perangkat Sound System & Mic Wireless Aula Pertemuan Pendopo",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2020,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5680 },
    maintenanceHistory: [
      { id: "M-SND-01", date: "2024-07-10", type: "Penggantian Modul Mixer Audio", cost: 2400000, technician: "Elektronika Kepanjen", notes: "Kualitas audio rapat desa jernih" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-EQP-004",
    estimatedValue: 28000000,
    assignedManager: "Kaur Umum Desa"
  },
  {
    id: "AST-PRN-001",
    code: "AST-EQP-005",
    name: "Printer Thermal & Barcode Cetak Surat Pengantar RT/Desa",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2023,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5681 },
    maintenanceHistory: [
      { id: "M-PRN-01", date: "2025-01-12", type: "Ganti Roller Kertas", cost: 350000, technician: "Servis Printer Kepanjen", notes: "Pencetakan QR Code surat lancar" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-EQP-005",
    estimatedValue: 8500000,
    assignedManager: "Kasi Pelayanan Desa"
  },
  {
    id: "AST-UPS-001",
    code: "AST-EQP-006",
    name: "UPS Cadangan Daya 3000VA Ruang Server & Kamera Keamanan",
    category: "Peralatan/Mesin",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 01 / RW 01",
    yearBuilt: 2022,
    condition: "Perlu Servis",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1325, lng: 112.5681 },
    maintenanceHistory: [
      { id: "M-UPS-01", date: "2024-10-05", type: "Pengecekan Baterai Lead Acid", cost: 1500000, technician: "Teknisi Listrik Desa", notes: "Baterai mulai menurun durasi backup-nya" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-EQP-006",
    estimatedValue: 12000000,
    assignedManager: "Operator Smart Village"
  },

  // 7. Sarana Kebersihan & Lingkungan (4 Objek)
  {
    id: "AST-KBS-01",
    code: "AST-ENV-001",
    name: "Smart Bin Ultrasonik TPS Organik Glanggang",
    category: "Fasilitas Umum",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2024,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1375, lng: 112.5630 },
    maintenanceHistory: [
      { id: "M-KBS-01", date: "2025-02-18", type: "Kalibrasi Sensor Ultrasonik", cost: 250000, technician: "Siswa TEFA SMK", notes: "Telemetri level sampah online" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-ENV-001",
    estimatedValue: 14000000,
    assignedManager: "Unit Pengolahan Sampah BUMDes"
  },
  {
    id: "AST-KBS-02",
    code: "AST-ENV-002",
    name: "Mesin Pencacah Sampah Organik Pembuat Pupuk Kompos",
    category: "Peralatan/Mesin",
    dusun: "Dusun 3 (Glanggang)",
    rtRw: "RT 04 / RW 03",
    yearBuilt: 2021,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1376, lng: 112.5632 },
    maintenanceHistory: [
      { id: "M-KBS-02", date: "2024-11-10", type: "Asah Pisau Rotary Pencacah & Ganti V-Belt", cost: 1800000, technician: "Bengkel Mesin Kepanjen", notes: "Kapasitas produksi 1 ton/hari" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-ENV-002",
    estimatedValue: 32000000,
    assignedManager: "Unit Pengolahan Sampah BUMDes"
  },
  {
    id: "AST-KBS-03",
    code: "AST-ENV-003",
    name: "Gerobak Motor Roda Tiga Pengangkut Sampah Terpilah",
    category: "Peralatan/Mesin",
    dusun: "Dusun 2 (Jatisari)",
    rtRw: "RT 01 / RW 02",
    yearBuilt: 2020,
    condition: "Perlu Servis",
    photoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1340, lng: 112.5700 },
    maintenanceHistory: [
      { id: "M-KBS-03", date: "2024-10-15", type: "Ganti Rantai & Servis Karburator", cost: 650000, technician: "Bengkel Motor Viar", notes: "Digunakan pengambilan sampah rumah tangga" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-ENV-003",
    estimatedValue: 28000000,
    assignedManager: "Petugas Kebersihan RW 02"
  },
  {
    id: "AST-KBS-04",
    code: "AST-ENV-004",
    name: "Bak Kontainer Logam Penampung Sampah Residu 6 m³",
    category: "Fasilitas Umum",
    dusun: "Dusun 4 (Krajan Timur)",
    rtRw: "RT 03 / RW 04",
    yearBuilt: 2019,
    condition: "Rusak Ringan",
    photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1360, lng: 112.5710 },
    maintenanceHistory: [
      { id: "M-KBS-04", date: "2023-08-20", type: "Pengelasan Dinding Plat & Cat Anti Karat", cost: 2200000, technician: "Tukang Las Krajan", notes: "Penambalan plat dasar bak kontainer" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-ENV-004",
    estimatedValue: 25000000,
    assignedManager: "Kaur Kesra Desa"
  },

  // 8. Sarana Keamanan & Ketertiban (4 Objek)
  {
    id: "AST-KMN-01",
    code: "AST-SEC-001",
    name: "Pos Ronda Terpadu & Portal Keamanan RW 01 Krajan",
    category: "Bangunan Desa",
    dusun: "Dusun 1 (Krajan)",
    rtRw: "RT 02 / RW 01",
    yearBuilt: 2019,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1320, lng: 112.5682 },
    maintenanceHistory: [
      { id: "M-KMN-01", date: "2024-05-12", type: "Pengecatan & Pasang Lampu LED", cost: 1500000, technician: "Swadaya Warga RT 02", notes: "Pos ronda aktif 24 jam" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-SEC-001",
    estimatedValue: 45000000,
    assignedManager: "Ketua RW 01 & Linmas"
  },
  {
    id: "AST-KMN-02",
    code: "AST-SEC-002",
    name: "Kamera Pengawas CCTV Jalur Rawan Lingkar Jalibar (4 Titik)",
    category: "Peralatan/Mesin",
    dusun: "Dusun 4 (Krajan Timur)",
    rtRw: "RT 02 / RW 04",
    yearBuilt: 2023,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1370, lng: 112.5720 },
    maintenanceHistory: [
      { id: "M-KMN-02", date: "2025-01-10", type: "Pembersihan Lensa & Setting DVR", cost: 800000, technician: "Teknisi CCTV Kepanjen", notes: "Streaming termonitor di Balai Desa" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-SEC-002",
    estimatedValue: 22000000,
    assignedManager: "Kasi Pemerintahan & Babinsa"
  },
  {
    id: "AST-KMN-03",
    code: "AST-SEC-003",
    name: "Alarm Sirine Peringatan Dini Banjir Debit Kali Metro",
    category: "Peralatan/Mesin",
    dusun: "Dusun 2 (Jatisari)",
    rtRw: "RT 03 / RW 02",
    yearBuilt: 2022,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1345, lng: 112.5698 },
    maintenanceHistory: [
      { id: "M-KMN-03", date: "2024-11-25", type: "Uji Coba Sirine & Ganti Aki 12V", cost: 650000, technician: "BPBD Kab. Malang & Linmas", notes: "Uji coba bunyi sirine berjalan normal" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-SEC-003",
    estimatedValue: 16000000,
    assignedManager: "Posko Siaga Bencana Desa"
  },
  {
    id: "AST-KMN-04",
    code: "AST-SEC-004",
    name: "Pos Pantau & Portal Jalan Perumahan Kepanjen Permai RW 05",
    category: "Bangunan Desa",
    dusun: "Dusun 5 (Perumahan)",
    rtRw: "RT 24 / RW 05",
    yearBuilt: 2020,
    condition: "Baik",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    gpsCoords: { lat: -8.1360, lng: 112.5760 },
    maintenanceHistory: [
      { id: "M-KMN-04", date: "2024-04-18", type: "Pelumasan Engsel Portal & Pengecatan", cost: 750000, technician: "Swakelola RW 05", notes: "Penertiban keluar masuk kendaraan malam" }
    ],
    qrCodeValue: "DESA-TALANGAGUNG-AST-SEC-004",
    estimatedValue: 35000000,
    assignedManager: "Ketua RW 05"
  },

  // 9. Titik PJU Nyata (22 Titik PJU Ruas Talangagung - TPA & Jalur Lingkar)
  ...Array.from({ length: 22 }, (_, idx) => {
    const pjuNum = idx + 1;
    const isTpaRuas = pjuNum <= 15;
    const isPerluServis = pjuNum === 4 || pjuNum === 12;
    const isRusak = pjuNum === 8;
    const condition: AssetCondition = isRusak ? 'Rusak Ringan' : isPerluServis ? 'Perlu Servis' : 'Baik';
    const rwNum = (idx % 5) + 1;
    const dusunName = rwNum === 1 ? 'Dusun 1 (Krajan)' : rwNum === 2 ? 'Dusun 2 (Jatisari)' : rwNum === 3 ? 'Dusun 3 (Glanggang)' : rwNum === 4 ? 'Dusun 4 (Krajan Timur)' : 'Dusun 5 (Perumnas)';

    return {
      id: `AST-PJU-${String(pjuNum).padStart(2, '0')}`,
      code: `AST-PJU-LED-${String(pjuNum).padStart(3, '0')}`,
      name: isTpaRuas 
        ? `Lampu PJU LED 40W Ruas Talangagung–TPA Titik #${pjuNum}` 
        : `Lampu PJU Tenaga Surya Lingkar RW 0${rwNum} Titik #${pjuNum}`,
      category: 'Fasilitas Umum' as const,
      dusun: dusunName,
      rtRw: `RT 0${(pjuNum % 4) + 1} / RW 0${rwNum}`,
      yearBuilt: 2025,
      condition: condition,
      photoUrl: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&auto=format&fit=crop&q=80",
      gpsCoords: {
        lat: -8.1320 - (pjuNum * 0.0004),
        lng: 112.5640 + (pjuNum * 0.0005)
      },
      maintenanceHistory: [
        {
          id: `M-PJU-${pjuNum}`,
          date: isTpaRuas ? "2025-10-15" : "2024-11-02",
          type: isTpaRuas ? "Pemasangan Baru LED 40 Watt & KWh Meter" : "Pemeriksaan Modul Surya",
          cost: isTpaRuas ? 3500000 : 850000,
          technician: "Dinas Perhubungan & Tim Kelistrikan Desa",
          notes: isTpaRuas ? "Pemasangan lampu LED 40W ruas akses TPA" : "Pembersihan panel surya"
        }
      ],
      qrCodeValue: `DESA-TALANGAGUNG-PJU-${String(pjuNum).padStart(2, '0')}`,
      estimatedValue: 4500000,
      assignedManager: "Kaur Kesra & Tim PJU Desa"
    };
  })
];
