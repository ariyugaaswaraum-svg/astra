import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Signal, 
  Store, 
  ShoppingBag, 
  Landmark, 
  Route, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  BarChart3,
  Smartphone,
  Truck,
  Info,
  Network,
  Home,
  Compass,
  Droplets,
  GraduationCap,
  Fuel,
  Bus,
  Award,
  Calendar,
  Flag,
  Palette,
  Target,
  Shield,
  HeartHandshake,
  Compass as CompassIcon
} from 'lucide-react';
import { VillageProfile } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface ProfilDesaProps {
  villageProfile: VillageProfile;
  onNavigateToTab?: (tab: string) => void;
}

export const ProfilDesa: React.FC<ProfilDesaProps> = ({
  villageProfile,
  onNavigateToTab
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'wilayah' | 'ekonomi' | 'infrastruktur'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bpsSummaryText = 
    `Profil Statistik Resmi Badan Pusat Statistik Desa Talangagung, Kecamatan Kepanjen, Kabupaten Malang. ` +
    `Data indikator pokok: ` +
    `Jumlah RW: 5. ` +
    `Jumlah RT: 27. ` +
    `Kekuatan sinyal jaringan: 4G/LTE sangat kuat. ` +
    `Jumlah koperasi simpan pinjam: 6 unit. ` +
    `Jumlah kelompok pertokoan: 3 sentra. ` +
    `Jumlah pasar dengan bangunan permanen: 1 pasar. ` +
    `Kondisi jalan: aspal dan beton, dapat dilalui sepanjang tahun. ` +
    `Total penduduk tercatat sebanyak 8.522 jiwa dengan luas wilayah 281,05 hektar.`;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      speakText(bpsSummaryText, () => setIsPlayingAudio(false));
      setIsPlayingAudio(true);
    }
  };

  // 7 BPS Indicator Cards as requested
  const bpsCoreCards = [
    {
      id: 'jumlah_rw',
      title: 'Jumlah RW',
      mainValue: '5 RW',
      subValue: '5 Rukun Warga Terdaftar',
      category: 'wilayah',
      badge: 'Data BPS',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Layers,
      iconColor: 'bg-blue-600 text-white',
      accentBorder: 'border-blue-200 hover:border-blue-400',
      highlights: [
        'Terbagi dalam 5 Rukun Warga (RW)',
        'Mencakup seluruh dusun di Desa Talangagung',
        'Struktur kelembagaan aktif & terverifikasi'
      ],
      source: 'BPS - Kecamatan Kepanjen Dalam Angka'
    },
    {
      id: 'jumlah_rt',
      title: 'Jumlah RT',
      mainValue: '27 RT',
      subValue: '27 Rukun Tetangga Terdistribusi',
      category: 'wilayah',
      badge: 'Data BPS',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Home,
      iconColor: 'bg-indigo-600 text-white',
      accentBorder: 'border-indigo-200 hover:border-indigo-400',
      highlights: [
        'Total 27 Rukun Tetangga (RT)',
        'Rata-rata 316 jiwa per lingkungan RT',
        'Pelayanan administrasi warga terdesentralisasi'
      ],
      source: 'BPS - Kecamatan Kepanjen Dalam Angka'
    },
    {
      id: 'sinyal_jaringan',
      title: 'Kekuatan Sinyal Jaringan',
      mainValue: '4G / LTE Sangat Kuat',
      subValue: 'Jangkauan Sinyal Seluler Penuh',
      category: 'infrastruktur',
      badge: 'Potdes BPS',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Signal,
      iconColor: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-200 hover:border-emerald-400',
      highlights: [
        'Kekuatan sinyal: 4G/LTE Sangat Kuat',
        'Cakupan 100% di 5 RW dan 27 RT',
        'Mendukung layanan digital & IoT desa 24 jam'
      ],
      source: 'BPS - Statistik Potensi Desa (Potdes)'
    },
    {
      id: 'koperasi_sp',
      title: 'Jumlah Koperasi Simpan Pinjam',
      mainValue: '6 Koperasi',
      subValue: 'Lembaga Keuangan Mikro Desa',
      category: 'ekonomi',
      badge: 'Sarana Ekonomi BPS',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Landmark,
      iconColor: 'bg-amber-600 text-white',
      accentBorder: 'border-amber-200 hover:border-amber-400',
      highlights: [
        '6 unit Koperasi Simpan Pinjam aktif',
        'Mendukung pembiayaan UMKM & modal usaha warga',
        'Akses permodalan inklusif dan mudah dijangkau'
      ],
      source: 'BPS - Fasilitas Ekonomi & Perbankan'
    },
    {
      id: 'kelompok_pertokoan',
      title: 'Jumlah Kelompok Pertokoan',
      mainValue: '3 Sentra',
      subValue: 'Kluster Niaga & Toko Terpadu',
      category: 'ekonomi',
      badge: 'Sarana Niaga BPS',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Store,
      iconColor: 'bg-purple-600 text-white',
      accentBorder: 'border-purple-200 hover:border-purple-400',
      highlights: [
        '3 kelompok pertokoan di koridor jalan utama',
        'Menyediakan sembako, perbengkelan & jasa',
        'Pusat perdagangan masyarakat lokal'
      ],
      source: 'BPS - Fasilitas Perdagangan'
    },
    {
      id: 'pasar_permanen',
      title: 'Jumlah Pasar Bangunan Permanen',
      mainValue: '1 Pasar',
      subValue: 'Pasar Tradisional Konstruksi Permanen',
      category: 'ekonomi',
      badge: 'Fasilitas Pasar BPS',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: ShoppingBag,
      iconColor: 'bg-rose-600 text-white',
      accentBorder: 'border-rose-200 hover:border-rose-400',
      highlights: [
        '1 pasar dengan bangunan permanen',
        'Pusat distribusi komoditas pangan & hasil bumi',
        'Terhubung jaringan logistik kecamatan Kepanjen'
      ],
      source: 'BPS - Fasilitas Perdagangan & Distribusi'
    },
    {
      id: 'kondisi_jalan',
      title: 'Kondisi Jalan',
      mainValue: 'Aspal / Beton',
      subValue: 'Dapat Dilalui Sepanjang Tahun',
      category: 'infrastruktur',
      badge: 'Transportasi BPS',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Route,
      iconColor: 'bg-teal-600 text-white',
      accentBorder: 'border-teal-200 hover:border-teal-400',
      highlights: [
        'Jenis permukaan: Aspal & Beton',
        'Dapat dilalui kendaraan roda 4+ sepanjang tahun',
        'Aksesibilitas prima untuk logistik dan ambulans'
      ],
      source: 'BPS - Sarana Transportasi Darat'
    }
  ];

  // Additional Supporting Demographic Stats
  const demographicStats = [
    { label: 'Jumlah Penduduk (BPS 2025)', value: `${villageProfile.population.toLocaleString('id-ID')} Jiwa`, note: 'Laki-laki 4.188 / Perempuan 4.264' },
    { label: 'Luas Wilayah Administrasi', value: `${villageProfile.areaHa} Ha (${villageProfile.areaKm2} km²)`, note: 'RDTR Perkotaan Kepanjen' },
    { label: 'Kepadatan Penduduk', value: `~${villageProfile.densityPerKm2?.toLocaleString('id-ID') || '3.032'} Jiwa/km²`, note: 'Struktur permukiman padat teratur' },
    { label: 'Lahan Produktif Pertanian', value: `${villageProfile.landStats?.productive2022Ha || 72} Hektar`, note: 'Sawah irigasi teknis aktif' },
    { label: 'Kelompok Usia 50-64 Tahun', value: '1.675 Jiwa', note: 'Tenaga kerja matang & produktif' },
    { label: 'Kelompok Usia Lansia (65+ Thn)', value: `${villageProfile.ageCohorts?.age65Plus || 672} Jiwa`, note: 'Sasaran program posyandu lansia' },
    { label: 'Total Anggaran APBDes 2026', value: `Rp ${(villageProfile.apbdesTotal / 1000000000).toFixed(2)} Miliar`, note: 'Transparan dan terverifikasi' },
    { label: 'Indeks Aksesibilitas', value: 'Tinggi (100%)', note: 'Terhubung langsung poros Kepanjen-Malang' }
  ];

  // Filter cards
  const filteredCards = bpsCoreCards.filter(card => {
    const matchesCategory = activeCategory === 'all' || card.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.mainValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="profil-desa-page" className="space-y-8 pb-16">
      
      {/* Header Banner: Profil Statistik Desa Talangagung */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Profil Statistik Resmi
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Data Terverifikasi BPS Kabupaten Malang
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Profil Statistik Resmi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300">
              Desa Talangagung (Data BPS)
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Menampilkan ringkasan statistik resmi Desa Talangagung, Kecamatan Kepanjen, Kabupaten Malang 
            berdasarkan data publikasi resmi Badan Pusat Statistik (BPS) dan Potensi Desa (Potdes).
          </p>

          {/* Quick Action / TTS */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-dengarkan-profil-desa"
              onClick={handleToggleAudio}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md ${
                isPlayingAudio 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Hentikan Narasi Suara</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Ringkasan Statistik</span>
                </>
              )}
            </button>

            {onNavigateToTab && (
              <button
                id="btn-lihat-arsip-dokumen"
                onClick={() => onNavigateToTab('knowledge')}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Lihat Dokumen Arsip Desa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7 KARTU UTAMA DATA BPS (CARD GRID) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Indikator Resmi BPS Desa Talangagung
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tabel data statistik potensi wilayah, sarana ekonomi, konektivitas, dan fasilitas transportasi
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <button
              id="filter-all"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({bpsCoreCards.length})
            </button>
            <button
              id="filter-wilayah"
              onClick={() => setActiveCategory('wilayah')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'wilayah'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Wilayah (RW & RT)
            </button>
            <button
              id="filter-ekonomi"
              onClick={() => setActiveCategory('ekonomi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'ekonomi'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ekonomi & Pasar
            </button>
            <button
              id="filter-infrastruktur"
              onClick={() => setActiveCategory('infrastruktur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'infrastruktur'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Jaringan & Jalan
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-cari-profil-desa"
            type="text"
            placeholder="Cari data statistik (contoh: RW, RT, 4G, Koperasi, Pertokoan, Pasar, Jalan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button 
              id="btn-reset-pencarian-profil"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Reset
            </button>
          )}
        </div>

        {/* Grid 7 Kartu BPS */}
        <div id="bps-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                id={`card-bps-${card.id}`}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${card.accentBorder}`}
              >
                <div className="space-y-3">
                  {/* Header Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs shrink-0 ${card.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {card.title}
                        </h4>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Value Display */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {card.mainValue}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      {card.subValue}
                    </div>
                  </div>

                  {/* Highlights Points */}
                  <div className="space-y-1.5 pt-1">
                    {card.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer with Source Tag */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Sumber: <strong className="text-slate-700">{card.source}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED STATISTICAL METRICS (DEMOGRAFI & EKONOMI DESA) */}
      <div id="bps-matriks-komprehensif" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Matriks Demografi & Potensi Desa
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indikator kependudukan, luas wilayah, dan potensi Desa Talangagung terverifikasi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {demographicStats.map((stat, idx) => (
            <div 
              key={idx} 
              id={`stat-demografi-${idx}`}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 hover:bg-slate-100/80 transition-all"
            >
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {stat.label}
              </span>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GEOGRAFI & BATAS WILAYAH DESA */}
      <div id="geografi-batas-wilayah-section" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Geografi & Batas Wilayah
                </h3>
                <span className="text-xs text-slate-500">
                  Letak geografis, asal-usul toponimi nama desa, kompas 4 batas arah, dan sumber irigasi
                </span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-[11px] font-bold self-start sm:self-auto flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Sumber: <strong>Profil Desa Talangagung</strong>
          </span>
        </div>

        {/* Konteks Geografis & Toponimi */}
        <div className="p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 border border-blue-100 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h4 className="font-extrabold text-slate-900 text-sm">
                Letak Geografis & Asal-Usul Nama "Talangagung"
              </h4>
            </div>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('peta-desa')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all"
              >
                <CompassIcon className="w-3.5 h-3.5" />
                <span>Buka Peta Desa Interaktif</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Desa Talangagung berada di <strong>ujung barat Kecamatan Kepanjen</strong>, dibatasi oleh aliran <strong>Sungai Metro</strong> dengan sebuah <strong>talang (saluran air) besar</strong> yang melintas di atas sungai tersebut — diyakini menjadi asal-usul nama desa <em>"Talangagung"</em>.
          </p>
          <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Sumber Irigasi Utama Pertanian: <strong className="text-slate-900 font-bold">Aliran Sungai Molek</strong></span>
            </div>
            <span className="text-slate-500">Sumber: <strong className="text-slate-700">Profil Desa Talangagung</strong></span>
          </div>
        </div>

        {/* Kompas / Batas Wilayah 4 Arah */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5 text-slate-700">
              <CompassIcon className="w-4 h-4 text-indigo-600" />
              Batas Wilayah Administratif (4 Arah Mata Angin)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Batas Utara */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 rounded-2xl space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  Utara
                </span>
                <span className="text-xs font-bold text-slate-400">↑ 0°</span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                Ngasem – Palaan
              </div>
              <p className="text-[11px] text-slate-500">
                Batas wilayah sisi utara berbatasan langsung dengan kawasan Ngasem dan Palaan.
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-400">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>

            {/* Batas Timur */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-blue-400 rounded-2xl space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  Timur
                </span>
                <span className="text-xs font-bold text-slate-400">→ 90°</span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                Kepanjen – Cepokomulyo
              </div>
              <p className="text-[11px] text-slate-500">
                Batas wilayah sisi timur berbatasan dengan pusat kota Kepanjen dan Cepokomulyo.
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-400">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>

            {/* Batas Selatan */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  Selatan
                </span>
                <span className="text-xs font-bold text-slate-400">↓ 180°</span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                Desa Panggungrejo
              </div>
              <p className="text-[11px] text-slate-500">
                Batas wilayah sisi selatan berbatasan langsung dengan wilayah Desa Panggungrejo.
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-400">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>

            {/* Batas Barat */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  Barat
                </span>
                <span className="text-xs font-bold text-slate-400">← 270°</span>
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                Desa Jatikerto
              </div>
              <p className="text-[11px] text-slate-500">
                Batas wilayah sisi barat berbatasan langsung dengan kawasan Desa Jatikerto (Kromengan).
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-400">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Fasilitas Tambahan Wilayah (Kartu Baru, Terpisah dari Data BPS) */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5 text-slate-700">
              <Building2 className="w-4 h-4 text-blue-600" />
              Fasilitas Tambahan & Kawasan Permukiman
            </h4>
            <span className="text-[11px] text-slate-500">
              Sumber: <strong className="text-slate-700">Profil Desa Talangagung</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fasilitas Transportasi: Terminal Talangagung & Trans Jatim */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Terminal Talangagung</h5>
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Origin Trans Jatim Koridor 2</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lahan 30.021 m² menjadi titik awal rute Trans Jatim Koridor 2 (Talangagung–Hamid Rusdi–Arjosari). Target operasi <strong>Oktober 2026</strong> dengan 15 bus (14 operasional, 1 cadangan).
              </p>
              <div className="pt-2 border-t border-indigo-200/60 text-[10px] text-slate-500">
                Sumber: <strong>JatimTimes, 14 Juni 2026</strong>
              </div>
            </div>

            {/* Fasilitas Pendidikan: SD Negeri */}
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2 Unit SD Negeri</h5>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Fasilitas Pendidikan Dasar</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tersedia 2 unit Sekolah Dasar Negeri (SDN) untuk menunjang pemerataan pendidikan dasar bagi anak-anak usia sekolah di lingkungan desa.
              </p>
              <div className="pt-2 border-t border-blue-200/60 text-[10px] text-slate-500">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>

            {/* Fasilitas Energi & Bahan Bakar: 2 SPBU */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Fuel className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">2 Unit SPBU</h5>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Pengisian Bahan Bakar</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Terdapat 2 titik SPBU strategis: berlokasi di <strong>sebelah barat Jembatan Metro</strong> dan di <strong>sebelah barat alun-alun desa</strong>.
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-[10px] text-slate-500">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>

            {/* Kawasan Perumahan / Permukiman */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">3 Kompleks Perumahan</h5>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Kawasan Hunian Modern</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meliputi kompleks <strong>Kepanjen Permai I</strong>, <strong>Kepanjen Permai II</strong>, dan <strong>Metro Kencana</strong> yang tertata rapi.
              </p>
              <div className="pt-2 border-t border-emerald-200/60 text-[10px] text-slate-500">
                Sumber: <strong>Profil Desa Talangagung</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FASILITAS DAN DAYA DUKUNG WILAYAH DESA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom 1: Sarana Ekonomi & Koperasi */}
        <div id="card-ketahanan-ekonomi" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-amber-700">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4 text-amber-700" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Ketahanan Ekonomi Warga
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Keberadaan <strong>6 Koperasi Simpan Pinjam</strong> dan <strong>1 Pasar Permanen</strong> di Talangagung 
            menjadikan desa sebagai pusat perputaran ekonomi mikro. Ditunjang <strong>3 Kelompok Pertokoan</strong> yang 
            melayani kebutuhan pokok warga dari 5 RW.
          </p>
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-amber-900">
              <span>Koperasi Simpan Pinjam</span>
              <span>6 Unit</span>
            </div>
            <div className="flex justify-between font-bold text-amber-900">
              <span>Kelompok Pertokoan</span>
              <span>3 Sentra</span>
            </div>
            <div className="flex justify-between font-bold text-amber-900">
              <span>Pasar Bangunan Permanen</span>
              <span>1 Pasar</span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Jaringan Telekomunikasi & IoT */}
        <div id="card-infrastruktur-digital" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-700">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Infrastruktur Digital 4G/LTE
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kekuatan sinyal <strong>4G/LTE Sangat Kuat</strong> di seluruh 27 RT memungkinkan kelancaran akses 
            layanan persuratan mandiri warga via WhatsApp, monitoring telemetri sensor sungai, serta integrasi sistem desa.
          </p>
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-emerald-900">
              <span>Kekuatan Sinyal Seluler</span>
              <span className="text-emerald-700">4G/LTE Sangat Kuat</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-900">
              <span>Jangkauan Wilayah</span>
              <span>100% (27 RT / 5 RW)</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-900">
              <span>Akses Sensor IoT</span>
              <span>Online 24 Jam</span>
            </div>
          </div>
        </div>

        {/* Kolom 3: Akses Jalan & Mobilitas */}
        <div id="card-akses-transportasi" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-blue-700">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4 text-blue-700" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Akses Transportasi & Trans Jatim
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Koridor jalan utama desa bertipe <strong>Aspal & Beton</strong> dan dapat dilalui sepanjang tahun. Menjadi hub transit utama Malang Selatan berkat <strong>Terminal Talangagung</strong> sebagai titik awal bus Trans Jatim Koridor 2.
          </p>
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-blue-900">
              <span>Simpul Bus Trans Jatim</span>
              <span className="text-blue-700">Origin Koridor 2 (Okt 2026)</span>
            </div>
            <div className="flex justify-between font-bold text-blue-900">
              <span>Rute Utama</span>
              <span>Talangagung → Hamid Rusdi → Arjosari</span>
            </div>
            <div className="flex justify-between font-bold text-blue-900">
              <span>Armada Bus</span>
              <span>15 Unit (14 Jalan, 1 Cadangan)</span>
            </div>
            <div className="flex justify-between font-bold text-blue-900">
              <span>Jenis Permukaan Jalan</span>
              <span>Aspal & Beton (Lancar Roda 4+)</span>
            </div>
          </div>
        </div>

      </div>

      {/* BUDAYA & KEGIATAN MASYARAKAT (BAGIAN BARU TERVERIFIKASI) */}
      <div id="budaya-kegiatan-masyarakat-section" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Budaya & Kegiatan Masyarakat
                </h3>
                <span className="text-xs text-slate-500">
                  Agenda kebudayaan, pagelaran tradisi, partisipasi warga lintas RT/RW, dan penguatan nilai kebangsaan
                </span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-[11px] font-bold self-start sm:self-auto flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-rose-600" />
            Dokumentasi Kegiatan Warga
          </span>
        </div>

        {/* Kartu Highlight Utama: Karnaval Desa Talangagung */}
        <div className="bg-gradient-to-br from-rose-50/70 via-amber-50/40 to-slate-50 border-2 border-rose-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          
          {/* Header Karnaval dengan Badges */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Flag className="w-3.5 h-3.5" />
                  Peringatan HUT RI ke-80
                </span>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-full text-xs flex items-center gap-1.5 shadow-xs">
                  <Users className="w-3.5 h-3.5" />
                  31 Kontingen
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Ribuan Peserta
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Minggu, 31 Agustus 2025
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                Karnaval Desa Talangagung
              </h4>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Peringatan akbar Hari Ulang Tahun Kemerdekaan Republik Indonesia (HUT RI ke-80) yang diselenggarakan pada <strong>Minggu, 31 Agustus 2025</strong>. Kegiatan ini diikuti secara antusias oleh <strong>ribuan warga dari 31 kontingen/kelompok</strong> yang mewakili seluruh rukun tetangga, rukun warga, sanggar seni, dan kelembagaan se-Desa Talangagung.
              </p>
            </div>

            {/* Stat Box Cepat */}
            <div className="bg-white/90 backdrop-blur-xs border border-rose-200 rounded-2xl p-4 lg:w-72 shrink-0 space-y-2.5 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Partisipasi Komunitas
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-rose-50/80 rounded-xl border border-rose-100 text-center">
                  <div className="text-lg sm:text-xl font-black text-rose-700">31</div>
                  <div className="text-[10px] font-bold text-slate-600">Kontingen Desa</div>
                </div>
                <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-100 text-center">
                  <div className="text-lg sm:text-xl font-black text-amber-700">100%</div>
                  <div className="text-[10px] font-bold text-slate-600">Antusiasme Warga</div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Pelaksanaan: <strong>31 Agustus 2025</strong></span>
              </div>
            </div>
          </div>

          {/* Nilai Strategis & Tujuan Kegiatan */}
          <div className="p-4 bg-white/80 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs sm:text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Tujuan & Visi Pelestarian Budaya</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Karnaval ini menjadi wadah <strong>pelestarian budaya sebagai identitas bangsa</strong> sekaligus <strong>mendorong generasi muda menjaga warisan budaya Indonesia</strong> melalui kreasi seni pertunjukan, kostum adat nusantara, dan orkestrasional kearifan lokal.
            </p>
          </div>

          {/* Kriteria Penilaian Juri (Bobot & Progress Bar) */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600" />
                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                  Kriteria Penilaian Juri Karnaval
                </h5>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Total Bobot Penilaian: 100%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Kriteria 1: Kreativitas (50%) */}
              <div className="p-4 bg-white border-2 border-amber-200 rounded-2xl space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">Kreativitas</span>
                      <span className="text-[10px] text-slate-500 font-medium">Kunci Utama Penilaian Juri</span>
                    </div>
                  </div>
                  <span className="text-base font-black text-amber-600">50%</span>
                </div>
                
                {/* Progress Bar 50% */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: '50%' }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Inovasi koreografi, keunikan kostum tematik, atraksi orisinal, serta aransemen musik pengiring karnaval.
                </p>
              </div>

              {/* Kriteria 2: Kesesuaian Tema (30%) */}
              <div className="p-4 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl space-y-2.5 shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Flag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">Kesesuaian Tema</span>
                      <span className="text-[10px] text-slate-500 font-medium">HUT RI ke-80 & Kebangsaan</span>
                    </div>
                  </div>
                  <span className="text-base font-black text-blue-600">30%</span>
                </div>
                
                {/* Progress Bar 30% */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: '30%' }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Penyelarasan pesan penampilan dengan semangat kemerdekaan, persatuan nusantara, dan nilai perjuangan.
                </p>
              </div>

              {/* Kriteria 3: Kerapian (10%) */}
              <div className="p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl space-y-2.5 shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">Kerapian</span>
                      <span className="text-[10px] text-slate-500 font-medium">Kekompakan & Formasi Barisan</span>
                    </div>
                  </div>
                  <span className="text-base font-black text-emerald-600">10%</span>
                </div>
                
                {/* Progress Bar 10% */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: '10%' }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Keteraturan formasi kontingen, kerapian seragam/busana peserta, dan sinkronisasi gerak sepanjang rute.
                </p>
              </div>

              {/* Kriteria 4: Sportivitas & Hormat pada Acara (10%) */}
              <div className="p-4 bg-white border border-slate-200 hover:border-purple-300 rounded-2xl space-y-2.5 shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">Sportivitas / Hormat</span>
                      <span className="text-[10px] text-slate-500 font-medium">Etika & Ketertiban Karnaval</span>
                    </div>
                  </div>
                  <span className="text-base font-black text-purple-600">10%</span>
                </div>
                
                {/* Progress Bar 10% */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: '10%' }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kedisiplinan waktu pemberangkatan, sikap hormat di panggung kehormatan, dan kepatuhan pada tata tertib acara.
                </p>
              </div>

            </div>
          </div>

          {/* Footer Sumber Validasi */}
          <div className="pt-4 border-t border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Sumber: <strong className="text-slate-800 font-bold">SudutKota.id - Juri Karnaval Desa Talangagung Kepanjen Malang: Kreativitas Jadi Kunci Penilaian</strong>
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md self-start sm:self-auto">
              Dokumentasi Resmi 2025
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
