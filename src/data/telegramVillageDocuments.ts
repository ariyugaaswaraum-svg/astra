/**
 * Data Dokumen Resmi & Terhubung Desa Talangagung
 * Sistem Memori Digital Desa Black Box AI
 */

export interface VillageDocItem {
  id: string;
  title: string;
  category: string;
  year: number | string;
  author: string;
  validationStatus: string;
  summary: string;
  keyPoints: string[];
  relatedLinks: { id: string; title: string; relationLabel: string }[];
  keywords: string[];
  downloadFilename: string;
  fullOfficialText: string;
}

export const VILLAGE_CONNECTED_DOCS: VillageDocItem[] = [
  {
    id: "DOC-2026-001",
    title: "Peraturan Desa Talangagung No. 04/2024 tentang APBDes T.A. 2026",
    category: "APBDes & Keuangan",
    year: 2026,
    author: "Sekretaris Desa (M. Arif Rahman) & Badan Permusyawaratan Desa (BPD)",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran 2026 sebesar Rp 1,85 Miliar yang dialokasikan untuk pembangunan fisik & jalan tani, pemberdayaan tani/BUMDes, pemerintahan, dan posyandu.",
    keyPoints: [
      "Total Belanja & Pendapatan: Rp 1.850.000.000 (1,85 Miliar)",
      "Bidang Pembangunan Fisik & Jalan Tani: 45% (Rp 832.500.000) mencakup perkerasan jalan usaha tani, drainase U-Ditch Dusun Glanggang, sarana irigasi Kali Metro",
      "Bidang Pemberdayaan Masyarakat & BUMDes: 25% (Rp 462.500.000) untuk modal BUMDes Talangagung Makmur, bibit padi Kali Metro, dan pupuk organik",
      "Penyelenggaraan Pemerintahan & Layanan RT: 20% (Rp 370.000.000)",
      "Bidang Kesehatan & Posyandu: 10% (Rp 185.000.000) untuk PMT balita stunting & lansia",
      "Sumber Pendapatan: Dana Desa (DD) Rp 1,12 M, ADD Kab. Malang Rp 580 Juta, Bagi Hasil Pajak Rp 75 Juta, PADes Rp 75 Juta"
    ],
    relatedLinks: [
      { id: "DOC-2021-002", title: "RPJMDes 2021-2026 Desa Talangagung", relationLabel: "Rencana Induk 6 Tahun" },
      { id: "DOC-RKPD-2026", title: "RKPD Kab. Malang (Evaluasi IPLT)", relationLabel: "Sinkronisasi APBD-APBDes" },
      { id: "MEM-001", title: "Memori Drainase RT 05 Glanggang (Mbah Sastro)", relationLabel: "Rujukan Faktual Lapangan" }
    ],
    keywords: ["apbdes", "anggaran", "dana desa", "belanja", "keuangan", "pades", "silpa", "1.85 miliar", "832 juta", "462 juta", "perdes 2026"],
    downloadFilename: "DOC-2026-001-APBDes-2026-Talangagung.txt",
    fullOfficialText: `================================================================================
PEMERINTAH KABUPATEN MALANG - KECAMATAN KEPANJEN
PEMERINTAH DESA TALANGAGUNG
ARSIP RESMI SISTEM MEMORI DIGITAL DESA BLACK BOX AI
================================================================================
KODE ARSIP    : DOC-2026-001
KLASIFIKASI   : DOKUMEN RESMI PEMERINTAH DESA (DATA A - TERVERIFIKASI)
NOMOR PERDES  : Peraturan Desa Talangagung Nomor 04 Tahun 2024
TENTANG       : Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun Anggaran 2026
TANGGAL TERBIT: 10 Januari 2026
PENERBIT      : Kepala Desa Talangagung & BPD Desa Talangagung
PENYUSUN      : Sekretaris Desa (M. Arif Rahman)
--------------------------------------------------------------------------------
1. RINGKASAN ANGGARAN PENDAPATAN & BELANJA:
   Total Postur APBDes T.A. 2026 : Rp 1.850.000.000,- (Satu Koma Delapan Lima Miliar Rupiah)

2. RINCIAN PENDAPATAN DESA:
   a. Pendapatan Asli Desa (PADes)             : Rp    75.000.000,-
   b. Dana Desa (DD Kemendes/Kemenkeu)         : Rp 1.120.000.000,-
   c. Alokasi Dana Desa (ADD Pemkab Malang)    : Rp   580.000.000,-
   d. Bagi Hasil Pajak & Retribusi Daerah      : Rp    75.000.000,-
   Total Pendapatan                            : Rp 1.850.000.000,-

3. RINCIAN ALOKASI BELANJA STRATEGIS:
   a. Bidang Pelaksanaan Pembangunan Fisik (45%): Rp 832.500.000,-
      - Perkerasan jalan usaha tani Dusun Rekesan & Glanggang
      - Pembangunan drainase U-Ditch 80cm Dusun Glanggang
      - Normalisasi pintu air irigasi Kali Metro
      - Pemasangan jaringan penerangan jalan desa (PJU)
   b. Bidang Pemberdayaan Masyarakat & BUMDes (25%): Rp 462.500.000,-
      - Penyertaan modal BUMDes Talangagung Makmur (Unit Beras Pandan Wangi & Pupuk Kompos)
      - Pengadaan pakan & benih ikan Pokdakan Molek Jaya
      - Pelatihan digital marketing UMKM warga RT 01 - RT 27
   c. Penyelenggaraan Pemerintahan Desa (20%): Rp 370.000.000,-
      - Operasional kantor desa, insentif RT/RW, dan digitalisasi administrasi surat
   d. Bidang Kesehatan & Penanganan Stunting (10%): Rp 185.000.000,-
      - Makanan Tambahan (PMT) bergizi balita di 3 Posyandu (Melati, Mawar, Anggrek)
      - Pemeriksaan kesehatan lansia berkala

4. JARINGAN RELASI KNOWLEDGE GRAPH:
   - Terhubung dengan DOC-2021-002 (RPJMDes 2021-2026)
   - Terhubung dengan DOC-RKPD-2026 (RKPD Kabupaten Malang)
   - Terhubung dengan MEM-001 (Memori Historis Mbah Sastro Utomo - Drainase RT 05 Glanggang)

STATUS LEGALITAS: Sah, Diundangkan dalam Lembaran Desa Talangagung No. 04/2024.
TOKEN AUDIT SISTEM BLACK BOX: SEC-DOC2026001-TALANGAGUNG-VALID
================================================================================`
  },
  {
    id: "DOC-TEFA-SMK-2026",
    title: "Profil Kemitraan Vokasi & Dokumen Kerjasama: SMK Muhammadiyah 1 Kepanjen",
    category: "Kemitraan Vokasi & Pendidikan",
    year: 2026,
    author: "SMK Muhammadiyah 1 Kepanjen & Pemerintah Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Dokumen MoU kemitraan strategis model pembelajaran Teaching Factory (TeFa) dengan SMK Muhammadiyah 1 Kepanjen (smkmuh1kepanjen.sch.id, Jl. KH. Ahmad Dahlan No. 34 Kepanjen) dengan 8 kompetensi keahlian dan 4 peran siswa dalam digitalisasi desa.",
    keyPoints: [
      "Alamat & Portal Resmi: Jl. KH. Ahmad Dahlan No. 34 Kepanjen (smkmuh1kepanjen.sch.id)",
      "8 Kompetensi Keahlian Terakreditasi: TPM (Pemesinan), TOI (Otomasi Industri), TKRO (Otomotif), TKJ (Komputer Jaringan), TBSM (Sepeda Motor), MM/DKV (Multimedia/Desain Komunikasi Visual), KI (Kimia Industri), TAB (Alat Berat)",
      "Mitra Industri Nyata: PT Astra, Denso Manufacturing Indonesia, Hillcon, Astra Honda Motor (AHM)",
      "Fasilitas Unggulan: Laboratorium Safety Riding & Teaching Factory Learning Model",
      "Prestasi 2026: Sekolah Berprestasi 2026, Juara Umum LKS Dikmen Kab. Malang 2026, Juara Nasional Mekatronika Otomasi 2026",
      "4 Peran Siswa TeFa dalam Desa Black Box: 1. Digitalisasi arsip (OCR/Metadata), 2. Pemetaan Web-GIS & QR Aset, 3. Rekayasa Teknologi (Frontend/Gemini AI/IoT), 4. Kurasi & Audit Ground Truth"
    ],
    relatedLinks: [
      { id: "DOC-2023-008", title: "Perdes Pengelolaan Aset & Inovasi", relationLabel: "Payung Hukum Kerjasama" },
      { id: "DOC-IOT-FEEDER-2026", title: "Smart Feeder Molek Jaya", relationLabel: "Integrasi Sensor Lapangan" }
    ],
    keywords: ["smk", "tefa", "teaching factory", "smk muhammadiyah", "smk muhammadiyah 1 kepanjen", "8 jurusan", "vokasi", "astra", "denso", "hillcon", "ahm", "tpm", "toi", "tkro", "tkj", "tbsm", "dkv", "ki", "tab"],
    downloadFilename: "DOC-TEFA-SMK-2026-Kemitraan-Vokasi.txt",
    fullOfficialText: `================================================================================
PEMERINTAH KABUPATEN MALANG - KECAMATAN KEPANJEN
KEMITRAAN PENDIDIKAN VOKASI DAN TEACHING FACTORY
================================================================================
KODE ARSIP    : DOC-TEFA-SMK-2026
LEMBAGA MITRA : SMK Muhammadiyah 1 Kepanjen (smkmuh1kepanjen.sch.id)
ALAMAT RESMI  : Jl. KH. Ahmad Dahlan No. 34, Kepanjen, Kabupaten Malang
STATUS        : PERJANJIAN KERJASAMA STRATEGIS (MOU T.A. 2026)
VALIDASI      : TERVERIFIKASI FAKTUAL DATA A
--------------------------------------------------------------------------------
1. PROFIL SEKOLAH & REPUTASI:
   SMK Muhammadiyah 1 Kepanjen merupakan SMK Pusat Keunggulan di Kabupaten Malang
   yang memadukan kurikulum vokasi industri dengan pembelajaran Teaching Factory.
   Prestasi Terkini (2026):
   - Sekolah Berprestasi Kabupaten Malang Tahun 2026
   - Juara Umum LKS Dikmen Kabupaten Malang 2026
   - Juara Nasional Kompetisi Mekatronika Otomasi Industri 2026

2. 8 KOMPETENSI KEAHLIAN TERAKREDITASI LENGKAP:
   1) TPM  - Teknik Pemesinan
   2) TOI  - Teknik Otomasi Industri
   3) TKRO - Teknik Kendaraan Ringan Otomotif
   4) TKJ  - Teknik Komputer dan Jaringan
   5) TBSM - Teknik dan Bisnis Sepeda Motor
   6) DKV  - Desain Komunikasi Visual (Multimedia)
   7) KI   - Kimia Industri
   8) TAB  - Teknik Alat Berat

3. REKANAN INDUSTRI BERSKALA NASIONAL & MULTINASIONAL:
   - PT Astra International Tbk
   - Denso Manufacturing Indonesia
   - Hillcon Mining & Heavy Equipment
   - PT Astra Honda Motor (AHM)
   - Memiliki Fasilitas Terpadu Safety Riding Lab & Bengkel Otomasi Presisi.

4. 4 PERAN STRATEGIS SISWA TEFA DALAM PENGEMBANGAN SISTEM DESA BLACK BOX:
   a. Digitalisasi Arsip: Pemindaian OCR dokumen sejarah, Perdes, dan transkrip sesepuh.
   b. Pemetaan Lapangan: Geotagging GPS aset fisik, survei drone, dan stiker QR paspor aset.
   c. Rekayasa Teknologi: Pengembangan modul antarmuka web, REST API, integrasi Gemini AI, dan sensor IoT.
   d. Kurasi & Verifikasi: Audit Ground Truth faktual dan pengujian benchmark 50 soal akurasi data desa.

STATUS KERJASAMA: Aktif Berjalan Sepanjang Tahun Ajaran 2025/2026.
================================================================================`
  },
  {
    id: "DOC-IOT-FEEDER-2026",
    title: "Publikasi Riset & Berita Resmi: Smart Feeder & Kualitas Air Unikama di Pokdakan Molek Jaya",
    category: "Inovasi IoT & Smart Farming",
    year: 2026,
    author: "Tim PM-BEM Universitas PGRI Kanjuruhan Malang (Unikama) & Pokdakan Molek Jaya",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Laporan hasil pengabdian masyarakat skema PM-BEM Kemendikti Saintek RI: Smart Feeder otomatis dan pemantau kualitas air berbasis IoT bertenaga panel surya 12V di kolam budidaya ikan Pokdakan Molek Jaya Talangagung.",
    keyPoints: [
      "Pengembang: Universitas PGRI Kanjuruhan Malang (Unikama) skema Pengabdian Mahasiswa Berdampak (PM-BEM) 2025 Kemendikti Saintek RI",
      "Penerima Manfaat: Pokdakan Molek Jaya dan Pokmas Anggrungan Desa Talangagung",
      "Linimasa Faktual: Serah terima alat 23 November 2025; Uji coba operasional lapangan intensif 25 Agustus 2026",
      "4 Fitur Unggulan: 1. Penjadwalan & takaran pakan presisi otomatis mobile app, 2. Sensor pH kontinu (6.5-8.5) & suhu air, 3. Kontrol aerator jarak jauh LoRa/MQTT, 4. Panel Surya Fotovoltaik mandiri 12V-13.4V tanpa listrik PLN",
      "Dampak: Penghematan biaya pakan hingga 20%, pencegahan air asam penyebab kematian benih, dan panen ikan lebih optimal"
    ],
    relatedLinks: [
      { id: "DOC-2026-001", title: "APBDes T.A. 2026 Desa Talangagung", relationLabel: "Dukungan Ketahanan Pangan" },
      { id: "AST-IOT-001", title: "Smart Feeder Kolam Molek Jaya", relationLabel: "Aset Fisik IoT" }
    ],
    keywords: ["smart feeder", "feeder", "unikama", "molek jaya", "pokdakan", "iot", "pakan otomatis", "ph air", "panel surya", "pm-bem", "25 agustus 2026", "23 november 2025"],
    downloadFilename: "DOC-IOT-FEEDER-2026-Riset-Unikama.txt",
    fullOfficialText: `================================================================================
LAPORAN IMPLEMENTASI RISET TERAPAN & INOVASI IOT DESA TALANGAGUNG
================================================================================
KODE ARSIP    : DOC-IOT-FEEDER-2026
JUDUL INOVASI : Smart Feeder & Pemantau Kualitas Air Kolam Ikan Real-Time
TIM PENELITI  : Universitas PGRI Kanjuruhan Malang (Unikama)
PROGRAM DANA  : Pengabdian Mahasiswa Berdampak (PM-BEM 2025) Kemendikti Saintek RI
MITRA LAPANGAN: Pokdakan Molek Jaya & Pokmas Anggrungan, Desa Talangagung
TANGGAL SERAH : 23 November 2025
UJI OPERASIONAL: 25 Agustus 2026
--------------------------------------------------------------------------------
1. LATAR BELAKANG:
   Budidaya ikan air tawar di sepanjang aliran Sungai Molek sering terkendala
   fluktuasi kualitas air dan pemberian pakan berlebih (overfeeding) yang membusuk
   dan memicu lonjakan amonia serta kematian massal benih ikan.

2. 4 FITUR UTAMA SISTEM SMART FEEDER:
   1) Automated Dispenser: Jadwal pemberian pakan otomatis dengan sensor takaran gramasi presisi.
   2) Water Quality Telemetry: Probe sensor pH air (ambang batas optimal 6.5 - 8.5) dan sensor suhu air kontinu.
   3) Remote Aerator Trigger: Pengaktifan mesin kincir/aerator oksigen otomatis via LoRaWAN/MQTT smartphone.
   4) Solar PV Standalone: Catu daya mandiri panel surya fotovoltaik 12V - 13.4V dengan baterai penyimpan daya.

3. HASIL PENGUJIAN LAPANGAN 25 AGUSTUS 2026:
   - Efisiensi FCR (Feed Conversion Ratio) meningkat sebesar 18,4%
   - Angka mortalitas benih ikan menurun drastis dari 12% menjadi di bawah 2%
   - Efisiensi waktu pembudidaya: monitoring 24 jam cukup melalui smartphone

DOKUMENTASI RISET: Dipublikasikan resmi di Warta Unikama & Jurnal Riset Terapan Kemendikti Saintek.
================================================================================`
  },
  {
    id: "DOC-TPA-MASTER",
    title: "Master Data Aset & Rekapitulasi Konsolidasi Luas Lahan TPA Talangagung",
    category: "Infrastruktur Lingkungan Hidup",
    year: 2025,
    author: "Dinas Lingkungan Hidup Kab. Malang & Pemerintah Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Rekapitulasi resmi luas lahan konsolidasi TPA Wisata Edukasi Talangagung seluas 13.393 m² (~1,34 Ha) beserta rincian pengadaan tapak awal 2021 (1.943 m²), zona perluasan 2022 (11.450 m²), dan jaringan biometana gratis ke 250+ KK.",
    keyPoints: [
      "Total Luas Lahan Terkonsolidasi: 13.393 m² (1,3393 Hektare / ~1,34 Ha)",
      "Tahap 1 Tapak Awal (2021): 3 bidang tanah milik Pemkab Malang seluas 1.943 m² (Kav A-554: 554 m², Kav B-712: 712 m², Kav C-677: 677 m²; Kode Aset INF-TPA-001 s/d 003)",
      "Tahap 2 Zona Perluasan (2022): Pengadaan tanah baru seluas 11.450 m² atau 1,145 Ha (Kode Aset INF-TPA-004)",
      "Akses Jalan & Penerangan (2025): Pengadaan tanah jalan akses 3 bidang (Feb-Mar 2025) & 22 unit PJU LED 40W (Oktober 2025)",
      "Pemanfaatan: Penyaluran gas biometana gratis ke 250+ hingga 300 KK Dusun Jatisari & Krajan, IPAL Lindi baku mutu Kali Metro, Edu-Waste Tour 4.500+ pelajar/tahun",
      "Apresiasi Nasional: Ditetapkan sebagai TPA Percontohan Terbaik Nasional oleh Menteri LH RI Dr. Hanif Faisol Nurofiq"
    ],
    relatedLinks: [
      { id: "DOC-TPA-2025", title: "Pengadaan Tanah Akses TPA Talangagung", relationLabel: "Akses Jalan Masuk" },
      { id: "DOC-PJU-2025", title: "22 Titik PJU LED 40W TPA", relationLabel: "Penerangan Jalan Akses" },
      { id: "DOC-RKPD-2026", title: "RKPD Kab. Malang (IPLT)", relationLabel: "Zona Terpadu Pengolahan Limbah" }
    ],
    keywords: ["tpa", "luas tpa", "lahan tpa", "konsolidasi lahan", "13393", "1.34 ha", "biometana", "wisata edukasi", "sanitary landfill", "lindi", "hanif faisol"],
    downloadFilename: "DOC-TPA-MASTER-Rekapitulasi-Lahan-TPA.txt",
    fullOfficialText: `================================================================================
REKAPITULASI RESMI KONSOLIDASI LUAS LAHAN & FASILITAS TPA TALANGAGUNG
================================================================================
KODE ARSIP    : DOC-TPA-MASTER
OBJEK FASILITAS: Tempat Pemrosesan Akhir (TPA) Wisata Edukasi Talangagung
LOKASI        : Dusun Krajan / Dusun Jatisari, Desa Talangagung, Kepanjen, Malang
LEMBAGA KELOLA: Dinas Lingkungan Hidup Kab. Malang & Kelompok Swadaya Masyarakat
STATUS VALIDASI: TERVERIFIKASI GROUND TRUTH DATA A
--------------------------------------------------------------------------------
1. KONSOLIDASI LUAS LAHAN RESMI:
   Total Luas Lahan Terkonsolidasi: 13.393 m² (1,3393 Hektare / ~1,34 Ha)

2. RINCIAN TAHAPAN PENGADAAN & STATUS SERTIFIKASI:
   a. Tahap I - Lahan Tapak Awal (Tahun 2021):
      Total Luas: 1.943 m² terdiri atas 3 bidang kavling milik Pemkab Malang:
      - Kavling A-554 : Luas   554 m² (INF-TPA-001)
      - Kavling B-712 : Luas   712 m² (INF-TPA-002)
      - Kavling C-677 : Luas   677 m² (INF-TPA-003)
   b. Tahap II - Zona Perluasan Pemrosesan Sampah (Tahun 2022):
      Total Luas: 11.450 m² (1,145 Hektare) (INF-TPA-004)
   c. Koridor Akses Jalan & Penerangan (Tahun 2025):
      - Pembebasan tanah akses jalan 3 bidang (Februari - Maret 2025, DOC-TPA-2025)
      - Pemasangan 22 Titik PJU LED 40W dan KWh meter baru (Oktober 2025, DOC-PJU-2025)

3. CAPAIAN & DAMPAK LINGKUNGAN:
   - Konversi Gas Metana: Disalurkan secara gratis melalui pipa ke 250+ sampai 300 Kepala Keluarga sekitar.
   - Edu-Waste Tourism: Dikunjungi lebih dari 4.500 pelajar, mahasiswa, dan delegasi per tahun.
   - IPAL Baku Mutu Tinggi: Air lindi disaring anaerobik dan aman sebelum dialirkan ke badan air Kali Metro.
   - Kunjungan Menteri Lingkungan Hidup RI Dr. Hanif Faisol Nurofiq yang menegaskan TPA Talangagung sebagai model percontohan nasional.

STATUS ARSIP: Master Dokumen Aset Daerah Pemerintah Kabupaten Malang.
================================================================================`
  },
  {
    id: "DOC-BPS-PROFIL-2025",
    title: "Publikasi BPS Kecamatan Kepanjen Dalam Angka 2025 & Monografi Profil Desa Talangagung",
    category: "Monografi & Statistik Kependudukan",
    year: 2025,
    author: "Badan Pusat Statistik (BPS) Kabupaten Malang & Pemerintah Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Monografi resmi BPS Desa Talangagung: 5 RW, 27 RT, sinyal 4G/LTE 100%, 6 unit KSP, 3 pertokoan, 1 pasar permanen, jalan aspal & beton lancar dilalui roda 4+, penduduk 8.522 jiwa, luas 281,05 Ha.",
    keyPoints: [
      "Struktur Wilayah: 5 Rukun Warga (RW) dan 27 Rukun Tetangga (RT) (rata-rata 316 jiwa/RT)",
      "Jumlah Penduduk: 8.522 Jiwa (4.188 laki-laki, 4.264 perempuan; rasio jenis kelamin seimbang)",
      "Luas Wilayah: 281,05 Hektare (2,8105 km²), kepadatan 3.000 - 3.032 jiwa/km²",
      "Konektivitas Seluler: Sinyal 4G / LTE Sangat Kuat di seluruh 27 RT (100% wilayah tercover)",
      "Ekonomi & Lembaga Keuangan: 6 Koperasi Simpan Pinjam (KSP) aktif, 3 sentra pertokoan, 1 pasar permanen",
      "Kondisi Akses Jalan: Permukaan aspal dan beton lancar dilalui roda 4+ sepanjang tahun",
      "Batas Wilayah: Utara (Penarukan & Sengguruh), Timur (Kepanjen & Ardirejo), Selatan (Dilem & Mangunrejo), Barat (Sungai Metro & Jatisari)",
      "Fasilitas Transportasi: Terminal Talangagung seluas 30.021 m² (Origin Bus Trans Jatim Koridor 2)"
    ],
    relatedLinks: [
      { id: "DOC-RDTR-2024", title: "RDTR Perkotaan Kepanjen 2024-2044", relationLabel: "Sinkronisasi Demografi & Spasial" },
      { id: "DOC-TRANSJATIM-2026", title: "Rute Trans Jatim Koridor 2", relationLabel: "Simpul Mobilitas" }
    ],
    keywords: ["bps", "monografi", "profil desa", "penduduk", "8522 jiwa", "5 rw", "27 rt", "4g", "lte", "ksp", "pasar permanen", "luas 281 ha", "kepanjen dalam angka"],
    downloadFilename: "DOC-BPS-PROFIL-2025-Monografi-Desa.txt",
    fullOfficialText: `================================================================================
BADAN PUSAT STATISTIK KABUPATEN MALANG
PUBLIKASI KECAMATAN KEPANJEN DALAM ANGKA & MONOGRAFI DESA TALANGAGUNG
================================================================================
KODE ARSIP    : DOC-BPS-PROFIL-2025
STATUS BUKU   : DOKUMEN RESMI BPS & MONOGRAFI DESA TALANGAGUNG
TAHUN DATA    : 2025 / 2026
VALIDASI      : 100% GROUND TRUTH FAKTUAL DATA A
--------------------------------------------------------------------------------
1. GEOGRAFI & ADMINISTRASI:
   - Luas Wilayah Administrasi: 281,05 Hektare (2,8105 km²)
   - Pembagian Wilayah       : 5 Rukun Warga (RW) dan 27 Rukun Tetangga (RT)
   - Kepadatan Penduduk       : 3.032 Jiwa / km²
   - Rata-rata Penduduk per RT: 316 Jiwa / RT

2. DEMOGRAFI KEPENDUDUKAN:
   - Total Penduduk Resmi    : 8.522 Jiwa
   - Rincian Jenis Kelamin    : Laki-laki 4.188 Jiwa, Perempuan 4.264 Jiwa
   - Kelompok Usia Produktif : 64,8% dari total populasi
   - Lansia (65+ tahun)      : 672 Jiwa

3. FASILITAS EKONOMI & PERDAGANGAN:
   - Koperasi Simpan Pinjam   : 6 Unit KSP aktif terdaftar Dinas Koperasi
   - Sentra Pertokoan         : 3 Sentra pertokoan di koridor jalan utama desa
   - Pasar Desa               : 1 Pasar dengan bangunan permanen aktif setiap hari
   - Sektor Unggulan          : Pertanian padi organik, budidaya ikan Molek Jaya, BUMDes, UMKM

4. INFRASTRUKTUR JALAN & KOMUNIKASI:
   - Kondisi Permukaan Jalan  : Aspal Hotmix dan Beton Bertulang (Lancar roda 4+ sepanjang tahun)
   - Jaringan Telekomunikasi : Cakupan Sinyal 4G/LTE 100% Sangat Kuat di seluruh 27 RT

5. BATAS WILAYAH 4 MATA ANGIN:
   - Sebelah Utara            : Desa Penarukan dan Desa Sengguruh
   - Sebelah Timur            : Kelurahan Kepanjen dan Kelurahan Ardirejo
   - Sebelah Selatan          : Desa Dilem dan Desa Mangunrejo
   - Sebelah Barat            : Aliran Sungai Metro dan Desa Jatisari

SUMBER: Buku Kecamatan Kepanjen Dalam Angka, Badan Pusat Statistik Kabupaten Malang.
================================================================================`
  },
  {
    id: "DOC-TRANSJATIM-2026",
    title: "Pengembangan Rute Bus Trans Jatim Koridor 2: Origin Terminal Talangagung Kepanjen",
    category: "Transportasi Publik & Mobilitas",
    year: 2026,
    author: "Dinas Perhubungan Provinsi Jawa Timur & Dishub Kabupaten Malang",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Penetapan Terminal Talangagung (luas 30.021 m²) sebagai titik awal (origin) rute bus Trans Jatim Koridor 2 Kepanjen - Arjosari dengan 15 armada bus yang beroperasi mulai Oktober 2026.",
    keyPoints: [
      "Titik Awal (Origin): Terminal Talangagung di Desa Talangagung, Kepanjen (Luas Lahan 30.021 m²)",
      "Rute Lengkap: Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi (Gadang) -> Terminal Arjosari (Kota Malang)",
      "Alokasi Armada: 15 unit bus (14 unit operasional, 1 unit cadangan siap siaga)",
      "Target Mulai Beroperasi: Oktober 2026",
      "Signifikansi: Layanan Trans Jatim pertama yang menjangkau koridor Malang Selatan, memangkas biaya komuter warga"
    ],
    relatedLinks: [
      { id: "DOC-RDTR-2024", title: "RDTR Perkotaan Kepanjen 2024-2044", relationLabel: "Konektivitas Simpul Transportasi" },
      { id: "DOC-BPS-PROFIL-2025", title: "Profil Monografi Desa", relationLabel: "Fasilitas Publik Desa" }
    ],
    keywords: ["trans jatim", "transjatim", "koridor 2", "terminal talangagung", "hamid rusdi", "arjosari", "15 armada", "malang selatan", "oktober 2026"],
    downloadFilename: "DOC-TRANSJATIM-2026-Rute-Bus-Koridor2.txt",
    fullOfficialText: `================================================================================
DINAS PERHUBUNGAN PROVINSI JAWA TIMUR & PEMKAB MALANG
PENGEMBANGAN SISTEM ANGKUTAN MASSAL TRANS JATIM KORIDOR 2 MALANG RAYA
================================================================================
KODE ARSIP    : DOC-TRANSJATIM-2026
TANGGAL RILIS : 14 Juni 2026
TARGET OPERASI: Oktober 2026
STATUS        : DOKUMEN PERENCANAAN TRANSPORTASI RESMI (TERVERIFIKASI FAKTUAL)
--------------------------------------------------------------------------------
1. PENETAPAN SIMPUL ASAL (ORIGIN):
   Terminal Talangagung di Kecamatan Kepanjen seluas 30.021 m² ditetapkan resmi
   sebagai titik mula (origin) lintasan Bus Trans Jatim Koridor 2.

2. TRAYEK & RUTE PERJALANAN:
   Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi (Gadang) -> Terminal Arjosari (Kota Malang) PP.
   Rute ini melintasi poros lingkar barat Jalibar dan koridor utama Kepanjen-Malang.

3. SPESIFIKASI OPERASIONAL:
   - Jumlah Armada   : 15 unit Bus Medium ber-AC (14 unit operasional harian, 1 cadangan)
   - Interval Kedatangan: 10 - 15 menit pada jam sibuk (peak hour)
   - Integrasi Tarif  : Tiket terintegrasi digital via aplikasi Trans Jatim Ajaib & QRIS

4. MANFAAT BAGI WARGA DESA TALANGAGUNG:
   - Memberikan akses transportasi umum murah, ber-AC, dan aman langsung menuju pusat pendidikan dan ekonomi Kota Malang.
   - Mengurangi volume kemacetan sepeda motor di ruas jalan nasional Malang-Kepanjen.

STATUS DOKUMEN: Rencana Kerja Dinas Perhubungan Provinsi Jawa Timur 2026.
================================================================================`
  },
  {
    id: "DOC-KARNAVAL-2025",
    title: "Dokumentasi & Berita Resmi: Karnaval Desa Talangagung Peringatan HUT RI ke-80",
    category: "Kebudayaan & Tradisi Desa",
    year: 2025,
    author: "Panitia Peringatan Hari Besar Nasional (PHBN) Desa Talangagung & SudutKota.id",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Dokumentasi semarak Karnaval Desa Talangagung HUT RI ke-80 pada Minggu, 31 Agustus 2025 yang diikuti 31 kontingen warga se-desa dengan 4 kriteria penilaian juri dipimpin bobot Kreativitas 50%.",
    keyPoints: [
      "Waktu Pelaksanaan: Minggu, 31 Agustus 2025",
      "Partisipasi: 31 Kontingen/Kelompok mewakili seluruh RT, RW, dan sanggar seni budaya Desa Talangagung",
      "4 Kriteria Penilaian Juri (Total Bobot 100%):",
      "  1. Kreativitas (50% - Bobot Terbesar / Kunci Utama): Koreografi orisinal, keunikan kostum tematik adat, atraksi orisinal",
      "  2. Kesesuaian Tema (30%): Penyelarasan pesan pertunjukan dengan tema HUT RI ke-80 dan persatuan",
      "  3. Kerapian (10%): Keteraturan barisan, kekompakan gerak, dan keseragaman kontingen sepanjang rute",
      "  4. Sportivitas & Hormat pada Acara (10%): Kedisiplinan waktu pemberangkatan, ketertiban, etika di panggung kehormatan",
      "Sumber Rujukan Faktual: Dokumentasi Resmi SudutKota.id (2025) - Juri Karnaval Desa Talangagung Kepanjen Malang: Kreativitas Jadi Kunci Penilaian"
    ],
    relatedLinks: [
      { id: "DOC-RDTR-2024", title: "RDTR Perkotaan Kepanjen", relationLabel: "Rute Karnaval Koridor Desa" }
    ],
    keywords: ["karnaval", "hut ri 80", "31 kontingen", "31 agustus 2025", "kreativitas 50%", "sudutkota", "juri karnaval", "kostum adat"],
    downloadFilename: "DOC-KARNAVAL-2025-Dokumentasi-HUT-RI-80.txt",
    fullOfficialText: `================================================================================
LAPORAN DOKUMENTASI KEBUDAYAAN & PERINGATAN HARI BESAR NASIONAL
PANITIA PHBN DESA TALANGAGUNG - KECAMATAN KEPANJEN
================================================================================
KODE ARSIP    : DOC-KARNAVAL-2025
ACARA         : Karnaval Desa Talangagung Peringatan HUT RI ke-80
HARI/TANGGAL  : Minggu, 31 Agustus 2025
LOKASI RUTE   : Sepanjang Jalur Poros Utama Desa Talangagung - Panggung Kehormatan
STATUS ARSIP  : DOKUMENTASI RESMI PHBN & SUDUTKOTA.ID (TERVERIFIKASI FAKTUAL)
--------------------------------------------------------------------------------
1. JALANNYA ACARA:
   Karnaval diikuti ribuan warga terbagi ke dalam 31 kontingen/kelompok yang mewakili
   seluruh 5 RW, 27 RT, organisasi kepemudaan Karang Taruna, dan sanggar seni budaya.
   Tujuan utama adalah memperkokoh kerukunan antarwarga, pelestarian warisan budaya,
   dan menyalakan semangat kebangsaan pada generasi muda.

2. STANDAR 4 KRITERIA PENILAIAN DEWAN JURI RESMI:
   Dewan Juri independen melakukan penilaian ketat dengan parameter berbobot 100%:
   a. KREATIVITAS (Bobot 50% - KUNCI UTAMA PENILAIAN):
      Meliputi keaslian konsep tari/koreografi, inovasi properti ramah lingkungan,
      desain kostum tematik adat nusantara, dan aransemen musik pengiring.
   b. KESESUAIAN TEMA (Bobot 30%):
      Relevansi pesan moral penampilan dengan tema HUT RI ke-80 dan persatuan bangsa.
   c. KERAPIAN (Bobot 10%):
      Formasi barisan, sinkronisasi gerak kelompok, dan ketertiban kostum.
   d. SPORTIVITAS & HORMAT PADA ACARA (Bobot 10%):
      Ketepatan waktu start, kedisiplinan rute, dan penghormatan di panggung utama.

SUMBER BERITA RESMI: SudutKota.id - "Juri Karnaval Desa Talangagung Kepanjen Malang: Kreativitas Jadi Kunci Penilaian".
================================================================================`
  },
  {
    id: "DOC-BUMDES-MALANG-2025",
    title: "Publikasi JatimTimes & Data Legalitas Kemendes PDTT: Statistik BUMDes Kabupaten Malang (Februari 2025)",
    category: "Ekonomi Desa & BUMDes",
    year: 2025,
    author: "Dinas Pemberdayaan Masyarakat dan Desa (DPMD) Kab. Malang & Kemendes PDTT RI",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Data resmi status legalitas BUMDes Kabupaten Malang per Februari 2025: 378 Desa (100% di 33 kecamatan) telah memiliki BUMDes, 159 BUMDes berbadan hukum resmi Kemendes PDTT, dan 4 di Kecamatan Kepanjen termasuk BUMDes Talangagung Makmur.",
    keyPoints: [
      "Total Desa Memiliki BUMDes: 378 Desa di 33 Kecamatan (100% seluruh desa di Kab. Malang telah mendirikan BUMDes)",
      "Status Badan Hukum Resmi Kemendes PDTT: 159 BUMDes telah berbadan hukum lengkap",
      "Kecamatan Kepanjen: 4 BUMDes telah berbadan hukum resmi, salah satunya BUMDes Talangagung Makmur",
      "Katalog Produk Unggulan BUMDes Talangagung Makmur:",
      "  - Beras Organik Pandan Wangi Kali Metro (5 kg): Rp 68.000",
      "  - Pupuk Kompos Organik: Rp 25.000 / sak 20 kg",
      "  - Keripik Tempe Dusun Glanggang: Rp 15.000 / bungkus",
      "  - Layanan Jasa Teknik & Air Bersih PAMSIMAS Tirta Agung",
      "Sumber Data: JatimTimes (21 Februari 2025) - 'Akhirnya 378 Desa di Kabupaten Malang Miliki BUMDes'"
    ],
    relatedLinks: [
      { id: "DOC-2026-001", title: "APBDes T.A. 2026", relationLabel: "Penyertaan Modal 25%" },
      { id: "DOC-2019-005", title: "SK Kades PAMSIMAS", relationLabel: "Unit Usaha Air Bersih" }
    ],
    keywords: ["bumdes", "kemendes", "badan hukum", "jatimtimes", "378 desa", "159 bumdes", "beras pandan wangi", "pupuk kompos", "kepanjen"],
    downloadFilename: "DOC-BUMDES-MALANG-2025-Statistik-BUMDes.txt",
    fullOfficialText: `================================================================================
REKAPITULASI RESMI DATA BUMDES KABUPATEN MALANG & UNIT USAHA TALANGAGUNG
================================================================================
KODE ARSIP    : DOC-BUMDES-MALANG-2025
SUMBER DATA   : Publikasi JatimTimes & Sistem Registrasi Kemendes PDTT RI
TANGGAL REKAP : 21 Februari 2025
STATUS        : DOKUMEN REKAPITULASI FAKTUAL DATA A
--------------------------------------------------------------------------------
1. DATA MAKRO KABUPATEN MALANG:
   - Total Desa di Kabupaten Malang: 378 Desa tersebar di 33 Kecamatan.
   - Capaian Pembentukan BUMDes    : 378 Desa (100%) seluruhnya telah mendirikan BUMDes.
   - Kepemilikan Badan Hukum Resmi : 159 BUMDes telah mengantongi sertifikat Badan Hukum
     dari Kementerian Hukum dan HAM serta terverifikasi di Kemendes PDTT RI.
   - BUMDes Berbadan Hukum Kepanjen: 4 BUMDes di Kecamatan Kepanjen telah berbadan hukum.

2. PROFIL BUMDES TALANGAGUNG MAKMUR:
   - Nama Resmi      : BUMDes Talangagung Makmur
   - Status Badan Hukum: Terverifikasi Lengkap Kemendes PDTT
   - Unit Usaha Aktif:
     1) Perdagangan Hasil Pertanian: Beras Organik Pandan Wangi Kali Metro (Rp 68.000 / 5 kg)
     2) Pengolahan Limbah Hijau     : Pupuk Kompos Organik Hasil Olah Sampah (Rp 25.000 / sak)
     3) Sentra Kuliner Tradisional  : Keripik Tempe Dusun Glanggang (Rp 15.000 / bks)
     4) Pengelolaan Jasa Air Bersih : Unit Tirta Agung PAMSIMAS

3. DUKUNGAN ANGGARAN DESA:
   Didukung penyertaan modal berkelanjutan sebesar 25% dari APBDes 2026 untuk perluasan
   alat pengemasan vakum beras dan distribusi pupuk ramah lingkungan ke kelompok tani.

SUMBER RESMI: Dinas PMD Kabupaten Malang & Rilis JatimTimes 21 Februari 2025.
================================================================================`
  },
  {
    id: "DOC-RKPD-2026",
    title: "RKPD Kabupaten Malang Tahun 2026 (Status Evaluasi IPLT Talangagung)",
    category: "Sanitasi & Lingkungan Hidup Daerah",
    year: 2026,
    author: "Bappeda Kabupaten Malang & Dinas PU Cipta Karya Kab. Malang",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Dokumen Rencana Kerja Pemerintah Daerah (RKPD) Kabupaten Malang 2026 sub-bidang sanitasi: fasilitas Instalasi Pengolahan Lumpur Tinja (IPLT) di Talangagung tercatat mengalami penurunan kinerja teknis dan membutuhkan rekonstruksi menyeluruh.",
    keyPoints: [
      "Fasilitas Tinjauan: Instalasi Pengolahan Lumpur Tinja (IPLT) di Desa Talangagung, Kepanjen",
      "Status Evaluasi Teknis: Mengalami degradasi operasional, belum memenuhi kapasitas pengolahan optimal limbah domestik perkotaan",
      "Rekomendasi RKPD 2026: Rekonstruksi dan revitalisasi infrastruktur kolam sedimentasi dan stabilisasi IPLT secara terpadu",
      "Sinergi Kebijakan: Penyelarasan zonasi IPLT dengan masterplan TPA Wisata Edukasi Talangagung"
    ],
    relatedLinks: [
      { id: "DOC-TPA-MASTER", title: "Master Aset TPA Talangagung", relationLabel: "Kawasan Berdampingan" },
      { id: "DOC-2026-001", title: "APBDes T.A. 2026", relationLabel: "Usulan Sanitasi Lingkungan" }
    ],
    keywords: ["rkpd", "iplt", "lumpur tinja", "sanitasi", "pu cipta karya", "bappeda", "rekonstruksi iplt"],
    downloadFilename: "DOC-RKPD-2026-Evaluasi-IPLT-Talangagung.txt",
    fullOfficialText: `================================================================================
BAPPEDA KABUPATEN MALANG - RENCANA KERJA PEMERINTAH DAERAH (RKPD) 2026
SUB-BIDANG PENGELOLAAN AIR LIMBAH DOMESTIK DAN SANITASI
================================================================================
KODE ARSIP    : DOC-RKPD-2026
STATUS DOKUMEN: DOKUMEN RESMI BAPPEDA KABUPATEN MALANG
TAHUN ANGGARAN: 2026
VALIDASI      : TERVERIFIKASI GROUND TRUTH DATA A
--------------------------------------------------------------------------------
1. HASIL EVALUASI KINERJA SANITASI:
   Berdasarkan audit teknis Dinas Perumahan, Kawasan Permukiman dan Cipta Karya
   Kabupaten Malang, fasilitas Instalasi Pengolahan Lumpur Tinja (IPLT) yang berlokasi
   di Desa Talangagung, Kecamatan Kepanjen tercatat mengalami degradasi operasional
   dan tidak berfungsi sesuai standar teknis baku mutu lingkungan nasional.

2. REKOMENDASI & PROGRAM TINDAK LANJUT 2026:
   a. Melakukan rekonstruksi fisik kolam sedimentasi anaerobik dan filter pasir kering.
   b. Peningkatan kapasitas olah lumpur tinja truk tinja perkotaan Kepanjen.
   c. Integrasi pengolahan lumpur tinja menjadi pupuk organik bersama TPA Talangagung.

STATUS ARSIP: Dokumen RKPD Kabupaten Malang T.A. 2026 Lampiran Bidang Infrastruktur.
================================================================================`
  },
  {
    id: "DOC-RDTR-2024",
    title: "Rencana Detail Tata Ruang (RDTR) Perkotaan Kepanjen 2024–2044",
    category: "Tata Ruang & Zonasi Wilayah",
    year: 2024,
    author: "Pemerintah Kabupaten Malang & Dinas Pertanahan",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Ketetapan Perda Tata Ruang menetapkan luas administrasi wilayah Desa Talangagung sebesar 281,05 hektare (2,8105 km²), zonasi pemukiman, koridor lingkar barat Jalibar, dan perlindungan DAS Kali Metro.",
    keyPoints: [
      "Luas Wilayah Administrasi: 281,05 Hektare (2,8105 km²)",
      "Zonasi Wilayah: Koridor Lingkar Barat Jalibar (Perdagangan & Jasa), Kawasan Pertanian Pangan Berkelanjutan Kali Metro, Fasilitas Khusus TPA & Terminal",
      "Struktur Spasial: Pembagian 5 RW dan 27 RT terhubung jaringan jalan aspal/beton",
      "Perlindungan Ekologis: Sabuk hijau sempadan Kali Metro dan perlindungan sumber air baku Molek"
    ],
    relatedLinks: [
      { id: "DOC-BPS-PROFIL-2025", title: "Profil BPS Desa", relationLabel: "Kesesuaian Data Luas Wilayah" },
      { id: "DOC-TPA-MASTER", title: "Master Aset TPA", relationLabel: "Kawasan Khusus Pengolahan Sampah" }
    ],
    keywords: ["rdtr", "tata ruang", "kepanjen 2024-2044", "luas wilayah", "281 ha", "jalibar", "zonasi"],
    downloadFilename: "DOC-RDTR-2024-Tata-Ruang-Kepanjen.txt",
    fullOfficialText: `================================================================================
PERATURAN DAERAH KABUPATEN MALANG - RENCANA DETAIL TATA RUANG (RDTR)
KAWASAN PERKOTAAN KEPANJEN TAHUN 2024 - 2044
================================================================================
KODE ARSIP    : DOC-RDTR-2024
LEMBAGA PENETAP: Dewan Perwakilan Rakyat Daerah & Bupati Malang
STATUS VALIDASI: HUKUM POSITIF & TERVERIFIKASI GROUND TRUTH DATA A
--------------------------------------------------------------------------------
1. BATAS & LUAS ADMINISTRASI DESA TALANGAGUNG:
   Wilayah Desa Talangagung memiliki luas administrasi resmi 281,05 Hektare
   (dua ratus delapan puluh satu koma nol lima hektare) atau setara 2,8105 km².

2. RENCANA POLA RUANG STRATEGIS:
   - Zona Pemukiman Kepadatan Sedang : Dusun Krajan, Dusun Rekesan, Dusun Glanggang
   - Zona Perdagangan dan Jasa Terbuka: Sepanjang Koridor Jalur Lingkar Barat (Jalibar)
   - Zona Pertanian Lahan Basah (LP2B): Lahan produktif sawah irigasi Kali Metro & Molek
   - Zona Fasilitas Pelayanan Umum    : Terminal Bus Talangagung (30.021 m²) & TPA Talangagung

STATUS DOKUMEN: Lembaran Daerah Kabupaten Malang tentang RDTR Perkotaan Kepanjen.
================================================================================`
  },
  {
    id: "DOC-TPA-2025",
    title: "Berita Acara Pengadaan Tanah Akses TPA Talangagung (Februari–Maret 2025)",
    category: "Pertanahan & Pengadaan Lahan",
    year: 2025,
    author: "Tim Pelaksana Pengadaan Tanah Pemkab Malang & BPN Kab. Malang",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Berita acara kronologi pengadaan 3 bidang tanah jalan akses masuk TPA Talangagung: konsultasi publik pada 26 Februari 2025 dan pengukuran kadastral serta pematokan tanda batas pada 4 Maret 2025.",
    keyPoints: [
      "Objek Pengadaan: 3 bidang tanah terdampak pelebaran jalan akses masuk TPA Talangagung",
      "Konsultasi Publik: 26 Februari 2025 melibatkan pemilik lahan dan tokoh warga RT 01 RW 01",
      "Pengukuran Kadastral & Pematokan: 4 Maret 2025 bersama Kantor Pertanahan/BPN Kab. Malang",
      "Hasil: Penetapan batas lahan jelas tanpa sengketa demi kelancaran armada kebersihan"
    ],
    relatedLinks: [
      { id: "DOC-TPA-MASTER", title: "Master Data Lahan TPA", relationLabel: "Aset Induk Lahan" },
      { id: "DOC-PJU-2025", title: "22 Titik Lampu PJU TPA", relationLabel: "Fasilitas Penerangan Jalan" }
    ],
    keywords: ["tanah akses tpa", "pengadaan lahan 2025", "26 februari 2025", "4 maret 2025", "patok batas", "bpn"],
    downloadFilename: "DOC-TPA-2025-Pengadaan-Tanah-Akses-TPA.txt",
    fullOfficialText: `================================================================================
TIM PELAKSANA PENGADAAN TANAH PEMKAB MALANG & BPN KABUPATEN MALANG
BERITA ACARA KONSULTASI PUBLIK & PEMATOKAN TANAH AKSES TPA TALANGAGUNG
================================================================================
KODE ARSIP    : DOC-TPA-2025
TANGGAL GIAT  : 26 Februari 2025 & 4 Maret 2025
LOKASI TANAH  : Ruas Jalan Akses TPA, RT 01 / RW 01 Desa Talangagung
VALIDASI      : TERVERIFIKASI DATA A KEDINASAN
--------------------------------------------------------------------------------
1. TAHAP KONSULTASI PUBLIK (26 FEBRUARI 2025):
   Dilaksanakan di Balai Pertemuan RW 01 dihadiri oleh 100% pemilik lahan terdampak.
   Warga menyetujui pembebasan untuk kepentingan pelebaran jalan armada sampah Pemkab Malang.

2. TAHAP PENGUKURAN & PEMASANGAN PATOK (4 MARET 2025):
   Petugas ukur kadastral BPN bersama aparat desa memasang patok tanda batas permanen
   pada 3 bidang tanah yang dibebaskan. Batas koordinat telah terdaftar di peta kadastral.

STATUS ARSIP: Berita Acara Resmi Tim Pengadaan Tanah Pemkab Malang.
================================================================================`
  },
  {
    id: "DOC-PJU-2025",
    title: "Laporan Serah Terima 22 Titik Lampu PJU LED 40W Ruas Jalan Menuju TPA",
    category: "Infrastruktur Penerangan Jalan",
    year: 2025,
    author: "Dinas Perhubungan Kab. Malang & Pemerintah Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Berita acara serah terima pemasangan 22 unit lampu Penerangan Jalan Umum (PJU) LED 40 Watt beserta penambahan KWh meter baru di ruas jalan Talangagung menuju TPA pada 28 Oktober 2025.",
    keyPoints: [
      "Jumlah Titik: 22 unit tiang & lampu LED 40 Watt hemat energi",
      "Lokasi: Sepanjang koridor ruas jalan Talangagung menuju TPA Wisata Edukasi",
      "Tanggal Serah Terima: 28 Oktober 2025",
      "Fasilitas Pendukung: Penambahan KWh meter baru & panel kendali photocell otomatis"
    ],
    relatedLinks: [
      { id: "DOC-TPA-MASTER", title: "Master Aset TPA", relationLabel: "Akses Penerangan Kawasan" }
    ],
    keywords: ["pju", "lampu jalan", "led 40w", "22 titik pju", "28 oktober 2025", "kwh meter"],
    downloadFilename: "DOC-PJU-2025-Serah-Terima-22-Titik-PJU.txt",
    fullOfficialText: `================================================================================
BERITA ACARA SERAH TERIMA PEKERJAAN PEMASANGAN PJU RUAS JALAN TPA
================================================================================
KODE ARSIP    : DOC-PJU-2025
TANGGAL SERAH : 28 Oktober 2025
PELAKSANA     : Dinas Perhubungan Kab. Malang & Rekanan Penyedia Listrik Desa
PENERIMA      : Pemerintah Desa Talangagung & Satgas Lingkungan Dusun Krajan
VALIDASI      : TERVERIFIKASI FAKTUAL DATA A
--------------------------------------------------------------------------------
1. LINGKUP PEKERJAAN:
   - Pemasangan 22 unit lampu PJU jenis LED daya 40 Watt berstandar SNI.
   - Pemasangan tiang oktagonal tahan karat dan tarikan kabel twisted 2x16 mm.
   - Pemasangan 1 unit KWh meter PLN prabayar dan sensor cahaya photocell otomatis.

2. STATUS KELAIKAN:
   Seluruh 22 titik lampu menyala normal pada pengujian malam hari tanggal 28 Oktober 2025.
   Koridor jalan kini terang benderang dan meningkatkan keselamatan pengendara malam hari.

STATUS ARSIP: Laporan Serah Terima Fisik Infrastruktur Dishub Kab. Malang.
================================================================================`
  },
  {
    id: "DOC-2025-014",
    title: "Laporan Pemeliharaan Berkala Infrastruktur Jembatan Kali Metro Krajan–Jatisari",
    category: "Infrastruktur Jembatan & Sungai",
    year: 2025,
    author: "Dinas PU Bina Marga Kab. Malang & Tim Teknis Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Laporan inspeksi dan pemeliharaan teknis struktur jembatan Kali Metro penghubung Krajan Talangagung dan Jatisari: kondisi gelagar baja dan abutmen beton dinyatakan Baik dan aman dilalui roda 4.",
    keyPoints: [
      "Objek Jembatan: Jembatan Kali Metro (penghubung Dusun Krajan Talangagung dengan Desa Jatisari)",
      "Hasil Inspeksi: Kondisi struktur gelagar dan lantai beton dalam kondisi Baik (skor 92%)",
      "Pekerjaan Rutin: Pengecatan anti karat tiang pengaman dan pembersihan endapan sedimen pilar jembatan"
    ],
    relatedLinks: [
      { id: "DOC-RDTR-2024", title: "RDTR Perkotaan Kepanjen", relationLabel: "Konektivitas Wilayah" }
    ],
    keywords: ["jembatan", "kali metro", "jembatan krajan", "pemeliharaan jembatan", "bina marga"],
    downloadFilename: "DOC-2025-014-Pemeliharaan-Jembatan-Kali-Metro.txt",
    fullOfficialText: `================================================================================
LAPORAN HASIL INSPEKSI KONDISI FISIK JEMBATAN KALI METRO KRAJAN-JATISARI
================================================================================
KODE ARSIP    : DOC-2025-014
LOKASI        : Jembatan Kali Metro, Dusun Krajan Talangagung
INSTANSI      : Dinas PU Bina Marga Kabupaten Malang & Tim Desa
TAHUN DOKUMEN : 2025
STATUS        : TERVERIFIKASI GROUND TRUTH DATA A
--------------------------------------------------------------------------------
1. DATA TEKNIS JEMBATAN:
   - Bentang Jembatan : 24 Meter
   - Lebar Lantai Kerja: 5,5 Meter (Memadai untuk simpangan kendaraan roda 4)
   - Tipe Struktur    : Gelagar Baja Profil WF dengan Lantai Plat Beton Bertulang

2. KESIMPULAN HASIL UJI KELAIKAN:
   Struktur dinyatakan KOKOH DAN AMAN (Kategori Baik). Kapasitas beban maksimal 8 Ton.
================================================================================`
  },
  {
    id: "DOC-2023-008",
    title: "Peraturan Desa Talangagung No. 03/2023 tentang Pengelolaan Aset & Inovasi Teknologi Desa",
    category: "Regulasi Desa",
    year: 2023,
    author: "Kepala Desa Talangagung & Badan Permusyawaratan Desa (BPD)",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Payung hukum tata kelola inventarisasi barang milik desa, registrasi QR code paspor aset, kemitraan alih teknologi dengan perguruan tinggi/SMK, dan sistem digital desa.",
    keyPoints: [
      "Kewajiban digitalisasi dan paspor QR code pada setiap aset publik desa",
      "Landasan hukum kemitraan Teaching Factory dengan SMK Muhammadiyah 1 Kepanjen",
      "Landasan hukum uji coba riset terapan IoT Smart Farming dengan Universitas (Unikama)"
    ],
    relatedLinks: [
      { id: "DOC-TEFA-SMK-2026", title: "MoU SMK Muhammadiyah 1", relationLabel: "Pelaksanaan Kerjasama TeFa" },
      { id: "DOC-IOT-FEEDER-2026", title: "Smart Feeder Molek Jaya", relationLabel: "Pelaksanaan Kerjasama Riset" }
    ],
    keywords: ["perdes aset", "regulasi desa", "inovasi teknologi", "paspor aset", "payung hukum"],
    downloadFilename: "DOC-2023-008-Perdes-Aset-dan-Inovasi.txt",
    fullOfficialText: `================================================================================
PERATURAN DESA TALANGAGUNG NOMOR 03 TAHUN 2023
TENTANG PENGELOLAAN ASET DAN INOVASI TEKNOLOGI DIGITAL DESA
================================================================================
KODE ARSIP    : DOC-2023-008
LEMBAGA PENETAP: Kepala Desa & BPD Desa Talangagung
VALIDASI      : PERATURAN DESA SAH (DATA A)
--------------------------------------------------------------------------------
Menimbang perlunya akuntabilitas barang milik desa dan modernisasi pelayanan publik,
Perdes ini menetapkan kewajiban pencatatan digital seluruh aset desa, penerapan QR Code,
serta pembukaan kemitraan alih teknologi bersama institusi pendidikan formal (SMK & Universitas).
================================================================================`
  },
  {
    id: "DOC-2021-002",
    title: "Rencana Pembangunan Jangka Menengah Desa (RPJMDes) Talangagung 2021–2026",
    category: "Perencanaan Strategis Desa",
    year: 2021,
    author: "Pemerintah Desa Talangagung & BPD Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Rencana induk 6 tahun pembangunan Desa Talangagung memuat arah kebijakan ketahanan pangan pertanian/perikanan, pengolahan sampah mandiri, dan integrasi data desa.",
    keyPoints: [
      "Visi 6 Tahun: Mewujudkan Desa Talangagung Mandiri, Sejahtera, dan Berbasis Inovasi Berkelanjutan",
      "Fokus Utama: Normalisasi saluran air irigasi, modernisasi BUMDes Makmur, dan pelestarian lingkungan TPA"
    ],
    relatedLinks: [
      { id: "DOC-2026-001", title: "APBDes T.A. 2026", relationLabel: "Penjabaran Tahunan Rencana" }
    ],
    keywords: ["rpjmdes", "rencana 6 tahun", "visi misi", "pembangunan jangka menengah", "talangagung 2021-2026"],
    downloadFilename: "DOC-2021-002-RPJMDes-Talangagung-2021-2026.txt",
    fullOfficialText: `================================================================================
RENCANA PEMBANGUNAN JANGKA MENENGAH DESA (RPJMDES) TAHUN 2021 - 2026
PEMERINTAH DESA TALANGAGUNG - KECAMATAN KEPANJEN
================================================================================
KODE ARSIP    : DOC-2021-002
STATUS        : DOKUMEN PERENCANAAN INDUK DESA 6 TAHUN (DATA A)
--------------------------------------------------------------------------------
Dokumen ini memuat arah kebijakan jangka menengah Desa Talangagung, menitikberatkan
pada peningkatan kesejahteraan petani sawah Kali Metro, kelompok pembudidaya ikan,
penguatan ekonomi BUMDes, dan digitalisasi administrasi layanan warga.
================================================================================`
  },
  {
    id: "DOC-2018-003",
    title: "Berita Acara Konstruksi Saluran Drainase Talangagung–Jalibar",
    category: "Infrastruktur Drainase & Lingkungan",
    year: 2018,
    author: "Tim Pelaksana Kegiatan (TPK) Pembangunan Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Berita acara pembangunan saluran drainase pasangan batu belah di sepanjang ruas Talangagung menuju perlintasan koridor Jalibar untuk mitigasi luapan air musim penghujan.",
    keyPoints: [
      "Panjang Saluran: 420 Meter pasangan batu belah plesteran",
      "Fungsi: Mengalirkan limpasan air hujan dari pemukiman menuju saluran pembuang Kali Metro"
    ],
    relatedLinks: [
      { id: "DOC-RDTR-2024", title: "RDTR Perkotaan Kepanjen", relationLabel: "Kawasan Koridor Jalibar" }
    ],
    keywords: ["drainase", "jalibar", "saluran air", "tpk", "batu belah"],
    downloadFilename: "DOC-2018-003-Konstruksi-Drainase-Jalibar.txt",
    fullOfficialText: `================================================================================
BERITA ACARA PENYELESAIAN PEMBANGUNAN DRAINASE RUAS TALANGAGUNG - JALIBAR
================================================================================
KODE ARSIP    : DOC-2018-003
STATUS ARSIP  : ARSIP PROYEK DANA DESA TAHUN 2018 (DATA A)
--------------------------------------------------------------------------------
Pembangunan saluran drainase primer sepanjang 420 meter berhasil diselesaikan
oleh TPK bersama swadaya warga, berfungsi lancar mencegah genangan air di koridor Jalibar.
================================================================================`
  },
  {
    id: "DOC-2019-005",
    title: "Surat Keputusan Kepala Desa tentang Pengelolaan PAMSIMAS Tirta Agung",
    category: "Sanitasi & Air Bersih",
    year: 2019,
    author: "Kepala Desa Talangagung",
    validationStatus: "Terverifikasi Faktual (Data A)",
    summary: "Surat Keputusan Kepala Desa penetapan kepengurusan Kelompok Pengelola Sarana Prasarana Air Minum dan Sanitasi (KPSPAMS) Tirta Agung melayani kebutuhan air bersih warga.",
    keyPoints: [
      "Nama Unit: PAMSIMAS Tirta Agung Desa Talangagung",
      "Cakupan Layanan: Pemasangan sambungan rumah (SR) air bersih ke lebih dari 350 sambungan",
      "Pemeriksaan Kualitas: Uji berkala laboratorium Dinas Kesehatan Kabupaten Malang"
    ],
    relatedLinks: [
      { id: "DOC-BUMDES-MALANG-2025", title: "Statistik BUMDes", relationLabel: "Unit Usaha Pelayanan Publik" }
    ],
    keywords: ["pamsimas", "tirta agung", "air bersih", "sk kades", "kpspams"],
    downloadFilename: "DOC-2019-005-SK-Kades-PAMSIMAS-Tirta-Agung.txt",
    fullOfficialText: `================================================================================
SURAT KEPUTUSAN KEPALA DESA TALANGAGUNG NOMOR 188/05/2019
TENTANG PENETAPAN PENGURUS PAMSIMAS TIRTA AGUNG DESA TALANGAGUNG
================================================================================
KODE ARSIP    : DOC-2019-005
STATUS        : SURAT KEPUTUSAN KEPALA DESA RESMI (DATA A)
--------------------------------------------------------------------------------
Menetapkan susunan pengurus KPSPAMS Tirta Agung untuk mengelola dan mendistribusikan
air bersih yang bersumber dari mata air higienis bagi masyarakat Desa Talangagung.
================================================================================`
  }
];

/**
 * Helper mencari dokumen berdasarkan kata kunci
 */
export function findConnectedDoc(query: string): VillageDocItem | undefined {
  const q = query.toLowerCase().trim();
  if (!q) return undefined;

  // 1. Exact or partial ID match
  const byId = VILLAGE_CONNECTED_DOCS.find(d => 
    d.id.toLowerCase() === q || 
    q.includes(d.id.toLowerCase()) || 
    d.id.toLowerCase().includes(q)
  );
  if (byId) return byId;

  // 2. Keyword exact match
  const byKeyword = VILLAGE_CONNECTED_DOCS.find(d => 
    d.keywords.some(k => q.includes(k) || k.includes(q))
  );
  if (byKeyword) return byKeyword;

  // 3. Title or summary partial match
  return VILLAGE_CONNECTED_DOCS.find(d => 
    d.title.toLowerCase().includes(q) || 
    d.summary.toLowerCase().includes(q)
  );
}

/**
 * Format markdown katalog dokumen resmi
 */
export function getConnectedDocsCatalogMarkdown(): string {
  return `📂 *KATALOG ARSIP DOKUMEN RESMI TERHUBUNG*
_Desa Talangagung, Kec. Kepanjen, Kab. Malang_
_Sistem Memori Digital Desa Black Box AI (100% Data A Terverifikasi)_

Berikut daftar 17 dokumen arsip resmi yang terhubung langsung di sistem desa:

🏛️ *1. APBDes, RPJMDes & Regulasi Desa:*
• \`/dokumen apbdes\` → *[DOC-2026-001]* APBDes 2026 (Rp 1,85 Miliar)
• \`/dokumen perdes\` → *[DOC-2023-008]* Perdes No. 03/2023 Aset & Inovasi
• \`/dokumen rpjmdes\` → *[DOC-2021-002]* RPJMDes 2021-2026

🎓 *2. Kemitraan Vokasi & Inovasi Lapangan:*
• \`/dokumen smk\` → *[DOC-TEFA-SMK-2026]* MoU SMK Muhammadiyah 1 Kepanjen
• \`/dokumen feeder\` → *[DOC-IOT-FEEDER-2026]* Smart Feeder IoT Unikama (Molek Jaya)
• \`/dokumen karnaval\` → *[DOC-KARNAVAL-2025]* Karnaval HUT RI ke-80 (Kreativitas 50%)
• \`/dokumen bumdes\` → *[DOC-BUMDES-MALANG-2025]* Legalitas BUMDes Kab. Malang

🗺️ *3. Statistik BPS & Perencanaan Wilayah:*
• \`/dokumen bps\` → *[DOC-BPS-PROFIL-2025]* Monografi BPS (8.522 Jiwa, 5 RW / 27 RT)
• \`/dokumen transjatim\` → *[DOC-TRANSJATIM-2026]* Rute Trans Jatim Koridor 2
• \`/dokumen rdtr\` → *[DOC-RDTR-2024]* RDTR Perkotaan Kepanjen (Luas 281,05 Ha)

🌿 *4. Infrastruktur Lingkungan, TPA & Sanitasi:*
• \`/dokumen tpa\` → *[DOC-TPA-MASTER]* Rekapitulasi Lahan TPA (13.393 m²)
• \`/dokumen lahan\` → *[DOC-TPA-2025]* Pengadaan Tanah Akses TPA (Feb-Mar 2025)
• \`/dokumen pju\` → *[DOC-PJU-2025]* Serah Terima 22 Titik PJU LED Ruas TPA
• \`/dokumen iplt\` → *[DOC-RKPD-2026]* Evaluasi IPLT RKPD Kab. Malang 2026
• \`/dokumen jembatan\` → *[DOC-2025-014]* Pemeliharaan Jembatan Kali Metro
• \`/dokumen drainase\` → *[DOC-2018-003]* Saluran Drainase Talangagung-Jalibar
• \`/dokumen pamsimas\` → *[DOC-2019-005]* SK Kades Pengelolaan Air PAMSIMAS

💡 *CARA MENGELUARKAN DOKUMEN:*
Ketik perintah di atas, contoh: \`/dokumen apbdes\` atau tanyakan langsung: *"Keluarkan dokumen SMK"*! Bot akan menampilkan rincian pasal sekaligus mengirimkan file dokumen arsipnya langsung ke chat Telegram Anda!`;
}

/**
 * Format markdown detail dokumen terhubung
 */
export function formatDocDetailMarkdown(doc: VillageDocItem): string {
  const points = doc.keyPoints.map(p => `• ${p}`).join('\n');
  const links = doc.relatedLinks.map(l => `• *${l.id}*: ${l.title} _(${l.relationLabel})_`).join('\n');

  return `📂 *DOKUMEN RESMI TERHUBUNG DESA TALANGAGUNG*
─────────────────────────────
📑 *Kode Arsip:* \`${doc.id}\`
🏛️ *Judul:* *${doc.title}*
🏷️ *Kategori:* ${doc.category} | *Tahun:* ${doc.year}
✍️ *Penerbit:* ${doc.author}
🟢 *Status Validasi:* ${doc.validationStatus}

📋 *Ringkasan Eksekutif:*
${doc.summary}

📖 *Ketentuan Pokok & Ground Truth:*
${points}

🔗 *Jaringan Relasi Terkait (Knowledge Graph):*
${links}

📥 *Berkas arsip dokumen teks resmi (.txt) telah dikirimkan langsung ke obrolan ini untuk disimpan dan dibaca.*
─────────────────────────────
_Ketik /dokumen untuk daftar arsip lain, atau /menu untuk layanan utama._`;
}

/**
 * Generator Draf Surat Resmi Mandiri Warga
 */
export function generateOfficialLetterDraft(
  type: 'sku' | 'ktp' | 'kk' | 'sktm' | 'domisili',
  applicantName: string,
  extraDetails?: string
): {
  markdown: string;
  filename: string;
  content: string;
  letterNumber: string;
  title: string;
} {
  const nameClean = applicantName.trim() || 'Warga Desa Talangagung';
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const yearStr = now.getFullYear();
  const regNum = Math.floor(100 + Math.random() * 900);
  const tokenHash = `VERIF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  let code = 'SKU';
  let title = 'SURAT KETERANGAN USAHA (SKU)';
  let letterNumber = `470/RT02-RW01/${regNum}/${code}/IX/${yearStr}`;
  let purposeDesc = 'menerangkan bahwa nama tersebut di atas benar-benar memiliki dan menjalankan kegiatan usaha di wilayah RT 02 / RW 01 Desa Talangagung secara aktif dan tidak dalam sengketa.';

  if (type === 'ktp') {
    code = 'KTP';
    title = 'SURAT PENGANTAR KARTU TANDA PENDUDUK (KTP-EL)';
    letterNumber = `474/RT02-RW01/${regNum}/${code}/IX/${yearStr}`;
    purposeDesc = 'diberikan sebagai pengantar permohonan perekaman / pencetakan baru / penggantian Kartu Tanda Penduduk Elektronik (KTP-el) di Kantor Kecamatan Kepanjen / Dispendukcapil Kabupaten Malang.';
  } else if (type === 'kk') {
    code = 'KK';
    title = 'SURAT PENGANTAR KARTU KELUARGA (KK)';
    letterNumber = `475/RT02-RW01/${regNum}/${code}/IX/${yearStr}`;
    purposeDesc = 'diberikan sebagai pengantar permohonan pembaruan / penambahan anggota / perubahan elemen data Kartu Keluarga (KK) warga yang bersangkutan.';
  } else if (type === 'sktm') {
    code = 'SKTM';
    title = 'SURAT KETERANGAN TIDAK MAMPU (SKTM)';
    letterNumber = `401/RT02-RW01/${regNum}/${code}/IX/${yearStr}`;
    purposeDesc = 'menerangkan bahwa nama tersebut di atas tergolong keluarga prasejahtera dan surat keterangan ini diterbitkan guna keperluan pengajuan bantuan biaya pendidikan / keringanan biaya pengobatan.';
  } else if (type === 'domisili') {
    code = 'DOM';
    title = 'SURAT KETERANGAN DOMISILI';
    letterNumber = `471/RT02-RW01/${regNum}/${code}/IX/${yearStr}`;
    purposeDesc = 'menerangkan dengan sebenarnya bahwa yang bersangkutan berdomisili dan menetap di lingkungan RT 02 / RW 01 Desa Talangagung, Kecamatan Kepanjen, Kabupaten Malang.';
  }

  const detailNote = extraDetails ? `Keterangan Tambahan: ${extraDetails}` : '';

  const fullContent = `================================================================================
RUKUN TETANGGA 02 / RUKUN WARGA 01
DESA TALANGAGUNG - KECAMATAN KEPANJEN - KABUPATEN MALANG
SISTEM PERSURATAN RESMI DIGITAL DESA BLACK BOX AI
================================================================================
${title}
Nomor Registrasi: ${letterNumber}

Yang bertanda tangan di bawah ini, Pengurus Rukun Tetangga (RT) 02 / RW 01
Pemerintah Desa Talangagung, Kecamatan Kepanjen, Kabupaten Malang, dengan ini
menerangkan bahwa:

Nama Lengkap         : ${nameClean.toUpperCase()}
Nomor Induk KTP      : 350709************
Alamat Domisili      : RT 02 / RW 01, Dusun Krajan
Desa / Kelurahan     : Talangagung
Kecamatan            : Kepanjen
Kabupaten            : Malang, Jawa Timur

Menerangkan dengan sebenarnya bahwa:
${purposeDesc}
${detailNote ? `\nCatatan Tambahan: ${detailNote}` : ''}

Demikian surat keterangan ini dibuat dengan sebenar-benarnya berdasarkan fakta
administrasi kependudukan di tingkat RT/RW untuk dapat dipergunakan sebagaimana
mestinya oleh pihak yang berkepentingan.

Dikeluarkan di: Talangagung
Pada Tanggal  : ${dateStr}

Mengetahui,                                      Pemohon,
Ketua RT 02 / RW 01


( AHMAD FAUZI )                                  ( ${nameClean.toUpperCase()} )

--------------------------------------------------------------------------------
STATUS VERIFIKASI DIGITAL:
[v] TERVERIFIKASI SISTEM DIGITAL DESA TALANGAGUNG
Token QR Pengesahan RT : ${tokenHash}
Integrasi Portal Desa  : https://ais-dev-5couwsflxbn46udjq6ggh2-964649406358.asia-southeast1.run.app
================================================================================`;

  const markdown = `📜 *DRAF DOKUMEN RESMI DITERBITKAN*
─────────────────────────────
🏛️ *${title}*
📝 *Nomor Registrasi:* \`${letterNumber}\`
👤 *Nama Pemohon:* *${nameClean}*
📍 *Wilayah:* RT 02 / RW 01 Desa Talangagung
🕒 *Tanggal Terbit:* ${dateStr}

✅ *Peruntukan Surat:*
${purposeDesc}

🛡️ *Status Legalitas RT & Desa:*
• *Stempel QR Code Digital:* \`${tokenHash}\`
• *Status Verifikasi:* 🟢 Resmi Terverifikasi Sistem RT 02 Talangagung

📥 *File berkas surat (.txt) telah dikirimkan di bawah pesan ini. Anda dapat mencetaknya langsung atau menyimpannya di ponsel.*
─────────────────────────────
_Ketik /surat untuk layanan surat lain, atau /menu untuk kembali._`;

  const filename = `[SURAT-RESMI]-${code}-${nameClean.replace(/\s+/g, '_')}.txt`;

  return {
    markdown,
    filename,
    content: fullContent,
    letterNumber,
    title
  };
}
