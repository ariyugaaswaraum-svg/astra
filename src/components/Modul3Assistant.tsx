import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  SendHorizontal, 
  User, 
  Smartphone, 
  Globe, 
  MessageSquare, 
  Zap, 
  BrainCircuit, 
  RotateCcw,
  Loader2,
  CheckCheck,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { 
  ChatMessage, 
  VillageProfile, 
  DocumentItem, 
  AssetItem, 
  HumanMemory, 
  UserContext, 
  CitizenReport, 
  LetterRequest, 
  PreventiveTask, 
  IoTSensorNode, 
  JobVacancy, 
  BumdesProduct 
} from '../types';
import { 
  speakText, 
  stopSpeech, 
  setupSpeechRecognition, 
  createAudioRecorder, 
  AudioRecorderHelper, 
  transcribeAudioWithGemini, 
  SpeechRecognitionHelper 
} from '../utils/speech';
import { buildCentralizedSystemContext, getAuthenticSourcesForContent } from '../utils/villageContextBuilder';
import { WhatsAppBotView } from './WhatsAppBotView';
import { TelegramBotView } from './TelegramBotView';
import { SourceCitationBlock } from './SourceCitationBlock';
import { recordAiRetrievalProof } from '../utils/closedLoopStore';

interface Modul3Props {
  villageProfile: VillageProfile;
  documents: DocumentItem[];
  assets: AssetItem[];
  memories: HumanMemory[];
  userContext?: UserContext;
  initialPrompt?: string;
  reports?: CitizenReport[];
  letters?: LetterRequest[];
  preventiveTasks?: PreventiveTask[];
  ioTSensors?: IoTSensorNode[];
  jobVacancies?: JobVacancy[];
  bumdesProducts?: BumdesProduct[];
}

export const Modul3Assistant: React.FC<Modul3Props> = ({
  villageProfile,
  documents,
  assets,
  memories,
  userContext,
  initialPrompt,
  reports,
  letters,
  preventiveTasks,
  ioTSensors,
  jobVacancies,
  bumdesProducts
}) => {
  const [platformMode, setPlatformMode] = useState<'whatsapp' | 'web' | 'telegram'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('desa_assistant_platform_mode') : null;
    if (saved === 'telegram' || saved === 'whatsapp' || saved === 'web') return saved;
    return 'telegram'; // Default to Telegram Bot as requested by user
  });
  const [userRole, setUserRole] = useState<'Kepala Desa' | 'Sekretaris Desa' | 'BPD' | 'Warga Desa'>('Warga Desa');
  const [deepReasoningMode, setDeepReasoningMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const recognizerRef = useRef<SpeechRecognitionHelper | null>(null);
  const audioRecorderRef = useRef<AudioRecorderHelper | null>(null);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'assistant',
      text: `Halo bapak dan ibu! Saya adalah **AI Asisten ${villageProfile.name}**.\n\nSaya siap membantu menjawab pertanyaan seputar surat-menyurat, dokumen APBDes, statistik BPS (5 RW & 27 RT), SMK Muhammadiyah 1 Kepanjen (Teaching Factory), inovasi Smart Feeder Pokdakan Molek Jaya, Karnaval HUT RI ke-80, dan BUMDes.\n\nAnda dapat **mengetik** atau **menekan tombol mikrofon 🎙️** untuk berbicara langsung. Tekan tombol speaker 🔊 jika ingin jawaban ini dibacakan.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastHandledPromptRef = useRef<string | null>(null);

  const generateUniqueMsgId = (prefix = 'msg') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Jalur terpusat setelah respons Asisten AI berhasil dirender di UI:
  // 1. Normalisasi teks jawaban
  // 2. Periksa keberadaan seluruh bukti (RPT-DEMO-PJU-001, AST-DEMO-PJU-RT02-004, SIM-REC-PJU-RT02-004, DATA B)
  // 3. Pastikan state closed loop sedang RECORDED_IN_MEMORY
  // 4. Panggil recordAiRetrievalProof hanya sekali (idempotent)
  // 5. Simpan hasil ke closedLoopStore/localStorage
  // 6. Emit pembaruan agar widget dan ClosedLoopTestSuite langsung bereaksi
  useEffect(() => {
    if (messages.length === 0 || isLoading) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'assistant' && lastMsg.text) {
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
        actorName: userRole
      });
    }
  }, [messages, isLoading, userRole]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '' && lastHandledPromptRef.current !== initialPrompt) {
      lastHandledPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleToggleVoiceInput = async () => {
    // If currently listening, stop and finalize
    if (isListening) {
      setIsListening(false);
      recognizerRef.current?.stop();

      // If MediaRecorder was active, process recorded audio as backup
      if (audioRecorderRef.current && audioRecorderRef.current.isRecording()) {
        setIsTranscribing(true);
        setVoiceNotice('Memproses ucapan suara Anda dengan AI...');
        try {
          const audioResult = await audioRecorderRef.current.stop();
          // If inputText is still empty, or SpeechRecognition didn't transcribe:
          if (!inputText.trim() && audioResult?.base64) {
            const aiTranscript = await transcribeAudioWithGemini(audioResult.base64, audioResult.mimeType);
            if (aiTranscript && aiTranscript.trim()) {
              setInputText(aiTranscript.trim());
              setVoiceNotice(`Suara dicatat: "${aiTranscript.trim()}"`);
              setTimeout(() => setVoiceNotice(null), 3500);
            } else {
              setVoiceNotice('Belum ada kata terdeteksi. Silakan coba bicara lagi atau gunakan tombol pilihan cepat.');
              setTimeout(() => setVoiceNotice(null), 4000);
            }
          } else {
            setVoiceNotice('Ucapan suara berhasil dicatat.');
            setTimeout(() => setVoiceNotice(null), 3000);
          }
        } catch (err) {
          console.warn('Voice transcription fallback error:', err);
        } finally {
          setIsTranscribing(false);
        }
      }
      return;
    }

    // Start listening
    setMicPermissionDenied(false);
    setVoiceNotice('Mendengarkan... Silakan berbicara sekarang.');

    // 1. Start audio recording in background as reliable fallback
    const recorder = createAudioRecorder();
    audioRecorderRef.current = recorder;
    const isMicAccessGranted = await recorder.start();
    if (!isMicAccessGranted) {
      console.info('Direct mic audio stream warning, relying on speech recognition');
    }

    // 2. Start Web Speech API with continuous listening and live interim results
    const recognizer = setupSpeechRecognition(
      (transcript) => {
        // Words appear live on screen in real time as the citizen speaks!
        setInputText(transcript);
        setVoiceNotice(`Mendengar: "${transcript}"`);
      },
      () => {
        // Recognition ended normally
      },
      (err: any) => {
        console.warn('SpeechRecognition error notice:', err);
        if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
          setMicPermissionDenied(true);
          setVoiceNotice('Akses mikrofon belum diizinkan di browser. Silakan izinkan akses mikrofon atau gunakan pilihan cepat di bawah.');
          setIsListening(false);
        } else if (err?.error === 'no-speech') {
          setVoiceNotice('Tidak ada suara terdengar. Silakan bicara lebih jelas.');
        } else if (err?.error === 'network') {
          setVoiceNotice('Layanan browser sedang sibuk, suara Anda direkam untuk diproses AI...');
        }
      }
    );

    recognizerRef.current = recognizer;
    if (recognizer.isSupported) {
      setIsListening(true);
      recognizer.start();
    } else {
      // If browser has no SpeechRecognition, use MediaRecorder exclusively
      if (isMicAccessGranted) {
        setIsListening(true);
        setVoiceNotice('Merekam suara Anda... Tekan tombol mikrofon lagi bila sudah selesai.');
      } else {
        setMicPermissionDenied(true);
        setVoiceNotice('Perangkat atau browser belum memberi akses mikrofon. Silakan gunakan tombol pertanyaan cepat di bawah.');
      }
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (activeSpeakingMsgId === msgId) {
      stopSpeech();
      setActiveSpeakingMsgId(null);
      return;
    }

    stopSpeech();
    setActiveSpeakingMsgId(msgId);
    speakText(
      text,
      () => setActiveSpeakingMsgId(null),
      () => setActiveSpeakingMsgId(msgId)
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateUniqueMsgId('user'),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      // Build dynamic centralized ground truth context object
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

      let endpoint = '/api/ai/assistant-chat';
      let payload: any = {
        messages: [...messages, userMsg],
        userRole,
        villageContext: centralizedContext
      };

      if (deepReasoningMode) {
        endpoint = '/api/ai/reasoning';
        payload = {
          problem: text,
          assets,
          documents,
          memories,
          villageContext: centralizedContext
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      let botText = '';

      if (deepReasoningMode && data.reasoning) {
        const r = data.reasoning;
        botText = `🧠 **ANALISIS KELUHAN & AKAR MASALAH (DEEP REASONING):**\n\n**Akar Masalah:** ${r.rootCause}\n\n**Bukti Historis Desa:**\n${r.historicalEvidence?.map((e: string) => `- ${e}`).join('\n')}\n\n**Faktor Pemicu:**\n${r.compoundingFactors?.map((f: string) => `- ${f}`).join('\n')}\n\n**Rekomendasi Solusi:**\n${r.recommendedSolution}\n\n**Estimasi Dampak:**\n${r.estimatedImpact}`;
      } else {
        botText = data.reply || data.answer || "Maaf, saya sedang memproses ulang data desa. Silakan ulangi pertanyaan Anda.";
      }

      const newBotId = generateUniqueMsgId('bot');
      const groundedSources = getAuthenticSourcesForContent(text, botText);

      const botMsg: ChatMessage = {
        id: newBotId,
        sender: 'assistant',
        text: botText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        mode: deepReasoningMode ? 'DeepReasoning' : 'Fast',
        sources: groundedSources
      };

      // Render pesan terlebih dahulu agar teks jawaban final tersedia di UI
      setMessages(prev => [...prev, botMsg]);

      // Panggil jalur verifikasi terpusat dengan teks jawaban final
      recordAiRetrievalProof({
        query: text,
        answer: botText,
        actorName: userRole
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: generateUniqueMsgId('err'),
        sender: 'assistant',
        text: "Terjadi gangguan jaringan saat menghubungkan ke Server Gemini AI Studio. Silakan coba beberapa saat lagi.",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetPrompts = [
    "Bagaimana riwayat penanganan lampu PJU Titik 04 RT 02 (RPT-DEMO-PJU-001)?",
    "Berapa jalan desa yang rusak saat ini?",
    "Mengapa jalan RT 05 sering rusak?",
    "Kapan jembatan dekat sawah diperbaiki?",
    "Ringkasan Anggaran Desa APBDes 2026",
    "Status Tanah Posyandu Melati Dusun 3"
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title & Quick Role Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Tanya Asisten AI Desa
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Layanan tanya jawab pintar ramah suara dan teks untuk warga, kepala desa, dan perangkat desa.
          </p>
        </div>

        {/* Controls: Role, Deep Reasoning, Platform */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Deep Reasoning Switcher */}
          <button
            onClick={() => setDeepReasoningMode(!deepReasoningMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              deepReasoningMode 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
            }`}
            title="Analisis akar masalah mendalam"
          >
            <BrainCircuit className="w-4 h-4 text-blue-500" />
            <span>Analisis Mendalam (AI Reasoning)</span>
          </button>

          {/* User Role Selector */}
          <select
            value={userRole}
            onChange={(e: any) => setUserRole(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 shadow-2xs"
          >
            <option value="Warga Desa">👤 Sebagai: Warga Desa</option>
            <option value="Kepala Desa">🏛️ Sebagai: Kepala Desa</option>
            <option value="Sekretaris Desa">📑 Sebagai: Sekretaris Desa</option>
            <option value="BPD">👥 Sebagai: Anggota BPD</option>
          </select>

          {/* Platform UI Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs gap-1 shadow-2xs">
            <button
              onClick={() => {
                setPlatformMode('telegram');
                try { localStorage.setItem('desa_assistant_platform_mode', 'telegram'); } catch {}
              }}
              className={`px-3 py-1.5 rounded-lg font-extrabold transition-all flex items-center space-x-1.5 ${
                platformMode === 'telegram' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Telegram Bot (@desablackboxai_bot)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                platformMode === 'telegram' ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                Aktif
              </span>
            </button>
            <button
              onClick={() => {
                setPlatformMode('web');
                try { localStorage.setItem('desa_assistant_platform_mode', 'web'); } catch {}
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
                platformMode === 'web' ? 'bg-white text-blue-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web AI</span>
            </button>
            <button
              onClick={() => {
                setPlatformMode('whatsapp');
                try { localStorage.setItem('desa_assistant_platform_mode', 'whatsapp'); } catch {}
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                platformMode === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Bot</span>
            </button>
          </div>
        </div>
      </div>

      {platformMode === 'whatsapp' ? (
        <WhatsAppBotView
          villageProfile={villageProfile}
          documents={documents}
          assets={assets}
          memories={memories}
          userContext={userContext}
          reports={reports}
          letters={letters}
          preventiveTasks={preventiveTasks}
          ioTSensors={ioTSensors}
          jobVacancies={jobVacancies}
          bumdesProducts={bumdesProducts}
        />
      ) : platformMode === 'telegram' ? (
        <TelegramBotView
          villageProfile={villageProfile}
          documents={documents}
          assets={assets}
          memories={memories}
          userContext={userContext}
        />
      ) : (
        <>
          {/* Preset Prompt Buttons Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-700 font-bold whitespace-nowrap flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-blue-600" /> Pilihan Cepat:
            </span>
            {presetPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-800 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* MAIN CHAT CONTAINER */}
          <div className={`mx-auto transition-all ${
            platformMode === 'telegram' ? 'max-w-md bg-slate-50 border-4 border-slate-300 rounded-3xl p-4 shadow-xl' : 'max-w-4xl bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs'
          }`}>
            {/* Telegram Header simulator if Telegram Mode active */}
            {platformMode === 'telegram' && (
              <div className="bg-blue-600 text-white p-3 rounded-2xl mb-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    BB
                  </div>
                  <div>
                    <h3 className="text-xs font-bold leading-none">@DesaBlackBoxBot</h3>
                    <span className="text-[10px] text-blue-100">bot • Asisten Pintar Desa</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-700 rounded-full">Simulasi Telegram</span>
              </div>
            )}

            {/* Messages List */}
            <div className="space-y-4 min-h-[380px] max-h-[520px] overflow-y-auto pr-2 scrollbar-thin">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const isSpeakingThis = activeSpeakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id ? `${msg.id}-${idx}` : `msg-${idx}`}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 space-y-2 shadow-2xs ${
                      isUser 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none'
                    }`}>
                      {/* Message Sender Header */}
                      <div className="flex items-center justify-between text-xs opacity-90 border-b border-black/5 pb-1 mb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          {isUser ? `👤 ${userRole}` : '🤖 Asisten AI Desa'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] opacity-75">{msg.timestamp}</span>
                          
                          {/* Audio Readout Button on Assistant Responses */}
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => handleSpeakMessage(msg.id, msg.text)}
                              className={`p-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                                isSpeakingThis 
                                  ? 'bg-rose-600 text-white animate-pulse' 
                                  : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                              }`}
                              title="Bacakan Jawaban Ini dengan Suara"
                            >
                              {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                              <span className="text-[10px]">{isSpeakingThis ? 'Berhenti' : 'Dengarkan'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Message Text Content */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </div>

                      {/* Structured Source Citation Block for Research-Grounded Answers (Only after user turns) */}
                      {!isUser && msg.id !== 'msg-welcome-1' && (
                        <SourceCitationBlock 
                          sources={msg.sources} 
                          defaultContext={msg.text}
                          theme="default" 
                        />
                      )}

                      {msg.mode === 'DeepReasoning' && (
                        <div className="mt-2 text-xs bg-blue-50 text-blue-900 p-2 rounded-lg border border-blue-200 flex items-center gap-1.5 font-semibold">
                          <BrainCircuit className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Hasil Analisis Penalaran Mendalam (Gemini AI Studio)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs sm:text-sm text-slate-700 flex items-center space-x-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Asisten sedang mencari di arsip dokumen & memori desa...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Voice Mic & Send */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                {/* Microphone Button (Bicara untuk Mengetik) */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  disabled={isTranscribing}
                  className={`p-3 rounded-xl font-bold transition-all shadow-2xs flex items-center justify-center shrink-0 ${
                    isListening 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-200' 
                      : isTranscribing
                      ? 'bg-blue-100 text-blue-600 border border-blue-200 cursor-wait'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200'
                  }`}
                  title={
                    isListening 
                      ? "Sedang mendengarkan... Klik untuk selesai berbicara" 
                      : isTranscribing
                      ? "Sedang memproses suara Anda..."
                      : "Tekan mikrofon untuk berbicara (Suara otomatis tertulis)"
                  }
                >
                  {isTranscribing ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  ) : isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5 text-blue-600" />
                  )}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening 
                      ? "Sedang mendengarkan... Bicara saja, kata-kata Anda langsung tertulis di sini..." 
                      : isTranscribing
                      ? "Memproses suara Anda ke teks..."
                      : "Ketik pesan atau tekan mikrofon untuk berbicara..."
                  }
                  className={`flex-1 bg-slate-50 border text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none shadow-2xs transition-all ${
                    isListening ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim() || isTranscribing}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-2xs shrink-0"
                  title="Kirim Pertanyaan"
                >
                  <SendHorizontal className="w-5 h-5" />
                </button>
              </form>

              {/* Real-Time Voice Feedback & Live Indicator */}
              {isListening && (
                <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-800 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                    </span>
                    <span className="font-semibold">
                      {voiceNotice || 'Mikrofon aktif: Silakan berbicara dengan jelas. Kata-kata Anda langsung ditulis otomatis.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    className="text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-md transition-colors"
                  >
                    Selesai Bicara
                  </button>
                </div>
              )}

              {isTranscribing && (
                <div className="mt-2.5 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-xs text-blue-800">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                  <span>Kecerdasan buatan sedang mengubah rekaman suara Anda menjadi teks yang rapi...</span>
                </div>
              )}

              {/* Permission notice if browser blocked mic */}
              {micPermissionDenied && (
                <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Izin mikrofon browser belum aktif.</span>
                    <p className="text-amber-700 mt-0.5">
                      Klik ikon gembok / kamera di samping alamat website (URL) di bagian atas browser Anda, lalu ubah <b>Mikrofon</b> menjadi <b>Izinkan (Allow)</b>. Anda juga dapat memilih pertanyaan cepat di bawah:
                    </p>
                  </div>
                </div>
              )}

              {/* One-Touch Quick Questions for Seniors and Quick Access */}
              <div className="mt-2.5 pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Tanya Cepat:
                </span>
                {[
                  { label: "📄 Syarat Surat SKU", prompt: "Bagaimana syarat pengurusan surat keterangan usaha (SKU) di desa?" },
                  { label: "👶 Jadwal Posyandu", prompt: "Kapan jadwal posyandu balita dan lansia terdekat di desa?" },
                  { label: "💡 Lapor Lampu Padam", prompt: "Saya ingin melaporkan lampu penerangan jalan umum (PJU) yang padam di RT 02." },
                  { label: "🌾 Beras BUMDes", prompt: "Berapa harga beras organik Pandan Wangi BUMDes Talangagung Makmur?" },
                  { label: "🚑 Mobil Siaga Desa", prompt: "Bagaimana cara meminjam mobil siaga atau ambulans desa jika ada warga sakit?" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(item.prompt);
                    }}
                    className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-medium transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
