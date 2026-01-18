'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Dropdown,
  Option,
} from '@fluentui/react-components';

/* -----------------------------
   Types
------------------------------*/

export type StatusValue =
  | 'New'
  | 'Reviewed'
  | 'Exported'
  | 'In Progress'
  | 'Validated'
  | 'Closed';

export type IntentRow = {
  id: string;
  label: string;
  volume: number;
  failureRate: number;
  decision: 'FIX_SEARCH' | 'CREATE_CONTENT';
  confidence: number;
  topRecommendation: string;
  status: StatusValue;
};

type StatusFilterValue = 'All' | StatusValue;

type IntentTableProps = {
  rows: IntentRow[];
  onRowClick?: (row: IntentRow) => void; // ✅ optional (FIX)
  compact?: boolean;
  onStatusChange?: (rowId: string, nextStatus: StatusValue) => void;
};

/* -----------------------------
   Constants
------------------------------*/

const STATUS_OPTIONS: StatusValue[] = [
  'New',
  'Reviewed',
  'Exported',
  'In Progress',
  'Validated',
  'Closed',
];

/* -----------------------------
   Component
------------------------------*/

export function IntentTable({
  rows,
  onRowClick,
  compact,
  onStatusChange,
}: IntentTableProps) {
  /* -----------------------------
     Local status state
  ------------------------------*/

  const [statusById, setStatusById] = React.useState<Record<string, StatusValue>>(() => {
    const initial: Record<string, StatusValue> = {};
    for (const r of rows) initial[r.id] = r.status ?? 'New';
    return initial;
  });

  React.useEffect(() => {
    setStatusById(prev => {
      const next = { ...prev };
      for (const r of rows) {
        next[r.id] = prev[r.id] ?? (r.status ?? 'New');
      }
      return next;
    });
  }, [rows]);

  const getStatus = (r: IntentRow) => statusById[r.id] ?? r.status ?? 'New';

  const handleStatusChange = (rowId: string, nextStatus: StatusValue) => {
    setStatusById(prev => ({ ...prev, [rowId]: nextStatus }));
    onStatusChange?.(rowId, nextStatus);
  };

  /* -----------------------------
     Status filter
  ------------------------------*/

  const [statusFilter, setStatusFilter] = React.useState<StatusFilterValue>('All');

  const filteredRows = React.useMemo(() => {
    if (statusFilter === 'All') return rows;
    return rows.filter(r => getStatus(r) === statusFilter);
  }, [rows, statusFilter, statusById]);

  /* -----------------------------
     Layout styles
  ------------------------------*/

  const COLUMN_PADDING_X = 28;
  const statusColWidth = compact ? 170 : 200;

  const tableStyle: React.CSSProperties = {
    width: '100%',
    tableLayout: 'auto',
  };

  const headerCellStyle: React.CSSProperties = {
    paddingLeft: COLUMN_PADDING_X,
    paddingRight: COLUMN_PADDING_X,
  };

  const bodyCellStyle: React.CSSProperties = {
    paddingLeft: COLUMN_PADDING_X,
    paddingRight: COLUMN_PADDING_X,
  };

  const recommendationCellStyle: React.CSSProperties = {
    ...bodyCellStyle,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const statusHeaderStyle: React.CSSProperties = {
    ...headerCellStyle,
    width: statusColWidth,
  };

  const statusCellStyle: React.CSSProperties = {
    ...bodyCellStyle,
    width: statusColWidth,
  };

  const fullWidthDropdownStyle: React.CSSProperties = {
    width: '100%',
    minWidth: 0,
  };

  /* -----------------------------
     Render
  ------------------------------*/

  return (
    <div style={{ width: '100%' }}>
      <Table aria-label="Intents" size={compact ? 'small' : 'medium'} style={tableStyle}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell style={headerCellStyle}>Intent</TableHeaderCell>
            <TableHeaderCell style={headerCellStyle}>Volume</TableHeaderCell>
            <TableHeaderCell style={headerCellStyle}>Failure</TableHeaderCell>
            <TableHeaderCell style={headerCellStyle}>AI Decision</TableHeaderCell>
            <TableHeaderCell style={headerCellStyle}>Confidence</TableHeaderCell>
            <TableHeaderCell style={headerCellStyle}>Recommendation</TableHeaderCell>

            <TableHeaderCell style={statusHeaderStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 600 }}>Status</div>

                <Dropdown
                  size={compact ? 'small' : 'medium'}
                  value={statusFilter}
                  selectedOptions={[statusFilter]}
                  style={fullWidthDropdownStyle}
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  onOptionSelect={(e, data) => {
                    e.stopPropagation();
                    setStatusFilter((data.optionValue ?? 'All') as StatusFilterValue);
                  }}
                >
                  <Option value="All">All</Option>
                  {STATUS_OPTIONS.map(s => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Dropdown>
              </div>
            </TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredRows.map(r => (
            <TableRow
              key={r.id}
              onClick={() => onRowClick?.(r)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <TableCell style={bodyCellStyle}>
                <div style={{ fontWeight: 700 }}>{r.label}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{r.id}</div>
              </TableCell>

              <TableCell style={bodyCellStyle}>{r.volume}</TableCell>
              <TableCell style={bodyCellStyle}>{Math.round(r.failureRate * 100)}%</TableCell>

              <TableCell style={bodyCellStyle}>
                {r.decision === 'FIX_SEARCH' ? '🔧 Fix Search' : '📝 Create Content'}
              </TableCell>

              <TableCell style={bodyCellStyle}>{Math.round(r.confidence * 100)}%</TableCell>

              <TableCell style={recommendationCellStyle}>
                {r.topRecommendation}
              </TableCell>

              <TableCell style={statusCellStyle}>
                <Dropdown
                  size={compact ? 'small' : 'medium'}
                  value={getStatus(r)}
                  selectedOptions={[getStatus(r)]}
                  style={fullWidthDropdownStyle}
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  onOptionSelect={(e, data) => {
                    e.stopPropagation();
                    handleStatusChange(
                      r.id,
                      (data.optionValue ?? 'New') as StatusValue
                    );
                  }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <Option key={s} value={s}>
                      {s}
                    </Option>
                  ))}
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}

          {filteredRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} style={bodyCellStyle}>
                <div style={{ padding: 12, opacity: 0.7 }}>
                  No rows match the selected status filter.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
