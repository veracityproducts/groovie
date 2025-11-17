export type { AccessLevel } from '@/shared/types/common';
import type { AccessLevel } from '@/shared/types/common';

/**
 * Chat mode types representing the three distinct feature modes
 */
export type ChatMode = 'reading-resource' | 'teaching-assistant' | 'magic-librarian';

/**
 * Configuration for a single chat mode
 */
export interface ModeConfig {
  id: ChatMode;
  label: string;
  description: string;
  placeholder: string;
  requiredAccess: AccessLevel;
  icon: string;
  color: string; // Tailwind color class for styling
}

/**
 * Chat mode configurations
 */
export const CHAT_MODES: Record<ChatMode, ModeConfig> = {
  'reading-resource': {
    id: 'reading-resource',
    label: 'Reading Resource',
    description: 'Find and distill reading materials',
    placeholder: 'Ask Reading Resource...',
    requiredAccess: 'free',
    icon: 'BookOpen',
    color: 'text-blue-600',
  },
  'teaching-assistant': {
    id: 'teaching-assistant',
    label: 'Teaching Assistant',
    description: 'Create lessons and teaching materials',
    placeholder: 'Ask Teaching Assistant...',
    requiredAccess: 'premium',
    icon: 'GraduationCap',
    color: 'text-purple-600',
  },
  'magic-librarian': {
    id: 'magic-librarian',
    label: 'Magic Librarian',
    description: 'Generate creative learning materials',
    placeholder: 'Ask Magic Librarian...',
    requiredAccess: 'premium',
    icon: 'Wand2',
    color: 'text-pink-600',
  },
};

/**
 * A single chat message
 */
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  mode: ChatMode; // Which mode generated this message
  artifacts?: Artifact[]; // Any artifacts created by this message
}

/**
 * Artifact types - extensible for different feature artifacts
 */
export type ArtifactType = 'lesson-plan' | 'activity' | 'assessment' | 'decodable' | 'phonics-game';

/**
 * Generic artifact structure
 */
export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  createdAt: Date;
}

/**
 * Chat state for a single conversation
 */
export interface ChatState {
  messages: Message[];
  currentMode: ChatMode;
  isLoading: boolean;
  error: string | null;
}

/**
 * A conversation (can have messages from multiple modes over time)
 */
export interface Conversation {
  id: string;
  userId: string;
  mode: ChatMode; // Primary mode for this conversation
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  artifacts?: Artifact[];
}

/**
 * Mode toggle props
 */
export interface ModeToggleProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  accessLevel: AccessLevel;
  disabled?: boolean;
}

/**
 * Mode button props
 */
export interface ModeButtonProps {
  mode: ChatMode;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
  tooltipText: string;
}

/**
 * ChatDisplay component props
 */
export interface ChatDisplayProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  accessLevel: AccessLevel;
  showHistory?: boolean;
  onSelectHistoryItem?: (conversationId: string) => void;
  currentConversationId?: string;
  conversations?: Conversation[];
}
