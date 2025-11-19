import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import type { Session } from '@/lib/types';
import { exportSessionAsJSON, exportSessionAsCSV, downloadFile } from '@/lib/export';

interface SessionControlProps {
  session: Session | null;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function SessionControl({ session, onStart, onPause, onReset }: SessionControlProps) {
  const handleExportJSON = () => {
    if (!session) return;
    const json = exportSessionAsJSON(session);
    downloadFile(json, `session-${session.id}.json`, 'application/json');
  };

  const handleExportCSV = () => {
    if (!session) return;
    const csv = exportSessionAsCSV(session);
    downloadFile(csv, `session-${session.id}.csv`, 'text/csv');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {!session || session.status === 'idle' || session.status === 'paused' ? (
            <Button onClick={onStart} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={onPause} variant="secondary" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={onReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {session && (
          <>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">{session.status}</span>
              </div>
              <div>
                <span className="font-medium">Turn:</span> {session.currentTurn}
              </div>
              <div>
                <span className="font-medium">Messages:</span> {session.messages.length}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExportJSON} variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
              <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
