import React from 'react';
import { ShieldCheck, Info, Sparkles, Lock, Globe, Users } from 'lucide-react';
import { DataClassification, AccessLevel } from '../types';
import { DATA_CLASSIFICATION_INFO, ACCESS_LEVEL_INFO } from '../utils/security';

interface DataClassificationBadgeProps {
  type: DataClassification;
  customText?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const DataClassificationBadge: React.FC<DataClassificationBadgeProps> = ({
  type,
  customText,
  size = 'sm',
  showIcon = true
}) => {
  const info = DATA_CLASSIFICATION_INFO[type] || DATA_CLASSIFICATION_INFO.PROTOTYPE_SIMULATION;

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1 font-bold';

  const renderIcon = () => {
    switch (type) {
      case 'FACTUAL_VERIFIED':
        return <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />;
      case 'PROTOTYPE_SIMULATION':
        return <Info className="w-3 h-3 text-blue-600 shrink-0" />;
      case 'EXPERIMENT_RESULT':
      default:
        return <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 rounded-full font-extrabold border ${info.badgeClass} ${sizeClasses} shadow-2xs`}
      title={info.description}
    >
      {showIcon && renderIcon()}
      <span>{customText || info.label}</span>
    </span>
  );
};

interface AccessLevelBadgeProps {
  level: AccessLevel;
  customText?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const AccessLevelBadge: React.FC<AccessLevelBadgeProps> = ({
  level,
  customText,
  size = 'sm',
  showIcon = true
}) => {
  const info = ACCESS_LEVEL_INFO[level] || ACCESS_LEVEL_INFO.PUBLIC;

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1 font-bold';

  const renderIcon = () => {
    switch (level) {
      case 'RESTRICTED_PERSONAL':
        return <Lock className="w-3 h-3 text-amber-700 shrink-0" />;
      case 'INTERNAL':
        return <Users className="w-3 h-3 text-indigo-600 shrink-0" />;
      case 'PUBLIC':
      default:
        return <Globe className="w-3 h-3 text-slate-500 shrink-0" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 rounded-full font-extrabold border ${info.badgeClass} ${sizeClasses} shadow-2xs`}
      title={info.description}
    >
      {showIcon && renderIcon()}
      <span>{customText || info.label}</span>
    </span>
  );
};
