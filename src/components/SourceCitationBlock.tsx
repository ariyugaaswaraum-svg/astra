import React from 'react';
import { FileText, CheckCircle2, RefreshCw, AlertCircle, XCircle, ShieldCheck, Calendar, Tag } from 'lucide-react';
import { GroundedSourceItem, SourceValidationStatus } from '../types';
import { getAuthenticSourcesForContent } from '../utils/villageContextBuilder';

interface SourceCitationBlockProps {
  sources?: GroundedSourceItem[];
  defaultContext?: string;
  theme?: 'default' | 'whatsapp';
}

export const getDefaultSourcesForText = (text: string): GroundedSourceItem[] => {
  return getAuthenticSourcesForContent(text);
};

export const SourceCitationBlock: React.FC<SourceCitationBlockProps> = ({
  sources,
  defaultContext = '',
  theme = 'default'
}) => {
  const activeSources = (sources && sources.length > 0) ? sources : (defaultContext ? getDefaultSourcesForText(defaultContext) : []);
  const isWa = theme === 'whatsapp';

  if (!activeSources || activeSources.length === 0) {
    return null;
  }

  const hasSimulationSources = activeSources.some(s => s.isSimulation || s.dataClassification === 'PROTOTYPE_SIMULATION' || s.validationStatus === 'SIMULATION_ONLY');

  const getStatusBadge = (s: GroundedSourceItem) => {
    if (s.isSimulation || s.dataClassification === 'PROTOTYPE_SIMULATION' || s.validationStatus === 'SIMULATION_ONLY') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span>DATA B — SIMULASI PROTOTIPE</span>
        </span>
      );
    }

    const status = s.validationStatus as SourceValidationStatus;
    switch (status) {
      case 'Terverifikasi':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Terverifikasi</span>
          </span>
        );
      case 'Diperbarui':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300">
            <RefreshCw className="w-3 h-3 text-sky-600 shrink-0" />
            <span>Diperbarui</span>
          </span>
        );
      case 'Belum Diverifikasi':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Belum Diverifikasi</span>
          </span>
        );
      case 'Tidak Berlaku':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Tidak Berlaku</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className={`mt-3 pt-2.5 border-t ${
      isWa ? 'border-emerald-100/80 bg-emerald-50/50 -mx-3 px-3 py-2 rounded-xl' : 'border-slate-200/90 bg-slate-100/60 p-2.5 rounded-xl'
    }`}>
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center space-x-1.5 text-[11px] font-extrabold text-slate-700">
          <ShieldCheck className={`w-3.5 h-3.5 ${hasSimulationSources ? 'text-amber-600' : 'text-blue-600'}`} />
          <span className="uppercase tracking-wider">
            {hasSimulationSources ? 'Record Internal Simulasi:' : 'Sumber Faktual:'}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {activeSources.length} {hasSimulationSources ? 'Record Simulasi' : 'Dokumen Rujukan'}
        </span>
      </div>

      <div className="space-y-2">
        {activeSources.map((s, idx) => {
          const isSim = s.isSimulation || s.dataClassification === 'PROTOTYPE_SIMULATION' || s.validationStatus === 'SIMULATION_ONLY';
          return (
            <div 
              key={idx}
              className={`rounded-lg p-2 text-left space-y-1.5 border transition-all ${
                isSim 
                  ? 'bg-amber-50/70 border-amber-300 shadow-2xs' 
                  : isWa ? 'bg-white/95 border-emerald-200/70 shadow-2xs' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              {/* Header: Document Name & Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-start space-x-1.5 min-w-0">
                  <FileText className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSim ? 'text-amber-600' : 'text-blue-600'}`} />
                  <span className="text-xs font-black text-slate-900 leading-tight">
                    {isSim ? 'Record Internal Simulasi Closed Loop' : s.documentName}
                  </span>
                </div>
                <div className="shrink-0 self-start sm:self-auto">
                  {getStatusBadge(s)}
                </div>
              </div>

            {/* Metadata: Date and Category */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                <Calendar className="w-3 h-3 text-slate-400" />
                {s.sourceDate}
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/50">
                <Tag className="w-3 h-3 text-blue-500" />
                {s.category}
              </span>
            </div>

            {/* Excerpt if present */}
            {s.excerpt && (
              <p className="text-[10px] text-slate-600 italic leading-snug border-l-2 border-slate-300 pl-2 mt-1">
                "{s.excerpt}"
              </p>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};
