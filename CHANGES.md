# CHANGES.md

Development log for Gaunt multi-model Arena system.

---

## 2025-11-22 - Major Refactor & Fixes

### Markdown Consolidation ✅
- Consolidated 5 markdown files into 2 (README.md + CHANGES.md)
- Removed: CHANGELOG.md, FEATURES.md, QUICK_START.md, FEATURE_WALKTHROUGH.md
- README.md now contains high-level overview only
- CHANGES.md contains detailed development log
- **Commit:** `docs: consolidate markdown files into README.md and CHANGES.md`

### Architecture Changes ✅

#### Admin Panel Separation
- Created dedicated `/admin` route using React Router
- Moved all provider/model/API key configuration to separate admin page
- Admin panel now isolated from main Arena UI
- Added navigation between Arena and Admin with buttons
- **Files Changed:**
  - Created [`src/pages/AdminPage.tsx`](src/pages/AdminPage.tsx:1)
  - Created [`src/pages/ArenaPage.tsx`](src/pages/ArenaPage.tsx:1)
  - Modified [`src/App.tsx`](src/App.tsx:1) to use BrowserRouter
- **Commit:** `feat: separate admin panel into dedicated /admin route`

#### Turn Engine Improvements
- Implemented immediate message visibility - messages appear as they're generated
- Added full context awareness - each agent sees all previous messages including current turn
- Refactored [`executeTurn()`](src/lib/turnEngine.ts:10) to accept `onMessageGenerated` callback
- Added [`executeAgentTurn()`](src/lib/turnEngine.ts:139) for manual per-agent execution
- Documented turn orchestration logic with comprehensive comments
- **Files Changed:**
  - Modified [`src/lib/turnEngine.ts`](src/lib/turnEngine.ts:1)

#### Automatic Round-Robin Mode
- Implemented continuous auto-run mode with Run/Pause/Stop controls
- Added `isAutoRunning` state with ref to prevent stale closures
- Auto-run executes turns continuously until paused or stopped
- 1-second delay between turns for readability
- Messages appear immediately during execution (no need to wait for Pause)
- **Files Changed:**
  - Modified [`src/pages/ArenaPage.tsx`](src/pages/ArenaPage.tsx:1)
  - Modified [`src/components/session/SessionControl.tsx`](src/components/session/SessionControl.tsx:1)

#### Hot-Swapping Support
- Agents can be updated mid-conversation without breaking the session
- Added `onAddAgent` and `onRemoveAgent` handlers in ArenaPage
- Model assignments update immediately with toast notifications
- Context preserved when swapping models
- **Files Changed:**
  - Modified [`src/pages/ArenaPage.tsx`](src/pages/ArenaPage.tsx:1)

#### Color Semantics Implementation
- **RED = Attacker** - Challenges assumptions, pushes boundaries, adversarial thinking
- **BLUE = Defender** - Establishes constraints, defends feasibility, stabilizes
- **PURPLE = Integrator** - Mediates between attack/defense, synthesizes, brings sanity
- Updated role labels in Arena, Participants, and turn engine
- Mock responses now reflect new semantics with appropriate language
- **Files Changed:**
  - Modified [`src/components/session/Arena.tsx`](src/components/session/Arena.tsx:19)
  - Modified [`src/components/session/Participants.tsx`](src/components/session/Participants.tsx:26)
  - Modified [`src/lib/turnEngine.ts`](src/lib/turnEngine.ts:73)
- **Commit:** `feat: implement auto-run mode, immediate message visibility, context awareness, and color semantics`

### Technical Debt Addressed ✅
- Fixed async/state issues using `useRef` for auto-run state
- Eliminated potential double-turns with proper state management
- Messages now build on previous context (no more isolated responses)
- Turn scheduler properly documented with inline comments
- State updates happen immediately as messages are generated

### Dependencies Added
- `react-router-dom` - For routing between Arena and Admin pages

---

## Summary of Changes

### ✅ Completed Features

1. **Markdown Consolidation**
   - Reduced from 5 markdown files to 2 (README.md + CHANGES.md)
   - Clean, maintainable documentation structure

2. **Admin Panel Separation**
   - Dedicated `/admin` route with full isolation
   - Clean navigation between Arena and Admin
   - All provider/model/key configuration moved out of main UI

3. **Turn Engine Improvements**
   - Immediate message visibility (no waiting for Pause)
   - Full context awareness (agents see all previous messages)
   - Proper async handling with no race conditions

4. **Automatic Round-Robin Mode**
   - Continuous auto-run with Run/Pause/Stop controls
   - 1-second delay between turns for readability
   - Clean state management with useRef to prevent stale closures

5. **Hot-Swapping Support**
   - Models can be changed mid-conversation
   - Context preserved across swaps
   - Immediate updates with toast notifications

6. **Color Semantics**
   - RED = Attacker (challenges, pushes boundaries)
   - BLUE = Defender (establishes constraints, stabilizes)
   - PURPLE = Integrator (mediates, synthesizes, brings sanity)
   - Consistent across all UI components and mock responses

7. **API Key Persistence**
   - Already working via localStorage
   - Encrypted with AES-GCM
   - Survives page reloads

### 🎯 Key Improvements

- **No more phantom turns** - Proper state management eliminates double/missed turns
- **Real-time updates** - Messages appear immediately as generated
- **Context-aware responses** - Each agent builds on previous messages
- **Clean architecture** - Separated concerns with dedicated routes
- **Better UX** - Clear controls, immediate feedback, hot-swapping

### 📝 Files Modified

- [`README.md`](README.md:1) - Concise overview
- [`CHANGES.md`](CHANGES.md:1) - Detailed development log
- [`src/App.tsx`](src/App.tsx:1) - Router setup
- [`src/pages/ArenaPage.tsx`](src/pages/ArenaPage.tsx:1) - Main arena with auto-run
- [`src/pages/AdminPage.tsx`](src/pages/AdminPage.tsx:1) - Isolated admin panel
- [`src/lib/turnEngine.ts`](src/lib/turnEngine.ts:1) - Context-aware turn execution
- [`src/components/session/Arena.tsx`](src/components/session/Arena.tsx:1) - Updated color semantics
- [`src/components/session/SessionControl.tsx`](src/components/session/SessionControl.tsx:1) - Run/Pause/Stop controls
- [`src/components/session/Participants.tsx`](src/components/session/Participants.tsx:1) - Updated role labels

### 🚀 Ready for Use

The application is now fully functional with:
- Clean separation of concerns
- Proper turn orchestration
- Immediate message visibility
- Context-aware agents
- Hot-swapping capability
- Stable color semantics
- Persistent API keys

Run `npm run dev` and navigate to `http://localhost:5173` to start using the Arena!

---

## Previous History (from CHANGELOG.md)

### [1.3.0] - 2025-11-19
**Added:**
- Team Assignment Feature with `assignedTeam` field
- Long text handling with truncation and copy buttons
- Complete deployment blueprint documentation

**Changed:**
- Model cards enhanced with team badges
- Type system updated for team assignments
- UI/UX improvements with color-coded badges

### [1.2.0] - 2025-11-19
**Added:**
- Secrets Management with AES-GCM encryption
- Model Discovery from API keys
- Models Management interface
- Team Model Assignment
- Enhanced Participants Panel

**Changed:**
- Admin Panel tab order: Providers → Secrets → Models
- Participants component with validation

### [1.1.0] - 2025-11-19
**Changed:**
- Improved Provider Editing UX with modal dialogs
- Better visual focus and accessibility

### [1.0.0] - 2025-11-19
**Initial Release:**
- Multi-agent creative exploration platform
- Red→Blue→Purple turn-based cycle
- Real-time scoring across 5 dimensions
- Session management
- Admin panel with provider management
- Export capabilities (JSON/CSV)
- AES-GCM encryption for secrets
- Dark minimalist theme
- 15 pre-configured AI providers
