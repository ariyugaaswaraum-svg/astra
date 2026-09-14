import { 
  VillageProfile, 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  CitizenReport, 
  LetterRequest, 
  PreventiveTask, 
  IoTSensorNode, 
  JobVacancy, 
  BumdesProduct,
  GroundedSourceItem
} from '../types';
import { getClosedLoopState, DEMO_SCENARIO_ID, DEMO_ASSET_ID } from './closedLoopStore';

export interface VillageFullState {
  villageProfile: VillageProfile;
  documents: DocumentItem[];
  assets: AssetItem[];
  memories: HumanMemory[];
  reports?: CitizenReport[];
  letters?: LetterRequest[];
  preventiveTasks?: PreventiveTask[];
  ioTSensors?: IoTSensorNode[];
  jobVacancies?: JobVacancy[];
  bumdesProducts?: BumdesProduct[];
}

/**
 * Static & Verified Ground Truth Domain Knowledge of Desa Talangagung
 */
export const TALANGAGUNG_GROUND_TRUTH = {
  profilBPS: {
    jumlahRW: 5,
    jumlahRT: 27,
    sinyalJaringan: "4G / LTE Sangat Kuat di seluruh 5 RW dan 27 RT (100% tercover)",
    koperasiSimpanPinjam: 6,
    kelompokPertokoan: 3,
    pasarPermanen: 1,
    kondisiJalan: "Aspal dan Beton (Dapat dilalui kendaraan roda 4+ lancar sepanjang tahun)",
    totalPenduduk2025: 8522,
    totalPenduduk2023: 8452,
    rincianGender2023: { lakiLaki: 4188, perempuan: 4264 },
    luasWilayahHa: 281.05,
    luasWilayahKm2: 2.8105,
    kepadatanPenduduk: "3.000 - 3.032 jiwa/km²",
    rataRataPerRT: 316,
    lahanProduktif2022: "72 Hektare",
    lahanTidakProduktif2024: "11 Hektare",
    kelompokUmur: {
      usia50_54: 618,
      usia55_59: 624,
      usia60_64: 433,
      usia65Plus: 672
    },
    batasWilayah: {
      utara: "Desa Penarukan dan Desa Sengguruh",
      timur: "Kelurahan Kepanjen dan Kelurahan Ardirejo",
      selatan: "Desa Dilem dan Desa Mangunrejo",
      barat: "Aliran Sungai Metro dan Desa Jatisari"
    },
    toponimiDanIrigasi: {
      asalNama: "Berasal dari keberadaan talang (saluran air) besar yang melintas di atas Sungai Metro pada zaman dahulu.",
      irigasiUtama: "Aliran Sungai Molek dan Sungai Metro"
    },
    pendidikanNyata: {
      sdn1: "SDN 1 Talangagung di Jl. Raya Talangagung No. 332 (Luas 2.760 m², 244 murid, 13 guru)",
      sdn2: "SDN 2 Talangagung di Dusun Rekesan RT 5 / RW 1, Jl. Raya Gunung Kawi No. 462 (Luas 3.744 m²)",
      kbSrikandi: "KB Srikandi di Perumnas II Talangagung RT 22 / RW 5",
      pkbmTunasMandiri: "PKBM Tunas Mandiri di Perum Kepanjen Permai II, Talangagung"
    },
    transportasiTerminal: {
      nama: "Terminal Talangagung (Kepanjen) seluas 30.021 m² milik Dishub/Pemkab Malang",
      transJatim: "Titik origin (awal) Trans Jatim Koridor 2: Rute Terminal Talangagung (Kepanjen) -> Terminal Hamid Rusdi -> Terminal Arjosari (Kota Malang). Target beroperasi Oktober 2026 dengan armada 15 unit bus (14 operasional, 1 cadangan). Akses Trans Jatim pertama di Malang Selatan."
    }
  },

  karnavalBudaya: {
    namaKegiatan: "Karnaval Desa Talangagung Peringatan HUT RI ke-80",
    tanggalPelaksanaan: "Minggu, 31 Agustus 2025",
    jumlahKontingen: "31 Kontingen / Kelompok (mewakili seluruh RT, RW, sanggar seni, dan lembaga desa)",
    partisipasi: "Diikuti ribuan warga masyarakat dan disaksikan oleh seluruh elemen desa",
    tujuan: "Pelestarian budaya nusantara, penguatan identitas bangsa, dan mendorong generasi muda menjaga warisan budaya Indonesia.",
    kriteriaPenilaianJuri: [
      { kriteria: "Kreativitas", bobot: "50%", keterangan: "Kunci utama penilaian juri: inovasi koreografi, keunikan kostum tematik, atraksi orisinal, aransemen musik." },
      { kriteria: "Kesesuaian Tema", bobot: "30%", keterangan: "Penyelarasan pesan penampilan dengan tema kebangsaan HUT RI ke-80 & persatuan." },
      { kriteria: "Kerapian", bobot: "10%", keterangan: "Keteraturan barisan, kekompakan gerak, keseragaman kostum kontingen." },
      { kriteria: "Sportivitas & Hormat pada Acara", bobot: "10%", keterangan: "Kedisiplinan waktu, ketertiban, etika di panggung kehormatan." }
    ],
    sumberRujukan: "Dokumentasi Resmi SudutKota.id (2025) - Juri Karnaval Desa Talangagung Kepanjen Malang: Kreativitas Jadi Kunci Penilaian"
  },

  teachingFactorySMK: {
    namaSekolah: "SMK Muhammadiyah 1 Kepanjen",
    website: "smkmuh1kepanjen.sch.id",
    alamat: "Jl. KH. Ahmad Dahlan No. 34, Kepanjen, Kabupaten Malang",
    delapanKompetensiKeahlian: [
      { kode: "TPM", nama: "Teknik Pemesinan" },
      { kode: "TOI", nama: "Teknik Otomasi Industri" },
      { kode: "TKRO", nama: "Teknik Kendaraan Ringan Otomotif" },
      { kode: "TKJ", nama: "Teknik Komputer dan Jaringan" },
      { kode: "TBSM", nama: "Teknik dan Bisnis Sepeda Motor" },
      { kode: "MM / DKV", nama: "Multimedia / Desain Komunikasi Visual" },
      { kode: "KI", nama: "Kimia Industri" },
      { kode: "TAB", nama: "Teknik Alat Berat" }
    ],
    mitraIndustri: ["Astra", "Denso Manufacturing Indonesia", "Hillcon", "AHM (Astra Honda Motor)"],
    fasilitasUnggulan: ["Laboratorium Safety Riding", "Teaching Factory Learning Model"],
    prestasi2026: ["Sekolah Berprestasi 2026", "Juara Umum LKS Dikmen Kab. Malang 2026", "Juara Nasional Mekatronika Otomasi 2026"],
    empatPeranSiswaTeFa: [
      { peran: "Digitalisasi", tugas: "OCR berkas arsip, ekstraksi metadata, klasifikasi AI regulasi desa, transkrip rekaman lisan sesepuh desa." },
      { peran: "Pemetaan", tugas: "Survei koordinat GPS lapangan, foto multi-sudut aset, cetak & pasang label QR Code aset fisik, plot peta Web-GIS." },
      { peran: "Teknologi", tugas: "Pengembangan web React/Tailwind, REST API backend, rekayasa prompt Gemini AI, integrasi sensor IoT & telemetri." },
      { peran: "Kurasi & Verifikasi", tugas: "Validasi ground truth, pengujian akurasi AI (50 benchmark questions), fact-checking rujukan dokumen, audit data." }
    ],
    modelKolaborasi4Pihak: ["Pemerintah Desa", "SMK TeFa (Siswa & Guru)", "Mitra Industri (DUDI)", "Masyarakat / Warga Desa"]
  },

  smartFeederIoT: {
    namaInovasi: "Smart Feeder & Water Quality Monitor Desa Talangagung",
    kelompokBinaan: "Pokdakan Molek Jaya & Pokmas Anggrungan Talangagung",
    mitraAkademik: "Universitas PGRI Kanjuruhan Malang (Unikama) melalui Program Pengabdian Mahasiswa Berdampak (PM-BEM) 2025 didanai Kemendikti Saintek RI",
    tanggalSerahTerima: "23 November 2025",
    tanggalUjiCobaDanImplementasi: "25 Agustus 2026 (uji coba operasional lapangan)",
    empatFiturUtama: [
      "1. Penjadwalan & Takaran Pakan Otomatis (program gramasi presisi via aplikasi mobile)",
      "2. Sensor Suhu & pH Air Real-Time (pemantauan kontinu pH 6.5-8.5 dan suhu optimal kolam)",
      "3. Kontrol Aerator Jarak Jauh (aktivasi mesin aerator terlarut dari smartphone via LoRa/MQTT)",
      "4. Sumber Daya Mandiri Panel Surya (Solar Cell fotovoltaik 12V-13.4V bebas biaya listrik)"
    ],
    dampakDanManfaat: [
      "Efisiensi Waktu & Tenaga: Mengurangi kunjungan manual ke kolam, pakan terdistribusi merata tanpa membusuk.",
      "Mitigasi Risiko Dini: Sensor pH dan suhu mencegah stres dan kematian massal bibit ikan.",
      "Presisi Keputusan: Dosis pakan dan aerasi diatur berbasis telemetri angka aktual."
    ],
    sumberRujukan: "JatimTimes (25 Agustus 2026) - Smart Feeder Unikama Ubah Pola Budidaya Ikan di Talangagung; TuguMalang.id"
  },

  bumdesKonteksMalang: {
    namaBumdesDesa: "BUMDes Talangagung Makmur",
    totalDesaMemilikiBumdesKabMalang: "378 Desa se-Kabupaten Malang (100% dari 33 kecamatan) telah memiliki BUMDes per Februari 2025",
    totalBumdesBerbadanHukumKabMalang: "159 BUMDes telah mengantongi status Badan Hukum Resmi dari Kementerian Desa PDTT",
    bumdesBerbadanHukumKepanjen: "4 BUMDes di Kecamatan Kepanjen telah berbadan hukum lengkap (termasuk BUMDes Talangagung)",
    produkUnggulanDesa: [
      "Beras Pandan Wangi Organik Kali Metro 5 Kg (Rp 68.000)",
      "Pupuk Kompos Organik Terfermentasi 20 Kg (Rp 25.000)",
      "Keripik Tempe Renyah Dusun Glanggang 250gr (Rp 15.000)",
      "Jasa Teknik Perpipaan & Sambungan PAMSIMAS Sumber Kali Metro"
    ],
    sumberRujukan: "JatimTimes, 21 Februari 2025 - Akhirnya 378 Desa di Kabupaten Malang Miliki BUMDes"
  },

  tpaTalangagung: {
    namaFasilitas: "Tempat Pemrosesan Akhir (TPA) Wisata Edukasi Talangagung & Sanitary Landfill Kepanjen",
    totalLuasKonsolidasiM2: 13393,
    totalLuasKonsolidasiHektar: 1.3393,
    totalLuasKonsolidasiDisplay: "13.393 m² (atau sekitar 1,3393 Hektare / ~1,34 Ha)",
    statusResmi: "Terkonsolidasi & Terverifikasi BPKAD/BPN Pemkab Malang",
    rincianTahapPengadaanLahan: [
      {
        tahap: "Tahap 1 - Pencatatan Lahan Tapak Awal Pemkab (Tahun 2021)",
        luasM2: 1943,
        luasHektar: 0.1943,
        rincianKavling: "3 Bidang Tanah Milik Pemda: Kavling A-554 (554 m²), Kavling B-712 (712 m²), dan Kavling C-677 (677 m²)",
        kodeAset: ["INF-TPA-001", "INF-TPA-002", "INF-TPA-003"],
        dokumenRujukan: "Berita Acara Inventarisasi Aset BPKAD No. 030/1182/35.07.014/2021 & Buku KIB-A Pemkab Malang"
      },
      {
        tahap: "Tahap 2 - Pengadaan Lahan Zona Perluasan (Tahun 2022)",
        luasM2: 11450,
        luasHektar: 1.145,
        rincianKavling: "Kawasan Pengadaan Lahan Baru Zona Sanitary Landfill & Edukasi",
        kodeAset: ["INF-TPA-004"],
        dokumenRujukan: "SK Penetapan Lokasi Pemkab Malang & Akta Pelepasan Hak No. 45/APH/2022"
      }
    ],
    infrastrukturAksesDanPenerangan2025: [
      "Pengadaan Tanah Akses Jalan Masuk: Konsultasi publik pada 26 Februari 2025 dan pengukuran kadastral serta pemasangan patok tanda batas pada 3 bidang tanah terdampak pada 4 Maret 2025 (DOC-TPA-2025)",
      "Penerangan Jalan Akses: Laporan serah terima pemasangan 22 unit lampu PJU LED 40 Watt beserta penambahan KWh meter baru di sepanjang ruas jalan Talangagung menuju TPA pada 28 Oktober 2025 (DOC-PJU-2025)"
    ],
    pemanfaatanDanCakupanLayanan: {
      energiGasMetana: "Penyaluran gas biometana gratis hasil sanitary landfill ke 250+ hingga 300 kepala keluarga di Dusun Jatisari dan Dusun Krajan.",
      pengolahanLindi: "Kolam filtrasi IPAL Lindi berbasis fitoremediasi tanaman air menjaga baku mutu air buangan ke aliran Kali Metro.",
      eduTourDanTefa: "Pusat wisata edukasi pengolahan sampah mandiri energi (PLTS 5 kWp) melayani 4.500+ kunjungan pelajar/mahasiswa per tahun berkolaborasi dengan SMK TeFa.",
      inovasiRDFDanB3Medis: "Fasilitas Refuse Derived Fuel (RDF) hasil MOU Pemkab Malang bersama PT Semen Indonesia disaksikan KPK, serta fasilitas pengolahan limbah medis B3 rumah sakit.",
      evaluasiMenteriLH: "Dinyatakan sebagai salah satu TPA terbaik di Indonesia oleh Menteri Lingkungan Hidup RI Dr. Hanif Faisol Nurofiq (bebas bau menyengat, air lindi standar, pemanfaatan metana terbukti)."
    },
    sumberRujukanResmi: "Buku Inventarisasi Aset & Rekapitulasi Historis Pengadaan Lahan TPA Talangagung (2021–2025), BPKAD & DLH Kab. Malang"
  }
};

/**
 * Builds the centralized, comprehensive System Context object for Gemini AI.
 * This aggregates master state from App.tsx along with rich ground truth facts.
 */
export function buildCentralizedSystemContext(state: VillageFullState) {
  const {
    villageProfile,
    documents = [],
    assets = [],
    memories = [],
    reports = [],
    letters = [],
    preventiveTasks = [],
    ioTSensors = [],
    jobVacancies = [],
    bumdesProducts = []
  } = state;

  return {
    identity: {
      appName: "Desa Black Box AI",
      villageName: villageProfile.name || "Talangagung",
      subdistrict: villageProfile.subdistrict || "Kepanjen",
      regency: villageProfile.regency || "Kabupaten Malang",
      province: villageProfile.province || "Jawa Timur",
      kadesName: villageProfile.kadesName || "Drs. H. Bambang Susanto",
      secretaryName: villageProfile.secretaryName || "Ahmad Fauzi, S.AP"
    },

    groundTruthData: TALANGAGUNG_GROUND_TRUTH,

    villageProfileState: {
      ...villageProfile,
      totalRw: 5,
      totalRt: 27,
      bpsIndicators: TALANGAGUNG_GROUND_TRUTH.profilBPS
    },

    liveDocuments: documents.map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      year: d.year,
      summary: d.summary,
      keyEntities: d.keyEntities,
      tags: d.tags
    })),

    liveAssets: assets.map(a => ({
      id: a.id,
      code: a.code,
      name: a.name,
      category: a.category,
      dusun: a.dusun,
      condition: a.condition,
      estimatedValue: a.estimatedValue,
      assignedManager: a.assignedManager
    })),

    liveMemories: memories.map(m => ({
      id: m.id,
      interviewee: m.interviewee,
      role: m.role,
      storyTitle: m.storyTitle,
      storyText: m.storyText,
      extractedKnowledge: m.extractedKnowledge
    })),

    liveCitizenReports: reports.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      dusun: r.dusun,
      rtRw: r.rtRw,
      status: r.status,
      urgency: r.urgency,
      reporterName: r.reporterName
    })),

    liveLetterRequests: letters.map(l => ({
      id: l.id,
      letterType: l.letterType,
      applicantName: l.applicantName,
      purpose: l.purpose,
      status: l.status,
      rtRw: l.rtRw
    })),

    livePreventiveTasks: preventiveTasks.map(t => ({
      id: t.id,
      title: t.taskTitle,
      assetName: t.assetName,
      status: t.status,
      intervalType: t.intervalType,
      assignedPic: t.assignedTechnician
    })),

    liveIoTSensors: ioTSensors.map(s => ({
      id: s.id,
      nodeName: s.name,
      assetName: s.assetName,
      type: s.type,
      location: `${s.dusun} (${s.rtRw})`,
      currentValue: s.currentValue,
      unit: s.unit,
      status: s.status
    })),

    liveJobVacancies: jobVacancies.map(j => ({
      id: j.id,
      title: j.title,
      company: j.company,
      salaryRange: j.salaryRange,
      industryType: j.industryType,
      employmentType: j.employmentType,
      isTefaCollaboration: j.employmentType === 'Magang SMK' || j.title.toLowerCase().includes('smk')
    })),

    liveBumdesProducts: bumdesProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit,
      producer: p.producer,
      stock: p.stock
    })),

    closedKnowledgeLoopDemo: {
      scenarioId: DEMO_SCENARIO_ID,
      assetId: DEMO_ASSET_ID,
      status: getClosedLoopState().status,
      currentStepIndex: getClosedLoopState().currentStepIndex,
      reportData: getClosedLoopState().report,
      validation: getClosedLoopState().validation,
      kadesDecision: getClosedLoopState().decision,
      action: getClosedLoopState().action,
      memoryRecord: getClosedLoopState().memoryRecord,
      auditTrailCount: getClosedLoopState().auditTrail.length
    },

    // Strict separation: FACTUAL_CONTEXT (Data A) vs SIMULATION_CONTEXT (Data B)
    FACTUAL_CONTEXT: {
      domainGroundTruth: TALANGAGUNG_GROUND_TRUTH,
      officialProfile: {
        namaDesa: villageProfile.namaDesa || villageProfile.name,
        kecamatan: villageProfile.kecamatan || villageProfile.subdistrict,
        kabupaten: villageProfile.kabupaten || villageProfile.regency,
        provinsi: villageProfile.provinsi || villageProfile.province,
        kepalaDesa: villageProfile.kepalaDesa || villageProfile.kadesName,
        sekretarisDesa: villageProfile.sekretarisDesa || villageProfile.secretaryName,
        alamatKantor: villageProfile.alamatKantor || "Jl. Raya Talangagung No. 01, Kepanjen, Malang",
        telepon: villageProfile.telepon || "(0341) 395123",
        email: villageProfile.email || "pemdes@talangagung.desa.id",
        website: villageProfile.website || "https://talangagung.desa.id",
        visi: villageProfile.visi || "Mewujudkan Desa Talangagung yang Mandiri, Sejahtera, dan Berkelanjutan Berbasis Teknologi & Lingkungan",
        misi: villageProfile.misi || "Penguatan tata kelola pemerintahan desa akuntabel, pemanfaatan energi terbarukan biometana TPA, penguatan ketahanan pangan perikanan air tawar Molek Jaya, dan digitalisasi layanan publik inklusif."
      },
      verifiedDocuments: documents.filter(d => !d.id?.includes('DEMO')),
      authenticAssets: assets.filter(a => !a.isSimulation && a.dataClassification !== 'PROTOTYPE_SIMULATION'),
      collectiveMemories: memories.filter(m => !m.id?.includes('DEMO')),
      activeCitizenReports: (reports || []).filter(r => !r.id?.includes('DEMO')),
      letterRequests: letters || [],
      preventiveTasks: preventiveTasks || [],
      ioTSensors: ioTSensors || [],
      jobVacancies: jobVacancies || [],
      bumdesProducts: bumdesProducts || []
    },

    SIMULATION_CONTEXT: {
      activeDemoScenario: {
        scenarioId: DEMO_SCENARIO_ID,
        scenarioName: "Lampu PJU Titik 04 RT 02/RW 01 — Skenario Simulasi Closed Knowledge Loop",
        dataClassification: "PROTOTYPE_SIMULATION",
        disclaimer: "Berikut adalah hasil skenario simulasi prototipe, bukan catatan kejadian atau dokumen resmi Pemerintah Desa.",
        status: getClosedLoopState().status,
        currentStepIndex: getClosedLoopState().currentStepIndex,
        reportRecord: getClosedLoopState().report,
        validationRecord: getClosedLoopState().validation,
        analysisRecord: getClosedLoopState().analysis,
        decisionRecord: getClosedLoopState().decision,
        actionRecord: getClosedLoopState().action,
        knowledgeRecord: getClosedLoopState().knowledge,
        memoryRecord: getClosedLoopState().memoryRecord,
        auditTrailCount: getClosedLoopState().auditTrail.length,
        auditTrail: getClosedLoopState().auditTrail
      },
      simulatedAssets: assets.filter(a => a.isSimulation || a.dataClassification === 'PROTOTYPE_SIMULATION')
    }
  };
}

/**
 * Helper to split a user query into distinct sub-queries if it contains compound markers / conjunctions.
 * Example: "Berapa luas TPA Talangagung dan bagaimana cakupan layanannya?" -> ["Berapa luas TPA Talangagung", "bagaimana cakupan layanannya"]
 */
export function splitCompoundQuery(text: string): string[] {
  if (!text || !text.trim()) return [];
  const clean = text.trim();

  // Delimiters for compound questions:
  // 1. Conjunctions: "dan", "serta", "serta juga", "sekaligus", "selain itu", "lalu", "kemudian", "maupun", "sedangkan"
  // 2. Punctuation: '?', ';', '\n'
  // 3. Question markers preceded by comma/space: e.g. ", bagaimana...", ", berapa...", ", apa..."
  const rawParts = clean
    .split(/(?:\b(?:dan|serta|serta\s+juga|sekaligus|selain\s+itu|lalu|kemudian|maupun|sedangkan)\b|[;\?\n]+|,\s*(?=(?:bagaimana|berapa|apa|kapan|dimana|di\s*mana|siapa|kenapa|mengapa|apakah)\b))/i)
    .map(p => p.trim())
    .filter(p => p.length >= 3);

  if (rawParts.length <= 1) {
    return [clean];
  }
  return rawParts;
}

/**
 * Returns authentic, highly accurate Grounded Source Items for any given text / query.
 * Evaluates the current turn's query and answer independently using strict whole-word regexes.
 * Features:
 * 1. Compound Query Splitting: Splits multi-topic questions into independent sub-queries,
 *    evaluates factual sources for EACH sub-topic independently, and consolidates the results without duplicates.
 * 2. Strict Word-Boundary Matching: Prevents false substring matches (e.g. 'ikan' in 'pendidikan').
 * 3. Dedicated TPA Consolidated Area: Includes the verified 13.393 m² (1,34 Ha) consolidated TPA land source.
 * 4. Zero Bleed-Over & Dynamic Output: Only returns authentic documents strictly relevant to the current turn.
 */
export function getAuthenticSourcesForContent(queryOrText: string, answerText = ''): GroundedSourceItem[] {
  const qText = (queryOrText || '').toLowerCase();
  const aText = (answerText || '').toLowerCase();
  const fullText = `${qText} ${aText}`;

  // If both query and answer are blank, return empty array
  if (!fullText.trim()) {
    return [];
  }

  // Check if query is about the prototype simulation scenario (AST-DEMO-PJU-RT02-004, RPT-DEMO-PJU-001, Closed Knowledge Loop demo)
  const isSimulationQuery = /\b(closed\s*(?:knowledge\s*)?loop|ast-demo-pju|rpt-demo-pju|pju\s*titik\s*(?:#?0?4|4)|pju\s*rt\s*0?2|aset\s*simulasi|demo-closed-loop)\b/i.test(fullText) ||
    (/\blampu\s*(?:pju|jalan)\b/i.test(fullText) && (/\brt\s*0?2\b/i.test(fullText) || /\btitik\s*(?:04|4)\b/i.test(fullText))) ||
    (/\blampu\b/i.test(fullText) && /\btitik\s*0?4\b/i.test(fullText));

  if (isSimulationQuery) {
    const clState = getClosedLoopState();
    const isCompleted = clState.status === 'RECORDED_IN_MEMORY';

    return [{
      id: 'SIM-REC-PJU-RT02-004',
      documentName: 'Record Internal Simulasi Lampu PJU Titik 04 RT 02',
      sourceDate: '02 September 2026',
      category: 'Simulasi Prototipe',
      validationStatus: 'SIMULATION_ONLY',
      confidenceScore: 100,
      sourceType: 'INTERNAL_SIMULATION_RECORD',
      dataClassification: 'PROTOTYPE_SIMULATION',
      isSimulation: true,
      validityStatus: 'SIMULATION_ONLY',
      badgeLabel: 'DATA B — SIMULASI PROTOTIPE',
      excerpt: isCompleted
        ? `[DATA B — SIMULASI PROTOTIPE] Skenario Closed Knowledge Loop Lampu PJU Titik 04 RT 02 (${clState.report.id} / ${clState.asset.id}) berstatus SELESAI (RECORDED_IN_MEMORY). Validasi RT: Contoh pemeriksaan fisik simulasi terkonfirmasi. Keputusan Kades: Keputusan Simulasi disetujui untuk demonstrasi. Tindakan: Penggantian suku cadang simulasi oleh Pelaksana Simulasi (Contoh biaya simulasi: Rp 150.000). Hasil: Contoh hasil pemeriksaan simulasi normal. SIM-REC-PJU-RT02-004 terekam permanen di Memori Kolektif Desa (Data B — Simulasi Prototipe).`
        : `[DATA B — SIMULASI PROTOTIPE] Skenario Closed Knowledge Loop Lampu PJU Titik 04 RT 02 (${clState.report.id} / ${clState.asset.id}) sedang berlangsung pada status [${clState.status}] (Tahap ${clState.currentStepIndex + 1}/8: ${clState.report.status}). Proses penanganan belum selesai dilaksanakan.`
    }];
  }

  // Split query into sub-queries to handle compound questions
  const subQueries = splitCompoundQuery(qText);

  // Topic definition structure
  interface TopicDefinition {
    id: string;
    regexes: RegExp[];
    source: GroundedSourceItem;
  }

  const topicDefinitions: TopicDefinition[] = [
    // 1. TPA Talangagung (Konsolidasi Luas 13.393 m² / 1,34 Ha, Pengadaan 2021-2025, Sanitary Landfill & Biometana)
    {
      id: 'tpa-talangagung',
      regexes: [
        /\btpa\b/i,
        /\btpa\s*talangagung\b/i,
        /\bsanitary\s*landfill\b/i,
        /\b13\.?393\b/i,
        /\b11\.?450\b/i,
        /\b1\.?943\b/i,
        /\b(?:luas|lahan|pengadaan|hektar|hektare)\s*(?:tpa|tanah\s*tpa|kawasan\s*tpa)\b/i,
        /\b(?:tpa|tanah\s*tpa|kawasan\s*tpa)\s*(?:luas|lahan|pengadaan|hektar|hektare)\b/i,
        /\bgas\s*metana\b/i,
        /\blindi\b/i,
        /\bipal\s*lindi\b/i,
        /\bpatok\s*tpa\b/i,
        /\bakses\s*tpa\b/i,
        /\brdf\b/i,
        /\blimbah\s*(?:medis|b3)\b/i,
        /\bsemen\s*indonesia\b/i,
        /\bhanif\s*faisol\b/i
      ],
      source: {
        documentName: 'Buku Inventarisasi Aset & Rekapitulasi Historis Pengadaan Lahan TPA Talangagung (2021–2025)',
        sourceDate: '28 Oktober 2025',
        category: 'Inventaris Fisik & IoT',
        validationStatus: 'Terverifikasi',
        confidenceScore: 99,
        excerpt: 'Total Luas Lahan Terkonsolidasi TPA Talangagung saat ini: 13.393 m² (1,3393 Ha / ~1,34 Ha). Terdiri dari 2 tahap pengadaan: Lahan Tapak Awal 2021 seluas 1.943 m² (3 bidang tanah: 554 m², 712 m², 677 m²; Aset INF-TPA-001 s/d 003) dan Zona Perluasan 2022 seluas 11.450 m² (Aset INF-TPA-004), serta koridor akses jalan 3 bidang tanah dan 22 titik PJU LED 40W (2025). Penyaluran gas biometana gratis ke 250+ KK.'
      }
    },

    // 2. Smart Feeder & Kualitas Air IoT Pokdakan Molek Jaya
    {
      id: 'smart-feeder',
      regexes: [
        /\bsmart\s*feeder\b/i,
        /\bfeeder\b/i,
        /\bpokdakan\b/i,
        /\bmolek\s*jaya\b/i,
        /\bunikama\b/i,
        /\bkanjuruhan\b/i,
        /\bpm-bem\b/i,
        /\baerator\b/i,
        /\bkolam\s*(?:ikan|budidaya)\b/i,
        /\bpakan\s*(?:ikan|otomatis|presisi|kolam)\b/i,
        /\b(?:sensor\s*)?ph\s*air\b/i,
        /\b(?:sensor\s*)?suhu\s*air\b/i,
        /\bsolar\s*cell\b/i,
        /\bpanel\s*surya\b/i,
        /\bpemberi\s*pakan\b/i,
        /\btakaran\s*pakan\b/i
      ],
      source: {
        documentName: 'Publikasi Riset & Berita Resmi: Smart Feeder & Kualitas Air Unikama di Pokdakan Molek Jaya Talangagung',
        sourceDate: '25 Agustus 2026',
        category: 'Inventaris Fisik & IoT',
        validationStatus: 'Terverifikasi',
        confidenceScore: 99,
        excerpt: 'Program PM-BEM 2025 Kemendikti Saintek RI: Smart Feeder pakan otomatis, sensor pH & suhu real-time, kontrol aerator LoRa, dan panel surya mandiri 12V di Pokdakan Molek Jaya Talangagung. Serah terima 23 Nov 2025, Uji coba 25 Ags 2026.'
      }
    },

    // 3. Karnaval Desa Talangagung & HUT RI ke-80
    {
      id: 'karnaval',
      regexes: [
        /\bkarnaval\b/i,
        /\bkontingen\b/i,
        /\bpawai\b/i,
        /\bsudutkota\b/i,
        /\bhut\s*ri\s*(?:ke-?|\s*)80\b/i,
        /\b31\s*agustus\s*2025\b/i,
        /\b31\s*kontingen\b/i,
        /\bjuri\s*karnaval\b/i,
        /\bkriteria\s*penilaian\b/i,
        /\bkreativitas\s*(?:50%|jadi\s*kunci|juri)\b/i
      ],
      source: {
        documentName: 'Dokumentasi & Berita Resmi: Karnaval Desa Talangagung Peringatan HUT RI ke-80 (SudutKota.id)',
        sourceDate: '31 Agustus 2025',
        category: 'Memori Kolektif Tokoh',
        validationStatus: 'Terverifikasi',
        confidenceScore: 99,
        excerpt: 'Peringatan akbar HUT RI ke-80 pada 31 Agustus 2025 diikuti 31 kontingen warga se-desa. Kriteria penilaian juri: Kreativitas (50%), Kesesuaian Tema (30%), Kerapian (10%), Sportivitas & Hormat pada Acara (10%).'
      }
    },

    // 4. Teaching Factory & SMK Muhammadiyah 1 Kepanjen
    {
      id: 'tefa-smk',
      regexes: [
        /\bteaching\s*factory\b/i,
        /\btefa\b/i,
        /\bsmk\b/i,
        /\bmuhammadiyah\b/i,
        /\bsmkmuh1kepanjen\b/i,
        /\bvokasi\b/i,
        /\b8\s*kompetensi\b/i,
        /\bkompetensi\s*keahlian\b/i,
        /\bteknik\s*pemesinan\b/i,
        /\bteknik\s*otomasi\b/i,
        /\bastra\s*(?:honda|motor)?\b/i,
        /\bdenso\b/i,
        /\bhillcon\b/i,
        /\bmagang\s*smk\b/i,
        /\bperan\s*siswa\b/i
      ],
      source: {
        documentName: 'Profil Kemitraan Vokasi & Dokumen Kerjasama: SMK Muhammadiyah 1 Kepanjen (smkmuh1kepanjen.sch.id)',
        sourceDate: '15 Januari 2026',
        category: 'Regulasi Desa',
        validationStatus: 'Terverifikasi',
        confidenceScore: 99,
        excerpt: 'Kemitraan resmi SMK Muhammadiyah 1 Kepanjen: 8 Kompetensi Keahlian (TPM, TOI, TKRO, TKJ, TBSM, DKV, KI, TAB), Mitra Industri (Astra, Denso, Hillcon, AHM), dan 4 Peran Siswa TeFa Desa Black Box.'
      }
    },

    // 5. BUMDes Kabupaten Malang & BUMDes Talangagung
    {
      id: 'bumdes',
      regexes: [
        /\bbumdes\b/i,
        /\b378\s*desa\b/i,
        /\b159\s*bumdes\b/i,
        /\bbadan\s*hukum\s*(?:resmi|kemendes|bumdes)\b/i,
        /\bberas\s*pandan\s*wangi\b/i,
        /\bpupuk\s*kompos\b/i,
        /\bkeripik\s*tempe\b/i
      ],
      source: {
        documentName: 'Publikasi JatimTimes & Data Legalitas Kemendes PDTT: Statistik BUMDes Kabupaten Malang',
        sourceDate: '21 Februari 2025',
        category: 'Regulasi Desa',
        validationStatus: 'Terverifikasi',
        confidenceScore: 98,
        excerpt: 'Data resmi per Februari 2025: 378 Desa di Kabupaten Malang (100% dari 33 kecamatan) telah memiliki BUMDes, 159 BUMDes telah berbadan hukum resmi Kemendes PDTT, dan 4 BUMDes di Kecamatan Kepanjen telah berbadan hukum lengkap.'
      }
    },

    // 6. Trans Jatim & Terminal Talangagung
    {
      id: 'trans-jatim',
      regexes: [
        /\btrans\s*jatim\b/i,
        /\bkoridor\s*2\b/i,
        /\bterminal\s*talangagung\b/i,
        /\bterminal\s*arjosari\b/i,
        /\bterminal\s*hamid\s*rusdi\b/i,
        /\b15\s*armada\s*bus\b/i
      ],
      source: {
        documentName: 'Dokumen Dinas Perhubungan Jatim & Berita Resmi: Rute Trans Jatim Koridor 2 Terminal Talangagung (Juni 2026)',
        sourceDate: '14 Juni 2026',
        category: 'Inventaris Fisik & IoT',
        validationStatus: 'Terverifikasi',
        confidenceScore: 98,
        excerpt: 'Terminal Talangagung Kepanjen (30.021 m²) menjadi titik origin Trans Jatim Koridor 2 menuju Terminal Arjosari via Hamid Rusdi dengan 15 armada bus, mulai beroperasi Oktober 2026.'
      }
    },

    // 7. APBDes & Anggaran TA 2026
    {
      id: 'apbdes',
      regexes: [
        /\bapbdes\b/i,
        /\banggaran\s*desa\b/i,
        /\bdana\s*desa\b/i,
        /\brkpdes\b/i,
        /\brpjmdes\b/i,
        /\bsilpa\b/i,
        /\b1[,.]85\s*miliar\b/i,
        /\b832[,.]5\s*juta\b/i,
        /\b462[,.]5\s*juta\b/i
      ],
      source: {
        documentName: 'Peraturan Desa Talangagung No. 04/2024 tentang APBDes T.A. 2026 (DOC-2026-001)',
        sourceDate: '12 Januari 2025',
        category: 'APBDes & Anggaran',
        validationStatus: 'Terverifikasi',
        confidenceScore: 98,
        excerpt: 'Total APBDes TA 2026 Rp 1,85 Miliar: Pembangunan Fisik & Jalan Tani 45% (Rp 832,5 Juta), Pemberdayaan Warga & BUMDes 25% (Rp 462,5 Juta), Pemerintahan 20% (Rp 370 Juta), Posyandu 10% (Rp 185 Juta).'
      }
    },

    // 8. Standar Administrasi Surat Pengantar & SKU
    {
      id: 'surat',
      regexes: [
        /\bsku\b/i,
        /\bsurat\s*keterangan\s*usaha\b/i,
        /\bsurat\s*pengantar\b/i,
        /\bsktm\b/i,
        /\bstempel\s*qr\b/i,
        /\bpengajuan\s*surat\b/i,
        /\blayanan\s*surat\b/i
      ],
      source: {
        documentName: 'SOP Standar Pelayanan Administrasi Surat Digital Desa & Pengantar RT Berstempel QR Code',
        sourceDate: '20 Agustus 2024',
        category: 'Standar Pelayanan Publik',
        validationStatus: 'Terverifikasi',
        confidenceScore: 99,
        excerpt: 'Buku Pedoman Pelayanan Surat Pengantar RT/RW dan SKU Digital Berstempel QR Code Resmi RT 01 s/d RT 27.'
      }
    },

    // 9. Infrastruktur Fisik & Smart Asset
    {
      id: 'infra',
      regexes: [
        /\bjalan\s*poros\b/i,
        /\bjalan\s*rusak\b/i,
        /\bjalan\s*tani\b/i,
        /\bjembatan\s*kali\s*metro\b/i,
        /\bpju\b/i,
        /\blampu\s*jalan\b/i,
        /\biplt\b/i,
        /\bu-ditch\b/i,
        /\bsaluran\s*drainase\b/i,
        /\bgorong-gorong\b/i
      ],
      source: {
        documentName: 'Buku Induk Inventaris Sarana Fisik, Smart Asset & Dokumen RKPD Sanitasi Pemkab Malang',
        sourceDate: '15 September 2025',
        category: 'Inventaris Fisik & IoT',
        validationStatus: 'Diperbarui',
        confidenceScore: 96,
        excerpt: 'Data 50 Smart Asset: Jembatan Kali Metro Krajan-Jatisari (Kondisi Baik), 22 Titik PJU LED 40W, IPLT Talangagung, dan Rekomendasi U-Ditch 80cm RT 05 Glanggang.'
      }
    },

    // 10. Memori Kolektif Sesepuh & Sejarah Desa
    {
      id: 'memori',
      regexes: [
        /\bmbah\s*sastro\b/i,
        /\bhj\.?\s*maryam\b/i,
        /\bwakaf\s*tanah\b/i,
        /\bposyandu\s*melati\b/i,
        /\bsesepuh\s*desa\b/i,
        /\bsejarah\s*desa\b/i,
        /\bmemori\s*lisan\b/i,
        /\bpamsimas\s*2020\b/i
      ],
      source: {
        documentName: 'Transkrip Wawancara Lisan Sesepuh & Buku Linimasa Sejarah Desa Talangagung (MEM-001 & MEM-002)',
        sourceDate: '10 Oktober 2024',
        category: 'Memori Kolektif Tokoh',
        validationStatus: 'Terverifikasi',
        confidenceScore: 97,
        excerpt: 'Rekaman memori Mbah Sastro Utomo (saluran drainase RT 05 Glanggang), Ibu Hj. Maryam (wakaf tanah Posyandu Melati 2008), dan PAMSIMAS 2020.'
      }
    },

    // 11. Fasilitas Pendidikan Formal (SDN 1, SDN 2, KB Srikandi, PKBM)
    {
      id: 'pendidikan',
      regexes: [
        /\bsdn\s*1\b/i,
        /\bsdn\s*2\b/i,
        /\bkb\s*srikandi\b/i,
        /\bpkbm\b/i,
        /\bdapodik\b/i
      ],
      source: {
        documentName: 'Data Pokok Pendidikan (Dapodik) Kemendikdasmen RI Wilayah Desa Talangagung',
        sourceDate: '08 Januari 2025',
        category: 'Standar Pelayanan Publik',
        validationStatus: 'Terverifikasi',
        confidenceScore: 98,
        excerpt: 'SDN 1 Talangagung (2.760 m², 244 siswa, 13 guru); SDN 2 Talangagung di Dusun Rekesan (3.744 m²); KB Srikandi Perumnas II; PKBM Tunas Mandiri.'
      }
    },

    // 12. Profil BPS & Wilayah Demografi
    {
      id: 'bps-profile',
      regexes: [
        /\bbps\b/i,
        /\b5\s*rw\b/i,
        /\b27\s*rt\b/i,
        /\b(?:rukun\s*tetangga|rukun\s*warga)\b/i,
        /\bsinyal\s*4g\b/i,
        /\b4g\s*\/?\s*lte\b/i,
        /\b8\.?522\s*jiwa\b/i,
        /\b281[,.]05\s*(?:ha|hektare)\b/i,
        /\bkoperasi\s*simpan\s*pinjam\b/i,
        /\bksp\b/i,
        /\btoponimi\b/i,
        /\brdtr\b/i,
        /\bmonografi\b/i,
        /\bbatas\s*wilayah\b/i,
        /\bjumlah\s*penduduk\b/i,
        /\bcakupan\s*layanan\b/i
      ],
      source: {
        documentName: 'Publikasi BPS Kecamatan Kepanjen Dalam Angka 2025 & RDTR Perkotaan Kepanjen 2024–2044',
        sourceDate: '10 Februari 2025',
        category: 'Kependudukan & Wilayah',
        validationStatus: 'Terverifikasi',
        confidenceScore: 99,
        excerpt: 'Profil resmi Desa Talangagung: 5 RW, 27 RT, sinyal 4G/LTE 100%, 6 KSP, 3 pertokoan, 1 pasar permanen, jalan aspal/beton lancar, 8.522 jiwa, luas 281,05 Ha, batas 4 arah mata angin, Sungai Metro & Molek.'
      }
    }
  ];

  // Map to collect scores per topic across all sub-queries and answer text
  const topicScoreMap = new Map<string, { topic: TopicDefinition; score: number; matchedSubQueries: number }>();

  topicDefinitions.forEach(topic => {
    topicScoreMap.set(topic.id, { topic, score: 0, matchedSubQueries: 0 });
  });

  // Evaluate each sub-query independently (Multi-topic breakdown)
  subQueries.forEach(subQ => {
    topicDefinitions.forEach(topic => {
      const matchInSubQ = topic.regexes.some(r => r.test(subQ));
      if (matchInSubQ) {
        const item = topicScoreMap.get(topic.id)!;
        item.score += 15;
        item.matchedSubQueries += 1;
      }
    });
  });

  // Evaluate the entire query string
  topicDefinitions.forEach(topic => {
    const matchInFullQ = topic.regexes.some(r => r.test(qText));
    if (matchInFullQ) {
      const item = topicScoreMap.get(topic.id)!;
      item.score += 10;
    }
  });

  // Evaluate the answer text
  topicDefinitions.forEach(topic => {
    const matchInAns = topic.regexes.some(r => r.test(aText));
    if (matchInAns) {
      const item = topicScoreMap.get(topic.id)!;
      item.score += 5;
    }
  });

  // Filter candidates with positive match score
  const matchedCandidates = Array.from(topicScoreMap.values())
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matchedCandidates.length > 0) {
    const topScore = matchedCandidates[0].score;
    // If we have multi-topic subqueries, include every candidate that matched a subquery directly (score >= 15)
    // or has a strong overall score (score >= 10)
    const filtered = matchedCandidates.filter(c => {
      if (subQueries.length > 1) {
        return c.matchedSubQueries > 0 || c.score >= 10;
      }
      if (topScore >= 15) {
        return c.score >= 15;
      }
      if (topScore >= 10) {
        return c.score >= 10;
      }
      return c.score >= 5;
    });

    // Deduplicate by documentName
    const seenDocs = new Set<string>();
    const resultSources: GroundedSourceItem[] = [];

    (filtered.length > 0 ? filtered : [matchedCandidates[0]]).forEach(c => {
      if (!seenDocs.has(c.topic.source.documentName)) {
        seenDocs.add(c.topic.source.documentName);
        resultSources.push(c.topic.source);
      }
    });

    return resultSources;
  }

  // Fallback: If no verified source matched, return empty list (never fabricate placeholder/dummy cards)
  return [];
}
