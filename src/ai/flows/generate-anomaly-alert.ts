'use server';
/**
 * @fileOverview A Genkit flow for generating anomaly alerts based on acoustic and thermal sensor data.
 *
 * - generateAnomalyAlert - A function that handles the anomaly detection and alert generation process.
 * - GenerateAnomalyAlertInput - The input type for the generateAnomalyAlert function.
 * - GenerateAnomalyAlertOutput - The return type for the generateAnomalyAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAnomalyAlertInputSchema = z.object({
  machineId: z.string().describe('The unique identifier for the machine being monitored.'),
  acousticLevel: z.number().describe('The current acoustic level in decibels (dB).'),
  thermalLevel: z.number().describe('The current thermal level in Celsius (°C).'),
  maxAcoustic: z.number().describe('The maximum permissible acoustic level in dB before an anomaly is considered.'),
  maxThermal: z.number().describe('The maximum permissible thermal level in °C before an anomaly is considered.'),
});
export type GenerateAnomalyAlertInput = z.infer<typeof GenerateAnomalyAlertInputSchema>;

const GenerateAnomalyAlertOutputSchema = z.object({
  isAnomaly: z.boolean().describe('True if an anomaly is detected, false otherwise.'),
  anomalyType: z.enum(['Acoustic', 'Thermal', 'Both', 'None']).describe('The type of anomaly detected: Acoustic, Thermal, Both, or None.'),
  severity: z.enum(['None', 'Low', 'Medium', 'High', 'Critical']).describe('The severity of the anomaly: None, Low, Medium, High, or Critical.'),
  message: z.string().describe('A natural language explanation of the anomaly and suggested actions, or a reassuring message if no anomaly is found.'),
});
export type GenerateAnomalyAlertOutput = z.infer<typeof GenerateAnomalyAlertOutputSchema>;

export async function generateAnomalyAlert(input: GenerateAnomalyAlertInput): Promise<GenerateAnomalyAlertOutput> {
  return generateAnomalyAlertFlow(input);
}

const generateAnomalyAlertPrompt = ai.definePrompt({
  name: 'generateAnomalyAlertPrompt',
  input: { schema: GenerateAnomalyAlertInputSchema },
  output: { schema: GenerateAnomalyAlertOutputSchema },
  prompt: `You are an expert industrial sensor monitoring system. Your task is to analyze real-time acoustic and thermal sensor data for a machine, identify any anomalies, assess their severity, and provide a clear alert message.

**Machine ID**: {{{machineId}}}

**Current Readings**:
- Acoustic Level: {{{acousticLevel}}} dB
- Thermal Level: {{{thermalLevel}}} °C

**Thresholds for Dangerous Levels**:
- Maximum Acoustic Level: {{{maxAcoustic}}} dB
- Maximum Thermal Level: {{{maxThermal}}} °C

Based on the current readings and the provided thresholds, determine if an anomaly is present. If an anomaly is detected, classify its type (Acoustic, Thermal, or Both), assign a severity (Low, Medium, High, Critical), and provide a concise message explaining the anomaly and any immediate implications.

Consider the following severity guidelines:
- **Low**: Slightly above threshold, minor concern.
- **Medium**: Moderately above threshold, requires attention soon.
- **High**: Significantly above threshold, requires immediate attention.
- **Critical**: Far exceeding threshold, indicates imminent failure or severe environmental impact.

If no anomaly is detected, set 'isAnomaly' to 'false', 'anomalyType' to 'None', 'severity' to 'None', and provide a reassuring message. The message should state that current readings are within normal parameters. The output must strictly adhere to the provided JSON schema, including all specified fields.`,
});

const generateAnomalyAlertFlow = ai.defineFlow(
  {
    name: 'generateAnomalyAlertFlow',
    inputSchema: GenerateAnomalyAlertInputSchema,
    outputSchema: GenerateAnomalyAlertOutputSchema,
  },
  async (input) => {
    const { output } = await generateAnomalyAlertPrompt(input);
    return output!;
  }
);
