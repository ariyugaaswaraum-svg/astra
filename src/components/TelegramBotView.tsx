import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  CheckCircle2, 
  Radio, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  Camera, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Store, 
  Baby, 
  Info,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
  BellRing,
  HelpCircle,
  QrCode,
  Download,
  FolderDown,
  FileCheck,
  Mic,
  MicOff,
  Play,
  Pause,
  FileSpreadsheet,
  Database,
  UploadCloud,
  Trash2,
  Paperclip,
  Table,
  FileCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { speakText, stopSpeech } from '../utils/speech';
import { 
  VillageProfile, 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  UserContext,
  UploadedVillageDoc 
} from '../types';
import {
  createSampleAPBDesExcelBase64,
  createSampleWordSKBase64,
  createSamplePDFMonografiBase64,
  readFileAsBase64
} from '../utils/sampleDocuments';

interface TelegramBotViewProps {
  villageProfile?: VillageProfile;
  documents?: DocumentItem[];
  assets?: AssetItem[];
  memories?: HumanMemory[];
  userContext?: UserContext;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  ticketId?: string;
  photoUrl?: string;
  isVoiceNote?: boolean;
  voiceDuration?: number;
  transcription?: string;
  isDocumentUpload?: boolean;
  docName?: string;
  docType?: string;
  docSize?: number;
  uploadedDoc?: UploadedVillageDoc;
  documentFile?: {
    filename: string;
    content: string;
    caption?: string;
  };
}

interface TelegramServerStatus {
  configured: boolean;
  botUsername: string;
  botName: string;
  telegramUrl: string;
  isPolling: boolean;
  totalReceived: number;
  totalSent: number;
  lastActive: string;
  subscribersCount: number;
  maskedToken: string;
  recentLogs: Array<{
    id: string;
    timestamp: string;
    chatId: number | string;
    senderName: string;
    username?: string;
    incomingText: string;
    replyText: string;
    type: string;
    ticketId?: string;
  }>;
}

// Helper to generate a valid PCM WAV base64 sound for simulating voice messages
function generateSyntheticVoiceWavBase64(durationSec: number = 3): string {
  const sampleRate = 8000;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  function writeStr(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * 220 * t) * 0.3 + 
                   Math.sin(2 * Math.PI * 440 * t) * 0.2 + 
                   Math.sin(2 * Math.PI * 880 * t) * 0.1;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const TelegramBotView: React.FC<TelegramBotViewProps> = ({
  villageProfile,
  userContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: `🏛️ *BOT ASISTEN RESMI DESA TALANGAGUNG*\n_Kecamatan Kepanjen, Kabupaten Malang_\n_Status: Online 🟢 Melayani 24 Jam_\n\nHalo Warga Desa! Saya adalah Asisten AI Resmi Desa Talangagung di Telegram. Saya siap melayani pengurusan surat keterangan (SKU/KTP), laporan kerusakan fasilitas warga, jadwal posyandu, produk BUMDes, hingga kontak darurat desa.\n\n🎙️ *Dukungan Pesan Suara (Voice Note):* Kini bot dapat mendengarkan, mentranskripsikan, dan memproses pesan suara warga secara langsung!\n\nSilakan pilih salah satu perintah cepat di bawah ini atau ketik pertanyaan bebas Anda.`
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true); // Voice out loud on by default, can be toggled on/off

  const toggleAutoSpeak = () => {
    const next = !autoSpeak;
    setAutoSpeak(next);
    if (!next) {
      stopSpeech();
      setSpeakingMsgId(null);
    }
  };

  const speakBotReplyIfEnabled = (msgId: string, replyText: string) => {
    if (!autoSpeak) return;
    if (!replyText || replyText.includes('FITUR SUARA AI DIMATIKAN')) return;

    stopSpeech();
    setSpeakingMsgId(msgId);

    const clean = replyText
      .replace(/[#*_`~>•]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    let spoken = clean;
    if (spoken.length > 280) {
      const slice = spoken.slice(0, 280);
      const lastPunct = Math.max(slice.lastIndexOf('.'), slice.lastIndexOf('!'), slice.lastIndexOf('?'));
      spoken = lastPunct > 80 ? slice.slice(0, lastPunct + 1) : slice;
    }

    speakText(
      spoken,
      () => setSpeakingMsgId(null),
      () => setSpeakingMsgId(msgId)
    );
  };

  // Voice recording & simulation states
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<TelegramServerStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Broadcast modal/form state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('Pemberitahuan Warga Desa Talangagung');
  const [broadcastMsg, setBroadcastMsg] = useState('Diinformasikan kepada seluruh warga bahwa pelayanan Posyandu Melati RW 01 akan diadakan tanggal 10 pukul 08.00 WIB.');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botUsername = status?.botUsername || 'desablackboxai_bot';
  const telegramUrl = status?.telegramUrl || `https://t.me/${botUsername}`;
  const fullToken = '8976294699:AAErcL6CfqU3qwFG1Axvor3MGjjP0uVKO_M';

  const fetchStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/telegram/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch telegram status:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const [selectedDocPreview, setSelectedDocPreview] = useState<{
    filename: string;
    content: string;
    caption?: string;
  } | null>(null);

  // Document attachment and memory state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{
    base64: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
  } | null>(null);
  const [memoryDocs, setMemoryDocs] = useState<UploadedVillageDoc[]>([]);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [selectedMemoryDoc, setSelectedMemoryDoc] = useState<UploadedVillageDoc | null>(null);

  const fetchMemoryDocs = async () => {
    try {
      const res = await fetch('/api/telegram/memory/documents');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.documents)) {
          setMemoryDocs(data.documents);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch memory docs:', e);
    }
  };

  useEffect(() => {
    fetchMemoryDocs();
  }, []);

  const handleDeleteMemoryDoc = async (id: string) => {
    try {
      const res = await fetch(`/api/telegram/memory/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchMemoryDocs();
        if (selectedMemoryDoc?.id === id) {
          setSelectedMemoryDoc(null);
        }
      }
    } catch (e) {
      console.warn('Failed to delete doc from memory:', e);
    }
  };

  const handleUploadDocument = async (docData: {
    base64: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    caption?: string;
  }) => {
    stopSpeech();
    setSpeakingMsgId(null);
    setIsLoading(true);

    const ext = docData.fileName.split('.').pop()?.toLowerCase() || '';
    const fileTypeLabel = ext.includes('xls') ? 'Excel' : ext.includes('doc') ? 'Word' : ext.includes('pdf') ? 'PDF' : 'Dokumen';

    const userMsg: ChatMessage = {
      id: `usr-doc-${Date.now()}`,
      sender: 'user',
      text: docData.caption || `[Mengunggah Dokumen ${fileTypeLabel}: ${docData.fileName}]`,
      isDocumentUpload: true,
      docName: docData.fileName,
      docType: fileTypeLabel,
      docSize: docData.fileSize,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentBase64: docData.base64,
          documentFileName: docData.fileName,
          documentMimeType: docData.mimeType,
          documentSize: docData.fileSize,
          caption: docData.caption || '',
          senderName: userContext?.name || 'Warga Desa',
          voiceEnabled: autoSpeak
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-doc-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Dokumen berhasil dianalisis dan disimpan ke dalam memori desa.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        ticketId: data.ticketId,
        uploadedDoc: data.uploadedDoc,
        documentFile: data.documentFile
      };

      setMessages(prev => [...prev, botMsg]);
      fetchStatus();
      fetchMemoryDocs();

      const shouldSpeak = data.voiceEnabled !== undefined ? data.voiceEnabled : autoSpeak;
      if (shouldSpeak && data.reply) {
        setTimeout(() => {
          speakBotReplyIfEnabled(botMsg.id, botMsg.text);
        }, 250);
      }
    } catch (err) {
      console.error('Document upload error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: '⚠️ Terjadi kendala saat membaca atau memproses dokumen. Pastikan file valid.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64DataUrl = await readFileAsBase64(file);
      const pureBase64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;
      setAttachedFile({
        base64: pureBase64,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size
      });
    } catch (err) {
      console.warn('Error reading file:', err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAttachPreset = (type: 'excel' | 'word' | 'pdf') => {
    setShowDocUploadModal(false);
    if (type === 'excel') {
      const sample = createSampleAPBDesExcelBase64();
      handleUploadDocument({
        base64: sample.base64,
        fileName: sample.fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileSize: sample.fileSize,
        caption: 'Tolong pelajari dan simpan data rincian APBDes 2026 ini ke dalam memori desa.'
      });
    } else if (type === 'word') {
      const sample = createSampleWordSKBase64();
      handleUploadDocument({
        base64: sample.base64,
        fileName: sample.fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: sample.fileSize,
        caption: 'Lampiran SK Kepala Desa tentang Satgas Linmas dan Siaga Ronda Malam Tahun 2026.'
      });
    } else if (type === 'pdf') {
      const sample = createSamplePDFMonografiBase64();
      handleUploadDocument({
        base64: sample.base64,
        fileName: sample.fileName,
        mimeType: 'application/pdf',
        fileSize: sample.fileSize,
        caption: 'Dokumen Monografi Statistik Kependudukan dan Wilayah Desa Talangagung BPS.'
      });
    }
  };

  const handleDownloadDoc = (docFile: { filename: string; content: string }) => {
    try {
      const blob = new Blob([docFile.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docFile.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Failed to download document:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if ((!text && !attachedFile) || isLoading) return;

    // Interrupt any previous speech immediately
    stopSpeech();
    setSpeakingMsgId(null);

    if (attachedFile) {
      const pendingFile = attachedFile;
      setAttachedFile(null);
      if (!textToSend) setInputMessage('');
      await handleUploadDocument({
        ...pendingFile,
        caption: text || undefined
      });
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          senderName: userContext?.name || 'Warga Desa',
          voiceEnabled: autoSpeak
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Mohon maaf, terjadi kendala komunikasi dengan server bot desa.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        ticketId: data.ticketId,
        documentFile: data.documentFile
      };

      setMessages(prev => [...prev, botMsg]);
      fetchStatus();

      // Sync voiceEnabled setting if command was /suara
      if (typeof data.voiceEnabled === 'boolean') {
        setAutoSpeak(data.voiceEnabled);
        if (!data.voiceEnabled) {
          stopSpeech();
          setSpeakingMsgId(null);
        }
      }

      // Automatically speak bot response out loud if voice is enabled
      const shouldSpeak = data.voiceEnabled !== undefined ? data.voiceEnabled : autoSpeak;
      if (shouldSpeak && data.reply) {
        setTimeout(() => {
          speakBotReplyIfEnabled(botMsg.id, botMsg.text);
        }, 200);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Gagal terhubung ke bot server. Silakan coba kembali sesaat lagi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePhotoReport = async () => {
    if (isLoading) return;

    stopSpeech();
    setSpeakingMsgId(null);

    const userMsg: ChatMessage = {
      id: `usr-photo-${Date.now()}`,
      sender: 'user',
      text: '[Mengirim Foto Kerusakan Lampu PJU Padam di Depan Gang Krajan RT 02]',
      photoUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=500&auto=format&fit=crop&q=60',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Lampu PJU padam di depan gang Krajan RT 02/RW 01, mohon perbaikan agar jalan tidak gelap.',
          caption: 'Lampu PJU padam di depan gang Krajan RT 02/RW 01',
          senderName: userContext?.name || 'Warga Desa',
          voiceEnabled: autoSpeak
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-photo-reply-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Laporan foto kerusakan berhasil diproses oleh AI Desa.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        ticketId: data.ticketId
      };

      setMessages(prev => [...prev, botMsg]);
      fetchStatus();

      const shouldSpeak = data.voiceEnabled !== undefined ? data.voiceEnabled : autoSpeak;
      if (shouldSpeak && data.reply) {
        setTimeout(() => {
          speakBotReplyIfEnabled(botMsg.id, botMsg.text);
        }, 200);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setShowVoiceModal(true);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (audioBlob.size > 0) {
          await processAndSendVoiceBlob(audioBlob, recordingDuration);
        }
      };

      recorder.start(250);
      setIsRecordingVoice(true);
      setRecordingDuration(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (micErr) {
      console.warn('Microphone access unavailable or denied:', micErr);
      setShowVoiceModal(true);
    }
  };

  const stopVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingVoice(false);
  };

  const cancelVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
    }
    audioChunksRef.current = [];
    setIsRecordingVoice(false);
    setRecordingDuration(0);
  };

  const processAndSendVoiceBlob = async (blob: Blob, duration: number) => {
    setIsLoading(true);
    const userMsgId = `usr-voice-${Date.now()}`;
    const dur = Math.max(duration, 1);
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: '🎙️ Pesan Suara / Voice Note Warga',
      isVoiceNote: true,
      voiceDuration: dur,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const resultStr = reader.result as string;
        const base64Audio = resultStr ? resultStr.split(',')[1] : '';
        const res = await fetch('/api/telegram/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            audioMimeType: blob.type || 'audio/webm',
            voiceDuration: dur,
            senderName: userContext?.name || 'Warga Desa',
            voiceEnabled: autoSpeak
          })
        });

        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-voice-reply-${Date.now()}`,
          sender: 'bot',
          text: data.reply || 'Pesan suara Anda berhasil diterima dan diproses oleh bot desa.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          ticketId: data.ticketId,
          transcription: data.transcription,
          documentFile: data.documentFile
        };

        setMessages(prev => [...prev, botMsg]);
        fetchStatus();
        setIsLoading(false);

        const shouldSpeak = data.voiceEnabled !== undefined ? data.voiceEnabled : autoSpeak;
        if (shouldSpeak && data.reply) {
          setTimeout(() => {
            speakBotReplyIfEnabled(botMsg.id, botMsg.text);
          }, 250);
        }
      };
    } catch (err) {
      console.warn('Error sending voice note:', err);
      setIsLoading(false);
    }
  };

  const handleSimulateVoicePreset = async (preset: {
    label: string;
    spokenText: string;
    duration: number;
  }) => {
    stopSpeech();
    setSpeakingMsgId(null);
    setShowVoiceModal(false);
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: `usr-vsim-${Date.now()}`,
      sender: 'user',
      text: `🎙️ "${preset.spokenText}"`,
      isVoiceNote: true,
      voiceDuration: preset.duration,
      transcription: preset.spokenText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const synthWavBase64 = generateSyntheticVoiceWavBase64(preset.duration);
      const res = await fetch('/api/telegram/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: preset.spokenText,
          audioBase64: synthWavBase64,
          audioMimeType: 'audio/wav',
          voiceDuration: preset.duration,
          senderName: userContext?.name || 'Warga Desa',
          voiceEnabled: autoSpeak
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-vsim-reply-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Pesan suara berhasil dianalisis AI Desa.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        ticketId: data.ticketId,
        transcription: data.transcription || preset.spokenText,
        documentFile: data.documentFile
      };

      setMessages(prev => [...prev, botMsg]);
      fetchStatus();

      const shouldSpeak = data.voiceEnabled !== undefined ? data.voiceEnabled : autoSpeak;
      if (shouldSpeak && data.reply) {
        setTimeout(() => {
          speakBotReplyIfEnabled(botMsg.id, botMsg.text);
        }, 250);
      }
    } catch (err) {
      console.warn('Error in voice simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(fullToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeech();
      setSpeakingMsgId(null);
    } else {
      stopSpeech();
      setSpeakingMsgId(msgId);
      // Clean markdown tags for audio reading
      const clean = text.replace(/[*_`#]/g, '').replace(/\n+/g, '. ');
      speakText(
        clean,
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(msgId)
      );
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim() || broadcastSending) return;
    setBroadcastSending(true);
    setBroadcastFeedback(null);

    try {
      const res = await fetch('/api/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMsg
        })
      });

      const data = await res.json();
      if (data.success) {
        setBroadcastFeedback(data.message);
        setTimeout(() => {
          setShowBroadcastModal(false);
          setBroadcastFeedback(null);
        }, 3000);
      }
    } catch (err: any) {
      setBroadcastFeedback('Gagal mengirim siaran: ' + err.message);
    } finally {
      setBroadcastSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Official Telegram Bot Connected */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .39z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white border border-white/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3"></span>
                Telegram Bot HTTP API Aktif
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/40 text-sky-100 border border-sky-400/40">
                Daemon Polling 24 Jam
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-black/20 text-white/90">
                ID: 8976294699
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <span>Bot Telegram Resmi:</span>
                <span className="underline decoration-sky-300 decoration-wavy underline-offset-4">
                  @{botUsername}
                </span>
              </h2>
              <p className="text-sky-100 text-sm mt-1.5 max-w-2xl leading-relaxed">
                Terhubung ke bot <b>blackboxai</b> (<span className="font-mono text-xs">@{botUsername}</span>). Warga desa dapat mengobrol langsung di aplikasi Telegram HP untuk mengurus surat, lapor foto fasilitas jalan/lampu, melihat jadwal posyandu, dan belanja beras BUMDes!
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-sky-50 text-blue-700 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-102"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Langsung di Telegram</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl text-xs backdrop-blur-xs border border-white/20 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tautan Tersalin!' : 'Salin Tautan'}</span>
              </button>

              <button
                type="button"
                onClick={fetchStatus}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl text-xs backdrop-blur-xs border border-white/20 transition-colors disabled:opacity-50"
                title="Perbarui Status Server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Cek Sinyal API</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-slate-900" />
                <span>Kirim Siaran Telegram</span>
              </button>
            </div>
          </div>

          {/* QR Code Quick Scan for Mobile Phones */}
          <div className="shrink-0 bg-white p-4 rounded-2xl shadow-xl text-slate-800 flex flex-col items-center text-center max-w-[200px] border border-sky-100">
            <span className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              Scan di HP Warga
            </span>
            <div className="p-1.5 bg-sky-50 rounded-xl border border-sky-100">
              <QRCodeSVG
                value={telegramUrl}
                size={120}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-2 tracking-tight">
              @{botUsername}
            </span>
            <span className="text-[9px] text-slate-400 leading-none mt-0.5">
              Klik kamera / scan QR
            </span>
          </div>
        </div>

        {/* Security & Token Info Bar */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">HTTP API Token:</span>
            <span className="font-mono bg-black/25 px-2.5 py-0.5 rounded text-[11px] border border-white/10 text-white">
              {showToken ? fullToken : status?.maskedToken || `${fullToken.slice(0, 10)}...${fullToken.slice(-6)}`}
            </span>
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-sky-200 hover:text-white p-1 rounded transition-colors"
              title={showToken ? "Sembunyikan Token" : "Tampilkan Token Lengkap"}
            >
              {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleCopyToken}
              className="text-sky-200 hover:text-white p-1 rounded transition-colors"
              title="Salin Token"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Pesan Diterima: <b>{status?.totalReceived || 0}</b></span>
            <span>Pesan Terkirim: <b>{status?.totalSent || 0}</b></span>
            <span>Pelanggan Aktif: <b>{status?.subscribersCount || 0}</b></span>
          </div>
        </div>
      </div>

      {/* Main Content: Left Column (Quick Features & Senior Guide) + Right Column (Live Telegram Simulator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Command Reference & Features */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card: Quick Commands */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Perintah Mandiri Bot Desa</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                Klik untuk Uji
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Warga cukup menekan atau mengetik perintah berikut di obrolan Telegram:
            </p>

            <div className="space-y-2">
              {[
                {
                  cmd: '/start',
                  title: 'Mulai / Menu Utama',
                  desc: 'Salam pembuka & daftar tombol layanan pintar desa',
                  icon: Sparkles,
                  color: 'text-sky-600 bg-sky-50 border-sky-200'
                },
                {
                  cmd: '/dokumen',
                  title: 'Katalog 17 Dokumen Resmi',
                  desc: 'Arsip APBDes 2026, Vokasi SMK, Master TPA, IoT Feeder, Trans Jatim',
                  icon: FolderDown,
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
                },
                {
                  cmd: '/surat',
                  title: 'Buat Draf Surat & SKU',
                  desc: 'Cetak draf Surat Usaha (SKU), KTP, KK, SKTM, berstempel QR resmi',
                  icon: FileText,
                  color: 'text-blue-600 bg-blue-50 border-blue-200'
                },
                {
                  cmd: '/lapor',
                  title: 'Lapor Jalan & Lampu Padam',
                  desc: 'Kirim foto jalan rusak atau lampu mati untuk deteksi AI instan',
                  icon: Camera,
                  color: 'text-amber-600 bg-amber-50 border-amber-200'
                },
                {
                  cmd: '/posyandu',
                  title: 'Jadwal Posyandu Balita',
                  desc: 'Posyandu Melati Dusun Krajan (tgl 10) & Mawar Glanggang (tgl 15)',
                  icon: Baby,
                  color: 'text-rose-600 bg-rose-50 border-rose-200'
                },
                {
                  cmd: '/bumdes',
                  title: 'Katalog Beras & BUMDes',
                  desc: 'Beras Organik Kali Metro Rp 68.000 & Pupuk Kompos Organik',
                  icon: Store,
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
                },
                {
                  cmd: '/darurat',
                  title: 'Kontak Darurat 24 Jam',
                  desc: 'Ambulans Siaga Desa 0812-3456-7890, Babinsa, & Polsek Kepanjen',
                  icon: PhoneCall,
                  color: 'text-red-600 bg-red-50 border-red-200'
                },
                {
                  cmd: '/profil',
                  title: 'Profil & Data BPS Desa',
                  desc: 'Data 8.522 jiwa, 5 RW, 27 RT, Terminal Talangagung Bus Trans Jatim',
                  icon: Info,
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
                },
                {
                  cmd: '/suara',
                  title: 'Suara AI (Voice Reply)',
                  desc: '/suara on untuk mendengar balasan suara langsung, /suara off untuk mode hening',
                  icon: Volume2,
                  color: 'text-violet-600 bg-violet-50 border-violet-200'
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.cmd)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-start gap-2.5 group"
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${item.color}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 group-hover:underline">
                        {item.cmd}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card: Live Server Activity Log */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Aktivitas Telegram Terkini</span>
              </h3>
              <button
                type="button"
                onClick={fetchStatus}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {status?.recentLogs && status.recentLogs.length > 0 ? (
                status.recentLogs.slice(0, 6).map((log, i) => (
                  <div key={log.id || i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700">
                        {log.senderName} {log.username ? `(@${log.username})` : ''}
                      </span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-slate-800 font-medium line-clamp-1">
                      💬 "{log.incomingText}"
                    </p>
                    {log.ticketId && (
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[9px] rounded font-bold">
                        Tiket: {log.ticketId}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada percakapan baru. Silakan kirim pesan di simulator atau langsung di aplikasi Telegram!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Authentic Telegram Simulator */}
        <div className="lg:col-span-8">
          <div className="bg-[#0f172a] rounded-3xl shadow-xl overflow-hidden border border-slate-800 flex flex-col h-[650px]">
            {/* Telegram Header */}
            <div className="bg-[#1e293b] px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    BB
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1e293b]"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-sm">
                      blackboxai
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <span className="text-[11px] text-sky-300">
                    @{botUsername} • bot resmi desa
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice Auto-Speak Toggle Button */}
                <button
                  type="button"
                  onClick={toggleAutoSpeak}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-xs ${
                    autoSpeak
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                  title={autoSpeak ? "Suara AI Langsung Aktif: Bot berbicara membacakan jawaban. Klik untuk matikan." : "Suara AI Dimatikan. Klik untuk aktifkan balasan suara langsung."}
                >
                  {autoSpeak ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="hidden sm:inline">
                    {autoSpeak ? 'Suara AI: ON' : 'Suara AI: OFF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Pilihan Tes Pesan Suara / Voice Note AI"
                >
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Tes Voice Note</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePhotoReport}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Simulasikan Warga Mengirim Foto Kerusakan"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tes Kirim Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    fetchMemoryDocs();
                    setShowMemoryModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Buka Brankas Memori Dokumen AI Desa"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Memori ({memoryDocs.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDocUploadModal(true)}
                  className="px-2.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Unggah Dokumen Baru (Excel, Word, PDF)"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Upload Dokumen</span>
                </button>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Telegram</span>
                </a>
              </div>
            </div>

            {/* Live Audio Speaking Indicator Banner with Instant Stop Button */}
            {speakingMsgId && (
              <div className="bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-emerald-950/95 border-b border-emerald-500/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 shrink-0 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="w-1.5 h-5 bg-emerald-300 rounded-full animate-pulse delay-75"></span>
                    <span className="w-1.5 h-2.5 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
                  </div>
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                  <span className="font-semibold text-white">Bot sedang berbicara membacakan jawaban langsung...</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    setSpeakingMsgId(null);
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Hentikan dan Matikan Suara Sekarang"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Matikan Suara</span>
                </button>
              </div>
            )}

            {/* Chat Messages Body */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0b141a] bg-opacity-95"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSpeaking = speakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 space-y-1.5 shadow-md ${
                        isUser
                          ? 'bg-[#2b5278] text-white rounded-tr-none'
                          : 'bg-[#182533] text-slate-100 rounded-tl-none border border-slate-700/50'
                      }`}
                    >
                      {/* Voice Note Player bubble if message was a voice note */}
                      {msg.isVoiceNote && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/25 border border-white/10 mb-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (playingVoiceId === msg.id) {
                                stopSpeech();
                                setPlayingVoiceId(null);
                              } else {
                                stopSpeech();
                                setPlayingVoiceId(msg.id);
                                const speechContent = msg.transcription || msg.text.replace(/[*_`#🎙️]/g, '');
                                speakText(
                                  speechContent,
                                  () => setPlayingVoiceId(null),
                                  () => setPlayingVoiceId(null)
                                );
                              }
                            }}
                            className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
                            title="Putar Audio Pesan Suara"
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-4 h-4 fill-white" />
                            ) : (
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            )}
                          </button>

                          <div className="flex-1 space-y-1">
                            {/* Dynamic Animated Waveform */}
                            <div className="flex items-center gap-0.5 h-6">
                              {[40, 65, 90, 45, 100, 70, 50, 85, 95, 60, 45, 80, 75, 55, 35, 65, 80, 50, 30].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    playingVoiceId === msg.id 
                                      ? 'bg-sky-400 animate-pulse' 
                                      : 'bg-slate-300/70'
                                  }`}
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300">
                              <span className="font-mono">
                                0:{msg.voiceDuration ? String(msg.voiceDuration).padStart(2, '0') : '05'}
                              </span>
                              <span className="text-[10px] text-sky-300 font-medium flex items-center gap-1">
                                <Mic className="w-2.5 h-2.5" />
                                Pesan Suara (Voice Note)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Multimodal Transcription Card from Gemini AI */}
                      {msg.transcription && !msg.isVoiceNote && (
                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-100 text-xs space-y-1 mb-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-300">
                            <Mic className="w-3.5 h-3.5 text-amber-400" />
                            <span>Transkrip Suara Warga Terdeteksi (AI Multimodal):</span>
                          </div>
                          <p className="italic text-slate-100 bg-black/25 p-2 rounded-lg font-mono text-[11px]">
                            "{msg.transcription}"
                          </p>
                        </div>
                      )}

                      {/* User Document Upload Indicator */}
                      {msg.isDocumentUpload && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 mb-2 flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                            {msg.docType === 'Excel' ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-emerald-300 uppercase px-1.5 py-0.5 bg-emerald-900/60 rounded">
                                {msg.docType}
                              </span>
                              {msg.docSize && (
                                <span className="text-[10px] text-slate-300 font-mono">
                                  {(msg.docSize / 1024).toFixed(1)} KB
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-white truncate mt-0.5">
                              {msg.docName}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Photo preview if attached */}
                      {msg.photoUrl && (
                        <div className="rounded-xl overflow-hidden mb-2 border border-black/20">
                          <img
                            src={msg.photoUrl}
                            alt="Foto Kerusakan"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                      )}

                      {/* Ticket Badge */}
                      {msg.ticketId && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                          <span>🎫 Tiket Laporan:</span>
                          <span>{msg.ticketId}</span>
                        </div>
                      )}

                      {/* Message Text with simple linebreaks & formatting */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                        {msg.text}
                      </div>

                      {/* AI Ingested Village Document Memory Card */}
                      {msg.uploadedDoc && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-2.5 shadow-md">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                              {msg.uploadedDoc.fileType === 'excel' || msg.uploadedDoc.fileType === 'csv' ? (
                                <FileSpreadsheet className="w-5 h-5" />
                              ) : (
                                <FileText className="w-5 h-5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                                  {msg.uploadedDoc.fileType.toUpperCase()} • TERSIMPAN KE MEMORI DESA
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Kategori: {msg.uploadedDoc.category}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white mt-1">
                                {msg.uploadedDoc.title}
                              </h4>
                              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed bg-black/30 p-2 rounded-xl border border-white/5">
                                {msg.uploadedDoc.summary}
                              </p>
                            </div>
                          </div>

                          {/* Key data points */}
                          {msg.uploadedDoc.keyData && msg.uploadedDoc.keyData.length > 0 && (
                            <div className="pt-2 border-t border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                                <Database className="w-3 h-3 text-emerald-400" />
                                Fakta & Angka Kunci yang Dihafal Bot:
                              </span>
                              <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-200">
                                {msg.uploadedDoc.keyData.map((kd, kIdx) => (
                                  <div key={kIdx} className="flex items-start gap-1.5 bg-slate-800/60 px-2 py-1 rounded-lg">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>{kd}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Table preview if exists */}
                          {msg.uploadedDoc.tableDataPreview && (
                            <div className="pt-2 border-t border-slate-800">
                              <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                                <Table className="w-3 h-3 text-sky-400" />
                                Cuplikan Lembar Kerja / Tabel Data:
                              </span>
                              <div className="bg-black/50 p-2 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 max-h-36 scrollbar-thin">
                                <pre className="whitespace-pre">{msg.uploadedDoc.tableDataPreview}</pre>
                              </div>
                            </div>
                          )}

                          {/* Suggested Interactive Questions */}
                          {msg.uploadedDoc.suggestedQuestions && msg.uploadedDoc.suggestedQuestions.length > 0 && (
                            <div className="pt-2 border-t border-slate-800 space-y-1.5">
                              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                Coba Tanyakan pada Bot tentang Dokumen Ini:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.uploadedDoc.suggestedQuestions.map((q, qIdx) => (
                                  <button
                                    key={qIdx}
                                    type="button"
                                    onClick={() => handleSendMessage(q)}
                                    className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-200 text-slate-200 border border-slate-700 hover:border-emerald-500/40 transition-colors"
                                  >
                                    💬 {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Official Connected Document File Attachment */}
                      {msg.documentFile && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-900/80 border border-sky-500/40 space-y-2">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0 border border-sky-500/30">
                              <FileCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                  Lampiran Dokumen Resmi
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {(msg.documentFile.content.length / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-white truncate mt-0.5" title={msg.documentFile.filename}>
                                {msg.documentFile.filename}
                              </p>
                              {msg.documentFile.caption && (
                                <p className="text-[11px] text-sky-200/80 line-clamp-1">
                                  {msg.documentFile.caption}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleDownloadDoc(msg.documentFile!)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Unduh Dokumen (.txt)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedDocPreview(msg.documentFile!)}
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-medium text-xs border border-slate-700 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Isi</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message Footer: TTS Speaker & Timestamp */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-400">
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                              isSpeaking 
                                ? 'bg-sky-500/30 text-sky-300 font-bold' 
                                : 'hover:text-slate-200'
                            }`}
                            title="Dengarkan Suara Pesan"
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                            <span>{isSpeaking ? 'Berhenti' : 'Dengarkan'}</span>
                          </button>
                        )}
                        <span className="ml-auto font-mono">
                          {msg.timestamp} {isUser && '✓✓'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#182533] text-slate-300 rounded-2xl rounded-tl-none p-3 border border-slate-700/50 flex items-center space-x-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    <span>Bot @{botUsername} sedang mengetik balasan...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips above input */}
            <div className="bg-[#182533] px-3 py-2 border-t border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Cepat:
              </span>
              {[
                { 
                  label: autoSpeak ? "🔇 Matikan Suara (/suara off)" : "🔊 Nyalakan Suara (/suara on)", 
                  text: autoSpeak ? "/suara off" : "/suara on",
                  isVoiceToggle: true
                },
                { 
                  label: "🎙️ VN: APBDes 2026", 
                  isVoice: true, 
                  preset: {
                    label: "Tanya APBDes 2026",
                    spokenText: "Halo admin, saya mau tanya anggaran APBDes tahun 2026 Desa Talangagung berapa dan minta berkas dokumen resminya ya.",
                    duration: 6
                  }
                },
                { 
                  label: "🎙️ VN: Lapor PJU Padam", 
                  isVoice: true, 
                  preset: {
                    label: "Lapor Lampu Jalan Padam",
                    spokenText: "Pak Kades, tolong lampu penerangan jalan di gang dua RT satu padam sudah dua malam, mohon dicek.",
                    duration: 5
                  }
                },
                { 
                  label: "🎙️ VN: Minta Draf SKU", 
                  isVoice: true, 
                  preset: {
                    label: "Minta Surat SKU Usaha",
                    spokenText: "Selamat siang kantor desa, saya mau buat draf surat keterangan usaha untuk toko sembako di rumah saya.",
                    duration: 5
                  }
                },
                { label: "📊 Upload Excel APBDes", isDocPreset: 'excel' as const },
                { label: "📝 Upload Word SK Linmas", isDocPreset: 'word' as const },
                { label: "📄 Upload PDF Monografi", isDocPreset: 'pdf' as const },
                { label: "🗄️ Buka Memori Dokumen", isMemoryVault: true },
                { label: "📁 /dokumen", text: "/dokumen" },
                { label: "📄 /dokumen apbdes", text: "/dokumen apbdes" },
                { label: "🏫 /dokumen smk", text: "/dokumen smk" },
                { label: "🚜 /dokumen tpa", text: "/dokumen tpa" },
                { label: "🚌 /dokumen transjatim", text: "/dokumen transjatim" },
                { label: "📝 /surat sku", text: "/surat sku" },
                { label: "🚨 /lapor", text: "/lapor" },
                { label: "👶 /posyandu", text: "/posyandu" },
                { label: "🌾 /bumdes", text: "/bumdes" },
                { label: "🚑 /darurat", text: "/darurat" },
                { label: "🏛️ /profil", text: "/profil" },
                { label: "💡 Berapa anggaran APBDes 2026?", text: "Berapa anggaran apbdes 2026 dan tampilkan dokumennya" },
                { label: "💬 Follow-up: Knp mati lampunya?", text: "knp kok sudah mati ? kapan terakhir di ganti lampunya ?" },
                { label: "📑 Syarat pengurusan SKU usaha", text: "Buatkan surat keterangan usaha warung sembako" }
              ].map((chip: any, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (chip.isVoice && chip.preset) {
                      handleSimulateVoicePreset(chip.preset);
                    } else if (chip.isDocPreset) {
                      handleAttachPreset(chip.isDocPreset);
                    } else if (chip.isMemoryVault) {
                      fetchMemoryDocs();
                      setShowMemoryModal(true);
                    } else if (chip.text) {
                      handleSendMessage(chip.text);
                    }
                  }}
                  className={`shrink-0 px-2.5 py-1 border rounded-lg text-[11px] font-medium transition-colors ${
                    chip.isVoice
                      ? 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border-rose-500/40'
                      : chip.isDocPreset
                        ? 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-200 border-emerald-500/40 font-semibold'
                        : chip.isMemoryVault
                          ? 'bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 border-indigo-500/40 font-semibold'
                          : chip.isVoiceToggle
                            ? (autoSpeak ? 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-200 border-amber-500/50 font-bold' : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-200 border-emerald-500/50 font-bold')
                            : 'bg-slate-800 hover:bg-sky-600/30 text-sky-200 border-slate-700'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Attached Document File Preview Banner */}
            {attachedFile && (
              <div className="bg-slate-900/95 px-4 py-2 border-t border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200 animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-white truncate block">{attachedFile.fileName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(attachedFile.fileSize / 1024).toFixed(1)} KB • Siap dikirim & dipelajari bot AI
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  title="Batalkan lampiran file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="bg-[#1e293b] p-3 border-t border-slate-700">
              {isRecordingVoice ? (
                <div className="flex items-center justify-between bg-red-950/50 border border-red-500/50 rounded-xl px-4 py-2.5 text-xs text-white">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="font-mono font-bold text-red-300 text-sm">
                      0:{String(recordingDuration).padStart(2, '0')}
                    </span>
                    <span className="text-slate-200 font-medium">
                      Merekam pesan suara warga... (Bicara sekarang)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Kirim Voice Note</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Hidden File Input for Excel, Word, PDF, CSV, TXT */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    accept=".xlsx,.xls,.docx,.doc,.pdf,.csv,.txt"
                    className="hidden"
                  />

                  {/* Attach Document Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-slate-800 hover:bg-emerald-900/40 hover:text-emerald-300 text-slate-300 rounded-xl transition-colors shrink-0 border border-slate-700 hover:border-emerald-500/40"
                    title="Lampirkan Dokumen (Excel, Word, PDF, CSV)"
                  >
                    <Paperclip className="w-4 h-4 text-emerald-400" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={attachedFile ? "Tulis keterangan file (opsional) lalu tekan Enter..." : "Ketik pesan Telegram, lampirkan dokumen, atau rekam suara..."}
                    className="flex-1 bg-[#0f172a] text-slate-100 placeholder-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500 transition-colors"
                  />

                  {/* Instant Audio Speech Mute / Unmute Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleAutoSpeak}
                    className={`p-2.5 rounded-xl transition-colors shrink-0 border ${
                      autoSpeak
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                    title={autoSpeak ? "Suara Bot Aktif: Otomatis membacakan jawaban. Klik untuk matikan." : "Suara Bot Mati. Klik untuk aktifkan balasan suara."}
                  >
                    {autoSpeak ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>

                  {/* Record Voice Note Button */}
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="p-2.5 bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 text-slate-300 rounded-xl transition-colors shrink-0 border border-slate-700 hover:border-rose-500/40"
                    title="Rekam Pesan Suara / Voice Note (Mikrofon)"
                  >
                    <Mic className="w-4 h-4 text-rose-400" />
                  </button>

                  {/* Simulate Photo Report Button */}
                  <button
                    type="button"
                    onClick={handleSimulatePhotoReport}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors shrink-0 border border-slate-700"
                    title="Simulasi Kirim Foto Kerusakan"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
                    className="p-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white rounded-xl font-bold transition-all shadow-md shrink-0"
                    title="Kirim ke Bot Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal for Village Announcements */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-100 rounded-xl text-sky-600">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Kirim Siaran Resmi ke Telegram
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pesan akan otomatis disiarkan ke pengguna aktif bot @{botUsername}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pesan Pengumuman
                </label>
                <textarea
                  rows={4}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>

              {broadcastFeedback && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-medium text-blue-800">
                  {broadcastFeedback}
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={broadcastSending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {broadcastSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{broadcastSending ? 'Mengirim...' : 'Kirim Siaran Sekarang'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Document Content Full Text Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>{selectedDocPreview.filename}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {(selectedDocPreview.content.length / 1024).toFixed(1)} KB
                    </span>
                  </h3>
                  {selectedDocPreview.caption && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedDocPreview.caption}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="my-4 flex-1 overflow-y-auto bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
              {selectedDocPreview.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Dokumen Resmi Terhubung Sistem Blackbox AI Desa Talangagung
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocPreview(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(selectedDocPreview)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Berkas (.txt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Note Simulation & Testing Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111827] text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Uji Coba Deteksi Pesan Suara (Voice Note)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Didukung Gemini Multimodal Audio • Deteksi Suara Bahasa Indonesia & Jawa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bot Telegram Desa Talangagung kini dilengkapi kemampuan mendengarkan pesan suara warga secara langsung. Pilih skenario suara siap uji di bawah ini atau rekam langsung via mikrofon:
            </p>

            <div className="space-y-2.5">
              {[
                {
                  title: "1. 📄 Minta Dokumen Resmi APBDes 2026",
                  spokenText: "Halo admin, saya mau tanya anggaran APBDes tahun 2026 Desa Talangagung berapa dan minta berkas dokumen resminya ya.",
                  desc: "Mendeteksi permintaan dokumen, menganalisis transkrip ucapan, dan otomatis melampirkan berkas APBDes 2026.",
                  duration: 6,
                  badge: "Dokumen RAG"
                },
                {
                  title: "2. 🚨 Lapor Lampu PJU Padam di Gang Krajan",
                  spokenText: "Pak Kades, tolong lampu penerangan jalan di gang dua RT satu padam sudah dua malam, mohon dicek.",
                  desc: "Mendeteksi laporan kerusakan fasilitas warga, mentranskripsikan lokasi, dan menerbitkan tiket laporan resmi.",
                  duration: 5,
                  badge: "Tiket Aduan"
                },
                {
                  title: "3. 📝 Buatkan Draf Surat Keterangan Usaha (SKU)",
                  spokenText: "Selamat siang kantor desa, saya mau buat draf surat keterangan usaha untuk toko sembako di rumah saya.",
                  desc: "Mendeteksi kebutuhan surat warga dan otomatis merumuskan draf berkas siap verifikasi petugas desa.",
                  duration: 5,
                  badge: "Layanan Surat"
                }
              ].map((scenario, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-300">
                      {scenario.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30">
                      {scenario.badge} • ~{scenario.duration}s
                    </span>
                  </div>
                  <p className="text-xs italic text-slate-300 font-mono bg-black/30 p-2 rounded-xl">
                    "{scenario.spokenText}"
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {scenario.desc}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSimulateVoicePreset({
                        label: scenario.title,
                        spokenText: scenario.spokenText,
                        duration: scenario.duration
                      })}
                      className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Kirim VN Ini</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Bisa juga rekam suara asli via tombol mikrofon di pojok bawah</span>
              <button
                type="button"
                onClick={() => setShowVoiceModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload & Ingestion Modal */}
      {showDocUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Unggah Dokumen ke Otak Bot Telegram
                  </h3>
                  <p className="text-xs text-slate-400">
                    Didukung Excel (.xlsx/.xls), Word (.docx/.doc), PDF, & CSV
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDocUploadModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bot Telegram akan membaca data, mengekstrak angka/tabel, merumuskan ringkasan otomatis, dan menyimpannya ke dalam memori desa agar siap menjawab pertanyaan warga kapan saja.
            </p>

            {/* Manual File Selector Box */}
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/60 transition-colors text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Paperclip className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Pilih Dokumen dari Komputer / HP Anda
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Format didukung: XLSX, XLS, DOCX, DOC, PDF, CSV, TXT (Maks 15 MB)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDocUploadModal(false);
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Pilih Berkas Dokumen</span>
              </button>
            </div>

            {/* 1-Click Village Sample Document Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Atau Uji dengan Contoh Berkas Resmi Desa (1-Klik):
                </span>
                <span className="text-[10px] text-slate-400">Siap Diuji</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Excel APBDes Sample */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Excel (.xlsx)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Tabel Anggaran</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-0.5">
                        Rincian_APBDes_Talangagung_2026.xlsx
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        5 Program, Pendapatan Asli Desa, & Dana Desa Rp 2.45 Miliar
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('excel')}
                    className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Word SK Linmas Sample */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-sky-300 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-500/30">
                          Word (.docx)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">SK Regulasi</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-0.5">
                        SK_Kades_Satgas_Linmas_Ronda_2026.docx
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        Keputusan Kepala Desa tentang Pengamanan Ronda Malam & Jadwal
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('word')}
                    className="shrink-0 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* PDF Monografi Sample */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500/30">
                          PDF (.pdf)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Data BPS</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-0.5">
                        Monografi_Kependudukan_Desa_2026.pdf
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        Statistik 12.845 Jiwa, 4 Dusun, Mata Pencaharian, & Fasilitas
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('pdf')}
                    className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Semua file disimpan di memori server dan aktif untuk balasan bot</span>
              <button
                type="button"
                onClick={() => setShowDocUploadModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Village Document Memory Vault Modal */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl w-full max-w-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Brankas Memori Dokumen AI Desa
                  </h3>
                  <p className="text-xs text-slate-400">
                    {memoryDocs.length} Dokumen Aktif Dipelajari oleh Bot Telegram
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMemoryDocs}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Segarkan data memori"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowMemoryModal(false)}
                  className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {memoryDocs.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Belum Ada Dokumen di Memori</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Unggah berkas Excel, Word, atau PDF agar bot Telegram memiliki pengetahuan khusus tentang data administrasi desa Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowMemoryModal(false);
                    setShowDocUploadModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Unggah Dokumen Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Daftar Berkas Terindeks di Otak AI:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMemoryModal(false);
                      setShowDocUploadModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold text-xs rounded-lg transition-colors"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>+ Tambah Dokumen</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {memoryDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                            {doc.fileType === 'excel' || doc.fileType === 'csv' ? (
                              <FileSpreadsheet className="w-5 h-5" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                                {doc.fileType.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Kategori: {doc.category}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {(doc.fileSize / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1">
                              {doc.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              File: {doc.originalFilename} • Diunggah: {new Date(doc.uploadedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteMemoryDoc(doc.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Hapus dari memori bot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-300 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/5">
                        {doc.summary}
                      </p>

                      {/* Key Data Highlights */}
                      {doc.keyData && doc.keyData.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                            <Database className="w-3 h-3" />
                            Data Kunci:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-200">
                            {doc.keyData.map((kd, kdIdx) => (
                              <div key={kdIdx} className="bg-slate-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span className="truncate">{kd}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Table Preview if exists */}
                      {doc.tableDataPreview && (
                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1 mb-1">
                            <Table className="w-3 h-3 text-sky-400" />
                            Cuplikan Data Lembar Kerja:
                          </span>
                          <div className="bg-black/50 p-2.5 rounded-xl border border-slate-800 overflow-x-auto text-[10px] font-mono text-slate-300 max-h-28 scrollbar-thin">
                            <pre className="whitespace-pre">{doc.tableDataPreview}</pre>
                          </div>
                        </div>
                      )}

                      {/* Suggested Questions to Test Bot Retrieval */}
                      {doc.suggestedQuestions && doc.suggestedQuestions.length > 0 && (
                        <div className="pt-2 border-t border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Pertanyaan Uji ke Bot (Klik untuk Tes):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {doc.suggestedQuestions.map((q, qIdx) => (
                              <button
                                key={qIdx}
                                type="button"
                                onClick={() => {
                                  setShowMemoryModal(false);
                                  handleSendMessage(q);
                                }}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-200 border border-slate-700 hover:border-emerald-500/40 transition-colors"
                              >
                                💬 {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Semua data dalam memori digunakan otomatis saat warga bertanya di Telegram</span>
              <button
                type="button"
                onClick={() => setShowMemoryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
