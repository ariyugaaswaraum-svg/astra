import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Database, 
  BrainCircuit, 
  Eye, 
  Wrench, 
  FolderGit2, 
  Boxes, 
  Bot, 
  Play, 
  Volume2, 
  VolumeX, 
  Check, 
  Users, 
  Building2, 
  History, 
  BookOpen, 
  FileText,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserContext, UserRoleType, VillageProfile } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface PanduanJuriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string, customRole?: UserRoleType) => void;
  villageProfile: VillageProfile;
  currentUserContext: UserContext;
  onChangeUserContext: (ctx: UserContext) => void;
}

export const PanduanJuriModal: React.FC<PanduanJuriModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  villageProfile,
  currentUserContext,
  onChangeUserContext
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'kebaruan' | 'skenario' | 'shortcuts'>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    try {
      localStorage.setItem('hasSeenJudgeGuide', 'true');
    } catch {
      // ignore
    }
    stopSpeech();
    setIsSpeaking(false);
    onClose();
  };

  const handleNavigateAndClose = (tabId: string, role?: UserRoleType) => {
    try {
      localStorage.setItem('hasSeenJudgeGuide', 'true');
    } catch {
      // ignore
    }
    stopSpeech();
    setIsSpeaking(false);
    onNavigateToTab(tabId, role);
    onClose();
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(
        `Selamat datang, Dewan Juri dan Penguji. ` +
        `Ini adalah prototipe riset Desa Black Box AI oleh siswa SMK Muhammadiyah 1 Kepanjen, ` +
        `dengan studi kasus Desa Talangagung, Kepanjen, Kabupaten Malang. ` +
        `Sistem ini menghadirkan memori digital desa dan pendukung keputusan cerdas berbasis kecerdasan buatan. ` +
        `Silakan pilih 6 kebaruan riset atau jalankan 4 langkah skenario uji coba Closed Knowledge Loop.`
      );
    }
  };

  const kebaruanItems = [
    {
      id: 'memori-objek',
      tabId: 'memori-objek',
      targetRole: 'perangkat' as UserRoleType,
      title: '1. Village Organizational Memory',
      tag: 'Memori Institusional Permanen',
      desc: 'Menyimpan rekam jejak historis, aset fisik, dan penuturan lisan sesepuh desa dalam struktur terindeks agar pengetahuan institusional tidak hilang saat pergantian aparatur/kades.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Database,
      accentBorder: 'hover:border-blue-500'
    },
    {
      id: 'knowledge',
      tabId: 'knowledge',
      targetRole: 'perangkat' as UserRoleType,
      title: '2. Archive-to-Active-Knowledge Transformation',
      tag: 'Transformasi Berkas Statis',
      desc: 'Mengubah berkas Perdes, APBDes, RPJMDes, dan notulensi statis menjadi basis data pengetahuan relasional yang aktif dan siap diolah oleh mesin penalaran cerdas.',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: FolderGit2,
      accentBorder: 'hover:border-indigo-500'
    },
    {
      id: 'assistant',
      tabId: 'assistant',
      targetRole: 'warga' as UserRoleType,
      title: '3. Source-Grounded AI Retrieval',
      tag: 'RAG Faktual & Anti-Halusinasi',
      desc: 'Sistem tanya jawab AI & Bot Telegram resmi (@desablackboxai_bot) yang mewajibkan sitasi dokumen resmi, tanggal penerbitan, dan status validasi data pada setiap jawaban tanpa halusinasi.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: BrainCircuit,
      accentBorder: 'hover:border-purple-500'
    },
    {
      id: 'about',
      tabId: 'about',
      targetRole: 'perangkat' as UserRoleType,
      title: '4. Closed Knowledge Loop',
      tag: '8 Tahap Siklus Pengetahuan',
      desc: 'Sirkulasi pengetahuan menyeluruh: Capture - Validate - Remember - Retrieve - Analyze - Decide - Act - Record, menghubungkan warga RT hingga Kades.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: ShieldCheck,
      accentBorder: 'hover:border-emerald-500'
    },
    {
      id: 'dss',
      tabId: 'dss',
      targetRole: 'kades' as UserRoleType,
      title: '5. Decision Support System (Mata Elang Desa)',
      tag: 'Dashboard Eksekutif Kades',
      desc: 'Dashboard pendukung keputusan Kepala Desa berbasis skoring urgensi AI, simulasi anggaran APBDes, dan rekomendasi program kerja strategis terukur.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Eye,
      accentBorder: 'hover:border-amber-500'
    },
    {
      id: 'assets',
      tabId: 'assets',
      targetRole: 'perangkat' as UserRoleType,
      title: '6. Preventive Asset Management',
      tag: 'Digital Asset Passport & IoT',
      desc: 'Manajemen siklus hidup aset dan fasilitas desa dengan paspor digital ber-QR Code, rekam jejak servis preventif, serta pemantauan telemetri sensor IoT.',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: Boxes,
      accentBorder: 'hover:border-cyan-500'
    }
  ];

  const testSteps = [
    {
      step: 1,
      role: 'warga' as UserRoleType,
      roleLabel: 'Warga (Pak Budi Santoso)',
      tabId: 'rtwarga',
      title: 'Langkah 1: Warga Mengajukan Laporan Infrastruktur',
      instruction: 'Login sebagai "Warga" (peran default) -> Buka menu "Ajukan Surat & Lapor" -> Buat laporan kerusakan jalan atau fasilitas di lingkungan RT 02.',
      actionText: 'Jalankan Langkah 1 (Set Peran Warga & Buka Form Lapor)',
      icon: '👨‍🌾'
    },
    {
      step: 2,
      role: 'rt' as UserRoleType,
      roleLabel: 'Ketua RT (Pak RT Ahmad Fauzi)',
      tabId: 'rtwarga',
      title: 'Langkah 2: Ketua RT / RW Memverifikasi Fakta Lapangan',
      instruction: 'Ganti peran ke "RT / RW" lewat dropdown kanan atas -> Lihat antrean aduan warga yang baru masuk -> Berikan catatan lapangan & klik "Periksa & Verifikasi Lapangan (Audit Trail)".',
      actionText: 'Jalankan Langkah 2 (Set Peran RT & Buka Meja Verifikasi)',
      icon: '📋'
    },
    {
      step: 3,
      role: 'perangkat' as UserRoleType,
      roleLabel: 'Perangkat Desa (Ibu Siti Rahma, S.AP)',
      tabId: 'memori-objek',
      title: 'Langkah 3: Perangkat Desa Memeriksa Histori Objek di Black Box',
      instruction: 'Ganti peran ke "Perangkat Desa" -> Buka "Memori Objek" atau "Mata Elang Desa" -> Periksa apakah aset terkait sudah pernah diperbaiki sebelumnya dan lihat data perdes pendukung.',
      actionText: 'Jalankan Langkah 3 (Set Peran Perangkat & Buka Black Box)',
      icon: '📑'
    },
    {
      step: 4,
      role: 'kades' as UserRoleType,
      roleLabel: 'Kepala Desa (Mata Elang Eksekutif)',
      tabId: 'dss',
      title: 'Langkah 4: Kepala Desa Menetapkan Keputusan Berbasis DSS AI',
      instruction: 'Ganti peran ke "Kepala Desa" -> Buka dashboard "Mata Elang Desa" -> Analisis skoring urgensi AI, kalkulasi anggaran APBDes, dan setujui draf usulan aksi untuk musrenbangdes.',
      actionText: 'Jalankan Langkah 4 (Set Peran Kades & Buka Mata Elang)',
      icon: '🏛️'
    }
  ];

  const quickShortcuts = [
    { label: 'AI Brain / Tanya AI', icon: Bot, tabId: 'assistant', role: 'warga' as UserRoleType, color: 'hover:border-purple-500 text-purple-300' },
    { label: 'Black Box / Memori Objek', icon: Database, tabId: 'memori-objek', role: 'perangkat' as UserRoleType, color: 'hover:border-blue-500 text-blue-300' },
    { label: 'Profil & Statistik Desa', icon: FileText, tabId: 'profil-desa', role: 'warga' as UserRoleType, color: 'hover:border-emerald-500 text-emerald-300' },
    { label: 'Mata Elang Desa (DSS)', icon: Eye, tabId: 'dss', role: 'kades' as UserRoleType, color: 'hover:border-amber-500 text-amber-300' },
    { label: 'Praktik Siswa SMK (TEFA)', icon: GraduationCap, tabId: 'tefa', role: 'perangkat' as UserRoleType, color: 'hover:border-indigo-500 text-indigo-300' },
    { label: 'Digital Asset Passport', icon: Boxes, tabId: 'assets', role: 'perangkat' as UserRoleType, color: 'hover:border-cyan-500 text-cyan-300' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0F172A] border-2 border-purple-500/50 rounded-3xl w-full max-w-5xl shadow-2xl text-white my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Ribbon Header */}
        <div className="bg-gradient-to-r from-purple-900/90 via-slate-900 to-indigo-950 px-6 py-4 border-b border-purple-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Panduan untuk Dewan Juri & Penguji
                </h2>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 tracking-wider">
                  Riset SMK Cerdas
                </span>
              </div>
              <p className="text-xs text-purple-200/80 font-medium">
                Peta Kebaruan Penelitian & Skenario Uji Interaktif • Desa Talangagung, Kab. Malang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSpeaking 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Dengarkan pengantar suara"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Heningkan' : 'Suara'}</span>
            </button>

            <button 
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-700 flex items-center justify-center transition-colors"
              title="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveSubSection('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeSubSection === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🌟 Semua Panduan
          </button>
          <button
            onClick={() => setActiveSubSection('kebaruan')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeSubSection === 'kebaruan'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🔬 6 Kebaruan Penelitian
          </button>
          <button
            onClick={() => setActiveSubSection('skenario')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeSubSection === 'skenario'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ⚡ 4 Langkah Uji Closed Loop
          </button>
          <button
            onClick={() => setActiveSubSection('shortcuts')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeSubSection === 'shortcuts'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🚀 Pintasan Fitur Cepat
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-7 text-slate-200 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          {/* Section 1: Welcoming & Research Context */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-2xl">
                🏛️
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Selamat Datang, Dewan Juri & Penguji Inovasi
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold font-mono">
                    {villageProfile.name}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ini adalah prototipe riset <strong>DESA BLACK BOX AI</strong> yang dikembangkan oleh siswa <strong>SMK Muhammadiyah 1 Kepanjen</strong> dengan studi kasus pada <strong>Desa Talangagung, Kecamatan Kepanjen, Kabupaten Malang</strong>. Sistem ini merupakan integrasi inovatif antara memori digital desa (<em>Village Organizational Memory</em>) dan sistem pendukung keputusan (<em>Decision Support System</em>) berbasis kecerdasan buatan. Tujuannya adalah mencegah hilangnya pengetahuan institusional desa saat pergantian kepengurusan serta mewujudkan pemerintahan desa yang transparan, akuntabel, dan berbasis data faktual.
                </p>

                {/* Badges / Key Pillars */}
                <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Lapisan 1: <strong>Black Box (Data & Memori)</strong></span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Lapisan 2: <strong>AI Brain (Source-Grounded RAG)</strong></span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Lapisan 3: <strong>Mata Elang (Decision Support)</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 6 Kebaruan Penelitian (Novelty Map) */}
          {(activeSubSection === 'all' || activeSubSection === 'kebaruan') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Peta 6 Kebaruan Penelitian ke Fitur Aplikasi
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Klik tombol pada kartu untuk langsung menguji</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kebaruanItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.id}
                      className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between transition-all group ${item.accentBorder} hover:shadow-xl hover:bg-slate-900`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-white">
                            <Icon className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                            {item.tag}
                          </span>
                        </div>

                        <h5 className="font-bold text-xs sm:text-sm text-white leading-snug">
                          {item.title}
                        </h5>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleNavigateAndClose(item.tabId, item.targetRole)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-purple-600 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-purple-600"
                        >
                          <span>Lihat Fitur Ini</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Skenario Uji Coba 4 Langkah (Closed Knowledge Loop) */}
          {(activeSubSection === 'all' || activeSubSection === 'skenario') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Skenario Uji Coba 4 Langkah (Closed Knowledge Loop End-to-End)
                  </h4>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Alur Kerja Warga ➔ RT ➔ Perangkat ➔ Kades</span>
              </div>

              <div className="space-y-3">
                {testSteps.map((step) => (
                  <div 
                    key={step.step}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                        {step.step}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base">{step.icon}</span>
                          <h5 className="font-extrabold text-xs sm:text-sm text-white">
                            {step.title}
                          </h5>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            Peran: {step.roleLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {step.instruction}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigateAndClose(step.tabId, step.role)}
                      className="px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all shrink-0 self-end sm:self-center"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{step.actionText}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Navigasi Cepat (Quick Shortcuts) */}
          {(activeSubSection === 'all' || activeSubSection === 'shortcuts') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Pintasan Cepat Seluruh Modul Utama
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Navigasi instan 1-klik</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {quickShortcuts.map((sc, idx) => {
                  const Icon = sc.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNavigateAndClose(sc.tabId, sc.role)}
                      className={`p-3 rounded-2xl bg-slate-900 border border-slate-800 ${sc.color} flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-800/90 transition-all group`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold leading-tight">
                        {sc.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Status: <strong>Siap Uji Coba Penuh</strong> (Offline-Sync & Source Grounding Aktif)</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleToggleVoice}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSpeaking ? 'Hentikan Audio' : 'Bacakan Pengantar'}</span>
            </button>

            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Mulai Eksplorasi Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
