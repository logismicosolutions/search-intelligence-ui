
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Option } from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';
import { KanbanBoard } from '@/components/KanbanBoard';

export type ActionItem = {
  id: string;
  intentId: string;
  intentLabel: string;
  decision: 'FIX_SEARCH' | 'CREATE_CONTENT';
  type: 'SYNONYMS' | 'BOOST' | 'BEST_BET' | 'CONTENT_BRIEF';
  title: string;
  owner: string;
  status: 'NEW' | 'REVIEWED' | 'EXPORTED' | 'IN_PROGRESS' | 'VALIDATED' | 'CLOSED';
  createdAt: string;
};

export default function ActionCenterPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);

  async function load() {
    const res = await fetch('/api/actions', { cache: 'no-store' });
    setActions(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: ActionItem['status']) {
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ op: 'updateStatus', id, status })
    });
    load();
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="pageTitle">Action Center</div>
          <div className="subtle">Track recommendations, assign owners, export configs, and close the loop.</div>
        </div>
        <Button icon={<ArrowDownload24Regular />} onClick={() => window.open('/api/export/bundle', '_blank')}>Export Bundle</Button>
      </div>

      <div style={{ height: 14 }} />
      <KanbanBoard items={actions} onStatusChange={updateStatus} />
    </div>
  );
}
