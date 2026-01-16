
'use client';

import { useMemo } from 'react';

export function KpiCards({ intents, loading }: { intents: any[]; loading: boolean }) {
  const kpis = useMemo(() => {
    const total = intents.reduce((a, b) => a + (b.volume ?? 0), 0);
    const problematic = intents.reduce((a, b) => a + Math.round((b.volume ?? 0) * (b.failureRate ?? 0)), 0);
    const fix = intents.filter(i => i.decision === 'FIX_SEARCH').length;
    const gap = intents.filter(i => i.decision === 'CREATE_CONTENT').length;
    const avgFailure = intents.length ? intents.reduce((a, b) => a + (b.failureRate ?? 0), 0) / intents.length : 0;
    const avgConf = intents.length ? intents.reduce((a, b) => a + (b.confidence ?? 0), 0) / intents.length : 0;
    return {
      total, problematic, intents: intents.length, fix, gap,
      avgFailure: avgFailure, avgConf
    };
  }, [intents]);

  const cards = [
    { label: 'Total volume', value: kpis.total },
    { label: 'Problematic', value: kpis.problematic },
    { label: 'Intents', value: kpis.intents },
    { label: 'Fix Search', value: kpis.fix },
    { label: 'Content Gaps', value: kpis.gap },
    { label: 'Avg confidence', value: loading ? '—' : (kpis.avgConf * 100).toFixed(0) + '%' },
  ];

  return (
    <div className="grid kpis">
      {cards.map(c => (
        <div key={c.label} className="card">
          <div className="subtle" style={{ fontSize: 12 }}>{c.label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{String(c.value)}</div>
          <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>
            {c.label === 'Problematic' ? 'Derived from volume × failure rate' : ' '}
          </div>
        </div>
      ))}
    </div>
  );
}
