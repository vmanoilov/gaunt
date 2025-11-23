import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Message } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ArenaProps {
  messages: Message[];
}

const roleColors = {
  human: 'bg-[#2b3a4b]',
  red: 'bg-[#7f1d1d]',
  blue: 'bg-[#113c5a]',
  purple: 'bg-[#4b2b58]',
};

// Use centralized role mapping for consistency
const roleLabels = {
  human: 'Human',
  red: 'Red',
  blue: 'Blue',
  purple: 'Purple',
};

export function Arena({ messages }: ArenaProps) {
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Arena</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No messages yet. Start a session to begin the Gauntlet.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'p-4 rounded-lg',
                    roleColors[message.role]
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{roleLabels[message.role]}</div>
                    <div className="text-xs opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                  
                  <div className="text-sm mb-3">{message.content}</div>
                  
                  {message.score && (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Novelty: {message.score.novelty.toFixed(0)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Feasibility: {message.score.feasibility.toFixed(0)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Value: {message.score.valueImpact.toFixed(0)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Safety: {message.score.safety.toFixed(0)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Exploration: {message.score.explorationIndex.toFixed(0)}
                      </Badge>
                    </div>
                  )}
                  
                  {(message.apiEndpoint || message.requestBody) && (
                    <div className="mt-2 text-xs opacity-60">
                      {message.apiEndpoint && <div>{message.apiEndpoint}</div>}
                      {message.requestBody && <div>{message.requestBody}</div>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
