'use server';
/**
 * @fileOverview An industrial carbon intelligence engine using Gemini.
 *
 * - analyzeMachineSustainability - A function that analyzes machine data to estimate CO2 emissions and provide recommendations.
 * - AnalyzeMachineSustainabilityInput - The input type for the function.
 * - AnalyzeMachineSustainabilityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function analyzeMachineSustainability(input: AnalyzeMachineSustainabilityInput): Promise<AnalyzeMachineSustainabilityOutput> {
  return analyzeMachineSustainabilityFlow(input);
}

const masterPrompt = ai.definePrompt({
  name: 'ecoSyncCorePrompt',
  input: { schema: AnalyzeMachineSustainabilityInputSchema },
  output: { schema: AnalyzeMachineSustainabilityOutputSchema },
  prompt: `You are 'EcoSync Core', an advanced Industrial Carbon Intelligence Engine designed for small-scale manufacturers. 
Your job is to analyze indirect signals (acoustic levels in Decibels, visual machine state, and machine type) to estimate real-time CO2 emissions and recommend low-cost operational adjustments.

INPUT DATA RECEIVED:
- Machine Type: {{{machine_type}}}
- Current Acoustic Noise: {{{current_db}}} dB
- Image: {{media url=photoDataUri}}

LOGIC & CONSTRAINTS:
1. Normal operating noise for industrial machines is usually 70-80 dB. Anything above 85 dB indicates mechanical friction, wear & tear, or over-exertion, which directly leads to higher energy consumption (Scope 2 Carbon Emissions).
2. Analyze the visual condition of the machine from the image (look for smoke, age, rust, poor ventilation).
3. Calculate an estimated 'Carbon Output (kg/hr)' based on these inefficiencies.
4. Provide 3 highly practical, low-cost "Operational Adjustments" that a small factory owner can do today to fix this and reduce emissions.

OUTPUT FORMAT:
You MUST respond ONLY with a valid JSON object. Do not include markdown formatting like \`\`\`json or any conversational text.`,
});

const analyzeMachineSustainabilityFlow = ai.defineFlow(
  {
    name: 'analyzeMachineSustainabilityFlow',
    inputSchema: AnalyzeMachineSustainabilityInputSchema,
    outputSchema: AnalyzeMachineSustainabilityOutputSchema,
  },
  async (input) => {
    const { output } = await masterPrompt(input);
    if (!output) {
      throw new Error("Failed to get an analysis from the AI model.");
    }
    const nonEmptyAdjustments = output.operational_adjustments.filter(
        (adj) => adj.action && adj.action.trim() !== '' && adj.action.trim().toLowerCase() !== '// action 2'
    );
    return { ...output, operational_adjustments: nonEmptyAdjustments };
  }
);
