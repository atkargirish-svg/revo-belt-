
'use client';

import { useEffect } from 'react';
import { useRTDB } from '@/hooks/use-rtdb';
import { KPISection } from '@/components/dashboard/KPISection';
import { ConveyorVisualization } from '@/components/dashboard/ConveyorVisualization';
import { calculateHealthScore } from '@/lib/utils/health-score';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { ref, set, get } from 'firebase/database';
import { 
  AlertCircle, 
  Activity, 
  Layers, 
  Clock, 
  Zap,
  Volume2,
  VolumeX
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
  const { current, sections, alerts, config, system } = useRTDB();

  useEffect(() => {
    const checkAndInit = async () => {
      const snapshot = await get(ref(db, 'system'));
      if (!snapshot.exists()) {
        const ts = Date.now();
        const initialData = {
          system: {
            status: 'online',
            deviceId: 'BELT_NODE_01',
            lastSeen: ts,
            firmwareVersion: '1.0.0',
            alarm: false
          },
          current: {
            vibration: 3.2,
            temperature: 42.5,
            speed: 1450,
            alignment: 0.8,
            health: 76,
            sectionId: 'section_03',
            sectionName: 'Section 03',
            timestamp: ts
          },
          sections: {
            "section_01": { id: "section_01", name: "Section 01", status: "normal", vibration: 3.1, temperature: 41.2, speed: 1445, alignment: 0.6, lastUpdated: ts },
            "section_02": { id: "section_02", name: "Section 02", status: "normal", vibration: 3.8, temperature: 43.1, speed: 1452, alignment: 1.1, lastUpdated: ts },
            "section_03": { id: "section_03", name: "Section 03", status: "warning", vibration: 6.7, temperature: 55.2, speed: 1448, alignment: 2.8, lastUpdated: ts },
            "section_04": { id: "section_04", name: "Section 04", status: "normal", vibration: 3.4, temperature: 44.5, speed: 1450, alignment: 0.9, lastUpdated: ts },
            "section_05": { id: "section_05", name: "Section 05", status: "normal", vibration: 4.0, temperature: 46.2, speed: 1447, alignment: 1.4, lastUpdated: ts },
            "section_06": { id: "section_06", name: "Section 06", status: "normal", vibration: 3.2, temperature: 42.8, speed: 1451, alignment: 0.7, lastUpdated: ts }
          },
          alerts: {
            "alert_init": {
              id: "alert_init", severity: "warning", sensor: "vibration", sectionId: "section_03",
              message: "High vibration detected at Section 03", value: 6.7, threshold: 5, timestamp: ts, acknowledged: false
            }
          },
          config: {
            thresholds: {
              vibration: { warning: 5, critical: 8 },
              temperature: { warning: 50, critical: 70 },
              speed: { minWarning: 1000, maxWarning: 1600, minCritical: 800, maxCritical: 1800 },
              alignment: { warning: 2, critical: 5 }
            }
          }
        };
        set(ref(db), initialData);
      }
    };
    checkAndInit();
  }, []);

  const activeConfig = config?.thresholds || {
    vibration: { warning: 5, critical: 8 },
    temperature: { warning: 50, critical: 70 },
    speed: { minWarning: 1000, maxWarning: 1600, minCritical: 800, maxCritical: 1800 },
    alignment: { warning: 2, critical: 5 }
  };

  const healthScore = current?.health !== undefined ? current.health : (current ? calculateHealthScore(current, activeConfig) : 76);
  const activeAlertsCount = alerts ? Object.values(alerts).filter(a => !a.acknowledged).length : 0;

  const toggleAlarm = async () => {
    const newStatus = !system?.alarm;
    set(ref(db, 'system/alarm'), newStatus);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white p-4 lg:p-10 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-1 uppercase">Dashboard</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Monitoring System</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={toggleAlarm}
            className={cn(
              "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
              system?.alarm 
                ? "bg-red-600 border-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
            )}
          >
            {system?.alarm ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {system?.alarm ? "Stop Alarm" : "Trigger Alarm"}
          </button>
          
          <div className="flex items-center justify-center gap-2 bg-[#16171d] px-4 py-2.5 rounded-xl border border-zinc-800/50">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Connection</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </header>

      <div className="space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="industrial-card p-5 lg:p-6 flex items-center justify-between border-l-4 border-l-primary/50">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Health</p>
                <span className="text-xl lg:text-2xl font-bold font-mono text-primary">{healthScore}%</span>
              </div>
            </div>
          </div>

          <div className="industrial-card p-5 lg:p-6 flex items-center gap-4 border-l-4 border-l-orange-500/50">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Alerts</p>
              <span className="text-xl lg:text-2xl font-bold font-mono text-orange-500">{activeAlertsCount}</span>
            </div>
          </div>

          <div className="industrial-card p-5 lg:p-6 flex items-center gap-4 border-l-4 border-l-blue-500/50">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Zones</p>
              <span className="text-xl lg:text-2xl font-bold font-mono text-white">06 Online</span>
            </div>
          </div>

          <div className="industrial-card p-5 lg:p-6 flex items-center gap-4 border-l-4 border-l-purple-500/50">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Uptime</p>
              <span className="text-xl lg:text-2xl font-bold font-mono text-white">99.9%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          <div className="xl:col-span-8 space-y-6 lg:space-y-8">
            <div className="industrial-card p-4 lg:p-8 bg-[#16171d]">
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Conveyor Map</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Zone Health Distribution</p>
              </div>
              <ConveyorVisualization sections={sections || {}} activeId={current?.sectionId || 'section_03'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="industrial-card p-4 lg:p-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Sensor Grid</h3>
                <KPISection current={current || {} as any} config={activeConfig} />
              </div>

              <div className="industrial-card p-4 lg:p-8">
                 <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Health Trend</h3>
                 <div className="h-[200px] w-full">
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

          <div className="xl:col-span-4">
            <div className="industrial-card p-6 lg:p-8 border-red-500/40 bg-red-500/[0.04] relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={64} className="text-red-500" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                <Zap size={14} className="animate-pulse" /> Live Section Status
              </h3>
              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-[9px] font-black text-red-500/60 uppercase tracking-widest mb-1">Detected Zone</p>
                  <h4 className="text-xl lg:text-2xl font-bold">{current?.sectionName || 'Monitoring...'}</h4>
                </div>
                <div className="space-y-4 py-6 border-y border-red-500/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Vibration</span>
                    <span className="text-lg font-bold text-red-500 font-mono">{current?.vibration?.toFixed(1) || '0.0'} mm/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Temp</span>
                    <span className="text-lg font-bold text-white font-mono">{current?.temperature?.toFixed(1) || '0.0'} °C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Health Score</span>
                    <span className="text-lg font-bold text-primary font-mono">{healthScore}%</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-red-600/10 border border-red-600/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-600/20 transition-all">
                  View Full Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
