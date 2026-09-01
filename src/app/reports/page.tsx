
'use client';

import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 border border-purple-500/20">
        <FileText size={32} />
      </div>
      <h1 className="text-2xl font-bold uppercase tracking-tighter mb-2">Shift Reports</h1>
      <p className="text-zinc-500 max-w-md">
        Automated shift summaries and operational compliance logs are available for export in PDF/CSV formats.
      </p>
    </div>
  );
}
