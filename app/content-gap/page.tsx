
'use client';

import { useEffect, useState } from 'react';
import { Button, Dropdown, Option, Spinner, Textarea } from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';

type IntentOption = { id: string; label: string; decision: 'FIX_SEARCH'|'CREATE_CONTENT' };

export default function ContentGapStudio() {
  const [intents, setIntents] = useState<IntentOption[]>([]);
  const [selected, setSelected] = useState<string>('intent_refund_policy');
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    fetch('/api/intents').then(r=>r.json()).then(setIntents);
  }, []);

  useEffect(() => {
    fetch(`/api/intents/${selected}`).then(r=>r.json()).then(setDetail);
  }, [selected]);

  const brief = detail?.recommendations?.contentBrief;

  return (
    <div className="container">
      <div className="pageTitle">Content Gap Studio</div>
      <div className="subtle">Generate content briefs when user intent has no coverage in Sitecore.</div>

      <div style={{ height: 14 }} />
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Select intent</div>
          <Dropdown
            value={intents.find(i => i.id === selected)?.label || ''}
            selectedOptions={[selected]}
            onOptionSelect={(_, data) => setSelected(String(data.optionValue))}
          >
            {intents.filter(i => i.decision === 'CREATE_CONTENT').map(i => (
              <Option key={i.id} value={i.id}>{i.label}</Option>
            ))}
          </Dropdown>
        </div>
        <Button icon={<ArrowDownload24Regular />} disabled={!brief} onClick={() => window.open(`/api/export/content-brief?intentId=${selected}`, '_blank')}>
          Export Brief (Markdown)
        </Button>
      </div>

      <div style={{ height: 14 }} />
      {!detail ? (
        <Spinner />
      ) : (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Content Brief</div>
          <div className="subtle">Copy into Sitecore workflow or create a ticket for content team.</div>
          <div style={{ height: 10 }} />
          <Textarea
            rows={18}
            value={brief ? JSON.stringify(brief, null, 2) : 'No content brief available for this intent.'}
            readOnly
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}
