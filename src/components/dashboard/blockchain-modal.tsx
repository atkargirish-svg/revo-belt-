'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, Loader, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConfettiPiece = ({ x, y, rotate, color }: { x: number, y: number, rotate: number, color: string }) => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: color,
                width: '8px',
                height: '16px',
            }}
            initial={{ opacity: 1, y: 0, rotate: 0 }}
            animate={{ opacity: 0, y: 100, rotate: rotate + 360 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
        />
    );
};


export const BlockchainModal = ({ onClose }: { onClose: () => void }) => {
    const [status, setStatus] = useState<'loading' | 'success'>('loading');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('success');
            setShowConfetti(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const confetti = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -20,
        rotate: Math.random() * 360,
        color: ['#39FF14', '#00BFFF', '#FFD700'][Math.floor(Math.random() * 3)],
    }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md p-6 text-center text-card-foreground font-code"
            >
                <button onClick={onClose} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                    <X size={20} />
                </button>
                
                {showConfetti && confetti.map(c => <ConfettiPiece key={c.id} {...c} />)}

                <AnimatePresence mode="wait">
                    {status === 'loading' ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <Loader className="animate-spin text-primary" size={48} />
                            <h2 className="text-lg font-semibold text-primary">Minting Certificate...</h2>
                            <p className="text-sm text-muted-foreground">Hashing daily emission data to Polygon network...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <CheckCircle className="text-accent" size={48} />
                            <h2 className="text-lg font-semibold text-accent">Minting Successful!</h2>
                            <p className="text-sm text-muted-foreground">Your Green Compliance Certificate is now on-chain.</p>
                            <div className="w-full text-left bg-background/50 p-3 rounded-md border border-border mt-2">
                                <p className="text-xs text-muted-foreground">Smart Contract Hash:</p>
                                <p className="text-xs text-primary break-all">Tx: 0x9b4a1b2e5d7c4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0</p>
                            </div>
                            <Button className="w-full mt-4 bg-accent/90 text-accent-foreground hover:bg-accent">
                                <Download className="mr-2" size={16} />
                                Download ISO-14001 ESG Report
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
