import { useState, useEffect } from 'react';
import { SessionControl } from '@/components/session/SessionControl';
import { Arena } from '@/components/session/Arena';
import { MetricsPanel } from '@/components/session/MetricsPanel';
import { Participants } from '@/components/session/Participants';
import { PromptInjector } from '@/components/session/PromptInjector';
import type { AppState, Session, Agent } from '@/lib/types';
import { loadState } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { executeTurn, canExecuteTurn } from '@/lib/turnEngine';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-red',
    name: 'Red Agent',
    role: 'red',
    temperature: 0.9,
  },
  {
    id: 'agent-blue',
    name: 'Blue Agent',
    role: 'blue',
    temperature: 0.5,
  },
  {
    id: 'agent-purple',
    name: 'Purple Agent',
    role: 'purple',
    temperature: 0.7,
  },
];

export default function ArenaPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const loaded = loadState();
    if (loaded) {
      setState(loaded);
    }
  }, []);

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
        <header className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold">Gaunt Arena</h1>
            <p className="text-muted-foreground">
              Multi-Model Creative Exploration Platform
            </p>
          </div>
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <SessionControl
              session={currentSession}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onReset={handleResetSession}
            />
            {currentSession && state && (
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
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-6">
          <p>
            Gaunt uses Red→Blue→Purple cycle for creative exploration.
            Configure providers and models in the Admin Panel.
          </p>
        </footer>
      </div>
    </div>
  );
}
