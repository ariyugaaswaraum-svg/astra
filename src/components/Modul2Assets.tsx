import React, { useState } from 'react';
import { 
  Boxes, 
  QrCode, 
  MapPin, 
  Wrench, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  DollarSign, 
  UserCheck, 
  X,
  ExternalLink,
  Map,
  ShieldAlert,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AssetItem, AssetCondition, MaintenanceRecord } from '../types';
import { speakText, stopSpeech } from '../utils/speech';
import { AssetPassportModal } from './AssetPassportModal';
import { 
  useClosedLoopState, 
  executeRememberStep, 
  executeRetrieveStep, 
  transitionReportStatus,
  DEMO_ASSET_ID 
} from '../utils/closedLoopStore';
import { Layers, Zap, ShieldCheck } from 'lucide-react';

interface Modul2Props {
  assets: AssetItem[];
  onAddAsset: (asset: AssetItem) => void;
  onAddMaintenanceRecord: (assetId: string, record: MaintenanceRecord) => void;
  onNavigateToMap?: () => void;
}

export const Modul2Assets: React.FC<Modul2Props> = ({
  assets,
  onAddAsset,
  onAddMaintenanceRecord,
  onNavigateToMap
}) => {
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const closedLoopState = useClosedLoopState();
  
  // Modal states
  const [activePassportAsset, setActivePassportAsset] = useState<AssetItem | null>(null);
  const [activeQrModalAsset, setActiveQrModalAsset] = useState<AssetItem | null>(null);
  const [activeLogModalAsset, setActiveLogModalAsset] = useState<AssetItem | null>(null);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [scannerSimulationOpen, setScannerSimulationOpen] = useState(false);

  // New Maintenance Log form
  const [mType, setMType] = useState('');
  const [mCost, setMCost] = useState<number>(0);
  const [mTechnician, setMTechnician] = useState('');
  const [mNotes, setMNotes] = useState('');

  // New Asset form
  const [aName, setAName] = useState('');
  const [aCategory, setACategory] = useState<any>('Infrastruktur');
  const [aDusun, setADusun] = useState('Dusun 1 (Krajan)');
  const [aRtRw, setARtRw] = useState('RT 01 / RW 01');
  const [aYear, setAYear] = useState(2023);
  const [aCondition, setACondition] = useState<AssetCondition>('Baik');
  const [aPhotoUrl, setAPhotoUrl] = useState('');
  const [aValue, setAValue] = useState(25000000);

  const filteredAssets = assets.filter(a => {
    const matchesCond = selectedCondition === 'All' || a.condition === selectedCondition;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.dusun.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCond && matchesSearch;
  });

  const handleSpeakAsset = (id: string, textToRead: string) => {
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

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogModalAsset || !mType || !mTechnician) return;

    const newRec: MaintenanceRecord = {
      id: `M-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString().split('T')[0],
      type: mType,
      cost: mCost,
      technician: mTechnician,
      notes: mNotes
    };

    onAddMaintenanceRecord(activeLogModalAsset.id, newRec);
    setMType('');
    setMCost(0);
    setMTechnician('');
    setMNotes('');
    setActiveLogModalAsset(null);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aName) return;

    const code = `AST-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAsset: AssetItem = {
      id: code,
      code,
      name: aName,
      category: aCategory,
      dusun: aDusun,
      rtRw: aRtRw,
      yearBuilt: aYear,
      condition: aCondition,
      photoUrl: aPhotoUrl || 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600',
      gpsCoords: { lat: -6.8315, lng: 107.1410 },
      maintenanceHistory: [],
      qrCodeValue: `DESA-SUKAMAJU-${code}`,
      estimatedValue: aValue,
      assignedManager: 'Kasi Pembangunan Desa'
    };

    onAddAsset(newAsset);
    setShowAddAssetModal(false);
    setAName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Fasilitas & Aset Desa
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Data kondisi jalan, jembatan, sarana air, dan fasilitas umum desa lengkap dengan penanda QR Code fisik & riwayat perbaikan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Buka Peta Desa Interaktif</span>
            </button>
          )}
          <button
            onClick={() => setScannerSimulationOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Simulasi Scan QR</span>
          </button>
          <button
            onClick={() => setShowAddAssetModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Fasilitas Desa</span>
          </button>
        </div>
      </div>

      {/* Interactive Closed Knowledge Loop Step Banner for Village Officials */}
      {closedLoopState.status === 'VERIFIED_BY_RT' && (
        <div className="p-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-2 border-indigo-500/80 rounded-2xl text-white shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Pemeriksaan RT 02 Selesai • Alur Pelayanan Fasilitas Desa
              </div>
            </div>
            <button
              onClick={() => {
                const target = assets.find(a => a.id === DEMO_ASSET_ID) || closedLoopState.asset;
                if (target) setActivePassportAsset(target);
              }}
              className="px-3 py-1.5 bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-100 border border-indigo-400/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Buka Data Fasilitas Lampu Titik 04</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed">
            Laporan <strong className="text-white">Lampu Penerangan Jalan Titik 04 Padam (RT 02)</strong> telah diverifikasi. Silakan lanjutkan langkah pemrosesan:
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!closedLoopState.rememberRecord?.isLinked ? (
              <button
                onClick={() => {
                  executeRememberStep({ name: 'Ibu Siti Rahma, S.AP', role: 'Kaur Umum & TU', actorId: 'PRG-001' });
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Langkah 3: Hubungkan ke Data Lampu PJU</span>
              </button>
            ) : !closedLoopState.retrievalRecord ? (
              <button
                onClick={() => {
                  executeRetrieveStep({ name: 'Ibu Siti Rahma, S.AP', role: 'Kaur Umum & TU', actorId: 'PRG-001' });
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Langkah 4: Buka Riwayat Pemeliharaan & Komponen</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  transitionReportStatus(
                    'ANALYZED',
                    { name: 'Sistem Pengambilan Keputusan Desa', role: 'Decision Support Engine', roleType: 'perangkat' },
                    'Penyusunan solusi teknis dan perkiraan biaya perbaikan'
                  );
                }}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Langkah 5: Siapkan Rekomendasi Solusi & Biaya</span>
              </button>
            )}

            <div className="text-[11px] text-indigo-200 font-medium px-2 py-1 bg-indigo-950/60 rounded-lg border border-indigo-800">
              {closedLoopState.rememberRecord?.isLinked && '✓ Data Terhubung'}
              {closedLoopState.retrievalRecord && ' • ✓ Riwayat Terbaca'}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Baik', 'Perlu Servis', 'Rusak Ringan', 'Rusak Berat'].map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCondition === cond
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cond === 'All' ? 'Semua Kondisi' : cond}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalan, jembatan, dusun..."
            className="w-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const isWarning = asset.condition === 'Perlu Servis' || asset.condition === 'Rusak Berat' || asset.condition === 'Rusak Ringan';
          const isSpeaking = activeSpeakingId === asset.id;

          return (
            <div 
              key={asset.id}
              onClick={() => setActivePassportAsset(asset)}
              className={`bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between shadow-xs cursor-pointer group hover:border-blue-300 ${
                isWarning ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Image & Status Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={asset.photoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"} 
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-xs ${
                    asset.condition === 'Baik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    asset.condition === 'Perlu Servis' ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {asset.condition}
                  </span>

                  <span className="absolute bottom-2 right-3 text-[10px] font-mono font-semibold text-slate-800 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {asset.code}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {asset.name}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakAsset(asset.id, `${asset.name}. Lokasi ${asset.dusun}. Kondisi saat ini ${asset.condition}. Nilai perkiraan Rp ${asset.estimatedValue.toLocaleString('id-ID')}. Riwayat perbaikan ${asset.maintenanceHistory.length} kali.`);
                      }}
                      className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                        isSpeaking 
                          ? 'bg-rose-600 text-white animate-pulse' 
                          : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                      }`}
                      title="Bacakan Info Fasilitas Ini"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{asset.dusun} ({asset.rtRw})</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tahun Pembangunan</span>
                      <span className="font-bold text-slate-800">{asset.yearBuilt}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Estimasi Nilai</span>
                      <span className="font-bold text-emerald-700">Rp {asset.estimatedValue.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Maintenance Log Counter */}
                  <div className="text-xs text-slate-600 pt-1">
                    <strong className="text-slate-800">Riwayat Servis:</strong> {asset.maintenanceHistory.length} kali pencatatan
                    {asset.maintenanceHistory.length > 0 && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                        Terakhir: {asset.maintenanceHistory[asset.maintenanceHistory.length - 1].date} ({asset.maintenanceHistory[asset.maintenanceHistory.length - 1].type})
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2 pt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveQrModalAsset(asset);
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 border border-slate-200"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cetak QR</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLogModalAsset(asset);
                  }}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border border-blue-200"
                >
                  <Wrench className="w-3.5 h-3.5 text-blue-600" />
                  <span>Catat Servis</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Display Asset QR Code */}
      {activeQrModalAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> Label QR Penanda Aset
              </span>
              <button onClick={() => setActiveQrModalAsset(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block mx-auto shadow-xs">
              <QRCodeSVG value={activeQrModalAsset.qrCodeValue} size={180} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeQrModalAsset.name}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono font-semibold">{activeQrModalAsset.code}</p>
              <p className="text-xs text-slate-600 mt-1">{activeQrModalAsset.dusun}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-1">
              <div><strong className="text-slate-900">Pengelola:</strong> {activeQrModalAsset.assignedManager || 'Kasi Pembangunan'}</div>
              <div><strong className="text-slate-900">Koordinat GPS:</strong> {activeQrModalAsset.gpsCoords?.lat}, {activeQrModalAsset.gpsCoords?.lng}</div>
            </div>

            <button
              onClick={() => {
                alert(`Mencetak label QR Code fisik untuk ${activeQrModalAsset.name}`);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
            >
              Cetak Fisik Label QR Code
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Maintenance Log Input Form */}
      {activeLogModalAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Catat Riwayat Pemeliharaan Aset</h3>
              </div>
              <button onClick={() => setActiveLogModalAsset(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 block text-[10px]">Aset Yang Diperbaiki:</span>
              <strong className="text-slate-900 text-sm">{activeLogModalAsset.name}</strong> ({activeLogModalAsset.code})
            </div>

            <form onSubmit={handleAddLog} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Perbaikan / Pekerjaan</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Pengurukan batu base course & tambal aspal"
                  value={mType}
                  onChange={(e) => setMType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Biaya (Rp)</label>
                  <input
                    type="number"
                    required
                    value={mCost}
                    onChange={(e) => setMCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teknisi / Pelaksana</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Tim Swadaya RT 05"
                    value={mTechnician}
                    onChange={(e) => setMTechnician(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Hasil Pengerjaan</label>
                <textarea
                  rows={3}
                  placeholder="Catatan kondisi setelah servis..."
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLogModalAsset(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Simpan Catatan Servis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QR Scanner Simulator */}
      {scannerSimulationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Simulasi Pemindai QR Code Aset</h3>
              </div>
              <button onClick={() => setScannerSimulationOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Pilih salah satu sampel aset desa untuk mensimulasikan hasil pemindaian kamera di lapangan:
            </p>

            <div className="space-y-2">
              {assets.map((ast) => (
                <button
                  key={ast.id}
                  onClick={() => {
                    setScannerSimulationOpen(false);
                    setActiveQrModalAsset(ast);
                  }}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-xs transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-700">{ast.name}</span>
                    <span className="text-[10px] text-slate-500 block">{ast.code} • {ast.dusun}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    ast.condition === 'Baik' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {ast.condition}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Create Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tambah Fasilitas Desa Baru</h3>
              <button onClick={() => setShowAddAssetModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Fasilitas / Jalan</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Lampu Penerangan Jalan Solar Dusun 2"
                  value={aName}
                  onChange={(e) => setAName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dusun / Lokasi</label>
                  <input
                    type="text"
                    required
                    value={aDusun}
                    onChange={(e) => setADusun(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">RT / RW</label>
                  <input
                    type="text"
                    required
                    value={aRtRw}
                    onChange={(e) => setARtRw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kondisi Aset</label>
                  <select
                    value={aCondition}
                    onChange={(e: any) => setACondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu Servis">Perlu Servis</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tahun Pengadaan</label>
                  <input
                    type="number"
                    value={aYear}
                    onChange={(e) => setAYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Simpan & Buat Label QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Digital Asset Passport Modal */}
      <AssetPassportModal
        asset={activePassportAsset}
        isOpen={Boolean(activePassportAsset)}
        onClose={() => setActivePassportAsset(null)}
      />
    </div>
  );
};
