'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ear, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

const FrequencyVisualizer = ({ bars, isListening }: { bars: number[]; isListening: boolean }) => {
  return (
    <div className="flex items-end justify-center h-24 gap-px w-full">
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            'w-full bg-primary/50 transition-all duration-300 ease-out',
            isListening ? 'bg-primary' : 'bg-primary/20'
          )}
          style={{ height: `${isListening ? height : 2}%` }}
        />
      ))}
    </div>
  );
};

type AcousticSensorProps = {
  onDbLevelChange: (db: number) => void;
  isAuditing: boolean;
  onToggleAudit: () => void;
};


export function AcousticSensor({ onDbLevelChange, isAuditing, onToggleAudit }: AcousticSensorProps) {
  const [dbLevel, setDbLevel] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(64).fill(2));

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAuditing) {
      interval = setInterval(() => {
        const newDb = Math.random() * (95 - 60) + 60;
        setDbLevel(newDb);
        onDbLevelChange(newDb);

        const newBars = Array.from({ length: 64 }, () => Math.random() * 100);
        setFrequencyBars(newBars);
      }, 1000);
    } else {
        setDbLevel(0);
        onDbLevelChange(0);
        setFrequencyBars(Array(64).fill(2));
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuditing, onDbLevelChange]);

  const isHighDb = dbLevel > 85;
  const statusMessage = isAuditing 
    ? (isHighDb ? "High Acoustic Signature Detected -> Inefficient Motor -> High Carbon Output" : "Optimal Acoustic Range")
    : "Standing by...";

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                <Ear className="h-5 w-5" />
                Acoustic Signal Capture
                </CardTitle>
                <CardDescription>Use device microphone to simulate an acoustic audit.</CardDescription>
            </div>
            <Button onClick={onToggleAudit} size="lg" className={cn("w-full sm:w-auto", isAuditing && 'bg-destructive hover:bg-destructive/90')}>
                <Radio className={cn("mr-2 h-5 w-5", isAuditing && "animate-pulse")} />
                {isAuditing ? 'Stop Audit' : 'Start Acoustic Audit'}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex items-center justify-center h-32 p-4 rounded-lg bg-background/50 border border-border overflow-hidden">
            <FrequencyVisualizer bars={frequencyBars} isListening={isAuditing} />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
                <div className={cn("text-5xl font-bold tracking-tighter transition-colors", isHighDb ? 'text-destructive' : 'text-accent')}>
                    {dbLevel.toFixed(1)}
                    <span className="text-2xl text-muted-foreground ml-2">dB</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1 font-mono uppercase tracking-widest">
                    {isAuditing ? 'Listening...' : 'Offline'}
                </div>
            </div>
        </div>
        <div className="flex items-center justify-center p-3 rounded-md bg-background/50 text-center min-h-[44px]">
            {isAuditing ? (
                isHighDb ? (
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5 animate-pulse" />
                        <span className="font-semibold">{statusMessage}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-accent">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">{statusMessage}</span>
                    </div>
                )
            ) : (
                <p className="text-muted-foreground font-mono">{statusMessage}</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
