import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Building,
  FileCode,
  Radio,
  CheckCircle2,
  Check
} from 'lucide-react';
import { ThemeMode } from '../types';

interface HeroIsometricVisualProps {
  theme: ThemeMode;
  onCardClick?: (cardType: string) => void;
}

export const HeroIsometricVisual: React.FC<HeroIsometricVisualProps> = ({
  theme,
  onCardClick,
}) => {
  const [pulseActive, setPulseActive] = useState(true);
  const isDark = theme === 'dark';

  return (
    <div className="relative w-full max-w-[620px] aspect-[1.12/1] mx-auto flex items-center justify-center select-none">
      {/* Background Radial Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-purple-600/10 rounded-3xl blur-3xl pointer-events-none -z-10" />

      {/* Main Isometric Visual Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* SVG Network Graph with Circuit Traces & Particle Pulses */}
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="traceGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="traceGradPurple" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="centerGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Glowing filters */}
            <filter id="coreGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="particleGlowHero" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ambient Grid Circles */}
          <circle cx="300" cy="240" r="160" stroke="#06b6d4" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="300" cy="240" r="220" stroke="#6366f1" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="6 6" />

          {/* Network Circuit Connecting Traces */}
          <g className="circuit-lines" strokeWidth="1.5">
            {/* Center (300, 240) to Top-Left Node (170, 110) */}
            <line x1="300" y1="240" x2="170" y2="110" stroke="url(#traceGradCyan)" strokeDasharray="3 3" />
            {/* Center to Top-Right Node (420, 90) */}
            <line x1="300" y1="240" x2="420" y2="90" stroke="url(#traceGradCyan)" strokeDasharray="4 3" />
            {/* Center to Right Node (470, 210) */}
            <line x1="300" y1="240" x2="470" y2="210" stroke="url(#traceGradCyan)" />
            {/* Center to Bottom-Right Node (440, 360) */}
            <line x1="300" y1="240" x2="440" y2="360" stroke="url(#traceGradPurple)" strokeDasharray="3 3" />
            {/* Center to Bottom-Left Node (180, 370) */}
            <line x1="300" y1="240" x2="180" y2="370" stroke="url(#traceGradPurple)" />
            {/* Center to Left Anomaly Node (130, 240) */}
            <line x1="300" y1="240" x2="130" y2="240" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />

            {/* Inter-node cross connections */}
            <line x1="170" y1="110" x2="420" y2="90" stroke="#06b6d4" strokeOpacity="0.25" strokeDasharray="3 3" />
            <line x1="420" y1="90" x2="470" y2="210" stroke="#06b6d4" strokeOpacity="0.3" />
            <line x1="470" y1="210" x2="440" y2="360" stroke="#a855f7" strokeOpacity="0.3" strokeDasharray="4 4" />
            <line x1="180" y1="370" x2="130" y2="240" stroke="#ef4444" strokeOpacity="0.3" strokeDasharray="3 3" />
          </g>

          {/* Animated Fund Particles Traveling along Traces */}
          <g className="particles">
            {/* Particle 1: Center -> Top-Right */}
            <circle r="3" fill="#06b6d4" filter="url(#particleGlowHero)">
              <animateMotion path="M 300 240 L 420 90" dur="2.2s" repeatCount="indefinite" />
            </circle>
            {/* Particle 2: Top-Left -> Center */}
            <circle r="3" fill="#3b82f6" filter="url(#particleGlowHero)">
              <animateMotion path="M 170 110 L 300 240" dur="2.5s" repeatCount="indefinite" />
            </circle>
            {/* Particle 3: Center -> Right */}
            <circle r="3.5" fill="#06b6d4" filter="url(#particleGlowHero)">
              <animateMotion path="M 300 240 L 470 210" dur="1.8s" repeatCount="indefinite" />
            </circle>
            {/* Particle 4: Center -> Bottom-Right */}
            <circle r="3" fill="#a855f7" filter="url(#particleGlowHero)">
              <animateMotion path="M 300 240 L 440 360" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Particle 5: Center -> Left Anomaly (Red Alert) */}
            <circle r="3.5" fill="#ef4444" filter="url(#particleGlowHero)">
              <animateMotion path="M 300 240 L 130 240" dur="1.4s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* ======================================================== */}
          {/* SURROUNDING HEXAGONAL NODES */}
          {/* ======================================================== */}

          {/* Node 1: Top-Left (Document / Evidence Node - Cyan) */}
          <g transform="translate(170, 110)" className="cursor-pointer">
            <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="#0b1329" stroke="#06b6d4" strokeWidth="2" />
            <polygon points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7" fill="#06b6d4" fillOpacity="0.2" />
            <circle cx="0" cy="0" r="4" fill="#06b6d4" />
          </g>

          {/* Node 2: Top-Right (Solana / Polygon Hexagon - Purple) */}
          <g transform="translate(420, 90)" className="cursor-pointer">
            <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="#0b1329" stroke="#a855f7" strokeWidth="2" />
            <polygon points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7" fill="#a855f7" fillOpacity="0.2" />
            <circle cx="0" cy="0" r="4" fill="#a855f7" />
          </g>

          {/* Node 3: Right (Bank / VASP Node - Cyan) */}
          <g transform="translate(470, 210)" className="cursor-pointer">
            <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="#0b1329" stroke="#06b6d4" strokeWidth="2" />
            <polygon points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7" fill="#06b6d4" fillOpacity="0.2" />
            <circle cx="0" cy="0" r="4" fill="#06b6d4" />
          </g>

          {/* Node 4: Bottom-Right (Ethereum / Contract Node - Blue) */}
          <g transform="translate(440, 360)" className="cursor-pointer">
            <polygon points="0,-20 18,-10 18,10 0,20 -18,10 -18,-10" fill="#0b1329" stroke="#6366f1" strokeWidth="2" />
            <polygon points="0,-15 13,-7.5 13,7.5 0,15 -13,7.5 -13,-7.5" fill="#6366f1" fillOpacity="0.25" />
            <circle cx="0" cy="0" r="4.5" fill="#818cf8" />
          </g>

          {/* Node 5: Bottom-Left (Ethereum Node - Cyan Diamond) */}
          <g transform="translate(180, 370)" className="cursor-pointer">
            <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="#0b1329" stroke="#06b6d4" strokeWidth="2" />
            <polygon points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7" fill="#06b6d4" fillOpacity="0.25" />
            <circle cx="0" cy="0" r="4" fill="#06b6d4" />
          </g>

          {/* Node 6: Left (Anomaly Trigger - Red Alert Dot) */}
          <g transform="translate(130, 240)">
            <circle cx="0" cy="0" r="10" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* ======================================================== */}
          {/* CENTRAL 3D ILLUMINATED BITCOIN / CORE BLOCKCHAIN NODE */}
          {/* ======================================================== */}
          <g transform="translate(300, 240)" className="cursor-pointer">
            {/* Outer Cyan Halo Ring */}
            <polygon
              points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29"
              fill="#06b6d4"
              fillOpacity="0.12"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-spin-slow"
              style={{ transformOrigin: '0 0' }}
            />

            {/* 3D Isometric Extrusion Base */}
            <polygon points="0,-48 42,-24 42,24 0,48 -42,24 -42,-24" fill="#051726" stroke="#0891b2" strokeWidth="2" />
            <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" fill="#082f49" stroke="#06b6d4" strokeWidth="2.5" />
            <polygon points="0,-36 31,-18 31,18 0,36 -31,18 -31,-18" fill="#0e7490" fillOpacity="0.4" />

            {/* Glowing Bitcoin Symbol */}
            <text
              x="0"
              y="12"
              fill="#ffffff"
              fontSize="34"
              fontFamily="Outfit, sans-serif"
              fontWeight="900"
              textAnchor="middle"
              filter="url(#coreGlow)"
            >
              ₿
            </text>
          </g>
        </svg>

        {/* ======================================================== */}
        {/* 4 FLOATING HOLOGRAPHIC INFORMATION PANELS (From Reference Image) */}
        {/* ======================================================== */}

        {/* 1. TOP RIGHT: TRANSACTION DETAILS CARD */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onClick={() => onCardClick && onCardClick('transaction')}
          className="absolute top-[8%] right-[4%] p-3 rounded-2xl bg-zinc-950/85 border border-cyan-500/40 backdrop-blur-xl shadow-xl shadow-cyan-950/30 text-left font-mono text-xs w-44 cursor-pointer hover:border-cyan-400 transition-all group"
        >
          <div className="text-[10px] text-zinc-400 font-sans font-medium">Transaction</div>
          <div className="font-bold text-cyan-300 text-xs mt-0.5">0x7f...3a2b</div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="font-bold text-zinc-100">2.45 BTC</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Confirmed
            </span>
          </div>
          <div className="text-[9px] text-zinc-500 mt-1">2 mins ago</div>
        </motion.div>

        {/* 2. CENTER LEFT: ANOMALY DETECTED CARD */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onClick={() => onCardClick && onCardClick('anomaly')}
          className="absolute top-[32%] left-[2%] p-3 rounded-2xl bg-zinc-950/85 border border-red-500/40 backdrop-blur-xl shadow-xl shadow-red-950/20 text-left font-mono text-xs w-48 cursor-pointer hover:border-red-400 transition-all flex items-start gap-2.5"
        >
          <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30 animate-pulse mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-red-400 text-[11px] font-sans">Anomaly Detected</div>
            <div className="text-[10px] text-zinc-300 font-sans">High Risk Transaction</div>
            <div className="text-[9px] text-zinc-400 mt-0.5">Confidence: 92%</div>
          </div>
        </motion.div>

        {/* 3. BOTTOM RIGHT: FUNDS FLOW CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          onClick={() => onCardClick && onCardClick('flow')}
          className="absolute bottom-[18%] right-[2%] p-3 rounded-2xl bg-zinc-950/85 border border-cyan-500/30 backdrop-blur-xl shadow-xl shadow-cyan-950/20 text-left font-mono text-xs w-44 cursor-pointer hover:border-cyan-400 transition-all"
        >
          <div className="text-[10px] text-zinc-400 font-sans font-medium">Funds Flow</div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-bold text-cyan-300 text-xs">12.6 BTC</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
              5 Hops →
            </span>
          </div>
          <div className="text-[9px] text-zinc-500 mt-1">Cross-Chain</div>
        </motion.div>

        {/* 4. BOTTOM CENTER-LEFT: INVESTIGATION SCORE CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          onClick={() => onCardClick && onCardClick('score')}
          className="absolute bottom-[4%] left-[16%] p-3 rounded-2xl bg-zinc-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 text-left font-mono text-xs flex items-center gap-3 cursor-pointer hover:border-cyan-400 transition-all w-48"
        >
          {/* Radial Dial Indicator 87 */}
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center border-2 border-cyan-400 text-cyan-300 font-extrabold font-display text-sm shrink-0 bg-cyan-950/40 shadow-inner">
            <span>87</span>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-sans font-medium">Investigation Score</div>
            <div className="font-bold text-zinc-100 text-xs">87 / 100</div>
            <div className="text-[9px] font-bold text-red-400">High Risk</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
