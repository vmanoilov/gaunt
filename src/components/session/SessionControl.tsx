import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw, Download, SkipForward, StopCircle } from 'lucide-react';
import type { Session } from '@/lib/types';
import { exportSessionAsJSON, exportSessionAsCSV, downloadFile } from '@/lib/export';

interface SessionControlProps {
  session: Session | null;
  isRunning?: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop?: () => void;
  onReset: () => void;
  onSkipCurrent?: () => void;
  onStopExecution?: () => void;
}

export function SessionControl({
  session,
  isRunning = false,
  onStart,
  onPause,
  onStop,
  onReset,
  onSkipCurrent,
  onStopExecution
}: SessionControlProps) {
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
          {!isRunning ? (
            <Button onClick={onStart} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          ) : (
            <Button onClick={onPause} variant="secondary" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          {onStop && (
            <Button onClick={onStop} variant="destructive" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        {isRunning && (onSkipCurrent || onStopExecution) && (
          <div className="flex gap-2">
            {onSkipCurrent && (
              <Button onClick={onSkipCurrent} variant="outline" className="flex-1">
                <SkipForward className="w-4 h-4 mr-2" />
                Skip Current
              </Button>
            )}
            {onStopExecution && (
              <Button onClick={onStopExecution} variant="destructive" className="flex-1">
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Execution
              </Button>
            )}
          </div>
        )}

        {session && (
          <>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="capitalize">
                  {isRunning ? 'running' : session.status}
                </span>
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
