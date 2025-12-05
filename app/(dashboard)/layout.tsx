'use client';

import { ProtectedLayout } from '@/components/protected-layout';
import { Navigation } from '@/components/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <div className="min-h-screen">
        <Navigation />
        <main className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </main>
      </div>
    </ProtectedLayout>
  );
}
