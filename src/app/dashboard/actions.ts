"use server";

import {
  analyzeMachineSustainability as analyzeMachineSustainabilityFlow,
  type AnalyzeMachineSustainabilityInput,
  type AnalyzeMachineSustainabilityOutput,
} from "@/ai/flows/analyze-machine-sustainability";

export async function analyzeMachineSustainability(
  input: AnalyzeMachineSustainabilityInput
): Promise<AnalyzeMachineSustainabilityOutput> {
  // A simple default for error cases, matching the output schema.
  const errorOutput: AnalyzeMachineSustainabilityOutput = {
    status: "error",
    machine_analysis: {
      acoustic_health: "Could not analyze.",
      visual_health: "Could not analyze.",
    },
    estimated_emissions: {
      current_co2_kg_per_hour: 0,
      optimal_co2_kg_per_hour: 0,
      excess_carbon_percent: 0,
    },
    operational_adjustments: [
        {
            action: "Analysis failed. Please try again.",
            estimated_cost_inr: 0,
            co2_reduction_potential_percent: 0,
            difficulty: "N/A"
        }
    ],
    efficiency_score_out_of_100: 0,
  };
  
  try {
    const result = await analyzeMachineSustainabilityFlow(input);
    return result;
  } catch (error) {
    console.error("Error analyzing machine sustainability:", error);
    return errorOutput;
  }
}
