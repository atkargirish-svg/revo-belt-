
'use client';

import { Map as MapIcon } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
        <MapIcon size={32} />
      </div>
      <h1 className="text-2xl font-bold uppercase tracking-tighter mb-2">Spatial Belt Map</h1>
      <p className="text-zinc-500 max-w-md">
        Interactive 3D visualization and real-time belt tracking module is currently being initialized.
      </p>
    </div>
  );
}
