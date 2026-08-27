import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Brain,
  Shield,
  Search,
  Zap,
  CheckCircle2,
  Workflow,
  Cpu,
  Layers,
  ArrowUpRight,
  Fingerprint,
  FileCheck,
  FileSpreadsheet,
  Lock,
  GitFork
} from 'lucide-react';
import { ThemeMode } from '../types';

interface FeaturesBentoProps {
  theme: ThemeMode;
  onExploreFeature: (featureName: string) => void;
}

export const FeaturesBento: React.FC<FeaturesBentoProps> = ({ theme, onExploreFeature }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'peel' | 'provenance'>('pipeline');
  const isDark = theme === 'dark';

  return (
    <section id="capabilities" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
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
          <Cpu className="w-3.5 h-3.5" />
          <span>Forensic Architecture</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
        >
          <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>From One Wallet to the </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            Full Money Trail
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
        >
          Enterprise-grade blockchain intelligence built on verifiable cryptographic facts, explainable risk scoring, and evidence-first provenance.
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
        {/* Card 1: 7-Stage Investigative Pipeline (Span 7) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -3, transition: { duration: 0.25 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 border relative overflow-hidden group flex flex-col justify-between transition-all duration-300 ${
            isDark
              ? 'bg-zinc-900/80 backdrop-blur-xl border-zinc-800/90 hover:border-cyan-500/40 shadow-xl shadow-black/30'
              : 'bg-white/90 backdrop-blur-xl border-zinc-200 hover:border-cyan-300 shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-40 transition-opacity duration-500" />
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 mb-2">
                <Workflow className="w-4 h-4" />
                <span>The 7-Stage Investigative Pipeline</span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Automated End-to-End Tracing
              </h3>
              <p className={`text-xs sm:text-sm mt-1 max-w-md ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                ONE WALLET → UNDERSTAND → TRACE → CONNECT → RANK → EXPLAIN → REPORT
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          {/* Interactive Pipeline Trace Simulation */}
          <div
            className={`rounded-2xl p-4 border font-mono text-xs space-y-2.5 my-2 ${
              isDark ? 'bg-zinc-950 border-zinc-800/90 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-2 border-b border-zinc-800/60">
              <span>PIPELINE TELEMETRY EXECUTION</span>
              <span className="text-cyan-400 font-bold">100% PROVENANCE VERIFIED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-cyan-400 font-bold">01.</span>
              <span>Ingest victim wallet & index EVM block transactions</span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-cyan-500/30">
              <span className="text-purple-400 font-bold">02.</span>
              <span>Deconstruct peel-chain splits & query 12,000+ scam databases</span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-cyan-500/30">
              <span className="text-emerald-400 font-bold">03.</span>
              <span>Synthesize court-ready intelligence report with unforgeable audit trail</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between mt-auto">
            <span className="text-xs text-zinc-500 font-mono">SIH Metric: &lt;140ms Traversal Latency</span>
            <button
              onClick={() => onExploreFeature('Pipeline')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Card 2: Peel Chain & Anomaly Detection (Span 5) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -3, transition: { duration: 0.25 } }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 border relative overflow-hidden group flex flex-col justify-between transition-all duration-300 ${
            isDark
              ? 'bg-zinc-900/80 backdrop-blur-xl border-zinc-800/90 hover:border-indigo-500/40 shadow-xl shadow-black/30'
              : 'bg-white/90 backdrop-blur-xl border-zinc-200 hover:border-indigo-300 shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 mb-2">
                <GitFork className="w-4 h-4" />
                <span>Topology Forensics</span>
              </div>
              <h3 className={`text-xl font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Peel-Chain De-Obfuscation
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>

          <p className={`text-xs sm:text-sm mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Automated entity clustering detects micro-transfer peeling strategies designed to evade traditional threshold monitoring.
          </p>

          <div
            className={`p-3 rounded-xl border font-mono text-[11px] space-y-1.5 ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
            }`}
          >
            <div className="flex justify-between text-zinc-400">
              <span>Peel Ratio:</span>
              <span className="text-indigo-400 font-bold">82.4% Retained</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Cluster Taint:</span>
              <span className="text-red-400 font-bold">96% Suspect Match</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between mt-auto">
            <span className="text-xs text-zinc-500 font-mono">Max 5 Hops Capped</span>
            <button
              onClick={() => onExploreFeature('PeelChain')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Clustering</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Card 3: Evidence Provenance (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between ${
            isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-md'
          }`}
        >
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 mb-2">
              Cryptographic Grounding
            </div>
            <h4 className="font-bold text-lg text-zinc-100 font-display mb-2">
              Evidence-First Architecture
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every score separates cryptographic FACTS (tx hashes), REPORTED signals (victim complaints), and INFERRED models.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Zero Hallucination AI</span>
            <span className="text-cyan-400 font-bold">100% Provenance</span>
          </div>
        </motion.div>

        {/* Card 4: Multi-Chain Coverage (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between ${
            isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-md'
          }`}
        >
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400 mb-2">
              Multi-Chain Ecosystem
            </div>
            <h4 className="font-bold text-lg text-zinc-100 font-display mb-2">
              Cross-Chain RPC Indexing
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Native support for Ethereum, Bitcoin, BNB Chain, Polygon, Arbitrum, Solana, and Tron with unified address resolution.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Cross-Chain Bridges</span>
            <span className="text-purple-400 font-bold">7 Major Networks</span>
          </div>
        </motion.div>

        {/* Card 5: Court-Ready Intelligence Reports (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between ${
            isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-md'
          }`}
        >
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 mb-2">
              Law Enforcement
            </div>
            <h4 className="font-bold text-lg text-zinc-100 font-display mb-2">
              Exportable PDF Dossiers
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate standardized case documentation with digital signatures, transaction hash audits, and counterparty freezes.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Standardized Format</span>
            <span className="text-emerald-400 font-bold">PDF / JSON Dossier</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
