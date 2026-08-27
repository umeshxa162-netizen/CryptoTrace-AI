import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Brain,
  Layers,
  Activity,
  Star,
  Link2,
  FileText,
  Copy,
  Check,
  Zap,
  FolderPlus,
  Radio,
  Clock,
  ArrowRight,
  TrendingUp,
  Fingerprint
} from 'lucide-react';
import { ThemeMode, IntelligenceAlert, BlockchainNetwork } from '../types';
import { AlertIntelligenceService } from '../services/alertIntelligenceService';

interface AlertDetailModalProps {
  alert: IntelligenceAlert | null;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onInvestigateTarget: (target: string, chain: BlockchainNetwork) => void;
  onPromoteToCase?: (alert: IntelligenceAlert) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  isOpen,
  onClose,
  theme,
  onInvestigateTarget,
  onPromoteToCase,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'evidence' | 'graph'>('breakdown');
  const isDark = theme === 'dark';

  if (!isOpen || !alert) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcknowledge = () => {
    AlertIntelligenceService.acknowledgeAlert(alert.id);
  };

  const handleDismiss = () => {
    AlertIntelligenceService.dismissAlert(alert.id);
    onClose();
  };

  const { priorityBreakdown } = alert;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col z-10 ${
          isDark
            ? 'bg-zinc-950 border-cyan-900/60 text-zinc-100 shadow-cyan-950/40'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm border ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : alert.severity === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  }`}
                >
                  {alert.severity} SEVERITY
                </span>
                <span className="text-xs font-mono text-zinc-400">{alert.id}</span>
                <span className="text-xs font-mono text-zinc-500">•</span>
                <span className="text-xs font-mono text-zinc-400">{alert.timestamp}</span>

                {/* TRUST & INTEGRITY SAFEGUARD BADGE */}
                {alert.isSimulated ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    [SIMULATED ALERT]
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    [LIVE ON-CHAIN RPC]
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg font-display text-zinc-100 mt-1">
                {alert.triggerLabel}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onInvestigateTarget(alert.walletAddress, alert.chain);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold font-mono shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Full Investigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Watchlist Linkage Banner if applicable */}
        {alert.isWatchlistLinked && (
          <div className="px-6 py-2.5 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-transparent border-b border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300">
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">WATCHLIST MATCH:</span>
              <span>This alert references a monitored target</span>
              {alert.linkedCaseId && (
                <span className="px-2 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                  Case #{alert.linkedCaseId}
                </span>
              )}
              {alert.isHighPriority && (
                <span className="px-2 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  High Priority
                </span>
              )}
            </div>
            <span className="text-zinc-400 hidden sm:inline">+45 Pts Ranking Boost Applied</span>
          </div>
        )}

        {/* Core Stats Bar */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 divide-x border-b ${
            isDark
              ? 'bg-zinc-950/60 border-zinc-800/80 divide-zinc-800/80'
              : 'bg-zinc-50 border-zinc-200 divide-zinc-200'
          }`}
        >
          <div className="p-4">
            <div className="text-[10px] font-mono font-bold uppercase text-zinc-500">
              AI Priority Score
            </div>
            <div className="text-2xl font-extrabold font-display text-red-400 mt-1 flex items-baseline gap-2">
              <span>{alert.priorityScore} / 100</span>
              <span className="text-xs font-mono font-normal text-zinc-400">
                {alert.confidence}% Conf.
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="text-[10px] font-mono font-bold uppercase text-zinc-500">
              Value Exposure
            </div>
            <div className="text-2xl font-extrabold font-display text-cyan-400 mt-1">
              ${alert.amountUsd.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-zinc-400">{alert.amountCrypto}</div>
          </div>

          <div className="p-4">
            <div className="text-[10px] font-mono font-bold uppercase text-zinc-500">
              Network Chain
            </div>
            <div className="text-lg font-bold font-display text-zinc-200 mt-1">
              {alert.chain}
              {alert.destinationChain && ` → ${alert.destinationChain}`}
            </div>
          </div>

          <div className="p-4">
            <div className="text-[10px] font-mono font-bold uppercase text-zinc-500">
              Alert Status
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-2 uppercase">
              {alert.status.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-zinc-800/60">
          {[
            { id: 'breakdown', label: 'Why This Rank? (Scoring Transparency)', icon: Brain },
            { id: 'evidence', label: 'Supporting Evidence & Hops', icon: FileText },
            { id: 'graph', label: 'Mini Topology Visualizer', icon: Activity },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 text-cyan-300 font-bold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WHY THIS RANK? EXPLAINABILITY BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              {/* Natural language summary box */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-cyan-900/40' : 'bg-cyan-50 border-cyan-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider mb-1.5">
                  <Brain className="w-4 h-4" />
                  <span>AI Triage Decision Explanation</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {alert.explanation}
                </p>
                <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
                  <strong>Scoring Summary:</strong> {priorityBreakdown.reasoning}
                </div>
              </div>

              {/* Multi-factor Score Breakdown Bars */}
              <div>
                <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4">
                  Multi-Factor Priority Score Formulation (0–100)
                </h4>

                <div className="space-y-3.5 text-xs font-mono">
                  {/* Factor 1: Trigger Severity Weight */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-300">
                        1. Trigger Severity Inherent Weight ({alert.triggerLabel})
                      </span>
                      <span className="font-bold text-cyan-400">
                        +{priorityBreakdown.triggerWeight} / 30 pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${(priorityBreakdown.triggerWeight / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 2: Model Confidence */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-300">
                        2. Model & Rule Confidence Score ({alert.confidence}%)
                      </span>
                      <span className="font-bold text-indigo-400">
                        +{priorityBreakdown.confidenceWeight} / 20 pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{ width: `${(priorityBreakdown.confidenceWeight / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 3: Watchlist Linkage Boost */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-300">
                        3. Watchlist Linkage (High-Priority / Active Case Flag)
                      </span>
                      <span className="font-bold text-amber-400">
                        +{priorityBreakdown.watchlistBoost} / 45 pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${(priorityBreakdown.watchlistBoost / 45) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 4: Known Entity / Sanctions Match */}
                  {priorityBreakdown.knownEntityBoost > 0 && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-red-400 font-bold">
                          4. Direct Sanctions / Known Bad Actor Match
                        </span>
                        <span className="font-bold text-red-400">
                          +{priorityBreakdown.knownEntityBoost} pts (Maximum Critical Boost)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full w-full" />
                      </div>
                    </div>
                  )}

                  {/* Factor 5: Log-Scaled Amount */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-300">
                        5. Log-Scaled Fund Amount (${alert.amountUsd.toLocaleString()})
                      </span>
                      <span className="font-bold text-emerald-400">
                        +{priorityBreakdown.amountLogScaled} / 20 pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${(priorityBreakdown.amountLogScaled / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 6: Recency Boost */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-300">6. Event Recency & Freshness</span>
                      <span className="font-bold text-purple-400">
                        +{priorityBreakdown.recencyBoost} / 10 pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${(priorityBreakdown.recencyBoost / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE INSPECTOR */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Cryptographic Evidence & Baseline Logs
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">
                    Target Wallet Address
                  </div>
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="truncate max-w-md">{alert.walletAddress}</span>
                    <button
                      onClick={() => handleCopy(alert.walletAddress)}
                      className="text-zinc-500 hover:text-cyan-400 ml-2"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">
                    Triggering Transaction Hash
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="truncate max-w-md">{alert.txHash}</span>
                    <button
                      onClick={() => handleCopy(alert.txHash)}
                      className="text-zinc-500 hover:text-cyan-400 ml-2"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {alert.evidence.counterpartyAddress && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold">
                      Counterparty Entity ({alert.evidence.counterpartyLabel || 'Identified Node'})
                    </div>
                    <div className="text-purple-400 truncate">
                      {alert.evidence.counterpartyAddress}
                    </div>
                  </div>
                )}

                {/* Facts List */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">
                    Observed On-Chain Facts
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-300 font-sans text-xs">
                    {alert.evidence.facts.map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MINI TOPOLOGY GRAPH */}
          {activeTab === 'graph' && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Live Alert Transaction Topology
              </h4>

              <div
                className={`p-6 rounded-2xl border flex flex-col items-center justify-center min-h-[260px] ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-center gap-6 text-xs font-mono w-full max-w-lg">
                  {/* Origin */}
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-1">
                    <div className="text-[10px] text-zinc-500">Origin Node</div>
                    <div className="font-bold text-cyan-300">
                      {alert.walletAddress.slice(0, 8)}...
                    </div>
                    <div className="text-[10px] text-zinc-400">{alert.chain}</div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className="text-[10px] font-bold text-red-400">
                      ${alert.amountUsd.toLocaleString()}
                    </div>
                    <div className="w-24 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 relative">
                      <div className="absolute right-0 top-[-3px] w-2 h-2 border-t-2 border-r-2 border-red-500 rotate-45" />
                    </div>
                    <div className="text-[9px] text-zinc-500">{alert.triggerLabel}</div>
                  </div>

                  {/* Destination */}
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-1">
                    <div className="text-[10px] text-zinc-500">Counterparty Target</div>
                    <div className="font-bold text-red-300">
                      {alert.evidence.counterpartyAddress?.slice(0, 8) || '0x28C6...'}...
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {alert.evidence.counterpartyLabel || 'Flagged Endpoint'}
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      onClose();
                      onInvestigateTarget(alert.walletAddress, alert.chain);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Launch Full Multi-Hop Canvas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAcknowledge}
              disabled={alert.status === 'acknowledged'}
              className="px-3.5 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{alert.status === 'acknowledged' ? 'Acknowledged' : 'Mark Reviewed'}</span>
            </button>

            {onPromoteToCase && (
              <button
                onClick={() => {
                  onPromoteToCase(alert);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-mono text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add to Investigation Case</span>
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="px-3.5 py-2 rounded-xl hover:bg-zinc-800 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            SHA256 Evidence Stamp: <strong>0x9B4F...82A1</strong>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
