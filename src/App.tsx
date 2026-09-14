import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ModulRtWarga } from './components/ModulRtWarga';
import { Modul1Knowledge } from './components/Modul1Knowledge';
import { Modul2Assets } from './components/Modul2Assets';
import { Modul3Assistant } from './components/Modul3Assistant';
import { Modul4History } from './components/Modul4History';
import { ModulMemoriHistoris } from './components/ModulMemoriHistoris';
import { MemoriHistorisObjek } from './components/MemoriHistorisObjek';
import { Modul5DecisionSupport } from './components/Modul5DecisionSupport';
import { MataElangExecutiveDashboard } from './components/MataElangExecutiveDashboard';
import { AboutSystemView } from './components/AboutSystemView';
import { ProfilDesa } from './components/ProfilDesa';
import { PetaDesaInteraktif } from './components/PetaDesaInteraktif';
import { ModulTeachingFactory } from './components/ModulTeachingFactory';
import { ModulPreventiveMaintenance } from './components/ModulPreventiveMaintenance';
import { ModulIoTSensors } from './components/ModulIoTSensors';
import { ModulBursaKerja } from './components/ModulBursaKerja';
import { ModulEtalaseBumdes } from './components/ModulEtalaseBumdes';
import { EmergencySosModal } from './components/EmergencySosModal';
import { PanduanJuriModal } from './components/PanduanJuriModal';
import { ClosedLoopDemonstrationWidget } from './components/ClosedLoopDemonstrationWidget';
import { stopSpeech } from './utils/speech';
import { AlertOctagon, Navigation, Check, Radio } from 'lucide-react';
import { 
  subscribeToClosedLoop, 
  getClosedLoopState, 
  transitionReportStatus, 
  DEMO_REPORT_ID, 
  DEMO_ASSET_ID,
  ClosedLoopState,
  toggleMaintenanceChecklistItem,
  setMaintenanceChecklistAllDone
} from './utils/closedLoopStore';

import { 
  initialVillageProfile, 
  initialDocuments, 
  initialAssets, 
  initialHumanMemories, 
  initialHistoryMilestones, 
  initialRecommendations,
  initialCitizenReports,
  initialLetterRequests,
  initialAnnouncements,
  initialPreventiveTasks,
  initialIoTSensors,
  initialJobVacancies,
  initialBumdesProducts
} from './data/mockDesaData';

import { 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  HistoryMilestone, 
  DecisionRecommendation, 
  MaintenanceRecord,
  UserContext,
  UserRoleType,
  CitizenReport,
  LetterRequest,
  BroadcastAnnouncement,
  PreventiveTask,
  IoTSensorNode,
  JobVacancy,
  BumdesProduct,
  EmergencyAlert
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teachingMode, setTeachingMode] = useState(false);
  const [activeQuickPrompt, setActiveQuickPrompt] = useState('');
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isJudgeGuideOpen, setIsJudgeGuideOpen] = useState(false);
  
  // Hierarchical User Context (Warga / RT / RW / Kades)
  const [userContext, setUserContext] = useState<UserContext>({
    id: 'WARGA-001',
    citizenId: 'WARGA-001',
    role: 'warga',
    name: 'Pak Budi Santoso',
    rt: 'RT 02',
    rw: 'RW 01',
    dusun: 'Dusun 1 (Krajan)',
    phone: '0812-3456-7890'
  });

  // Auto-open Judge Guide Modal on first visit
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('hasSeenJudgeGuide');
      if (!hasSeen) {
        setIsJudgeGuideOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Senior & Universal Accessibility: Font Size Mode ('normal' | 'large' | 'extralarge')
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'extralarge'>(() => {
    try {
      const saved = localStorage.getItem('desa_blackbox_font_size');
      if (saved === 'large' || saved === 'extralarge' || saved === 'normal') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'normal';
  });

  // Apply font size class and root HTML style dynamically
  useEffect(() => {
    try {
      localStorage.setItem('desa_blackbox_font_size', fontSizeMode);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.classList.remove('font-mode-normal', 'font-mode-large', 'font-mode-extralarge');
    root.classList.add(`font-mode-${fontSizeMode}`);
    
    if (fontSizeMode === 'extralarge') {
      root.style.fontSize = '21.5px';
    } else if (fontSizeMode === 'large') {
      root.style.fontSize = '18.5px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSizeMode]);

  // State collections
  const [villageProfile, setVillageProfile] = useState(initialVillageProfile);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [assets, setAssets] = useState<AssetItem[]>(initialAssets);
  const [memories, setMemories] = useState<HumanMemory[]>(initialHumanMemories);
  const [history, setHistory] = useState<HistoryMilestone[]>(initialHistoryMilestones);
  const [recommendations, setRecommendations] = useState<DecisionRecommendation[]>(initialRecommendations);
  
  // RT & Citizen Governance Data
  const [reports, setReports] = useState<CitizenReport[]>(initialCitizenReports);
  const [letters, setLetters] = useState<LetterRequest[]>(initialLetterRequests);
  const [announcements, setAnnouncements] = useState<BroadcastAnnouncement[]>(initialAnnouncements);
  const [activeEmergencyAlerts, setActiveEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [rtWargaSubTab, setRtWargaSubTab] = useState<'surat' | 'laporan' | 'pengumuman'>('surat');
  const [rtWargaOpenReport, setRtWargaOpenReport] = useState(false);

  // 4 New Recommended Features State
  const [preventiveTasks, setPreventiveTasks] = useState<PreventiveTask[]>(initialPreventiveTasks);
  const [ioTSensors, setIoTSensors] = useState<IoTSensorNode[]>(initialIoTSensors);
  const [jobVacancies, setJobVacancies] = useState<JobVacancy[]>(initialJobVacancies);
  const [bumdesProducts, setBumdesProducts] = useState<BumdesProduct[]>(initialBumdesProducts);

  // Handlers for Preventive Maintenance
  const handleAddPreventiveTask = (newTask: PreventiveTask) => {
    setPreventiveTasks(prev => [newTask, ...prev]);
  };

  const handleToggleChecklist = (taskId: string, itemIdx: number) => {
    if (taskId === 'TASK-DEMO-PJU-001') {
      const itemId = `chk-pju-0${itemIdx + 1}`;
      toggleMaintenanceChecklistItem(itemId, userContext.name);
    }
    setPreventiveTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedChecklist = [...t.checklist];
        if (updatedChecklist[itemIdx]) {
          updatedChecklist[itemIdx] = {
            ...updatedChecklist[itemIdx],
            done: !updatedChecklist[itemIdx].done
          };
        }
        return { ...t, checklist: updatedChecklist };
      }
      return t;
    }));
  };

  const handleCompleteTask = (taskId: string) => {
    if (taskId === 'TASK-DEMO-PJU-001') {
      setMaintenanceChecklistAllDone(userContext.name);
    }
    setPreventiveTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'Selesai',
          checklist: t.checklist.map(c => ({ ...c, done: true }))
        };
      }
      return t;
    }));
  };

  // Handlers for Job Market & BUMDes
  const handleAddVacancy = (newVac: JobVacancy) => {
    setJobVacancies(prev => [newVac, ...prev]);
  };

  const handleAddBumdesProduct = (newProd: BumdesProduct) => {
    setBumdesProducts(prev => [newProd, ...prev]);
  };

  // Stop any active speech synthesis when changing tabs
  useEffect(() => {
    stopSpeech();
  }, [activeTab]);

  // Safeguard: reset activeTab to 'dashboard' if switching to Warga while on a restricted technical tab
  useEffect(() => {
    const citizenAllowedTabs = ['dashboard', 'rtwarga', 'assets', 'assistant', 'profil-desa', 'bumdes', 'peta-desa'];
    if (userContext.role === 'warga' && !citizenAllowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [userContext.role, activeTab]);

  // Synchronize Closed Knowledge Loop Store across all App State collections
  useEffect(() => {
    const unsub = subscribeToClosedLoop((clState) => {
      // 1. Sync Report
      setReports(prev => {
        if (clState.status === 'DRAFT') {
          return prev.filter(r => r.id !== DEMO_REPORT_ID);
        }
        const exists = prev.some(r => r.id === DEMO_REPORT_ID);
        if (exists) {
          return prev.map(r => r.id === DEMO_REPORT_ID ? clState.report : r);
        }
        return [clState.report, ...prev];
      });

      // 2. Sync Asset
      if (clState.asset) {
        setAssets(prev => prev.map(a => a.id === DEMO_ASSET_ID ? clState.asset : a));
      }

      // 3. Sync Recommendation when analyzed or decided
      if (clState.analysis) {
        const demoRecId = 'REC-DEMO-PJU-001';
        const demoRec: DecisionRecommendation = {
          id: demoRecId,
          title: 'Perbaikan Sistem Kelistrikan & Lampu PJU Titik 04 RT 02 (Simulasi)',
          category: 'Infrastruktur',
          urgencyScore: clState.analysis.priorityScore,
          urgencyLevel: clState.analysis.urgencyLevel as any,
          estimatedBudget: clState.analysis.estimatedCost,
          rationale: `Analisis Aturan Simulasi (Skor ${clState.analysis.priorityScore}/100): ${clState.analysis.scoreRationale.map(r => r.factor).join('; ')}`,
          sourceAssets: [clState.asset.name],
          sourceDocs: ['Katalog SOP Pemeliharaan Sarpras RT'],
          sourceMemories: ['Catatan Servis PJU RT 02 Dusun Krajan'],
          citizenImpact: 'Memulihkan penerangan jalan bagi 65 KK warga RT 02.',
          draftProposalText: `USULAN TINDAKAN: ${clState.analysis.recommendedAlternative}`,
          status: clState.status === 'ANALYZED' ? 'Draf AI' : 'Disetujui Kades'
        };

        setRecommendations(prev => {
          const idx = prev.findIndex(r => r.id === demoRecId);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = demoRec;
            return copy;
          }
          return [demoRec, ...prev];
        });
      } else {
        setRecommendations(prev => prev.filter(r => r.id !== 'REC-DEMO-PJU-001'));
      }

      // 4. Sync Memory when recorded
      if (clState.memoryRecord) {
        setMemories(prev => {
          const exists = prev.some(m => m.id === clState.memoryRecord?.id);
          if (exists) return prev;
          return [clState.memoryRecord!, ...prev];
        });
      } else {
        setMemories(prev => prev.filter(m => m.id !== 'SIM-REC-PJU-RT02-004'));
      }

      // 5. Sync Preventive Task when decided or action in progress
      if (clState.decision || clState.action) {
        const demoTaskId = 'TASK-DEMO-PJU-001';
        const isDone = clState.status === 'RECORDED_IN_MEMORY' || clState.status === 'RESOLVED';
        const inProg = clState.status === 'ACTION_IN_PROGRESS';
        
        const savedCompletedIds = clState.maintenanceChecklist?.completedItemIds;
        const isItemDone = (itemId: string, fallback: boolean) => {
          if (savedCompletedIds !== undefined) {
            return savedCompletedIds.includes(itemId);
          }
          return isDone || fallback;
        };

        const demoTask: PreventiveTask = {
          id: demoTaskId,
          assetId: DEMO_ASSET_ID,
          assetName: clState.asset.name,
          location: clState.asset.rtRw,
          category: 'Penerangan Jalan',
          intervalType: 'Semesteran',
          lastServiceDate: '2025-11-14',
          nextDueDate: '2026-03-02',
          status: isDone ? 'Selesai' : inProg ? 'Terjadwal' : 'Jatuh Tempo Segera',
          priority: 'Kritis',
          assignedTechnician: clState.action?.technicianName || 'Pelaksana Simulasi (Contoh Data B)',
          estimatedCost: clState.decision?.estimatedBudget || 150000,
          checklist: [
            { item: 'Pemeriksaan suplai fitting tiang simulasi', done: isItemDone('chk-pju-01', inProg) },
            { item: 'Penggantian suku cadang simulasi', done: isItemDone('chk-pju-02', inProg) },
            { item: 'Pemasangan bohlam LED simulasi baru', done: isItemDone('chk-pju-03', false) },
            { item: 'Pemeriksaan operasional simulasi stabil', done: isItemDone('chk-pju-04', false) }
          ]
        };

        setPreventiveTasks(prev => {
          const idx = prev.findIndex(t => t.id === demoTaskId);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = demoTask;
            return copy;
          }
          return [demoTask, ...prev];
        });
      } else {
        setPreventiveTasks(prev => prev.filter(t => t.id !== 'TASK-DEMO-PJU-001'));
      }
    });

    return () => unsub();
  }, []);

  // Handlers for Citizen & RT Governance
  const handleAddReport = (newReport: CitizenReport) => {
    setReports(prev => [newReport, ...prev]);
    if (newReport.id === DEMO_REPORT_ID || newReport.title.includes('PJU Titik 04')) {
      transitionReportStatus(
        'SUBMITTED',
        { name: userContext.name, role: 'Warga RT 02', roleType: 'warga' },
        newReport.description
      );
    }
  };

  const handleAddLetter = (newLetter: LetterRequest) => {
    setLetters(prev => [newLetter, ...prev]);
  };

  const handleApproveLetter = (letterId: string, rtCode: string, notes?: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setLetters(prev => prev.map(l => {
      if (l.id === letterId) {
        const newAuditEntry = {
          timestamp,
          actor: `${userContext.name} (${userContext.role.toUpperCase()})`,
          action: 'Verifikasi & Otorisasi Surat RT',
          previousStatus: l.status,
          newStatus: 'Disetujui RT',
          notes: notes || `Disetujui dengan stempel QR ${rtCode}`
        };
        return {
          ...l,
          status: 'Disetujui RT',
          approvedAt: timestamp,
          rtStampCode: rtCode,
          auditTrail: l.auditTrail ? [...l.auditTrail, newAuditEntry] : [newAuditEntry]
        };
      }
      return l;
    }));
  };

  const handleVerifyReport = (reportId: string, notes: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    if (reportId === DEMO_REPORT_ID) {
      transitionReportStatus(
        'VERIFIED_BY_RT',
        { name: userContext.name, role: userContext.role === 'rt' ? 'Ketua RT 02' : 'Ketua RT', roleType: 'rt' },
        notes,
        { validationNote: notes }
      );
    }
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const newAuditEntry = {
          timestamp,
          actor: `${userContext.name} (${userContext.role.toUpperCase()})`,
          action: 'Pemeriksaan Lapangan & Disposisi RT',
          previousStatus: r.status,
          newStatus: 'Diteruskan ke Pemerintah Desa',
          notes
        };
        return {
          ...r,
          status: 'Diteruskan ke Pemerintah Desa',
          verifiedByRtAt: timestamp,
          rtNotes: notes,
          auditTrail: r.auditTrail ? [...r.auditTrail, newAuditEntry] : [newAuditEntry]
        };
      }
      return r;
    }));
  };

  const handleAddAnnouncement = (newAnn: BroadcastAnnouncement) => {
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  // Handlers for core modules
  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleAddMemory = (newMem: HumanMemory) => {
    setMemories(prev => [newMem, ...prev]);
  };

  const handleAddAsset = (newAsset: AssetItem) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleAddMaintenanceRecord = (assetId: string, record: MaintenanceRecord) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          maintenanceHistory: [...a.maintenanceHistory, record]
        };
      }
      return a;
    }));
  };

  const handleAddMilestone = (newMs: HistoryMilestone) => {
    setHistory(prev => [...prev, newMs]);
  };

  const handleAddRecommendation = (newRec: DecisionRecommendation) => {
    setRecommendations(prev => [newRec, ...prev]);
  };

  const handleDispatchEmergencyAlert = (alert: EmergencyAlert) => {
    setActiveEmergencyAlerts(prev => [alert, ...prev]);
  };

  const handleDismissEmergencyAlert = (alertId: string) => {
    setActiveEmergencyAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleGlobalSearch = (query: string) => {
    setActiveQuickPrompt(query);
    setActiveTab('assistant');
  };

  const handleRunQuickPrompt = (promptText: string) => {
    setActiveQuickPrompt(promptText);
    setActiveTab('assistant');
  };

  const handleNavigateTabWithRole = (tabId: string, customRole?: UserRoleType) => {
    let resolvedTab = tabId;
    if (tabId === 'rt-warga') resolvedTab = 'rtwarga';
    if (tabId === 'mata-elang') resolvedTab = 'dss';
    if (tabId === 'memori-objek' || tabId === 'paspor' || tabId === 'passport') resolvedTab = 'assets';
    if (tabId === 'peta') resolvedTab = 'peta-desa';

    if (resolvedTab === 'rtwarga') {
      if (customRole === 'warga') {
        setRtWargaSubTab('laporan');
        setRtWargaOpenReport(true);
      } else if (customRole === 'rt') {
        setRtWargaSubTab('laporan');
        setRtWargaOpenReport(false);
      }
    }

    if (customRole && customRole !== userContext.role) {
      if (customRole === 'kades') {
        setUserContext({
          id: 'KADES-001',
          citizenId: 'KADES-001',
          role: 'kades',
          name: villageProfile.kadesName,
          rt: 'RT 01',
          rw: 'RW 01',
          dusun: 'Dusun 1 (Krajan)',
          phone: '0811-6666-7777'
        });
      } else if (customRole === 'perangkat') {
        setUserContext({
          id: 'PERANGKAT-001',
          citizenId: 'PERANGKAT-001',
          role: 'perangkat',
          name: 'Ibu Siti Rahma, S.AP',
          rt: 'RT 01',
          rw: 'RW 01',
          dusun: 'Dusun 1 (Krajan)',
          phone: '0812-8888-9999'
        });
      } else if (customRole === 'rt') {
        setUserContext({
          id: 'RT-001',
          citizenId: 'RT-001',
          role: 'rt',
          name: 'Pak RT Ahmad Fauzi',
          rt: 'RT 02',
          rw: 'RW 01',
          dusun: 'Dusun 1 (Krajan)',
          phone: '0813-2222-3333'
        });
      } else if (customRole === 'rw') {
        setUserContext({
          id: 'RW-001',
          citizenId: 'RW-001',
          role: 'rw',
          name: 'Pak RW Sutrisno',
          rt: 'RT 01',
          rw: 'RW 01',
          dusun: 'Dusun 1 (Krajan)',
          phone: '0812-9999-0000'
        });
      } else if (customRole === 'warga') {
        setUserContext({
          id: 'WARGA-001',
          citizenId: 'WARGA-001',
          role: 'warga',
          name: 'Pak Budi Santoso',
          rt: 'RT 02',
          rw: 'RW 01',
          dusun: 'Dusun 1 (Krajan)',
          phone: '0812-3456-7890'
        });
      }
    }
    setActiveTab(resolvedTab);
  };

  // Determine root font scale class
  const fontClass = fontSizeMode === 'extralarge' 
    ? 'text-[18px]' 
    : fontSizeMode === 'large' 
      ? 'text-[16px]' 
      : 'text-[14px]';

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white font-mode-${fontSizeMode} ${fontClass}`}>
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        villageProfile={villageProfile}
        userContext={userContext}
        onChangeUserContext={setUserContext}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenJudgeGuide={() => setIsJudgeGuideOpen(true)}
        teachingMode={teachingMode}
        setTeachingMode={setTeachingMode}
        onGlobalSearch={handleGlobalSearch}
        fontSizeMode={fontSizeMode}
        setFontSizeMode={setFontSizeMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Closed Knowledge Loop End-to-End Live Workflow Widget */}
        <div className="mb-6">
          <ClosedLoopDemonstrationWidget
            currentUserContext={userContext}
            onNavigateToTab={handleNavigateTabWithRole}
            onChangeUserContext={setUserContext}
          />
        </div>

        {/* Active Emergency SOS Broadcast Alert Banners */}
        {activeEmergencyAlerts.length > 0 && (
          <div className="space-y-3 mb-6">
            {activeEmergencyAlerts.map(alert => (
              <div 
                key={alert.id}
                className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-red-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-300"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-pulse mt-0.5">
                    <AlertOctagon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-white text-red-700 rounded-md font-black text-[10px] uppercase tracking-wider">
                        🚨 ALARM SOS DARURAT AKTIF (#{alert.id})
                      </span>
                      <span className="text-[11px] text-red-100 font-semibold">{alert.timestamp}</span>
                    </div>
                    <h4 className="text-base font-extrabold">{alert.category} — {alert.location}</h4>
                    <p className="text-xs text-red-100 mt-0.5 leading-relaxed">
                      Pelapor: <strong>{alert.reporterName}</strong> ({alert.reporterPhone}) • Catatan: {alert.notes}
                    </p>
                    {alert.gpsCoords && (
                      <div className="flex items-center gap-1 text-[11px] text-red-200 mt-1 font-mono">
                        <Navigation className="w-3 h-3" />
                        <span>GPS: {alert.gpsCoords.latitude}, {alert.gpsCoords.longitude} (Akurasi ±{alert.gpsCoords.accuracy || 15}m)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDismissEmergencyAlert(alert.id)}
                    className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Tandai Selesai / Tangani</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {teachingMode && (
          <div className="bg-white border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md font-bold text-xs uppercase tracking-wider">
                SMK AI
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Mode Praktik SMK Aktif</h4>
                <p className="text-[11px] text-slate-600">
                  Laboratorium pembelajaran digitalisasi desa & rekayasa prompt AI untuk siswa.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('tefa')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
            >
              Ruang Praktik SMK
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            villageProfile={villageProfile}
            userContext={userContext}
            documents={documents}
            assets={assets}
            memories={memories}
            history={history}
            recommendations={recommendations}
            reports={reports}
            letters={letters}
            announcements={announcements}
            setActiveTab={setActiveTab}
            onOpenSos={() => setIsSosOpen(true)}
            onRunQuickPrompt={handleRunQuickPrompt}
            onApproveLetter={handleApproveLetter}
            onVerifyReport={handleVerifyReport}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}

        {activeTab === 'rtwarga' && (
          <ModulRtWarga 
            villageProfile={villageProfile}
            userContext={userContext}
            reports={reports}
            letters={letters}
            announcements={announcements}
            onAddReport={handleAddReport}
            onAddLetter={handleAddLetter}
            onApproveLetter={handleApproveLetter}
            onVerifyReport={handleVerifyReport}
            onAddAnnouncement={handleAddAnnouncement}
            onOpenWhatsAppBot={() => setActiveTab('assistant')}
            initialSubTab={rtWargaSubTab}
            initialOpenReportModal={rtWargaOpenReport}
          />
        )}

        {activeTab === 'preventive' && (
          <ModulPreventiveMaintenance 
            tasks={preventiveTasks}
            assets={assets}
            onAddTask={handleAddPreventiveTask}
            onToggleChecklist={handleToggleChecklist}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {activeTab === 'iot' && (
          <ModulIoTSensors 
            sensors={ioTSensors}
          />
        )}

        {activeTab === 'jobs' && (
          <ModulBursaKerja 
            vacancies={jobVacancies}
            onAddVacancy={handleAddVacancy}
          />
        )}

        {activeTab === 'bumdes' && (
          <ModulEtalaseBumdes 
            products={bumdesProducts}
            onAddProduct={handleAddBumdesProduct}
          />
        )}

        {activeTab === 'knowledge' && (
          <Modul1Knowledge 
            documents={documents}
            memories={memories}
            onAddDocument={handleAddDocument}
            onAddMemory={handleAddMemory}
          />
        )}

        {activeTab === 'assets' && (
          <Modul2Assets 
            assets={assets}
            onAddAsset={handleAddAsset}
            onAddMaintenanceRecord={handleAddMaintenanceRecord}
            onNavigateToMap={() => setActiveTab('peta-desa')}
          />
        )}

        {activeTab === 'assistant' && (
          <Modul3Assistant 
            villageProfile={villageProfile}
            documents={documents}
            assets={assets}
            memories={memories}
            userContext={userContext}
            initialPrompt={activeQuickPrompt}
            reports={reports}
            letters={letters}
            preventiveTasks={preventiveTasks}
            ioTSensors={ioTSensors}
            jobVacancies={jobVacancies}
            bumdesProducts={bumdesProducts}
          />
        )}

        {activeTab === 'about' && (
          <AboutSystemView 
            villageProfile={villageProfile}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'profil-desa' && (
          <ProfilDesa 
            villageProfile={villageProfile}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'peta-desa' && (
          <PetaDesaInteraktif 
            villageProfile={villageProfile}
            userContext={userContext}
            onNavigateTab={setActiveTab}
            onOpenSos={() => setIsSosOpen(true)}
          />
        )}

        {activeTab === 'history' && (
          <Modul4History 
            history={history}
            onAddMilestone={handleAddMilestone}
            onNavigateToTpa={() => setActiveTab('memori-tpa')}
          />
        )}

        {activeTab === 'memori-objek' && (
          <MemoriHistorisObjek />
        )}

        {activeTab === 'memori-tpa' && (
          <ModulMemoriHistoris 
            onNavigateToDocs={() => setActiveTab('knowledge')}
          />
        )}

        {activeTab === 'dss' && (
          userContext.role === 'kades' ? (
            <MataElangExecutiveDashboard 
              recommendations={recommendations}
              villageProfile={villageProfile}
              assets={assets}
              documents={documents}
              memories={memories}
              reports={reports}
              letters={letters}
              onAddRecommendation={handleAddRecommendation}
              onNavigateTab={setActiveTab}
            />
          ) : (
            <Modul5DecisionSupport 
              recommendations={recommendations}
              villageProfile={villageProfile}
              assets={assets}
              documents={documents}
              memories={memories}
              reports={reports}
              letters={letters}
              onAddRecommendation={handleAddRecommendation}
            />
          )
        )}

        {activeTab === 'tefa' && (
          <ModulTeachingFactory 
            villageProfile={villageProfile}
          />
        )}
      </main>

      {/* 24-Hour Emergency SOS Modal */}
      <EmergencySosModal 
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        userRt={userContext.rt}
        dusun={userContext.dusun}
        onDispatchAlert={handleDispatchEmergencyAlert}
      />

      {/* Interactive Guide for Judges & Evaluators */}
      <PanduanJuriModal 
        isOpen={isJudgeGuideOpen}
        onClose={() => setIsJudgeGuideOpen(false)}
        onNavigateToTab={handleNavigateTabWithRole}
        villageProfile={villageProfile}
        currentUserContext={userContext}
        onChangeUserContext={setUserContext}
      />
    </div>
  );
}
