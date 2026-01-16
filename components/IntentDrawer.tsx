
'use client';

import { useEffect, useState } from 'react';
import { Button, Tab, TabList, Spinner } from '@fluentui/react-components';

export function IntentDrawer({ intentId }: { intentId: string }) {
  const [detail, setDetail] = useState<any>(null);
  const [tab, setTab] = useState('evidence');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setDetail(null);
    fetch(`/api/intents/${intentId}`, { cache: 'no-store' }).then(r => r.json()).then(setDetail);
  }, [intentId]);

  async function createAction() {
    if (!detail) return;
    setCreating(true);
    const action = {
      id: 'act_' + Math.random().toString(16).slice(2, 8),
      intentId: detail.id,
      intentLabel: detail.label,
      decision: detail.coverage?.verdict === 'CONTENT_MISSING' ? 'CREATE_CONTENT' : 'FIX_SEARCH',
      type: detail.coverage?.verdict === 'CONTENT_MISSING' ? 'CONTENT_BRIEF' : 'SYNONYMS',
      title: detail.coverage?.verdict === 'CONTENT_MISSING' ? `Create content: ${detail.label}` : `Tune search: ${detail.label}`,
      owner: detail.coverage?.verdict === 'CONTENT_MISSING' ? 'Content Team' : 'Search Admin',
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ op: 'create', action })
    });
    setCreating(false);
  }

  if (!detail) return <div style={{ padding: 16 }}><Spinner /></div>;

  const verdict = detail.coverage?.verdict;
  const decisionLabel = verdict === 'CONTENT_MISSING' ? '📝 Create Content' : '🔧 Fix Search';

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{detail.label}</div>
          <div className="subtle" style={{ fontSize: 12 }}>{decisionLabel} • Verdict: {verdict}</div>
        </div>
        <Button appearance="primary" onClick={createAction} disabled={creating}>
          {creating ? 'Creating…' : 'Create Action'}
        </Button>
      </div>

      <div style={{ height: 10 }} />
      <TabList selectedValue={tab} onTabSelect={(_, data) => setTab(String(data.value))}>
        <Tab value="evidence">Evidence</Tab>
        <Tab value="coverage">Coverage</Tab>
        <Tab value="actions">Recommendations</Tab>
        <Tab value="why">Explainability</Tab>
      </TabList>

      <div style={{ height: 12 }} />

      {tab === 'evidence' && (
        <div className="card">
          <div style={{ fontWeight: 700 }}>Signals</div>
          <div className="subtle" style={{ marginTop: 6 }}>
            0-results: {Math.round(detail.signals.zeroResultsPct * 100)}% • Low CTR: {Math.round(detail.signals.lowCtrPct * 100)}% • Reformulations: {Math.round(detail.signals.reformulationRate * 100)}%
          </div>
          <div style={{ height: 10 }} />
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Example queries</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {detail.exampleQueries.map((q: string) => (
              <span key={q} className="pill">{q}</span>
            ))}
          </div>
        </div>
      )}

      {tab === 'coverage' && (
        <div className="card">
          <div style={{ fontWeight: 700 }}>Solr Coverage Check</div>
          <div className="subtle" style={{ marginTop: 6 }}>
            Avg similarity: {Math.round((detail.coverage.avgSimilarity ?? 0) * 100)}% • Verdict: {verdict}
          </div>
          <div style={{ height: 10 }} />
          <div style={{ display: 'grid', gap: 10 }}>
            {(detail.coverage.matches ?? []).map((m: any) => (
              <div key={m.id} className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 750 }}>{m.title}</div>
                  <div className="subtle">{Math.round(m.similarity * 100)}%</div>
                </div>
                <div className="subtle" style={{ fontSize: 12 }}>{m.url} • {m.type}</div>
                <div style={{ height: 6 }} />
                <div className="subtle">{m.snippet}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'actions' && (
        <div className="card">
          <div style={{ fontWeight: 700 }}>Recommended Actions</div>
          <div className="subtle" style={{ marginTop: 6 }}>
            {verdict === 'CONTENT_MISSING' ? 'Create content brief for this intent.' : 'Tune search relevance (synonyms/boost/best bet).'}
          </div>
          <div style={{ height: 10 }} />
          <pre style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            background: 'rgba(0,0,0,0.25)',
            padding: 12,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)'
          }}>{JSON.stringify(detail.recommendations ?? {}, null, 2)}</pre>
        </div>
      )}

      {tab === 'why' && (
        <div className="card">
          <div style={{ fontWeight: 700 }}>Why this decision?</div>
          <div style={{ height: 8 }} />
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {(detail.explainability ?? []).map((x: string, i: number) => (
              <li key={i} className="subtle" style={{ marginBottom: 8 }}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ height: 12 }} />
      <div className="subtle" style={{ fontSize: 12 }}>
        Tip: go to Action Center to track this recommendation.
      </div>
    </div>
  );
}
