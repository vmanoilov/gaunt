# Changelog

All notable changes to GauntletFuse will be documented in this file.

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
