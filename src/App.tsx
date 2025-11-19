import { useState, useEffect } from 'react';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { SessionControl } from '@/components/session/SessionControl';
import { Arena } from '@/components/session/Arena';
import { MetricsPanel } from '@/components/session/MetricsPanel';
import { Participants } from '@/components/session/Participants';
import { PromptInjector } from '@/components/session/PromptInjector';
import type { AppState, Session, Agent } from '@/lib/types';
import { DEFAULT_PROVIDERS } from '@/lib/providers';
import { loadState, saveState } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { executeTurn, canExecuteTurn } from '@/lib/turnEngine';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-red',
    name: 'Gemini Red',
    role: 'red',
    modelId: 'gemini-pro',
    providerId: 'google',
    temperature: 0.9,
  },
  {
    id: 'agent-blue',
    name: 'Mistral Blue',
    role: 'blue',
    modelId: 'mistral-large',
    providerId: 'mistral',
    temperature: 0.5,
  },
  {
    id: 'agent-purple',
    name: 'GPT Purple',
    role: 'purple',
    modelId: 'gpt-4',
    providerId: 'openai',
    temperature: 0.7,
  },
];

function App() {
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

  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleStartSession = async () => {
    if (currentSession?.status === 'running') {
      toast.info('Session already running');
      return;
    }

    let session = currentSession;
    
    if (!session || session.status === 'idle') {
      session = {
        id: generateId(),
        seedPrompt: 'Explore innovative solutions for sustainable urban transportation',
        agents: DEFAULT_AGENTS,
        messages: [],
        currentTurn: 0,
        status: 'running',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCurrentSession(session);
    } else {
      session = { ...session, status: 'running' };
      setCurrentSession(session);
    }

    if (!canExecuteTurn(session, session.agents)) {
      toast.error('Missing required agents (Red, Blue, Purple)');
      return;
    }

    try {
      const newMessages = await executeTurn(session, session.agents);
      const updatedSession = {
        ...session,
        messages: [...session.messages, ...newMessages],
        currentTurn: session.currentTurn + 1,
        updatedAt: Date.now(),
      };
      setCurrentSession(updatedSession);
      toast.success(`Turn ${updatedSession.currentTurn} completed`);
    } catch (error) {
      toast.error('Failed to execute turn');
      console.error(error);
    }
  };

  const handlePauseSession = () => {
    if (!currentSession) return;
    setCurrentSession({ ...currentSession, status: 'paused' });
    toast.info('Session paused');
  };

  const handleResetSession = () => {
    setCurrentSession(null);
    toast.info('Session reset');
  };

  const handleUpdatePrompt = (prompt: string) => {
    if (!currentSession) return;
    setCurrentSession({ ...currentSession, seedPrompt: prompt });
    toast.success('Prompt updated');
  };

  const handleUpdateAgent = (agentId: string, updates: Partial<Agent>) => {
    if (!currentSession) return;
    const updatedAgents = currentSession.agents.map(agent =>
      agent.id === agentId ? { ...agent, ...updates } : agent
    );
    setCurrentSession({ ...currentSession, agents: updatedAgents });
    toast.success('Agent updated');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">GauntletFuse</h1>
          <p className="text-muted-foreground">
            Multi-Agent Creative Exploration Platform
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <SessionControl
              session={currentSession}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onReset={handleResetSession}
            />
            {currentSession && (
              <>
                <Participants 
                  agents={currentSession.agents}
                  models={state.models}
                  providers={state.providers}
                  secrets={state.secrets}
                  onUpdateAgent={handleUpdateAgent}
                />
                <MetricsPanel messages={currentSession.messages} />
              </>
            )}
          </div>

          <div className="xl:col-span-2">
            <Arena messages={currentSession?.messages || []} />
          </div>

          <div className="xl:col-span-1 space-y-6">
            {currentSession && (
              <PromptInjector
                seedPrompt={currentSession.seedPrompt}
                onUpdate={handleUpdatePrompt}
              />
            )}
            <AdminPanel state={state} onUpdateState={setState} />
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-6">
          <p>
            GauntletFuse uses Red→Blue→Purple cycle for creative exploration.
            Configure providers and models in the Admin Panel.
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
