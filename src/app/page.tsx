'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getCarbonAnalysis } from './actions';
import { Leaf, Zap, Thermometer, Radio, Wrench, BarChart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AnalysisState, CarbonAnalysisOutput } from '@/lib/types';

const initialState: AnalysisState = {
  loading: false,
  error: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Zap className="mr-2 h-4 w-4 animate-pulse" />
          Analyzing...
        </>
      ) : (
        'Calculate Emissions'
      )}
    </Button>
  );
}

function ResultsDisplay({ data }: { data: CarbonAnalysisOutput }) {
  return (
    <Card className="mt-8 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="text-primary"/>
          AI-Powered Emission Analysis
        </CardTitle>
        <CardDescription>
          {data.machine_analysis.acoustic_health}{' '}
          {data.machine_analysis.visual_health}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-4xl font-bold text-accent">{data.efficiency_score_out_of_100}<span className="text-2xl text-muted-foreground">/100</span></p>
            </div>
            <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Est. CO₂ Output</p>
                <p className="text-4xl font-bold text-primary">{data.estimated_emissions.current_co2_kg_per_hour.toFixed(1)} <span className="text-lg font-normal">kg/hr</span></p>
                <p className="text-xs text-destructive">
                    {data.estimated_emissions.excess_carbon_percent}% above optimal
                </p>
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-4 text-lg">Operational Adjustments</h3>
            <div className="space-y-4">
                {data.operational_adjustments.map((rec, index) => (
                    <div key={index} className="bg-background/50 p-4 rounded-lg border border-border/50">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 text-primary p-2 rounded-full mt-1">
                                <Wrench size={20} />
                            </div>
                            <div>
                                <p className="font-semibold">{rec.action}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                    <span>Cost: ₹{rec.estimated_cost_inr}</span>
                                    <span className="text-green-400 font-medium">CO₂ Reduction: ~{rec.co2_reduction_potential_percent}%</span>
                                    <span>Difficulty: {rec.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [state, formAction] = useFormState(getCarbonAnalysis, initialState);

  return (
    <main className="min-h-screen bg-background text-foreground font-body p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Leaf className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground font-headline">
              EcoSync AI
            </h1>
          </div>
          <p className="text-muted-foreground">
            A Software-Based Carbon Intelligence Platform for Small Industries.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Machine Data Input</CardTitle>
            <CardDescription>
              Enter your machine&apos;s operational data. No new hardware required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="machineName">Machine Name</Label>
                  <Input
                    id="machineName"
                    name="machineName"
                    placeholder="e.g., Lathe Machine"
                    required
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="powerUsageKwh">Power Usage (kWh)</Label>
                  <Input
                    id="powerUsageKwh"
                    name="powerUsageKwh"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 20"
                    required
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="acousticLevel">Acoustic Signature</Label>
                   <Select name="acousticLevel" defaultValue='Normal' required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select acoustic level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Loud">Loud</SelectItem>
                        <SelectItem value="Very Loud">Very Loud</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="thermalLevel">Thermal Signature</Label>
                   <Select name="thermalLevel" defaultValue='Normal' required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select thermal level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Warm">Warm</SelectItem>
                        <SelectItem value="Hot">Hot</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="fuelUsageLiters">Fuel Usage (Liters, optional)</Label>
                  <Input
                    id="fuelUsageLiters"
                    name="fuelUsageLiters"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5"
                  />
                </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {state.error && (
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        
        {state.data && <ResultsDisplay data={state.data} />}
      </div>
    </main>
  );
}
