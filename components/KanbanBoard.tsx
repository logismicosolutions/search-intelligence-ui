
'use client';

import { Dropdown, Option } from '@fluentui/react-components';

const columns = [
  { key: 'NEW', title: 'New' },
  { key: 'REVIEWED', title: 'Reviewed' },
  { key: 'EXPORTED', title: 'Exported/Applied' },
  { key: 'IN_PROGRESS', title: 'In Progress' },
  { key: 'VALIDATED', title: 'Validated' },
  { key: 'CLOSED', title: 'Closed' },
] as const;

export function KanbanBoard({ items, onStatusChange }: { items: any[]; onStatusChange: (id: string, status: any) => void }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
      {columns.map(col => {
        const colItems = items.filter(i => i.status === col.key);
        return (
          <div key={col.key} className="card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontWeight: 800 }}>{col.title}</div>
              <div className="subtle" style={{ fontSize: 12 }}>{colItems.length}</div>
            </div>
            <div style={{ height: 10 }} />
            <div style={{ display: 'grid', gap: 10 }}>
              {colItems.map(item => (
                <div key={item.id} className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontWeight: 750, fontSize: 13 }}>{item.intentLabel}</div>
                    <span className={"pill " + (item.decision === 'FIX_SEARCH' ? 'fix' : 'gap')}>
                      {item.decision === 'FIX_SEARCH' ? '🔧' : '📝'}
                    </span>
                  </div>
                  <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>{item.title}</div>
                  <div style={{ height: 8 }} />
                  <div className="subtle" style={{ fontSize: 12 }}>Owner: {item.owner}</div>
                  <div style={{ height: 10 }} />
                  <Dropdown
                    value={item.status}
                    selectedOptions={[item.status]}
                    onOptionSelect={(_, data) => onStatusChange(item.id, data.optionValue)}
                  >
                    {columns.map(c => <Option key={c.key} value={c.key}>{c.key}</Option>)}
                  </Dropdown>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
