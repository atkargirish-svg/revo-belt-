import { Badge } from "@/components/ui/badge";
import { Layers, Wallet } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="col-span-12 rounded-lg border border-border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border-2 border-primary">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground font-headline">
            EcoSync AI
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              Live Connection
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-accent/50 text-accent py-1.5 px-4"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Wallet Connected
          </Badge>
        </div>
      </div>
    </header>
  );
}
