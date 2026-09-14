import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Plus, 
  Loader2, 
  SendHorizontal, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp,
  X,
  Volume2,
  VolumeX,
  Layers,
  Boxes,
  Clock,
  BarChart3
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

interface Modul5Props {
  recommendations: DecisionRecommendation[];
  villageProfile: VillageProfile;
  assets: AssetItem[];
  documents: DocumentItem[];
  memories: HumanMemory[];
  reports?: CitizenReport[];
  letters?: LetterRequest[];
  onAddRecommendation: (rec: DecisionRecommendation) => void;
}

export const Modul5DecisionSupport: React.FC<Modul5Props> = ({
  recommendations,
  villageProfile,
  assets,
  documents,
  memories,
  reports = [],
  letters = [],
  onAddRecommendation
}) => {
  const [focusArea, setFocusArea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedProposalModal, setSelectedProposalModal] = useState<DecisionRecommendation | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'4pilar' | 'rekomendasi' | 'infrastruktur' | 'aset' | 'pelayanan' | 'pengaduan'>('4pilar');

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
          urgencyScore: r.urgencyScore || 85,
          urgencyLevel: (r.urgencyLevel as any) || 'Sangat Tinggi',
          estimatedBudget: r.estimatedBudget || 50000000,
          rationale: r.rationale || 'Dihasilkan berdasarkan analisis AI silang memori desa.',
          sourceAssets: r.sourceAssets || ['Aset Desa Talangagung'],
          sourceDocs: r.sourceDocs || ['Dokumen APBDes / RPJMDes'],
          sourceMemories: r.sourceMemories || ['Memori Sesepuh Desa'],
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
    <div className="space-y-6 pb-12">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[10px] font-black uppercase tracking-wider">
                Mata Elang Desa — Decision Support System
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Sistem Pendukung Keputusan Pembangunan Desa
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Analisis terstruktur data 4 pilar (<strong>Infrastruktur</strong>, <strong>Aset</strong>, <strong>Pelayanan Publik</strong>, <strong>Pengaduan Warga</strong>) untuk menyusun rekomendasi Musrenbangdes dan alokasi APBDes secara faktual dan tepat sasaran.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/40 px-4 py-2.5 rounded-2xl text-xs text-emerald-300 font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Analisis Presisi Musrenbangdes</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('4pilar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === '4pilar'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Dashboard 4 Kategori Terstruktur</span>
        </button>

        <button
          onClick={() => setActiveTab('rekomendasi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'rekomendasi'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Rekomendasi Musrenbangdes AI ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastruktur')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'infrastruktur'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>1. Infrastruktur</span>
        </button>

        <button
          onClick={() => setActiveTab('aset')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'aset'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Boxes className="w-4 h-4 text-purple-500" />
          <span>2. Aset</span>
        </button>

        <button
          onClick={() => setActiveTab('pelayanan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'pelayanan'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>3. Pelayanan</span>
        </button>

        <button
          onClick={() => setActiveTab('pengaduan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
            activeTab === 'pengaduan'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>4. Pengaduan</span>
        </button>
      </div>

      {/* 4 Pillars Unified View */}
      {activeTab === '4pilar' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="all"
        />
      )}

      {/* Drilldown Views */}
      {activeTab === 'infrastruktur' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="infrastruktur"
        />
      )}

      {activeTab === 'aset' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="aset"
        />
      )}

      {activeTab === 'pelayanan' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="pelayanan"
        />
      )}

      {activeTab === 'pengaduan' && (
        <MataElangFourPillars 
          reports={reports}
          assets={assets}
          letters={letters}
          villageProfile={villageProfile}
          initialActiveCategory="pengaduan"
        />
      )}

      {/* Recommendation & Musrenbang AI View */}
      {activeTab === 'rekomendasi' && (
        <div className="space-y-6">
          {/* AI Recommendation Generator Form */}
          <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Minta Rekomendasi Prioritas Musrenbangdes Baru dari AI
              </h3>
            </div>

            <form onSubmit={handleGenerateAiRecommendation} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="Ketik topik: misal Perkerasan jalan akses TPA, normalisasi saluran Jalibar, pompa Poktan..."
                className="flex-1 w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 disabled:opacity-50 transition-all shadow-xs whitespace-nowrap shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis Data Desa...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Kalkulasi Usulan AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Decision Support Cards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                Daftar Usulan Prioritas Musrenbangdes ({recommendations.length})
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Tersusun Berdasarkan Urgensi Faktual</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {recommendations.map((rec) => {
                const isSpeaking = activeSpeakingId === rec.id;

                return (
                  <div 
                    key={rec.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all space-y-4 shadow-xs flex flex-col justify-between border-t-4 border-t-emerald-500"
                  >
                    <div className="space-y-3">
                      {/* Card Header & Urgency Score */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            {rec.category}
                          </span>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1.5 leading-snug">
                            {rec.title}
                          </h4>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-emerald-700 leading-none">
                            {rec.urgencyScore}<span className="text-xs font-medium text-slate-400">/100</span>
                          </div>
                          <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                            {rec.urgencyLevel}
                          </span>
                        </div>
                      </div>

                      {/* Rationale / Justification */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                        <span className="text-slate-500 font-bold block text-[11px]">Rasionalisasi AI:</span>
                        <p className="text-slate-800 leading-relaxed">{rec.rationale}</p>
                      </div>

                      {/* Cross References */}
                      <div className="text-[11px] space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div><strong>Dasar Kondisi Lapangan:</strong> {rec.sourceAssets.join(', ')}</div>
                        <div><strong>Dasar Regulasi & Memori:</strong> {rec.sourceDocs.join(', ')} {rec.sourceMemories?.join(', ')}</div>
                      </div>

                      {/* Citizen Impact */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-600">Dampak Warga: <strong className="text-slate-900 font-bold">{rec.citizenImpact}</strong></span>
                      </div>
                    </div>

                    {/* Card Footer: Budget, Audio & Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Estimasi Biaya:</span>
                        <strong className="text-xs sm:text-sm text-emerald-700 font-black">Rp {rec.estimatedBudget.toLocaleString('id-ID')}</strong>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Audio readout */}
                        <button
                          type="button"
                          onClick={() => handleSpeakRecommendation(rec.id, `${rec.title}. Alasan rekomendasi: ${rec.rationale}. Estimasi anggaran Rp ${rec.estimatedBudget.toLocaleString('id-ID')}. Manfaat bagi warga: ${rec.citizenImpact}.`)}
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

                        <button
                          onClick={() => setSelectedProposalModal(rec)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl transition-all"
                        >
                          Lihat Draf SK
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
