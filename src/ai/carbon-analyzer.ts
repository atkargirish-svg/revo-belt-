
'use server';

import {ai} from '@/ai/genkit';
import {
  CarbonAnalysisFormSchema,
  CarbonAnalysisOutputSchema,
} from '@/lib/types';
import type {z} from 'zod';

export type CarbonAnalysisInput = z.infer<typeof CarbonAnalysisFormSchema>;
export type CarbonAnalysisOutput = z.infer<typeof CarbonAnalysisOutputSchema>;

const carbonAnalysisPrompt = ai.definePrompt(
  {
    name: 'carbonAnalysisPrompt',
    input: {schema: CarbonAnalysisFormSchema},
    output: {schema: CarbonAnalysisOutputSchema},
    prompt: `You are 'EcoSync Core', an advanced Industrial Carbon Intelligence Engine designed for small-scale manufacturers. 
Your job is to analyze indirect signals (acoustic levels, thermal levels) alongside direct energy data to estimate real-time CO2 emissions and recommend low-cost operational adjustments.

INPUT DATA RECEIVED:
- Machine Type: {{{machineName}}}
- Power Usage: {{{powerUsageKwh}}} kWh
- Fuel Usage: {{{fuelUsageLiters}}} Liters (if provided)
- Current Acoustic Signature: {{{acousticLevel}}}
- Current Thermal Signature: {{{thermalLevel}}}

LOGIC & CONSTRAINTS:
1.  Use standard emission factors for calculation. Base electricity is ~0.82 kg CO₂/kWh (India average) and diesel is ~2.68 kg CO₂/liter.
2.  The 'acousticLevel' and 'thermalLevel' are proxies for inefficiency. 'Loud' or 'Hot' signals indicate mechanical friction, wear & tear, or over-exertion. These inefficiencies increase energy consumption and thus CO2 output.
3.  Increase the calculated 'current_co2_kg_per_hour' from the baseline energy calculation by a logical percentage based on the severity of the acoustic and thermal signals. For example, 'Very Loud' and 'Hot' might add a 20-30% inefficiency penalty to the base CO2 calculation.
4.  Calculate an estimated 'current_co2_kg_per_hour', an 'optimal_co2_kg_per_hour' (based on just the energy data without penalties), and the 'excess_carbon_percent'.
5.  Provide up to 3 highly practical, low-cost "Operational Adjustments" that a small factory owner can do today to fix the inefficiencies suggested by the indirect signals.
6.  Calculate an overall 'efficiency_score_out_of_100' based on how much the machine is deviating from the optimal state. A higher deviation means a lower score.
`,
  },
);

export async function carbonAnalyzerFlow(input: CarbonAnalysisInput): Promise<CarbonAnalysisOutput> {
  const {output} = await carbonAnalysisPrompt(input);
  if (!output) {
    throw new Error('Could not generate analysis.');
  }
  
  // Filter out any empty recommendations just in case
  output.operational_adjustments = output.operational_adjustments.filter(
      (rec) => rec.action && rec.action.trim() !== ''
  );

  return output;
}
