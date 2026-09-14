import React, { useState } from 'react';
import { 
  FolderGit2, 
  FileText, 
  Plus, 
  Search, 
  Sparkles, 
  Tag, 
  User, 
  Calendar, 
  X, 
  CheckCircle, 
  BookOpen, 
  Users, 
  Eye, 
  Loader2, 
  Volume2, 
  VolumeX,
  Building2,
  MapPin,
  ShieldCheck,
  Link2,
  GitBranch,
  ArrowRight,
  ExternalLink,
  Layers,
  Filter,
  Clock,
  ChevronRight,
  History,
  Building,
  Briefcase
} from 'lucide-react';
import { DocumentItem, HumanMemory, DocCategory, KnowledgeRelationLink } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface Modul1Props {
  documents: DocumentItem[];
  memories: HumanMemory[];
  onAddDocument: (doc: DocumentItem) => void;
  onAddMemory: (mem: HumanMemory) => void;
}

export const Modul1Knowledge: React.FC<Modul1Props> = ({
  documents,
  memories,
  onAddDocument,
  onAddMemory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'docs' | 'memories' | 'objects'>('docs');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedObjectFilter, setSelectedObjectFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  
  // Modals state
  const [showDocModal, setShowDocModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [viewingMemory, setViewingMemory] = useState<HumanMemory | null>(null);

  // Form states - Document
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocText, setNewDocText] = useState('');
  const [newDocObject, setNewDocObject] = useState('');
  const [newDocParties, setNewDocParties] = useState('');
  const [newDocSelectedLinks, setNewDocSelectedLinks] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Form states - Memory
  const [interviewee, setInterviewee] = useState('');
  const [role, setRole] = useState('');
  const [period, setPeriod] = useState('');
  const [transcript, setTranscript] = useState('');
  const [newMemObject, setNewMemObject] = useState('');
  const [newMemParties, setNewMemParties] = useState('');
  const [newMemSelectedLinks, setNewMemSelectedLinks] = useState<string[]>([]);

  const categories = ['All', 'Peraturan Desa', 'APBDes', 'RPJMDes', 'RKP Desa', 'Surat Keputusan', 'Berita Acara', 'Laporan Pembangunan'];

  // Extract all unique objects from docs and memories
  const allObjects = Array.from(new Set([
    ...documents.map(d => d.relatedObject).filter((obj): obj is string => Boolean(obj && obj.trim())),
    ...memories.map(m => m.relatedObject).filter((obj): obj is string => Boolean(obj && obj.trim()))
  ]));

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesObj = selectedObjectFilter === 'All' || doc.relatedObject === selectedObjectFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      (doc.relatedObject && doc.relatedObject.toLowerCase().includes(q)) ||
      (doc.relatedParties && doc.relatedParties.some(p => p.toLowerCase().includes(q))) ||
      doc.tags.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesObj && matchesSearch;
  });

  // Filtered memories
  const filteredMemories = memories.filter(mem => {
    const matchesObj = selectedObjectFilter === 'All' || mem.relatedObject === selectedObjectFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      mem.storyTitle.toLowerCase().includes(q) ||
      mem.storyText.toLowerCase().includes(q) ||
      mem.interviewee.toLowerCase().includes(q) ||
      (mem.relatedObject && mem.relatedObject.toLowerCase().includes(q)) ||
      (mem.relatedParties && mem.relatedParties.some(p => p.toLowerCase().includes(q))) ||
      mem.tags.some(t => t.toLowerCase().includes(q));
    return matchesObj && matchesSearch;
  });

  // Handle navigate to target record
  const handleNavigateToRecord = (targetId: string, targetType?: string) => {
    // Look up in documents
    const foundDoc = documents.find(d => d.id === targetId);
    if (foundDoc) {
      setViewingMemory(null);
      setViewingDoc(foundDoc);
      return;
    }

    // Look up in memories
    const foundMem = memories.find(m => m.id === targetId);
    if (foundMem) {
      setViewingDoc(null);
      setViewingMemory(foundMem);
      return;
    }

    // If ID matches partially
    const fallbackDoc = documents.find(d => d.title.toLowerCase().includes(targetId.toLowerCase()) || d.id.includes(targetId));
    if (fallbackDoc) {
      setViewingMemory(null);
      setViewingDoc(fallbackDoc);
      return;
    }

    const fallbackMem = memories.find(m => m.storyTitle.toLowerCase().includes(targetId.toLowerCase()) || m.id.includes(targetId));
    if (fallbackMem) {
      setViewingDoc(null);
      setViewingMemory(fallbackMem);
      return;
    }
  };

  const handleSpeakItem = (id: string, textToRead: string) => {
    if (activeSpeakingId === id) {
      stopSpeech();
      setActiveSpeakingId(null);
      return;
    }

    stopSpeech();
    setActiveSpeakingId(id);
    speakText(
      textToRead,
      () => setActiveSpeakingId(null),
      () => setActiveSpeakingId(id)
    );
  };

  // Handle AI Document Processing
  const handleProcessAiDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocText.trim()) return;

    setIsAiProcessing(true);
    try {
      const response = await fetch('/api/ai/document-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: newDocTitle,
          text: newDocText,
          fileType: 'Teks'
        })
      });

      const resData = await response.json();
      const extracted = resData.success ? resData.data : {};
      
      const parsedParties = newDocParties 
        ? newDocParties.split(',').map(p => p.trim()).filter(Boolean)
        : (extracted.keyEntities?.slice(0, 3) || ['Pemerintah Desa Talangagung']);

      const constructedLinks: KnowledgeRelationLink[] = newDocSelectedLinks.map(linkId => {
        const d = documents.find(doc => doc.id === linkId);
        if (d) return { targetId: d.id, targetTitle: d.title, targetType: 'doc', year: d.year, relationLabel: 'Dokumen Terkait' };
        const m = memories.find(mem => mem.id === linkId);
        if (m) return { targetId: m.id, targetTitle: m.storyTitle, targetType: 'memory', year: m.extractedKnowledge?.year, relationLabel: 'Memori Terkait' };
        return { targetId: linkId, targetTitle: linkId, targetType: 'doc' };
      });

      const newDoc: DocumentItem = {
        id: `DOC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: extracted.title || newDocTitle,
        category: (extracted.category as DocCategory) || 'Laporan Pembangunan',
        year: extracted.year || new Date().getFullYear(),
        fileType: 'Teks',
        summary: extracted.summary || 'Dokumen berhasil diproses dan dicatat ke dalam Black Box Desa Talangagung.',
        keyEntities: extracted.keyEntities || ['Pemerintah Desa Talangagung', 'Talangagung'],
        tags: extracted.tags || ['Dokumen Baru', 'Talangagung'],
        content: newDocText,
        author: 'Admin Pemerintahan Desa',
        createdAt: new Date().toISOString().split('T')[0],
        relatedObject: newDocObject.trim() || 'Fasilitas & Penyelenggaraan Desa',
        relatedParties: parsedParties,
        relatedLinks: constructedLinks
      };

      onAddDocument(newDoc);
      setNewDocTitle('');
      setNewDocText('');
      setNewDocObject('');
      setNewDocParties('');
      setNewDocSelectedLinks([]);
      setShowDocModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses dokumen dengan AI.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Handle AI Memory Extraction
  const handleProcessAiMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim() || !interviewee.trim()) return;

    setIsAiProcessing(true);
    try {
      const response = await fetch('/api/ai/extract-human-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          interviewee,
          role,
          period
        })
      });

      const resData = await response.json();
      const ext = resData.success ? resData.memory : {};

      const parsedParties = newMemParties 
        ? newMemParties.split(',').map(p => p.trim()).filter(Boolean)
        : (ext.stakeholders || [interviewee, 'Pemerintah Desa Talangagung']);

      const constructedLinks: KnowledgeRelationLink[] = newMemSelectedLinks.map(linkId => {
        const d = documents.find(doc => doc.id === linkId);
        if (d) return { targetId: d.id, targetTitle: d.title, targetType: 'doc', year: d.year, relationLabel: 'Dokumen Terkait' };
        const m = memories.find(mem => mem.id === linkId);
        if (m) return { targetId: m.id, targetTitle: m.storyTitle, targetType: 'memory', year: m.extractedKnowledge?.year, relationLabel: 'Memori Terkait' };
        return { targetId: linkId, targetTitle: linkId, targetType: 'memory' };
      });

      const newMem: HumanMemory = {
        id: `MEM-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        interviewee: interviewee,
        role: role || 'Tokoh Masyarakat',
        period: period || 'Senior',
        storyTitle: ext.storyTitle || `Kisah Pengalaman ${interviewee}`,
        storyText: transcript,
        extractedKnowledge: {
          problem: ext.problem || 'Permasalahan historis desa',
          location: ext.location || 'Desa Talangagung, Kepanjen',
          solution: ext.solution || 'Musyawarah & mufakat warga',
          year: ext.year || new Date().getFullYear(),
          stakeholders: ext.stakeholders || [interviewee]
        },
        tags: ext.tags || ['Memori Desa', 'Sejarah Lokal'],
        dateRecorded: new Date().toISOString().split('T')[0],
        relatedObject: newMemObject.trim() || ext.location || 'Wilayah Desa Talangagung',
        relatedParties: parsedParties,
        relatedLinks: constructedLinks
      };

      onAddMemory(newMem);
      setInterviewee('');
      setRole('');
      setPeriod('');
      setTranscript('');
      setNewMemObject('');
      setNewMemParties('');
      setNewMemSelectedLinks([]);
      setShowMemoryModal(false);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekstrak memori narasumber dengan AI.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Black Box Pengetahuan & Memori Faktual Desa
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Pusat data dokumen resmi, catatan memori sesepuh, objek/aset terkait, instansi/pihak terlibat, serta rantai riwayat kejadian yang terhubung secara komprehensif.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDocModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dokumen/Surat</span>
          </button>
          <button
            onClick={() => setShowMemoryModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Memori Sesepuh</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'docs' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Dokumen & Surat ({documents.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('memories')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'memories' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kisah & Memori Sesepuh ({memories.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('objects')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'objects' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Rantai Riwayat Objek ({allObjects.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari objek, pihak terkait, judul, kata kunci..."
            className="w-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Filter by Objek Terkait Bar */}
      {allObjects.length > 0 && activeSubTab !== 'objects' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 shrink-0">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Filter Objek:</span>
          </div>
          <button
            onClick={() => setSelectedObjectFilter('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedObjectFilter === 'All'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Semua Objek ({documents.length + memories.length})
          </button>
          {allObjects.map((obj, i) => {
            const docCount = documents.filter(d => d.relatedObject === obj).length;
            const memCount = memories.filter(m => m.relatedObject === obj).length;
            const total = docCount + memCount;
            return (
              <button
                key={i}
                onClick={() => setSelectedObjectFilter(obj)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectedObjectFilter === obj
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <span>{obj}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedObjectFilter === obj ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* SUB TAB 1: DOKUMEN ARSIP */}
      {activeSubTab === 'docs' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => {
              const isSpeaking = activeSpeakingId === doc.id;

              return (
                <div 
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {doc.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Tahun {doc.year}
                      </span>
                    </div>

                    <h3 
                      className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer" 
                      onClick={() => setViewingDoc(doc)}
                    >
                      {doc.title}
                    </h3>

                    {/* NEW FIELD 1: Objek Terkait */}
                    {doc.relatedObject && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 flex items-start space-x-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Objek Terkait:</div>
                          <div className="text-xs font-bold text-slate-800 truncate">{doc.relatedObject}</div>
                        </div>
                      </div>
                    )}

                    {/* NEW FIELD 2: Pihak Terkait */}
                    {doc.relatedParties && doc.relatedParties.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Pihak/Instansi Terkait:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {doc.relatedParties.map((party, pIdx) => (
                            <span key={pIdx} className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-medium">
                              {party}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>

                    {/* NEW FIELD 3: Hubungan dengan Kejadian Lain (Clickable Links) */}
                    {doc.relatedLinks && doc.relatedLinks.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <div className="flex items-center space-x-1">
                            <Link2 className="w-3 h-3 text-indigo-600" />
                            <span>Hubungan Kejadian ({doc.relatedLinks.length}):</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {doc.relatedLinks.map((link, lIdx) => (
                            <button
                              key={lIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToRecord(link.targetId, link.targetType);
                              }}
                              className="w-full text-left bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-md px-2 py-1 text-[11px] text-indigo-900 flex items-center justify-between transition-colors group cursor-pointer"
                              title={`Klik untuk melompat ke catatan: ${link.targetTitle}`}
                            >
                              <span className="truncate pr-2 font-medium group-hover:text-indigo-800">
                                🔗 {link.relationLabel ? `${link.relationLabel}: ` : ''}{link.targetTitle}
                              </span>
                              <ChevronRight className="w-3 h-3 text-indigo-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {/* Audio Readout */}
                    <button
                      type="button"
                      onClick={() => handleSpeakItem(doc.id, `${doc.title}. Objek: ${doc.relatedObject || 'Wilayah Desa'}. Ringkasan: ${doc.summary}`)}
                      className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                        isSpeaking 
                          ? 'bg-rose-600 text-white animate-pulse' 
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700'
                      }`}
                      title="Bacakan Ringkasan Dokumen"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                      <span className="text-[11px]">{isSpeaking ? 'Hentikan' : 'Dengarkan'}</span>
                    </button>

                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Detail</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 2: MEMORI WAWANCARA SESEPUH */}
      {activeSubTab === 'memories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.map((mem) => {
              const isSpeaking = activeSpeakingId === mem.id;

              return (
                <div 
                  key={mem.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{mem.interviewee}</h4>
                          <p className="text-xs text-slate-500">{mem.role} ({mem.period})</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-700 font-bold px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md">
                          Tahun {mem.extractedKnowledge.year}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSpeakItem(mem.id, `Cerita dari ${mem.interviewee}. Judul: ${mem.storyTitle}. ${mem.storyText}`)}
                          className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                            isSpeaking 
                              ? 'bg-rose-600 text-white animate-pulse' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Bacakan Kisah Ini"
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
                        </button>
                      </div>
                    </div>

                    <h3 
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      onClick={() => setViewingMemory(mem)}
                    >
                      "{mem.storyTitle}"
                    </h3>

                    {/* NEW FIELD 1: Objek Terkait */}
                    {mem.relatedObject && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 flex items-start space-x-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Objek Terkait:</div>
                          <div className="text-xs font-bold text-slate-800 truncate">{mem.relatedObject}</div>
                        </div>
                      </div>
                    )}

                    {/* NEW FIELD 2: Pihak Terkait */}
                    {mem.relatedParties && mem.relatedParties.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Pihak/Instansi Terkait:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mem.relatedParties.map((party, pIdx) => (
                            <span key={pIdx} className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-medium">
                              {party}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-700 italic bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                      "{mem.storyText}"
                    </p>

                    {/* AI Structured Knowledge Extraction Box */}
                    <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100 space-y-1 text-xs">
                      <div className="flex items-center space-x-1 text-blue-800 font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Rangkuman Inti AI:</span>
                      </div>
                      <div className="text-slate-700">
                        <strong>Masalah Masa Lalu:</strong> {mem.extractedKnowledge.problem}
                      </div>
                      <div className="text-slate-700">
                        <strong>Lokasi:</strong> {mem.extractedKnowledge.location}
                      </div>
                      <div className="text-slate-700">
                        <strong>Penyelesaian:</strong> {mem.extractedKnowledge.solution}
                      </div>
                    </div>

                    {/* NEW FIELD 3: Hubungan dengan Kejadian Lain (Clickable Links) */}
                    {mem.relatedLinks && mem.relatedLinks.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <div className="flex items-center space-x-1">
                            <Link2 className="w-3 h-3 text-indigo-600" />
                            <span>Hubungan Riwayat Kejadian ({mem.relatedLinks.length}):</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {mem.relatedLinks.map((link, lIdx) => (
                            <button
                              key={lIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToRecord(link.targetId, link.targetType);
                              }}
                              className="w-full text-left bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-md px-2.5 py-1 text-[11px] text-indigo-900 flex items-center justify-between transition-colors group cursor-pointer"
                              title={`Klik untuk membuka catatan: ${link.targetTitle}`}
                            >
                              <span className="truncate pr-2 font-medium group-hover:text-indigo-800">
                                🔗 {link.relationLabel ? `${link.relationLabel}: ` : ''}{link.targetTitle}
                              </span>
                              <ChevronRight className="w-3 h-3 text-indigo-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1">
                      {mem.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setViewingMemory(mem)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 cursor-pointer shrink-0 ml-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Riwayat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB TAB 3: RANTAI RIWAYAT OBJEK (OBJECT HISTORY CHAIN VIEW) */}
      {activeSubTab === 'objects' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <span>Eksplorasi Rangkaian Riwayat Objek Desa (Multi-Record Lineage)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Lihat bagaimana setiap objek fisik, infrastruktur, atau program desa memiliki silsilah catatan lengkap — menghubungkan dokumen perencanaan resmi, berita acara serah terima, laporan perbaikan, dan kesaksian lisan sesepuh.
            </p>
          </div>

          <div className="space-y-6">
            {allObjects.map((objectName, oIdx) => {
              const matchedDocs = documents.filter(d => d.relatedObject === objectName);
              const matchedMems = memories.filter(m => m.relatedObject === objectName);
              
              // Combined timeline items
              const timelineItems = [
                ...matchedDocs.map(d => ({
                  id: d.id,
                  type: 'doc' as const,
                  year: d.year,
                  title: d.title,
                  category: d.category,
                  description: d.summary,
                  parties: d.relatedParties || [],
                  links: d.relatedLinks || [],
                  raw: d
                })),
                ...matchedMems.map(m => ({
                  id: m.id,
                  type: 'memory' as const,
                  year: m.extractedKnowledge.year || 2020,
                  title: m.storyTitle,
                  category: `Kisah Sesepuh (${m.interviewee})`,
                  description: m.storyText,
                  parties: m.relatedParties || [],
                  links: m.relatedLinks || [],
                  raw: m
                }))
              ].sort((a, b) => a.year - b.year);

              // Gather all unique parties involved across all records for this object
              const allPartiesForObject = Array.from(new Set(
                timelineItems.flatMap(t => t.parties)
              ));

              return (
                <div key={oIdx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  {/* Object Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{objectName}</h3>
                          <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span>{timelineItems.length} Catatan Pengetahuan Terhubung</span>
                            <span>•</span>
                            <span>Rentang Tahun: {timelineItems.length > 0 ? `${timelineItems[0].year} – ${timelineItems[timelineItems.length - 1].year}` : '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Stakeholders Pill */}
                    {allPartiesForObject.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Pihak Terlibat:</span>
                        {allPartiesForObject.map((p, pI) => (
                          <span key={pI} className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-medium">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Connected Chronology Timeline */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                    {timelineItems.map((item, itIdx) => (
                      <div key={itIdx} className="relative group">
                        {/* Timeline Node */}
                        <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                          item.type === 'doc' ? 'border-blue-500 text-blue-600' : 'border-amber-500 text-amber-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${item.type === 'doc' ? 'bg-blue-600' : 'bg-amber-500'}`} />
                        </div>

                        <div className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-blue-200 rounded-xl p-3.5 transition-all space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                                item.type === 'doc'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}>
                                {item.type === 'doc' ? '📄 ' + item.category : '🗣️ ' + item.category}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                Tahun {item.year}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (item.type === 'doc') {
                                  setViewingMemory(null);
                                  setViewingDoc(item.raw as DocumentItem);
                                } else {
                                  setViewingDoc(null);
                                  setViewingMemory(item.raw as HumanMemory);
                                }
                              }}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Detail Catatan ↗</span>
                            </button>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Related Links in this timeline node */}
                          {item.links.length > 0 && (
                            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-500">Tautan Berantai:</span>
                              {item.links.map((link, lI) => (
                                <button
                                  key={lI}
                                  type="button"
                                  onClick={() => handleNavigateToRecord(link.targetId, link.targetType)}
                                  className="text-[10px] px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-md border border-indigo-200 font-medium flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>🔗 {link.relationLabel ? `${link.relationLabel}: ` : ''}{link.targetTitle}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Upload / Input Document with Relational Fields */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Tambah Dokumen & Pengetahuan Faktual</h3>
              </div>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessAiDocument} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Dokumen / Nama File</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Berita Acara Rekonstruksi Saluran Drainase 2026.pdf"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* NEW INPUT: Objek Terkait */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Objek / Aset / Lokasi Terkait</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: TPA Wisata Edukasi Talangagung, Balai Desa, Jembatan Kali Metro"
                  value={newDocObject}
                  onChange={(e) => setNewDocObject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* NEW INPUT: Pihak Terkait */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pihak / Instansi Terkait (Pisahkan koma)</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: Dinas Lingkungan Hidup Kab. Malang, BPN, RT 01 / RW 01"
                  value={newDocParties}
                  onChange={(e) => setNewDocParties(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* NEW INPUT: Hubungan dengan Kejadian / Catatan Lain */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hubungkan dengan Catatan Lain (Pilih Referensi)</span>
                </label>
                <div className="max-h-32 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
                  {documents.slice(0, 6).map((d) => (
                    <label key={d.id} className="flex items-center space-x-2 text-xs text-slate-700 hover:bg-white p-1 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDocSelectedLinks.includes(d.id)}
                        onChange={(e) => {
                          if (e.target.checked) setNewDocSelectedLinks([...newDocSelectedLinks, d.id]);
                          else setNewDocSelectedLinks(newDocSelectedLinks.filter(id => id !== d.id));
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">📄 {d.title} ({d.year})</span>
                    </label>
                  ))}
                  {memories.slice(0, 3).map((m) => (
                    <label key={m.id} className="flex items-center space-x-2 text-xs text-slate-700 hover:bg-white p-1 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDocSelectedLinks.includes(m.id)}
                        onChange={(e) => {
                          if (e.target.checked) setNewDocSelectedLinks([...newDocSelectedLinks, m.id]);
                          else setNewDocSelectedLinks(newDocSelectedLinks.filter(id => id !== m.id));
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">🗣️ {m.storyTitle} ({m.extractedKnowledge.year})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Isi Naskah / Teks Dokumen</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tempel teks atau isi surat/laporan pembangunan desa di sini..."
                  value={newDocText}
                  onChange={(e) => setNewDocText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>AI akan otomatis mengekstrak entitas penting, merangkum isi, serta mengaitkannya dengan jaringan memori objek desa.</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAiProcessing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses AI...</span>
                    </>
                  ) : (
                    <span>Simpan Dokumen</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Human Memory with Relational Fields */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Catat Kisah & Memori Sesepuh</h3>
              </div>
              <button onClick={() => setShowMemoryModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessAiMemory} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nama Narasumber</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Mbah Sastro Utomo"
                    value={interviewee}
                    onChange={(e) => setInterviewee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jabatan / Status</label>
                  <input
                    type="text"
                    placeholder="misal: Mantan Sekdes / Tokoh Adat"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tahun / Periode Pengalaman</label>
                <input
                  type="text"
                  placeholder="misal: 1985 - 2010"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* NEW INPUT: Objek Terkait */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Objek / Aset / Lokasi Terkait</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: Saluran Drainase RT 05 Glanggang, Sumber Mata Air Kali Metro"
                  value={newMemObject}
                  onChange={(e) => setNewMemObject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* NEW INPUT: Pihak Terkait */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pihak / Tokoh Terkait (Pisahkan koma)</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: Dinas PU Pengairan Kab. Malang, Pengurus RW 03, Mbah Sastro"
                  value={newMemParties}
                  onChange={(e) => setNewMemParties(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* NEW INPUT: Hubungan Kejadian Terkait */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hubungkan dengan Catatan Lain</span>
                </label>
                <div className="max-h-28 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
                  {documents.slice(0, 5).map((d) => (
                    <label key={d.id} className="flex items-center space-x-2 text-xs text-slate-700 hover:bg-white p-1 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMemSelectedLinks.includes(d.id)}
                        onChange={(e) => {
                          if (e.target.checked) setNewMemSelectedLinks([...newMemSelectedLinks, d.id]);
                          else setNewMemSelectedLinks(newMemSelectedLinks.filter(id => id !== d.id));
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">📄 {d.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cerita / Kisah Pengalaman</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan cerita mengenai riwayat batas tanah, pembangunan jembatan, musyawarah masa lalu..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemoryModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isAiProcessing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Kisah</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Document Detail with Relational Links & Audio Readout */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {viewingDoc.category} • Tahun {viewingDoc.year}
              </span>
              <button onClick={() => { stopSpeech(); setViewingDoc(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{viewingDoc.title}</h2>
              <button
                type="button"
                onClick={() => handleSpeakItem('modal-doc', `${viewingDoc.title}. Objek: ${viewingDoc.relatedObject || 'Desa'}. Ringkasan: ${viewingDoc.summary}. Isi: ${viewingDoc.content}`)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Bacakan Dokumen 🔊</span>
              </button>
            </div>

            {/* NEW DETAIL SECTION: Objek Terkait & Pihak Terkait */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Objek Terkait:</span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {viewingDoc.relatedObject || 'Wilayah Umum Desa Talangagung'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pihak / Instansi Terkait:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(viewingDoc.relatedParties && viewingDoc.relatedParties.length > 0) ? (
                    viewingDoc.relatedParties.map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-emerald-100/70 text-emerald-900 rounded font-medium">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600">Pemerintah Desa Talangagung</span>
                  )}
                </div>
              </div>
            </div>

            {/* NEW DETAIL SECTION: Hubungan dengan Kejadian / Catatan Lain */}
            {viewingDoc.relatedLinks && viewingDoc.relatedLinks.length > 0 && (
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-indigo-950 font-bold text-xs">
                  <GitBranch className="w-4 h-4 text-indigo-600" />
                  <span>Rangkaian Riwayat & Hubungan Kejadian Terkait ({viewingDoc.relatedLinks.length}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingDoc.relatedLinks.map((link, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleNavigateToRecord(link.targetId, link.targetType)}
                      className="text-left bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 rounded-lg p-2.5 transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 mb-1">
                          <span>{link.relationLabel || 'Catatan Terkait'}</span>
                          {link.year && <span>Tahun {link.year}</span>}
                        </div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                          {link.targetTitle}
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] font-semibold text-indigo-600 flex items-center space-x-1 group-hover:underline">
                        <span>Buka Catatan</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ringkasan Singkat AI:</span>
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed">{viewingDoc.summary}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">Naskah Dokumen Lengkap:</h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                {viewingDoc.content}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {viewingDoc.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200 font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: View Human Memory Detail with Relational Links & Audio */}
      {viewingMemory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{viewingMemory.interviewee}</h3>
                  <p className="text-[10px] text-slate-500">{viewingMemory.role} ({viewingMemory.period})</p>
                </div>
              </div>
              <button onClick={() => { stopSpeech(); setViewingMemory(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">"{viewingMemory.storyTitle}"</h2>
              <button
                type="button"
                onClick={() => handleSpeakItem('modal-mem', `Kisah ${viewingMemory.interviewee}. ${viewingMemory.storyTitle}. Cerita: ${viewingMemory.storyText}`)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Bacakan Cerita 🔊</span>
              </button>
            </div>

            {/* NEW DETAIL SECTION: Objek Terkait & Pihak Terkait */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Objek Terkait:</span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {viewingMemory.relatedObject || viewingMemory.extractedKnowledge.location}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pihak / Tokoh Terkait:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(viewingMemory.relatedParties && viewingMemory.relatedParties.length > 0) ? (
                    viewingMemory.relatedParties.map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-emerald-100/70 text-emerald-900 rounded font-medium">
                        {p}
                      </span>
                    ))
                  ) : (
                    viewingMemory.extractedKnowledge.stakeholders.map((s, sI) => (
                      <span key={sI} className="text-[10px] px-2 py-0.5 bg-emerald-100/70 text-emerald-900 rounded font-medium">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* NEW DETAIL SECTION: Hubungan dengan Kejadian / Catatan Lain */}
            {viewingMemory.relatedLinks && viewingMemory.relatedLinks.length > 0 && (
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-indigo-950 font-bold text-xs">
                  <GitBranch className="w-4 h-4 text-indigo-600" />
                  <span>Rangkaian Riwayat & Hubungan Kejadian Terkait ({viewingMemory.relatedLinks.length}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingMemory.relatedLinks.map((link, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleNavigateToRecord(link.targetId, link.targetType)}
                      className="text-left bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 rounded-lg p-2.5 transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 mb-1">
                          <span>{link.relationLabel || 'Catatan Terkait'}</span>
                          {link.year && <span>Tahun {link.year}</span>}
                        </div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                          {link.targetTitle}
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] font-semibold text-indigo-600 flex items-center space-x-1 group-hover:underline">
                        <span>Buka Catatan</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Transkrip Kisah Sesepuh:</h4>
              <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-wrap">
                "{viewingMemory.storyText}"
              </p>
            </div>

            {/* AI Structured Knowledge */}
            <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100 space-y-2 text-xs">
              <h4 className="font-bold text-blue-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Struktur Memori Historis AI:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800 pt-1">
                <div><strong>Masalah:</strong> {viewingMemory.extractedKnowledge.problem}</div>
                <div><strong>Lokasi:</strong> {viewingMemory.extractedKnowledge.location}</div>
                <div><strong>Solusi Masa Lalu:</strong> {viewingMemory.extractedKnowledge.solution}</div>
                <div><strong>Tahun Kejadian:</strong> {viewingMemory.extractedKnowledge.year}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {viewingMemory.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200 font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
