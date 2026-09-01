
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
    
    const sections: Record<string, any> = {
      "section_01": {
        name: "Section 01",
        status: "normal",
        vibration: 3.1,
        temperature: 41.2,
        speed: 1445,
        alignment: 0.6,
        lastUpdated: timestamp
      },
      "section_02": {
        name: "Section 02",
        status: "normal",
        vibration: 3.8,
        temperature: 43.1,
        speed: 1452,
        alignment: 1.1,
        lastUpdated: timestamp
      },
      "section_03": {
        name: "Section 03",
        status: "warning",
        vibration: 6.7,
        temperature: 55.2,
        speed: 1448,
        alignment: 2.8,
        lastUpdated: timestamp
      },
      "section_04": {
        name: "Section 04",
        status: "normal",
        vibration: 3.4,
        temperature: 44.5,
        speed: 1450,
        alignment: 0.9,
        lastUpdated: timestamp
      },
      "section_05": {
        name: "Section 05",
        status: "normal",
        vibration: 4.0,
        temperature: 46.2,
        speed: 1447,
        alignment: 1.4,
        lastUpdated: timestamp
      },
      "section_06": {
        name: "Section 06",
        status: "normal",
        vibration: 3.2,
        temperature: 42.8,
        speed: 1451,
        alignment: 0.7,
        lastUpdated: timestamp
      }
    };

    const initialData = {
      system: {
        status: 'online',
        deviceId: 'BELT_NODE_01',
        lastSeen: timestamp,
        firmwareVersion: '1.0.0'
      },
      current: {
        vibration: 3.2,
        temperature: 42.5,
        speed: 1450,
        alignment: 0.8,
        sectionId: 'section_03',
        sectionName: 'Section 03',
        timestamp: timestamp
      },
      sections,
      config: {
        thresholds: {
          vibration: { warning: 5, critical: 8 },
          temperature: { warning: 50, critical: 70 },
          speed: { 
            minWarning: 1000, 
            maxWarning: 1600, 
            minCritical: 800, 
            maxCritical: 1800 
          },
          alignment: { warning: 2, critical: 5 }
        }
      },
      alerts: {
        "alert_001": {
          id: "alert_001",
          severity: "warning",
          sensor: "vibration",
          sectionId: "section_03",
          message: "High vibration detected at Section 03",
          value: 6.7,
          threshold: 5,
          timestamp: timestamp,
          acknowledged: false
        }
      },
      history: {
        [`hist_${timestamp}`]: {
          vibration: 3.2,
          temperature: 42.5,
          speed: 1450,
          alignment: 0.8,
          sectionId: "section_03",
          timestamp: timestamp
        }
      }
    };

    try {
      await set(ref(db), initialData);
      toast({
        title: "Database Seeding Successful",
        description: "Exact industrial structure set in Firebase RTDB.",
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Push Failed",
        description: "Please check your Firebase RTDB Rules (set to true).",
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
          <p className="text-zinc-500 text-sm font-medium">Fine-tune sensor thresholds and operational parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || !isConnected || !localConfig}
          className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Apply Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Connection Status */}
        <div className={cn(
          "industrial-card p-6 space-y-4 border-2",
          isConnected ? "border-primary/20" : "border-red-500/20"
        )}>
          <div className="flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <ShieldCheck size={14} className={isConnected ? "text-primary" : "text-red-500"} /> System Health
            </h3>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isConnected ? "bg-primary shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"
            )} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Device ID</span>
              <span className="font-mono text-white">{system?.deviceId || 'OFFLINE'}</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">RTDB Sync</span>
              <span className={cn("font-black uppercase tracking-widest", isConnected ? "text-primary" : "text-red-500")}>
                {isConnected ? 'ONLINE' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Fix Section */}
        <div className="industrial-card p-6 space-y-4 border-blue-500/20 bg-blue-500/[0.02]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Database size={14} /> Database Reset
          </h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
            Reset Firebase RTDB to the exact Z01-Z06 industrial monitoring structure.
          </p>
          <button 
            onClick={seedDemoData}
            disabled={isInitializing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            {isInitializing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Fix & Seed RTDB
          </button>
        </div>

        {/* Threshold Editor */}
        {localConfig && (
          <div className="md:col-span-2 industrial-card p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
                <AlertTriangle size={18} className="text-orange-500" /> Operational Thresholds
              </h3>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-3 py-1 rounded-full">Secure Sync</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Vibration */}
              <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Vibration (mm/s)</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={localConfig.vibration.warning}
                      onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, warning: parseFloat(e.target.value) } })}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={localConfig.vibration.critical}
                      onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, critical: parseFloat(e.target.value) } })}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Thermal (°C)</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning</label>
                    <input 
                      type="number" 
                      value={localConfig.temperature.warning}
                      onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, warning: parseFloat(e.target.value) } })}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical</label>
                    <input 
                      type="number" 
                      value={localConfig.temperature.critical}
                      onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, critical: parseFloat(e.target.value) } })}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Alignment */}
               <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Alignment (mm)</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning Offset</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={localConfig.alignment.warning}
                      onChange={(e) => setLocalConfig({ ...localConfig, alignment: { ...localConfig.alignment, warning: parseFloat(e.target.value) } })}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical Offset</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={localConfig.alignment.critical}
                      onChange={(e) => setLocalConfig({ ...localConfig, alignment: { ...localConfig.alignment, critical: parseFloat(e.target.value) } })}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500 focus:outline-none focus:border-red-500/50"
                    />
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
