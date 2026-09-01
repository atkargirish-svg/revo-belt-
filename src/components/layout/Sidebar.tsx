
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  Layers, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Sections', href: '/sections', icon: Layers },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 bg-card hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <ShieldCheck className="text-primary w-8 h-8" />
        <div>
          <h1 className="font-bold text-lg leading-none">BELTGUARD AI</h1>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">Predictive Systems</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-border">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-tighter">System Online</span>
        </div>
      </div>
    </aside>
  );
}
