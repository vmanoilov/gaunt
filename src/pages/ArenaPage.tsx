import { useState, useEffect, useRef } from 'react';
import { SessionControl } from '@/components/session/SessionControl';
import { Arena } from '@/components/session/Arena';
import { MetricsPanel } from '@/components/session/MetricsPanel';
import { Participants } from '@/components/session/Participants';
import { PromptInjector } from '@/components/session/PromptInjector';
import type { AppState, Session, Agent, Message } from '@/lib/types';
import { loadState } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import {
  executeTurn,
  canExecuteTurn,
  initializeTurnState,
  skipCurrentAgent,
  stopTurnExecution,
  pauseTurnExecution,
  getNextParticipant,
  executeAgentTurn,
  type TurnState
} from '@/lib/turnEngine';
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
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [turnState, setTurnState] = useState<TurnState>(initializeTurnState());
  const autoRunRef = useRef(false);

  useEffect(() => {
    const loaded = loadState();
    if (loaded) {
      setState(loaded);
    }
  }, []);

  // Auto-run effect: continuously execute turns while running
  useEffect(() => {
    autoRunRef.current = isAutoRunning;
    
    if (isAutoRunning && currentSession) {
      executeTurnCycle();
    }
  }, [isAutoRunning]);

  const executeTurnCycle = async () => {
    if (!currentSession || !autoRunRef.current) return;

    if (!canExecuteTurn(currentSession, currentSession.agents)) {
      toast.error('Missing required agents (Red, Blue, Purple)');
      setIsAutoRunning(false);
      return;
    }

    try {
      // Execute turn with sequential execution and immediate message visibility
      const newTurnState = { ...turnState };
      
      await executeTurn(
        currentSession,
        currentSession.agents,
        newTurnState,
        state!,
        (message) => {
          // Immediately add message to session as it's generated
          setCurrentSession(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, message],
              updatedAt: Date.now(),
            };
          });
        }
      );

      // Update turn state
      setTurnState(newTurnState);

      // Update turn counter after all messages
      setCurrentSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentTurn: prev.currentTurn + 1,
          updatedAt: Date.now(),
        };
      });

      // Continue to next turn if still running
      if (autoRunRef.current && !newTurnState.isPaused) {
        // Small delay between turns for readability
        setTimeout(() => {
          if (autoRunRef.current) {
            executeTurnCycle();
          }
        }, 1000);
      }
    } catch (error) {
      toast.error('Failed to execute turn');
      console.error(error);
      setIsAutoRunning(false);
    }
  };

  const handleManualAgentExecution = async (agentId: string) => {
    if (!currentSession) return;
    
    const agent = currentSession.agents.find(a => a.id === agentId);
    if (!agent) {
      toast.error('Agent not found');
      return;
    }

    try {
      await executeAgentTurn(
        agent,
        currentSession,
        state!,
        (message) => {
          // Immediately add message to session as it's generated
          setCurrentSession(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, message],
              updatedAt: Date.now(),
            };
          });
        }
      );
      
      toast.success(`Executed ${agent.name} turn`);
    } catch (error) {
      toast.error(`Failed to execute ${agent.name} turn`);
      console.error(error);
    }
  };

  const handleSkipCurrentAgent = () => {
    const newTurnState = { ...turnState };
    skipCurrentAgent(newTurnState);
    setTurnState(newTurnState);
    toast.info('Skipping current agent');
  };

  const handleStopExecution = () => {
    const newTurnState = { ...turnState };
    stopTurnExecution(newTurnState);
    setTurnState(newTurnState);
    setIsAutoRunning(false);
    toast.info('Turn execution stopped');
  };

  const handleStartSession = () => {
    if (isAutoRunning) {
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

    setIsAutoRunning(true);
    toast.success('Session started - running automatically');
  };

  const handlePauseSession = () => {
    if (!currentSession) return;
    setIsAutoRunning(false);
    setCurrentSession({ ...currentSession, status: 'paused' });
    toast.info('Session paused');
  };

  const handleStopSession = () => {
    setIsAutoRunning(false);
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: 'completed' });
    }
    toast.info('Session stopped');
  };

  const handleResetSession = () => {
    setIsAutoRunning(false);
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
    toast.success('Agent updated - hot-swapped successfully');
  };

  const handleAddAgent = (agent: Agent) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      agents: [...currentSession.agents, agent],
    });
    toast.success('Agent added to session');
  };

  const handleRemoveAgent = (agentId: string) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      agents: currentSession.agents.filter(a => a.id !== agentId),
    });
    toast.success('Agent removed from session');
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
              isRunning={isAutoRunning}
              onStart={handleStartSession}
              onPause={handlePauseSession}
              onStop={handleStopSession}
              onReset={handleResetSession}
              onSkipCurrent={handleSkipCurrentAgent}
              onStopExecution={handleStopExecution}
            />
            {currentSession && state && (
              <>
                <Participants
                  agents={currentSession.agents}
                  models={state.models}
                  providers={state.providers}
                  secrets={state.secrets}
                  onUpdateAgent={handleUpdateAgent}
                  onManualExecute={handleManualAgentExecution}
                  isRunning={isAutoRunning}
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
