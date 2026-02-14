"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { ChartDataPoint } from "@/lib/types";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const chartConfig = {
  co2: {
    label: "CO₂ Emissions (kg/hr)",
    color: "hsl(var(--chart-1))",
  },
  acoustic: {
    label: "Acoustic Noise (dB)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Co2Chart({ data }: { data: ChartDataPoint[] }) {
  return (
    <Card className="h-full bg-card border-border shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Acoustic Noise vs. CO₂ Emissions</CardTitle>
        <CardDescription>
          Real-time correlation between sensor data and estimated emissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
                <filter id="glow-co2" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="hsl(var(--chart-1))" floodOpacity="0.7"/>
                </filter>
                <filter id="glow-acoustic" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="hsl(var(--chart-2))" floodOpacity="0.7"/>
                </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border) / 0.5)"
            />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--chart-1))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--chart-2))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelClassName="text-foreground"
                  className="bg-popover/80 backdrop-blur-sm text-popover-foreground border-border shadow-lg"
                />
              }
            />
            <Legend verticalAlign="top" height={40} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="co2"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              style={{ filter: "url(#glow-co2)" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="acoustic"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              style={{ filter: "url(#glow-acoustic)" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
