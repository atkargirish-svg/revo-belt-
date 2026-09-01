
'use client';

import { SensorData, ThresholdConfig } from '@/lib/types/sensor';
import { Activity, Thermometer, Gauge, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIProps {
  current: SensorData;
  config: ThresholdConfig;
}

export function KPISection({ current, config }: KPIProps) {
  const cards = [
    {
      label: 'Vibration',
      value: current.vibration,
      unit: 'mm/s',
      icon: Activity,
      status: current.vibration > config.vibration.critical ? 'critical' : current.vibration > config.vibration.warning ? 'warning' : 'normal',
    },
    {
      label: 'Temperature',
      value: current.temperature,
      unit: '°C',
      icon: Thermometer,
      status: current.temperature > config.temperature.critical ? 'critical' : current.temperature > config.temperature.warning ? 'warning' : 'normal',
    },
    {
      label: 'Belt Speed',
      value: current.speed,
      unit: 'RPM',
      icon: Gauge,
      status: (current.speed < config.speed.minWarning || current.speed > config.speed.maxWarning) ? 'warning' : 'normal',
    },
    {
      label: 'Alignment',
      value: current.alignment,
      unit: 'mm',
      icon: ArrowLeftRight,
      status: Math.abs(current.alignment) > config.alignment.critical ? 'critical' : Math.abs(current.alignment) > config.alignment.warning ? 'warning' : 'normal',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{card.label}</span>
              <Icon className={cn(
                "w-5 h-5",
                card.status === 'critical' ? 'text-critical' : card.status === 'warning' ? 'text-warning' : 'text-primary'
              )} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono tracking-tighter">{card.value.toFixed(1)}</span>
              <span className="text-zinc-500 text-sm font-medium">{card.unit}</span>
            </div>
            <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
               <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  card.status === 'critical' ? 'bg-critical' : card.status === 'warning' ? 'bg-warning' : 'bg-primary'
                )}
                style={{ width: `${Math.min(100, (card.value / (card.label === 'Temperature' ? 100 : 15)) * 100)}%` }}
               />
            </div>
          </div>
        );
      })}
    </div>
  );
}
