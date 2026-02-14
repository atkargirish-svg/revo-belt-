"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { BarChart, Bot, TrendingUp } from "lucide-react";

import type { ChartDataPoint, AnomalyAlert } from "@/lib/types";
import {
  estimateCarbonEmissions,
  generateAnomalyAlert,
} from "@/app/dashboard/actions";
import { useToast } from "@/hooks/use-toast";

import { DashboardHeader } from "./header";
import { KpiCard } from "./kpi-card";
import { WaveAnimation } from "./wave-animation";
import { Co2Chart } from "./co2-chart";
import { SensorFeed } from "./sensor-feed";
import { AcousticSensor } from "./acoustic-sensor";
import { GeminiIntelligenceTerminal } from "./groq-intelligence-terminal";

const initialChartData: ChartDataPoint[] = Array.from({ length: 10 }, (_, i) => ({
  time: format(new Date(Date.now() - (9 - i) * 5000), "HH:mm:ss"),
  co2: null,
  acoustic: null,
}));

const initialAlerts: AnomalyAlert[] = [
    { machineId: 'Machine 1', isAnomaly: false, message: 'System standing by.', anomalyType: 'None', severity: 'None' },
    { machineId: 'Machine 2', isAnomaly: false, message: 'System standing by.', anomalyType: 'None', severity: 'None' }
]

export function Dashboard() {
  const { toast } = useToast();
  const [co2, setCo2] = useState(0);
  const [acoustic, setAcoustic] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [chartData, setChartData] =
    useState<ChartDataPoint[]>(initialChartData);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(initialAlerts);
  const [isAuditing, setIsAuditing] = useState(false);

  const acousticRef = useRef(acoustic);
  acousticRef.current = acoustic;

  const handleToggleAudit = () => {
    setIsAuditing((prev) => !prev);
  };

  const handleAcousticData = (db: number) => {
    setAcoustic(Number(db.toFixed(1)));
  };


  useEffect(() => {
    if (!isAuditing) {
      setCo2(0);
      setAcoustic(0);
      setEnergy(0);
      setChartData(initialChartData);
      setAlerts(initialAlerts);
      return;
    }

    const interval = setInterval(async () => {
      const currentAcoustic = acousticRef.current;
      if (currentAcoustic === 0) return;

      // 1. Simulate other sensor data
      const newThermal = 50 + Math.random() * 25; // 50-75 °C
      const newEnergy = 140 + Math.random() * 10; // 140-150 kWh

      // 2. Call server actions
      const emissionPromise = estimateCarbonEmissions({
        acousticNoiseDb: currentAcoustic,
        thermalTempC: newThermal,
        energyKwh: newEnergy,
      });

      const anomalyPromise1 = generateAnomalyAlert({
        machineId: "Machine 1",
        acousticLevel: 70 + Math.random() * 5,
        thermalLevel: newThermal, // Focus on thermal for Machine 1
        maxAcoustic: 85,
        maxThermal: 70,
      });

      const anomalyPromise2 = generateAnomalyAlert({
        machineId: "Machine 2",
        acousticLevel: currentAcoustic, // Focus on acoustic for Machine 2
        thermalLevel: 55 + Math.random() * 5,
        maxAcoustic: 88,
        maxThermal: 70,
      });
      
      const [emissionData, anomaly1, anomaly2] = await Promise.all([emissionPromise, anomalyPromise1, anomalyPromise2]);

      // 3. Update state
      setEnergy(Number(newEnergy.toFixed(1)));
      if (emissionData) {
        setCo2(Number(emissionData.estimatedCo2KgPerHour.toFixed(1)));
      }
      
      const newAlerts = [anomaly1, anomaly2] as AnomalyAlert[];
      setAlerts(newAlerts);

      newAlerts.forEach(alert => {
        if(alert.isAnomaly && alert.severity === 'Critical') {
            toast({
                variant: 'destructive',
                title: `🚨 CRITICAL ALERT: ${alert.machineId}`,
                description: alert.message
            })
        }
      })

      setChartData((prev) => [
        ...prev.slice(1),
        {
          time: format(new Date(), "HH:mm:ss"),
          co2: emissionData?.estimatedCo2KgPerHour ?? null,
          acoustic: currentAcoustic,
        },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuditing, toast]);

  const co2Color = co2 > 50 ? "hsl(var(--destructive))" : "hsl(var(--accent))";

  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-12 auto-rows-min gap-6">
        <DashboardHeader />

        <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <KpiCard
            title="Real-Time CO₂ Output"
            value={co2}
            unit="kg/hr"
            icon={Bot}
            valueClassName={co2 > 50 ? 'text-destructive' : 'text-accent'}
          />
          <KpiCard
            title="Machine Acoustic Load"
            value={acoustic}
            unit="dB"
            icon={BarChart}
          >
            {isAuditing && <WaveAnimation />}
          </KpiCard>
          <KpiCard
            title="Energy Usage Pattern"
            value={energy}
            unit="kWh"
            icon={TrendingUp}
          />
        </div>

        <div className="col-span-12">
          <AcousticSensor 
            isAuditing={isAuditing}
            onToggleAudit={handleToggleAudit}
            onDbLevelChange={handleAcousticData}
          />
        </div>

        <main className="col-span-12 row-span-2 lg:col-span-9">
          <Co2Chart data={chartData} />
        </main>

        <aside className="col-span-12 lg:col-span-3">
          <SensorFeed alerts={alerts} />
        </aside>

        <div className="col-span-12">
          <GeminiIntelligenceTerminal />
        </div>
      </div>
    </div>
  );
}
