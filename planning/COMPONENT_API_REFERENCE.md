# Component API Reference - Groovie TypeScript Rebuild

This document defines the component interfaces and data types you'll use throughout the application.

---

## Core Types

### User & Auth

```typescript
// src/shared/types/user.ts

export type AccessLevel = 'free' | 'premium'

export interface User {
  id: string
  email: string
  name: string
  accessLevel: AccessLevel
  subscription?: {
    status: 'active' | 'inactive' | 'cancelled'
    expiresAt: Date
  }
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  accessLevel: AccessLevel
  hasAccess: (mode: AIMode) => boolean
}

export type AIMode = 'reading-resource' | 'teaching-assistant' | 'magic-librarian'
```

### Chat & Messages

```typescript
// src/features/chat/types/index.ts

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  thinkingSteps?: string[]
  artifacts?: Artifact[]
  createdAt: Date
  updatedAt?: Date
}

export interface ChatContextType {
  messages: ChatMessage[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

export interface StreamingState {
  isStreaming: boolean
  currentContent: string
  thinkingSteps: string[]
  progress: number
}
```

### Artifacts

```typescript
// src/features/artifacts/lib/artifact-schemas.ts

import { z } from 'zod'

// Base artifact type
export const BaseArtifactSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['lesson-plan', 'quick-win', 'activity', 'assessment', 'decodable', 'game']),
  title: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  mode: z.enum(['teaching-assistant', 'magic-librarian']),
})

export type BaseArtifact = z.infer<typeof BaseArtifactSchema>

// Lesson Plan
export const LessonPlanSchema = BaseArtifactSchema.extend({
  type: z.literal('lesson-plan'),
  gradeLevel: z.enum(['PreK', 'K', '1st', '2nd', '3rd+']),
  duration: z.string(), // "45 minutes"
  objectives: z.array(z.string().min(1)).min(1),
  standards: z.array(z.string()),
  materials: z.array(z.object({
    name: z.string(),
    quantity: z.number().positive(),
    optional: z.boolean().default(false),
  })),
  lesson: z.object({
    introduction: z.string(),
    mainActivity: z.string(),
    closingActivity: z.string(),
  }),
  assessment: z.object({
    formative: z.array(z.string()),
    summative: z.array(z.string()),
  }),
})

export type LessonPlan = z.infer<typeof LessonPlanSchema>

// Quick Win
export const QuickWinSchema = BaseArtifactSchema.extend({
  type: z.literal('quick-win'),
  timeMinutes: z.number().min(1).max(15),
  materials: z.array(z.string()),
  steps: z.array(z.string().min(1)),
  adaptations: z.array(z.string()),
})

export type QuickWin = z.infer<typeof QuickWinSchema>

// Home Activity
export const ActivitySchema = BaseArtifactSchema.extend({
  type: z.literal('activity'),
  skillTaught: z.string(),
  ageRange: z.string(), // "4-6 years"
  materials: z.array(z.string()),
  duration: z.number(), // minutes
  steps: z.array(z.string()),
  extensions: z.array(z.string()),
})

export type Activity = z.infer<typeof ActivitySchema>

// Assessment
export const AssessmentSchema = BaseArtifactSchema.extend({
  type: z.literal('assessment'),
  skillAssessed: z.string(),
  questions: z.array(z.object({
    text: z.string(),
    rubric: z.string(),
  })),
  scoringGuide: z.string(),
})

export type Assessment = z.infer<typeof AssessmentSchema>

// Decodable Book
export const DecodableBookSchema = BaseArtifactSchema.extend({
  type: z.literal('decodable'),
  patterns: z.array(z.string()),
  gradeLevel: z.enum(['K', '1st', '2nd']),
  pages: z.array(z.object({
    text: z.string(),
    illustration: z.string(), // Base64 or URL
    words: z.array(z.object({
      word: z.string(),
      pattern: z.string(),
      difficulty: z.enum(['familiar', 'target', 'challenge']),
    })),
  })),
  comprehensionQuestions: z.array(z.string()),
})

export type DecodableBook = z.infer<typeof DecodableBookSchema>

// Phonics Game
export const PhonicsGameSchema = BaseArtifactSchema.extend({
  type: z.literal('game'),
  gameType: z.enum(['elkonin-boxes', 'word-building', 'rhyme-matching', 'sound-sorting']),
  patterns: z.array(z.string()),
  gradeLevel: z.enum(['K', '1st', '2nd']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  rounds: z.array(z.object({
    targetWord: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    feedback: z.object({
      correct: z.string(),
      incorrect: z.string(),
    }),
  })),
  score: z.number().default(0),
  isComplete: z.boolean().default(false),
})

export type PhonicsGame = z.infer<typeof PhonicsGameSchema>

// Union type
export type Artifact = LessonPlan | QuickWin | Activity | Assessment | DecodableBook | PhonicsGame
```

---

## Component Interfaces

### Chat Components

```typescript
// src/features/chat/components/ChatDisplay.tsx

export interface ChatDisplayProps {
  mode: AIMode
  messages: ChatMessage[]
  isLoading: boolean
  error: Error | null
  onSendMessage: (content: string) => Promise<void>
  onClearMessages: () => void
}

export interface ChatInputProps {
  onSend: (message: string) => Promise<void>
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  className?: string
}

export interface StreamingMessageProps {
  message: ChatMessage
  isStreaming?: boolean
  thinkingSteps?: string[]
}
```

### Mode-Specific Components

```typescript
// src/features/reading-resource/components/index.ts

export interface ChatInterfaceProps {
  className?: string
}

export interface SearchResultsProps {
  results: SearchResult[]
  isLoading?: boolean
  onResultClick?: (result: SearchResult) => void
}

export interface FollowUpQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  isLoading?: boolean
}

export interface ThinkingAnimationProps {
  isThinking: boolean
  thinkingSteps?: string[]
}

// src/features/teaching-assistant/components/index.ts

export interface ArtifactPreviewProps {
  artifact: LessonPlan | QuickWin | Activity | Assessment
  isLoading?: boolean
  onGenerate?: () => void
}

export interface QuickWinsProps {
  quickWins: QuickWin[]
  onSelectWin: (win: QuickWin) => void
  isLoading?: boolean
}

export interface ActivityCardProps {
  activity: Activity
  onExpand?: () => void
  className?: string
}

export interface AssessmentViewerProps {
  assessment: Assessment
  score?: number
  onSubmit?: (answers: Record<string, string>) => void
}

// src/features/magic-librarian/components/index.ts

export interface DecodableReaderProps {
  book: DecodableBook
  currentPage?: number
  onPageChange?: (page: number) => void
  showAnnotations?: boolean
}

export interface ElkoninBoxesProps {
  word: string
  onComplete?: (phonemes: string[]) => void
  isInteractive?: boolean
  size?: 'small' | 'medium' | 'large'
}

export interface InteractivePhonicsGameProps {
  game: PhonicsGame
  onGameEnd?: (finalScore: number) => void
}

export interface GameAnimationProps {
  type: 'correct' | 'incorrect' | 'celebrate'
  duration?: number
}
```

### Shared UI Components

```typescript
// src/shared/components/ui/index.ts

// Standard shadcn components
export { Button, ButtonProps }
export { Card, CardContent, CardDescription, CardHeader, CardTitle }
export { Input, InputProps }
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger }
export { Alert, AlertDescription, AlertTitle }
export { Badge, BadgeProps }
export { Spinner } // Custom loading spinner
export { Skeleton } // Placeholder skeleton

// Mode indicator badge
export interface ModeIndicatorProps {
  mode: AIMode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Thinking indicator
export interface ThinkingIndicatorProps {
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Access level guard
export interface AccessLevelGuardProps {
  requiredLevel: AccessLevel
  children: React.ReactNode
  fallback?: React.ReactNode
}
```

### Artifact Components

```typescript
// src/features/artifacts/components/index.ts

export interface ArtifactContainerProps {
  artifact: Artifact
  isLoading?: boolean
  isStreaming?: boolean
  onClose?: () => void
  className?: string
}

export interface StreamingProgressProps {
  progress: number
  status: 'generating' | 'validating' | 'complete' | 'error'
  currentStep?: string
  message?: string
}

export interface ArtifactErrorProps {
  error: Error
  onRetry?: () => void
  onDismiss?: () => void
}

export interface ArtifactRendererProps {
  artifact: Artifact
  className?: string
}
```

---

## Hook Interfaces

### Chat Hooks

```typescript
// src/features/chat/hooks/useChat.ts

interface UseChatOptions {
  mode: AIMode
  onMessageReceived?: (message: ChatMessage) => void
  onStreamStart?: () => void
  onStreamEnd?: () => void
}

export function useChat(options: UseChatOptions) {
  return {
    messages: ChatMessage[]
    isLoading: boolean
    error: Error | null
    sendMessage: (content: string) => Promise<void>
    clearMessages: () => void
    retry: () => Promise<void>
  }
}

// src/features/chat/hooks/useArtifactStream.ts

export function useArtifactStream() {
  return {
    artifacts: Artifact[]
    isStreaming: boolean
    progress: number
    addArtifact: (artifact: Artifact) => void
    updateArtifact: (id: string, updates: Partial<Artifact>) => void
    clearArtifacts: () => void
  }
}
```

### Mode-Specific Hooks

```typescript
// src/features/reading-resource/hooks/useReadingResourceChat.ts

export function useReadingResourceChat() {
  return {
    messages: ChatMessage[]
    isLoading: boolean
    searchResults: SearchResult[]
    followUpQuestions: string[]
    thinkingSteps: string[]
    sendMessage: (query: string) => Promise<void>
    selectFollowUp: (question: string) => Promise<void>
  }
}

// src/features/teaching-assistant/hooks/useTeachingAssistantChat.ts

export function useTeachingAssistantChat() {
  return {
    messages: ChatMessage[]
    isLoading: boolean
    artifacts: (LessonPlan | QuickWin | Activity | Assessment)[]
    sendMessage: (query: string) => Promise<void>
    regenerateArtifact: (id: string) => Promise<void>
  }
}

// src/features/magic-librarian/hooks/useMagicLibrarianChat.ts

export function useMagicLibrarianChat() {
  return {
    messages: ChatMessage[]
    isLoading: boolean
    artifacts: (DecodableBook | PhonicsGame)[]
    sendMessage: (query: string) => Promise<void>
    playGame: (gameId: string) => Promise<void>
  }
}

// src/features/magic-librarian/hooks/useDecodableGeneration.ts

export function useDecodableGeneration() {
  return {
    isGenerating: boolean
    progress: number
    decodable: DecodableBook | null
    generate: (patterns: string[], gradeLevel: string) => Promise<DecodableBook>
  }
}

// src/features/magic-librarian/hooks/usePhonicsGame.ts

export function usePhonicsGame(game: PhonicsGame) {
  return {
    currentRound: number
    score: number
    isComplete: boolean
    selectAnswer: (answer: string) => void
    nextRound: () => void
    reset: () => void
  }
}
```

### Utility Hooks

```typescript
// src/shared/hooks/index.ts

export function useLocalStorage<T>(key: string, initialValue: T) {
  return [value: T, setValue: (value: T) => void]
}

export function useMediaQuery(query: string): boolean
export function useDebounce<T>(value: T, delay: number): T
export function useAsync<T>(fn: () => Promise<T>, deps?: any[]) {
  return {
    data: T | undefined
    loading: boolean
    error: Error | null
  }
}
```

### Auth Hooks

```typescript
// src/features/auth/hooks/useAccessLevel.ts

export function useAccessLevel() {
  return {
    accessLevel: AccessLevel
    isLoading: boolean
    error: Error | null
    hasAccess: (mode: AIMode) => boolean
  }
}
```

---

## API Route Interfaces

### Request/Response Types

```typescript
// src/types/api.ts

// Reading Resource Chat
export interface ReadingResourceRequest {
  message: string
  conversationId?: string
}

export interface ReadingResourceResponse {
  role: 'assistant'
  content: string
  thinkingSteps?: string[]
  followUpQuestions?: string[]
  searchContext?: SearchResult[]
}

// Teaching Assistant Chat
export interface TeachingAssistantRequest {
  message: string
  gradeLevel?: string
  conversationId?: string
}

export interface TeachingAssistantResponse {
  role: 'assistant'
  content: string
  artifact?: LessonPlan | QuickWin | Activity | Assessment
  artifacts?: Artifact[]
}

// Magic Librarian Chat
export interface MagicLibrarianRequest {
  message: string
  conversationId?: string
}

export interface MagicLibrarianResponse {
  role: 'assistant'
  content: string
  artifact?: DecodableBook | PhonicsGame
}

// Tool Definitions
export interface ToolUseBlock {
  type: 'tool-use'
  toolName: string
  input: Record<string, unknown>
}

export interface TextBlock {
  type: 'text'
  text: string
}

export type ContentBlock = TextBlock | ToolUseBlock
```

### Streaming Response Format

```typescript
// Streaming uses Server-Sent Events (SSE)
export interface StreamChunk {
  type: 'text' | 'thinking' | 'artifact' | 'followup' | 'progress' | 'error'
  data: {
    content?: string
    thinkingStep?: string
    artifact?: Artifact
    question?: string
    progress?: { current: number; total: number }
    error?: string
  }
}
```

---

## Tool Definitions

### Reading Resource Tools

```typescript
// src/features/reading-resource/lib/tools.ts

export const webSearchTool = tool({
  description: 'Search the web for educational information using semantic search',
  parameters: z.object({
    query: z.string().describe('Search query about literacy education'),
    numResults: z.number().default(5).optional(),
  }),
  execute: async ({ query, numResults }) => {
    // Returns SearchResult[] from Exa API
  },
})

export type SearchResult = {
  id: string
  url: string
  title: string
  snippet: string
  relevanceScore: number
}
```

### Teaching Assistant Tools

```typescript
// src/features/teaching-assistant/lib/tools.ts

export const kbSearchTool = tool({
  description: 'Search the curriculum knowledge base',
  parameters: z.object({
    query: z.string(),
    gradeLevel: z.enum(['PreK', 'K', '1st', '2nd', '3rd+']).optional(),
  }),
  execute: async ({ query, gradeLevel }) => {
    // Vector search in Supabase
  },
})

export const mastaWorkflowTool = tool({
  description: 'Execute multi-step workflow for lesson planning',
  parameters: z.object({
    topic: z.string(),
    gradeLevel: z.enum(['PreK', 'K', '1st', '2nd', '3rd+']),
    duration: z.string(), // "30 minutes"
  }),
  execute: async ({ topic, gradeLevel, duration }) => {
    // Multi-step reasoning
  },
})
```

### Magic Librarian Tools

```typescript
// src/features/magic-librarian/lib/tools.ts

export const decodableGenTool = tool({
  description: 'Generate a decodable book with controlled vocabulary',
  parameters: z.object({
    patterns: z.array(z.string()),
    gradeLevel: z.enum(['K', '1st', '2nd']),
    topic: z.string().optional(),
  }),
  execute: async ({ patterns, gradeLevel, topic }) => {
    // GPT-5 generates text, Gemini generates illustrations
  },
})

export const phonicsGameTool = tool({
  description: 'Generate an interactive phonics game',
  parameters: z.object({
    gameType: z.enum(['elkonin-boxes', 'word-building', 'rhyme-matching', 'sound-sorting']),
    patterns: z.array(z.string()),
    difficulty: z.enum(['easy', 'medium', 'hard']),
  }),
  execute: async ({ gameType, patterns, difficulty }) => {
    // Generate game rounds
  },
})
```

---

## Zod Validation Examples

```typescript
// When receiving API responses, validate them:

import { z } from 'zod'

const response = await fetch('/api/modes/teaching-assistant/chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'Create a lesson plan' })
})

const data = await response.json()
const validated = TeachingAssistantResponse.parse(data) // Throws if invalid

// In components:
const artifact = await generateLessonPlan(topic)
const parsedArtifact = LessonPlanSchema.parse(artifact) // Type-safe now
```

---

## Summary Table

| Concept | Location | Key Type |
|---------|----------|----------|
| Chat messages | `src/features/chat/types` | `ChatMessage` |
| Artifacts | `src/features/artifacts/lib` | `Artifact` (union type) |
| User auth | `src/shared/types/user.ts` | `User`, `AccessLevel` |
| Tools | `src/features/[mode]/lib/tools.ts` | `tool()` from AI SDK |
| API responses | `src/types/api.ts` | `*Request`, `*Response` |
| Components | `src/features/[mode]/components` | React components |
| Hooks | `src/features/*/hooks` or `src/shared/hooks` | Custom hooks |
| Validation | Zod schemas everywhere | `z.object()`, `z.enum()`, etc. |

---

## Usage Examples

### Creating a Chat Message

```typescript
const message: ChatMessage = {
  id: crypto.randomUUID(),
  role: 'user',
  content: 'How do I teach my child to blend sounds?',
  createdAt: new Date(),
}
```

### Creating an Artifact

```typescript
const lessonPlan: LessonPlan = {
  id: crypto.randomUUID(),
  type: 'lesson-plan',
  title: 'Blending Sounds Lesson',
  mode: 'teaching-assistant',
  gradeLevel: '1st',
  duration: '30 minutes',
  objectives: ['Students will blend CVC words'],
  standards: ['RF.1.3a'],
  materials: [
    { name: 'Letter cards', quantity: 26, optional: false },
    { name: 'Whiteboard', quantity: 1, optional: false }
  ],
  lesson: {
    introduction: '...',
    mainActivity: '...',
    closingActivity: '...'
  },
  assessment: {
    formative: ['Observe student blending accuracy'],
    summative: ['Quiz on blending']
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

### Calling a Mode's Chat API

```typescript
async function askTeachingAssistant(question: string) {
  const response = await fetch('/api/modes/teaching-assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: question,
      gradeLevel: '2nd'
    })
  })

  // Parse streaming response
  const reader = response.body?.getReader()
  while (true) {
    const { done, value } = await reader!.read()
    if (done) break

    const chunk = new TextDecoder().decode(value)
    const streamEvent = JSON.parse(chunk) as StreamChunk

    if (streamEvent.type === 'artifact') {
      const artifact = ArtifactSchema.parse(streamEvent.data.artifact)
      // Handle artifact
    }
  }
}
```

---

**This reference is your source of truth during implementation. Keep it open as you build!**
