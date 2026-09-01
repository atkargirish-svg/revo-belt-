
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Layers, 
  Bell, 
  BarChart3, 
  Settings,
  ShieldCheck,
  FileText,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Belt Map', href: '/map', icon: MapIcon },
  { name: 'Belt Sections', href: '/sections', icon: Layers },
  { name: 'Alerts', href: '/alerts', icon: Bell, badge: 3 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] border-r border-zinc-800/50 h-screen sticky top-0 bg-[#0d0e12] hidden lg:flex flex-col">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
          <ShieldCheck className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none tracking-tight text-white">BELTGUARD</h1>
          <p className="text-[8px] text-zinc-600 mt-0.5 uppercase font-black tracking-widest">AI Monitor</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                isActive 
                  ? "bg-[#1e1f26] text-white border border-zinc-800/50 shadow-md" 
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <Icon size={18} className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")} />
              <span className="font-bold text-[10px] uppercase tracking-widest">{item.name}</span>
              {item.badge && (
                <span className="ml-auto w-4 h-4 rounded-full bg-red-600 text-[8px] font-black flex items-center justify-center text-white">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status Widget (Floating in Sidebar) */}
      <div className="p-4 mt-auto">
        <div className="industrial-card p-4 bg-[#16171d] border border-zinc-800/50 rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#22c55e] animate-pulse" />
            <div>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">System Status</p>
              <p className="text-sm font-bold text-primary italic">Operational</p>
            </div>
          </div>
          <p className="text-[9px] text-zinc-500 leading-tight font-medium">All systems are running normally.</p>
          <div className="pt-2 border-t border-zinc-800/50">
            <p className="text-[8px] font-bold text-zinc-600 uppercase mb-0.5">Last Updated</p>
            <p className="text-[9px] font-mono text-zinc-500">24 May 2025 10:24 AM</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
