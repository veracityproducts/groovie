# Groovie TypeScript Rebuild Strategy 2025

## Executive Summary

**Objective:** Rebuild Groovie as a cohesive, modular TypeScript application consolidating proven MVP concepts into production-grade architecture.

**Key Outcomes:**
- ✅ Single unified TypeScript codebase (frontend + API routes only)
- ✅ Three distinct AI "modes" with separate routing and capabilities
- ✅ Highly modular component structure for DX and reusability
- ✅ Type-safe end-to-end with Zod schemas
- ✅ Production-ready streaming with progress tracking
- ✅ Seamless integration with existing Shopify access levels

**Timeline:** Fresh project (can be integrated into monorepo later)

---

## Tech Stack

### Core Framework
- **Bun** - Fast runtime, package manager, bundler
- **Next.js 16** - App Router, React Server Components, streaming
- **React 19** - Latest features and performance
- **TypeScript 5** - Strict mode, full type safety

### Styling & UI
- **Tailwind CSS v4** - Atomic utility-first styling
- **Shadcn/ui Components** - Accessible, composable component library
- **Motion/React** - Declarative animations and transitions

### AI & Tools
- **OpenAI GPT-4o** with ChatCompletions API
- **AI SDK v6** - Type-safe streaming, tool calls
- **AI SDK Tools** - Artifact management with Zod schemas. Docs: 
- **Assistant UI** - Chat interface components and state management
- **Exa Search/Exa Answers** - Semantic web search (modular)

### Data & State
- **Zod** - Runtime schema validation
- **TanStack Query** - Async state (optional, for future)
- **Shopify Hydrogen** - Existing access level data (no rebuild needed)

### Tooling
- **Biome** - Fast linting, formatting, sorting
- **Vitest** (optional) - Fast unit testing

---

## Project Structure

```
groovie-typescript/
├── .bun/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── modes/
│   │   │   │   ├── reading-resource/
│   │   │   │   │   ├── chat/route.ts          # Web search + distillation
│   │   │   │   │   ├── stream.ts              # Streaming utilities
│   │   │   │   │   └── tools/
│   │   │   │   │       ├── web-search.ts      # Exa search tool
│   │   │   │   │       └── index.ts
│   │   │   │   ├── teaching-assistant/
│   │   │   │   │   ├── chat/route.ts          # RAG + knowledge base
│   │   │   │   │   ├── artifacts.ts           # Lesson plans, activities
│   │   │   │   │   └── tools/
│   │   │   │   │       ├── kb-search.ts       # Knowledge base retrieval
│   │   │   │   │       ├── masta-workflow.ts  # Multi-step workflow
│   │   │   │   │       └── index.ts
│   │   │   │   └── magic-librarian/
│   │   │   │       ├── chat/route.ts          # Creative content
│   │   │   │       ├── artifacts.ts           # Decodables + games
│   │   │   │       └── tools/
│   │   │   │           ├── decodable-gen.ts   # Book generation
│   │   │   │           ├── phonics-game.ts    # Interactive games
│   │   │   │           └── index.ts
│   │   │   ├── auth/
│   │   │   │   ├── access-level/route.ts      # Shopify access check
│   │   │   │   └── session/route.ts
│   │   │   └── artifacts/
│   │   │       ├── upload/route.ts
│   │   │       └── stream/route.ts
│   │   ├── (authenticated)/
│   │   │   ├── reading-resource/
│   │   │   │   ├── page.tsx                   # Reading Resource mode
│   │   │   │   └── layout.tsx
│   │   │   ├── teaching-assistant/
│   │   │   │   ├── page.tsx                   # Teaching Assistant mode
│   │   │   │   └── layout.tsx
│   │   │   ├── magic-librarian/
│   │   │   │   ├── page.tsx                   # Magic Librarian mode
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx                     # Protected layout
│   │   ├── page.tsx                           # Home/mode selector
│   │   └── layout.tsx                         # Root layout
│   │
│   ├── features/
│   │   ├── reading-resource/
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   ├── FollowUpQuestions.tsx
│   │   │   │   └── ThinkingAnimation.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useReadingResourceChat.ts
│   │   │   │   └── useWebSearch.ts
│   │   │   ├── lib/
│   │   │   │   ├── agents.ts                  # Mode-specific agent
│   │   │   │   ├── tools.ts                   # Web search tool setup
│   │   │   │   └── prompts.ts                 # System prompts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── teaching-assistant/
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── ArtifactPreview.tsx        # Lesson plan preview
│   │   │   │   ├── QuickWins.tsx              # Quick wins display
│   │   │   │   ├── ActivityCard.tsx           # Home activities
│   │   │   │   └── AssessmentViewer.tsx       # Progress tracking
│   │   │   ├── hooks/
│   │   │   │   ├── useTeachingAssistantChat.ts
│   │   │   │   ├── useKnowledgeBase.ts
│   │   │   │   └── useLessonPlanGeneration.ts
│   │   │   ├── lib/
│   │   │   │   ├── agents.ts                  # Teaching agent
│   │   │   │   ├── tools.ts                   # KB search, Masta
│   │   │   │   ├── prompts.ts
│   │   │   │   └── lesson-schemas.ts          # Zod schemas for lessons
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── magic-librarian/
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── DecodableReader.tsx        # React decodable renderer
│   │   │   │   ├── ElkoninBoxes.tsx           # Phonics game component
│   │   │   │   ├── InteractivePhonicsGame.tsx # Game wrapper
│   │   │   │   └── GameAnimation.tsx          # Motion animations
│   │   │   ├── hooks/
│   │   │   │   ├── useMagicLibrarianChat.ts
│   │   │   │   ├── useDecodableGeneration.ts
│   │   │   │   └── usePhonicsGame.ts
│   │   │   ├── lib/
│   │   │   │   ├── agents.ts                  # Creative agent
│   │   │   │   ├── tools.ts                   # Decodable, phonics
│   │   │   │   ├── prompts.ts
│   │   │   │   ├── decodable-schemas.ts       # Zod for books
│   │   │   │   └── game-schemas.ts            # Zod for games
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── AccessLevelGuard.tsx       # Subscription check
│   │   │   ├── hooks/
│   │   │   │   └── useAccessLevel.ts
│   │   │   ├── lib/
│   │   │   │   └── shopify-access.ts          # Shopify integration
│   │   │   └── types/
│   │   │       └── index.ts
│   │   │
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatDisplay.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── StreamingMessage.tsx
│   │   │   │   └── ThinkingIndicator.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts                 # Generic chat hook
│   │   │   │   └── useArtifactStream.ts       # Artifact streaming
│   │   │   ├── lib/
│   │   │   │   ├── message-utils.ts
│   │   │   │   └── streaming.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   └── artifacts/
│   │       ├── components/
│   │       │   ├── ArtifactContainer.tsx
│   │       │   ├── StreamingProgress.tsx
│   │       │   └── ArtifactError.tsx
│   │       ├── hooks/
│   │       │   └── useArtifact.ts
│   │       ├── lib/
│   │       │   ├── artifact-schemas.ts        # Master artifact schemas
│   │       │   ├── artifact-types.ts
│   │       │   └── artifact-utils.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                            # Shadcn components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── spinner.tsx
│   │   │   │   └── ... (other shadcn)
│   │   │   ├── markdown/
│   │   │   │   ├── MarkdownRenderer.tsx       # Math + syntax highlighting
│   │   │   │   └── CodeBlock.tsx
│   │   │   ├── animations/
│   │   │   │   ├── ThinkingPulse.tsx
│   │   │   │   ├── TypewriterText.tsx
│   │   │   │   └── StreamingText.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── Footer.tsx
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useAsync.ts
│   │   ├── lib/
│   │   │   ├── cn.ts                         # Classname merge utility
│   │   │   ├── http-client.ts                # Fetch wrapper
│   │   │   ├── constants.ts                  # App-wide constants
│   │   │   └── validators.ts                 # Shared Zod validators
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   ├── user.ts
│   │   │   └── common.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── config/
│   │       ├── site.ts                       # Site metadata
│   │       └── navigation.ts                 # Nav structure
│   │
│   ├── env.ts                                # Environment variable validation
│   ├── middleware.ts                         # Auth, redirects
│   └── instrumentation.ts                    # OpenTelemetry (optional)
│
├── tests/
│   ├── unit/
│   │   ├── features/
│   │   ├── shared/
│   │   └── lib/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── modes.spec.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.example
├── .env.local (GITIGNORED)
├── biome.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json (uses bun)
└── bunfig.toml

```

### Key Architectural Principles

**1. Mode-Based Routing**
- Each AI mode is completely isolated (reading-resource, teaching-assistant, magic-librarian)
- Separate API routes for each model
- Separate feature directories for independent development
- No cross-mode imports (shared/ only)

**2. Vertical Slice Features**
- Each feature contains all its components, hooks, types, and utilities
- Features can ONLY import from shared/
- Self-contained domain logic
- Easy to develop, test, and ship independently

**3. Type Safety Throughout**
- Zod schemas for all data transformations
- API response validation at runtime
- TypeScript strict mode always on
- No `any` types

**4. Streaming First**
- All AI responses stream to client
- Artifacts stream with progress tracking
- Thinking animations show reasoning steps
- Real-time updates without polling

---

## Mode Specifications

### 1. Reading Resource (FREE)

**Purpose:** Quick, accessible answers to parenting questions about literacy education

**User Flow:**
1. User types question about child's reading, phonics, dyslexia, etc.
2. System searches the web using Exa Search/Answers
3. GPT-4o distills response into "mom-friendly" language
4. Contextual follow-up questions appear
5. Fully streaming response with thinking animation

**Tech Stack:**
- Tool: Exa Search API + Exa Answers (semantic search)
- Model: GPT-4o (distillation + contextual followup)
- Artifacts: None (text responses only)
- Database: No persistence needed for MVP

**Key Components:**
- `ChatInterface.tsx` - Main chat UI
- `SearchResults.tsx` - Display web search context
- `FollowUpQuestions.tsx` - Smart follow-ups
- `ThinkingAnimation.tsx` - Show reasoning

**API Route:** `/api/modes/reading-resource/chat`

**Tools:**
```typescript
// tools/web-search.ts
- searchWeb(query: string) → Promise<SearchResults>
```

**System Prompt Template:**
```
You are a friendly, expert educator helping parents understand their child's reading development.
Use the search results provided to answer questions accurately.
Distill complex literacy concepts into simple, actionable language.
Always include 2-3 contextual follow-up questions at the end.
Focus on: phonics, dyslexia, Orton-Gillingham, structured literacy.
```

---

### 2. Teaching Assistant (PAID - Premium)

**Purpose:** Create structured lesson plans, quick-wins, and home activities with assessment

**User Flow:**
1. User describes what they want to teach
2. System queries knowledge base + web (multi-step reasoning with Masta)
3. GPT-4o generates lesson plan artifact with Zod schema
4. Creates quick wins (5-min activities)
5. Home activity suggestions with materials list
6. Assessment templates to track progress

**Tech Stack:**
- Tools: Knowledge base search (Supabase vector search), workflows
- Model: gpt-4o, gemini-2.5-flash-image 
- Artifacts: Structured lesson plans, quick-wins, activities, assessments
- Database: Uses existing curriculum knowledge base

**Key Components:**
- `ChatInterface.tsx`
- `ArtifactPreview.tsx` - Lesson plan preview
- `QuickWins.tsx` - Time-efficient activities
- `ActivityCard.tsx` - Detailed home activities
- `AssessmentViewer.tsx` - Progress tracking

**API Route:** `/api/modes/teaching-assistant/chat`

**Tools:**
```typescript
// tools/kb-search.ts
- searchKnowledgeBase(query: string, gradeLevel?: string) → Promise<KBResults>

// tools/masta-workflow.ts
- generateLessonPlan(topic: string, gradeLevel: string, duration: string) → Promise<Workflow>
```

**Artifact Schemas (Zod):**
```typescript
LessonPlanArtifact = z.object({
  title: z.string(),
  gradeLevel: z.enum(['PreK', 'K', '1st', '2nd', '3rd+']),
  duration: z.string(),
  objectives: z.array(z.string()),
  standards: z.array(z.string()),
  materials: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    optional: z.boolean().default(false)
  })),
  lesson: z.object({
    introduction: z.string(),
    mainActivity: z.string(),
    closingActivity: z.string()
  }),
  assessment: z.object({
    formative: z.array(z.string()),
    summative: z.array(z.string())
  })
})

QuickWinArtifact = z.object({
  name: z.string(),
  timeMinutes: z.number(),
  materials: z.array(z.string()),
  steps: z.array(z.string()),
  adaptations: z.array(z.string())
})

HomeActivityArtifact = z.object({
  title: z.string(),
  skillTaught: z.string(),
  ageRange: z.string(),
  materials: z.array(z.string()),
  duration: z.number(),
  steps: z.array(z.string()),
  extensions: z.array(z.string())
})

AssessmentArtifact = z.object({
  name: z.string(),
  skillAssessed: z.string(),
  questions: z.array(z.object({
    text: z.string(),
    rubric: z.string()
  })),
  scoringGuide: z.string()
})
```

---

### 3. Magic Librarian (PAID - Premium)

**Purpose:** Generate interactive decodable books + phonics games

**User Flow - Decodable Generation:**
1. User specifies phonics patterns (CVC, consonant clusters, etc.)
2. System generates story text with controlled vocabulary
3. Gemini-2.5-Flash-Image generates illustrations
4. React component renders interactive decodable reader
5. Real-time progress with thinking animation

**User Flow - Phonics Game:**
1. User selects game type (Elkonin boxes, word building, rhyme matching)
2. System generates game content with motion animations
3. React/Motion components handle interactive gameplay
4. Scoring and progress tracking

**Tech Stack:**
- Decodables: gemini-2.5-flash-image (vision) for illustrations, GPT-4o for text
- Games: React + Motion, Elkonin box component library
- Artifacts: Structured decodable and game schemas
- Database: Game state in local component state

**Key Components:**
- `ChatInterface.tsx`
- `DecodableReader.tsx` - Interactive book viewer
- `ElkoninBoxes.tsx` - Phonics game (reusable)
- `InteractivePhonicsGame.tsx` - Game wrapper
- `GameAnimation.tsx` - Motion animations

**API Route:** `/api/modes/magic-librarian/chat`

**Tools:**
```typescript
// tools/decodable-gen.ts
- generateDecodable(patterns: string[], gradeLevel: string) → Promise<Decodable>

// tools/phonics-game.ts
- generatePhonicsGame(gameType: string, patterns: string[]) → Promise<Game>
```

**Artifact Schemas (Zod):**
```typescript
DecodableBookArtifact = z.object({
  title: z.string(),
  patterns: z.array(z.string()),
  gradeLevel: z.enum(['K', '1st', '2nd']),
  pages: z.array(z.object({
    text: z.string(),
    illustration: z.string(), // Base64 or URL
    words: z.array(z.object({
      word: z.string(),
      pattern: z.string(),
      difficulty: z.enum(['familiar', 'target', 'challenge'])
    }))
  })),
  comprehensionQuestions: z.array(z.string())
})

PhonicsGameArtifact = z.object({
  title: z.string(),
  type: z.enum(['elkonin-boxes', 'word-building', 'rhyme-matching', 'sound-sorting']),
  patterns: z.array(z.string()),
  gradeLevel: z.enum(['K', '1st', '2nd']),
  rounds: z.array(z.object({
    targetWord: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    feedback: z.object({
      correct: z.string(),
      incorrect: z.string()
    })
  })),
  difficulty: z.enum(['easy', 'medium', 'hard'])
})
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [✅] Project setup with Bun, Next.js 16, TypeScript
- [✅] Tailwind CSS v4 + Shadcn/ui component system
- [✅] Biome linting and formatting configuration
- [✅] Environment variable validation with env.ts
- [✅] Authentication middleware (Shopify access level check)
- [✅] Home page with mode selector UI
- [✅] Base layout with header, sidebar, content area

**Deliverables:**
- Working dev server with hot reload
- Styled mode selector page
- Auth middleware protecting routes
- Design system configured (colors, typography, spacing)

**Deps:**
- next, react, typescript, tailwindcss, @tailwindcss/postcss
- @radix-ui/* (select components), lucide-react
- biome, zod

---

### Phase 2: Reading Resource Mode (Week 2)
- [✅] Chat interface with streaming responses
- [✅] Exa search tool integration
- [✅] GPT-4o-mini endpoint with mom-friendly system prompt
- [✅] Follow-up questions generation
- [✅] Thinking animation
- [✅] Message persistence (optional for MVP)

**Deliverables:**
- Functional `/reading-resource` page
- Working web search + distillation pipeline
- Real-time streaming responses
- Contextual follow-ups

**Deps:**
- ai (v6), @ai-sdk/openai
- exa-js (or fetch-based integration)
- framer-motion (animations)
- react-markdown

---

### Phase 3: Teaching Assistant Mode (Week 3)
- [✅] Chat interface with artifact preview
- [✅] Knowledge base search tool
- [✅] Masta workflow integration (or manual multi-step)
- [✅] Lesson plan generation with Zod schemas
- [✅] Quick-wins, activities, assessment artifacts
- [✅] Artifact streaming with progress

**Deliverables:**
- Functional `/teaching-assistant` page
- KB search + lesson generation
- Four artifact types rendering correctly
- Progress indicators during generation

**Deps:**
- Above + additional Zod schemas
- (Masta lib if available, else OpenAI function calls)

---

### Phase 4: Magic Librarian Mode (Week 4)
- [✅] Decodable generation logic
- [✅] gemini-2.5-flash-image integration for illustrations
- [✅] DecodableReader React component
- [✅] Elkonin boxes game component
- [✅] Motion animations for gameplay
- [✅] Game state management

**Deliverables:**
- Functional `/magic-librarian` page
- Decodable book generation + rendering
- Interactive phonics games with animations
- Score tracking

**Deps:**
- Above + motion/react
- @google/generative-ai (for Gemini)
- (Optional: game engine lib if needed)

---

### Phase 5: Polish & Deployment (Week 5)
- [✅] Error handling across all modes
- [✅] Loading states and skeletons
- [✅] Mobile responsive design
- [✅] Accessibility audit (WCAG 2.1 AA)
- [✅] Performance optimization (code splitting, lazy loading)
- [✅] Deployment to Vercel

**Deliverables:**
- Production-ready application
- Responsive on all devices
- Fast load times (Lighthouse 90+)

---

## Integration with Existing Backend

### Current Shopify Access Level System

The existing backend already handles:
- ✅ Subscription level detection
- ✅ User authentication
- ✅ Access control (free vs. premium)

**Our approach:**
1. Call existing Shopify API from middleware to verify access level
2. Store access level in request context
3. Guard routes based on access level (teaching-assistant, magic-librarian require premium)

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = getSession(request)
  if (!session) {
    return redirect('/login')
  }

  const accessLevel = await shopifyAccessLevel(session.userId)
  const response = NextResponse.next()
  response.headers.set('x-access-level', accessLevel)

  // Guard premium routes
  if (['teaching-assistant', 'magic-librarian'].includes(getMode(request))) {
    if (accessLevel !== 'premium') {
      return redirect('/reading-resource')
    }
  }

  return response
}
```

**No database rebuilds needed** - All knowledge base and curriculum data already exists.

---

## Data & Knowledge Base

### Curriculum Knowledge Base
- **Location:** Supabase (existing)
- **Content:** 200+ lessons, 511+ words, Science of Reading framework
- **Access:** Vector search for Teaching Assistant mode

### Decodable Books
- **Storage:** Generated on-demand, cached in browser
- **Metadata:** Patterns, grade level, comprehension questions

### Phonics Games
- **State Management:** Component-level (React hooks)
- **Persistence:** Optional local storage for scores

---

## API Architecture

### Mode-Based Endpoints

```
POST /api/modes/reading-resource/chat
├── Query: { message: string, conversationId?: string }
├── Response: Stream of { role: string, content: string, thinkingSteps?: string[] }
└── Tools: web-search

POST /api/modes/teaching-assistant/chat
├── Query: { message: string, conversationId?: string }
├── Response: Stream of { role: string, content: string, artifact?: Artifact }
└── Tools: kb-search, masta-workflow

POST /api/modes/magic-librarian/chat
├── Query: { message: string, conversationId?: string }
├── Response: Stream of { role: string, content: string, artifact?: Artifact }
└── Tools: decodable-gen, phonics-game

POST /api/artifacts/stream
├── Query: { artifactId: string, type: string }
├── Response: Stream of artifact JSON updates
└── Progress: Sends progress: { current: number, total: number, status: string }

GET /api/auth/access-level
├── Response: { level: 'free' | 'premium', expiresAt?: Date }
└── Source: Shopify API call
```

---

## Security Considerations

1. **API Keys:** All sensitive keys in `.env.local` (never committed)
2. **Access Control:** Middleware guards premium routes
3. **Input Validation:** Zod validates all user inputs
4. **Rate Limiting:** Implement on API routes (optional Phase 5)
5. **CORS:** Configure for specific origins only

---

## Testing Strategy

### Unit Tests (Vitest)
- Artifact schema validation
- Tool parameter validation
- Utility functions

### Integration Tests
- API route functionality
- Streaming responses
- Error handling

### E2E Tests (Playwright - optional Phase 5)
- Full user journeys per mode
- Artifact generation flows

---

## Future Enhancements

1. **Monorepo Integration:**
   - This project can be copied into a monorepo structure later
   - Currently standalone for simplicity and iteration speed

2. **Message Persistence:**
   - Add conversation history to Supabase
   - Implement conversation recovery across sessions

3. **Advanced Analytics:**
   - Track which tools are used most
   - Measure artifact generation time
   - User engagement metrics

4. **Admin Dashboard:**
   - View usage statistics
   - Manage curriculum content
   - Monitor API performance

5. **Offline Support:**
   - Service workers for offline chat
   - Cached responses

---

## Success Criteria

✅ **Phase 1:** Project builds with zero errors, hot reload works, auth middleware protects routes
✅ **Phase 2:** Reading Resource mode generates mom-friendly responses with follow-ups
✅ **Phase 3:** Teaching Assistant generates lesson plans with all 4 artifact types
✅ **Phase 4:** Magic Librarian generates decodable books and playable phonics games
✅ **Phase 5:** All modes fully responsive, accessible, and deployable to Vercel

---

## Quick Reference: What We're NOT Rebuilding

❌ Backend API server (Python FastAPI stays unchanged)
❌ Database schema (Supabase stays the same)
❌ Shopify integration (existing access level system works)
❌ Curriculum data (200+ lessons already in KB)
❌ Authentication infrastructure (Shopify handles it)

✅ We're building a clean TypeScript frontend that consumes these existing systems

---

## Questions for Josh

1. **Masta Workflow:** For now we will use ai-sdk-tools/agents https://ai-sdk-tools.dev/agents
2. **Knowledge Base:** Currently hosted in supabase 
3. **Decodable Storage:** In the short term they will be stored in supabase public.decodable_readers
4. **Message History:** Persistent conversations in all aspects. https://ai-sdk-tools.dev/memory and https://ai-sdk-tools.dev/store
5. **Premium Access:** Currently, we verify access level via Shopify API call after token generation on purchase. token stored in public.shopify_activation_tokens and public.shopify_activation_tokens_public. token GENERATED on purchase, but activated on signup so it can be gifted. 

---

## File Structure Summary

**Core Directories:**
- `src/app/` - Next.js pages and API routes (mode-based organization)
- `src/features/` - Feature modules (reading-resource, teaching-assistant, magic-librarian)
- `src/shared/` - Cross-cutting concerns (components, hooks, utilities)

**Key Config Files:**
- `tsconfig.json` - Strict mode TypeScript
- `tailwind.config.ts` - Design system configuration
- `biome.json` - Code quality settings
- `next.config.ts` - Next.js overrides

**Environment:**
- `.env.example` - Template for environment variables
- `.env.local` - Sensitive keys (gitignored)

---

## Next Steps

1. Create new Next.js project with Bun
2. Set up TypeScript, Tailwind, Shadcn/ui, Biome
3. Create project structure directories
4. Implement Phase 1: Foundation
5. Execute phases 2-4 in parallel (features are independent)
6. Phase 5 polish and deployment

**Ready to start?**
