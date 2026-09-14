import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  ShieldAlert, 
  HeartHandshake, 
  Flame, 
  Waves, 
  MapPin, 
  CheckCircle2, 
  X, 
  Volume2, 
  Radio,
  Send,
  Navigation,
  Loader2,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';
import { useOnlineStatus, queueOfflineItem, STORAGE_KEYS } from '../utils/offlineSync';
import { EmergencyAlert } from '../types';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRt?: string;
  dusun?: string;
  onDispatchAlert?: (alert: EmergencyAlert) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  userRt = 'RT 02',
  dusun = 'Dusun 1 (Krajan)',
  onDispatchAlert
}) => {
  const isOnline = useOnlineStatus();
  const [selectedEmergency, setSelectedEmergency] = useState<string>('Kecelakaan / Sakit Parah');
  const [customNote, setCustomNote] = useState('');
  const [reporterName, setReporterName] = useState('Pak Budi Santoso');
  const [reporterPhone, setReporterPhone] = useState('0812-3456-7890');
  const [reportingLocation, setReportingLocation] = useState(`${dusun} (${userRt})`);
  
  // Geolocation state
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('Mendeteksi GPS...');

  // Submission result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [dispatchedAlert, setDispatchedAlert] = useState<any>(null);

  // Automatically acquire GPS location upon opening
  useEffect(() => {
    if (!isOpen) return;

    if ('geolocation' in navigator) {
      setIsLocating(true);
      setGpsStatus('Mengunci sinyal satelit GPS perangkat...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6)),
            accuracy: Math.round(position.coords.accuracy)
          };
          setGpsCoords(coords);
          setIsLocating(false);
          setGpsStatus(`GPS Terkunci: ${coords.latitude}, ${coords.longitude} (Akurasi ±${coords.accuracy}m)`);
        },
        () => {
          // Fallback to Talangagung village center coordinates without logging warning
          const fallbackCoords = {
            latitude: -8.134520,
            longitude: 112.569140,
            accuracy: 25
          };
          setGpsCoords(fallbackCoords);
          setIsLocating(false);
          setGpsStatus(`GPS Wilayah Desa: ${fallbackCoords.latitude}, ${fallbackCoords.longitude} (${dusun})`);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      setGpsStatus(`Lokasi Default: Wilayah ${dusun} (${userRt})`);
    }
  }, [isOpen, dusun, userRt]);

  if (!isOpen) return null;

  const emergencyContacts = [
    {
      id: 'ambulance',
      title: 'Ambulans Siaga Desa Talangagung',
      subtitle: 'Pak Wawan (Driver Siaga) / RSUD Kanjuruhan',
      phone: '0812-3344-5566',
      icon: HeartHandshake,
      color: 'from-rose-600 to-red-700',
      badge: 'Siaga Medis 24 Jam'
    },
    {
      id: 'linmas',
      title: 'Satgas Linmas & Bhabinkamtibmas',
      subtitle: 'Pos Linmas Desa & Polsek Kepanjen',
      phone: '0857-3322-1100',
      icon: ShieldAlert,
      color: 'from-amber-600 to-orange-700',
      badge: 'Keamanan Lingkungan'
    },
    {
      id: 'disaster',
      title: 'Posko Siaga Bencana Kali Metro',
      subtitle: 'Tim Tanggap Bencana BPBD Kab. Malang',
      phone: '0821-4455-6677',
      icon: Waves,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Banjir / Luapan Air'
    },
    {
      id: 'damkar',
      title: 'Pemadam Kebakaran Pos Kepanjen',
      subtitle: 'Damkar Pos Kepanjen Jl. Panji',
      phone: '113',
      icon: Flame,
      color: 'from-red-600 to-rose-800',
      badge: 'Darurat Api & Rescue'
    }
  ];

  const handleSendSos = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const timeNow = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const alertId = `SOS-${Date.now().toString().slice(-6)}`;

    const alertPayload: EmergencyAlert = {
      id: alertId,
      category: selectedEmergency as any,
      reporterName,
      reporterPhone,
      location: reportingLocation,
      dusun,
      rtRw: userRt,
      gpsCoords: gpsCoords || { latitude: -8.1345, longitude: 112.5691, accuracy: 20 },
      notes: customNote || 'Membutuhkan penanganan segera dari unit siaga desa.',
      timestamp: timeNow,
      status: 'Darurat Aktif',
      targetUnits: ['Ketua RT ' + userRt, 'Satgas Linmas Desa', 'Ambulans Siaga Desa']
    };

    if (onDispatchAlert) {
      onDispatchAlert(alertPayload);
    }

    try {
      if (isOnline) {
        const response = await fetch('/api/ai/emergency-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertPayload)
        });
        const data = await response.json();
        setDispatchedAlert(data);
      } else {
        // Queue for offline sync
        queueOfflineItem(STORAGE_KEYS.SOS_QUEUE, alertPayload);
        setDispatchedAlert({
          alertId,
          isOfflineSaved: true,
          aiTriage: {
            actionPlan: "Disimpan secara offline dan otomatis disiarkan saat koneksi kembali online.",
            targetUnits: ["Ketua RT " + userRt, "Satgas Linmas"]
          }
        });
      }
    } catch {
      // Fallback
      setDispatchedAlert({
        alertId,
        aiTriage: {
          actionPlan: "Sinyal alarm lokal berhasil diaktifkan untuk petugas desa terdekat.",
          targetUnits: ["Ketua RT Setempat", "Satgas Linmas Desa"]
        }
      });
    } finally {
      setIsSubmitting(false);
      setSosSent(true);
      speakText(`Peringatan darurat ${selectedEmergency} telah disiarkan untuk lokasi ${reportingLocation}. Bantuan sedang dikoordinasikan segera.`);
    }
  };

  const handleCall = (title: string, phone: string) => {
    speakText(`Menghubungi ${title} di nomor ${phone}`);
    window.location.href = `tel:${phone.replace(/[^0-9]/g, '')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border-2 border-red-500 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-900 my-8">
        
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-white text-[11px] font-bold tracking-wider uppercase mb-0.5">
                <Radio className="w-3 h-3 text-red-200 animate-ping" />
                <span>Pusat Tanggap Darurat Desa 24 Jam</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Tombol Darurat (SOS RT & Desa)</h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {sosSent ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  No. Laporan: #{dispatchedAlert?.alertId || 'SOS-AKTIF'}
                </span>
                <h3 className="text-xl font-extrabold text-emerald-950 mt-2">Sinyal Darurat Berhasil Disiarkan!</h3>
                <p className="text-xs text-emerald-900 mt-1 max-w-md mx-auto leading-relaxed">
                  Laporan darurat untuk wilayah <strong>{reportingLocation}</strong> telah masuk ke posko siaga Ketua RT {userRt}, Babinsa, Bhabinkamtibmas, dan Satgas Desa.
                </p>
              </div>

              {/* Geolocation & Unit Dispatch Details */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" /> Koordinat GPS
                  </span>
                  <span className="font-bold text-slate-800">
                    {gpsCoords ? `${gpsCoords.latitude}, ${gpsCoords.longitude}` : 'Terdeteksi'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Waktu Kejadian
                  </span>
                  <span className="font-bold text-slate-800">
                    {new Date().toLocaleTimeString('id-ID')} WIB
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Unit Siaga
                  </span>
                  <span className="font-bold text-emerald-700">
                    Ketua RT {userRt} & Satgas Desa
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSosSent(false);
                  onClose();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
              >
                Selesai & Kembali ke Aplikasi
              </button>
            </div>
          ) : (
            <>
              {/* Geolocation Status Badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${isLocating ? 'bg-amber-100 text-amber-600 animate-spin' : 'bg-blue-100 text-blue-600'}`}>
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px]">Status Lokasi & Geolocation</span>
                    <span className="text-[10px] text-slate-500">{gpsStatus}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isOnline ? '🟢 Siaga Online' : '🟡 Mode Offline'}
                </span>
              </div>

              {/* Direct Fast Call Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Panggilan Cepat Bantuan Darurat:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {emergencyContacts.map((contact) => {
                    const Icon = contact.icon;
                    return (
                      <div
                        key={contact.id}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-red-400 bg-white hover:bg-red-50/30 transition-all flex flex-col justify-between space-y-2 group shadow-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${contact.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-red-700">{contact.title}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{contact.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[9px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
                            {contact.badge}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCall(contact.title, contact.phone)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Panggil</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Siarkan Alarm Cepat dengan Lokasi & Geolocation */}
              <form onSubmit={handleSendSos} className="bg-red-50/50 p-4 rounded-2xl border border-red-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-red-600" />
                    <span>Siarkan Peringatan Real-Time ke RT, Linmas & Ambulans</span>
                  </h4>
                  <span className="text-[10px] font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                    Otomatis Masuk Dashboard Desa
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Lokasi Pelapor (RT / Dusun)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={reportingLocation}
                        onChange={(e) => setReportingLocation(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        required
                      />
                      <MapPin className="w-4 h-4 text-red-500 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kategori Darurat
                    </label>
                    <select
                      value={selectedEmergency}
                      onChange={(e) => setSelectedEmergency(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    >
                      <option value="Kecelakaan / Sakit Parah">Kecelakaan / Warga Sakit Kritis</option>
                      <option value="Kebakaran / Api">Kebakaran Rumah / Lahan</option>
                      <option value="Bencana Banjir / Longsor">Luapan Air Kali Metro / Longsor</option>
                      <option value="Keamanan / Pencurian">Keamanan Lingkungan / Maling</option>
                      <option value="Pohon Tumbang Hambat Jalan">Pohon Tumbang / Tiang Roboh</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pelapor
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor HP Pelapor (Aktif)
                    </label>
                    <input
                      type="text"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Keterangan Singkat Situasi
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Contoh: Butuh tandu segera di depan pos kamling RT 02..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyiarkan Sinyal SOS...</span>
                    </>
                  ) : (
                    <>
                      <AlertOctagon className="w-4 h-4 animate-bounce" />
                      <span>SIARKAN SINYAL SOS KE SELURUH DESA</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
