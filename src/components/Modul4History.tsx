import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Plus, 
  Calendar, 
  Sparkles, 
  Award, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  X,
  Clock,
  Layers,
  Volume2,
  VolumeX
} from 'lucide-react';
import { HistoryMilestone } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface Modul4Props {
  history: HistoryMilestone[];
  onAddMilestone: (ms: HistoryMilestone) => void;
  onNavigateToTpa?: () => void;
}

export const Modul4History: React.FC<Modul4Props> = ({
  history,
  onAddMilestone,
  onNavigateToTpa
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // New Milestone Form
  const [mYear, setMYear] = useState<number>(2027);
  const [mTitle, setMTitle] = useState('');
  const [mCategory, setMCategory] = useState('Pembangunan');
  const [mDesc, setMDesc] = useState('');
  const [mBudget, setMBudget] = useState<number>(50000000);
  const [mImpact, setMImpact] = useState('');

  const sortedHistory = [...history].sort((a, b) => a.year - b.year);

  const filteredHistory = sortedHistory.filter(h => {
    return selectedCategory === 'All' || h.category === selectedCategory;
  });

  const handleSpeakMilestone = (id: string, textToRead: string) => {
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

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle || !mDesc) return;

    const newMs: HistoryMilestone = {
      id: `HIS-${mYear}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      year: mYear,
      title: mTitle,
      category: mCategory,
      description: mDesc,
      budget: mBudget,
      impact: mImpact || 'Meningkatkan kesejahteraan warga desa'
    };

    onAddMilestone(newMs);
    setShowAddModal(false);
    setMTitle('');
    setMDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HistoryIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Cerita & Sejarah Desa
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Linimasa rekam jejak pembangunan dan cerita bersejarah desa dari masa ke masa agar tidak lekang oleh waktu.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Cerita / Sejarah Baru</span>
        </button>
      </div>

      {/* Spotlight: Studi Kasus Khusus TPA Talangagung */}
      {onNavigateToTpa && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                Studi Kasus Unggulan (2020–2025)
              </span>
              <span className="text-xs text-blue-200 font-semibold">7 Atribut Lengkap</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Memori Historis TPA Talangagung (Objek, Lokasi, Peristiwa, Dokumen, Tindakan, Status)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Eksplorasi linimasa interaktif audit memori digital TPA Wisata Edukasi Talangagung mulai dari pemanfaatan gas metana, pembebasan lahan 11.450 m², hingga pembetonan rigid jalan akses 2025.
            </p>
          </div>

          <button
            onClick={onNavigateToTpa}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 group"
          >
            <span>Buka Modul Memori TPA</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Interactive Timeline Display */}
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8 my-8">
        {filteredHistory.map((item) => {
          const isSpeaking = activeSpeakingId === item.id;

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Dot Marker */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-xs group-hover:scale-125 transition-all">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>

              {/* Timeline Card */}
              <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
                      Tahun {item.year}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.budget && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Anggaran: Rp {item.budget.toLocaleString('id-ID')}
                      </span>
                    )}

                    {/* Audio readout button */}
                    <button
                      type="button"
                      onClick={() => handleSpeakMilestone(item.id, `Tahun ${item.year}, ${item.title}. Kategori ${item.category}. ${item.description}. ${item.impact ? 'Dampak: ' + item.impact : ''}`)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSpeaking 
                          ? 'bg-rose-600 text-white animate-pulse' 
                          : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                      }`}
                      title="Dengarkan Cerita Sejarah Ini"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {item.description}
                </p>

                {item.impact && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start space-x-2">
                    <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Manfaat Bagi Warga:</strong>
                      <p className="mt-0.5 text-slate-600 leading-relaxed">{item.impact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Add New Milestone */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tambah Cerita Sejarah Desa</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tahun Kejadian</label>
                  <input
                    type="number"
                    required
                    value={mYear}
                    onChange={(e) => setMYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                  <input
                    type="text"
                    required
                    value={mCategory}
                    onChange={(e) => setMCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Cerita / Pembangunan</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Pembangunan Irigasi Tani Dusun 3"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kisah / Deskripsi Peristiwa</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan latar belakang, warga yang bergotong-royong, atau hasil pembangunan..."
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={mBudget}
                    onChange={(e) => setMBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dampak Bagi Warga</label>
                  <input
                    type="text"
                    placeholder="misal: Melayani 200 KK petani"
                    value={mImpact}
                    onChange={(e) => setMImpact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Simpan Cerita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
