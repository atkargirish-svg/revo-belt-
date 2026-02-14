import { Badge } from "@/components/ui/badge";
import { Leaf, Wallet } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="col-span-12 rounded-lg border border-border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 border-2 border-accent shadow-[0_0_15px_hsl(var(--accent))]">
            <Leaf className="h-5 w-5 text-accent" />
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
              Live Sensor Sync
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-primary/50 text-primary py-1.5 px-4 font-mono text-xs"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Wallet: 0x8A...3F
          </Badge>
        </div>
      </div>
    </header>
  );
}
