
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from '@/components/ThemeToggle';

const nav = [
  { href: '/', label: 'Overview' },
  { href: '/intents', label: 'Intent Explorer' },
  { href: '/search-fix', label: 'Search Fix Studio' },
  { href: '/content-gap', label: 'Content Gap Studio' },
  { href: '/pipeline', label: 'Pipeline & Data' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          padding: 16,
          borderRight: '1px solid var(--border)',
          background: 'var(--panel2)',
        }}
      >
        {/* Brand header + Theme Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              }}
            />
            <div>
              <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Search Intelligence AI</div>
              <div className="subtle" style={{ fontSize: 12 }}>
                By Core Visionaries
              </div>
            </div>
          </div>

          {/* Toggle sits top-right */}
          <div style={{ marginTop: 2 }}>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'grid', gap: 8 }}>
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
                  border: active
                    ? '1px solid color-mix(in srgb, var(--primary) 45%, var(--border))'
                    : '1px solid var(--border)',
                  background: active
                    ? 'color-mix(in srgb, var(--primary) 12%, var(--panel))'
                    : 'var(--panel)',
                  fontWeight: 650,
                  display: 'block',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Tips card */}
        <div style={{ marginTop: 16 }} className="card">
          <div style={{ fontWeight: 700 }}>Demo Tips</div>
          <div className="subtle" style={{ fontSize: 12, marginTop: 6, lineHeight: 1.55 }}>
            • Click “Run Analysis” on Overview
            <br />
            • Open an intent row → explainability
            <br />
            • Export JSON/Markdown from studios
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ minWidth: 0 }}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
