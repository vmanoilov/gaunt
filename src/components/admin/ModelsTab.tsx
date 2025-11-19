import { useState } from 'react';
import type { Provider, ModelConfig, Secret } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, CheckCircle } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ModelsTabProps {
  providers: Provider[];
  models: ModelConfig[];
  secrets: Secret[];
  onUpdate: (models: ModelConfig[]) => void;
}

export function ModelsTab({ providers, models, secrets, onUpdate }: ModelsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ModelConfig>>({});
  const { toast } = useToast();

  const providersWithKeys = providers.filter(p => 
    secrets.some(s => s.alias === p.apiKeyAlias)
  );

  const getProviderById = (id: string) => providers.find(p => p.id === id);

  const openDialog = (model?: ModelConfig) => {
    if (model) {
      setEditing(model.id);
      setFormData(model);
    } else {
      setEditing('new');
      setFormData({ temperature: 0.7, topP: 1, maxTokens: 2000 });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setFormData({});
  };

  const handleAdd = () => {
    if (!formData.providerId || !formData.model || !formData.label) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newModel: ModelConfig = {
      id: generateId(),
      providerId: formData.providerId,
      model: formData.model,
      label: formData.label,
      temperature: formData.temperature || 0.7,
      topP: formData.topP || 1,
      maxTokens: formData.maxTokens || 2000,
      baseUrlOverride: formData.baseUrlOverride,
    };
    onUpdate([...models, newModel]);
    toast({
      title: 'Success',
      description: 'Model configuration added',
    });
    closeDialog();
  };

  const handleSave = () => {
    if (!editing) return;
    onUpdate(models.map(m => m.id === editing ? { ...m, ...formData } : m));
    toast({
      title: 'Success',
      description: 'Model configuration updated',
    });
    closeDialog();
  };

  const handleDelete = (id: string) => {
    onUpdate(models.filter(m => m.id !== id));
    toast({
      title: 'Success',
      description: 'Model configuration removed',
    });
  };

  const selectedProvider = formData.providerId ? getProviderById(formData.providerId) : null;
  const availableModels = selectedProvider?.models || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Model Configurations</h3>
          <p className="text-sm text-muted-foreground">
            Configure models from providers with valid API keys
          </p>
        </div>
        <Button onClick={() => openDialog()} size="sm" disabled={providersWithKeys.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Add Model
        </Button>
      </div>

      {providersWithKeys.length === 0 && (
        <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-base">No API Keys Configured</CardTitle>
            <CardDescription>
              Please add API keys in the Secrets tab before configuring models.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4">
        {models.map((model) => {
          const provider = getProviderById(model.providerId);
          const hasKey = provider && secrets.some(s => s.alias === provider.apiKeyAlias);
          
          return (
            <Card key={model.id} className={!hasKey ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{model.label}</CardTitle>
                      {hasKey && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <CardDescription>
                      {provider?.name} • {model.model}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openDialog(model)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(model.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Temp: {model.temperature}</Badge>
                  <Badge variant="outline">Top-P: {model.topP}</Badge>
                  <Badge variant="outline">Max Tokens: {model.maxTokens}</Badge>
                  {!hasKey && <Badge variant="destructive">No API Key</Badge>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing === 'new' ? 'Add Model Configuration' : 'Edit Model Configuration'}
            </DialogTitle>
            <DialogDescription>
              Configure a model from a provider with a valid API key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) => setFormData({ ...formData, providerId: value, model: '' })}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providersWithKeys.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProvider && availableModels.length > 0 && (
              <div>
                <Label htmlFor="model">Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedProvider && availableModels.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 border rounded-md">
                No models discovered for this provider. Use "Discover Available Models" in the Secrets tab.
              </div>
            )}

            <div>
              <Label htmlFor="label">Display Label</Label>
              <Input
                id="label"
                value={formData.label || ''}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="GPT-4 Turbo"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature || 0.7}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="topP">Top-P</Label>
                <Input
                  id="topP"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.topP || 1}
                  onChange={(e) => setFormData({ ...formData, topP: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="32000"
                  step="100"
                  value={formData.maxTokens || 2000}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="baseUrlOverride">Base URL Override (Optional)</Label>
              <Input
                id="baseUrlOverride"
                value={formData.baseUrlOverride || ''}
                onChange={(e) => setFormData({ ...formData, baseUrlOverride: e.target.value })}
                placeholder="https://custom-endpoint.com/v1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={editing === 'new' ? handleAdd : handleSave}>
              {editing === 'new' ? 'Add Model' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
