import type { AppMode } from '@/shared/types/common';

export const APP_MODES: Record<string, AppMode> = {
  'reading-resource': {
    id: 'reading-resource',
    label: 'Reading Resource',
    description: 'Web search and AI distillation for educational content',
    requiredAccess: 'free',
    icon: 'BookOpen',
  },
  'teaching-assistant': {
    id: 'teaching-assistant',
    label: 'Teaching Assistant',
    description: 'Lesson plans, activities, assessments, and quick wins',
    requiredAccess: 'premium',
    icon: 'Lightbulb',
  },
  'magic-librarian': {
    id: 'magic-librarian',
    label: 'Magic Librarian',
    description: 'Decodable books, phonics games, and interactive content',
    requiredAccess: 'premium',
    icon: 'Sparkles',
  },
};

export const DEFAULT_MODEL = 'gpt-4o';
export const DEFAULT_MAX_TOKENS = 2048;
export const STREAMING_CHUNK_SIZE = 1024;
