import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Eye, 
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AssetItem, CitizenReport } from '../types';
import { speakText } from '../utils/speech';

interface VillageMapWidgetProps {
  assets: AssetItem[];
  reports: CitizenReport[];
  onSelectAsset?: (asset: AssetItem) => void;
}

export const VillageMapWidget: React.FC<VillageMapWidgetProps> = ({
  assets,
  reports,
  onSelectAsset
}) => {
  const [selectedRtFilter, setSelectedRtFilter] = useState<string>('all');
  const [selectedPin, setSelectedPin] = useState<{
    id: string;
    type: 'asset' | 'report';
    title: string;
    location: string;
    status: string;
    statusColor: 'green' | 'yellow' | 'red' | 'blue';
    category: string;
    description: string;
    photoUrl?: string;
    x: number; // Percentage on visual map
    y: number; // Percentage on visual map
    rawAsset?: AssetItem;
  } | null>(null);

  // Map markers positions
  const mapNodes = [
    {
      id: 'NODE-BALAI',
      type: 'asset' as const,
      title: 'Balai Desa & Pendopo Talangagung',
      location: 'Dusun 1 (Krajan) - RT 01/RW 01, Kepanjen',
      status: 'Pusat Pemerintahan Terpadu',
      statusColor: 'blue' as const,
      category: 'Pemerintahan',
      description: 'Pusat pelayanan administrasi kependudukan & musyawarah desa Talangagung.',
      photoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
      x: 35,
      y: 30,
      rt: 'RT 01'
    },
    {
      id: 'NODE-JMB',
      type: 'asset' as const,
      title: 'Jembatan Kali Metro',
      location: 'Dusun 1 (Krajan) - RT 03/RW 01',
      status: 'Kondisi Baik (Selesai Renovasi Abutmen)',
      statusColor: 'green' as const,
      category: 'Infrastruktur',
      description: 'Jembatan penghubung Krajan-Jatisari penunjang 140 hektar sawah.',
      photoUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600',
      x: 55,
      y: 24,
      rt: 'RT 03'
    },
    {
      id: 'NODE-PMP',
      type: 'asset' as const,
      title: 'Pompa Submersible Poktan Metro Lestari',
      location: 'Dusun 2 (Jatisari) - RT 03/RW 02',
      status: 'Perlu Servis Impeller & Pasir',
      statusColor: 'yellow' as const,
      category: 'Pertanian',
      description: 'Pompa air irigasi sawah utama Poktan Metro Lestari Jatisari.',
      photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
      x: 75,
      y: 55,
      rt: 'RT 03'
    },
    {
      id: 'NODE-JLN-RT5',
      type: 'asset' as const,
      title: 'Jalan Usaha Tani & Drainase RT 05 Glanggang',
      location: 'Dusun 3 (Glanggang) - RT 05/RW 03',
      status: 'Rusak Ringan & Butuh U-Ditch',
      statusColor: 'red' as const,
      category: 'Infrastruktur',
      description: 'Jalan retak dan saluran sempit butuh pemasangan U-Ditch 80cm ke Kali Metro.',
      photoUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600',
      x: 25,
      y: 72,
      rt: 'RT 05'
    },
    {
      id: 'NODE-LMP-RT2',
      type: 'report' as const,
      title: 'Lampu PJUTS Padam Dekat Pos Ronda Krajan',
      location: 'Dusun 1 (Krajan) - RT 02/RW 01',
      status: 'Laporan Warga (Menunggu Petugas)',
      statusColor: 'yellow' as const,
      category: 'Fasilitas Umum',
      description: 'Baterai surya mati 3 malam, perlu penggantian unit.',
      photoUrl: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600',
      x: 42,
      y: 50,
      rt: 'RT 02'
    }
  ];

  const filteredNodes = selectedRtFilter === 'all' 
    ? mapNodes 
    : mapNodes.filter(n => n.rt === selectedRtFilter);

  const handleReadPin = (title: string, desc: string) => {
    speakText(`Titik Peta: ${title}. ${desc}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Widget Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Peta Spasial Desa & Titik Pantau RT
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sebaran geografis infrastruktur, fasilitas umum, dan laporan warga berbasis color-coding
          </p>
        </div>

        {/* RT Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Filter:</span>
          {['all', 'RT 01', 'RT 02', 'RT 03', 'RT 05'].map((rt) => (
            <button
              key={rt}
              onClick={() => setSelectedRtFilter(rt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedRtFilter === rt
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {rt === 'all' ? 'Semua RT' : rt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas Grid */}
      <div className="relative bg-slate-900 min-h-[360px] sm:min-h-[420px] overflow-hidden select-none">
        {/* Background Stylized Topographic Map Layer */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Village Boundaries & Road SVG Network */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Village Boundary */}
          <path
            d="M 40,40 Q 300,20 600,60 T 900,180 Q 850,380 600,420 T 150,380 Z"
            fill="rgba(30, 41, 59, 0.4)"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="2"
            strokeDasharray="6,4"
          />

          {/* Road Network Lines (Jalan Poros Desa) */}
          <path
            d="M 120,380 C 250,320 350,180 350,130 S 550,100 800,220"
            fill="none"
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 120,380 C 250,320 350,180 350,130 S 550,100 800,220"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* Road Branch 2: Menuju Dusun 2 Jatisari */}
          <path
            d="M 350,180 Q 500,260 750,240"
            fill="none"
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="6"
          />
          {/* Road Branch 3: Menuju Dusun 3 Glanggang RT 05 */}
          <path
            d="M 250,320 Q 200,340 180,390"
            fill="none"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="5"
          />
        </svg>

        {/* Dusun Labels Overlay */}
        <div className="absolute top-6 left-8 bg-slate-800/80 backdrop-blur-xs border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-[11px] font-bold">
          Dusun 1 (Krajan)
        </div>
        <div className="absolute top-20 right-8 bg-slate-800/80 backdrop-blur-xs border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-[11px] font-bold">
          Dusun 2 (Jatisari)
        </div>
        <div className="absolute bottom-8 left-8 bg-slate-800/80 backdrop-blur-xs border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-[11px] font-bold">
          Dusun 3 (Glanggang)
        </div>

        {/* Interactive Pin Markers */}
        {filteredNodes.map((node) => {
          const isSelected = selectedPin?.id === node.id;
          const bgBadge = 
            node.statusColor === 'green' ? 'bg-emerald-500 ring-emerald-300' :
            node.statusColor === 'yellow' ? 'bg-amber-500 ring-amber-300' :
            node.statusColor === 'red' ? 'bg-rose-500 ring-rose-300 animate-pulse' :
            'bg-blue-500 ring-blue-300';

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              onClick={() => setSelectedPin(node)}
            >
              {/* Outer Ripple for Red/Yellow */}
              {(node.statusColor === 'red' || node.statusColor === 'yellow') && (
                <span className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${
                  node.statusColor === 'red' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
              )}

              {/* Pin Icon Bubble */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-125 ring-2 ${bgBadge} ${
                isSelected ? 'scale-125 ring-4 ring-white' : ''
              }`}>
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Label Tag on Hover */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-slate-700">
                {node.title}
              </div>
            </div>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white p-2.5 rounded-xl text-[10px] space-y-1.5 shadow-lg">
          <div className="font-bold text-slate-300 border-b border-slate-800 pb-1">Status Color-Code:</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Kondisi Baik / Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Perlu Servis / Dalam Proses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Rusak / Butuh Perhatian Segera</span>
          </div>
        </div>
      </div>

      {/* Selected Node Details Card / Popover */}
      {selectedPin ? (
        <div className="p-4 sm:p-5 bg-blue-50/60 border-t border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start sm:items-center gap-3.5">
            {selectedPin.photoUrl && (
              <img
                src={selectedPin.photoUrl}
                alt={selectedPin.title}
                className="w-16 h-16 rounded-xl object-cover border border-blue-200 shrink-0 shadow-xs"
              />
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  selectedPin.statusColor === 'green' ? 'bg-emerald-100 text-emerald-800' :
                  selectedPin.statusColor === 'yellow' ? 'bg-amber-100 text-amber-800' :
                  selectedPin.statusColor === 'red' ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedPin.status}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {selectedPin.location}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mt-1">{selectedPin.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{selectedPin.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => handleReadPin(selectedPin.title, selectedPin.description)}
              className="p-2 bg-white hover:bg-slate-100 text-blue-600 rounded-xl border border-slate-200 shadow-2xs"
              title="Dengarkan Suara Info Titik Peta"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedPin(null)}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs"
            >
              Tutup
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          💡 Klik pada salah satu pin di peta untuk melihat foto, kondisi sarana, dan detail laporan RT terkait.
        </div>
      )}
    </div>
  );
};
