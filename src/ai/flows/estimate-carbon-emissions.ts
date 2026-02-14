'use server';
/**
 * @fileOverview A Genkit flow for estimating real-time CO2 emissions based on acoustic, thermal, and energy data.
 *
 * - estimateCarbonEmissions - A function that estimates CO2 emissions.
 * - EstimateCarbonEmissionsInput - The input type for the estimateCarbonEmissions function.
 * - EstimateCarbonEmissionsOutput - The return type for the estimateCarbonEmissions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCarbonEmissionsInputSchema = z.object({
  acousticNoiseDb: z.number().describe('The acoustic noise level in decibels (dB).'),
  thermalTempC: z.number().describe('The thermal temperature in Celsius (°C).'),
  energyKwh: z.number().describe('The energy usage in kilowatt-hours (kWh).'),
});
export type EstimateCarbonEmissionsInput = z.infer<typeof EstimateCarbonEmissionsInputSchema>;

const EstimateCarbonEmissionsOutputSchema = z.object({
  estimatedCo2KgPerHour: z.number().describe('The estimated CO2 emissions in kilograms per hour (kg/hr).'),
  reasoning: z.string().describe('A brief explanation for the estimated CO2 emissions.'),
});
export type EstimateCarbonEmissionsOutput = z.infer<typeof EstimateCarbonEmissionsOutputSchema>;

export async function estimateCarbonEmissions(input: EstimateCarbonEmissionsInput): Promise<EstimateCarbonEmissionsOutput> {
  return estimateCarbonEmissionsFlow(input);
}

const estimateCarbonEmissionsPrompt = ai.definePrompt({
  name: 'estimateCarbonEmissionsPrompt',
  input: {schema: EstimateCarbonEmissionsInputSchema},
  output: {schema: EstimateCarbonEmissionsOutputSchema},
  prompt: `You are an expert industrial environmental analyst specializing in estimating carbon emissions from indirect sensor data. Your task is to estimate the real-time CO2 emissions (in kilograms per hour, kg/hr) for an industrial process based on the provided sensor data. Provide your best estimate and a brief reasoning for your calculation.

Consider the following indirect signals:
- Acoustic Noise: {{{acousticNoiseDb}}} dB
- Thermal Temperature: {{{thermalTempC}}} °C
- Energy Usage: {{{energyKwh}}} kWh

Based on this data, what is the estimated CO2 emission in kg/hr? Provide a specific numerical value for 'estimatedCo2KgPerHour' and a concise explanation in 'reasoning'.`,
});

const estimateCarbonEmissionsFlow = ai.defineFlow(
  {
    name: 'estimateCarbonEmissionsFlow',
    inputSchema: EstimateCarbonEmissionsInputSchema,
    outputSchema: EstimateCarbonEmissionsOutputSchema,
  },
  async (input) => {
    const {output} = await estimateCarbonEmissionsPrompt(input);
    if (!output) {
        throw new Error("Failed to get an estimation from the LLM.");
    }
    return output;
  }
);
