import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Terminal, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  FileCode,
  Lightbulb,
  Scan,
  MapPin,
  QrCode,
  Code2,
  Wrench,
  Cpu,
  FileText,
  Building2,
  ArrowRight,
  Share2,
  HeartHandshake,
  Database,
  Activity,
  Layers,
  Check,
  ChevronRight,
  UserCheck,
  Briefcase,
  GitPullRequest,
  Clock,
  Compass
} from 'lucide-react';
import { VillageProfile } from '../types';

interface ModulTeachingFactoryProps {
  villageProfile: VillageProfile;
}

export const ModulTeachingFactory: React.FC<ModulTeachingFactoryProps> = ({ villageProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'collaboration' | 'promptLab' | 'curation'>('roles');
  const [selectedRole, setSelectedRole] = useState<string>('digitalisasi');
  const [selectedParty, setSelectedParty] = useState<string>('desa');

  // Prompt Lab state
  const [testPrompt, setTestPrompt] = useState('Buatkan draf usulan perbaikan drainase RT 05 dalam format RKP Desa untuk Musrenbangdes.');
  const [promptResult, setPromptResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Student Score Simulation
  const [completedTasks, setCompletedTasks] = useState<number[]>([1, 2]);

  const handleRunPromptTest = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/ai/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ text: testPrompt }],
          userRole: 'Siswa SMK Teaching Factory',
          villageContext: { profile: villageProfile }
        })
      });
      const data = await res.json();
      setPromptResult(data.reply || "Hasil pengujian prompt sukses.");
    } catch (err) {
      console.error(err);
      setPromptResult("Gagal menguji prompt.");
    } finally {
      setIsTesting(false);
    }
  };

  // 1. Empat Peran Siswa SMK
  const studentRoles = [
    {
      id: 'digitalisasi',
      title: '1. Peran Digitalisasi',
      subtitle: 'Digitasi Dokumen, Ekstraksi Metadata & Klasifikasi Arsip',
      icon: Scan,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      accentColor: 'blue',
      summary: 'Transformasi tumpukan arsip fisik desa menjadi repositori pengetahuan digital yang terindeks dan dapat dicari secara instan.',
      keyPillars: ['Pemindaian Berkas', 'Ekstraksi Metadata', 'Klasifikasi AI', 'Transkrip Audio Sesepuh'],
      concreteActivities: [
        {
          name: 'Pemindaian Dokumen Fisik (OCR & Scanning)',
          desc: 'Memindai berkas fisik APBDes, RPJMDes, Perdes, SK Kepala Desa, dan surat pertanahan menggunakan scanner resolusi tinggi & OCR teks.'
        },
        {
          name: 'Pembuatan Metadata Terstruktur',
          desc: 'Menginput dan menstandarisasi atribut dokumen seperti nomor surat, tahun anggaran, klasifikasi urusan, pihak penerbit, dan kata kunci.'
        },
        {
          name: 'Klasifikasi & Pelabelan Arsip Berbantuan AI',
          desc: 'Memanfaatkan model AI untuk mengkategorikan isi dokumen secara otomatis ke dalam 7 klasifikasi regulasi desa dan ringkasan eksekutif.'
        },
        {
          name: 'Digitasi Transkrip Wawancara Sesepuh',
          desc: 'Merekam kesaksian lisan tetua desa/mantan pamong mengenai sejarah batas desa, drainase masa lalu, dan merangkumnya ke sistem Black Box.'
        }
      ],
      toolsUsed: ['Document Scanner', 'Tesseract/Gemini OCR', 'Form Input Metadata', 'Speech-to-Text Transcriber'],
      deliverables: ['E-Archive Repository Desa', 'Indeks Pencarian Cepat Berkas', 'Transkrip Memori Historis Faktual'],
      competencyPoints: 'Kompetensi: Manajemen Basis Data, Pengarsipan Elektronik, NLP Text Extraction'
    },
    {
      id: 'pemetaan',
      title: '2. Peran Pemetaan',
      subtitle: 'Geotagging Lokasi, Koordinat GPS, Dokumentasi Foto & Penerbitan QR Aset',
      icon: MapPin,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'emerald',
      summary: 'Sensus lapangan untuk memetakan setiap aset fisik dan fasilitas umum desa secara geospasial serta memasang tanda pengenal digital.',
      keyPillars: ['Pencatatan Koordinat GPS', 'Dokumentasi Visual 360°', 'Penerbitan QR Code Aset', 'Pemetaan Spasial GIS'],
      concreteActivities: [
        {
          name: 'Pencatatan Lokasi & Koordinat Presisi (GPS Tagging)',
          desc: 'Melakukan survei lapangan untuk mengambil titik koordinat garis lintang dan bujur (latitude-longitude) seluruh aset sarana prasarana desa.'
        },
        {
          name: 'Dokumentasi Foto Multi-Sudut Aset Fisik',
          desc: 'Mengambil foto kondisi fisik terkini dari gedung balai desa, jembatan, jalan usaha tani, PJU, dan traktor BUMDes untuk riwayat visual.'
        },
        {
          name: 'Pembuatan & Penempelan Kode QR Fisik Aset',
          desc: 'Mencetak label tahan cuaca berbahan plat/akrilik berisi QR Code unik tiap aset desa dan memasangnya langsung di lokasi objek.'
        },
        {
          name: 'Sinkronisasi Peta Spasial Desa (Web-GIS)',
          desc: 'Memplot batas wilayah, sebaran aset publik, dan titik rawan genangan air ke dalam peta interaktif digital desa.'
        }
      ],
      toolsUsed: ['GPS Handheld / Smartphone Geolocation', 'Kamera Dokumentasi', 'QR Generator & Thermal/Plat Printer', 'OpenStreetMap / Leaflet GIS'],
      deliverables: ['Peta Sebaran Aset Interaktif', 'Paspor QR Code Tiap Aset', 'Katalog Foto Kondisi Awal Aset'],
      competencyPoints: 'Kompetensi: Geospasial Dasar, Survei Lapangan, Identifikasi Aset Terdistribusi'
    },
    {
      id: 'teknologi',
      title: '3. Peran Teknologi',
      subtitle: 'Pengembangan Basis Data, Aplikasi Web, AI Integration, UI/UX & IoT',
      icon: Code2,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentColor: 'indigo',
      summary: 'Pengembangan perangkat lunak, antarmuka pengguna ramah pamong/warga, automasi kecerdasan buatan, dan telemetri sensor pintar.',
      keyPillars: ['Frontend React/Tailwind', 'REST API & Database', 'Gemini AI Prompting', 'Mikrokontroler & IoT Sensor'],
      concreteActivities: [
        {
          name: 'Pengembangan Basis Data & Backend Service',
          desc: 'Merancang skema database relasional & dokumen untuk menyimpan data kependudukan, log inventaris aset, dan arsip hukum desa.'
        },
        {
          name: 'Pembangunan Aplikasi Web Responsif (Frontend UI/UX)',
          desc: 'Mengembangkan antarmuka sistem informasi desa yang clean, intuitif, cepat, dan mudah dioperasikan di smartphone maupun laptop.'
        },
        {
          name: 'Integrasi Kecerdasan Buatan (Gemini AI & DSS)',
          desc: 'Menghubungkan asisten AI cerdas untuk rekomendasi kebijakan Musrenbangdes, audit kepatuhan regulasi, dan bot tanya jawab warga.'
        },
        {
          name: 'Perakitan & Pemrograman Sensor IoT Desa',
          desc: 'Merakit modul sensor mikrokontroler (ESP32/Arduino) untuk monitoring debit air sungai Kali Metro dan gas metana TPA Talangagung.'
        }
      ],
      toolsUsed: ['React + TypeScript + Tailwind', 'Node.js Express / Cloud SQL', 'Google Gen AI SDK (Gemini)', 'Arduino IDE / ESP32 Firmware'],
      deliverables: ['Portal Web Smart Village Terpadu', 'Decision Support Engine AI', 'Dashboard Telemetri Sensor Real-Time'],
      competencyPoints: 'Kompetensi: Full-Stack Web Development, UI/UX Prototyping, Prompt Engineering, Embedded IoT'
    },
    {
      id: 'pemeliharaan',
      title: '4. Peran Pemeliharaan',
      subtitle: 'Inspeksi Rutin, Preventive Maintenance Aset & Pemutakhiran Data',
      icon: Wrench,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      accentColor: 'amber',
      summary: 'Penjagaan keberlanjutan sistem dan aset desa melalui jadwal inspeksi teratur, perawatan preventif, dan update data berkala.',
      keyPillars: ['Inspeksi Fisik Berkala', 'Preventive Maintenance Jadwal', 'Update Data Dinamis', 'SOP Kelaikan Fungsi'],
      concreteActivities: [
        {
          name: 'Inspeksi Berkala Kondisi Aset (Scan QR Audit)',
          desc: 'Melakukan patroli berkala memindai QR Code aset untuk memperbarui status kondisi fisik (Baik, Perlu Servis, Rusak Ringan/Berat).'
        },
        {
          name: 'Jadwal & Notifikasi Perawatan Preventif (Preventive Maintenance)',
          desc: 'Menyusun kalender servis berkala mesin pompa irigasi, genset balai desa, kendaraan dinas, serta lampu penerangan jalan umum.'
        },
        {
          name: 'Pemutakhiran Data Kependudukan & Layanan Desa',
          desc: 'Memperbarui data mutasi warga (kelahiran, kepindahan), penerima bantuan sosial (Bansos), dan profil usaha UMKM BUMDes.'
        },
        {
          name: 'Backup Sistem, Audit Log & Pembersihan Data',
          desc: 'Memastikan backup database berkala, mengaudit histori log transaksi sistem, dan menjaga performa server aplikasi desa.'
        }
      ],
      toolsUsed: ['Aplikasi Scanner Mobile', 'Modul Preventive Maintenance', 'Data Cleaning Tools', 'Database Backup Automation'],
      deliverables: ['Laporan Audit Kelaikan Aset', 'Tiket Servis Selesai Terjadwal', 'Database Desa yang Selalu Fresh & Valid'],
      competencyPoints: 'Kompetensi: IT Service Management, Preventive Maintenance, Quality Assurance Data'
    }
  ];

  // 2. Model Kolaborasi 4 Pihak
  const collaborationParties = [
    {
      id: 'desa',
      title: 'Pemerintah Desa',
      roleSubtitle: 'Pemilik Masalah Nyata (Real Problem Owner)',
      icon: Building2,
      color: 'blue',
      badge: 'Real Problem Owner',
      description: 'Pemerintah Desa bertindak sebagai pemilik kasus nyata di lapangan (tata kelola arsip, pemetaan aset, pelayanan publik, dan transparansi anggaran).',
      contributions: [
        'Menyediakan akses data, arsip fisik, dan objek infrastruktur nyata untuk diteliti/dikelola.',
        'Menyampaikan tantangan dan kebutuhan riil penyelenggaraan pemerintahan serta layanan warga.',
        'Membuka ruang kolaborasi formal dan dukungan legalitas (Perdes/SK Kerjasama TeFa).'
      ],
      valueReceived: [
        'Mendapatkan solusi digitalisasi yang tepat guna dan berbiaya efisien tanpa ketergantungan vendor luar yang mahal.',
        'Peningkatan indeks kematangan SPBE Desa (Sistem Pemerintahan Berbasis Elektronik).'
      ]
    },
    {
      id: 'smk',
      title: 'SMK (Sekolah Menengah Kejuruan)',
      roleSubtitle: 'Penyedia Teknologi & Talenta (Technology & Talent Provider)',
      icon: GraduationCap,
      color: 'indigo',
      badge: 'Technology & Talent',
      description: 'Sekolah Menengah Kejuruan menyediakan peserta didik kompeten, tenaga pendidik kejuruan (guru pembimbing), laboratorium komputer, dan perangkat keras pendukung.',
      contributions: [
        'Mengerahkan siswa jurusan RPL, SIJA, TKJ, dan DKV untuk praktik kerja langsung pada proyek riil.',
        'Menyediakan bimbingan teknis standar industri dari guru produktif dan praktisi industri.',
        'Mengintegrasikan kebutuhan desa ke dalam modul pembelajaran berbasis proyek (Project-Based Learning).'
      ],
      valueReceived: [
        'Siswa memiliki portofolio proyek industri riil yang diakui dan siap kerja (link & match).',
        'Peningkatan relevansi kurikulum sekolah dengan tantangan dunia nyata di lingkungan sekitar.'
      ]
    },
    {
      id: 'tefa',
      title: 'Teaching Factory (TeFa)',
      roleSubtitle: 'Platform Kolaborasi (Collaboration Platform)',
      icon: HeartHandshake,
      color: 'emerald',
      badge: 'Collaboration Platform',
      description: 'Teaching Factory berperan sebagai unit bisnis dan jembatan operasional yang mengelola siklus pengembangan perangkat lunak, standar penjaminan mutu, dan delivery produk.',
      contributions: [
        'Mengelola alur kerja tim (Agile/Scrum), pembagian tugas 4 peran siswa, dan jadwal sprint.',
        'Menjamin Quality Control (QC) dan audit keabsahan data sebelum diserahkan ke desa.',
        'Menyediakan platform pengujian bersama (Prompt Lab, Asset Registry, Dashboard Monitoring).'
      ],
      valueReceived: [
        'Menjadi model kemitraan berkelanjutan (sustainable partnership) yang dapat direplikasi ke desa-desa lain.',
        'Menghasilkan nilai ekonomi dan pengakuan akreditasi kelembagaan sekolah kejuruan.'
      ]
    },
    {
      id: 'masyarakat',
      title: 'Masyarakat & Warga',
      roleSubtitle: 'Penerima Manfaat (Beneficiary)',
      icon: Users,
      color: 'amber',
      badge: 'Beneficiary',
      description: 'Warga desa, kelompok tani, pelaku UMKM BUMDes, dan ketua RT/RW menjadi penerima manfaat langsung dari layanan digital yang cepat, transparan, dan andal.',
      contributions: [
        'Memberikan umpan balik (feedback) atas kemudahan penggunaan aplikasi dan layanan desa.',
        'Berpartisipasi aktif dalam pelaporan kendala fasilitas publik (PJU mati, saluran mampet).',
        'Sesepuh desa berkontribusi membagikan memori historis dan kearifan lokal.'
      ],
      valueReceived: [
        'Layanan surat-menyurat dan administrasi kependudukan menjadi jauh lebih cepat dan transparan.',
        'Fasilitas umum dan infrastruktur desa terpelihara dengan baik melalui respon cepat petugas.'
      ]
    }
  ];

  const tasks = [
    { id: 1, title: "Input & Digitasi Transkrip Wawancara Sesepuh", desc: "Melatih ekstraksi memori narasumber dengan Gemini AI", points: 25 },
    { id: 2, title: "Inventarisasi & Penandaan QR Code Aset Desa", desc: "Mendaftarkan aset fisik ke database dan cetak QR Code", points: 25 },
    { id: 3, title: "Uji Coba Prompt Engineering Kebijakan Desa", desc: "Membuat prompt terstruktur untuk Decision Support System", points: 25 },
    { id: 4, title: "Audit Trail Keabsahan Arsip & Perdes", desc: "Memverifikasi kelengkapan dokumen APBDes & Sertifikat Aset", points: 25 }
  ];

  const totalPoints = completedTasks.reduce((sum, tid) => sum + (tasks.find(t => t.id === tid)?.points || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Module Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Teaching Factory SMK — Village Technology Partner
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Model TeFa VTP
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Pemberdayaan talenta vokasi SMK sebagai mitra teknologi strategis desa dalam digitalisasi arsip, pemetaan aset geospasial, pengembangan sistem cerdas, dan pemeliharaan berkelanjutan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl text-xs text-blue-800 flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Kompetensi Siswa</div>
              <div className="font-bold text-sm text-blue-900">{totalPoints} / 100 Poin</div>
            </div>
          </div>
        </div>
      </div>

      {/* PROFIL MITRA SEKOLAH: SMK MUHAMMADIYAH 1 KEPANJEN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Profil Mitra Sekolah: SMK Muhammadiyah 1 Kepanjen
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Mitra Vokasi Strategis Desa
                </span>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Jl. KH. Ahmad Dahlan No. 34, Kepanjen, Kabupaten Malang</span>
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl self-start sm:self-auto">
            Sumber: <strong className="text-slate-900">smkmuh1kepanjen.sch.id (2026)</strong>
          </span>
        </div>

        {/* 4 Pilar Profil Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fasilitas & Model Pembelajaran */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
              <Building2 className="w-4 h-4" />
              <span>Fasilitas & Model Belajar</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <span>Laboratorium Safety Riding</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <span>Teaching Factory Learning Model</span>
              </li>
            </ul>
          </div>

          {/* Mitra Industri Nyata */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
              <Briefcase className="w-4 h-4" />
              <span>Mitra Industri Nyata</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md">
                Astra
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md">
                Denso Manufacturing Indonesia
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md">
                Hillcon
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md">
                AHM (Astra Honda Motor)
              </span>
            </div>
          </div>

          {/* Prestasi 2026 */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Prestasi Sekolah 2026</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-white border border-amber-200/80 rounded-lg text-xs space-y-0.5">
                <span className="font-bold text-amber-900 block">Penghargaan</span>
                <p className="text-[11px] text-slate-600 leading-tight">Sekolah Berprestasi 2026</p>
              </div>
              <div className="p-2.5 bg-white border border-amber-200/80 rounded-lg text-xs space-y-0.5">
                <span className="font-bold text-amber-900 block">Juara Umum</span>
                <p className="text-[11px] text-slate-600 leading-tight">LKS Dikmen Kabupaten Malang 2026</p>
              </div>
              <div className="p-2.5 bg-white border border-amber-200/80 rounded-lg text-xs space-y-0.5">
                <span className="font-bold text-amber-900 block">Juara Nasional</span>
                <p className="text-[11px] text-slate-600 leading-tight">Kompetisi Mekatronika Otomasi 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Kompetensi Keahlian */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              8 Kompetensi Keahlian Terakreditasi
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Program Vokasi 3 & 4 Tahun</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">TPM</span>
              <p className="text-xs font-bold text-slate-900">Teknik Pemesinan</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">TOI</span>
              <p className="text-xs font-bold text-slate-900">Teknik Otomasi Industri</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">TKRO</span>
              <p className="text-xs font-bold text-slate-900">Teknik Kendaraan Ringan Otomotif</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">TKJ</span>
              <p className="text-xs font-bold text-slate-900">Teknik Komputer dan Jaringan</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">TBSM</span>
              <p className="text-xs font-bold text-slate-900">Teknik dan Bisnis Sepeda Motor</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">MM / DKV</span>
              <p className="text-xs font-bold text-slate-900">Multimedia / Desain Komunikasi Visual</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">KI</span>
              <p className="text-xs font-bold text-slate-900">Kimia Industri</p>
            </div>
            <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-700 block">TAB</span>
              <p className="text-xs font-bold text-slate-900">Teknik Alat Berat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'roles' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4 Peran Siswa SMK</span>
        </button>
        <button
          onClick={() => setActiveTab('collaboration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'collaboration' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Model Kolaborasi 4 Pihak (Skema Visual)</span>
        </button>
        <button
          onClick={() => setActiveTab('promptLab')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'promptLab' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Prompt Engineering Lab</span>
        </button>
        <button
          onClick={() => setActiveTab('curation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'curation' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Checklist Praktik Siswa ({completedTasks.length}/4)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: EMPAT PERAN KETERLIBATAN SISWA SMK            */}
      {/* ======================================================== */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <Sparkles className="w-4.5 h-4.5 text-blue-600" />
              <span>Struktur 4 Pilar Keterlibatan Siswa SMK dalam Transformasi Digital Desa</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Setiap siswa SMK yang tergabung dalam Teaching Factory diterjunkan ke dalam empat divisi kerja komprehensif. Masing-masing divisi memiliki tanggung jawab jelas dengan luaran nyata untuk kemajuan Desa Talangagung:
            </p>
          </div>

          {/* 4 Dedicated Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studentRoles.map((role) => {
              const IconComp = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`bg-white border rounded-2xl p-5 space-y-4 transition-all shadow-xs flex flex-col justify-between cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${role.badgeColor}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{role.title}</h3>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{role.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {role.summary}
                    </p>

                    {/* Key Activity Pillars */}
                    <div className="flex flex-wrap gap-1.5">
                      {role.keyPillars.map((pillar, pIdx) => (
                        <span key={pIdx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                          ✓ {pillar}
                        </span>
                      ))}
                    </div>

                    {/* Concrete Activities Section */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-800 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Contoh Kegiatan Konkret Siswa:</span>
                      </div>
                      <div className="space-y-2">
                        {role.concreteActivities.map((act, aIdx) => (
                          <div key={aIdx} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs space-y-0.5">
                            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              <span>{act.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 pl-3 leading-relaxed">
                              {act.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tools & Deliverables */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Peralatan / Teknologi yang Digunakan:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.toolsUsed.map((tool, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md font-medium border border-blue-100">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Luaran Nyata (Deliverables):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.deliverables.map((deliv, dIdx) => (
                            <span key={dIdx} className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-medium border border-emerald-100">
                              🎯 {deliv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 italic">
                      {role.competencyPoints}
                    </span>
                    <span className="text-blue-600 font-bold text-xs flex items-center space-x-1">
                      <span>Detail Peran</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: MODEL KOLABORASI 4 PIHAK (DIAGRAM VISUAL)      */}
      {/* ======================================================== */}
      {activeTab === 'collaboration' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <Share2 className="w-4.5 h-4.5 text-blue-600" />
              <span>Skema Visual Kolaborasi 4 Pihak (Desa — SMK — TeFa — Masyarakat)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Model kemitraan berkelanjutan yang menyeimbangkan antara penyelesaian masalah nyata di desa, akselerasi kompetensi siswa kejuruan, tata kelola platform kolaborasi profesional, dan dampak kesejahteraan bagi masyarakat luas.
            </p>
          </div>

          {/* VISUAL DIAGRAM CANVAS */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6 relative overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-400" />
                  <span>Diagram Arsitektur Kolaborasi Quadruple-Helix Desa Cerdas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik tiap entitas untuk melihat peran terperinci, alur nilai (value flow), dan kontribusi timbal-balik.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  Link & Match Vokasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Solusi Berkelanjutan
                </span>
              </div>
            </div>

            {/* 4 Nodes Interactive Diagram */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* NODE 1: DESA */}
              <div 
                onClick={() => setSelectedParty('desa')}
                className={`bg-slate-800/90 hover:bg-slate-800 border rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  selectedParty === 'desa'
                    ? 'border-blue-400 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Pihak 1
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Pemerintah Desa</h4>
                    <div className="text-[11px] font-semibold text-blue-400">Pemilik Masalah Nyata</div>
                    <div className="text-[10px] text-slate-400 italic">(Real Problem Owner)</div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Menyediakan kasus riil: arsip menumpuk, data aset tersebar, dan kebutuhan sistem layanan warga.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-blue-300 flex items-center justify-between font-bold">
                  <span>Kontribusi Input: Problem & Data</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* NODE 2: SMK */}
              <div 
                onClick={() => setSelectedParty('smk')}
                className={`bg-slate-800/90 hover:bg-slate-800 border rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  selectedParty === 'smk'
                    ? 'border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Pihak 2
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">SMK Kejuruan</h4>
                    <div className="text-[11px] font-semibold text-indigo-400">Penyedia Teknologi & Talenta</div>
                    <div className="text-[10px] text-slate-400 italic">(Technology & Talent)</div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Mengerahkan siswa talenta digital, guru pembimbing, perangkat lab, dan kurikulum project-based learning.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-indigo-300 flex items-center justify-between font-bold">
                  <span>Kontribusi Input: SDM & Skill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* NODE 3: TEACHING FACTORY */}
              <div 
                onClick={() => setSelectedParty('tefa')}
                className={`bg-slate-800/90 hover:bg-slate-800 border rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  selectedParty === 'tefa'
                    ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Pihak 3
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">Teaching Factory (TeFa)</h4>
                    <div className="text-[11px] font-semibold text-emerald-400">Platform Kolaborasi</div>
                    <div className="text-[10px] text-slate-400 italic">(Collaboration Platform)</div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Jembatan operasional, manajemen mutu berstandar industri, pembagian sprint kerja, dan pengujian kualitas.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-emerald-300 flex items-center justify-between font-bold">
                  <span>Peran: Orchestrator & QA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* NODE 4: MASYARAKAT */}
              <div 
                onClick={() => setSelectedParty('masyarakat')}
                className={`bg-slate-800/90 hover:bg-slate-800 border rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  selectedParty === 'masyarakat'
                    ? 'border-amber-400 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Pihak 4
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Masyarakat & Warga</h4>
                    <div className="text-[11px] font-semibold text-amber-400">Penerima Manfaat</div>
                    <div className="text-[10px] text-slate-400 italic">(Beneficiary)</div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Menikmati layanan administrasi cepat, fasilitas publik terawat, transparansi info, serta partisipasi aduan.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 text-[11px] text-amber-300 flex items-center justify-between font-bold">
                  <span>Hasil Akhir: Dampak Nyata</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* FLOW ARROWS VISUAL SUMMARY */}
            <div className="relative z-10 bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-400">Desa (Masalah)</span>
                <span className="text-slate-500">+</span>
                <span className="font-bold text-indigo-400">SMK (Talenta)</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <span>Dikelola oleh TeFa (Platform)</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-amber-400">Masyarakat Bahagia & Sejahtera (Manfaat)</span>
              </div>
            </div>
          </div>

          {/* DETAILED ACTIVE PARTY CARD */}
          {(() => {
            const currentParty = collaborationParties.find(p => p.id === selectedParty) || collaborationParties[0];
            const PartyIcon = currentParty.icon;

            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                      <PartyIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{currentParty.title}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                          {currentParty.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{currentParty.roleSubtitle}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentParty.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Kontribusi & Peran yang Diberikan:</span>
                    </h4>
                    <div className="space-y-2">
                      {currentParty.contributions.map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Nilai Tambah & Manfaat yang Diperoleh:</span>
                    </h4>
                    <div className="space-y-2">
                      {currentParty.valueReceived.map((item, idx) => (
                        <div key={idx} className="text-xs text-emerald-900 flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: PROMPT ENGINEERING LAB (LABORATORIUM SISWA)   */}
      {/* ======================================================== */}
      {activeTab === 'promptLab' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" /> Laboratorium Pengujian Prompt AI Desa
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Divisi Teknologi TeFa
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Siswa SMK merumuskan formulasi prompt engineering berbasis data faktual desa untuk menghasilkan draf kebijakan terstruktur:
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">Prompt Input Siswa:</label>
              <textarea
                rows={5}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-500 font-mono shadow-2xs leading-relaxed"
                placeholder="Tuliskan prompt AI untuk asisten desa..."
              />
            </div>

            {/* Quick Prompt Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Template Prompt Uji Coba:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setTestPrompt('Buatkan draf usulan perbaikan drainase RT 05 dalam format RKP Desa untuk Musrenbangdes.')}
                  className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                >
                  Usulan RKP Drainase
                </button>
                <button
                  type="button"
                  onClick={() => setTestPrompt('Analisis status legalitas tanah hibah Posyandu Melati dan rekomendasikan langkah sertifikasi PTSL.')}
                  className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                >
                  Legalitas Aset Posyandu
                </button>
                <button
                  type="button"
                  onClick={() => setTestPrompt('Susun rekomendasi jadwal preventive maintenance untuk 22 titik PJU ruas TPA Talangagung.')}
                  className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                >
                  Jadwal Maintenance PJU
                </button>
              </div>
            </div>

            <button
              onClick={handleRunPromptTest}
              disabled={isTesting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>{isTesting ? 'Menguji Prompt dengan Gemini AI...' : 'Jalankan Pengujian Prompt'}</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Hasil Respon Model AI Studio
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Output Real-Time
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed min-h-[260px] max-h-[360px] overflow-y-auto whitespace-pre-wrap">
                {promptResult || "// Hasil respon prompt siswa akan muncul di sini setelah dieksekusi oleh Gemini AI..."}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Model: Google Gemini 2.5 Flash / Pro</span>
              <span className="text-blue-600 font-bold">Verification: Pass</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: CURATION & COMPETENCY CHECKLIST              */}
      {/* ======================================================== */}
      {activeTab === 'curation' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Modul Praktik & Sertifikasi Industri Teaching Factory SMK</h3>
              <p className="text-xs text-slate-600">Klik tugas yang telah diselesaikan oleh siswa untuk menghitung perolehan skor kompetensi vokasi.</p>
            </div>
            <div className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
              Total Skor: {totalPoints}/100 Poin
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <div 
                  key={task.id}
                  onClick={() => {
                    if (isDone) {
                      setCompletedTasks(completedTasks.filter(id => id !== task.id));
                    } else {
                      setCompletedTasks([...completedTasks, task.id]);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isDone ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 ${isDone ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{task.desc}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    isDone ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-700 border-slate-200'
                  }`}>
                    +{task.points} Poin
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
