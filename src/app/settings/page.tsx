
'use client';

import { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
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
      // Optional: Add success toast
    } catch (err) {
      console.error('Failed to update config:', err);
    } finally {
      setSaving(false);
    }
  };

  const seedDemoData = async () => {
    const sections = {};
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
        firmwareVersion: '1.0.0'
      },
      current: {
        vibration: 3.2,
        temperature: 42.5,
        speed: 1450,
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
          speed: { minWarning: 1000, maxWarning: 1600, minCritical: 800, maxCritical: 1800 },
          alignment: { warning: 2, critical: 5 }
        }
      }
    };

    await update(ref(db), initialData);
  };

  if (!localConfig) return <div className="p-10 text-zinc-500 font-mono">Loading Config Node...</div>;

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">System Config</h1>
          <p className="text-zinc-500 text-sm">Fine-tune sensor thresholds and operational parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || !isConnected}
          className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded font-bold text-xs uppercase hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Device Info */}
        <div className="bg-card border border-border p-6 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <ShieldCheck size={14} /> Node Identity
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs py-2 border-b border-border/50">
              <span className="text-zinc-500">Device ID</span>
              <span className="font-mono">{system?.deviceId}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-border/50">
              <span className="text-zinc-500">Firmware</span>
              <span className="font-mono">{system?.firmwareVersion}</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-zinc-500">RTDB Sync</span>
              <span className={cn("font-bold uppercase", isConnected ? "text-primary" : "text-critical")}>
                {isConnected ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Tools */}
        <div className="bg-card border border-border p-6 rounded-lg space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <RefreshCw size={14} /> Developer Tools
          </h3>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Use these tools to initialize the Firebase structure with sample industrial data for testing.
          </p>
          <button 
            onClick={seedDemoData}
            className="w-full py-2 bg-zinc-800 text-white rounded text-[10px] font-bold uppercase hover:bg-zinc-700 transition-colors"
          >
            Seed Initial Database Structure
          </button>
        </div>

        {/* Threshold Editor */}
        <div className="md:col-span-2 bg-card border border-border p-8 rounded-lg space-y-8">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning" /> Threshold Management
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Vibration */}
            <div className="space-y-4 p-4 rounded border border-border/50">
              <p className="text-[10px] font-bold uppercase text-zinc-500 border-b border-border/50 pb-2">Vibration (mm/s)</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 uppercase font-bold">Warning Level</label>
                  <input 
                    type="number" 
                    value={localConfig.vibration.warning}
                    onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, warning: parseFloat(e.target.value) } })}
                    className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm font-mono text-warning"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 uppercase font-bold">Critical Level</label>
                  <input 
                    type="number" 
                    value={localConfig.vibration.critical}
                    onChange={(e) => setLocalConfig({ ...localConfig, vibration: { ...localConfig.vibration, critical: parseFloat(e.target.value) } })}
                    className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm font-mono text-critical"
                  />
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-4 p-4 rounded border border-border/50">
              <p className="text-[10px] font-bold uppercase text-zinc-500 border-b border-border/50 pb-2">Temperature (°C)</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 uppercase font-bold">Warning Level</label>
                  <input 
                    type="number" 
                    value={localConfig.temperature.warning}
                    onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, warning: parseFloat(e.target.value) } })}
                    className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm font-mono text-warning"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 uppercase font-bold">Critical Level</label>
                  <input 
                    type="number" 
                    value={localConfig.temperature.critical}
                    onChange={(e) => setLocalConfig({ ...localConfig, temperature: { ...localConfig.temperature, critical: parseFloat(e.target.value) } })}
                    className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm font-mono text-critical"
                  />
                </div>
              </div>
            </div>

            {/* Alignment */}
             <div className="space-y-4 p-4 rounded border border-border/50">
              <p className="text-[10px] font-bold uppercase text-zinc-500 border-b border-border/50 pb-2">Alignment Offset (mm)</p>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 uppercase font-bold">Warning Offset</label>
                  <input 
                    type="number" 
                    value={localConfig.alignment.warning}
                    onChange={(e) => setLocalConfig({ ...localConfig, alignment: { ...localConfig.alignment, warning: parseFloat(e.target.value) } })}
                    className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm font-mono text-warning"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1 uppercase font-bold">Critical Offset</label>
                  <input 
                    type="number" 
                    value={localConfig.alignment.critical}
                    onChange={(e) => setLocalConfig({ ...localConfig, alignment: { ...localConfig.alignment, critical: parseFloat(e.target.value) } })}
                    className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm font-mono text-critical"
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
