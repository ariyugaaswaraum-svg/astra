import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Compass, 
  AlertTriangle, 
  GraduationCap, 
  Fuel, 
  Home, 
  Building2, 
  Droplets, 
  Search, 
  Filter, 
  Layers, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Info, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  Phone, 
  CheckCircle2, 
  AlertOctagon, 
  Users, 
  Activity, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { VillageProfile, UserContext, VillageMapPoint, VillageHazardZone, MapPointCategory } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface PetaDesaInteraktifProps {
  villageProfile: VillageProfile;
  userContext: UserContext;
  onNavigateTab?: (tab: string) => void;
  onOpenSos?: () => void;
}

// Master Dataset Titik Koordinat & Fasilitas Desa Talangagung
export const villageMapPointsData: VillageMapPoint[] = [
  // --- FASILITAS PENDIDIKAN ---
  {
    id: 'FAS-SDN-1',
    title: 'SD Negeri 1 Talangagung',
    category: 'fasilitas_pendidikan',
    categoryLabel: 'Pendidikan Dasar',
    rt: 'RT 04',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    x: 42,
    y: 38,
    description: 'Sekolah Dasar Negeri 1 penunjang pendidikan dasar warga dusun Krajan dan sekitarnya dengan sarana ruang kelas lengkap.',
    details: {
      kondisi: 'Sangat Baik (Terakreditasi A)',
      kapasitas: '12 Rombel (320 Siswa)',
      pj: 'Kepala SDN 1 Talangagung',
      kontak: '(0341) 395-xxx',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'GraduationCap',
    color: 'bg-blue-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'FAS-SDN-2',
    title: 'SD Negeri 2 Talangagung',
    category: 'fasilitas_pendidikan',
    categoryLabel: 'Pendidikan Dasar',
    rt: 'RT 14',
    rw: 'RW 03',
    dusun: 'Dusun 2 (Jatisari)',
    x: 58,
    y: 62,
    description: 'Sekolah Dasar Negeri 2 melayani pendidikan dasar untuk wilayah selatan dan timur desa dengan lapangan serbaguna.',
    details: {
      kondisi: 'Baik & Terawat',
      kapasitas: '8 Rombel (210 Siswa)',
      pj: 'Kepala SDN 2 Talangagung',
      kontak: '(0341) 396-xxx',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'GraduationCap',
    color: 'bg-blue-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },

  // --- FASILITAS ENERGI & SPBU ---
  {
    id: 'FAS-SPBU-1',
    title: 'SPBU Barat Jembatan Metro',
    category: 'fasilitas_energi',
    categoryLabel: 'Energi & SPBU',
    rt: 'RT 01',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    x: 24,
    y: 28,
    description: 'Stasiun Pengisian Bahan Bakar Umum utama jalur barat dekat Jembatan Metro, melayani BBM dan rest area kendaraan umum/pribadi.',
    details: {
      kondisi: 'Beroperasi 24 Jam Penuh',
      kapasitas: 'Pertalite, Pertamax, Biosolar, Dexlite',
      pj: 'Pengelola SPBU Metro',
      kontak: '0812-3344-xxxx',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Fuel',
    color: 'bg-amber-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'FAS-SPBU-2',
    title: 'SPBU Barat Alun-Alun Desa',
    category: 'fasilitas_energi',
    categoryLabel: 'Energi & SPBU',
    rt: 'RT 09',
    rw: 'RW 02',
    dusun: 'Dusun 1 (Krajan)',
    x: 48,
    y: 48,
    description: 'SPBU strategis di sebelah barat alun-alun desa / lapangan terbuka, mempermudah akses bahan bakar bagi warga dan angkutan desa.',
    details: {
      kondisi: 'Beroperasi 24 Jam',
      kapasitas: 'BBM Komplit, Pengisian Nitrogen, Mini Market',
      pj: 'Manajer Operasional SPBU',
      kontak: '0813-9876-xxxx',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Fuel',
    color: 'bg-amber-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },

  // --- KOMPLEKS PERUMAHAN ---
  {
    id: 'PERUM-KP-1',
    title: 'Perumahan Kepanjen Permai I',
    category: 'perumahan',
    categoryLabel: 'Kompleks Perumahan',
    rt: 'RT 23',
    rw: 'RW 05',
    dusun: 'Dusun Krajan Timur',
    x: 74,
    y: 35,
    description: 'Kompleks perumahan modern Kepanjen Permai I dengan tata kelola lingkungan teratur, jalan paving lebar, dan pos keamanan 24 jam.',
    details: {
      kondisi: 'Tertata Rapi & Asri',
      kapasitas: '180 Unit Rumah (165 KK Aktif)',
      pj: 'Ketua Paguyuban Warga KP I',
      kontak: 'Pos Satpam KP I',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Home',
    color: 'bg-emerald-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'PERUM-KP-2',
    title: 'Perumahan Kepanjen Permai II',
    category: 'perumahan',
    categoryLabel: 'Kompleks Perumahan',
    rt: 'RT 24',
    rw: 'RW 05',
    dusun: 'Dusun Krajan Timur',
    x: 82,
    y: 42,
    description: 'Kompleks perumahan Kepanjen Permai II dengan ruang terbuka hijau warga, sarana ibadah mushola, dan sistem drainase tertutup.',
    details: {
      kondisi: 'Sangat Tertata & Bersih',
      kapasitas: '140 Unit Rumah (130 KK Aktif)',
      pj: 'Ketua Pengurus KP II',
      kontak: 'Pos Ronda KP II',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Home',
    color: 'bg-emerald-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'PERUM-MK',
    title: 'Perumahan Metro Kencana',
    category: 'perumahan',
    categoryLabel: 'Kompleks Perumahan',
    rt: 'RT 26',
    rw: 'RW 05',
    dusun: 'Dusun Krajan Utara',
    x: 68,
    y: 22,
    description: 'Kompleks perumahan Metro Kencana dekat akses jalur protokol penghubung Kepanjen, dilengkapi balai pertemuan warga.',
    details: {
      kondisi: 'Modern & Nyaman',
      kapasitas: '110 Unit Rumah (98 KK Aktif)',
      pj: 'Ketua RW 05 & Pengurus MK',
      kontak: 'Pos Keamanan Metro Kencana',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Home',
    color: 'bg-emerald-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },

  // --- FASILITAS PUBLIK & PEMERINTAHAN DESA ---
  {
    id: 'FAS-BALAI-DESA',
    title: 'Balai Desa & Kantor Pemerintah Desa Talangagung',
    category: 'fasilitas_publik',
    categoryLabel: 'Pusat Pemerintahan',
    rt: 'RT 02',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    x: 45,
    y: 44,
    description: 'Pusat pelayanan administrasi kependudukan, musyawarah desa, posko darurat, dan command center Desa Black Box AI.',
    details: {
      kondisi: 'Gedung Utama Terawat & Representatif',
      kapasitas: 'Layanan Terpadu 1 Pintu (Paten Desa)',
      pj: 'Sekretaris Desa & Kades',
      kontak: '(0341) 395-001',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Building2',
    color: 'bg-indigo-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'FAS-TPA-TALANGAGUNG',
    title: 'TPA Wisata Edukasi Talangagung (Aset 1,34 Ha / Kawasan 3,5 Ha)',
    category: 'fasilitas_publik',
    categoryLabel: 'Infrastruktur & Edukasi',
    rt: 'RT 18',
    rw: 'RW 04',
    dusun: 'Dusun 2 (Jatisari)',
    x: 32,
    y: 78,
    description: 'TPA sanitary landfill percontohan nasional dengan aset terkonsolidasi 13.393 m² (1,34 Ha) dalam kawasan operasional 3,5 Ha, instalasi biometana (250+ KK), rencana RDF, dan limbah medis B3.',
    details: {
      kondisi: 'Beroperasi Penuh & Wisata Edukasi',
      kapasitas: '140 m³/hari dari 87 TPS sekitarnya',
      pj: 'UPTD Pengelola TPA & DLH Kab. Malang',
      kontak: 'Koordinator Lapangan TPA',
      tingkatRisiko: 'Sedang'
    },
    iconType: 'Building2',
    color: 'bg-teal-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'FAS-TERMINAL-TALANGAGUNG',
    title: 'Terminal Talangagung (Origin Trans Jatim Koridor 2)',
    category: 'fasilitas_publik',
    categoryLabel: 'Infrastruktur Transportasi',
    rt: 'RT 01',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    x: 26,
    y: 22,
    description: 'Terminal Talangagung (luas lahan 30.021 m²) ditetapkan sebagai titik awal (origin) rute baru bus Trans Jatim Koridor 2: Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi -> Terminal Arjosari (Kota Malang). Target beroperasi: Oktober 2026 dengan alokasi armada 15 unit bus (14 unit operasional, 1 unit cadangan). Menjadi akses Trans Jatim pertama ke wilayah Malang Selatan.',
    details: {
      kondisi: 'Baik & Siap Beroperasi Oktober 2026',
      kapasitas: '15 Bus Trans Jatim (14 Operasional, 1 Cadangan)',
      pj: 'Dishub Provinsi Jawa Timur & Dishub Kab. Malang',
      kontak: 'Dishub UPT Terminal Kepanjen',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Building2',
    color: 'bg-blue-700 text-white',
    sumber: 'JatimTimes (14 Juni 2026) & Dishub Jatim'
  },
  {
    id: 'FAS-PUSTU',
    title: 'Puskesmas Pembantu (Pustu) Talangagung',
    category: 'fasilitas_publik',
    categoryLabel: 'Layanan Kesehatan',
    rt: 'RT 05',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    x: 38,
    y: 46,
    description: 'Fasilitas kesehatan primer desa untuk pengobatan umum, rujukan puskesmas induk Kepanjen, dan pos imunisasi terpadu.',
    details: {
      kondisi: 'Buka Senin–Sabtu (08.00–14.00)',
      kapasitas: 'Bidan Desa & Perawat Tetap',
      pj: 'Bidan Koordinator Desa',
      kontak: '0812-3456-7890',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Building2',
    color: 'bg-indigo-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },

  // --- IRIGASI & SUNGAI ---
  {
    id: 'GEO-TALANG-BESAR',
    title: 'Talang Air Besar Sungai Metro (Asal-Usul Nama Desa)',
    category: 'irigasi_sungai',
    categoryLabel: 'Irigasi & Toponimi',
    rt: 'RT 01',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    x: 20,
    y: 32,
    description: 'Talang (saluran air gantung raksasa) melintas di atas Sungai Metro yang menjadi asal mula nama historis "Talangagung". Menyalurkan debit irigasi utama.',
    details: {
      kondisi: 'Struktur Beton Kokoh & Terawat',
      kapasitas: 'Debit Irigasi 2,4 m³/detik',
      pj: 'Dinas PU Pengairan & HIPPA Desa',
      kontak: 'Petugas Juru Pintu Air',
      tingkatRisiko: 'Sedang'
    },
    iconType: 'Droplets',
    color: 'bg-sky-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'GEO-SUNGAI-MOLEK',
    title: 'Jaringan Saluran Irigasi Sungai Molek',
    category: 'irigasi_sungai',
    categoryLabel: 'Sumber Irigasi Pertanian',
    rt: 'RT 12',
    rw: 'RW 03',
    dusun: 'Dusun Krajan – Jatisari',
    x: 52,
    y: 56,
    description: 'Sumber irigasi pertanian vital mengaliri puluhan hektar sawah produktif padi dan tebu di sepanjang kawasan tengah-selatan desa.',
    details: {
      kondisi: 'Aliran Lancar Sepanjang Tahun',
      kapasitas: 'Mengairi > 85 Ha Lahan Tani',
      pj: 'Kelompok Tani & HIPPA Talangagung',
      kontak: 'Ketua Gapoktan',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Droplets',
    color: 'bg-sky-600 text-white',
    sumber: 'Profil Desa Talangagung'
  },

  // --- TITIK RAWAN BENCANA & MITIGASI ---
  {
    id: 'HAZ-BANTARAN-METRO',
    title: 'Zona Bantaran Sungai Metro (Rawan Luapan Air)',
    category: 'rawan_bencana',
    categoryLabel: 'Titik Rawan Bencana',
    rt: 'RT 01',
    rw: 'RW 01',
    dusun: 'Bantaran Barat Jembatan',
    x: 16,
    y: 30,
    description: 'Bantaran sungai rawan luapan air ketika curah hujan ekstrem di hulu Malang Raya. Warga diimbau memantau sensor debit air.',
    details: {
      kondisi: 'Tanggul Bronjong Terpasang',
      tingkatRisiko: 'Tinggi',
      mitigasi: 'Sistem Early Warning Telemetri IoT & Evakuasi ke Balai Desa',
      pj: 'Satgas Tanggap Bencana / Linmas Desa',
      kontak: 'Posko Siaga: 0811-345-xxx'
    },
    iconType: 'AlertTriangle',
    color: 'bg-rose-600 text-white',
    sumber: 'Data Geospasial Desa & Riset Bencana'
  },
  {
    id: 'HAZ-SEDIMEN-TALANG',
    title: 'Titik Pantau Sedimen & Sumbatan Talang Air',
    category: 'rawan_bencana',
    categoryLabel: 'Titik Rawan Bencana',
    rt: 'RT 03',
    rw: 'RW 01',
    dusun: 'Dusun Krajan Barat',
    x: 22,
    y: 36,
    description: 'Potensi penumpukan sampah ranting dan sedimen lumpur pada mulut talang saat debit sungai melonjak.',
    details: {
      kondisi: 'Pembersihan Rutin Mingguan',
      tingkatRisiko: 'Sedang',
      mitigasi: 'Kerja bakti pembersihan saringan air & pemantauan debit air terintegrasi',
      pj: 'HIPPA & Tim Kebersihan Desa',
      kontak: '0857-4567-xxxx'
    },
    iconType: 'AlertTriangle',
    color: 'bg-amber-600 text-white',
    sumber: 'Data Geospasial Desa & Riset Bencana'
  },
  {
    id: 'HAZ-TIKUNGAN-JATIKERTO',
    title: 'Jalur Rawan Pohon Tumbang & Angin Kencang Barat',
    category: 'rawan_bencana',
    categoryLabel: 'Titik Rawan Bencana',
    rt: 'RT 06',
    rw: 'RW 02',
    dusun: 'Jalur Perbatasan Jatikerto',
    x: 12,
    y: 52,
    description: 'Koridor jalan perbatasan dengan pohon-pohon peneduh besar yang rawan tumbang saat angin kencang musim hujan.',
    details: {
      kondisi: 'Pemangkasan Dahan Berkala',
      tingkatRisiko: 'Sedang',
      mitigasi: 'Patroli Linmas & koordinasi Dinas PU Bina Marga',
      pj: 'Linmas RT 06 & Satgas Desa',
      kontak: 'Pos Ronda RT 06'
    },
    iconType: 'AlertTriangle',
    color: 'bg-amber-600 text-white',
    sumber: 'Data Geospasial Desa & Riset Bencana'
  },
  {
    id: 'HAZ-BUFFER-TPA',
    title: 'Zona Pengawasan Buffer Emisi & Residu TPA',
    category: 'rawan_bencana',
    categoryLabel: 'Titik Rawan Bencana',
    rt: 'RT 19',
    rw: 'RW 04',
    dusun: 'Dusun Jatisari Selatan',
    x: 36,
    y: 84,
    description: 'Zona sabuk hijau pemantauan sensor gas metana CH4 dan kolam penampungan lindi untuk memastikan standar baku mutu lingkungan.',
    details: {
      kondisi: 'Sensor IoT Aktif 24 Jam',
      tingkatRisiko: 'Siaga',
      mitigasi: 'Ventilasi pipa flare biometana & audit berkala DLH',
      pj: 'Operator Teknis TPA Talangagung',
      kontak: 'Tim Teknis TPA: (0341) 395-xxx'
    },
    iconType: 'AlertTriangle',
    color: 'bg-rose-600 text-white',
    sumber: 'Data Geospasial Desa & Riset Bencana'
  },

  // --- SAMPLE TITIK SEBARAN 27 RT (REPRESENTATIF TIAP RW) ---
  {
    id: 'RT-01',
    title: 'Pos Warga RT 01 / RW 01',
    category: 'rt',
    categoryLabel: 'Sebaran RT',
    rt: 'RT 01',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan Barat)',
    x: 28,
    y: 34,
    description: 'Kawasan pemukiman RT 01 mencakup 48 KK di dekat akses talang air dan perbatasan barat.',
    details: {
      kapasitas: '48 KK (165 Jiwa)',
      pj: 'Ketua RT 01',
      kontak: 'Pos Ronda RT 01',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Users',
    color: 'bg-slate-700 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'RT-02',
    title: 'Pos Warga RT 02 / RW 01 (Pusat Layanan)',
    category: 'rt',
    categoryLabel: 'Sebaran RT',
    rt: 'RT 02',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan Tengah)',
    x: 40,
    y: 42,
    description: 'Kawasan pemukiman RT 02 mencakup 52 KK di sekitar kantor desa dengan akses jalan paving tertata.',
    details: {
      kapasitas: '52 KK (182 Jiwa)',
      pj: 'Ketua RT 02 (Pak Ahmad Fauzi)',
      kontak: '0812-7788-xxxx',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Users',
    color: 'bg-slate-700 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'RT-07',
    title: 'Pos Warga RT 07 / RW 02',
    category: 'rt',
    categoryLabel: 'Sebaran RT',
    rt: 'RT 07',
    rw: 'RW 02',
    dusun: 'Dusun 1 (Krajan Alun-Alun)',
    x: 50,
    y: 40,
    description: 'Wilayah hunian dan sentra niaga RT 07 dekat alun-alun desa mencakup 60 KK.',
    details: {
      kapasitas: '60 KK (210 Jiwa)',
      pj: 'Ketua RT 07',
      kontak: 'Pos Ronda RT 07',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Users',
    color: 'bg-slate-700 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'RT-12',
    title: 'Pos Warga RT 12 / RW 03',
    category: 'rt',
    categoryLabel: 'Sebaran RT',
    rt: 'RT 12',
    rw: 'RW 03',
    dusun: 'Dusun 2 (Jatisari Utara)',
    x: 62,
    y: 54,
    description: 'Wilayah pemukiman agraris RT 12 dekat saluran irigasi Molek mencakup 55 KK.',
    details: {
      kapasitas: '55 KK (195 Jiwa)',
      pj: 'Ketua RT 12',
      kontak: 'Pos Ronda RT 12',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Users',
    color: 'bg-slate-700 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'RT-17',
    title: 'Pos Warga RT 17 / RW 04',
    category: 'rt',
    categoryLabel: 'Sebaran RT',
    rt: 'RT 17',
    rw: 'RW 04',
    dusun: 'Dusun 2 (Jatisari Barat / TPA)',
    x: 35,
    y: 70,
    description: 'Kawasan pemukiman RT 17 penerima manfaat pipa gas metana biometana gratis mencakup 58 KK.',
    details: {
      kapasitas: '58 KK (204 Jiwa)',
      pj: 'Ketua RT 17',
      kontak: 'Pos Ronda RT 17',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Users',
    color: 'bg-slate-700 text-white',
    sumber: 'Profil Desa Talangagung'
  },
  {
    id: 'RT-25',
    title: 'Pos Warga RT 25 / RW 05',
    category: 'rt',
    categoryLabel: 'Sebaran RT',
    rt: 'RT 25',
    rw: 'RW 05',
    dusun: 'Dusun Krajan Timur (Perumahan)',
    x: 78,
    y: 28,
    description: 'Kawasan perumahan RT 25 dengan 65 KK dan paguyuban keamanan terpadu.',
    details: {
      kapasitas: '65 KK (220 Jiwa)',
      pj: 'Ketua RT 25',
      kontak: 'Pos Keamanan Terpadu RT 25',
      tingkatRisiko: 'Rendah'
    },
    iconType: 'Users',
    color: 'bg-slate-700 text-white',
    sumber: 'Profil Desa Talangagung'
  }
];

// Data Agregat per RW untuk Grafik Visualisasi
const rwChartData = [
  { rw: 'RW 01 (Krajan Barat)', rtCount: 5, kkCount: 260, fasilitasCount: 5, risikoScore: 2 },
  { rw: 'RW 02 (Krajan Tengah)', rtCount: 5, kkCount: 285, fasilitasCount: 4, risikoScore: 1 },
  { rw: 'RW 03 (Jatisari Selatan)', rtCount: 6, kkCount: 310, fasilitasCount: 3, risikoScore: 1 },
  { rw: 'RW 04 (Jatisari / TPA)', rtCount: 6, kkCount: 330, fasilitasCount: 4, risikoScore: 2 },
  { rw: 'RW 05 (Hunian Perumahan)', rtCount: 5, kkCount: 340, fasilitasCount: 5, risikoScore: 1 }
];

export const PetaDesaInteraktif: React.FC<PetaDesaInteraktifProps> = ({
  villageProfile,
  userContext,
  onNavigateTab,
  onOpenSos
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRw, setSelectedRw] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPoint, setSelectedPoint] = useState<VillageMapPoint | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [showHazardAlertOnly, setShowHazardAlertOnly] = useState<boolean>(false);

  // Filtered Map Points
  const filteredPoints = useMemo(() => {
    return villageMapPointsData.filter(pt => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || pt.category === activeCategory;
      // RW filter
      const matchesRw = selectedRw === 'all' || pt.rw === selectedRw;
      // Search query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        pt.title.toLowerCase().includes(query) ||
        pt.description.toLowerCase().includes(query) ||
        pt.rt.toLowerCase().includes(query) ||
        pt.categoryLabel.toLowerCase().includes(query);
      // Hazard only toggle
      const matchesHazard = !showHazardAlertOnly || pt.category === 'rawan_bencana';

      return matchesCategory && matchesRw && matchesSearch && matchesHazard;
    });
  }, [activeCategory, selectedRw, searchQuery, showHazardAlertOnly]);

  // Handle Voice Narration
  const handleSpeakPoint = (pt: VillageMapPoint) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const narration = `${pt.title}. Terletak di ${pt.rt}, ${pt.rw}, ${pt.dusun}. ${pt.description}. Kondisi atau catatan: ${pt.details?.kondisi || pt.details?.mitigasi || 'Beroperasi normal'}. Sumber resmi: ${pt.sumber}.`;
    setIsSpeaking(true);
    speakText(
      narration,
      () => setIsSpeaking(false),
      () => setIsSpeaking(true)
    );
  };

  const handleSelectPoint = (pt: VillageMapPoint) => {
    setSelectedPoint(pt);
    handleSpeakPoint(pt);
  };

  // Helper render icon marker
  const renderPointIcon = (pt: VillageMapPoint) => {
    if (pt.category === 'fasilitas_pendidikan') return <GraduationCap className="w-3.5 h-3.5" />;
    if (pt.category === 'fasilitas_energi') return <Fuel className="w-3.5 h-3.5" />;
    if (pt.category === 'perumahan') return <Home className="w-3.5 h-3.5" />;
    if (pt.category === 'fasilitas_publik') return <Building2 className="w-3.5 h-3.5" />;
    if (pt.category === 'irigasi_sungai') return <Droplets className="w-3.5 h-3.5" />;
    if (pt.category === 'rawan_bencana') return <AlertTriangle className="w-3.5 h-3.5 text-white animate-pulse" />;
    return <Users className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Peta Desa Interaktif Talangagung
                </h2>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 text-xs font-black rounded-full">
                  5 RW / 27 RT Terintegrasi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Visualisasi geospasial sebaran RT, fasilitas pendidikan (2 SDN), SPBU (2 unit), perumahan (3 kompleks), dan titik mitigasi rawan bencana.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            {onOpenSos && (
              <button
                onClick={onOpenSos}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Posko SOS Darurat</span>
              </button>
            )}
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedRw('all');
                setSearchQuery('');
                setShowHazardAlertOnly(false);
                setSelectedPoint(null);
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* 4 Kompas Batas Wilayah Ringkas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wide block">Batas Utara (↑ 0°)</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Ngasem – Palaan</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wide block">Batas Timur (→ 90°)</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Kepanjen – Cepokomulyo</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wide block">Batas Selatan (↓ 180°)</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Desa Panggungrejo</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wide block">Batas Barat (← 270°)</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Desa Jatikerto (Sungai Metro)</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Layer Categories & Quick Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama lokasi (contoh: SDN 1, SPBU, Metro Kencana, Talang Air, RT 02)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* RW Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">Pilih RW:</span>
            <select
              value={selectedRw}
              onChange={(e) => setSelectedRw(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Wilayah RW (5 RW)</option>
              <option value="RW 01">RW 01 (Krajan Barat)</option>
              <option value="RW 02">RW 02 (Krajan Tengah)</option>
              <option value="RW 03">RW 03 (Jatisari Selatan)</option>
              <option value="RW 04">RW 04 (Jatisari / TPA)</option>
              <option value="RW 05">RW 05 (Hunian Perumahan)</option>
            </select>

            <button
              onClick={() => setShowHazardAlertOnly(!showHazardAlertOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                showHazardAlertOnly 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Titik Rawan ({villageMapPointsData.filter(p => p.category === 'rawan_bencana').length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Titik ({villageMapPointsData.length})
          </button>
          <button
            onClick={() => setActiveCategory('rt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'rt'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Sebaran RT (27 RT)</span>
          </button>
          <button
            onClick={() => setActiveCategory('fasilitas_pendidikan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'fasilitas_pendidikan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pendidikan (2 SD)</span>
          </button>
          <button
            onClick={() => setActiveCategory('fasilitas_energi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'fasilitas_energi'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Energi (2 SPBU)</span>
          </button>
          <button
            onClick={() => setActiveCategory('perumahan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'perumahan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Perumahan (3 Kompleks)</span>
          </button>
          <button
            onClick={() => setActiveCategory('fasilitas_publik')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'fasilitas_publik'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Kantor & TPA Edukasi</span>
          </button>
          <button
            onClick={() => setActiveCategory('irigasi_sungai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'irigasi_sungai'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Talang & Irigasi Molek</span>
          </button>
          <button
            onClick={() => setActiveCategory('rawan_bencana')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              activeCategory === 'rawan_bencana'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Titik Rawan Bencana</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Canvas (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                Peta Wilayah Desa Talangagung
              </span>
              <span className="text-xs text-slate-500">({filteredPoints.length} titik aktif)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMapZoom(prev => Math.min(prev + 0.15, 1.45))}
                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 flex items-center justify-center font-bold text-xs"
                title="Perbesar Peta"
              >
                +
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(prev - 0.15, 0.85))}
                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 flex items-center justify-center font-bold text-xs"
                title="Perkecil Peta"
              >
                -
              </button>
            </div>
          </div>

          {/* Interactive SVG & Canvas Visual Map Container */}
          <div className="relative w-full h-[460px] sm:h-[540px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-inner select-none">
            
            {/* SVG Base Layers: Sungai Metro, Talang, dan Batas RW */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300"
              style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="irrigationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.8" />
                </linearGradient>
                <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="100" height="100" fill="url(#gridPattern)" />

              {/* RW Polygons / Zones */}
              {/* RW 01 (Krajan Barat) */}
              <polygon points="10,15 48,15 45,50 12,48" fill="rgba(59, 130, 246, 0.08)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.4" strokeDasharray="1,1" />
              {/* RW 02 (Krajan Alun-Alun) */}
              <polygon points="48,15 90,15 88,48 45,50" fill="rgba(99, 102, 241, 0.08)" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.4" strokeDasharray="1,1" />
              {/* RW 03 (Jatisari Selatan) */}
              <polygon points="45,50 88,48 85,88 42,88" fill="rgba(245, 158, 11, 0.08)" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="0.4" strokeDasharray="1,1" />
              {/* RW 04 (Jatisari Barat / TPA) */}
              <polygon points="12,48 45,50 42,88 15,88" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.4" strokeDasharray="1,1" />
              {/* RW 05 (Kompleks Perumahan Timur) */}
              <polygon points="65,18 95,18 95,50 65,50" fill="rgba(168, 85, 247, 0.12)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.5" />

              {/* Aliran Sungai Metro (Batas Barat Desa) */}
              <path 
                d="M 18,0 Q 22,25 15,45 T 20,80 T 12,100" 
                fill="none" 
                stroke="url(#riverGradient)" 
                strokeWidth="2.4" 
              />
              
              {/* Saluran Irigasi Molek */}
              <path 
                d="M 20,32 Q 40,42 55,58 T 88,72" 
                fill="none" 
                stroke="url(#irrigationGradient)" 
                strokeWidth="1.2" 
                strokeDasharray="2,1"
              />

              {/* Jembatan / Talang Air Besar Melintas Sungai Metro */}
              <line x1="14" y1="31" x2="26" y2="33" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
            </svg>

            {/* Geographical Markers & Labels */}
            {/* Sungai Metro Label */}
            <div className="absolute top-8 left-3 text-[10px] font-extrabold text-sky-400/80 tracking-wider rotate-90 origin-left">
              ALIRAN SUNGAI METRO
            </div>

            {/* Talang Air Label */}
            <div className="absolute top-[28%] left-[16%] text-[9px] font-black bg-amber-500/80 text-slate-900 px-1.5 py-0.5 rounded shadow-sm">
              TALANG BESAR METRO
            </div>

            {/* Irigasi Molek Label */}
            <div className="absolute bottom-[36%] right-[18%] text-[9px] font-extrabold text-teal-300/80 tracking-wider">
              ~ SALURAN IRIGASI MOLEK ~
            </div>

            {/* RW Zone Labels */}
            <div className="absolute top-6 left-1/4 text-[10px] font-black text-blue-300/60 uppercase">
              Zona RW 01
            </div>
            <div className="absolute top-6 right-1/4 text-[10px] font-black text-indigo-300/60 uppercase">
              Zona RW 02
            </div>
            <div className="absolute bottom-8 right-1/4 text-[10px] font-black text-amber-300/60 uppercase">
              Zona RW 03
            </div>
            <div className="absolute bottom-8 left-1/4 text-[10px] font-black text-emerald-300/60 uppercase">
              Zona RW 04 (TPA)
            </div>
            <div className="absolute top-1/4 right-[8%] text-[10px] font-black text-purple-300/70 uppercase">
              Zona RW 05 (Perumahan)
            </div>

            {/* Interactive Points on Canvas */}
            {filteredPoints.map((pt) => {
              const isSelected = selectedPoint?.id === pt.id;
              const isHazard = pt.category === 'rawan_bencana';

              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt)}
                  style={{ 
                    left: `${pt.x}%`, 
                    top: `${pt.y}%`,
                    transform: `translate(-50%, -50%) scale(${isSelected ? 1.25 : 1})`
                  }}
                  className={`absolute z-20 group flex items-center justify-center rounded-xl p-1.5 transition-all duration-200 cursor-pointer shadow-lg ${
                    isSelected 
                      ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-125 z-30' 
                      : 'hover:scale-120'
                  } ${pt.color}`}
                  title={`${pt.title} (${pt.rt}/${pt.rw})`}
                >
                  {renderPointIcon(pt)}

                  {/* Pulsing Alert Ring for Hazard Points */}
                  {isHazard && (
                    <span className="absolute -inset-1 rounded-xl bg-red-500/40 animate-ping pointer-events-none" />
                  )}

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-40 pointer-events-none w-48">
                    <div className="bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700 text-center leading-tight">
                      <span>{pt.title}</span>
                      <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{pt.rt} / {pt.rw}</span>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                  </div>
                </button>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-xl p-2.5 text-[10px] text-slate-300 space-y-1.5 hidden sm:block max-w-xs shadow-lg">
              <div className="font-bold text-white text-[11px] flex items-center gap-1.5 border-b border-slate-700 pb-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Legenda Peta Wilayah</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600 shrink-0" />
                  <span>2 SD Negeri</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-600 shrink-0" />
                  <span>2 SPBU</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600 shrink-0" />
                  <span>3 Perumahan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-600 shrink-0" />
                  <span>Balai & Pustu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-teal-600 shrink-0" />
                  <span>TPA Edukasi (3,5 Ha)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-600 shrink-0 animate-pulse" />
                  <span>Titik Rawan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>💡 Klik pada sembarang titik untuk membuka informasi detail, kontak darurat, dan panduan mitigasi.</span>
            <span className="font-bold text-slate-700">Sumber: Profil Desa Talangagung</span>
          </div>
        </div>

        {/* Selected Point Inspection Panel (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPoint ? (
            <div className="bg-white border-2 border-blue-500 rounded-3xl p-5 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs ${selectedPoint.color}`}>
                    {renderPointIcon(selectedPoint)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {selectedPoint.categoryLabel}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1 leading-tight">
                      {selectedPoint.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakPoint(selectedPoint)}
                  className={`p-2 rounded-xl border transition-all ${
                    isSpeaking 
                      ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Dengarkan Suara Info"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Location Badge */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {selectedPoint.rt} / {selectedPoint.rw}
                  </span>
                  <span>{selectedPoint.dusun}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedPoint.description}
              </p>

              {/* Detailed Specs */}
              {selectedPoint.details && (
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  {selectedPoint.details.kondisi && (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500">Status / Kondisi:</span>
                      <span className="font-bold text-slate-900">{selectedPoint.details.kondisi}</span>
                    </div>
                  )}
                  {selectedPoint.details.kapasitas && (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500">Kapasitas:</span>
                      <span className="font-bold text-slate-900">{selectedPoint.details.kapasitas}</span>
                    </div>
                  )}
                  {selectedPoint.details.mitigasi && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                      <span className="font-extrabold text-rose-800 text-[11px] block flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Panduan Mitigasi Bencana:
                      </span>
                      <p className="text-[11px] text-rose-900">{selectedPoint.details.mitigasi}</p>
                    </div>
                  )}
                  {selectedPoint.details.pj && (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500">Penanggung Jawab:</span>
                      <span className="font-bold text-slate-900">{selectedPoint.details.pj}</span>
                    </div>
                  )}
                  {selectedPoint.details.kontak && (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500">Kontak:</span>
                      <span className="font-bold text-blue-700">{selectedPoint.details.kontak}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      if (selectedPoint.category === 'perumahan' || selectedPoint.category === 'fasilitas_pendidikan' || selectedPoint.category === 'fasilitas_energi') {
                        onNavigateTab('profil-desa');
                      } else if (selectedPoint.id.includes('TPA')) {
                        onNavigateTab('memori-tpa');
                      } else {
                        onNavigateTab('rtwarga');
                      }
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Buka Modul Terkait</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Tutup
                </button>
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Sumber: <strong>{selectedPoint.sumber}</strong>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Navigation className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">Pilih Titik di Peta</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Klik ikon pada peta untuk memeriksa rincian fasilitas (2 SDN, 2 SPBU, 3 Perumahan), batas RT, atau panduan evakuasi titik rawan bencana.
              </p>
            </div>
          )}

          {/* Quick List: Titik Rawan Bencana & Kesiapsiagaan */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Titik Pantau Siaga Bencana</span>
              </h4>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Siaga 24 Jam
              </span>
            </div>

            <div className="space-y-2">
              {villageMapPointsData.filter(p => p.category === 'rawan_bencana').map((hz) => (
                <button
                  key={hz.id}
                  onClick={() => handleSelectPoint(hz)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs group-hover:text-rose-700">
                      {hz.title}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      hz.details?.tingkatRisiko === 'Tinggi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {hz.details?.tingkatRisiko || 'Siaga'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{hz.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Chart: Agregat Kepadatan & Fasilitas per RW */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Statistik Sebaran RT, KK, & Fasilitas per RW
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Grafik perbandingan jumlah kepala keluarga (KK) dan sebaran sarana umum di 5 RW Desa Talangagung
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl self-start sm:self-auto">
            Sumber: <strong>Profil Desa Talangagung & BPS</strong>
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rwChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="rw" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  border: 'none', 
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="kkCount" name="Jumlah KK" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="fasilitasCount" name="Jumlah Fasilitas" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center">
          {rwChartData.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">{item.rw.split(' ')[0]} {item.rw.split(' ')[1]}</span>
              <div className="text-base font-black text-slate-900">{item.kkCount} KK</div>
              <span className="text-[10px] text-emerald-700 font-bold">{item.rtCount} RT • {item.fasilitasCount} Fasilitas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
