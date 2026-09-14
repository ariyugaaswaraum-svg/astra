import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  Sparkles, 
  FileText,
  Filter,
  ShieldCheck,
  ChevronRight,
  Activity,
  Gauge
} from 'lucide-react';
import { PreventiveTask, AssetItem } from '../types';
import { 
  useClosedLoopState, 
  transitionReportStatus, 
  DEMO_ASSET_ID,
  completeAllMaintenanceChecklist,
  toggleMaintenanceChecklistItem 
} from '../utils/closedLoopStore';
import { speakText } from '../utils/speech';
import { DataClassificationBadge } from './DataClassificationBadge';

interface ModulPreventiveMaintenanceProps {
  tasks: PreventiveTask[];
  assets: AssetItem[];
  onAddTask: (task: PreventiveTask) => void;
  onToggleChecklist: (taskId: string, itemIndex: number) => void;
  onCompleteTask: (taskId: string) => void;
}

export const ModulPreventiveMaintenance: React.FC<ModulPreventiveMaintenanceProps> = ({
  tasks,
  assets,
  onAddTask,
  onToggleChecklist,
  onCompleteTask
}) => {
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Jatuh Tempo Segera' | 'Terjadwal' | 'Selesai'>('Semua');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('TASK-DEMO-PJU-001');
  const [showAddModal, setShowAddModal] = useState(false);

  const clState = useClosedLoopState();

  // Dynamically resolve activeTask so checklist updates are never stale
  const activeTask = tasks.find(t => t.id === selectedTaskId) || 
    tasks.find(t => t.id === 'TASK-DEMO-PJU-001' || t.assetId === DEMO_ASSET_ID) || 
    tasks[0] || 
    null;

  // Form State for new preventive task
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('Mesin Pertanian');
  const [intervalType, setIntervalType] = useState<'Jam Operasional' | 'Bulanan' | 'Semesteran' | 'Musiman'>('Bulanan');
  const [dueDate, setDueDate] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('Siswa TEFA SMK Mitra & Teknisi Desa');
  const [priority, setPriority] = useState<'Kritis' | 'Tinggi' | 'Rutin'>('Tinggi');
  const [estimatedCost, setEstimatedCost] = useState(500000);
  const [checklistItemsText, setChecklistItemsText] = useState("Pengecekan oli & filter\nPembersihan kisi saringan\nUji performa operasional 15 menit");

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'Semua') return true;
    return t.status === activeFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === selectedAssetId);
    if (!taskTitle.trim() || !targetAsset) return;

    const checklist = checklistItemsText
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => ({ item, done: false }));

    const newTask: PreventiveTask = {
      id: `PM-${Date.now().toString().slice(-4)}`,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      category,
      taskTitle,
      intervalType,
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'Terjadwal',
      assignedTechnician,
      priority,
      checklist,
      estimatedCost: Number(estimatedCost) || 300000
    };

    onAddTask(newTask);
    setSelectedTaskId(newTask.id);
    setShowAddModal(false);
    setTaskTitle('');
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Kritis':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Tinggi':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Jatuh Tempo Segera':
        return 'bg-rose-500 text-white animate-pulse';
      case 'Selesai':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span>Manajemen Siklus Hidup Aset Bermesin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Perawatan Preventif (Preventive Maintenance)
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Jadwal servis berkala traktor, pompa air, armada sampah, & genset desa sebelum terjadi kerusakan fatal.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Servis Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Agenda Servis</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{tasks.length} Jadwal</p>
          <span className="text-[11px] text-slate-500">Mencakup alsintan & armada desa</span>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
            <span>Jatuh Tempo Segera</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">
            {tasks.filter(t => t.status === 'Jatuh Tempo Segera').length} Unit Mesin
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Perlu tindakan minggu ini</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>Keterlibatan Siswa TEFA</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">100% Terjadwal</p>
          <span className="text-[11px] text-emerald-600 font-medium">Kolaborasi SMK & BUMDes</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span>Estimasi Biaya Hemat</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">
            Rp {(tasks.reduce((sum, t) => sum + t.estimatedCost, 0) / 1000000).toFixed(1)} Jt
          </p>
          <span className="text-[11px] text-blue-600 font-medium">Cegah belanja mesin baru</span>
        </div>
      </div>

      {/* Main Content Layout: Task List + Detailed Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Task Feed */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {(['Semua', 'Jatuh Tempo Segera', 'Terjadwal', 'Selesai'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === f 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List of Tasks */}
          <div className="space-y-3">
            {filteredTasks.map(task => {
              const isSelected = activeTask?.id === task.id;
              const completedCount = task.checklist.filter(c => c.done).length;
              const progressPct = task.checklist.length > 0 ? Math.round((completedCount / task.checklist.length) * 100) : 0;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                        Prioritas {task.priority}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug">
                        {task.taskTitle}
                      </h4>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">
                        {task.assetName}
                      </p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Progress & Due Date */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Jatuh Tempo: {task.dueDate}</span>
                    </div>
                    <span className="font-bold text-slate-700">
                      {completedCount}/{task.checklist.length} Ceklis ({progressPct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Task Detail & Interactive Checklist */}
        <div className="lg:col-span-7">
          {activeTask ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${getStatusBadge(activeTask.status)}`}>
                      {activeTask.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activeTask.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {activeTask.taskTitle}
                  </h3>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Aset: <strong className="text-slate-800">{activeTask.assetName}</strong> • Interval: {activeTask.intervalType}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-semibold block">Estimasi Anggaran</span>
                  <span className="text-base font-black text-blue-600">
                    Rp {activeTask.estimatedCost.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Teknisi Bertugas</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{activeTask.assignedTechnician}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tenggat Waktu</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{activeTask.dueDate}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kategori Aset</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{activeTask.category}</p>
                </div>
              </div>

              {/* Checklist Section */}
              <div>
                {(() => {
                  const isDemoTask = activeTask.id === 'TASK-DEMO-PJU-001' || activeTask.assetId === DEMO_ASSET_ID;
                  const savedCompletedIds = isDemoTask ? clState.maintenanceChecklist?.completedItemIds : null;
                  const checkItemDone = (idx: number, fallback: boolean) => {
                    if (savedCompletedIds) {
                      return savedCompletedIds.includes(`chk-pju-0${idx + 1}`);
                    }
                    return fallback;
                  };
                  const doneCount = activeTask.checklist.filter((item, idx) => checkItemDone(idx, item.done)).length;
                  const allDone = doneCount === activeTask.checklist.length;

                  return (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                          <span>Lembar Ceklis Inspeksi Teknisi / Siswa</span>
                          <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold ml-1">
                            {doneCount}/{activeTask.checklist.length} Selesai
                          </span>
                        </h4>
                        {!allDone && (
                          <button
                            type="button"
                            onClick={() => {
                              completeAllMaintenanceChecklist(activeTask.id, 'Pelaksana Lapangan (SMK & Teknisi Desa)');
                              onCompleteTask(activeTask.id);
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-all"
                          >
                            Tandai Semua (4/4) Selesai
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {activeTask.checklist.map((item, idx) => {
                          const itemDone = checkItemDone(idx, item.done);
                          return (
                            <label
                              key={idx}
                              className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                                itemDone 
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={itemDone}
                                onChange={() => {
                                  if (isDemoTask) {
                                    toggleMaintenanceChecklistItem(`chk-pju-0${idx + 1}`, 'Pelaksana Lapangan');
                                  }
                                  onToggleChecklist(activeTask.id, idx);
                                }}
                                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                              />
                              <span className={`text-xs font-semibold ${itemDone ? 'line-through opacity-80' : ''}`}>
                                {item.item}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Riwayat servis otomatis tercatat ke buku memori desa</span>
                  {(activeTask.id === 'TASK-DEMO-PJU-001' || activeTask.assetId === DEMO_ASSET_ID) && (
                    <DataClassificationBadge classification="PROTOTYPE_SIMULATION" size="sm" />
                  )}
                </div>

                {/* Special Closed Knowledge Loop Interactive Actions */}
                {(activeTask.id === 'TASK-DEMO-PJU-001' || activeTask.assetId === DEMO_ASSET_ID) && clState.status === 'DECISION_RECORDED' ? (
                  <button
                    onClick={() => {
                      transitionReportStatus(
                        'ACTION_IN_PROGRESS',
                        { name: 'Eko Prasetyo (Teknisi BUMDes)', role: 'Teknisi BUMDes & Sarpras Desa', roleType: 'perangkat' },
                        'Mulai pekerjaan perbaikan lapangan: Pembongkaran housing lampu PJU Titik 04 RT 02.'
                      );
                      speakText('Perbaikan lapangan dimulai oleh Teknisi BUMDes.');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Mulai Pengerjaan Lapangan</span>
                  </button>
                ) : (activeTask.id === 'TASK-DEMO-PJU-001' || activeTask.assetId === DEMO_ASSET_ID) && clState.status === 'ACTION_IN_PROGRESS' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        transitionReportStatus(
                          'RESOLVED',
                          { name: 'Tim Pelaksana Teknis', role: 'Teknisi Lapangan', roleType: 'perangkat' },
                          'Pekerjaan lapangan selesai: Komponen fitting & lampu LED berhasil diganti. Lampu menyala normal.',
                          { cost: 150000, components: ['Starter Lampu', 'Bohlam LED 50W'] }
                        );
                        speakText('Pekerjaan perbaikan di lapangan selesai diverifikasi.');
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tandai Pekerjaan Lapangan Selesai</span>
                    </button>
                    <button
                      onClick={() => {
                        transitionReportStatus(
                          'RESOLVED',
                          { name: 'Tim Pelaksana Teknis', role: 'Teknisi Lapangan', roleType: 'perangkat' },
                          'Pekerjaan selesai: Penggantian komponen starter dan bohlam LED tuntas. Lampu berfungsi normal kembali.',
                          { cost: 150000, components: ['Starter Lampu', 'Bohlam LED 50W'] }
                        );
                        setTimeout(() => {
                          transitionReportStatus(
                            'RECORDED_IN_MEMORY',
                            { name: 'Tim Pelaksana Teknis', role: 'Teknisi Lapangan', roleType: 'perangkat' },
                            'Pekerjaan perbaikan selesai dan telah diuji coba. Hasil rekaman disimpan permanen ke Buku Memori Desa.'
                          );
                          onCompleteTask(activeTask.id);
                          speakText('Perbaikan selesai dan berhasil dicatat ke Memori Desa.');
                        }, 50);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesaikan & Simpan ke Memori Desa</span>
                    </button>
                  </div>
                ) : (activeTask.id === 'TASK-DEMO-PJU-001' || activeTask.assetId === DEMO_ASSET_ID) && clState.status === 'RESOLVED' ? (
                  <button
                    onClick={() => {
                      transitionReportStatus(
                        'RECORDED_IN_MEMORY',
                        { name: 'Tim Pelaksana Teknis', role: 'Teknisi Lapangan', roleType: 'perangkat' },
                        'Pekerjaan perbaikan selesai dan telah diuji coba. Hasil rekaman disimpan permanen ke Buku Memori Desa.'
                      );
                      onCompleteTask(activeTask.id);
                      speakText('Perbaikan selesai dan berhasil dicatat ke Memori Desa.');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Hasil ke Memori Desa</span>
                  </button>
                ) : activeTask.status !== 'Selesai' && clState.status !== 'RECORDED_IN_MEMORY' ? (
                  <button
                    onClick={() => onCompleteTask(activeTask.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Servis Selesai & Terverifikasi</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Servis Selesai & Direkam ke Memori Desa (Data B)
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Wrench className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">Pilih salah satu jadwal servis di sebelah kiri untuk melihat rincian.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Tambah Jadwal Servis Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <span>Buat Jadwal Perawatan Preventif Baru</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Aset Fisik / Mesin Desa:</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.dusun})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Pekerjaan Servis:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ganti Oli Mesin & Kalibrasi Tekanan Hidrolik"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Interval Siklus:</label>
                  <select
                    value={intervalType}
                    onChange={(e: any) => setIntervalType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  >
                    <option value="Jam Operasional">Jam Operasional</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Semesteran">Semesteran</option>
                    <option value="Musiman">Musiman</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioritas:</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  >
                    <option value="Rutin">Rutin</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Kritis">Kritis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jatuh Tempo Tanggal:</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimasi Biaya (Rp):</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teknisi / Pelaksana:</label>
                <input
                  type="text"
                  value={assignedTechnician}
                  onChange={(e) => setAssignedTechnician(e.target.value)}
                  placeholder="Contoh: Siswa Magang TEFA Otomotif & Mekanik Desa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Daftar Ceklis (Satu baris per item):</label>
                <textarea
                  rows={3}
                  value={checklistItemsText}
                  onChange={(e) => setChecklistItemsText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan Jadwal Servis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
