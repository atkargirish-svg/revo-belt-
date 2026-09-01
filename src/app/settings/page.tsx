
'use client';

import { useState, useEffect } from 'react';
import { ref, update, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useRTDB } from '@/hooks/use-rtdb';
import { Save, RefreshCw, AlertTriangle, ShieldCheck, Database, Zap } from 'lucide-react';
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
        title: "Thresholds Updated",
        description: "New safety parameters pushed to all monitoring nodes.",
      });
    } catch (err) {
      console.error('Failed to update config:', err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not push changes to database.",
      });
    } finally {
      setSaving(false);
    }
  };

  const seedDatabase = async () => {
    setIsInitializing(true);
    const ts = Date.now();
    
    // EXACT INDUSTRIAL STRUCTURE FOR RTDB
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
      history: {
        [`h_${ts}`]: { vibration: 3.2, temperature: 42.5, speed: 1450, alignment: 0.8, sectionId: "section_03", timestamp: ts }
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

    try {
      await set(ref(db), initialData);
      toast({
        title: "Database Initialized",
        description: "Industrial structure is now live in Firebase Console.",
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Seed Failed",
        description: "Ensure Database Rules are set to public in Firebase Console.",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">System Config</h1>
          <p className="text-zinc-500 text-sm font-medium flex items-center gap-2">
            <Zap size={14} className="text-primary" /> Active Node: studio-8891714996-ea348
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={seedDatabase}
            disabled={isInitializing}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)]"
          >
            {isInitializing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Fix & Seed RTDB
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || !isConnected || !localConfig}
            className="flex items-center gap-2 bg-primary text-black px-6 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)]"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Parameters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={cn(
          "industrial-card p-6 space-y-4 border-2 md:col-span-1",
          isConnected ? "border-primary/20" : "border-red-500/20"
        )}>
          <div className="flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <ShieldCheck size={14} className={isConnected ? "text-primary" : "text-red-500"} /> Status
            </h3>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isConnected ? "bg-primary shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"
            )} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Connection</span>
              <span className={cn("font-black uppercase tracking-widest", isConnected ? "text-primary" : "text-red-500")}>
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Sync Type</span>
              <span className="text-white font-mono text-[9px]">REAL-TIME</span>
            </div>
          </div>
        </div>

        {localConfig && (
          <div className="md:col-span-3 industrial-card p-8 space-y-10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white border-b border-zinc-800 pb-4">
              <AlertTriangle size={18} className="text-orange-500" /> Threshold Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ThresholdBox 
                title="Vibration (mm/s)" 
                warning={localConfig.vibration.warning} 
                critical={localConfig.vibration.critical}
                onWarningChange={(v) => setLocalConfig({...localConfig, vibration: {...localConfig.vibration, warning: v}})}
                onCriticalChange={(v) => setLocalConfig({...localConfig, vibration: {...localConfig.vibration, critical: v}})}
              />
              
              <ThresholdBox 
                title="Thermal (°C)" 
                warning={localConfig.temperature.warning} 
                critical={localConfig.temperature.critical}
                onWarningChange={(v) => setLocalConfig({...localConfig, temperature: {...localConfig.temperature, warning: v}})}
                onCriticalChange={(v) => setLocalConfig({...localConfig, temperature: {...localConfig.temperature, critical: v}})}
              />

              <ThresholdBox 
                title="Alignment (mm)" 
                warning={localConfig.alignment.warning} 
                critical={localConfig.alignment.critical}
                onWarningChange={(v) => setLocalConfig({...localConfig, alignment: {...localConfig.alignment, warning: v}})}
                onCriticalChange={(v) => setLocalConfig({...localConfig, alignment: {...localConfig.alignment, critical: v}})}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ThresholdBox({ title, warning, critical, onWarningChange, onCriticalChange }: any) {
  return (
    <div className="space-y-5 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">{title}</p>
      <div className="space-y-5">
        <div>
          <label className="text-[9px] text-zinc-600 block mb-1.5 uppercase font-black tracking-widest">Warning Limit</label>
          <input 
            type="number" 
            step="0.1" 
            value={warning} 
            onChange={(e) => onWarningChange(parseFloat(e.target.value))} 
            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50" 
          />
        </div>
        <div>
          <label className="text-[9px] text-zinc-600 block mb-1.5 uppercase font-black tracking-widest">Critical Limit</label>
          <input 
            type="number" 
            step="0.1" 
            value={critical} 
            onChange={(e) => onCriticalChange(parseFloat(e.target.value))} 
            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono text-red-500 focus:outline-none focus:border-red-500/50" 
          />
        </div>
      </div>
    </div>
  );
}
