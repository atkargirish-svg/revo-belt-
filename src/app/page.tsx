
'use client';

import { useRTDB } from '@/hooks/use-rtdb';
import { KPISection } from '@/components/dashboard/KPISection';
import { ConveyorVisualization } from '@/components/dashboard/ConveyorVisualization';
import { calculateHealthScore, getStatusLabel } from '@/lib/utils/health-score';
import { formatTimestamp, cn } from '@/lib/utils';
import { AlertCircle, Wifi, WifiOff, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function Dashboard() {
  const { system, current, sections, alerts, config, isConnected } = useRTDB();

  if (!isConnected && !current) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 animate-pulse font-mono text-sm uppercase tracking-widest">Connecting to Industrial Node...</p>
      </div>
    );
  }

  // Fallback to defaults if config isn't loaded yet
  const activeConfig = config?.thresholds || {
    vibration: { warning: 5, critical: 8 },
    temperature: { warning: 50, critical: 70 },
    speed: { minWarning: 1000, maxWarning: 1600, minCritical: 800, maxCritical: 1800 },
    alignment: { warning: 2, critical: 5 }
  };

  const healthScore = current ? calculateHealthScore(current, activeConfig) : 100;
  const status = getStatusLabel(healthScore);
  const activeAlertsCount = alerts ? Object.values(alerts).filter(a => !a.acknowledged).length : 0;

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tighter uppercase">Operations Hub</h2>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold border",
              isConnected ? "bg-primary/10 text-primary border-primary/20" : "bg-critical/10 text-critical border-critical/20"
            )}>
              {isConnected ? 'LIVE FEED' : 'HISTORY MODE'}
            </div>
          </div>
          <p className="text-zinc-500 text-sm">Industrial Conveyor Monitoring System • Device ID: {system?.deviceId || 'UNKNOWN'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-card border border-border px-4 py-2 rounded-lg flex items-center gap-3">
            <Clock size={16} className="text-zinc-500" />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Last Seen</p>
              <p className="text-xs font-mono">{formatTimestamp(system?.lastSeen || 0)}</p>
            </div>
          </div>
          
          <div className="bg-card border border-border px-4 py-2 rounded-lg flex items-center gap-3">
             <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-primary animate-pulse" : "bg-critical"
             )} />
             <span className="text-xs font-mono uppercase">{isConnected ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Columns - Live Stats */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Machine Health Score */}
          <div className="bg-card border border-border p-8 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={160} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Overall Machine Health</h3>
                <div className="flex items-baseline gap-4">
                  <span className="text-6xl font-bold tracking-tighter font-mono">{healthScore}%</span>
                  <span className={cn(
                    "px-4 py-1 rounded text-xs font-bold uppercase",
                    status === 'CRITICAL' ? 'bg-critical text-white' : status === 'WARNING' ? 'bg-warning text-black' : 'bg-primary text-black'
                  )}>
                    {status}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mt-4 max-w-sm">
                  System analysis based on vibration, thermal signatures, and motor rotation patterns.
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase mb-2">Active Alerts</p>
                  <p className={cn("text-3xl font-mono font-bold", activeAlertsCount > 0 ? "text-warning" : "text-zinc-700")}>
                    {activeAlertsCount.toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="h-12 w-[1px] bg-border" />
                <div className="text-center">
                  <p className="text-[10px] text-zinc-500 uppercase mb-2">Efficiency</p>
                  <p className="text-3xl font-mono font-bold text-zinc-200">92%</p>
                </div>
              </div>
            </div>
          </div>

          {current && <KPISection current={current} config={activeConfig} />}
          
          <ConveyorVisualization sections={sections || {}} activeId={current?.sectionId || ''} />
        </div>

        {/* Right Column - Alert Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg flex flex-col h-full min-h-[500px]">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={16} className="text-warning" />
                Live Alerts
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">REALTIME</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {alerts ? Object.entries(alerts).reverse().map(([id, alert]) => (
                <div key={id} className={cn(
                  "p-4 rounded border flex flex-col gap-2 transition-all hover:bg-white/5",
                  alert.severity === 'critical' ? "border-critical/30 bg-critical/5" : "border-zinc-800 bg-zinc-900/50"
                )}>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-2 py-0.5 rounded",
                      alert.severity === 'critical' ? "bg-critical text-white" : "bg-warning text-black"
                    )}>
                      {alert.severity}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">{formatTimestamp(alert.timestamp)}</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] text-zinc-500 uppercase">Section: {alert.sectionId.replace('_', ' ')}</span>
                    <button className="text-[9px] font-bold text-primary uppercase hover:underline">Acknowledge</button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-700">
                  <Zap size={32} className="mb-2 opacity-20" />
                  <p className="text-xs uppercase tracking-widest font-bold">No Active Faults</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border">
              <button className="w-full py-2 text-[10px] font-bold uppercase text-zinc-400 border border-border rounded hover:bg-white/5 transition-colors">
                View Full Logs
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
