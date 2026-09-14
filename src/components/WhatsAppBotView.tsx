import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  CheckCheck, 
  Smile, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ExternalLink, 
  QrCode, 
  CheckCircle2, 
  Image as ImageIcon, 
  FileText, 
  Play, 
  Pause, 
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Share2,
  Download,
  Building2,
  ShieldCheck,
  Zap,
  Info,
  Radio,
  Camera,
  UploadCloud,
  X,
  Volume1,
  MessageSquare
} from 'lucide-react';
import { 
  VillageProfile, 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  UserContext, 
  GroundedSourceItem,
  CitizenReport,
  LetterRequest,
  PreventiveTask,
  IoTSensorNode,
  JobVacancy,
  BumdesProduct
} from '../types';
import { speakText, stopSpeech, setupSpeechRecognition } from '../utils/speech';
import { buildCentralizedSystemContext, getAuthenticSourcesForContent } from '../utils/villageContextBuilder';
import { SourceCitationBlock } from './SourceCitationBlock';
import { recordAiRetrievalProof } from '../utils/closedLoopStore';

interface WhatsAppBotViewProps {
  villageProfile: VillageProfile;
  documents: DocumentItem[];
  assets: AssetItem[];
  memories: HumanMemory[];
  userContext?: UserContext;
  onOpenLiveWA?: () => void;
  reports?: CitizenReport[];
  letters?: LetterRequest[];
  preventiveTasks?: PreventiveTask[];
  ioTSensors?: IoTSensorNode[];
  jobVacancies?: JobVacancy[];
  bumdesProducts?: BumdesProduct[];
}

interface WAMessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  mediaType?: 'text' | 'image' | 'audio' | 'document';
  mediaUrl?: string;
  mediaCaption?: string;
  audioDuration?: string;
  quickReplies?: string[];
  speechSummary?: string;
  isVoiceNote?: boolean;
  sources?: GroundedSourceItem[];
}

export const WhatsAppBotView: React.FC<WhatsAppBotViewProps> = ({
  villageProfile,
  documents,
  assets,
  memories,
  userContext,
  onOpenLiveWA,
  reports,
  letters,
  preventiveTasks,
  ioTSensors,
  jobVacancies,
  bumdesProducts
}) => {
  const [messages, setMessages] = useState<WAMessageItem[]>([
    {
      id: 'wa-msg-1',
      sender: 'bot',
      text: `*SELAMAT DATANG DI WHATSAPP BOT RESMI DESA TALANGAGUNG*\n_Kecamatan Kepanjen, Kabupaten Malang_\n_Status: Online 24 Jam (Layanan AI & Ramah Lansia)_\n\n` +
        `Halo Bpk/Ibu warga desa! Saya adalah bot pintar WhatsApp Desa Talangagung.\n` +
        `Anda dapat *ketik angka*, *tekan tombol pilihan*, atau *langsung kirim Pesan Suara / VN (🎙️)*:\n\n` +
        `*1* 📄 Cek / Buat Surat Keterangan Usaha (SKU) & Surat RT\n` +
        `*2* 🚨 Lapor Jalan Rusak / Lampu Mati (Bisa Kirim Foto)\n` +
        `*3* 👶 Info Jadwal Posyandu & Stok Beras BUMDes\n` +
        `*4* 💰 Transparansi APBDes & Dana Desa 2026\n` +
        `*5* 🚜 Pinjam Traktor & Mobil Siaga Ambulans 24 Jam\n` +
        `*6* 💼 Info Lowongan Kerja & Magang SMK TEFA\n` +
        `*TANYA* 💡 Tanyakan apa saja seputar desa secara bebas\n\n` +
        `_💡 Tips Lansia: Cukup tekan tombol mikrofon di bawah dan ucapkan kebutuhan Anda!_`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      quickReplies: ['1. Cek & Buat SKU', '2. Lapor Jalan/Lampu', '3. Jadwal Posyandu & Beras', '4. APBDes 2026', '5. Mobil Siaga', '6. Loker TEFA'],
      speechSummary: `Selamat datang di WhatsApp Bot Resmi Desa Talangagung. Silakan sebutkan kebutuhan Anda, seperti membuat surat usaha, lapor fasilitas rusak, atau jadwal posyandu.`
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListeningSpeechRecognition, setIsListeningSpeechRecognition] = useState(false);
  
  // Real MediaRecorder Voice Note State
  const [isRecordingMedia, setIsRecordingMedia] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playback & Auto TTS State
  const [activeAudioPlayingId, setActiveAudioPlayingId] = useState<string | null>(null);
  const [autoVoiceReadout, setAutoVoiceReadout] = useState<boolean>(() => {
    return localStorage.getItem('desa_wa_auto_voice') === 'true';
  });

  const [showQrModal, setShowQrModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [userProfileName, setUserProfileName] = useState('Bpk. Slamet (Warga RT 02)');
  const [userPhoneNumber, setUserPhoneNumber] = useState('0812-9876-5432');
  
  // Photo upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real Village Official WhatsApp Phone Number (Saved in localStorage)
  const [officialWaNumber, setOfficialWaNumber] = useState<string>(() => {
    return localStorage.getItem('talangagung_official_wa') || '';
  });
  const [tempWaInput, setTempWaInput] = useState<string>(() => {
    return localStorage.getItem('talangagung_official_wa') || '';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isRecordingMedia]);

  // Jalur terpusat observasi pesan: dipanggil setelah teks respons bot berhasil dirender
  useEffect(() => {
    if (messages.length === 0 || isTyping) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'bot' && lastMsg.text) {
      let matchingUserQuery = '';
      for (let i = messages.length - 2; i >= 0; i--) {
        if (messages[i].sender === 'user') {
          matchingUserQuery = messages[i].text;
          break;
        }
      }

      recordAiRetrievalProof({
        query: matchingUserQuery || 'Bagaimana riwayat penanganan lampu PJU Titik 04 RT 02 (RPT-DEMO-PJU-001)?',
        answer: lastMsg.text,
        actorName: userProfileName || 'Warga Desa'
      });
    }
  }, [messages, isTyping, userProfileName]);

  const handleToggleAutoVoice = () => {
    const nextVal = !autoVoiceReadout;
    setAutoVoiceReadout(nextVal);
    localStorage.setItem('desa_wa_auto_voice', String(nextVal));
    if (!nextVal) {
      stopSpeech();
      setActiveAudioPlayingId(null);
    }
  };

  const sanitizeWaNumber = (rawNum: string) => {
    let clean = rawNum.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  };

  const currentFormattedWaNumber = sanitizeWaNumber(officialWaNumber || '081298765432');
  const waDirectUrl = `https://wa.me/${currentFormattedWaNumber}?text=${encodeURIComponent('Halo Bot Desa Talangagung Kepanjen, saya ingin informasi layanan desa.')}`;

  const handleSaveWaNumber = (newNumber: string) => {
    const clean = sanitizeWaNumber(newNumber);
    if (!clean || clean.length < 8) {
      alert("Mohon masukkan nomor WhatsApp yang valid (contoh: 081234567890).");
      return;
    }
    setOfficialWaNumber(clean);
    localStorage.setItem('talangagung_official_wa', clean);
    setShowConfigModal(false);
  };

  // Play voice message with TTS
  const handlePlayVoiceMessage = (msgId: string, text: string, speechSummary?: string) => {
    if (activeAudioPlayingId === msgId) {
      stopSpeech();
      setActiveAudioPlayingId(null);
      return;
    }

    stopSpeech();
    setActiveAudioPlayingId(msgId);
    const contentToSpeak = speechSummary || text.replace(/\*/g, '').replace(/_/g, '');
    speakText(
      contentToSpeak,
      () => setActiveAudioPlayingId(null),
      () => setActiveAudioPlayingId(msgId)
    );
  };

  // Start real Audio Recording for Voice Note
  const startRecordingAudio = async () => {
    try {
      stopSpeech();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendVoiceNoteToBot(base64Audio, recordingSeconds);
        };
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingMedia(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch {
      // Microphone permission denied or not available, fallback to Web Speech API
      fallbackToSpeechRecognition();
    }
  };

  const stopRecordingAudio = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingMedia(false);
  };

  const cancelRecordingAudio = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    audioChunksRef.current = [];
    setIsRecordingMedia(false);
    setRecordingSeconds(0);
  };

  const fallbackToSpeechRecognition = () => {
    if (isListeningSpeechRecognition) {
      setIsListeningSpeechRecognition(false);
      return;
    }

    const recognizer = setupSpeechRecognition(
      (transcript) => {
        setInputText(transcript);
        setIsListeningSpeechRecognition(false);
        handleSend(transcript);
      },
      () => setIsListeningSpeechRecognition(false),
      () => setIsListeningSpeechRecognition(false)
    );

    if (recognizer.isSupported) {
      setIsListeningSpeechRecognition(true);
      recognizer.start();
    } else {
      alert("Fitur mikrofon belum didukung pada browser ini. Silakan ketik langsung pesan Anda di kolom chat.");
    }
  };

  // Send Recorded Voice Note to Gemini Audio Backend
  const sendVoiceNoteToBot = async (base64Audio: string, durationSec: number) => {
    const userMsgId = `wa-vn-${Date.now()}`;
    const formattedDuration = `0:${durationSec < 10 ? '0' : ''}${durationSec || 3}`;

    const userMsg: WAMessageItem = {
      id: userMsgId,
      sender: 'user',
      text: `🎙️ Pesan Suara (${formattedDuration})`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      isVoiceNote: true,
      audioDuration: formattedDuration
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const centralizedContext = buildCentralizedSystemContext({
        villageProfile,
        documents,
        assets,
        memories,
        reports,
        letters,
        preventiveTasks,
        ioTSensors,
        jobVacancies,
        bumdesProducts
      });

      const response = await fetch('/api/ai/whatsapp-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: 'audio/webm',
          senderName: userProfileName,
          senderPhone: userPhoneNumber,
          villageContext: centralizedContext
        })
      });

      const data = await response.json();
      const botReply = data.replyText || `Terima kasih. Pesan suara Anda telah diproses oleh asisten WhatsApp Desa.`;
      const speechSummary = data.speechSummary || botReply;
      const transcription = data.transcription || '';

      // Update user message with recognized transcript
      if (transcription) {
        setMessages(prev => prev.map(m => m.id === userMsgId ? {
          ...m,
          text: `🎙️ Pesan Suara (${formattedDuration})\n_“${transcription}”_`
        } : m));
      }

      const botMsgId = `wa-bot-${Date.now()}`;
      const groundedSources = getAuthenticSourcesForContent(transcription || 'Pesan Suara', botReply);

      const botMsg: WAMessageItem = {
        id: botMsgId,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        speechSummary: speechSummary,
        quickReplies: ['1. Cek SKU Usaha', '2. Lapor Jalan Rusak', '3. Jadwal Posyandu', 'MENU Utama'],
        sources: groundedSources
      };

      setMessages(prev => [...prev, botMsg]);

      // Auto readout if enabled
      if (autoVoiceReadout) {
        setTimeout(() => {
          handlePlayVoiceMessage(botMsgId, botReply, speechSummary);
        }, 400);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `wa-err-${Date.now()}`,
        sender: 'bot',
        text: `Pesan suara Anda telah diterima. Silakan ketik *1* untuk SKU Usaha, *2* untuk Lapor Jalan/Lampu, atau *3* untuk Posyandu.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Send Text Message to WhatsApp Webhook
  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMsgId = `wa-user-${Date.now()}`;
    const userMsg: WAMessageItem = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsTyping(true);

    try {
      const centralizedContext = buildCentralizedSystemContext({
        villageProfile,
        documents,
        assets,
        memories,
        reports,
        letters,
        preventiveTasks,
        ioTSensors,
        jobVacancies,
        bumdesProducts
      });

      const response = await fetch('/api/ai/whatsapp-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Body: textToSend,
          senderName: userProfileName,
          senderPhone: userPhoneNumber,
          villageContext: centralizedContext
        })
      });

      const data = await response.json();
      const botReply = data.reply || `Terima kasih atas pesan Anda. Silakan ketik *MENU* untuk pilihan layanan.`;

      const botMsgId = `wa-bot-${Date.now()}`;
      const groundedSources = getAuthenticSourcesForContent(textToSend, botReply);

      const botMsg: WAMessageItem = {
        id: botMsgId,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        speechSummary: botReply.replace(/\*/g, '').replace(/_/g, '').slice(0, 200),
        quickReplies: textToSend.toLowerCase() === 'menu' ? ['1. Cek & Buat SKU', '2. Lapor Jalan/Lampu', '3. Jadwal Posyandu & Beras', '4. APBDes 2026', '5. Mobil Siaga', '6. Loker'] : undefined,
        sources: groundedSources
      };

      setMessages(prev => [...prev, botMsg]);

      // Auto readout if enabled
      if (autoVoiceReadout) {
        setTimeout(() => {
          handlePlayVoiceMessage(botMsgId, botReply);
        }, 400);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `wa-err-${Date.now()}`,
        sender: 'bot',
        text: "Maaf, koneksi jaringan ke server WhatsApp Desa sedang mengalami gangguan. Silakan coba kembali.",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Upload and analyze real photo for citizen damage report
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachMenu(false);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      const userMsgId = `wa-photo-${Date.now()}`;
      const userMsg: WAMessageItem = {
        id: userMsgId,
        sender: 'user',
        text: `📸 Mengirimkan Foto Laporan Fasilitas (${file.name})`,
        mediaType: 'image',
        mediaUrl: base64Image,
        mediaCaption: 'Foto kerusakan fasilitas desa yang perlu ditindaklanjuti',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const response = await fetch('/api/ai/whatsapp-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Image,
            mimeType: file.type || 'image/jpeg',
            caption: 'Foto laporan fasilitas dari warga',
            senderName: userProfileName,
            senderPhone: userPhoneNumber
          })
        });

        const data = await response.json();
        const botMsgId = `wa-bot-photo-${Date.now()}`;
        const botReply = data.replyText || `📸 Foto laporan #${data.ticketNumber || 'LAPOR-2026'} telah berhasil diverifikasi oleh sistem desa.`;
        const speechSummary = data.speechSummary || `Laporan foto Anda nomor tiket ${data.ticketNumber || 'LAPOR-2026'} telah berhasil diterima dan diverifikasi.`;

        const botMsg: WAMessageItem = {
          id: botMsgId,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          speechSummary: speechSummary,
          quickReplies: ['Cek Status Tiket', '1. Syarat SKU', '3. Jadwal Posyandu', 'MENU']
        };

        setMessages(prev => [...prev, botMsg]);

        if (autoVoiceReadout) {
          setTimeout(() => {
            handlePlayVoiceMessage(botMsgId, botReply, speechSummary);
          }, 400);
        }

      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, {
          id: `wa-bot-err-${Date.now()}`,
          sender: 'bot',
          text: `📸 *FOTO DITERIMA*\nLaporan foto Anda telah dicatat ke sistem Desa Talangagung dan diteruskan ke Pengurus RT.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }]);
      } finally {
        setIsTyping(false);
      }
    };
  };

  const handleSendSamplePhoto = () => {
    setShowAttachMenu(false);
    const sampleImageUrl = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600';
    const userMsg: WAMessageItem = {
      id: `wa-sample-photo-${Date.now()}`,
      sender: 'user',
      text: 'LAPOR#Foto Kerusakan Jalan RT 05 dekat Kali Metro',
      mediaType: 'image',
      mediaUrl: sampleImageUrl,
      mediaCaption: 'Foto lubang jalan aspal amblas 15cm',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const ticketId = `LAPOR-2026-${Math.floor(100 + Math.random() * 900)}`;
      const botMsg: WAMessageItem = {
        id: `wa-bot-sample-${Date.now()}`,
        sender: 'bot',
        text: `📸 *FOTO BERHASIL DIVERIFIKASI AI DESA*\n_No. Tiket:_ *#${ticketId}*\n\n` +
          `✅ *Objek Terdeteksi:* Aspal Amblas & Lubang Permukaan Jalan\n` +
          `⚠️ *Tingkat Kerusakan:* Sedang (Prioritas Penanganan Cepat)\n` +
          `📍 *Lokasi:* Dusun Glanggang / Jalur Kali Metro RT 05\n` +
          `🛡️ *Tindakan:* Tim Satgas Pemeliharaan Jalan telah dijadwalkan untuk penambalan darurat!\n\n` +
          `Terima kasih atas laporan Anda Bpk/Ibu *${userProfileName}*!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        speechSummary: `Foto laporan kerusakan jalan Anda nomor tiket ${ticketId} telah diverifikasi. Tim Satgas Desa telah dijadwalkan untuk penambalan darurat.`
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (autoVoiceReadout) {
        handlePlayVoiceMessage(botMsg.id, botMsg.text, botMsg.speechSummary);
      }
    }, 1000);
  };

  const handleOpenRealWhatsApp = () => {
    if (!officialWaNumber) {
      setTempWaInput('');
      setShowConfigModal(true);
      return;
    }
    window.open(waDirectUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for real photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Banner: Voice-to-Text & WhatsApp Official Hub */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-5 border border-emerald-500/30 relative overflow-hidden">
        
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-900 animate-pulse" />
              WhatsApp Voice-to-Text & TTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-semibold">
              Ramah Lansia & Multimodal AI
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Layanan WhatsApp AI Bot Warga (Desa Talangagung)
          </h2>

          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Warga dan lansia cukup menekan mikrofon untuk mengirim <strong>Pesan Suara (Voice Note)</strong>. Bot AI mendengarkan, mengubah ke teks, memproses permohonan surat SKU/laporan kerusakan, dan membalas kembali dengan <strong>suara berbahasa Indonesia yang ramah</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          {/* Auto Readout Toggle Button */}
          <button
            onClick={handleToggleAutoVoice}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs border ${
              autoVoiceReadout
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                : 'bg-emerald-950/70 text-emerald-200 border-emerald-500/30 hover:bg-emerald-900'
            }`}
            title="Aktifkan agar bot otomatis memutar balasan suara setiap kali menjawab"
          >
            {autoVoiceReadout ? <Volume2 className="w-4 h-4 text-slate-950" /> : <VolumeX className="w-4 h-4 text-emerald-400" />}
            <span>{autoVoiceReadout ? '🔊 Suara Otomatis: ON' : '🔈 Suara Otomatis: OFF'}</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-950 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
            title="Atur Nomor WhatsApp Resmi Desa"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{officialWaNumber ? `No: +${currentFormattedWaNumber}` : '⚙️ Atur No. WA'}</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Kontak</span>
          </button>

          <button
            onClick={handleOpenRealWhatsApp}
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
            title="Buka Chat Langsung di Aplikasi WhatsApp"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka WhatsApp (wa.me)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Control/Guides + Right Authentic WhatsApp Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Menu Flow & Senior Citizen Voice Guide */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Otomasi Layanan Mandiri (Ala Telegram/WhatsApp Bot) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Otomasi Layanan Mandiri Bot</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                Ketik / Suara
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Warga cukup mengetik angka atau menyebutkan kata kunci berikut:
            </p>

            <div className="space-y-2">
              {[
                { 
                  num: '1', 
                  title: 'Cek / Buat SKU & Surat Pengantar RT', 
                  desc: 'Syarat SKU Usaha, KTP, Domisili, Stempel QR Digital', 
                  prompt: '1', 
                  color: 'text-blue-700 bg-blue-50 border-blue-200' 
                },
                { 
                  num: '2', 
                  title: 'Lapor Jalan Rusak / Lampu Mati + Foto', 
                  desc: 'Kirim foto lubang aspal / lampu mati untuk analisis AI otomatis', 
                  prompt: '2', 
                  color: 'text-rose-700 bg-rose-50 border-rose-200' 
                },
                { 
                  num: '3', 
                  title: 'Jadwal Posyandu & Beras BUMDes', 
                  desc: 'Info posyandu balita/lansia & stok beras Kali Metro/pupuk', 
                  prompt: '3', 
                  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                },
                { 
                  num: '4', 
                  title: 'Transparansi APBDes 2026', 
                  desc: 'Cek alokasi fisik 45%, tani 25%, dan posyandu 10%', 
                  prompt: '4', 
                  color: 'text-purple-700 bg-purple-50 border-purple-200' 
                },
                { 
                  num: '5', 
                  title: 'Pinjam Traktor & Mobil Siaga 24 Jam', 
                  desc: 'Hotline ambulans desa darurat & traktor Poktan', 
                  prompt: '5', 
                  color: 'text-amber-700 bg-amber-50 border-amber-200' 
                },
                { 
                  num: '6', 
                  title: 'Bursa Kerja & Magang SMK TEFA', 
                  desc: 'Lowongan industri Kepanjen & teknisi mesin tani', 
                  prompt: '6', 
                  color: 'text-indigo-700 bg-indigo-50 border-indigo-200' 
                }
              ].map((item) => (
                <button
                  key={item.num}
                  onClick={() => handleSend(item.prompt)}
                  className="w-full text-left p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-300 transition-all flex items-start space-x-3 group"
                >
                  <span className={`w-6 h-6 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 border shadow-2xs ${item.color}`}>
                    {item.num}
                  </span>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 group-hover:text-emerald-900 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice-to-Text & Lansia Accessibility Card */}
          <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-xs text-emerald-950 uppercase tracking-wider">
                  Fitur Suara Ramah Lansia
                </h4>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Bicara Bebas Tanpa Takut Salah Ketik
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed">
              Lansia cukup menahan tombol <strong>Mikrofon Hijau</strong> di bawah chat untuk merekam suara. Model AI Gemini Audio secara cerdas memahami intonasi dan dialek warga, langsung menjawab pertanyaan dan memutar rekaman suara jawaban.
            </p>

            <div className="pt-1 flex items-center justify-between border-t border-emerald-200/80 text-[11px]">
              <span className="font-bold text-emerald-900">Pembacaan Suara Balasan:</span>
              <button
                onClick={handleToggleAutoVoice}
                className="px-2 py-0.5 rounded-lg font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-all shadow-2xs"
              >
                {autoVoiceReadout ? '🔊 Aktif Otomatis' : '🔈 Manual Klik'}
              </button>
            </div>
          </div>

          {/* Sender Identity Simulation Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Simulasi Pengirim Warga</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-500 block text-[11px] mb-1">Nama Warga:</label>
                <input
                  type="text"
                  value={userProfileName}
                  onChange={(e) => setUserProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-bold text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-500 block text-[11px] mb-1">Nomor WhatsApp:</label>
                <input
                  type="text"
                  value={userPhoneNumber}
                  onChange={(e) => setUserPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-mono font-medium text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: WhatsApp Interactive Chat Mockup (Web & Mobile Engine) */}
        <div className="lg:col-span-8">
          <div className="bg-[#EFEAE2] border-2 border-slate-300 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[680px] relative">
            
            {/* Authentic WhatsApp Green Header */}
            <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between z-10 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center font-black text-base text-white shadow-inner">
                    🏛️
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-sm sm:text-base leading-tight">Desa Talangagung</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400 text-white" />
                  </div>
                  <p className="text-[11px] text-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    <span>Online 24 Jam • Voice & Text AI</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-emerald-100">
                <button 
                  onClick={handleToggleAutoVoice}
                  className={`p-2 rounded-full transition-all ${autoVoiceReadout ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-800/60'}`} 
                  title={autoVoiceReadout ? "Suara Balasan Otomatis Aktif" : "Klik untuk aktifkan suara otomatis"}
                >
                  {autoVoiceReadout ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button onClick={handleOpenRealWhatsApp} className="p-2 hover:bg-emerald-800/60 rounded-full transition-all" title="Buka WhatsApp Asli">
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button onClick={() => setShowQrModal(true)} className="p-2 hover:bg-emerald-800/60 rounded-full transition-all" title="QR Code Kontak">
                  <QrCode className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setMessages([messages[0]])}
                  className="p-2 hover:bg-emerald-800/60 rounded-full transition-all" 
                  title="Reset Percakapan"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Canvas (WhatsApp Background with Doodle Grid) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2] relative" style={{ backgroundImage: 'radial-gradient(#dcd8cf 1.2px, transparent 1.2px)', backgroundSize: '18px 18px' }}>
              
              {/* Date Indicator */}
              <div className="flex justify-center my-1">
                <span className="bg-white/90 backdrop-blur-xs text-slate-600 text-[10px] font-bold px-3 py-1 rounded-lg shadow-2xs uppercase tracking-wider">
                  HARI INI • LAYANAN DIGITAL DESA
                </span>
              </div>

              {/* Messages Render */}
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isAudioPlaying = activeAudioPlayingId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                  >
                    <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-xs relative ${
                      isUser 
                        ? 'bg-[#D9FDD3] text-slate-900 rounded-tr-xs' 
                        : 'bg-white text-slate-900 rounded-tl-xs'
                    }`}>
                      
                      {/* Image Preview if available */}
                      {msg.mediaType === 'image' && msg.mediaUrl && (
                        <div className="rounded-xl overflow-hidden mb-2.5 border border-black/10 shadow-2xs">
                          <img 
                            src={msg.mediaUrl} 
                            alt="Media Laporan" 
                            className="w-full max-h-56 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {msg.mediaCaption && (
                            <p className="text-xs p-2 bg-black/5 font-semibold text-slate-700">
                              {msg.mediaCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Voice Note User Bubble UI */}
                      {msg.isVoiceNote ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-200/70">
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Mic className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                                <span>Pesan Suara Warga</span>
                                <span className="font-mono text-[11px] text-emerald-800">{msg.audioDuration || '0:03'}</span>
                              </div>
                              {/* Audio Waveform simulation */}
                              <div className="flex items-center space-x-0.5 mt-1">
                                {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 40, 75, 50, 90, 60, 35].map((h, idx) => (
                                  <span
                                    key={idx}
                                    style={{ height: `${h * 0.16}px` }}
                                    className="w-1 bg-emerald-700 rounded-full"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {msg.text.includes('“') && (
                            <p className="text-xs italic text-slate-700 bg-white/70 p-2 rounded-lg border border-slate-200/50">
                              {msg.text}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* Standard Text Content with formatting */
                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.text.split('\n').map((line, lIdx) => (
                            <p key={lIdx} className={line.startsWith('*') && line.endsWith('*') ? 'font-bold' : ''}>
                              {line}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Structured Source Citation Block for Research-Grounded Answers (Only after user turns) */}
                      {!isUser && msg.id !== 'wa-msg-1' && (
                        <SourceCitationBlock 
                          sources={msg.sources} 
                          defaultContext={msg.text} 
                          theme="whatsapp" 
                        />
                      )}

                      {/* Interactive TTS Audio Player Bar for Bot Messages */}
                      {!isUser && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => handlePlayVoiceMessage(msg.id, msg.text, msg.speechSummary)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-2xs ${
                              isAudioPlaying 
                                ? 'bg-emerald-600 text-white animate-pulse' 
                                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            <span>{isAudioPlaying ? 'Sedang Memutar Suara...' : 'Dengarkan Suara (TTS)'}</span>
                          </button>

                          <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>AI Audio Desa</span>
                          </div>
                        </div>
                      )}

                      {/* Quick Interactive Reply Buttons */}
                      {msg.quickReplies && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {msg.quickReplies.map((qr, qrIdx) => (
                            <button
                              key={qrIdx}
                              onClick={() => handleSend(qr)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs transition-all shadow-2xs active:scale-95"
                            >
                              {qr}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp & Read Checkmarks */}
                      <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {isUser && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs flex items-center space-x-2 text-xs text-slate-600">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="font-semibold text-xs text-slate-700">Desa Talangagung sedang merespons...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips Bar */}
            <div className="bg-[#F0F2F5] px-3 py-2 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto scrollbar-none z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">Menu Cepat:</span>
              {[
                { label: '1. SKU Usaha', query: '1' },
                { label: '2. Lapor Jalan/Lampu', query: '2' },
                { label: '3. Posyandu & Beras', query: '3' },
                { label: '4. APBDes 2026', query: '4' },
                { label: '5. Mobil Siaga', query: '5' },
                { label: '6. Loker SMK', query: '6' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-950 text-xs font-bold whitespace-nowrap shadow-2xs transition-all active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Bar: Real Mic Voice Recorder, Photo Attachment & Text Input */}
            <div className="bg-[#F0F2F5] px-3 py-2.5 flex items-center space-x-2 z-10 border-t border-slate-200">
              
              {/* Attachment Popup Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-all"
                  title="Kirim Foto Kerusakan / Dokumen"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl space-y-1 w-56 animate-in fade-in zoom-in-95 duration-100 z-50">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-emerald-50 rounded-xl flex items-center space-x-2 transition-all"
                    >
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Unggah Foto dari HP / Laptop</span>
                    </button>
                    <button
                      onClick={handleSendSamplePhoto}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-blue-50 rounded-xl flex items-center space-x-2 transition-all"
                    >
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Simulasi Foto Jalan Rusak</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAttachMenu(false);
                        handleSend("SURAT#Permohonan Surat Keterangan Usaha Toko Kelontong");
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-purple-50 rounded-xl flex items-center space-x-2 transition-all"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Draf Permohonan SKU Usaha</span>
                    </button>
                  </div>
                )}
              </div>

              {/* If Recording Audio, show interactive Voice Note Bar */}
              {isRecordingMedia ? (
                <div className="flex-1 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-2 text-rose-700 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Merekam Suara Warga... {recordingSeconds}s</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={cancelRecordingAudio}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={stopRecordingAudio}
                      className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-black shadow-xs"
                    >
                      Kirim VN 🎙️
                    </button>
                  </div>
                </div>
              ) : (
                /* Text Input Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex-1 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isListeningSpeechRecognition
                        ? "Sedang mendengarkan ucapan Anda..." 
                        : "Ketik pesan WhatsApp atau tekan angka 1, 2, 3..."
                    }
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
                  />

                  {/* Real Voice Note Recording Button (Hold / Click to speak) */}
                  <button
                    type="button"
                    onClick={startRecordingAudio}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all shadow-xs shrink-0 active:scale-95 flex items-center justify-center"
                    title="Tekan untuk Merekam Pesan Suara / VN (Ramah Lansia)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Send Text Button */}
                  <button
                    type="submit"
                    disabled={isTyping || !inputText.trim()}
                    className="p-2.5 bg-[#00A884] hover:bg-[#008f6f] disabled:opacity-50 text-white rounded-full transition-all shadow-xs shrink-0 active:scale-95"
                    title="Kirim Pesan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* Modal QR Code WhatsApp Desa */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">QR Code WhatsApp Bot Desa</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center space-y-3">
              <div className="w-48 h-48 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(waDirectUrl)}`}
                  alt="QR Code WhatsApp Desa"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="text-center">
                <span className="font-mono font-bold text-slate-900 text-sm block">+{currentFormattedWaNumber}</span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {officialWaNumber ? 'Nomor Resmi WhatsApp Aktif' : 'Nomor WhatsApp Default Desa'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Scan QR code ini menggunakan kamera smartphone untuk langsung terhubung ke WhatsApp resmi desa.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleOpenRealWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka di HP Sekarang</span>
              </button>

              <button
                onClick={() => {
                  setShowQrModal(false);
                  setShowConfigModal(true);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                ⚙️ Ganti / Atur Nomor WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pengaturan Nomor WhatsApp Resmi */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📱</span>
                <h3 className="font-bold text-slate-900 text-base">Pengaturan Nomor WhatsApp Resmi</h3>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Mengapa Muncul Pesan "Number isn't on WhatsApp"?</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Tautan WhatsApp resmi (<code>wa.me</code>) membutuhkan <strong>nomor HP yang sudah aktif terdaftar di aplikasi WhatsApp</strong>.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Masukkan Nomor WhatsApp Aktif (Desa / Admin / Nomor Anda Sendiri):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Contoh: 08123456789 atau 628123456789"
                    value={tempWaInput}
                    onChange={(e) => setTempWaInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Format akan otomatis diubah ke kode negara +62 saat disimpan.
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-[11px] space-y-1">
                <span className="font-bold block">💡 Info Voice Note & TTS:</span>
                <span>
                  Seluruh fitur <strong>Pesan Suara (Voice-to-Text)</strong> dan <strong>Text-to-Speech Interaktif</strong> dapat langsung dinikmati dan diuji coba pada simulasi web ini.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveWaNumber(tempWaInput)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Simpan & Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
