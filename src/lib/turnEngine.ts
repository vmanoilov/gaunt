import { callModel } from './connectors';
import { calculateHeuristicScore } from './scoring';
import type { Agent, AppState, Message, Session } from './types';
import { generateId } from './utils';

// Turn execution state
export interface TurnState {
  isRunning: boolean;
  isPaused: boolean;
  shouldStop: boolean;
  skipNext: boolean;
  currentAgentIndex: number;
  roleOrder: Array<'red' | 'blue' | 'purple'>;
}

// Initialize turn state
export function initializeTurnState(): TurnState {
  return {
    isRunning: false,
    isPaused: false,
    shouldStop: false,
    skipNext: false,
    currentAgentIndex: 0,
    roleOrder: ['red', 'blue', 'purple']
  };
}

/**
 * Execute a complete turn cycle with all agents sequentially.
 * Each agent sees the full conversation history including messages from the current turn.
 * Messages appear immediately as they're generated.
 */
export async function executeTurn(
  session: Session,
  agents: Agent[],
  turnState: TurnState,
  appState: AppState,
  onMessageGenerated?: (message: Message) => void
): Promise<Message[]> {
  const newMessages: Message[] = [];
  turnState.isRunning = true;
  turnState.shouldStop = false;
  turnState.currentAgentIndex = 0;
  
  for (let i = 0; i < turnState.roleOrder.length; i++) {
    // Check if we should stop execution
    if (turnState.shouldStop) {
      break;
    }
    
    // Check if we should skip this agent
    if (turnState.skipNext) {
      turnState.skipNext = false;
      turnState.currentAgentIndex++;
      continue;
    }
    
    turnState.currentAgentIndex = i;
    const role = turnState.roleOrder[i];
    const agent = agents.find(a => a.role === role);
    
    if (!agent) {
      turnState.currentAgentIndex++;
      continue;
    }
    
    // Pass all messages so far (including current turn) for full context
    const message = await generateAgentMessage(agent, session, newMessages, appState);
    newMessages.push(message);
    
    // Update session with the new message immediately
    session.messages.push(message);
    
    // Immediately notify caller of new message (for real-time display)
    if (onMessageGenerated) {
      onMessageGenerated(message);
    }
    
    turnState.currentAgentIndex++;
  }
  
  turnState.isRunning = false;
  return newMessages;
}

/**
 * Compute the next participant in the turn order
 */
export function getNextParticipant(turnState: TurnState): 'red' | 'blue' | 'purple' | null {
  if (turnState.currentAgentIndex >= turnState.roleOrder.length) {
    return null; // All agents have taken their turn
  }
  return turnState.roleOrder[turnState.currentAgentIndex];
}

/**
 * Skip the current agent's turn
 */
export function skipCurrentAgent(turnState: TurnState): void {
  turnState.skipNext = true;
}

/**
 * Stop the turn execution immediately
 */
export function stopTurnExecution(turnState: TurnState): void {
  turnState.shouldStop = true;
}

/**
 * Pause the turn execution after current agent
 */
export function pauseTurnExecution(turnState: TurnState): void {
  turnState.isPaused = true;
}

/**
 * Execute a single agent's turn (for manual mode)
 */
export async function executeAgentTurn(
  agent: Agent,
  session: Session,
  appState: AppState,
  onMessageGenerated?: (message: Message) => void
): Promise<Message> {
  const message = await generateAgentMessage(agent, session, [], appState);
  
  // Update session with the new message immediately
  session.messages.push(message);
  
  if (onMessageGenerated) {
    onMessageGenerated(message);
  }
  
  return message;
}

/**
 * Generate a single agent message with full context awareness.
 * The agent sees:
 * - The seed prompt
 * - All previous messages from the session
 * - All messages from the current turn so far
 */
async function generateAgentMessage(
  agent: Agent,
  session: Session,
  currentTurnMessages: Message[],
  appState: AppState
): Promise<Message> {
  // Full conversation history: previous turns + current turn
  const allMessages = [...session.messages, ...currentTurnMessages];
  
  // Try to call real API first, fall back to mock if no API key or error
  let content: string;
  if (appState && agent.providerId && agent.modelId) {
    try {
      const provider = appState.providers.find(p => p.id === agent.providerId);
      if (provider) {
        const result = await callModel(provider, agent.modelId, allMessages, appState.secrets, {
          temperature: agent.temperature || 0.7,
          maxTokens: 1000
        });

        if (result.success && result.content) {
          content = result.content;
        } else {
          // Fall back to mock response
          content = generateMockResponse(agent, session.seedPrompt, allMessages);
        }
      } else {
        content = generateMockResponse(agent, session.seedPrompt, allMessages);
      }
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      content = generateMockResponse(agent, session.seedPrompt, allMessages);
    }
  } else {
    // No API configuration, use mock response
    content = generateMockResponse(agent, session.seedPrompt, allMessages);
  }
  
  const message: Message = {
    id: generateId(),
    agentId: agent.id,
    role: agent.role,
    content,
    timestamp: Date.now(),
    apiEndpoint: agent.providerId ? `Provider: ${agent.providerId}` : undefined,
    requestBody: agent.modelId ? `Model: ${agent.modelId}` : undefined,
  };
  
  // Calculate score based on full context
  message.score = calculateHeuristicScore(message, allMessages);
  
  return message;
}

/**
 * Generate mock responses that reflect the new color semantics:
 * - RED = Attacker / challenger / adversarial mind
 * - BLUE = Defender / stabilizer / constraints
 * - PURPLE = Integrator / mediator / sanity
 * 
 * Each response builds on previous messages for context awareness.
 */
function generateMockResponse(
  agent: Agent,
  seedPrompt: string,
  previousMessages: Message[]
): string {
  const responses = {
    red: [
      `Challenging the seed prompt "${seedPrompt}": What if we completely invert the assumptions? Let's attack the conventional approach and explore radical alternatives that break the rules.`,
      `I'm pushing back on the established thinking here. The current direction is too safe. Let me propose three aggressive alternatives that challenge the status quo: 1) Eliminate the primary constraint, 2) Reverse the problem entirely, 3) Apply chaos theory to force innovation.`,
      `Attacking from a different angle: What if everything we've discussed is solving the wrong problem? Let me challenge the fundamental premise and propose a disruptive counter-narrative.`,
      `Time to be adversarial. The ideas so far are incremental. I'm going to challenge every assumption and push for breakthrough thinking that makes people uncomfortable. Here's why the conventional wisdom is wrong...`,
    ],
    blue: [
      `Defending against the Red agent's aggressive proposals: While provocative, we need to consider practical constraints. Here are the critical safeguards we must maintain: 1) Regulatory compliance, 2) Resource limitations, 3) Risk mitigation. Let's stabilize this approach.`,
      `Holding the line on feasibility. The Red agent's ideas are interesting but dangerous without proper constraints. I'm establishing defensive boundaries: technical feasibility, budget reality, timeline constraints, and safety requirements.`,
      `Defending the established framework: Not all disruption is valuable. Let me outline why certain constraints exist and why we should respect them. Here's a measured, defensive analysis of what's actually achievable.`,
      `Stabilizing the conversation: The Red agent is pushing too hard into risky territory. Let me defend the practical approach with evidence-based constraints and realistic boundaries. Here's what we can actually defend and deliver.`,
    ],
    purple: [
      `Integrating the attack and defense perspectives: Red challenges us to think bigger, Blue keeps us grounded. Here's a balanced synthesis that preserves innovation while respecting constraints. The middle path forward is...`,
      `Mediating between aggressive innovation and defensive pragmatism: Both perspectives have merit. Let me propose an integrated solution that captures Red's boldness within Blue's safety framework. Here's the sanity check...`,
      `Finding the integration point: Red's challenges reveal opportunities, Blue's defenses reveal necessities. The synthesized approach combines breakthrough thinking with practical execution. Here's the balanced strategy...`,
      `Bringing sanity to the debate: We don't need to choose between disruption and stability. Let me integrate both viewpoints into a coherent, executable plan that satisfies both the attacker's ambition and the defender's caution.`,
    ],
  };
  
  const roleResponses = responses[agent.role as keyof typeof responses];
  if (!roleResponses) {
    return `As a ${agent.role} agent, I'm processing the information and formulating a response based on the seed prompt: "${seedPrompt}"`;
  }
  
  // Build on previous context
  const previousRoleMessages = previousMessages.filter(m => m.role === agent.role);
  const otherMessages = previousMessages.filter(m => m.role !== agent.role && m.role !== 'human');
  
  let contextPrefix = '';
  if (otherMessages.length > 0) {
    const lastOther = otherMessages[otherMessages.length - 1];
    contextPrefix = `Building on ${lastOther.role}'s point: `;
  }
  
  const index = previousRoleMessages.length % roleResponses.length;
  return contextPrefix + roleResponses[index];
}

/**
 * Check if a turn can be executed (all required agents present)
 */
export function canExecuteTurn(session: Session, agents: Agent[]): boolean {
  const requiredRoles: Array<'red' | 'blue' | 'purple'> = ['red', 'blue', 'purple'];
  return requiredRoles.every(role => agents.some(a => a.role === role));
}

