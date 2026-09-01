
'use client';

import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useRTDB } from '@/hooks/use-rtdb';
import { formatTimestamp } from '@/lib/utils';

export default function AlertsPage() {
  const { alerts } = useRTDB();
  const alertList = alerts ? Object.values(alerts).sort((a: any, b: any) => b.timestamp - a.timestamp) : [];

  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">Alert Management</h1>
          <p className="text-zinc-500">System generated faults and predictive maintenance warnings.</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded transition-colors">
          Clear All History
        </button>
      </div>

      <div className="space-y-4">
        {alertList.length > 0 ? alertList.map((alert: any) => (
          <div 
            key={alert.id} 
            className={`industrial-card p-5 flex items-center gap-6 border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-600' : 'border-l-orange-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              alert.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
            }`}>
              <ShieldAlert size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  alert.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-black'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  Section: {alert.sectionId} • {formatTimestamp(alert.timestamp)}
                </span>
              </div>
              <p className="text-sm font-bold text-zinc-200">{alert.message}</p>
            </div>

            <div className="text-right">
              <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">Detected Value</p>
              <p className="text-lg font-mono font-bold text-white">{alert.value} <span className="text-[10px] opacity-50">vs {alert.threshold}</span></p>
            </div>

            <button className="p-2 text-zinc-600 hover:text-primary transition-colors">
              <CheckCircle2 size={20} />
            </button>
          </div>
        )) : (
          <div className="py-32 text-center border border-dashed border-zinc-800 rounded-2xl">
            <Bell className="mx-auto text-zinc-800 mb-4" size={48} />
            <p className="text-zinc-600 font-bold uppercase text-xs tracking-widest">All systems clear. No active alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
