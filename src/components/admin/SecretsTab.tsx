import { useState } from 'react';
import type { Provider, Secret } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Key, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { encryptSecret, decryptSecret } from '@/lib/secrets';
import { useToast } from '@/hooks/use-toast';

interface SecretsTabProps {
  providers: Provider[];
  secrets: Secret[];
  onUpdate: (secrets: Secret[]) => void;
  onModelsDiscovered: (providerId: string, models: string[]) => void;
}

export function SecretsTab({ providers, secrets, onUpdate, onModelsDiscovered }: SecretsTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [discovering, setDiscovering] = useState(false);
  const { toast } = useToast();

  const hasSecret = (providerId: string) => {
    return secrets.some(s => s.alias === providers.find(p => p.id === providerId)?.apiKeyAlias);
  };

  const openDialog = (provider: Provider) => {
    setSelectedProvider(provider);
    const existingSecret = secrets.find(s => s.alias === provider.apiKeyAlias);
    if (existingSecret && passphrase) {
      try {
        const decrypted = decryptSecret(existingSecret.valueEncrypted, passphrase);
        setApiKey(decrypted);
      } catch {
        setApiKey('');
      }
    } else {
      setApiKey('');
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedProvider(null);
    setApiKey('');
    setShowKey(false);
  };

  const handleSaveSecret = () => {
    if (!selectedProvider || !apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    if (!passphrase || passphrase.length < 8) {
      toast({
        title: 'Error',
        description: 'Please set a passphrase (minimum 8 characters)',
        variant: 'destructive',
      });
      return;
    }

    try {
      const encrypted = encryptSecret(apiKey, passphrase);
      const newSecrets = secrets.filter(s => s.alias !== selectedProvider.apiKeyAlias);
      newSecrets.push({
        alias: selectedProvider.apiKeyAlias,
        valueEncrypted: encrypted,
      });
      onUpdate(newSecrets);
      toast({
        title: 'Success',
        description: 'API key saved securely',
      });
      closeDialog();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to encrypt API key',
        variant: 'destructive',
      });
    }
  };

  const handleDiscoverModels = async () => {
    if (!selectedProvider || !apiKey) return;

    setDiscovering(true);
    
    // FutureServer: This will call real API to discover models
    // For now, simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockModels: Record<string, string[]> = {
      'openai': ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
      'google': ['gemini-pro', 'gemini-pro-vision', 'gemini-ultra'],
      'anthropic': ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2.1'],
      'mistral': ['mistral-large', 'mistral-medium', 'mistral-small', 'mistral-tiny'],
      'cohere': ['command', 'command-light', 'command-nightly'],
      'deepseek': ['deepseek-chat', 'deepseek-coder'],
      'moonshot': ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    };

    const providerSlug = selectedProvider.slug.toLowerCase();
    const models = mockModels[providerSlug] || ['model-1', 'model-2', 'model-3'];

    onModelsDiscovered(selectedProvider.id, models);
    
    toast({
      title: 'Models Discovered',
      description: `Found ${models.length} available models for ${selectedProvider.name}`,
    });

    setDiscovering(false);
  };

  const handleDeleteSecret = (alias: string) => {
    onUpdate(secrets.filter(s => s.alias !== alias));
    toast({
      title: 'Success',
      description: 'API key removed',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-sm text-muted-foreground">Manage encrypted API keys for providers</p>
        </div>
      </div>

      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-base">Master Passphrase</CardTitle>
          <CardDescription>
            Required to encrypt/decrypt API keys. Minimum 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter master passphrase"
              className="max-w-md"
            />
            {passphrase.length >= 8 && (
              <CheckCircle className="w-5 h-5 text-green-500 mt-2" />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {providers.map((provider) => {
          const hasKey = hasSecret(provider.id);
          return (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription>{provider.apiKeyAlias}</CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    {hasKey ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Button variant="outline" size="sm" onClick={() => openDialog(provider)}>
                          Update Key
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteSecret(provider.apiKeyAlias)}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                        <Button size="sm" onClick={() => openDialog(provider)}>
                          <Key className="w-4 h-4 mr-2" />
                          Add Key
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedProvider ? `API Key for ${selectedProvider.name}` : 'API Key'}
            </DialogTitle>
            <DialogDescription>
              Enter your API key. It will be encrypted with your master passphrase.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {selectedProvider && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Get your API key from:</span>
                <a
                  href={selectedProvider.getKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {selectedProvider.name}
                </a>
              </div>
            )}

            {apiKey && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDiscoverModels}
                disabled={discovering}
              >
                {discovering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Discovering Models...
                  </>
                ) : (
                  'Discover Available Models'
                )}
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveSecret}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
