import { useState } from 'react';
import type { Provider } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, Plus, ExternalLink } from 'lucide-react';
import { generateId } from '@/lib/utils';

interface ProvidersTabProps {
  providers: Provider[];
  onUpdate: (providers: Provider[]) => void;
}

export function ProvidersTab({ providers, onUpdate }: ProvidersTabProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Provider>>({});

  const handleAdd = () => {
    const newProvider: Provider = {
      id: generateId(),
      name: formData.name || 'New Provider',
      slug: formData.slug || 'new-provider',
      type: formData.type || 'direct',
      baseUrl: formData.baseUrl,
      models: formData.models || [],
      apiKeyAlias: formData.apiKeyAlias || 'API_KEY',
      getKeyUrl: formData.getKeyUrl || '',
      notes: formData.notes,
    };
    onUpdate([...providers, newProvider]);
    setFormData({});
    setEditing(null);
  };

  const handleEdit = (provider: Provider) => {
    setEditing(provider.id);
    setFormData(provider);
  };

  const handleSave = () => {
    if (!editing) return;
    onUpdate(providers.map(p => p.id === editing ? { ...p, ...formData } : p));
    setEditing(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    onUpdate(providers.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Providers</h3>
        <Button onClick={() => setEditing('new')} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {editing && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editing === 'new' ? 'New Provider' : 'Edit Provider'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="OpenAI"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="openai"
                />
              </div>
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Provider['type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="openrouter">OpenRouter</SelectItem>
                  <SelectItem value="bedrock">AWS Bedrock</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Base URL</Label>
              <Input
                value={formData.baseUrl || ''}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
              />
            </div>

            <div>
              <Label>API Key Alias</Label>
              <Input
                value={formData.apiKeyAlias || ''}
                onChange={(e) => setFormData({ ...formData, apiKeyAlias: e.target.value })}
                placeholder="PROVIDER_API_KEY"
              />
            </div>

            <div>
              <Label>Get Key URL</Label>
              <Input
                value={formData.getKeyUrl || ''}
                onChange={(e) => setFormData({ ...formData, getKeyUrl: e.target.value })}
                placeholder="https://provider.com/api-keys"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={editing === 'new' ? handleAdd : handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={() => { setEditing(null); setFormData({}); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{provider.name}</CardTitle>
                  <CardDescription>{provider.slug} • {provider.type}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(provider)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(provider.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {provider.baseUrl && (
                  <div>
                    <span className="font-medium">Base URL:</span> {provider.baseUrl}
                  </div>
                )}
                <div>
                  <span className="font-medium">API Key Alias:</span> {provider.apiKeyAlias}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Get Key:</span>
                  <a
                    href={provider.getKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {provider.getKeyUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {provider.notes && (
                  <div>
                    <span className="font-medium">Notes:</span> {provider.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
