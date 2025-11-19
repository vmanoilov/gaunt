# GauntletFuse Quick Reference

## 🚀 Quick Start (5 Minutes)

### Step 1: Set Master Passphrase
```
Admin Panel → Secrets → Enter passphrase (8+ chars)
```

### Step 2: Add API Key
```
Secrets → Click "Add Key" on a provider
→ Paste API key
→ Click "Discover Available Models"
→ Click "Save API Key"
```

### Step 3: Configure Model
```
Admin Panel → Models → Add Model
→ Select provider
→ Select model
→ Set label
→ Save
```

### Step 4: Assign to Agent
```
Participants → Click Edit icon
→ Select model
→ Assign Model
```

### Step 5: Start Session
```
Session Control → Start
```

## 📋 Feature Checklist

### Admin Panel
- ✅ **Providers**: Manage AI providers
- ✅ **Secrets**: Add/manage API keys with encryption
- ✅ **Models**: Configure models with parameters

### Session Management
- ✅ **Start**: Begin turn cycle
- ✅ **Pause**: Temporarily halt
- ✅ **Reset**: Clear and restart
- ✅ **Export**: Download JSON/CSV

### Participants
- ✅ **View**: See all agents
- ✅ **Edit**: Assign models
- ✅ **Validate**: Check key status

### Arena
- ✅ **Messages**: View all agent messages
- ✅ **Scores**: See real-time scoring
- ✅ **Details**: Expand technical info

### Metrics
- ✅ **Charts**: Visualize score trends
- ✅ **Averages**: Rolling calculations
- ✅ **Tracking**: Per-dimension metrics

## 🎯 Agent Roles

| Role | Color | Purpose | Temp |
|------|-------|---------|------|
| Red | 🔴 | Divergent thinking | 0.8-1.0 |
| Blue | 🔵 | Critical evaluation | 0.3-0.5 |
| Purple | 🟣 | Synthesis & integration | 0.6-0.8 |

## 📊 Scoring Dimensions

1. **Novelty** (0-100): Originality
2. **Feasibility** (0-100): Practicality
3. **Value Impact** (0-100): Benefit potential
4. **Safety** (0-100): Risk assessment
5. **Exploration Index** (0-100): Space coverage

## 🔐 Security

- **Encryption**: AES-GCM
- **Storage**: localStorage only
- **Passphrase**: Minimum 8 characters
- **Keys**: Never leave browser

## 🎨 Visual Indicators

| Icon | Meaning |
|------|---------|
| ✓ | Valid API key |
| ✗ | No API key |
| ⚠ | Warning/Missing |
| 🔒 | Encrypted |
| 📊 | Metrics available |

## ⚙️ Model Parameters

### Temperature
- **0.0-0.3**: Deterministic, focused
- **0.4-0.7**: Balanced
- **0.8-1.0**: Creative, diverse
- **1.1-2.0**: Very experimental

### Top-P
- **0.1-0.5**: Conservative
- **0.6-0.9**: Balanced
- **1.0**: Full distribution

### Max Tokens
- **500-1000**: Short responses
- **1000-2000**: Medium responses
- **2000-4000**: Long responses
- **4000+**: Very detailed

## 🔄 Turn Cycle

```
┌─────────────────────────────────────┐
│  1. Red generates creative ideas    │
│  2. Blue evaluates critically       │
│  3. Purple synthesizes insights     │
│  4. Repeat with new context         │
└─────────────────────────────────────┘
```

## 📦 Export Formats

### JSON
```json
{
  "session": {
    "id": "...",
    "messages": [...],
    "agents": [...],
    "scores": [...]
  }
}
```

### CSV
```csv
Turn,Agent,Role,Message,Novelty,Feasibility,...
1,Red,red,"...",85,72,...
```

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| No models available | Add API keys in Secrets tab |
| Can't start session | Assign models to all agents |
| Discovery failed | Check API key validity |
| Export not working | Check browser storage |

## 🔗 Pre-configured Providers

1. OpenAI - https://platform.openai.com/api-keys
2. Google Gemini - https://aistudio.google.com/app/apikey
3. Anthropic - https://console.anthropic.com
4. Mistral - https://console.mistral.ai
5. Cohere - https://dashboard.cohere.com/api-keys
6. OpenRouter - https://openrouter.ai/keys
7. Azure OpenAI - https://portal.azure.com
8. AWS Bedrock - https://console.aws.amazon.com/bedrock
9. Alibaba Qwen - https://bailian.console.aliyun.com
10. Baidu ERNIE - https://console.bce.baidu.com/ai
11. Tencent Hunyuan - https://cloud.tencent.com/product/hunyuan
12. Zhipu GLM - https://open.bigmodel.cn
13. SenseTime - https://open.sensetime.com
14. DeepSeek - https://platform.deepseek.com
15. Moonshot - https://platform.moonshot.cn

## 💡 Best Practices

1. **Start with one provider** - Master the workflow
2. **Use strong passphrase** - 12+ characters
3. **Export regularly** - Save interesting sessions
4. **Monitor scores** - Watch for patterns
5. **Experiment with temps** - Find optimal settings
6. **Read messages** - Learn from agent interactions
7. **Use dialogs** - Clean editing experience
8. **Check indicators** - Follow visual cues

## 📚 Documentation

- **README.md** - Installation & overview
- **ARCHITECTURE.md** - Technical details
- **FEATURES.md** - Complete feature guide
- **CHANGELOG.md** - Version history
- **QUICK_REFERENCE.md** - This file

## 🎓 Learning Path

### Beginner
1. Configure one provider
2. Add one API key
3. Create one model
4. Assign to one agent
5. Run a simple session

### Intermediate
1. Configure multiple providers
2. Create models for all agents
3. Experiment with temperatures
4. Export and analyze results
5. Adjust prompts dynamically

### Advanced
1. Custom provider configurations
2. Base URL overrides
3. Multi-provider strategies
4. Advanced scoring analysis
5. Session replay and comparison

## ⌨️ Keyboard Shortcuts

Currently none - all interactions via UI.
(Future enhancement opportunity)

## 🔮 Coming Soon

- Real API integration
- LLM-based scoring
- Advanced analytics
- Multi-user collaboration
- Custom connectors
- Streaming responses

---

**Version**: 1.2.0  
**Last Updated**: 2025-11-19  
**Quick Start Time**: ~5 minutes  
**Full Setup Time**: ~15 minutes
