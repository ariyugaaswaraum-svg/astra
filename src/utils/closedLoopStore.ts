import { useState, useEffect } from 'react';
import { 
  AssetItem, 
  CitizenReport, 
  MaintenanceRecord, 
  HumanMemory, 
  UserRoleType,
  AssetCondition
} from '../types';

/**
 * Closed Knowledge Loop State Machine & Data Store
 * =========================================================================
 * Scenario ID: 'DEMO-CLOSED-LOOP-PJU-001'
 * Scenario Title: "Lampu PJU RT 02/RW 01 Padam"
 * Lifecycle: Capture -> Validate -> Remember -> Retrieve -> Analyze -> Decide -> Act -> Record
 * 
 * Note: Frontend prototype state management with localStorage persistence.
 * In production, requires server-side authentication, database transactions, 
 * and cryptographically signed access control.
 * =========================================================================
 */

export type ClosedLoopStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'RT_VERIFICATION'
  | 'VERIFIED_BY_RT'
  | 'VILLAGE_REVIEW'
  | 'ANALYZED'
  | 'DECISION_RECORDED'
  | 'ACTION_IN_PROGRESS'
  | 'RESOLVED'
  | 'RECORDED_IN_MEMORY';

export type ClosedLoopStepName = 
  | 'Capture'
  | 'Validate'
  | 'Remember'
  | 'Retrieve'
  | 'Analyze'
  | 'Decide'
  | 'Act'
  | 'Record';

export interface ClosedLoopStepInfo {
  stepNumber: number;
  name: ClosedLoopStepName;
  title: string;
  description: string;
  status: 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai';
  actorName: string;
  actorRole: string;
  targetRole: UserRoleType;
  targetTab: string;
  timestamp?: string;
  summary?: string;
}

export interface ClosedLoopAuditTrailEntry {
  id: string;
  step: number;
  stepName: ClosedLoopStepName;
  action: string;
  actorId?: string;
  actorName: string;
  actorRole: string;
  previousStatus: ClosedLoopStatus | null;
  newStatus: ClosedLoopStatus;
  timestamp: string;
  notes: string;
  entityId: string;
  entityType: 'Report' | 'Validation' | 'Asset' | 'Analysis' | 'Decision' | 'Action' | 'Knowledge';
}

export interface ValidationRecord {
  id: string; // 'VAL-DEMO-PJU-001'
  reportId: string; // 'RPT-DEMO-PJU-001'
  assetId: string; // 'AST-DEMO-PJU-RT02-004'
  validatorName: string;
  validatorRole: string;
  isLocationMatched: boolean;
  physicalCheckSummary: string;
  validationTimestamp: string;
  status: 'VALIDATED' | 'REJECTED' | 'REVISION_REQUESTED';
  dataClassification: 'PROTOTYPE_SIMULATION';
}

export interface RuleBasedAnalysisResult {
  analysisId: string;
  isRecurring: boolean;
  incidentCount: number;
  lastInspectionMonthsAgo: number;
  isInspectionOverdue: boolean;
  priorityScore: number; // 88
  urgencyLevel: 'Sangat Tinggi';
  scoreRationale: { factor: string; points: number }[];
  missingDataAlerts: string[];
  recommendedAlternative: string;
  estimatedCost: number;
  analysisLabel: string; // "Analisis Simulasi Berbasis Aturan"
  timestamp: string;
}

export interface DecisionRecord {
  id: string; // 'DEC-DEMO-PJU-001'
  decisionId?: string;
  reportId: string; // 'RPT-DEMO-PJU-001'
  assetId: string; // 'AST-DEMO-PJU-RT02-004'
  decisionMakerName: string;
  approvedBy?: string;
  decisionMakerRole: string;
  chosenAlternative: string;
  actionPlan?: string;
  justification: string;
  assignedTeam: string;
  targetHours: number;
  estimatedBudget: number;
  decisionTimestamp: string;
  disclaimer: string; // "Keputusan Simulasi untuk Demonstrasi"
  dataClassification: 'PROTOTYPE_SIMULATION';
}

export interface ActionRecord {
  id: string; // 'ACT-DEMO-PJU-001'
  decisionId: string; // 'DEC-DEMO-PJU-001'
  reportId: string; // 'RPT-DEMO-PJU-001'
  assetId: string; // 'AST-DEMO-PJU-RT02-004'
  technicianName: string;
  startedAt: string;
  completedAt?: string;
  actionSummary: string;
  componentsReplaced: string[];
  replacedParts?: string[];
  actualCost: number;
  fieldNotes: string;
  resultingCondition: AssetCondition;
  status: 'IN_PROGRESS' | 'COMPLETED';
  dataClassification: 'PROTOTYPE_SIMULATION';
}

export interface KnowledgeRecord {
  id: string; // 'KNW-DEMO-PJU-001'
  scenarioId: string; // 'DEMO-CLOSED-LOOP-PJU-001'
  reportId: string; // 'RPT-DEMO-PJU-001'
  assetId: string; // 'AST-DEMO-PJU-RT02-004'
  decisionId: string; // 'DEC-DEMO-PJU-001'
  actionId: string; // 'ACT-DEMO-PJU-001'
  problemTitle: string;
  rootCauseFound: string;
  actionTakenSummary: string;
  outcomeSummary: string;
  totalDurationHours: number;
  lessonsLearned: string;
  preventiveInspectionCycle: string;
  recordedAt: string;
  dataClassification: 'PROTOTYPE_SIMULATION';
}

export interface MaintenanceChecklistState {
  taskId: string;
  completedItemIds: string[];
  updatedAt: string;
  updatedByRole: string;
  scenarioId: string;
  dataClassification: 'PROTOTYPE_SIMULATION';
  isSimulation: true;
}

export interface ClosedLoopState {
  scenarioId: string; // 'DEMO-CLOSED-LOOP-PJU-001'
  scenarioName: string;
  status: ClosedLoopStatus;
  currentStepIndex: number; // 0 to 7
  asset: AssetItem;
  report: CitizenReport;
  validation: ValidationRecord | null;
  analysis: RuleBasedAnalysisResult | null;
  decision: DecisionRecord | null;
  action: ActionRecord | null;
  knowledge: KnowledgeRecord | null;
  memoryRecord: HumanMemory | null;
  rememberRecord?: {
    id: string;
    reportId: string;
    assetId: string;
    linkedAt: string;
    actorId?: string;
    actorName: string;
    actorRole: string;
    isLinked: boolean;
    dataClassification: 'PROTOTYPE_SIMULATION';
  } | null;
  retrievalRecord?: {
    id: string;
    assetId: string;
    retrievedAt: string;
    actorId?: string;
    actorName: string;
    actorRole: string;
    historyEntriesFound: number;
    baseHistoryIds: string[];
    intervalCalculation: {
      lastServiceDate: string;
      monthsSinceLastService: number;
      targetIntervalMonths: number;
      isOverdue: boolean;
      statusText: string;
    };
    technicalSpecifications: {
      power: string;
      lampType: string;
      voltage: string;
      poleType: string;
      opticalControl: string;
    };
    dataClassification: 'PROTOTYPE_SIMULATION';
  } | null;
  stepFlags?: {
    rememberDone?: boolean;
    retrieveDone?: boolean;
  };
  maintenanceChecklist?: MaintenanceChecklistState;
  aiRetrievalProof?: AiRetrievalProof | null;
  auditTrail: ClosedLoopAuditTrailEntry[];
  lastUpdated: string;
}

export interface AiRetrievalProof {
  scenarioId: 'DEMO-CLOSED-LOOP-PJU-001' | string;
  query: string;
  responseValidatedAt: string;
  matchedRecordIds: string[]; // ['RPT-DEMO-PJU-001', 'AST-DEMO-PJU-RT02-004', 'SIM-REC-PJU-RT02-004']
  dataClassification: 'PROTOTYPE_SIMULATION';
  isSimulation: boolean;
  isVerified: boolean;
  actorName?: string;
  answerSnippet?: string;
  matchedKeywords?: string[];
}

// STORAGE CONSTANTS
const STORAGE_KEY = 'desa_closed_loop_pju_v1';

export const DEMO_SCENARIO_ID = 'DEMO-CLOSED-LOOP-PJU-001';
export const DEMO_ASSET_ID = 'AST-DEMO-PJU-RT02-004';
export const DEMO_REPORT_ID = 'RPT-DEMO-PJU-001';
export const DEMO_CITIZEN_ID = 'WARGA-001'; // Pak Budi Santoso (RT 02/RW 01)

export const INITIAL_DEMO_ASSET: AssetItem = {
  id: DEMO_ASSET_ID,
  assetId: DEMO_ASSET_ID,
  scenarioId: DEMO_SCENARIO_ID,
  code: "AST-DEMO-PJU-RT02-004",
  name: "Lampu PJU Titik 04 RT 02/RW 01 — Aset Simulasi",
  category: "Fasilitas Umum",
  dusun: "Dusun 1 (Krajan)",
  rtRw: "RT 02 / RW 01",
  yearBuilt: 2024,
  condition: "Perlu Servis",
  photoUrl: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&auto=format&fit=crop&q=80",
  gpsCoords: { lat: -8.1324, lng: 112.5685 },
  dataClassification: "PROTOTYPE_SIMULATION",
  validationStatus: "SIMULATION_ONLY",
  isSimulation: true,
  sourceIds: [],
  maintenanceHistory: [
    {
      id: "M-HIST-PJU-01",
      date: "2025-08-10",
      type: "[DATA B — SIMULASI] Pemasangan Baru LED 50W & Starter",
      cost: 450000,
      technician: "Pelaksana Simulasi (Data B)",
      notes: "[DATA B — SIMULASI] Inspeksi awal pemasangan lampu tiang PJU RT 02 Dusun Krajan (Contoh Data B — Simulasi Prototipe)"
    },
    {
      id: "M-HIST-PJU-02",
      date: "2025-11-14",
      type: "[DATA B — SIMULASI] Pembersihan Fitting & Pengencangan Konektor Kabel",
      cost: 85000,
      technician: "Swadaya RT 02",
      notes: "[DATA B — SIMULASI] Insiden kedip sesaat akibat getaran angin & fluktuasi arus"
    }
  ],
  qrCodeValue: "QR DEMO — BUKAN IDENTITAS ASET RESMI",
  estimatedValue: 3500000,
  assignedManager: "Tim Sarpras Desa & Ketua RT 02 (Contoh Simulasi)"
};

export const INITIAL_DEMO_REPORT: CitizenReport = {
  id: DEMO_REPORT_ID,
  citizenId: DEMO_CITIZEN_ID,
  title: "Lampu PJU Titik 04 RT 02/RW 01 Padam",
  category: "Lampu Padam",
  reporterName: "Pak Budi Santoso",
  reporterPhone: "0812-3456-7890",
  dusun: "Dusun 1 (Krajan)",
  rtRw: "RT 02 / RW 01",
  description: "Lampu penerangan jalan padam sejak kemarin malam di dekat pertigaan gang Musholla RT 02. Area jalan menjadi gelap gulita dan membahayakan pengendara motor serta pejalan kaki yang melintas saat malam hari.",
  status: "Draft",
  urgency: "Penting",
  createdAt: "2026-03-01T19:30:00.000Z",
  dataClassification: "PROTOTYPE_SIMULATION",
  accessLevel: "INTERNAL",
  photoUrl: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=600&auto=format&fit=crop&q=80",
  gpsCoords: { lat: -8.1324, lng: 112.5685 },
  auditTrail: []
};

/**
 * Build initial default state for the demo
 */
export function getInitialClosedLoopState(): ClosedLoopState {
  return {
    scenarioId: DEMO_SCENARIO_ID,
    scenarioName: "Lampu PJU RT 02/RW 01 Padam",
    status: 'DRAFT',
    currentStepIndex: 0,
    asset: { 
      ...INITIAL_DEMO_ASSET,
      condition: 'Perlu Servis',
      maintenanceHistory: [...INITIAL_DEMO_ASSET.maintenanceHistory]
    },
    report: { ...INITIAL_DEMO_REPORT },
    validation: null,
    analysis: null,
    decision: null,
    action: null,
    knowledge: null,
    memoryRecord: null,
    rememberRecord: null,
    retrievalRecord: null,
    stepFlags: {},
    aiRetrievalProof: null,
    maintenanceChecklist: {
      taskId: 'TASK-DEMO-PJU-001',
      completedItemIds: [],
      updatedAt: new Date().toISOString(),
      updatedByRole: 'Pelaksana Lapangan',
      scenarioId: DEMO_SCENARIO_ID,
      dataClassification: 'PROTOTYPE_SIMULATION',
      isSimulation: true
    },
    auditTrail: [
      {
        id: `AUDIT-INIT-${Date.now()}`,
        step: 1,
        stepName: 'Capture',
        action: 'INIT_DEMO',
        actorId: 'SYS-001',
        actorName: 'Sistem Desa Black Box AI',
        actorRole: 'SYSTEM',
        previousStatus: null,
        newStatus: 'DRAFT',
        timestamp: new Date().toISOString(),
        notes: 'Inisialisasi data simulasi prototipe',
        entityId: DEMO_SCENARIO_ID,
        entityType: 'Report'
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

// In-Memory state holder
let memoryState: ClosedLoopState = getInitialClosedLoopState();
let isInitialized = false;
const listeners = new Set<(state: ClosedLoopState) => void>();

export let lastStorageError: string | null = null;

export function getLastStorageError(): string | null {
  return lastStorageError;
}

/**
 * Normalizes an asset object ensuring the simulation asset AST-DEMO-PJU-RT02-004 has all required explicit metadata,
 * while leaving Data A authentic assets completely untouched.
 */
export function normalizeSimulationAsset(asset: AssetItem | null | undefined): AssetItem | null {
  if (!asset) return null;
  const isTargetSimulationAsset =
    asset.id === DEMO_ASSET_ID ||
    asset.assetId === DEMO_ASSET_ID ||
    asset.code === DEMO_ASSET_ID;

  if (!isTargetSimulationAsset) {
    // Data A assets remain untouched! Do NOT convert other assets to simulation.
    return asset;
  }

  return {
    ...asset,
    id: DEMO_ASSET_ID,
    assetId: DEMO_ASSET_ID,
    scenarioId: DEMO_SCENARIO_ID,
    dataClassification: 'PROTOTYPE_SIMULATION',
    validationStatus: 'SIMULATION_ONLY',
    isSimulation: true,
    sourceIds: Array.isArray(asset.sourceIds) ? asset.sourceIds : []
  };
}

/**
 * Normalizes ClosedLoopState safely migrating old persisted state.
 * - If assetId is AST-DEMO-PJU-RT02-004, completes simulation metadata:
 *   {
 *     assetId: 'AST-DEMO-PJU-RT02-004',
 *     scenarioId: 'DEMO-CLOSED-LOOP-PJU-001',
 *     dataClassification: 'PROTOTYPE_SIMULATION',
 *     validationStatus: 'SIMULATION_ONLY',
 *     isSimulation: true,
 *     sourceIds: []
 *   }
 * - Leaves Data A untouched
 * - Does NOT convert all assets to simulation
 * - Reports if migration was performed
 */
export function normalizeClosedLoopState(state: ClosedLoopState): { state: ClosedLoopState; migrated: boolean } {
  if (!state) {
    return { state: getInitialClosedLoopState(), migrated: true };
  }

  let migrated = false;
  let currentAsset = state.asset;

  if (
    currentAsset &&
    (currentAsset.id === DEMO_ASSET_ID || currentAsset.assetId === DEMO_ASSET_ID || currentAsset.code === DEMO_ASSET_ID)
  ) {
    if (
      currentAsset.assetId !== DEMO_ASSET_ID ||
      currentAsset.scenarioId !== DEMO_SCENARIO_ID ||
      currentAsset.dataClassification !== 'PROTOTYPE_SIMULATION' ||
      currentAsset.validationStatus !== 'SIMULATION_ONLY' ||
      currentAsset.isSimulation !== true ||
      !Array.isArray(currentAsset.sourceIds)
    ) {
      currentAsset = {
        ...currentAsset,
        id: DEMO_ASSET_ID,
        assetId: DEMO_ASSET_ID,
        scenarioId: DEMO_SCENARIO_ID,
        dataClassification: 'PROTOTYPE_SIMULATION',
        validationStatus: 'SIMULATION_ONLY',
        isSimulation: true,
        sourceIds: Array.isArray(currentAsset.sourceIds) ? currentAsset.sourceIds : []
      };
      migrated = true;
    }
  } else if (!currentAsset) {
    currentAsset = { ...INITIAL_DEMO_ASSET };
    migrated = true;
  }

  let currentReport = state.report;
  if (currentReport && (currentReport.id === DEMO_REPORT_ID || currentReport.scenarioId === DEMO_SCENARIO_ID)) {
    if (
      currentReport.scenarioId !== DEMO_SCENARIO_ID ||
      currentReport.dataClassification !== 'PROTOTYPE_SIMULATION' ||
      currentReport.isSimulation !== true ||
      !Array.isArray(currentReport.sourceIds)
    ) {
      currentReport = {
        ...currentReport,
        scenarioId: DEMO_SCENARIO_ID,
        dataClassification: 'PROTOTYPE_SIMULATION',
        isSimulation: true,
        sourceIds: Array.isArray(currentReport.sourceIds) ? currentReport.sourceIds : []
      };
      migrated = true;
    }
  }

  // Preserve & safely enrich retrievalRecord if already populated by UI step
  let currentRetrieval = state.retrievalRecord;
  if (currentRetrieval) {
    let retrievalMigrated = false;
    if (!Array.isArray(currentRetrieval.baseHistoryIds) || currentRetrieval.baseHistoryIds.length < 2) {
      currentRetrieval = {
        ...currentRetrieval,
        baseHistoryIds: ['M-HIST-PJU-01', 'M-HIST-PJU-02'],
        historyEntriesFound: Math.max(currentRetrieval.historyEntriesFound || 2, 2)
      };
      retrievalMigrated = true;
    }
    if (!currentRetrieval.intervalCalculation || typeof currentRetrieval.intervalCalculation.monthsSinceLastService !== 'number') {
      currentRetrieval = {
        ...currentRetrieval,
        intervalCalculation: {
          lastServiceDate: '2025-11-14',
          monthsSinceLastService: 7,
          targetIntervalMonths: 6,
          isOverdue: true,
          statusText: 'Terlambat 1 bulan dari jadwal 6-bulanan (Jatuh tempo: Februari 2026)'
        }
      };
      retrievalMigrated = true;
    }
    if (!currentRetrieval.technicalSpecifications || !currentRetrieval.technicalSpecifications.power) {
      currentRetrieval = {
        ...currentRetrieval,
        technicalSpecifications: {
          power: '50 Watt',
          lampType: 'LED Cobra Head Commercial',
          voltage: '220V AC / 50Hz',
          poleType: 'Oktagonal 7 Meter Galvanis',
          opticalControl: 'Photocell Sensor LDR Otomatis'
        }
      };
      retrievalMigrated = true;
    }
    if (retrievalMigrated) {
      migrated = true;
    }
  }

  const normalizedState: ClosedLoopState = {
    ...state,
    asset: currentAsset,
    report: currentReport,
    rememberRecord: state.rememberRecord || null,
    retrievalRecord: currentRetrieval || null
  };

  if (migrated) {
    return {
      state: normalizedState,
      migrated: true
    };
  }

  return { state: normalizedState, migrated: false };
}

/**
 * Initialize state from localStorage with validation and safe migration
 */
export function initClosedLoopStore(): ClosedLoopState {
  if (typeof window === 'undefined') {
    const { state: normalized } = normalizeClosedLoopState(memoryState);
    memoryState = normalized;
    return memoryState;
  }

  if (isInitialized) {
    const { state: normalized, migrated } = normalizeClosedLoopState(memoryState);
    if (migrated) {
      saveToStorage(normalized);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: normalized }));
      }
    }
    return memoryState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.scenarioId === DEMO_SCENARIO_ID &&
        parsed.status &&
        parsed.report?.id === DEMO_REPORT_ID &&
        (parsed.asset?.id === DEMO_ASSET_ID || parsed.asset?.assetId === DEMO_ASSET_ID || parsed.asset?.code === DEMO_ASSET_ID) &&
        Array.isArray(parsed.auditTrail)
      ) {
        const { state: normalized, migrated } = normalizeClosedLoopState(parsed);
        memoryState = normalized;
        isInitialized = true;
        lastStorageError = null;
        if (migrated) {
          saveToStorage(memoryState);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: memoryState }));
          }
        }
        return memoryState;
      }
    }
  } catch (err) {
    lastStorageError = err instanceof Error ? err.message : 'Gagal membaca riwayat sesi dari peramban';
    console.error('[ClosedLoopStore] Galat pembacaan localStorage:', lastStorageError);
  }

  memoryState = getInitialClosedLoopState();
  isInitialized = true;
  saveToStorage(memoryState);
  return memoryState;
}

/**
 * Save state to localStorage and notify all subscribers
 */
function saveToStorage(state: ClosedLoopState): void {
  // Ensure simulation asset retains explicit metadata before persistence
  const { state: verifiedState } = normalizeClosedLoopState(state);
  memoryState = verifiedState;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedState));
      lastStorageError = null;
    } catch (err) {
      lastStorageError = err instanceof Error ? err.message : 'Kapasitas penyimpanan lokal peramban penuh atau dibatasi';
      console.error('[ClosedLoopStore] Galat penulisan localStorage:', lastStorageError);
    }
  }
  listeners.forEach(listener => {
    try {
      listener(memoryState);
    } catch (e) {
      console.error('Subscriber error in closedLoopStore:', e);
    }
  });
}

/**
 * Subscribe to state changes
 */
export function subscribeToClosedLoop(listener: (state: ClosedLoopState) => void): () => void {
  listeners.add(listener);
  // Immediate call with current state
  listener(getClosedLoopState());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Get current snapshot of Closed Loop State with safe migration
 */
export function getClosedLoopState(): ClosedLoopState {
  if (!isInitialized) {
    return initClosedLoopStore();
  }
  const { state: normalized, migrated } = normalizeClosedLoopState(memoryState);
  if (migrated) {
    saveToStorage(normalized);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: normalized }));
    }
  }
  return memoryState;
}

/**
 * React hook to consume and reactively update Closed Loop state
 */
export function useClosedLoopState(): ClosedLoopState {
  const [state, setState] = useState<ClosedLoopState>(() => getClosedLoopState());

  useEffect(() => {
    return subscribeToClosedLoop((newState) => {
      setState(newState);
    });
  }, []);

  return state;
}

/**
 * Helper to toggle maintenance checklist items with persistent storage
 */
export function toggleMaintenanceChecklistItem(itemId: string, actorName?: string): ClosedLoopState {
  const current = getClosedLoopState();
  const currentList = current.maintenanceChecklist?.completedItemIds || [];
  const isPresent = currentList.includes(itemId);
  const updatedItemIds = isPresent 
    ? currentList.filter(id => id !== itemId)
    : [...currentList, itemId];
  
  const updatedChecklist: MaintenanceChecklistState = {
    taskId: 'TASK-DEMO-PJU-001',
    completedItemIds: updatedItemIds,
    updatedAt: new Date().toISOString(),
    updatedByRole: actorName || 'Pelaksana Lapangan',
    scenarioId: DEMO_SCENARIO_ID,
    dataClassification: 'PROTOTYPE_SIMULATION',
    isSimulation: true
  };

  const updatedState: ClosedLoopState = {
    ...current,
    maintenanceChecklist: updatedChecklist,
    lastUpdated: new Date().toISOString()
  };

  saveToStorage(updatedState);
  return updatedState;
}

/**
 * Fast helper to complete all 4 checklist items atomically
 */
export function completeAllMaintenanceChecklist(taskId?: string, actorName?: string): ClosedLoopState {
  const current = getClosedLoopState();
  if (current.maintenanceChecklist?.completedItemIds?.length === 4) {
    return current;
  }
  const allIds = ['chk-pju-01', 'chk-pju-02', 'chk-pju-03', 'chk-pju-04'];
  const updatedChecklist: MaintenanceChecklistState = {
    taskId: taskId || 'TASK-DEMO-PJU-001',
    completedItemIds: allIds,
    updatedAt: new Date().toISOString(),
    updatedByRole: actorName || 'Pelaksana Lapangan',
    scenarioId: DEMO_SCENARIO_ID,
    dataClassification: 'PROTOTYPE_SIMULATION',
    isSimulation: true
  };
  const updatedState: ClosedLoopState = {
    ...current,
    maintenanceChecklist: updatedChecklist,
    lastUpdated: new Date().toISOString()
  };
  saveToStorage(updatedState);
  return updatedState;
}

export const setMaintenanceChecklistAllDone = completeAllMaintenanceChecklist;

/**
 * Record and verify AI Retrieval Proof for Data B (TC-24)
 * Strictly follows the 6-step centralized verification workflow:
 * 1. Normalisasi teks jawaban
 * 2. Periksa keberadaan seluruh bukti (RPT-DEMO-PJU-001, AST-DEMO-PJU-RT02-004, SIM-REC-PJU-RT02-004, DATA B)
 * 3. Pastikan state closed loop sedang RECORDED_IN_MEMORY
 * 4. Panggil recordAiRetrievalProof hanya sekali
 * 5. Simpan hasil ke closedLoopStore/localStorage
 * 6. Emit pembaruan agar widget dan ClosedLoopTestSuite langsung bereaksi
 */
export function recordAiRetrievalProof(payload: { query: string; answer: string; actorName?: string }): AiRetrievalProof | null {
  const current = getClosedLoopState();
  
  // 1. Normalisasi teks jawaban
  const answerNormalized = (payload.answer || '').toUpperCase();
  const queryNormalized = (payload.query || '').toUpperCase();
  const combinedText = `${answerNormalized} ${queryNormalized}`;
  
  // 2. Periksa keberadaan seluruh bukti:
  // - RPT-DEMO-PJU-001
  // - AST-DEMO-PJU-RT02-004
  // - SIM-REC-PJU-RT02-004
  // - DATA B
  const hasRpt = combinedText.includes('RPT-DEMO-PJU-001');
  const hasAst = combinedText.includes('AST-DEMO-PJU-RT02-004');
  const hasSimRec = combinedText.includes('SIM-REC-PJU-RT02-004');
  const hasDataB = combinedText.includes('DATA B');
  
  const matchedRecordIds: string[] = [];
  if (hasRpt) matchedRecordIds.push('RPT-DEMO-PJU-001');
  if (hasAst) matchedRecordIds.push('AST-DEMO-PJU-RT02-004');
  if (hasSimRec) matchedRecordIds.push('SIM-REC-PJU-RT02-004');

  const allProofPresent = hasRpt && hasAst && hasSimRec && hasDataB;

  // 3. Pastikan state closed loop sedang RECORDED_IN_MEMORY
  if (current.status !== 'RECORDED_IN_MEMORY') {
    return null;
  }

  if (!allProofPresent) {
    return null;
  }

  // 4. Panggil recordAiRetrievalProof hanya sekali (idempotent guard)
  if (
    current.aiRetrievalProof &&
    current.aiRetrievalProof.isVerified &&
    Array.isArray(current.aiRetrievalProof.matchedRecordIds) &&
    current.aiRetrievalProof.matchedRecordIds.includes('RPT-DEMO-PJU-001') &&
    current.aiRetrievalProof.matchedRecordIds.includes('AST-DEMO-PJU-RT02-004') &&
    current.aiRetrievalProof.matchedRecordIds.includes('SIM-REC-PJU-RT02-004')
  ) {
    return current.aiRetrievalProof;
  }

  // 5. Simpan hasil ke closedLoopStore/localStorage
  const proof: AiRetrievalProof = {
    scenarioId: DEMO_SCENARIO_ID,
    query: payload.query || 'Bagaimana riwayat penanganan lampu PJU Titik 04 RT 02 (RPT-DEMO-PJU-001)?',
    responseValidatedAt: new Date().toISOString(),
    matchedRecordIds: [
      'RPT-DEMO-PJU-001',
      'AST-DEMO-PJU-RT02-004',
      'SIM-REC-PJU-RT02-004'
    ],
    dataClassification: 'PROTOTYPE_SIMULATION',
    isSimulation: true,
    isVerified: true,
    actorName: payload.actorName || 'Warga Desa',
    answerSnippet: payload.answer.slice(0, 300),
    matchedKeywords: ['RPT-DEMO-PJU-001', 'AST-DEMO-PJU-RT02-004', 'SIM-REC-PJU-RT02-004', 'DATA B']
  };

  const updatedState: ClosedLoopState = {
    ...current,
    aiRetrievalProof: proof,
    lastUpdated: new Date().toISOString()
  };

  saveToStorage(updatedState);

  // 6. Emit pembaruan agar widget dan ClosedLoopTestSuite langsung bereaksi
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: updatedState }));
    window.dispatchEvent(new Event('storage'));
  }

  return proof;
}

/**
 * Execute Step 3: Link report to Asset Digital Passport (Remember)
 */
export function executeRememberStep(actor: { name: string; role: string; actorId?: string }): ClosedLoopState {
  const current = getClosedLoopState();
  if (current.rememberRecord?.isLinked) {
    return current;
  }
  const nowIso = new Date().toISOString();
  const rememberRec = {
    id: `REM-${Date.now()}`,
    reportId: DEMO_REPORT_ID,
    assetId: DEMO_ASSET_ID,
    linkedAt: nowIso,
    actorId: actor.actorId || 'PRG-001',
    actorName: actor.name,
    actorRole: actor.role,
    isLinked: true,
    dataClassification: 'PROTOTYPE_SIMULATION' as const
  };

  const auditEntry: ClosedLoopAuditTrailEntry = {
    id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    step: 3,
    stepName: 'Remember',
    action: 'LINK_REPORT_TO_DIGITAL_ASSET_PASSPORT',
    actorId: actor.actorId || 'PRG-001',
    actorName: actor.name,
    actorRole: actor.role,
    previousStatus: current.status,
    newStatus: current.status,
    timestamp: nowIso,
    notes: `Laporan ${DEMO_REPORT_ID} ditautkan ke Paspor Aset Digital ${DEMO_ASSET_ID} (Data B — Simulasi Prototipe).`,
    entityId: DEMO_ASSET_ID,
    entityType: 'Asset'
  };

  const updatedState: ClosedLoopState = {
    ...current,
    rememberRecord: rememberRec,
    stepFlags: { ...current.stepFlags, rememberDone: true },
    auditTrail: [auditEntry, ...current.auditTrail],
    lastUpdated: nowIso
  };

  saveToStorage(updatedState);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: updatedState }));
    window.dispatchEvent(new Event('storage'));
  }
  return updatedState;
}

/**
 * Execute Step 4: Retrieve incident history from Asset Memory (Retrieve)
 */
export function executeRetrieveStep(actor: { name: string; role: string; actorId?: string }): ClosedLoopState {
  const current = getClosedLoopState();
  if (current.retrievalRecord && Array.isArray(current.retrievalRecord.baseHistoryIds) && current.retrievalRecord.baseHistoryIds.length >= 2) {
    return current;
  }
  const nowIso = new Date().toISOString();

  // Find base history entries or fallback
  const lastHistory = current.asset.maintenanceHistory.find(m => m.id === 'M-HIST-PJU-02') || current.asset.maintenanceHistory[0];
  const lastDate = lastHistory?.date || '2025-11-14';
  const lastDateTime = new Date(lastDate).getTime();
  const currentDateTime = new Date().getTime();
  const monthsDiff = Math.max(1, Math.round((currentDateTime - lastDateTime) / (1000 * 60 * 60 * 24 * 30.4375)));
  const targetInterval = 6;
  const isOverdue = monthsDiff >= targetInterval;

  const retrieveRec = {
    id: `RTV-${Date.now()}`,
    assetId: DEMO_ASSET_ID,
    retrievedAt: nowIso,
    actorId: actor.actorId || 'PRG-001',
    actorName: actor.name,
    actorRole: actor.role,
    historyEntriesFound: Math.max(current.asset.maintenanceHistory.length, 2),
    baseHistoryIds: ['M-HIST-PJU-01', 'M-HIST-PJU-02'],
    intervalCalculation: {
      lastServiceDate: lastDate,
      monthsSinceLastService: monthsDiff,
      targetIntervalMonths: targetInterval,
      isOverdue: isOverdue,
      statusText: isOverdue 
        ? `Terlambat ${monthsDiff - targetInterval} bulan dari jadwal rekomendasi 6-bulanan (Jatuh tempo: Februari 2026)`
        : 'Dalam jadwal operasional normal'
    },
    technicalSpecifications: {
      power: '50 Watt',
      lampType: 'LED Cobra Head Commercial',
      voltage: '220V AC / 50Hz',
      poleType: 'Oktagonal 7 Meter Galvanis',
      opticalControl: 'Photocell Sensor LDR Otomatis'
    },
    dataClassification: 'PROTOTYPE_SIMULATION' as const
  };

  const auditEntry: ClosedLoopAuditTrailEntry = {
    id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    step: 4,
    stepName: 'Retrieve',
    action: 'RETRIEVE_HISTORICAL_MAINTENANCE_MEMORY',
    actorId: actor.actorId || 'PRG-001',
    actorName: actor.name,
    actorRole: actor.role,
    previousStatus: current.status,
    newStatus: current.status,
    timestamp: nowIso,
    notes: `Sistem memanggil histori servis sebelumnya (M-HIST-PJU-01, M-HIST-PJU-02), kalkulasi interval (${monthsDiff} bulan lalu, ${isOverdue ? 'Overdue' : 'Normal'}), dan spesifikasi teknis LED 50W.`,
    entityId: DEMO_ASSET_ID,
    entityType: 'Knowledge'
  };

  const updatedState: ClosedLoopState = {
    ...current,
    retrievalRecord: retrieveRec,
    stepFlags: { ...current.stepFlags, retrieveDone: true },
    auditTrail: [auditEntry, ...current.auditTrail],
    lastUpdated: nowIso
  };

  saveToStorage(updatedState);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: updatedState }));
    window.dispatchEvent(new Event('storage'));
  }
  return updatedState;
}

/**
 * Check if a state transition is valid according to the state machine
 */
export function canTransitionReport(
  currentStatus: ClosedLoopStatus, 
  nextStatus: ClosedLoopStatus, 
  actorRole: UserRoleType | 'system'
): { allowed: boolean; reason?: string } {
  const allowedTransitions: Record<ClosedLoopStatus, { next: ClosedLoopStatus[]; roles: (UserRoleType | 'system')[] }> = {
    DRAFT: {
      next: ['SUBMITTED'],
      roles: ['warga', 'system']
    },
    SUBMITTED: {
      next: ['RT_VERIFICATION', 'VERIFIED_BY_RT'],
      roles: ['rt', 'system']
    },
    RT_VERIFICATION: {
      next: ['VERIFIED_BY_RT', 'DRAFT'],
      roles: ['rt', 'system']
    },
    VERIFIED_BY_RT: {
      next: ['VILLAGE_REVIEW', 'ANALYZED'],
      roles: ['perangkat', 'system', 'kades']
    },
    VILLAGE_REVIEW: {
      next: ['ANALYZED', 'DECISION_RECORDED'],
      roles: ['perangkat', 'system', 'kades']
    },
    ANALYZED: {
      next: ['DECISION_RECORDED'],
      roles: ['kades', 'system']
    },
    DECISION_RECORDED: {
      next: ['ACTION_IN_PROGRESS'],
      roles: ['perangkat', 'system']
    },
    ACTION_IN_PROGRESS: {
      next: ['RESOLVED'],
      roles: ['perangkat', 'system']
    },
    RESOLVED: {
      next: ['RECORDED_IN_MEMORY'],
      roles: ['perangkat', 'system', 'kades']
    },
    RECORDED_IN_MEMORY: {
      next: [], // Terminal resolved state
      roles: []
    }
  };

  const rule = allowedTransitions[currentStatus];
  if (!rule) {
    return { allowed: false, reason: `Status saat ini (${currentStatus}) tidak dikenal.` };
  }

  if (!rule.next.includes(nextStatus)) {
    return { 
      allowed: false, 
      reason: `Transisi ilegal: status ${currentStatus} tidak dapat langsung berpindah ke ${nextStatus}.` 
    };
  }

  if (actorRole !== 'system' && !rule.roles.includes(actorRole)) {
    return { 
      allowed: false, 
      reason: `Akses ditolak: Peran ${actorRole.toUpperCase()} tidak memiliki wewenang untuk transisi ${currentStatus} -> ${nextStatus}.` 
    };
  }

  return { allowed: true };
}

/**
 * Execute a state transition in the Closed Knowledge Loop
 */
export function transitionReportStatus(
  nextStatus: ClosedLoopStatus,
  actor: { name: string; role: string; roleType: UserRoleType | 'system' },
  note: string,
  extraPayload?: {
    validationNote?: string;
    chosenAlternative?: string;
    justification?: string;
    technicianName?: string;
    cost?: number;
    components?: string[];
  }
): { success: boolean; state: ClosedLoopState; error?: string } {
  const current = getClosedLoopState();

  // Idempotency: if already at the target status, return cleanly without duplicating records or audit entries
  if (current.status === nextStatus) {
    return { success: true, state: current };
  }

  const check = canTransitionReport(current.status, nextStatus, actor.roleType);

  if (!check.allowed) {
    return { success: false, state: current, error: check.reason };
  }

  // Pre-condition: Moving from VERIFIED_BY_RT to ANALYZED requires Remember and Retrieve records
  if (nextStatus === 'ANALYZED' && (!current.rememberRecord?.isLinked || !current.retrievalRecord)) {
    return {
      success: false,
      state: current,
      error: 'Tahap Remember (penautan aset) dan Retrieve (riwayat servis & spesifikasi) harus diselesaikan terlebih dahulu sebelum tahap Analyze.'
    };
  }

  const nowIso = new Date().toISOString();
  let updatedState: ClosedLoopState = { ...current, lastUpdated: nowIso };

  // Determine Step and Updates based on nextStatus
  let stepNumber = 1;
  let stepName: ClosedLoopStepName = 'Capture';
  let actionName = 'UPDATE_STATUS';
  let entityId = DEMO_REPORT_ID;
  let entityType: ClosedLoopAuditTrailEntry['entityType'] = 'Report';

  switch (nextStatus) {
    case 'SUBMITTED': {
      stepNumber = 1;
      stepName = 'Capture';
      actionName = 'WARGA_KIRIM_LAPORAN_PJU';
      updatedState.status = 'SUBMITTED';
      updatedState.currentStepIndex = 1; // ready for Step 2 Validate
      updatedState.report = {
        ...updatedState.report,
        status: 'Menunggu Verifikasi RT',
        createdAt: nowIso,
        dataClassification: 'PROTOTYPE_SIMULATION'
      };
      // Mark asset condition as Rusak Ringan while incident active
      updatedState.asset = {
        ...updatedState.asset,
        condition: 'Rusak Ringan'
      };
      break;
    }

    case 'VERIFIED_BY_RT': {
      stepNumber = 2;
      stepName = 'Validate';
      actionName = 'RT_VERIFIKASI_LAPANGAN_BERHASIL';
      entityId = 'VAL-DEMO-PJU-001';
      entityType = 'Validation';
      updatedState.status = 'VERIFIED_BY_RT';
      updatedState.currentStepIndex = 2; // Step 2 finished, ready for Remember & Retrieve
      
      const validationRec: ValidationRecord = {
        id: 'VAL-DEMO-PJU-001',
        reportId: DEMO_REPORT_ID,
        assetId: DEMO_ASSET_ID,
        validatorName: actor.name,
        validatorRole: actor.role,
        isLocationMatched: true,
        physicalCheckSummary: extraPayload?.validationNote || "Pemeriksaan fisik di lokasi RT 02/RW 01 mengonfirmasi lampu padam total. Tiang kokoh, modul LED mati, diduga kapasitor starter aus.",
        validationTimestamp: nowIso,
        status: 'VALIDATED',
        dataClassification: 'PROTOTYPE_SIMULATION'
      };
      updatedState.validation = validationRec;
      updatedState.report = {
        ...updatedState.report,
        status: 'Diteruskan ke Pemerintah Desa',
        verifiedByRtAt: nowIso,
        rtNotes: validationRec.physicalCheckSummary
      };
      break;
    }

    case 'ANALYZED': {
      stepNumber = 5;
      stepName = 'Analyze';
      actionName = 'SISTEM_ANALISIS_RISIKO_BERBASIS_ATURAN';
      entityId = updatedState.analysis?.analysisId || `ANL-${Date.now()}`;
      entityType = 'Analysis';
      updatedState.status = 'ANALYZED';
      updatedState.currentStepIndex = 5; // ready for Step 6 Decide

      if (!updatedState.analysis) {
        const ruleAnalysis: RuleBasedAnalysisResult = {
          analysisId: entityId,
          isRecurring: true,
          incidentCount: 2,
          lastInspectionMonthsAgo: 7,
          isInspectionOverdue: true,
          priorityScore: 88,
          urgencyLevel: 'Sangat Tinggi',
          scoreRationale: [
            { factor: 'Kategori Fasilitas Publik Vital (Penerangan Jalan Utama RT)', points: 50 },
            { factor: 'Masalah Berulang Terdeteksi pada Riwayat Simulasi (Contoh Data B)', points: 20 },
            { factor: 'Jatuh Tempo Pemeliharaan Berkala Terlampaui (Riwayat Simulasi)', points: 10 },
            { factor: 'Verifikasi Lapangan Simulasi RT Terkonfirmasi (Data B)', points: 8 }
          ],
          missingDataAlerts: [
            'Pengukuran voltase suplai malam hari belum tercatat di riwayat simulasi aset.',
            'Rekomendasi kalibrasi timer switch otomatis diperlukan.'
          ],
          recommendedAlternative: 'Penggantian Komponen Simulasi Starter/Kapasitor & Penggantian Bohlam LED 50W Simulasi',
          estimatedCost: 150000,
          analysisLabel: 'Analisis Simulasi Berbasis Aturan',
          timestamp: nowIso
        };
        updatedState.analysis = ruleAnalysis;
      }
      break;
    }

    case 'DECISION_RECORDED': {
      stepNumber = 6;
      stepName = 'Decide';
      actionName = 'KADES_SETUJUI_KEPUTUSAN_SIMULASI';
      entityId = 'DEC-DEMO-PJU-001';
      entityType = 'Decision';
      updatedState.status = 'DECISION_RECORDED';
      updatedState.currentStepIndex = 6; // ready for Step 7 Act

      const chosenAlt = extraPayload?.chosenAlternative || 'Penggantian Komponen Simulasi Starter/Kapasitor & Servis LED 50W';
      const decRec: DecisionRecord = {
        id: 'DEC-DEMO-PJU-001',
        reportId: DEMO_REPORT_ID,
        assetId: DEMO_ASSET_ID,
        decisionMakerName: actor.name,
        decisionMakerRole: actor.role,
        chosenAlternative: chosenAlt,
        justification: extraPayload?.justification || `Berdasarkan analisis aturan simulasi dan riwayat aset simulasi, disetujui keputusan simulasi perbaikan guna menjamin keselamatan warga (Contoh Data B — Simulasi Prototipe).`,
        assignedTeam: 'Pelaksana Simulasi (Contoh Data B)',
        targetHours: 24,
        estimatedBudget: 150000,
        decisionTimestamp: nowIso,
        disclaimer: 'Keputusan Simulasi untuk Demonstrasi',
        dataClassification: 'PROTOTYPE_SIMULATION'
      };
      updatedState.decision = decRec;
      updatedState.report = {
        ...updatedState.report,
        status: 'Sedang Dikerjakan',
        villageFollowUpNotes: `Keputusan Simulasi: Tindakan ${chosenAlt} ditugaskan kepada Pelaksana Simulasi (Contoh Data B).`
      };
      break;
    }

    case 'ACTION_IN_PROGRESS': {
      stepNumber = 7;
      stepName = 'Act';
      actionName = 'PELAKSANA_MULAI_TINDAKAN_SIMULASI';
      entityId = 'ACT-DEMO-PJU-001';
      entityType = 'Action';
      updatedState.status = 'ACTION_IN_PROGRESS';
      updatedState.currentStepIndex = 6;

      const actRec: ActionRecord = {
        id: 'ACT-DEMO-PJU-001',
        decisionId: 'DEC-DEMO-PJU-001',
        reportId: DEMO_REPORT_ID,
        assetId: DEMO_ASSET_ID,
        technicianName: extraPayload?.technicianName || 'Pelaksana Simulasi (Contoh Data B)',
        startedAt: nowIso,
        actionSummary: 'Pelaksanaan tindakan simulasi penggantian suku cadang dan pengecekan kelistrikan (Contoh Data B — Simulasi Prototipe).',
        componentsReplaced: extraPayload?.components || ['Komponen Starter Simulasi', 'Bohlam LED 50W Simulasi'],
        actualCost: extraPayload?.cost || 150000,
        fieldNotes: 'Sedang dilakukan pemeriksaan housing dan fitting di tiang PJU simulasi.',
        resultingCondition: 'Baik',
        status: 'IN_PROGRESS',
        dataClassification: 'PROTOTYPE_SIMULATION'
      };
      updatedState.action = actRec;
      break;
    }

    case 'RESOLVED': {
      stepNumber = 7;
      stepName = 'Act';
      actionName = 'PELAKSANA_SELESAIKAN_TINDAKAN_SIMULASI';
      entityId = 'ACT-DEMO-PJU-001';
      entityType = 'Action';
      updatedState.status = 'RESOLVED';
      updatedState.currentStepIndex = 7;

      const finishCost = extraPayload?.cost || updatedState.action?.actualCost || 150000;
      const comps = extraPayload?.components || updatedState.action?.componentsReplaced || ['Komponen Starter Simulasi', 'Bohlam LED 50W Simulasi'];

      // Finalize Action
      const finalAction: ActionRecord = {
        id: 'ACT-DEMO-PJU-001',
        decisionId: 'DEC-DEMO-PJU-001',
        reportId: DEMO_REPORT_ID,
        assetId: DEMO_ASSET_ID,
        technicianName: extraPayload?.technicianName || updatedState.action?.technicianName || 'Pelaksana Simulasi (Contoh Data B)',
        startedAt: updatedState.action?.startedAt || nowIso,
        completedAt: nowIso,
        actionSummary: 'Penggantian komponen suku cadang simulasi selesai (4/4 ceklis tuntas). Lampu menyala normal kembali.',
        componentsReplaced: comps,
        actualCost: finishCost,
        fieldNotes: 'Contoh hasil pemeriksaan simulasi stabil dan operasional terukur aman (Contoh Data B — Simulasi Prototipe).',
        resultingCondition: 'Baik',
        status: 'COMPLETED',
        dataClassification: 'PROTOTYPE_SIMULATION'
      };
      updatedState.action = finalAction;

      // Update Asset Digital Passport (prevent duplicate maintenance history entry on re-runs)
      const hasResolvedHistory = updatedState.asset.maintenanceHistory.some(
        m => m.id.startsWith('M-PJU-RESOLVED-') || m.notes?.includes(DEMO_REPORT_ID)
      );
      if (!hasResolvedHistory) {
        const newMaintenanceItem: MaintenanceRecord = {
          id: `M-PJU-RESOLVED-${Date.now()}`,
          date: nowIso.split('T')[0],
          type: '[DATA B — SIMULASI] Perbaikan Insiden: Ganti Suku Cadang Simulasi (Closed Loop)',
          cost: finishCost,
          technician: finalAction.technicianName,
          notes: `Penyelesaian Laporan ${DEMO_REPORT_ID}. Ganti komponen ${comps.join(', ')}. Contoh hasil pemeriksaan simulasi normal. Kondisi pulih Baik.`
        };

        updatedState.asset = {
          ...updatedState.asset,
          condition: 'Baik',
          maintenanceHistory: [
            newMaintenanceItem,
            ...updatedState.asset.maintenanceHistory
          ]
        };
      } else {
        updatedState.asset = {
          ...updatedState.asset,
          condition: 'Baik'
        };
      }

      // Update Report to Selesai
      updatedState.report = {
        ...updatedState.report,
        status: 'Selesai',
        villageFollowUpNotes: `Selesai: Komponen diperbaiki oleh ${finalAction.technicianName}. Siap direkam ke Memori Pengetahuan Desa.`
      };
      break;
    }

    case 'RECORDED_IN_MEMORY': {
      stepNumber = 8;
      stepName = 'Record';
      actionName = 'PERBAIKAN_SELESAI_DAN_DICATAT_KE_MEMORI';
      entityId = 'KNW-DEMO-PJU-001';
      entityType = 'Knowledge';
      updatedState.status = 'RECORDED_IN_MEMORY';
      updatedState.currentStepIndex = 7; // All completed

      const finishCost = extraPayload?.cost || updatedState.action?.actualCost || 150000;
      const comps = extraPayload?.components || updatedState.action?.componentsReplaced || ['Komponen Starter Simulasi', 'Bohlam LED 50W Simulasi'];

      // Create Knowledge Record
      const knwRecord: KnowledgeRecord = {
        id: 'KNW-DEMO-PJU-001',
        scenarioId: DEMO_SCENARIO_ID,
        reportId: DEMO_REPORT_ID,
        assetId: DEMO_ASSET_ID,
        decisionId: 'DEC-DEMO-PJU-001',
        actionId: 'ACT-DEMO-PJU-001',
        problemTitle: 'Lampu PJU Titik 04 RT 02/RW 01 Padam (Contoh Data B — Simulasi Prototipe)',
        rootCauseFound: 'Degradasi komponen starter simulasi akibat fluktuasi voltase dan masa pakai tanpa inspeksi preventif.',
        actionTakenSummary: `Penggantian komponen simulasi oleh ${updatedState.action?.technicianName || 'Pelaksana Simulasi (Contoh Data B)'} dengan contoh biaya simulasi Rp ${finishCost.toLocaleString('id-ID')}.`,
        outcomeSummary: 'Lampu PJU kembali berfungsi normal (Contoh Data B — Simulasi Prototipe).',
        totalDurationHours: 4,
        lessonsLearned: 'PJU di koridor utama RT 02 membutuhkan siklus inspeksi berkala untuk mencegah padam berulang.',
        preventiveInspectionCycle: 'Rekomendasi inspeksi tiap 90 hari',
        recordedAt: nowIso,
        dataClassification: 'PROTOTYPE_SIMULATION'
      };
      updatedState.knowledge = knwRecord;

      // Create Village Memory Item
      const memItem: HumanMemory = {
        id: 'MEM-DEMO-PJU-001',
        interviewee: 'Pak Budi Santoso & Ketua RT 02',
        role: 'Warga & Ketua RT 02 Dusun Krajan',
        period: 'Maret 2026',
        storyTitle: 'Penanganan Terpadu Padamnya PJU Titik 04 RT 02 (Contoh Data B — Simulasi Prototipe)',
        storyText: `Simulasi alur penanganan insiden infrastruktur lampu PJU RT 02 melalui Closed Knowledge Loop (Contoh Data B — Simulasi Prototipe) dari pelaporan warga, verifikasi RT, analisis histori, keputusan simulasi Kepala Desa, hingga pencatatan kembali ke memori desa oleh pelaksana simulasi.`,
        extractedKnowledge: {
          problem: 'Lampu PJU padam di koridor persimpangan jalan RT 02 Krajan.',
          location: 'RT 02 / RW 01 Dusun 1 Krajan',
          solution: 'Penggantian komponen suku cadang simulasi (Contoh Data B — Simulasi Prototipe).',
          year: 2026,
          stakeholders: ['Pak Budi Santoso (Pelapor)', 'Ketua RT 02', 'Kepala Desa', 'Pelaksana Simulasi']
        },
        tags: ['PJU', 'RT 02', 'Infrastruktur', 'Closed-Loop', 'Simulasi'],
        dateRecorded: nowIso.split('T')[0],
        relatedObject: 'Lampu PJU Titik 04 RT 02/RW 01'
      };
      updatedState.memoryRecord = memItem;
      break;
    }
  }

  // Record Audit Trail Entry
  const actorId = actor.roleType === 'rt' 
    ? 'RT-001' 
    : actor.roleType === 'warga' 
    ? 'WARGA-001' 
    : actor.roleType === 'kades' 
    ? 'KADES-001' 
    : actor.roleType === 'system' 
    ? 'SYS-001' 
    : 'PRG-001';

  const auditEntry: ClosedLoopAuditTrailEntry = {
    id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    step: stepNumber,
    stepName: stepName,
    action: actionName,
    actorId: actorId,
    actorName: actor.name,
    actorRole: actor.role,
    previousStatus: current.status,
    newStatus: updatedState.status,
    timestamp: nowIso,
    notes: note || `Perubahan status siklus tertutup menjadi ${updatedState.status}`,
    entityId: entityId,
    entityType: entityType
  };

  updatedState.auditTrail = [auditEntry, ...updatedState.auditTrail];
  saveToStorage(updatedState);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: updatedState }));
    window.dispatchEvent(new Event('storage'));
  }

  return { success: true, state: updatedState };
}

/**
 * Reset Demo Scenario ONLY without touching Data A or other simulated records
 */
export function resetDemoScenario(): ClosedLoopState {
  const fresh = getInitialClosedLoopState();
  fresh.auditTrail = [
    {
      id: `AUDIT-INIT-${Date.now()}`,
      step: 1,
      stepName: 'Capture',
      action: 'INIT_DEMO',
      actorId: 'SYS-001',
      actorName: 'Sistem Desa Black Box AI',
      actorRole: 'SYSTEM',
      previousStatus: null,
      newStatus: 'DRAFT',
      timestamp: new Date().toISOString(),
      notes: 'Inisialisasi data simulasi prototipe',
      entityId: DEMO_SCENARIO_ID,
      entityType: 'Report'
    }
  ];
  saveToStorage(fresh);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('closed-loop-state-changed', { detail: fresh }));
    window.dispatchEvent(new Event('storage'));
  }
  return fresh;
}

/**
 * Calculate Progress for the 8 Steps
 */
export function getClosedLoopProgress(state: ClosedLoopState): ClosedLoopStepInfo[] {
  const status = state.status;

  const isStep1Done = status !== 'DRAFT';
  const isStep2Done = ['VERIFIED_BY_RT', 'VILLAGE_REVIEW', 'ANALYZED', 'DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(status);
  const isStep3Done = Boolean(state.rememberRecord?.isLinked || state.stepFlags?.rememberDone || ['ANALYZED', 'DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(status));
  const isStep4Done = Boolean(state.retrievalRecord || state.stepFlags?.retrieveDone || ['ANALYZED', 'DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(status));
  const isStep5Done = ['ANALYZED', 'DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(status);
  const isStep6Done = ['DECISION_RECORDED', 'ACTION_IN_PROGRESS', 'RESOLVED', 'RECORDED_IN_MEMORY'].includes(status);
  const isStep7Done = ['RESOLVED', 'RECORDED_IN_MEMORY'].includes(status);
  const isStep8Done = status === 'RECORDED_IN_MEMORY';

  return [
    {
      stepNumber: 1,
      name: 'Capture',
      title: 'Warga Membuat Laporan PJU Padam',
      description: 'Warga RT 02 (Pak Budi) mendeteksi lampu padam dan mengirim laporan terstruktur.',
      status: isStep1Done ? 'Selesai' : 'Sedang Berjalan',
      actorName: 'Pak Budi Santoso',
      actorRole: 'Warga RT 02 / RW 01',
      targetRole: 'warga',
      targetTab: 'rtwarga',
      timestamp: state.report.createdAt,
      summary: state.report.description
    },
    {
      stepNumber: 2,
      name: 'Validate',
      title: 'Ketua RT 02 Memvalidasi Lapangan',
      description: 'Ketua RT 02 menerima notifikasi, memeriksa kondisi fisik, dan menyetujui penerusan.',
      status: isStep2Done ? 'Selesai' : isStep1Done ? 'Sedang Berjalan' : 'Belum Dimulai',
      actorName: state.validation?.validatorName || 'Pak RT Ahmad Fauzi',
      actorRole: 'Ketua RT 02 / RW 01',
      targetRole: 'rt',
      targetTab: 'rtwarga',
      timestamp: state.validation?.validationTimestamp,
      summary: state.validation?.physicalCheckSummary || 'Menunggu verifikasi lapangan oleh RT 02.'
    },
    {
      stepNumber: 3,
      name: 'Remember',
      title: 'Sistem Menghubungkan Aset & Paspor',
      description: 'Laporan ditautkan otomatis ke ID Aset AST-DEMO-PJU-RT02-004 pada paspor digital.',
      status: isStep3Done ? 'Selesai' : isStep1Done ? 'Sedang Berjalan' : 'Belum Dimulai',
      actorName: 'Sistem Desa Black Box AI',
      actorRole: 'Digital Asset Engine',
      targetRole: 'perangkat',
      targetTab: 'assets',
      summary: `ID Aset: ${state.asset.id} (${state.asset.name})`
    },
    {
      stepNumber: 4,
      name: 'Retrieve',
      title: 'Pemanggilan Histori Insiden Lampau',
      description: 'Sistem menelusuri riwayat servis sebelumnya (Agustus 2025 & November 2025).',
      status: isStep4Done ? 'Selesai' : 'Belum Dimulai',
      actorName: 'Sistem Memori Cerdas',
      actorRole: 'Knowledge Retrieval',
      targetRole: 'perangkat',
      targetTab: 'memori-objek',
      summary: `Ditemukan ${state.asset.maintenanceHistory.length} catatan riwayat servis sebelumnya.`
    },
    {
      stepNumber: 5,
      name: 'Analyze',
      title: 'Analisis Risiko & Aturan Otomatis',
      description: 'Analisis berbasis aturan menghitung urgensi simulasi (Masalah Berulang, Contoh Data B).',
      status: isStep5Done ? 'Selesai' : isStep2Done ? 'Sedang Berjalan' : 'Belum Dimulai',
      actorName: 'Sistem Rule-Based Engine',
      actorRole: 'Decision Support System',
      targetRole: 'perangkat',
      targetTab: 'dss',
      summary: state.analysis ? `Skor Urgensi ${state.analysis.priorityScore}/100 • ${state.analysis.urgencyLevel}` : undefined
    },
    {
      stepNumber: 6,
      name: 'Decide',
      title: 'Kepala Desa Menetapkan Keputusan',
      description: 'Kepala Desa menyetujui keputusan simulasi perbaikan untuk demonstrasi.',
      status: isStep6Done ? 'Selesai' : isStep5Done ? 'Sedang Berjalan' : 'Belum Dimulai',
      actorName: state.decision?.decisionMakerName || 'Drs. H. Bambang Suwondo',
      actorRole: 'Kepala Desa Talangagung',
      targetRole: 'kades',
      targetTab: 'dss',
      timestamp: state.decision?.decisionTimestamp,
      summary: state.decision?.chosenAlternative || 'Menunggu penetapan keputusan simulasi oleh Kepala Desa.'
    },
    {
      stepNumber: 7,
      name: 'Act',
      title: 'Pelaksana Simulasi Mengeksekusi Tindakan',
      description: 'Pelaksana simulasi melakukan penggantian komponen suku cadang simulasi (Contoh Data B).',
      status: isStep7Done ? 'Selesai' : status === 'ACTION_IN_PROGRESS' ? 'Sedang Berjalan' : 'Belum Dimulai',
      actorName: state.action?.technicianName || 'Pelaksana Simulasi (Contoh Data B)',
      actorRole: 'Pelaksana Lapangan Simulasi',
      targetRole: 'perangkat',
      targetTab: 'preventive',
      timestamp: state.action?.startedAt,
      summary: state.action?.actionSummary || 'Menunggu penugasan pelaksana simulasi.'
    },
    {
      stepNumber: 8,
      name: 'Record',
      title: 'Pencatatan Permanen ke Memori & Paspor Aset',
      description: 'Hasil tindakan dicatat ke Paspor Aset, Memori Desa, dan Knowledge Record untuk AI.',
      status: isStep8Done ? 'Selesai' : status === 'RESOLVED' ? 'Sedang Berjalan' : 'Belum Dimulai',
      actorName: 'Sistem Desa Black Box AI',
      actorRole: 'Knowledge Vault',
      targetRole: 'warga',
      targetTab: 'assistant',
      timestamp: state.knowledge?.recordedAt,
      summary: state.knowledge ? `Tercatat sebagai KNW-DEMO-PJU-001 • Aset pulih Baik.` : 'Menunggu penyelesaian siklus.'
    }
  ];
}
