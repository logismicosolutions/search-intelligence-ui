
'use client';

import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@fluentui/react-components';

export type IntentRow = {
  id: string;
  label: string;
  volume: number;
  failureRate: number;
  decision: 'FIX_SEARCH' | 'CREATE_CONTENT';
  confidence: number;
  topRecommendation: string;
  status: string;
};

export function IntentTable({ rows, onRowClick, compact }: { rows: IntentRow[]; onRowClick: (row: IntentRow) => void; compact?: boolean }) {
  return (
    <Table aria-label="Intents" size={compact ? 'small' : 'medium'}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Intent</TableHeaderCell>
          <TableHeaderCell>Volume</TableHeaderCell>
          <TableHeaderCell>Failure</TableHeaderCell>
          <TableHeaderCell>AI Decision</TableHeaderCell>
          <TableHeaderCell>Confidence</TableHeaderCell>
          <TableHeaderCell>Recommendation</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(r => (
          <TableRow key={r.id} onClick={() => onRowClick?.(r)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
            <TableCell>
              <div style={{ fontWeight: 700 }}>{r.label}</div>
              <div className="subtle" style={{ fontSize: 12 }}>{r.id}</div>
            </TableCell>
            <TableCell>{r.volume}</TableCell>
            <TableCell>{Math.round(r.failureRate * 100)}%</TableCell>
            <TableCell>
              <span className={"pill " + (r.decision === 'FIX_SEARCH' ? 'fix' : 'gap')}>
                {r.decision === 'FIX_SEARCH' ? '🔧 Fix Search' : '📝 Create Content'}
              </span>
            </TableCell>
            <TableCell>{Math.round(r.confidence * 100)}%</TableCell>
            <TableCell>
              <span className="subtle">{r.topRecommendation}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
