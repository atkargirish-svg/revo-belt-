export type ChartDataPoint = {
  time: string;
  co2: number | null;
  acoustic: number | null;
};

export type AnomalyAlert = {
  machineId: string;
  message: string;
  isAnomaly: boolean;
  anomalyType: "Acoustic" | "Thermal" | "Both" | "None";
  severity: "None" | "Low" | "Medium" | "High" | "Critical";
};
