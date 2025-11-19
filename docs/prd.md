# GauntletFuse Multi-Agent Creative Exploration Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name
GauntletFuse

### 1.2 Application Description
GauntletFuse is a multi-agent creative exploration platform that enables multiple AI agents (Gemini, Mistral, GPT, etc.) to debate, critique, and integrate ideas through structured 〖Gauntlet〗 rounds. The platform adopts a three-phase循环 mechanism of Red (divergent thinking) → Blue (evaluator) → Purple (integrator), with real-time scoring, replay, and logging capabilities running entirely in the browser.

### 1.3 Technical Architecture
- Frontend Framework: Vite + React + TypeScript (Single Page Application)
- State Management: React Hooks
- Type Validation: TypeScript + Zod
- Future Extension: Migratable to Next.js + Fastify + SQLite full-stack architecture

## 2. Core Features

### 2.1 Agent Management
- Support multiple roles: Human, Red (divergent thinking), Blue (evaluator), Purple (integrator)
- Agent configuration: includes id, name, role, model, provider ID, temperature parameter
- Default session configuration: Gemini = Red, Mistral = Blue, GPT = Purple
- Editable role and model assignment
- **Model filtering mechanism: Participants panel displays only models from providers with valid configured API keys**
- **Team-based model assignment: Support specifying available model lists for Red, Blue, Purple teams separately**

### 2.2 Turn Engine
- Sequential execution of Red → Blue → Purple cycle
- Each agent generates messages and calculates scores
- Scoring dimensions: novelty, feasibility, value impact, safety, exploration index
- Support local heuristic scoring and LLM scoring placeholder

### 2.3 Session Control
- Start/pause/reset session
- Export JSON/CSV format data
- Snapshot and restore functionality
- Session persistence storage

### 2.4 Participants Panel
- Display current session participants
- Edit role and model assignment
- Real-time status display
- **Display only models from providers with valid configured API keys**
- **Support filtering and assigning models by team (Red/Blue/Purple)**
- **NEW: Display team assignment for each model configuration in the table**

### 2.5 Arena
- Chat-style message flow display
- Real-time score display
- Message timestamp tooltips
- Technical details display (API endpoints and request body)

### 2.6 Metrics Panel
- Rolling average calculation
- Data visualization charts
- Multi-dimensional score tracking

### 2.7 Prompt Injector
- Edit seed prompts during session
- Dynamic context adjustment

### 2.8 Replay Panel
- Replay historical rounds
- Re-run with new seeds

### 2.9 Admin Panel
Contains the following tabs:

#### 2.9.1 Provider Management (Providers)
- CRUD operations support for all AI providers
- Preset provider list:
  - OpenAI: https://platform.openai.com/api-keys
  - Google Gemini: https://aistudio.google.com/app/apikey
  - Anthropic: https://console.anthropic.com
  - Mistral: https://console.mistral.ai
  - Cohere: https://dashboard.cohere.com/api-keys
  - OpenRouter: https://openrouter.ai/keys
  - Azure OpenAI: https://portal.azure.com
  - AWS Bedrock: https://console.aws.amazon.com/bedrock
  - Alibaba Qwen: https://bailian.console.aliyun.com
  - Baidu ERNIE: https://console.bce.baidu.com/ai
  - Tencent Hunyuan: https://cloud.tencent.com/product/hunyuan
  - Zhipu GLM: https://open.bigmodel.cn
  - SenseTime SenseNova: https://open.sensetime.com
  - DeepSeek: https://platform.deepseek.com
  - Moonshot: https://platform.moonshot.cn
- Configuration fields: name, base URL, type, API key acquisition link, notes
- **API key validation and model query: After entering API key, provide 〖Query Available Models〗 button to call provider API and retrieve all available models under that key**

#### 2.9.2 Model Management (Models)
- CRUD operations associated with providers
- Model configuration: id, providerId, model, label, temperature, topP, maxTokens, baseUrlOverride
- **Dynamic model list: Models queried from provider API can be directly added to model list**
- **Model selector: Support selecting from queried available model list and batch adding**
- **Team tags: Add optional team tags (Red/Blue/Purple/All) for each model, used for participants panel filtering**
- **NEW: Add 〖Assign Team〗 field in the Add Model Configuration form**
- **NEW: Team field should be a dropdown selector with options dynamically loaded from preset team list**
- **NEW: Display assigned team information in a new column in the model configuration table**

#### 2.9.3 Secrets Management (Secrets)
- AES-GCM local encryption
- Passphrase unlock mechanism
- Key alias management
- No key logging
- **Key validity indicator: Display whether each key has been verified as valid**
- **NEW: Optimize long API key display in table cells with responsive design**
- **NEW: Implement text truncation for long keys with 〖Copy〗 button or 〖View Full Content〗 interaction**
- **NEW: Prevent table cells from being excessively stretched by long content**

#### 2.9.4 Connector Management (Connectors)
- Create/edit custom connector code
- Support Python and JavaScript code blocks
- Mock call functionality
- Code template examples (Python and JS)

#### 2.9.5 Validation (Validate)
- Integrity check
- Detect missing keys
- Validate invalid identifiers
- **API key validity verification: Test whether each provider's API key is available**

#### 2.9.6 Export/Import
- AES encrypted JSON export
- User-provided password protection
- Configuration import functionality

### 2.10 OpenAI Custom GPT Wizard
- Auto-generate startup files:
  - gpt-system-instructions.md
  - actions-openapi.json (mock /turn, /score, /export endpoints)
  - manifest.json
- One-click copy all buttons
- Upload guide text

### 2.11 Data Persistence (NEW)
- **Browser local storage integration**
- **Auto-save all model configurations (including model name, API key, assigned team) to local storage upon submission**
- **Auto-load all saved configuration data from local storage when page refreshes or reopens**
- **Ensure session data persists across browser sessions**

### 2.12 Responsive Layout Optimization (NEW)
- **Implement responsive design for all components (forms, tables)**
- **Tables with long content support horizontal scrolling when screen width is insufficient**
- **Dynamic size and layout adjustment to perfectly adapt to screens from mobile to desktop**
- **Prevent layout breakage caused by long text content**

## 3. Data Models

### 3.1 Core Data Structures
```typescript
Provider {
  id: string
  name: string
  slug: string
  type: 'direct' | 'openrouter' | 'bedrock' | 'azure'
  baseUrl?: string
  models: string[]
  apiKeyAlias: string
  getKeyUrl: string
  notes?: string
  hasValidKey?: boolean  // Indicates whether valid key is configured
}

ModelConfig {
  id: string
  providerId: string
  model: string
  label: string
  temperature?: number
  topP?: number
  maxTokens?: number
  baseUrlOverride?: string
  teamAssignment?: 'red' | 'blue' | 'purple' | 'all'  // NEW: Team assignment tag
}

Secret {
  alias: string
  valueEncrypted: string
  isValid?: boolean  // Key validity indicator
  lastValidated?: string  // Last validation time
}

ConnectorCode {
  id: string
  language: 'python' | 'javascript'
  label: string
  code: string
  lastTestResult?: string
}

Settings {
  defaultProviderId?: string
  telemetry: boolean
  timeoutMs: number
}

ProviderModelsResponse {
  providerId: string
  models: Array<{
    id: string
    name: string
    contextWindow?: number
  }>
}
```

## 4. Security Mechanisms

### 4.1 Encrypted Storage
- AES-GCM passphrase encryption in SPA
- Require password input to unlock keys at startup
- No external key transmission

### 4.2 Migration Markers
- All future server migration points marked with `// FutureServer:` comments

## 5. File Structure

```
/src
  /components
    Arena.tsx
    SessionControl.tsx
    Participants.tsx
    MetricsPanel.tsx
    PromptInjector.tsx
    RoleEditor.tsx
    ReplayPanel.tsx
    AdminPanel.tsx
    ModelQueryDialog.tsx  // Model query dialog
    TeamAssignmentSelector.tsx  // NEW: Team assignment dropdown component
    ResponsiveTable.tsx  // NEW: Responsive table component with long text handling
  /lib
    agents.ts
    turnEngine.ts
    storage.ts
    secrets.ts
    providers.ts
    providerApi.ts  // Provider API call module
    connectors.ts
    export.ts
    csv.ts
    types.ts
    utils.ts
    localStorage.ts  // NEW: Browser local storage utility module
  App.tsx
  main.tsx
  index.css
```

## 6. Design Style

### 6.1 Color Scheme
- Dark minimalist theme
- Role color coding:
  - Red (divergent thinking): #7f1d1d
  - Blue (evaluator): #113c5a
  - Purple (integrator): #4b2b58
  - Human: #2b3a4b

### 6.2 Layout Design
- Grid layout: Participants | Arena | Metrics | Admin
- Card-style component design
- Smooth transition animations (optional Framer Motion)
- **NEW: Fully responsive layout adapting to screen sizes from 320px (mobile) to 1920px+ (desktop)**
- **NEW: Horizontal scrolling for tables on narrow screens**

### 6.3 Interaction Details
- Display score tags for each message
- Timestamp tooltips
- Keyboard navigation support
- Help text at bottom of all pages
- **Model query loading state: Display loading animation when querying provider models**
- **Valid key visual indicator: Use green checkmark icon to mark verified valid keys**
- **NEW: Copy button for truncated long text (API keys)**
- **NEW: Click-to-expand interaction for viewing full content of long text**

## 7. Quality Requirements

### 7.1 Code Standards
- Enforce type safety
- Pure function design (except I/O)
- Defensive error handling
- Module code less than 200 lines
- Strict TypeScript type checking
- **NEW: All code comments, variable names, function names, UI text, and documentation must be in English only**

### 7.2 Maintainability
- Clear separation of presentation/logic/data layers
- Complete type definitions
- Clear migration seam markers
- Detailed code comments

## 8. Deliverables

### 8.1 Documentation
- Architecture overview document
- README.md including:
  - Installation steps: `npm i && npm run dev`
  - Provider management instructions
  - **API key validation and model query workflow**
  - Encryption mechanism explanation
  - Migration plan to Fastify backend + database
  - Real API connection guide
  - **NEW: Browser local storage implementation details**
  - **NEW: Responsive design implementation guide**
- .env.example file (with provider placeholders)
- Checklist for extending to full monorepo
- **NEW: Complete Deployment Blueprint (Markdown document)**

### 8.2 Deployment Blueprint Document (NEW)
A comprehensive Markdown document serving as the application's deployment blueprint, enabling any AI coding assistant to 1:1 replicate the fully functional application. Must include:

#### 8.2.1 Project Overview
- Brief description of core functionality
- Key features summary

#### 8.2.2 Technology Stack
- Explicit list of required technologies (HTML, CSS, JavaScript, React, TypeScript, Vite)
- Dependencies and versions

#### 8.2.3 Complete Source Code
- Full code blocks for all necessary HTML structure, CSS styles, and JavaScript logic
- Organized by file structure
- Copy-paste ready format

#### 8.2.4 Key Logic Annotations
- Detailed comments on critical sections:
  - Local storage operations
  - Responsive layout implementation
  - Team assignment logic
  - Long text truncation mechanism
  - API key validation flow

#### 8.2.5 Deployment Guide
- Clear step-by-step instructions
- How to run the application (e.g., open HTML file in modern browser or run `npm run dev`)
- Environment setup requirements
- Troubleshooting common issues

#### 8.2.6 Language Requirement
- **All text, menus, code, and documentation must be in English only**

### 8.3 Source Code
- All TypeScript source files
- Complete annotations in English
- Total code volume less than 2000 lines

## 9. Acceptance Criteria

✅ Run independently via `npm run dev`
✅ Support Admin Panel CRUD operations (Providers/Models/Secrets/Connectors)
✅ **Query provider available model list after entering API key**
✅ **Participants panel displays only models from providers with valid keys**
✅ **Support team-based (Red/Blue/Purple) model assignment and filtering**
✅ **NEW: Add 〖Assign Team〗 field in model configuration form with dynamic dropdown**
✅ **NEW: Display assigned team in model configuration table**
✅ **NEW: Implement responsive table layout with horizontal scrolling**
✅ **NEW: Long API keys display with truncation and copy/expand functionality**
✅ **NEW: All configuration data persists in browser local storage**
✅ **NEW: Auto-load saved data on page refresh**
✅ Run Gauntlet rounds (Red→Blue→Purple) with scoring
✅ Export JSON/CSV functionality
✅ Support replay, snapshot, encrypted unlock
✅ Generate OpenAI Custom GPT templates
✅ Strict TypeScript, annotated, maintainable, less than 2000 lines
✅ Include migration roadmap
✅ **NEW: Complete Deployment Blueprint document enabling 1:1 replication**
✅ **NEW: All text, menus, code, and documentation in English only**

## 10. Future Extensions

### 10.1 Backend Migration
- Migrate from SPA to Next.js + Fastify + SQLite
- No need to rewrite core logic
- Maintain modular architecture

### 10.2 Feature Enhancements
- LLM scoring integration
- Advanced analytics
- Multi-user collaboration
- Cloud synchronization
- **Intelligent model recommendation: Auto-recommend optimal model combinations based on task type**