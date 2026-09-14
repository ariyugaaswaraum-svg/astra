import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Send, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Megaphone, 
  Plus, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  QrCode, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  Building2,
  Users,
  Camera,
  Filter,
  Check,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Mic,
  Save,
  RotateCcw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CitizenReport, LetterRequest, BroadcastAnnouncement, UserRoleType, UserContext, VillageProfile, AuditTrail } from '../types';
import { speakText, stopSpeech, setupSpeechRecognition, SpeechRecognitionHelper } from '../utils/speech';
import { maskNIK, maskPhoneNumber, filterRecordsByRole } from '../utils/security';
import { DataClassificationBadge } from './DataClassificationBadge';
import { 
  useOnlineStatus, 
  saveDraft, 
  loadDraft, 
  clearDraft, 
  queueOfflineItem, 
  getOfflineQueue, 
  clearOfflineQueue, 
  STORAGE_KEYS 
} from '../utils/offlineSync';

interface ModulRtWargaProps {
  villageProfile: VillageProfile;
  userContext: UserContext;
  reports: CitizenReport[];
  letters: LetterRequest[];
  announcements: BroadcastAnnouncement[];
  onAddReport: (report: CitizenReport) => void;
  onAddLetter: (letter: LetterRequest) => void;
  onApproveLetter: (letterId: string, rtCode: string, notes?: string) => void;
  onVerifyReport: (reportId: string, notes: string) => void;
  onAddAnnouncement: (announcement: BroadcastAnnouncement) => void;
  onOpenWhatsAppBot?: () => void;
  initialSubTab?: 'surat' | 'laporan' | 'pengumuman';
  initialOpenReportModal?: boolean;
}

export const ModulRtWarga: React.FC<ModulRtWargaProps> = ({
  villageProfile,
  userContext,
  reports,
  letters,
  announcements,
  onAddReport,
  onAddLetter,
  onApproveLetter,
  onVerifyReport,
  onAddAnnouncement,
  onOpenWhatsAppBot,
  initialSubTab,
  initialOpenReportModal
}) => {
  const isOnline = useOnlineStatus();
  const [activeSubTab, setActiveSubTab] = useState<'surat' | 'laporan' | 'pengumuman'>(
    initialSubTab || (userContext.role === 'rt' ? 'laporan' : 'surat')
  );
  
  // Modals / Forms state
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(Boolean(initialOpenReportModal));

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
    if (initialOpenReportModal !== undefined) {
      setShowReportModal(initialOpenReportModal);
    }
  }, [initialSubTab, initialOpenReportModal]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedLetterForQr, setSelectedLetterForQr] = useState<LetterRequest | null>(null);

  // Audit Review / Verification Modal State
  const [auditTarget, setAuditTarget] = useState<{
    type: 'letter' | 'report';
    letter?: LetterRequest;
    report?: CitizenReport;
    defaultNote: string;
  } | null>(null);
  const [auditNote, setAuditNote] = useState('');

  // New Letter Form state
  const [applicantName, setApplicantName] = useState(userContext.name);
  const [nik, setNik] = useState('320301' + Math.floor(1000000000 + Math.random() * 9000000000));
  const [letterType, setLetterType] = useState<LetterRequest['letterType']>('Surat Keterangan Usaha (SKU)');
  const [purpose, setPurpose] = useState('');
  const [rtRw, setRtRw] = useState(`${userContext.rt} / ${userContext.rw}`);
  const [isListeningLetterPurpose, setIsListeningLetterPurpose] = useState(false);

  // New Report Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<CitizenReport['category']>('Jalan Rusak');
  const [reportDesc, setReportDesc] = useState('');
  const [reportLocation, setReportLocation] = useState(`${userContext.dusun} (${userContext.rt})`);
  const [reportUrgency, setReportUrgency] = useState<CitizenReport['urgency']>('Penting');
  const [isListeningReportDesc, setIsListeningReportDesc] = useState(false);
  const letterRecognizerRef = useRef<SpeechRecognitionHelper | null>(null);
  const reportRecognizerRef = useRef<SpeechRecognitionHelper | null>(null);

  // New Announcement Form state
  const [annTitle, setAnnTitle] = useState('');
  const [annScope, setAnnScope] = useState<BroadcastAnnouncement['targetScope']>('Warga RT 02');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<BroadcastAnnouncement['category']>('Posyandu');

  // Filter state for reports
  const [reportFilter, setReportFilter] = useState<'all' | 'my-rt' | 'menunggu'>('all');

  // Audio Playback
  const [playingAnnId, setPlayingAnnId] = useState<string | null>(null);

  // Offline Sync State
  const [offlineSyncToast, setOfflineSyncToast] = useState<string | null>(null);
  const [pendingOfflineCount, setPendingOfflineCount] = useState(0);

  // Check pending offline queue items
  const checkPendingOffline = () => {
    const queuedLetters = getOfflineQueue<LetterRequest>(STORAGE_KEYS.LETTER_QUEUE);
    const queuedReports = getOfflineQueue<CitizenReport>(STORAGE_KEYS.REPORT_QUEUE);
    setPendingOfflineCount(queuedLetters.length + queuedReports.length);
  };

  useEffect(() => {
    checkPendingOffline();
  }, []);

  // Automatic synchronization when coming back online
  useEffect(() => {
    if (isOnline) {
      const queuedLetters = getOfflineQueue<LetterRequest>(STORAGE_KEYS.LETTER_QUEUE);
      const queuedReports = getOfflineQueue<CitizenReport>(STORAGE_KEYS.REPORT_QUEUE);
      const total = queuedLetters.length + queuedReports.length;

      if (total > 0) {
        queuedLetters.forEach(l => onAddLetter(l));
        queuedReports.forEach(r => onAddReport(r));
        clearOfflineQueue(STORAGE_KEYS.LETTER_QUEUE);
        clearOfflineQueue(STORAGE_KEYS.REPORT_QUEUE);
        setPendingOfflineCount(0);
        setOfflineSyncToast(`${total} draf pengajuan offline berhasil disinkronkan ke server Desa!`);
        speakText(`Koneksi internet pulih. Sebanyak ${total} data draf offline Anda telah berhasil disinkronkan.`);
        setTimeout(() => setOfflineSyncToast(null), 6000);
      }
    }
  }, [isOnline]);

  // Load saved drafts on mount or open
  useEffect(() => {
    const savedLetter = loadDraft<any>(STORAGE_KEYS.LETTER_DRAFT);
    if (savedLetter?.data) {
      if (savedLetter.data.purpose) setPurpose(savedLetter.data.purpose);
      if (savedLetter.data.letterType) setLetterType(savedLetter.data.letterType);
    }

    const savedReport = loadDraft<any>(STORAGE_KEYS.REPORT_DRAFT);
    if (savedReport?.data) {
      if (savedReport.data.reportTitle) setReportTitle(savedReport.data.reportTitle);
      if (savedReport.data.reportDesc) setReportDesc(savedReport.data.reportDesc);
      if (savedReport.data.reportCategory) setReportCategory(savedReport.data.reportCategory);
    }
  }, []);

  // Auto-save letter draft on changes
  useEffect(() => {
    if (purpose.trim() || applicantName) {
      saveDraft(STORAGE_KEYS.LETTER_DRAFT, { applicantName, letterType, purpose, rtRw });
    }
  }, [applicantName, letterType, purpose, rtRw]);

  // Auto-save report draft on changes
  useEffect(() => {
    if (reportTitle.trim() || reportDesc.trim()) {
      saveDraft(STORAGE_KEYS.REPORT_DRAFT, { reportTitle, reportCategory, reportDesc, reportLocation, reportUrgency });
    }
  }, [reportTitle, reportCategory, reportDesc, reportLocation, reportUrgency]);

  // Manual Trigger Sync
  const handleManualSync = () => {
    const queuedLetters = getOfflineQueue<LetterRequest>(STORAGE_KEYS.LETTER_QUEUE);
    const queuedReports = getOfflineQueue<CitizenReport>(STORAGE_KEYS.REPORT_QUEUE);
    const total = queuedLetters.length + queuedReports.length;

    if (total === 0) {
      setOfflineSyncToast("Semua data sudah tersinkronisasi sempurna.");
      setTimeout(() => setOfflineSyncToast(null), 3000);
      return;
    }

    queuedLetters.forEach(l => onAddLetter(l));
    queuedReports.forEach(r => onAddReport(r));
    clearOfflineQueue(STORAGE_KEYS.LETTER_QUEUE);
    clearOfflineQueue(STORAGE_KEYS.REPORT_QUEUE);
    setPendingOfflineCount(0);
    setOfflineSyncToast(`${total} data offline berhasil disinkronkan.`);
    speakText(`Sinkronisasi berhasil. ${total} berkas telah dikirim.`);
    setTimeout(() => setOfflineSyncToast(null), 5000);
  };

  const handleVoiceInputLetterPurpose = () => {
    if (isListeningLetterPurpose) {
      setIsListeningLetterPurpose(false);
      letterRecognizerRef.current?.stop();
      return;
    }
    stopSpeech();
    const recognizer = setupSpeechRecognition(
      (transcript) => {
        setPurpose(transcript);
      },
      () => setIsListeningLetterPurpose(false),
      () => setIsListeningLetterPurpose(false)
    );
    letterRecognizerRef.current = recognizer;
    if (recognizer.isSupported) {
      setIsListeningLetterPurpose(true);
      recognizer.start();
    } else {
      speakText("Fitur mikrofon belum didukung di browser ini. Silakan ketik langsung di kolom.");
    }
  };

  const handleVoiceInputReportDesc = () => {
    if (isListeningReportDesc) {
      setIsListeningReportDesc(false);
      reportRecognizerRef.current?.stop();
      return;
    }
    stopSpeech();
    const recognizer = setupSpeechRecognition(
      (transcript) => {
        setReportDesc(transcript);
      },
      () => setIsListeningReportDesc(false),
      () => setIsListeningReportDesc(false)
    );
    reportRecognizerRef.current = recognizer;
    if (recognizer.isSupported) {
      setIsListeningReportDesc(true);
      recognizer.start();
    } else {
      speakText("Fitur mikrofon belum didukung di browser ini. Silakan ketik langsung di kolom.");
    }
  };

  const handlePlayToa = (ann: BroadcastAnnouncement) => {
    if (playingAnnId === ann.id) {
      stopSpeech();
      setPlayingAnnId(null);
      return;
    }

    setPlayingAnnId(ann.id);
    const textToSpeak = `Perhatian warga sekalian. Pengumuman resmi dari ${ann.senderRole}, ${ann.senderName}. ${ann.title}. ${ann.content}. Terima kasih.`;
    speakText(
      textToSpeak,
      () => setPlayingAnnId(null),
      () => setPlayingAnnId(ann.id)
    );
  };

  const handleSubmitLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !purpose) return;

    const newLetter: LetterRequest = {
      id: `SRT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      citizenId: userContext.citizenId || (userContext.role === 'warga' ? 'WARGA-001' : undefined),
      applicantName,
      nik,
      rtRw,
      dusun: userContext.dusun,
      letterType,
      purpose,
      status: 'Menunggu Persetujuan RT',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dataClassification: 'PROTOTYPE_SIMULATION',
      accessLevel: 'RESTRICTED_PERSONAL'
    };

    if (isOnline) {
      onAddLetter(newLetter);
      clearDraft(STORAGE_KEYS.LETTER_DRAFT);
      speakText(`Pengajuan ${letterType} berhasil dikirim ke Ketua ${userContext.rt}. Anda akan mendapat notifikasi setelah diverifikasi.`);
    } else {
      queueOfflineItem(STORAGE_KEYS.LETTER_QUEUE, newLetter);
      clearDraft(STORAGE_KEYS.LETTER_DRAFT);
      checkPendingOffline();
      speakText(`Koneksi offline. Pengajuan surat telah disimpan di memori lokal dan otomatis disinkronkan saat online.`);
    }

    setShowLetterModal(false);
    setPurpose('');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc) return;

    const isDemo = reportTitle.includes('PJU Titik 04');
    const newReport: CitizenReport = {
      id: isDemo ? 'RPT-DEMO-PJU-001' : `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      citizenId: userContext.citizenId || (userContext.role === 'warga' ? 'WARGA-001' : undefined),
      title: reportTitle,
      category: reportCategory,
      reporterName: userContext.name,
      reporterPhone: userContext.phone || '0812-xxxx-xxxx',
      dusun: userContext.dusun,
      rtRw: `${userContext.rt} / ${userContext.rw}`,
      description: reportDesc,
      status: 'Menunggu Verifikasi RT',
      urgency: reportUrgency,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dataClassification: 'PROTOTYPE_SIMULATION',
      accessLevel: 'RESTRICTED_PERSONAL',
      photoUrl: reportCategory === 'Jalan Rusak' 
        ? "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600" 
        : reportCategory === 'Lampu Padam'
          ? "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600"
          : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"
    };

    if (isOnline) {
      onAddReport(newReport);
      clearDraft(STORAGE_KEYS.REPORT_DRAFT);
      speakText(`Laporan ${reportCategory} berhasil dicatat. Ketua ${userContext.rt} akan memverifikasi ke lapangan.`);
    } else {
      queueOfflineItem(STORAGE_KEYS.REPORT_QUEUE, newReport);
      clearDraft(STORAGE_KEYS.REPORT_DRAFT);
      checkPendingOffline();
      speakText(`Koneksi offline. Laporan disimpan secara lokal dan akan terkirim saat internet terhubung.`);
    }

    setShowReportModal(false);
    setReportTitle('');
    setReportDesc('');
  };

  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn: BroadcastAnnouncement = {
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      title: annTitle,
      senderRole: userContext.role === 'rt' ? 'Ketua RT' : userContext.role === 'rw' ? 'Ketua RW' : 'Kepala Desa',
      senderName: userContext.name,
      targetScope: annScope,
      content: annContent,
      date: new Date().toISOString().slice(0, 10),
      priority: 'Penting',
      category: annCategory
    };

    onAddAnnouncement(newAnn);
    setShowAnnouncementModal(false);
    setAnnTitle('');
    setAnnContent('');
    speakText(`Pengumuman berhasil disiarkan ke ${annScope}.`);
  };

  // Filtered letters and reports based on active RBAC role
  const visibleLetters: LetterRequest[] = filterRecordsByRole<LetterRequest>(letters, userContext);
  const visibleReports: CitizenReport[] = filterRecordsByRole<CitizenReport>(reports, userContext);

  const isRtOrAdmin = userContext.role === 'rt' || userContext.role === 'rw' || userContext.role === 'kades';

  const roleStyles = {
    warga: {
      bg: 'from-slate-900 via-blue-950 to-slate-900',
      border: 'border-blue-500/40',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      roleBadge: 'bg-blue-600 text-white',
      title: 'Layanan Mandiri Warga RT 02 / RW 01',
      desc: 'Buat surat keterangan pengantar RT, laporkan masalah lingkungan sekitar, dan simpan draf offline otomatis tanpa khawatir koneksi putus.'
    },
    rt: {
      bg: 'from-slate-900 via-amber-950 to-slate-900',
      border: 'border-amber-500/50',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      roleBadge: 'bg-amber-500 text-slate-950 font-black',
      title: 'Panel Otorisasi & Pelayanan Ketua RT 02',
      desc: 'Otorisasi TTD digital surat pengantar warga, disposisi aduan jalan/lampu, dan siaran Toa pengumuman warga RT 02.'
    },
    rw: {
      bg: 'from-slate-900 via-purple-950 to-slate-900',
      border: 'border-purple-500/50',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      roleBadge: 'bg-purple-600 text-white',
      title: 'Pusat Koordinasi Wilayah Ketua RW 01',
      desc: 'Koordinasi 5 RT (RT 01 s/d RT 05), monitoring ketertiban warga, dan penyelarasan usulan ke Pemerintah Desa.'
    },
    kades: {
      bg: 'from-slate-900 via-emerald-950 to-slate-900',
      border: 'border-emerald-500/50',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      roleBadge: 'bg-emerald-600 text-white',
      title: 'Pusat Administrasi Eksekutif Kepala Desa',
      desc: 'Otorisasi surat resmi desa, pengawasan seluruh pelayanan RT/RW se-Desa Talangagung.'
    }
  };

  const currentRoleStyle = roleStyles[userContext.role] || roleStyles.warga;

  return (
    <div className="space-y-6">
      {/* Offline Sync Toast Notification */}
      {offlineSyncToast && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in slide-in-from-top duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{offlineSyncToast}</span>
          </div>
          <button onClick={() => setOfflineSyncToast(null)} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role-Specific Hero Banner with Connectivity Status */}
      <div className={`p-6 rounded-3xl bg-gradient-to-r ${currentRoleStyle.bg} text-white border-2 ${currentRoleStyle.border} shadow-lg space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${currentRoleStyle.roleBadge}`}>
              Mode: {userContext.role === 'warga' ? 'Warga Lingkungan' : userContext.role === 'rt' ? 'Ketua RT 02' : userContext.role === 'rw' ? 'Ketua RW 01' : 'Kepala Desa'}
            </span>
            
            {/* Connectivity & Offline Persistence Indicator */}
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
              isOnline 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online & Terhubung' : 'Offline (Draf Tersimpan Aman)'}</span>
            </span>
          </div>

          {/* Offline Sync Controls */}
          {pendingOfflineCount > 0 && (
            <button
              onClick={handleManualSync}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sinkronkan {pendingOfflineCount} Draf Offline</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{currentRoleStyle.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">{currentRoleStyle.desc}</p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-700/60">
          <button
            onClick={() => setActiveSubTab('surat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'surat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>
              {userContext.role === 'warga' 
                ? `1. Surat Saya (${visibleLetters.length})` 
                : `1. Pengajuan Surat RT (${visibleLetters.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('laporan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'laporan'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>
              {userContext.role === 'warga'
                ? `2. Laporan Saya (${visibleReports.length})`
                : `2. Lapor Jalan & Lampu (${visibleReports.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('pengumuman')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'pengumuman'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>3. Toa Pengumuman RT ({announcements.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SURAT PENGANTAR RT */}
      {activeSubTab === 'surat' && (
        <div className="space-y-4">
          {/* Privacy & Scope Indicator Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Daftar Permohonan Surat Pengantar RT Online</h3>
                <DataClassificationBadge type="FACTUAL_VERIFIED" customText="Resmi RT & Desa" size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {userContext.role === 'warga'
                  ? '🔒 Privasi Aktif: Menampilkan permohonan surat milik Anda. NIK disamarkan sesuai prinsip pelindungan data pribadi.'
                  : userContext.role === 'rt'
                  ? `Menampilkan antrean permohonan surat warga ${userContext.rt} (Kewenangan Wilayah).`
                  : 'Pusat otorisasi dan pemantauan permohonan surat warga se-Desa Talangagung.'}
              </p>
            </div>
            <button
              onClick={() => setShowLetterModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 shrink-0 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajukan Surat Baru (Warga)</span>
            </button>
          </div>

          {visibleLetters.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Belum Ada Permohonan Surat</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {userContext.role === 'warga' 
                  ? 'Anda belum memiliki riwayat pengajuan surat keterangan. Klik tombol di atas untuk mengajukan.' 
                  : 'Tidak ada permohonan surat yang memerlukan tindakan untuk wilayah Anda saat ini.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleLetters.map((letter) => {
                const isApproved = letter.status === 'Disetujui RT' || letter.status === 'Selesai di Pemerintah Desa';
                const isPending = letter.status === 'Menunggu Persetujuan RT';

                return (
                  <div
                    key={letter.id}
                    className="bg-white border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xs transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isApproved ? 'bg-emerald-100 text-emerald-800' :
                          isPending ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {letter.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">{letter.requestedAt}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{letter.letterType}</h4>
                        <p className="text-xs text-slate-700 font-semibold mt-0.5">Pemohon: {letter.applicantName}</p>
                        <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <span>NIK:</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">{maskNIK(letter.nik)}</span>
                          <span className="text-[10px] text-slate-400" title="Data Pribadi Terlindungi">(Disamarkan)</span>
                        </p>
                        <p className="text-[11px] text-slate-500">Wilayah: {letter.rtRw} ({letter.dusun})</p>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                        <strong className="text-slate-800">Keperluan:</strong> {letter.purpose}
                      </div>
                    </div>

                    {/* Actions based on Status & Role */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isPending && isRtOrAdmin ? (
                        <button
                          onClick={() => {
                            setAuditTarget({
                              type: 'letter',
                              letter,
                              defaultNote: `Telah diperiksa dan diverifikasi kebenaran identitas pemohon oleh Ketua ${userContext.rt}. Memenuhi syarat administrasi untuk diteruskan ke Pemerintah Desa.`
                            });
                            setAuditNote(`Telah diperiksa dan diverifikasi kebenaran identitas pemohon oleh Ketua ${userContext.rt}. Memenuhi syarat administrasi untuk diteruskan ke Pemerintah Desa.`);
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Periksa & Verifikasi (Audit Trail)</span>
                        </button>
                      ) : isApproved ? (
                        <button
                          onClick={() => setSelectedLetterForQr(letter)}
                          className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>Lihat Bukti QR & Cetak Surat</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Menunggu verifikasi Ketua {userContext.rt}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LAPORAN KERUSAKAN & MASALAH RT */}
      {activeSubTab === 'laporan' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Pusat Pengaduan & Laporan Warga Berjenjang</h3>
                <DataClassificationBadge type="FACTUAL_VERIFIED" customText="Kanal Resmi RT" size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {userContext.role === 'warga'
                  ? '🔒 Privasi Aktif: Menampilkan laporan milik Anda. Kontak pelapor disamarkan untuk keamanan.'
                  : userContext.role === 'rt'
                  ? `Menampilkan laporan warga di lingkungan ${userContext.rt} yang siap diverifikasi lapangan.`
                  : 'Semua keluhan jalan, gorong-gorong, dan lampu mati diverifikasi Ketua RT sebelum dibawa ke Musrenbangdes.'}
              </p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 shrink-0 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Laporan Baru</span>
            </button>
          </div>

          {visibleReports.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Belum Ada Laporan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {userContext.role === 'warga' 
                  ? 'Anda belum membuat laporan pengaduan infrastruktur. Klik tombol di atas jika ada fasilitas rusak.' 
                  : 'Tidak ada laporan masalah yang aktif di wilayah kewenangan Anda.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleReports.map((rep) => {
                const isUrgent = rep.urgency === 'Darurat' || rep.urgency === 'Penting';
                const isPending = rep.status === 'Menunggu Verifikasi RT';
                const displayStatus = rep.status;

                return (
                  <div
                    key={rep.id}
                    className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-start gap-4">
                      {rep.photoUrl && (
                        <img
                          src={rep.photoUrl}
                          alt={rep.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            displayStatus === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                            displayStatus === 'Sedang Dikerjakan' ? 'bg-blue-100 text-blue-800' :
                            displayStatus === 'Diteruskan ke Pemerintah Desa' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {displayStatus}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Urgensi: {rep.urgency}
                          </span>

                          <span className="text-[11px] text-slate-400 font-semibold">{rep.createdAt}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{rep.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            {rep.dusun} ({rep.rtRw})
                          </span>
                          <span>Pelapor: <strong>{rep.reporterName}</strong> ({maskPhoneNumber(rep.reporterPhone)})</span>
                        </div>

                        {rep.rtNotes && (
                          <div className="p-2 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200 mt-2">
                            <strong>Catatan Verifikasi Pak RT:</strong> {rep.rtNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RT Action */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0">
                      {isPending && isRtOrAdmin && (
                        <button
                          onClick={() => {
                            setAuditTarget({
                              type: 'report',
                              report: rep,
                              defaultNote: `Contoh verifikasi lapangan simulasi oleh Ketua ${userContext.rt}. Terkonfirmasi pada skenario simulasi dan diteruskan ke Pemerintah Desa (Contoh Data B — Simulasi Prototipe).`
                            });
                            setAuditNote(`Contoh verifikasi lapangan simulasi oleh Ketua ${userContext.rt}. Terkonfirmasi pada skenario simulasi dan diteruskan ke Pemerintah Desa (Contoh Data B — Simulasi Prototipe).`);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all active:scale-95"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Periksa & Verifikasi Lapangan</span>
                        </button>
                      )}

                      <button
                        onClick={() => speakText(`Laporan: ${rep.title}. Lokasi di ${rep.dusun} ${rep.rtRw}. Keterangan: ${rep.description}`)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1"
                        title="Bacakan Laporan"
                      >
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        <span>Suara</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOA PENGUMUMAN RT & DESA */}
      {activeSubTab === 'pengumuman' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Siaran Toa Pengumuman Resmi Desa & RT</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengumuman posyandu, jadwal kerja bakti, dan bansos langsung dengan audio sintesis suara toa.
              </p>
            </div>
            {isRtOrAdmin && (
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 shrink-0 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Pengumuman Baru</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((ann) => {
              const isPlaying = playingAnnId === ann.id;

              return (
                <div
                  key={ann.id}
                  className="bg-white border-2 border-slate-200 hover:border-purple-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {ann.targetScope}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{ann.date}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{ann.title}</h4>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{ann.content}</p>
                    </div>

                    <div className="text-[11px] text-slate-500 font-semibold">
                      Pengirim: <span className="text-slate-800">{ann.senderRole} ({ann.senderName})</span>
                    </div>
                  </div>

                  {/* Toa Audio Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handlePlayToa(ann)}
                      className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs ${
                        isPlaying
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Hentikan Suara Toa ⏸️</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Dengarkan Suara Toa Warga 🔊</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Pengajuan Surat Pengantar RT with Voice & Offline Persistence */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">Form Pengantar RT Digital</h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      💾 Draf Otomatis
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Kirim permohonan surat ke Ketua RT Anda</p>
                </div>
              </div>
              <button onClick={() => setShowLetterModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pilihan Cepat 1-Sentuh Ramah Lansia & Pemuda */}
            <div className="space-y-1.5 p-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <label className="block text-xs font-bold text-blue-950">
                ⚡ Pilihan Cepat Keperluan Surat (Tinggal Klik):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLetterType('Surat Keterangan Usaha (SKU)');
                    setPurpose('Pengajuan pinjaman KUR BRI modal usaha toko kelontong RT 02');
                    speakText('Pilihan Surat Keterangan Usaha telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    letterType === 'Surat Keterangan Usaha (SKU)'
                      ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white border-blue-200 text-slate-800 hover:bg-blue-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🏪 Usaha / SKU</span>
                  <span className={`text-[10px] line-clamp-1 ${letterType === 'Surat Keterangan Usaha (SKU)' ? 'text-blue-100' : 'text-slate-500'}`}>Modal warung / bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLetterType('Surat Keterangan Tidak Mampu (SKTM)');
                    setPurpose('Permohonan beasiswa sekolah anak dan bantuan KIP');
                    speakText('Pilihan Surat SKTM Bantuan Pendidikan telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    letterType === 'Surat Keterangan Tidak Mampu (SKTM)'
                      ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white border-blue-200 text-slate-800 hover:bg-blue-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🏫 Bantuan / SKTM</span>
                  <span className={`text-[10px] line-clamp-1 ${letterType === 'Surat Keterangan Tidak Mampu (SKTM)' ? 'text-blue-100' : 'text-slate-500'}`}>Beasiswa & KIP sekolah</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLetterType('Surat Pengantar KTP/KK');
                    setPurpose('Pembuatan Kartu Tanda Penduduk baru dan pembaruan data Kartu Keluarga');
                    speakText('Pilihan Surat Pengantar KTP dan KK telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    letterType === 'Surat Pengantar KTP/KK'
                      ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white border-blue-200 text-slate-800 hover:bg-blue-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🪪 KTP & KK Baru</span>
                  <span className={`text-[10px] line-clamp-1 ${letterType === 'Surat Pengantar KTP/KK' ? 'text-blue-100' : 'text-slate-500'}`}>Cetak KTP / pisah KK</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLetterType('Surat Keterangan Domisili');
                    setPurpose('Keterangan domisili tempat tinggal menetap di wilayah RT 02 / RW 01 Dusun Krajan');
                    speakText('Pilihan Surat Domisili Tempat Tinggal telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    letterType === 'Surat Keterangan Domisili'
                      ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white border-blue-200 text-slate-800 hover:bg-blue-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🏠 Surat Domisili</span>
                  <span className={`text-[10px] line-clamp-1 ${letterType === 'Surat Keterangan Domisili' ? 'text-blue-100' : 'text-slate-500'}`}>Bukti tinggal menetap</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitLetter} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Pemohon</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK KTP</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RT / RW</label>
                  <input
                    type="text"
                    value={rtRw}
                    onChange={(e) => setRtRw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Surat yang Dibutuhkan</label>
                <select
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU Bank/Kredit)</option>
                  <option value="Surat Keterangan Domisili">Surat Keterangan Domisili Tempat Tinggal</option>
                  <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM Sekolah/KIP)</option>
                  <option value="Surat Pengantar KTP/KK">Surat Pengantar Pembuatan KTP / KK Baru</option>
                  <option value="Surat Pengantar Nikah">Surat Pengantar Nikah (N1-N4)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Keperluan Spesifik</label>
                  <button
                    type="button"
                    onClick={handleVoiceInputLetterPurpose}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-all ${
                      isListeningLetterPurpose 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isListeningLetterPurpose ? 'Mendengarkan...' : 'Ucapkan Suara 🎙️'}</span>
                  </button>
                </div>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Contoh: Pengajuan pinjaman KUR BRI untuk toko kelontong di RT 02..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isOnline ? 'Kirim Permohonan ke Pak RT' : 'Simpan Draf Offline (Auto-Sync)'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Buat Laporan Kerusakan Warga with Voice & Offline Persistence */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">Laporkan Kerusakan Fasilitas / Jalan</h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      💾 Draf Aman
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Laporan akan diteruskan ke Ketua RT & Pemerintah Desa</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo Scenario Loader */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-blue-900">Skenario Closed Knowledge Loop</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded font-bold">DATA B — SIMULASI</span>
                </div>
                <p className="text-[11px] text-blue-700">Muat data PJU Titik 04 RT 02 untuk pengujian Capture</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportTitle("[DATA B — SIMULASI] Lampu PJU Titik 04 RT 02/RW 01 Padam");
                  setReportCategory("Lampu Padam");
                  setReportUrgency("Penting");
                  setReportLocation("[DATA B — SIMULASI] Pertigaan Gang Musholla RT 02 / RW 01 Dusun Krajan");
                  setReportDesc("[DATA B — SIMULASI] Lampu penerangan jalan padam sejak kemarin malam di dekat pertigaan gang Musholla RT 02. Area jalan menjadi gelap gulita dan membahayakan pengendara motor serta pejalan kaki yang melintas saat malam hari (Contoh Data B — Simulasi Prototipe).");
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
              >
                ⚡ Muat Skenario Demo
              </button>
            </div>

            {/* Pilihan Cepat Masalah Lingkungan (1-Sentuh Ramah Warga) */}
            <div className="space-y-1.5 p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <label className="block text-xs font-bold text-amber-950">
                ⚡ Pilihan Cepat Jenis Laporan (Tinggal Klik):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReportTitle('Lampu Penerangan Jalan Gang Padam');
                    setReportCategory('Lampu Padam');
                    setReportUrgency('Penting');
                    setReportLocation('Pertigaan Gang RT 02 Dusun Krajan');
                    setReportDesc('Lampu jalan padam sejak kemarin malam sehingga area jalan menjadi gelap dan membahayakan pengendara yang melintas.');
                    speakText('Laporan Lampu Padam telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    reportCategory === 'Lampu Padam'
                      ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-xs'
                      : 'bg-white border-amber-200 text-slate-800 hover:bg-amber-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">💡 Lampu Padam</span>
                  <span className={`text-[10px] line-clamp-1 ${reportCategory === 'Lampu Padam' ? 'text-amber-100' : 'text-slate-500'}`}>Penerangan jalan mati</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReportTitle('Jalan Poros Berlubang Membahayakan');
                    setReportCategory('Jalan Rusak');
                    setReportUrgency('Penting');
                    setReportLocation('Jalan Utama Dusun Krajan RT 02');
                    setReportDesc('Terdapat lubang jalan cukup lebar dan dalam yang membahayakan pengendara sepeda motor terutama saat musim hujan.');
                    speakText('Laporan Jalan Berlubang telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    reportCategory === 'Jalan Rusak'
                      ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-xs'
                      : 'bg-white border-amber-200 text-slate-800 hover:bg-amber-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🕳️ Jalan Berlubang</span>
                  <span className={`text-[10px] line-clamp-1 ${reportCategory === 'Jalan Rusak' ? 'text-amber-100' : 'text-slate-500'}`}>Aspal rusak / berlubang</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReportTitle('Saluran Air / Got Tersumbat Sampah');
                    setReportCategory('Drainase/Banjir');
                    setReportUrgency('Penting');
                    setReportLocation('Selokan Depan Gang Musholla RT 02');
                    setReportDesc('Saluran air tersumbat endapan sampah dan lumpur, air meluap ke badan jalan saat hujan deras.');
                    speakText('Laporan Saluran Air Tersumbat telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    reportCategory === 'Drainase/Banjir'
                      ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-xs'
                      : 'bg-white border-amber-200 text-slate-800 hover:bg-amber-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🌊 Got Mampet</span>
                  <span className={`text-[10px] line-clamp-1 ${reportCategory === 'Drainase/Banjir' ? 'text-amber-100' : 'text-slate-500'}`}>Saluran air tersumbat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReportTitle('Tumpukan Sampah Liar Pinggir Jalan');
                    setReportCategory('Sampah');
                    setReportUrgency('Biasa');
                    setReportLocation('Batas Lingkungan RT 02 / RW 01');
                    setReportDesc('Ada tumpukan sampah liar di tepi jalan yang belum terangkut dan menimbulkan bau kurang sedap.');
                    speakText('Laporan Tumpukan Sampah telah dipilih.');
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    reportCategory === 'Sampah'
                      ? 'bg-amber-500 text-white font-bold border-amber-600 shadow-xs'
                      : 'bg-white border-amber-200 text-slate-800 hover:bg-amber-100/60'
                  }`}
                >
                  <span className="block font-extrabold text-xs">🗑️ Sampah Liar</span>
                  <span className={`text-[10px] line-clamp-1 ${reportCategory === 'Sampah' ? 'text-amber-100' : 'text-slate-500'}`}>Tumpukan sampah kotor</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Masalah</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Contoh: Aspal Jalan Poros Berlubang Dekat Jembatan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Jalan Rusak">Jalan Rusak / Berlubang</option>
                    <option value="Drainase/Banjir">Drainase / Saluran Tersumbat</option>
                    <option value="Lampu Padam">Lampu Jalan Padam</option>
                    <option value="Sampah">Tumpukan Sampah Liar</option>
                    <option value="Keamanan">Keamanan / Pos Ronda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Urgensi</label>
                  <select
                    value={reportUrgency}
                    onChange={(e) => setReportUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Penting">Penting (Perlu Ditinjau Segera)</option>
                    <option value="Biasa">Biasa (Pemeliharaan Berkala)</option>
                    <option value="Darurat">Darurat (Membahayakan Jiwa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Detail</label>
                <input
                  type="text"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Penjelasan Detail Kerusakan</label>
                  <button
                    type="button"
                    onClick={handleVoiceInputReportDesc}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-all ${
                      isListeningReportDesc 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isListeningReportDesc ? 'Mendengarkan...' : 'Ceritakan Suara 🎙️'}</span>
                  </button>
                </div>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Jelaskan kondisi jalan, panjang lubang, atau dampak bagi pengendara..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isOnline ? 'Kirim Laporan Kerusakan' : 'Simpan Laporan Offline (Auto-Sync)'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Broadcast Toa RT */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Broadcast Toa Pengumuman</h3>
                  <p className="text-[11px] text-slate-500">Siarkan informasi penting ke warga</p>
                </div>
              </div>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Posyandu Balita RT 02"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sasaran Wilayah</label>
                  <select
                    value={annScope}
                    onChange={(e) => setAnnScope(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Warga RT 02">Khusus Warga RT 02</option>
                    <option value="Warga RT 05">Khusus Warga RT 05</option>
                    <option value="Warga RW 01">Seluruh RW 01</option>
                    <option value="Semua Warga Desa">Seluruh Warga Desa Talangagung</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Posyandu">Posyandu & Kesehatan</option>
                    <option value="Kerja Bakti">Kerja Bakti & Gotong Royong</option>
                    <option value="Bansos">Bansos & Bantuan Pangan</option>
                    <option value="Keamanan">Ronda & Keamanan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Naskah Pengumuman (Akan Dibacakan Suara Toa)</label>
                <textarea
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Tuliskan tanggal, waktu, lokasi, dan perlengkapan yang perlu dibawa warga..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Siarkan Pengumuman Sekarang 📢</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QR Code Surat Pengantar Terverifikasi */}
      {selectedLetterForQr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900">Stempel QR Digital RT</span>
              <button onClick={() => setSelectedLetterForQr(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex justify-center border border-slate-200">
              <QRCodeSVG 
                value={`DESA-TALANGAGUNG-${selectedLetterForQr.id}-${selectedLetterForQr.rtStampCode || 'VERIFIED'}`} 
                size={160}
                bgColor="#f8fafc"
                fgColor="#0f172a"
                level="Q"
              />
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-slate-900">{selectedLetterForQr.letterType}</h4>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedLetterForQr.applicantName}</p>
              <p className="text-[11px] font-mono text-emerald-700 font-bold mt-1">
                Kode Stempel: {selectedLetterForQr.rtStampCode || 'RT02-RW01-VERIFIED'}
              </p>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 border border-emerald-200">
              ✓ Telah diverifikasi resmi oleh Ketua RT. Dokumen ini sah untuk diproses lebih lanjut di Kantor Pemerintah Desa Talangagung.
            </div>

            <button
              onClick={() => {
                speakText(`Surat pengantar ${selectedLetterForQr.letterType} untuk ${selectedLetterForQr.applicantName} berstatus sah.`);
                setSelectedLetterForQr(null);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Audit Trail & Otorisasi Verifikasi Lapangan */}
      {auditTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Pemeriksaan & Verifikasi Otoritas RT</h3>
                  <p className="text-[11px] text-slate-500">Pencatatan Jejak Audit Resmi (Audit Trail Log)</p>
                </div>
              </div>
              <button onClick={() => setAuditTarget(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {auditTarget.type === 'letter' && auditTarget.letter && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{auditTarget.letter.letterType}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                      {auditTarget.letter.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>Pemohon: <strong className="text-slate-800">{auditTarget.letter.applicantName}</strong></p>
                    <p>NIK: <span className="font-mono font-bold text-slate-700">{maskNIK(auditTarget.letter.nik)}</span></p>
                    <p>Wilayah: <strong>{auditTarget.letter.rtRw}</strong></p>
                    <p>Dusun: <strong>{auditTarget.letter.dusun}</strong></p>
                  </div>
                  <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                    <strong className="text-slate-900">Keperluan:</strong> {auditTarget.letter.purpose}
                  </div>
                </>
              )}

              {auditTarget.type === 'report' && auditTarget.report && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{auditTarget.report.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                      {auditTarget.report.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <p>Pelapor: <strong className="text-slate-800">{auditTarget.report.reporterName}</strong></p>
                    <p>Kontak: <span className="font-mono font-bold text-slate-700">{maskPhoneNumber(auditTarget.report.reporterPhone)}</span></p>
                    <p>Wilayah: <strong>{auditTarget.report.rtRw}</strong></p>
                    <p>Kategori: <strong>{auditTarget.report.category}</strong></p>
                  </div>
                  <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                    <strong className="text-slate-900">Deskripsi:</strong> {auditTarget.report.description}
                  </div>
                </>
              )}
            </div>

            {/* Audit Log Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Petugas Verifikator:</span>
                <span className="font-bold text-slate-900">{userContext.name} ({userContext.role.toUpperCase()})</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Perubahan Status:</span>
                <span className="font-bold text-emerald-700">
                  {auditTarget.type === 'letter' ? 'Disetujui RT (Diteruskan ke Pemerintah Desa)' : 'Diteruskan ke Pemerintah Desa'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Catatan Verifikasi Lapangan & Dasar Persetujuan:
                </label>
                <textarea
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Tuliskan catatan hasil pengecekan berkas atau kondisi fisik di lapangan..."
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setAuditTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (auditTarget.type === 'letter' && auditTarget.letter) {
                    const code = `RT-STAMP-${Math.floor(1000 + Math.random() * 9000)}`;
                    onApproveLetter(auditTarget.letter.id, code, auditNote);
                    speakText(`Surat ${auditTarget.letter.letterType} milik ${auditTarget.letter.applicantName} berhasil diverifikasi dan disetujui dengan catatan resmi.`);
                  } else if (auditTarget.type === 'report' && auditTarget.report) {
                    onVerifyReport(auditTarget.report.id, auditNote);
                    speakText(`Laporan ${auditTarget.report.title} berhasil diverifikasi dan diteruskan ke Pemerintah Desa.`);
                  }
                  setAuditTarget(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi Verifikasi & TTD Digital</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
