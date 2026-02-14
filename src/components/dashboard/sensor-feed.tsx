import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Server } from "lucide-react";
import type { AnomalyAlert } from "@/lib/types";

export function SensorFeed({ alerts }: { alerts: AnomalyAlert[] }) {
  const getSeverityColor = (
    severity: AnomalyAlert["severity"]
  ): string => {
    switch (severity) {
      case "Critical":
        return "text-red-500 animate-pulse";
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-orange-400";
      case "Low":
        return "text-yellow-400";
      default:
        return "text-accent";
    }
  };

  return (
    <Card className="h-full bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server className="h-5 w-5" />
          Live Sensor Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {alerts.map((alert, index) => (
            <li key={index} className="flex items-start gap-4">
              <div>
                {alert.isAnomaly ? (
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${getSeverityColor(alert.severity)}`}
                  />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{alert.machineId}</p>
                <p className={`text-sm ${alert.isAnomaly ? 'text-foreground' : 'text-muted-foreground'}`}>{alert.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
