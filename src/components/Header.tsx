import React, { useState } from 'react';
import { 
  Box, 
  Search, 
  FolderGit2, 
  Boxes, 
  Bot, 
  History as HistoryIcon, 
  GraduationCap, 
  Mic, 
  HelpCircle, 
  Volume2, 
  X, 
  Sparkles, 
  AlertOctagon, 
  Users, 
  ChevronDown, 
  Wrench, 
  Radio, 
  Briefcase, 
  Store, 
  MessageCircle, 
  Eye, 
  Info, 
  ArrowRight, 
  BarChart3, 
  Compass,
  Menu,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { VillageProfile, UserContext, UserRoleType } from '../types';
import { setupSpeechRecognition, speakText, stopSpeech } from '../utils/speech';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  villageProfile: VillageProfile;
  userContext: UserContext;
  onChangeUserContext: (ctx: UserContext) => void;
  onOpenSos: () => void;
  onOpenJudgeGuide: () => void;
  teachingMode: boolean;
  setTeachingMode: (mode: boolean) => void;
  onGlobalSearch: (query: string) => void;
  fontSizeMode: 'normal' | 'large' | 'extralarge';
  setFontSizeMode: (size: 'normal' | 'large' | 'extralarge') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  villageProfile,
  userContext,
  onChangeUserContext,
  onOpenSos,
  onOpenJudgeGuide,
  teachingMode,
  setTeachingMode,
  onGlobalSearch,
  fontSizeMode,
  setFontSizeMode
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showTechnicalInfo, setShowTechnicalInfo] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableRoles: { id: string; citizenId?: string; role: UserRoleType; name: string; rt: string; rw: string; dusun: string; label: string; icon: string; desc: string }[] = [
    { id: 'WARGA-001', citizenId: 'WARGA-001', role: 'warga', name: 'Pak Budi Santoso', rt: 'RT 02', rw: 'RW 01', dusun: 'Dusun 1 (Krajan)', label: 'Warga (RT 02)', icon: '👨‍🌾', desc: 'Layanan surat mandiri & aduan warga' },
    { id: 'RT-001', citizenId: 'RT-001', role: 'rt', name: 'Pak RT Ahmad Fauzi', rt: 'RT 02', rw: 'RW 01', dusun: 'Dusun 1 (Krajan)', label: 'RT / RW (Ketua RT 02)', icon: '📋', desc: 'Verifikasi & Stempel QR surat, cek aduan' },
    { id: 'PERANGKAT-001', citizenId: 'PERANGKAT-001', role: 'perangkat', name: 'Ibu Siti Rahma, S.AP', rt: 'RT 01', rw: 'RW 01', dusun: 'Dusun 1 (Krajan)', label: 'Perangkat Desa (Kasi/Kaur)', icon: '📑', desc: 'Administrasi desa, inventaris aset, bansos' },
    { id: 'KADES-001', citizenId: 'KADES-001', role: 'kades', name: villageProfile.kadesName, rt: 'RT 01', rw: 'RW 01', dusun: 'Dusun 1 (Krajan)', label: 'Kepala Desa (Mata Elang)', icon: '🏛️', desc: 'Dashboard Mata Elang, APBDes, DSS AI' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onGlobalSearch(searchInput);
      setActiveTab('assistant');
      setMobileMenuOpen(false);
    }
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    speakText('Silakan bicara, sebutkan nama surat, jalan, atau info desa yang dicari...');

    const recognizer = setupSpeechRecognition(
      (transcript) => {
        setSearchInput(transcript);
        setIsListening(false);
        speakText(`Mencari ${transcript}...`);
        onGlobalSearch(transcript);
        setMobileMenuOpen(false);
        
        // Smart tab routing based on voice keywords
        const lower = transcript.toLowerCase();
        if (lower.includes('surat') || lower.includes('ktp') || lower.includes('kk') || lower.includes('lapor') || lower.includes('rt') || lower.includes('rw')) {
          setActiveTab('rtwarga');
        } else if (lower.includes('profil') || lower.includes('bps') || lower.includes('statistik') || lower.includes('koperasi') || lower.includes('pasar') || lower.includes('penduduk')) {
          setActiveTab('profil-desa');
        } else if (lower.includes('posyandu') || lower.includes('gizi') || lower.includes('anggaran') || lower.includes('apbdes')) {
          setActiveTab('dashboard');
        } else if (lower.includes('jalan') || lower.includes('aset') || lower.includes('jembatan') || lower.includes('lampu')) {
          setActiveTab('assets');
        } else if (lower.includes('peta') || lower.includes('denah') || lower.includes('spbu') || lower.includes('sekolah') || lower.includes('sd') || lower.includes('bencana') || lower.includes('rawan') || lower.includes('sungai')) {
          setActiveTab('peta-desa');
        } else if (lower.includes('lowongan') || lower.includes('kerja') || lower.includes('magang')) {
          setActiveTab('jobs');
        } else if (lower.includes('bumdes') || lower.includes('produk') || lower.includes('beli') || lower.includes('toko')) {
          setActiveTab('bumdes');
        } else {
          setActiveTab('assistant');
        }
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );

    if (recognizer.isSupported) {
      setIsListening(true);
      recognizer.start();
    } else {
      alert("Browser Anda belum mendukung input suara. Silakan ketik di kolom pencarian.");
    }
  };

  const handleReadGuideAloud = () => {
    speakText(
      `Selamat datang di Desa Black Box AI untuk ${villageProfile.name}. ` +
      `Sistem ini bekerja terintegrasi dari tingkat Warga, RT, RW, sampai Pemerintah Desa. ` +
      `Gunakan menu Layanan RT & Warga untuk mengajukan surat pengantar atau melapor jalan rusak. ` +
      `Tekan tombol merah SOS jika membutuhkan bantuan darurat desa 24 jam. Terima kasih.`
    );
  };

  const adminNavItems = [
    { id: 'dashboard', label: 'Beranda Desa', icon: Box, badge: null, desc: 'Pusat Kerja Harian' },
    { id: 'rtwarga', label: 'Layanan RT & Warga', icon: Users, badge: 'Surat & Laporan', desc: 'Pelayanan Administrasi Warga' },
    { id: 'assistant', label: 'Bot Telegram Desa', icon: Bot, badge: '@desablackboxai_bot', desc: 'Bot Telegram & Asisten AI' },
    { id: 'dss', label: 'Mata Elang Desa', icon: Eye, badge: 'Keputusan Kades', desc: 'Prioritas & Keputusan Kades' },
    { id: 'peta-desa', label: 'Peta Interaktif', icon: Compass, badge: '5 RW / 27 RT', desc: 'Sebaran RT, SD, SPBU & Bencana' },
    { id: 'profil-desa', label: 'Profil Desa', icon: BarChart3, badge: 'Data BPS', desc: 'Statistik Resmi BPS Desa' },
    { id: 'knowledge', label: '1. Dokumen Arsip', icon: FolderGit2, badge: 'Arsip Desa', desc: 'Black Box: Arsip & Riwayat Desa' },
    { id: 'assets', label: '2. Fasilitas & Aset', icon: Boxes, badge: 'Kondisi Lapangan', desc: 'Jalan, Jembatan & Fasilitas RT' },
    { id: 'history', label: '4. Cerita Sejarah', icon: HistoryIcon, badge: 'Linimasa', desc: 'Jejak & Sejarah Pembangunan' },
    { id: 'preventive', label: 'Perawatan Mesin', icon: Wrench, badge: 'Jadwal Servis', desc: 'Perawatan Berkala Alat Desa' },
    { id: 'iot', label: 'Simulasi Sensor IoT', icon: Radio, badge: 'Simulasi Pompa', desc: 'Simulasi Telemetri Sensor' },
    { id: 'jobs', label: 'Bursa Kerja & Magang', icon: Briefcase, badge: 'Lowongan Mitra', desc: 'Info Kerja & Magang SMK' },
    { id: 'bumdes', label: 'Toko Digital BUMDes', icon: Store, badge: 'Produk Warga', desc: 'Katalog Usaha & UMKM' },
    { id: 'memori-objek', label: 'Riwayat Lokasi TPA', icon: HistoryIcon, badge: 'Catatan Lapangan', desc: '7 Riwayat & Kondisi TPA' },
    { id: 'memori-tpa', label: 'Catatan Audit TPA', icon: HistoryIcon, badge: 'Riwayat 2020-2025', desc: 'Riwayat Kasus Lapangan' },
    { id: 'tefa', label: 'Praktik Siswa SMK', icon: GraduationCap, badge: 'Lab Digital', desc: 'Praktik Digital Siswa' },
    { id: 'about', label: 'Tentang Sistem', icon: Info, badge: 'Riset AI', desc: '3 Pilar Arsitektur Riset' },
  ];

  // Simplified navigation for Warga: strictly non-technical & minimal
  const wargaNavItems = [
    { id: 'dashboard', label: 'Menu Layanan Utama', icon: Box, badge: '9 Layanan', desc: 'Pilihan Layanan' },
    { id: 'peta-desa', label: 'Peta Desa Interaktif', icon: Compass, badge: 'RT, Fasum & Bencana', desc: 'Denah Wilayah & SD/SPBU' },
    { id: 'rtwarga', label: 'Ajukan Surat & Lapor', icon: Users, badge: 'Surat & Aduan', desc: 'Pelayanan RT 02' },
    { id: 'assistant', label: 'Bot Telegram Desa', icon: Bot, badge: '@desablackboxai_bot', desc: 'Asisten Warga di Telegram' },
    { id: 'assets', label: 'Peta & Fasilitas Desa', icon: Boxes, badge: null, desc: 'Fasilitas Lingkungan' },
    { id: 'profil-desa', label: 'Profil Desa', icon: BarChart3, badge: null, desc: 'Informasi Desa' },
    { id: 'bumdes', label: 'Toko Desa (BUMDes)', icon: Store, badge: 'Produk Warga', desc: 'Belanja Produk' },
  ];

  // Tailored navigation for RT / RW: Focused on verification, citizens, territory, and proposals
  const rtNavItems = [
    { id: 'dashboard', label: 'Beranda RT', icon: Box, badge: '3 Tugas', desc: 'Pusat Kerja Harian' },
    { id: 'rtwarga', label: 'Layanan RT & Warga', icon: Users, badge: 'Verifikasi & TTD', desc: 'Kelola Surat & Aduan Warga' },
    { id: 'assistant', label: 'Bot Telegram Desa', icon: Bot, badge: '24 Jam', desc: 'Asisten Resmi Desa di Telegram' },
    { id: 'peta-desa', label: 'Peta Wilayah RT', icon: Compass, badge: '27 RT / 5 RW', desc: 'Wilayah RT & Titik Rawan' },
    { id: 'dss', label: 'Usulan Musrenbang', icon: Eye, badge: 'Prioritas RT', desc: 'Usulan Pra-Musrenbang RT' },
    { id: 'profil-desa', label: 'Profil Desa', icon: BarChart3, badge: 'Data BPS', desc: 'Statistik Penduduk & RT' },
    { id: 'assets', label: 'Fasilitas & Sarana RT', icon: Boxes, badge: null, desc: 'Jalan, PJU & Pos Ronda' },
    { id: 'bumdes', label: 'Toko BUMDes', icon: Store, badge: 'Produk Warga', desc: 'Produk & Usaha Desa' },
    { id: 'knowledge', label: 'Arsip & Dokumen', icon: FolderGit2, badge: null, desc: 'Regulasi & Panduan Desa' },
  ];

  const navItems = 
    userContext.role === 'warga' 
      ? wargaNavItems 
      : (userContext.role === 'rt' || userContext.role === 'rw')
      ? rtNavItems
      : adminNavItems;

  const currentRoleInfo = availableRoles.find(r => r.role === userContext.role) || availableRoles[0];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
      {/* Top Bar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 md:py-2 border-b border-slate-800/80">
        
        {/* ======================================================== */}
        {/* MOBILE VIEW (< md): STRICT 2-ROW MAXIMUM COMPACT HEADER */}
        {/* ======================================================== */}
        <div className="md:hidden space-y-1.5">
          {/* Row 1: Brand & Logo + Quick SOS + Hamburger Toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <button 
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                title="Kembali ke Beranda Desa"
              >
                <Box className="w-4 h-4 text-white" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-white font-black text-xs leading-none truncate">
                    DESA BLACK BOX AI
                  </h1>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                    Desa Cerdas
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] truncate leading-tight mt-0.5">
                  {villageProfile.name}
                </p>
              </div>
            </div>

            {/* Right Controls: Quick Mini SOS + Hamburger Button */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={onOpenSos}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] rounded-lg shadow-xs flex items-center space-x-1 active:scale-95 animate-pulse"
                title="Darurat SOS"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-white" />
                <span>SOS</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 rounded-lg border transition-all ${
                  mobileMenuOpen 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-xs' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Menu Pengaturan & Fitur Tambahan"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Row 2: Role Switcher Pill + Compact Voice Search Bar */}
          <div className="flex items-center gap-1.5">
            {/* Quick Role Switcher Trigger on Mobile */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-[11px] font-bold shadow-xs transition-all active:scale-95"
                title="Ganti Peran"
              >
                <span>{currentRoleInfo.icon}</span>
                <span className="max-w-[70px] truncate">{currentRoleInfo.label.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Mobile Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute left-0 mt-1.5 w-72 bg-[#0F172A] border-2 border-slate-700 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                    <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                      Mode Simulasi Pengguna — Khusus Demonstrasi
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">
                      Pergantian peran ini hanya untuk demonstrasi prototipe dan bukan autentikasi produksi.
                    </p>
                  </div>
                  {availableRoles.map((r) => {
                    const isSelected = userContext.role === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          onChangeUserContext({
                            id: r.id,
                            citizenId: r.citizenId,
                            role: r.role,
                            name: r.name,
                            rt: r.rt,
                            rw: r.rw,
                            dusun: r.dusun,
                            phone: r.role === 'warga' ? '0812-3456-7890' : r.role === 'rt' ? '0813-2222-3333' : r.role === 'perangkat' ? '0812-8888-9999' : '0811-6666-7777'
                          });
                          setShowRoleDropdown(false);
                          speakText(`Beralih ke mode ${r.label}.`);
                        }}
                        className={`w-full text-left p-1.5 my-0.5 rounded-lg text-xs flex items-center space-x-2 transition-all ${
                          isSelected ? 'bg-blue-900/60 border border-blue-500 font-bold text-white' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white truncate">{r.label}</p>
                          <p className="text-[9px] text-slate-400 truncate">{r.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Compact Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={isListening ? "Mendengarkan..." : "Cari surat, jalan, RT..."}
                className={`w-full text-[11px] text-slate-100 placeholder-slate-400 pl-6 pr-7 py-1 rounded-lg border transition-all ${
                  isListening 
                    ? 'bg-rose-950 border-rose-500 text-white placeholder-rose-200' 
                    : 'bg-[#1E293B] border-slate-700 focus:outline-none focus:border-blue-500'
                }`}
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
              
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Bicara untuk mencari"
                className={`absolute right-1 top-0.5 p-1 rounded-md ${
                  isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-blue-400'
                }`}
              >
                <Mic className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP VIEW (>= md): COMPACT SINGLE-ROW STREAMLINED HEADER */}
        {/* ======================================================== */}
        <div className="hidden md:flex md:items-center md:justify-between gap-3 min-h-[44px]">
          
          {/* Brand & Village Identity (Left) */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all group cursor-pointer"
              title="Kembali ke Beranda Desa"
            >
              <Box className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-white font-black text-sm leading-none tracking-tight whitespace-nowrap">
                  DESA BLACK BOX AI
                </h1>
                <span className="hidden xl:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Desa Cerdas
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-medium truncate leading-tight mt-0.5">
                {villageProfile.name} • Kec. {villageProfile.subdistrict}
              </p>
            </div>
          </div>

          {/* Compact Voice-Enabled Global Search (Center) */}
          <form onSubmit={handleSearchSubmit} className="relative w-44 md:w-52 lg:w-64 min-w-0 shrink-0">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={isListening ? "Mendengarkan..." : "Cari surat, jalan, RT..."}
              className={`w-full text-xs text-slate-100 placeholder-slate-400 pl-7 pr-7 py-1.5 rounded-xl border transition-all ${
                isListening 
                  ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-400/50 text-white placeholder-rose-200' 
                  : 'bg-slate-900/90 border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            
            <button
              type="button"
              onClick={handleVoiceSearch}
              title={isListening ? "Klik untuk menghentikan" : "Bicara untuk mencari (Input Suara)"}
              className={`absolute right-1.5 top-1 p-1 rounded-md transition-all ${
                isListening 
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300' 
                  : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'
              }`}
            >
              <Mic className="w-3 h-3" />
            </button>
          </form>

          {/* Desktop Core Essential Actions (Right: Strictly Single Row) */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* 1. Panduan Juri (Sleek Compact Pill) */}
            <button
              onClick={() => {
                setShowRoleDropdown(false);
                setShowToolsDropdown(false);
                onOpenJudgeGuide();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs border border-purple-400/40 transition-all hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer"
              title="Buka Panduan Riset & Skenario Pengujian untuk Dewan Juri"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap font-extrabold text-[11px] lg:text-xs">Panduan Juri</span>
            </button>

            {/* 2. Tombol Darurat SOS Desa */}
            <button
              onClick={() => {
                setShowRoleDropdown(false);
                setShowToolsDropdown(false);
                onOpenSos();
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all active:scale-95 animate-pulse shrink-0 cursor-pointer"
              title="Tombol Darurat SOS Desa (Ambulans 24 Jam, Linmas, Tanggap Bencana)"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px] lg:text-xs">SOS DARURAT</span>
            </button>

            {/* 3. Role Switcher Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowToolsDropdown(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border shrink-0 cursor-pointer ${
                  userContext.role === 'warga'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/50'
                    : userContext.role === 'rt'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400/50'
                    : userContext.role === 'perangkat'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/50'
                    : userContext.role === 'rw'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50'
                }`}
                title="Ganti Peran: Warga, RT/RW, Perangkat, atau Kepala Desa"
              >
                <span className="text-sm">{currentRoleInfo.icon}</span>
                <span className="font-extrabold text-[11px] lg:text-xs whitespace-nowrap">
                  {userContext.role === 'warga' ? `Warga (${userContext.rt})` :
                   userContext.role === 'rt' ? `Ketua ${userContext.rt}` :
                   userContext.role === 'perangkat' ? 'Perangkat Desa' :
                   userContext.role === 'rw' ? `Ketua ${userContext.rw}` : 'Kepala Desa'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0F172A] border-2 border-slate-700 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-2 border-b border-slate-800 pb-2 mb-2">
                    <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                      Mode Simulasi Pengguna — Khusus Demonstrasi
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      Pergantian peran ini hanya untuk demonstrasi prototipe dan bukan autentikasi produksi.
                    </p>
                  </div>
                  {availableRoles.map((r) => {
                    const isSelected = userContext.role === r.role;
                    const roleTheme = 
                      r.role === 'warga' ? 'border-blue-500 bg-blue-950/80 text-blue-200' :
                      r.role === 'rt' ? 'border-amber-500 bg-amber-950/80 text-amber-200' :
                      r.role === 'perangkat' ? 'border-indigo-500 bg-indigo-950/80 text-indigo-200' :
                      r.role === 'rw' ? 'border-purple-500 bg-purple-950/80 text-purple-200' :
                      'border-emerald-500 bg-emerald-950/80 text-emerald-200';

                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          onChangeUserContext({
                            id: r.id,
                            citizenId: r.citizenId,
                            role: r.role,
                            name: r.name,
                            rt: r.rt,
                            rw: r.rw,
                            dusun: r.dusun,
                            phone: r.role === 'warga' ? '0812-3456-7890' : r.role === 'rt' ? '0813-2222-3333' : r.role === 'perangkat' ? '0812-8888-9999' : '0811-6666-7777'
                          });
                          setShowRoleDropdown(false);
                          speakText(`Beralih ke mode ${r.label}. Menampilkan meja kerja khusus.`);
                        }}
                        className={`w-full text-left p-2.5 my-1 rounded-xl text-xs flex items-center space-x-3 transition-all border ${
                          isSelected
                            ? `${roleTheme} font-bold shadow-md ring-1 ring-white/20`
                            : 'border-transparent text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="text-xl p-1.5 bg-slate-800/80 rounded-xl">{r.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-extrabold text-white text-xs">{r.label}</p>
                            {isSelected && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-emerald-950 font-black">
                                AKTIF
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 truncate">{r.name}</p>
                          <p className="text-[10px] text-slate-400 italic">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Menu Alat, Aksesibilitas & Bantuan (Tools Popover) */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setShowToolsDropdown(!showToolsDropdown);
                  setShowRoleDropdown(false);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
                  showToolsDropdown || showTechnicalInfo || fontSizeMode !== 'normal' || teachingMode
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                }`}
                title="Pengaturan Tampilan, Ukuran Tulisan & Bantuan"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[11px] lg:text-xs">Opsi</span>
                {(showTechnicalInfo || fontSizeMode !== 'normal' || teachingMode) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Tools & Accessibility Dropdown */}
              {showToolsDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border-2 border-slate-700 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  
                  {/* Section A: Ukuran Huruf (Aksesibilitas) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                      <span>Ukuran Tulisan:</span>
                      <span className="text-[10px] text-blue-400">
                        {fontSizeMode === 'normal' ? 'Normal' : fontSizeMode === 'large' ? 'Besar (+18%)' : 'Lansia (+35%)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          setFontSizeMode('normal');
                          speakText('Ukuran huruf standar.');
                        }}
                        className={`py-1 rounded-lg font-bold text-xs transition-all ${
                          fontSizeMode === 'normal'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        A Standar
                      </button>
                      <button
                        onClick={() => {
                          setFontSizeMode('large');
                          speakText('Ukuran huruf diperbesar.');
                        }}
                        className={`py-1 rounded-lg font-bold text-xs transition-all ${
                          fontSizeMode === 'large'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        A+ Besar
                      </button>
                      <button
                        onClick={() => {
                          setFontSizeMode('extralarge');
                          speakText('Ukuran huruf sangat besar.');
                        }}
                        className={`py-1 rounded-lg font-bold text-xs transition-all ${
                          fontSizeMode === 'extralarge'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        A++ Lansia
                      </button>
                    </div>
                  </div>

                  {/* Section B: Bantuan & Panduan */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                      Panduan & Suara
                    </span>
                    <button
                      onClick={() => {
                        setShowToolsDropdown(false);
                        setShowHelpModal(true);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 border border-slate-800/80 transition-all text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Petunjuk Mudah Desa</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    <button
                      onClick={() => {
                        handleReadGuideAloud();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 border border-slate-800/80 transition-all text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-semibold">Dengarkan Suara Panduan</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Audio
                      </span>
                    </button>
                  </div>

                  {/* Section C: Fitur Riset & SMK */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                      Pengaturan Khusus
                    </span>

                    {/* Toggle Info Teknis Riset */}
                    <button
                      onClick={() => {
                        const next = !showTechnicalInfo;
                        setShowTechnicalInfo(next);
                        speakText(next ? 'Menampilkan bar arsitektur riset teknis.' : 'Info teknis riset disembunyikan.');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all border ${
                        showTechnicalInfo
                          ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                          : 'text-slate-300 hover:bg-slate-800 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold">Bar Info Riset AI</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        showTechnicalInfo ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {showTechnicalInfo ? 'AKTIF' : 'OFF'}
                      </span>
                    </button>

                    {/* Toggle Mode SMK (if non-warga) */}
                    {userContext.role !== 'warga' && (
                      <button
                        onClick={() => {
                          setTeachingMode(!teachingMode);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all border ${
                          teachingMode
                            ? 'bg-blue-600/20 text-blue-200 border-blue-500/40'
                            : 'text-slate-300 hover:bg-slate-800 border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="font-semibold">Mode Praktik SMK</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          teachingMode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {teachingMode ? 'AKTIF' : 'OFF'}
                        </span>
                      </button>
                    )}

                    {/* Telegram Bot Quick Nav */}
                    <button
                      onClick={() => {
                        setShowToolsDropdown(false);
                        setActiveTab('assistant');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 border border-slate-800/80 transition-all text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="font-semibold">Bot Telegram Desa</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                        @desablackboxai_bot
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Outside Click Dismissal Backdrop */}
            {(showRoleDropdown || showToolsDropdown) && (
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => {
                  setShowRoleDropdown(false);
                  setShowToolsDropdown(false);
                }} 
              />
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE EXPANDED DRAWER / HAMBURGER DROPDOWN PANEL */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-800">
            <span>FITUR CEPAT & PENGATURAN:</span>
            <span className="text-blue-400">Mobile Menu</span>
          </div>

          {/* Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Panduan Juri Button */}
            <button
              onClick={() => {
                onOpenJudgeGuide();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-xs border border-amber-300/40 text-left"
            >
              <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <span className="block font-black text-xs leading-none">Panduan Juri</span>
                <span className="text-[9px] text-amber-200 block mt-0.5">Skenario Riset</span>
              </div>
            </button>

            {/* 2. WA Bot Quick Access Button */}
            <button
              onClick={() => {
                setActiveTab('assistant');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs border border-emerald-500/40 text-left"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0" />
              <div className="min-w-0">
                <span className="block font-black text-xs leading-none">WA Bot Warga</span>
                <span className="text-[9px] text-emerald-200 block mt-0.5">Asisten 24 Jam</span>
              </div>
            </button>
          </div>

          {/* Additional Features: Help, Technical Info, SMK Lab */}
          <div className="grid grid-cols-2 gap-2">
            {/* Petunjuk Modal Trigger */}
            <button
              onClick={() => {
                setShowHelpModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Petunjuk Pakai</span>
            </button>

            {/* Info Teknis Toggle */}
            <button
              onClick={() => {
                setShowTechnicalInfo(!showTechnicalInfo);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold border transition-all ${
                showTechnicalInfo
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{showTechnicalInfo ? 'Info Teknis: ON' : 'Info Teknis Riset'}</span>
            </button>

            {/* SMK Lab Toggle (if non-warga) */}
            {userContext.role !== 'warga' && (
              <button
                onClick={() => {
                  setTeachingMode(!teachingMode);
                  setMobileMenuOpen(false);
                }}
                className={`col-span-2 flex items-center justify-center space-x-2 p-2 rounded-xl text-xs font-semibold border transition-all ${
                  teachingMode 
                    ? 'bg-blue-600 text-white border-blue-400' 
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mode Praktik Siswa SMK: {teachingMode ? 'AKTIF' : 'NON-AKTIF'}</span>
              </button>
            )}
          </div>

          {/* Font Size Mobile Controls */}
          <div className="flex items-center justify-between bg-slate-950/70 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Ukuran Tulisan:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setFontSizeMode('normal');
                  speakText('Ukuran huruf standar.');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  fontSizeMode === 'normal' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                A Normal
              </button>
              <button
                onClick={() => {
                  setFontSizeMode('large');
                  speakText('Ukuran huruf besar.');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  fontSizeMode === 'large' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                A+ Besar
              </button>
              <button
                onClick={() => {
                  setFontSizeMode('extralarge');
                  speakText('Ukuran huruf ekstra besar.');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  fontSizeMode === 'extralarge' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                A++ Lansia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Paper Architecture Labels Strip - HANYA tampil jika user mengaktifkan toggle "Tampilkan Info Teknis" */}
      {showTechnicalInfo && (
        <div className="bg-slate-950/95 border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-1.5 md:py-2 flex items-center justify-between overflow-x-auto text-[11px] scrollbar-none gap-2 md:gap-3 animate-in fade-in duration-150">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px] md:text-[10px] flex items-center gap-1">
              <span>🔬</span> Info Riset:
            </span>
            <button 
              onClick={() => setActiveTab('knowledge')}
              className="px-2 py-0.5 rounded bg-blue-950/80 hover:bg-blue-900/90 text-blue-300 border border-blue-600/40 font-mono text-[9px] md:text-[10px] flex items-center space-x-1 transition-all"
              title="Lapisan Penyimpanan Data (Digital Village Memory)"
            >
              <span>📦</span>
              <strong className="font-semibold">Black Box Arsip</strong>
            </button>
            <span className="text-slate-600">•</span>
            <button 
              onClick={() => setActiveTab('assistant')}
              className="px-2 py-0.5 rounded bg-purple-950/80 hover:bg-purple-900/90 text-purple-300 border border-purple-600/40 font-mono text-[9px] md:text-[10px] flex items-center space-x-1 transition-all"
              title="Lapisan Penalaran & Retrieval AI (Source-Grounded)"
            >
              <span>🧠</span>
              <strong className="font-semibold">AI Brain</strong>
            </button>
            <span className="text-slate-600">•</span>
            <button 
              onClick={() => setActiveTab('dss')}
              className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/40 font-mono text-[9px] md:text-[10px] flex items-center space-x-1 transition-all"
              title="Decision Support System Kepala Desa"
            >
              <span>🦅</span>
              <strong className="font-semibold">Mata Elang DSS</strong>
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('about')}
              className="text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1 underline decoration-dotted text-[10px] md:text-[11px]"
            >
              <span>3 Pilar Riset</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowTechnicalInfo(false)}
              className="text-slate-400 hover:text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700"
              title="Tutup info teknis"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs with Sleek Horizontal Scroll */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="flex space-x-1.5 overflow-x-auto py-1.5 md:py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 md:space-x-2 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span className="text-[11px] md:text-xs">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.2 md:py-0.5 rounded-md ${
                    isActive ? 'bg-blue-700 text-white font-bold' : 'bg-slate-800 text-slate-300 border border-slate-700 font-medium'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* MODAL: Petunjuk Mudah Penggunaan Aplikasi (Ramah Lansia & Semua Warga) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Petunjuk Mudah Desa Black Box AI</h3>
                  <p className="text-[11px] text-slate-500">Dirancang ramah, sederhana, dan mencakup dari tingkat Warga sampai Pemerintah Desa</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  stopSpeech();
                  setShowHelpModal(false);
                }} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simple Steps */}
            <div className="space-y-3.5">
              <div className="flex items-start space-x-3 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pilih Peran Anda (Warga / Ketua RT / RW / Kades)</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Klik ikon peran di bagian atas layar. Warga dapat mengajukan surat pengantar dan lapor jalan, sedangkan Ketua RT dapat memverifikasi dengan 1-klik.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50/70 border border-red-100 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tombol Darurat SOS Desa 24 Jam</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Tekan tombol merah <strong>SOS DARURAT</strong> kapan saja untuk menghubungi ambulans desa, satgas linmas ronda, atau tim siaga banjir.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dengarkan Suara Toa & Jawaban AI</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Tiap pengumuman dan ringkasan memiliki tombol speaker 🔊. Klik tombol tersebut untuk mendengarkan informasi tanpa perlu membaca panjang.
                  </p>
                </div>
              </div>
            </div>

            {/* Audio Button & Close */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReadGuideAloud}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Bacakan Petunjuk Ini 🔊</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setShowHelpModal(false);
                }}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
              >
                Mengerti & Mulai Pakai
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

