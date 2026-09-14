import React, { useState } from 'react';
import { 
  Box, 
  FolderGit2, 
  Boxes, 
  Bot, 
  History, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Volume2,
  VolumeX,
  Mic,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Hammer,
  Megaphone,
  Compass,
  AlertOctagon,
  PhoneCall,
  Check,
  Clock,
  Layers,
  ChevronRight,
  Wrench,
  Radio,
  Briefcase,
  Store,
  Building2,
  AlertCircle,
  Plus,
  ExternalLink,
  Award,
  DollarSign,
  Activity,
  UserCheck,
  Send,
  SlidersHorizontal,
  CheckCircle,
  BarChart3,
  HelpCircle,
  X,
  Eye
} from 'lucide-react';
import { 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  HistoryMilestone, 
  DecisionRecommendation, 
  VillageProfile,
  UserContext,
  CitizenReport,
  LetterRequest,
  BroadcastAnnouncement
} from '../types';
import { DashboardCharts } from './DashboardCharts';
import { VillageMapWidget } from './VillageMapWidget';
import { speakText, stopSpeech } from '../utils/speech';
import { filterRecordsByRole } from '../utils/security';

interface DashboardProps {
  villageProfile: VillageProfile;
  userContext: UserContext;
  documents: DocumentItem[];
  assets: AssetItem[];
  memories: HumanMemory[];
  history: HistoryMilestone[];
  recommendations: DecisionRecommendation[];
  reports: CitizenReport[];
  letters: LetterRequest[];
  announcements: BroadcastAnnouncement[];
  setActiveTab: (tab: string) => void;
  onOpenSos: () => void;
  onRunQuickPrompt: (promptText: string) => void;
  onApproveLetter?: (letterId: string, note?: string) => void;
  onVerifyReport?: (reportId: string, note: string) => void;
  onAddAnnouncement?: (ann: BroadcastAnnouncement) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  villageProfile,
  userContext,
  documents,
  assets,
  memories,
  history,
  recommendations,
  reports,
  letters,
  announcements,
  setActiveTab,
  onOpenSos,
  onRunQuickPrompt,
  onApproveLetter,
  onVerifyReport,
  onAddAnnouncement
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quickRtBroadcastText, setQuickRtBroadcastText] = useState('');
  const [quickBroadcastSent, setQuickBroadcastSent] = useState(false);
  const [showCitizenGuide, setShowCitizenGuide] = useState(false);
  const [showPosyanduModal, setShowPosyanduModal] = useState(false);

  // Time-based Indonesian Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const greeting = getGreeting();
  const criticalAssets = assets.filter(a => a.condition === 'Perlu Servis' || a.condition === 'Rusak Berat' || a.condition === 'Rusak Ringan');
  
  // Filtered letters and reports based on active RBAC role
  const visibleLetters = filterRecordsByRole<LetterRequest>(letters, userContext);
  const visibleReports = filterRecordsByRole<CitizenReport>(reports, userContext);

  const pendingLettersCount = visibleLetters.filter(l => l.status === 'Menunggu Persetujuan RT').length;
  const pendingReportsCount = visibleReports.filter(r => r.status === 'Menunggu Verifikasi RT' || r.status === 'Diteruskan ke Pemerintah Desa').length;

  const handlePlayVoiceBriefing = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const roleSpecificSpeech = 
      userContext.role === 'warga'
        ? `Sebagai Warga Lingkungan ${userContext.rt}, Anda dapat mengajukan surat pengantar, melaporkan fasilitas lingkungan yang rusak, mengecek jadwal posyandu, dan berbelanja produk desa.`
        : userContext.role === 'rt' || userContext.role === 'rw'
        ? `Sebagai Pengurus Ketua ${userContext.rt || userContext.rw}, Anda memiliki tugas memverifikasi ${pendingLettersCount} permohonan surat warga dan memeriksa laporan lapangan.`
        : userContext.role === 'perangkat'
        ? `Sebagai Perangkat Desa, Anda memverifikasi administrasi berkas pelayanan, pembukuan inventaris aset, dan pelaporan APBDes.`
        : `Sebagai Kepala Desa Pemerintah Desa Talangagung, Anda dapat memantau Mata Elang Desa untuk prioritas infrastruktur, risiko aset, SLA pelayanan, dan peta keluhan.`;

    const textToSpeak = 
      `${greeting}, ${userContext.name}. Selamat datang di Layanan ${villageProfile.name}. ` +
      `${roleSpecificSpeech} ` +
      `Silakan gunakan menu layanan di bawah. Terima kasih.`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(true)
    );
  };

  const handleSendQuickBroadcast = () => {
    if (!quickRtBroadcastText.trim()) return;
    if (onAddAnnouncement) {
      onAddAnnouncement({
        id: `ANN-RT-${Date.now().toString().slice(-4)}`,
        title: `Pemberitahuan Warga ${userContext.rt}`,
        senderRole: userContext.role === 'rt' ? 'Ketua RT' : userContext.role === 'rw' ? 'Ketua RW' : 'Kepala Desa',
        senderName: userContext.name,
        targetScope: userContext.role === 'rt' ? `Warga ${userContext.rt}` : userContext.role === 'rw' ? `Seluruh Warga ${userContext.rw}` : 'Seluruh Desa',
        content: quickRtBroadcastText,
        date: new Date().toISOString().slice(0, 10),
        priority: 'Penting',
        category: 'Kegiatan Warga'
      });
    }
    setQuickBroadcastSent(true);
    setQuickRtBroadcastText('');
    speakText(`Pengumuman berhasil disiarkan ke warga.`);
    setTimeout(() => setQuickBroadcastSent(false), 4000);
  };

  // Role Theme Helper
  const roleThemeConfig = {
    warga: {
      accentBorder: 'border-blue-500/40',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      glowColor: 'bg-blue-600/10',
      titleHighlight: 'text-blue-400',
      roleLabel: 'Layanan Warga (RT 02 / RW 01)',
      roleDesc: 'Selamat datang di layanan mandiri warga Desa Talangagung. Silakan ajukan surat, lapor masalah lingkungan, atau hubungi bantuan darurat desa.'
    },
    rt: {
      accentBorder: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      glowColor: 'bg-amber-600/10',
      titleHighlight: 'text-amber-400',
      roleLabel: 'Pengurus Ketua RT 02',
      roleDesc: 'Meja Kerja Pengurus RT 02: Otorisasi tanda tangan surat warga RT 02, verifikasi kerusakan lingkungan lapangan, dan siaran Toa RT.'
    },
    rw: {
      accentBorder: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      glowColor: 'bg-purple-600/10',
      titleHighlight: 'text-purple-400',
      roleLabel: 'Koordinator Ketua RW 01',
      roleDesc: 'Pusat Koordinasi Wilayah RW 01: Rekap agregat RT 01-RT 05, penyelarasan usulan pra-Musrenbang, dan posko keamanan RW.'
    },
    perangkat: {
      accentBorder: 'border-indigo-500/40',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      glowColor: 'bg-indigo-600/10',
      titleHighlight: 'text-indigo-400',
      roleLabel: 'Perangkat Desa (Kaur & Kasi)',
      roleDesc: 'Meja Kerja Perangkat Desa: Verifikasi administrasi pelayanan umum, inventarisasi aset & dokumen, serta verifikasi laporan warga.'
    },
    kades: {
      accentBorder: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      glowColor: 'bg-emerald-600/10',
      titleHighlight: 'text-emerald-400',
      roleLabel: 'Kepala Desa (Mata Elang DSS)',
      roleDesc: 'Executive Command Center: Dashboard Mata Elang Desa untuk prioritas infrastruktur, audit aset, kecepatan pelayanan surat, dan peta keluhan warga.'
    }
  };

  const currentTheme = roleThemeConfig[userContext.role] || roleThemeConfig.warga;

  // 9 Core Functions specifically for Warga (simple, intuitive, non-technical)
  const citizenMainCards = [
    {
      id: 'warga-surat',
      title: 'Ajukan Surat',
      desc: 'SKU usaha, SKTM bantuan, KTP/KK, & Surat Domisili tanpa antre',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Layanan Surat',
      badgeColor: 'bg-blue-100 text-blue-800',
      action: () => setActiveTab('rtwarga'),
      actionText: 'Buat Surat Baru'
    },
    {
      id: 'warga-lapor',
      title: 'Lapor Kerusakan',
      desc: 'Foto jalan berlubang, lampu jalan padam, atau selokan mampet',
      icon: Hammer,
      color: 'from-amber-600 to-orange-600',
      badge: 'Lapor Warga',
      badgeColor: 'bg-amber-100 text-amber-800',
      action: () => setActiveTab('rtwarga'),
      actionText: 'Kirim Laporan'
    },
    {
      id: 'warga-status',
      title: 'Cek Status Laporan',
      desc: 'Pantau tanda tangan Pak RT dan proses penyelesaian berkas/aduan',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Pantau Real-Time',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      action: () => setActiveTab('rtwarga'),
      actionText: 'Lihat Status Saya'
    },
    {
      id: 'warga-posyandu',
      title: 'Info Posyandu / Jadwal',
      desc: 'Jadwal imunisasi balita, cek kesehatan lansia, & kerja bakti RT',
      icon: Calendar,
      color: 'from-purple-600 to-violet-600',
      badge: 'Jadwal RT',
      badgeColor: 'bg-purple-100 text-purple-800',
      action: () => {
        setShowPosyanduModal(true);
        speakText('Jadwal kegiatan warga dan posyandu RT 02. Posyandu lansia dan balita diadakan setiap tanggal 25 di Balai Pos RT 02.');
      },
      actionText: 'Lihat Jadwal & Info'
    },
    {
      id: 'warga-profil',
      title: 'Profil Desa',
      desc: 'Informasi desa, aparatur desa, RW/RT, fasilitas umum, dan potensi',
      icon: Building2,
      color: 'from-indigo-600 to-blue-700',
      badge: 'Data Desa',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      action: () => setActiveTab('profil-desa'),
      actionText: 'Lihat Data Desa'
    },
    {
      id: 'warga-bot',
      title: 'Bot Telegram Resmi',
      desc: 'Tanya syarat berkas surat & info desa 24 jam lewat Telegram @desablackboxai_bot',
      icon: Bot,
      color: 'from-sky-600 to-blue-700',
      badge: '@desablackboxai_bot',
      badgeColor: 'bg-sky-100 text-sky-800',
      action: () => setActiveTab('assistant'),
      actionText: 'Buka Bot Telegram'
    },
    {
      id: 'warga-sos',
      title: 'SOS Darurat',
      desc: 'Panggil ambulans desa 24 jam, satgas bencana, dan linmas ronda',
      icon: AlertOctagon,
      color: 'from-red-600 to-rose-700',
      badge: 'Siaga 24 Jam',
      badgeColor: 'bg-red-100 text-red-800',
      action: onOpenSos,
      actionText: 'Buka Menu Darurat'
    },
    {
      id: 'warga-peta',
      title: 'Peta Desa Interaktif',
      desc: 'Sebaran 27 RT/5 RW, lokasi 2 SDN, 2 SPBU, & mitigasi rawan bencana',
      icon: MapPin,
      color: 'from-sky-600 to-cyan-600',
      badge: 'Visual 5 RW / 27 RT',
      badgeColor: 'bg-sky-100 text-sky-800',
      action: () => setActiveTab('peta-desa'),
      actionText: 'Buka Peta Interaktif'
    },
    {
      id: 'warga-bantuan',
      title: 'Bantuan / Petunjuk',
      desc: 'Panduan singkat cara pakai aplikasi dan bacakan instruksi suara',
      icon: HelpCircle,
      color: 'from-orange-500 to-amber-600',
      badge: 'Ramah Warga',
      badgeColor: 'bg-orange-100 text-orange-800',
      action: () => {
        setShowCitizenGuide(true);
        speakText('Selamat datang di menu petunjuk warga. Anda dapat mengajukan surat, melaporkan masalah lingkungan, atau menekan tombol darurat SOS.');
      },
      actionText: 'Baca / Dengarkan'
    }
  ];

  // =========================================================================
  // RENDER PERAN 1: WARGA (Single-screen, pendek, fokus pada layanan mandiri)
  // =========================================================================
  if (userContext.role === 'warga') {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-200">
        {/* 1. Hero Banner Warga */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-500/30 text-white relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 border rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LAYANAN MANDIRI WARGA (RT 02 / RW 01)</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Siaga 24 Jam</span>
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {greeting}, <span className="text-blue-400">{userContext.name}</span>
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Ajukan surat pengantar RT, laporkan fasilitas lingkungan yang rusak, atau hubungi bantuan darurat desa kapan saja.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={handlePlayVoiceBriefing}
                className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                  isPlayingAudio 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Hentikan Suara ⏸️</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Suara 🔊</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenSos}
                className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 border border-red-500/50 shadow-md active:scale-95 transition-all"
              >
                <AlertOctagon className="w-4 h-4 text-white animate-bounce" />
                <span>Bantuan SOS 24 Jam</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Bar Warga */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80 text-xs">
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Surat Saya:</span>
              <span className="text-sm sm:text-base font-extrabold text-blue-400">
                {visibleLetters.length} Berkas {visibleLetters.length > 0 ? 'Diajukan' : ''}
              </span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Laporan Lingkungan:</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-400">
                {visibleReports.length} Laporan
              </span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Jadwal Posyandu:</span>
              <span className="text-sm sm:text-base font-extrabold text-purple-400">Tgl 25 Tiap Bulan</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Ambulans Desa:</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-400">Standby 24 Jam</span>
            </div>
          </div>
        </div>

        {/* 2. Meja Layanan Mandiri Warga (Ringkasan Status Pribadi) */}
        <div className="bg-white border-2 border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                👨‍🌾
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Status Berkas & Pengaduan Anda</h3>
                <p className="text-xs text-slate-500">Pantau proses tanda tangan RT dan tindak lanjut aduan fasilitas</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('rtwarga')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Buka Menu Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Widget 1: Permohonan Surat Saya */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Surat Pengantar Saya</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                  {visibleLetters.length} Berkas
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {visibleLetters.length === 0 ? (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                    Belum ada riwayat permohonan surat.
                  </div>
                ) : (
                  visibleLetters.slice(0, 2).map((letter) => (
                    <div key={letter.id} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-xs truncate max-w-[140px]">{letter.letterType}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          letter.status === 'Disetujui RT' || letter.status === 'Selesai di Pemerintah Desa'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {letter.status === 'Disetujui RT' ? 'Disetujui RT ✅' : letter.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{letter.purpose}</p>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-2xs"
              >
                + Ajukan Surat Baru
              </button>
            </div>

            {/* Widget 2: Pengaduan Lingkungan Saya */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                  <Hammer className="w-4 h-4 text-amber-600" />
                  <span>Pengaduan Lingkungan {userContext.rt}</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {visibleReports.length} Laporan
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {visibleReports.length === 0 ? (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                    Belum ada laporan aktif.
                  </div>
                ) : (
                  visibleReports.slice(0, 2).map((report) => (
                    <div key={report.id} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-xs truncate max-w-[140px]">{report.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 rounded font-semibold">
                          {report.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {report.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-2xs"
              >
                + Laporkan Masalah Lingkungan
              </button>
            </div>

            {/* Widget 3: Agenda Lingkungan RT 02 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Info & Kegiatan Lingkungan</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Aktif
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="font-bold text-slate-900 text-xs">💉 Posyandu Balita & Lansia</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tgl 25 Bulan Ini • Balai Pos RT 02 (08.00 WIB)</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <p className="font-bold text-slate-900 text-xs">🌾 Beras Organik BUMDes</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Rp 68.000 / 5kg • Siap antar ke rumah warga</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('bumdes')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-2xs"
              >
                Pesan di Toko Desa (BUMDes)
              </button>
            </div>
          </div>
        </div>

        {/* 3. 9 Menu Layanan Utama Warga */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <span>9 Menu Layanan Mandiri Warga</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-black rounded-full">
                  Mudah & Cepat
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Pilih menu layanan dengan tombol besar ramah warga & lansia
              </p>
            </div>

            <button
              onClick={() => {
                setShowCitizenGuide(true);
                speakText('Bantuan Penggunaan Aplikasi. Silakan pilih tombol Ajukan Surat untuk mengurus surat, atau tombol Lapor Kerusakan untuk memotret jalan rusak.');
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Petunjuk Singkat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {citizenMainCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={card.action}
                  className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Telegram Bot Official Banner */}
        <div className="bg-gradient-to-r from-sky-800 via-blue-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-sky-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xl shrink-0">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  Bot Telegram Resmi Desa Talangagung (@desablackboxai_bot)
                </h4>
                <span className="px-2 py-0.5 bg-sky-400 text-sky-950 text-[9px] font-black rounded-full uppercase">
                  Aktif 24 Jam
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                Urus surat pengantar, lapor foto fasilitas rusak dengan AI, tanya syarat berkas, jadwal posyandu, dan produk BUMDes via Telegram.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://t.me/desablackboxai_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-sky-50 text-sky-900 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-xs shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka di Telegram</span>
            </a>
            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-400 hover:bg-sky-300 text-sky-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-xs shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span>Buka Bot Desa</span>
            </button>
          </div>
        </div>

        {/* Modal Petunjuk Penggunaan Warga */}
        {showCitizenGuide && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Petunjuk Penggunaan Warga</h3>
                    <p className="text-xs text-slate-500">Cara mudah mengurus keperluan desa dari HP</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    stopSpeech();
                    setShowCitizenGuide(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-extrabold text-blue-950 block">Mengajukan Surat Pengantar</span>
                    <p className="text-slate-600 mt-0.5">Pilih menu "Ajukan Surat", ketik keperluan Anda, lalu tunggu persetujuan QR Code dari Pak RT.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-extrabold text-amber-950 block">Melaporkan Kerusakan Fasilitas</span>
                    <p className="text-slate-600 mt-0.5">Pilih menu "Lapor Kerusakan", unggah foto jalan berlubang atau lampu padam untuk ditindaklanjuti.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-extrabold text-red-950 block">Panggilan Darurat SOS 24 Jam</span>
                    <p className="text-slate-600 mt-0.5">Jika ada situasi darurat medis/kebakaran, tekan tombol merah "SOS Darurat" di kanan atas.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
                <button
                  onClick={() => speakText('Langkah pertama, pilih Ajukan Surat untuk mengurus berkas. Langkah kedua, pilih Lapor Kerusakan untuk foto fasilitas rusak. Langkah ketiga, tekan SOS Darurat untuk ambulans 24 jam.')}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Bacakan Suara 🔊</span>
                </button>

                <button
                  onClick={() => {
                    stopSpeech();
                    setShowCitizenGuide(false);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Saya Paham
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Jadwal Posyandu & Kegiatan Warga */}
        {showPosyanduModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Jadwal Posyandu & Kegiatan Warga</h3>
                    <p className="text-xs text-slate-500">Lingkungan RT 02 / RW 01 Desa Talangagung</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    stopSpeech();
                    setShowPosyanduModal(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-950 text-sm flex items-center gap-1.5">
                      <span>👶👵 Posyandu Balita & Lansia</span>
                    </span>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold">
                      Tgl 25 Tiap Bulan
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    <strong>Pukul 08.00 - 11.00 WIB</strong> di Balai Pos RT 02.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Pemeriksaan tensi darah lansia, cek gula darah & kolesterol, penimbangan berat badan balita, imunisasi, vitamin, serta bubur kacang hijau gratis.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                      <span>🧹 Kerja Bakti Bersih Lingkungan</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      Minggu Pertama
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    <strong>Pukul 06.30 WIB</strong> • Titik kumpul: Gang Musholla RT 02.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Gotong royong pembersihan selokan got dan perapihan ranting pohon yang menutupi lampu jalan.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-950 text-sm flex items-center gap-1.5">
                      <span>🛡️ Ronda Malam & Siskamling</span>
                    </span>
                    <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                      Setiap Malam
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    <strong>Pukul 22.00 - 04.00 WIB</strong> • Pos Ronda RT 02.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Petugas piket giliran warga sesuai jadwal ronda bulanan RT.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
                <button
                  onClick={() => speakText('Jadwal kegiatan RT 02. Pertama, posyandu balita dan lansia setiap tanggal 25 jam 8 pagi di Balai Pos RT 02. Kedua, kerja bakti lingkungan minggu pertama tiap bulan jam 6.30 pagi. Ketiga, ronda malam setiap malam jam 10 malam di Pos Ronda.')}
                  className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Jadwal 🔊</span>
                </button>

                <button
                  onClick={() => {
                    stopSpeech();
                    setShowPosyanduModal(false);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER PERAN 2: RT / RW (Fokus pada tugas RT: verifikasi surat, lapor, Toa)
  // =========================================================================
  if (userContext.role === 'rt' || userContext.role === 'rw') {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-200">
        {/* 1. Hero Banner RT/RW */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-7 shadow-xl border border-amber-500/40 text-white relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 border rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MEJA KERJA PENGURUS ({userContext.rt || userContext.rw})</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Otorisasi RT Aktif</span>
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {greeting}, <span className="text-amber-400">{userContext.name}</span>
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Verifikasi tanda tangan digital surat pengantar warga, pantau laporan lingkungan, dan siarkan pengumuman Toa RT.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={handlePlayVoiceBriefing}
                className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                  isPlayingAudio 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Hentikan Suara ⏸️</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Tugas RT 🔊</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenSos}
                className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 border border-red-500/50 shadow-md active:scale-95 transition-all"
              >
                <AlertOctagon className="w-4 h-4 text-white" />
                <span>Posko SOS RT/RW</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Bar RT/RW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80 text-xs">
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Warga {userContext.rt || userContext.rw}:</span>
              <span className="text-sm sm:text-base font-extrabold text-white">142 Jiwa (38 KK)</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Surat Perlu TTD:</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-400">{pendingLettersCount} Menunggu</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Laporan Lingkungan:</span>
              <span className="text-sm sm:text-base font-extrabold text-rose-400">{pendingReportsCount} Ditangani</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Pos Ronda & Keamanan:</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-400">Aktif Terisi</span>
            </div>
          </div>
        </div>

        {/* 2. Widget "3 Tugas Prioritas Hari Ini" untuk RT/RW */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-amber-50/40 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black shrink-0 shadow-xs">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    3 Tugas Prioritas Pengurus RT Hari Ini
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
                    {userContext.rt || userContext.rw}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Fokus tugas harian agar permohonan surat warga dan laporan fasilitas cepat tertangani
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Task 1: Surat Menunggu TTD */}
            <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 hover:border-amber-400 shadow-xs flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    {pendingLettersCount} Menunggu TTD
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 block">{pendingLettersCount} Surat Warga</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Surat Menunggu Tanda Tangan</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Permohonan SKU & Domisili butuh otorisasi stempel QR Pak RT.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Buka Antrean Surat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task 2: Laporan Warga RT */}
            <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 hover:border-rose-400 shadow-xs flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                    {pendingReportsCount} Laporan
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 block">{pendingReportsCount} Laporan Lapangan</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Laporan Warga Belum Dicek</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Aduan PJU padam dan drainase di lingkungan {userContext.rt || 'RT 02'}.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Periksa & Disposisi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task 3: Siaran Toa RT */}
            <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 hover:border-blue-400 shadow-xs flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
                    Siaga Pengumuman
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 block">Toa & WA RT</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Siarkan Pengumuman RT</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Kirim info posyandu, kerja bakti, & iuran sampah ke HP warga.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Siarkan Pengumuman</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Meja Otorisasi Surat & Siaran Cepat RT 02 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Antrean Surat Warga RT 02 */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Antrean Persetujuan Surat Pengantar Warga {userContext.rt}
                </h3>
              </div>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {letters.filter(l => l.status === 'Menunggu Persetujuan RT').length} Menunggu TTD
              </span>
            </div>

            <div className="space-y-2.5">
              {letters.filter(l => l.status === 'Menunggu Persetujuan RT').slice(0, 2).map((letItem) => (
                <div key={letItem.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-xs">{letItem.applicantName}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">
                        {letItem.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Keperluan: {letItem.purpose}</p>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {letItem.id} • {letItem.requestDate}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (onApproveLetter) {
                          onApproveLetter(letItem.id, 'Disetujui dan ditandatangani oleh Ketua RT 02.');
                          speakText(`Surat ${letItem.type} untuk ${letItem.applicantName} berhasil disetujui.`);
                        }
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui & TTD Instan</span>
                    </button>
                  </div>
                </div>
              ))}

              {letters.filter(l => l.status === 'Menunggu Persetujuan RT').length === 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                  ✅ Semua permohonan surat pengantar warga {userContext.rt} telah disetujui!
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('rtwarga')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center block transition-colors"
            >
              Buka Meja Verifikasi Lengkap Surat RT →
            </button>
          </div>

          {/* Antrean Verifikasi Laporan Kerusakan Lingkungan Warga RT */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Antrean Verifikasi Laporan Lingkungan {userContext.rt}
                </h3>
              </div>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {reports.filter(r => r.status === 'Menunggu Verifikasi RT').length} Menunggu Cek Fisik
              </span>
            </div>

            <div className="space-y-2.5">
              {reports.filter(r => r.status === 'Menunggu Verifikasi RT').slice(0, 3).map((repItem) => (
                <div key={repItem.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <span className="font-extrabold text-slate-900 text-xs">{repItem.title}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                        {repItem.category}
                      </span>
                      {repItem.dataClassification === 'PROTOTYPE_SIMULATION' && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-extrabold">
                          DATA B — SIMULASI
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{repItem.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Pelapor: {repItem.reporterName} • ID: {repItem.id}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (onVerifyReport) {
                          onVerifyReport(repItem.id, 'Pemeriksaan fisik RT 02 mengonfirmasi laporan valid. Diteruskan ke Desa.');
                          speakText(`Laporan ${repItem.title} berhasil diverifikasi dan diteruskan ke Pemerintah Desa.`);
                        }
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verifikasi Lapangan</span>
                    </button>
                  </div>
                </div>
              ))}

              {reports.filter(r => r.status === 'Menunggu Verifikasi RT').length === 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800">
                  ✅ Semua laporan lingkungan warga {userContext.rt} telah diverifikasi!
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('rtwarga')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center block transition-colors"
            >
              Buka Semua Laporan Warga di Meja RT →
            </button>
          </div>

          {/* Siaran Cepat Toa & Pesan RT */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>Kirim Siaran Toa & Pesan RT</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  {userContext.rt}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ketik pengumuman jadwal posyandu, ronda malam, atau gotong royong warga.
              </p>

              <textarea
                rows={3}
                placeholder="Ketik isi pengumuman RT di sini..."
                value={quickRtBroadcastText}
                onChange={(e) => setQuickRtBroadcastText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {quickBroadcastSent && (
              <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-[11px] font-bold text-center animate-in fade-in">
                ✅ Siaran Toa berhasil dikirim ke seluruh warga {userContext.rt}!
              </div>
            )}

            <button
              onClick={handleSendQuickBroadcast}
              disabled={!quickRtBroadcastText.trim()}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Siarkan Pengumuman RT</span>
            </button>
          </div>
        </div>

        {/* 4. Menu Cepat Layanan Pengurus RT */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Akses Cepat Pengurus RT/RW</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              Khusus RT/RW
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div
              onClick={() => setActiveTab('rtwarga')}
              className="p-4 bg-white border border-slate-200 hover:border-amber-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">Surat Pengantar RT</h4>
              <p className="text-[11px] text-slate-500">Kelola berkas pengajuan SKU, SKTM, & Domisili</p>
            </div>

            <div
              onClick={() => setActiveTab('rtwarga')}
              className="p-4 bg-white border border-slate-200 hover:border-amber-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Hammer className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">Laporan Kerusakan RT</h4>
              <p className="text-[11px] text-slate-500">Verifikasi aduan jalan rusak, drainase, & lampu padam</p>
            </div>

            <div
              onClick={() => setActiveTab('peta-desa')}
              className="p-4 bg-white border border-slate-200 hover:border-amber-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">Peta Wilayah RT & Bencana</h4>
              <p className="text-[11px] text-slate-500">Sebaran 27 RT, titik rawan luapan air, & fasum</p>
            </div>

            <div
              onClick={() => setActiveTab('assistant')}
              className="p-4 bg-white border border-slate-200 hover:border-sky-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-sky-600">Bot Telegram Desa</h4>
              <p className="text-[11px] text-slate-500">Layanan otomatis surat & aduan via @desablackboxai_bot</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER PERAN 3: PERANGKAT DESA (Kaur/Kasi - Modul Administratif, Aset, IoT)
  // =========================================================================
  if (userContext.role === 'perangkat') {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-200">
        {/* 1. Hero Banner Perangkat Desa */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/40 text-white relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 border rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MEJA OPERASIONAL PERANGKAT DESA</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Black Box Sinkron</span>
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {greeting}, <span className="text-indigo-400">{userContext.name}</span>
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Pusat administrasi pelayanan umum, inventarisasi fasilitas & sensor IoT desa, serta verifikasi berkas administrasi desa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={handlePlayVoiceBriefing}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengarkan Ringkasan Operasional 🔊</span>
              </button>

              <button
                onClick={onOpenSos}
                className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 border border-red-500/50 shadow-md active:scale-95 transition-all"
              >
                <AlertOctagon className="w-4 h-4 text-white" />
                <span>Pantau SOS Masuk</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Bar Perangkat */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80 text-xs">
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Penduduk Desa:</span>
              <span className="text-sm sm:text-base font-extrabold text-white">{villageProfile.population.toLocaleString('id-ID')} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Inventaris Aset:</span>
              <span className="text-sm sm:text-base font-extrabold text-indigo-300">{assets.length} Sarana Tercatat</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Surat Masuk:</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-400">{letters.length} Total Berkas</span>
            </div>
            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Aset Butuh Servis:</span>
              <span className="text-sm sm:text-base font-extrabold text-rose-400">{criticalAssets.length} Fasilitas</span>
            </div>
          </div>
        </div>

        {/* 2. Widget "3 Tugas Prioritas Hari Ini" untuk Perangkat Desa */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-indigo-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-xs">
                ⚡
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  3 Tugas Prioritas Perangkat Desa Hari Ini
                </h3>
                <p className="text-xs text-slate-500">
                  Fokus operasional kantor desa: tindak lanjut laporan, pemeriksaan sarana, dan proses surat desa
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Task 1: Laporan Perlu Ditindaklanjuti */}
            <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 hover:border-amber-400 shadow-xs flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                    <Hammer className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    {reports.filter(r => r.status !== 'Selesai').length} Perlu Tindak Lanjut
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 block">{reports.filter(r => r.status !== 'Selesai').length} Laporan</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Laporan Perlu Ditindaklanjuti</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Disposisi kerusakan fasilitas dari RT yang butuh koordinasi teknisi.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Lihat & Proses Laporan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task 2: Aset Perlu Diperiksa */}
            <div className="bg-white rounded-2xl p-4 border-2 border-orange-200 hover:border-orange-400 shadow-xs flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-900 border border-orange-300">
                    {criticalAssets.length} Perlu Servis
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 block">{criticalAssets.length} Fasilitas</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Aset Perlu Diperiksa</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pompa irigasi & genset yang memerlukan servis berkala TEFA SMK.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('preventive')}
                className="w-full py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Jadwal Perawatan Mesin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task 3: Surat Menunggu Diproses */}
            <div className="bg-white rounded-2xl p-4 border-2 border-indigo-200 hover:border-indigo-400 shadow-xs flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-900 border border-indigo-300">
                    {letters.length} Total Berkas
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 block">{letters.length} Permohonan</span>
                  <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Surat Menunggu Diproses</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Penerbitan surat keterangan resmi Pemerintah Desa & arsip digital.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('rtwarga')}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Proses Surat Pemerintah Desa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Pusat Modul Kerja Perangkat Desa */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Pusat Modul Administratif & Operasional Desa</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">
              Kaur & Kasi
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div
              onClick={() => setActiveTab('rtwarga')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">Pelayanan Surat & Aduan</h4>
              <p className="text-[11px] text-slate-500">Antrean berkas pelayanan warga & disposisi RT</p>
            </div>

            <div
              onClick={() => setActiveTab('knowledge')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600">Arsip Black Box Desa</h4>
              <p className="text-[11px] text-slate-500">{documents.length} dokumen regulasi & memori lapangan</p>
            </div>

            <div
              onClick={() => setActiveTab('preventive')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">Perawatan Mesin & TEFA</h4>
              <p className="text-[11px] text-slate-500">Servis berkala pompa, traktor, & genset SMK</p>
            </div>

            <div
              onClick={() => setActiveTab('iot')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">Simulasi Sensor IoT Desa</h4>
              <p className="text-[11px] text-slate-500">Simulasi telemetri pompa debit air & panel surya</p>
            </div>

            <div
              onClick={() => setActiveTab('assets')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-teal-600">Buku Inventaris Aset</h4>
              <p className="text-[11px] text-slate-500">{assets.length} sarana jalan, jembatan & mesin</p>
            </div>

            <div
              onClick={() => setActiveTab('peta-desa')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-sky-600">Peta Fasilitas & Geospasial</h4>
              <p className="text-[11px] text-slate-500">Sebaran 27 RT, SD, SPBU, & zonasi rawan</p>
            </div>

            <div
              onClick={() => setActiveTab('profil-desa')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-600">Profil Statistik BPS</h4>
              <p className="text-[11px] text-slate-500">Data resmi 5 RW, 27 RT, ekonomi & fasilitas</p>
            </div>

            <div
              onClick={() => setActiveTab('jobs')}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-rose-600">Bursa Kerja & Magang</h4>
              <p className="text-[11px] text-slate-500">Lowongan industri & kerja sama magang SMK</p>
            </div>
          </div>
        </div>

        {/* 4. Status Sarana & Fasilitas Publik Desa */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Status Sarana & Fasilitas Publik Desa (Color-Coded Status)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hijau: Berfungsi Baik • Kuning: Sedang Pemeliharaan • Merah: Perlu Tindak Lanjut
              </p>
            </div>

            <button
              onClick={() => setActiveTab('assets')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>Buka Buku Inventaris Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-red-50/80 border-2 border-red-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-red-600 text-white rounded-md text-[9px] font-extrabold uppercase">
                  Perlu Tindak Lanjut
                </span>
                <span className="text-xs font-extrabold text-red-800">1 Titik</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Jalan Beton & Drainase RT 05</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Dusun 3 (Margaluyu) • Retak 15m pemicu genangan air.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('dss')}
                className="text-[11px] font-bold text-red-700 hover:underline block pt-1"
              >
                Lihat Usulan RKPDes 2027 →
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-600 text-white rounded-md text-[9px] font-extrabold uppercase">
                  Sedang Pemeliharaan
                </span>
                <span className="text-xs font-extrabold text-amber-800">2 Titik</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Pompa Air Irigasi & Lampu RT 02</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Dusun 2 & RT 02 • Servis sparepart pompa dan lampu jalan.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('preventive')}
                className="text-[11px] font-bold text-amber-800 hover:underline block pt-1"
              >
                Jadwal Servis Berkala →
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[9px] font-extrabold uppercase">
                  Kondisi Baik & Aman
                </span>
                <span className="text-xs font-extrabold text-emerald-800">15 Sarana</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Jembatan Krajan & Balai Posyandu</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Dusun 1 & Dusun 3 • Baru selesai renovasi & siap pakai.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('assets')}
                className="text-[11px] font-bold text-emerald-800 hover:underline block pt-1"
              >
                Lihat Detail Sarana →
              </button>
            </div>
          </div>
        </div>

        {/* 5. Alur Birokrasi Digital Efisien */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Alur Birokrasi Digital Efisien</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Hierarki Pelayanan Cepat (Memangkas Kertas & Waktu)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-white">Warga</h4>
              <p className="text-[11px] text-slate-300">Ajukan surat atau foto kerusakan dari HP.</p>
            </div>

            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-extrabold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-white">Ketua RT</h4>
              <p className="text-[11px] text-slate-300">Verifikasi lapangan & stempel QR digital.</p>
            </div>

            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-extrabold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-white">Perangkat Desa</h4>
              <p className="text-[11px] text-slate-300">Penerbitan surat desa & inventarisasi aset.</p>
            </div>

            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs">
                4
              </div>
              <h4 className="text-xs font-bold text-white">Kepala Desa</h4>
              <p className="text-[11px] text-slate-300">Pengesahan berkas & pengalokasian APBDes.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER PERAN 4: KEPALA DESA (Executive Command Center - DSS Mata Elang, APBDes)
  // =========================================================================
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Hero Banner Kepala Desa */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/40 text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 border rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXECUTIVE COMMAND CENTER (KEPALA DESA)</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Memori AI: {villageProfile.blackBoxMemoryScore}% Sinkron</span>
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {greeting}, <span className="text-emerald-400">{userContext.name}</span>
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Mata Elang Desa: Pengambilan keputusan prioritas infrastruktur, realisasi APBDes 2026, mitigasi risiko aset, dan peta keluhan warga.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handlePlayVoiceBriefing}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengarkan Ringkasan Eksekutif 🔊</span>
            </button>

            <button
              onClick={() => setActiveTab('dss')}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4 text-white" />
              <span>Buka Mata Elang Lengkap</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar Kepala Desa */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Pagu APBDes 2026:</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400">Rp {(villageProfile.apbdesTotal / 1000000000).toFixed(2)} Miliar</span>
          </div>
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Usulan Musrenbang AI:</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400">{recommendations.length} Rekomendasi</span>
          </div>
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Legalisasi Kades:</span>
            <span className="text-sm sm:text-base font-extrabold text-blue-400">3 Dokumen Siap</span>
          </div>
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Populasi Warga:</span>
            <span className="text-sm sm:text-base font-extrabold text-white">{villageProfile.population.toLocaleString('id-ID')} Jiwa</span>
          </div>
        </div>
      </div>

      {/* 2. Widget "3 Tugas Prioritas Hari Ini" untuk Kepala Desa */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-xs">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                3 Keputusan Prioritas Kepala Desa Hari Ini
              </h3>
              <p className="text-xs text-slate-500">
                Fokus pengambilan keputusan strategis, persetujuan program Musrenbangdes, dan ringkasan anggaran
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Task 1: Keputusan Menunggu Persetujuan */}
          <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200 hover:border-emerald-400 shadow-xs flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {recommendations.length} Usulan Prioritas
                </span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block">{recommendations.length} Usulan</span>
                <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Keputusan Menunggu Persetujuan</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Prioritas drainase Dusun 3 & betonisasi jalan penghubung RT.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dss')}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <span>Tinjau Rekomendasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Task 2: Laporan Prioritas Tinggi */}
          <div className="bg-white rounded-2xl p-4 border-2 border-rose-200 hover:border-rose-400 shadow-xs flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                  Isu Mendesak
                </span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block">
                  {reports.filter(r => r.urgency === 'Tinggi' || r.urgency === 'Darurat').length || 2} Isu Mendesak
                </span>
                <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Laporan Prioritas Tinggi</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Aduan warga berkategori mendesak yang butuh disposisi kebijakan Kades.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dss')}
              className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <span>Lihat Isu Lapangan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Task 3: Ringkasan Anggaran */}
          <div className="bg-white rounded-2xl p-4 border-2 border-blue-200 hover:border-blue-400 shadow-xs flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
                  38% Terserap
                </span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block">Rp 703 Jt / 1,85 M</span>
                <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">Realisasi APBDes 2026</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Realisasi penyerapan anggaran untuk infrastruktur & pelayanan.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dss')}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs"
            >
              <span>Buka Simulasi Anggaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mata Elang Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
          <span className="text-slate-500 text-[11px] block font-bold">Pagu APBDes T.A. 2026</span>
          <span className="text-xl font-black text-emerald-600 block">Rp 1,85 Miliar</span>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '38%' }} />
          </div>
          <span className="text-[10px] text-slate-500 block">Realisasi: Rp 703 Juta (38%)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
          <span className="text-slate-500 text-[11px] block font-bold">Legalisasi & Kebijakan</span>
          <span className="text-xl font-black text-slate-900 block">3 Dokumen</span>
          <p className="text-[11px] text-emerald-600">Siap Stempel Digital Barcode</p>
          <button 
            onClick={() => setActiveTab('rtwarga')}
            className="text-[11px] text-emerald-600 font-bold hover:underline block pt-1"
          >
            Otorisasi Dokumen →
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
          <span className="text-slate-500 text-[11px] block font-bold">Prioritas AI Musrenbang</span>
          <span className="text-xs font-black text-amber-700 block">Drainase Dusun 3 (Skor 94)</span>
          <p className="text-[10px] text-slate-500">Pencegahan luapan Kali Metro</p>
          <button 
            onClick={() => setActiveTab('dss')}
            className="text-[11px] text-blue-600 font-bold hover:underline block pt-1"
          >
            Buka Simulasi DSS →
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
          <span className="text-slate-500 text-[11px] block font-bold">Kesiapan Fasilitas Desa</span>
          <span className="text-xs font-black text-slate-900 block">1 Ambulans • 2 Traktor</span>
          <p className="text-[10px] text-emerald-600">4 Sensor IoT Kali Metro: Normal</p>
          <button 
            onClick={() => setActiveTab('assets')}
            className="text-[11px] text-emerald-600 font-bold hover:underline block pt-1"
          >
            Audit Sarana Desa →
          </button>
        </div>
      </div>

      {/* 4. Dashboard Data Trends & Analitik Desa (Dengan label netral simulasi data contoh) */}
      <DashboardCharts villageProfile={villageProfile} />
    </div>
  );
};
