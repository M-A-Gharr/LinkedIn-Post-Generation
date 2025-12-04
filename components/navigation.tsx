'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, History, Calendar, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Generator',
    href: '/',
    icon: Sparkles,
  },
  {
    name: 'History',
    href: '/history',
    icon: History,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Linkedin className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg">LinkedIn Post Gen</span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-semibold text-white">
              U
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
