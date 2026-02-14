'use client';

import { useState, useEffect } from 'react';
import { Bot, Wrench, Clock, Filter, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const terminalLines = [
  "> Analyzing indirect signals...",
  "> Thermal anomaly matched with 88dB acoustic spike.",
  "> Generating low-cost operational adjustments...",
];

const recommendations = [
  {
    icon: Wrench,
    text: "Clean exhaust filters on Machine 2.",
    details: "Cost: $0 | Est. CO2 Reduction: 12%",
  },
  {
    icon: Clock,
    text: "Shift heavy grinding work to off-peak hours (Night).",
    details: "Optimize grid energy load.",
  },
  {
    icon: Filter,
    text: "Install a $50 DIY activated-carbon mesh on the main vent.",
    details: "Low-cost, high impact.",
  },
];

export function GroqIntelligenceTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const line = terminalLines[currentLineIndex];
      if (currentText.length < line.length) {
        const timeout = setTimeout(() => {
          setCurrentText(line.slice(0, currentText.length + 1));
        }, 50); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, currentText]);
          setCurrentText('');
          setCurrentLineIndex(prev => prev + 1);
        }, 500); // Pause between lines
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
          setShowRecommendations(true);
      }, 500) // Pause before showing recommendations
      return () => clearTimeout(timeout);
    }
  }, [currentText, currentLineIndex]);


  return (
    <Card className="bg-black border-green-500/30 shadow-lg font-code text-green-400 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg text-green-400">
          <Bot className="h-5 w-5" />
          Groq Llama-3 Operational Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-900/50 p-4 rounded-md border border-green-500/20 min-h-[150px]">
          {lines.map((line, i) => (
            <p key={i} className="flex items-center">
              <span className="text-green-600 mr-2">$</span>
              {line}
            </p>
          ))}
          {currentText && (
            <p className="flex items-center">
                <span className="text-green-600 mr-2">$</span>
                {currentText}
                <span className="w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
            </p>
          )}
        </div>

        {showRecommendations && (
            <div className="space-y-3 animate-in fade-in-50 duration-500">
                <h3 className="text-md font-semibold text-green-300 pl-1">{">"} Recommended Actions:</h3>
                {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-green-900/20 border border-green-500/30 hover:bg-green-900/40 transition-colors">
                        <div className="p-2 bg-green-900/50 rounded-md mt-1">
                            <rec.icon className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-300">{rec.text}</p>
                            <p className="text-sm text-green-500">{rec.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300">
          <Lock className="mr-2 h-4 w-4" />
          Mint Green Certificate on Blockchain
        </Button>
      </CardFooter>
    </Card>
  );
}
