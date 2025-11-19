# GauntletFuse

**Multi-Agent Creative Exploration Platform**

GauntletFuse is a browser-based platform that enables multiple AI agents (Gemini, Mistral, GPT, etc.) to engage in structured debate, critique, and creative synthesis through a Red→Blue→Purple cycle mechanism.

## Overview

GauntletFuse implements a unique "Gauntlet" turn-based system where:
- **Red Agents** (Divergent Thinkers) generate creative, unconventional ideas
- **Blue Agents** (Evaluators) critically assess proposals for feasibility and safety
- **Purple Agents** (Integrators) synthesize insights into actionable solutions

Each turn generates real-time scores across five dimensions:
- Novelty
- Feasibility
- Value Impact
- Safety
- Exploration Index

## Features

✅ **Multi-Provider Support**: Configure OpenAI, Google Gemini, Anthropic, Mistral, and 10+ other AI providers
✅ **Secure Secrets Management**: AES-GCM encrypted API key storage with passphrase protection
✅ **Session Control**: Start, pause, reset, and replay Gauntlet sessions
✅ **Real-time Metrics**: Track performance across multiple scoring dimensions
✅ **Export Capabilities**: Download session data as JSON or CSV
✅ **Dark Theme**: Minimalist dark interface with role-based color coding
✅ **Fully Client-Side**: Runs entirely in the browser with localStorage persistence

## Installation

```bash
npm i && npm run dev
```

The application will start in development mode. Open your browser to view the platform.

## Quick Start

### 1. Configure Providers

Navigate to the **Admin Panel** → **Providers** tab to:
- View pre-configured AI providers (OpenAI, Gemini, Mistral, etc.)
- Click **Add Provider** to create a new provider (opens in a dialog)
- Click **Edit** icon on any provider to modify its configuration (opens in a dialog)
- Click **Delete** icon to remove a provider
- All editing happens in a modal dialog for better focus and clarity
- Get API keys from provider links

### 2. Add API Keys

In **Admin Panel** → **Secrets** tab:
1. Set a **master passphrase** (minimum 8 characters) - this encrypts all your API keys
2. For each provider you want to use:
   - Click **Add Key** button
   - Enter your API key (get it from the provider's website)
   - Click **Discover Available Models** to automatically fetch available models
   - Click **Save API Key** to encrypt and store it
3. Keys are stored locally using AES-GCM encryption
4. Visual indicators show which providers have valid keys (✓ = has key, ✗ = no key)

### 3. Configure Models

In **Admin Panel** → **Models** tab:
1. Click **Add Model** (only available if you have API keys configured)
2. Select a provider (only shows providers with valid API keys)
3. Select a model from the discovered models list
4. Set a display label (e.g., "GPT-4 Turbo")
5. Configure parameters:
   - **Temperature**: 0-2 (higher = more creative)
   - **Top-P**: 0-1 (nucleus sampling)
   - **Max Tokens**: Maximum response length
6. Optionally override the base URL
7. Click **Add Model** to save

### 4. Assign Models to Agents

In the **Participants** panel:
1. Click the **Edit** icon on any agent (Red, Blue, or Purple)
2. Select a model from the dropdown (only shows models with valid API keys)
3. View model details (temperature, top-P, max tokens)
4. Click **Assign Model** to update the agent
5. Visual indicators show:
   - ✓ Green checkmark = valid API key
   - ✗ Red X = no valid API key
   - ⚠ Yellow warning = no model assigned

### 5. Start a Session

1. Ensure all three agents (Red, Blue, Purple) have models assigned
2. Click **Start** in the Session Control panel
3. The platform will execute a Red→Blue→Purple turn cycle
4. View messages in the Arena with real-time scores
5. Monitor metrics in the Metrics Panel
6. Adjust the seed prompt using the Prompt Injector

### 6. Export Results

Use the **Export** buttons to download:
- **JSON**: Complete session data with metadata
- **CSV**: Tabular format for analysis

## Architecture

### Technology Stack

- **Frontend**: Vite + React + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks
- **Validation**: Zod schemas
- **Encryption**: crypto-js (AES-GCM)
- **Storage**: localStorage

### File Structure

```
/src
  /lib
    types.ts          # Core type definitions and Zod schemas
    utils.ts          # Utility functions
    secrets.ts        # AES-GCM encryption/decryption
    storage.ts        # localStorage persistence
    providers.ts      # Default provider configurations
    connectors.ts     # API connector templates
    scoring.ts        # Heuristic scoring algorithms
    turnEngine.ts     # Red→Blue→Purple execution engine
    export.ts         # JSON/CSV export utilities
  /components
    /admin
      AdminPanel.tsx      # Main admin interface
      ProvidersTab.tsx    # Provider CRUD
    /session
      SessionControl.tsx  # Start/pause/reset controls
      Arena.tsx           # Message flow display
      MetricsPanel.tsx    # Score visualization
      Participants.tsx    # Agent roster
      PromptInjector.tsx  # Seed prompt editor
  App.tsx             # Main application
  main.tsx            # Entry point
  index.css           # Theme and styles
```

## Security

### Encryption Mechanism

- **Algorithm**: AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Derivation**: User-provided passphrase
- **Storage**: Encrypted secrets stored in localStorage
- **Unlock**: Passphrase required on startup to decrypt secrets

### Best Practices

- Use strong passphrases (minimum 8 characters)
- Never log or expose API keys in console
- Secrets are never transmitted over network
- All encryption happens client-side

## Migration Roadmap

GauntletFuse is designed for future migration to a full-stack architecture:

### Current: SPA (Single Page Application)
- ✅ Runs entirely in browser
- ✅ localStorage for persistence
- ✅ Client-side encryption

### Future: Full-Stack (Next.js + Fastify + SQLite)
- 🔄 Server-side API orchestration
- 🔄 Database persistence (SQLite)
- 🔄 Real LLM API integration
- 🔄 Multi-user support
- 🔄 Cloud synchronization

All future migration points are marked with `// FutureServer:` comments in the codebase.

## Extending GauntletFuse

### Adding New Providers

1. Navigate to Admin Panel → Providers
2. Click "Add Provider"
3. Fill in:
   - Name and slug
   - Type (direct, openrouter, bedrock, azure)
   - Base URL
   - API key alias
   - Get key URL

### Creating Custom Connectors

1. Go to Admin Panel → Connectors
2. Choose Python or JavaScript
3. Implement the `callModel` function
4. Test with mock data

### Customizing Scoring

Edit `/src/lib/scoring.ts` to modify:
- `calculateNovelty()`: Measure idea uniqueness
- `calculateFeasibility()`: Assess implementation viability
- `calculateValueImpact()`: Evaluate potential benefit
- `calculateSafety()`: Check for risks
- `calculateExplorationIndex()`: Combine metrics

## OpenAI Custom GPT Integration

GauntletFuse can generate configuration files for OpenAI Custom GPTs:

1. Navigate to Admin Panel → GPT Wizard
2. Click "Generate Files"
3. Copy the generated:
   - `gpt-system-instructions.md`
   - `actions-openapi.json`
   - `manifest.json`
4. Upload to OpenAI GPT Builder

## Troubleshooting

### Secrets Won't Decrypt
- Verify passphrase is correct
- Check browser console for errors
- Clear localStorage and re-enter secrets

### Turn Execution Fails
- Ensure all three roles (Red, Blue, Purple) have assigned agents
- Verify model configurations are complete
- Check that providers have valid API keys

### Export Not Working
- Check browser's download permissions
- Verify session has messages to export
- Try different export format (JSON vs CSV)

## Contributing

GauntletFuse is designed for extensibility. Key areas for contribution:
- Additional AI provider integrations
- Enhanced scoring algorithms
- Advanced visualization components
- Real-time collaboration features

## License

This project is provided as-is for creative exploration and research purposes.

## Support

For issues, questions, or feature requests, please refer to the project documentation or contact the development team.

---

**Built with ⚡ by the GauntletFuse Team**
