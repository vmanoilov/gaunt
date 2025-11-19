# GauntletFuse Architecture

## Overview

GauntletFuse is a Single Page Application (SPA) built with React + TypeScript that runs entirely in the browser. It implements a multi-agent creative exploration system using a Red→Blue→Purple cycle mechanism.

## Core Concepts

### Agent Roles

1. **Red (Divergent Thinker)**
   - Generates creative, unconventional ideas
   - Explores novel approaches
   - Challenges assumptions
   - Temperature: 0.9 (high creativity)

2. **Blue (Evaluator)**
   - Critically assesses proposals
   - Evaluates feasibility and safety
   - Identifies risks and constraints
   - Temperature: 0.5 (balanced)

3. **Purple (Integrator)**
   - Synthesizes Red and Blue perspectives
   - Creates actionable solutions
   - Balances innovation with practicality
   - Temperature: 0.7 (moderate)

### Turn Execution Flow

```
┌─────────────────────────────────────────────┐
│           Start Turn                        │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Red Agent: Generate Creative Ideas         │
│  - Divergent thinking                       │
│  - Novel approaches                         │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Blue Agent: Evaluate Proposals             │
│  - Critical analysis                        │
│  - Feasibility assessment                   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Purple Agent: Synthesize Solutions         │
│  - Integration                              │
│  - Actionable recommendations               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Calculate Scores for All Messages          │
│  - Novelty                                  │
│  - Feasibility                              │
│  - Value Impact                             │
│  - Safety                                   │
│  - Exploration Index                        │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Update Session State                       │
│  - Increment turn counter                   │
│  - Save to localStorage                     │
└─────────────────────────────────────────────┘
```

## System Architecture

### Layer Structure

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                  │
│  (React Components + shadcn/ui)             │
├─────────────────────────────────────────────┤
│         Business Logic Layer                │
│  (Turn Engine, Scoring, Agents)             │
├─────────────────────────────────────────────┤
│         Data Layer                          │
│  (Types, Storage, Encryption)               │
└─────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── SessionControl
│   ├── Start/Pause/Reset buttons
│   └── Export (JSON/CSV)
├── Participants
│   └── Agent cards (Red/Blue/Purple)
├── Arena
│   └── Message flow with scores
├── MetricsPanel
│   └── Score visualizations
├── PromptInjector
│   └── Seed prompt editor
└── AdminPanel
    ├── ProvidersTab
    ├── ModelsTab (placeholder)
    └── SecretsTab (placeholder)
```

## Data Flow

### State Management

```
┌─────────────────────────────────────────────┐
│  App State (React useState)                 │
│  ┌───────────────────────────────────────┐  │
│  │ AppState                              │  │
│  │ ├── providers: Provider[]            │  │
│  │ ├── models: ModelConfig[]            │  │
│  │ ├── secrets: Secret[]                │  │
│  │ ├── connectors: ConnectorCode[]      │  │
│  │ ├── settings: Settings               │  │
│  │ └── sessions: Session[]              │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Current Session (React useState)           │
│  ┌───────────────────────────────────────┐  │
│  │ Session                               │  │
│  │ ├── id: string                        │  │
│  │ ├── seedPrompt: string                │  │
│  │ ├── agents: Agent[]                   │  │
│  │ ├── messages: Message[]               │  │
│  │ ├── currentTurn: number               │  │
│  │ └── status: SessionStatus             │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  localStorage (Persistence)                 │
│  Key: 'gauntletfuse_state'                  │
└─────────────────────────────────────────────┘
```

### Message Scoring

Each message is scored using heuristic algorithms:

```typescript
Score {
  novelty: 0-100        // Uniqueness of ideas
  feasibility: 0-100    // Implementation viability
  valueImpact: 0-100    // Potential benefit
  safety: 0-100         // Risk assessment
  explorationIndex: 0-100 // Combined metric
}
```

**Scoring Algorithm:**
- **Novelty**: Measures unique words compared to previous messages
- **Feasibility**: Keyword analysis for practical terms
- **Value Impact**: Detects value-related keywords and content depth
- **Safety**: Identifies risk-related keywords
- **Exploration Index**: Weighted combination (60% novelty + 40% feasibility)

## Security Architecture

### Encryption Flow

```
┌─────────────────────────────────────────────┐
│  User enters passphrase                     │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  AES-GCM Encryption (crypto-js)             │
│  - Algorithm: AES-256                       │
│  - Mode: GCM (Galois/Counter Mode)          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Encrypted secret stored in localStorage    │
│  Format: { alias, valueEncrypted }          │
└─────────────────────────────────────────────┘
```

**Security Features:**
- ✅ Client-side encryption only
- ✅ No network transmission of secrets
- ✅ Passphrase never stored
- ✅ AES-GCM authenticated encryption
- ✅ No logging of sensitive data

## Provider Integration

### Provider Types

1. **Direct**: Standard REST API (OpenAI, Gemini, Mistral)
2. **OpenRouter**: Unified API gateway
3. **Bedrock**: AWS managed service
4. **Azure**: Microsoft Azure OpenAI

### API Call Flow (Future Implementation)

```
┌─────────────────────────────────────────────┐
│  Turn Engine requests agent response        │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Connector retrieves encrypted API key      │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Decrypt key with passphrase                │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Call provider API with decrypted key       │
│  POST /v1/chat/completions                  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Parse response and create Message          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Calculate score and update session         │
└─────────────────────────────────────────────┘
```

## Migration Path

### Current: Browser-Only SPA

**Advantages:**
- ✅ Zero server costs
- ✅ Instant deployment
- ✅ Complete privacy
- ✅ No backend complexity

**Limitations:**
- ❌ No real API calls (mock responses only)
- ❌ No multi-user support
- ❌ Limited to localStorage capacity
- ❌ No cloud synchronization

### Future: Full-Stack Application

**Target Stack:**
- **Frontend**: Next.js (React + SSR)
- **Backend**: Fastify (Node.js)
- **Database**: SQLite (or PostgreSQL)
- **Auth**: JWT or OAuth2
- **Deployment**: Vercel/Railway/Fly.io

**Migration Steps:**

1. **Phase 1: API Layer**
   - Create Fastify server
   - Implement `/api/turn` endpoint
   - Implement `/api/score` endpoint
   - Add real LLM API calls

2. **Phase 2: Database**
   - Design schema for sessions, messages, agents
   - Migrate from localStorage to SQLite
   - Implement data persistence layer

3. **Phase 3: Authentication**
   - Add user accounts
   - Implement session management
   - Add role-based access control

4. **Phase 4: Advanced Features**
   - Real-time collaboration (WebSockets)
   - Advanced analytics
   - Team workspaces
   - Cloud backup

**Code Markers:**
All future server migration points are marked with:
```typescript
// FutureServer: This will be moved to server-side
```

## Performance Considerations

### Current Optimizations

- **React.memo**: Prevent unnecessary re-renders
- **localStorage**: Efficient state persistence
- **Lazy Loading**: Components loaded on demand
- **Debouncing**: Input handlers debounced

### Future Optimizations

- **Server-Side Rendering**: Faster initial load
- **Caching**: Redis for API responses
- **CDN**: Static asset delivery
- **Database Indexing**: Optimized queries

## Testing Strategy

### Current Testing

- **Type Safety**: TypeScript strict mode
- **Linting**: Biome for code quality
- **Manual Testing**: Browser-based validation

### Future Testing

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright/Cypress
- **E2E Tests**: Full user flow validation
- **Load Tests**: API performance testing

## Deployment

### Current Deployment

```bash
npm i
npm run build
# Deploy dist/ to any static host
```

**Compatible Hosts:**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Future Deployment

```bash
# Frontend
npm run build:frontend

# Backend
npm run build:backend

# Database migrations
npm run migrate

# Start production server
npm run start:prod
```

## Monitoring and Observability

### Current Monitoring

- Browser console logs
- localStorage inspection
- React DevTools

### Future Monitoring

- **Logging**: Winston/Pino
- **Metrics**: Prometheus
- **Tracing**: OpenTelemetry
- **Error Tracking**: Sentry
- **Analytics**: Mixpanel/Amplitude

## Conclusion

GauntletFuse is architected for progressive enhancement:
1. **Current**: Fully functional browser-based SPA
2. **Future**: Scalable full-stack platform

The modular design ensures smooth migration without major rewrites.
