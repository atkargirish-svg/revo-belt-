
'use client';

import React from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Layers, 
  Bell, 
  BarChart3, 
  Settings,
  FileText,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

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

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#0d0e12] sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
          <ShieldCheck className="text-primary w-5 h-5" />
        </div>
        <h1 className="font-bold text-sm tracking-tighter text-white uppercase">BeltGuard AI</h1>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#0d0e12] border-r border-zinc-800 p-0 w-[280px]">
          <div className="p-6 border-b border-zinc-800">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck className="text-primary w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none tracking-tight text-white">BELTGUARD</h1>
                <p className="text-[8px] text-zinc-600 mt-0.5 uppercase font-black tracking-widest">AI Monitor</p>
              </div>
            </SheetTitle>
          </div>
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-100px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                    isActive 
                      ? "bg-[#1e1f26] text-white border border-zinc-800/50 shadow-md" 
                      : "text-zinc-500 hover:text-zinc-200"
                  )}
                >
                  <Icon size={18} className={cn("transition-transform", isActive && "text-primary")} />
                  <span className="font-bold text-[10px] uppercase tracking-widest">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-red-600 text-[8px] font-black flex items-center justify-center text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
