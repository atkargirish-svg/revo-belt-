'use server';
import { carbonAnalyzerFlow } from '@/ai/carbon-analyzer';
import { CarbonAnalysisFormSchema } from '@/lib/types';
import { z } from 'zod';

export async function getCarbonAnalysis(
    prevState: any,
    formData: FormData,
) {
    try {
        const validatedFields = CarbonAnalysisFormSchema.safeParse({
            machineName: formData.get('machineName'),
            powerUsageKwh: formData.get('powerUsageKwh'),
            fuelUsageLiters: formData.get('fuelUsageLiters') || undefined,
            acousticLevel: formData.get('acousticLevel'),
            thermalLevel: formData.get('thermalLevel'),
        });

        if (!validatedFields.success) {
            return {
                error: 'Invalid form data. Please check your inputs.',
                data: null,
            };
        }

        const result = await carbonAnalyzerFlow(validatedFields.data);

        return {
            error: null,
            data: result,
        };
    } catch(e: any) {
        console.error(e);
        return {
            error: e.message || 'Analysis failed. Please try again.',
            data: null,
        }
    }
}
