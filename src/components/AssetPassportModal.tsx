import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Tag, 
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AssetItem, MaintenanceRecord } from '../types';

interface AssetPassportModalProps {
  asset: AssetItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssetPassportModal: React.FC<AssetPassportModalProps> = ({
  asset: rawAsset,
  isOpen,
  onClose
}) => {
  if (!isOpen || !rawAsset) return null;

  const asset: AssetItem = (rawAsset.id === 'AST-DEMO-PJU-RT02-004' || rawAsset.assetId === 'AST-DEMO-PJU-RT02-004' || rawAsset.code === 'AST-DEMO-PJU-RT02-004')
    ? {
        ...rawAsset,
        id: 'AST-DEMO-PJU-RT02-004',
        assetId: 'AST-DEMO-PJU-RT02-004',
        scenarioId: 'DEMO-CLOSED-LOOP-PJU-001',
        dataClassification: 'PROTOTYPE_SIMULATION',
        validationStatus: 'SIMULATION_ONLY',
        isSimulation: true,
        sourceIds: Array.isArray(rawAsset.sourceIds) ? rawAsset.sourceIds : []
      }
    : rawAsset;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'Baik':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {condition}
          </span>
        );
      case 'Perlu Servis':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {condition}
          </span>
        );
      case 'Rusak Ringan':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            {condition}
          </span>
        );
      case 'Rusak Berat':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {condition}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {condition}
          </span>
        );
    }
  };

  const totalMaintenanceCost = asset.maintenanceHistory.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div 
      id="asset-passport-modal-overlay" 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="asset-passport-modal-content" 
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Passport Style */}
        <div className={`text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden shrink-0 ${
          asset.isSimulation 
            ? 'bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 border-b-2 border-amber-500' 
            : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className={`w-4 h-4 ${asset.isSimulation ? 'text-amber-400' : 'text-blue-400'}`} />
              <span className={asset.isSimulation ? 'text-amber-200' : 'text-blue-200'}>
                {asset.isSimulation ? 'DATA B — SIMULASI PROTOTIPE (BUKAN ASET FISIK FAKTUAL)' : 'Sistem Informasi Desa • Identitas Resmi'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Paspor Aset Digital
            </h2>
            <p className="text-xs text-blue-200/80 mt-0.5">
              {asset.isSimulation 
                ? 'Lembar identitas instrumen uji coba simulasi alur tertutup (Closed Knowledge Loop)' 
                : 'Lembar identitas fisik dan riwayat siklus hidup inventaris desa'}
            </p>
          </div>
          
          <button 
            id="btn-close-asset-passport"
            onClick={onClose}
            aria-label="Tutup modal"
            className="relative z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative background watermark */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
          {asset.isSimulation && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Pemberitahuan Status Simulasi:</strong> Record ini merupakan data uji coba prototipe alur <em>Closed Knowledge Loop</em>. Kode QR, koordinat GPS, dan spesifikasi teknis di bawah ini adalah data simulasi (Data B), bukan dokumen resmi inventaris fisik Pemerintah Desa Talangagung.
              </div>
            </div>
          )}
          
          {/* Main Visual & Key Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            {/* Foto Aset */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <img 
                  src={asset.photoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  {getConditionBadge(asset.condition)}
                </div>
              </div>

              {/* QR Mini Code */}
              <div className="mt-3 w-full flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="p-1 bg-white border border-slate-200 rounded-lg shrink-0">
                  <QRCodeSVG value={asset.qrCodeValue || asset.code} size={48} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold block uppercase tracking-wider text-amber-700">
                    {asset.isSimulation ? 'QR DEMO — BUKAN IDENTITAS ASET RESMI' : 'Barcode Verifikasi'}
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-800 truncate">{asset.code}</p>
                </div>
              </div>
            </div>

            {/* Main Info */}
            <div className="sm:col-span-7 space-y-3.5">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md mb-1.5">
                  {asset.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {asset.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Kode Aset */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Kode Aset</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">{asset.code}</span>
                </div>

                {/* Tahun Pengadaan */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Tahun Pengadaan</span>
                  <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{asset.yearBuilt}</span>
                  </div>
                </div>

                {/* Nilai Aset */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Estimasi Nilai</span>
                  <span className="font-bold text-xs sm:text-sm text-emerald-700">
                    {formatCurrency(asset.estimatedValue)}
                  </span>
                </div>

                {/* Kondisi */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Status Fisik</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{asset.condition}</span>
                </div>
              </div>

              {/* Lokasi & Pengelola */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{asset.dusun}</span>
                    <span className="text-slate-600 block text-[11px]">Wilayah: {asset.rtRw}</span>
                    {asset.gpsCoords && (
                      <span className={`text-[10px] font-mono block mt-0.5 ${asset.isSimulation ? 'text-amber-700 font-bold' : 'text-slate-500'}`}>
                        {asset.isSimulation ? 'GPS (Data Simulasi/Uji Coba): ' : 'GPS: '} 
                        {asset.gpsCoords.lat}, {asset.gpsCoords.lng}
                      </span>
                    )}
                  </div>
                </div>
                {asset.assignedManager && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-700 text-[11px]">
                      Pengelola: <strong className="text-slate-900">{asset.assignedManager}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Riwayat Pemeliharaan / Maintenance History */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Riwayat Pemeliharaan & Servis
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {asset.maintenanceHistory.length}
                </span>
              </div>
              {totalMaintenanceCost > 0 && (
                <span className="text-xs text-slate-600">
                  Total Biaya: <strong className="text-emerald-700">{formatCurrency(totalMaintenanceCost)}</strong>
                </span>
              )}
            </div>

            {asset.maintenanceHistory.length === 0 ? (
              <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
                <Wrench className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Belum ada riwayat pemeliharaan tercatat</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Semua catatan servis, renovasi, atau inspeksi fisik akan tampil di sini.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {asset.maintenanceHistory.map((item: MaintenanceRecord, idx: number) => (
                  <div 
                    key={item.id || idx}
                    className="p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl text-xs space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.type}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-slate-700 text-[11px] bg-white p-2 rounded-lg border border-slate-200/80">
                        {item.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Pelaksana: <strong className="text-slate-700">{item.technician || '-'}</strong></span>
                      <span className="font-semibold text-emerald-700">
                        Biaya: {formatCurrency(item.cost || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Terdaftar pada Buku Inventaris Aset Desa
          </div>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Tutup Paspor
          </button>
        </div>
      </div>
    </div>
  );
};
