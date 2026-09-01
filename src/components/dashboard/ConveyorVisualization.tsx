
'use client';

import { SectionStatus } from '@/lib/types/sensor';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  sections: Record<string, SectionStatus>;
  activeId: string;
}

export function ConveyorVisualization({ sections, activeId }: Props) {
  const zoneLabels = [
    { id: 'Z01', health: 92, status: 'normal' },
    { id: 'Z02', health: 85, status: 'normal' },
    { id: 'Z03', health: 28, status: 'critical' },
    { id: 'Z04', health: 74, status: 'warning' },
    { id: 'Z05', health: 89, status: 'normal' },
    { id: 'Z06', health: 91, status: 'normal' },
  ];

  return (
    <div className="relative pt-8 pb-12">
      <div className="flex justify-between max-w-[860px] mx-auto relative px-12 mb-6">
        {zoneLabels.map((zone) => {
          return (
            <div key={zone.id} className="flex flex-col items-center gap-2 relative">
              <div className={cn(
                "w-12 py-1.5 rounded-md border text-center flex flex-col transition-all duration-500 bg-[#16171d]",
                zone.status === 'critical' ? "border-red-500/50 text-red-500" :
                zone.status === 'warning' ? "border-orange-500/50 text-orange-500" :
                "border-primary/50 text-primary"
              )}>
                <span className="text-[9px] font-black uppercase tracking-tighter">{zone.id}</span>
                <span className="text-[10px] font-bold">{zone.health}%</span>
              </div>
              <div className={cn(
                "w-[1px] h-6 bg-zinc-800",
                zone.status === 'critical' && "bg-red-500/50",
                zone.status === 'warning' && "bg-orange-500/50",
                zone.status === 'normal' && "bg-primary/50"
              )} />
            </div>
          );
        })}
      </div>

      <div className="relative max-w-[900px] mx-auto">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-12 border-[4px] border-zinc-800 rounded-full z-0" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 border-[4px] border-zinc-800 rounded-full z-0" />

        <div className="h-10 w-full bg-zinc-900 border-y-[4px] border-zinc-800 rounded-full overflow-hidden flex items-center relative z-10 px-2 gap-1">
          {Array.from({ length: 32 }).map((_, i) => {
            let status: 'normal' | 'warning' | 'critical' = 'normal';
            if (i >= 10 && i <= 15) status = 'critical';
            if (i >= 16 && i <= 20) status = 'warning';
            
            return (
              <motion.div 
                key={i}
                animate={status === 'critical' ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={cn(
                  "flex-1 h-6 rounded-[4px] transition-all duration-700",
                  status === 'critical' ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]" :
                  status === 'warning' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" :
                  "bg-primary shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                )} 
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 mt-10">
        {[
          { color: 'bg-primary', label: 'Good (80-100%)' },
          { color: 'bg-orange-500', label: 'Warning (50-79%)' },
          { color: 'bg-red-500', label: 'Critical (0-49%)' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-sm", item.color)} />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
