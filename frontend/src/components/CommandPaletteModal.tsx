import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Shield,
  Zap,
  Sliders,
  Cpu,
  Workflow,
  Gauge,
  Brain,
  X,
  ArrowRight,
  Sun,
  Moon,
  FolderOpen,
  Activity,
  FilePlus2,
  Download
} from 'lucide-react';
import { ThemeMode, ModelOption, OmnibarMode, BlockchainNetwork } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (sectionId: string) => void;
  onSelectModel: (model: ModelOption) => void;
  availableModels: ModelOption[];
  onTriggerInvestigation: (wallet: string, mode: OmnibarMode, chain: BlockchainNetwork) => void;
  onOpenIntakeWizard: () => void;
  onOpenReportModal: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onNavigate,
  onSelectModel,
  availableModels,
  onTriggerInvestigation,
  onOpenIntakeWizard,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'cmd-investigate',
      title: 'Go to Investigation Omnibar',
      category: 'Navigation',
      icon: Shield,
      action: () => {
        onNavigate('investigate');
        onClose();
      },
    },
    {
      id: 'cmd-dashboard',
      title: 'Open Investigation Command Center',
      category: 'Navigation',
      icon: Activity,
      action: () => {
        onNavigate('dashboard');
        onClose();
      },
    },
    {
      id: 'cmd-new-case',
      title: 'Start New Case Intake Wizard',
      category: 'Actions',
      icon: FilePlus2,
      action: () => {
        onClose();
        onOpenIntakeWizard();
      },
    },
    {
      id: 'cmd-dossier',
      title: 'Preview Forensic Intelligence Dossier',
      category: 'Actions',
      icon: Download,
      action: () => {
        onClose();
        onOpenReportModal();
      },
    },
    {
      id: 'cmd-trace-0184',
      title: 'Examine Case #CT-2026-0184 (Phishing Drainer 10 ETH)',
      category: 'Live Cases',
      icon: Zap,
      action: () => {
        onTriggerInvestigation('0x7A3c9e9b384f912c0192837461abcef0192891F2', 'trace', 'Ethereum');
        onClose();
      },
    },
    {
      id: 'cmd-trace-0183',
      title: 'Examine Case #CT-2026-0183 (Fake Yield Pool $84k)',
      category: 'Live Cases',
      icon: Zap,
      action: () => {
        onTriggerInvestigation('0x88f01b92837461abcef0192837461abcef01cc10', 'forensics', 'BNB Chain');
        onClose();
      },
    },
    {
      id: 'cmd-capabilities',
      title: 'View 7-Stage Pipeline & Forensics Architecture',
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        onNavigate('capabilities');
        onClose();
      },
    },
    {
      id: 'cmd-integrations',
      title: 'Manage Intelligence Feeds & SIEM Integrations',
      category: 'Navigation',
      icon: Workflow,
      action: () => {
        onNavigate('integrations');
        onClose();
      },
    },
    {
      id: 'cmd-playground',
      title: 'Open Forensics Parameter Sandbox',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        onNavigate('playground');
        onClose();
      },
    },
    {
      id: 'cmd-benchmarks',
      title: 'Inspect Forensics Performance Benchmarks',
      category: 'Navigation',
      icon: Gauge,
      action: () => {
        onNavigate('benchmarks');
        onClose();
      },
    },
    {
      id: 'cmd-toggle-theme',
      title: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
      category: 'Preferences',
      icon: isDark ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
  ];

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Palette Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden z-10 ${
          isDark
            ? 'bg-zinc-950/95 border-cyan-900/60 text-zinc-100 shadow-cyan-950/40'
            : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center gap-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a command, case ID, or section to navigate..."
            className="w-full bg-transparent border-none text-xs font-mono focus:outline-none placeholder:text-zinc-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left text-xs transition-colors ${
                  isDark
                    ? 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
                    : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold font-sans">{item.title}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{item.category}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            );
          })}

          {filteredActions.length === 0 && (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No matching commands or cases found for "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-900/40 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Navigate: <strong>↑ ↓</strong></span>
          <span>Select: <strong>↵</strong></span>
          <span>Close: <strong>ESC</strong></span>
        </div>
      </motion.div>
    </div>
  );
};
