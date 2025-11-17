# Groovie TypeScript Rebuild - Implementation Checklist

Use this checklist during development to track progress and ensure nothing is missed.

---

## PHASE 1: Foundation

### Project Setup
- [ ] Create new Next.js 16 project with Bun
  ```bash
  bun create next-app groovie-typescript --typescript --tailwind --app-dir
  ```
- [ ] Verify Node.js 22, TypeScript 5 are installed
- [ ] Verify Bun runtime works: `bun run dev`

### Dependencies Installation
- [ ] Install core AI deps:
  - [ ] `bun add ai @ai-sdk/openai ai-sdk-tools`
  - [ ] `bun add @assistant-ui/react` (if using their state management)

- [ ] Install UI deps:
  - [ ] `bun add tailwindcss @tailwindcss/postcss tailwind-merge clsx`
  - [ ] `bun add motion/react motion lucide-react`
  - [ ] `shadcn-ui init` (setup Shadcn components)

- [ ] Install utility deps:
  - [ ] `bun add zod date-fns`
  - [ ] `bun add next-themes` (for dark mode, optional)

- [ ] Install dev deps:
  - [ ] `bun add -D @biomejs/biome @types/node @types/react typescript`

### Configuration Files
- [ ] Create `tsconfig.json` (strict mode)
  - [ ] `"strict": true`
  - [ ] `"noImplicitAny": true`
  - [ ] `"strictNullChecks": true`
  - [ ] Path aliases: `@/`

- [ ] Create `biome.json`
  - [ ] TypeScript language settings
  - [ ] React recommended rules
  - [ ] Formatting (line width, indentation)
  - [ ] Import sorting

- [ ] Create `tailwind.config.ts`
  - [ ] Theme colors (green primary, blue/purple/pink modes)
  - [ ] Typography scale
  - [ ] Spacing scale
  - [ ] Custom animations (fade, slide, pulse)

- [ ] Create `next.config.ts`
  - [ ] Trailing slash: false
  - [ ] Image optimization config (if using images)
  - [ ] Streaming response headers

- [ ] Create `.env.example`
  - [ ] `OPENAI_API_KEY`
  - [ ] `OPENAI_MODEL=gpt-5`
  - [ ] `GEMINI_API_KEY`
  - [ ] `EXA_API_KEY`
  - [ ] `SHOPIFY_*` variables
  - [ ] `NEXT_PUBLIC_APP_URL`

- [ ] Update `.gitignore`
  - [ ] `.env.local`, `.env.*.local`
  - [ ] `.bun/`, `node_modules/`
  - [ ] `dist/`, `.next/`

### Environment Validation
- [ ] Create `src/env.ts`
  - [ ] Use Zod to validate all env vars at startup
  - [ ] Export typed config object
  - [ ] Check for missing required vars

### Shared Types & Utilities
- [ ] Create `src/shared/lib/cn.ts` (classname merger)
- [ ] Create `src/shared/lib/constants.ts` (app config)
- [ ] Create `src/shared/types/`
  - [ ] `user.ts` (User, AccessLevel types)
  - [ ] `api.ts` (Request/Response types)
  - [ ] `common.ts` (shared types)

### Shared Hooks
- [ ] Create `src/shared/hooks/useLocalStorage.ts`
- [ ] Create `src/shared/hooks/useMediaQuery.ts`
- [ ] Create `src/shared/hooks/useDebounce.ts`

### Shared Components
- [ ] Shadcn/ui components setup
  - [ ] Run `bunx shadcn-ui@latest add button card input`
  - [ ] Add other commonly used: select, dialog, alert, badge, spinner

- [ ] Create `src/shared/components/ui/spinner.tsx` (loading indicator)
- [ ] Create `src/shared/components/animations/`
  - [ ] `ThinkingPulse.tsx`
  - [ ] `TypewriterText.tsx`
  - [ ] `StreamingText.tsx`

### Global Styles
- [ ] Create `src/app/globals.css`
  - [ ] Tailwind directives
  - [ ] CSS variables for theme colors
  - [ ] Global typography rules
  - [ ] Scrollbar styling

### Root Layout & Pages
- [ ] Create `src/app/layout.tsx` (root layout with providers)
  - [ ] Providers wrapper (themes, etc.)
  - [ ] Metadata
  - [ ] Base styling

- [ ] Create `src/app/page.tsx` (home page)
  - [ ] Mode selector UI (3 cards)
  - [ ] Access level check display
  - [ ] Brand/logo header

### Authentication
- [ ] Create `src/middleware.ts`
  - [ ] Auth check (verify session exists)
  - [ ] Access level verification from Shopify
  - [ ] Route guards for premium modes
  - [ ] Redirect unauthenticated users

- [ ] Create `src/features/auth/lib/shopify-access.ts`
  - [ ] Call Shopify API to get access level
  - [ ] Cache access level (optional)
  - [ ] Handle errors gracefully

- [ ] Create `src/features/auth/hooks/useAccessLevel.ts`
  - [ ] Hook to get current access level
  - [ ] `hasAccess(mode)` utility

- [ ] Create `src/features/auth/components/AccessLevelGuard.tsx`
  - [ ] Guard component for premium routes
  - [ ] Fallback UI if user lacks access

### Protected Layout
- [ ] Create `src/app/(authenticated)/layout.tsx`
  - [ ] Applied to all protected routes
  - [ ] Access level check
  - [ ] Main layout structure (header, sidebar, content area)

- [ ] Create mode pages (empty for now, will populate in phases 2-4):
  - [ ] `src/app/(authenticated)/reading-resource/page.tsx`
  - [ ] `src/app/(authenticated)/teaching-assistant/page.tsx`
  - [ ] `src/app/(authenticated)/magic-librarian/page.tsx`

### Linting & Formatting
- [ ] Run Biome check: `bun run lint`
  - [ ] Fix any auto-fixable issues: `bunx biome check --apply`
- [ ] Run Biome format: `bun run format`
  - [ ] Verify code formatting

### Testing Phase 1
- [ ] Dev server starts: `bun run dev`
  - [ ] Hot reload works
  - [ ] No TypeScript errors

- [ ] Pages load:
  - [ ] `/` (home) loads with mode selector
  - [ ] `/reading-resource` redirects if not authenticated
  - [ ] `/teaching-assistant` shows "premium required" if free user
  - [ ] `/magic-librarian` shows "premium required" if free user

- [ ] Environment validation:
  - [ ] Server starts if all env vars present
  - [ ] Server errors if required env vars missing

**Phase 1 Complete When:**
✅ `bun run dev` works with zero errors
✅ Mode selector page renders
✅ Auth middleware protects routes
✅ TypeScript strict mode passes
✅ Biome linting passes

---

## PHASE 2: Reading Resource Mode

### Feature Structure
- [ ] Create `src/features/reading-resource/`
  - [ ] `lib/` - agents, tools, prompts
  - [ ] `components/` - UI components
  - [ ] `hooks/` - custom hooks
  - [ ] `types/` - TypeScript definitions
  - [ ] `index.ts` - exports

### Tools Setup
- [ ] Create `src/features/reading-resource/lib/tools.ts`
  - [ ] `webSearchTool` using Exa API
  - [ ] Input validation with Zod
  - [ ] Error handling

- [ ] Create `src/features/reading-resource/lib/agents.ts`
  - [ ] System prompt for "mom-friendly" distillation
  - [ ] Agent initialization with GPT-5-mini
  - [ ] Tool binding

- [ ] Create `src/features/reading-resource/lib/prompts.ts`
  - [ ] System prompt template
  - [ ] Follow-up question generation prompt
  - [ ] Response formatting instructions

### Components
- [ ] Create `src/features/reading-resource/components/ChatInterface.tsx`
  - [ ] Layout: chat area + sidebar
  - [ ] Responsive design

- [ ] Create `src/features/reading-resource/components/SearchResults.tsx`
  - [ ] Display Exa search results
  - [ ] Link to sources
  - [ ] Context for AI response

- [ ] Create `src/features/reading-resource/components/FollowUpQuestions.tsx`
  - [ ] Render contextual questions
  - [ ] Click handlers to ask new questions

- [ ] Create `src/features/reading-resource/components/ThinkingAnimation.tsx`
  - [ ] Show thinking steps as they stream
  - [ ] Animated indicator

### Hooks
- [ ] Create `src/features/reading-resource/hooks/useReadingResourceChat.ts`
  - [ ] Chat state management
  - [ ] Message sending
  - [ ] Search results state
  - [ ] Follow-up questions state
  - [ ] Thinking steps state

- [ ] Create `src/features/reading-resource/hooks/useWebSearch.ts` (optional)
  - [ ] Web search tool wrapper
  - [ ] Loading/error states

### API Route
- [ ] Create `src/app/api/modes/reading-resource/chat/route.ts`
  - [ ] POST handler for chat messages
  - [ ] Streaming response setup
  - [ ] Tool execution pipeline
  - [ ] Error handling

### Page Component
- [ ] Update `src/app/(authenticated)/reading-resource/page.tsx`
  - [ ] Use `ChatInterface` component
  - [ ] Pass required props

### Types
- [ ] Create `src/features/reading-resource/types/index.ts`
  - [ ] `SearchResult` type
  - [ ] Any mode-specific types

### Testing Phase 2
- [ ] Type checking: `bunx tsc --noEmit`
- [ ] Linting: `bun run lint`
- [ ] Manual testing:
  - [ ] Navigate to `/reading-resource`
  - [ ] Type a question
  - [ ] Response streams to UI
  - [ ] Thinking animation shows
  - [ ] Follow-up questions appear
  - [ ] Search results are visible

- [ ] API testing:
  - [ ] POST to `/api/modes/reading-resource/chat`
  - [ ] Verify streaming response format
  - [ ] Check error handling

**Phase 2 Complete When:**
✅ Chat interface fully functional
✅ Web search integrates correctly
✅ Streaming responses display
✅ Follow-up questions generate
✅ No TypeScript/lint errors

---

## PHASE 3: Teaching Assistant Mode

### Artifact Schema Setup
- [ ] Create `src/features/artifacts/lib/artifact-schemas.ts`
  - [ ] LessonPlan schema
  - [ ] QuickWin schema
  - [ ] Activity schema
  - [ ] Assessment schema
  - [ ] Union type `Artifact`

### Artifact Components
- [ ] Create `src/features/artifacts/components/ArtifactContainer.tsx`
  - [ ] Wrapper for any artifact type
  - [ ] Progress indicator
  - [ ] Error display

- [ ] Create `src/features/artifacts/components/StreamingProgress.tsx`
  - [ ] Progress bar
  - [ ] Status message
  - [ ] Current step display

- [ ] Create `src/features/artifacts/components/ArtifactError.tsx`
  - [ ] Error message display
  - [ ] Retry button

- [ ] Create artifact-specific renderers:
  - [ ] `LessonPlanRenderer.tsx`
  - [ ] `QuickWinRenderer.tsx`
  - [ ] `ActivityRenderer.tsx`
  - [ ] `AssessmentRenderer.tsx`

### Feature Structure
- [ ] Create `src/features/teaching-assistant/`
  - [ ] `lib/` - agents, tools, prompts, schemas
  - [ ] `components/` - UI components
  - [ ] `hooks/` - custom hooks
  - [ ] `types/` - TypeScript definitions
  - [ ] `index.ts` - exports

### Tools Setup
- [ ] Create `src/features/teaching-assistant/lib/tools.ts`
  - [ ] `kbSearchTool` (knowledge base search)
  - [ ] `mastaWorkflowTool` (multi-step workflows)
  - [ ] Input validation
  - [ ] Error handling

- [ ] Create `src/features/teaching-assistant/lib/agents.ts`
  - [ ] System prompt for lesson planning
  - [ ] Tool binding

- [ ] Create `src/features/teaching-assistant/lib/prompts.ts`
  - [ ] Lesson generation prompt
  - [ ] Artifact formatting instructions
  - [ ] Science of Reading context

- [ ] Create `src/features/teaching-assistant/lib/lesson-schemas.ts`
  - [ ] Or import from `src/features/artifacts/lib/artifact-schemas.ts`

### Components
- [ ] Create `src/features/teaching-assistant/components/ChatInterface.tsx`
  - [ ] Chat input + message list
  - [ ] Artifact preview area
  - [ ] Responsive layout

- [ ] Create `src/features/teaching-assistant/components/ArtifactPreview.tsx`
  - [ ] Show current artifact
  - [ ] Artifact switcher (if multiple)

- [ ] Create `src/features/teaching-assistant/components/QuickWins.tsx`
  - [ ] List of quick win activities
  - [ ] Expandable cards

- [ ] Create `src/features/teaching-assistant/components/ActivityCard.tsx`
  - [ ] Single activity display
  - [ ] Materials list
  - [ ] Step-by-step instructions

- [ ] Create `src/features/teaching-assistant/components/AssessmentViewer.tsx`
  - [ ] Assessment questions
  - [ ] Scoring guide
  - [ ] Submission form

### Hooks
- [ ] Create `src/features/teaching-assistant/hooks/useTeachingAssistantChat.ts`
  - [ ] Chat state management
  - [ ] Artifact state
  - [ ] Message sending

- [ ] Create `src/features/teaching-assistant/hooks/useLessonPlanGeneration.ts`
  - [ ] Lesson generation logic
  - [ ] Progress tracking
  - [ ] Streaming artifact updates

### API Route
- [ ] Create `src/app/api/modes/teaching-assistant/chat/route.ts`
  - [ ] POST handler
  - [ ] Streaming with artifact support
  - [ ] Tool execution
  - [ ] Error handling

### Page Component
- [ ] Update `src/app/(authenticated)/teaching-assistant/page.tsx`
  - [ ] Use Teaching Assistant components

### Testing Phase 3
- [ ] Type checking: `bunx tsc --noEmit`
- [ ] Linting: `bun run lint`
- [ ] Manual testing:
  - [ ] Navigate to `/teaching-assistant`
  - [ ] Request a lesson plan
  - [ ] Artifact streams and renders
  - [ ] Progress indicator shows
  - [ ] All 4 artifact types render correctly
  - [ ] Components are responsive

- [ ] API testing:
  - [ ] POST to `/api/modes/teaching-assistant/chat`
  - [ ] Verify artifact in response
  - [ ] Check streaming format

**Phase 3 Complete When:**
✅ Lesson plans generate and render
✅ 4 artifact types display correctly
✅ Progress tracking works
✅ Streaming artifacts function properly
✅ No TypeScript/lint errors

---

## PHASE 4: Magic Librarian Mode

### Decodable Schemas
- [ ] Create/update `src/features/magic-librarian/lib/decodable-schemas.ts`
  - [ ] DecodableBook schema (Zod)
  - [ ] Page structure
  - [ ] Word tracking

### Phonics Game Schemas
- [ ] Create/update `src/features/magic-librarian/lib/game-schemas.ts`
  - [ ] PhonicsGame schema (Zod)
  - [ ] Game types enum
  - [ ] Round structure

### Decodable Components
- [ ] Create `src/features/magic-librarian/components/DecodableReader.tsx`
  - [ ] Book page rendering
  - [ ] Page navigation (prev/next)
  - [ ] Word annotations (optional)
  - [ ] Comprehension questions

- [ ] Create `src/features/magic-librarian/components/ElkoninBoxes.tsx`
  - [ ] Reusable Elkonin boxes game
  - [ ] Interactive phoneme sorting
  - [ ] Feedback on correct/incorrect

### Game Components
- [ ] Create `src/features/magic-librarian/components/InteractivePhonicsGame.tsx`
  - [ ] Game container
  - [ ] Round display
  - [ ] Answer selection UI
  - [ ] Score tracking

- [ ] Create `src/features/magic-librarian/components/GameAnimation.tsx`
  - [ ] Correct answer animation (using Motion)
  - [ ] Incorrect answer animation
  - [ ] Celebration animation on completion

- [ ] Create game-specific components:
  - [ ] `WordBuildingGame.tsx`
  - [ ] `RhymeMatchingGame.tsx`
  - [ ] `SoundSortingGame.tsx`

### Feature Structure
- [ ] Create `src/features/magic-librarian/`
  - [ ] `lib/` - agents, tools, prompts, schemas
  - [ ] `components/` - UI components
  - [ ] `hooks/` - custom hooks
  - [ ] `types/` - TypeScript definitions
  - [ ] `index.ts` - exports

### Tools Setup
- [ ] Create `src/features/magic-librarian/lib/tools.ts`
  - [ ] `decodableGenTool` (generate decodable books)
  - [ ] `phonicsGameTool` (generate games)
  - [ ] Input validation
  - [ ] Error handling

- [ ] Create `src/features/magic-librarian/lib/agents.ts`
  - [ ] System prompt for creative content
  - [ ] Tool binding

- [ ] Create `src/features/magic-librarian/lib/prompts.ts`
  - [ ] Decodable generation prompt
  - [ ] Game generation prompt
  - [ ] Vocabulary control instructions
  - [ ] Illustration guidance

### Hooks
- [ ] Create `src/features/magic-librarian/hooks/useMagicLibrarianChat.ts`
  - [ ] Chat state management
  - [ ] Artifact state

- [ ] Create `src/features/magic-librarian/hooks/useDecodableGeneration.ts`
  - [ ] Decodable generation logic
  - [ ] Progress tracking
  - [ ] Illustration fetching (Gemini)

- [ ] Create `src/features/magic-librarian/hooks/usePhonicsGame.ts`
  - [ ] Game state management
  - [ ] Round progression
  - [ ] Score tracking
  - [ ] Answer validation

### Components
- [ ] Create `src/features/magic-librarian/components/ChatInterface.tsx`
  - [ ] Chat input
  - [ ] Artifact rendering area

### API Route
- [ ] Create `src/app/api/modes/magic-librarian/chat/route.ts`
  - [ ] POST handler
  - [ ] Streaming artifacts
  - [ ] Tool execution
  - [ ] Error handling

### Page Component
- [ ] Update `src/app/(authenticated)/magic-librarian/page.tsx`
  - [ ] Use Magic Librarian components

### Testing Phase 4
- [ ] Type checking: `bunx tsc --noEmit`
- [ ] Linting: `bun run lint`
- [ ] Manual testing:
  - [ ] Navigate to `/magic-librarian`
  - [ ] Request a decodable book
  - [ ] Book renders with pages
  - [ ] Page navigation works
  - [ ] Request a phonics game
  - [ ] Game renders and is playable
  - [ ] Score tracking works
  - [ ] Animations are smooth

- [ ] API testing:
  - [ ] Decodable generation endpoint
  - [ ] Game generation endpoint
  - [ ] Streaming format verification

**Phase 4 Complete When:**
✅ Decodable books generate and render
✅ Book page navigation works
✅ Phonics games are playable
✅ All game types function correctly
✅ Animations are smooth
✅ Score tracking works

---

## PHASE 5: Polish & Deployment

### Error Handling
- [ ] Add try/catch to all API routes
- [ ] Add user-friendly error messages
- [ ] Add error boundaries in components
- [ ] Log errors to console/monitoring

### Loading States
- [ ] Skeleton loaders for artifacts
- [ ] Loading spinners for in-progress operations
- [ ] Disable buttons during operations
- [ ] Progress indicators for long operations

### Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Verify sidebar collapses on mobile
- [ ] Verify touch targets are adequate (48px minimum)

### Accessibility (WCAG 2.1 AA)
- [ ] Run axe DevTools on all pages
- [ ] Verify color contrast ratios (4.5:1 text, 3:1 UI elements)
- [ ] Add alt text to all images
- [ ] Verify keyboard navigation works
- [ ] Add ARIA labels where needed
- [ ] Verify focus indicators visible
- [ ] Test with screen reader (VoiceOver, NVDA)

### Performance
- [ ] Run Lighthouse
  - [ ] Performance score 90+
  - [ ] Accessibility score 90+
  - [ ] Best practices score 90+
  - [ ] SEO score 90+

- [ ] Code splitting optimization
  - [ ] Dynamic imports for heavy components
  - [ ] Lazy load images
  - [ ] Tree-shake unused code

- [ ] Bundle size analysis
  - [ ] Check `bun run build` output
  - [ ] Identify large dependencies
  - [ ] Consider alternatives if needed

### Documentation
- [ ] Add JSDoc comments to exported functions
- [ ] Document component prop types
- [ ] Create API documentation (optional)
- [ ] Add deployment instructions

### Testing
- [ ] Unit tests for utility functions (optional)
- [ ] Integration tests for API routes (optional)
- [ ] E2E tests for user flows (optional)

### Environment & Secrets
- [ ] Verify all env vars in `.env.example`
- [ ] Set up `.env.local` for local dev
- [ ] Configure Vercel environment variables
- [ ] Verify secrets are never logged

### Build & Deployment
- [ ] Test production build locally: `bun run build && bun run start`
- [ ] Fix any build errors
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Configure environment variables in Vercel
- [ ] Deploy to Vercel
- [ ] Test deployed app in production
- [ ] Verify all 3 modes work
- [ ] Check API integration with production services

### Analytics (Optional)
- [ ] Add event tracking (Mixpanel, Segment)
- [ ] Track mode usage
- [ ] Track artifact generation time
- [ ] Track error rates

### Monitoring (Optional)
- [ ] Set up error logging (Sentry)
- [ ] Monitor API response times
- [ ] Set up alerts for errors

**Phase 5 Complete When:**
✅ All pages responsive and accessible
✅ Lighthouse scores 90+
✅ No console errors
✅ App deployed to Vercel
✅ All modes functional in production
✅ Error handling works gracefully

---

## Final Verification Checklist

### Code Quality
- [ ] `bun run lint` passes with zero errors
- [ ] `bun run format` shows no changes
- [ ] `bunx tsc --noEmit` passes with zero errors
- [ ] No unused imports or variables
- [ ] No `any` types used
- [ ] All Zod schemas validated

### Functionality
- [ ] Reading Resource mode works end-to-end
- [ ] Teaching Assistant mode works end-to-end
- [ ] Magic Librarian mode works end-to-end
- [ ] All modes require authentication
- [ ] Premium modes check access level
- [ ] Error messages are user-friendly

### UX/Design
- [ ] App matches design system colors
- [ ] Typography is consistent
- [ ] Spacing is consistent
- [ ] Animations are smooth
- [ ] Loading states are clear
- [ ] Responsive on all devices

### Performance
- [ ] Dev build: `bun run dev` <3s startup
- [ ] Production build: `bun run build` <30s
- [ ] Page load time <2s (over 4G)
- [ ] No layout shift (CLS <0.1)
- [ ] Images optimized

### Deployment
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] App accessible at production URL
- [ ] All API integrations working

---

## Quick Command Reference

```bash
# Development
bun run dev              # Start dev server
bun run lint             # Run linting
bun run format          # Format code
bunx tsc --noEmit      # Type checking

# Building
bun run build           # Build for production
bun run start           # Start production server

# Adding dependencies
bun add package          # Add dependency
bun add -D package       # Add dev dependency
bun remove package       # Remove dependency

# Helpful
bun ls                   # List installed deps
bun update              # Update all deps
```

---

## Notes

- **Phase 1** focuses on infrastructure and auth
- **Phases 2-4** are feature phases and can happen in parallel (but list sequentially for clarity)
- **Phase 5** ties everything together
- Each phase should be tested before moving to the next
- Maintain TypeScript strict mode throughout
- No `any` types allowed
- All async operations should have error handling

---

**Version:** 1.0
**Last Updated:** November 2025
**Status:** Ready for implementation
