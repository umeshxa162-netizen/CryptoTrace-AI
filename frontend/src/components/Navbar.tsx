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
  FolderOpen,
  Eye,
  Bell,
  Home,
  Brain,
  FileText,
  AlertTriangle,
  UserCheck
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
  onOpenWatchlist?: () => void;
  onOpenAlerts?: () => void;
  onOpenReportModal?: () => void;
  unacknowledgedAlertsCount?: number;
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
  onOpenWatchlist,
  onOpenAlerts,
  onOpenReportModal,
  unacknowledgedAlertsCount = 0,
  selectedModel,
  onSelectModel,
  availableModels,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const navLinks = [
    { id: 'investigate', label: 'Home', icon: Home, action: () => onNavigate('investigate') },
    { id: 'start-investigation', label: 'Investigation', icon: Shield, action: () => onNavigate('investigate') },
    { id: 'dashboard', label: 'Cases', icon: FolderOpen, action: () => onNavigate('dashboard') },
    { id: 'capabilities', label: 'Network', icon: Activity, action: () => onNavigate('capabilities') },
    { id: 'copilot', label: 'AI Copilot', icon: Brain, action: () => onOpenCommandPalette() },
    { id: 'reports', label: 'Reports', icon: FileText, action: () => (onOpenReportModal ? onOpenReportModal() : onNavigate('investigate')) },
    { id: 'alerts', label: 'Alerts', icon: Bell, action: () => (onOpenAlerts ? onOpenAlerts() : onNavigate('dashboard')) },
    { id: 'watchlist', label: 'Watchlist', icon: Eye, action: () => (onOpenWatchlist ? onOpenWatchlist() : onNavigate('dashboard')) },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 shadow-2xl shadow-black/80 py-2.5 sm:py-3'
            : 'bg-white/95 backdrop-blur-2xl border-b border-zinc-200/90 shadow-xl shadow-zinc-200/40 py-2.5 sm:py-3'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      {/* Top subtle ambient beam line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo
            theme={theme}
            scrolled={scrolled}
            onClick={() => onNavigate('investigate')}
          />
        </div>

        {/* Center: Desktop Navigation Links (From Reference Image) */}
        <nav className="hidden xl:flex items-center gap-1 rounded-full p-1 border transition-all glass-panel">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id || (link.id === 'investigate' && activeSection === 'investigate');

            return (
              <button
                key={link.id}
                onClick={link.action}
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

        {/* Right: Actions (Theme, Notification Bell, Investigator Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Real-time Alert Notification Bell */}
          <button
            onClick={onOpenAlerts}
            className={`relative p-2 rounded-xl border text-xs font-medium transition-all ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-cyan-300'
            }`}
            title="Real-Time Alerts Feed"
          >
            <Bell className="w-4 h-4" />
            {unacknowledgedAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white font-mono text-[9px] font-bold border border-zinc-950 animate-pulse">
                {unacknowledgedAlertsCount}
              </span>
            )}
          </button>

          {/* Investigator Profile Badge (From Reference Image) */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-mono font-medium transition-colors ${
                isDark
                  ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:border-zinc-400'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-[11px] leading-tight">Investigator</div>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 ${
                    isDark
                      ? 'bg-zinc-900/95 border-zinc-800 text-zinc-200'
                      : 'bg-white border-zinc-200 text-zinc-800'
                  }`}
                >
                  <div className="p-2 border-b border-zinc-800 text-xs">
                    <div className="font-bold text-zinc-100">Special Agent Cyber Cell</div>
                    <div className="text-[10px] text-cyan-400">ID #IN-88910-SIH</div>
                  </div>

                  <div className="p-1 space-y-1 text-xs font-mono">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenIntakeWizard();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <FilePlus2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>New Investigation Intake</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onOpenWatchlist) onOpenWatchlist();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Monitored Watchlists</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
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
            className={`xl:hidden border-b px-4 py-6 space-y-3 ${
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
                      link.action();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/50 text-xs font-mono font-medium"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
