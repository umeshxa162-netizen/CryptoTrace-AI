import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Search,
  Zap,
  Activity,
  AlertTriangle,
  FileCheck,
  Brain,
  Layers,
  ArrowRight,
  Radio,
  Fingerprint,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ThemeMode } from '../types';

interface BlockchainInvestigationVisualProps {
  theme: ThemeMode;
  onSelectNode?: (nodeLabel: string) => void;
}

export const BlockchainInvestigationVisual: React.FC<BlockchainInvestigationVisualProps> = ({
  theme,
  onSelectNode,
}) => {
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);
  const [scanPulse, setScanPulse] = useState(0);

  const isDark = theme === 'dark';

  // Periodic radar sweep timer
  useEffect(() => {
    const timer = setInterval(() => {
      setScanPulse((prev) => (prev + 1) % 6);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const flowNodes = [
    {
      id: 'n1',
      x: 75,
      y: 70,
      label: 'UNKNOWN WALLET',
      sub: '0x7A3c...91F2',
      type: 'target',
      status: 'INGRESS',
      icon: Search,
      tag: 'Target Ingress',
      desc: '10.00 ETH ($25.4k) swept via malicious contract',
    },
    {
      id: 'n2',
      x: 230,
      y: 55,
      label: 'TX NETWORK',
      sub: 'Multi-Split Hop',
      type: 'network',
      status: 'DISPERSION',
      icon: Layers,
      tag: 'Peel Chain',
      desc: '2-way sub-minute burst dispersion detected',
    },
    {
      id: 'n3',
      x: 390,
      y: 70,
      label: 'CONNECTED NODES',
      sub: 'Cluster #CL-441',
      type: 'cluster',
      status: 'AGGREGATION',
      icon: Activity,
      tag: 'Counterparties',
      desc: '7 associated peer wallets & mixer endpoints',
    },
    {
      id: 'n4',
      x: 390,
      y: 215,
      label: 'AI ANALYSIS',
      sub: 'Risk Barometer 91/100',
      type: 'ai',
      status: 'SCANNING',
      icon: Brain,
      tag: 'Anomaly Score',
      desc: 'Peel velocity anomaly (+4.5 Std Dev deviation)',
    },
    {
      id: 'n5',
      x: 230,
      y: 230,
      label: 'SUSPICIOUS PATH',
      sub: 'Mixer & Off-Ramp',
      type: 'suspicious',
      status: 'ALERT',
      icon: AlertTriangle,
      tag: 'Critical Trail',
      desc: '68.8% routed into Tier-1 Exchange KYC deposit',
    },
    {
      id: 'n6',
      x: 75,
      y: 215,
      label: 'EVIDENCE DOSSIER',
      sub: 'Sec 91 CrPC Proof',
      type: 'evidence',
      status: 'VERIFIED',
      icon: FileCheck,
      tag: 'SHA-256 Proof',
      desc: 'Court-admissible cryptographic evidence package',
    },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl border p-5 sm:p-6 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all ${
        isDark
          ? 'bg-zinc-950/85 border-cyan-900/40 text-zinc-100 shadow-black/80'
          : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-xl'
      }`}
    >
      {/* Background Grid Pattern & Radar Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Visual Header Strip */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-400 uppercase tracking-wider">
            AI FORENSIC TOPOLOGY ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SURVEILLANCE ACTIVE</span>
        </div>
      </div>

      {/* SVG Interactive Intelligence Visualization */}
      <div className="relative w-full flex items-center justify-center min-h-[300px]">
        <svg
          className="w-full h-auto max-w-[480px] overflow-visible"
          viewBox="0 0 465 285"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="visFlowGrad1" x1="75" y1="70" x2="230" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="visFlowGrad2" x1="230" y1="55" x2="390" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="visFlowGrad3" x1="390" y1="70" x2="390" y2="215" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="visFlowGrad4" x1="390" y1="215" x2="230" y2="230" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="visFlowGrad5" x1="230" y1="230" x2="75" y2="215" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Connecting Trace Paths with Flow Lines */}
          <g className="trace-edges">
            {/* Edge 1: N1 -> N2 */}
            <path
              d="M 75 70 L 230 55"
              stroke="url(#visFlowGrad1)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Edge 2: N2 -> N3 */}
            <path
              d="M 230 55 L 390 70"
              stroke="url(#visFlowGrad2)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Edge 3: N3 -> N4 */}
            <path
              d="M 390 70 L 390 215"
              stroke="url(#visFlowGrad3)"
              strokeWidth="2.5"
            />
            {/* Edge 4: N4 -> N5 (Critical Suspicious Path) */}
            <path
              d="M 390 215 L 230 230"
              stroke="url(#visFlowGrad4)"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
            {/* Edge 5: N5 -> N6 */}
            <path
              d="M 230 230 L 75 215"
              stroke="url(#visFlowGrad5)"
              strokeWidth="2.5"
            />

            {/* Cross-loop feedback: N6 -> N1 */}
            <path
              d="M 75 215 L 75 70"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />
          </g>

          {/* 2. Animated Particle Pulses Moving Along Edges */}
          <g className="moving-particles">
            <circle r="3.5" fill="#06b6d4" filter="url(#nodeGlow)">
              <animateMotion path="M 75 70 L 230 55" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r="3.5" fill="#6366f1" filter="url(#nodeGlow)">
              <animateMotion path="M 230 55 L 390 70" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#a855f7" filter="url(#nodeGlow)">
              <animateMotion path="M 390 70 L 390 215" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle r="4.5" fill="#ef4444" filter="url(#nodeGlow)">
              <animateMotion path="M 390 215 L 230 230" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#10b981" filter="url(#nodeGlow)">
              <animateMotion path="M 230 230 L 75 215" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* 3. Render Nodes */}
          {flowNodes.map((node, index) => {
            const isHovered = activeHoverNode === node.id;
            const isScanning = scanPulse === index;

            let strokeColor = '#06b6d4';
            let fillColor = isDark ? '#09090b' : '#ffffff';
            let badgeBg = '#06b6d420';

            if (node.type === 'target') strokeColor = '#06b6d4';
            if (node.type === 'network') strokeColor = '#6366f1';
            if (node.type === 'cluster') strokeColor = '#a855f7';
            if (node.type === 'ai') strokeColor = '#ec4899';
            if (node.type === 'suspicious') strokeColor = '#ef4444';
            if (node.type === 'evidence') strokeColor = '#10b981';

            return (
              <g
                key={node.id}
                onMouseEnter={() => setActiveHoverNode(node.id)}
                onMouseLeave={() => setActiveHoverNode(null)}
                onClick={() => onSelectNode && onSelectNode(node.label)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Outer scanning radar ring */}
                {(isScanning || isHovered) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="26"
                    fill={strokeColor}
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Node Main Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? '22' : '18'}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? '3' : '2'}
                  filter={isHovered ? 'url(#nodeGlow)' : undefined}
                />

                {/* Node Center Dot / Marker */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="5"
                  fill={strokeColor}
                />

                {/* Node Top/Bottom Text */}
                <text
                  x={node.x}
                  y={node.y > 140 ? node.y + 30 : node.y - 24}
                  fill={isDark ? '#f1f5f9' : '#0f172a'}
                  fontSize="9.5"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.label}
                </text>

                <text
                  x={node.x}
                  y={node.y > 140 ? node.y + 40 : node.y - 14}
                  fill={strokeColor}
                  fontSize="8"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Tooltip Detail Drawer (Bottom of Visual) */}
      <div
        className={`p-3 rounded-2xl border transition-all text-xs font-mono mt-2 ${
          isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
        }`}
      >
        {activeHoverNode ? (
          (() => {
            const n = flowNodes.find((item) => item.id === activeHoverNode);
            if (!n) return null;
            return (
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-cyan-400">{n.label}:</span>{' '}
                  <span className="text-zinc-300">{n.desc}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] shrink-0">
                  {n.tag}
                </span>
              </div>
            );
          })()
        ) : (
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hover any node to inspect real-time forensic metadata</span>
            </div>
            <span className="text-cyan-400 font-bold hidden sm:inline">6 Stage AI Pipeline</span>
          </div>
        )}
      </div>

      {/* Mini Flow Pipeline Legend */}
      <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="truncate">Ingress &gt; Peel Hop</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="truncate">AI Anomaly Scan</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="truncate">Court Evidence</span>
        </div>
      </div>
    </div>
  );
};
