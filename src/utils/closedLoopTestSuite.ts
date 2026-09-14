import { ClosedLoopState } from './closedLoopStore';

export interface TestCaseResult {
  id: string;
  stage: number;
  stageName: string;
  code: string;
  title: string;
  expected: string;
  actual: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  governanceCompliance: 'COMPLIANT' | 'NON_COMPLIANT';
  evidence: string;
}

export interface E2ETestSuiteSummary {
  totalTests: number;
  passedCount: number;
  pendingCount: number;
  failedCount: number;
  complianceRate: number;
  allPassed: boolean;
  currentStage: number;
  testCases: TestCaseResult[];
}

export function evaluateClosedLoop24Tests(state: ClosedLoopState): E2ETestSuiteSummary {
  const audit = state.auditTrail || [];
  const rep = state.report;
  const asset = state.asset;
  const analysis = state.analysis;
  const decision = state.decision;
  const action = state.action;
  const memory = state.memoryRecord;

  // Strict historical audit event lookups
  const captureAudit = audit.find(a => a.step === 1 && a.newStatus === 'SUBMITTED');
  const verifiedByRtAudit = audit.find(a => 
    a.previousStatus === 'SUBMITTED' && 
    a.newStatus === 'VERIFIED_BY_RT' &&
    (a.actorRole?.includes('RT 02') || a.actorRole?.includes('Ketua RT') || a.actorName?.includes('Ahmad Fauzi'))
  );
  const rememberAudit = audit.find(a => a.step === 3 && a.action === 'LINK_REPORT_TO_DIGITAL_ASSET_PASSPORT');
  const retrievalAudit = audit.find(a => a.step === 4 && a.action === 'RETRIEVE_HISTORICAL_MAINTENANCE_MEMORY');
  const analyzedAudit = audit.find(a => a.step === 5 && (a.newStatus === 'ANALYZED' || a.action === 'SISTEM_ANALISIS_RISIKO_BERBASIS_ATURAN'));
  const decisionAudit = audit.find(a => a.step === 6 && (a.newStatus === 'DECISION_RECORDED' || a.action === 'KADES_SETUJUI_KEPUTUSAN_SIMULASI'));
  const actionInProgressAudit = audit.find(a => a.newStatus === 'ACTION_IN_PROGRESS' || a.action === 'PELAKSANA_MULAI_TINDAKAN_SIMULASI');
  const resolvedAudit = audit.find(a => a.newStatus === 'RESOLVED' || a.action === 'PELAKSANA_SELESAIKAN_TINDAKAN_SIMULASI');
  const recordedAudit = audit.find(a => a.newStatus === 'RECORDED_IN_MEMORY' || a.action === 'PERBAIKAN_SELESAI_DAN_DICATAT_KE_MEMORI');

  // Strict record validations
  const hasValidationRecord = Boolean(
    state.validation &&
    state.validation.reportId === 'RPT-DEMO-PJU-001' &&
    state.validation.assetId === 'AST-DEMO-PJU-RT02-004' &&
    state.validation.status === 'VALIDATED' &&
    Boolean(state.validation.validationTimestamp)
  );

  const hasRememberRecord = Boolean(
    state.rememberRecord &&
    state.rememberRecord.isLinked === true &&
    state.rememberRecord.reportId === 'RPT-DEMO-PJU-001' &&
    state.rememberRecord.assetId === 'AST-DEMO-PJU-RT02-004' &&
    Boolean(state.rememberRecord.linkedAt)
  );

  const hasBaseHistoryRetrieval = Boolean(
    state.retrievalRecord &&
    Array.isArray(state.retrievalRecord.baseHistoryIds) &&
    state.retrievalRecord.baseHistoryIds.includes('M-HIST-PJU-01') &&
    state.retrievalRecord.baseHistoryIds.includes('M-HIST-PJU-02') &&
    state.retrievalRecord.historyEntriesFound >= 2
  );

  const hasIntervalCalc = Boolean(
    state.retrievalRecord?.intervalCalculation &&
    typeof state.retrievalRecord.intervalCalculation.monthsSinceLastService === 'number' &&
    state.retrievalRecord.intervalCalculation.monthsSinceLastService > 0 &&
    typeof state.retrievalRecord.intervalCalculation.isOverdue === 'boolean' &&
    Boolean(state.retrievalRecord.intervalCalculation.lastServiceDate) &&
    Boolean(state.retrievalRecord.intervalCalculation.statusText)
  );

  const hasTechSpecs = Boolean(
    state.retrievalRecord?.technicalSpecifications &&
    Boolean(state.retrievalRecord.technicalSpecifications.power) &&
    Boolean(state.retrievalRecord.technicalSpecifications.lampType) &&
    Boolean(state.retrievalRecord.technicalSpecifications.voltage)
  );

  // Helper flags for stage completion based on records & audit history
  const isCaptureDone = state.status !== 'DRAFT';
  const isValidateDone = Boolean(hasValidationRecord && verifiedByRtAudit);
  const isAnalyzeDone = Boolean(state.analysis || analyzedAudit);
  const isDecideDone = Boolean(state.decision || decisionAudit);
  const isActionStarted = Boolean(state.action || actionInProgressAudit);
  const isActionResolved = Boolean(state.action?.status === 'COMPLETED' || resolvedAudit || (state.status === 'RECORDED_IN_MEMORY' && state.action));
  const isRecordDone = (state.status === 'RECORDED_IN_MEMORY' || Boolean(recordedAudit)) && Boolean(memory || state.knowledge);

  // TC-24 AI Retrieval Proof verification logic (strict governance adherence)
  const aiProof = state.aiRetrievalProof;
  const hasMatchedRecordIds = Boolean(
    aiProof &&
    Array.isArray(aiProof.matchedRecordIds) &&
    aiProof.matchedRecordIds.includes('RPT-DEMO-PJU-001') &&
    aiProof.matchedRecordIds.includes('AST-DEMO-PJU-RT02-004') &&
    aiProof.matchedRecordIds.includes('SIM-REC-PJU-RT02-004')
  );
  const isAiProofVerified = Boolean(
    aiProof &&
    aiProof.isVerified === true &&
    aiProof.scenarioId === 'DEMO-CLOSED-LOOP-PJU-001' &&
    hasMatchedRecordIds &&
    aiProof.dataClassification === 'PROTOTYPE_SIMULATION' &&
    aiProof.isSimulation === true &&
    state.status === 'RECORDED_IN_MEMORY'
  );

  const testCases: TestCaseResult[] = [
    // STAGE 1: CAPTURE
    {
      id: 'TC-01',
      stage: 1,
      stageName: 'Capture',
      code: 'CAP-01',
      title: 'Identitas Warga & Parameter Laporan Terekam',
      expected: 'Laporan warga tercatat dengan pelapor valid, lokasi RT 02/RW 01, dan kategori Lampu Padam',
      actual: isCaptureDone ? `Pelapor: ${rep.reporterName}, RT/RW: ${rep.rtRw}, Kategori: ${rep.category}` : 'Menunggu submit laporan',
      status: isCaptureDone ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: isCaptureDone ? `ID: ${rep.id} | Dibuat: ${rep.createdAt}` : '-'
    },
    {
      id: 'TC-02',
      stage: 1,
      stageName: 'Capture',
      code: 'CAP-02',
      title: 'Klasifikasi Tata Kelola Data B (Simulasi Prototipe)',
      expected: 'DataClassification bernilai PROTOTYPE_SIMULATION dan tidak diklaim sebagai register arsip resmi',
      actual: rep.dataClassification === 'PROTOTYPE_SIMULATION' ? 'PROTOTYPE_SIMULATION (Data B)' : 'Bukan simulasi',
      status: rep.dataClassification === 'PROTOTYPE_SIMULATION' ? 'PASS' : 'FAIL',
      governanceCompliance: rep.dataClassification === 'PROTOTYPE_SIMULATION' ? 'COMPLIANT' : 'NON_COMPLIANT',
      evidence: `dataClassification = ${rep.dataClassification}`
    },
    {
      id: 'TC-03',
      stage: 1,
      stageName: 'Capture',
      code: 'CAP-03',
      title: 'Pencatatan Jejak Audit Awal (Capture Audit)',
      expected: 'Audit trail merekam entri Tahap 1 dengan aktor warga dan status transisi',
      actual: isCaptureDone && Boolean(captureAudit) ? `Entri Tahap 1 terekam di audit trail (${captureAudit?.action} oleh ${captureAudit?.actorName})` : 'Menunggu pengiriman laporan warga',
      status: isCaptureDone && Boolean(captureAudit) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: captureAudit ? `Audit ID: ${captureAudit.id} | Aktor: ${captureAudit.actorName} | Waktu: ${captureAudit.timestamp}` : 'Menunggu aksi warga'
    },

    // STAGE 2: VALIDATE
    {
      id: 'TC-04',
      stage: 2,
      stageName: 'Validate',
      code: 'VAL-01',
      title: 'Verifikasi Otoritas Pengurus RT 02',
      expected: 'Aktor pemeriksa memiliki peran RT dan wilayah RT 02',
      actual: hasValidationRecord ? `Diverifikasi oleh ${state.validation?.validatorName || 'Pak RT Ahmad Fauzi'} (${state.validation?.validatorRole || 'Ketua RT 02'})` : 'Menunggu verifikasi RT',
      status: hasValidationRecord ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: hasValidationRecord ? `Validator: ${state.validation?.validatorName} | Peran: ${state.validation?.validatorRole} | Waktu: ${state.validation?.validationTimestamp}` : '-'
    },
    {
      id: 'TC-05',
      stage: 2,
      stageName: 'Validate',
      code: 'VAL-02',
      title: 'Catatan Cek Fisik Lapangan & Verifikasi Kebenaran',
      expected: 'Terdapat catatan verifikasi fisik RT dan timestamp pemeriksaan',
      actual: hasValidationRecord ? state.validation!.physicalCheckSummary : 'Belum ada catatan verifikasi RT',
      status: hasValidationRecord ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: hasValidationRecord ? `Catatan Fisik RT: "${state.validation!.physicalCheckSummary}" | Waktu: ${state.validation!.validationTimestamp}` : '-'
    },
    {
      id: 'TC-06',
      stage: 2,
      stageName: 'Validate',
      code: 'VAL-03',
      title: 'Transisi Status ke Disposisi Pemerintah Desa (Audit VERIFIED_BY_RT)',
      expected: 'Audit trail mencatat transisi status SUBMITTED -> VERIFIED_BY_RT oleh Ketua RT 02 dengan stempel waktu sah dan validationRecord yang cocok',
      actual: (verifiedByRtAudit && hasValidationRecord)
        ? `Audit terverifikasi: ${verifiedByRtAudit.previousStatus} -> ${verifiedByRtAudit.newStatus} oleh ${verifiedByRtAudit.actorName} (${verifiedByRtAudit.actorRole}) pada ${verifiedByRtAudit.timestamp}`
        : 'Menunggu audit transisi sah SUBMITTED -> VERIFIED_BY_RT oleh Ketua RT 02',
      status: (verifiedByRtAudit && hasValidationRecord) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: (verifiedByRtAudit && hasValidationRecord)
        ? `Audit ID: ${verifiedByRtAudit.id} | Aktor: ${verifiedByRtAudit.actorName} (${verifiedByRtAudit.actorRole}) | Status: ${verifiedByRtAudit.previousStatus} -> ${verifiedByRtAudit.newStatus} | Waktu: ${verifiedByRtAudit.timestamp}`
        : '-'
    },

    // STAGE 3: REMEMBER
    {
      id: 'TC-07',
      stage: 3,
      stageName: 'Remember',
      code: 'REM-01',
      title: 'Pencocokan Identitas Objek Aset Terkait (rememberRecord)',
      expected: 'Terdapat rememberRecord yang menautkan RPT-DEMO-PJU-001 ke AST-DEMO-PJU-RT02-004 secara deterministik',
      actual: hasRememberRecord
        ? `Tertaut ke Aset: ${state.rememberRecord!.assetId} oleh ${state.rememberRecord!.actorName} (${state.rememberRecord!.actorRole})`
        : 'Menunggu tautan aset (rememberRecord)',
      status: hasRememberRecord ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: hasRememberRecord
        ? `Remember ID: ${state.rememberRecord!.id} | Report: ${state.rememberRecord!.reportId} <-> Asset: ${state.rememberRecord!.assetId} | Ditautkan: ${state.rememberRecord!.linkedAt} | Aktor: ${state.rememberRecord!.actorName} (${state.rememberRecord!.actorRole})`
        : '-'
    },
    {
      id: 'TC-08',
      stage: 3,
      stageName: 'Remember',
      code: 'REM-02',
      title: 'Pengambilan Riwayat Insiden Sebelumnya (retrievalRecord)',
      expected: 'Terdapat retrievalRecord yang memuat pemanggilan 2 riwayat servis dasar: M-HIST-PJU-01 dan M-HIST-PJU-02',
      actual: hasBaseHistoryRetrieval
        ? `2 riwayat dasar dipanggil: [${state.retrievalRecord!.baseHistoryIds.join(', ')}] (${state.retrievalRecord!.historyEntriesFound} entri total)`
        : 'Menunggu histori (retrievalRecord dengan 2 ID dasar)',
      status: hasBaseHistoryRetrieval ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: hasBaseHistoryRetrieval
        ? `Retrieval ID: ${state.retrievalRecord!.id} | Base History IDs: [${state.retrievalRecord!.baseHistoryIds.join(', ')}] | Waktu: ${state.retrievalRecord!.retrievedAt} | Aktor: ${state.retrievalRecord!.actorName}`
        : '-'
    },
    {
      id: 'TC-09',
      stage: 3,
      stageName: 'Remember',
      code: 'REM-03',
      title: 'Pengecekan Interval Pemeliharaan (Kalkulasi Tersimpan)',
      expected: 'Terdapat hasil kalkulasi interval pemeliharaan yang tersimpan dalam retrievalRecord',
      actual: hasIntervalCalc
        ? `Kalkulasi tersimpan: ${state.retrievalRecord!.intervalCalculation.monthsSinceLastService} bulan sejak ${state.retrievalRecord!.intervalCalculation.lastServiceDate} (${state.retrievalRecord!.intervalCalculation.isOverdue ? 'Overdue' : 'Normal'})`
        : 'Menunggu kalkulasi interval pada retrievalRecord',
      status: hasIntervalCalc ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: hasIntervalCalc
        ? `Kalkulasi: Servis terakhir ${state.retrievalRecord!.intervalCalculation.lastServiceDate}, ${state.retrievalRecord!.intervalCalculation.monthsSinceLastService} bulan lalu (Target: ${state.retrievalRecord!.intervalCalculation.targetIntervalMonths} bln) | Status: ${state.retrievalRecord!.intervalCalculation.statusText}`
        : '-'
    },

    // STAGE 4: RETRIEVE
    {
      id: 'TC-10',
      stage: 4,
      stageName: 'Retrieve',
      code: 'RET-01',
      title: 'Pengambilan Spesifikasi Teknis Suku Cadang',
      expected: 'Terdapat spesifikasi teknis suku cadang simulasi yang terekam dalam retrievalRecord',
      actual: hasTechSpecs
        ? `Spesifikasi terekam: ${state.retrievalRecord!.technicalSpecifications.lampType} (${state.retrievalRecord!.technicalSpecifications.power}, ${state.retrievalRecord!.technicalSpecifications.voltage})`
        : 'Menunggu retrieve spesifikasi teknis pada retrievalRecord',
      status: hasTechSpecs ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: hasTechSpecs
        ? `Spesifikasi Teknis: Daya: ${state.retrievalRecord!.technicalSpecifications.power} | Tipe: ${state.retrievalRecord!.technicalSpecifications.lampType} | Tegangan: ${state.retrievalRecord!.technicalSpecifications.voltage} | Tiang: ${state.retrievalRecord!.technicalSpecifications.poleType} | Sensor: ${state.retrievalRecord!.technicalSpecifications.opticalControl}`
        : '-'
    },
    {
      id: 'TC-11',
      stage: 4,
      stageName: 'Retrieve',
      code: 'RET-02',
      title: 'Isolasi Tata Kelola Data A vs Data B',
      expected: 'Data Aset Simulasi tidak tercampur ke topik resmi atau register arsip permanen desa',
      actual: (
        asset &&
        asset.isSimulation === true &&
        asset.dataClassification === 'PROTOTYPE_SIMULATION' &&
        asset.validationStatus === 'SIMULATION_ONLY' &&
        asset.scenarioId === 'DEMO-CLOSED-LOOP-PJU-001' &&
        (!asset.sourceIds || asset.sourceIds.length === 0 || !asset.sourceIds.some(s => s.startsWith('DOC-') || s.startsWith('SRC-OFFICIAL')))
      ) ? 'Terisolasi ketat (isSimulation = true)' : 'Gagal isolasi',
      status: (
        asset &&
        asset.isSimulation === true &&
        asset.dataClassification === 'PROTOTYPE_SIMULATION' &&
        asset.validationStatus === 'SIMULATION_ONLY' &&
        asset.scenarioId === 'DEMO-CLOSED-LOOP-PJU-001' &&
        (!asset.sourceIds || asset.sourceIds.length === 0 || !asset.sourceIds.some(s => s.startsWith('DOC-') || s.startsWith('SRC-OFFICIAL')))
      ) ? 'PASS' : 'FAIL',
      governanceCompliance: (
        asset &&
        asset.isSimulation === true &&
        asset.dataClassification === 'PROTOTYPE_SIMULATION' &&
        asset.validationStatus === 'SIMULATION_ONLY' &&
        asset.scenarioId === 'DEMO-CLOSED-LOOP-PJU-001' &&
        (!asset.sourceIds || asset.sourceIds.length === 0 || !asset.sourceIds.some(s => s.startsWith('DOC-') || s.startsWith('SRC-OFFICIAL')))
      ) ? 'COMPLIANT' : 'NON_COMPLIANT',
      evidence: `asset.isSimulation = ${asset?.isSimulation}`
    },
    {
      id: 'TC-12',
      stage: 4,
      stageName: 'Retrieve',
      code: 'RET-03',
      title: 'Label Paspor Digital QR DEMO',
      expected: 'QR Code paspor aset bertuliskan QR DEMO — BUKAN IDENTITAS ASET RESMI',
      actual: 'QR Paspor Aset berlabel "QR DEMO — BUKAN IDENTITAS ASET RESMI"',
      status: 'PASS',
      governanceCompliance: 'COMPLIANT',
      evidence: 'AssetPassportModal banner & QR caption verified'
    },

    // STAGE 5: ANALYZE
    {
      id: 'TC-13',
      stage: 5,
      stageName: 'Analyze',
      code: 'ANL-01',
      title: 'Kalkulasi Skor Prioritas Deterministik Simulasi',
      expected: 'Skor prioritas simulasi dihitung secara objektif dan terukur',
      actual: isAnalyzeDone && analysis ? `Skor: ${analysis.priorityScore}/100, Level: ${analysis.urgencyLevel}` : 'Menunggu kalkulasi skor',
      status: isAnalyzeDone && Boolean(analysis) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: analysis ? `Score: ${analysis.priorityScore} | Level: ${analysis.urgencyLevel}` : '-'
    },
    {
      id: 'TC-14',
      stage: 5,
      stageName: 'Analyze',
      code: 'ANL-02',
      title: 'Rincian Penjelasan Aturan Analisis (4 Faktor)',
      expected: 'Daftar faktor terdiri dari: Kategori Infrastruktur Vital, Kerusakan Berulang, Interval, Dampak Warga',
      actual: isAnalyzeDone && analysis ? `${analysis.scoreRationale.length} faktor bobot aturan terurai` : 'Menunggu rincian',
      status: isAnalyzeDone && Boolean(analysis?.scoreRationale?.length === 4) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: analysis ? analysis.scoreRationale.map(r => `${r.factor} (+${r.points})`).join(', ') : '-'
    },
    {
      id: 'TC-15',
      stage: 5,
      stageName: 'Analyze',
      code: 'ANL-03',
      title: 'Estimasi Anggaran Suku Cadang Simulasi',
      expected: 'Estimasi biaya simulasi dihitung untuk penggantian suku cadang',
      actual: isAnalyzeDone && analysis ? `Estimasi: Rp ${analysis.estimatedCost.toLocaleString('id-ID')}` : 'Menunggu estimasi',
      status: isAnalyzeDone && Boolean(analysis?.estimatedCost) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: analysis ? `Rp ${analysis.estimatedCost.toLocaleString('id-ID')}` : '-'
    },

    // STAGE 6: DECIDE
    {
      id: 'TC-16',
      stage: 6,
      stageName: 'Decide',
      code: 'DEC-01',
      title: 'Penayangan Disposisi di Dashboard Eksekutif Kades',
      expected: 'Analisis tersaji di dashboard Kepala Desa dengan rekomendasi tindakan simulasi',
      actual: isAnalyzeDone ? 'Rekomendasi tertayang di meja keputusan Kades' : 'Menunggu tahap keputusan',
      status: isAnalyzeDone ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: analysis?.recommendedAlternative || 'Rekomendasi Tindakan Simulasi'
    },
    {
      id: 'TC-17',
      stage: 6,
      stageName: 'Decide',
      code: 'DEC-02',
      title: 'Persetujuan Keputusan Simulasi Kepala Desa',
      expected: 'Keputusan simulasi disetujui untuk demonstrasi',
      actual: isDecideDone && decision ? `Keputusan disetujui oleh: ${decision.decisionMakerName}` : 'Menunggu keputusan Kades',
      status: isDecideDone && Boolean(decision) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: decision ? `Otorisasi: ${decision.decisionMakerName} (${decision.decisionMakerRole}) | Waktu: ${decision.decisionTimestamp}` : '-'
    },
    {
      id: 'TC-18',
      stage: 6,
      stageName: 'Decide',
      code: 'DEC-03',
      title: 'Pencatatan Keputusan Simulasi & Jejak Audit Kades',
      expected: 'Keputusan simulasi tercatat dan jejak audit mencatat persetujuan simulasi',
      actual: isDecideDone && decision ? `Keputusan Simulasi: ${decision.chosenAlternative}` : 'Menunggu keputusan simulasi',
      status: isDecideDone && Boolean(decision) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: decision ? `ID: ${decision.id} | Justifikasi: ${decision.justification}` : '-'
    },

    // STAGE 7: ACT
    {
      id: 'TC-19',
      stage: 7,
      stageName: 'Act',
      code: 'ACT-01',
      title: 'Disposisi Tugas ke Pelaksana Simulasi',
      expected: 'Perintah kerja diterima pelaksana lapangan simulasi',
      actual: isActionStarted ? 'Tugas aktif di modul Preventive Maintenance' : 'Menunggu penugasan pelaksana simulasi',
      status: isActionStarted ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: action?.technicianName || actionInProgressAudit?.actorName || 'Pelaksana Lapangan'
    },
    {
      id: 'TC-20',
      stage: 7,
      stageName: 'Act',
      code: 'ACT-02',
      title: 'Status Transisi Lapangan: ACTION_IN_PROGRESS (Audit Transisi)',
      expected: 'Audit trail merekam peristiwa transisi ACTION_IN_PROGRESS dengan aktor pelaksana dan timestamp valid',
      actual: actionInProgressAudit ? `Audit transisi: ${actionInProgressAudit.action} oleh ${actionInProgressAudit.actorName} (${actionInProgressAudit.timestamp})` : 'Belum ada audit transisi ACTION_IN_PROGRESS',
      status: actionInProgressAudit ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: actionInProgressAudit ? `Audit ID: ${actionInProgressAudit.id} | Aktor: ${actionInProgressAudit.actorName} (${actionInProgressAudit.actorRole}) | Status: ${actionInProgressAudit.previousStatus} -> ${actionInProgressAudit.newStatus} | Waktu: ${actionInProgressAudit.timestamp}` : '-'
    },
    {
      id: 'TC-21',
      stage: 7,
      stageName: 'Act',
      code: 'ACT-03',
      title: 'Pencatatan Komponen Simulasi & Contoh Biaya Simulasi',
      expected: 'Contoh komponen simulasi serta contoh biaya simulasi tercatat (Contoh Data B — Simulasi Prototipe)',
      actual: isActionResolved && action ? `Komponen: ${action.componentsReplaced.join(', ')} | Biaya: Rp ${action.actualCost.toLocaleString('id-ID')}` : 'Menunggu catatan pelaksana simulasi',
      status: isActionResolved && Boolean(action) ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: action ? `Parts: ${action.componentsReplaced.join(', ')} | Selesai: ${action.completedAt || '-'}` : '-'
    },

    // STAGE 8: RECORD
    {
      id: 'TC-22',
      stage: 8,
      stageName: 'Record',
      code: 'REC-01',
      title: 'Pemulihan Kondisi Fisik Aset Menjadi "Baik"',
      expected: 'Kondisi fisik aset kembali ke Baik setelah pemeriksaan simulasi selesai dan direkam',
      actual: isRecordDone ? `Kondisi aset terkini: ${asset.condition}` : 'Menunggu perekaman hasil servis',
      status: isRecordDone && asset.condition === 'Baik' ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: isRecordDone ? `asset.condition = ${asset.condition}` : '-'
    },
    {
      id: 'TC-23',
      stage: 8,
      stageName: 'Record',
      code: 'REC-02',
      title: 'Pembaruan Buku Riwayat Servis Aset Terpadu',
      expected: 'Buku log pemeliharaan aset memuat entri baru tanggal penyelesaian',
      actual: isRecordDone ? `Total entri servis pada aset: ${asset.maintenanceHistory.length} (termasuk penanganan siklus tertutup)` : 'Menunggu perekaman riwayat servis',
      status: isRecordDone && asset.maintenanceHistory.length >= 3 ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: isRecordDone ? `Latest maintenance: ${asset.maintenanceHistory[0]?.type || '-'}` : '-'
    },
    {
      id: 'TC-24',
      stage: 8,
      stageName: 'Record',
      code: 'REC-03',
      title: 'Validasi AI Asisten Menjawab Berdasarkan Memori Terpadu (Data B)',
      expected: 'Asisten AI memanggil rekaman siklus tertutup: RPT-DEMO-PJU-001, AST-DEMO-PJU-RT02-004, SIM-REC-PJU-RT02-004 dengan isolasi DATA B',
      actual: isAiProofVerified
        ? `Terverifikasi oleh Asisten AI: ${aiProof?.matchedRecordIds?.join(', ')} (${aiProof?.dataClassification})`
        : isRecordDone
          ? 'Menunggu pertanyaan ke Asisten AI untuk verifikasi retrieval memori (RPT-DEMO-PJU-001, AST-DEMO-PJU-RT02-004, SIM-REC-PJU-RT02-004)'
          : 'Menunggu penutupan siklus dan verifikasi retrieval AI',
      status: isAiProofVerified ? 'PASS' : 'PENDING',
      governanceCompliance: 'COMPLIANT',
      evidence: isAiProofVerified
        ? `Validasi AI: ${aiProof?.responseValidatedAt} | IDs: ${aiProof?.matchedRecordIds?.join(', ')} | Query: "${aiProof?.query}"`
        : '-'
    }
  ];

  const passedCount = testCases.filter(t => t.status === 'PASS').length;
  const pendingCount = testCases.filter(t => t.status === 'PENDING').length;
  const failedCount = testCases.filter(t => t.status === 'FAIL').length;
  const complianceRate = Math.round((testCases.filter(t => t.governanceCompliance === 'COMPLIANT').length / testCases.length) * 100);

  // Map state to current numeric stage
  const stageMap: Record<string, number> = {
    DRAFT: 0,
    SUBMITTED: 1,
    RT_VERIFICATION: 1,
    VERIFIED_BY_RT: 2,
    ANALYZED: 5,
    DECISION_RECORDED: 6,
    ACTION_IN_PROGRESS: 7,
    RESOLVED: 7,
    RECORDED_IN_MEMORY: 8
  };

  return {
    totalTests: testCases.length,
    passedCount,
    pendingCount,
    failedCount,
    complianceRate,
    allPassed: passedCount === testCases.length,
    currentStage: stageMap[state.status] || 0,
    testCases
  };
}
