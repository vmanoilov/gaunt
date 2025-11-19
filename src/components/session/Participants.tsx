import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/lib/types';

interface ParticipantsProps {
  agents: Agent[];
}

const roleColors = {
  human: 'bg-[#2b3a4b]',
  red: 'bg-[#7f1d1d]',
  blue: 'bg-[#113c5a]',
  purple: 'bg-[#4b2b58]',
};

const roleLabels = {
  human: 'Human',
  red: 'Red',
  blue: 'Blue',
  purple: 'Purple',
};

export function Participants({ agents }: ParticipantsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-3 rounded-lg bg-card border"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{agent.name}</div>
                <Badge className={roleColors[agent.role]}>
                  {roleLabels[agent.role]}
                </Badge>
              </div>
              {agent.modelId && (
                <div className="text-xs text-muted-foreground">
                  Model: {agent.modelId}
                </div>
              )}
              {agent.temperature !== undefined && (
                <div className="text-xs text-muted-foreground">
                  Temperature: {agent.temperature}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
