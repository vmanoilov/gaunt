# Gaunt – Multi-Model Arena System

A high-performance workspace for experimenting with multi-model reasoning, agent cycles, and creative AI systems.

---

## Overview

**Gaunt** is a modular front-end environment for building, testing, and running multi-agent LLM workflows.

### Key Features

* Multi-step reasoning flows with Red/Blue/Purple team agent cycles
* Cross-provider model orchestration (OpenAI, Gemini, Anthropic, Mistral, Qwen, DeepSeek, and more)
* Structured creativity and iterative refinement
* Scoring, evaluation, and metrics tracking
* UI-driven configuration of providers, models, and session parameters
* Local AES-GCM encrypted API key vault
* Session saving, loading, and export (JSON / CSV)

---

## Quick Start

### Prerequisites

* Node 18+
* pnpm (recommended) or npm

### Installation

```bash
pnpm install
pnpm dev
```

App runs at: `http://localhost:5173`

### Production Build

```bash
pnpm build
pnpm preview
```

---

## Architecture

```
src/
  components/        UI panels, dashboards, controls
    admin/           Provider, model, and secrets management
    session/         Arena, participants, metrics, controls
    ui/              Reusable UI kit (shadcn)
  lib/               Providers, encryption, turn engine, helpers
  pages/             Main pages and routes
  types/             TypeScript type definitions
```

**Backend:** None. Everything runs client-side for ease of experimentation.

---

## API Keys

Gaunt stores API keys **encrypted** in your browser using AES-GCM.  
Nothing is transmitted to any server.

To add keys:
1. Open the **Admin Panel**
2. Add provider
3. Paste API key
4. Assign models
5. Configure agent roles

---

## Security

* API keys encrypted and stored **only** on-device
* No data ever leaves your browser
* All sensitive documentation and research notes remain **private** and **local**

---

## Development

This project demonstrates:
* Complex UI building with React + TypeScript + Vite
* Agent-based reasoning tools
* Multi-provider orchestration
* Secure client-side workflows
* Full creative framework design

Some parts were prototyped using AI tools under direct supervision.  
All logic, architecture decisions, integrations, and feature layouts originate with the author.

---

## Documentation

See [`CHANGES.md`](CHANGES.md) for detailed development log and feature history.

---

## Author

**vlad**  
Full-stack / AI experimentation / creative systems engineering
