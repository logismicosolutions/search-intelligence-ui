
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Option, Spinner, Textarea } from '@fluentui/react-components';
import { ArrowDownload24Regular, Play24Regular } from '@fluentui/react-icons';

type IntentOption = { id: string; label: string; decision: 'FIX_SEARCH'|'CREATE_CONTENT' };

export default function SearchFixStudio() {
  const [intents, setIntents] = useState<IntentOption[]>([]);
  const [selected, setSelected] = useState<string>('intent_password_recovery');
  const [detail, setDetail] = useState<any>(null);
  const [sim, setSim] = useState<{before: number; after: number} | null>(null);

  useEffect(() => {
    fetch('/api/intents').then(r=>r.json()).then((rows) => {
      setIntents(rows);
    });
  }, []);

  useEffect(() => {
    fetch(`/api/intents/${selected}`).then(r=>r.json()).then(setDetail);
    setSim(null);
  }, [selected]);

  const canFix = detail?.coverage?.verdict === 'CONTENT_EXISTS_SEARCH_FAILED';

  return (
    <div className="container">
      <div className="pageTitle">Search Fix Studio</div>
      <div className="subtle">Apply tuning actions when content exists but search relevance fails.</div>

      <div style={{ height: 14 }} />
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Select intent</div>
          <Dropdown
            value={intents.find(i => i.id === selected)?.label || ''}
            selectedOptions={[selected]}
            onOptionSelect={(_, data) => setSelected(String(data.optionValue))}
          >
            {intents.filter(i => i.decision === 'FIX_SEARCH').map(i => (
              <Option key={i.id} value={i.id}>{i.label}</Option>
            ))}
          </Dropdown>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button icon={<Play24Regular />} appearance="primary" disabled={!canFix} onClick={() => setSim({ before: 0.22, after: 0.44 })}>
            Simulate Improvement
          </Button>
          <Button icon={<ArrowDownload24Regular />} disabled={!canFix} onClick={() => window.open(`/api/export/synonyms?intentId=${selected}`, '_blank')}>
            Export Synonyms JSON
          </Button>
        </div>
      </div>

      <div style={{ height: 14 }} />
      {!detail ? (
        <Spinner />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Synonyms</div>
            <div className="subtle">Editable list (MVP). Export to Solr synonym format or JSON.</div>
            <div style={{ height: 10 }} />
            <Textarea
              rows={12}
              value={JSON.stringify(detail.recommendations?.synonyms ?? [], null, 2)}
              readOnly
              style={{ width: '100%' }}
            />
          </div>
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Boost Rules & Best Bets</div>
            <div className="subtle">These are the high-impact tuning actions for ranking.</div>
            <div style={{ height: 10 }} />
            <Textarea
              rows={12}
              value={JSON.stringify({
                boostRules: detail.recommendations?.boostRules ?? [],
                bestBets: detail.recommendations?.bestBets ?? []
              }, null, 2)}
              readOnly
              style={{ width: '100%' }}
            />

            <div style={{ height: 12 }} />
            {sim && (
              <div className="card" style={{ background: 'rgba(106,169,255,0.08)' }}>
                <div style={{ fontWeight: 700 }}>Simulated Impact</div>
                <div className="subtle">Estimated CTR (demo): {Math.round(sim.before*100)}% → {Math.round(sim.after*100)}%</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
