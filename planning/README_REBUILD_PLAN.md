# Groovie TypeScript Rebuild 2025 - Complete Planning Documentation

## Overview

This directory contains comprehensive planning documentation for rebuilding Groovie as a modern, modular TypeScript application. The rebuild consolidates 3 years of MVP development into a production-grade codebase with a clean architecture.

## What's Included

### 1. **TYPESCRIPT_REBUILD_STRATEGY_2025.md** 🏗️
**Main architectural blueprint** - Start here for the big picture

- Executive summary and key outcomes
- Complete tech stack rationale
- Detailed project structure with full directory tree
- Three mode specifications (Reading Resource, Teaching Assistant, Magic Librarian)
- Data flow and integration points
- Five-phase implementation breakdown
- Questions to clarify before starting

**Read this when:** You need to understand the overall strategy or explain it to stakeholders.

**Key sections:**
- Tech Stack (Bun, Next.js 16, React 19, TypeScript, Tailwind, AI SDK v6)
- Project Structure (3 modes, vertical slices, shared components)
- Mode Specifications (API endpoints, tools, artifacts, system prompts)
- Implementation Phases (Week-by-week breakdown)

---

### 2. **QUICK_START_GUIDE.md** ⚡
**Practical development guide** - Reference this during implementation

- 30-second overview
- Quick decision tree
- Week-by-week roadmap
- File creation checklist (150+ files tracked)
- Critical dependencies list
- Environment variables template
- Development workflow commands
- Common pitfalls to avoid
- Success indicators for each phase

**Read this when:** You're starting implementation or need quick reference for what comes next.

**Key sections:**
- Tech stack decisions with rationale
- File checklist with status tracking
- Dependency management
- Development commands
- Troubleshooting tips

---

### 3. **COMPONENT_API_REFERENCE.md** 📚
**Type definitions and interfaces** - Your API dictionary

- Core types (User, Auth, Chat, Messages)
- Artifact type definitions (6 artifact types with Zod schemas)
- Component interfaces for every component you'll build
- Hook signatures and return types
- API request/response types
- Tool definitions for all three modes
- Streaming response format
- Usage examples

**Read this when:** You're building a component, creating a hook, or defining types.

**Key sections:**
- Zod schemas for all artifacts
- Component prop interfaces
- Hook signatures
- API contracts
- Tool parameter definitions

---

### 4. **IMPLEMENTATION_CHECKLIST.md** ✅
**Phase-by-phase checklist** - Track your progress

- 100+ checklist items organized by phase
- Phase 1: Foundation (project setup, auth, config)
- Phase 2: Reading Resource (web search + distillation)
- Phase 3: Teaching Assistant (lessons + artifacts)
- Phase 4: Magic Librarian (decodables + games)
- Phase 5: Polish & deployment
- Success criteria for each phase
- Testing strategy
- Final verification checklist

**Read this when:** You're executing a phase and want to make sure nothing is missed.

**Key sections:**
- Dependency installation with exact commands
- File creation with full paths
- Testing procedures
- Verification checklist

---

## How to Use These Documents

### For Project Setup (Day 1)
1. Read **TYPESCRIPT_REBUILD_STRATEGY_2025.md** sections 1-3 (30 min)
2. Review **QUICK_START_GUIDE.md** (15 min)
3. Open **IMPLEMENTATION_CHECKLIST.md** Phase 1
4. Create project with Bun
5. Follow checklist items in order

### For Development (Days 2+)
1. Start of day: Review phase description in **TYPESCRIPT_REBUILD_STRATEGY_2025.md**
2. During day: Use **IMPLEMENTATION_CHECKLIST.md** to track progress
3. When building: Reference **COMPONENT_API_REFERENCE.md** for types
4. When stuck: Check **QUICK_START_GUIDE.md** troubleshooting

### For Collaboration
1. Share **TYPESCRIPT_REBUILD_STRATEGY_2025.md** with team for strategy review
2. Use **QUICK_START_GUIDE.md** for team onboarding
3. Use **COMPONENT_API_REFERENCE.md** for API contracts between team members

---

## The Three Modes Explained

### 1. Reading Resource (FREE)
**Purpose:** Quick, mom-friendly answers about childhood literacy

**Flow:** User Question → Web Search (Exa) → Distill (GPT-5-mini) → Mom-Friendly Response + Follow-ups

**Tech:** Exa Search API, GPT-5-mini, streaming responses

**Artifacts:** None (text-only responses)

---

### 2. Teaching Assistant (PREMIUM)
**Purpose:** Structured lesson planning with activities and assessments

**Flow:** User Request → KB Search → Masta Workflow → Generate Lesson + Quick-Wins + Activities + Assessment

**Tech:** Knowledge Base (Supabase), OpenAI Function Calls/Masta, 4 artifact types

**Artifacts:**
- Lesson Plans (objectives, materials, lesson flow, assessment)
- Quick Wins (5-min activities)
- Home Activities (detailed instructions, materials)
- Assessment Rubrics (scoring guides)

---

### 3. Magic Librarian (PREMIUM)
**Purpose:** Interactive decodable books and phonics games

**Flow A (Books):** Patterns → GPT-5 (story) + Gemini (illustrations) → Interactive Decodable

**Flow B (Games):** Game Type → Gemini/GPT-5 → Interactive Phonics Game (Elkonin boxes, etc.)

**Tech:** Gemini 2.5 Flash (vision), GPT-5, Motion/React, Component-based games

**Artifacts:**
- Decodable Books (pages with text + images, comprehension questions)
- Phonics Games (4 game types: Elkonin boxes, word building, rhyme matching, sound sorting)

---

## Project Structure Quick Reference

```
groovie-typescript/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/modes/              # Mode-based API endpoints
│   │   │   ├── reading-resource/
│   │   │   ├── teaching-assistant/
│   │   │   └── magic-librarian/
│   │   ├── (authenticated)/        # Protected routes
│   │   │   ├── reading-resource/
│   │   │   ├── teaching-assistant/
│   │   │   └── magic-librarian/
│   │   └── page.tsx                # Mode selector home page
│   │
│   ├── features/                   # Feature modules (vertical slices)
│   │   ├── reading-resource/       # Completely isolated
│   │   ├── teaching-assistant/     # Completely isolated
│   │   ├── magic-librarian/        # Completely isolated
│   │   ├── chat/                   # Base chat functionality
│   │   ├── artifacts/              # Artifact rendering
│   │   └── auth/                   # Authentication
│   │
│   ├── shared/                     # Cross-feature utilities
│   │   ├── components/             # Reusable UI components
│   │   ├── hooks/                  # Shared custom hooks
│   │   ├── lib/                    # Shared utilities
│   │   └── types/                  # Global types
│   │
│   └── middleware.ts               # Auth and access control
```

**Key principle:** Each mode is completely isolated (reading-resource, teaching-assistant, magic-librarian). They can ONLY import from `shared/`. No cross-mode imports allowed.

---

## Tech Stack at a Glance

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | Bun | Fast, modern, no Node.js bloat |
| **Framework** | Next.js 16 | App Router, streaming, RSC support |
| **UI Framework** | React 19 | Latest features, performance |
| **Language** | TypeScript 5 | Strict mode, full type safety |
| **Styling** | Tailwind CSS v4 | Atomic, design tokens, DX |
| **Components** | Shadcn/ui | Accessible, composable |
| **Animations** | Motion/React | Declarative, smooth |
| **AI** | AI SDK v6 | Type-safe, streaming, tool support |
| **Web Search** | Exa Search API | Semantic search, quality results |
| **Illustrations** | Gemini 2.5 Flash | Vision model, fast |
| **Data Validation** | Zod | Runtime safety, TypeScript sync |
| **Linting** | Biome | Fast, opinionated, minimal config |
| **Deployment** | Vercel | Next.js native, streaming support |

---

## Implementation Timeline

```
Week 1: Foundation
  - Project setup with Bun + Next.js 16
  - TypeScript, Tailwind, Shadcn/ui configuration
  - Auth middleware + Shopify integration
  - Mode selector page
  Goal: Dev server runs, auth works, UI renders

Week 2: Reading Resource Mode
  - Web search tool (Exa)
  - GPT-5-mini distillation pipeline
  - Streaming chat interface
  - Follow-up question generation
  Goal: Mode fully functional with streaming responses

Week 3: Teaching Assistant Mode
  - Knowledge base search
  - Lesson plan generation
  - 4 artifact types (lesson, quick-wins, activities, assessment)
  - Artifact rendering + progress tracking
  Goal: All artifacts generate and render correctly

Week 4: Magic Librarian Mode
  - Decodable book generation
  - Gemini illustration integration
  - Phonics game generation
  - Interactive game components with animations
  Goal: Books and games fully playable

Week 5: Polish & Deploy
  - Error handling + loading states
  - Mobile responsive design
  - Accessibility audit (WCAG 2.1 AA)
  - Performance optimization (Lighthouse 90+)
  - Deploy to Vercel
  Goal: Production-ready app live
```

---

## What NOT to Do

❌ **Don't mix modes** - Keep reading-resource, teaching-assistant, magic-librarian completely separate

❌ **Don't create god components** - Break files >250 lines into smaller components

❌ **Don't use `any` types** - Always define explicit types with TypeScript/Zod

❌ **Don't skip API validation** - Always validate responses at runtime with Zod

❌ **Don't store secrets in files** - Use environment variables only

❌ **Don't forget error handling** - Wrap all async operations in try/catch

❌ **Don't rebuild the backend** - Python FastAPI stays unchanged

❌ **Don't rebuild the database** - Supabase and Shopify integration stays the same

---

## Key Questions to Answer Before Starting

1. **Masta Workflow:** Is there a library/API for Masta, or should we use OpenAI function calls?
2. **Knowledge Base:** Where exactly is the KB hosted? (Supabase? Vector search available?)
3. **Decodable Caching:** Generate fresh each time, cache in browser, or cache server-side?
4. **Message Persistence:** Do we need conversation history saved across sessions?
5. **Premium Verification:** API call per request, or cached in session?
6. **Error Budgets:** How gracefully should errors be handled? Retry logic needed?

---

## Success Criteria

### Phase 1 ✅
- `bun run dev` starts with zero errors
- Auth middleware protects routes
- Mode selector page renders correctly
- TypeScript strict mode passes

### Phase 2 ✅
- Chat interface is fully functional
- Web search integrates and returns results
- Responses stream to UI in real-time
- Follow-up questions generate automatically
- Thinking animation shows during processing

### Phase 3 ✅
- Lesson plans generate end-to-end
- All 4 artifact types render correctly
- Progress indicator shows during generation
- Streaming doesn't break on slow connections

### Phase 4 ✅
- Decodable books generate and render
- Books have interactive page navigation
- Phonics games are playable
- Animations are smooth and performant
- Score tracking works

### Phase 5 ✅
- All pages responsive (mobile, tablet, desktop)
- Lighthouse scores 90+ (perf, a11y, best practices, SEO)
- Zero console errors in production
- App deployed to Vercel
- All 3 modes functional in production

---

## Quick Reference Links

- **AI SDK v6 Docs:** https://sdk.vercel.ai/docs
- **Next.js 16 Docs:** https://nextjs.org/docs
- **Tailwind CSS v4 Docs:** https://tailwindcss.com/docs
- **Shadcn/ui Docs:** https://ui.shadcn.com/
- **Zod Docs:** https://zod.dev/
- **Motion/React Docs:** https://motion.dev/docs/react
- **Exa Search API:** https://exa.ai/
- **Gemini API:** https://ai.google.dev/

---

## Document Hierarchy

```
README_REBUILD_PLAN.md (You are here)
│
├─ TYPESCRIPT_REBUILD_STRATEGY_2025.md (Read first for strategy)
│  └─ Read when: Understanding overall architecture
│
├─ QUICK_START_GUIDE.md (Read second for practical steps)
│  └─ Read when: Starting implementation, need quick reference
│
├─ COMPONENT_API_REFERENCE.md (Reference during coding)
│  └─ Read when: Building components, defining types, writing hooks
│
└─ IMPLEMENTATION_CHECKLIST.md (Use during execution)
   └─ Read when: Executing phases, tracking progress, testing
```

---

## Next Steps

### Immediately (Today)
1. ✅ Review this README
2. ✅ Read TYPESCRIPT_REBUILD_STRATEGY_2025.md
3. ✅ Review QUICK_START_GUIDE.md
4. ⏭️ Answer the "Key Questions" above
5. ⏭️ Create new Bun + Next.js project

### This Week (Phase 1)
1. Set up TypeScript, Tailwind, Shadcn/ui
2. Configure Biome linting
3. Create authentication middleware
4. Build mode selector UI
5. ✅ Have dev server running with zero errors

### Next Week+ (Phases 2-4)
1. Follow IMPLEMENTATION_CHECKLIST.md for each phase
2. Reference COMPONENT_API_REFERENCE.md when building
3. Test at end of each phase before moving to next

### Week 5 (Phase 5)
1. Polish UI/UX
2. Run Lighthouse audit
3. Accessibility audit
4. Deploy to Vercel

---

## File Status

| Document | Status | Last Updated | Next Review |
|----------|--------|--------------|------------|
| TYPESCRIPT_REBUILD_STRATEGY_2025.md | ✅ Complete | Nov 2025 | When architecture questions arise |
| QUICK_START_GUIDE.md | ✅ Complete | Nov 2025 | Before Phase 1 starts |
| COMPONENT_API_REFERENCE.md | ✅ Complete | Nov 2025 | When implementing components |
| IMPLEMENTATION_CHECKLIST.md | ✅ Complete | Nov 2025 | Daily during implementation |
| README_REBUILD_PLAN.md | ✅ Complete | Nov 2025 | For onboarding new team members |

---

## Getting Help

**During Architecture Questions:**
- Refer to TYPESCRIPT_REBUILD_STRATEGY_2025.md section 1-3
- Review the Three Mode Specifications
- Check "Questions to Answer" section above

**During Implementation:**
- Use IMPLEMENTATION_CHECKLIST.md to verify you're on track
- Reference COMPONENT_API_REFERENCE.md for type definitions
- Check QUICK_START_GUIDE.md troubleshooting section

**For Code Examples:**
- See COMPONENT_API_REFERENCE.md "Usage Examples" section
- Check TYPESCRIPT_REBUILD_STRATEGY_2025.md for tool examples

---

## Estimated Effort

| Phase | Duration | Complexity | Dependencies |
|-------|----------|-----------|--------------|
| Phase 1: Foundation | 3-5 days | Low | None |
| Phase 2: Reading Resource | 3-5 days | Medium | Phase 1 |
| Phase 3: Teaching Assistant | 4-6 days | High | Phase 1 |
| Phase 4: Magic Librarian | 4-6 days | High | Phase 1 |
| Phase 5: Polish & Deploy | 2-3 days | Medium | Phases 2-4 |
| **Total** | **16-25 days** | **Medium** | Sequential |

**Notes:**
- Phases 2-4 are mostly independent (can parallel within reason)
- Phase 5 requires all previous phases complete
- Buffer: Add 20% for unexpected issues
- With 1 developer: ~5 weeks
- With 2 developers: ~3-4 weeks (1 per mode parallel)

---

## Success Celebration Milestones 🎉

- ✅ Phase 1: "Project compiles, auth works, UI renders"
- ✅ Phase 2: "First mode fully functional with streaming chat"
- ✅ Phase 3: "Lesson plans generating from web + KB"
- ✅ Phase 4: "Decodable books and games playable"
- ✅ Phase 5: "App deployed to Vercel, all systems live"

---

**Version:** 1.0
**Created:** November 2025
**Status:** Ready for Implementation
**Maintained By:** Josh Coleman

---

## Questions?

Refer to the specific document:
- **"What's the overall strategy?"** → TYPESCRIPT_REBUILD_STRATEGY_2025.md
- **"How do I get started?"** → QUICK_START_GUIDE.md
- **"What types do I need?"** → COMPONENT_API_REFERENCE.md
- **"What's the next step?"** → IMPLEMENTATION_CHECKLIST.md

**Let's build something great! 🚀**
