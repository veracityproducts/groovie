# Groovie TypeScript Rebuild - Quick Start Guide

## 30-Second Overview

You're rebuilding Groovie into a **fresh, unified TypeScript application** with three AI-powered "modes":

1. **Reading Resource** (FREE) - Web search + mom-friendly explanations
2. **Teaching Assistant** (PAID) - Structured lesson plans + activities
3. **Magic Librarian** (PAID) - Decodable books + phonics games

**Stack:** Bun + Next.js 16 + React 19 + TypeScript + Tailwind + Shadcn/ui + AI SDK v6

**Key:** Each mode is completely isolated (separate API routes, components, tools)

---

## Quick Decision Tree

**Q: Should I keep the existing Python backend?**
A: Yes! Only build the TypeScript frontend. The Python backend stays for deep work.

**Q: Monorepo or standalone?**
A: Start standalone. Integrate into monorepo later when proven.

**Q: Do I need to rebuild the database?**
A: No. Shopify access levels, curriculum KB, everything exists already.

**Q: What about existing decodable/game code?**
A: Rewrite as React components. Port logic from Python to TypeScript.

---

## Implementation Roadmap

### Week 1: Foundation
```bash
# Create fresh project
bun create next-app groovie-typescript --typescript
cd groovie-typescript

# Install core deps
bun add ai @ai-sdk/openai ai-sdk-tools
bun add @assistant-ui/react
bun add tailwindcss @tailwindcss/postcss tailwind-merge clsx
bun add -D biome @types/node @types/react typescript

# Setup shadcn/ui
bunx shadcn-ui@latest init

# Configure TypeScript, Tailwind, Biome
# Copy design system tokens from existing project
```

**Goal:** Working dev server, auth middleware, mode selector page

---

### Week 2: Reading Resource Mode
```typescript
// Create the structure
src/features/reading-resource/
├── components/ChatInterface.tsx
├── lib/
│   ├── agents.ts
│   ├── tools.ts (web search)
│   └── prompts.ts
├── hooks/useReadingResourceChat.ts
└── types/index.ts

src/app/(authenticated)/reading-resource/page.tsx
src/app/api/modes/reading-resource/chat/route.ts
```

**Tech:**
- Exa search API for web search
- GPT-5-mini for response distillation
- Streaming via AI SDK v6
- Follow-up questions auto-generation

**Goal:** `/reading-resource` page fully functional with streaming chat

---

### Week 3: Teaching Assistant Mode
```typescript
src/features/teaching-assistant/
├── components/
│   ├── ChatInterface.tsx
│   ├── ArtifactPreview.tsx
│   ├── QuickWins.tsx
│   ├── ActivityCard.tsx
│   └── AssessmentViewer.tsx
├── lib/
│   ├── agents.ts
│   ├── tools.ts (kb-search, masta-workflow)
│   ├── prompts.ts
│   └── lesson-schemas.ts (Zod schemas)
├── hooks/
│   ├── useTeachingAssistantChat.ts
│   └── useLessonPlanGeneration.ts
└── types/index.ts

src/app/(authenticated)/teaching-assistant/page.tsx
src/app/api/modes/teaching-assistant/chat/route.ts
```

**Artifacts (4 types with Zod schemas):**
- Lesson Plans (title, objectives, materials, lesson, assessment)
- Quick Wins (5-min activities)
- Home Activities (detailed)
- Assessment Rubrics

**Tool Integration:**
- Knowledge base search (Supabase vector search)
- Masta workflow for multi-step reasoning (or OpenAI function calls)

**Goal:** Full lesson plan generation with 4 artifact types rendering

---

### Week 4: Magic Librarian Mode
```typescript
src/features/magic-librarian/
├── components/
│   ├── ChatInterface.tsx
│   ├── DecodableReader.tsx (interactive book)
│   ├── ElkoninBoxes.tsx (reusable phonics game)
│   ├── InteractivePhonicsGame.tsx
│   └── GameAnimation.tsx (motion components)
├── lib/
│   ├── agents.ts
│   ├── tools.ts (decodable-gen, phonics-game)
│   ├── prompts.ts
│   ├── decodable-schemas.ts
│   └── game-schemas.ts
├── hooks/
│   ├── useMagicLibrarianChat.ts
│   ├── useDecodableGeneration.ts
│   └── usePhonicsGame.ts
└── types/index.ts

src/app/(authenticated)/magic-librarian/page.tsx
src/app/api/modes/magic-librarian/chat/route.ts
```

**Artifacts (2 types with Zod schemas):**
- Decodable Books (pages with text + illustrations, comprehension questions)
- Phonics Games (multiple game types: Elkonin boxes, word building, rhyme matching)

**Tech:**
- Gemini 2.5 Flash for illustrations (vision model)
- GPT-5 for story generation with controlled vocabulary
- Motion/React for game animations
- Component-level state management

**Goal:** Generate interactive decodable books and playable phonics games

---

### Week 5: Polish & Deploy
- Error handling across all modes
- Loading states and skeletons
- Mobile responsive design
- Accessibility audit
- Performance optimization
- Deploy to Vercel

---

## File Creation Checklist

### Root Config Files
- [ ] `tsconfig.json` - Strict mode TypeScript
- [ ] `tailwind.config.ts` - Design system (colors, spacing, typography)
- [ ] `biome.json` - Linting and formatting rules
- [ ] `next.config.ts` - Next.js configuration
- [ ] `.env.example` - Template for env vars
- [ ] `.gitignore` - Ensure .env.local, .venv, node_modules excluded
- [ ] `bunfig.toml` - Bun configuration (optional)

### Environment
- [ ] `src/env.ts` - Runtime validation of environment variables using Zod
- [ ] `src/middleware.ts` - Auth and access level checks

### Shared Layer
- [ ] `src/shared/components/ui/` - Shadcn/ui components
- [ ] `src/shared/components/animations/` - Reusable animations
- [ ] `src/shared/components/markdown/` - Markdown rendering
- [ ] `src/shared/hooks/useLocalStorage.ts`
- [ ] `src/shared/hooks/useMediaQuery.ts`
- [ ] `src/shared/hooks/useDebounce.ts`
- [ ] `src/shared/lib/cn.ts` - Classname utility
- [ ] `src/shared/lib/constants.ts` - App-wide constants
- [ ] `src/shared/types/` - Global types (api.ts, user.ts, common.ts)
- [ ] `src/shared/styles/globals.css` - Tailwind directives

### Features - Auth
- [ ] `src/features/auth/lib/shopify-access.ts` - Shopify access level verification
- [ ] `src/features/auth/hooks/useAccessLevel.ts`
- [ ] `src/features/auth/components/AccessLevelGuard.tsx`

### Features - Chat (Base)
- [ ] `src/features/chat/components/ChatDisplay.tsx`
- [ ] `src/features/chat/components/ChatInput.tsx`
- [ ] `src/features/chat/components/MessageList.tsx`
- [ ] `src/features/chat/components/StreamingMessage.tsx`
- [ ] `src/features/chat/hooks/useChat.ts`
- [ ] `src/features/chat/lib/streaming.ts`

### Features - Artifacts
- [ ] `src/features/artifacts/lib/artifact-schemas.ts` - Master Zod schemas
- [ ] `src/features/artifacts/components/ArtifactContainer.tsx`
- [ ] `src/features/artifacts/components/StreamingProgress.tsx`
- [ ] `src/features/artifacts/hooks/useArtifact.ts`

### Features - Reading Resource
- [ ] `src/features/reading-resource/lib/agents.ts`
- [ ] `src/features/reading-resource/lib/tools.ts` - Exa search tool
- [ ] `src/features/reading-resource/lib/prompts.ts`
- [ ] `src/features/reading-resource/components/ChatInterface.tsx`
- [ ] `src/features/reading-resource/components/SearchResults.tsx`
- [ ] `src/features/reading-resource/components/FollowUpQuestions.tsx`
- [ ] `src/features/reading-resource/components/ThinkingAnimation.tsx`
- [ ] `src/features/reading-resource/hooks/useReadingResourceChat.ts`
- [ ] `src/app/api/modes/reading-resource/chat/route.ts`
- [ ] `src/app/(authenticated)/reading-resource/page.tsx`

### Features - Teaching Assistant
- [ ] `src/features/teaching-assistant/lib/agents.ts`
- [ ] `src/features/teaching-assistant/lib/tools.ts` - KB search, Masta
- [ ] `src/features/teaching-assistant/lib/prompts.ts`
- [ ] `src/features/teaching-assistant/lib/lesson-schemas.ts` - Zod
- [ ] `src/features/teaching-assistant/components/ChatInterface.tsx`
- [ ] `src/features/teaching-assistant/components/ArtifactPreview.tsx`
- [ ] `src/features/teaching-assistant/components/QuickWins.tsx`
- [ ] `src/features/teaching-assistant/components/ActivityCard.tsx`
- [ ] `src/features/teaching-assistant/components/AssessmentViewer.tsx`
- [ ] `src/features/teaching-assistant/hooks/useTeachingAssistantChat.ts`
- [ ] `src/features/teaching-assistant/hooks/useLessonPlanGeneration.ts`
- [ ] `src/app/api/modes/teaching-assistant/chat/route.ts`
- [ ] `src/app/(authenticated)/teaching-assistant/page.tsx`

### Features - Magic Librarian
- [ ] `src/features/magic-librarian/lib/agents.ts`
- [ ] `src/features/magic-librarian/lib/tools.ts` - Decodable, games
- [ ] `src/features/magic-librarian/lib/prompts.ts`
- [ ] `src/features/magic-librarian/lib/decodable-schemas.ts` - Zod
- [ ] `src/features/magic-librarian/lib/game-schemas.ts` - Zod
- [ ] `src/features/magic-librarian/components/ChatInterface.tsx`
- [ ] `src/features/magic-librarian/components/DecodableReader.tsx`
- [ ] `src/features/magic-librarian/components/ElkoninBoxes.tsx`
- [ ] `src/features/magic-librarian/components/InteractivePhonicsGame.tsx`
- [ ] `src/features/magic-librarian/components/GameAnimation.tsx`
- [ ] `src/features/magic-librarian/hooks/useMagicLibrarianChat.ts`
- [ ] `src/features/magic-librarian/hooks/useDecodableGeneration.ts`
- [ ] `src/features/magic-librarian/hooks/usePhonicsGame.ts`
- [ ] `src/app/api/modes/magic-librarian/chat/route.ts`
- [ ] `src/app/(authenticated)/magic-librarian/page.tsx`

### App Router
- [ ] `src/app/page.tsx` - Home/mode selector
- [ ] `src/app/layout.tsx` - Root layout
- [ ] `src/app/(authenticated)/layout.tsx` - Protected layout
- [ ] `src/app/(authenticated)/layout.tsx` - Auth guard wrapper

### Tests (Optional Phase 5)
- [ ] `tests/unit/artifacts/schema.test.ts`
- [ ] `tests/integration/api/modes.test.ts`
- [ ] `tests/e2e/modes.spec.ts`

---

## Critical Dependencies

### Must Have
```json
{
  "dependencies": {
    "next": "16.x",
    "react": "19.x",
    "typescript": "5.x",
    "ai": "^6.0",
    "@ai-sdk/openai": "^3.0",
    "ai-sdk-tools": "^1.0",
    "@assistant-ui/react": "^1.0",
    "tailwindcss": "4.x",
    "@tailwindcss/postcss": "^4.0",
    "shadcn-ui": "latest",
    "zod": "^4.0",
    "framer-motion": "^12.0",
    "motion": "^12.0",
    "lucide-react": "^latest"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.2",
    "@types/node": "^22",
    "@types/react": "^19",
    "typescript": "^5"
  }
}
```

### Optional Integrations
- Exa JS client (web search)
- Gemini API (illustrations)
- Supabase JS (KB search)
- Masta lib (workflows)
- TanStack Query (state management)
- Vitest (unit testing)

---

## Environment Variables Template

```env
# APIs
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5
GEMINI_API_KEY=...
EXA_API_KEY=...

# Shopify
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
SHOPIFY_STORE_URL=...

# Supabase (KB search)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Deployment
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Masta
MASTA_API_KEY=...
```

---

## Development Workflow

```bash
# Start dev server
bun run dev

# Format and lint
bun run format
bun run lint

# Build for production
bun run build

# Start production server
bun run start

# Type checking (optional)
bunx tsc --noEmit
```

---

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Package Manager | Bun | Speed, built-in bundler, modern DX |
| Build Tool | Next.js Turbopack | Integrated, fast, handles streaming |
| Styling | Tailwind + Shadcn | Atomic, reusable, accessible |
| AI Framework | AI SDK v6 | Type-safe, streaming, tool support |
| State Mgmt | Component hooks + Assistant UI | Simple for MVP, extensible later |
| Data Validation | Zod | Runtime safety, TypeScript sync |
| Linting | Biome | Fast, opinionated, minimal config |
| Deployment | Vercel | Next.js native, streaming support |

---

## Common Pitfalls to Avoid

❌ **Don't:** Mix mode-specific code in shared/
✅ **Do:** Keep modes isolated, import only from shared/

❌ **Don't:** Create giant component files (>250 lines)
✅ **Do:** Decompose into smaller, focused components

❌ **Don't:** Use `any` types
✅ **Do:** Define Zod schemas for all data

❌ **Don't:** Forget to validate API responses at runtime
✅ **Do:** Parse responses through Zod schemas

❌ **Don't:** Store secrets in environment variables that get bundled
✅ **Do:** Prefix with `NEXT_PUBLIC_` only for browser-safe values

❌ **Don't:** Make API calls in event handlers without error handling
✅ **Do:** Use try/catch and show user feedback

---

## Success Indicators

**Phase 1:**
- Dev server runs with `bun run dev`
- Hot reload works
- Auth middleware blocks unauthenticated users
- Mode selector page renders

**Phase 2:**
- Chat interface accepts user input
- Messages stream to UI in real-time
- Follow-up questions generate automatically
- Thinking animation shows during processing

**Phase 3:**
- Lesson plan generation works end-to-end
- 4 artifact types render correctly
- Progress bar shows during generation
- Streaming doesn't break on slow connections

**Phase 4:**
- Decodable books generate and render
- Phonics games are interactive and playable
- Motion animations smooth and performant
- Scores persist during game session

**Phase 5:**
- All modes work on mobile
- Lighthouse scores 90+
- Keyboard navigation works
- No console errors

---

## Questions to Answer Before Starting

1. **Masta Integration:** Library URL? Docs? Or use OpenAI functions?
2. **Knowledge Base:** Supabase vector tables ready? Embedding model?
3. **Decodable Caching:** Store in browser, server, or generate fresh?
4. **Message History:** Session-only or persistent across days?
5. **Premium Verification:** API call per request or cached?
6. **Error Handling:** Specific error codes to handle? Retry logic?

---

## Next Steps

1. Review this guide with your team
2. Create new Next.js project with Bun
3. Set up TypeScript, Tailwind, Shadcn/ui
4. Create project structure
5. Begin Phase 1 implementation
6. **Start building!**

---

**Questions?** Refer to `TYPESCRIPT_REBUILD_STRATEGY_2025.md` for detailed architecture.
