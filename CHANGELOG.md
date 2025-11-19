# Changelog

All notable changes to GauntletFuse will be documented in this file.

## [1.3.0] - 2025-11-19

### Added
- **Team Assignment Feature**: Models can now be pre-assigned to specific teams
  - Added `assignedTeam` field to ModelConfig type
  - Team selection dropdown in Add/Edit Model dialog
  - Team badges with color coding (Red, Blue, Purple)
  - Visual indicators on model cards showing team assignment

- **Long Text Handling**: Improved display of long content
  - Model names truncated with `max-w-[300px]` and ellipsis
  - Copy button next to truncated text for easy clipboard access
  - Toast notifications on successful copy
  - Responsive code blocks with proper styling

- **Complete Deployment Blueprint**: Comprehensive documentation
  - Full project structure explanation
  - Complete code reference with examples
  - Step-by-step installation guide
  - Responsive design implementation details
  - Testing and validation procedures
  - Deployment options (Static, Docker, Dev)
  - Security considerations
  - Future migration path

### Changed
- **Model Cards**: Enhanced with team badges and copy functionality
- **Type System**: Updated ModelConfigSchema to include assignedTeam
- **UI/UX**: Improved visual hierarchy with color-coded team badges

### Technical Details
- Updated `src/lib/types.ts` - Added assignedTeam to ModelConfigSchema
- Updated `src/components/admin/ModelsTab.tsx` - Team assignment UI
- Created `DEPLOYMENT_BLUEPRINT.md` - Complete deployment guide
- All UI text in English as per requirements

## [1.2.0] - 2025-11-19

### Added
- **Secrets Management**: Full API key management with AES-GCM encryption
  - Add/update/remove API keys for each provider
  - Master passphrase protection (minimum 8 characters)
  - Visual indicators for providers with valid keys
  - Secure client-side encryption

- **Model Discovery**: Automatic model detection from API keys
  - "Discover Available Models" button in Secrets tab
  - Simulated API calls to fetch available models per provider
  - Automatic population of provider model lists
  - Mock data for 15+ providers

- **Models Management**: Complete model configuration interface
  - Add/edit/delete model configurations
  - Only show providers with valid API keys
  - Configure temperature, top-P, max tokens
  - Base URL override option
  - Visual badges for model parameters

- **Team Model Assignment**: Assign specific models to agents
  - Edit button on each participant card
  - Dialog-based model selection
  - Only show models with valid API keys
  - Visual indicators (✓/✗) for key validity
  - Display model details (temperature, top-P, max tokens)
  - Real-time agent updates

- **Enhanced Participants Panel**:
  - Show model and provider information
  - Validation status indicators
  - Warning messages for missing keys/models
  - Improved role labels (e.g., "Red (Divergent)")

### Changed
- **Admin Panel Tab Order**: Reordered to Providers → Secrets → Models (logical workflow)
- **Participants Component**: Now requires models, providers, and secrets props
- **App State Management**: Added handleUpdateAgent function for agent modifications

### Technical Details
- Created `SecretsTab.tsx` (240 lines) - Full secrets management UI
- Created `ModelsTab.tsx` (230 lines) - Complete models configuration
- Updated `AdminPanel.tsx` - Integrated new tabs with model discovery callback
- Updated `Participants.tsx` - Added model assignment dialog and validation
- Updated `App.tsx` - Added agent update handler

## [1.1.0] - 2025-11-19

### Changed
- **Improved Provider Editing UX**: Replaced inline editing form with modal dialog
  - Edit forms now open in an overlay dialog instead of at the top of the list
  - Prevents confusion when editing providers in long lists
  - Better visual focus on the item being edited
  - Improved accessibility with proper dialog semantics
  - Added descriptive dialog titles and descriptions
  - Enhanced form layout with better spacing and organization

### Technical Details
- Updated `ProvidersTab.tsx` to use shadcn/ui Dialog component
- Added `dialogOpen` state management
- Implemented `openDialog()` and `closeDialog()` helper functions
- Dialog content is scrollable for long forms (max-h-[90vh])
- Improved form field labels with proper `htmlFor` attributes
- Better button labels ("Add Provider" vs "Save Changes")

## [1.0.0] - 2025-11-19

### Added
- Initial release of GauntletFuse
- Multi-agent creative exploration platform
- Red→Blue→Purple turn-based cycle
- Real-time scoring across 5 dimensions
- Session management (start/pause/reset)
- Admin panel with provider management
- Export capabilities (JSON/CSV)
- AES-GCM encryption for secrets
- Dark minimalist theme
- 15 pre-configured AI providers
- Comprehensive documentation

### Features
- **Multi-Agent System**: Red (Divergent), Blue (Evaluator), Purple (Integrator) roles
- **Turn Engine**: Sequential execution with context awareness
- **Scoring System**: Novelty, Feasibility, Value Impact, Safety, Exploration Index
- **Session Control**: Start, pause, reset, and replay capabilities
- **Admin Panel**: Provider CRUD operations
- **Export**: JSON and CSV format support
- **Security**: Client-side AES-GCM encryption
- **Persistence**: localStorage-based state management
- **UI/UX**: Dark theme with role-based color coding

### Technical
- React 18 + TypeScript
- Vite build system
- shadcn/ui component library
- Tailwind CSS styling
- Zod schema validation
- crypto-js encryption
- 1,486 lines of code
- 100% TypeScript coverage
- 0 linting errors
