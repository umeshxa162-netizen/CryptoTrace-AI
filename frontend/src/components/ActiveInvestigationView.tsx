import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  FileCode,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Brain,
  Activity,
  Layers,
  Fingerprint,
  FileText,
  Sliders,
  Send,
  Eye,
  Info,
  Maximize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Clock,
  TrendingUp,
  GitFork,
  Radio,
  Lock,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ThemeMode,
  GraphNode,
  GraphEdge,
  RiskScoreData,
  FundFlowStep,
  EvidenceItem,
  InvestigationPriorityLead,
  ChatMessage
} from '../types';
import {
  mockDefaultNodes,
  mockDefaultEdges,
  mockRiskData,
  mockFundFlow,
  mockEvidenceItems,
  mockPriorityLeads
} from '../data/mockInvestigationData';
import {
  forensicReplaySequence,
  ForensicTimelineStep
} from '../services/forensicTimelineService';

interface ActiveInvestigationViewProps {
  theme: ThemeMode;
  targetAddress: string;
  onClearSession: () => void;
  onOpenReportModal: () => void;
}

export const ActiveInvestigationView: React.FC<ActiveInvestigationViewProps> = ({
  theme,
  targetAddress,
  onClearSession,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'graph' | 'timemachine' | 'flow' | 'risk' | 'evidence' | 'priority' | 'copilot'
  >('graph');

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(mockDefaultNodes[1]); // Default to suspect
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Animated Risk Counter State
  const [animatedScore, setAnimatedScore] = useState(0);

  // Time Machine Forensic Replay State
  const [replayIndex, setReplayIndex] = useState(4); // Default to full trail (step 4)
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1); // 0.5x, 1x, 2x, 5x

  // AI Next-Best Action State
  const [nextActionStarted, setNextActionStarted] = useState(false);

  // Copilot State
  const [customCopilotQuery, setCustomCopilotQuery] = useState('');
  const [copilotResponses, setCopilotResponses] = useState<
    Array<{ q: string; a: string; time: string }>
  >([
    {
      q: 'WHY IS THIS WALLET HIGH RISK?',
      a: 'The suspect wallet 0x7A3c...91F2 exhibits a high-risk velocity profile (91/100):\n\n1. Rapid fund dispersal: 100% of $25,400 incoming funds were split across 2 intermediate hops in under 27 minutes.\n2. Known Scam Attribution: 14 matching reports on Chainabuse linked to a malicious Uniswap clone drainer.\n3. Peel-chain obfuscation: $6,900 was subsequently routed into an unverified privacy mixer contract to sever attribution.',
      time: '10:18 UTC',
    },
  ]);

  const isDark = theme === 'dark';

  // Smooth animated count-up for Risk Score
  useEffect(() => {
    let start = 0;
    const target = mockRiskData.score;
    const duration = 1200;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Time Machine Playback Loop
  useEffect(() => {
    let interval: number;
    if (isPlayingReplay) {
      interval = window.setInterval(() => {
        setReplayIndex((prev) => {
          if (prev < forensicReplaySequence.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingReplay(false);
            return prev;
          }
        });
      }, 2400 / replaySpeed);
    }
    return () => clearInterval(interval);
  }, [isPlayingReplay, replaySpeed]);

  const currentReplayStep: ForensicTimelineStep = forensicReplaySequence[replayIndex];

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleTriggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleFocusAnomaly = (nodeId: string, stepIdx: number) => {
    setActiveTab('timemachine');
    setReplayIndex(stepIdx);
    const n = mockDefaultNodes.find((node) => node.id === nodeId);
    if (n) setSelectedNode(n);
  };

  const handleAskCopilot = (query: string) => {
    if (!query.trim()) return;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let answer = '';

    if (query.includes('FUNDS') || query.includes('WHERE')) {
      answer =
        'Tracing indicates 68.8% ($17,500) reached High-Risk Aggregator C (0x10B4...88EE), which subsequently deposited funds into a Tier-1 Exchange deposit wallet. The remaining 31.2% ($7,200) was routed to an obfuscation peel pool.';
    } else if (query.includes('NEXT') || query.includes('LOOK')) {
      answer =
        'Priority Lead #01: High-Risk Aggregator C (0x10B4...88EE). Recommend issuing an emergency Exchange Freeze Request to the off-ramp compliance desk for deposit transaction 0x3344...1928.';
    } else if (query.includes('EVIDENCE')) {
      answer =
        'Evidence chain includes: 1 Cryptographic On-Chain Fact (Block #21908412), 14 Crowdsourced Scam Reports (Chainabuse #CR-2026-891), and 1 High-Confidence Topology Inference (98.2% Peel-Chain match).';
    } else {
      answer = `Forensic Analysis for "${query}": The investigative trail confirms immediate fund movement with zero legitimate commerce holding periods. Recommended next step: Export full PDF intelligence dossier for law enforcement submission.`;
    }

    setCopilotResponses((prev) => [...prev, { q: query, a: answer, time: timeString }]);
    setCustomCopilotQuery('');
  };

  return (
    <motion.section
      id="active-investigation-result"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, y: 20, filter: 'blur(6px)', scale: 0.98 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-24"
    >
      <div
        className={`rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-zinc-900/90 border-cyan-900/60 backdrop-blur-2xl shadow-black/80'
            : 'bg-white border-zinc-200 backdrop-blur-2xl shadow-xl'
        }`}
      >
        {/* Top Ambient Radial Beam */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-ambient-glow" />

        {/* Case Header & Key Forensic Metrics */}
        <div className="p-6 sm:p-8 border-b border-zinc-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                <span>CRITICAL SEVERITY</span>
              </span>
              <span className="text-xs font-mono text-zinc-500">CASE #CT-2026-0184</span>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Ethereum Mainnet
              </span>
              <span className="text-xs font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                4-Hop Peel Chain
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-3">
              <span className={isDark ? 'text-white' : 'text-zinc-900'}>Suspect Investigation:</span>
              <span className="font-mono text-cyan-400 font-medium text-lg sm:text-xl truncate max-w-[280px] sm:max-w-md">
                {targetAddress || '0x7A3c9e9b...91F2'}
              </span>
              <button
                onClick={() =>
                  handleCopyAddress(targetAddress || '0x7A3c9e9b384f912c0192837461abcef0192891F2')
                }
                className="text-zinc-500 hover:text-cyan-400 transition-colors"
                title="Copy Address"
              >
                {copiedAddress ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </h2>
          </div>

          {/* Action Buttons (Generate Report, Verify, Reset) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-mono shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Dossier</span>
            </button>

            <button
              onClick={handleTriggerCelebration}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                isDark
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-900'
              }`}
              title="Verify Evidence Chain"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <button
              onClick={onClearSession}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                isDark
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
              title="Close Case View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SECTION 6: ANOMALY DETECTION LIVE BANNER (Section 6) */}
        <div className="px-6 py-3 bg-gradient-to-r from-red-500/15 via-zinc-950/80 to-zinc-950/80 border-b border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-red-500/20 text-red-400">
                  ANOMALY DETECTED
                </span>
                <span className="text-xs font-bold text-zinc-200">
                  Automated Peel Velocity Spike (4.5x Baseline) & Mixer Evasion
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Amount: $25,400 USD • Deviation: +4.5 Std Dev • Severity: Critical • Confidence: 94%
              </p>
            </div>
          </div>

          <button
            onClick={() => handleFocusAnomaly('node-wallet-a', 1)}
            className="px-3 py-1 rounded-xl bg-red-500 hover:bg-red-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
          >
            <span>[VIEW EVENT]</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Forensic Telemetry Bar */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 divide-x border-b ${
            isDark
              ? 'bg-zinc-950/50 border-zinc-800/80 divide-zinc-800/80'
              : 'bg-zinc-50 border-zinc-200 divide-zinc-200'
          }`}
        >
          <div className="p-4 sm:p-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 font-mono">
              Composite Risk Score
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-red-400 mt-1 flex items-baseline gap-2">
              <span>{animatedScore} / 100</span>
              <span className="text-xs font-mono font-normal text-zinc-400">94% Conf.</span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 font-mono">
              Victim Fund Exposure
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 mt-1">
              $25,400.00
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 font-mono">
              Network Dispersion
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-purple-400 mt-1">
              4 Hops · 7 Nodes
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 font-mono">
              Primary Destination
            </div>
            <div className="text-lg sm:text-xl font-bold font-display text-emerald-400 mt-2 truncate">
              Tier-1 Off-Ramp
            </div>
          </div>
        </div>

        {/* SECTION 10: AI NEXT-BEST ACTION GOVERNANCE CARD (Section 10) */}
        <div className="px-6 py-4 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Compass className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI NEXT-BEST ACTION
                </span>
                <span className="text-xs font-bold text-zinc-200">
                  Issue Emergency Exchange Freeze on Recipient Deposit Wallet (0x28C6...8290)
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                <strong>Reason:</strong> 68.8% ($17,500) of victim funds terminated at Tier-1 KYC exchange endpoint.
                Confidence: <strong className="text-emerald-400">94%</strong> • Expected Investigative Value:{' '}
                <strong className="text-cyan-300">Asset Recovery Section 91 CrPC</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setNextActionStarted(true);
              onOpenReportModal();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs font-mono flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <span>{nextActionStarted ? 'Action In Progress' : 'START ACTION'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-zinc-800/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'graph', label: 'Interactive Live Graph', icon: Activity },
            { id: 'timemachine', label: 'Transaction Time Machine', icon: Clock },
            { id: 'flow', label: 'Fund Flow Stepper', icon: Layers },
            { id: 'risk', label: 'Risk Composition & Factors', icon: Shield },
            { id: 'evidence', label: 'Evidence Provenance', icon: FileText },
            { id: 'priority', label: 'Where to Look Next', icon: AlertTriangle },
            { id: 'copilot', label: 'AI Forensic Copilot', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                    : isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: INTERACTIVE LIVE FUND-FLOW GRAPH (Section 2 & 5) */}
          {activeTab === 'graph' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-lg font-display">
                    Multi-Hop Live Fund-Flow Network Canvas
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Particles travel along edges encoding direction, velocity, and amount magnitude. Click edge or node to isolate path.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-red-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Suspect / High Risk
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Intermediate
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Exchange Off-Ramp
                  </span>
                </div>
              </div>

              {/* Visual Graph Canvas Area */}
              <div
                className={`w-full rounded-2xl border p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                {/* Visual SVG Network Diagram with Animated Particle Flow */}
                <svg className="w-full h-84 max-w-4xl" viewBox="0 0 850 340">
                  <defs>
                    <linearGradient id="edgeGradCritical" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                    <linearGradient id="edgeGradNormal" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                    </linearGradient>

                    {/* Filter for particle glow */}
                    <filter id="particleGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Graph Edges with Animated Flow Pulses */}
                  <g className="edges">
                    {mockDefaultEdges.map((e) => {
                      const srcNode = mockDefaultNodes.find((n) => n.id === e.source);
                      const tgtNode = mockDefaultNodes.find((n) => n.id === e.target);
                      if (!srcNode || !tgtNode) return null;

                      const isSelectedEdge = selectedEdgeId === e.id;
                      const isDimmed =
                        selectedEdgeId !== null &&
                        !isSelectedEdge &&
                        selectedNode?.id !== e.source &&
                        selectedNode?.id !== e.target;

                      return (
                        <g
                          key={e.id}
                          onClick={() => setSelectedEdgeId(isSelectedEdge ? null : e.id)}
                          className="cursor-pointer transition-opacity duration-300"
                          opacity={isDimmed ? 0.2 : 1}
                        >
                          {/* Base line */}
                          <line
                            x1={srcNode.x}
                            y1={srcNode.y}
                            x2={tgtNode.x}
                            y2={tgtNode.y}
                            stroke={e.isCriticalPath ? 'url(#edgeGradCritical)' : 'url(#edgeGradNormal)'}
                            strokeWidth={isSelectedEdge ? 3.5 : e.isCriticalPath ? 2.5 : 1.5}
                            strokeDasharray={e.isCriticalPath ? '5 3' : undefined}
                          />

                          {/* Animated moving fund particle along edge (Section 2) */}
                          <circle r={e.isCriticalPath ? 3.5 : 2.5} fill="#06b6d4" filter="url(#particleGlow)">
                            <animateMotion
                              path={`M ${srcNode.x} ${srcNode.y} L ${tgtNode.x} ${tgtNode.y}`}
                              dur={e.isCriticalPath ? '1.8s' : '3s'}
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Midpoint Amount Label */}
                          <text
                            x={(srcNode.x! + tgtNode.x!) / 2}
                            y={(srcNode.y! + tgtNode.y!) / 2 - 8}
                            fill={isDark ? '#94a3b8' : '#475569'}
                            fontSize="10"
                            fontFamily="JetBrains Mono"
                            textAnchor="middle"
                          >
                            ${e.amountUsd.toLocaleString()}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Graph Nodes */}
                  <g className="nodes">
                    {mockDefaultNodes.map((n) => {
                      const isSelected = selectedNode?.id === n.id;
                      const isSuspect =
                        n.type === 'suspect' || n.type === 'high_risk' || n.type === 'mixer';
                      const isExchange = n.type === 'exchange';

                      let nodeColor = '#06b6d4'; // Cyan
                      if (isSuspect) nodeColor = '#ef4444'; // Red
                      if (isExchange) nodeColor = '#10b981'; // Emerald
                      if (n.type === 'victim') nodeColor = '#6366f1'; // Indigo

                      return (
                        <g
                          key={n.id}
                          onClick={() => {
                            setSelectedNode(n);
                            setSelectedEdgeId(null);
                          }}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          {/* Glow halo on selection */}
                          {isSelected && (
                            <circle
                              cx={n.x}
                              cy={n.y}
                              r="32"
                              fill={nodeColor}
                              opacity="0.25"
                              className="animate-ping"
                            />
                          )}

                          <circle
                            cx={n.x}
                            cy={n.y}
                            r={isSelected ? '24' : '20'}
                            fill={isDark ? '#09090b' : '#ffffff'}
                            stroke={nodeColor}
                            strokeWidth={isSelected ? '3' : '2'}
                          />

                          <text
                            cx={n.x}
                            y={n.y + 4}
                            fill={nodeColor}
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono"
                            textAnchor="middle"
                          >
                            {n.hop === 0 ? 'VIC' : n.hop === 4 ? 'EXC' : `H${n.hop}`}
                          </text>

                          {/* Node Subtitle Label */}
                          <text
                            x={n.x}
                            y={n.y! + 36}
                            fill={isDark ? '#f8fafc' : '#0f172a'}
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="Outfit"
                            textAnchor="middle"
                          >
                            {n.label}
                          </text>
                          <text
                            x={n.x}
                            y={n.y! + 48}
                            fill={isDark ? '#64748b' : '#64748b'}
                            fontSize="9"
                            fontFamily="JetBrains Mono"
                            textAnchor="middle"
                          >
                            {n.address}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* Node Inspector Floating Drawer */}
                {selectedNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
                      isDark
                        ? 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
                        : 'bg-white/95 border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 mb-2">
                      <span className="text-xs font-bold font-display uppercase tracking-wider text-cyan-400">
                        Node Inspector
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          selectedNode.riskScore > 75
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        Risk: {selectedNode.riskScore}/100
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Label:</span>
                        <span className="font-bold">{selectedNode.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Address:</span>
                        <span className="text-cyan-400">{selectedNode.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Hop Depth:</span>
                        <span>Hop {selectedNode.hop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Current Balance:</span>
                        <span className="text-emerald-400 font-bold">{selectedNode.balance}</span>
                      </div>
                      {selectedNode.entityName && (
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Entity:</span>
                          <span className="text-purple-400 font-bold">{selectedNode.entityName}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTION TIME MACHINE (Section 8) */}
          {activeTab === 'timemachine' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg font-display flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span>Transaction Time Machine (Forensic Replay)</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Chronologically reconstruct fund movement, peel transfers, and anomalies step-by-step.
                  </p>
                </div>

                {/* Replay Controls & Speed Toggle */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
                  <button
                    onClick={() => setReplayIndex(Math.max(0, replayIndex - 1))}
                    disabled={replayIndex === 0}
                    className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Step Backward"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlayingReplay(!isPlayingReplay)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isPlayingReplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlayingReplay ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setReplayIndex(Math.min(forensicReplaySequence.length - 1, replayIndex + 1))
                    }
                    disabled={replayIndex === forensicReplaySequence.length - 1}
                    className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Step Forward"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <span className="text-zinc-700 mx-1">|</span>

                  {/* Speed selector */}
                  {[0.5, 1, 2, 5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setReplaySpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        replaySpeed === spd
                          ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Machine Progress Scrubber */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Start: 10:14 UTC (Ingress)</span>
                  <span className="text-cyan-400 font-bold">
                    Step {currentReplayStep.stepIndex + 1} of {forensicReplaySequence.length}:{' '}
                    {currentReplayStep.timeLabel}
                  </span>
                  <span>End: 11:15 UTC (Off-Ramp)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={forensicReplaySequence.length - 1}
                  step="1"
                  value={replayIndex}
                  onChange={(e) => setReplayIndex(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Replay Synchronized Step Details Card */}
              <motion.div
                key={currentReplayStep.stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-zinc-950 border-cyan-900/40' : 'bg-zinc-50 border-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
                      Block #{currentReplayStep.blockNumber}
                    </span>
                    <h4 className="font-bold text-base text-zinc-100 font-display">
                      {currentReplayStep.stageTitle}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {currentReplayStep.utcTime}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {currentReplayStep.stageDescription}
                </p>

                {currentReplayStep.anomalyDetected && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-between text-xs font-mono text-red-300">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>
                        <strong>ANOMALY EVENT:</strong> {currentReplayStep.anomalyDetected.title}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                      {currentReplayStep.anomalyDetected.deviation}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>TX Hash: <strong className="text-zinc-200">{currentReplayStep.txHash.slice(0, 18)}...</strong></span>
                  <span>Transferred: <strong className="text-cyan-300">{currentReplayStep.amountCrypto} (${currentReplayStep.amountUsd.toLocaleString()})</strong></span>
                </div>
              </motion.div>
            </div>
          )}

          {/* TAB 3: STEPPED FUND FLOW (Section 2) */}
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-display mb-2">Stepped Fund Movement & Retained Value</h3>
              <div className="space-y-3">
                {mockFundFlow.map((step, idx) => (
                  <motion.div
                    key={step.stepIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs ${
                      isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                        {step.stepIndex}
                      </span>
                      <div>
                        <div className="font-bold font-sans text-sm text-zinc-100">{step.entity}</div>
                        <div className="text-zinc-500">{step.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-bold text-cyan-400">{step.amountUsd}</div>
                        <div className="text-zinc-500">
                          {step.amount} ({step.percentageRetained}%)
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-zinc-400">{step.timestamp}</div>
                        <div className="text-[10px] text-zinc-600 truncate max-w-[100px]">
                          {step.txHash}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LAYERED RISK BAROMETER (Section 7) */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Radial / Large Score Gauge */}
                <div
                  className={`w-full md:w-80 p-6 rounded-2xl border text-center flex flex-col items-center justify-center ${
                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    FORENSIC RISK ASSESSMENT
                  </div>
                  <div className="text-6xl font-extrabold font-display text-red-500 tracking-tight">
                    {animatedScore}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-red-400 mt-1">
                    {mockRiskData.level}
                  </div>
                  <div className="text-xs text-zinc-400 mt-3 max-w-xs leading-relaxed">
                    {mockRiskData.summary}
                  </div>
                </div>

                {/* Weighted Risk Factor Bars (Staggered Reveal Animation) */}
                <div className="flex-1 space-y-4 w-full">
                  <h4 className="font-bold text-sm font-display text-zinc-300">
                    EXPLAINABLE RISK FACTOR COMPOSITION (WHY FLAGGED)
                  </h4>
                  {mockRiskData.factors.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.12 }}
                      className={`p-4 rounded-xl border ${
                        isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-zinc-200">{f.name}</span>
                        <span className="text-red-400 font-mono font-bold">+{f.weight} pts</span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{f.description}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60 pt-2">
                        <span>
                          Provenance: <strong className="text-cyan-400">{f.provenance}</strong>
                        </span>
                        <span>Ref: {f.evidenceRef}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EVIDENCE PROVENANCE & CONNECTIVE TISSUE (Section 11) */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-display mb-2">
                Evidence Connective Tissue & Provenance Ledger
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEvidenceItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          item.type === 'FACT'
                            ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                            : item.type === 'REPORT'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            : item.type === 'INFERENCE'
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                            : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.confidence}% Verified</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-100">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>

                    <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                      <span>Source: {item.source}</span>
                      <span>{item.timestamp.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: WHERE SHOULD I LOOK NEXT */}
          {activeTab === 'priority' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-display mb-2">
                Investigation Priority — Next Investigative Targets
              </h3>
              <div className="space-y-4">
                {mockPriorityLeads.map((lead) => (
                  <div
                    key={lead.rank}
                    className={`p-6 rounded-2xl border space-y-3 ${
                      isDark ? 'bg-zinc-950 border-cyan-900/40' : 'bg-zinc-50 border-cyan-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold font-mono flex items-center justify-center">
                          #{lead.rank}
                        </span>
                        <div>
                          <div className="font-bold text-base text-zinc-100">{lead.target}</div>
                          <div className="text-xs font-mono text-cyan-400">{lead.address}</div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        {lead.severity}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                      <strong>Reason:</strong> {lead.reason}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono text-zinc-400">
                        Fund Exposure:{' '}
                        <strong className="text-cyan-400">
                          ${lead.fundExposureUsd.toLocaleString()}
                        </strong>
                      </span>
                      <button
                        onClick={() => handleAskCopilot(`How should I proceed with ${lead.target}?`)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Investigate Lead</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AI FORENSIC COPILOT */}
          {activeTab === 'copilot' && (
            <div className="space-y-6">
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {copilotResponses.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    {/* User Query */}
                    <div className="flex justify-end">
                      <div className="bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 px-4 py-2 rounded-2xl text-xs font-mono max-w-lg">
                        {item.q}
                      </div>
                    </div>
                    {/* Assistant Response */}
                    <div
                      className={`p-5 rounded-2xl border space-y-3 ${
                        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-800/60">
                        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                          <Brain className="w-3.5 h-3.5" /> FORENSIC COPILOT EVIDENCE SYNTHESIS
                        </span>
                        <span>{item.time}</span>
                      </div>
                      <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Copilot Input Box */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                <input
                  type="text"
                  value={customCopilotQuery}
                  onChange={(e) => setCustomCopilotQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskCopilot(customCopilotQuery);
                  }}
                  placeholder="Ask copilot: 'Where did the majority of funds go?', 'Explain risk breakdown'..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-cyan-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-cyan-500'
                  }`}
                />
                <button
                  onClick={() => handleAskCopilot(customCopilotQuery)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Preset Forensic Prompts */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'WHY IS THIS WALLET HIGH RISK?',
                  'WHERE DID THE FUNDS GO?',
                  'WHAT SHOULD I INVESTIGATE NEXT?',
                  'WHAT EVIDENCE SUPPORTS THIS SCORE?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleAskCopilot(prompt)}
                    className="px-3 py-1 rounded-lg bg-zinc-800/60 hover:bg-cyan-500/20 text-zinc-400 hover:text-cyan-300 text-[11px] font-mono border border-zinc-700/50 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
