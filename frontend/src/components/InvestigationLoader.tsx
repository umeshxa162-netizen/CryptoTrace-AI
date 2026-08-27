import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle2, Loader2, Cpu, Activity, Fingerprint } from 'lucide-react';
import { ThemeMode } from '../types';

interface InvestigationLoaderProps {
  theme: ThemeMode;
  targetAddress: string;
  onComplete: () => void;
}

const steps = [
  'VALIDATING WALLET & RPC REACHABILITY',
  'FETCHING EVM TRANSACTIONS & PEEL TRANSFERS',
  'BUILDING MULTI-HOP NETWORK GRAPH',
  'TRACING FUND FLOW & COUNTERPARTIES',
  'CALCULATING WEIGHTED RISK SCORE & ANOMALIES',
  'CHECKING THREAT INTEL & SANCTIONS RECORDS',
  'SYNTHESIZING FORENSIC SUMMARY & AI INSIGHTS',
];

export const InvestigationLoader: React.FC<InvestigationLoaderProps> = ({
  theme,
  targetAddress,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 my-16"
    >
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
          isDark
            ? 'bg-zinc-950/90 border-cyan-900/60 backdrop-blur-2xl shadow-cyan-950/40'
            : 'bg-white border-cyan-200 backdrop-blur-2xl shadow-xl'
        }`}
      >
        {/* Glow ambient header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 animate-gradient-flow" />

        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">
                LIVE FORENSIC PIPELINE EXECUTION
              </div>
              <div className="text-xs font-mono text-zinc-400 truncate max-w-xs sm:max-w-md">
                Target: {targetAddress}
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
          </div>
        </div>

        {/* 7-Step Checklist */}
        <div className="space-y-3 font-mono text-xs">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isCompleted
                    ? isDark
                      ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    : isCurrent
                    ? isDark
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-sm'
                      : 'bg-cyan-50 border-cyan-300 text-cyan-900 shadow-sm'
                    : 'opacity-40 border-transparent text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-500 font-bold">0{idx + 1}.</span>
                  <span>{step}</span>
                </div>

                <div>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isCurrent && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  {isPending && <span className="w-2 h-2 rounded-full bg-zinc-700 block" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
