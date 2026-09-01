'use client';

import { useState, useEffect } from 'react';
import { ref, update, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useRTDB } from '@/hooks/use-rtdb';
import { Save, RefreshCw, AlertTriangle, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { config, isConnected, system } = useRTDB();
  const [localConfig, setLocalConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (config?.thresholds) {
      setLocalConfig(config.thresholds);
    }
  }, [config]);

  const handleSave = async () => {
    if (!localConfig) return;
    setSaving(true);
    try {
      await update(ref(db, 'config/thresholds'), localConfig);
      toast({
        title: "Configuration Updated",
        description: "New safety thresholds have been applied across all zones.",
      });
    } catch (err) {
      console.error('Failed to update config:', err);
    } finally {
      setSaving(false);
    }
  };

  const seedDemoData = async () => {
    setIsInitializing(true);
    const timestamp = Date.now();
    
    // EXACT STRUCTURE REQUESTED BY USER
    const initialData = {
      system: {
        status: 'online',
        deviceId: 'BELT_NODE_01',
        lastSeen: timestamp,
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
        timestamp: timestamp
      },
      sections: {
        "section_01": { name: "Section 01", status: "normal", vibration: 3.1, temperature: 41.2, speed: 1445, alignment: 0.6, lastUpdated: timestamp },
        "section_02": { name: "Section 02", status: "normal", vibration: 3.8, temperature: 43.1, speed: 1452, alignment: 1.1, lastUpdated: timestamp },
        "section_03": { name: "Section 03", status: "warning", vibration: 6.7, temperature: 55.2, speed: 1448, alignment: 2.8, lastUpdated: timestamp },
        "section_04": { name: "Section 04", status: "normal", vibration: 3.4, temperature: 44.5, speed: 1450, alignment: 0.9, lastUpdated: timestamp },
        "section_05": { name: "Section 05", status: "normal", vibration: 4.0, temperature: 46.2, speed: 1447, alignment: 1.4, lastUpdated: timestamp },
        "section_06": { name: "Section 06", status: "normal", vibration: 3.2, temperature: 42.8, speed: 1451, alignment: 0.7, lastUpdated: timestamp }
      },
      history: {
        [timestamp]: { vibration: 3.2, temperature: 42.5, speed: 1450, alignment: 0.8, sectionId: "section_03", timestamp: timestamp }
      },
      alerts: {
        "initial_alert": {
          id: "initial_alert", severity: "warning", sensor: "vibration", sectionId: "section_03",
          message: "High vibration detected at Section 03", value: 6.7, threshold: 5, timestamp: timestamp, acknowledged: false
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

    try {
      await set(ref(db), initialData);
      toast({
        title: "RTDB Initialized",
        description: "Exact structure (/system/alarm, /current/health) is now live.",
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Please ensure RTDB Rules are set to true in Firebase Console.",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">System Config</h1>
          <p className="text-zinc-500 text-sm font-medium">Database Node: studio-8891714996-ea348</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={seedDemoData}
            disabled={isInitializing}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            {isInitializing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Fix & Seed RTDB
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || !isConnected || !localConfig}
            className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Apply Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={cn(
          "industrial-card p-6 space-y-4 border-2",
          isConnected ? "border-primary/20" : "border-red-500/20"
        )}>
          <div className="flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <ShieldCheck size={14} className={isConnected ? "text-primary" : "text-red-500"} /> Connection
            </h3>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isConnected ? "bg-primary shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"
            )} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Project ID</span>
              <span className="font-mono text-white text-[10px]">studio-8891714996-ea348</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Status</span>
              <span className={cn("font-black uppercase tracking-widest", isConnected ? "text-primary" : "text-red-500")}>
                {isConnected ? 'LIVE SYNC' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        {localConfig && (
          <div className="md:col-span-2 industrial-card p-8 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
              <AlertTriangle size={18} className="text-orange-500" /> Threshold Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Vibration</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning</label>
                    <input type="number" step="0.1" value={localConfig.vibration.warning} onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, warning: parseFloat(e.target.value) } })} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500" />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical</label>
                    <input type="number" step="0.1" value={localConfig.vibration.critical} onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, critical: parseFloat(e.target.value) } })} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Thermal</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning</label>
                    <input type="number" value={localConfig.temperature.warning} onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, warning: parseFloat(e.target.value) } })} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500" />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical</label>
                    <input type="number" value={localConfig.temperature.critical} onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, critical: parseFloat(e.target.value) } })} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
