'use client';

import { useState, useEffect } from 'react';
import { Bot, Wrench, Lock, Zap, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { MachineSustainabilityReport } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type TerminalProps = {
    report: MachineSustainabilityReport | null;
    isAnalyzing: boolean;
}

const initialLines = [
  "> Standing by for machine data...",
  "> Start an analysis to generate operational intelligence.",
];

export function GeminiIntelligenceTerminal({ report, isAnalyzing }: TerminalProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>(initialLines);

  useEffect(() => {
    if (isAnalyzing) {
        setTerminalLines([
            "> Receiving data from sensors...",
            "> Sending multimodal data (audio dB, image) to Gemini...",
            "> Analyzing machine state and inefficiencies...",
        ]);
    } else if (report && report.status === 'success') {
        setTerminalLines([
            `> Analysis for machine complete.`,
            `> Acoustic Health: ${report.machine_analysis.acoustic_health}`,
            `> Visual Health: ${report.machine_analysis.visual_health}`,
            `> Efficiency Score: ${report.efficiency_score_out_of_100}/100. Generating recommendations...`
        ]);
    } else if (report && report.status === 'error') {
         setTerminalLines([
            "> Analysis failed.",
            "> Could not generate intelligence. Please check logs and try again.",
        ]);
    } else {
        setTerminalLines(initialLines);
    }
  }, [report, isAnalyzing]);
  
  const recommendations = report?.operational_adjustments ?? [];
  const showRecommendations = !isAnalyzing && report?.status === 'success' && recommendations.length > 0;

  return (
    <Card className="bg-black border-green-500/30 shadow-lg font-code text-green-400 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg text-green-400">
          <Bot className="h-5 w-5" />
          Gemini Operational Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-900/50 p-4 rounded-md border border-green-500/20 min-h-[150px]">
          {terminalLines.map((line, i) => (
            <p key={i} className="flex items-center">
              <span className="text-green-600 mr-2">$</span>
              {line}
            </p>
          ))}
          {isAnalyzing && (
            <p className="flex items-center">
                <span className="text-green-600 mr-2">$</span>
                <span className="w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
            </p>
          )}
        </div>

        {isAnalyzing && (
            <div className="space-y-3">
                <h3 className="text-md font-semibold text-green-300 pl-1">{">"} Recommended Actions (Generating...):</h3>
                <Skeleton className="h-[76px] w-full bg-green-900/20 border border-green-500/30" />
                <Skeleton className="h-[76px] w-full bg-green-900/20 border border-green-500/30" />
            </div>
        )}

        {showRecommendations && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
                <h3 className="text-md font-semibold text-green-300 pl-1">{">"} Recommended Actions:</h3>
                {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-green-900/20 border border-green-500/30 hover:bg-green-900/40 transition-colors">
                        <div className="p-2 bg-green-900/50 rounded-md mt-1">
                            <Wrench className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-300">{rec.action}</p>
                            <div className="text-sm text-green-500 flex flex-wrap gap-x-4 mt-1">
                               <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Est. Cost: ₹{rec.estimated_cost_inr}</span>
                               <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> CO₂ Cut: {rec.co2_reduction_potential_percent}%</span>
                               <span className="flex items-center gap-1.5">Difficulty: {rec.difficulty}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300">
          <Lock className="mr-2 h-4 w-4" />
          Mint Green Certificate on Blockchain
        </Button>
      </CardFooter>
    </Card>
  );
}
