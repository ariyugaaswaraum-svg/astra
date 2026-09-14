import { useState, useEffect } from 'react';
import { CitizenReport, LetterRequest, EmergencyAlert } from '../types';

const STORAGE_KEYS = {
  REPORT_DRAFT: 'desa_offline_report_draft',
  LETTER_DRAFT: 'desa_offline_letter_draft',
  REPORT_QUEUE: 'desa_offline_report_queue',
  LETTER_QUEUE: 'desa_offline_letter_queue',
  SOS_QUEUE: 'desa_offline_sos_queue',
};

// Hook to detect online / offline state
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Draft storage functions
export function saveDraft<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      savedAt: new Date().toISOString()
    }));
  } catch {
    // Storage quota or sandboxing error handled silently
  }
}

export function loadDraft<T>(key: string): { data: T; savedAt: string } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Handled silently
  }
}

// Offline Queues (items submitted while offline)
export function queueOfflineItem<T>(queueKey: string, item: T): void {
  try {
    const raw = localStorage.getItem(queueKey);
    const list: T[] = raw ? JSON.parse(raw) : [];
    list.push(item);
    localStorage.setItem(queueKey, JSON.stringify(list));
  } catch {
    // Handled silently
  }
}

export function getOfflineQueue<T>(queueKey: string): T[] {
  try {
    const raw = localStorage.getItem(queueKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearOfflineQueue(queueKey: string): void {
  try {
    localStorage.removeItem(queueKey);
  } catch {
    // Handled silently
  }
}

export { STORAGE_KEYS };
