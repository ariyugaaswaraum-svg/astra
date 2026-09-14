import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Flame,
  Search,
  Volume2,
  VolumeX,
  Printer,
  Users,
  Truck,
  TrendingUp,
  Coins,
  Sparkle,
  Recycle,
  Maximize2,
  BookOpen,
  Info
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';

export interface TimelineEntryPattern {
  id: string;
  tahun: string;
  objek: string;
  lokasi: string;
  peristiwa: string;
  tanggal: string;
  dokumen: string;
  tindakan: string;
  status: 'Selesai' | 'Berjalan' | 'Dalam Evaluasi' | 'Terverifikasi' | string;
  keteranganTambahan?: string;
  iconType?: 'land' | 'public' | 'survey' | 'green' | 'minister' | 'verified';
}

export const talangagungTimelineData: TimelineEntryPattern[] = [
  {
    id: "ENTRI-1",
    tahun: "2021-2022",
    objek: "Pengadaan & Perluasan Lahan TPA Talangagung (Master Data: 13.393 m² / ~1,34 Ha)",
    lokasi: "Blok Kawasan TPA Edukasi Talangagung, Dusun Krajan / Jatisari, Desa Talangagung",
    peristiwa: "Konsolidasi Lahan Aset TPA: Tapak Awal 1.943 m² & Zona Perluasan 11.450 m²",
    tanggal: "2021 - 2022",
    dokumen: "Dokumen Master Aset TPA & Rekapitulasi Lahan Pemerintah Daerah (DOC-TPA-MASTER)",
    tindakan: "Pencatatan aset resmi yang terdiri dari Lahan Tapak Awal seluas 1.943 m² dan Zona Perluasan seluas 11.450 m² (~1,145 Ha) untuk instalasi sanitary landfill, IPLT, dan area edukasi lingkungan.",
    status: "Terverifikasi",
    keteranganTambahan: "Total luas lahan aset terdaftar resmi terkonsolidasi adalah 13.393 m² (1,34 Ha).",
    iconType: "land"
  },
  {
    id: "ENTRI-2",
    tahun: "2025",
    objek: "3 Bidang Tanah Koridor Akses Jalan Masuk TPA Talangagung",
    lokasi: "Kawasan Koridor Akses TPA, Dusun Krajan RT 01 / RW 01, Desa Talangagung",
    peristiwa: "Konsultasi Publik Pengadaan 3 Bidang Tanah Akses Jalan TPA",
    tanggal: "26 Februari 2025",
    dokumen: "Berita Acara Konsultasi Publik Pengadaan Tanah Akses TPA (26 Februari 2025)",
    tindakan: "Penyelenggaraan sosialisasi dan konsultasi publik pengadaan 3 bidang tanah untuk koridor akses masuk TPA Talangagung bersama warga pemilik lahan dan pemerintah desa.",
    status: "Selesai",
    keteranganTambahan: "Fakta didukung dokumen naskah: Konsultasi publik diselenggarakan pada 26 Februari 2025.",
    iconType: "public"
  },
  {
    id: "ENTRI-3",
    tahun: "2025",
    objek: "Batas Kadastral & Patok Batas Lahan 3 Bidang Akses TPA",
    lokasi: "Koridor Akses Jalan Masuk TPA Talangagung, Dusun Krajan RT 01 / RW 01",
    peristiwa: "Pengukuran Kadastral & Pemasangan Patok Batas Lahan",
    tanggal: "4 Maret 2025",
    dokumen: "Berita Acara Pengukuran Kadastral & Pemasangan Patok Batas BPN & Pemkab Malang (4 Maret 2025)",
    tindakan: "Pengukuran kadastral 3 bidang tanah koridor akses TPA bersama juru ukur Kantor Pertanahan/BPN Kabupaten Malang serta pemasangan patok tanda batas bidang tanah.",
    status: "Selesai",
    keteranganTambahan: "Fakta didukung dokumen naskah: Pengukuran dan pemasangan patok batas dilaksanakan pada 4 Maret 2025.",
    iconType: "survey"
  },
  {
    id: "ENTRI-4",
    tahun: "2025",
    objek: "Zona Penyangga Hijau (Buffer Zone) & Jalur Koridor TPA",
    lokasi: "Sepanjang Perimeter Batas Luar TPA & Akses Jalan Lingkungan TPA Talangagung",
    peristiwa: "Program Penghijauan & Penataan RTH Koridor TPA",
    tanggal: "Periode Musim Tanam 2025",
    dokumen: "Program Penataan Ruang Terbuka Hijau (RTH) & RKL Lingkungan Hidup",
    tindakan: "Perencanaan penghijauan koridor jalan dan pembatas vegetasi kawasan pembuangan sampah terpadu.",
    status: "Belum Diverifikasi",
    keteranganTambahan: "Rincian spesifik jumlah bibit (350 Tabebuya, 200 Kenanga, progres 75%) berstatus 'Data B — Simulasi / Belum Diverifikasi'.",
    iconType: "green"
  },
  {
    id: "ENTRI-5",
    tahun: "2025–2026",
    objek: "Instalasi Pengolahan Sampah Terpadu, Fasilitas RDF, & Jaringan Distribusi Biometana TPA Talangagung",
    lokasi: "Kawasan TPA Wisata Edukasi Talangagung & Sekitar TPA, Dusun Jatisari / Krajan, Kecamatan Kepanjen",
    peristiwa: "Kunjungan Menteri Lingkungan Hidup & Evaluasi Pengelolaan Sampah TPA Talangagung",
    tanggal: "18–19 Agustus 2025 & Januari 2026",
    dokumen: "Pernyataan Resmi Menteri LH, MOU Pemkab Malang – PT Semen Indonesia (Disaksikan KPK), & Portal malangkab.go.id",
    tindakan: "Penyampaian evaluasi resmi Menteri LH atas kinerja sanitasi, operasional sanitary landfill, dan pemanfaatan gas metana. Dilanjutkan dengan tindak lanjut kerja sama pengolahan RDF dan limbah terpadu.",
    status: "Terverifikasi",
    keteranganTambahan: "Penyaluran biometana gratis melayani 250+ KK warga terdaftar resmi (data primer terverifikasi).",
    iconType: "verified"
  },
  {
    id: "ENTRI-6",
    tahun: "2026",
    objek: "Terminal Talangagung Kepanjen (Lahan 30.021 m²) & Simpul Koridor Rute Bus Trans Jatim",
    lokasi: "Terminal Talangagung, Dusun 1 (Krajan) RT 01 / RW 01, Desa Talangagung, Kecamatan Kepanjen",
    peristiwa: "Penetapan Terminal Talangagung sebagai Titik Awal (Origin) Rute Baru Bus Trans Jatim Koridor 2",
    tanggal: "14 Juni 2026 (Target Operasi Oktober 2026)",
    dokumen: "Perencanaan Operasional Dishub Provinsi Jawa Timur & Dishub Kab. Malang (Rujukan Terverifikasi: JatimTimes, 14 Juni 2026)",
    tindakan: "Penyiapan fasilitas shelter, jalur peron, dan integrasi rute Trans Jatim Koridor 2 (Terminal Talangagung Kepanjen -> Terminal Hamid Rusdi -> Terminal Arjosari) dengan kesiapan 15 armada bus.",
    status: "Terverifikasi",
    keteranganTambahan: "Rute Trans Jatim pertama yang menjangkau Malang Selatan. Rujukan resmi: JatimTimes, 14 Juni 2026.",
    iconType: "verified"
  }
];

export const MemoriHistorisObjek: React.FC = () => {
  const [dataList] = useState<TimelineEntryPattern[]>(talangagungTimelineData);
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const statusList = ['Semua', 'Selesai', 'Berjalan', 'Dalam Evaluasi', 'Terverifikasi'];

  const filteredData = dataList.filter(item => {
    const matchStatus = selectedFilter === 'Semua' || item.status === selectedFilter;
    const matchSearch = 
      item.objek.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.peristiwa.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.dokumen.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.tindakan.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.status.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.keteranganTambahan && item.keteranganTambahan.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      item.tanggal.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terverifikasi':
        return {
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold',
          icon: ShieldCheck,
          dotClass: 'bg-emerald-600'
        };
      case 'Selesai':
        return {
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          icon: CheckCircle2,
          dotClass: 'bg-emerald-500'
        };
      case 'Berjalan':
        return {
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-300',
          icon: Clock,
          dotClass: 'bg-blue-500'
        };
      case 'Dalam Evaluasi':
        return {
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertCircle,
          dotClass: 'bg-amber-500'
        };
      default:
        return {
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-300',
          icon: CheckCircle2,
          dotClass: 'bg-slate-500'
        };
    }
  };

  const handleSpeakPattern = (item: TimelineEntryPattern) => {
    if (activeSpeechId === item.id) {
      stopSpeech();
      setActiveSpeechId(null);
      return;
    }

    stopSpeech();
    setActiveSpeechId(item.id);
    const speechScript = `Pola Kronologi Studi Kasus TPA Talangagung: Objek: ${item.objek}. Lokasi: ${item.lokasi}. Peristiwa: ${item.peristiwa}. Tanggal: ${item.tanggal}. Dokumen: ${item.dokumen}. Tindakan: ${item.tindakan}. Status: ${item.status}.`;
    
    speakText(
      speechScript,
      () => setActiveSpeechId(null),
      () => setActiveSpeechId(item.id)
    );
  };

  return (
    <div id="memori-historis-objek-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider">
                Studi Kasus TPA Talangagung
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Pola Rantai 7 Atribut
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Memori Historis Objek TPA Talangagung
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1.5 leading-relaxed">
              Linimasa terstruktur yang memetakan kronologi setiap entri dengan pola eksplisit: 
              <span className="font-semibold text-blue-700 mx-1">OBJEK</span> → 
              <span className="font-semibold text-rose-700 mx-1">LOKASI</span> → 
              <span className="font-semibold text-purple-700 mx-1">PERISTIWA</span> → 
              <span className="font-semibold text-amber-700 mx-1">TANGGAL</span> → 
              <span className="font-semibold text-indigo-700 mx-1">DOKUMEN</span> → 
              <span className="font-semibold text-emerald-700 mx-1">TINDAKAN</span> → 
              <span className="font-semibold text-slate-900 mx-1">STATUS</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Linimasa</span>
            </button>
          </div>
        </div>

        {/* Pattern Flow Legend Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold py-1 scrollbar-none">
          <span className="text-slate-400 font-semibold mr-1 shrink-0 text-xs">Pola Alur:</span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg shrink-0">1. OBJEK</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg shrink-0">2. LOKASI</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg shrink-0">3. PERISTIWA</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shrink-0">4. TANGGAL</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg shrink-0">5. DOKUMEN</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0">6. TINDAKAN</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg shrink-0">7. STATUS</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {statusList.map(st => (
            <button
              key={st}
              onClick={() => setSelectedFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci dalam 7 atribut..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Interactive Visual Timeline with Explicit Pattern */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-blue-600 before:via-indigo-500 before:to-emerald-500">
        {filteredData.map((item, index) => {
          const statusInfo = getStatusBadge(item.status);
          const StatusIcon = statusInfo.icon;
          const isSpeaking = activeSpeechId === item.id;

          return (
            <div 
              key={item.id}
              id={`timeline-objek-${item.id}`}
              className="relative group transition-all"
            >
              {/* Timeline Sequence Badge Node */}
              <div className="absolute -left-[31px] sm:-left-[36px] top-4 w-8 h-8 rounded-full bg-white border-4 border-blue-600 shadow-sm flex items-center justify-center text-[11px] font-black text-blue-700">
                {index + 1}
              </div>

              {/* Main Card */}
              <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
                {/* Header of Entry */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-lg shadow-xs">
                      {item.tahun}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {item.peristiwa}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${statusInfo.badgeClass}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{item.status}</span>
                    </span>

                    <button
                      onClick={() => handleSpeakPattern(item)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSpeaking 
                          ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                      title={isSpeaking ? "Hentikan Narasi" : "Dengarkan Pola Alur 7 Atribut"}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Explicit Pattern Chain: OBJEK -> LOKASI -> PERISTIWA -> TANGGAL -> DOKUMEN -> TINDAKAN -> STATUS */}
                <div className="mt-4 space-y-3">
                  {/* Step 1: OBJEK */}
                  <div className="flex items-start space-x-3 bg-blue-50/50 border border-blue-100/80 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-blue-800 font-extrabold text-xs">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>1. OBJEK</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 flex-1">
                      {item.objek}
                    </div>
                  </div>

                  {/* Step 2: LOKASI */}
                  <div className="flex items-start space-x-3 bg-rose-50/50 border border-rose-100/80 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-rose-800 font-extrabold text-xs">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>2. LOKASI</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 flex-1">
                      {item.lokasi}
                    </div>
                  </div>

                  {/* Step 3: PERISTIWA */}
                  <div className="flex items-start space-x-3 bg-purple-50/50 border border-purple-100/80 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-purple-800 font-extrabold text-xs">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>3. PERISTIWA</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-purple-950 flex-1">
                      {item.peristiwa}
                    </div>
                  </div>

                  {/* Step 4: TANGGAL */}
                  <div className="flex items-start space-x-3 bg-amber-50/50 border border-amber-100/80 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-amber-800 font-extrabold text-xs">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>4. TANGGAL</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-amber-950 flex-1">
                      {item.tanggal}
                    </div>
                  </div>

                  {/* Step 5: DOKUMEN */}
                  <div className="flex items-start space-x-3 bg-indigo-50/50 border border-indigo-100/80 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-indigo-800 font-extrabold text-xs">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>5. DOKUMEN</span>
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-indigo-950 bg-white/80 px-2.5 py-1 rounded border border-indigo-200/80 flex-1 font-semibold">
                      {item.dokumen}
                    </div>
                  </div>

                  {/* Step 6: TINDAKAN */}
                  <div className="flex items-start space-x-3 bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-emerald-800 font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>6. TINDAKAN</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed flex-1">
                      {item.tindakan}
                    </div>
                  </div>

                  {/* Step 7: STATUS */}
                  <div className="flex items-start space-x-3 bg-slate-100/80 border border-slate-200 rounded-xl p-3.5">
                    <div className="w-24 shrink-0 flex items-center space-x-1.5 text-slate-800 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                      <span>7. STATUS</span>
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                        {item.status}
                      </span>
                      {item.keteranganTambahan && (
                        <span className="text-xs text-slate-500 font-normal">
                          — {item.keteranganTambahan}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DAFTAR AUDIT KONFLIK SUMBER & INTEGRITAS FAKTA */}
      <div id="audit-konflik-sumber-tpa" className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Daftar Audit Konflik Sumber & Integritas Fakta
              </h3>
              <p className="text-xs text-slate-500">
                Catatan rekonsiliasi data: klaim dan entri yang belum didukung dokumen naskah resmi dipisahkan dari linimasa fakta aktif.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
            Audit Data Primer
          </span>
        </div>

        <div className="space-y-3">
          {/* Item 1: 12 Februari 2025 */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">
                Klaim: “Konsultasi Publik Tahap I — 12 Februari 2025” / Undangan No. 590/018/35.07.01/2025
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                Memerlukan verifikasi sumber — tidak digunakan sebagai fakta aktif
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tidak didukung oleh naskah dokumen primer resmi. Data yang didukung dokumen acuan adalah <strong>Konsultasi Publik pada tanggal 26 Februari 2025</strong>. Tanggal 12 Februari tidak dijadikan tahapan awal tanpa bukti arsip dokumen asli.
            </p>
          </div>

          {/* Item 2: 26 Maret 2025 */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">
                Klaim: “Musyawarah Bentuk Ganti Kerugian — 26 Maret 2025” / Berita Acara No. 590/088/BPN-DLH/2025
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                Memerlukan verifikasi sumber — tidak digunakan sebagai fakta aktif
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Klaim musyawarah ganti kerugian beserta nomor surat dan nominal kompensasi tersebut tidak didukung oleh dokumen naskah terbitan resmi.
            </p>
          </div>

          {/* Item 3: Klaim ROW 8 meter & 18 Patok Beton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Klaim Dimensi ROW 8 Meter</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  Data B — Simulasi / Belum Diverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estimasi geometrik lebar jalan koridor masuk. Memerlukan dokumen Detail Engineering Design (DED) teknis jalan.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Klaim 18 Patok Beton Kadastral</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  Data B — Simulasi / Belum Diverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kegiatan pengukuran dan pemasangan patok tercatat pada <strong>4 Maret 2025</strong>, namun rincian jumlah 18 titik cor memerlukan BAST resmi.
              </p>
            </div>
          </div>

          {/* Item 4: Klaim Persetujuan 100% & Kuantitas Bibit RTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">Klaim Persetujuan 100% & Clear and Clean</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Belum Diverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Status hukum dan persentase persetujuan memerlukan validasi buku register sengketa resmi instansi berwenang.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">350 Tabebuya, 200 Kenanga, Progres 75%</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  Data B — Simulasi / Belum Diverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rincian kuantitas bibit tanaman penghijauan dan persentase progres berstatus data estimasi simulasi prototipe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-BAGIAN BARU: DAMPAK EKONOMI & OPERASIONAL TPA TALANGAGUNG */}
      <div id="dampak-ekonomi-operasional-tpa" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
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
                  <span className="font-bold text-slate-900 block text-xs">Luas Aset Terkonsolidasi:</span>
                  <span className="text-slate-600">
                    Luas lahan aset resmi TPA tercatat <strong>13.393 m² (1,34 Ha)</strong> terintegrasi dalam bentang kawasan operasional & wisata edukasi ~3,5 Ha.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
