import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Boxes, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Wrench, 
  Calendar, 
  MapPin, 
  FileText, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity, 
  BarChart3, 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Check, 
  AlertCircle, 
  Building2, 
  Droplets, 
  Lightbulb, 
  Trash2, 
  Flame, 
  Info,
  SlidersHorizontal,
  ExternalLink,
  Shield,
  FileCheck,
  Eye,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { AssetItem, CitizenReport, LetterRequest, VillageProfile } from '../types';
import { 
  computeInfrastructureAnalytics, 
  computeAssetAnalytics, 
  computeServiceAnalytics, 
  computeComplaintAnalytics,
  RecurringProblemSpot,
  RepairHistoryItem,
  UpcomingMaintenanceSchedule
} from '../utils/decisionSupportAnalytics';

interface MataElangFourPillarsProps {
  reports: CitizenReport[];
  assets: AssetItem[];
  letters?: LetterRequest[];
  villageProfile: VillageProfile;
  initialActiveCategory?: 'all' | 'infrastruktur' | 'aset' | 'pelayanan' | 'pengaduan';
}

export const MataElangFourPillars: React.FC<MataElangFourPillarsProps> = ({
  reports,
  assets,
  letters = [],
  villageProfile,
  initialActiveCategory = 'all'
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'infrastruktur' | 'aset' | 'pelayanan' | 'pengaduan'>(initialActiveCategory);
  const [infraFilter, setInfraFilter] = useState<'all' | 'recurring' | 'history' | 'pending'>('all');
  const [assetFilter, setAssetFilter] = useState<'all' | 'normal' | 'inspection' | 'schedule' | 'damaged'>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'sku' | 'ktp' | 'domisili' | 'sktm'>('all');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'jalan' | 'lampu' | 'sampah' | 'drainase'>('all');
  const [selectedSpotModal, setSelectedSpotModal] = useState<RecurringProblemSpot | null>(null);
  const [selectedScheduleModal, setSelectedScheduleModal] = useState<UpcomingMaintenanceSchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Compute structured analytics
  const infraData = useMemo(() => computeInfrastructureAnalytics(reports, assets), [reports, assets]);
  const assetData = useMemo(() => computeAssetAnalytics(assets), [assets]);
  const serviceData = useMemo(() => computeServiceAnalytics(letters), [letters]);
  const complaintData = useMemo(() => computeComplaintAnalytics(reports), [reports]);

  // Color mappings for Recharts
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-8" id="mata-elang-four-pillars">
      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Semua 4 Kategori</span>
          </button>

          <button
            onClick={() => setActiveCategory('infrastruktur')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeCategory === 'infrastruktur'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Infrastruktur</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeCategory === 'infrastruktur' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700'
            }`}>
              {infraData.totalInfraReports}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('aset')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeCategory === 'aset'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-purple-400" />
            <span>2. Aset</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeCategory === 'aset' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-700'
            }`}>
              {assetData.totalAssets}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('pelayanan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeCategory === 'pelayanan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. Pelayanan</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeCategory === 'pelayanan' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {serviceData.totalRequests}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('pengaduan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              activeCategory === 'pengaduan'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>4. Pengaduan</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeCategory === 'pengaduan' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-700'
            }`}>
              {complaintData.totalReports}
            </span>
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-500 hidden md:flex items-center gap-1.5 pr-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Mata Elang DSS v2.6 — Master Faktual & Simulasi Teruji</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. KATEGORI: INFRASTRUKTUR */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'infrastruktur') && (
        <section className="bg-white border-2 border-blue-100/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6" id="panel-infrastruktur">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded uppercase tracking-wider">
                    Pilar 1: Infrastruktur Fisik
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• Jalan, Jembatan, PJU & Saluran</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                  Monitoring Infrastruktur & Titik Kritis Desa
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>{infraData.pendingInfraReportsCount} Laporan Belum Selesai</span>
              </span>
            </div>
          </div>

          {/* 4 Kartu Ringkasan Utama: Infrastruktur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Jumlah Laporan Infrastruktur */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Jumlah Laporan</span>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-blue-950">{infraData.totalInfraReports}</span>
                <span className="text-xs font-extrabold text-blue-700">laporan masuk</span>
              </div>
              <p className="text-[11px] text-blue-800/80 leading-tight">
                Mencakup Jalan Rusak (27), PJU Padam (21), dan Drainase/Banjir (22).
              </p>
            </div>

            {/* Card 2: Lokasi Masalah Berulang */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">Masalah Berulang</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-amber-950">{infraData.recurringLocations.length}</span>
                <span className="text-xs font-extrabold text-amber-700">titik hotspot</span>
              </div>
              <p className="text-[11px] text-amber-800/80 leading-tight">
                Titik kritis paling sering diadukan: Ruas Akses TPA RW 03 (14x) & Jalibar (11x).
              </p>
            </div>

            {/* Card 3: Histori Perbaikan */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">Histori Perbaikan</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-950">{infraData.repairHistory.length}</span>
                <span className="text-xs font-extrabold text-emerald-700">proyek tercatat</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-tight">
                Total realisasi penanganan fisik: Rp {(infraData.repairHistory.reduce((s, r) => s + r.cost, 0) / 1000000).toFixed(1)} Juta APBDes/Swadaya.
              </p>
            </div>

            {/* Card 4: Laporan Belum Selesai */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider">Belum Selesai</span>
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-rose-950">{infraData.pendingInfraReportsCount}</span>
                <span className="text-xs font-extrabold text-rose-700">titik antrean</span>
              </div>
              <p className="text-[11px] text-rose-800/80 leading-tight">
                Dalam status penanganan teknis lapangan dan usulan prioritas Musrenbangdes.
              </p>
            </div>
          </div>

          {/* Sub-Panel: Lokasi Masalah Berulang (Recurring Hotspots) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                Matriks Lokasi Masalah Berulang (Recurring Hotspots)
              </h4>
              <span className="text-xs text-slate-500 font-semibold">Tersaring Berdasarkan Frekuensi Kejadian</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {infraData.recurringLocations.map((spot) => (
                <div 
                  key={spot.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-blue-400 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md text-[10px] font-black uppercase">
                        {spot.dusun} ({spot.rtRw})
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        spot.severity === 'Kritis' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        Urgensi: {spot.severity}
                      </span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {spot.locationName}
                    </h5>

                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Terjadi Berulang: <strong>{spot.occurrenceCount} Kali Laporan</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                      {spot.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Estimasi Alokasi APBDes</span>
                      <span className="text-xs font-black text-slate-900">
                        Rp {(spot.estimatedCost / 1000000).toFixed(0)} Juta
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedSpotModal(spot)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1"
                    >
                      <span>Rekomendasi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Panel: Histori Perbaikan & Laporan Belum Selesai (Side by Side / Tabs) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* Histori Perbaikan Table */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  Rekam Jejak Histori Perbaikan
                </h4>
                <span className="text-[11px] text-slate-500 font-bold">{infraData.repairHistory.length} Proyek</span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {infraData.repairHistory.map((rep) => (
                  <div key={rep.id} className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h6 className="text-xs font-extrabold text-slate-900">{rep.assetName}</h6>
                        <span className="text-[10px] text-slate-500 font-mono">{rep.code} • {rep.location}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-black shrink-0">
                        {rep.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span><strong>Jenis:</strong> {rep.repairType}</span>
                      <span className="font-black text-emerald-700">Rp {(rep.cost || 0).toLocaleString('id-ID')}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      <strong>Pelaksana:</strong> {rep.technician} • <em>{rep.date}</em>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Laporan Infrastruktur Belum Selesai (Pending/In Progress) */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Laporan Belum Selesai ({infraData.pendingInfraReportsCount})
                </h4>
                <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Antrean Intervensi
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {infraData.pendingInfraReports.slice(0, 5).map((rep) => (
                  <div key={rep.id} className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h6 className="text-xs font-extrabold text-slate-900">{rep.title}</h6>
                        <span className="text-[10px] text-slate-500">{rep.rtRw}, {rep.dusun}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                        rep.urgency === 'Darurat' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.urgency}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                      {rep.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Status: <strong className="text-slate-700">{rep.status}</strong></span>
                      <span>Pelapor: {rep.reporterName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. KATEGORI: ASET */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'aset') && (
        <section className="bg-white border-2 border-purple-100/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6" id="panel-aset">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded uppercase tracking-wider">
                    Pilar 2: Manajemen & Valuasi Aset
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• 50 Objek Terdata Black Box</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                  Status Kesehatan, Inspeksi & Jadwal Pemeliharaan Aset
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold">
                Valuasi Total: <strong>Rp {(assetData.totalValuation / 1000000000).toFixed(2)} Miliar</strong>
              </span>
            </div>
          </div>

          {/* 4 Kartu Ringkasan Utama: Aset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Aset Berstatus Normal (Baik) */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">Status Normal (Baik)</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-950">{assetData.normalCount}</span>
                <span className="text-xs font-extrabold text-emerald-700">unit ({assetData.normalPercentage}%)</span>
              </div>
              <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${assetData.normalPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-emerald-800/80 leading-tight">
                Kondisi operasional prima, termasuk Balai Desa, SDN 1, Mobil Siaga, dsb.
              </p>
            </div>

            {/* Card 2: Aset Perlu Inspeksi */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">Perlu Inspeksi / Servis</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-amber-950">{assetData.inspectionNeededCount}</span>
                <span className="text-xs font-extrabold text-amber-700">unit ({assetData.inspectionNeededPercentage}%)</span>
              </div>
              <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${assetData.inspectionNeededPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-amber-800/80 leading-tight">
                Memerlukan tune-up: Pompa Metro, Truk Sampah, Posyandu Melati, PJU #4.
              </p>
            </div>

            {/* Card 3: Jadwal Pemeliharaan Mendatang */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Jadwal Mendatang</span>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-blue-950">{assetData.upcomingSchedules.length}</span>
                <span className="text-xs font-extrabold text-blue-700">agenda servis</span>
              </div>
              <p className="text-[10px] text-blue-800/80 leading-tight">
                Agenda preventif jatuh tempo: Pompa Submersible (05 Sep) & Truk Dump (12 Sep).
              </p>
            </div>

            {/* Card 4: Aset Rusak / Overdue */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider">Aset Rusak / Overdue</span>
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-rose-950">{assetData.damagedAndOverdueCount}</span>
                <span className="text-xs font-extrabold text-rose-700">unit berisiko</span>
              </div>
              <p className="text-[10px] text-rose-800/80 leading-tight">
                Nilai risiko aset kritis: Rp {(assetData.damagedValuation / 1000000).toFixed(0)} Juta (IPLT & Jalan Tani).
              </p>
            </div>
          </div>

          {/* Sub-Panel: Jadwal Pemeliharaan Mendatang & Timeline Agenda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Agenda Jadwal Pemeliharaan Preventif Mendatang
              </h4>
              <span className="text-xs text-slate-500 font-semibold">Tersinkronisasi dengan Lab TEFA SMK & BUMDes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="p-3 font-extrabold">Aset & Kode</th>
                    <th className="p-3 font-extrabold">Kategori</th>
                    <th className="p-3 font-extrabold">Jatuh Tempo</th>
                    <th className="p-3 font-extrabold">Status Agenda</th>
                    <th className="p-3 font-extrabold">Teknisi Bertugas</th>
                    <th className="p-3 font-extrabold">Estimasi Biaya</th>
                    <th className="p-3 font-extrabold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assetData.upcomingSchedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">{sch.assetName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{sch.code}</div>
                      </td>
                      <td className="p-3 text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[10px]">
                          {sch.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900">{sch.dueDate}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                          sch.status === 'Jatuh Tempo Segera' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {sch.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {sch.technician}
                      </td>
                      <td className="p-3 font-black text-emerald-700">
                        Rp {(sch.estimatedCost || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedScheduleModal(sch)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-[11px] transition-all"
                        >
                          Rincian Scope
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-Panel: Matriks Aset Rusak & Kritis */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Daftar Aset Rusak Berat & Rusak Ringan (Butuh Intervensi Musrenbang)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {assetData.damagedAndOverdueAssets.map((asset) => (
                <div key={asset.id} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      asset.condition === 'Rusak Berat' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {asset.condition}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      Rp {(asset.estimatedValue || 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <h6 className="text-xs font-extrabold text-slate-900">{asset.name}</h6>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{asset.code} • {asset.rtRw}, {asset.dusun}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-600 border border-slate-100">
                    <strong>Tahun Bangun:</strong> {asset.yearBuilt} • <strong>Pengelola:</strong> {asset.assignedManager || 'Pemerintah Desa'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. KATEGORI: PELAYANAN */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'pelayanan') && (
        <section className="bg-white border-2 border-emerald-100/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6" id="panel-pelayanan">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded uppercase tracking-wider">
                    Pilar 3: Efisiensi Pelayanan Publik
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• SLA Otorisasi Surat & Stempel Digital</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                  Statistik Permohonan, Kategori Layanan & Kecepatan Proses (SLA)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black">
                Tingkat Keberhasilan: {serviceData.completionRate}%
              </span>
            </div>
          </div>

          {/* 4 Kartu Ringkasan Utama: Pelayanan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Jumlah Permohonan */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">Jumlah Permohonan</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-950">{serviceData.totalRequests}</span>
                <span className="text-xs font-extrabold text-emerald-700">berkas diajukan</span>
              </div>
              <p className="text-[10px] text-emerald-800/80 leading-tight">
                Integrasi permohonan mandiri warga via portal RT & WhatsApp Bot Desa.
              </p>
            </div>

            {/* Card 2: Status Permohonan */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Status Permohonan</span>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-blue-950">{serviceData.completedCount}</span>
                <span className="text-xs font-extrabold text-blue-700">selesai ({serviceData.completionRate}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">{serviceData.approvedRtCount} Disetujui RT</span>
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold">{serviceData.waitingRtCount} Antre</span>
              </div>
            </div>

            {/* Card 3: Kategori Layanan */}
            <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider">Kategori Layanan</span>
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-2xs">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-purple-950">{serviceData.serviceCategories.length}</span>
                <span className="text-xs font-extrabold text-purple-700">ragam jenis surat</span>
              </div>
              <p className="text-[10px] text-purple-800/80 leading-tight">
                Terbanyak: Surat Keterangan Usaha (37.5%) & Pengantar KTP/KK (29.2%).
              </p>
            </div>

            {/* Card 4: Rata-Rata Waktu Proses (SLA) */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Rata-Rata Waktu Proses</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-900 flex items-center justify-center shadow-2xs">
                  <Zap className="w-4 h-4 font-black" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white">{serviceData.averageProcessingTimeMinutes}</span>
                <span className="text-xs font-extrabold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-500/40">Menit (Data B — Simulasi)</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">
                Simulasi pemangkasan 85% waktu warga vs konvensional (Belum diuji pada responden nyata).
              </p>
            </div>
          </div>

          {/* Sub-Panel: Distribusi Kategori Layanan & Performa RT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Kategori Layanan Breakdown */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Rincian Kategori Layanan Administrasi
              </h4>

              <div className="space-y-2.5">
                {serviceData.serviceCategories.map((cat) => (
                  <div key={cat.code} className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{cat.categoryName}</span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {cat.count} Berkas ({cat.percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Rata-rata SLA: <strong>{cat.avgSlaMinutes} Menit</strong></span>
                      <span>Kepuasan Warga: <strong>{cat.satisfactionRate}% ⭐</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performa Kecepatan Otorisasi per RT */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Kecepatan Otorisasi Surat Tingkat RT (SLA Respon)
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white text-slate-700 border-b border-slate-200">
                      <th className="p-2.5 font-extrabold">Wilayah RT/RW</th>
                      <th className="p-2.5 font-extrabold">Dusun</th>
                      <th className="p-2.5 font-extrabold">Volume</th>
                      <th className="p-2.5 font-extrabold">Rata-rata</th>
                      <th className="p-2.5 font-extrabold">Klasifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {serviceData.rtPerformances.map((rt) => (
                      <tr key={rt.rtRw} className="hover:bg-white/80 transition-colors">
                        <td className="p-2.5 font-extrabold text-slate-900">{rt.rtRw}</td>
                        <td className="p-2.5 text-slate-600">{rt.dusun}</td>
                        <td className="p-2.5 font-bold text-slate-900">{rt.processedCount} Surat</td>
                        <td className="p-2.5 font-black text-emerald-700">{rt.avgMinutes} Mnt</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                            {rt.speedCategory}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. KATEGORI: PENGADUAN */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'pengaduan') && (
        <section className="bg-white border-2 border-amber-100/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6" id="panel-pengaduan">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded uppercase tracking-wider">
                    Pilar 4: Analitik Suara & Pengaduan Warga
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• 120 Data Simulasi Terverifikasi Skenario</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                  Kategori, Lokasi, Frekuensi, Status & Tren Pengaduan Warga
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-black">
                Tingkat Penyelesaian: {complaintData.resolutionRate}% ({complaintData.resolvedCount}/{complaintData.totalReports})
              </span>
            </div>
          </div>

          {/* 4 Kartu Ringkasan Utama: Pengaduan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Kategori Pengaduan */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">Kategori Pengaduan</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-amber-950">{complaintData.categoryDistribution.length}</span>
                <span className="text-xs font-extrabold text-amber-700">klaster masalah</span>
              </div>
              <p className="text-[10px] text-amber-800/80 leading-tight">
                Terbanyak: Jalan Rusak (27), Lampu PJU (21), Sampah (19), Drainase (22).
              </p>
            </div>

            {/* Card 2: Lokasi Sebaran */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Sebaran Lokasi</span>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-blue-950">5 RW</span>
                <span className="text-xs font-extrabold text-blue-700">27 RT tercakup</span>
              </div>
              <p className="text-[10px] text-blue-800/80 leading-tight">
                Wilayah terpadat pengaduan: RW 05 Perumnas (31 aduan) & RW 04 (25 aduan).
              </p>
            </div>

            {/* Card 3: Frekuensi Kemunculan */}
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider">Frekuensi Masalah</span>
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-rose-950">14x</span>
                <span className="text-xs font-extrabold text-rose-700">puncak pengulangan</span>
              </div>
              <p className="text-[10px] text-rose-800/80 leading-tight">
                Frekuensi tertinggi pada jalur logistik truk sampah & drainase Jalibar.
              </p>
            </div>

            {/* Card 4: Status Penyelesaian */}
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4.5 space-y-2 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">Status Penyelesaian</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-950">{complaintData.resolutionRate}%</span>
                <span className="text-xs font-extrabold text-emerald-700">{complaintData.resolvedCount} Selesai</span>
              </div>
              <p className="text-[10px] text-emerald-800/80 leading-tight">
                {complaintData.inProgressCount} Sedang Dikerjakan • {complaintData.forwardedCount} Diteruskan ke Dinas.
              </p>
            </div>
          </div>

          {/* Sub-Panel: Visualisasi Tren dari Waktu ke Waktu (Januari - Juni 2026) */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Tren Pengaduan Masuk vs Penyelesaian dari Waktu ke Waktu (Jan–Jun 2026)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Data menunjukkan tren penurunan aduan baru seiring masifnya pemeliharaan preventif.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-blue-600"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Laporan Masuk</span>
                <span className="flex items-center gap-1 text-emerald-600"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Laporan Selesai</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complaintData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="totalIncoming" name="Laporan Masuk" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncoming)" />
                  <Area type="monotone" dataKey="resolved" name="Laporan Selesai" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sub-Panel: Kategori & Sebaran Wilayah RW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Kategori Pengaduan Breakdown */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Distribusi Kategori Pengaduan (120 Laporan)
              </h4>

              <div className="space-y-2">
                {complaintData.categoryDistribution.map((cat) => (
                  <div key={cat.category} className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                      <span className="font-extrabold text-slate-900">{cat.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-slate-500">{cat.percentage}%</span>
                      <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {cat.count} Aduan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sebaran Wilayah RW */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Peta Sebaran Pengaduan per Dusun / RW
              </h4>

              <div className="space-y-2">
                {complaintData.locationDistribution.map((loc) => (
                  <div key={loc.rw} className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{loc.rw} • {loc.dusun}</span>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {loc.count} Aduan ({loc.percentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${loc.percentage * 2}%` }}></div>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      <strong>Fokus Aduan:</strong> {loc.hotTopic}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL: Detail Rekomendasi Spot Masalah Berulang */}
      {selectedSpotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">
                  Analisis Rekomendasi Titik Masalah Berulang
                </h3>
              </div>
              <button 
                onClick={() => setSelectedSpotModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{selectedSpotModal.locationName}</span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-black rounded-md text-[10px]">
                    Frekuensi: {selectedSpotModal.occurrenceCount}x
                  </span>
                </div>
                <p className="text-slate-500 font-mono text-[11px]">{selectedSpotModal.rtRw}, {selectedSpotModal.dusun}</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Deskripsi Kerusakan Lapangan:</strong>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedSpotModal.description}
                </p>
              </div>

              <div>
                <strong className="text-emerald-800 block mb-1">Rekomendasi Tindakan Permanen (Mata Elang DSS):</strong>
                <p className="text-emerald-950 font-bold leading-relaxed bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {selectedSpotModal.recommendedAction}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Estimasi Alokasi APBDes:</span>
                <strong className="text-sm font-black text-slate-900">
                  Rp {selectedSpotModal.estimatedCost.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSpotModal(null)}
                className="px-4 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Tutup Analisis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detail Scope Jadwal Pemeliharaan */}
      {selectedScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  Rincian Scope Pemeliharaan Preventif
                </h3>
              </div>
              <button 
                onClick={() => setSelectedScheduleModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 space-y-1">
                <h5 className="font-extrabold text-slate-900 text-sm">{selectedScheduleModal.assetName}</h5>
                <p className="text-purple-700 font-mono text-[11px]">Kode: {selectedScheduleModal.code} • Kategori: {selectedScheduleModal.category}</p>
              </div>

              <div>
                <strong className="text-slate-900 block mb-1">Rincian Pekerjaan Teknis (SOW):</strong>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedScheduleModal.scopeOfWork}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Tanggal Jatuh Tempo</span>
                  <strong className="text-slate-900">{selectedScheduleModal.dueDate}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Teknisi / Pelaksana</span>
                  <strong className="text-slate-900">{selectedScheduleModal.technician}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Estimasi Biaya Servis:</span>
                <strong className="text-sm font-black text-emerald-700">
                  Rp {selectedScheduleModal.estimatedCost.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedScheduleModal(null)}
                className="px-4 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
