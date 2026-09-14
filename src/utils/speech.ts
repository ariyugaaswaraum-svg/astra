// Utilities for Voice Recognition and Text-to-Speech (Ramah Lansia & Semua Kalangan)

export const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/[#*_`~>-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
};

export const speakText = (
  text: string, 
  onEnd?: () => void, 
  onStart?: () => void
): SpeechSynthesisUtterance | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  window.speechSynthesis.cancel();

  const clean = cleanTextForSpeech(text);
  if (!clean) return null;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95; // Slightly slower, very clear and comfortable for elderly
  utterance.pitch = 1.0;

  // Try to find Indonesian voice
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Speech Recognition (Bicara untuk Mengetik Secara Real-Time)
export interface SpeechRecognitionHelper {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export const setupSpeechRecognition = (
  onResult: (transcript: string) => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): SpeechRecognitionHelper => {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognitionClass = 
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  let recognition: any = null;
  try {
    recognition = new SpeechRecognitionClass();
  } catch {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  recognition.lang = 'id-ID';
  // Allow continuous listening so it doesn't abruptly drop while user is thinking
  recognition.continuous = true;
  // Enable interim results so text appears immediately as words are spoken!
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = 0; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    const current = (finalTranscript + interimTranscript).trim();
    if (current) {
      onResult(current);
    }
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.onerror = (event: any) => {
    console.warn('SpeechRecognition event error:', event?.error || event);
    if (onError) onError(event);
    // Don't auto-kill if error is benign
    if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
      if (onEnd) onEnd();
    }
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    },
    isSupported: true,
  };
};

/**
 * MediaRecorder Audio Capture Helper (Works on all modern browsers & iframes)
 */
export interface AudioRecorderHelper {
  start: () => Promise<boolean>;
  stop: () => Promise<{ base64: string; mimeType: string } | null>;
  isRecording: () => boolean;
}

export const createAudioRecorder = (): AudioRecorderHelper => {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let stream: MediaStream | null = null;
  let recording = false;

  const start = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.start(200); // 200ms slices
      recording = true;
      return true;
    } catch (err) {
      console.warn('getUserMedia audio error:', err);
      recording = false;
      return false;
    }
  };

  const stop = (): Promise<{ base64: string; mimeType: string } | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        recording = false;
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
          stream = null;
        }
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        recording = false;

        if (stream) {
          stream.getTracks().forEach(t => t.stop());
          stream = null;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve({ base64: result, mimeType });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(audioBlob);
      };

      try {
        mediaRecorder.stop();
      } catch {
        recording = false;
        resolve(null);
      }
    });
  };

  return {
    start,
    stop,
    isRecording: () => recording,
  };
};

/**
 * Send Recorded Audio to Gemini Multimodal Audio Transcription Backend
 */
export const transcribeAudioWithGemini = async (
  audioBase64: string, 
  mimeType?: string
): Promise<string> => {
  try {
    const res = await fetch('/api/ai/transcribe-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType })
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.text || '';
  } catch (err) {
    console.warn('transcribeAudioWithGemini error:', err);
    return '';
  }
};
