import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, CheckCircle, XCircle, Play } from 'lucide-react';
import type { Agent, ModelConfig, Provider, Secret } from '@/lib/types';

interface ParticipantsProps {
  agents: Agent[];
  models: ModelConfig[];
  providers: Provider[];
  secrets: Secret[];
  onUpdateAgent: (agentId: string, updates: Partial<Agent>) => void;
  onManualExecute?: (agentId: string) => void;
  isRunning?: boolean;
}

const roleColors = {
  human: 'bg-[#2b3a4b]',
  red: 'bg-[#7f1d1d]',
  blue: 'bg-[#113c5a]',
  purple: 'bg-[#4b2b58]',
};

const roleLabels = {
  human: 'Human',
  red: 'Red (Attacker)',
  blue: 'Blue (Defender)',
  purple: 'Purple (Integrator)',
};

export function Participants({ agents, models, providers, secrets, onUpdateAgent, onManualExecute, isRunning = false }: ParticipantsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('');

  // Filter models to only show those with valid API keys
  const validModels = models.filter(model => {
    const provider = providers.find(p => p.id === model.providerId);
    return provider && secrets.some(s => s.alias === provider.apiKeyAlias);
  });

  const getModelById = (id: string) => models.find(m => m.id === id);
  const getProviderById = (id: string) => providers.find(p => p.id === id);

  const openDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setSelectedModelId(agent.modelId || '');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedAgent(null);
    setSelectedModelId('');
  };

  const handleSave = () => {
    if (!selectedAgent) return;
    const model = getModelById(selectedModelId);
    onUpdateAgent(selectedAgent.id, {
      modelId: selectedModelId,
      providerId: model?.providerId,
      temperature: model?.temperature,
    });
    closeDialog();
  };

  const isModelValid = (modelId: string) => {
    return validModels.some(m => m.id === modelId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agents.map((agent) => {
              const model = agent.modelId ? getModelById(agent.modelId) : null;
              const provider = model ? getProviderById(model.providerId) : null;
              const hasValidKey = model ? isModelValid(model.id) : false;

              return (
                <div
                  key={agent.id}
                  className="p-3 rounded-lg bg-card border"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{agent.name}</div>
                    <div className="flex items-center gap-2">
                      <Badge className={roleColors[agent.role]}>
                        {roleLabels[agent.role]}
                      </Badge>
                      {onManualExecute && !isRunning && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onManualExecute(agent.id)}
                          title={`Execute ${agent.name} manually`}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(agent)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {model && provider && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>Model: {model.label}</span>
                        {hasValidKey ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Provider: {provider.name}
                      </div>
                      {agent.temperature !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          Temperature: {agent.temperature}
                        </div>
                      )}
                      {!hasValidKey && (
                        <div className="text-xs text-red-500">
                          ⚠ No valid API key
                        </div>
                      )}
                    </div>
                  )}
                  {!model && (
                    <div className="text-xs text-yellow-500">
                      ⚠ No model assigned
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Model to {selectedAgent?.name}</DialogTitle>
            <DialogDescription>
              Select a model from providers with valid API keys.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {validModels.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 border rounded-md">
                No models available. Please:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Add API keys in the Secrets tab</li>
                  <li>Configure models in the Models tab</li>
                </ol>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={selectedModelId}
                    onValueChange={setSelectedModelId}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {validModels.map((model) => {
                        const provider = getProviderById(model.providerId);
                        return (
                          <SelectItem key={model.id} value={model.id}>
                            {model.label} ({provider?.name})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedModelId && (() => {
                  const model = getModelById(selectedModelId);
                  if (!model) return null;
                  return (
                    <div className="text-sm space-y-1 p-3 bg-muted rounded-md">
                      <div><strong>Temperature:</strong> {model.temperature}</div>
                      <div><strong>Top-P:</strong> {model.topP}</div>
                      <div><strong>Max Tokens:</strong> {model.maxTokens}</div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedModelId}>
              Assign Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
