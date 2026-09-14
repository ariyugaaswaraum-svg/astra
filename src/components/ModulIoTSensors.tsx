import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Wifi, 
  BatteryCharging, 
  AlertTriangle, 
  Activity, 
  Droplets, 
  Sun, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Sliders, 
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Fish,
  Smartphone,
  Wind,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  Zap,
  Sparkles,
  ExternalLink,
  BookOpen,
  Check
} from 'lucide-react';
import { IoTSensorNode } from '../types';

interface ModulIoTSensorsProps {
  sensors: IoTSensorNode[];
  onTriggerSimulatedReading?: (sensorId: string) => void;
}

export const ModulIoTSensors: React.FC<ModulIoTSensorsProps> = ({
  sensors: initialSensors,
  onTriggerSimulatedReading
}) => {
  const [sensors, setSensors] = useState<IoTSensorNode[]>(initialSensors);
  const [selectedSensor, setSelectedSensor] = useState<IoTSensorNode>(initialSensors[0] || null);
  const [isAutoStreaming, setIsAutoStreaming] = useState(true);
  const [lastStreamTime, setLastStreamTime] = useState<string>(new Date().toLocaleTimeString('id-ID'));

  // Interactive state for Smart Feeder Case Study live controls
  const [feederStatus, setFeederStatus] = useState<'idle' | 'dispensing' | 'completed'>('idle');
  const [aeratorActive, setAeratorActive] = useState<boolean>(true);
  const [feedGrams, setFeedGrams] = useState<number>(250);
  const [feedLogMessage, setFeedLogMessage] = useState<string | null>(null);

  // Real-time telemetry simulation interval
  useEffect(() => {
    if (!isAutoStreaming) return;

    const interval = setInterval(() => {
      setSensors(prevSensors => 
        prevSensors.map(sensor => {
          // Slight realistic sensor fluctuation
          const delta = (Math.random() - 0.48) * (
            sensor.type === 'WaterLevel' ? 1.5 : 
            sensor.type === 'PumpFlow' ? 0.4 : 
            sensor.type === 'SolarVoltage' ? 0.1 : 
            sensor.type === 'SmartFeeder' ? 0.08 : 0.8
          );
          let newVal = Math.max(0, parseFloat((sensor.currentValue + delta).toFixed(sensor.type === 'SmartFeeder' ? 2 : 1)));
          
          let newStatus = sensor.status;
          let alertMsg = sensor.alertMessage;

          if (sensor.type === 'WaterLevel') {
            if (newVal > 85) {
              newStatus = 'Bahaya / Butuh Tindakan';
              alertMsg = `Ketinggian air (${newVal} cm) mendekati bibir tanggul!`;
            } else if (newVal > 70) {
              newStatus = 'Peringatan';
              alertMsg = `Debit air tinggi (${newVal} cm) dari hulu Kali Metro.`;
            } else {
              newStatus = 'Normal';
              alertMsg = undefined;
            }
          } else if (sensor.type === 'PumpFlow') {
            if (newVal < 14) {
              newStatus = 'Bahaya / Butuh Tindakan';
              alertMsg = `Debit drop kritis (${newVal} L/dtk), terindikasi impeler tersumbat pasir.`;
            } else if (newVal < 18) {
              newStatus = 'Peringatan';
              alertMsg = `Debit aliran menurun (${newVal} L/dtk).`;
            } else {
              newStatus = 'Normal';
              alertMsg = undefined;
            }
          } else if (sensor.type === 'SolarVoltage') {
            if (newVal < 10.5) {
              newStatus = 'Bahaya / Butuh Tindakan';
              alertMsg = `Tegangan baterai kritis (${newVal}V). Panel butuh pembersihan/ganti baterai.`;
            } else if (newVal < 11.5) {
              newStatus = 'Peringatan';
              alertMsg = `Tegangan baterai rendah (${newVal}V).`;
            } else {
              newStatus = 'Normal';
              alertMsg = undefined;
            }
          } else if (sensor.type === 'SmartBinTrash') {
            if (newVal > 85) {
              newStatus = 'Bahaya / Butuh Tindakan';
              alertMsg = `Bak sampah penuh (${newVal}%). Butuh penjemputan armada desa segera!`;
            } else if (newVal > 70) {
              newStatus = 'Peringatan';
              alertMsg = `Bak sampah mencapai ${newVal}%.`;
            } else {
              newStatus = 'Normal';
              alertMsg = undefined;
            }
          } else if (sensor.type === 'SmartFeeder') {
            if (newVal < 6.5 || newVal > 8.5) {
              newStatus = 'Peringatan';
              alertMsg = `pH air kolam (${newVal}) di luar ambang optimal (6.5-8.5). Kontrol aerator diaktifkan!`;
            } else {
              newStatus = 'Normal';
              alertMsg = undefined;
            }
          }

          const newTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newHistory = [...sensor.history.slice(-4), { time: newTime, value: newVal }];

          return {
            ...sensor,
            currentValue: newVal,
            status: newStatus,
            alertMessage: alertMsg,
            lastUpdated: 'Baru saja',
            history: newHistory
          };
        })
      );
      setLastStreamTime(new Date().toLocaleTimeString('id-ID'));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoStreaming]);

  // Keep selectedSensor updated
  useEffect(() => {
    if (selectedSensor) {
      const fresh = sensors.find(s => s.id === selectedSensor.id);
      if (fresh) setSelectedSensor(fresh);
    }
  }, [sensors]);

  const handleTriggerFeed = () => {
    setFeederStatus('dispensing');
    setFeedLogMessage(`Mengirim perintah: Dispenser melontarkan ${feedGrams} gram pakan ikan via LoRa / MQTT...`);
    
    setTimeout(() => {
      setFeederStatus('completed');
      setFeedLogMessage(`Sukses! ${feedGrams} gram pakan berhasil ditebar otomatis ke kolam Pokdakan Molek Jaya.`);
      setTimeout(() => {
        setFeederStatus('idle');
      }, 4000);
    }, 1800);
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'WaterLevel':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'PumpFlow':
        return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'SolarVoltage':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'SmartBinTrash':
        return <Trash2 className="w-5 h-5 text-purple-500" />;
      case 'SmartFeeder':
        return <Fish className="w-5 h-5 text-cyan-600" />;
      default:
        return <Radio className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Bahaya / Butuh Tindakan':
        return 'bg-red-500 text-white animate-pulse';
      case 'Peringatan':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex items-center space-x-1.5 text-blue-700 font-extrabold text-xs uppercase tracking-wider">
              <Radio className="w-4 h-4" />
              <span>Simulasi Telemetri Cerdas & Jaringan Sensor Desa</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-black text-[10px] tracking-wide uppercase">
              DATA B—SIMULASI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Simulasi Integrasi Sensor IoT (Internet of Things)
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Simulasi pemantauan telemetri debit pompa irigasi, contoh status panel surya PJUTS, smart bin sampah, serta simulasi Smart Feeder budidaya ikan Pokdakan Molek Jaya.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAutoStreaming(!isAutoStreaming)}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-xs ${
              isAutoStreaming 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100' 
                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isAutoStreaming ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{isAutoStreaming ? 'Simulasi Streaming Aktif' : 'Simulasi Dijeda'}</span>
          </button>
        </div>
      </div>

      {/* Sensor Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {sensors.map(sensor => {
          const isSelected = selectedSensor?.id === sensor.id;
          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.02]' 
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wide">
                  DATA B—SIMULASI
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${getStatusBadge(sensor.status)}`}>
                  {sensor.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {getSensorIcon(sensor.type)}
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                  {sensor.name}
                </h4>
                <p className="text-slate-500 text-xs mt-0.5">{sensor.dusun} • {sensor.rtRw}</p>
              </div>

              {/* Value Gauge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    {sensor.currentValue}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-1">
                    {sensor.unit}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{sensor.batteryLevel}%</span>
                </div>
              </div>

              {sensor.alertMessage && (
                <div className="mt-2.5 p-2 bg-red-50 border border-red-100 rounded-lg text-[11px] text-red-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  <span className="line-clamp-1">{sensor.alertMessage}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Sensor Deep Dive & Telemetry Graph */}
      {selectedSensor && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase tracking-wide">
                  DATA B—SIMULASI
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                  {selectedSensor.code}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Tipe: {selectedSensor.type}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Simulasi Pemantauan: {selectedSensor.name}
              </h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Simulasi titik pasang: <strong>{selectedSensor.assetName}</strong> ({selectedSensor.dusun}, {selectedSensor.rtRw})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl font-extrabold text-xs ${getStatusBadge(selectedSensor.status)}`}>
                Kondisi: {selectedSensor.status}
              </span>
            </div>
          </div>

          {/* Real-time Telemetry Data Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Simulasi Nilai Pengukuran</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {selectedSensor.currentValue} <span className="text-sm font-bold text-slate-500">{selectedSensor.unit}</span>
              </p>
              <span className="text-[11px] text-slate-500">Batas Normal: {selectedSensor.normalRange.min} - {selectedSensor.normalRange.max} {selectedSensor.unit}</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Simulasi Baterai & Daya</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {selectedSensor.batteryLevel}%
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">Contoh status panel surya micro</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Frekuensi Simulasi</span>
              <p className="text-2xl font-black text-slate-800 mt-1">
                Tiap 4 Detik
              </p>
              <span className="text-[11px] text-slate-500">Simulasi Protokol Telemetri Desa</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Waktu Simulasi Terakhir</span>
              <p className="text-base font-black text-slate-800 mt-1">
                {lastStreamTime}
              </p>
              <span className="text-[11px] text-slate-500">Koneksi Simulasi Normal</span>
            </div>
          </div>

          {/* Historical Trend Visualization */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Grafik Simulasi Riwayat Pembacaan (5 Data Terakhir)</span>
            </h4>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Grafik Simulasi Pergerakan Sensor {selectedSensor.unit}</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Simulasi Telemetri
                </span>
              </div>

              {/* Bar visualization */}
              <div className="grid grid-cols-5 gap-3 h-32 items-end pt-4">
                {selectedSensor.history.map((h, i) => {
                  const maxRange = selectedSensor.normalRange.max * 1.3 || 100;
                  const heightPct = Math.min(100, Math.max(15, Math.round((h.value / maxRange) * 100)));
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-200">
                        {h.value}
                      </span>
                      <div 
                        className="w-full bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500" 
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {h.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TEFA Learning Link */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <h5 className="font-bold text-blue-950">Praktik TEFA IoT Siswa SMK & Kolaborasi Riset Kampus</h5>
                <p className="text-blue-700 text-[11px]">
                  Modul simulasi mikrokontroler ESP32 dirakit untuk media pembelajaran siswa SMK bersama tim riset kampus.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BAGIAN BARU: STUDI KASUS SMART FEEDER BUDIDAYA IKAN TALANGAGUNG (2025-2026) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-cyan-200/80 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Decorative subtle background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-50/70 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-900 border border-cyan-300">
                <Fish className="w-3.5 h-3.5 text-cyan-700" />
                <span>Studi Kasus: Smart Feeder Budidaya Ikan Talangagung</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Implementasi Nyata Terverifikasi 2025–2026</span>
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Penerapan Smart Feeder & Pemantau Kualitas Air Berdaya Surya di Pokdakan Molek Jaya
            </h3>
            <p className="text-slate-600 text-sm mt-1.5 max-w-4xl leading-relaxed">
              Transformasi digital budidaya ikan air tawar di Desa Talangagung melalui otomasi pakan presisi, sensor suhu & pH kontinu, serta aerator kendali jarak jauh bertenaga panel surya.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-cyan-50/80 border border-cyan-200 px-4 py-2.5 rounded-2xl">
            <Calendar className="w-4 h-4 text-cyan-700" />
            <div className="text-xs">
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">Serah Terima Resmi</span>
              <strong className="text-slate-900 font-extrabold">23 November 2025</strong>
            </div>
          </div>
        </div>

        {/* 4 Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>Teknologi Utama</span>
            </div>
            <h5 className="font-extrabold text-slate-900 text-sm">"Smart Feeder" IoT</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem pemberian pakan ikan otomatis berbasis IoT terintegrasi mobile application & sensor lingkungan kolam.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Pengembang & Pendanaan</span>
            </div>
            <h5 className="font-extrabold text-slate-900 text-sm">Unikama & Kemendikti Saintek</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mahasiswa Universitas PGRI Kanjuruhan Malang (Unikama) melalui Program Mahasiswa Berdampak (PM-BEM) 2025.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>Lokasi & Mitra Desa</span>
            </div>
            <h5 className="font-extrabold text-slate-900 text-sm">Pokdakan Molek Jaya</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diterapkan di Kelompok Pembudidaya Ikan Molek Jaya Desa Talangagung & didukung POKMAS Anggrungan Maju Bersama.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Tim Pengembang & Dosen</span>
            </div>
            <h5 className="font-extrabold text-slate-900 text-sm">Tim Multidisiplin Unikama</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dr. Andi Nu Graha (Ketua), Dr. Ir. Enike Dwi Kusumawati (Pembina Teknis), & 20 mahasiswa lintas jurusan.
            </p>
          </div>
        </div>

        {/* Technical Features & Specifications Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-600" />
              <span>4 Fitur Teknis Utama Sistem Smart Feeder</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Spesifikasi Faktual Terpasang</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="bg-linear-to-br from-cyan-50/70 to-white p-4 rounded-2xl border border-cyan-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                1. Penjadwalan & Takaran Pakan Otomatis
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pengaturan interval waktu pemberian pakan dan gramasi takaran presisi secara otomatis yang dapat diprogram via aplikasi mobile.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-linear-to-br from-blue-50/70 to-white p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">
                <Droplets className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                2. Sensor Suhu & pH Air Real-Time
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pemantauan telemetri kontinu terhadap derajat keasaman (pH) dan fluktuasi temperatur air kolam untuk menjamin metabolisme optimal ikan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-linear-to-br from-indigo-50/70 to-white p-4 rounded-2xl border border-indigo-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                <Wind className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                3. Kontrol Aerator Jarak Jauh
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Kendali jarak jauh aktivasi mesin aerator kolam langsung dari aplikasi HP saat sensor mendeteksi penurunan sirkulasi oksigen terlarut.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-linear-to-br from-amber-50/70 to-white p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs">
                <Sun className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                4. Sumber Energi Panel Surya (Solar Cell)
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Catu daya mandiri menggunakan panel surya fotovoltaik dan baterai penyimpanan, bebas biaya listrik PLN dan tahan pemadaman.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits & Operational Impact */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="font-extrabold text-sm text-white">
                Manfaat Nyata bagi Pembudidaya Ikan Desa Talangagung
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Evaluasi Dampak Lapangan 2025–2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Efisiensi Waktu & Tenaga</span>
              </div>
              <h6 className="font-bold text-slate-100 text-xs sm:text-sm">Mengurangi Kunjungan Manual ke Kolam</h6>
              <p className="text-slate-300 text-xs leading-relaxed">
                Peternak tidak perlu bolak-balik ke kolam setiap jam makan. Pemberian pakan terdistribusi merata dan terukur tanpa risiko pakan mengendap busuk.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Mitigasi Risiko Dini</span>
              </div>
              <h6 className="font-bold text-slate-100 text-xs sm:text-sm">Deteksi Dini Perubahan Kualitas Air</h6>
              <p className="text-slate-300 text-xs leading-relaxed">
                Sensor pH dan suhu mendeteksi perubahan parameter air seketika, mencegah stres benih ikan dan kematian massal akibat air drop/asam.
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Presisi Keputusan</span>
              </div>
              <h6 className="font-bold text-slate-100 text-xs sm:text-sm">Pengambilan Keputusan Lebih Cepat</h6>
              <p className="text-slate-300 text-xs leading-relaxed">
                Keputusan takaran pakan dan aerasi diambil berbasis angka telemetri aktual, jauh lebih akurat dan terukur dibanding sekadar observasi visual konvensional.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Simulation / Live Test Console for Smart Feeder */}
        <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-wider block">
                  Konsol Uji Kendali Jarak Jauh (Simulasi Node Pokdakan Molek Jaya)
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200 uppercase">
                  DATA B—SIMULASI
                </span>
              </div>
              <h5 className="font-black text-slate-900 text-sm">
                Simulasi Smart Feeder & Aerator Remote Controller
              </h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-600">Contoh status panel surya:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                13.4V (Normal / Terisi)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Control 1: Dispense Feed */}
            <div className="bg-white p-3.5 rounded-xl border border-cyan-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Takaran Pakan</span>
                <span className="font-mono font-extrabold text-cyan-700">{feedGrams} Gram</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={500} 
                step={25}
                value={feedGrams}
                onChange={(e) => setFeedGrams(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <button
                onClick={handleTriggerFeed}
                disabled={feederStatus === 'dispensing'}
                className={`w-full py-2 px-3 text-xs font-extrabold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  feederStatus === 'dispensing'
                    ? 'bg-amber-100 text-amber-800 cursor-wait'
                    : feederStatus === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                }`}
              >
                {feederStatus === 'dispensing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menebar Pakan (Simulasi)...</span>
                  </>
                ) : feederStatus === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pakan Berhasil Ditebar (Simulasi)</span>
                  </>
                ) : (
                  <>
                    <Fish className="w-3.5 h-3.5" />
                    <span>Tebar Pakan (Simulasi)</span>
                  </>
                )}
              </button>
            </div>

            {/* Control 2: Toggle Aerator */}
            <div className="bg-white p-3.5 rounded-xl border border-cyan-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Status Aerator Oksigen</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${aeratorActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {aeratorActive ? 'MENYALA' : 'MATI'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sirkulasi gelembung oksigen terlarut (DO) kolam.
              </p>
              <button
                onClick={() => setAeratorActive(!aeratorActive)}
                className={`w-full py-2 px-3 text-xs font-extrabold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  aeratorActive
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{aeratorActive ? 'Matikan Aerator (Simulasi)' : 'Nyalakan Aerator (Simulasi)'}</span>
              </button>
            </div>

            {/* Control 3: Quality Telemetry Summary */}
            <div className="bg-white p-3.5 rounded-xl border border-cyan-100 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Kualitas Air Kolam</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Optimal
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">pH Air</span>
                  <span className="text-sm font-black text-cyan-700">7.2</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Suhu Air</span>
                  <span className="text-sm font-black text-blue-700">27.8°C</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 block text-center font-medium">
                Sensor Probe Terkalibrasi
              </span>
            </div>
          </div>

          {feedLogMessage && (
            <div className="p-2.5 bg-white border border-cyan-200 rounded-xl text-xs text-cyan-950 font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedLogMessage}</span>
            </div>
          )}
        </div>

        {/* Verified Citation Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Sumber Rujukan Faktual Eksternal Terverifikasi:
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
              Data Resmi Berita 2025–2026
            </span>
          </div>

          <p className="text-xs text-slate-700 font-semibold leading-relaxed pl-6 border-l-2 border-blue-500">
            Sumber: JatimTimes, 25 Agustus 2026 - Smart Feeder Unikama Ubah Pola Budidaya Ikan di Talangagung; TuguMalang.id - Unikama Lolos Pendanaan Nasional Smart Farming Desa Talangagung
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 pl-6 text-[10px] text-slate-500 font-medium">
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
              Program: Mahasiswa Berdampak (PM-BEM) 2025
            </span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
              Sponsor: Kemendikti Saintek RI
            </span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
              Entitas: Unikama, Pokdakan Molek Jaya & Pokmas Anggrungan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

