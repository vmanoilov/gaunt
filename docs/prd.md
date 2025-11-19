# GauntletFuse 多智能体创意探索平台需求文档

## 1. 应用概述

### 1.1 应用名称
GauntletFuse

### 1.2 应用描述
GauntletFuse 是一个多智能体创意探索平台，允许多个 AI 智能体（Gemini、Mistral、GPT 等）通过结构化的〖Gauntlet〗轮次进行辩论、批判和整合创意。平台采用 Red（发散思维）→ Blue（评估者）→ Purple（整合者）的三阶段循环机制，实时评分、回放和日志记录功能完全在浏览器中运行。

### 1.3 技术架构
- 前端框架：Vite + React + TypeScript（单页应用 SPA）
- 状态管理：React Hooks
- 类型验证：TypeScript + Zod
- 未来扩展：可迁移至 Next.js + Fastify + SQLite 全栈架构

## 2. 核心功能

### 2.1 智能体管理
- 支持多种角色：Human（人类）、Red（发散思维）、Blue（评估者）、Purple（整合者）
- 智能体配置：包含 id、名称、角色、模型、提供商 ID、温度参数
- 默认会话配置：Gemini = Red，Mistral = Blue，GPT = Purple
- 可编辑角色和模型分配
- **模型过滤机制：参与者面板中仅显示已配置有效 API 密钥的提供商的模型**
- **按团队分配模型：支持为 Red、Blue、Purple 三个团队分别指定可用模型列表**

### 2.2 轮次引擎（Turn Engine）
- 顺序执行 Red → Blue → Purple 循环
- 每个智能体生成消息并计算评分
- 评分维度：新颖性、可行性、价值影响、安全性、探索指数
- 支持本地启发式评分和 LLM 评分占位符

### 2.3 会话控制（SessionControl）
- 启动/暂停/重置会话
- 导出 JSON/CSV 格式数据
- 快照和恢复功能
- 会话持久化存储

### 2.4 参与者面板（Participants）
- 显示当前会话参与者
- 编辑角色和模型分配
- 实时状态显示
- **仅显示已配置有效 API 密钥的提供商模型**
- **支持按团队（Red/Blue/Purple）筛选和分配模型**

### 2.5 竞技场（Arena）
- 聊天式消息流展示
- 实时显示评分
- 消息时间戳工具提示
- 技术细节展示（API 端点和请求体）

### 2.6 指标面板（MetricsPanel）
- 滚动平均值计算
- 数据可视化图表
- 多维度评分追踪

### 2.7 提示注入器（PromptInjector）
- 会话中编辑种子提示
- 动态调整上下文

### 2.8 回放面板（ReplayPanel）
- 回放历史轮次
- 使用新种子重新运行

### 2.9 管理面板（AdminPanel）
包含以下标签页：

#### 2.9.1 提供商管理（Providers）
- CRUD 操作支持所有 AI 提供商
- 预置提供商列表：
  - OpenAI：https://platform.openai.com/api-keys
  - Google Gemini：https://aistudio.google.com/app/apikey
  - Anthropic：https://console.anthropic.com
  - Mistral：https://console.mistral.ai
  - Cohere：https://dashboard.cohere.com/api-keys
  - OpenRouter：https://openrouter.ai/keys
  - Azure OpenAI：https://portal.azure.com
  - AWS Bedrock：https://console.aws.amazon.com/bedrock
  - Alibaba Qwen：https://bailian.console.aliyun.com
  - Baidu ERNIE：https://console.bce.baidu.com/ai
  - Tencent Hunyuan：https://cloud.tencent.com/product/hunyuan
  - Zhipu GLM：https://open.bigmodel.cn
  - SenseTime SenseNova：https://open.sensetime.com
  - DeepSeek：https://platform.deepseek.com
  - Moonshot：https://platform.moonshot.cn
- 配置字段：名称、基础 URL、类型、API 密钥获取链接、备注
- **API 密钥验证后模型查询功能：输入 API 密钥后，提供〖查询可用模型〗按钮，调用提供商 API 获取该密钥下所有可用模型列表**

#### 2.9.2 模型管理（Models）
- 与提供商关联的 CRUD 操作
- 模型配置：id、providerId、model、label、temperature、topP、maxTokens、baseUrlOverride
- **动态模型列表：从提供商 API 查询获取的模型可直接添加到模型列表**
- **模型选择器：支持从查询到的可用模型列表中勾选并批量添加**
- **团队标签：为每个模型添加可选的团队标签（Red/Blue/Purple/All），用于参与者面板筛选**

#### 2.9.3 密钥管理（Secrets）
- AES-GCM 本地加密
- 密码短语解锁机制
- 密钥别名管理
- 不记录密钥日志
- **密钥有效性标记：显示每个密钥是否已验证有效**

#### 2.9.4 连接器管理（Connectors）
- 创建/编辑自定义连接器代码
- 支持 Python 和 JavaScript 代码块
- 模拟调用功能
- 代码模板示例（Python 和 JS）

#### 2.9.5 验证（Validate）
- 完整性检查
- 检测缺失密钥
- 验证无效标识符
- **API 密钥有效性验证：测试每个提供商的 API 密钥是否可用**

#### 2.9.6 导出/导入（Export/Import）
- AES 加密 JSON 导出
- 用户提供密码保护
- 配置导入功能

### 2.10 OpenAI 自定义 GPT 向导
- 自动生成启动文件：
  - gpt-system-instructions.md
  - actions-openapi.json（模拟 /turn、/score、/export 端点）
  - manifest.json
- 一键复制所有按钮
- 上传指南文本

## 3. 数据模型

### 3.1 核心数据结构
```typescript
Provider {
  id: string
  name: string
  slug: string
  type: 'direct' | 'openrouter' | 'bedrock' | 'azure'
  baseUrl?: string
  models: string[]
  apiKeyAlias: string
  getKeyUrl: string
  notes?: string
  hasValidKey?: boolean  // 新增：标记是否配置有效密钥
}

ModelConfig {
  id: string
  providerId: string
  model: string
  label: string
  temperature?: number
  topP?: number
  maxTokens?: number
  baseUrlOverride?: string
  teamAssignment?: 'red' | 'blue' | 'purple' | 'all'  // 新增：团队分配标签
}

Secret {
  alias: string
  valueEncrypted: string
  isValid?: boolean  // 新增：密钥有效性标记
  lastValidated?: string  // 新增：最后验证时间
}

ConnectorCode {
  id: string
  language: 'python' | 'javascript'
  label: string
  code: string
  lastTestResult?: string
}

Settings {
  defaultProviderId?: string
  telemetry: boolean
  timeoutMs: number
}

ProviderModelsResponse {  // 新增：提供商模型查询响应
  providerId: string
  models: Array<{
    id: string
    name: string
    contextWindow?: number
  }>
}
```

## 4. 安全机制

### 4.1 加密存储
- SPA 中使用 AES-GCM 密码短语加密
- 启动时要求输入密码解锁密钥
- 不进行密钥外传

### 4.2 迁移标记
- 所有未来服务器迁移点标记为 `// FutureServer:` 注释

## 5. 文件结构

```
/src
  /components
    Arena.tsx
    SessionControl.tsx
    Participants.tsx
    MetricsPanel.tsx
    PromptInjector.tsx
    RoleEditor.tsx
    ReplayPanel.tsx
    AdminPanel.tsx
    ModelQueryDialog.tsx  // 新增：模型查询对话框
  /lib
    agents.ts
    turnEngine.ts
    storage.ts
    secrets.ts
    providers.ts
    providerApi.ts  // 新增：提供商 API 调用模块
    connectors.ts
    export.ts
    csv.ts
    types.ts
    utils.ts
  App.tsx
  main.tsx
  index.css
```

## 6. 设计风格

### 6.1 配色方案
- 深色极简主题
- 角色颜色编码：
  - Red（发散思维）：#7f1d1d
  - Blue（评估者）：#113c5a
  - Purple（整合者）：#4b2b58
  - Human（人类）：#2b3a4b

### 6.2 布局设计
- 网格布局：参与者 | 竞技场 | 指标 | 管理
- 卡片式组件设计
- 流畅过渡动画（可选 Framer Motion）

### 6.3 交互细节
- 每条消息显示评分标签
- 时间戳工具提示
- 键盘导航支持
- 所有页面底部帮助文本
- **模型查询加载状态：查询提供商模型时显示加载动画**
- **有效密钥视觉标识：使用绿色勾选图标标记已验证的有效密钥**

## 7. 质量要求

### 7.1 代码规范
- 强制类型安全
- 纯函数设计（I/O 除外）
- 防御性错误处理
- 模块代码少于 200 行
- 严格 TypeScript 类型检查

### 7.2 可维护性
- 清晰的表现层/逻辑层/数据层分离
- 完整的类型定义
- 明确的迁移接缝标记
- 详细的代码注释

## 8. 交付物

### 8.1 文档
- 架构概述文档
- README.md 包含：
  - 安装步骤：`npm i && npm run dev`
  - 提供商管理说明
  - **API 密钥验证和模型查询流程说明**
  - 加密机制说明
  - 迁移至 Fastify 后端 + 数据库的计划
  - 真实 API 连接指南
- .env.example 文件（包含提供商占位符）
- 扩展至完整 monorepo 的检查清单

### 8.2 源代码
- 所有 TypeScript 源文件
- 完整注释
- 总代码量少于 2000 行

## 9. 验收标准

✅ 通过 `npm run dev` 独立运行
✅ 支持管理面板 CRUD 操作（提供商/模型/密钥/连接器）
✅ **输入 API 密钥后可查询提供商可用模型列表**
✅ **参与者面板仅显示有效密钥提供商的模型**
✅ **支持按团队（Red/Blue/Purple）分配和筛选模型**
✅ 运行 Gauntlet 轮次（Red→Blue→Purple）并评分
✅ 导出 JSON/CSV 功能
✅ 支持回放、快照、加密解锁
✅ 生成 OpenAI 自定义 GPT 模板
✅ 严格 TypeScript、有注释、可维护、少于 2000 行
✅ 包含迁移路线图

## 10. 未来扩展

### 10.1 后端迁移
- 从 SPA 迁移至 Next.js + Fastify + SQLite
- 无需重写核心逻辑
- 保持模块化架构

### 10.2 功能增强
- LLM 评分集成
- 高级分析功能
- 多用户协作
- 云端同步
- **智能模型推荐：基于任务类型自动推荐最适合的模型组合**