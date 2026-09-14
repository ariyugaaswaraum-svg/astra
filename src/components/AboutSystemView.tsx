import React, { useState } from 'react';
import { 
  Box, 
  BrainCircuit, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Database, 
  ArrowRight, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Scale, 
  Lock, 
  Activity, 
  HelpCircle,
  Repeat,
  Quote,
  Radio,
  FileCheck2,
  FolderArchive,
  Search,
  LineChart,
  Gavel,
  Hammer,
  History,
  ChevronRight
} from 'lucide-react';
import { VillageProfile } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface AboutSystemViewProps {
  villageProfile: VillageProfile;
  onNavigateToTab: (tab: string) => void;
}

interface LoopStep {
  id: number;
  label: string;
  sublabel: string;
  desc: string;
  layer: 'Black Box' | 'AI Brain' | 'Mata Elang';
  color: string;
  borderColor: string;
  bgLight: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LOOP_STEPS: LoopStep[] = [
  {
    id: 1,
    label: 'Capture',
    sublabel: 'Penangkapan Data & Aspirasi',
    desc: 'Menjaring data regulasi, inventaris sarana, telemetri sensor IoT, aspirasi warga, serta penuturan lisan sejarah para sesepuh desa.',
    layer: 'Black Box',
    color: '#2563eb', // blue-600
    borderColor: 'border-blue-500',
    bgLight: 'bg-blue-50',
    icon: Radio
  },
  {
    id: 2,
    label: 'Validate',
    sublabel: 'Verifikasi Sumber & Fakta',
    desc: 'Validasi silang berkas hukum, bukti fisik lapangan oleh RT/RW, penentuan status validasi dokumen untuk mencegah data fiktif.',
    layer: 'Black Box',
    color: '#0284c7', // sky-600
    borderColor: 'border-sky-500',
    bgLight: 'bg-sky-50',
    icon: FileCheck2
  },
  {
    id: 3,
    label: 'Remember',
    sublabel: 'Penyimpanan Memori Permanen',
    desc: 'Pengarsipan abadi dalam Digital Village Memory (Black Box) tanpa risiko terhapus meski masa jabatan kepengurusan berganti.',
    layer: 'Black Box',
    color: '#0d9488', // teal-600
    borderColor: 'border-teal-500',
    bgLight: 'bg-teal-50',
    icon: FolderArchive
  },
  {
    id: 4,
    label: 'Retrieve',
    sublabel: 'Penarikan Kontekstual Berakar',
    desc: 'Mesin RAG mencari data presisi berdasarkan dokumen resmi dan sitasi faktual untuk menjawab kebutuhan informasi warga.',
    layer: 'AI Brain',
    color: '#7c3aed', // violet-600
    borderColor: 'border-violet-500',
    bgLight: 'bg-violet-50',
    icon: Search
  },
  {
    id: 5,
    label: 'Analyze',
    sublabel: 'Analisis Risiko & Dampak',
    desc: 'Pemodelan skoring urgensi infrastruktur, kalkulasi SLA pelayanan, serta analisis akar masalah degradasi lingkungan.',
    layer: 'AI Brain',
    color: '#9333ea', // purple-600
    borderColor: 'border-purple-500',
    bgLight: 'bg-purple-50',
    icon: LineChart
  },
  {
    id: 6,
    label: 'Decide',
    sublabel: 'Keputusan Musrenbang & Kades',
    desc: 'Dashboard Mata Elang Desa menyajikan rekomendasi objektif berbasis bukti untuk penentuan prioritas alokasi APBDes.',
    layer: 'Mata Elang',
    color: '#059669', // emerald-600
    borderColor: 'border-emerald-500',
    bgLight: 'bg-emerald-50',
    icon: Gavel
  },
  {
    id: 7,
    label: 'Act',
    sublabel: 'Eksekusi Pembangunan & Layanan',
    desc: 'Realisasi proyek fisik jalan, perbaikan sensor debit air, penyaluran bansos tepat sasaran, dan penerbitan dokumen warga.',
    layer: 'Mata Elang',
    color: '#d97706', // amber-600
    borderColor: 'border-amber-500',
    bgLight: 'bg-amber-50',
    icon: Hammer
  },
  {
    id: 8,
    label: 'Record',
    sublabel: 'Perekaman Hasil & Evaluasi',
    desc: 'Hasil pelaksanaan, dokumentasi foto pengerjaan, dan testimoni kepuasan warga dicatat kembali ke dalam Black Box, menutup siklus.',
    layer: 'Black Box',
    color: '#dc2626', // red-600
    borderColor: 'border-red-500',
    bgLight: 'bg-red-50',
    icon: History
  }
];

export const AboutSystemView: React.FC<AboutSystemViewProps> = ({
  villageProfile,
  onNavigateToTab
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'blackbox' | 'aibrain' | 'mataelang'>('all');
  const [selectedLoopStep, setSelectedLoopStep] = useState<number>(1);

  const architectureSummary = 
    `Sistem Desa Black Box AI beroperasi dalam Closed Knowledge Loop 8 Tahap: ` +
    `Capture, Validate, Remember, Retrieve, Analyze, Decide, Act, dan Record. ` +
    `Prinsip filosofi utama sistem kami: Pemimpin boleh berganti, tetapi pengetahuan desa tidak boleh hilang. ` +
    `Pertama, Black Box menyimpan seluruh memori dokumen, sarana fisik, dan rekaman lisan sesepuh. ` +
    `Kedua, AI Brain menyajikan asistensi cerdas berbasis sumber dokumen faktual. ` +
    `Ketiga, Mata Elang Desa mendukung keputusan eksekutif Kepala Desa dalam Musrenbang dan evaluasi pelayanan.`;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(
        architectureSummary,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(true)
      );
    }
  };

  const currentStepData = LOOP_STEPS.find(s => s.id === selectedLoopStep) || LOOP_STEPS[0];

  // SVG dimensions & math for circular 8 steps
  const svgCenter = 250;
  const radius = 175;
  const nodeRadius = 32;

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Hero Banner with Research Architecture Badge */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Arsitektur Riset Digital Village Memory
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold">
              {villageProfile.name}, Malang
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Mengenal 3 Lapisan Utama & Siklus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300">
              Closed Knowledge Loop Desa Black Box AI
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Sistem tata kelola cerdas mandiri desa yang mengabadikan memori digital permanen, 
            mesin penalaran AI berbasis rujukan dokumen faktual <em>(source-grounded)</em>, serta instrumen pendukung keputusan eksekutif 
            <strong> Mata Elang Desa</strong> untuk perencanaan pembangunan desa yang berkelanjutan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleAudio}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Hentikan Pembacaan Audio' : 'Dengarkan Penjelasan Suara'}</span>
            </button>

            <button
              onClick={() => onNavigateToTab('dss')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Buka Dashboard Mata Elang Desa</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: 8-Step 'Closed Knowledge Loop' Cycle (Circular SVG Visualization) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                <Repeat className="w-4 h-4 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                8-Step Closed Knowledge Loop
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Siklus kontinu pengumpulan data, pengolahan kecerdasan, hingga perekaman kembali hasil pembangunan desa tanpa putus.
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl self-start md:self-center shadow-xs">
            Siklus Berkelanjutan 360°
          </span>
        </div>

        {/* Circular SVG Diagram + Interactive Detail Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Responsive SVG Circular Canvas (Left 7 Cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative p-2 sm:p-4 bg-slate-50/70 border border-slate-200/80 rounded-3xl">
            <div className="w-full max-w-[460px] aspect-square relative">
              <svg 
                viewBox="0 0 500 500" 
                className="w-full h-full select-none"
              >
                <defs>
                  {/* Subtle Glow & Gradients */}
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  
                  {/* Arrowhead marker */}
                  <marker
                    id="loopArrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Ambient Center Circle */}
                <circle 
                  cx={svgCenter} 
                  cy={svgCenter} 
                  r={radius + 35} 
                  fill="url(#centerGlow)" 
                />

                {/* Main Outer Cycle Track */}
                <circle 
                  cx={svgCenter} 
                  cy={svgCenter} 
                  r={radius} 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="6" 
                  strokeDasharray="6 6"
                />

                {/* Animated Inner Loop Direction Path */}
                <circle 
                  cx={svgCenter} 
                  cy={svgCenter} 
                  r={radius} 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                  strokeOpacity="0.4"
                />

                {/* Connecting Directional Arcs with Arrows */}
                {LOOP_STEPS.map((_, idx) => {
                  const total = LOOP_STEPS.length;
                  const startAngle = (idx * (360 / total) - 90 + 12) * (Math.PI / 180);
                  const endAngle = ((idx + 1) * (360 / total) - 90 - 12) * (Math.PI / 180);
                  
                  const x1 = svgCenter + radius * Math.cos(startAngle);
                  const y1 = svgCenter + radius * Math.sin(startAngle);
                  const x2 = svgCenter + radius * Math.cos(endAngle);
                  const y2 = svgCenter + radius * Math.sin(endAngle);
                  
                  return (
                    <path
                      key={`arc-${idx}`}
                      d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      markerEnd="url(#loopArrow)"
                    />
                  );
                })}

                {/* Center Core Hub */}
                <g 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedLoopStep(prev => (prev % 8) + 1)}
                >
                  <circle
                    cx={svgCenter}
                    cy={svgCenter}
                    r={68}
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x={svgCenter}
                    y={svgCenter - 22}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontWeight="800"
                    letterSpacing="1.5"
                  >
                    CLOSED LOOP
                  </text>
                  <text
                    x={svgCenter}
                    y={svgCenter - 2}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="900"
                  >
                    KNOWLEDGE
                  </text>
                  <text
                    x={svgCenter}
                    y={svgCenter + 17}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="600"
                  >
                    Desa Talangagung
                  </text>
                  <text
                    x={svgCenter}
                    y={svgCenter + 33}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="9"
                    fontWeight="800"
                  >
                    ● 8 TAHAPAN SIKLUS
                  </text>
                </g>

                {/* 8 Circular Nodes around the Perimeter */}
                {LOOP_STEPS.map((step, idx) => {
                  const total = LOOP_STEPS.length;
                  const angle = (idx * (360 / total) - 90) * (Math.PI / 180);
                  const x = svgCenter + radius * Math.cos(angle);
                  const y = svgCenter + radius * Math.sin(angle);
                  const isSelected = selectedLoopStep === step.id;

                  return (
                    <g
                      key={`node-${step.id}`}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedLoopStep(step.id)}
                    >
                      {/* Pulse Ring when Selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r={nodeRadius + 7}
                          fill="none"
                          stroke={step.color}
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          className="animate-spin-slow"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={nodeRadius}
                        fill={isSelected ? step.color : '#ffffff'}
                        stroke={isSelected ? '#ffffff' : step.color}
                        strokeWidth={isSelected ? '3' : '2.5'}
                        className="filter drop-shadow-md transition-all hover:scale-110"
                      />

                      {/* Step Number in Circle */}
                      <text
                        x={x}
                        y={y - 6}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : step.color}
                        fontSize="11"
                        fontWeight="900"
                      >
                        0{step.id}
                      </text>

                      {/* Step Label in Circle */}
                      <text
                        x={x}
                        y={y + 8}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#1e293b'}
                        fontSize="9.5"
                        fontWeight="800"
                      >
                        {step.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Quick helper indicator */}
            <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Klik pada salah satu node langkah di atas untuk menelaah rincian alur proses
            </p>
          </div>

          {/* Detailed Selected Step Panel (Right 5 Cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-white/10 text-sky-300 rounded-lg text-[10px] font-extrabold tracking-wider uppercase border border-white/10">
                  Langkah {currentStepData.id} dari 8
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg text-[10px] font-extrabold uppercase">
                  {currentStepData.layer}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-md"
                    style={{ backgroundColor: currentStepData.color }}
                  >
                    <currentStepData.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white tracking-tight">
                      {currentStepData.id}. {currentStepData.label}
                    </h4>
                    <p className="text-xs font-semibold text-slate-300">
                      {currentStepData.sublabel}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentStepData.desc}
              </p>

              {/* Step Navigation Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedLoopStep(prev => prev > 1 ? prev - 1 : 8)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all"
                >
                  ← Sebelumnya
                </button>
                <div className="flex items-center gap-1">
                  {LOOP_STEPS.map(s => (
                    <button
                      key={`dot-${s.id}`}
                      onClick={() => setSelectedLoopStep(s.id)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        selectedLoopStep === s.id ? 'bg-blue-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Pilih tahap ${s.id}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setSelectedLoopStep(prev => prev < 8 ? prev + 1 : 1)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick 8 Steps Summary Grid */}
            <div className="grid grid-cols-2 gap-2">
              {LOOP_STEPS.map((s) => {
                const isSelected = selectedLoopStep === s.id;
                return (
                  <button
                    key={`mini-${s.id}`}
                    onClick={() => setSelectedLoopStep(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${
                      isSelected 
                        ? 'bg-blue-50/90 border-blue-400 shadow-xs' 
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-md text-white font-extrabold text-[10px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.id}
                    </span>
                    <div className="truncate">
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                        {s.label}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {s.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* PROMINENT SECTION: Tagline Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border-2 border-slate-800 p-8 sm:p-10 shadow-2xl text-center">
        {/* Ambient Decorative Background Shapes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-400 shadow-inner mb-1">
            <Quote className="w-6 h-6 rotate-180" />
          </div>

          <div className="space-y-3">
            <span className="px-3.5 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest inline-block">
              Prinsip Fundamental Keberlanjutan Desa
            </span>

            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              &ldquo;Pemimpin boleh berganti, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-200 to-emerald-300">
                tetapi pengetahuan desa tidak boleh hilang.
              </span>&rdquo;
            </blockquote>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto pt-1">
              Desa Black Box AI memastikan rekam jejak keputusan, aset infrastruktur, regulasi, 
              dan hikmah pengalaman masa lalu tetap hidup, terwariskan, dan dapat diakses oleh setiap generasi kepengurusan Desa Talangagung berikutnya.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Digital Village Memory</span>
            <span className="text-slate-600">•</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Source-Grounded AI</span>
            <span className="text-slate-600">•</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>Mata Elang Decision Support</span>
          </div>
        </div>
      </div>

      {/* Layer Selector Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeLayer === 'all' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua 3 Lapisan Sistem
        </button>
        <button
          onClick={() => setActiveLayer('blackbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeLayer === 'blackbox' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-blue-500" />
          <span>1. Black Box - Digital Village Memory</span>
        </button>
        <button
          onClick={() => setActiveLayer('aibrain')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeLayer === 'aibrain' 
              ? 'bg-purple-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
          <span>2. AI Brain - Knowledge Retrieval</span>
        </button>
        <button
          onClick={() => setActiveLayer('mataelang')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeLayer === 'mataelang' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-emerald-500" />
          <span>3. Mata Elang Desa (DSS)</span>
        </button>
      </div>

      {/* 3 Core Architecture Pillars Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PILLAR 1: Black Box - Digital Village Memory */}
        {(activeLayer === 'all' || activeLayer === 'blackbox') && (
          <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
                  Lapisan 1: Storage
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  Black Box — Digital Village Memory
                </h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                  Penyimpanan Memori Kolektif & Brankas Arsip Digital Desa
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Berfungsi layaknya <em>flight data recorder</em> pada pesawat: mencatat dan mengarsipkan seluruh dokumen legal (Perdes, APBDes, RPJMDes), inventaris fisik jalan & jembatan, riwayat wawancara sesepuh desa, serta telemetri sensor IoT secara permanen.
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Komponen Data Tersimpan:</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Dokumen & Perdes:</strong> Regulasi hukum & APBDes 2026.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Aset Fisik & Infrastruktur:</strong> Jalan, jembatan, traktor, PAMSIMAS.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Memori Tokoh:</strong> Rekaman audio & cerita sejarah pembangunan.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Telemetri IoT:</strong> Sensor debit air & baterai surya live.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateToTab('knowledge')}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Buka Modul Dokumen & Memori</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PILLAR 2: AI Brain - Source-Grounded Knowledge Retrieval */}
        {(activeLayer === 'all' || activeLayer === 'aibrain') && (
          <div className="bg-white border-2 border-purple-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
                  Lapisan 2: Intelligence
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  AI Brain — Source-Grounded Retrieval
                </h3>
                <p className="text-xs font-semibold text-purple-600 mt-0.5">
                  Penalaran Cerdas Bebas Halusinasi Berbasis Rujukan Dokumen
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Lapisan kognitif berbasis Gemini AI dengan teknik RAG <em>(Retrieval-Augmented Generation)</em> berakar kuat pada data faktual desa. Setiap jawaban WA Bot dan asisten portal wajib menyertakan bukti nama dokumen, tanggal penerbitan, dan status validasi.
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Prinsip Grounding Ketat:</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>100% Berbasis Sumber:</strong> Rujukan nama & tanggal dokumen resmi.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Status Validasi Faktual:</strong> Terverifikasi vs Tidak Berlaku.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Akses Multikanal:</strong> Bot Telegram resmi (@desablackboxai_bot) & Voice Web.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Deep Reasoning:</strong> Pelacakan akar masalah degradasi fisik.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateToTab('assistant')}
                className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Uji WA Bot & AI Asisten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PILLAR 3: Mata Elang Desa (Decision Support System) */}
        {(activeLayer === 'all' || activeLayer === 'mataelang') && (
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
                  Lapisan 3: Decision
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  Mata Elang Desa — Decision Support
                </h3>
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                  Instrumen Pengambil Kebijakan Eksekutif & Musrenbangdes
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Menyajikan pandangan menyeluruh <em>(bird-eye view)</em> bagi Kepala Desa dan BPD untuk memantau titik kritis infrastruktur, valuasi risiko aset, efisiensi waktu layanan surat, dan distribusi peta panas pengaduan warga secara objektif.
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Output Kebijakan Cerdas:</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Matriks Prioritas Infrastruktur:</strong> Skor urgensi 1-100.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Peta Panas Pengaduan:</strong> Distribusi aduan per RT & status.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>SLA Efisiensi Surat:</strong> Waktu verifikasi RT vs Pemerintah Desa.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Draf Usulan Otomatis:</strong> Generator teks RKP Desa & SK Kades.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateToTab('dss')}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Buka Dashboard Mata Elang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Source Citation & Validation Status Explanation Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              Standar Grounding Sumber & Status Validasi Faktual
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap informasi yang dihasilkan oleh AI Asisten dan Bot Telegram diverifikasi silang dengan status validasi resmi.
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold self-start sm:self-center">
            4 Status Validasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                Terverifikasi
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-extrabold text-emerald-950">Data Sah & Terbukti</h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Dokumen telah disahkan secara hukum (Perdes, SK Kepala Desa, atau Berita Acara resmi) dan sesuai survei lapangan.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                Diperbarui
              </span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-xs font-extrabold text-blue-950">Versi Terbaru Aktif</h4>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Dokumen atau status aset yang telah mengalami addendum / revisi terbaru (misal: Perubahan APBDes atau perbaikan jalan selesai).
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                Belum Diverifikasi
              </span>
              <HelpCircle className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-xs font-extrabold text-amber-950">Dalam Peninjauan</h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Data aspirasi warga baru, laporan kerusakan yang belum dicek fisik oleh Ketua RT, atau draf program kerja awal.
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                Tidak Berlaku
              </span>
              <Lock className="w-4 h-4 text-rose-600" />
            </div>
            <h4 className="text-xs font-extrabold text-rose-950">Kedaluwarsa / Usang</h4>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Regulasi masa lalu yang telah dicabut atau aset yang telah dihapusbukukan / diganti dengan fasilitas baru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
