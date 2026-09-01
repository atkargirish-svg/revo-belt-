
'use client';

import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
        <BarChart3 size={32} />
      </div>
      <h1 className="text-2xl font-bold uppercase tracking-tighter mb-2">Predictive Analytics</h1>
      <p className="text-zinc-500 max-w-md">
        Historical trend analysis and machine learning based failure prediction reports are being compiled.
      </p>
    </div>
  );
}
