import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type KpiCardProps = {
  title: string;
  value?: string | number;
  unit?: string;
  icon: LucideIcon;
  valueClassName?: string;
  children?: React.ReactNode;
};

export function KpiCard({
  title,
  value,
  unit,
  icon: Icon,
  valueClassName,
  children,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border shadow-lg hover:border-primary/50 transition-colors duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {children ? (
            children
          ) : (
            <div className={cn("text-3xl font-bold", valueClassName)}>
              {value}
              <span className="text-xl text-muted-foreground ml-2">{unit}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
