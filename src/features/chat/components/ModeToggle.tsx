'use client';

import React from 'react';
import { ModeButton } from './ModeButton';
import type { ChatMode, ModeConfig } from '../types';
import { canAccessMode } from '../lib/access';

export interface ModeToggleProps {
  modes: ChatMode[];
  modeConfigs: Record<ChatMode, ModeConfig>;
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  accessLevel: 'free' | 'premium' | 'educator';
  disabled?: boolean;
  showAccessBadge?: boolean;
  className?: string;
}

/**
 * Generic mode toggle bar - accepts modes as prop
 * No hardcoded assumptions about available modes
 * Fully customizable and composable
 */
export const ModeToggle: React.FC<ModeToggleProps> = ({
  modes,
  modeConfigs,
  currentMode,
  onModeChange,
  accessLevel,
  disabled = false,
  showAccessBadge = true,
  className = '',
}) => {
  const getTooltipText = (mode: ChatMode): string => {
    const config = modeConfigs[mode];
    const isAccessible = canAccessMode(accessLevel, config.requiredAccess);

    if (isAccessible) {
      return config.description;
    }

    return `${config.label} (Requires ${config.requiredAccess})`;
  };

  const renderAccessBadge = () => {
    if (!showAccessBadge) return null;

    const badges: Record<string, string> = {
      free: '🎓 Free',
      premium: '⭐ Premium',
      educator: '👨‍🏫 Educator',
    };

    return (
      <div className="ml-auto text-xs text-muted-foreground">
        <span className="inline-block px-2 py-1 bg-background border border-border rounded">
          {badges[accessLevel]}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-muted border-b border-border rounded-t-lg ${className}`}
    >
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mode:</span>

      <div className="flex items-center gap-2">
        {modes.map((mode) => {
          const isAccessible = canAccessMode(accessLevel, modeConfigs[mode].requiredAccess);
          const isActive = currentMode === mode;

          return (
            <ModeButton
              key={mode}
              mode={mode}
              config={modeConfigs[mode]}
              isActive={isActive}
              isLocked={!isAccessible}
              onClick={() => {
                if (isAccessible && !disabled) {
                  onModeChange(mode);
                }
              }}
              tooltipText={getTooltipText(mode)}
            />
          );
        })}
      </div>

      {renderAccessBadge()}
    </div>
  );
};
