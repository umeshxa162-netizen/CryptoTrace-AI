import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Search,
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Activity,
  Layers,
  Fingerprint,
  Radio,
  FileCheck,
  Globe,
  Lock,
  Wallet,
  Target,
  ShieldCheck,
  Eye,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { ThemeMode, OmnibarMode, AttachedFile, ModelOption, BlockchainNetwork } from '../types';
import { HeroIsometricVisual } from './HeroIsometricVisual';

interface HeroLandingViewProps {
  theme: ThemeMode;
  selectedModel: ModelOption;
  onSubmitPrompt: (
    prompt: string,
    mode: OmnibarMode,
    isThinking: boolean,
    attachments: AttachedFile[],
    selectedChain: BlockchainNetwork
  ) => void;
  onQuickStart: (sampleWallet: string, mode: OmnibarMode, chain: BlockchainNetwork) => void;
  onOpenIntakeWizard: () => void;
  onOpenAlerts?: () => void;
  onOpenReportModal?: () => void;
}

export const HeroLandingView: React.FC<HeroLandingViewProps> = ({
  theme,
  selectedModel,
  onSubmitPrompt,
  onQuickStart,
  onOpenIntakeWizard,
  onOpenAlerts,
  onOpenReportModal,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'wallet' | 'tx' | 'entity' | 'block'>('wallet');
  const [targetInput, setTargetInput] = useState('');
  const [useDemoData, setUseDemoData] = useState(true);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  const inputPanelRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === 'dark';

  const handleStartInvestigation = () => {
    if (inputPanelRef.current) {
      inputPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAnalyzeNow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = targetInput.trim() || '0x7A3c9e9b384f912c0192837461abcef0192891F2';
    const mode: OmnibarMode =
      activeInputTab === 'tx'
        ? 'trace'
        : activeInputTab === 'entity'
        ? 'forensics'
        : 'trace';
    onSubmitPrompt(target, mode, true, [], 'Ethereum');
  };

  // 5 Powerful Feature Cards
  const featureCards = [
    {
      id: 'ai-investigation',
      title: 'AI Investigation',
      desc: 'Intelligent insights & automated analysis',
      icon: Target,
      mode: 'copilot' as OmnibarMode,
    },
    {
      id: 'tx-tracing',
      title: 'Transaction Tracing',
      desc: 'Multi-hop tracing & flow analysis',
      icon: Activity,
      mode: 'trace' as OmnibarMode,
    },
    {
      id: 'anomaly-detection',
      title: 'Anomaly Detection',
      desc: 'Detect suspicious patterns instantly',
      icon: AlertTriangle,
      mode: 'forensics' as OmnibarMode,
    },
    {
      id: 'network-intelligence',
      title: 'Network Intelligence',
      desc: 'Visualize complex relationships',
      icon: Layers,
      mode: 'intelligence' as OmnibarMode,
    },
    {
      id: 'report-generation',
      title: 'Report Generation',
      desc: 'Professional forensic reports & evidence',
      icon: FileText,
      mode: 'evidence' as OmnibarMode,
    },
  ];

  // 4 Capability Strip Items
  const capabilityStrip = [
    {
      title: 'Real-time Data',
      desc: 'Live blockchain access',
      icon: Radio,
    },
    {
      title: 'AI Intelligence',
      desc: 'Advanced ML models',
      icon: Zap,
    },
    {
      title: 'Cross-Chain',
      desc: 'Multi-chain support',
      icon: Globe,
    },
    {
      title: 'Secure & Private',
      desc: 'Enterprise-grade security',
      icon: Lock,
    },
  ];

  return (
    <section id="investigate" className="pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col gap-10 overflow-hidden">
      {/* ======================================================== */}
      {/* 1. TWO-COLUMN HERO SECTION (Exact Reference Recreation) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: Badge, Heading, Subtitle, Metrics, Buttons, Capability */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-xl ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950/40'
                : 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wide">
              AI-Powered Blockchain Forensic Intelligence
            </span>
          </motion.div>

          {/* Main Hero Heading */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]"
            >
              <span className={isDark ? 'text-white' : 'text-zinc-950'}>
                Trace. Analyze.
              </span>
              <br />
              <span className={isDark ? 'text-white' : 'text-zinc-950'}>
                Uncover the{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                Truth.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                isDark ? 'text-zinc-400 font-sans' : 'text-zinc-600 font-sans'
              }`}
            >
              CryptoTrace-AI empowers investigators with advanced AI, real-time blockchain
              analytics, and intelligent insights to trace transactions, detect anomalies,
              and build solid evidence.
            </motion.p>
          </div>

          {/* 3 Compact Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl"
          >
            {/* Metric 1: Wallets Analyzed */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold font-display text-base sm:text-lg text-zinc-100">
                  2.4M+
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate">
                  Wallets Analyzed
                </div>
              </div>
            </div>

            {/* Metric 2: Transactions Processed */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold font-display text-base sm:text-lg text-zinc-100">
                  12.8M+
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate">
                  Transactions Processed
                </div>
              </div>
            </div>

            {/* Metric 3: AI Detection Accuracy */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold font-display text-base sm:text-lg text-zinc-100">
                  98.7%
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate">
                  AI Detection Accuracy
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="flex items-center gap-4 flex-wrap pt-1"
          >
            {/* Primary CTA Button */}
            <motion.button
              onClick={handleStartInvestigation}
              whileHover={{ scale: 1.03, y: -1.5 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-zinc-950 font-bold font-display text-sm tracking-wide shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Secondary Button */}
            <button
              onClick={() => onQuickStart('0x7A3c9e9b384f912c0192837461abcef0192891F2', 'trace', 'Ethereum')}
              className={`px-5 py-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isDark
                  ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:border-zinc-400'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>See How It Works</span>
            </button>
          </motion.div>

          {/* Capability Strip (4 items) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-4 border-t border-zinc-800/60 text-left font-mono"
          >
            {capabilityStrip.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-200 font-sans">{item.title}</div>
                    <div className="text-[10px] text-zinc-400 font-sans">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Animated 3D Isometric Blockchain Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-6 w-full flex items-center justify-center"
        >
          <HeroIsometricVisual
            theme={theme}
            onCardClick={(type) => {
              handleStartInvestigation();
            }}
          />
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* 2. TWO-PANEL SECTION: POWERFUL FEATURES & START INVESTIGATION */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT PANEL: Powerful Features (Span 7) */}
        <div
          className={`lg:col-span-7 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
            isDark ? 'bg-zinc-900/70 border-zinc-800/90 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg font-display text-zinc-100">Powerful Features</h3>
              <button
                onClick={handleStartInvestigation}
                className="text-xs font-mono text-zinc-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* 5 Feature Cards Grid / Horizontal Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {featureCards.map((feat, idx) => {
                const Icon = feat.icon;
                const isSelected = activeFeatureIdx === idx;
                return (
                  <motion.button
                    key={feat.id}
                    onClick={() => {
                      setActiveFeatureIdx(idx);
                      onQuickStart('0x7A3c9e9b384f912c0192837461abcef0192891F2', feat.mode, 'Ethereum');
                    }}
                    whileHover={{ y: -3 }}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-start space-y-2.5 transition-all cursor-pointer min-h-[140px] ${
                      isSelected
                        ? isDark
                          ? 'bg-zinc-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                          : 'bg-cyan-50 border-cyan-300'
                        : isDark
                        ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-zinc-100 font-sans leading-tight">
                        {feat.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-sans mt-1 leading-snug line-clamp-2">
                        {feat.desc}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Carousel / Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-6">
            {featureCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFeatureIdx(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeFeatureIdx === idx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Start Your Investigation (Span 5) */}
        <div
          ref={inputPanelRef}
          className={`lg:col-span-5 p-6 sm:p-7 rounded-3xl border flex flex-col justify-between relative overflow-hidden ${
            isDark ? 'bg-zinc-900/70 border-zinc-800/90 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-md'
          }`}
        >
          <div>
            {/* Header + Demo Data Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg font-display text-zinc-100">
                Start Your Investigation
              </h3>

              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span className="text-[11px]">Demo Data</span>
                <button
                  type="button"
                  onClick={() => setUseDemoData(!useDemoData)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    useDemoData ? 'bg-cyan-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      useDemoData ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 4 Segmented Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-zinc-950/80 border border-zinc-800 mb-4 text-xs font-mono font-medium">
              {[
                { id: 'wallet', label: 'Wallet Address' },
                { id: 'tx', label: 'Transaction Hash' },
                { id: 'entity', label: 'Entity / VASP' },
                { id: 'block', label: 'Block / Token' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInputTab(tab.id as any)}
                  className={`py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    activeInputTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Field with Scan Icon */}
            <form onSubmit={handleAnalyzeNow} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder={
                    activeInputTab === 'wallet'
                      ? 'Enter wallet address (0x...)'
                      : activeInputTab === 'tx'
                      ? 'Enter transaction hash (0x...)'
                      : activeInputTab === 'entity'
                      ? 'Enter VASP or entity name (e.g. Tornado, Binance)'
                      : 'Enter block number or token address'
                  }
                  className={`w-full pl-4 pr-10 py-3 rounded-2xl border font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-400 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setTargetInput('0x7A3c9e9b384f912c0192837461abcef0192891F2')
                  }
                  className="absolute right-3 top-3 text-zinc-400 hover:text-cyan-400"
                  title="Paste demo target"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Full-width Analyze Now CTA */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold font-display text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Analyze Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>

          {/* Subtext */}
          <div className="flex items-center justify-center gap-2 pt-4 text-[11px] font-mono text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-center truncate">
              We support 20+ blockchains including Bitcoin, Ethereum, BNB Chain, Polygon & more
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM LIVE ACTIVITY FEED (Exact Reference Recreation) */}
      {/* ======================================================== */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs ${
          isDark ? 'bg-zinc-900/80 border-zinc-800/90 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-md'
        }`}
      >
        {/* Left Status Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div>
            <div className="font-bold text-zinc-100 text-xs">Live Feed</div>
            <div className="text-[10px] text-zinc-400">Real-time blockchain monitoring</div>
          </div>
        </div>

        {/* Ticker Badges */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {/* Badge 1: BTC */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shrink-0">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">
              ₿
            </span>
            <div>
              <span className="text-zinc-300 font-bold text-[11px]">Large Transaction</span>
              <div className="text-[10px] text-zinc-400">3.25 BTC • 2 mins ago</div>
            </div>
          </div>

          {/* Badge 2: ETH */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shrink-0">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
              Ξ
            </span>
            <div>
              <span className="text-zinc-300 font-bold text-[11px]">ETH Transfer</span>
              <div className="text-[10px] text-zinc-400">12.8 ETH • 3 mins ago</div>
            </div>
          </div>

          {/* Badge 3: Mixer Suspicious */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shrink-0">
            <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">
              ⚠
            </span>
            <div>
              <span className="text-zinc-300 font-bold text-[11px]">Suspicious Activity</span>
              <div className="text-[10px] text-red-400 font-bold">High Risk • 5 mins ago</div>
            </div>
          </div>

          {/* Badge 4: BNB */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 shrink-0">
            <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
              BNB
            </span>
            <div>
              <span className="text-zinc-300 font-bold text-[11px]">BNB Transfer</span>
              <div className="text-[10px] text-zinc-400">25.6 BNB • 7 mins ago</div>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <button
          onClick={onOpenAlerts}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono text-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>View All Alerts</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </section>
  );
};
