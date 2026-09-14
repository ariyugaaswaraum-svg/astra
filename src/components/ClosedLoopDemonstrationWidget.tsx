import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Play, 
  ChevronRight, 
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Check,
  UserCheck,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Compass,
  HelpCircle,
  ListChecks,
  Bot
} from 'lucide-react';
import { 
  ClosedLoopState, 
  getClosedLoopProgress, 
  ClosedLoopStepInfo, 
  transitionReportStatus,
  resetDemoScenario,
  subscribeToClosedLoop,
  getClosedLoopState,
  getLastStorageError,
  executeRememberStep,
  executeRetrieveStep
} from '../utils/closedLoopStore';
import { evaluateClosedLoop24Tests } from '../utils/closedLoopTestSuite';
import { UserContext, UserRoleType } from '../types';
import { ClosedLoopAuditModal } from './ClosedLoopAuditModal';

interface ClosedLoopDemonstrationWidgetProps {
  currentUserContext: UserContext;
  onNavigateToTab: (tabId: string, customRole?: UserRoleType) => void;
  onChangeUserContext: (ctx: UserContext) => void;
  onTriggerReportModal?: () => void;
  compact?: boolean;
}

export const ClosedLoopDemonstrationWidget: React.FC<ClosedLoopDemonstrationWidgetProps> = ({
  currentUserContext,
  onNavigateToTab,
  onChangeUserContext,
  onTriggerReportModal,
  compact = false
}) => {
  const [closedLoopState, setClosedLoopState] = useState<ClosedLoopState>(getClosedLoopState());
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditModalTab, setAuditModalTab] = useState<'audit' | 'testsuite'>('testsuite');
  const [isExpanded, setIsExpanded] = useState(!compact && currentUserContext.role !== 'warga');
  const [showManualGuide, setShowManualGuide] = useState(true);

  useEffect(() => {
    const unsub = subscribeToClosedLoop((st) => {
      setClosedLoopState(st);
    });
    return () => unsub();
  }, []);

  const progressSteps = getClosedLoopProgress(closedLoopState);

  const roleContexts: Record<UserRoleType, Partial<UserContext>> = {
    warga: { id: 'ctx-warga-1', citizenId: 'WARGA-001', role: 'warga', name: 'Pak Budi Santoso', rt: '02', rw: '01', dusun: 'Dusun 1 (Krajan)' },
    rt: { id: 'ctx-rt-1', role: 'rt', name: 'Pak RT Ahmad Fauzi', rt: '02', rw: '01', dusun: 'Dusun 1 (Krajan)' },
    rw: { id: 'ctx-rw-1', role: 'rw', name: 'Pak RW Sugeng Widodo', rt: '00', rw: '01', dusun: 'Dusun 1 (Krajan)' },
    perangkat: { id: 'ctx-perangkat-1', role: 'perangkat', name: 'Ibu Siti Rahma, S.AP (Kaur Umum & TU)', rt: '01', rw: '01', dusun: 'Dusun 1 (Krajan)' },
    kades: { id: 'ctx-kades-1', role: 'kades', name: 'Drs. H. Bambang Suwondo (Kepala Desa)', rt: '01', rw: '01', dusun: 'Dusun 1 (Krajan)' }
  };

  const navigateToRoleAndTab = (targetRole: UserRoleType, targetTab: string, stepNum?: number) => {
    if (targetRole !== currentUserContext.role) {
      const newCtx = roleContexts[targetRole];
      if (newCtx) {
        onChangeUserContext({
          ...currentUserContext,
          ...newCtx
        } as UserContext);
      }
    }

    if (stepNum === 1 && closedLoopState.status === 'DRAFT' && onTriggerReportModal) {
      onTriggerReportModal();
    }

    onNavigateToTab(targetTab, targetRole);
  };

  const handleStepAction = (step: ClosedLoopStepInfo) => {
    navigateToRoleAndTab(step.targetRole, step.targetTab, step.stepNumber);
  };

  const getHumanFriendlyStatus = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Draf Laporan Warga';
      case 'SUBMITTED':
      case 'RT_VERIFICATION': return 'Pemeriksaan Lapangan RT 02';
      case 'VERIFIED_BY_RT':
      case 'VILLAGE_REVIEW': return 'Proses Fasilitas Desa';
      case 'ANALYZED': return 'Menunggu Putusan Kades';
      case 'DECISION_RECORDED': return 'Disetujui Kepala Desa';
      case 'ACTION_IN_PROGRESS': return 'Perbaikan di Lapangan';
      case 'RESOLVED': return 'Perbaikan Selesai';
      case 'RECORDED_IN_MEMORY': return 'Tuntas & Dicatat di Memori Desa';
      default: return status;
    }
  };

  // Guide calculation based on current state
  const getNextActionGuide = () => {
    const s = closedLoopState.status;
    if (s === 'DRAFT') {
      return {
        stepNum: 1,
        roleName: 'Warga (Pak Budi Santoso)',
        roleTag: 'warga' as UserRoleType,
        tabTag: 'rtwarga',
        actionDetail: 'Buka formulir lapor warga dan kirim laporan fasilitas lampu jalan padam.',
        btnText: 'Buka Formulir Lapor Warga'
      };
    } else if (s === 'SUBMITTED' || s === 'RT_VERIFICATION') {
      return {
        stepNum: 2,
        roleName: 'Ketua RT 02 (Pak Ahmad Fauzi)',
        roleTag: 'rt' as UserRoleType,
        tabTag: 'rtwarga',
        actionDetail: 'Periksa laporan warga di meja RT 02, cek kondisi fisik di lapangan, lalu setujui penerusan.',
        btnText: 'Buka Meja Verifikasi RT 02'
      };
    } else if (s === 'VERIFIED_BY_RT' || s === 'VILLAGE_REVIEW') {
      if (!closedLoopState.rememberRecord?.isLinked) {
        return {
          stepNum: 3,
          roleName: 'Perangkat Desa (Kaur Umum & TU)',
          roleTag: 'perangkat' as UserRoleType,
          tabTag: 'assets',
          actionDetail: 'Hubungkan laporan warga ke data fasilitas Lampu PJU Titik 04 RT 02.',
          btnText: 'Hubungkan ke Data Lampu PJU'
        };
      } else if (!closedLoopState.retrievalRecord) {
        return {
          stepNum: 4,
          roleName: 'Perangkat Desa (Kaur Umum & TU)',
          roleTag: 'perangkat' as UserRoleType,
          tabTag: 'assets',
          actionDetail: 'Periksa riwayat pemeliharaan sebelumnya dan kebutuhan suku cadang lampu.',
          btnText: 'Lihat Riwayat Servis & Suku Cadang'
        };
      } else {
        return {
          stepNum: 5,
          roleName: 'Perangkat Desa (Kaur Umum & TU)',
          roleTag: 'perangkat' as UserRoleType,
          tabTag: 'assets',
          actionDetail: 'Hitung estimasi biaya perbaikan dan skor urgensi penanganan.',
          btnText: 'Hitung Rekomendasi Solusi & Biaya'
        };
      }
    } else if (s === 'ANALYZED') {
      return {
        stepNum: 4,
        roleName: 'Kepala Desa (Drs. H. Bambang Suwondo)',
        roleTag: 'kades' as UserRoleType,
        tabTag: 'dss',
        actionDetail: 'Buka dashboard Mata Elang untuk meninjau rekomendasi dan menyetujui perbaikan.',
        btnText: 'Buka Meja Persetujuan Kepala Desa'
      };
    } else if (s === 'DECISION_RECORDED' || s === 'ACTION_IN_PROGRESS') {
      return {
        stepNum: 5,
        roleName: 'Pelaksana Teknis Lapangan',
        roleTag: 'perangkat' as UserRoleType,
        tabTag: 'preventive',
        actionDetail: 'Buka tugas pemeliharaan, ganti suku cadang bohlam & starter baru, lalu selesaikan perbaikan.',
        btnText: 'Buka Pelaksanaan Perbaikan'
      };
    } else if (s === 'RESOLVED') {
      return {
        stepNum: 6,
        roleName: 'Perangkat Desa & Tim Arsip',
        roleTag: 'perangkat' as UserRoleType,
        tabTag: 'assets',
        actionDetail: 'Periksa catatan perbaikan di buku memori desa untuk memastikan data tersimpan rapi.',
        btnText: 'Lihat Pencatatan Memori Desa'
      };
    } else {
      return {
        stepNum: 7,
        roleName: 'Warga / Siapa Saja',
        roleTag: 'warga' as UserRoleType,
        tabTag: 'assistant',
        actionDetail: 'Tanyakan status dan riwayat penanganan lampu jalan kepada Asisten AI Desa.',
        btnText: 'Tanya Asisten AI Desa'
      };
    }
  };

  const nextGuide = getNextActionGuide();

  const manualSteps = [
    {
      step: 1,
      role: 'Warga',
      title: 'Langkah 1 — Warga',
      action: 'Buka formulir lapor warga dan kirim laporan fasilitas lampu padam.',
      targetRole: 'warga' as UserRoleType,
      targetTab: 'rtwarga',
      isCurrent: closedLoopState.status === 'DRAFT',
      isDone: closedLoopState.status !== 'DRAFT'
    },
    {
      step: 2,
      role: 'Ketua RT 02',
      title: 'Langkah 2 — Ketua RT 02',
      action: 'Periksa laporan warga di meja RT 02, cek kondisi fisik di lapangan, lalu setujui penerusan.',
      targetRole: 'rt' as UserRoleType,
      targetTab: 'rtwarga',
      isCurrent: closedLoopState.status === 'SUBMITTED' || closedLoopState.status === 'RT_VERIFICATION',
      isDone: ['VERIFIED_BY_RT', 'VILLAGE_REVIEW', 'ANALYZED', 'DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(closedLoopState.status)
    },
    {
      step: 3,
      role: 'Perangkat Desa',
      title: 'Langkah 3 — Perangkat Desa',
      action: 'Hubungkan laporan ke data lampu jalan, periksa riwayat servis, dan hitung estimasi biaya.',
      targetRole: 'perangkat' as UserRoleType,
      targetTab: 'assets',
      isCurrent: closedLoopState.status === 'VERIFIED_BY_RT' || closedLoopState.status === 'VILLAGE_REVIEW',
      isDone: ['ANALYZED', 'DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(closedLoopState.status)
    },
    {
      step: 4,
      role: 'Kepala Desa',
      title: 'Langkah 4 — Kepala Desa',
      action: 'Tinjau rekomendasi dan berikan persetujuan perbaikan fasilitas melalui Mata Elang.',
      targetRole: 'kades' as UserRoleType,
      targetTab: 'dss',
      isCurrent: closedLoopState.status === 'ANALYZED',
      isDone: ['DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(closedLoopState.status)
    },
    {
      step: 5,
      role: 'Pelaksana Teknis',
      title: 'Langkah 5 — Pelaksana Teknis',
      action: 'Laksanakan perbaikan suku cadang di lapangan dan pastikan lampu kembali menyala normal.',
      targetRole: 'perangkat' as UserRoleType,
      targetTab: 'preventive',
      isCurrent: closedLoopState.status === 'DECISION_RECORDED' || closedLoopState.status === 'ACTION_IN_PROGRESS',
      isDone: ['RESOLVED', 'RECORDED_IN_MEMORY'].includes(closedLoopState.status)
    },
    {
      step: 6,
      role: 'Buku Arsip Desa',
      title: 'Langkah 6 — Arsip Desa',
      action: 'Data perbaikan tersimpan rapi dan menjadi bagian dari riwayat aset desa.',
      targetRole: 'perangkat' as UserRoleType,
      targetTab: 'assets',
      isCurrent: closedLoopState.status === 'RESOLVED',
      isDone: closedLoopState.status === 'RECORDED_IN_MEMORY'
    },
    {
      step: 7,
      role: 'Asisten AI Desa',
      title: 'Langkah 7 — Asisten AI',
      action: 'Warga dapat menanyakan status dan riwayat perbaikan kepada Asisten AI kapan saja.',
      targetRole: 'warga' as UserRoleType,
      targetTab: 'assistant',
      isCurrent: closedLoopState.status === 'RECORDED_IN_MEMORY',
      isDone: false
    }
  ];

  const getStepStatusBadge = (stepStatus: 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai') => {
    switch (stepStatus) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-600" />
            Selesai
          </span>
        );
      case 'Sedang Berjalan':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            Tahap Aktif
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Belum Dimulai
          </span>
        );
    }
  };

  // Determine current active step info for guide
  const activeStep = progressSteps.find(s => s.status === 'Sedang Berjalan') || progressSteps[progressSteps.length - 1];

  return (
    <div 
      id="closed-loop-demo-widget"
      className="bg-white border-2 border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 text-slate-900 transition-all"
    >
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Alur Terpadu Penanganan Fasilitas Desa
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                Mode Percontohan
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kasus: <strong className="text-slate-800 font-semibold">{closedLoopState.scenarioName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
          <button
            onClick={() => {
              setAuditModalTab('testsuite');
              setShowAuditModal(true);
            }}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border border-indigo-200 shadow-2xs"
          >
            <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
            <span>Standar Pelayanan ({evaluateClosedLoop24Tests(closedLoopState).passedCount}/24)</span>
          </button>

          <button
            onClick={() => {
              setAuditModalTab('audit');
              setShowAuditModal(true);
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Riwayat Aktivitas ({closedLoopState.auditTrail.length})</span>
          </button>

          <button
            onClick={() => {
              resetDemoScenario();
            }}
            title="Mulai Ulang Alur Percontohan dari Awal"
            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-bold transition-all"
            title={isExpanded ? 'Ciutkan' : 'Bentangkan'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Storage Alert Banner if any storage error occurs */}
      {getLastStorageError() && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <strong>Pemberitahuan Penyimpanan Sesi:</strong> {getLastStorageError()}. Data skenario simulasi tetap berjalan normal di memori aplikasi.
          </div>
        </div>
      )}

      {/* Progress Line & Step Grid */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {progressSteps.map((step) => {
              const isCurrent = step.status === 'Sedang Berjalan';
              const isDone = step.status === 'Selesai';

              return (
                <div 
                  key={step.stepNumber}
                  className={`p-3 rounded-2xl border text-xs flex flex-col justify-between gap-2 transition-all ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' 
                      : isCurrent 
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 opacity-80'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] ${
                          isDone 
                            ? 'bg-emerald-600 text-white' 
                            : isCurrent 
                            ? 'bg-amber-500 text-slate-950 font-bold' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {step.stepNumber}
                        </span>
                        <span className="font-extrabold text-[11px] text-slate-900">
                          {step.stepNumber === 1 && 'Lapor Warga'}
                          {step.stepNumber === 2 && 'Cek RT 02'}
                          {step.stepNumber === 3 && 'Data Fasilitas'}
                          {step.stepNumber === 4 && 'Riwayat Servis'}
                          {step.stepNumber === 5 && 'Solusi & Biaya'}
                          {step.stepNumber === 6 && 'Putusan Kades'}
                          {step.stepNumber === 7 && 'Perbaikan'}
                          {step.stepNumber === 8 && 'Buku Memori'}
                        </span>
                      </div>
                      {getStepStatusBadge(step.status)}
                    </div>

                    <h4 className="font-bold text-[11px] text-slate-900 leading-snug">
                      {step.title}
                    </h4>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      {step.actorRole}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStepAction(step)}
                    className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                      isDone 
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
                        : isCurrent 
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-xs' 
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{isDone ? 'Lihat Bukti' : isCurrent ? 'Kerjakan Tahap Ini' : 'Buka Halaman'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Panel: Panduan Langkah Alur Pelayanan Desa */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-white tracking-wide">
                    Panduan Alur Pelayanan Fasilitas Desa
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ikuti langkah berikut untuk menguji penanganan laporan warga dari awal hingga tuntas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowManualGuide(!showManualGuide)}
                className="self-end sm:self-center px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 border border-slate-700"
              >
                <span>{showManualGuide ? 'Sembunyikan Rincian' : 'Lihat 7 Langkah'}</span>
                {showManualGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Kotak Peran & Tindakan Berikutnya Terpilih */}
            <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                    Peran Berikutnya:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-white font-black text-xs">
                    {nextGuide.roleName}
                  </span>
                </div>
                <div className="text-xs text-slate-200">
                  <strong className="text-amber-300">Tindakan Berikutnya:</strong> {nextGuide.actionDetail}
                </div>
              </div>

              <button
                onClick={() => {
                  if (closedLoopState.status === 'VERIFIED_BY_RT') {
                    if (!closedLoopState.rememberRecord?.isLinked) {
                      executeRememberStep({ name: 'Ibu Siti Rahma, S.AP', role: 'Kaur Umum & TU', actorId: 'PRG-001' });
                    } else if (!closedLoopState.retrievalRecord) {
                      executeRetrieveStep({ name: 'Ibu Siti Rahma, S.AP', role: 'Kaur Umum & TU', actorId: 'PRG-001' });
                    } else {
                      transitionReportStatus(
                        'ANALYZED',
                        { name: 'Sistem Desa Black Box AI', role: 'Decision Support Engine', roleType: 'perangkat' },
                        'Analisis aturan deterministik dan skor prioritas 88/100'
                      );
                    }
                  }
                  navigateToRoleAndTab(nextGuide.roleTag, nextGuide.tabTag, nextGuide.stepNum);
                }}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{nextGuide.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7 Langkah Rinci */}
            {showManualGuide && (
              <div className="pt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {manualSteps.map((st) => (
                  <div
                    key={st.step}
                    onClick={() => navigateToRoleAndTab(st.targetRole, st.targetTab, st.step)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      st.isCurrent
                        ? 'bg-amber-500/15 border-amber-400/50 text-white ring-1 ring-amber-400/30'
                        : st.isDone
                        ? 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                        : 'bg-slate-800/20 border-slate-800 text-slate-500 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 ${
                      st.isCurrent
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : st.isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {st.isDone ? '✓' : st.step}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold text-xs ${st.isCurrent ? 'text-amber-300' : st.isDone ? 'text-slate-300' : 'text-slate-400'}`}>
                          {st.title}
                        </span>
                        {st.isCurrent && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                            AKTIF
                          </span>
                        )}
                        {st.isDone && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            SELESAI
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug line-clamp-2 text-slate-300/80">
                        {st.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 rounded-2xl border border-indigo-100">
            <div className="text-xs text-slate-700 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-900">Tahap Saat Ini:</span>
                <span className="font-semibold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                  {getHumanFriendlyStatus(closedLoopState.status)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ganti peran kapan saja lewat menu kanan atas — data dan riwayat penanganan tetap terhubung rapi.
              </p>
            </div>

            {closedLoopState.status !== 'RECORDED_IN_MEMORY' ? (
              <div className="flex flex-wrap items-center gap-2">
                {closedLoopState.status === 'VERIFIED_BY_RT' && !closedLoopState.rememberRecord?.isLinked && (
                  <button
                    onClick={() => {
                      executeRememberStep({ name: 'Ibu Siti Rahma, S.AP', role: 'Kaur Umum & TU', actorId: 'PRG-001' });
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Hubungkan ke Data Lampu PJU Titik 04</span>
                  </button>
                )}
                {closedLoopState.status === 'VERIFIED_BY_RT' && closedLoopState.rememberRecord?.isLinked && !closedLoopState.retrievalRecord && (
                  <button
                    onClick={() => {
                      executeRetrieveStep({ name: 'Ibu Siti Rahma, S.AP', role: 'Kaur Umum & TU', actorId: 'PRG-001' });
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Lihat Riwayat Servis & Suku Cadang</span>
                  </button>
                )}
                {closedLoopState.status === 'VERIFIED_BY_RT' && closedLoopState.rememberRecord?.isLinked && closedLoopState.retrievalRecord && (
                  <button
                    onClick={() => {
                      transitionReportStatus(
                        'ANALYZED',
                        { name: 'Sistem Desa Black Box AI', role: 'Decision Support Engine', roleType: 'perangkat' },
                        'Analisis aturan deterministik dan skor prioritas 88/100'
                      );
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Hitung Rekomendasi Solusi & Biaya</span>
                  </button>
                )}
                {closedLoopState.status !== 'VERIFIED_BY_RT' && (
                  <button
                    onClick={() => handleStepAction(activeStep)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>
                      {closedLoopState.status === 'DRAFT' && 'Buka Formulir Lapor Warga'}
                      {(closedLoopState.status === 'SUBMITTED' || closedLoopState.status === 'RT_VERIFICATION') && 'Buka Meja Verifikasi (RT 02)'}
                      {closedLoopState.status === 'ANALYZED' && 'Buka Persetujuan Kepala Desa'}
                      {closedLoopState.status === 'DECISION_RECORDED' && 'Buka Tugas Pemeliharaan (Teknisi)'}
                      {closedLoopState.status === 'ACTION_IN_PROGRESS' && 'Selesaikan Perbaikan & Catat ke Memori'}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Tersimpan di Memori Desa</span>
                </span>
                <button
                  onClick={() => {
                    localStorage.setItem('desa_assistant_platform_mode', 'web');
                    onNavigateToTab('assistant', 'warga');
                  }}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Tanya Asisten AI Desa</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Modal */}
      <ClosedLoopAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        state={closedLoopState}
        onResetDemo={resetDemoScenario}
        initialTab={auditModalTab}
      />
    </div>
  );
};
