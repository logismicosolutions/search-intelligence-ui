
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/primitives/Card';
import { IntentTable, IntentRow } from '@/components/IntentTable';

export default function IntentExplorerPage() {
  const [intents, setIntents] = useState<IntentRow[]>([]);

  useEffect(() => {
    fetch('/api/intents', { cache: 'no-store' }).then(r => r.json()).then(setIntents);
  }, []);

  return (
    <div className="container">
      <div className="pageTitle">Intent Explorer</div>
      <div className="subtle">Browse clusters, see volumes, and open details from Overview for full evidence + actions.</div>

      <div style={{ height: 14 }} />
      <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Intent Clusters</div>
          <IntentTable rows={intents} compact onRowClick={() => {}} />
        </div>
        {/* <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Cluster Map (Demo)</div>
          <div className="subtle">In MVP, show a simple bubble chart / 2D map. Here we show a placeholder.</div>
          <div style={{ height: 16 }} />
          <div style={{
            height: 340,
            borderRadius: 12,
            border: '1px dashed rgba(255,255,255,0.18)',
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.03)'
          }}>
            <div className="subtle">(Add bubble chart later)</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
