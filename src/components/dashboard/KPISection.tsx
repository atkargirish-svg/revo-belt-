
'use client';

import { SensorData, ThresholdConfig } from '@/lib/types/sensor';
import { cn } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface KPIProps {
  current: SensorData | null;
  config: ThresholdConfig;
}

const generateData = () => Array.from({ length: 12 }, () => ({ v: 10 + Math.random() * 20 }));

export function KPISection({ current, config }: KPIProps) {
  // Robust numeric fallbacks to prevent "toFixed of undefined" errors
  const vibration = current?.vibration ?? 0;
  const temperature = current?.temperature ?? 0;
  const speed = current?.speed ?? 0;
  const alignment = current?.alignment ?? 0;

  const cards = [
    {
      label: 'Vibration',
      value: vibration,
      unit: 'mm/s',
      status: vibration > (config?.vibration?.critical ?? 8) ? 'critical' : vibration > (config?.vibration?.warning ?? 5) ? 'warning' : 'normal',
      color: 'text-red-500',
      waveColor: '#ef4444',
      data: generateData()
    },
    {
      label: 'Temperature',
      value: temperature,
      unit: '°C',
      status: temperature > (config?.temperature?.critical ?? 70) ? 'critical' : temperature > (config?.temperature?.warning ?? 50) ? 'warning' : 'normal',
      color: 'text-primary',
      waveColor: '#22c55e',
      data: generateData()
    },
    {
      label: 'Belt Speed',
      value: speed,
      unit: 'RPM',
      status: speed > (config?.speed?.maxCritical ?? 1800) || speed < (config?.speed?.minCritical ?? 800) ? 'critical' : 'normal',
      color: 'text-blue-500',
      waveColor: '#3b82f6',
      data: generateData()
    },
    {
      label: 'Alignment',
      value: alignment,
      unit: 'mm',
      status: Math.abs(alignment) > (config?.alignment?.critical ?? 5) ? 'critical' : Math.abs(alignment) > (config?.alignment?.warning ?? 2) ? 'warning' : 'normal',
      color: 'text-orange-500',
      waveColor: '#f97316',
      data: generateData()
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div 
          key={card.label} 
          className="p-4 bg-[#1e1f26]/40 border border-zinc-800/50 rounded-xl relative hover:border-zinc-700/50 transition-all group overflow-hidden"
        >
          <div className="flex flex-col mb-4">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{card.label}</p>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-xl font-bold font-mono tracking-tight",
                card.status === 'critical' ? 'text-red-500' : 
                card.status === 'warning' ? 'text-orange-500' : 
                card.label === 'Belt Speed' ? 'text-blue-500' : 'text-primary'
              )}>
                {Number(card.value).toFixed(1)}
              </span>
              <span className="text-zinc-600 text-[9px] font-bold uppercase">{card.unit}</span>
            </div>
          </div>
          
          <div className="h-10 w-full opacity-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={card.data}>
                <Area type="monotone" dataKey="v" stroke={card.waveColor} fill="none" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
