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
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Area,
} from "recharts";
import type { ChartData } from "@/lib/types";

const chartConfig = {
  co2: {
    label: "CO₂ Emission (kg/hr)",
    color: "hsl(var(--chart-1))",
  },
  load: {
    label: "Acoustic/Energy Load",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Co2Chart({ data }: { data: ChartData[] }) {
  return (
    <Card className="h-full bg-card/50 border-border/50 shadow-lg flex flex-col backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Carbon Emission Analysis</CardTitle>
        <CardDescription>
          Real-time correlation between indirect signals and CO₂ emissions (Last 6 Hours).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="fillCo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border) / 0.5)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
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
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="co2"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#fillCo2)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="load"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
