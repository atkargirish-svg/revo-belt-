export type ChartDataPoint = {
  time: string;
  co2: number | null;
  acoustic: number | null;
};

export type OperationalAdjustment = {
    action: string;
    estimated_cost_inr: number;
    co2_reduction_potential_percent: number;
    difficulty: string;
};

export type MachineSustainabilityReport = {
  status: string;
  machine_analysis: {
    acoustic_health: string;
    visual_health: string;
  };
  estimated_emissions: {
    current_co2_kg_per_hour: number;
    optimal_co2_kg_per_hour: number;
    excess_carbon_percent: number;
  };
  operational_adjustments: OperationalAdjustment[];
  efficiency_score_out_of_100: number;
};
