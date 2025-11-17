import type { AccessLevel, ChatMode } from '../types';

/**
 * Access hierarchy for determining permissions
 */
const ACCESS_HIERARCHY: Record<AccessLevel, number> = {
  free: 0,
  premium: 1,
  educator: 2,
};

/**
 * Check if a user can access a specific mode
 */
export const canAccessMode = (
  userAccessLevel: AccessLevel,
  requiredAccessLevel: AccessLevel
): boolean => {
  return (ACCESS_HIERARCHY[userAccessLevel] ?? 0) >= (ACCESS_HIERARCHY[requiredAccessLevel] ?? 0);
};

/**
 * Filter modes based on user's access level
 */
export const filterAccessibleModes = (
  modes: ChatMode[],
  accessLevel: AccessLevel,
  modeConfigs: Record<ChatMode, { requiredAccess: AccessLevel }>
): ChatMode[] => {
  return modes.filter((mode) => canAccessMode(accessLevel, modeConfigs[mode].requiredAccess));
};

/**
 * Get access status for a mode (accessible or locked)
 */
export const getAccessStatus = (
  userAccessLevel: AccessLevel,
  modeConfig: { requiredAccess: AccessLevel }
): 'accessible' | 'locked' => {
  return canAccessMode(userAccessLevel, modeConfig.requiredAccess) ? 'accessible' : 'locked';
};
