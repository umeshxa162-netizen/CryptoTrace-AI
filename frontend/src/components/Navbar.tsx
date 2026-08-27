import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Layers,
  Cpu,
  Workflow,
  Zap,
  Gauge,
  Sliders,
  Check,
  ArrowRight,
  ShieldCheck,
  Radio,
  FilePlus2,
  Terminal,
  Activity,
  FolderOpen
} from 'lucide-react';
import { ThemeMode, ModelOption } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCommandPalette: () => void;
  onOpenIntakeWizard: () => void;
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  availableModels: ModelOption[];
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  activeSection,
  onNavigate,
  onOpenCommandPalette,
  onOpenIntakeWizard,
  selectedModel,
  onSelectModel,
  availableModels,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Case #CT-2026-0184');

  const isDark = theme === 'dark';

  const workspaces = [
    { name: 'Case #CT-2026-0184', tier: 'Active Peel Trace' },
    { name: 'National Cyber Cell Hub', tier: 'Law Enforcement' },
    { name: 'Demo Synthetic Sandbox', tier: 'SIH Evaluation' },
  ];

  const navLinks = [
    { id: 'investigate', label: 'Investigate', icon: Shield },
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'capabilities', label: 'Methodology', icon: Cpu },
    { id: 'integrations', label: 'Intel Feeds', icon: Workflow },
    { id: 'playground', label: 'Sandbox', icon: Sliders },
    { id: 'benchmarks', label: 'Telemetry', icon: Gauge },
  ];

  // Track scroll state for glassmorphic styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <motion.header
      id="main-navigation"
      initial={{ y: -60, opacity: 0, filter: 'blur(10px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? isDark
            ? 'bg-zinc-950/85 backdrop-blur-2xl backdrop-saturate-150 border-b border-cyan-950/50 shadow-2xl shadow-black/70 py-2.5 sm:py-3'
            : 'bg-white/90 backdrop-blur-2xl backdrop-saturate-150 border-b border-zinc-200/90 shadow-xl shadow-zinc-200/40 py-2.5 sm:py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      {/* Top subtle ambient beam line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Case/Workspace Switcher */}
        <div className="flex items-center gap-3 md:gap-4">
          <Logo
            theme={theme}
            scrolled={scrolled}
            onClick={() => onNavigate('investigate')}
          />

          {/* Case Switcher Pill */}
          <div className="relative hidden xl:block">
            <button
              id="workspace-switcher-button"
              onClick={() => {
                setWorkspaceDropdownOpen(!workspaceDropdownOpen);
                setModelDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                isDark
                  ? 'bg-zinc-900/70 border-zinc-800/90 text-cyan-400 hover:border-cyan-500/40 hover:bg-zinc-800/80 shadow-inner'
                  : 'bg-zinc-100/90 border-zinc-200 text-cyan-800 hover:border-cyan-300 hover:bg-zinc-200/80 shadow-sm'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[140px]">{selectedWorkspace}</span>
              <ChevronDown
                className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
                  workspaceDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {workspaceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className={`absolute left-0 mt-2 w-64 rounded-2xl border p-1.5 shadow-2xl z-50 ${
                    isDark
                      ? 'bg-zinc-900/95 backdrop-blur-2xl border-zinc-800 text-zinc-200 shadow-black/80'
                      : 'bg-white/95 backdrop-blur-2xl border-zinc-200 text-zinc-800 shadow-xl'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5">
                    Investigative Workspaces
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.name}
                      onClick={() => {
                        setSelectedWorkspace(ws.name);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        selectedWorkspace === ws.name
                          ? isDark
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                            : 'bg-cyan-50 text-cyan-700 font-semibold'
                          : isDark
                          ? 'hover:bg-zinc-800/80 text-zinc-300'
                          : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">
                        {ws.tier}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full p-1.5 border transition-all glass-panel">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;

            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                onMouseEnter={() => setHoveredNav(link.id)}
                onMouseLeave={() => setHoveredNav(null)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'text-cyan-300 font-semibold'
                      : 'text-cyan-900 font-semibold'
                    : isDark
                    ? 'text-zinc-400 hover:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className={`absolute inset-0 rounded-full ${
                      isDark
                        ? 'bg-cyan-500/20 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                        : 'bg-cyan-100/80 border border-cyan-300/60 shadow-sm'
                    }`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Start Case, Model, Command Palette, Theme, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Start Investigation CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenIntakeWizard}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Start Investigation</span>
          </motion.button>

          {/* Model Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setModelDropdownOpen(!modelDropdownOpen);
                setWorkspaceDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isDark
                  ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-zinc-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[110px]">{selectedModel.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            <AnimatePresence>
              {modelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className={`absolute right-0 mt-2 w-72 rounded-2xl border p-2 shadow-2xl z-50 ${
                    isDark
                      ? 'bg-zinc-900/95 backdrop-blur-2xl border-zinc-800 text-zinc-200 shadow-black/80'
                      : 'bg-white/95 backdrop-blur-2xl border-zinc-200 text-zinc-800 shadow-xl'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5">
                    Forensics Reasoning Model
                  </div>
                  {availableModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModel(m);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-colors mb-1 ${
                        selectedModel.id === m.id
                          ? isDark
                            ? 'bg-cyan-500/15 border border-cyan-500/30'
                            : 'bg-cyan-50 border border-cyan-200'
                          : isDark
                          ? 'hover:bg-zinc-800/80'
                          : 'hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{m.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">
                          {m.speed}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                        {m.description}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title="Open Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-mono text-zinc-500">⌘K</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-amber-400 hover:bg-zinc-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
            }`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b px-4 py-6 space-y-4 ${
              isDark ? 'bg-zinc-950/98 border-zinc-800 text-zinc-200' : 'bg-white/98 border-zinc-200 text-zinc-800'
            }`}
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 text-sm font-medium"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenIntakeWizard();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>Start New Investigation</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
