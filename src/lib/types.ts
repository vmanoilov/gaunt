import { z } from 'zod';

export type AgentRole = 'human' | 'red' | 'blue' | 'purple';

export type ProviderType = 'direct' | 'openrouter' | 'bedrock' | 'azure';

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(['direct', 'openrouter', 'bedrock', 'azure']),
  baseUrl: z.string().optional(),
  models: z.array(z.string()),
  apiKeyAlias: z.string(),
  getKeyUrl: z.string(),
  notes: z.string().optional(),
});

export type Provider = z.infer<typeof ProviderSchema>;

export const ModelConfigSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  model: z.string(),
  label: z.string(),
  temperature: z.number().optional(),
  topP: z.number().optional(),
  maxTokens: z.number().optional(),
  baseUrlOverride: z.string().optional(),
  assignedTeam: z.enum(['red', 'blue', 'purple', 'none']).optional(),
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

export const SecretSchema = z.object({
  alias: z.string(),
  valueEncrypted: z.string(),
});

export type Secret = z.infer<typeof SecretSchema>;

export const ConnectorCodeSchema = z.object({
  id: z.string(),
  language: z.enum(['python', 'javascript']),
  label: z.string(),
  code: z.string(),
  lastTestResult: z.string().optional(),
});

export type ConnectorCode = z.infer<typeof ConnectorCodeSchema>;

export const SettingsSchema = z.object({
  defaultProviderId: z.string().optional(),
  telemetry: z.boolean(),
  timeoutMs: z.number(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['human', 'red', 'blue', 'purple']),
  modelId: z.string().optional(),
  providerId: z.string().optional(),
  temperature: z.number().optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const ScoreSchema = z.object({
  novelty: z.number(),
  feasibility: z.number(),
  valueImpact: z.number(),
  safety: z.number(),
  explorationIndex: z.number(),
});

export type Score = z.infer<typeof ScoreSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  role: z.enum(['human', 'red', 'blue', 'purple']),
  content: z.string(),
  timestamp: z.number(),
  score: ScoreSchema.optional(),
  apiEndpoint: z.string().optional(),
  requestBody: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  seedPrompt: z.string(),
  agents: z.array(AgentSchema),
  messages: z.array(MessageSchema),
  currentTurn: z.number(),
  status: z.enum(['idle', 'running', 'paused', 'completed']),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Session = z.infer<typeof SessionSchema>;

export const AppStateSchema = z.object({
  providers: z.array(ProviderSchema),
  models: z.array(ModelConfigSchema),
  secrets: z.array(SecretSchema),
  connectors: z.array(ConnectorCodeSchema),
  settings: SettingsSchema,
  sessions: z.array(SessionSchema),
  currentSessionId: z.string().optional(),
});

export type AppState = z.infer<typeof AppStateSchema>;
