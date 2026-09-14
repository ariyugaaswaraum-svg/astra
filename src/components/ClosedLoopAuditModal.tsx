import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ClipboardList,
  Check,
  Copy,
  Filter,
  Settings2,
  Lock,
  Layers,
  RotateCcw
} from 'lucide-react';
import { ClosedLoopState, ClosedLoopAuditTrailEntry, canTransitionReport } from '../utils/closedLoopStore';
import { evaluateClosedLoop24Tests, TestCaseResult } from '../utils/closedLoopTestSuite';

interface ClosedLoopAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ClosedLoopState;
  onResetDemo?: () => void;
  initialTab?: 'audit' | 'testsuite' | 'negative';
}

export const ClosedLoopAuditModal: React.FC<ClosedLoopAuditModalProps> = ({
  isOpen,
  onClose,
  state,
  onResetDemo,
  initialTab = 'testsuite'
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'testsuite' | 'negative'>(initialTab);
  const [stageFilter, setStageFilter] = useState<number | 'all'>('all');
  const [copiedReport, setCopiedReport] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!isOpen) return null;

  const entries = state.auditTrail || [];
  const testReport = evaluateClosedLoop24Tests(state);

  const filteredTests = stageFilter === 'all'
    ? testReport.testCases
    : testReport.testCases.filter(t => t.stage === stageFilter);

  const getHumanFriendlyStatus = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Draf Laporan';
      case 'SUBMITTED':
      case 'RT_VERIFICATION': return 'Pemeriksaan RT 02';
      case 'VERIFIED_BY_RT':
      case 'VILLAGE_REVIEW': return 'Proses Fasilitas Desa';
      case 'ANALYZED': return 'Menunggu Putusan Kades';
      case 'DECISION_RECORDED': return 'Disetujui Kepala Desa';
      case 'ACTION_IN_PROGRESS': return 'Perbaikan di Lapangan';
      case 'RESOLVED': return 'Perbaikan Selesai';
      case 'RECORDED_IN_MEMORY': return 'Dicatat di Memori Desa';
      default: return status;
    }
  };

  const getFriendlyStageName = (stage: number) => {
    switch (stage) {
      case 1: return 'Laporan Warga';
      case 2: return 'Pemeriksaan Lapangan RT';
      case 3: return 'Data Identitas Fasilitas';
      case 4: return 'Riwayat Servis & Suku Cadang';
      case 5: return 'Rekomendasi Solusi & Biaya';
      case 6: return 'Persetujuan Kepala Desa';
      case 7: return 'Pengerjaan Perbaikan';
      case 8: return 'Buku Memori & Asisten AI';
      default: return `Tahap ${stage}`;
    }
  };

  const handleCopyReportMarkdown = () => {
    let md = `# LAPORAN PEMERIKSAAN STANDAR LAYANAN FASILITAS DESA\n`;
    md += `## SKENARIO: ${state.scenarioName}\n`;
    md += `Status Terkini: ${getHumanFriendlyStatus(state.status)}\n`;
    md += `Hasil: ${testReport.passedCount}/24 Standar Terpenuhi (${testReport.pendingCount} Menunggu, ${testReport.failedCount} Gagal)\n`;
    md += `Tingkat Kepatuhan Prosedur: ${testReport.complianceRate}%\n\n`;
    md += `| Tahap | Judul Pemeriksaan | Status | Keterangan |\n`;
    md += `|---|---|---|---|\n`;

    testReport.testCases.forEach(tc => {
      md += `| ${getFriendlyStageName(tc.stage)} | ${tc.title} | ${tc.status} | ${tc.actual} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div 
      id="closed-loop-audit-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="closed-loop-audit-modal-content"
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-900"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transparansi & Standar Layanan Desa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Laporan Standar Pelayanan & Riwayat Penanganan
            </h2>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
              <span>Kasus: <strong className="text-amber-300">{state.scenarioName}</strong></span>
              <span>•</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full font-bold text-[10px]">
                Mode Percontohan
              </span>
            </div>
          </div>

          <button 
            id="btn-close-audit-modal"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="relative z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
            <button
              onClick={() => setActiveTab('testsuite')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                activeTab === 'testsuite'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Standar Pelayanan</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'testsuite' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {testReport.passedCount}/24
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Riwayat Aktivitas ({entries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('negative')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                activeTab === 'negative'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Aturan Keamanan Alur</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'negative' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
              }`}>
                6 Terlindungi
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Status:</span>
            <span className="font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200">
              {getHumanFriendlyStatus(state.status)}
            </span>
          </div>
        </div>

        {/* Tab Content: Standar Pelayanan (24 Checkpoint) */}
        {activeTab === 'testsuite' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tahapan Prosedur</span>
                <span className="text-xl font-black text-slate-900">8 Tahap Layanan</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Dari warga hingga arsip</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">Standar Terpenuhi</span>
                <span className="text-xl font-black text-emerald-600">
                  {testReport.passedCount} / 24
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                  {Math.round((testReport.passedCount / 24) * 100)}% Lengkap & Sah
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-600 uppercase block">Menunggu Giliran</span>
                <span className="text-xl font-black text-amber-600">
                  {testReport.pendingCount}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Sesuai urutan langkah</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 uppercase block">Integritas Prosedur</span>
                <span className="text-xl font-black text-blue-600">
                  {testReport.complianceRate}%
                </span>
                <span className="text-[10px] text-blue-700 font-bold block mt-0.5">Tata kelola transparan</span>
              </div>
            </div>

            {/* Filter by Stage & Toggle for Technical Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                <span className="text-slate-400 text-xs font-bold mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Tahap:
                </span>
                <button
                  onClick={() => setStageFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    stageFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Semua (24)
                </button>
                {[
                  { stage: 1, name: '1. Lapor' },
                  { stage: 2, name: '2. Cek RT' },
                  { stage: 3, name: '3. Fasilitas' },
                  { stage: 4, name: '4. Riwayat' },
                  { stage: 5, name: '5. Solusi' },
                  { stage: 6, name: '6. Putusan' },
                  { stage: 7, name: '7. Perbaikan' },
                  { stage: 8, name: '8. Arsip' }
                ].map(s => (
                  <button
                    key={s.stage}
                    onClick={() => setStageFilter(s.stage)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs whitespace-nowrap ${
                      stageFilter === s.stage ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border ${
                    showTechnicalDetails 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{showTechnicalDetails ? 'Mode Standar' : 'Rincian Kode Teknis'}</span>
                </button>

                {showTechnicalDetails && (
                  <button
                    onClick={handleCopyReportMarkdown}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReport ? 'Tersalin!' : 'Salin Laporan'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Test Cards List */}
            <div className="space-y-2.5">
              {filteredTests.map((tc: TestCaseResult) => (
                <div 
                  key={tc.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    tc.status === 'PASS' 
                      ? 'bg-white border-emerald-200/80 shadow-2xs' 
                      : tc.status === 'FAIL'
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-white/80 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {showTechnicalDetails && (
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {tc.id}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {getFriendlyStageName(tc.stage)}
                      </span>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900">
                        {tc.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                        tc.status === 'PASS' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : tc.status === 'FAIL'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {tc.status === 'PASS' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{tc.status === 'PASS' ? 'Terpenuhi' : tc.status === 'PENDING' ? 'Menunggu' : 'Gagal'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Standar Layanan:</span>
                      <p className="text-slate-700 text-[11px] leading-relaxed">{tc.expected}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Hasil Pemeriksaan:</span>
                      <p className="text-slate-900 font-semibold text-[11px] leading-relaxed">{tc.actual}</p>
                      
                      {showTechnicalDetails && tc.evidence && tc.evidence !== '-' && (
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100 inline-block mt-0.5">
                          Bukti: {tc.evidence}
                        </span>
                      )}

                      {/* AI Retrieval Proof for Stage 8 */}
                      {tc.id === 'TC-24' && state.aiRetrievalProof && (
                        <div className="mt-2.5 p-2.5 bg-indigo-50/90 border border-indigo-200 rounded-xl space-y-1.5 text-xs col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between font-bold text-indigo-950">
                            <span className="flex items-center gap-1.5 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              Verifikasi Jawaban Asisten AI Desa
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(state.aiRetrievalProof.responseValidatedAt).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="text-slate-700 text-[11px] space-y-1">
                            <p><strong className="text-slate-900">Pertanyaan:</strong> "{state.aiRetrievalProof.query}"</p>
                            {state.aiRetrievalProof.answerSnippet && (
                              <p className="text-[10px] text-slate-600 italic mt-1 bg-white p-2 rounded-lg border border-slate-100 line-clamp-2">
                                "{state.aiRetrievalProof.answerSnippet}..."
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Riwayat Aktivitas */}
        {activeTab === 'audit' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <p className="text-xs text-slate-500">
                Setiap tindakan penanganan dicatat secara otomatis lengkap dengan waktu, penanggung jawab, dan catatan lapangan.
              </p>
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <Settings2 className="w-3 h-3" />
                <span>{showTechnicalDetails ? 'Sembunyikan ID Sistem' : 'Tampilkan ID Sistem'}</span>
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-bold">Belum ada riwayat aktivitas tercatat.</p>
                <p className="text-slate-400 mt-0.5">Catatan akan muncul otomatis saat alur pelayanan dijalankan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((item: ClosedLoopAuditTrailEntry, idx: number) => {
                  return (
                    <div 
                      key={item.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-all shadow-2xs space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
                            {item.step}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900">
                            {getFriendlyStageName(item.step)}
                          </span>
                          {showTechnicalDetails && (
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                              {item.action}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(item.timestamp).toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <strong>Catatan:</strong> {item.notes}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                        <div>
                          Petugas / Pelapor: <strong className="text-slate-900">{item.actorName}</strong>
                        </div>
                        <div>
                          Peran: <strong className="text-slate-800">{item.actorRole}</strong>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Status:</span>
                          <span className="font-semibold text-emerald-700">{getHumanFriendlyStatus(item.newStatus)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Aturan Keamanan Alur (Integritas) */}
        {activeTab === 'negative' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0" />
                <h3 className="text-sm font-black text-indigo-950">
                  Perlindungan Integritas & Keamanan Prosedur Desa
                </h3>
              </div>
              <p className="text-xs text-indigo-800 mt-1">
                Sistem secara otomatis mencegah penyalahgunaan wewenang, manipulasi data, dan lompatan prosedur tanpa otorisasi sah.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'ATURAN-01',
                  scenario: 'Pencegahan Melompati Prosedur: Laporan belum dibuat, tidak bisa langsung dianalisis',
                  rule: 'Laporan warga wajib masuk melalui formulir resmi sebelum dapat diproses.',
                  from: 'DRAFT',
                  to: 'ANALYZED',
                  role: 'warga',
                  check: canTransitionReport('DRAFT', 'ANALYZED' as any, 'warga')
                },
                {
                  id: 'ATURAN-02',
                  scenario: 'Batas Kewenangan: Warga tidak dapat menyetujui pembiayaan perbaikan fasilitas',
                  rule: 'Hanya KEPALA DESA yang berwenang menyetujui keputusan pembiayaan perbaikan aset.',
                  from: 'ANALYZED',
                  to: 'DECISION_RECORDED',
                  role: 'warga',
                  check: canTransitionReport('ANALYZED', 'DECISION_RECORDED' as any, 'warga')
                },
                {
                  id: 'ATURAN-03',
                  scenario: 'Batas Kewenangan Lapangan: Ketua RT tidak dapat menandai pekerjaan teknisi telah selesai',
                  rule: 'Hanya Tim Pelaksana Teknis yang berwenang mengonfirmasi penyelesaian perbaikan fisik.',
                  from: 'ACTION_IN_PROGRESS',
                  to: 'RESOLVED',
                  role: 'rt',
                  check: canTransitionReport('ACTION_IN_PROGRESS', 'RESOLVED' as any, 'rt')
                },
                {
                  id: 'ATURAN-04',
                  scenario: 'Pencegahan Arsip Fiktif: Laporan tidak bisa langsung diarsipkan tanpa diperbaiki',
                  rule: 'Fasilitas harus melewati verifikasi lapangan, persetujuan Kepala Desa, dan perbaikan fisik.',
                  from: 'SUBMITTED',
                  to: 'RECORDED_IN_MEMORY',
                  role: 'system',
                  check: canTransitionReport('SUBMITTED', 'RECORDED_IN_MEMORY' as any, 'system')
                },
                {
                  id: 'ATURAN-05',
                  scenario: 'Kepastian Arsip: Perbaikan yang sudah final tidak dapat diubah kembali menjadi draf',
                  rule: 'Catatan dalam memori desa bersifat permanen untuk menjamin transparansi historis.',
                  from: 'RECORDED_IN_MEMORY',
                  to: 'SUBMITTED',
                  role: 'system',
                  check: canTransitionReport('RECORDED_IN_MEMORY' as any, 'SUBMITTED' as any, 'system')
                },
                {
                  id: 'ATURAN-06',
                  scenario: 'Keabsahan Pemeriksaan: Pemeriksaan RT hanya berlaku pada laporan yang sah terdaftar',
                  rule: 'Ketua RT hanya memverifikasi laporan warga yang telah terdaftar resmi di sistem.',
                  from: 'DRAFT',
                  to: 'VERIFIED_BY_RT',
                  role: 'perangkat',
                  check: canTransitionReport('DRAFT', 'VERIFIED_BY_RT' as any, 'perangkat')
                }
              ].map(test => {
                const isRejectedCorrectly = !test.check.allowed;
                return (
                  <div 
                    key={test.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isRejectedCorrectly ? 'bg-white border-emerald-200 shadow-2xs' : 'bg-rose-50 border-rose-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                          ✓
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {test.scenario}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shrink-0 ${
                        isRejectedCorrectly 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isRejectedCorrectly ? 'Terlindungi (Otomatis Dicegah)' : 'Perlu Diperiksa'}
                      </span>
                    </div>

                    <div className="mt-2 text-xs space-y-1.5">
                      <div className="text-slate-600">
                        <strong>Aturan Standar:</strong> {test.rule}
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700 border border-slate-200">
                        Tindakan Sistem: <em>"{test.check.reason || 'Ditolak secara otomatis sesuai aturan alur kerja'}"</em>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Mode Percontohan
            </span>
            <span>Data percontohan aman dan terpisah dari arsip asli desa.</span>
          </div>

          <div className="flex items-center gap-2">
            {onResetDemo && (
              <button 
                onClick={() => {
                  if (confirm('Mulai ulang contoh penanganan lampu penerangan jalan dari awal?')) {
                    onResetDemo();
                  }
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mulai Ulang Alur</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
