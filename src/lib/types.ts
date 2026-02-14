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
  status: z.string().describe("Set to 'success' upon successful analysis."),
  machine_analysis: z.object({
    acoustic_health: z.string().describe("Brief analysis of the dB level. Mention if it's in the optimal range (70-80 dB) or high ( > 85 dB)."),
    visual_health: z.string().describe("Brief analysis of the machine's visual condition from the image (e.g., signs of rust, smoke, wear)."),
  }),
  estimated_emissions: z.object({
    current_co2_kg_per_hour: z.number().describe("The calculated current CO2 emissions in kilograms per hour, based on all inputs."),
    optimal_co2_kg_per_hour: z.number().describe("The ideal or baseline CO2 emissions for this type of machine in kilograms per hour."),
    excess_carbon_percent: z.number().describe("The percentage of emissions that are above the optimal level. ((current - optimal) / optimal) * 100."),
  }),
  operational_adjustments: z.array(z.object({
    action: z.string().describe("A specific, actionable, and low-cost recommendation for the factory owner."),
    estimated_cost_inr: z.number().describe("The approximate cost of implementing the action, in Indian Rupees (INR)."),
    co2_reduction_potential_percent: z.number().describe("The estimated percentage reduction in CO2 emissions if this action is taken."),
    difficulty: z.string().describe("The difficulty of implementing the action (e.g., 'Low', 'Medium', 'High')."),
  })).describe("An array of up to 3 operational adjustment recommendations."),
  efficiency_score_out_of_100: z.number().describe("An overall efficiency score for the machine from 0 to 100, where 100 is perfectly efficient."),
});
export type AnalyzeMachineSustainabilityOutput = z.infer<typeof AnalyzeMachineSustainabilityOutputSchema>;

export type OperationalAdjustment = AnalyzeMachineSustainabilityOutput['operational_adjustments'][number];

export type MachineSustainabilityReport = AnalyzeMachineSustainabilityOutput;
