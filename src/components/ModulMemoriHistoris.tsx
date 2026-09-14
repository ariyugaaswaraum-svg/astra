import React, { useState } from 'react';
import { 
  History, 
  MapPin, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Download, 
  Volume2, 
  VolumeX, 
  X, 
  ShieldCheck, 
  Flame, 
  TreePine, 
  Compass, 
  CheckSquare, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Building,
  Info,
  Users,
  Truck,
  Coins,
  Recycle,
  Maximize2
} from 'lucide-react';
import { MemoriHistorisItem } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

// Initial dataset specifically for TPA Talangagung Case Study (2020 - 2025)
export const initialTpaTalangagungData: MemoriHistorisItem[] = [
  {
    id: "TPA-2020-001",
    tahun: 2020,
    objek: "Instalasi Flaring & Pipa Transmisi Gas Metana (Sanitary Landfill)",
    lokasi: "Zona Aktif Sel B TPA Wisata Edukasi Talangagung, Dusun Jatisari RT 04 / RW 02",
    peristiwa: "Penyaluran Energi Terbarukan Gas Biometana Gratis ke 250+ Dapur Warga",
    tanggal: "14 Oktober 2020",
    dokumen: "SK Bupati Malang No. 188.45/412/KEP/2020 & Laporan Evaluasi DLH Kab. Malang",
    tindakan: "Peremajaan manifold pipa hisap HDPE 2 inch, pemasangan blower vakum metana 5,5 HP, dan kalibrasi burner kompor gas ramah lingkungan warga.",
    status: "Beroperasi Penuh",
    kategori: "Energi Bersih & Lingkungan",
    dampak: "Menghemat pengeluaran LPG warga sekitar hingga Rp 65.000/bulan/KK serta mereduksi emisi GRK gas metana ke atmosfer.",
    biaya: 285000000,
    penanggungJawab: "DLH Kab. Malang & Pengelola TPA Wisata Edukasi"
  },
  {
    id: "TPA-2021-001",
    tahun: 2021,
    objek: "3 Bidang Tanah Aset Pemkab Malang (Luas 554 m², 712 m², 677 m²)",
    lokasi: "Koridor Barat Akses Gerbang TPA Talangagung – Jalibar, RT 02 / RW 01",
    peristiwa: "Inventarisasi dan Legalisasi Aset Hak Pakai Pemerintah Daerah",
    tanggal: "18 November 2021",
    dokumen: "Berita Acara Inventarisasi Aset BPKAD No. 030/1182/35.07.014/2021 & Buku KIB-A",
    tindakan: "Pengukuran ulang batas kadastral bersama Kantor Pertanahan/BPN Kabupaten Malang dan pemasangan 12 patok batas cor beton.",
    status: "Terverifikasi BPN",
    kategori: "Tata Kelola Aset",
    dampak: "Menjamin kepastian hukum atas kepemilikan aset daerah seluas total 1.943 m² tanpa tumpang tindih dengan tanah warga.",
    biaya: 45000000,
    penanggungJawab: "BPKAD & BPN Kabupaten Malang"
  },
  {
    id: "TPA-2022-001",
    tahun: 2022,
    objek: "Lahan Zona Perluasan TPA Talangagung Seluas 11.450 m²",
    lokasi: "Blok Selatan Perluasan TPA Talangagung, Dusun Krajan / Jatisari",
    peristiwa: "Pengadaan dan Pembebasan Lahan Zona Baru Sanitary Landfill",
    tanggal: "22 Desember 2022",
    dokumen: "SK Penetapan Lokasi Sekda Kab. Malang & Akta Pelepasan Hak No. 45/APH/2022",
    tindakan: "Musyawarah ganti untung dengan pemilik lahan terdampak berdasarkan taksiran Tim Appraisal Independen (KJPP) dan penerbitan Sertifikat Hak Pakai.",
    status: "Selesai & Legal",
    kategori: "Pengadaan Lahan",
    dampak: "Memperpanjang masa pakai operasional penampungan sampah terpadu hingga 15 tahun ke depan dengan konsep zero-waste.",
    biaya: 5725000000,
    penanggungJawab: "Dinas Perumahan Kawasan Permukiman & Cipta Karya Kab. Malang"
  },
  {
    id: "TPA-2023-001",
    tahun: 2023,
    objek: "Kolam Leachate & Sistem Filtrasi IPAL Lindi (Wetland Remediation)",
    lokasi: "Zona Pengolahan Air Lindi TPA Talangagung (Bantaran Kali Metro)",
    peristiwa: "Rekayasa Fitoremediasi & Pengendalian Baku Mutu Air Lindi",
    tanggal: "15 September 2023",
    dokumen: "Sertifikat Uji Lab Lingkungan DLH No. 660.1/489/LAB/2023 & DED IPAL",
    tindakan: "Pemasangan geomembrane HDPE 1,5 mm tebal tahan rembes, introduksi tanaman eceng gondok dan cattail, serta pemasangan alat pemantau pH otomatis.",
    status: "Terkalibrasi Selesai",
    kategori: "Sanitasi & Konservasi Air",
    dampak: "Kadar BOD dan COD air buangan turun di bawah baku mutu Permen LHK, melindungi ekosistem aliran Kali Metro dari pencemaran.",
    biaya: 340000000,
    penanggungJawab: "Dinas Lingkungan Hidup Kab. Malang"
  },
  {
    id: "TPA-2024-001",
    tahun: 2024,
    objek: "Pusat Inovasi Edu-Waste & PLTS Tenaga Surya Mandiri",
    lokasi: "Kawasan Wisata Edukasi Lingkungan TPA Talangagung, Kepanjen",
    peristiwa: "Integrasi Pembelajaran Teaching Factory (TEFA) & Edu-Tour Pelajar",
    tanggal: "20 November 2024",
    dokumen: "PKS DLH Kab. Malang No. 415.4/89/PKS/2024 & Modul Kurikulum TEFA SMK",
    tindakan: "Pembangunan amphitheater mini, instalasi PLTS Off-Grid 5 kWp untuk penerangan galeri, dan kurasi wahana edukasi pemilahan sampah organik/anorganik.",
    status: "Beroperasi Penuh",
    kategori: "Edukasi & Pariwisata Berkelanjutan",
    dampak: "Menampung lebih dari 4.500 kunjungan pelajar dan mahasiswa pertahun sebagai role model nasional TPA ramah lingkungan.",
    biaya: 490000000,
    penanggungJawab: "Pengelola Edu-Waste & Mitra SMK TEFA"
  },
  {
    id: "TPA-2025-001",
    tahun: 2025,
    objek: "3 Bidang Tanah Trase Pelebaran Akses Jalan Masuk TPA",
    lokasi: "Koridor Penghubung Jalibar ke Gapura TPA, Dusun Krajan RT 01 / RW 01",
    peristiwa: "Konsultasi Publik Pengadaan 3 Bidang Tanah Akses Jalan Masuk TPA",
    tanggal: "26 Februari 2025",
    dokumen: "Berita Acara Konsultasi Publik Pengadaan Tanah Akses TPA (26 Februari 2025)",
    tindakan: "Musyawarah sosialisasi pengadaan 3 bidang tanah koridor akses jalan masuk TPA bersama warga pemilik lahan dan pemerintah desa.",
    status: "Disepakati Mufakat",
    kategori: "Pemerintahan & Partisipasi Warga",
    dampak: "Menjalin komunikasi partisipatif dan kesepahaman awal pembukaan akses transportasi.",
    biaya: 25000000,
    penanggungJawab: "Pemerintah Desa Talangagung & Dinas Terkait"
  },
  {
    id: "TPA-2025-002",
    tahun: 2025,
    objek: "Patok Kadastral Lahan 3 Bidang Akses TPA",
    lokasi: "Koridor Akses Jalan Masuk TPA Talangagung STA 0+000 s/d STA 0+450",
    peristiwa: "Pengukuran Kadastral & Pemasangan Patok Batas Lahan",
    tanggal: "4 Maret 2025",
    dokumen: "Berita Acara Pengukuran Kadastral & Pemasangan Patok Batas BPN & Pemkab Malang (4 Maret 2025)",
    tindakan: "Pengukuran batas kadastral bersama petugas ukur Kantor Pertanahan/BPN Kabupaten Malang serta pemasangan patok tanda batas bidang tanah.",
    status: "Konstruksi & Selesai",
    kategori: "Infrastruktur & Aksesibilitas",
    dampak: "Menetapkan batas fisik kepemilikan lahan secara sah untuk kelancaran aksesibilitas penanganan persampahan.",
    biaya: 820000000,
    penanggungJawab: "Dinas PU Bina Marga, DLH, & BPN Kab. Malang"
  },
  {
    id: "TPA-2026-001",
    tahun: 2026,
    objek: "Instalasi Pengolahan Sampah Terpadu, Fasilitas RDF, Pengolahan Limbah Medis B3, & Jaringan Distribusi Biometana TPA",
    lokasi: "Kawasan TPA Wisata Edukasi Talangagung & Permukiman Warga Sekitar TPA, Dusun Jatisari / Krajan",
    peristiwa: "TPA Talangagung Dinyatakan Salah Satu Tempat Pengelolaan Sampah Terbaik di Indonesia oleh Menteri LH",
    tanggal: "18–19 Agustus 2025 & Januari 2026",
    dokumen: "Pernyataan Resmi Menteri LH Dr. Hanif Faisol Nurofiq, MOU Pemkab Malang – PT Semen Indonesia (Disaksikan KPK), & Portal Resmi malangkab.go.id",
    tindakan: "Penyampaian evaluasi resmi Menteri LH: \"TPA ini sudah berjalan dengan sangat baik. Baunya tidak menyengat, air limbahnya sesuai standar, bahkan ada pemanfaatan metana.\" Dilanjutkan tindak lanjut pembangunan fasilitas Refuse Derived Fuel (RDF) di dua lokasi TPA (target selesai akhir 2025) berdasarkan MOU dengan PT Semen Indonesia yang disaksikan KPK, serta instalasi pengolahan limbah B3 (medis) dari rumah sakit.",
    status: "Terverifikasi",
    kategori: "Energi Bersih & Lingkungan",
    dampak: "Gas metana hasil pengolahan sampah kini menjadi bahan bakar gratis bagi 300 rumah tangga sekitar TPA (update Januari 2026). Sumber: situs resmi malangkab.go.id dan pemberitaan media terkait kunjungan Menteri LH.",
    biaya: 1450000000,
    penanggungJawab: "Kementerian Lingkungan Hidup RI, DLH Kab. Malang, & PT Semen Indonesia"
  }
];

interface ModulMemoriHistorisProps {
  onNavigateToDocs?: () => void;
}

export const ModulMemoriHistoris: React.FC<ModulMemoriHistorisProps> = () => {
  // State containing specific TPA Talangagung data (2020-2026)
  const [dataMemori, setDataMemori] = useState<MemoriHistorisItem[]>(initialTpaTalangagungData);
  
  // Interactive filters
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table' | 'cards'>('timeline');
  
  // Selected detail item for modal inspection
  const [detailItem, setDetailItem] = useState<MemoriHistorisItem | null>(null);
  
  // Speech narration state
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // New Record Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTahun, setFormTahun] = useState<number>(2026);
  const [formObjek, setFormObjek] = useState('');
  const [formLokasi, setFormLokasi] = useState('');
  const [formPeristiwa, setFormPeristiwa] = useState('');
  const [formTanggal, setFormTanggal] = useState('');
  const [formDokumen, setFormDokumen] = useState('');
  const [formTindakan, setFormTindakan] = useState('');
  const [formStatus, setFormStatus] = useState<string>('Selesai');
  const [formKategori, setFormKategori] = useState('Infrastruktur');
  const [formDampak, setFormDampak] = useState('');
  const [formBiaya, setFormBiaya] = useState<number>(0);

  // Available distinct years and categories
  const yearsList = ['All', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  const categoriesList = ['All', 'Infrastruktur & Aksesibilitas', 'Energi Bersih & Lingkungan', 'Tata Kelola Aset', 'Pengadaan Lahan', 'Sanitasi & Konservasi Air', 'Edukasi & Pariwisata Berkelanjutan', 'Pemerintahan & Partisipasi Warga'];

  // Filtered dataset
  const filteredData = dataMemori.filter(item => {
    const matchYear = selectedYear === 'All' || item.tahun.toString() === selectedYear;
    const matchCategory = selectedCategory === 'All' || item.kategori === selectedCategory;
    const matchSearch = 
      item.objek.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.peristiwa.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.dokumen.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.tindakan.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.status.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.tanggal.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchYear && matchCategory && matchSearch;
  }).sort((a, b) => a.tahun - b.tahun);

  // Text to Speech
  const handleSpeak = (item: MemoriHistorisItem) => {
    if (activeSpeakingId === item.id) {
      stopSpeech();
      setActiveSpeakingId(null);
      return;
    }

    stopSpeech();
    setActiveSpeakingId(item.id);
    const speechText = `Tahun ${item.tahun}, Objek: ${item.objek}. Peristiwa: ${item.peristiwa}. Lokasi di ${item.lokasi}. Tanggal ${item.tanggal}. Dokumen rujukan: ${item.dokumen}. Tindakan yang diambil: ${item.tindakan}. Status saat ini: ${item.status}.`;
    
    speakText(
      speechText,
      () => setActiveSpeakingId(null),
      () => setActiveSpeakingId(item.id)
    );
  };

  // Add new history record handler
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formObjek || !formLokasi || !formPeristiwa || !formTanggal || !formDokumen || !formTindakan) {
      alert("Mohon lengkapi seluruh 7 atribut utama (Objek, Lokasi, Peristiwa, Tanggal, Dokumen, Tindakan, Status)!");
      return;
    }

    const newRecord: MemoriHistorisItem = {
      id: `TPA-${formTahun}-${Date.now().toString().slice(-4)}`,
      tahun: Number(formTahun),
      objek: formObjek,
      lokasi: formLokasi,
      peristiwa: formPeristiwa,
      tanggal: formTanggal,
      dokumen: formDokumen,
      tindakan: formTindakan,
      status: formStatus,
      kategori: formKategori,
      dampak: formDampak || 'Tercatat dalam memori digital desa terintegrasi',
      biaya: formBiaya,
      penanggungJawab: 'Pemerintah Desa & Pengelola TPA Talangagung'
    };

    setDataMemori(prev => [...prev, newRecord]);
    setShowAddModal(false);
    
    // Reset Form
    setFormObjek('');
    setFormLokasi('');
    setFormPeristiwa('');
    setFormTanggal('');
    setFormDokumen('');
    setFormTindakan('');
    setFormDampak('');
    setFormBiaya(0);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Beroperasi Penuh':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Terverifikasi BPN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Selesai & Legal':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Terkalibrasi Selesai':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Disepakati Mufakat':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Konstruksi & Selesai':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getYearAccentColor = (year: number) => {
    switch (year) {
      case 2020: return 'border-cyan-500 bg-cyan-500 text-cyan-600';
      case 2021: return 'border-blue-500 bg-blue-500 text-blue-600';
      case 2022: return 'border-emerald-500 bg-emerald-500 text-emerald-600';
      case 2023: return 'border-teal-500 bg-teal-500 text-teal-600';
      case 2024: return 'border-amber-500 bg-amber-500 text-amber-600';
      case 2025: return 'border-rose-500 bg-rose-500 text-rose-600';
      default: return 'border-slate-500 bg-slate-500 text-slate-600';
    }
  };

  return (
    <div id="modul-memori-historis" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Studi Kasus Khusus
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Periode 2020 – 2025
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Memori Historis TPA Talangagung
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Dokumentasi linimasa terstruktur dan audit memori digital pengelolaan <strong>TPA Wisata Edukasi Talangagung</strong>. 
              Menelusuri 7 atribut utama secara komprehensif: <em>Objek, Lokasi, Peristiwa, Tanggal, Dokumen, Tindakan, dan Status</em>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-tambah-memori"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekam Historis</span>
            </button>
            <button
              id="btn-cetak-rekap"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5"
              title="Cetak / Unduh Rekap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Mini-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Total Catatan</span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">{dataMemori.length} Peristiwa</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Rentang Tahun 2020–2025</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Dokumen Bukti</span>
              <FileCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">100% Terverifikasi</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">SK, BPN, & Berita Acara</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Luas Lahan Terdata</span>
              <MapPin className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">13.393 m²</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zona Inti & Koridor Akses</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Gas Metana Warga</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">250+ KK</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Pemanfaatan Energi Bersih</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter, Year Select, Search, & View Mode */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Year Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tahun:</span>
            </span>
            {yearsList.map(yr => (
              <button
                key={yr}
                id={`filter-year-${yr}`}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedYear === yr 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {yr === 'All' ? 'Semua Tahun' : yr}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center self-end md:self-auto gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              id="view-mode-timeline"
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Linimasa Interaktif
            </button>
            <button
              id="view-mode-table"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel Matriks (7 Atribut)
            </button>
            <button
              id="view-mode-cards"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kartu Detail
            </button>
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-memori"
              type="text"
              placeholder="Cari Objek, Lokasi, Peristiwa, Dokumen, Tindakan..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchKeyword && (
              <button 
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="sm:w-64">
            <select
              id="select-category-memori"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content View Switcher */}
      {filteredData.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">Tidak ada data rekam historis ditemukan</h4>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan filter tahun, kata kunci pencarian, atau kategori.</p>
          <button
            onClick={() => { setSelectedYear('All'); setSelectedCategory('All'); setSearchKeyword(''); }}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-all"
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* 1. Interactive Visual Timeline View */
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-400 before:to-slate-300">
          {filteredData.map((item, index) => {
            const isSpeaking = activeSpeakingId === item.id;
            return (
              <div 
                key={item.id} 
                id={`timeline-item-${item.id}`}
                className="relative group transition-all"
              >
                {/* Timeline node icon */}
                <div className={`absolute -left-[30px] sm:-left-[35px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                  item.tahun === 2025 ? 'bg-rose-500 text-white ring-4 ring-rose-100' :
                  item.tahun === 2024 ? 'bg-amber-500 text-white ring-2 ring-amber-100' :
                  item.tahun === 2023 ? 'bg-teal-500 text-white' :
                  item.tahun === 2022 ? 'bg-emerald-500 text-white' :
                  item.tahun === 2021 ? 'bg-blue-500 text-white' : 'bg-cyan-500 text-white'
                }`}>
                  <span className="text-[10px] font-black">{item.tahun.toString().slice(-2)}</span>
                </div>

                {/* Timeline Card */}
                <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200">
                  {/* Top Bar: Year & Date, Status, Speech */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-lg shadow-xs">
                        Tahun {item.tahun}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.tanggal}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(item.status)}`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleSpeak(item)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSpeaking 
                            ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                        title={isSpeaking ? "Hentikan Suara" : "Dengarkan Narasi AI"}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Peristiwa Headline */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.peristiwa}
                  </h3>

                  {/* 7 Structured Attributes Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4 bg-slate-50/80 border border-slate-100 rounded-xl p-4">
                    {/* 1. Objek */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
                        <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>1. Objek:</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 pl-5">
                        {item.objek}
                      </p>
                    </div>

                    {/* 2. Lokasi */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>2. Lokasi:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 pl-5">
                        {item.lokasi}
                      </p>
                    </div>

                    {/* 3. Dokumen Rujukan */}
                    <div className="space-y-1 md:col-span-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>3. Dokumen / Legalitas:</span>
                      </div>
                      <div className="pl-5 flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-mono text-indigo-900 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                          {item.dokumen}
                        </p>
                      </div>
                    </div>

                    {/* 4. Tindakan yang Diambil */}
                    <div className="space-y-1 md:col-span-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
                        <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>4. Tindakan yang Diambil:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 pl-5 leading-relaxed">
                        {item.tindakan}
                      </p>
                    </div>
                  </div>

                  {/* Footer & Detail Inspection */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-slate-500">
                      {item.biaya && item.biaya > 0 ? (
                        <span className="font-semibold text-slate-700">
                          Anggaran/Nilai: Rp {item.biaya.toLocaleString('id-ID')}
                        </span>
                      ) : null}
                      {item.penanggungJawab && (
                        <span>PJ: <strong>{item.penanggungJawab}</strong></span>
                      )}
                    </div>

                    <button
                      onClick={() => setDetailItem(item)}
                      className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 font-bold self-end sm:self-auto hover:underline"
                    >
                      <span>Lihat Detail Audit 7 Atribut</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'table' ? (
        /* 2. Structured Table Matrix View (7 Atribut) */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Matriks Data Historis TPA Talangagung (Objek, Lokasi, Peristiwa, Tanggal, Dokumen, Tindakan, Status)</span>
            </h4>
            <span className="text-xs font-semibold text-slate-500">{filteredData.length} baris ditampilkan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Tahun & Tgl</th>
                  <th className="py-3.5 px-4 min-w-[180px]">Objek</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Peristiwa</th>
                  <th className="py-3.5 px-4 min-w-[180px]">Lokasi</th>
                  <th className="py-3.5 px-4 min-w-[220px]">Dokumen</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Tindakan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{item.tahun}</span>
                      <span className="text-[11px] text-slate-500">{item.tanggal}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.objek}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {item.peristiwa}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item.lokasi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block">
                        {item.dokumen}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs leading-relaxed">
                      {item.tindakan}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDetailItem(item)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 3. Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredData.map(item => (
            <div 
              key={item.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-lg">
                    {item.tahun} • {item.tanggal}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {item.peristiwa}
                </h4>

                <div className="space-y-2.5 text-xs text-slate-600 my-3">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Objek:</span>
                    <p className="text-slate-700 font-medium">{item.objek}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Lokasi:</span>
                    <p className="text-slate-600 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item.lokasi}</span>
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Dokumen Rujukan:</span>
                    <span className="font-mono text-[11px] text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 block">
                      {item.dokumen}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Tindakan:</span>
                    <p className="text-slate-700 line-clamp-3">{item.tindakan}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleSpeak(item)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Narasi</span>
                </button>
                <button
                  onClick={() => setDetailItem(item)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-all"
                >
                  Buka Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-BAGIAN BARU: DAMPAK EKONOMI & OPERASIONAL TPA TALANGAGUNG */}
      <div id="modul-dampak-ekonomi-operasional-tpa" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900">
                  Dampak Ekonomi & Operasional TPA Talangagung
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Studi Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kondisi ketenagakerjaan, perputaran ekonomi pemulung, volume operasional 87 TPS, retribusi armada, dan pemberdayaan daur ulang
              </p>
            </div>
          </div>

          <div className="text-[11px] font-bold px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl max-w-xl self-start lg:self-auto leading-tight">
            <span className="text-slate-500 font-semibold block text-[10px]">Sitasi Referensi Ilmiah:</span>
            <span>Sumber: Jurnal Kondisi Ekonomi Masyarakat Sekitar TPA Wisata Edukasi Talangagung (ResearchGate/Academia.edu, Universitas Brawijaya); Strategi Pengembangan TPA Wisata Edukasi Talangagung (Eprints ITN Malang)</span>
          </div>
        </div>

        {/* 4 Pilar Grid Data Konkret */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pilar 1: Tenaga Kerja */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Tenaga Kerja
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">
                  13 Staf Tetap
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Staf Pengelola:</span>
                  <span className="text-slate-600">13 staf tetap pengelola operasional harian TPA.</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Pemulung Aktif:</span>
                  <span className="text-slate-600">9–15 pemulung aktif bekerja di lokasi (jumlah bertambah saat anggota keluarga ikut membantu).</span>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="font-bold text-emerald-900 block text-xs">Pendapatan Pemilah:</span>
                  <span className="text-emerald-800 font-semibold">Rp 500.000 – Rp 1.000.000 / minggu</span>
                  <span className="block text-[10px] text-emerald-700 mt-0.5">(dari barang bernilai ekonomis, lebih tinggi dari gaji staf tetap).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 2: Operasional & Volume Sampah */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-purple-600" />
                  Operasional & Sampah
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">
                  140 m³/hari
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Kapasitas Harian:</span>
                  <span className="text-slate-600">Menampung sekitar <strong>140 m³ sampah per hari</strong>.</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Titik Asal Sampah:</span>
                  <span className="text-slate-600">Berasal dari <strong>87 titik TPS</strong> (Tempat Pembuangan Sementara).</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Cakupan Wilayah:</span>
                  <span className="text-slate-600">Melayani cakupan <strong>8 kabupaten/kota</strong> di sekitarnya.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 3: Skema Tarif Retribusi */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-600" />
                  Tarif Retribusi Armada
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                  Resmi Per m³
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-800">Gerobak Sampah:</span>
                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                    Rp 75.000 / m³
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-800">Mobil Pick-up:</span>
                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                    Rp 150.000 / m³
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-slate-800">Truk Besar:</span>
                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                    Rp 200.000 / m³
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 4: Pemberdayaan Warga & Luas Area */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-emerald-700" />
                  Pemberdayaan & Lahan
                </span>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  3,5 Hektar
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white border border-emerald-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Pemberdayaan Ibu-Ibu:</span>
                  <span className="text-slate-600 leading-relaxed">
                    Program pelatihan bagi ibu-ibu sekitar membuat <strong>sapu dari olahan plastik daur ulang</strong> untuk dijual, menambah penghasilan rumah tangga.
                  </span>
                </div>
                <div className="p-2.5 bg-white border border-emerald-200 rounded-lg">
                  <span className="font-bold text-slate-900 block text-xs">Luas Area Fisik:</span>
                  <span className="text-slate-600">
                    Luas area TPA Wisata Edukasi sekitar <strong>3,5 hektar</strong> terintegrasi zona sanitary landfill dan ruang hijau edukasi.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal (7 Atribut & Legal Audit View) */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setDetailItem(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-xl">
                Tahun {detailItem.tahun}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(detailItem.status)}`}>
                {detailItem.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1 leading-snug">
              {detailItem.peristiwa}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              ID Rekam Jejak: <span className="font-mono font-semibold">{detailItem.id}</span> • Tanggal Pelaksanaan: <strong>{detailItem.tanggal}</strong>
            </p>

            {/* 7 Fields Detail Breakdown */}
            <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pb-3 border-b border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">1. Objek</span>
                <span className="sm:col-span-2 font-semibold text-slate-900">{detailItem.objek}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pb-3 border-b border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">2. Lokasi</span>
                <span className="sm:col-span-2 text-slate-800 flex items-start gap-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{detailItem.lokasi}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pb-3 border-b border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">3. Peristiwa</span>
                <span className="sm:col-span-2 font-semibold text-slate-900">{detailItem.peristiwa}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pb-3 border-b border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">4. Tanggal</span>
                <span className="sm:col-span-2 text-slate-800 font-medium">{detailItem.tanggal}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pb-3 border-b border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">5. Dokumen Rujukan</span>
                <div className="sm:col-span-2">
                  <span className="font-mono text-xs text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 inline-block font-semibold">
                    {detailItem.dokumen}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pb-3 border-b border-slate-200/80">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">6. Tindakan</span>
                <span className="sm:col-span-2 text-slate-700 leading-relaxed">{detailItem.tindakan}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">7. Status Akhir</span>
                <span className="sm:col-span-2 font-bold text-slate-900">{detailItem.status}</span>
              </div>
            </div>

            {/* Impact & Meta */}
            {detailItem.dampak && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dampak Pembangunan & Manfaat Warga:</span>
                </h5>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {detailItem.dampak}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => handleSpeak(detailItem)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Bacakan Narasi Audio</span>
              </button>

              <button
                onClick={() => setDetailItem(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Rekam Jejak Historis Baru (Input 7 Atribut) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Tambah Rekam Jejak Historis TPA Talangagung
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Masukkan 7 atribut standar rekam jejak untuk memori digital desa terintegrasi.
            </p>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tahun Pelaksanaan *
                  </label>
                  <input
                    type="number"
                    min="2010"
                    max="2030"
                    value={formTahun}
                    onChange={e => setFormTahun(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tanggal Lengkap / Periode *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 18 Maret 2025"
                    value={formTanggal}
                    onChange={e => setFormTanggal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Objek (Fasilitas / Lahan / Unit Mesin) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 3 Bidang Tanah Akses Masuk TPA Talangagung"
                  value={formObjek}
                  onChange={e => setFormObjek(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Lokasi Spesifik *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dusun Krajan RT 01 / RW 01 Kawasan TPA Talangagung"
                  value={formLokasi}
                  onChange={e => setFormLokasi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Peristiwa Historis *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pengukuran Kadastral BPN dan Musyawarah Ganti Rugi Warga"
                  value={formPeristiwa}
                  onChange={e => setFormPeristiwa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  4. Dokumen Rujukan / Legalitas *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Berita Acara No. 590/042/2025 & Peta Bidang BPN"
                  value={formDokumen}
                  onChange={e => setFormDokumen(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  5. Tindakan yang Diambil *
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan tindakan teknis, musyawarah, atau konstruksi yang dilakukan..."
                  value={formTindakan}
                  onChange={e => setFormTindakan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    6. Status Akhir *
                  </label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                  >
                    <option value="Selesai">Selesai</option>
                    <option value="Beroperasi Penuh">Beroperasi Penuh</option>
                    <option value="Terverifikasi BPN">Terverifikasi BPN</option>
                    <option value="Selesai & Legal">Selesai & Legal</option>
                    <option value="Terkalibrasi Selesai">Terkalibrasi Selesai</option>
                    <option value="Disepakati Mufakat">Disepakati Mufakat</option>
                    <option value="Konstruksi & Selesai">Konstruksi & Selesai</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estimasi Anggaran / Nilai (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={formBiaya}
                    onChange={e => setFormBiaya(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-all"
                >
                  Simpan Rekam Historis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
