'use client';

import { useState, useEffect } from 'react';
import { Bot, Wrench, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

type TerminalProps = {
  isAnomaly: boolean;
};

const initialLines = [
  "> Standing by for signal analysis...",
  "> System nominal. All parameters within optimal range.",
];

const anomalyLines = [
  "> Analyzing multi-modal indirect signals...",
  "> Alert: Acoustic spike detected on Motor B.",
  "> Correlating with thermal exhaust data...",
  "> Generating low-cost operational adjustments...",
];

const recommendations = [
    {
        action: "Lubricate Motor B bearings & tighten belt.",
        cost: 0,
        reduction: 15,
    },
    {
        action: "Shift heavy heating load to off-peak grid hours (2 AM).",
        cost: 0,
        savings: 8,
    }
];

export function GroqIntelligenceTerminal({ isAnomaly }: TerminalProps) {
  const [lines, setLines] = useState<string[]>(initialLines);

  useEffect(() => {
    setLines([]);
    const sourceLines = isAnomaly ? anomalyLines : initialLines;
    let i = 0;
    const interval = setInterval(() => {
      if (i < sourceLines.length) {
        setLines(prev => [...prev, sourceLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isAnomaly]);

  const showRecommendations = isAnomaly && lines.length === anomalyLines.length;

  return (
    <div className="font-code text-sm h-full flex flex-col">
        <div className="flex-1 bg-black border-green-500/30 shadow-lg rounded-lg p-4 overflow-hidden flex flex-col">
            <h3 className="flex items-center gap-2 text-lg text-green-400 font-semibold mb-4">
                <Bot className="h-5 w-5" />
                Groq AI Operational Intelligence
            </h3>
            <div className="flex-1 space-y-1 text-green-400 overflow-y-auto">
                {lines.map((line, i) => (
                    <motion.p 
                        key={i} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                    >
                    <span className="text-green-600 mr-2">$</span>
                    {line}
                    </motion.p>
                ))}
                {lines.length < (isAnomaly ? anomalyLines.length : initialLines.length) && (
                    <p className="flex items-center">
                        <span className="text-green-600 mr-2">$</span>
                        <span className="w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
                    </p>
                )}
                
                {showRecommendations && (
                    <div className="space-y-3 pt-4">
                        {recommendations.map((rec, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex items-start gap-3 p-3 rounded-md bg-green-900/30 border border-green-500/40 hover:bg-green-900/50 cursor-pointer"
                            >
                                <div className="p-2 bg-green-900/50 rounded-md mt-1">
                                    <Wrench className="h-5 w-5 text-green-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-300">{rec.action}</p>
                                    <div className="text-xs text-green-500 flex items-center gap-x-4 mt-1">
                                        <span>Cost: ${rec.cost}</span>
                                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {rec.reduction ? `~${rec.reduction}% CO₂ Cut` : `~${rec.savings}% Savings`}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
