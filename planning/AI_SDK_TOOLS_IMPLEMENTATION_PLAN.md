# AI SDK Tools Implementation Plan for Groovie

## Executive Summary

**Recommendation:** IMPLEMENT - High value, low risk migration

AI SDK Tools provides production-ready infrastructure for our artifact streaming system with:
- ✅ Type-safe Zod schemas for all artifacts
- ✅ Built-in progress tracking during generation
- ✅ Real-time streaming updates
- ✅ Global state management (no prop drilling)
- ✅ Development debugging tools

## Current State Analysis

### What We Have Now
```typescript
// Backend: Manual streaming (backend/src/api/artifacts.py)
@router.post("/game")
async def generate_game(request: ArtifactRequest):
    response = await openai_client.responses.create(...)
    content = extract_content(response)  # Manual parsing
    game_data = json.loads(content)      # Manual JSON validation
    return ArtifactResponse(...)         # No progress tracking

// Frontend: Manual state management (ChatDisplay.tsx)
const [artifacts, setArtifacts] = useState([])
const handleArtifactClick = async (type: string) => {
    const response = await fetch(`/api/artifacts/${type}`)  // No streaming
    const data = await response.json()                       // All-at-once
    setArtifacts([...artifacts, data])                       // No type safety
}
```

### Pain Points
1. ❌ No type safety between backend → frontend
2. ❌ No progress indicators (just loading spinner)
3. ❌ No real-time updates during generation
4. ❌ Manual error handling everywhere
5. ❌ Props drilled through multiple components
6. ❌ No schema validation (JSON parsing can fail silently)

## Proposed Architecture

### With AI SDK Tools
```typescript
// Shared: Type-safe artifact definitions (artifacts/definitions.ts)
import { artifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

export const GameArtifact = artifact('game', z.object({
    gameType: z.enum(['matching', 'sorting', 'memory', 'sequencing', 'word-building']),
    title: z.string(),
    objective: z.string(),
    gradeLevel: z.string(),
    questions: z.array(z.object({
        text: z.string(),
        correctAnswer: z.string(),
        options: z.array(z.string()).optional()
    })),
    status: z.enum(['idle', 'generating', 'validating', 'complete', 'error']).default('idle'),
    progress: z.number().min(0).max(1).default(0)
}))

// Backend: Stream with progress (api/route.ts)
export const generateGameTool = tool({
    description: 'Generate educational game',
    parameters: z.object({ 
        request: z.string(),
        gradeLevel: z.string() 
    }),
    execute: async ({ request, gradeLevel }) => {
        const artifact = GameArtifact.stream({
            gameType: 'matching',
            title: 'Generating...',
            objective: request,
            gradeLevel,
            questions: [],
            status: 'generating',
            progress: 0
        })

        // Real-time progress updates
        await artifact.update({ progress: 0.3, status: 'generating' })
        
        const gameData = await generateGameData(request)
        
        await artifact.update({ progress: 0.7, status: 'validating' })
        
        const validated = validateGameStructure(gameData)
        
        await artifact.complete({
            ...validated,
            progress: 1.0,
            status: 'complete'
        })

        return 'Game generated successfully'
    }
})

// Frontend: Type-safe consumption with progress
function GameViewer() {
    const { data, status, progress, error, isActive } = useArtifact(GameArtifact, {
        onUpdate: (newData) => console.log('Game updated:', newData),
        onComplete: (finalData) => toast.success('Game ready!'),
        onError: (error) => toast.error(error)
    })

    if (error) return <ErrorDisplay error={error} />
    if (!data) return <LoadingState />

    return (
        <div>
            <h2>{data.title}</h2>
            {isActive && (
                <ProgressBar 
                    value={progress || 0} 
                    label={`${status} - ${Math.round((progress || 0) * 100)}%`}
                />
            )}
            <GameRenderer game={data} />
        </div>
    )
}
```

## Implementation Plan

### Phase 1: Setup & Foundation (1-2 hours)

#### Task 1.1: Install Dependencies
```bash
cd frontend/groovie-client
npm install @ai-sdk-tools/store @ai-sdk-tools/devtools @ai-sdk-tools/artifacts
```

**Expected package versions:**
- `@ai-sdk-tools/store@latest`
- `@ai-sdk-tools/devtools@latest`
- `@ai-sdk-tools/artifacts@latest`

**Verification:**
```bash
npm list | grep ai-sdk-tools
```

#### Task 1.2: Create Artifact Definitions
```bash
# Create artifact definitions directory
mkdir -p frontend/groovie-client/src/artifacts
touch frontend/groovie-client/src/artifacts/index.ts
touch frontend/groovie-client/src/artifacts/game.ts
touch frontend/groovie-client/src/artifacts/document.ts
touch frontend/groovie-client/src/artifacts/decodable.ts
```

**File: `src/artifacts/game.ts`**
```typescript
import { artifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

export const GameArtifact = artifact('game', z.object({
    gameType: z.enum(['matching', 'sorting', 'memory', 'sequencing', 'word-building']),
    title: z.string(),
    objective: z.string(),
    gradeLevel: z.string(),
    instructions: z.string(),
    questions: z.array(z.object({
        id: z.string(),
        text: z.string(),
        correctAnswer: z.string(),
        options: z.array(z.string()).optional(),
        feedback: z.string().optional()
    })),
    visualStyle: z.object({
        theme: z.string(),
        colorScheme: z.string()
    }).optional(),
    status: z.enum(['idle', 'planning', 'generating', 'validating', 'complete', 'error']).default('idle'),
    progress: z.number().min(0).max(1).default(0),
    error: z.string().optional()
}))

export type GameData = z.infer<typeof GameArtifact.schema>
```

**File: `src/artifacts/document.ts`**
```typescript
import { artifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

export const DocumentArtifact = artifact('document', z.object({
    documentType: z.enum(['lesson', 'activity', 'worksheet', 'assessment']),
    title: z.string(),
    gradeLevel: z.string(),
    subject: z.string(),
    duration: z.string(),
    objectives: z.array(z.string()),
    materials: z.array(z.string()).optional(),
    sections: z.array(z.object({
        heading: z.string(),
        content: z.string(),
        order: z.number()
    })),
    standards: z.array(z.string()).optional(),
    status: z.enum(['idle', 'planning', 'writing', 'formatting', 'complete', 'error']).default('idle'),
    progress: z.number().min(0).max(1).default(0),
    error: z.string().optional()
}))

export type DocumentData = z.infer<typeof DocumentArtifact.schema>
```

**File: `src/artifacts/decodable.ts`**
```typescript
import { artifact } from '@ai-sdk-tools/artifacts'
import { z } from 'zod'

export const DecodableArtifact = artifact('decodable', z.object({
    title: z.string(),
    targetPattern: z.string(),
    gradeLevel: z.string(),
    wordCount: z.number(),
    story: z.string(),
    targetWords: z.array(z.object({
        word: z.string(),
        pattern: z.string(),
        position: z.number()
    })),
    illustrations: z.array(z.object({
        description: z.string(),
        page: z.number()
    })).optional(),
    comprehensionQuestions: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })),
    status: z.enum(['idle', 'planning', 'writing', 'validating', 'complete', 'error']).default('idle'),
    progress: z.number().min(0).max(1).default(0),
    error: z.string().optional()
}))

export type DecodableData = z.infer<typeof DecodableArtifact.schema>
```

**File: `src/artifacts/index.ts`**
```typescript
export * from './game'
export * from './document'
export * from './decodable'
```

### Phase 2: Backend Migration (2-3 hours)

#### Task 2.1: Update FastAPI Artifact Endpoints

**Current Problem:**
- Backend uses custom `ArtifactResponse` format
- No streaming (all-at-once response)
- No progress tracking

**Solution:**
- Keep FastAPI endpoints but add streaming support
- Use Server-Sent Events (SSE) for progress updates
- Return artifact updates in ai-sdk-tools compatible format

**File: `backend/src/api/artifacts.py`** (updated)
```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
import json

router = APIRouter()

async def stream_game_generation(request: ArtifactRequest):
    """Stream game generation with progress updates"""
    
    # Initial state
    yield f"data: {json.dumps({
        'type': 'update',
        'artifact_id': 'game',
        'data': {
            'gameType': 'matching',
            'title': 'Generating game...',
            'objective': request.user_request,
            'gradeLevel': request.grade_level,
            'questions': [],
            'status': 'planning',
            'progress': 0
        }
    })}\n\n"
    
    await asyncio.sleep(0.5)  # Simulate planning phase
    
    # Progress update
    yield f"data: {json.dumps({
        'type': 'update',
        'artifact_id': 'game',
        'data': {
            'status': 'generating',
            'progress': 0.3
        }
    })}\n\n"
    
    # Generate game (existing logic)
    game_data = await generate_game_data(request)
    
    # Progress update
    yield f"data: {json.dumps({
        'type': 'update',
        'artifact_id': 'game',
        'data': {
            'status': 'validating',
            'progress': 0.7
        }
    })}\n\n"
    
    # Complete
    yield f"data: {json.dumps({
        'type': 'complete',
        'artifact_id': 'game',
        'data': {
            **game_data,
            'status': 'complete',
            'progress': 1.0
        }
    })}\n\n"

@router.post("/game/stream")
async def stream_game(request: ArtifactRequest):
    """Stream game generation"""
    return StreamingResponse(
        stream_game_generation(request),
        media_type="text/event-stream"
    )
```

#### Task 2.2: Create Next.js API Route Proxy

**File: `frontend/groovie-client/src/app/api/artifacts/game/stream/route.ts`** (new)
```typescript
import { GameArtifact } from '@/artifacts'

export async function POST(req: Request) {
    const body = await req.json()
    
    // Create artifact stream
    const artifact = GameArtifact.stream({
        gameType: 'matching',
        title: 'Generating game...',
        objective: body.user_request,
        gradeLevel: body.grade_level,
        questions: [],
        instructions: '',
        status: 'planning',
        progress: 0
    })

    // Connect to FastAPI streaming endpoint
    const response = await fetch('http://localhost:8000/api/chat/artifacts/game/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    if (!response.body) {
        await artifact.error('Failed to connect to backend')
        return new Response('Stream failed', { status: 500 })
    }

    // Pipe backend stream to artifact
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n\n')

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'update') {
                    await artifact.update(data.data)
                } else if (data.type === 'complete') {
                    await artifact.complete(data.data)
                } else if (data.type === 'error') {
                    await artifact.error(data.message)
                }
            }
        }
    }

    return new Response('OK')
}
```

### Phase 3: Frontend Migration (3-4 hours)

#### Task 3.1: Migrate useChat to @ai-sdk-tools/store

**File: `src/features/chat/components/ChatDisplay.tsx`** (update)
```typescript
// Before
import { useChat } from '@ai-sdk/react'

// After
import { useChat } from '@ai-sdk-tools/store'
```

**That's it!** The API is identical. No other changes needed for basic migration.

#### Task 3.2: Replace Artifact Handling

**File: `src/features/artifacts/components/artifact-viewer.tsx`** (updated)
```typescript
'use client'

import { useArtifact } from '@ai-sdk-tools/artifacts/client'
import { GameArtifact, DocumentArtifact, DecodableArtifact } from '@/artifacts'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ArtifactViewer({ type }: { type: 'game' | 'document' | 'decodable' }) {
    // Select artifact type
    const artifact = type === 'game' ? GameArtifact 
                   : type === 'document' ? DocumentArtifact 
                   : DecodableArtifact

    // Hook with callbacks
    const { data, status, progress, error, isActive } = useArtifact(artifact, {
        onUpdate: (newData) => {
            console.log('Artifact updated:', newData)
        },
        onComplete: (finalData) => {
            console.log('Artifact complete!', finalData)
            toast.success(`${type} ready!`)
        },
        onError: (error) => {
            console.error('Artifact error:', error)
            toast.error(error)
        },
        onProgress: (progress) => {
            console.log(`Progress: ${Math.round(progress * 100)}%`)
        }
    })

    // Error state
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    // Loading state
    if (!data && !isActive) {
        return <div>No {type} available</div>
    }

    return (
        <div className="artifact-viewer">
            {/* Progress indicator */}
            {isActive && (
                <div className="mb-4">
                    <Progress value={(progress || 0) * 100} />
                    <p className="text-sm text-muted-foreground mt-2">
                        {status} - {Math.round((progress || 0) * 100)}%
                    </p>
                </div>
            )}

            {/* Render based on type */}
            {type === 'game' && data && <GameRenderer game={data} />}
            {type === 'document' && data && <DocumentRenderer document={data} />}
            {type === 'decodable' && data && <DecodableRenderer decodable={data} />}
        </div>
    )
}
```

#### Task 3.3: Update ChatDisplay to Trigger Streams

**File: `src/features/chat/components/ChatDisplay.tsx`** (updated)
```typescript
import { useArtifacts } from '@ai-sdk-tools/artifacts/client'

export function ChatDisplay({ messages, onSendMessage }: ChatDisplayProps) {
    const { current, latest } = useArtifacts({
        onData: (artifactType, data) => {
            console.log(`New ${artifactType} artifact:`, data)
            
            // Auto-activate artifact mode when new artifact arrives
            if (artifactType && onArtifactModeActivate) {
                onArtifactModeActivate()
            }
        }
    })

    const handleArtifactRequest = async (type: ArtifactType, userQuery: string) => {
        // Call streaming endpoint
        await fetch(`/api/artifacts/${type}/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                artifact_type: type,
                user_request: userQuery,
                grade_level: 'K-2'
            })
        })
        // Artifact updates will stream automatically!
    }

    return (
        <div>
            {/* Show artifact chips when detected */}
            <ArtifactTypeChips 
                onSelect={(type) => handleArtifactRequest(type, currentUserQuery)}
            />

            {/* Display current artifact if any */}
            {current && (
                <div className="artifact-preview">
                    <p>Generating {current.type}...</p>
                </div>
            )}
        </div>
    )
}
```

### Phase 4: DevTools & Testing (1-2 hours)

#### Task 4.1: Add DevTools

**File: `frontend/groovie-client/src/app/layout.tsx`** (updated)
```typescript
import { AIDevtools } from '@ai-sdk-tools/devtools'

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                
                {/* Development only */}
                {process.env.NODE_ENV === 'development' && (
                    <AIDevtools 
                        position="bottom-right"
                        theme="dark"
                        maxEvents={100}
                    />
                )}
            </body>
        </html>
    )
}
```

#### Task 4.2: Test Streaming

**Test Plan:**
1. ✅ Request game artifact → See progress 0% → 30% → 70% → 100%
2. ✅ Verify type safety (TypeScript should catch schema mismatches)
3. ✅ Test error handling (trigger backend error → see error state)
4. ✅ Test multiple artifacts (generate game → document → both visible)
5. ✅ Test DevTools (see all events, filter by artifact type)

## Benefits Summary

### Before AI SDK Tools
- ❌ Manual JSON parsing (error-prone)
- ❌ No type safety
- ❌ No progress tracking
- ❌ All-at-once loading
- ❌ Props drilled through components
- ❌ Manual error handling

### After AI SDK Tools
- ✅ Zod schema validation (type-safe end-to-end)
- ✅ Built-in progress tracking (0-100%)
- ✅ Real-time streaming updates
- ✅ Global state (no props)
- ✅ Built-in error states
- ✅ Development debugging tools

## Migration Risks

### Low Risk ✅
- **Backward compatible**: Can migrate incrementally (one artifact type at a time)
- **Production-tested**: Used by Midday in financial applications
- **Same AI SDK version**: We're already on v5
- **No breaking changes**: Store is drop-in replacement for useChat

### Mitigation Strategies
1. **Test in development first** - Use DevTools to debug
2. **Keep old endpoints** - Migrate backend streaming gradually
3. **Fallback handling** - If streaming fails, fall back to static generation
4. **Gradual rollout** - Games → Documents → Decodables

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Setup | 1-2 hours | None |
| 2. Backend | 2-3 hours | Phase 1 |
| 3. Frontend | 3-4 hours | Phase 2 |
| 4. Testing | 1-2 hours | Phase 3 |
| **Total** | **7-11 hours** | Sequential |

## Success Criteria

- [ ] All artifact types (game, document, decodable) stream with progress
- [ ] Type safety enforced by Zod schemas
- [ ] Progress bars show 0% → 100% during generation
- [ ] Error states handled gracefully
- [ ] DevTools shows all artifact events
- [ ] No breaking changes to existing functionality

## Next Steps

**Immediate (if approved):**
1. Install packages
2. Create artifact definitions
3. Update one artifact type (games) as proof-of-concept
4. Test end-to-end
5. Expand to remaining types

**Questions to resolve:**
- Keep FastAPI backend or migrate to Next.js API routes entirely?
- Use Server-Sent Events (SSE) or WebSockets for streaming?
- Store artifacts in database or keep in-memory only?

---

**Recommendation:** PROCEED - This is a high-value, low-risk upgrade that solves multiple pain points with production-ready tooling.
