import type { Agent, Message, Session } from './types';
import { generateId } from './utils';
import { calculateHeuristicScore } from './scoring';

export async function executeTurn(
  session: Session,
  agents: Agent[]
): Promise<Message[]> {
  const newMessages: Message[] = [];
  const roleOrder: Array<'red' | 'blue' | 'purple'> = ['red', 'blue', 'purple'];
  
  for (const role of roleOrder) {
    const agent = agents.find(a => a.role === role);
    if (!agent) continue;
    
    const message = await generateAgentMessage(agent, session, newMessages);
    newMessages.push(message);
  }
  
  return newMessages;
}

async function generateAgentMessage(
  agent: Agent,
  session: Session,
  currentTurnMessages: Message[]
): Promise<Message> {
  const allMessages = [...session.messages, ...currentTurnMessages];
  
  const content = generateMockResponse(agent, session.seedPrompt, allMessages);
  
  const message: Message = {
    id: generateId(),
    agentId: agent.id,
    role: agent.role,
    content,
    timestamp: Date.now(),
    apiEndpoint: agent.providerId ? `Provider: ${agent.providerId}` : undefined,
    requestBody: agent.modelId ? `Model: ${agent.modelId}` : undefined,
  };
  
  message.score = calculateHeuristicScore(message, allMessages);
  
  return message;
}

function generateMockResponse(
  agent: Agent,
  seedPrompt: string,
  previousMessages: Message[]
): string {
  const responses = {
    red: [
      `Building on the seed prompt "${seedPrompt}", I propose we explore unconventional approaches that challenge traditional assumptions. What if we completely reimagine the problem space?`,
      `Let's diverge from conventional thinking. Here are three radical ideas: 1) Invert the problem entirely, 2) Apply principles from an unrelated domain, 3) Remove the most obvious constraint.`,
      `I'm thinking outside the box here. What if we combined elements that typically don't go together? This could lead to breakthrough innovations.`,
      `Let me push the boundaries further. Consider this: what would happen if we scaled this idea 10x or reduced it to 1/10th? The extremes often reveal hidden opportunities.`,
    ],
    blue: [
      `Evaluating the Red agent's proposal: While creative, we need to consider practical constraints. The feasibility score is moderate due to resource requirements and timeline considerations.`,
      `Critical analysis: The idea has merit but faces three key challenges: 1) Technical complexity, 2) Market readiness, 3) Regulatory considerations. Let's address these systematically.`,
      `From an evaluator's perspective, this approach scores well on novelty (85/100) but needs refinement on implementation details. Here's what needs work...`,
      `Assessing risks and benefits: The potential value impact is significant, but we must weigh it against safety concerns and feasibility constraints. My recommendation is to proceed with modifications.`,
    ],
    purple: [
      `Synthesizing the divergent and evaluative perspectives: I propose a balanced approach that preserves the innovative core while addressing practical concerns. Here's the integrated solution...`,
      `Bringing together Red's creativity and Blue's pragmatism, I suggest we: 1) Adopt the novel framework, 2) Implement Blue's risk mitigation strategies, 3) Phase the rollout to manage complexity.`,
      `The optimal path forward combines elements from both perspectives. We can achieve the innovative vision by breaking it into achievable milestones with built-in validation checkpoints.`,
      `Integration complete: By merging the bold vision with practical constraints, we arrive at a solution that's both groundbreaking and executable. Here's the unified strategy...`,
    ],
  };
  
  const roleResponses = responses[agent.role as keyof typeof responses];
  if (!roleResponses) {
    return `As a ${agent.role} agent, I'm processing the information and formulating a response based on the seed prompt: "${seedPrompt}"`;
  }
  
  const index = previousMessages.filter(m => m.role === agent.role).length % roleResponses.length;
  return roleResponses[index];
}

export function canExecuteTurn(session: Session, agents: Agent[]): boolean {
  const requiredRoles: Array<'red' | 'blue' | 'purple'> = ['red', 'blue', 'purple'];
  return requiredRoles.every(role => agents.some(a => a.role === role));
}
