import type { Score, Message } from './types';

export function calculateHeuristicScore(message: Message, previousMessages: Message[]): Score {
  const content = message.content.toLowerCase();
  const wordCount = content.split(/\s+/).length;
  
  const novelty = calculateNovelty(content, previousMessages);
  const feasibility = calculateFeasibility(content);
  const valueImpact = calculateValueImpact(content, wordCount);
  const safety = calculateSafety(content);
  const explorationIndex = calculateExplorationIndex(novelty, feasibility);
  
  return {
    novelty: Math.min(100, Math.max(0, novelty)),
    feasibility: Math.min(100, Math.max(0, feasibility)),
    valueImpact: Math.min(100, Math.max(0, valueImpact)),
    safety: Math.min(100, Math.max(0, safety)),
    explorationIndex: Math.min(100, Math.max(0, explorationIndex)),
  };
}

function calculateNovelty(content: string, previousMessages: Message[]): number {
  if (previousMessages.length === 0) return 75;
  
  const words = new Set(content.split(/\s+/));
  const previousWords = new Set(
    previousMessages.flatMap(m => m.content.toLowerCase().split(/\s+/))
  );
  
  const uniqueWords = [...words].filter(w => !previousWords.has(w));
  const noveltyRatio = uniqueWords.length / words.size;
  
  return 50 + (noveltyRatio * 50);
}

function calculateFeasibility(content: string): number {
  const feasibilityKeywords = [
    'implement', 'build', 'create', 'develop', 'design',
    'practical', 'realistic', 'achievable', 'possible', 'feasible'
  ];
  
  const infeasibilityKeywords = [
    'impossible', 'unrealistic', 'impractical', 'unfeasible',
    'cannot', 'never', 'unlikely'
  ];
  
  let score = 60;
  
  feasibilityKeywords.forEach(keyword => {
    if (content.includes(keyword)) score += 5;
  });
  
  infeasibilityKeywords.forEach(keyword => {
    if (content.includes(keyword)) score -= 10;
  });
  
  return score;
}

function calculateValueImpact(content: string, wordCount: number): number {
  const valueKeywords = [
    'benefit', 'improve', 'enhance', 'optimize', 'valuable',
    'important', 'significant', 'impact', 'effective', 'efficient'
  ];
  
  let score = 50;
  
  valueKeywords.forEach(keyword => {
    if (content.includes(keyword)) score += 6;
  });
  
  if (wordCount > 50) score += 10;
  if (wordCount > 100) score += 10;
  
  return score;
}

function calculateSafety(content: string): number {
  const unsafeKeywords = [
    'dangerous', 'harmful', 'risky', 'unsafe', 'threat',
    'damage', 'destroy', 'attack', 'exploit', 'vulnerability'
  ];
  
  const safeKeywords = [
    'safe', 'secure', 'protected', 'reliable', 'stable',
    'tested', 'verified', 'validated'
  ];
  
  let score = 80;
  
  unsafeKeywords.forEach(keyword => {
    if (content.includes(keyword)) score -= 15;
  });
  
  safeKeywords.forEach(keyword => {
    if (content.includes(keyword)) score += 5;
  });
  
  return score;
}

function calculateExplorationIndex(novelty: number, feasibility: number): number {
  return (novelty * 0.6) + (feasibility * 0.4);
}

export function calculateAverageScore(messages: Message[]): Score {
  if (messages.length === 0) {
    return {
      novelty: 0,
      feasibility: 0,
      valueImpact: 0,
      safety: 0,
      explorationIndex: 0,
    };
  }
  
  const scores = messages.filter(m => m.score).map(m => m.score!);
  
  if (scores.length === 0) {
    return {
      novelty: 0,
      feasibility: 0,
      valueImpact: 0,
      safety: 0,
      explorationIndex: 0,
    };
  }
  
  return {
    novelty: scores.reduce((sum, s) => sum + s.novelty, 0) / scores.length,
    feasibility: scores.reduce((sum, s) => sum + s.feasibility, 0) / scores.length,
    valueImpact: scores.reduce((sum, s) => sum + s.valueImpact, 0) / scores.length,
    safety: scores.reduce((sum, s) => sum + s.safety, 0) / scores.length,
    explorationIndex: scores.reduce((sum, s) => sum + s.explorationIndex, 0) / scores.length,
  };
}
