import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ProvidersTab } from './ProvidersTab';
import { ModelsTab } from './ModelsTab';
import { SecretsTab } from './SecretsTab';
import type { AppState } from '@/lib/types';

interface AdminPanelProps {
  state: AppState;
  onUpdateState: (state: AppState) => void;
}

export function AdminPanel({ state, onUpdateState }: AdminPanelProps) {
  const handleModelsDiscovered = (providerId: string, models: string[]) => {
    const updatedProviders = state.providers.map(p => 
      p.id === providerId ? { ...p, models } : p
    );
    onUpdateState({ ...state, providers: updatedProviders });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <Tabs defaultValue="providers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-4">
          <ProvidersTab
            providers={state.providers}
            onUpdate={(providers) => onUpdateState({ ...state, providers })}
          />
        </TabsContent>

        <TabsContent value="secrets" className="mt-4">
          <SecretsTab
            providers={state.providers}
            secrets={state.secrets}
            onUpdate={(secrets) => onUpdateState({ ...state, secrets })}
            onModelsDiscovered={handleModelsDiscovered}
          />
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <ModelsTab
            providers={state.providers}
            models={state.models}
            secrets={state.secrets}
            onUpdate={(models) => onUpdateState({ ...state, models })}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
