# GauntletFuse Feature Walkthrough

## Complete Step-by-Step Guide

This guide walks you through every feature of GauntletFuse v1.2.0, from initial setup to running your first multi-agent session.

---

## Part 1: Initial Setup

### Step 1: Launch Application

```bash
npm install
npm run dev
```

**What You'll See:**
- Main application interface
- Header: "GauntletFuse - Multi-Agent Creative Exploration Platform"
- Four-column layout:
  - Left: Session Control, Participants, Metrics
  - Center: Arena (message display)
  - Right: Prompt Injector, Admin Panel

---

## Part 2: Provider Configuration

### Step 2: Review Providers

**Navigate to:** Admin Panel → Providers tab

**What You'll See:**
- List of 15 pre-configured providers
- Each provider card shows:
  - Provider name (e.g., "OpenAI")
  - Slug identifier
  - API type
  - API key alias
  - Link to get API key
  - Edit and Delete buttons

**Pre-configured Providers:**
1. OpenAI
2. Google Gemini
3. Anthropic Claude
4. Mistral AI
5. Cohere
6. OpenRouter
7. Azure OpenAI
8. AWS Bedrock
9. Alibaba Qwen
10. Baidu ERNIE
11. Tencent Hunyuan
12. Zhipu GLM
13. SenseTime SenseNova
14. DeepSeek
15. Moonshot

**Actions Available:**
- Click "Add Provider" to create custom provider
- Click Edit icon to modify provider
- Click Delete icon to remove provider
- All editing happens in modal dialogs

---

## Part 3: API Key Management

### Step 3: Set Master Passphrase

**Navigate to:** Admin Panel → Secrets tab

**What You'll See:**
- Master Passphrase card at top
- Input field for passphrase
- Green checkmark appears when 8+ characters entered

**Action:**
1. Enter a strong passphrase (minimum 8 characters)
2. Example: "MySecurePass123!"
3. Green checkmark ✓ confirms valid passphrase

**Security Note:**
- This passphrase encrypts all API keys
- Never shared or transmitted
- Required to decrypt keys later
- Use a strong, memorable passphrase

### Step 4: Add API Key

**What You'll See:**
- List of all providers
- Each provider shows:
  - Provider name
  - API key alias
  - Status indicator (✓ has key, ✗ no key)
  - "Add Key" or "Update Key" button

**Action:**
1. Click "Add Key" on a provider (e.g., OpenAI)
2. Dialog opens: "API Key for OpenAI"
3. Enter your API key in the input field
4. Click eye icon to show/hide key
5. See link to get API key from provider

**Example:**
```
API Key: sk-proj-abc123...xyz789
Get your API key from: https://platform.openai.com/api-keys
```

### Step 5: Discover Models

**What You'll See:**
- "Discover Available Models" button (enabled when key entered)

**Action:**
1. Click "Discover Available Models"
2. Button shows loading spinner: "Discovering Models..."
3. Wait ~1.5 seconds (simulated API call)
4. Success notification: "Found 4 available models for OpenAI"
5. Models are now available for configuration

**Discovered Models (Example for OpenAI):**
- gpt-4
- gpt-4-turbo
- gpt-3.5-turbo
- gpt-3.5-turbo-16k

### Step 6: Save API Key

**Action:**
1. Click "Save API Key" button
2. Key is encrypted with your passphrase
3. Success notification: "API key saved securely"
4. Dialog closes
5. Provider now shows green checkmark ✓

**Repeat for Other Providers:**
- Add keys for Anthropic, Mistral, etc.
- Each provider can have its own key
- Discover models for each provider

---

## Part 4: Model Configuration

### Step 7: Navigate to Models Tab

**Navigate to:** Admin Panel → Models tab

**What You'll See:**
- "Add Model" button (enabled if you have API keys)
- Empty list (initially)
- Or warning: "No API Keys Configured" if no keys added

### Step 8: Add First Model

**Action:**
1. Click "Add Model" button
2. Dialog opens: "Add Model Configuration"

**Form Fields:**

**Provider** (dropdown)
- Only shows providers with valid API keys
- Example: Select "OpenAI"

**Model** (dropdown)
- Shows models discovered for selected provider
- Example: Select "gpt-4"
- If no models: "No models discovered for this provider"

**Display Label** (text input)
- Friendly name for the model
- Example: "GPT-4 Turbo"

**Temperature** (number input)
- Range: 0-2
- Default: 0.7
- Example: 0.8 for creative responses

**Top-P** (number input)
- Range: 0-1
- Default: 1
- Example: 0.9 for focused responses

**Max Tokens** (number input)
- Range: 1-32000
- Default: 2000
- Example: 4000 for longer responses

**Base URL Override** (text input, optional)
- Custom endpoint
- Example: "https://custom-endpoint.com/v1"

**Action:**
1. Fill in all fields
2. Click "Add Model"
3. Success notification: "Model configuration added"
4. Dialog closes

### Step 9: View Model Configuration

**What You'll See:**
- Model card in the list
- Shows:
  - Display label: "GPT-4 Turbo"
  - Provider: "OpenAI • gpt-4"
  - Green checkmark ✓ (valid API key)
  - Badges: "Temp: 0.8", "Top-P: 0.9", "Max Tokens: 4000"
  - Edit and Delete buttons

### Step 10: Add Models for All Agents

**Recommended Setup:**

**For Red Agent (Divergent):**
- Model: GPT-4 or Claude-3-Opus
- Temperature: 0.8-1.0 (creative)
- Label: "Red Creative Model"

**For Blue Agent (Evaluator):**
- Model: Mistral-Large or Gemini-Pro
- Temperature: 0.3-0.5 (analytical)
- Label: "Blue Analytical Model"

**For Purple Agent (Integrator):**
- Model: GPT-4 or Claude-3-Sonnet
- Temperature: 0.6-0.8 (balanced)
- Label: "Purple Synthesis Model"

---

## Part 5: Agent Assignment

### Step 11: Navigate to Participants Panel

**Location:** Left column, below Session Control

**What You'll See:**
- Three agent cards (initially):
  - Gemini Red
  - Mistral Blue
  - GPT Purple
- Each card shows:
  - Agent name
  - Role badge (colored)
  - Warning: "⚠ No model assigned" (initially)
  - Edit button

### Step 12: Assign Model to Red Agent

**Action:**
1. Click Edit icon on "Gemini Red" card
2. Dialog opens: "Assign Model to Gemini Red"

**What You'll See:**
- Model dropdown
- Only shows models with valid API keys
- Each option shows: "Label (Provider)"
- Example: "GPT-4 Turbo (OpenAI)"

**If No Models Available:**
- Message: "No models available. Please:"
  1. Add API keys in the Secrets tab
  2. Configure models in the Models tab

**Action:**
1. Select a model from dropdown
2. View model details below:
   - Temperature: 0.8
   - Top-P: 0.9
   - Max Tokens: 4000
3. Click "Assign Model"
4. Success notification: "Agent updated"
5. Dialog closes

### Step 13: View Updated Agent

**What You'll See:**
- Agent card now shows:
  - Model: "GPT-4 Turbo" with green checkmark ✓
  - Provider: "OpenAI"
  - Temperature: 0.8
  - No warnings

### Step 14: Assign Models to Other Agents

**Repeat for Blue and Purple:**
1. Click Edit on Blue agent
2. Select analytical model
3. Assign
4. Click Edit on Purple agent
5. Select balanced model
6. Assign

**Final State:**
- All three agents have models assigned
- All show green checkmarks ✓
- No warnings
- Ready to start session

---

## Part 6: Running a Session

### Step 15: Review Session Control

**Location:** Top of left column

**What You'll See:**
- Session status: "Idle"
- Start button (enabled)
- Pause button (disabled)
- Reset button (disabled)
- Export buttons (disabled)

### Step 16: Review Seed Prompt

**Location:** Right column, Prompt Injector

**What You'll See:**
- Default prompt: "Explore innovative solutions for sustainable urban transportation"
- Edit button

**Optional: Edit Prompt**
1. Click Edit
2. Modify prompt
3. Click Save

### Step 17: Start Session

**Action:**
1. Click "Start" button in Session Control
2. Session status changes to "Running"

**What Happens:**
1. Red agent generates creative ideas
2. Blue agent evaluates critically
3. Purple agent synthesizes insights
4. All messages appear in Arena

### Step 18: View Messages in Arena

**Location:** Center column

**What You'll See:**
- Messages appear in sequence
- Each message shows:
  - Agent name and role badge
  - Message content
  - Timestamp (hover for full time)
  - Score badges:
    - Novelty: 85
    - Feasibility: 72
    - Value: 78
    - Safety: 90
    - Exploration: 68
  - Expandable technical details

**Message Flow:**
```
🔴 Red: "Consider vertical gardens on building facades..."
   Novelty: 85 | Feasibility: 72 | Value: 78 | Safety: 90 | Exploration: 68

🔵 Blue: "While innovative, this approach faces challenges..."
   Novelty: 45 | Feasibility: 88 | Value: 65 | Safety: 95 | Exploration: 52

🟣 Purple: "Synthesizing: We can implement vertical gardens with..."
   Novelty: 65 | Feasibility: 80 | Value: 85 | Safety: 92 | Exploration: 60
```

### Step 19: Monitor Metrics

**Location:** Left column, below Participants

**What You'll See:**
- Metrics Panel with charts
- Rolling averages for each dimension
- Trend lines over turns
- Color-coded by dimension

### Step 20: Continue or Pause

**Actions Available:**
- Click "Start" again for next turn
- Click "Pause" to temporarily halt
- Click "Reset" to clear and restart
- Adjust prompt and continue

---

## Part 7: Export and Analysis

### Step 21: Export Session Data

**Action:**
1. Click "Export JSON" in Session Control
2. Or click "Export CSV"

**JSON Export Contains:**
- Complete session data
- All messages with metadata
- Agent configurations
- Timestamps
- Scores

**CSV Export Contains:**
- Tabular format
- Columns: Turn, Agent, Role, Message, Scores
- Easy to import to Excel/Sheets

### Step 22: Analyze Results

**What to Look For:**
- Score trends over time
- Agent performance patterns
- Exploration vs. exploitation balance
- Novel ideas vs. practical solutions
- Safety considerations

---

## Part 8: Advanced Features

### Step 23: Edit Provider

**Action:**
1. Go to Admin Panel → Providers
2. Click Edit icon on any provider
3. Dialog opens with all fields
4. Modify as needed
5. Click "Save Changes"

**Editable Fields:**
- Name
- Slug
- Type
- Base URL
- API key alias
- Get key URL
- Notes

### Step 24: Update API Key

**Action:**
1. Go to Admin Panel → Secrets
2. Click "Update Key" on provider with existing key
3. Dialog opens with current key (decrypted)
4. Modify key
5. Click "Discover Available Models" if needed
6. Click "Save API Key"

### Step 25: Edit Model Configuration

**Action:**
1. Go to Admin Panel → Models
2. Click Edit icon on model
3. Dialog opens with all fields
4. Modify parameters
5. Click "Save Changes"

**Common Adjustments:**
- Increase temperature for more creativity
- Decrease temperature for more consistency
- Adjust max tokens for longer/shorter responses
- Change base URL for custom endpoints

### Step 26: Reassign Agent Models

**Action:**
1. Go to Participants panel
2. Click Edit on any agent
3. Select different model
4. Assign
5. Agent immediately updates

**Use Cases:**
- Test different models
- Compare performance
- Optimize for specific tasks
- Balance cost vs. quality

---

## Part 9: Validation and Troubleshooting

### Step 27: Check Validation Indicators

**Visual Indicators:**

**Green Checkmark ✓**
- Provider has valid API key
- Model has valid API key
- Agent has valid model assigned

**Red X ✗**
- Provider has no API key
- Model's provider has no key
- Agent's model has no valid key

**Yellow Warning ⚠**
- Agent has no model assigned
- Configuration incomplete

### Step 28: Fix Common Issues

**Issue: "No models available"**
- Solution: Add API keys in Secrets tab
- Then configure models in Models tab

**Issue: "Can't start session"**
- Solution: Assign models to all three agents
- Ensure all have green checkmarks

**Issue: "Model discovery failed"**
- Solution: Check API key validity
- Verify network connection
- Try again

**Issue: "Agent shows red X"**
- Solution: Model's provider lost API key
- Re-add API key in Secrets tab
- Or assign different model

---

## Part 10: Best Practices

### Step 29: Optimal Configuration

**Temperature Settings:**
- Red (Divergent): 0.8-1.0
- Blue (Evaluator): 0.3-0.5
- Purple (Integrator): 0.6-0.8

**Model Selection:**
- Red: Most creative models (GPT-4, Claude-3-Opus)
- Blue: Most analytical models (Mistral-Large, Gemini-Pro)
- Purple: Balanced models (GPT-4, Claude-3-Sonnet)

**Security:**
- Use strong passphrase (12+ characters)
- Mix uppercase, lowercase, numbers, symbols
- Don't share passphrase
- Export encrypted backups

### Step 30: Workflow Tips

**Setup:**
1. Start with one provider
2. Add key and discover models
3. Configure one model per agent
4. Test with simple prompt
5. Expand to more providers

**Usage:**
1. Start with clear seed prompt
2. Run 3-5 turns
3. Review messages and scores
4. Adjust prompt if needed
5. Export interesting sessions

**Maintenance:**
1. Rotate API keys periodically
2. Update model configurations
3. Export session data regularly
4. Clear old sessions
5. Monitor browser storage

---

## Summary

You now have a complete understanding of all GauntletFuse features:

✅ Provider configuration
✅ API key management with encryption
✅ Model discovery and configuration
✅ Agent model assignment
✅ Session execution
✅ Message viewing and scoring
✅ Metrics tracking
✅ Export capabilities
✅ Validation system
✅ Troubleshooting

**Next Steps:**
1. Configure your first provider
2. Add an API key
3. Discover models
4. Configure models for all agents
5. Run your first session
6. Explore and experiment!

**Resources:**
- README.md - Installation guide
- QUICK_REFERENCE.md - Fast lookup
- FEATURES.md - Detailed features
- ARCHITECTURE.md - Technical details

---

**Version**: 1.2.0  
**Last Updated**: 2025-11-19  
**Walkthrough Time**: ~30 minutes  
**Difficulty**: Beginner-friendly
