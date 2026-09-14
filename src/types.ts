export type DocCategory = 
  | 'Peraturan Desa'
  | 'APBDes'
  | 'RPJMDes'
  | 'RKP Desa'
  | 'Surat Keputusan'
  | 'Berita Acara'
  | 'Laporan Pembangunan';

export interface KnowledgeRelationLink {
  targetId: string;
  targetTitle: string;
  targetType: 'doc' | 'memory' | 'event' | 'asset';
  relationLabel?: string;
  year?: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: DocCategory;
  year: number;
  fileType: 'PDF' | 'Word' | 'Excel' | 'Scan' | 'Teks';
  summary: string;
  keyEntities: string[];
  tags: string[];
  content: string;
  author?: string;
  createdAt: string;
  // Fields for Relasi Pengetahuan Faktual (Black Box)
  relatedObject?: string; // Objek terkait (misal: "TPA Talangagung", "Balai Desa", "Jembatan Kali Metro")
  relatedParties?: string[]; // Pihak terkait (misal: "Dinas Lingkungan Hidup Kab. Malang", "RT 02")
  relatedLinks?: KnowledgeRelationLink[]; // Hubungan dengan kejadian/catatan lain
}

export interface UploadedVillageDoc {
  id: string;
  fileName: string;
  fileType: 'excel' | 'word' | 'pdf' | 'csv' | 'text';
  fileSize?: number;
  uploadedAt: string;
  uploaderName: string;
  chatId?: string | number;
  title: string;
  category: string;
  summary: string;
  keyPoints: string[];
  keyData: string[];
  tableDataPreview?: string;
  fullExtractedText: string;
  suggestedQuestions: string[];
}

export type AssetCondition = 'Baik' | 'Perlu Servis' | 'Rusak Ringan' | 'Rusak Berat';
export type AssetCategory = 'Infrastruktur' | 'Fasilitas Umum' | 'Peralatan/Mesin' | 'Bangunan Desa' | 'Lahan Kas Desa';

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  cost: number;
  technician: string;
  notes: string;
}

export interface AssetItem {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  dusun: string;
  rtRw: string;
  yearBuilt: number;
  condition: AssetCondition;
  photoUrl?: string;
  gpsCoords?: {
    lat: number;
    lng: number;
  };
  maintenanceHistory: MaintenanceRecord[];
  qrCodeValue: string;
  estimatedValue: number;
  assignedManager?: string;
  // Metadata Klasifikasi & Tata Kelola Data A/B
  assetId?: string;
  scenarioId?: string;
  dataClassification?: 'AUTHENTIC_OFFICIAL' | 'PROTOTYPE_SIMULATION' | 'COMMUNITY_VERIFIED';
  validationStatus?: 'VERIFIED_OFFICIAL' | 'SIMULATION_ONLY' | 'COMMUNITY_VERIFIED';
  isSimulation?: boolean;
  sourceIds?: string[];
}

export interface HumanMemory {
  id: string;
  interviewee: string;
  role: string;
  period: string;
  storyTitle: string;
  title?: string;
  storyText: string;
  extractedKnowledge: {
    problem: string;
    location: string;
    solution: string;
    year: number;
    stakeholders: string[];
  };
  tags: string[];
  dateRecorded: string;
  // Fields for Relasi Pengetahuan Faktual (Black Box)
  relatedObject?: string; // Objek terkait (misal: "Drainase & Jalan RT 05 Glanggang", "Posyandu Melati")
  relatedParties?: string[]; // Pihak terkait (misal: "Dinas PU Pengairan Kab. Malang", "RW 03 Glanggang")
  relatedLinks?: KnowledgeRelationLink[]; // Hubungan dengan kejadian/catatan lain
  dataClassification?: 'AUTHENTIC_OFFICIAL' | 'PROTOTYPE_SIMULATION' | 'COMMUNITY_VERIFIED' | string;
  isSimulation?: boolean;
}

export interface HistoryMilestone {
  id: string;
  year: number;
  title: string;
  category: string;
  description: string;
  budget?: number;
  relatedAssetIds?: string[];
  relatedDocIds?: string[];
  impact: string;
}

export interface DecisionRecommendation {
  id: string;
  title: string;
  category: string;
  urgencyScore: number; // 1-100
  urgencyLevel: 'Sangat Tinggi' | 'Tinggi' | 'Sedang';
  estimatedBudget: number;
  rationale: string;
  sourceAssets: string[];
  sourceDocs: string[];
  sourceMemories: string[];
  citizenImpact: string;
  draftProposalText: string;
  status: 'Draf AI' | 'Disetujui Kades' | 'Masuk APBDes' | 'Dalam Peninjauan';
}

export type SourceValidationStatus = 'Belum Diverifikasi' | 'Terverifikasi' | 'Diperbarui' | 'Tidak Berlaku';

export interface GroundedSourceItem {
  id?: string;
  documentName: string;
  sourceDate: string;
  category: 'Regulasi Desa' | 'Inventaris Fisik & IoT' | 'Standar Pelayanan Publik' | 'Memori Kolektif Tokoh' | 'APBDes & Anggaran' | 'Kependudukan & Wilayah' | 'Simulasi Prototipe' | string;
  validationStatus: SourceValidationStatus | 'SIMULATION_ONLY' | string;
  excerpt?: string;
  confidenceScore?: number;
  isSimulation?: boolean;
  dataClassification?: string;
  sourceType?: string;
  validityStatus?: string;
  badgeLabel?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  mode?: 'Fast' | 'DeepReasoning';
  sources?: GroundedSourceItem[];
  references?: {
    docs?: string[];
    assets?: string[];
    memories?: string[];
  };
  reasoningSteps?: string[];
}

export interface VillageProfile {
  name: string;
  subdistrict: string;
  regency: string;
  province: string;
  kadesName: string;
  secretaryName: string;
  population: number;
  population2023?: number;
  male2023?: number;
  female2023?: number;
  population2025?: number;
  areaHa?: number;
  areaKm2?: number;
  totalRw?: number;
  totalRt?: number;
  densityPerKm2?: number;
  avgPopPerRt?: number;
  ageCohorts?: {
    age50_54: number;
    age55_59: number;
    age60_64: number;
    age65Plus: number;
  };
  landStats?: {
    unproductive2024Ha: number;
    productive2022Ha: number;
  };
  rdtrSource?: string;
  apbdesTotal: number;
  blackBoxMemoryScore: number; // e.g. 94%
  establishedYear: number;
  // Indonesian field aliases
  namaDesa?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  kepalaDesa?: string;
  sekretarisDesa?: string;
  alamatKantor?: string;
  telepon?: string;
  email?: string;
  website?: string;
  visi?: string;
  misi?: string;
}

export type DataClassCategory = 'DATA_A_REAL' | 'DATA_B_SEED' | 'DATA_C_EXPERIMENTAL';

export interface ResearchQuestion {
  id: string;
  domain: 'Profil Desa' | 'Kependudukan' | 'Infrastruktur' | 'Aset' | 'Pembangunan' | 'Fasilitas Publik' | 'Histori/Pengetahuan';
  question: string;
  groundTruthAnswer: string;
  sourceReference: string;
  dataClass: DataClassCategory;
  aiAccuracyScore: number; // e.g. 96%
  status: 'Lolos Validasi' | 'Terverifikasi Faktual' | 'Perlu Kalibrasi';
}

export interface ResearchBenchmarkMetrics {
  totalQuestions: number;
  aiAccuracyTarget: number;
  aiAccuracyActual: number;
  sourceGroundingActual: number;
  taskCompletionActual: number;
  susUsabilityScore: number;
  manualSearchTimeSeconds: number;
  aiSearchTimeSeconds: number;
  timeReductionPercent: number;
}

export type UserRoleType = 'warga' | 'rt' | 'perangkat' | 'kades' | 'rw';

export interface UserContext {
  id: string;
  citizenId?: string;
  role: UserRoleType;
  name: string;
  rt: string;
  rw: string;
  dusun: string;
  phone?: string;
}

export type ReportStatus = 'Draft' | 'Menunggu Verifikasi RT' | 'Diteruskan ke Pemerintah Desa' | 'Sedang Dikerjakan' | 'Selesai' | 'Ditolak';

export interface AuditTrail {
  id: string;
  action: 'VERIFIKASI_LAPORAN' | 'PERSETUJUAN_SURAT' | 'PENOLAKAN' | 'DISPOSISI_DESA';
  entityId: string;
  actorName: string;
  actorRole: string;
  previousStatus: string;
  newStatus: string;
  timestamp: string;
  notes?: string;
}

export interface CitizenReport {
  id: string;
  citizenId?: string;
  title: string;
  category: 'Jalan Rusak' | 'Drainase/Banjir' | 'Lampu Padam' | 'Sampah' | 'Keamanan' | 'Lainnya';
  reporterName: string;
  reporterPhone: string;
  dusun: string;
  rtRw: string;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  urgency: 'Biasa' | 'Penting' | 'Darurat';
  createdAt: string;
  verifiedByRtAt?: string;
  rtNotes?: string;
  villageFollowUpNotes?: string;
  assignedBudget?: number;
  auditTrail?: AuditTrail[];
  dataClassification?: DataClassification;
  accessLevel?: AccessLevel;
  scenarioId?: string;
  isSimulation?: boolean;
  sourceIds?: string[];
  gpsCoords?: {
    lat: number;
    lng: number;
  };
}

export type LetterStatus = 'Menunggu Persetujuan RT' | 'Disetujui RT' | 'Selesai di Pemerintah Desa' | 'Ditolak';

export interface LetterRequest {
  id: string;
  citizenId?: string;
  applicantName: string;
  nik: string;
  rtRw: string;
  dusun: string;
  letterType: 'Surat Pengantar KTP/KK' | 'Surat Keterangan Usaha (SKU)' | 'Surat Keterangan Domisili' | 'Surat Keterangan Tidak Mampu (SKTM)' | 'Surat Pengantar Nikah' | 'Surat Keterangan Kematian';
  purpose: string;
  status: LetterStatus;
  requestedAt: string;
  approvedAt?: string;
  rtStampCode?: string;
  rejectionReason?: string;
  auditTrail?: AuditTrail[];
  dataClassification?: DataClassification;
  accessLevel?: AccessLevel;
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  senderRole: 'Ketua RT' | 'Ketua RW' | 'Kepala Desa' | 'Bidan Desa';
  senderName: string;
  targetScope: 'Semua Warga Desa' | 'Warga RW 01' | 'Warga RT 02' | 'Warga RT 05';
  content: string;
  date: string;
  priority: 'Info' | 'Penting' | 'Darurat';
  category: 'Posyandu' | 'Kerja Bakti' | 'Bansos' | 'Keamanan' | 'Pembangunan';
}

// Data Governance & Research Data Classification
export type DataClassification = 'FACTUAL_VERIFIED' | 'PROTOTYPE_SIMULATION' | 'EXPERIMENT_RESULT';

// Data Privacy & Access Level (UU Pelindungan Data Pribadi)
export type AccessLevel = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED_PERSONAL';

// 1. Preventive Maintenance Types
export interface PreventiveTask {
  id: string;
  assetId: string;
  assetName: string;
  location?: string;
  category: string;
  taskTitle?: string;
  title?: string;
  intervalType: 'Jam Operasional' | 'Bulanan' | 'Semesteran' | 'Musiman' | string;
  currentHours?: number;
  nextDueHours?: number;
  dueDate?: string;
  lastServiceDate?: string;
  nextDueDate?: string;
  status: 'Jatuh Tempo Segera' | 'Terjadwal' | 'Selesai' | 'Terlambat' | string;
  assignedTechnician: string; // e.g. "Siswa Magang SMK Mesin" or "Teknisi BUMDes"
  priority: 'Kritis' | 'Tinggi' | 'Rutin' | string;
  checklist: { item: string; done: boolean }[];
  estimatedCost: number;
}

// 2. Real-time IoT Sensor Types
export interface IoTSensorNode {
  id: string;
  code: string;
  name: string;
  assetName: string;
  type: 'WaterLevel' | 'PumpFlow' | 'SolarVoltage' | 'SmartBinTrash' | 'SmartFeeder';
  dusun: string;
  rtRw: string;
  currentValue: number;
  unit: string;
  normalRange: { min: number; max: number };
  status: 'Normal' | 'Peringatan' | 'Bahaya / Butuh Tindakan';
  batteryLevel: number;
  lastUpdated: string;
  history: { time: string; value: number }[];
  alertMessage?: string;
}

// 3. Bursa Kerja Lokal & Kemitraan Industri Types
export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  industryType: 'Manufaktur' | 'Agribisnis / Pertanian' | 'Otomotif & Servis' | 'Teknologi & Kreatif' | 'Jasa & Perdagangan';
  employmentType: 'Full-Time' | 'Magang SMK' | 'Part-Time' | 'Kerja Musiman';
  salaryRange: string;
  postedDate: string;
  deadline: string;
  requirements: string[];
  slotsAvailable: number;
  applicantsCount: number;
  contactPerson: string;
  isPriorityForLocal: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantPhone: string;
  rtRw: string;
  education: string;
  skills: string;
  status: 'Terkirim' | 'Dipanggil Wawancara' | 'Diterima' | 'Belum Sesuai';
  appliedAt: string;
}

// 4. Etalase Digital BUMDes Types
export interface BumdesProduct {
  id: string;
  name: string;
  category: 'Olahan Pangan & Camilan' | 'Hasil Tani Segar' | 'Kerajinan Tangan' | 'Jasa Teknik & PAMSIMAS' | 'Pupuk & Saprotan';
  price: number;
  unit: string;
  producer: string;
  dusun: string;
  photoUrl: string;
  description: string;
  rating: number;
  stock: number;
  whatsappContact: string;
  isBestSeller?: boolean;
}

// 5. Emergency SOS Real-Time Alert Types
export interface EmergencyAlert {
  id: string;
  category: 'Kecelakaan / Sakit Parah' | 'Kebakaran / Api' | 'Bencana Banjir / Longsor' | 'Keamanan / Pencurian' | 'Pohon Tumbang Hambat Jalan' | 'Lainnya';
  reporterName: string;
  reporterPhone: string;
  location: string;
  dusun: string;
  rtRw: string;
  gpsCoords?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  notes: string;
  timestamp: string;
  status: 'Darurat Aktif' | 'Ditangani Satgas' | 'Selesai';
  targetUnits: string[];
}

// 6. Posyandu & Monthly Trends Types
export interface MonthlyTrendData {
  month: string;
  laporanJalan: number;
  laporanLampu: number;
  laporanDrainase: number;
  suratDiproses: number;
  kunjunganBalita: number;
  kunjunganLansia: number;
  ibuHamil: number;
  giziBaik: number;
  perluPemantauan: number;
}

// 7. Modul Memori Historis (Studi Kasus TPA Talangagung)
export interface MemoriHistorisItem {
  id: string;
  tahun: number;
  objek: string;
  lokasi: string;
  peristiwa: string;
  tanggal: string;
  dokumen: string;
  tindakan: string;
  status: 'Selesai' | 'Beroperasi Penuh' | 'Terverifikasi BPN' | 'Selesai & Legal' | 'Konstruksi & Selesai' | 'Disepakati Mufakat' | 'Dalam Pemantauan' | string;
  kategori?: string;
  dampak?: string;
  biaya?: number;
  penanggungJawab?: string;
}

// 8. Peta Desa Interaktif (Sebaran RT, Fasilitas Umum, & Titik Rawan Bencana)
export type MapPointCategory = 'rt' | 'fasilitas_pendidikan' | 'fasilitas_energi' | 'perumahan' | 'fasilitas_publik' | 'rawan_bencana' | 'irigasi_sungai';

export interface VillageMapPoint {
  id: string;
  title: string;
  category: MapPointCategory;
  categoryLabel: string;
  rt: string;
  rw: string;
  dusun: string;
  x: number; // percentage coordinate on interactive map (0-100)
  y: number; // percentage coordinate on interactive map (0-100)
  description: string;
  details?: {
    kondisi?: string;
    kapasitas?: string;
    pj?: string;
    kontak?: string;
    mitigasi?: string;
    tingkatRisiko?: 'Rendah' | 'Sedang' | 'Tinggi' | 'Siaga';
  };
  iconType: string;
  color: string;
  sumber: string;
}

export interface VillageHazardZone {
  id: string;
  name: string;
  type: 'Banjir Luapan' | 'Sedimen Talang' | 'Longsor / Erosi' | 'Pohon Tumbang' | 'Limbah';
  level: 'Siaga 1' | 'Siaga 2' | 'Waspada' | 'Aman';
  areaDesc: string;
  mitigasi: string;
  poskoTerdekat: string;
  kontakDarurat: string;
}

