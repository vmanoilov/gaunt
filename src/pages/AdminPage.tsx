import { useState, useEffect } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import type { AppState } from '@/lib/types';
import { DEFAULT_PROVIDERS } from '@/lib/providers';
import { loadState, saveState } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    if (loaded) return loaded;
    
    return {
      providers: DEFAULT_PROVIDERS,
      models: [],
      secrets: [],
      connectors: [],
      settings: {
        telemetry: false,
        timeoutMs: 30000,
      },
      sessions: [],
    };
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <header className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Arena
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Configure providers, models, and API keys
            </p>
          </div>
        </header>

        <AdminPanel state={state} onUpdateState={setState} />
      </div>
    </div>
  );
}
