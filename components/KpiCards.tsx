
'use client';

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Dropdown, Option, Button } from '@fluentui/react-components';
import { ChevronDownRegular, ChevronUpRegular } from '@fluentui/react-icons';

type StatusValue =
  | 'New'
  | 'Reviewed'
  | 'Exported'
  | 'In Progress'
  | 'Validated'
  | 'Closed';

type StatusFilterValue = 'All' | StatusValue;

type Intent = {
  id?: string;
  label?: string;
  volume?: number;
  failureRate?: number;
  decision?: 'FIX_SEARCH' | 'CREATE_CONTENT';
  confidence?: number;
  topRecommendation?: string;
  status?: StatusValue;
};

const STATUS_OPTIONS: StatusValue[] = [
  'New',
  'Reviewed',
  'Exported',
  'In Progress',
  'Validated',
  'Closed',
];

export function KpiCards({
  intents,
  loading,
  initialStatus = 'All',
  onFilteredIntentsChange,
}: {
  intents: Intent[];
  loading: boolean;
  initialStatus?: StatusFilterValue;
  onFilteredIntentsChange?: (filtered: Intent[], status: StatusFilterValue) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterValue>(initialStatus);

  // ✅ Expanded card state (single expanded card at a time)
  const [expandedStatus, setExpandedStatus] = useState<StatusFilterValue | null>(null);

  // ✅ “Show more” per expanded card
  const [visibleCountByStatus, setVisibleCountByStatus] = useState<Record<string, number>>({});

  // Filtered intents used for KPI calc and optional callback
  const filteredIntents = useMemo(() => {
    if (selectedStatus === 'All') return intents;
    return intents.filter(i => (i.status ?? 'New') === selectedStatus);
  }, [intents, selectedStatus]);

  useEffect(() => {
    onFilteredIntentsChange?.(filteredIntents, selectedStatus);
  }, [filteredIntents, selectedStatus, onFilteredIntentsChange]);

  // Count intents by status (for status cards)
  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilterValue, number> = {
      All: intents.length,
      New: 0,
      Reviewed: 0,
      Exported: 0,
      'In Progress': 0,
      Validated: 0,
      Closed: 0,
    };

    for (const i of intents) {
      const s = (i.status ?? 'New') as StatusValue;
      counts[s] += 1;
    }
    return counts;
  }, [intents]);

  // Group intents by status (for expanded details)
  const intentsByStatus = useMemo(() => {
    const map: Record<StatusFilterValue, Intent[]> = {
      All: intents,
      New: [],
      Reviewed: [],
      Exported: [],
      'In Progress': [],
      Validated: [],
      Closed: [],
    };

    
for (const i of intents ?? []) {
  const s = i?.status ?? 'New';
  if (!map[s]) map[s] = [];     // ✅ initialize
  map[s].push(i);

    }

    // Sort within each status (volume desc)
    for (const k of Object.keys(map) as StatusFilterValue[]) {
      map[k] = map[k].slice().sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
    }

    return map;
  }, [intents]);

  // KPI calculation based on FILTERED intents
  const kpis = useMemo(() => {
    const total = filteredIntents.reduce((a, b) => a + (b.volume ?? 0), 0);
    const problematic = filteredIntents.reduce(
      (a, b) => a + Math.round((b.volume ?? 0) * (b.failureRate ?? 0)),
      0
    );
    const fix = filteredIntents.filter(i => i.decision === 'FIX_SEARCH').length;
    const gap = filteredIntents.filter(i => i.decision === 'CREATE_CONTENT').length;
    const avgFailure = filteredIntents.length
      ? filteredIntents.reduce((a, b) => a + (b.failureRate ?? 0), 0) / filteredIntents.length
      : 0;
    const avgConf = filteredIntents.length
      ? filteredIntents.reduce((a, b) => a + (b.confidence ?? 0), 0) / filteredIntents.length
      : 0;

    return { total, problematic, intents: filteredIntents.length, fix, gap, avgFailure, avgConf };
  }, [filteredIntents]);

  const cards = [
    { label: 'Total volume', value: kpis.total },
    { label: 'Problematic', value: kpis.problematic, hint: 'Derived from volume × failure rate' },
    { label: 'Intents', value: kpis.intents },
    { label: 'Fix Search', value: kpis.fix },
    { label: 'Content Gaps', value: kpis.gap },
    { label: 'Avg confidence', value: loading ? '—' : (kpis.avgConf * 100).toFixed(0) + '%' },
  ];

  const isExpanded = (status: StatusFilterValue) => expandedStatus === status;

  const ensureVisibleCountInitialized = (status: StatusFilterValue) => {
    setVisibleCountByStatus(curr => ({
      ...curr,
      [status]: curr[status] ?? 8, // default visible items
    }));
  };

  const toggleExpand = (status: StatusFilterValue) => {
    setExpandedStatus(prev => {
      const next = prev === status ? null : status;
      if (next) ensureVisibleCountInitialized(next);
      return next;
    });
  };

  const showMore = (status: StatusFilterValue) => {
    setVisibleCountByStatus(curr => ({
      ...curr,
      [status]: (curr[status] ?? 8) + 8,
    }));
  };

  const statusCardClass = (status: StatusFilterValue) =>
    'card' +
    (selectedStatus === status ? ' card--active' : '') +
    (isExpanded(status) ? ' card--expanded' : '');

  const renderStatusCard = (status: StatusFilterValue, title: string) => {
    const list = intentsByStatus[status] ?? [];
    const visible = visibleCountByStatus[status] ?? 8;
    const displayed = list.slice(0, visible);

    return (
      <div
        key={status}
        className={statusCardClass(status)}
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedStatus(status)}
        role="button"
      >
        {/* Card header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
          <div>
            <div className="subtle" style={{ fontSize: 12 }}>{title}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
              {loading ? '—' : String(statusCounts[status])}
            </div>
          </div>

          {/* Expand/Collapse */}
          <Button
            appearance="subtle"
            size="small"
            icon={isExpanded(status) ? <ChevronUpRegular /> : <ChevronDownRegular />}
            aria-label={isExpanded(status) ? 'Collapse' : 'Expand'}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(status);
            }}
          />
        </div>

        <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>
          {isExpanded(status) ? 'Showing intents' : 'Click chevron to expand'}
        </div>

        {/* Expand area */}
        {isExpanded(status) && (
          <div
            className="card__details"
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: 10,
              borderTop: '1px solid rgba(0,0,0,0.08)',
              paddingTop: 10,
            }}
          >
            {loading ? (
              <div className="subtle" style={{ fontSize: 12 }}>Loading…</div>
            ) : list.length === 0 ? (
              <div className="subtle" style={{ fontSize: 12 }}>No intents in this status.</div>
            ) : (
              <>
                <div style={{ maxHeight: 180, overflow: 'auto', paddingRight: 6 }}>
                  {displayed.map((i, idx) => (
                    <div
                      key={(i.id ?? i.label ?? 'intent') + idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 10,
                        padding: '6px 0',
                        borderBottom: '1px dashed rgba(0,0,0,0.08)',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {i.label ?? i.id ?? '—'}
                        </div>
                        <div className="subtle" style={{ fontSize: 11 }}>{i.id ? i.id : ' '}</div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{i.volume ?? 0}</div>
                        <div className="subtle" style={{ fontSize: 11 }}>
                          {Math.round((i.failureRate ?? 0) * 100)}% fail
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {visible < list.length && (
                  <div style={{ marginTop: 10 }}>
                    <Button size="small" appearance="secondary" onClick={() => showMore(status)}>
                      Show more ({Math.min(8, list.length - visible)} more)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ✅ AUTO-EXPAND behavior when dropdown selection changes:
  // - If user selects a specific status, expand its card
  // - If user selects "All", collapse expanded card
  const handleStatusSelection = (next: StatusFilterValue) => {
    setSelectedStatus(next);

    if (next === 'All') {
      setExpandedStatus(null);
      return;
    }

    // Expand the selected status card + initialize visible count
    ensureVisibleCountInitialized(next);
    setExpandedStatus(next);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div className="subtle" style={{ fontSize: 12, minWidth: 120 }}>
          Filter by status
        </div>

        <div style={{ width: 220 }}>
          <Dropdown
            aria-label="Filter intents by status"
            value={selectedStatus}
            selectedOptions={[selectedStatus]}
            style={{ width: '100%' }}
            onOptionSelect={(e, data) => {
              const next = (data.optionValue ?? 'All') as StatusFilterValue;
              handleStatusSelection(next); // ✅ auto-expand here
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

        <div className="subtle" style={{ fontSize: 12 }}>
          Showing <b>{filteredIntents.length}</b> intent(s)
          {selectedStatus !== 'All' ? (
            <>
              {' '}for <b>{selectedStatus}</b>
            </>
          ) : null}
        </div>
      </div>

      {/* Expandable Status Cards */}
      <div className="grid kpis" style={{ marginBottom: 14 }}>
        {renderStatusCard('All', 'All statuses')}
        {STATUS_OPTIONS.map(s => renderStatusCard(s, s))}
      </div>

      {/* KPI Cards (computed from filtered intents) */}
      <div className="grid kpis">
        {cards.map(c => (
          <div key={c.label} className="card">
            <div className="subtle" style={{ fontSize: 12 }}>
              {c.label}
              {selectedStatus !== 'All' ? (
                <span className="subtle" style={{ marginLeft: 6 }}>• {selectedStatus}</span>
              ) : null}
            </div>

            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{String(c.value)}</div>

            <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>
              {c.hint ?? ' '}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
