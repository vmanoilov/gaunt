import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Message } from '@/lib/types';
import { calculateAverageScore } from '@/lib/scoring';

interface MetricsPanelProps {
  messages: Message[];
}

export function MetricsPanel({ messages }: MetricsPanelProps) {
  const avgScore = calculateAverageScore(messages);

  const metrics = [
    { label: 'Novelty', value: avgScore.novelty, color: 'text-blue-400' },
    { label: 'Feasibility', value: avgScore.feasibility, color: 'text-green-400' },
    { label: 'Value Impact', value: avgScore.valueImpact, color: 'text-purple-400' },
    { label: 'Safety', value: avgScore.safety, color: 'text-yellow-400' },
    { label: 'Exploration', value: avgScore.explorationIndex, color: 'text-pink-400' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className={`text-sm font-bold ${metric.color}`}>
                  {metric.value.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')}`}
                  style={{ width: `${Math.min(100, metric.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
