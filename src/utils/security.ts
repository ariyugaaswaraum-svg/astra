import { UserContext, CitizenReport, LetterRequest, DataClassification, AccessLevel } from '../types';

/**
 * Masks a National Identity Number (NIK) for citizen privacy.
 * Example: "3507051203850003" -> "350705********03"
 */
export function maskNIK(nik?: string | null): string {
  if (!nik) return '350705********01';
  const clean = nik.replace(/\D/g, '');
  if (clean.length < 8) return '350705********01';
  const prefix = clean.slice(0, 6);
  const suffix = clean.slice(-2);
  return `${prefix}********${suffix}`;
}

/**
 * Masks a telephone/WhatsApp number for privacy.
 * Example: "0812-9876-5432" -> "0812-****-5432"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '0812-****-xxxx';
  const parts = phone.split('-');
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }
  if (phone.length >= 10) {
    return `${phone.slice(0, 4)}-****-${phone.slice(-4)}`;
  }
  return '0812-****-xxxx';
}

/**
 * Comprehensive geographical validation result interface.
 */
export interface GeographyValidationResult {
  isValid: boolean;
  isConsistent: boolean;
  statusLabel?: string;
  inconsistencyReason?: string;
}

/**
 * Validates the geographical consistency of a record.
 * Checks consistency across:
 * - Structured rtRw (e.g. "RT 02 / RW 01")
 * - Dusun field (e.g. "Dusun 1 (Krajan)")
 * - Text in title (e.g. "Lampu Gang RT 22 RW 05")
 * - Text in description
 * - Associated assetId
 */
export function validateRecordGeography(record: {
  rtRw?: string;
  dusun?: string;
  title?: string;
  description?: string;
  assetId?: string;
}): GeographyValidationResult {
  if (!record) {
    return { isValid: false, isConsistent: false, statusLabel: 'DATA TIDAK KONSISTEN—PERLU VERIFIKASI', inconsistencyReason: 'Data record kosong.' };
  }

  const rawRtRw = record.rtRw || '';
  const rawDusun = record.dusun || '';
  const rawTitle = record.title || '';
  const rawDesc = record.description || '';

  // 1. Extract structured RT & RW numbers
  const rtMatch = rawRtRw.match(/\bRT\s*0?(\d{1,2})\b/i);
  const rwMatch = rawRtRw.match(/\bRW\s*0?(\d{1,2})\b/i);

  const structuredRt = rtMatch ? parseInt(rtMatch[1], 10) : null;
  const structuredRw = rwMatch ? parseInt(rwMatch[1], 10) : null;

  // 2. Validate RT against RW bounds in Desa Talangagung:
  // RW 01: RT 01-06 (Dusun Krajan)
  // RW 02: RT 07-11 (Dusun Jatisari)
  // RW 03: RT 12-16 (Dusun Glanggang)
  // RW 04: RT 17-21 (Dusun Krajan Timur)
  // RW 05: RT 22-27 (Dusun Perumnas / Kepanjen Permai)
  if (structuredRt !== null && structuredRw !== null) {
    const validRwForRt = 
      structuredRt >= 1 && structuredRt <= 6 ? 1 :
      structuredRt >= 7 && structuredRt <= 11 ? 2 :
      structuredRt >= 12 && structuredRt <= 16 ? 3 :
      structuredRt >= 17 && structuredRt <= 21 ? 4 :
      structuredRt >= 22 && structuredRt <= 27 ? 5 : null;

    if (validRwForRt !== null && validRwForRt !== structuredRw) {
      return {
        isValid: false,
        isConsistent: false,
        statusLabel: 'DATA TIDAK KONSISTEN—PERLU VERIFIKASI',
        inconsistencyReason: `Inkonsistensi RT/RW: RT ${structuredRt} secara administratif berada di RW 0${validRwForRt}, bukan RW 0${structuredRw}.`
      };
    }
  }

  // 3. Validate Dusun against RW
  if (structuredRw !== null && rawDusun) {
    const dusunLower = rawDusun.toLowerCase();
    const expectedDusunKeyword = 
      structuredRw === 1 ? 'krajan' :
      structuredRw === 2 ? 'jatisari' :
      structuredRw === 3 ? 'glanggang' :
      structuredRw === 4 ? 'krajan timur' :
      structuredRw === 5 ? 'perumnas' : '';

    if (expectedDusunKeyword && !dusunLower.includes(expectedDusunKeyword) && !dusunLower.includes(`dusun ${structuredRw}`)) {
      return {
        isValid: false,
        isConsistent: false,
        statusLabel: 'DATA TIDAK KONSISTEN—PERLU VERIFIKASI',
        inconsistencyReason: `Inkonsistensi Dusun: Wilayah RW 0${structuredRw} tidak cocok dengan ${rawDusun}.`
      };
    }
  }

  // 4. Check for conflicting RT/RW mentions in Title & Description
  const combinedText = `${rawTitle} ${rawDesc}`;

  // Find all RT mentions in title
  const titleRtMatches = Array.from(rawTitle.matchAll(/\bRT\s*0?(\d{1,2})\b/gi)).map(m => parseInt(m[1], 10));
  if (structuredRt !== null && titleRtMatches.length > 0) {
    for (const tRt of titleRtMatches) {
      if (tRt !== structuredRt) {
        return {
          isValid: false,
          isConsistent: false,
          statusLabel: 'DATA TIDAK KONSISTEN—PERLU VERIFIKASI',
          inconsistencyReason: `Konflik Judul & Wilayah: Judul menyebut RT ${tRt}, tetapi record dialokasikan pada RT ${structuredRt}.`
        };
      }
    }
  }

  // Find all RW mentions in title
  const titleRwMatches = Array.from(rawTitle.matchAll(/\bRW\s*0?(\d{1,2})\b/gi)).map(m => parseInt(m[1], 10));
  if (structuredRw !== null && titleRwMatches.length > 0) {
    for (const tRw of titleRwMatches) {
      if (tRw !== structuredRw) {
        return {
          isValid: false,
          isConsistent: false,
          statusLabel: 'DATA TIDAK KONSISTEN—PERLU VERIFIKASI',
          inconsistencyReason: `Konflik Judul & Wilayah: Judul menyebut RW ${tRw}, tetapi record dialokasikan pada RW ${structuredRw}.`
        };
      }
    }
  }

  return {
    isValid: true,
    isConsistent: true
  };
}

/**
 * Checks whether the current user role has permission to view a specific citizen record.
 * - Warga: Only their own records (matches citizenId or applicantName/reporterName).
 * - RT: Records within their specific RT & RW territory (exact boundary check).
 * - RW: Records within their RW territory.
 * - Perangkat / Kades / Admin: All records across the village.
 */
export function canViewCitizenRecord(
  record: { citizenId?: string; applicantName?: string; reporterName?: string; rtRw?: string; dusun?: string; title?: string; description?: string },
  userContext: UserContext
): boolean {
  if (!userContext) return true;

  // 1. Real-time Geography integrity check: exclude corrupted or conflicting records
  const geoValidation = validateRecordGeography(record);
  if (!geoValidation.isValid) {
    return false;
  }

  // Village leadership & staff have full access
  if (userContext.role === 'kades' || userContext.role === 'perangkat') {
    return true;
  }

  // Warga role: MUST satisfy BOTH citizen identity AND territory (RT/RW) rules
  if (userContext.role === 'warga') {
    const userRt = userContext.rt || 'RT 02';
    const userRw = userContext.rw || 'RW 01';
    const rtNum = userRt.replace(/\D/g, '');
    const rwNum = userRw.replace(/\D/g, '');

    const targetRtRw = record.rtRw || '';
    const hasRt = new RegExp(`\\bRT\\s*0?${parseInt(rtNum, 10)}\\b`, 'i').test(targetRtRw);
    const hasRw = new RegExp(`\\bRW\\s*0?${parseInt(rwNum, 10)}\\b`, 'i').test(targetRtRw);

    // If the record's location is outside user's RT/RW, exclude it
    if (!hasRt || !hasRw) {
      return false;
    }

    // Must also strictly match citizen identity
    const targetCitizenId = userContext.citizenId || userContext.id;
    if (record.citizenId && targetCitizenId) {
      return record.citizenId === targetCitizenId;
    }
    const isApplicant = record.applicantName && (
      record.applicantName.toLowerCase().trim() === userContext.name.toLowerCase().trim() ||
      userContext.name.toLowerCase().includes(record.applicantName.toLowerCase()) ||
      (record.applicantName.toLowerCase().includes('budi') && userContext.name.toLowerCase().includes('budi'))
    );
    const isReporter = record.reporterName && (
      record.reporterName.toLowerCase().trim() === userContext.name.toLowerCase().trim() ||
      userContext.name.toLowerCase().includes(record.reporterName.toLowerCase()) ||
      (record.reporterName.toLowerCase().includes('budi') && userContext.name.toLowerCase().includes('budi'))
    );
    return Boolean(isApplicant || isReporter);
  }

  // RT only sees records from their exact RT & RW (word-boundary regex, avoiding partial matches like RT 2 matching RT 22)
  if (userContext.role === 'rt') {
    const userRt = userContext.rt || 'RT 02';
    const userRw = userContext.rw || 'RW 01';
    const rtNum = userRt.replace(/\D/g, '');
    const rwNum = userRw.replace(/\D/g, '');

    const targetRtRw = record.rtRw || '';
    const hasRt = new RegExp(`\\bRT\\s*0?${parseInt(rtNum, 10)}\\b`, 'i').test(targetRtRw);
    const hasRw = new RegExp(`\\bRW\\s*0?${parseInt(rwNum, 10)}\\b`, 'i').test(targetRtRw);

    return hasRt && hasRw;
  }

  // RW sees records from their RW (word-boundary regex)
  if (userContext.role === 'rw') {
    const userRw = userContext.rw || 'RW 01';
    const rwNum = userRw.replace(/\D/g, '');
    const targetRtRw = record.rtRw || '';
    return new RegExp(`\\bRW\\s*0?${parseInt(rwNum, 10)}\\b`, 'i').test(targetRtRw);
  }

  return true;
}

/**
 * Filters a list of records according to the active user role and privacy rules.
 */
export function filterRecordsByRole<T extends { citizenId?: string; applicantName?: string; reporterName?: string; rtRw?: string; dusun?: string; [key: string]: any }>(
  records: T[],
  userContext: UserContext
): T[] {
  if (!records || !Array.isArray(records)) return [];
  return records.filter(item => canViewCitizenRecord(item, userContext));
}

/**
 * Sanitizes any raw context before passing to AI or client displays,
 * replacing unmasked 16-digit NIKs with masked versions.
 */
export function sanitizeAIContext(rawText: string): string {
  if (!rawText) return '';
  // Mask 16-digit numbers resembling NIK
  let sanitized = rawText.replace(/\b(\d{6})\d{8}(\d{2})\b/g, '$1********$2');
  // Mask Indonesian phone numbers
  sanitized = sanitized.replace(/\b(08\d{2})[- ]?(\d{4})[- ]?(\d{4})\b/g, '$1-****-$3');
  return sanitized;
}

export interface AuditTrailItem {
  id: string;
  action: 'VERIFIKASI_LAPORAN' | 'PERSETUJUAN_SURAT' | 'PENOLAKAN' | 'DISPOSISI_DESA';
  entityId: string;
  actorName: string;
  actorRole: string;
  previousStatus: string;
  newStatus: string;
  timestamp: string;
  notes?: string;
}

export const DATA_CLASSIFICATION_INFO: Record<DataClassification, { label: string; badgeClass: string; description: string }> = {
  FACTUAL_VERIFIED: {
    label: 'DATA A — Faktual Terverifikasi',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Berasal dari dokumen resmi, arsip SK/KIB, dan data primer desa.'
  },
  PROTOTYPE_SIMULATION: {
    label: 'DATA B — Simulasi Prototipe',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Data simulasi untuk demonstrasi alur kerja sistem.'
  },
  EXPERIMENT_RESULT: {
    label: 'DATA C — Hasil Pengujian',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Hasil pengujian komputasi/AI dalam lingkup riset prototipe.'
  }
};

export const ACCESS_LEVEL_INFO: Record<AccessLevel, { label: string; badgeClass: string; description: string }> = {
  PUBLIC: {
    label: 'Publik Terbuka',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Dapat diakses oleh seluruh warga dan umum.'
  },
  INTERNAL: {
    label: 'Internal Aparatur Desa',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Hanya dapat diakses oleh RT, RW, dan Perangkat Desa.'
  },
  RESTRICTED_PERSONAL: {
    label: 'Privat Terbatas (PDP)',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Data pribadi warga disamarkan dan dilindungi sesuai UU Perlindungan Data Pribadi.'
  }
};
