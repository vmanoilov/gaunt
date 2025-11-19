# GauntletFuse Features Guide

## Overview

GauntletFuse is a sophisticated multi-agent creative exploration platform that enables AI agents to collaborate through structured debate cycles. This guide covers all major features and workflows.

## Core Features

### 1. Multi-Agent System

**Three Agent Roles:**
- **Red (Divergent)**: Generates creative, exploratory ideas
- **Blue (Evaluator)**: Critically evaluates proposals
- **Purple (Integrator)**: Synthesizes insights into actionable solutions

**Turn-Based Cycle:**
```
Red → Blue → Purple → Red → Blue → Purple → ...
```

Each agent builds upon the context of previous messages, creating a collaborative exploration process.

### 2. Provider Management

**15 Pre-configured Providers:**
- OpenAI (GPT-4, GPT-3.5)
- Google Gemini
- Anthropic Claude
- Mistral AI
- Cohere
- OpenRouter
- Azure OpenAI
- AWS Bedrock
- Alibaba Qwen
- Baidu ERNIE
- Tencent Hunyuan
- Zhipu GLM
- SenseTime SenseNova
- DeepSeek
- Moonshot

**Provider Configuration:**
- Name and slug identification
- Base URL configuration
- API type (direct, openrouter, bedrock, azure)
- API key alias for secure storage
- Direct links to get API keys
- Custom notes and documentation

### 3. Secrets Management

**Security Features:**
- AES-GCM encryption for all API keys
- Master passphrase protection (minimum 8 characters)
- Client-side encryption only - keys never leave your browser
- Visual indicators for key status

**Workflow:**
1. Set master passphrase once
2. Add API keys for each provider
3. Keys are encrypted and stored in localStorage
4. Decrypt on-demand when needed

**Model Discovery:**
- Automatic model detection from API keys
- "Discover Available Models" button
- Simulated API calls (ready for real integration)
- Populates provider model lists automatically

### 4. Model Configuration

**Model Parameters:**
- **Temperature** (0-2): Controls randomness
  - 0 = Deterministic
  - 1 = Balanced
  - 2 = Very creative
- **Top-P** (0-1): Nucleus sampling threshold
- **Max Tokens**: Maximum response length
- **Base URL Override**: Custom endpoint support

**Validation:**
- Only shows providers with valid API keys
- Visual badges for all parameters
- Real-time validation feedback
- Prevents invalid configurations

### 5. Team Model Assignment

**Agent Configuration:**
Each agent can be assigned:
- A specific model from any provider
- Custom temperature settings
- Provider-specific configurations

**Visual Indicators:**
- ✓ Green checkmark = Valid API key
- ✗ Red X = No valid API key
- ⚠ Yellow warning = No model assigned

**Assignment Process:**
1. Click Edit icon on agent card
2. Select from models with valid keys
3. View model details before assigning
4. Confirm assignment
5. Agent updates immediately

### 6. Session Management

**Session Controls:**
- **Start**: Begin a new turn cycle
- **Pause**: Temporarily halt execution
- **Reset**: Clear session and start fresh

**Session State:**
- Seed prompt (editable during session)
- Current turn number
- All messages with timestamps
- Agent configurations
- Status (idle, running, paused)

### 7. Real-Time Scoring

**Five Scoring Dimensions:**
1. **Novelty** (0-100): How original is the idea?
2. **Feasibility** (0-100): How practical is it?
3. **Value Impact** (0-100): What's the potential benefit?
4. **Safety** (0-100): How safe is the approach?
5. **Exploration Index** (0-100): How well does it explore the space?

**Scoring Methods:**
- Heuristic scoring (currently implemented)
- LLM-based scoring (ready for integration)
- Rolling averages over time
- Per-agent and per-turn metrics

### 8. Arena (Message Display)

**Features:**
- Chat-style message flow
- Role-based color coding
- Timestamp tooltips
- Score badges on each message
- Expandable technical details
- Auto-scroll to latest messages

**Message Information:**
- Agent name and role
- Message content
- Timestamp
- All five scores
- API endpoint (for debugging)
- Request body (for debugging)

### 9. Metrics Panel

**Visualizations:**
- Line charts for score trends
- Rolling averages
- Per-dimension tracking
- Turn-by-turn comparison

**Metrics Tracked:**
- Average scores across all dimensions
- Individual agent performance
- Score evolution over time
- Exploration patterns

### 10. Prompt Injection

**Dynamic Prompt Editing:**
- Edit seed prompt during session
- Changes affect next turn
- Maintains conversation context
- Useful for steering exploration

**Use Cases:**
- Refine initial question
- Add constraints
- Shift focus areas
- Introduce new requirements

### 11. Export Capabilities

**JSON Export:**
- Complete session data
- All messages with metadata
- Agent configurations
- Timestamps and scores
- Ready for analysis

**CSV Export:**
- Tabular format
- Easy import to Excel/Sheets
- Columns: Turn, Agent, Role, Message, Scores
- Perfect for data analysis

### 12. Data Persistence

**localStorage Integration:**
- Automatic state saving
- Survives browser refresh
- No server required
- Encrypted secrets storage

**Persisted Data:**
- All providers
- All models
- Encrypted API keys
- Session history
- Settings

## Workflow Example

### Complete Setup Flow

1. **Initial Setup**
   ```
   Admin Panel → Providers → Review pre-configured providers
   ```

2. **Add API Keys**
   ```
   Admin Panel → Secrets → Set passphrase
   → Add key for OpenAI
   → Discover models
   → Add key for Anthropic
   → Discover models
   ```

3. **Configure Models**
   ```
   Admin Panel → Models → Add Model
   → Select OpenAI
   → Choose gpt-4
   → Set temperature to 0.7
   → Save
   
   → Add Model
   → Select Anthropic
   → Choose claude-3-opus
   → Set temperature to 0.8
   → Save
   ```

4. **Assign to Agents**
   ```
   Participants → Red Agent → Edit
   → Select GPT-4
   → Assign
   
   Participants → Blue Agent → Edit
   → Select Claude-3-Opus
   → Assign
   
   Participants → Purple Agent → Edit
   → Select GPT-4
   → Assign
   ```

5. **Run Session**
   ```
   Session Control → Start
   → Watch messages appear in Arena
   → Monitor scores in Metrics Panel
   → Adjust prompt if needed
   → Export results when done
   ```

## Advanced Features

### Custom Providers

Add your own AI providers:
1. Click "Add Provider" in Providers tab
2. Enter name, base URL, and API type
3. Add API key in Secrets tab
4. Discover models
5. Configure and assign to agents

### Base URL Override

For custom endpoints:
1. Configure model normally
2. Add Base URL Override
3. Points to your custom endpoint
4. Useful for proxies or custom deployments

### Temperature Tuning

Optimize agent behavior:
- **Red (Divergent)**: 0.8-1.0 for creativity
- **Blue (Evaluator)**: 0.3-0.5 for consistency
- **Purple (Integrator)**: 0.6-0.8 for balance

### Multi-Provider Strategy

Use different providers for different roles:
- Red: Creative models (GPT-4, Claude)
- Blue: Analytical models (Mistral, Gemini)
- Purple: Balanced models (GPT-4, Claude)

## Security Best Practices

1. **Strong Passphrase**: Use 12+ characters with mixed case, numbers, symbols
2. **Regular Rotation**: Change API keys periodically
3. **Minimal Permissions**: Use read-only keys where possible
4. **Local Only**: Keys never leave your browser
5. **Export Carefully**: Encrypted exports require your passphrase

## Future Enhancements

### Planned Features (Migration to Full Stack)

1. **Real API Integration**
   - Replace mock model discovery with real API calls
   - Actual LLM inference
   - Streaming responses

2. **Advanced Scoring**
   - LLM-based evaluation
   - Custom scoring functions
   - User-defined metrics

3. **Collaboration**
   - Multi-user sessions
   - Shared workspaces
   - Real-time sync

4. **Analytics**
   - Advanced visualizations
   - Pattern detection
   - Performance insights

5. **Connectors**
   - Custom code execution
   - Python/JavaScript support
   - External tool integration

## Troubleshooting

### No Models Available
- **Cause**: No API keys configured
- **Solution**: Add API keys in Secrets tab

### Model Discovery Failed
- **Cause**: Invalid API key or network issue
- **Solution**: Verify key, check network, try again

### Agent Won't Start
- **Cause**: Missing model assignment
- **Solution**: Assign models to all three agents

### Scores Not Showing
- **Cause**: Heuristic scoring only (no real LLM)
- **Solution**: Normal behavior in SPA mode

### Export Not Working
- **Cause**: Browser storage limits
- **Solution**: Clear old sessions, export regularly

## Tips & Tricks

1. **Start Simple**: Use one provider initially
2. **Test Models**: Try different models for each role
3. **Monitor Scores**: Watch for patterns in metrics
4. **Export Often**: Save interesting sessions
5. **Experiment**: Try different temperature settings
6. **Read Logs**: Check console for debugging info
7. **Use Dialogs**: All editing in clean modal dialogs
8. **Visual Cues**: Follow checkmarks and warnings

## Support

For issues or questions:
- Check ARCHITECTURE.md for technical details
- Review CHANGELOG.md for recent changes
- Inspect browser console for errors
- Verify all prerequisites are met

---

**Version**: 1.2.0  
**Last Updated**: 2025-11-19  
**Total Features**: 12 major feature areas  
**Lines of Code**: ~2,000 TypeScript
