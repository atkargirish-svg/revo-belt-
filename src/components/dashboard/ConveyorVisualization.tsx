
'use client';

import { SectionStatus } from '@/lib/types/sensor';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  sections: Record<string, SectionStatus>;
  activeId: string;
}

export function ConveyorVisualization({ sections, activeId }: Props) {
  const sectionList = Object.values(sections || {}).sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="bg-card border border-border p-6 rounded-lg">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8">Conveyor Section Mapping</h3>
      
      <div className="relative flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 py-8">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-900 -translate-y-1/2 hidden lg:block" />

        {sectionList.map((section, idx) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative z-10 flex flex-col items-center gap-4 flex-1 min-w-[120px]"
          >
            <div className={cn(
              "w-full h-12 rounded border-2 flex items-center justify-center transition-all cursor-pointer group",
              section.id === activeId ? "border-primary shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-primary/5" : "border-zinc-800 bg-zinc-900",
              section.status === 'critical' && "border-critical bg-critical/5",
              section.status === 'warning' && "border-warning bg-warning/5"
            )}>
              <span className={cn(
                "text-[10px] font-bold tracking-tighter uppercase",
                section.id === activeId ? "text-primary" : "text-zinc-600",
                section.status === 'critical' && "text-critical",
                section.status === 'warning' && "text-warning"
              )}>
                {section.name}
              </span>
              
              {section.id === activeId && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
              )}
            </div>
            
            <div className="flex flex-col items-center text-[10px] text-zinc-500 font-mono">
              <span>{section.vibration.toFixed(1)} mm/s</span>
              <span>{section.temperature.toFixed(0)}°C</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
