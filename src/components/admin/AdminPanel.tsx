import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ProvidersTab } from './ProvidersTab';
import type { AppState } from '@/lib/types';

interface AdminPanelProps {
  state: AppState;
  onUpdateState: (state: AppState) => void;
}

export function AdminPanel({ state, onUpdateState }: AdminPanelProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <Tabs defaultValue="providers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-4">
          <ProvidersTab
            providers={state.providers}
            onUpdate={(providers) => onUpdateState({ ...state, providers })}
          />
        </TabsContent>

        <TabsContent value="models" className="mt-4">
          <div className="text-center py-8 text-muted-foreground">
            Models management - Configure AI models for each provider
          </div>
        </TabsContent>

        <TabsContent value="secrets" className="mt-4">
          <div className="text-center py-8 text-muted-foreground">
            Secrets management - Store encrypted API keys
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
