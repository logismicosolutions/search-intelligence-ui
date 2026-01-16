
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Tab, TabList, Spinner } from '@fluentui/react-components';
import { ArrowSync24Regular } from '@fluentui/react-icons';
import { KpiCards } from '@/components/KpiCards';
import { IntentTable, IntentRow } from '@/components/IntentTable';
import { IntentDrawer } from '@/components/IntentDrawer';

export default function OverviewPage() {
  const [intents, setIntents] = useState<IntentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/intents', { cache: 'no-store' });
    const data = await res.json();
    setIntents(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(() => intents.find(i => i.id === selectedId) ?? null, [intents, selectedId]);

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="pageTitle">Overview</div>
          <div className="subtle">Closed-loop system: detect → cluster → decide → recommend → export/apply.</div>
        </div>
        <Button appearance="primary" icon={<ArrowSync24Regular />} onClick={load}>
          Run Analysis
        </Button>
      </div>

      <div style={{ height: 14 }} />
      <KpiCards intents={intents} loading={loading} />

      <div style={{ height: 14 }} />
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Top Intents</div>
            <div className="subtle">Click an intent to see evidence, coverage, and explainable recommendations.</div>
          </div>
          {loading && <Spinner size="tiny" />}
        </div>
        <div style={{ height: 10 }} />
        <IntentTable
          rows={intents}
          onRowClick={(row) => {
            setSelectedId(row.id);
            setDrawerOpen(true);
          }}
        />
      </div>

      <Drawer open={drawerOpen} position="end" onOpenChange={(_, data) => setDrawerOpen(data.open)}>
        <DrawerHeader>
          <DrawerHeaderTitle>
            {selected ? selected.label : 'Intent'}
            {selected && (
              <span style={{ marginLeft: 10 }} className={"pill " + (selected.decision === 'FIX_SEARCH' ? 'fix' : 'gap')}>
                {selected.decision === 'FIX_SEARCH' ? '🔧 Fix Search' : '📝 Create Content'}
              </span>
            )}
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {selectedId ? <IntentDrawer intentId={selectedId} /> : <div className="subtle">Select an intent…</div>}
        </DrawerBody>
      </Drawer>
    </div>
  );
}
