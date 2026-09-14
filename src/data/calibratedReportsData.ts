import { CitizenReport } from '../types';
import { validateRecordGeography } from '../utils/security';

/**
 * Dataset Simulasi Prototipe 120 Laporan Warga Desa Talangagung (Periode Januari - Juni 2026)
 * Data B — Simulasi Prototipe Terkalibrasi berdasarkan proporsi 8.522 penduduk, 5 RW, 27 RT.
 * 
 * Distribusi Wilayah Terstruktur (120 Laporan):
 * - RW 01 / Dusun 1 (Krajan, RT 01 s/d RT 06): 22 laporan
 * - RW 02 / Dusun 2 (Jatisari, RT 07 s/d RT 11): 19 laporan
 * - RW 03 / Dusun 3 (Glanggang, RT 12 s/d RT 16): 23 laporan
 * - RW 04 / Dusun 4 (Krajan Timur, RT 17 s/d RT 21): 25 laporan
 * - RW 05 / Dusun 5 (Perumnas / Kepanjen Permai, RT 22 s/d RT 27): 31 laporan
 * 
 * Status Penyelesaian (120):
 * - Selesai: 84 (70.0%)
 * - Sedang Dikerjakan: 19 (15.8%)
 * - Diteruskan ke Pemerintah Desa: 10 (8.3%)
 * - Menunggu Verifikasi RT: 5 (4.2%)
 * - Ditolak: 2 (1.7%)
 */

interface AreaConfig {
  rw: string;
  rwNum: number;
  dusun: string;
  count: number;
  rtList: number[];
  reporters: { name: string; citizenId: string; phone: string }[];
  templates: {
    title: string;
    category: CitizenReport['category'];
    desc: string;
  }[];
}

const AREA_CONFIGS: AreaConfig[] = [
  // RW 01 (22 Laporan) - Dusun 1 (Krajan) - RT 01 s/d RT 06
  {
    rw: 'RW 01',
    rwNum: 1,
    dusun: 'Dusun 1 (Krajan)',
    count: 22,
    rtList: [1, 2, 3, 4, 5, 6],
    reporters: [
      { name: 'Siti Rahmawati', citizenId: 'WARGA-002', phone: '0812-3456-7891' }, // RT 01
      { name: 'Pak Budi Santoso', citizenId: 'WARGA-001', phone: '0812-3456-7890' }, // RT 02 (Pak Budi strictly in RT 02)
      { name: 'Ahmad Fauzi', citizenId: 'WARGA-003', phone: '0812-3456-7892' },     // RT 03
      { name: 'Sutrisno', citizenId: 'WARGA-004', phone: '0812-3456-7893' },        // RT 04
      { name: 'Dewi Lestari', citizenId: 'WARGA-005', phone: '0812-3456-7894' },      // RT 05
      { name: 'Agus Hartono', citizenId: 'WARGA-006', phone: '0812-3456-7895' }       // RT 06
    ],
    templates: [
      { title: 'Lampu LED 40W Dekat Pos Ronda Krajan Mati', category: 'Lampu Padam', desc: 'Penerangan pos kamling Krajan padam sejak 2 malam lalu dan butuh penggantian bohlam LED.' },
      { title: 'Aspal Berlubang Dekat Gapura Masuk Krajan', category: 'Jalan Rusak', desc: 'Lubang jalan sedalam 8 cm membahayakan pengendara motor saat melintas di malam hari.' },
      { title: 'Tempat Sampah Terpilah Krajan Rusak', category: 'Sampah', desc: 'Tutup tong sampah organik pecah tersenggol kendaraan pikap.' },
      { title: 'Genangan Air Hujan di Depan Balai RW 01', category: 'Drainase/Banjir', desc: 'Saluran air tersumbat endapan pasir sehingga air meluap ke badan jalan.' },
      { title: 'Plafon Balai Posyandu Melati Rusak', category: 'Lainnya', desc: 'Plafon asbes teras depan posyandu rembes saat hujan deras.' },
      { title: 'Pintu Pos Ronda RW 01 Butuh Gembok Baru', category: 'Keamanan', desc: 'Gembok pengaman ruang simpan inventaris ronda rusak dan perlu diganti.' },
      { title: 'Retak Aspal Dingin Jalur Penghubung Krajan', category: 'Jalan Rusak', desc: 'Permukaan aspal mulai terkelupas di dekat pertigaan jalan kampung.' },
      { title: 'Fitting Lampu Penerangan Gang Krajan Longgar', category: 'Lampu Padam', desc: 'Lampu berkedip saat tertiup angin kencang di tiang nomor 04.' },
      { title: 'Sedimentasi Pasir Drainase Depan SDN 1 Krajan', category: 'Drainase/Banjir', desc: 'Saluran drainase depan sekolah tertutup pasir setebal 15 cm.' },
      { title: 'Pemberitahuan Izin Penutupan Jalan Hajatan Krajan', category: 'Lainnya', desc: 'Permohonan izin penutupan sementara jalan gang untuk acara syukuran warga.' }
    ]
  },

  // RW 02 (19 Laporan) - Dusun 2 (Jatisari) - RT 07 s/d RT 11
  {
    rw: 'RW 02',
    rwNum: 2,
    dusun: 'Dusun 2 (Jatisari)',
    count: 19,
    rtList: [7, 8, 9, 10, 11],
    reporters: [
      { name: 'Hadi Purnomo', citizenId: 'WARGA-007', phone: '0812-4567-8901' },
      { name: 'Rina Wulandari', citizenId: 'WARGA-008', phone: '0812-4567-8902' },
      { name: 'Bambang Irawan', citizenId: 'WARGA-009', phone: '0812-4567-8903' },
      { name: 'Nur Aini', citizenId: 'WARGA-010', phone: '0812-4567-8904' }
    ],
    templates: [
      { title: 'Bahu Jalan Terkikis di Ruas Jatisari', category: 'Jalan Rusak', desc: 'Bahu jalan aspal terkikis aliran air hujan di dekat area persawahan.' },
      { title: 'Lampu PJU Pertigaan Jatisari Redup', category: 'Lampu Padam', desc: 'Intensitas cahaya kap lampu LED menurun drastis di pertigaan utama.' },
      { title: 'Endapan Lumpur Saluran Kali Metro Jatisari', category: 'Drainase/Banjir', desc: 'Sedimentasi lumpur memperlambat aliran air buangan permukiman.' },
      { title: 'Tekanan Air PAMSIMAS Jatisari Melemah', category: 'Drainase/Banjir', desc: 'Distribusi air bersih pada jam sibuk pagi hari mengecil tekanannya.' },
      { title: 'Kerusakan Sambungan Jembatan Kali Metro Jatisari', category: 'Jalan Rusak', desc: 'Plat sambungan expansion joint jembatan memerlukan pengelasan ulang.' },
      { title: 'Pengangkutan Sampah Terlambat di TPS Jatisari', category: 'Sampah', desc: 'Volume sampah rumah tangga menumpuk karena jadwal armada bergeser.' },
      { title: 'Pohon Rimbun Menutupi Pandangan Tikungan Jatisari', category: 'Keamanan', desc: 'Ranting pohon peneduh menghalangi jarak pandang pengendara jalan.' },
      { title: 'Papan Informasi Publik Jatisari Rusak', category: 'Lainnya', desc: 'Kaca penutup papan mading pengumuman RT pecah.' }
    ]
  },

  // RW 03 (23 Laporan) - Dusun 3 (Glanggang) - RT 12 s/d RT 16
  {
    rw: 'RW 03',
    rwNum: 3,
    dusun: 'Dusun 3 (Glanggang)',
    count: 23,
    rtList: [12, 13, 14, 15, 16],
    reporters: [
      { name: 'Agus Triyono', citizenId: 'WARGA-012', phone: '0812-5678-9012' },
      { name: 'Eko Prasetyo', citizenId: 'WARGA-013', phone: '0812-5678-9013' },
      { name: 'Sri Handayani', citizenId: 'WARGA-014', phone: '0812-5678-9014' },
      { name: 'Wahyu Hidayat', citizenId: 'WARGA-015', phone: '0812-5678-9015' }
    ],
    templates: [
      { title: 'Saluran Drainase Glanggang Meluap Saat Hujan', category: 'Drainase/Banjir', desc: 'Saluran pasangan batu kali butuh pengerukan berkala agar tidak meluap ke sawah.' },
      { title: 'Jalan Usaha Tani Glanggang Retak & Amblas', category: 'Jalan Rusak', desc: 'Akses jalan traktor dan pengangkut hasil panen bergelombang di beberapa titik.' },
      { title: 'PJUTS Tenaga Surya RW 03 Baterai Drop', category: 'Lampu Padam', desc: 'Lampu tenaga surya hanya menyala selama 3 jam setelah matahari terbenam.' },
      { title: 'Penumpukan Residu Sampah TPS-3R Glanggang', category: 'Sampah', desc: 'Residu anorganik memerlukan jadwal pengangkutan kontainer tambahan.' },
      { title: 'Kran Air Wudhu Musholla Glanggang Bocor', category: 'Lainnya', desc: 'Instalasi pipa air kran rembes dan membuang air bersih.' },
      { title: 'Pompa Air Pertanian Glanggang Bersuara Kasar', category: 'Drainase/Banjir', desc: 'Bearing dinamo pompa submersible sawah terindikasi aus.' },
      { title: 'Laporan Dahan Ranting Lapuk Rawan Roboh Glanggang', category: 'Lainnya', desc: 'Pohon trembesi tua di pinggir jalan membutuhkan perempelan dahan.' }
    ]
  },

  // RW 04 (25 Laporan) - Dusun 4 (Krajan Timur) - RT 17 s/d RT 21
  {
    rw: 'RW 04',
    rwNum: 4,
    dusun: 'Dusun 4 (Krajan Timur)',
    count: 25,
    rtList: [17, 18, 19, 20, 21],
    reporters: [
      { name: 'Yuni Astuti', citizenId: 'WARGA-017', phone: '0812-6789-0123' },
      { name: 'Sugeng Riyadi', citizenId: 'WARGA-018', phone: '0812-6789-0124' },
      { name: 'Indah Permata', citizenId: 'WARGA-019', phone: '0812-6789-0125' },
      { name: 'Heri Setiawan', citizenId: 'WARGA-020', phone: '0812-6789-0126' }
    ],
    templates: [
      { title: 'Paving Amblas di Depan Masjid RW 04 Krajan Timur', category: 'Jalan Rusak', desc: 'Paving blok halaman depan masjid turun sedalam 5 cm karena pergeseran tanah.' },
      { title: 'Buis Beton Saluran RW 04 Pecah Tersumbat', category: 'Drainase/Banjir', desc: 'Buis beton saluran pembuangan patah akibat dilintasi truk material.' },
      { title: 'Lampu Penerangan Lapangan RW 04 Krajan Timur Padam', category: 'Lampu Padam', desc: 'Lampu sorot penerangan fasilitas olahraga warga tidak menyala.' },
      { title: 'Pipa Distribusi Air Bersih RW 04 Bocor', category: 'Drainase/Banjir', desc: 'Pipa PVC ukuran 1,5 inch di bawah aspal mengalami kebocoran air.' },
      { title: 'Sampah Liar di Saluran Sudetan RW 04', category: 'Sampah', desc: 'Sampah plastik kiriman menumpuk di saringan air drainase.' },
      { title: 'Kamera CCTV Pos Linmas RW 04 Butuh Pengecekan', category: 'Keamanan', desc: 'Tampilan feed kamera pengawas malam hari mengalami interferensi.' },
      { title: 'Usulan Pemasangan Spanduk Batas Kecepatan RW 04', category: 'Lainnya', desc: 'Banyak kendaraan roda dua melaju kencang di jalan lingkungan anak-anak.' }
    ]
  },

  // RW 05 (31 Laporan) - Dusun 5 (Perumnas / Kepanjen Permai) - RT 22 s/d RT 27
  {
    rw: 'RW 05',
    rwNum: 5,
    dusun: 'Dusun 5 (Perumnas / Kepanjen Permai)',
    count: 31,
    rtList: [22, 23, 24, 25, 26, 27],
    reporters: [
      { name: 'Joko Susilo', citizenId: 'WARGA-022', phone: '0812-7890-1234' },
      { name: 'Fitri Handayani', citizenId: 'WARGA-023', phone: '0812-7890-1235' },
      { name: 'Cecep Supriatna', citizenId: 'WARGA-024', phone: '0812-7890-1236' },
      { name: 'Sri Mulyani', citizenId: 'WARGA-025', phone: '0812-7890-1237' }
    ],
    templates: [
      { title: 'Lampu Gang Kompleks Perumnas Butuh Penggantian', category: 'Lampu Padam', desc: 'Lampu penerangan gang di Kompleks Perumnas padam total dan butuh unit lampu baru.' },
      { title: 'Pelebaran Jalan Gang Perumahan RW 05', category: 'Jalan Rusak', desc: 'Kondisi paving jalan blok perumahan perlu perataan ulang akibat akar pohon peneduh.' },
      { title: 'Batas Patok Lahan Fasum RW 05 Perumnas Perlu Perbaikan', category: 'Lainnya', desc: 'Patok pembatas taman fasum perumahan miring tersenggol roda mobil warga.' },
      { title: 'Sarana Bermain Taman Anak RW 05 Butuh Pengelasan', category: 'Lainnya', desc: 'Besi ayunan dan jungkitan di taman bermain perumahan goyang dan rawan patah.' },
      { title: 'Permintaan Tambahan Bak Sampah Organik RW 05', category: 'Sampah', desc: 'Kapasitas bak sampah di blok D dan E perumahan cepat penuh di akhir pekan.' },
      { title: 'KWh Meter PJU Jalur Lingkar RW 05 Mengalami Trip', category: 'Lampu Padam', desc: 'Sekring MCB panel penerangan jalan otomatis padam saat hujan gerimis.' },
      { title: 'Talud Saluran Pembuangan Air Hujan RW 05 Longsor Kecil', category: 'Drainase/Banjir', desc: 'Plengsengan saluran drainase samping taman longsor selebar 1 meter.' },
      { title: 'Peminjaman Tenda BUMDes untuk Syukuran Warga RW 05', category: 'Lainnya', desc: 'Pengajuan sewa tenda dan kursi operasional BUMDes untuk kegiatan warga.' }
    ]
  }
];

// Helper to generate the structured 120 items with 100% verified geographical integrity
function generate120CalibratedReports(): CitizenReport[] {
  const reports: CitizenReport[] = [];

  // Status distribution (Total 120):
  // 84 Selesai, 19 Sedang Dikerjakan, 10 Diteruskan ke Pemerintah Desa, 5 Menunggu Verifikasi RT, 2 Ditolak
  const statusPool: CitizenReport['status'][] = [
    ...Array(84).fill('Selesai' as const),
    ...Array(19).fill('Sedang Dikerjakan' as const),
    ...Array(10).fill('Diteruskan ke Pemerintah Desa' as const),
    ...Array(5).fill('Menunggu Verifikasi RT' as const),
    ...Array(2).fill('Ditolak' as const)
  ];

  let globalReportNum = 1;
  let statusIndex = 0;

  AREA_CONFIGS.forEach(area => {
    for (let i = 0; i < area.count; i++) {
      const rtIndex = i % area.rtList.length;
      const rtNum = area.rtList[rtIndex];
      const rtFormatted = String(rtNum).padStart(2, '0');
      const rtRw = `RT ${rtFormatted} / ${area.rw}`;
      
      const reporter = area.reporters[rtIndex % area.reporters.length];
      const template = area.templates[i % area.templates.length];
      const currentStatus = statusPool[statusIndex % statusPool.length];
      statusIndex++;

      const month = String(Math.floor((globalReportNum % 6) + 1)).padStart(2, '0');
      const day = String((globalReportNum % 28) + 1).padStart(2, '0');
      const createdAt = `2026-${month}-${day} ${String(8 + (globalReportNum % 10)).padStart(2, '0')}:${String((globalReportNum * 7) % 60).padStart(2, '0')}`;
      const urgency: CitizenReport['urgency'] = (globalReportNum % 4 === 0) ? 'Darurat' : (globalReportNum % 2 === 0) ? 'Penting' : 'Biasa';

      const report: CitizenReport = {
        id: `REP-2026-${String(globalReportNum).padStart(3, '0')}`,
        citizenId: reporter.citizenId,
        title: template.title,
        category: template.category,
        reporterName: reporter.name,
        reporterPhone: reporter.phone,
        dusun: area.dusun,
        rtRw: rtRw,
        description: `${template.desc} (Lokasi: ${rtRw}, ${area.dusun}). Data B — Simulasi Prototipe.`,
        photoUrl: template.category === 'Jalan Rusak' 
          ? 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&auto=format&fit=crop&q=80'
          : template.category === 'Lampu Padam'
          ? 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&auto=format&fit=crop&q=80'
          : template.category === 'Sampah'
          ? 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        status: currentStatus,
        urgency: urgency,
        createdAt: createdAt,
        verifiedByRtAt: currentStatus !== 'Menunggu Verifikasi RT' ? `2026-${month}-${day} 10:00` : undefined,
        rtNotes: currentStatus !== 'Menunggu Verifikasi RT' ? `Telah divalidasi oleh Ketua ${rtRw}.` : undefined,
        villageFollowUpNotes: currentStatus === 'Selesai' ? 'Tindakan perbaikan telah diselesaikan via swakelola desa/APBDes.' : undefined,
        assignedBudget: currentStatus === 'Selesai' ? 1500000 + (globalReportNum * 250000) : undefined,
        dataClassification: 'PROTOTYPE_SIMULATION',
        accessLevel: 'RESTRICTED_PERSONAL',
        gpsCoords: {
          lat: -8.1320 - (globalReportNum * 0.0003),
          lng: 112.5650 + (globalReportNum * 0.0004)
        }
      };

      // Perform real-time validation check
      validateRecordGeography(report);

      reports.push(report);
      globalReportNum++;
    }
  });

  return reports;
}

export const initialCalibratedReports: CitizenReport[] = generate120CalibratedReports();
