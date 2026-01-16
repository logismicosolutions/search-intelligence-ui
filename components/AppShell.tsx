
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/intents', label: 'Intent Explorer' },
  { href: '/actions', label: 'Action Center' },
  { href: '/search-fix', label: 'Search Fix Studio' },
  { href: '/content-gap', label: 'Content Gap Studio' },
  { href: '/pipeline', label: 'Pipeline & Data' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
      <aside style={{
        padding: 16,
        borderRight: '1px solid rgba(255,255,255,0.10)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(106,169,255,0.8), rgba(177,140,255,0.7))'
          }} />
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Search Intelligence AI</div>
            <div className="subtle" style={{ fontSize: 12 }}>Hackathon UI</div>
          </div>
        </div>

        <nav style={{ display: 'grid', gap: 6 }}>
          {nav.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx('card')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: active ? '1px solid rgba(106,169,255,0.55)' : '1px solid rgba(255,255,255,0.10)',
                  background: active ? 'rgba(106,169,255,0.10)' : 'rgba(255,255,255,0.03)',
                  fontWeight: 650
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 16 }} className="card">
          <div style={{ fontWeight: 700 }}>Demo Tips</div>
          <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>
            • Click “Run Analysis” on Overview

            • Open an intent row → explainability

            • Export JSON/Markdown from studios
          </div>
        </div>
      </aside>

      <main>{children}</main>
    </div>
  );
}
