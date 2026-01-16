
import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Search Intelligence AI',
  description: 'Closed-loop search intelligence for Sitecore/Solr',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
