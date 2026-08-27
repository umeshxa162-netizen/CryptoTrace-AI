import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import {
  Shield,
  ArrowUp,
  Brain,
  Mic,
  FolderOpen,
  Globe,
  Search,
  Sparkles,
  Paperclip,
  X,
  FileText,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Play,
  Zap,
  Terminal,
  Activity,
  Layers,
  Fingerprint,
  Sliders,
  Radio,
  FileCode,
  Lock,
  Workflow,
  TrendingUp,
  GitFork,
  Cpu,
  FileCheck,
  Compass
} from 'lucide-react';
import { ThemeMode, OmnibarMode, AttachedFile, ModelOption, BlockchainNetwork } from '../types';
import { BlockchainInvestigationVisual } from './BlockchainInvestigationVisual';

interface HeroOmnibarProps {
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
}

export const HeroOmnibar: React.FC<HeroOmnibarProps> = ({
  theme,
  selectedModel,
  onSubmitPrompt,
  onQuickStart,
  onOpenIntakeWizard,
}) => {
  const [promptText, setPromptText] = useState('');
  const [activeMode, setActiveMode] = useState<OmnibarMode>('trace');
  const [selectedChain, setSelectedChain] = useState<BlockchainNetwork>('Ethereum');
  const [isThinkingActive, setIsThinkingActive] = useState(true);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [chainMenuOpen, setChainMenuOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([4, 8, 14, 20, 16, 10, 6]);

  const heroRef = useRef<HTMLElement | null>(null);
  const omnibarCardRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chainMenuRef = useRef<HTMLDivElement | null>(null);

  const isDark = theme === 'dark';

  // Smooth mouse-following spotlight coordinates
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
    setMousePos({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  // Dynamic audio wave simulation when recording
  useEffect(() => {
    let interval: number;
    if (isVoiceRecording) {
      interval = window.setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 18 + 4),
          Math.floor(Math.random() * 24 + 6),
          Math.floor(Math.random() * 28 + 8),
          Math.floor(Math.random() * 22 + 6),
          Math.floor(Math.random() * 26 + 8),
          Math.floor(Math.random() * 16 + 4),
          Math.floor(Math.random() * 12 + 4),
        ]);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chainMenuRef.current && !chainMenuRef.current.contains(event.target as Node)) {
        setChainMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: AttachedFile[] = (Array.from(files) as File[]).map((file: File) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'document',
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim() && attachedFiles.length === 0) {
      // Default to standard suspect if empty
      onSubmitPrompt('0x7A3c9e9b384f912c0192837461abcef0192891F2', activeMode, isThinkingActive, attachedFiles, selectedChain);
      return;
    }

    onSubmitPrompt(promptText, activeMode, isThinkingActive, attachedFiles, selectedChain);
    setPromptText('');
    setAttachedFiles([]);
    if (isVoiceRecording) setIsVoiceRecording(false);
  };

  const handleStartInvestigationClick = () => {
    // Focus or scroll to Omnibar
    if (omnibarCardRef.current) {
      omnibarCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      textareaRef.current?.focus();
    }
  };

  const sampleWallets = [
    {
      label: 'Phishing Drainer (10.0 ETH Loss)',
      address: '0x7A3c9e9b384f912c0192837461abcef0192891F2',
      chain: 'Ethereum' as BlockchainNetwork,
      mode: 'trace' as OmnibarMode,
      badge: 'Critical Risk',
    },
    {
      label: 'Fake Yield Pool Exploit ($84k)',
      address: '0x88f01b92837461abcef0192837461abcef01cc10',
      chain: 'BNB Chain' as BlockchainNetwork,
      mode: 'forensics' as OmnibarMode,
      badge: 'High Velocity',
    },
    {
      label: 'Bridge Liquidity Siphon ($142k)',
      address: '0x11223344556677889900aabbccddeeff00112233',
      chain: 'Arbitrum' as BlockchainNetwork,
      mode: 'evidence' as OmnibarMode,
      badge: 'Multi-Hop',
    },
  ];

  const chains: BlockchainNetwork[] = [
    'Ethereum',
    'Bitcoin',
    'BNB Chain',
    'Polygon',
    'Arbitrum',
    'Solana',
    'Tron',
  ];

  // Minimal Capability Strip Items (Section 6)
  const capabilityStrip = [
    { label: 'AI FORENSICS', icon: Brain },
    { label: 'NETWORK INTELLIGENCE', icon: Layers },
    { label: 'ANOMALY DETECTION', icon: Activity },
    { label: 'CROSS-CHAIN ANALYSIS', icon: Workflow },
    { label: 'EVIDENCE REPORTING', icon: FileCheck },
  ];

  return (
    <section
      id="investigate"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col overflow-hidden"
    >
      {/* Background Radial Spotlight mapped to cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 spotlight-glow"
        style={
          {
            '--mouse-x': `${mousePos.x}%`,
            '--mouse-y': `${mousePos.y}%`,
          } as React.CSSProperties
        }
      />

      {/* ================================================== */}
      {/* 1. TWO-COLUMN HERO SECTION (Desktop) / STACKED (Mobile) */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-12">
        {/* LEFT COLUMN: Logo intro, Hero Typography, Dominant CTA, Capability Strip */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Status Instrument Chip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full text-xs font-mono border backdrop-blur-xl ${
              isDark
                ? 'bg-zinc-900/80 border-cyan-900/50 text-cyan-400 shadow-md shadow-cyan-950/40'
                : 'bg-white/90 border-cyan-200 text-cyan-800 shadow-sm'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold">SYSTEM OPERATIONAL</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">EVM RPC CONNECTED</span>
          </motion.div>

          {/* Hero Titles */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]"
            >
              <span className={isDark ? 'text-white' : 'text-zinc-950'}>CRYPTO </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                TRACE-AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-lg sm:text-xl font-bold font-display text-cyan-300 tracking-wide"
            >
              AI-Powered Blockchain Forensic Intelligence
            </motion.h2>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                isDark ? 'text-zinc-300 font-sans' : 'text-zinc-700 font-sans'
              }`}
            >
              Trace transactions. Discover hidden relationships. Detect anomalies. Build evidence. Generate forensic reports.
            </motion.p>
          </div>

          {/* PRIMARY DOMINANT CTA & SECONDARY ACTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="flex items-center gap-3.5 flex-wrap pt-2"
          >
            {/* ONE DOMINANT CTA: START INVESTIGATION */}
            <motion.button
              onClick={handleStartInvestigationClick}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold font-display text-sm tracking-wide shadow-xl shadow-cyan-500/30 flex items-center gap-2.5 transition-all cursor-pointer border border-cyan-400/40"
              aria-label="Start Blockchain Investigation"
            >
              <span>START INVESTIGATION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </motion.button>

            {/* SECONDARY ACTION */}
            <button
              onClick={() => onQuickStart('0x7A3c9e9b384f912c0192837461abcef0192891F2', 'trace', 'Ethereum')}
              className={`px-5 py-3.5 rounded-2xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isDark
                  ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-zinc-800'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-cyan-400 hover:text-cyan-900'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore Demo Trace (10 ETH)</span>
            </button>
          </motion.div>

          {/* 6. MINIMAL CAPABILITY STRIP (Section 6) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full pt-4 border-t border-zinc-800/60"
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11px] font-mono text-zinc-400">
              {capabilityStrip.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/30 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: SOPHISTICATED ANIMATED VISUALIZATION (Section 3) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full"
        >
          <BlockchainInvestigationVisual
            theme={theme}
            onSelectNode={(nodeLabel) => {
              handleStartInvestigationClick();
            }}
          />
        </motion.div>
      </div>

      {/* ================================================== */}
      {/* 2. SIGNATURE SMART FORENSIC OMNIBAR WORKSPACE AREA */}
      {/* ================================================== */}
      <motion.div
        ref={omnibarCardRef}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.45 }}
        className="w-full max-w-4xl mx-auto relative z-20 mt-4"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              const files = Array.from(e.dataTransfer.files).map((f) => ({
                id: Math.random().toString(36).substring(2, 9),
                name: f.name,
                size: `${(f.size / 1024).toFixed(1)} KB`,
                type: f.type,
              }));
              setAttachedFiles((prev) => [...prev, ...files]);
            }
          }}
          className={`rounded-3xl border p-4 sm:p-5 shadow-2xl transition-all duration-300 relative ${
            isDark
              ? 'bg-zinc-900/90 border-cyan-900/60 backdrop-blur-2xl shadow-cyan-950/30 hover:border-cyan-500/50'
              : 'bg-white/95 border-zinc-300 backdrop-blur-2xl shadow-xl hover:border-cyan-400'
          } ${isDragging ? 'ring-2 ring-cyan-400 border-cyan-400' : ''}`}
        >
          {/* Mode Selector Chips */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-zinc-800/60 overflow-x-auto no-scrollbar">
            {[
              { id: 'trace', label: 'Wallet Trace', icon: Shield },
              { id: 'forensics', label: 'Cluster Forensics', icon: Activity },
              { id: 'intelligence', label: 'Threat Intel', icon: Fingerprint },
              { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
              { id: 'evidence', label: 'Evidence Chain', icon: FileText },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id as OmnibarMode)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      : isDark
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Omnibar Input Area */}
          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="pt-2 pl-2">
                <Search className="w-4 h-4 text-cyan-400" />
              </div>
              <textarea
                ref={textareaRef}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={2}
                placeholder={
                  activeMode === 'trace'
                    ? 'Enter suspect EVM wallet address (0x...) or transaction hash to trace fund trail...'
                    : activeMode === 'forensics'
                    ? 'Paste suspect cluster or examine peel chain patterns across counterparties...'
                    : activeMode === 'intelligence'
                    ? 'Query scam records, sanctions matches, or reported phishing dApps...'
                    : activeMode === 'copilot'
                    ? 'Ask the forensic copilot: "Why was this wallet flagged as critical risk?"'
                    : 'Audit cryptographic facts, reported victim complaints, and inferred cluster risks...'
                }
                className={`w-full bg-transparent border-none resize-none focus:outline-none font-mono text-xs sm:text-sm p-1 leading-relaxed ${
                  isDark ? 'text-zinc-100 placeholder:text-zinc-500' : 'text-zinc-900 placeholder:text-zinc-400'
                }`}
              />
            </div>

            {/* Attached Evidence Chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-2 py-1">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300"
                  >
                    <Paperclip className="w-3 h-3 text-cyan-400" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.id)}
                      className="hover:text-red-400 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between pt-2 px-1 border-t border-zinc-800/50 flex-wrap gap-2">
              {/* Left Utilities (Chain Picker, Evidence Upload, Voice Simulation, Thinking Toggle) */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Blockchain Selector */}
                <div className="relative" ref={chainMenuRef}>
                  <button
                    type="button"
                    onClick={() => setChainMenuOpen(!chainMenuOpen)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      isDark
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-cyan-500/40'
                        : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-cyan-400'
                    }`}
                  >
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span>{selectedChain}</span>
                  </button>

                  <AnimatePresence>
                    {chainMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className={`absolute left-0 bottom-8 mb-1 w-44 rounded-2xl border p-1 shadow-2xl z-50 ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                            : 'bg-white border-zinc-200 text-zinc-800'
                        }`}
                      >
                        {chains.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setSelectedChain(c);
                              setChainMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left ${
                              selectedChain === c
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                                : isDark
                                ? 'hover:bg-zinc-800'
                                : 'hover:bg-zinc-100'
                            }`}
                          >
                            <span>{c}</span>
                            {selectedChain === c && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Evidence File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-cyan-300'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-cyan-700'
                  }`}
                  title="Attach Evidence / Transaction Logs"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>

                {/* Simulated Audio Frequency Input */}
                <button
                  type="button"
                  onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                  className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isVoiceRecording
                      ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                      : isDark
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-cyan-300'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-cyan-700'
                  }`}
                  title="Live Investigator Audio Brief"
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isVoiceRecording && (
                    <div className="flex items-center gap-0.5">
                      {audioLevel.map((lvl, idx) => (
                        <span
                          key={idx}
                          className="w-0.5 bg-red-400 rounded-full"
                          style={{ height: `${lvl}px` }}
                        />
                      ))}
                    </div>
                  )}
                </button>

                {/* Deep Forensic Reasoning Toggle */}
                <button
                  type="button"
                  onClick={() => setIsThinkingActive(!isThinkingActive)}
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    isThinkingActive
                      ? isDark
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                        : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : isDark
                      ? 'bg-zinc-800/80 border-zinc-700 text-zinc-500'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-500'
                  }`}
                  title="Toggle Multi-Hop Recursive Reasoning Engine"
                >
                  <Brain className="w-3 h-3" />
                  <span>Deep Reasoning</span>
                </button>
              </div>

              {/* Submit CTA Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-display shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Run Forensics</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </form>
        </div>

        {/* Quick Start Suspect Wallet Shortcut Badges */}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs">
          <span className="text-zinc-500 text-[11px] font-mono">Demo Suspects:</span>
          {sampleWallets.map((item) => (
            <button
              key={item.address}
              onClick={() => onQuickStart(item.address, item.mode, item.chain)}
              className={`px-3 py-1 rounded-xl border text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{item.label}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                {item.badge}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
