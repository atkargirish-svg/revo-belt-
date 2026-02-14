"use server";

import {
  estimateCarbonEmissions as estimateCarbonEmissionsFlow,
  type EstimateCarbonEmissionsInput,
} from "@/ai/flows/estimate-carbon-emissions";
import {
  generateAnomalyAlert as generateAnomalyAlertFlow,
  type GenerateAnomalyAlertInput,
} from "@/ai/flows/generate-anomaly-alert";

export async function estimateCarbonEmissions(
  input: EstimateCarbonEmissionsInput
) {
  try {
    return await estimateCarbonEmissionsFlow(input);
  } catch (error) {
    console.error("Error estimating carbon emissions:", error);
    // Return a default or error state
    return {
      estimatedCo2KgPerHour: 0,
      reasoning: "Error in estimation model.",
    };
  }
}

export async function generateAnomalyAlert(input: GenerateAnomalyAlertInput) {
  try {
    return await generateAnomalyAlertFlow(input);
  } catch (error) {
    console.error("Error generating anomaly alert:", error);
    // Return a default or error state
    return {
      isAnomaly: true,
      anomalyType: "None",
      severity: "Critical",
      message: "Alert system is currently unavailable.",
    };
  }
}
