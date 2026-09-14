import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Boxes, 
  Wrench, 
  Clock, 
  Check, 
  Copy, 
  SendHorizontal, 
  Layers, 
  ArrowUpRight, 
  Activity, 
  MapPin, 
  BarChart3, 
  SlidersHorizontal,
  X,
  Volume2,
  VolumeX,
  Building2,
  FileCheck,
  Flame,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  DecisionRecommendation, 
  VillageProfile, 
  AssetItem, 
  DocumentItem, 
  HumanMemory, 
  CitizenReport, 
  LetterRequest 
} from '../types';
import { speakText, stopSpeech } from '../utils/speech';
import { MataElangFourPillars } from './MataElangFourPillars';
import { useClosedLoopState, transitionReportStatus } from '../utils/closedLoopStore';
import { DataClassificationBadge } from './DataClassificationBadge';

interface MataElangProps {
  recommendations: DecisionRecommendation[];
  villageProfile: VillageProfile;
  assets: AssetItem[];
  documents: DocumentItem[];
  memories: HumanMemory[];
  reports?: CitizenReport[];
  letters?: LetterRequest[];
  onAddRecommendation: (rec: DecisionRecommendation) => void;
  onNavigateTab?: (tab: string) => void;
}

export const MataElangExecutiveDashboard: React.FC<MataElangProps> = ({
  recommendations,
  villageProfile,
  assets,
  documents,
  memories,
  reports = [],
  letters = [],
  onAddRecommendation,
  onNavigateTab
}) => {
  const [focusArea, setFocusArea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedProposalModal, setSelectedProposalModal] = useState<DecisionRecommendation | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [activeExecutiveTab, setActiveExecutiveTab] = useState<'4pilar' | 'ringkasan' | 'infrastruktur' | 'aset' | 'pelayanan' | 'aduan'>('4pilar');

  const clState = useClosedLoopState();

  // Calculations for executive metrics
  const totalAssetValue = useMemo(() => assets.reduce((acc, a) => acc + (a.estimatedValue || 0), 0), [assets]);
  const damagedAssets = useMemo(() => assets.filter(a => a.condition !== 'Baik'), [assets]);
  const healthyAssetsCount = useMemo(() => assets.filter(a => a.condition === 'Baik').length, [assets]);
  const assetHealthPercentage = Math.round((healthyAssetsCount / (assets.length || 1)) * 100);

  const completedLetters = useMemo(() => letters.filter(l => l.status === 'Selesai di Pemerintah Desa' || l.status === 'Disetujui RT').length, [letters]);
  const letterEfficiencyRate = Math.round((completedLetters / (letters.length || 1)) * 100);

  const resolvedReports = useMemo(() => reports.filter(r => r.status === 'Selesai').length, [reports]);
  const activeReports = useMemo(() => reports.filter(r => r.status !== 'Selesai'), [reports]);
  const reportResolutionRate = Math.round((resolvedReports / (reports.length || 1)) * 100);

  const handleSpeakRecommendation = (id: string, textToRead: string) => {
    if (activeSpeakingId === id) {
      stopSpeech();
      setActiveSpeakingId(null);
      return;
    }

    stopSpeech();
    setActiveSpeakingId(id);
    speakText(
      textToRead,
      () => setActiveSpeakingId(null),
      () => setActiveSpeakingId(id)
    );
  };

  const handleGenerateAiRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/decision-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusArea: focusArea || 'Prioritas Pembangunan RKP Desa 2027',
          villageState: {
            profile: villageProfile,
            damagedAssets: assets.filter(a => a.condition !== 'Baik'),
            recentDocs: documents.slice(0, 3),
            recentMemories: memories.slice(0, 3)
          }
        })
      });

      const resData = await response.json();
      if (resData.success) {
        const r = resData.recommendation;
        const newRec: DecisionRecommendation = {
          id: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: r.title || 'Usulan Prioritas Pembangunan AI',
          category: r.category || 'Infrastruktur',
          urgencyScore: r.urgencyScore || 88,
          urgencyLevel: (r.urgencyLevel as any) || 'Sangat Tinggi',
          estimatedBudget: r.estimatedBudget || 55000000,
          rationale: r.rationale || 'Dihasilkan berdasarkan analisis AI silang memori desa.',
          sourceAssets: r.sourceAssets || ['Aset Desa Talangagung'],
          sourceDocs: r.sourceDocs || ['Dokumen APBDes / RPJMDes'],
          sourceMemories: r.sourceMemories || ['Memori Tokoh Desa'],
          citizenImpact: r.citizenImpact || 'Mempercepat pertumbuhan ekonomi dan kenyamanan warga.',
          draftProposalText: r.draftProposalText || 'USULAN RKP DESA: Pelaksanaan perbaikan infrastruktur prioritas.',
          status: 'Draf AI'
        };

        onAddRecommendation(newRec);
        setFocusArea('');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghasilkan analisis rekomendasi AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyProposal = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-200">
      {/* Executive Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/40 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-md font-black text-[10px] uppercase tracking-wider">
                Executive Decision Support System
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                MATA ELANG DESA — Dashboard Kepala Desa
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Pusat analitik kepemimpinan strategis {villageProfile.name} untuk memantau 4 pilar utama: <strong>Infrastruktur</strong>, <strong>Aset</strong>, <strong>Pelayanan Publik</strong>, dan <strong>Pengaduan Warga</strong> secara terintegrasi real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
          <div className="bg-slate-800/80 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-slate-300 block uppercase">Alokasi APBDes 2026</span>
            <span className="text-base sm:text-lg font-black text-emerald-300">
              Rp {(villageProfile.apbdesTotal / 1000000000).toFixed(2)} Miliar
            </span>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-400/40 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-emerald-200 block uppercase">Valuasi Aset Total</span>
            <span className="text-base sm:text-lg font-black text-white">
              Rp {(totalAssetValue / 1000000).toFixed(0)} Juta
            </span>
          </div>
        </div>
      </div>

      {/* Closed Knowledge Loop Decision Card for Kades */}
      {clState.status !== 'DRAFT' && clState.status !== 'SUBMITTED' && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Persetujuan Kepala Desa — Perbaikan Fasilitas
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Layanan Terpadu
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Fasilitas: <strong>{clState.asset.name}</strong> • Status:{' '}
                  <span className="font-bold text-indigo-700">
                    {clState.status === 'ANALYZED' 
                      ? 'Menunggu Persetujuan Kades' 
                      : clState.status === 'DECISION_RECORDED' 
                      ? 'Disetujui Kepala Desa' 
                      : clState.status === 'ACTION_IN_PROGRESS' 
                      ? 'Dalam Pengerjaan Lapangan' 
                      : clState.status === 'RESOLVED' 
                      ? 'Pekerjaan Selesai' 
                      : clState.status === 'RECORDED_IN_MEMORY' 
                      ? 'Tercatat di Memori Desa' 
                      : 'Dalam Proses'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                Tingkat Urgensi: {clState.analysis?.priorityScore || 88}/100 (Prioritas Tinggi)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Laporan Warga & Verifikasi RT</span>
              <p className="font-bold text-slate-800">{clState.report.title}</p>
              <p className="text-slate-600 text-[11px] line-clamp-2">{clState.report.rtNotes || 'Diverifikasi langsung oleh Ketua RT 02.'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Rekomendasi Solusi & Anggaran</span>
              <p className="font-bold text-slate-800">{clState.analysis?.recommendedAlternative || 'Penggantian Starter & Bohlam LED 50W'}</p>
              <p className="text-slate-600 text-[11px]">Estimasi Biaya: <strong>Rp {(clState.analysis?.estimatedCost || 150000).toLocaleString('id-ID')}</strong></p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Tindakan Kepala Desa</span>
              {clState.status === 'ANALYZED' ? (
                <button
                  onClick={() => {
                    transitionReportStatus(
                      'DECISION_RECORDED',
                      { name: 'Drs. H. Bambang Suwondo (Kepala Desa)', role: 'Kepala Desa', roleType: 'kades' },
                      'Keputusan disetujui: Pelaksanaan perbaikan lampu PJU Titik 04 RT 02 dialokasikan dana darurat sarpras Rp 150.000.'
                    );
                    speakText('Keputusan perbaikan disetujui oleh Kepala Desa.');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui & Terbitkan Surat Tugas</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1.5 text-emerald-700 font-bold py-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Keputusan Disetujui (Surat Tugas Terbit)</span>
                </div>
              )}
              <p className="text-[10px] text-slate-500">
                {clState.decision ? `Ditetapkan oleh: ${clState.decision.decisionMakerName || (clState.decision as any).approvedBy}` : 'Menunggu tanda tangan persetujuan Kepala Desa.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Executive Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveExecutiveTab('4pilar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeExecutiveTab === '4pilar'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Dashboard 4 Pilar Terstruktur</span>
        </button>

        <button
          onClick={() => setActiveExecutiveTab('ringkasan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeExecutiveTab === 'ringkasan'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Rekomendasi Musrenbang AI ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveExecutiveTab('infrastruktur')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeExecutiveTab === 'infrastruktur'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>1. Infrastruktur</span>
        </button>

        <button
          onClick={() => setActiveExecutiveTab('aset')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeExecutiveTab === 'aset'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Boxes className="w-4 h-4 text-purple-500" />
          <span>2. Aset</span>
        </button>

        <button
          onClick={() => setActiveExecutiveTab('pelayanan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeExecutiveTab === 'pelayanan'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>3. Pelayanan</span>
        </button>

        <button
          onClick={() => setActiveExecutiveTab('aduan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeExecutiveTab === 'aduan'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>4. Pengaduan</span>
        </button>
      </div>

      {/* 1. VIEW: 4 PILAR TERSTRUKTUR (Semua 4 Kategori Terstruktur) */}
      {activeExecutiveTab === '4pilar' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="all"
        />
      )}

      {/* 2. VIEW: DRILLDOWN INFRASTRUKTUR */}
      {activeExecutiveTab === 'infrastruktur' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="infrastruktur"
        />
      )}

      {/* 3. VIEW: DRILLDOWN ASET */}
      {activeExecutiveTab === 'aset' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="aset"
        />
      )}

      {/* 4. VIEW: DRILLDOWN PELAYANAN */}
      {activeExecutiveTab === 'pelayanan' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="pelayanan"
        />
      )}

      {/* 5. VIEW: DRILLDOWN PENGADUAN */}
      {activeExecutiveTab === 'aduan' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="pengaduan"
        />
      )}

      {/* 6. VIEW: RINGKASAN MUSRENBANGDES AI */}
      {activeExecutiveTab === 'ringkasan' && (
        <div className="space-y-6">
          {/* 4 High-Level Key Performance Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Infrastruktur Kritis */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Infrastruktur Kritis</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">{damagedAssets.length}</span>
                <span className="text-xs text-rose-600 font-bold">titik butuh intervensi</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Termasuk Jalan Poros Akses TPA RW 03 & Jalibar yang masuk prioritas APBDes.
              </p>
            </div>

            {/* Card 2: Kesehatan Aset Desa */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Kondisi Aset Terawat</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">{assetHealthPercentage}%</span>
                <span className="text-xs text-blue-600 font-bold">{healthyAssetsCount} dari {assets.length} unit</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${assetHealthPercentage}%` }}></div>
              </div>
            </div>

            {/* Card 3: Efisiensi Layanan Surat */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Kecepatan Otorisasi Surat</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">14 Menit</span>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Data B — Simulasi</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Estimasi SLA pemangkasan waktu tunggu warga hingga 85% (Simulasi prototipe — Belum diuji pada responden nyata).
              </p>
            </div>

            {/* Card 4: Penyelesaian Aduan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Tingkat Tindak Lanjut</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">{reportResolutionRate}%</span>
                <span className="text-xs text-purple-600 font-bold">{resolvedReports} laporan selesai</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {activeReports.length} aduan sedang dalam penanganan teknis tim lapangan desa.
              </p>
            </div>
          </div>

          {/* AI Decision Generator Form */}
          <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Generator Usulan Musrenbangdes Cerdas (Gemini AI Studio)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Mengkalkulasi Dokumen, Aset & Suara Tokoh</span>
            </div>

            <form onSubmit={handleGenerateAiRecommendation} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="Contoh: Perkerasan rigid beton Jalan Poros Akses TPA RW 03 Dusun Glanggang..."
                className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all shrink-0 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Menganalisis Data Desa...' : 'Kalkulasi Usulan Strategis'}</span>
              </button>
            </form>
          </div>

          {/* List of Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                Daftar Usulan Prioritas Kebijakan Kepala Desa ({recommendations.length})
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Tersusun Berdasarkan Skor Urgensi AI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendations.map((rec) => {
                const isSpeaking = activeSpeakingId === rec.id;
                return (
                  <div 
                    key={rec.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-emerald-500"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            rec.urgencyLevel === 'Sangat Tinggi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Urgensi: {rec.urgencyScore}/100 ({rec.urgencyLevel})
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                            {rec.category}
                          </span>
                        </div>

                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          Rp {(rec.estimatedBudget || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                        {rec.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {rec.rationale}
                      </p>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                        <p><strong>Dampak Warga:</strong> {rec.citizenImpact}</p>
                        <p className="text-slate-500 truncate"><strong>Rujukan:</strong> {rec.sourceDocs?.join(', ') || 'APBDes 2026'}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleSpeakRecommendation(rec.id, `${rec.title}. Estimasi biaya: Rp ${(rec.estimatedBudget || 0).toLocaleString('id-ID')}. Dampak warga: ${rec.citizenImpact}`)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                          isSpeaking 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Dengarkan pembacaan usulan"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                        <span className="text-[10px]">{isSpeaking ? 'Stop' : 'Suara'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProposalModal(rec)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl transition-all"
                        >
                          Lihat Draf SK / RKP
                        </button>
                        <button
                          onClick={() => handleCopyProposal(rec.draftProposalText, rec.id)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                          title="Salin Naskah Draf"
                        >
                          {copiedId === rec.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL DRAFT MODAL */}
      {selectedProposalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Naskah Resmi Draf Usulan RKP / SK Kepala Desa
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProposalModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {selectedProposalModal.draftProposalText}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-semibold">
                Estimasi Biaya: Rp {(selectedProposalModal.estimatedBudget || 0).toLocaleString('id-ID')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyProposal(selectedProposalModal.draftProposalText, selectedProposalModal.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                >
                  {copiedId === selectedProposalModal.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === selectedProposalModal.id ? 'Tersalin ke Clipboard' : 'Salin Naskah'}</span>
                </button>
                <button
                  onClick={() => setSelectedProposalModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
