'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ear, Camera, Radio, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

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
  isAnalyzing: boolean;
  onAnalysis: (data: { machineName: string; photo: File; dbLevel: number }) => void;
};


export function AcousticSensor({ isAnalyzing, onAnalysis }: AcousticSensorProps) {
  const { toast } = useToast();
  const [dbLevel, setDbLevel] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(64).fill(2));
  const [isListening, setIsListening] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [machineName, setMachineName] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);


  const startListening = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setStream(audioStream);
      setIsListening(true);
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = context.createMediaStreamSource(audioStream);
      source.connect(analyser);

      const pcmData = new Float32Array(analyser.fftSize);
      
      const onFrame = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
        const rms = Math.sqrt(sumSquares / pcmData.length);
        const db = 20 * Math.log10(rms) + 90;
        setDbLevel(db < 0 ? 0 : db);

        const newBars = Array.from({ length: 64 }, () => Math.random() * 100 * (db/100));
        setFrequencyBars(newBars);

        animationFrameRef.current = requestAnimationFrame(onFrame);
      };
      animationFrameRef.current = requestAnimationFrame(onFrame);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use the acoustic audit feature.",
      });
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if(animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setStream(null);
    setIsListening(false);
    setFrequencyBars(Array(64).fill(2));
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopListening();
    };
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = () => {
    if (!machineName) {
        toast({ variant: 'destructive', title: 'Machine name is required.' });
        return;
    }
    if (!photo) {
        toast({ variant: 'destructive', title: 'Machine photo is required.' });
        return;
    }
    if (!isListening) {
        toast({ variant: 'destructive', title: 'Please start the audit to get a dB level.' });
        return;
    }
    onAnalysis({ machineName, photo, dbLevel });
  }

  const isHighDb = dbLevel > 85;

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ear className="h-5 w-5" />
          Indirect Signal Capture
        </CardTitle>
        <CardDescription>Provide machine data and capture live acoustic signals for analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="machine-name">Machine Name</Label>
            <Input id="machine-name" placeholder="e.g., Lathe Machine, Boiler" value={machineName} onChange={(e) => setMachineName(e.target.value)} disabled={isAnalyzing}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="machine-photo">Machine Photo</Label>
            <Input id="machine-photo" type="file" accept="image/*" onChange={handlePhotoChange} disabled={isAnalyzing}/>
          </div>
        </div>

        {photoPreview && (
          <div className="flex justify-center">
            <img src={photoPreview} alt="Machine Preview" className="max-h-48 rounded-lg border border-border" />
          </div>
        )}

        <div className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h3 className="font-semibold">Acoustic Audit</h3>
                    <p className="text-sm text-muted-foreground">Start the audit to capture live decibel levels.</p>
                </div>
                <Button onClick={isListening ? stopListening : startListening} size="lg" className={cn("w-full sm:w-auto", isListening && 'bg-destructive hover:bg-destructive/90')} disabled={isAnalyzing}>
                    <Radio className={cn("mr-2 h-5 w-5", isListening && "animate-pulse")} />
                    {isListening ? 'Stop Audit' : 'Start Acoustic Audit'}
                </Button>
            </div>
            <div className="relative flex items-center justify-center h-32 p-4 rounded-lg bg-background/50 border border-border overflow-hidden">
                <FrequencyVisualizer bars={frequencyBars} isListening={isListening} />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <div className={cn("text-5xl font-bold tracking-tighter transition-colors", isListening && isHighDb ? 'text-destructive' : 'text-accent')}>
                        {dbLevel.toFixed(1)}
                        <span className="text-2xl text-muted-foreground ml-2">dB</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 font-mono uppercase tracking-widest">
                        {isListening ? 'Listening...' : 'Offline'}
                    </div>
                </div>
            </div>
        </div>
        
        <Button size="lg" className="w-full" onClick={handleAnalyze} disabled={isAnalyzing || !isListening}>
            <Bot className="mr-2 h-5 w-5" />
            {isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze Machine Sustainability'}
        </Button>

      </CardContent>
    </Card>
  );
}
