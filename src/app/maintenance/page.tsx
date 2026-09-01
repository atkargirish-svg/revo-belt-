
'use client';

import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 border border-orange-500/20">
        <Wrench size={32} />
      </div>
      <h1 className="text-2xl font-bold uppercase tracking-tighter mb-2">Maintenance Schedule</h1>
      <p className="text-zinc-500 max-w-md">
        Asset management and preventive maintenance ticketing system is currently under scheduled update.
      </p>
    </div>
  );
}
