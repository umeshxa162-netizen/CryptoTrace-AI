import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
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
  Lock
} from 'lucide-react';
import { ThemeMode, OmnibarMode, AttachedFile, ModelOption, BlockchainNetwork } from '../types';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chainMenuRef = useRef<HTMLDivElement | null>(null);

  const isDark = theme === 'dark';

  // Smooth mouse-following spotlight coordinates
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 20 });

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
    if (!promptText.trim() && attachedFiles.length === 0) return;

    onSubmitPrompt(promptText, activeMode, isThinkingActive, attachedFiles, selectedChain);
    setPromptText('');
    setAttachedFiles([]);
    if (isVoiceRecording) setIsVoiceRecording(false);
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

  return (
    <section
      id="investigate"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden"
    >
      {/* Background Radial Glow mapped to cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 spotlight-glow"
        style={
          {
            '--mouse-x': `${mousePos.x}%`,
            '--mouse-y': `${mousePos.y}%`,
          } as React.CSSProperties
        }
      />

      {/* Top Status Strip: System Instrument Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-xs font-mono mb-8 border backdrop-blur-xl ${
          isDark
            ? 'bg-zinc-900/80 border-cyan-900/50 text-cyan-400 shadow-lg shadow-cyan-950/40'
            : 'bg-white/90 border-cyan-200 text-cyan-800 shadow-md'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>SYSTEM OPERATIONAL</span>
        </span>
        <span className="text-zinc-600">|</span>
        <span className="flex items-center gap-1.5 text-zinc-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>EVM RPC CONNECTED</span>
        </span>
        <span className="text-zinc-600 hidden sm:inline">|</span>
        <span className="hidden sm:flex items-center gap-1.5 text-zinc-400">
          <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
          <span>INTELLIGENCE ONLINE</span>
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
      >
        <span className={isDark ? 'text-white' : 'text-zinc-950'}>
          TRACE THE MONEY.{' '}
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
          EXPOSE THE NETWORK.
        </span>
      </motion.h1>

      {/* Subcopy */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className={`text-base sm:text-lg max-w-2xl mb-10 ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}
      >
        Turn a single victim-reported cryptocurrency wallet into an evidence-backed
        blockchain investigation trail. Built for law enforcement and SIH forensics.
      </motion.p>

      {/* Signature Smart Forensic Omnibar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl relative z-20"
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
          className={`rounded-3xl border p-3 sm:p-4 shadow-2xl transition-all duration-300 relative ${
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
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
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
            <div className="flex items-center justify-between pt-2 px-1 border-t border-zinc-800/50">
              {/* Left Utilities (Chain Picker, Evidence Upload, Voice Simulation, Thinking Toggle) */}
              <div className="flex items-center gap-2">
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
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
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
                  className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 ${
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
                  className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-all ${
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
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
              className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{item.label}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400">
                {item.badge}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
