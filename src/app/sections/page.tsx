
'use client';

import { Layers } from 'lucide-react';
import { useRTDB } from '@/hooks/use-rtdb';

export default function SectionsPage() {
  const { sections } = useRTDB();

  return (
    <div className="p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">Belt Sections</h1>
        <p className="text-zinc-500">Detailed diagnostic overview of each conveyor segment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections && Object.values(sections).map((section: any) => (
          <div key={section.id} className="industrial-card p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold uppercase text-sm">{section.name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono">{section.id}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                section.status === 'critical' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
                section.status === 'warning' ? 'bg-orange-500/10 border-orange-500/50 text-orange-500' :
                'bg-primary/10 border-primary/50 text-primary'
              }`}>
                {section.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Vibration</p>
                <p className="text-sm font-mono font-bold">{section.vibration.toFixed(1)} mm/s</p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Temp</p>
                <p className="text-sm font-mono font-bold">{section.temperature.toFixed(1)}°C</p>
              </div>
            </div>
          </div>
        ))}
        {!sections && (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-xl">
            <Layers className="mx-auto text-zinc-700 mb-4" size={40} />
            <p className="text-zinc-600 font-bold uppercase text-xs tracking-widest">No active sections detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
