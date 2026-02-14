"use client";

import { useState } from "react";
import { format } from "date-fns";
import { BarChart, Bot, TrendingUp, Cpu } from "lucide-react";

import type { ChartDataPoint, MachineSustainabilityReport, OperationalAdjustment } from "@/lib/types";
import { analyzeMachineSustainability } from "@/app/dashboard/actions";
import { useToast } from "@/hooks/use-toast";

import { DashboardHeader } from "./header";
import { KpiCard } from "./kpi-card";
import { Co2Chart } from "./co2-chart";
import { SensorFeed } from "./sensor-feed";
import { AcousticSensor } from "./acoustic-sensor";
import { GeminiIntelligenceTerminal } from "./gemini-intelligence-terminal";

const initialChartData: ChartDataPoint[] = Array.from({ length: 10 }, (_, i) => ({
  time: format(new Date(Date.now() - (9 - i) * 5000), "HH:mm:ss"),
  co2: null,
  acoustic: null,
}));

const initialAdjustments: OperationalAdjustment[] = [];

export function Dashboard() {
  const { toast } = useToast();
  const [report, setReport] = useState<MachineSustainabilityReport | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>(initialChartData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleAnalysis = async ({ machineName, photo, dbLevel }: { machineName: string; photo: File; dbLevel: number }) => {
    setIsAnalyzing(true);
    setReport(null);
    try {
        const photoDataUri = await fileToDataUri(photo);

        const result = await analyzeMachineSustainability({
            machine_type: machineName,
            current_db: dbLevel,
            photoDataUri: photoDataUri,
        });

        setReport(result);
        
        // Update chart data
        setChartData((prev) => [
            ...prev.slice(1),
            {
              time: format(new Date(), "HH:mm:ss"),
              co2: result.estimated_emissions.current_co2_kg_per_hour,
              acoustic: dbLevel,
            },
        ]);

        toast({
            title: "Analysis Complete",
            description: `Gemini has analyzed ${machineName}.`,
        });

    } catch (error) {
        console.error("Analysis failed:", error);
        const err_msg = (error as Error).message || "Could not get a response from the AI model. Please try again.";
        setReport({
            status: "error",
            machine_analysis: { acoustic_health: "Error", visual_health: "Error" },
            estimated_emissions: { current_co2_kg_per_hour: 0, optimal_co2_kg_per_hour: 0, excess_carbon_percent: 0 },
            operational_adjustments: [],
            efficiency_score_out_of_100: 0
        });
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: err_msg,
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const currentCo2 = report?.estimated_emissions.current_co2_kg_per_hour ?? 0;
  const efficiencyScore = report?.efficiency_score_out_of_100 ?? 0;
  const adjustments = report?.operational_adjustments ?? initialAdjustments;

  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-12 auto-rows-min gap-6">
        <DashboardHeader />

        <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <KpiCard
            title="Real-Time CO₂ Output"
            value={currentCo2.toFixed(1)}
            unit="kg/hr"
            icon={Bot}
            valueClassName={currentCo2 > 15 ? 'text-destructive' : 'text-accent'}
          />
          <KpiCard
            title="Machine Efficiency Score"
            value={efficiencyScore}
            unit="/ 100"
            icon={Cpu}
            valueClassName={efficiencyScore < 70 ? 'text-orange-400' : 'text-accent'}
          />
          <KpiCard
            title="Est. Excess Emissions"
            value={report?.estimated_emissions.excess_carbon_percent ?? 0}
            unit="%"
            icon={TrendingUp}
          />
        </div>

        <div className="col-span-12">
          <AcousticSensor 
            isAnalyzing={isAnalyzing}
            onAnalysis={handleAnalysis}
          />
        </div>

        <main className="col-span-12 row-span-2 lg:col-span-8">
          <Co2Chart data={chartData} />
        </main>

        <aside className="col-span-12 lg:col-span-4">
          <SensorFeed adjustments={adjustments} />
        </aside>

        <div className="col-span-12">
          <GeminiIntelligenceTerminal report={report} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </div>
  );
}
