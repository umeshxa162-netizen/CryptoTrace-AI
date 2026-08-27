import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Workflow,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Activity,
  Terminal,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThemeMode, IntegrationSource } from '../types';
import { mockIntegrations } from '../data/mockInvestigationData';

interface IntegrationsShowcaseProps {
  theme: ThemeMode;
  onSelectIntegrationPrompt: (appName: string, samplePrompt: string) => void;
}

export const IntegrationsShowcase: React.FC<IntegrationsShowcaseProps> = ({
  theme,
  onSelectIntegrationPrompt,
}) => {
  const isDark = theme === 'dark';
  const [sources, setSources] = useState<IntegrationSource[]>(mockIntegrations);

  const toggleConnection = (id: string) => {
    setSources((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const nextState = !app.connected;
          if (nextState) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          }
          return { ...app, connected: nextState };
        }
        return app;
      })
    );
  };

  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border ${
            isDark ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Unified Intelligence Feeds</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
        >
          <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>Integrated Forensic </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">
            Ecosystem
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
        >
          Seamlessly bridge on-chain RPC indexers, crowdsourced threat databases, SIEM pipelines, and law enforcement emergency dispatch.
        </motion.p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
              isDark
                ? 'bg-zinc-900/80 backdrop-blur-xl border-zinc-800 hover:border-cyan-500/40 shadow-xl'
                : 'bg-white border-zinc-200 hover:border-cyan-300 shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                  {app.category}
                </span>
                <button
                  onClick={() => toggleConnection(app.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 border transition-all ${
                    app.connected
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : isDark
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${app.connected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <span>{app.connected ? 'Active' : 'Connect'}</span>
                </button>
              </div>

              <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {app.name}
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {app.description}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
              <button
                onClick={() => onSelectIntegrationPrompt(app.name, app.sampleAction)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
              >
                <span>{app.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
