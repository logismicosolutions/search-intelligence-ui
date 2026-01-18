
'use client';

import { useMemo, useState } from 'react';
import { Button, ProgressBar } from '@fluentui/react-components';
import { ArrowSync24Regular } from '@fluentui/react-icons';


type Step = { name: string; done: boolean };

const baseSteps = [
  'Ingest logs',
  'Detect failures',
  'Generate embeddings',
  'Cluster intents',
  'Coverage check',
  'Generate recommendations',
  'Publish to dashboard'
];

export default function PipelinePage() {
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);

  const steps: Step[] = useMemo(() => baseSteps.map((name, i) => ({ name, done: i < idx })), [idx]);
  const progress = Math.min(1, idx / baseSteps.length);

  async function run() {
    setRunning(true);
    setIdx(0);
    for (let i = 1; i <= baseSteps.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setIdx(i);
    }
    setRunning(false);
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="pageTitle">Pipeline & Data</div>
          <div className="subtle">Demo pipeline to show closed-loop flow end-to-end.</div>
        </div>
        <Button appearance="primary" icon={<ArrowSync24Regular />} onClick={run} disabled={running}>
          {running ? 'Running…' : 'Run Pipeline'}
        </Button>
      </div>

      <div style={{ height: 14 }} />
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Progress</div>
        <ProgressBar value={progress} />
        <div style={{ height: 12 }} />
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {steps.map((s) => (
            <div key={s.name} className="card" style={{ padding: 12, background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 650 }}>{s.name}</div>
                <div className="subtle">{s.done ? '✅' : (running ? '⏳' : '—')}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 10 }} />
        <div className="subtle">Tip: wire this to /api/analyze for a real backend later.</div>
      </div>
    </div>
  );
}
