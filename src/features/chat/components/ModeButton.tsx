'use client';

import React from 'react';
import { Lock, BookOpen, GraduationCap, Wand2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { ChatMode, ModeConfig } from '../types';

// Icon map for mode buttons
const iconMap = {
  BookOpen,
  GraduationCap,
  Wand2,
};

export interface ModeButtonProps {
  mode: ChatMode;
  config: ModeConfig;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
  tooltipText: string;
  className?: string;
}

/**
 * Individual mode button - purely presentational
 * Receives all data as props, makes no assumptions
 */
export const ModeButton: React.FC<ModeButtonProps> = ({
  config,
  isActive,
  isLocked,
  onClick,
  tooltipText,
  className = '',
}) => {
  const IconComponent = iconMap[config.icon as keyof typeof iconMap] || BookOpen;

  return (
    <div className={`relative group ${className}`}>
      <Button
        onClick={onClick}
        disabled={isLocked}
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        className={`
          relative flex items-center gap-2 min-w-fit
          ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border-border'}
          ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          hover:${isActive ? 'bg-primary/90' : 'border-border/80 bg-muted'}
          transition-colors duration-200
        `}
      >
        <IconComponent className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
        {isLocked && <Lock className="w-3 h-3 ml-1" />}
      </Button>

      {/* Tooltip on hover */}
      <div
        className={`
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
          px-3 py-2 bg-card text-card-foreground text-xs rounded-md
          whitespace-nowrap pointer-events-none
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          z-50
        `}
      >
        {tooltipText}
        {isLocked && <div className="text-muted-foreground text-xs mt-1">Requires {config.requiredAccess}</div>}
      </div>

      {/* Tooltip arrow */}
      <div
        className={`
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0
          w-0 h-0 border-l-4 border-r-4 border-t-4
          border-l-transparent border-r-transparent border-t-card
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          z-50
        `}
      />
    </div>
  );
};
