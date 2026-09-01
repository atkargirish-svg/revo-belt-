
'use client';

import { useState, useEffect } from 'react';
import { ref, update, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useRTDB } from '@/hooks/use-rtdb';
import { Save, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { config, isConnected, system } = useRTDB();
  const [localConfig, setLocalConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);

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
    } catch (err) {
      console.error('Failed to update config:', err);
    } finally {
      setSaving(false);
    }
  };

  const seedDemoData = async () => {
    const sections: Record<string, any> = {};
    for (let i = 1; i <= 6; i++) {
      const id = `section_0${i}`;
      sections[id] = {
        id,
        name: `Section 0${i}`,
        status: 'normal',
        vibration: 2.5 + Math.random(),
        temperature: 38 + Math.random() * 5,
        speed: 1450 + Math.random() * 20,
        alignment: 0.2 + Math.random() * 0.5,
        lastUpdated: Date.now()
      };
    }

    const initialData = {
      system: {
        status: 'online',
        deviceId: 'BELT_NODE_01',
        lastSeen: Date.now(),
        firmwareVersion: '1.2.4'
      },
      current: {
        vibration: 3.2,
        temperature: 42.5,
        speed: 1.45,
        alignment: 0.8,
        sectionId: 'section_01',
        sectionName: 'Section 01',
        timestamp: Date.now()
      },
      sections,
      config: {
        thresholds: {
          vibration: { warning: 5, critical: 8 },
          temperature: { warning: 50, critical: 70 },
          speed: { minWarning: 0.5, maxWarning: 3.0, minCritical: 0.2, maxCritical: 4.0 },
          alignment: { warning: 2, critical: 5 }
        }
      },
      alerts: {
        "initial_alert": {
          id: "initial_alert",
          severity: "warning",
          sensor: "vibration",
          sectionId: "section_03",
          message: "Atypical vibration pattern detected in Zone 03",
          value: 5.2,
          threshold: 5.0,
          timestamp: Date.now(),
          acknowledged: false
        }
      }
    };

    try {
      await set(ref(db), initialData);
      alert("Database Seeded Successfully!");
    } catch (e) {
      console.error(e);
      alert("Seeding Failed. Check Firebase Rules.");
    }
  };

  if (!localConfig && isConnected) return <div className="p-10 text-zinc-500 font-mono">Initializing Configuration...</div>;
  if (!isConnected) return <div className="p-10 text-red-500 font-mono italic">Offline: Check your Firebase Database URL and Rules.</div>;

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">System Config</h1>
          <p className="text-zinc-500 text-sm font-medium">Fine-tune sensor thresholds and operational parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || !isConnected}
          className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Apply Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Device Info */}
        <div className="industrial-card p-6 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> Node Identity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Device ID</span>
              <span className="font-mono text-white">{system?.deviceId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Firmware</span>
              <span className="font-mono text-white">{system?.firmwareVersion || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">RTDB Sync</span>
              <span className={cn("font-black uppercase tracking-widest", isConnected ? "text-primary" : "text-red-500")}>
                {isConnected ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Developer Tools */}
        <div className="industrial-card p-6 space-y-4 border-dashed border-zinc-700">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <RefreshCw size={14} className="text-blue-500" /> Maintenance Tools
          </h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
            Reset or initialize the database with sample industrial data. This will overwrite existing sensor readings.
          </p>
          <button 
            onClick={seedDemoData}
            className="w-full py-3 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700"
          >
            Seed Initial Database Structure
          </button>
        </div>

        {/* Threshold Editor */}
        <div className="md:col-span-2 industrial-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
              <AlertTriangle size={18} className="text-orange-500" /> Safety Threshold Management
            </h3>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-3 py-1 rounded-full">Real-time Updates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Vibration */}
            <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Vibration (mm/s)</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning Limit</label>
                  <input 
                    type="number" 
                    value={localConfig.vibration.warning}
                    onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, warning: parseFloat(e.target.value) } })}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical Limit</label>
                  <input 
                    type="number" 
                    value={localConfig.vibration.critical}
                    onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, critical: parseFloat(e.target.value) } })}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-5 p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Temperature (°C)</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Warning Limit</label>
                  <input 
                    type="number" 
                    value={localConfig.temperature.warning}
                    onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, warning: parseFloat(e.target.value) } })}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical Limit</label>
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
                    value={localConfig.alignment.warning}
                    onChange={(e) => setLocalConfig({ ...localConfig, alignment: { ...localConfig.alignment, warning: parseFloat(e.target.value) } })}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-orange-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 block mb-1.5 uppercase font-black tracking-widest">Critical Offset</label>
                  <input 
                    type="number" 
                    value={localConfig.alignment.critical}
                    onChange={(e) => setLocalConfig({ ...localConfig, alignment: { ...localConfig.alignment, critical: parseFloat(e.target.value) } })}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm font-mono text-red-500 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
