import type { Session, AppState } from './types';
import { encryptSecret } from './secrets';

export function exportSessionAsJSON(session: Session): string {
  return JSON.stringify(session, null, 2);
}

export function exportSessionAsCSV(session: Session): string {
  const headers = [
    'Timestamp',
    'Agent ID',
    'Role',
    'Content',
    'Novelty',
    'Feasibility',
    'Value Impact',
    'Safety',
    'Exploration Index',
  ];
  
  const rows = session.messages.map(msg => [
    new Date(msg.timestamp).toISOString(),
    msg.agentId,
    msg.role,
    `"${msg.content.replace(/"/g, '""')}"`,
    msg.score?.novelty.toFixed(2) || '',
    msg.score?.feasibility.toFixed(2) || '',
    msg.score?.valueImpact.toFixed(2) || '',
    msg.score?.safety.toFixed(2) || '',
    msg.score?.explorationIndex.toFixed(2) || '',
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportAppState(state: AppState, passphrase: string): string {
  const encrypted = encryptSecret(JSON.stringify(state), passphrase);
  return JSON.stringify({ encrypted, version: '1.0' }, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
