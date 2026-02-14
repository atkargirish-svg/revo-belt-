"use client";

import { useState, useEffect } from "react";
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

const initialChartData: ChartDataPoint[] = Array.from({ length: 10 }, (_, i) => ({
  time: format(new Date(Date.now() - (9 - i) * 5000), "HH:mm:ss"),
  co2: 40 + Math.random() * 10,
  acoustic: 75 + Math.random() * 15,
}));

const initialAlerts: AnomalyAlert[] = [
    { machineId: 'Machine 1', isAnomaly: false, message: 'Thermal levels are normal.', anomalyType: 'None', severity: 'None' },
    { machineId: 'Machine 2', isAnomaly: false, message: 'Acoustic signature is stable.', anomalyType: 'None', severity: 'None' }
]

export function Dashboard() {
  const { toast } = useToast();
  const [co2, setCo2] = useState(45.2);
  const [acoustic, setAcoustic] = useState(82);
  const [energy, setEnergy] = useState(142);
  const [chartData, setChartData] =
    useState<ChartDataPoint[]>(initialChartData);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(initialAlerts);

  useEffect(() => {
    const interval = setInterval(async () => {
      // 1. Simulate new sensor data
      const newAcoustic = 75 + Math.random() * 20; // 75-95 dB
      const newThermal = 50 + Math.random() * 25; // 50-75 °C
      const newEnergy = 140 + Math.random() * 10; // 140-150 kWh

      // 2. Call server actions
      const emissionPromise = estimateCarbonEmissions({
        acousticNoiseDb: newAcoustic,
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
        acousticLevel: newAcoustic, // Focus on acoustic for Machine 2
        thermalLevel: 55 + Math.random() * 5,
        maxAcoustic: 88,
        maxThermal: 70,
      });
      
      const [emissionData, anomaly1, anomaly2] = await Promise.all([emissionPromise, anomalyPromise1, anomalyPromise2]);

      // 3. Update state
      setAcoustic(Number(newAcoustic.toFixed(1)));
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
          acoustic: newAcoustic,
        },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [toast]);

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
            <WaveAnimation />
          </KpiCard>
          <KpiCard
            title="Energy Usage Pattern"
            value={energy}
            unit="kWh"
            icon={TrendingUp}
          />
        </div>

        <main className="col-span-12 row-span-2 lg:col-span-9">
          <Co2Chart data={chartData} />
        </main>

        <aside className="col-span-12 lg:col-span-3">
          <SensorFeed alerts={alerts} />
        </aside>
      </div>
    </div>
  );
}
