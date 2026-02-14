import {z} from 'zod';

// Schema for the form input
export const CarbonAnalysisFormSchema = z.object({
  machineName: z.string().min(3, 'Machine name is required.'),
  powerUsageKwh: z.coerce.number().min(0, 'Power usage must be a positive number.'),
  fuelUsageLiters: z.coerce.number().min(0, 'Fuel usage must be a positive number.').optional(),
  acousticLevel: z.enum(['Normal', 'Loud', 'Very Loud']),
  thermalLevel: z.enum(['Normal', 'Warm', 'Hot']),
});

export type CarbonAnalysisFormState = z.infer<typeof CarbonAnalysisFormSchema>;

// Schema for the AI Output
export const CarbonAnalysisOutputSchema = z.object({
  status: z.string().describe("Should always be 'success' or 'error'."),
  machine_analysis: z
    .object({
      acoustic_health: z
        .string()
        .describe(
          'Brief analysis of the acoustic level provided (e.g., "Normal levels, indicating healthy operation.").'
        ),
      visual_health: z
        .string()
        .describe(
          'Brief analysis based on the thermal level provided (e.g., "High temperature suggests potential overheating or inefficiency.").'
        ),
    })
    .describe('A summary of the machine\'s health based on indirect signals.'),
  estimated_emissions: z
    .object({
      current_co2_kg_per_hour: z
        .number()
        .describe(
          'The calculated real-time CO2 emissions in kg per hour based on energy data and indirect signals.'
        ),
      optimal_co2_kg_per_hour: z
        .number()
        .describe(
          'The ideal or baseline CO2 emissions for this type of machine in kg per hour.'
        ),
      excess_carbon_percent: z
        .number()
        .describe(
          'The percentage of CO2 emissions that are above the optimal baseline.'
        ),
    })
    .describe('The core carbon emission metrics.'),
  operational_adjustments: z
    .array(
      z.object({
        action: z
          .string()
          .describe(
            'A highly practical, actionable step the factory owner can take.'
          ),
        estimated_cost_inr: z
          .number()
          .describe(
            'The estimated cost in Indian Rupees to implement the action. Should be low.'
          ),
        co2_reduction_potential_percent: z
          .number()
          .describe('The potential percentage reduction in CO2 if this action is taken.'),
        difficulty: z
          .enum(['Low', 'Medium', 'High'])
          .describe('The difficulty level for implementing this action.'),
      })
    )
    .max(3, 'Provide up to 3 practical recommendations.')
    .describe(
      'A list of practical, low-cost operational adjustments to reduce emissions.'
    ),
  efficiency_score_out_of_100: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'An overall efficiency score for the machine from 0 to 100, where 100 is most efficient.'
    ),
});

export type CarbonAnalysisOutput = z.infer<typeof CarbonAnalysisOutputSchema>;

export type AnalysisState = {
  loading: boolean;
  error?: string | null;
  data?: CarbonAnalysisOutput | null;
};
