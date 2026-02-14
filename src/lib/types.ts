import { z } from "zod";

export type ChartDataPoint = {
  time: string;
  co2: number | null;
  acoustic: number | null;
};

export const AnalyzeMachineSustainabilityInputSchema = z.object({
  machine_type: z.string().describe("The user-provided name of the machine (e.g., 'Lathe Machine' or 'Boiler')."),
  current_db: z.number().describe('The real-time acoustic noise level in Decibels (dB) captured from the device microphone.'),
  photoDataUri: z.string().describe("A photo of the machine, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnalyzeMachineSustainabilityInput = z.infer<typeof AnalyzeMachineSustainabilityInputSchema>;

export const AnalyzeMachineSustainabilityOutputSchema = z.object({
  status: z.string(),
  machine_analysis: z.object({
    acoustic_health: z.string().describe("Brief analysis of the dB level."),
    visual_health: z.string().describe("Brief analysis of the image provided."),
  }),
  estimated_emissions: z.object({
    current_co2_kg_per_hour: z.number(),
    optimal_co2_kg_per_hour: z.number(),
    excess_carbon_percent: z.number(),
  }),
  operational_adjustments: z.array(z.object({
    action: z.string(),
    estimated_cost_inr: z.number(),
    co2_reduction_potential_percent: z.number(),
    difficulty: z.string(),
  })),
  efficiency_score_out_of_100: z.number(),
});
export type AnalyzeMachineSustainabilityOutput = z.infer<typeof AnalyzeMachineSustainabilityOutputSchema>;

export type OperationalAdjustment = AnalyzeMachineSustainabilityOutput['operational_adjustments'][number];

export type MachineSustainabilityReport = AnalyzeMachineSustainabilityOutput;
