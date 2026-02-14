import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wrench, Tag, Zap, CheckCircle2, Server } from "lucide-react";
import type { OperationalAdjustment } from "@/lib/types";

export function SensorFeed({ adjustments }: { adjustments: OperationalAdjustment[] }) {
  const hasAdjustments = adjustments && adjustments.length > 0 && adjustments[0].action !== "Analysis failed. Please try again.";

  return (
    <Card className="h-full bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server className="h-5 w-5" />
          Live Operational Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {hasAdjustments ? (
            adjustments.map((adj, index) => (
              <li key={index} className="flex items-start gap-4">
                <Wrench className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{adj.action}</p>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Est. Cost: ₹{adj.estimated_cost_inr}</span>
                    <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> CO₂ Cut: {adj.co2_reduction_potential_percent}%</span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="flex items-start gap-4 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1">
                    <p className="font-semibold">System Ready</p>
                    <p className="text-sm">Start an analysis to receive operational adjustments.</p>
                </div>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
