'use client';

import { motion } from 'framer-motion';
import { Radio, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveAnimation } from './wave-animation';
import { cn } from '@/lib/utils';

type SignalSimulatorProps = {
    isAnomaly: boolean;
    onSimulate: () => void;
};

export function SignalSimulator({ isAnomaly, onSimulate }: SignalSimulatorProps) {
    const acousticValue = isAnomaly ? '95 dB' : '82 dB';
    const thermalValue = isAnomaly ? '145°C' : '110°C';

    return (
        <Card className="h-full bg-card/50 border-border/50 shadow-lg backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg">Live Indirect Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Acoustic Monitor */}
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold flex items-center gap-2"><Radio size={16}/> Acoustic Signature</h4>
                        <span className={cn(
                            "font-mono font-bold text-lg",
                            isAnomaly ? "text-destructive" : "text-accent"
                        )}>
                            {acousticValue}
                        </span>
                    </div>
                    <div className={cn(
                        "p-2 rounded-lg border",
                        isAnomaly ? "border-destructive/50" : "border-accent/30"
                    )}>
                        <WaveAnimation />
                    </div>
                    <p className={cn(
                        "text-xs text-center font-mono",
                        isAnomaly ? "text-destructive" : "text-accent"
                    )}>
                        {isAnomaly ? "HIGH SIGNATURE (INEFFICIENT)" : "OPTIMAL RANGE"}
                    </p>
                </div>

                {/* Thermal Monitor */}
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold flex items-center gap-2"><Thermometer size={16} /> Thermal Imaging</h4>
                        <span className={cn(
                            "font-mono font-bold text-lg",
                            isAnomaly ? "text-destructive" : "text-primary"
                        )}>
                            {thermalValue}
                        </span>
                    </div>
                    <div className="w-full h-8 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600 rounded-lg border border-border p-1">
                       <motion.div 
                         className="h-full w-2 bg-white/80 rounded-full shadow-lg"
                         initial={{ x: "40%" }}
                         animate={{ x: isAnomaly ? "85%" : "40%" }}
                         transition={{ type: "spring", stiffness: 100 }}
                       />
                    </div>
                </div>
                
                <Button 
                    onClick={onSimulate} 
                    disabled={isAnomaly}
                    className="w-full bg-destructive/80 text-destructive-foreground hover:bg-destructive"
                >
                    Simulate Anomaly
                </Button>
            </CardContent>
        </Card>
    );
}
