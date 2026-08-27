import React from 'react';
import { Shield, ArrowUp, Activity, Lock, Github, ExternalLink } from 'lucide-react';
import { ThemeMode } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  theme: ThemeMode;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onNavigate }) => {
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t relative z-10 transition-colors ${
        isDark ? 'bg-zinc-950 border-zinc-850 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Col 1 & 2: Brand and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo theme={theme} onClick={scrollToTop} />
            <p className="text-xs leading-relaxed max-w-sm">
              From One Wallet to the Full Money Trail. Enterprise-grade blockchain forensics, multi-hop fund tracing, explainable risk scoring, and evidence-first cyber intelligence.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                ALL FORENSIC NODES OPERATIONAL
              </span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-200 mb-4">
              Forensic Suite
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('investigate')} className="hover:text-cyan-400 transition-colors">
                  Investigation Omnibar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Command Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('capabilities')} className="hover:text-cyan-400 transition-colors">
                  7-Stage Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('integrations')} className="hover:text-cyan-400 transition-colors">
                  Intel & SIEM Feeds
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Capabilities */}
          <div>
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-200 mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => onNavigate('playground')} className="hover:text-cyan-400 transition-colors">
                  Forensic Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('benchmarks')} className="hover:text-cyan-400 transition-colors">
                  Telemetry Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-cyan-400 transition-colors">
                  Methodology & FAQ
                </button>
              </li>
              <li>
                <a href="#investigate" className="hover:text-cyan-400 transition-colors">
                  EVM RPC Indexing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Compliance */}
          <div>
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-200 mb-4">
              Compliance
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero-Trust Provenance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic Scoring</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Law Enforcement Standard</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 CryptoTrace AI. Built for Smart India Hackathon (SIH) Forensics.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
