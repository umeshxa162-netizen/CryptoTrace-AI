import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Cpu,
  Brain,
  Copy,
  Check,
  CheckCircle2,
  Shield,
  Layers,
  Fingerprint
} from 'lucide-react';
import { ThemeMode } from '../types';

interface ForensicPlaygroundProps {
  theme: ThemeMode;
}

export const ForensicPlayground: React.FC<ForensicPlaygroundProps> = ({ theme }) => {
  const [hopDepth, setHopDepth] = useState(3);
  const [velocityWeight, setVelocityWeight] = useState(30);
  const [intelWeight, setIntelWeight] = useState(35);
  const [persona, setPersona] = useState('ForensicLead');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'dark';

  const personas = [
    { id: 'ForensicLead', label: 'Forensic Lead', badge: 'Court-Ready Standard' },
    { id: 'RapidTriage', label: 'Rapid Triage', badge: 'High-Throughput Heuristic' },
    { id: 'OffRampAuditor', label: 'Off-Ramp Auditor', badge: 'Exchange KYC Focus' },
    { id: 'Counterfactual', label: 'Counterfactual Engine', badge: 'What-If Topology' },
  ];

  const handleExecuteSandbox = () => {
    setIsGenerating(true);
    setGeneratedOutput(null);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(`// CryptoTrace AI Forensic Engine Execution Output
// Persona: ${persona} | Hop Depth: ${hopDepth} | Velocity Weight: ${velocityWeight}% | Intel Weight: ${intelWeight}%

[STATUS] Ingested 14 Transactions across ${hopDepth} hops.
[ANALYSIS] Computed composite risk: 91.4 / 100 (CRITICAL).
[PROVENANCE]
  ├─ Fact #1: TX 0xfa89...3456 (Block #21908412) -> Ingress Verified
  ├─ Report #2: Chainabuse Match ID #CR-2026-891 -> Phishing Drainer Tag
  └─ Inference #3: 82.4% Peel Retained -> Obfuscation Cluster Confirmed

[RECOMMENDATION] Dispatch emergency subpoena to Tier-1 Exchange Compliance Desk.`);
    }, 700);
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="playground" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Forensics Sandbox</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
        >
          <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>Fine-Tune </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            Forensic Risk Weights
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
        >
          Adjust multi-hop depth caps, velocity indicators, and investigator personas in real time.
        </motion.p>
      </div>

      {/* Sandbox Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Parameter Controls (Span 5) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 border space-y-6 transition-all ${
            isDark
              ? 'bg-zinc-900/80 backdrop-blur-xl border-zinc-800/90 shadow-2xl shadow-black/40'
              : 'bg-white/90 backdrop-blur-xl border-zinc-200 shadow-xl'
          }`}
        >
          {/* Persona selector */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Investigator Persona Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {personas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    persona === p.id
                      ? isDark
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-cyan-50 border-cyan-300 text-cyan-800'
                      : isDark
                      ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold font-sans">{p.label}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{p.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hop Depth Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-zinc-400">Max Hop Traversal Depth (1–5):</span>
              <span className="text-cyan-400 font-bold">{hopDepth} Hops</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={hopDepth}
              onChange={(e) => setHopDepth(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
              <span>Direct Ingress (1)</span>
              <span>Capped Default (3)</span>
              <span>Full Mesh (5)</span>
            </div>
          </div>

          {/* Velocity Weight Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-zinc-400">Velocity Weight:</span>
              <span className="text-indigo-400 font-bold">{velocityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={velocityWeight}
              onChange={(e) => setVelocityWeight(parseInt(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Intel Weight Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-zinc-400">Threat Intel Weight:</span>
              <span className="text-purple-400 font-bold">{intelWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={intelWeight}
              onChange={(e) => setIntelWeight(parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Execute Sandbox Button */}
          <button
            onClick={handleExecuteSandbox}
            disabled={isGenerating}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isGenerating ? 'Simulating Pipeline...' : 'Run Forensic Heuristic'}</span>
          </button>
        </motion.div>

        {/* Right Column: Execution Output Console (Span 7) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 border min-h-[420px] flex flex-col justify-between ${
            isDark ? 'bg-zinc-950 border-zinc-800/90 shadow-2xl' : 'bg-zinc-900 text-zinc-100 border-zinc-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                FORENSIC ENGINE OUTPUT TERMINAL
              </span>
              {generatedOutput && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="mt-4 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {generatedOutput || (
                <div className="text-zinc-500 italic py-16 text-center">
                  Configure weights and click "Run Forensic Heuristic" to simulate real-time pipeline execution...
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Runtime: V8 AST Sandbox</span>
            <span>Deterministic Scoring: Active</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
