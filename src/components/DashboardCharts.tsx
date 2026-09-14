import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  ShieldCheck, 
  Activity, 
  Baby, 
  Users, 
  FileText, 
  AlertTriangle, 
  Sparkles,
  HeartPulse,
  Lightbulb,
  CheckCircle2,
  Building2,
  Clock
} from 'lucide-react';
import { VillageProfile, MonthlyTrendData } from '../types';

interface DashboardChartsProps {
  villageProfile: VillageProfile;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ villageProfile }) => {
  const [activeChartTab, setActiveChartTab] = useState<'trends' | 'posyandu' | 'budget'>('trends');

  // APBDes Allocation Data (Donut Chart)
  const apbdesData = [
    { name: 'Infrastruktur & Jalan', value: 45, amount: 'Rp 639 Juta', color: '#0284c7' }, // Blue
    { name: 'Pemberdayaan Warga & Tani', value: 25, amount: 'Rp 355 Juta', color: '#10b981' }, // Emerald
    { name: 'Pemerintahan & Layanan RT', value: 20, amount: 'Rp 284 Juta', color: '#8b5cf6' }, // Purple
    { name: 'Pembinaan & Kesehatan', value: 10, amount: 'Rp 142 Juta', color: '#f59e0b' }, // Amber
  ];

  // RT & RW Status Data (Bar Chart)
  const rtPerformanceData = [
    { name: 'RT 01', aman: 14, proses: 1, butuhAtensi: 0 },
    { name: 'RT 02', aman: 12, proses: 2, butuhAtensi: 1 },
    { name: 'RT 03', aman: 9, proses: 3, butuhAtensi: 1 },
    { name: 'RT 04', aman: 15, proses: 1, butuhAtensi: 0 },
    { name: 'RT 05', aman: 8, proses: 2, butuhAtensi: 2 },
  ];

  // Monthly Citizen Reports & Letter Processing Trends
  const monthlyTrends: MonthlyTrendData[] = [
    { month: 'Okt 2025', laporanJalan: 12, laporanLampu: 8, laporanDrainase: 6, suratDiproses: 42, kunjunganBalita: 110, kunjunganLansia: 65, ibuHamil: 24, giziBaik: 102, perluPemantauan: 8 },
    { month: 'Nov 2025', laporanJalan: 15, laporanLampu: 6, laporanDrainase: 11, suratDiproses: 48, kunjunganBalita: 118, kunjunganLansia: 70, ibuHamil: 26, giziBaik: 112, perluPemantauan: 6 },
    { month: 'Des 2025', laporanJalan: 18, laporanLampu: 9, laporanDrainase: 14, suratDiproses: 39, kunjunganBalita: 105, kunjunganLansia: 68, ibuHamil: 25, giziBaik: 99, perluPemantauan: 6 },
    { month: 'Jan 2026', laporanJalan: 9, laporanLampu: 5, laporanDrainase: 8, suratDiproses: 56, kunjunganBalita: 124, kunjunganLansia: 74, ibuHamil: 28, giziBaik: 119, perluPemantauan: 5 },
    { month: 'Feb 2026', laporanJalan: 7, laporanLampu: 4, laporanDrainase: 5, suratDiproses: 61, kunjunganBalita: 128, kunjunganLansia: 79, ibuHamil: 29, giziBaik: 124, perluPemantauan: 4 },
    { month: 'Mar 2026', laporanJalan: 4, laporanLampu: 2, laporanDrainase: 3, suratDiproses: 68, kunjunganBalita: 132, kunjunganLansia: 82, ibuHamil: 31, giziBaik: 129, perluPemantauan: 3 },
  ];

  const totalApbdesFormatted = (villageProfile.apbdesTotal / 1000000000).toFixed(2);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header with View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Dashboard Data Trends & Analitik Desa</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                Live Data RT/RW
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visualisasi tren bulanan laporan warga, kecepatan proses surat, dan statistik posyandu
            </p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveChartTab('trends')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeChartTab === 'trends'
                ? 'bg-white text-blue-600 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Laporan & Surat</span>
          </button>
          <button
            onClick={() => setActiveChartTab('posyandu')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeChartTab === 'posyandu'
                ? 'bg-white text-emerald-600 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Posyandu & Gizi</span>
          </button>
          <button
            onClick={() => setActiveChartTab('budget')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeChartTab === 'budget'
                ? 'bg-white text-purple-600 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>APBDes & RT</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Tren Laporan Warga & Surat per Bulan */}
      {activeChartTab === 'trends' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-800">Total Surat Diproses</span>
              <p className="text-xl font-extrabold text-blue-950 mt-0.5">314 Berkas</p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +14.5% vs triwulan lalu
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-[11px] font-bold text-amber-800">Laporan Jalan Selesai</span>
              <p className="text-xl font-extrabold text-amber-950 mt-0.5">58 Titik</p>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                92% Tertangani RT & Desa
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-[11px] font-bold text-purple-800">Lampu PJU Menyala</span>
              <p className="text-xl font-extrabold text-purple-950 mt-0.5">97.4%</p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                Respon ganti bohlam &lt; 24 jam
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800">Rata-rata Waktu Surat</span>
              <p className="text-xl font-extrabold text-emerald-950 mt-0.5">8.5 Menit</p>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                Via Tanda Tangan QR RT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Tren Surat & Laporan */}
            <div className="lg:col-span-8 bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Grafik Tren Bulanan: Pengajuan Surat vs Laporan Masalah</h4>
                  <p className="text-[10px] text-slate-500">Korelasi digitalisasi RT terhadap penurunan keluhan fasilitas</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Okt 2025 - Mar 2026
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSurat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorJalan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} />
                    <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                    <Area type="monotone" dataKey="suratDiproses" name="Surat Warga Diproses" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSurat)" />
                    <Area type="monotone" dataKey="laporanJalan" name="Laporan Jalan Rusak" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorJalan)" />
                    <Line type="monotone" dataKey="laporanLampu" name="Laporan Lampu Mati" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Trend Insights */}
            <div className="lg:col-span-4 bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-200">Simulasi Analitik AI (Data Contoh)</h4>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 space-y-2 text-xs">
                  <p className="leading-relaxed text-slate-200 text-[11px]">
                    📈 <strong>Tren Pengajuan SKU:</strong> Kenaikan pengajuan SKU Usaha Mikro (+34%) di periode Januari-Maret sejalan dengan pembukaan program fasilitasi BUMDes.
                  </p>
                  <p className="leading-relaxed text-slate-200 text-[11px]">
                    🛠️ <strong>Tren Keluhan Jalan:</strong> Laporan jalan berlubang menurun dari 18 kasus (Desember) menjadi 4 kasus (Maret) pasca penanganan perbaikan jalan lingkungan RT 02 & RT 05.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] text-blue-300 flex items-center justify-between">
                <span>Model AI Analitik Desa</span>
                <span className="font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded text-[9px]">Simulasi Analitik (Data Contoh)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Statistik Kunjungan Posyandu & Gizi Balita */}
      {activeChartTab === 'posyandu' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-800">Kunjungan Balita Rata-rata</span>
                <p className="text-lg font-extrabold text-emerald-950">132 Balita / Bulan</p>
                <span className="text-[10px] text-emerald-600 font-bold">Cakupan Imunisasi 98%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-purple-800">Pemeriksaan Posyandu Lansia</span>
                <p className="text-lg font-extrabold text-purple-950">82 Lansia / Bulan</p>
                <span className="text-[10px] text-purple-600 font-bold">Cek Tensi & Gula Rutin</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-800">Status Gizi Balita Sehat</span>
                <p className="text-lg font-extrabold text-rose-950">97.7% Sehat Normal</p>
                <span className="text-[10px] text-slate-500 font-medium">Hanya 3 balita perlu atensi PMT</span>
              </div>
            </div>
          </div>

          {/* Posyandu Trends Chart */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Grafik Kunjungan Posyandu & Pendampingan Ibu Hamil</h4>
                <p className="text-[10px] text-slate-500">Data terpadu Bidan Desa & Kader PKK Dusun 1 s/d Dusun 3</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Zero Stunting Initiative
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} />
                  <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="kunjunganBalita" name="Kunjungan Balita" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="kunjunganLansia" name="Kunjungan Lansia" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ibuHamil" name="Ibu Hamil Terpantau" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Alokasi APBDes & Performa RT */}
      {activeChartTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          {/* APBDes Donut */}
          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <PieIcon className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">Alokasi Anggaran APBDes 2026</h4>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  Total Rp {totalApbdesFormatted} M
                </span>
              </div>

              <div className="h-52 w-full relative mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={apbdesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {apbdesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val, name, item) => [`${val}% (${item.payload.amount})`, name]}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Dana</span>
                  <span className="text-sm font-extrabold text-slate-900">100%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
              {apbdesData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 text-[10px] block truncate">{item.name}</span>
                    <span className="text-[9px] text-slate-500 font-bold">{item.value}% ({item.amount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Sarana RT */}
          <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Status Sarana & Laporan per RT</h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  5 Wilayah RT
                </span>
              </div>

              <div className="h-52 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rtPerformanceData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} />
                    <Legend 
                      verticalAlign="top" 
                      height={24}
                      wrapperStyle={{ fontSize: '10px', fontWeight: 600 }}
                      formatter={(val) => {
                        if (val === 'aman') return 'Baik/Selesai';
                        if (val === 'proses') return 'Sedang Dikerjakan';
                        if (val === 'butuhAtensi') return 'Butuh Atensi';
                        return val;
                      }}
                    />
                    <Bar dataKey="aman" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="aman" />
                    <Bar dataKey="proses" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="proses" />
                    <Bar dataKey="butuhAtensi" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="butuhAtensi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tingkat Respon RT: <strong className="text-slate-900">94.8%</strong></span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
