"use client";

import { useState, useEffect } from "react";
import { Cpu, Leaf, TrendingDown, Zap, Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { ChartData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

import { DashboardHeader } from "./header";
import { KpiCard } from "./kpi-card";
import { Co2Chart } from "./co2-chart";
import { SignalSimulator } from "./signal-simulator";
import { GroqIntelligenceTerminal } from "./groq-intelligence-terminal";
import { BlockchainModal } from "./blockchain-modal";
import { Button } from "../ui/button";

const initialChartData: ChartData[] = [
  { hour: "T-5", co2: 38, load: 75 },
  { hour: "T-4", co2: 41, load: 78 },
  { hour: "T-3", co2: 40, load: 76 },
  { hour: "T-2", co2: 45, load: 80 },
  { hour: "T-1", co2: 42.5, load: 79 },
  { hour: "Now", co2: 42.5, load: 79 },
];

export function Dashboard() {
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const handleSimulateAnomaly = () => {
    setIsAnomaly(true);
    toast({
      variant: "destructive",
      title: "Anomaly Detected!",
      description: "Acoustic and Thermal signatures have spiked.",
    });
  };

  const kpiValues = {
    co2: isAnomaly ? 68.2 : 42.5,
    energy: 120,
    efficiency: isAnomaly ? 65 : 88,
  };

  const [chartData, setChartData] = useState<ChartData[]>(initialChartData);

  useEffect(() => {
    if (isAnomaly) {
      const anomalyDataPoint = {
        hour: "Now",
        co2: kpiValues.co2,
        load: 95,
      };
      // Replace the last point with anomaly data
      setChartData((prev) => [...prev.slice(0, -1), anomalyDataPoint]);
    } else {
      setChartData(initialChartData); // Reset to initial on recovery
    }
  }, [isAnomaly, kpiValues.co2]);

  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-12 auto-rows-min gap-6">
        <DashboardHeader />

        <div className="col-span-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <KpiCard
            title="Real-Time CO₂ Output"
            value={kpiValues.co2.toFixed(1)}
            unit="kg/hr"
            icon={Leaf}
            valueClassName={isAnomaly ? "text-destructive" : "text-accent"}
          >
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <TrendingDown
                className="h-4 w-4 mr-1"
                color={isAnomaly ? "hsl(var(--destructive))" : "hsl(var(--accent))"}
              />
              {isAnomaly ? "+35% vs Optimal" : "-12% vs Yesterday"}
            </p>
          </KpiCard>
          <KpiCard
            title="Grid Energy Usage"
            value={kpiValues.energy}
            unit="kWh"
            icon={Zap}
            valueClassName="text-primary"
          />
          <KpiCard
            title="Overall Efficiency Score"
            icon={Cpu}
            valueClassName={isAnomaly ? "text-orange-400" : "text-accent"}
          >
            <div className="flex items-center justify-center -mt-2">
              <span className="text-3xl font-bold">{kpiValues.efficiency}</span>
              <span className="text-xl text-muted-foreground mt-1">/100</span>
            </div>
          </KpiCard>
        </div>

        <aside className="col-span-12 lg:col-span-3">
          <SignalSimulator onSimulate={handleSimulateAnomaly} isAnomaly={isAnomaly} />
        </aside>

        <main className="col-span-12 row-span-2 lg:col-span-6">
          <Co2Chart data={chartData} />
        </main>

        <aside className="col-span-12 lg:col-span-3">
          <GroqIntelligenceTerminal isAnomaly={isAnomaly} />
        </aside>

        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="w-full bg-accent/90 text-accent-foreground hover:bg-accent"
              onClick={() => setShowModal(true)}
            >
              <Bot className="mr-2 h-5 w-5" />
              Mint Green Compliance Certificate (Blockchain)
            </Button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showModal && <BlockchainModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
