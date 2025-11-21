# **Gaunt – Multi-Agent Creative Orchestration Engine**

*A high-performance workspace for experimenting with multi-model reasoning, agent cycles, and creative AI systems.*

---

## 🚀 Overview

**Gaunt** is a modular front-end environment for building, testing, and running multi-agent LLM workflows.

It provides a clean, modern interface for experimenting with:

* multi-step reasoning flows
* Red/Blue/Purple team agent cycles
* structured creativity
* cross-provider model orchestration
* scoring, evaluation, and iterative refinement
* UI-driven configuration of providers, models, and session parameters

This repo contains the **full working front-end**: React + Vite + TypeScript + shadcn/ui + Tailwind.
All sensitive logic, internal documentation, research notes, and private MD files remain **local-only and intentionally excluded**.

---

## 🎯 Philosophy

Gaunt is built on a simple premise:

> *Useful AI systems aren’t just a single model — they’re coordinated teams.*

This workspace lets you prototype those teams, stress-test ideas, and push models into productive conflict and collaboration.

---

## ✨ Features

### **Core**

* 🔺 Red → Blue → Purple agent cycle engine
* 🧠 Works with **OpenAI, Gemini, Anthropic, Mistral, Qwen, DeepSeek**, and others
* ⚙️ Provider & model configuration panel
* 🔐 Local AES-GCM encrypted API key vault
* 📊 Built-in scoring dimensions (Novelty, Feasibility, Value, Safety, Exploration)
* 💾 Session saving, loading, and export (JSON / CSV)

### **UI / Dev**

* ⚡ Vite dev server
* 🧩 shadcn/ui + Tailwind components
* 🛡 Zod-based runtime validation
* 🧱 Clear, modular file structure for extending agents, adding providers, or building new cycles

---

## 🧬 Architecture Snapshot

This repo includes:

```
src/
  agents/            agent cycle logic
  components/        UI panels, dashboards, controls
  lib/               providers, encryption, helpers
  screens/           main screen + admin console
  state/             localStorage persistence
  ui/                reusable UI kit (shadcn)
```

**Backend:** none.
Everything runs client-side for ease of experimentation.

---

## 🔧 Installation & Setup

### **Prerequisites**

* Node 18+
* pnpm (recommended) or npm

### **Install Dependencies**

```
pnpm install
```

### **Start Development Server**

```
pnpm dev
```

App runs at:

```
http://localhost:5173
```

### **Production Build**

```
pnpm build
pnpm preview
```

---

## 🔑 API Keys

Gaunt stores API keys **encrypted** in your browser using AES-GCM.
Nothing is transmitted to any server.
You control which providers and models are active.

To add keys:

1. Open the **Admin Panel**
2. Add provider
3. Paste API key
4. Assign models
5. Configure agent roles

---

## 📦 Cloning & Working With the Repo

Anyone can clone and run this project:

```
git clone https://github.com/<your-username>/gaunt.git
cd gaunt
pnpm install
pnpm dev
```

The codebase is structured for extension:

* add your own agents
* add new model providers
* modify the scoring system
* re-theme the UI
* integrate new cycles or workflows

The repo intentionally excludes all sensitive documentation and research notes (Markdown files are ignored).

---

## 🛡️ Security Notes

This repository intentionally excludes:

* internal architecture documents
* private research
* experimental MD files
* configuration notes
* any content not intended for public view

All such files remain **private**, **local**, and **untracked** by design.

API keys are encrypted and stored **only** on-device.

No data ever leaves your browser.

---

## 👤 Author

**vlad**
Full-stack / AI experimentation / creative systems engineering

This project demonstrates:

* complex UI building
* agent-based reasoning tools
* multi-provider orchestration
* secure client-side workflows
* ability to design full creative frameworks end-to-end

---

## 🤖 AI Collaboration

Some parts of this system were prototyped using AI tools under direct supervision (ChatGPT, Claude, GitHub Copilot, Qwen).
All logic, architecture decisions, integrations, guards, and feature layouts originate with the author.

---


