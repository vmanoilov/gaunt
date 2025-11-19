# GauntletFuse - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Installation (30 seconds)

```bash
npm i && npm run dev
```

The application will start and open in your browser automatically.

### Step 2: Start Your First Session (1 minute)

1. **Click the "Start" button** in the Session Control panel (left side)
2. Watch as the platform executes a Red→Blue→Purple turn cycle
3. View the generated messages in the Arena (center panel)
4. Check the real-time scores for each message

**That's it!** You've just run your first Gauntlet session.

### Step 3: Explore Features (1 minute)

#### View Metrics
- Look at the **Metrics Panel** (left side, below Session Control)
- See scores across 5 dimensions: Novelty, Feasibility, Value Impact, Safety, Exploration

#### Edit the Seed Prompt
- Find the **Prompt Injector** (right side)
- Change the seed prompt to explore different topics
- Click "Update Prompt"
- Click "Start" again to run a new turn with your prompt

#### Export Results
- Click **JSON** or **CSV** in the Session Control panel
- Download your session data for analysis

## 🎯 Understanding the Interface

### Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GauntletFuse                         │
│           Multi-Agent Creative Exploration              │
├──────────────┬──────────────────────┬───────────────────┤
│              │                      │                   │
│  Session     │      Arena           │  Prompt Injector  │
│  Control     │   (Message Flow)     │                   │
│              │                      │  Admin Panel      │
│  Participants│                      │  - Providers      │
│              │                      │  - Models         │
│  Metrics     │                      │  - Secrets        │
│              │                      │                   │
└──────────────┴──────────────────────┴───────────────────┘
```

### Color Coding

- 🔴 **Red** (Dark Red Background) - Divergent Thinker
- 🔵 **Blue** (Dark Blue Background) - Evaluator
- 🟣 **Purple** (Dark Purple Background) - Integrator
- ⚫ **Human** (Dark Gray Background) - Human input

## 🔧 Common Tasks

### Change the Seed Prompt

1. Scroll to **Prompt Injector** (right panel)
2. Edit the text in the textarea
3. Click **Update Prompt**
4. Click **Start** to run a new turn

### Pause and Resume

- Click **Pause** to stop turn execution
- Click **Start** to resume from where you left off

### Reset Session

- Click **Reset** to clear all messages and start fresh
- Your configuration (agents, providers) will be preserved

### Export Session Data

**JSON Export:**
- Click **JSON** button
- Downloads: `session-{id}.json`
- Contains: Complete session data with metadata

**CSV Export:**
- Click **CSV** button
- Downloads: `session-{id}.csv`
- Contains: Tabular data for spreadsheet analysis

### Add a New Provider

1. Go to **Admin Panel** → **Providers** tab
2. Click **Add Provider**
3. Fill in:
   - Name (e.g., "My Custom AI")
   - Slug (e.g., "my-custom-ai")
   - Type (Direct/OpenRouter/Bedrock/Azure)
   - Base URL (API endpoint)
   - API Key Alias (e.g., "MY_API_KEY")
   - Get Key URL (documentation link)
4. Click **Save**

## 💡 Tips & Tricks

### Best Practices

1. **Start Simple**: Use the default seed prompt first to understand the flow
2. **Observe Patterns**: Watch how Red, Blue, and Purple agents interact
3. **Iterate**: Run multiple turns to see how ideas evolve
4. **Export Often**: Save interesting sessions for later analysis

### Understanding Scores

- **Novelty (0-100)**: How unique and creative the idea is
- **Feasibility (0-100)**: How practical and implementable
- **Value Impact (0-100)**: Potential benefit and significance
- **Safety (0-100)**: Risk assessment and safety considerations
- **Exploration Index (0-100)**: Combined metric (60% novelty + 40% feasibility)

### Seed Prompt Ideas

Try these prompts to explore different domains:

**Technology:**
- "Design a next-generation user interface for AI assistants"
- "Propose solutions for reducing data center energy consumption"

**Business:**
- "Develop strategies for sustainable e-commerce growth"
- "Create innovative customer retention programs"

**Social:**
- "Design community-driven solutions for urban food security"
- "Propose frameworks for digital literacy education"

**Creative:**
- "Reimagine traditional storytelling for the metaverse"
- "Design immersive art experiences using emerging technologies"

## 🔐 Security Notes

### Current Implementation (SPA)

- ✅ All data stored locally in your browser
- ✅ No data sent to external servers
- ✅ Encryption ready for API keys (AES-GCM)
- ✅ Complete privacy

### Future Implementation (Full-Stack)

When migrated to a full-stack architecture:
- API keys will be encrypted server-side
- Real LLM API calls will be made
- Multi-user authentication will be added

## 🐛 Troubleshooting

### Application Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm i
npm run dev
```

### Session Not Persisting

- Check browser localStorage is enabled
- Try a different browser
- Clear localStorage and start fresh:
  ```javascript
  // In browser console
  localStorage.clear()
  location.reload()
  ```

### Scores Not Updating

- Ensure messages are being generated
- Check browser console for errors
- Try resetting the session

### Export Not Working

- Check browser download permissions
- Try a different browser
- Verify session has messages to export

## 📚 Next Steps

### Learn More

- Read **README.md** for comprehensive documentation
- Check **ARCHITECTURE.md** for technical details
- Review **PROJECT_SUMMARY.md** for implementation overview

### Customize

- Modify scoring algorithms in `/src/lib/scoring.ts`
- Add new providers in Admin Panel
- Customize theme colors in `/src/index.css`

### Extend

- Add real API integration (see ARCHITECTURE.md)
- Implement additional export formats
- Create custom agent roles
- Build advanced analytics

## 🎉 You're Ready!

You now know how to:
- ✅ Start and control sessions
- ✅ View and interpret scores
- ✅ Edit seed prompts
- ✅ Export session data
- ✅ Manage providers

**Happy exploring with GauntletFuse!** 🚀

---

**Need Help?** Check the full documentation in README.md or ARCHITECTURE.md
