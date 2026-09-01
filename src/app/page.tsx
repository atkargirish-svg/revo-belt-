
'use client';

import { useRTDB } from '@/hooks/use-rtdb';
import { KPISection } from '@/components/dashboard/KPISection';
import { ConveyorVisualization } from '@/components/dashboard/ConveyorVisualization';
import { calculateHealthScore } from '@/lib/utils/health-score';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  Activity, 
  Layers, 
  Clock, 
  ChevronRight, 
  Zap,
  FileText,
  Wrench,
  Map as MapIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';

const dummyTrendData = [
  { day: '18 May', value: 85 },
  { day: '19 May', value: 88 },
  { day: '20 May', value: 82 },
  { day: '21 May', value: 86 },
  { day: '22 May', value: 75 },
  { day: '23 May', value: 60 },
  { day: '24 May', value: 28 },
];

export default function Dashboard() {
  const { current, sections, alerts, config } = useRTDB();

  const activeConfig = config?.thresholds || {
    vibration: { warning: 5, critical: 8 },
    temperature: { warning: 50, critical: 70 },
    speed: { minWarning: 1000, maxWarning: 1600, minCritical: 800, maxCritical: 1800 },
    alignment: { warning: 2, critical: 5 }
  };

  const healthScore = current ? calculateHealthScore(current, activeConfig) : 76;
  const activeAlertsCount = alerts ? Object.values(alerts).filter(a => !a.acknowledged).length : 3;

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white p-6 lg:p-10 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 uppercase">Dashboard</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Real-time Conveyor Monitoring System</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#16171d] px-4 py-2 rounded-xl border border-zinc-800/50">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Auto Refresh</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">On</span>
          </div>
          <div className="flex items-center gap-2 bg-[#16171d] px-4 py-2 rounded-xl border border-zinc-800/50 text-zinc-400 cursor-pointer hover:text-white transition-colors">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Last 24 Hours</span>
            <ChevronRight size={12} className="rotate-90 opacity-50" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* KPI Row */}
        <div className="xl:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className="industrial-card p-6 flex items-center justify-between border-l-4 border-l-primary/50 relative overflow-hidden group">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Overall Health</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-primary">{healthScore}%</span>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase">Status: Good</span>
                </div>
              </div>
            </div>
            <div className="h-10 w-20 opacity-20 absolute -right-2 top-8 group-hover:opacity-40 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyTrendData.slice(0, 5)}>
                  <Area type="monotone" dataKey="value" stroke="#22c55e" fill="none" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="industrial-card p-6 flex items-center gap-4 border-l-4 border-l-orange-500/50">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Active Alerts</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-orange-500">{activeAlertsCount}</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase">Action Req.</span>
              </div>
            </div>
          </div>

          <div className="industrial-card p-6 flex items-center gap-4 border-l-4 border-l-blue-500/50">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sections Online</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">06/06</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase">Monitored</span>
              </div>
            </div>
          </div>

          <div className="industrial-card p-6 flex items-center gap-4 border-l-4 border-l-purple-500/50">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">System Uptime</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">99.9%</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase">Stability: High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-8">
          <div className="industrial-card p-8 bg-[#16171d]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Conveyor Belt Map</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Live zone tracking (Z01 - Z06)</p>
              </div>
            </div>
            <ConveyorVisualization sections={sections || {}} activeId={current?.sectionId || 'section_03'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="industrial-card p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-8 text-white">Live Sensor Data</h3>
              <KPISection current={current || {} as any} config={activeConfig} />
            </div>

            <div className="industrial-card p-8">
               <h3 className="text-sm font-bold uppercase tracking-wider mb-8 text-white">Health Performance Trend</h3>
               <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyTrendData}>
                    <defs>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#525252', fontSize: 9}} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#525252', fontSize: 9}} />
                    <Tooltip contentStyle={{backgroundColor: '#16171d', border: '1px solid #262626', borderRadius: '8px'}} />
                    <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorHealth)" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="xl:col-span-4 space-y-8">
          <div className="industrial-card p-8 border-red-500/40 bg-red-500/[0.04] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} className="text-red-500" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
              <Zap size={14} className="animate-pulse" /> Critical Alert Detected
            </h3>
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[9px] font-black text-red-500/60 uppercase tracking-widest mb-1">Zone 03 Fault</p>
                <h4 className="text-xl font-bold">Section ID: B-1042</h4>
              </div>
              <div className="space-y-4 py-6 border-y border-red-500/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Vibration Offset</span>
                  <span className="text-lg font-bold text-red-500 font-mono">+8.6 mm/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Probability</span>
                  <span className="text-lg font-bold text-red-500 font-mono">82% Critical</span>
                </div>
              </div>
              <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-900/20">
                Analyze Failure Data
              </button>
            </div>
          </div>

          <div className="industrial-card p-8">
            <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-zinc-500">Node Status Details</h3>
            <div className="space-y-5">
              {[
                { label: 'Device ID', val: 'BELT_NODE_01', font: 'font-mono text-[10px]' },
                { label: 'Active Zone', val: 'Zone 03' },
                { label: 'Firmware', val: 'v1.2.4', font: 'font-mono' },
                { label: 'Sync Status', val: 'Healthy', color: 'text-primary' },
                { label: 'Signal Str.', val: '-42 dBm', font: 'font-mono' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs pb-4 border-b border-zinc-800/50 last:border-0 last:pb-0">
                  <span className="text-zinc-600 font-black uppercase tracking-widest text-[9px]">{item.label}</span>
                  <span className={cn("text-white font-bold", item.color, item.font)}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="industrial-card p-8">
            <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-zinc-500">Quick Tools</h3>
            <div className="space-y-4">
              {[
                { icon: MapIcon, title: 'Spatial Mapping', sub: 'Interactive 3D viewport' },
                { icon: FileText, title: 'Shift Report', sub: 'Last 8h operational summary' },
                { icon: Wrench, title: 'Calibrate Sensors', sub: 'Zero-point alignment' },
              ].map((action, i) => (
                <button key={i} className="w-full bg-[#1e1f26]/30 hover:bg-[#1e1f26]/60 border border-zinc-800/50 p-4 rounded-xl flex items-center gap-4 group transition-all">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <action.icon size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[11px] font-bold text-white leading-tight">{action.title}</p>
                    <p className="text-[9px] text-zinc-600 font-medium">{action.sub}</p>
                  </div>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
