import * as XLSX from 'xlsx';

/**
 * Creates an authentic Excel (.xlsx) file containing APBDes 2026 data
 * for Desa Talangagung, complete with account codes, categories, allocations, and statuses.
 */
export function createSampleAPBDesExcelBase64(): { base64: string; fileName: string; fileSize: number } {
  const wb = XLSX.utils.book_new();

  const apbdesRows = [
    ["KODE REKENING", "URAIAN KEGIATAN & POS BELANJA DESA", "BIDANG", "SUMBER ANGGARAN", "ANGGARAN 2025 (RP)", "PAGU APBDES 2026 (RP)", "REALISASI (%)", "KETERANGAN FAKTUAL"],
    ["1.1.01", "Penghasilan Tetap (Siltap) Kepala Desa & 10 Perangkat", "Pemerintahan", "ADD (Alokasi Dana Desa)", 384000000, 412000000, 100, "Tersalurkan Rutin Per Bulan"],
    ["1.2.03", "Operasional Kantor BPD, RT/RW, dan Kelembagaan Desa", "Pemerintahan", "ADD & Bagi Hasil Pajak", 62000000, 68000000, 50, "Cair Tahap I 2026"],
    ["2.1.04", "Peremajaan & Penggantian Bohlam LED PJU Krajan RW 01 - RW 03", "Pembangunan Fisik", "Dana Desa (DDS)", 45000000, 50000000, 85, "30 Titik Lampu Baru & Perbaikan Driver"],
    ["2.2.08", "Pengembangan Smart Feeder IoT Binaan Unikama Pokdakan Molek Jaya", "Pemberdayaan", "PADes (Pendapatan Asli)", 35000000, 38000000, 75, "Sensor Kualitas Air & Pakan Otomatis"],
    ["2.3.12", "Normalisasi Saluran Irigasi Tersier Kali Metro & Drainase RW 02", "Pembangunan Fisik", "Dana Desa (DDS)", 65000000, 75000000, 60, "Mengurangi Genangan Saat Hujan Deras"],
    ["3.1.05", "Bantuan Langsung Tunai (BLT Desa) Alokasi 42 KPM Miskin Ekstrem", "Pembinaan Warga", "Dana Desa (DDS)", 151200000, 151200000, 100, "Rp 300.000 / Bulan per KPM Tepat Sasaran"],
    ["3.2.02", "Pemberian Makanan Tambahan (PMT) Balita Stunting Posyandu Melati", "Kesehatan", "BHP & Dana Desa", 28000000, 32000000, 90, "Intervensi Gizi 15 Balita RW 01-04"],
    ["4.1.01", "Penyertaan Modal Usaha Pengolahan Sampah BUMDes Talangagung", "Ekonomi Desa", "PADes & SilPA", 100000000, 120000000, 100, "Integrasi Edukasi Wisata TPA Talangagung"],
    ["TOTAL", "TOTAL BELANJA ANGGARAN PENDAPATAN & BELANJA DESA TALANGAGUNG", "APBDES TOTAL", "GABUNGAN APBDES", 870200000, 946200000, 82, "Perdes No. 04 Tahun 2026"]
  ];

  const ws = XLSX.utils.aoa_to_sheet(apbdesRows);
  XLSX.utils.book_append_sheet(wb, ws, "APBDes_Talangagung_2026");

  // Add second sheet for Rincian Pendapatan
  const pendapatanRows = [
    ["KODE", "SUMBER PENDAPATAN DESA", "NOMINAL 2026 (RP)", "TARGET (%)"],
    ["PAD-01", "Pendapatan Asli Desa (BUMDes & Pasar)", 185000000, 100],
    ["DDS-01", "Dana Desa APBN Pusat (DDS)", 892000000, 100],
    ["ADD-01", "Alokasi Dana Desa Kab. Malang (ADD)", 480000000, 100],
    ["BHP-01", "Bagi Hasil Pajak & Retribusi Daerah", 68000000, 100],
    ["TOTAL", "TOTAL PENDAPATAN DESA TALANGAGUNG", 1625000000, 100]
  ];
  const wsPendapatan = XLSX.utils.aoa_to_sheet(pendapatanRows);
  XLSX.utils.book_append_sheet(wb, wsPendapatan, "Pendapatan_Desa_2026");

  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const rawBytes = atob(base64);

  return {
    base64,
    fileName: "APBDes_Talangagung_Tahun_2026.xlsx",
    fileSize: rawBytes.length
  };
}

/**
 * Creates a sample Word document text representation with SK Linmas & Satgas Keamanan
 */
export function createSampleWordSKBase64(): { base64: string; fileName: string; fileSize: number } {
  const content = `PEMERINTAH KABUPATEN MALANG
KECAMATAN KEPANJEN
KANTOR KEPALA DESA TALANGAGUNG
Jl. Raya Talangagung No. 01, Kepanjen, Malang - Kode Pos 65163

KEPUTUSAN KEPALA DESA TALANGAGUNG
NOMOR: 141 / 18 / KEP / 35.07.15.2008 / 2026

TENTANG
PEMBENTUKAN DAN PENETAPAN SATUAN TUGAS PERLINDUNGAN MASYARAKAT (LINMAS)
DAN REGU SIAGA TANGGAP DARURAT BENCANA DESA TALANGAGUNG TAHUN 2026

KEPALA DESA TALANGAGUNG,

Menimbang:
a. bahwa dalam rangka memelihara ketenteraman, ketertiban umum, dan perlindungan masyarakat di wilayah Desa Talangagung;
b. bahwa perlunya kesiapsiagaan ronda malam, pemeliharaan lampu penerangan jalan umum (PJU), dan pengawasan fasilitas publik;
c. bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a dan b, perlu menetapkan Keputusan Kepala Desa Talangagung.

Mengingat:
1. Undang-Undang Nomor 6 Tahun 2014 tentang Desa;
2. Peraturan Menteri Dalam Negeri Republik Indonesia Nomor 84 Tahun 2015 tentang Susunan Organisasi dan Tata Kerja Pemerintah Desa;
3. Peraturan Desa Talangagung Nomor 02 Tahun 2025 tentang Ketenteraman dan Ketertiban Umum Wilayah Desa.

MEMUTUSKAN:

Menetapkan:
KESATU: Membentuk Satuan Tugas Perlindungan Masyarakat (Satgas Linmas) Desa Talangagung dengan susunan personel:
- Komandan Satgas: Bpk. Bambang Sutrisno (Dusun Krajan RW 01)
- Wakil Komandan: Bpk. Agus Waluyo (Dusun Jatisari RW 02)
- Regu Patroli & PJU Malam Krajan: Sdr. Hendra S. & Sdr. Rudi Hartono (Pos Kamling RT 02)
- Regu Tanggap Darurat Kali Metro & TPA: Sdr. Joko Santoso & Sdr. Ahmad Fauzi (Siaga 24 Jam)
- Regu Posyandu & Ketertiban Pasar: Ibu Siti Aminah & Ibu Sri Wahyuni

KEDUA: Tugas pokok Satgas Linmas meliputi:
1. Melaksanakan pengawasan ronda malam lingkungan setiap pukul 21.00 - 04.00 WIB.
2. Melakukan inventarisasi dan pelaporan langsung fasilitas umum rusak (lampu PJU padam, drainase meluap, pohon rawan tumbang) melalui Bot Telegram Resmi Desa.
3. Mendampingi penyaluran BLT Dana Desa dan kegiatan Posyandu Balita/Lansia.

KETIGA: Segala biaya yang timbul sebagai akibat ditetapkannya Keputusan ini dibebankan pada Anggaran Pendapatan dan Belanja Desa (APBDes) Talangagung Tahun Anggaran 2026 Bidang Pembinaan Kemasyarakatan.

KEEMPAT: Keputusan ini mulai berlaku pada tanggal ditetapkan.

Ditetapkan di: Talangagung
Pada tanggal: 05 Januari 2026
Kepala Desa Talangagung,
Ttd & Cap Basah
(Pemerintah Desa Talangagung)`;

  // Base64 encoding for client environment (supports UTF-8)
  const base64 = btoa(unescape(encodeURIComponent(content)));
  return {
    base64,
    fileName: "SK_Kepala_Desa_Linmas_dan_Keamanan_2026.docx",
    fileSize: content.length
  };
}

/**
 * Creates a sample valid PDF file containing Monografi BPS Data Desa Talangagung
 */
export function createSamplePDFMonografiBase64(): { base64: string; fileName: string; fileSize: number } {
  // Minimal valid PDF byte stream with text object
  const pdfBody = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 480 >> stream
BT
/F1 16 Tf
50 780 Td
(BADAN PUSAT STATISTIK - MONOGRAFI DESA TALANGAGUNG 2026) Tj
/F1 12 Tf
0 -30 Td
(Kecamatan Kepanjen, Kabupaten Malang, Jawa Timur) Tj
0 -25 Td
(1. Luas Wilayah Administratif: 2.14 km2 / 214 Hektar) Tj
0 -20 Td
(2. Jumlah Penduduk: 5.420 Jiwa | 1.642 Kepala Keluarga (KK)) Tj
0 -20 Td
(   - Laki-laki: 2.715 Jiwa | Perempuan: 2.705 Jiwa) Tj
0 -20 Td
(3. Pembagian Dusun: Dusun Krajan (RW 01-02), Dusun Jatisari (RW 03-04)) Tj
0 -20 Td
(4. Fasilitas Kesehatan: 1 Pustu, 4 Posyandu Melati, 1 Poskesdes) Tj
0 -20 Td
(5. Inovasi Unggulan: Edukasi Metana TPA Talangagung & Smart Feeder Ikan) Tj
0 -25 Td
(Dokumen Resmi Faktual - Kode BPS: 35.07.15.2008) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000228 00000 n 
0000000758 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
825
%%EOF`;

  const base64 = btoa(pdfBody);
  return {
    base64,
    fileName: "Monografi_Statistik_BPS_Desa_Talangagung.pdf",
    fileSize: pdfBody.length
  };
}

/**
 * Reads a user-uploaded File object from browser input into base64
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
