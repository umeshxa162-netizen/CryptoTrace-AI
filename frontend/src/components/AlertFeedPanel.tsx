import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  Shield,
  Eye,
  Sliders,
  Play,
  Pause,
  Zap,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Star,
  Link2,
  FolderPlus,
  RefreshCw,
  Info,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import {
  ThemeMode,
  IntelligenceAlert,
  RiskLevel,
  MonitoredEventType,
  BlockchainNetwork,
  AlertStatus
} from '../types';
import { AlertIntelligenceService } from '../services/alertIntelligenceService';

interface AlertFeedPanelProps {
  theme: ThemeMode;
  onSelectAlert: (alert: IntelligenceAlert) => void;
  onInvestigateTarget: (target: string, chain: BlockchainNetwork) => void;
  onOpenWatchlistModal: () => void;
  onOpenRulesModal: () => void;
  onPromoteToCase?: (alert: IntelligenceAlert) => void;
}

export const AlertFeedPanel: React.FC<AlertFeedPanelProps> = ({
  theme,
  onSelectAlert,
  onInvestigateTarget,
  onOpenWatchlistModal,
  onOpenRulesModal,
  onPromoteToCase,
}) => {
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('active'); // active | all | acknowledged | dismissed
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);

  const isDark = theme === 'dark';

  const reloadAlerts = () => {
    setAlerts(AlertIntelligenceService.getAlerts());
  };

  useEffect(() => {
    reloadAlerts();
    const unsubscribe = AlertIntelligenceService.subscribe(() => {
      reloadAlerts();
    });
    return () => unsubscribe();
  }, []);

  // Periodic simulated live event streamer (every 35 seconds when streaming is active)
  useEffect(() => {
    let interval: number;
    if (isStreaming) {
      interval = window.setInterval(() => {
        AlertIntelligenceService.triggerSimulatedLiveEvent();
      }, 35000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleManualTrigger = () => {
    const alert = AlertIntelligenceService.triggerSimulatedLiveEvent();
    onSelectAlert(alert);
  };

  const handleAcknowledge = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    AlertIntelligenceService.acknowledgeAlert(id);
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    AlertIntelligenceService.dismissAlert(id);
  };

  // Filtering Logic
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesWatchlist = !watchlistOnly || alert.isWatchlistLinked;
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = alert.status === 'new';
    else if (statusFilter === 'acknowledged') matchesStatus = alert.status === 'acknowledged';
    else if (statusFilter === 'dismissed') matchesStatus = alert.status === 'dismissed';

    const matchesSearch =
      alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.triggerLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.linkedCaseId && alert.linkedCaseId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSeverity && matchesWatchlist && matchesStatus && matchesSearch;
  });

  const unackCount = alerts.filter((a) => a.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* 1. TOP SURVEILLANCE INSTRUMENT BAR */}
      <div
        className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            {isStreaming && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                REAL-TIME WATCHLIST & ALERT INTELLIGENCE
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                {unackCount} Unreviewed
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Continuous monitoring across 10 event types with multi-factor priority ranking.
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isStreaming
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isStreaming ? 'Stream Active' : 'Stream Paused'}</span>
          </button>

          <button
            onClick={handleManualTrigger}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inject an on-chain event trigger simulation"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Emit Test Trigger</span>
          </button>

          <button
            onClick={onOpenWatchlistModal}
            className="px-3.5 py-1.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Watchlist Manager</span>
          </button>

          <button
            onClick={onOpenRulesModal}
            className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Configure Monitored Event Rules"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TRUST & INTEGRITY PERSISTENT NOTICE BANNER */}
      <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>INTEGRITY SAFEGUARD:</strong> Alert feed is running in{' '}
            <strong className="text-amber-200">[SIMULATED DEMO STREAM]</strong> mode for SIH evaluation.
            All synthetic events are explicitly tagged.
          </span>
        </div>
        <span className="text-[10px] text-zinc-400 hidden lg:inline">SIH 2026 Compliant</span>
      </div>

      {/* 3. FILTER & SEARCH CONTROL BAR */}
      <div
        className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
        }`}
      >
        {/* Left: Severity & Watchlist filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase text-zinc-500">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : isDark
                  ? 'text-zinc-400 hover:bg-zinc-800'
                  : 'text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {sev}
            </button>
          ))}

          <span className="text-zinc-700 mx-1">|</span>

          {/* Watchlist only toggle */}
          <button
            onClick={() => setWatchlistOnly(!watchlistOnly)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1 cursor-pointer ${
              watchlistOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Star className={`w-3 h-3 ${watchlistOnly ? 'fill-amber-300' : ''}`} />
            <span>Watchlist Targets Only</span>
          </button>
        </div>

        {/* Right: Status filter & Search Input */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono">
            {['active', 'acknowledged', 'all'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors ${
                  statusFilter === st
                    ? 'text-cyan-400 font-bold underline underline-offset-4'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert, wallet, case..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono border focus:outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4. PRIORITIZED REAL-TIME ALERT FEED CARDS */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              onClick={() => onSelectAlert(alert)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                alert.status === 'new'
                  ? isDark
                    ? isCritical
                      ? 'bg-gradient-to-r from-red-950/20 via-zinc-900/90 to-zinc-900/90 border-red-500/40 hover:border-red-400 shadow-lg shadow-red-950/10'
                      : isHigh
                      ? 'bg-gradient-to-r from-amber-950/20 via-zinc-900/90 to-zinc-900/90 border-amber-500/40 hover:border-amber-400'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-cyan-500/40'
                    : 'bg-white border-zinc-200 hover:border-cyan-300 shadow-sm'
                  : 'opacity-65 bg-zinc-950/40 border-zinc-900'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Block: Priority Score Dial + Meta */}
                <div className="flex items-start gap-3.5">
                  {/* Priority Score Circle Indicator */}
                  <div
                    className={`w-12 h-12 rounded-2xl shrink-0 flex flex-col items-center justify-center border font-mono ${
                      alert.priorityScore >= 80
                        ? 'bg-red-500/15 border-red-500/40 text-red-400'
                        : alert.priorityScore >= 60
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                    }`}
                    title={`AI Priority Score: ${alert.priorityScore}/100. Ranked by investigative signal.`}
                  >
                    <span className="text-sm font-extrabold font-display leading-none">
                      {alert.priorityScore}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-zinc-500 leading-none mt-0.5">
                      RANK
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                          isCritical
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        }`}
                      >
                        {alert.severity}
                      </span>

                      <span className="text-xs font-mono font-bold text-zinc-400">{alert.id}</span>
                      <span className="text-xs font-mono text-zinc-500">•</span>
                      <span className="text-xs font-mono text-zinc-400">{alert.timestamp}</span>

                      {/* Watchlist badge */}
                      {alert.isWatchlistLinked && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          Watchlist Target
                          {alert.linkedCaseId && ` (#${alert.linkedCaseId})`}
                        </span>
                      )}

                      {alert.isHighPriority && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          High Priority
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-zinc-100 font-sans flex items-center gap-2">
                      <span>{alert.triggerLabel}</span>
                      <span className="text-xs font-mono text-cyan-400 font-normal">
                        ({alert.chain})
                      </span>
                    </h4>

                    <p className="text-xs text-zinc-300 font-sans line-clamp-1 max-w-2xl">
                      {alert.explanation}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-500">
                      <span>Target: <strong className="text-zinc-300">{alert.walletAddress.slice(0, 10)}...</strong></span>
                      <span>•</span>
                      <span>Confidence: <strong className="text-emerald-400">{alert.confidence}%</strong></span>
                      <span>•</span>
                      <span className="text-indigo-300">{alert.priorityBreakdown.reasoning.split('•')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Right Block: Amount & Quick Actions */}
                <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800/60">
                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-cyan-400">
                      ${alert.amountUsd.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] text-zinc-500">{alert.amountCrypto}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInvestigateTarget(alert.walletAddress, alert.chain);
                      }}
                      className="px-3 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-mono font-bold text-xs flex items-center gap-1 border border-cyan-500/30 transition-colors"
                      title="Launch Forensic Investigation Workspace"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {alert.status === 'new' ? (
                      <button
                        onClick={(e) => handleAcknowledge(e, alert.id)}
                        className="p-1.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                        title="Mark as Acknowledged / Reviewed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                        {alert.status}
                      </span>
                    )}

                    <button
                      onClick={(e) => handleDismiss(e, alert.id)}
                      className="p-1.5 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      title="Dismiss from active feed"
                    >
                      <span className="text-xs font-mono">✕</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center text-xs font-mono text-zinc-500 border border-dashed border-zinc-800 rounded-3xl space-y-2">
            <div>No alerts matching current filters.</div>
            <button
              onClick={() => {
                setSeverityFilter('ALL');
                setWatchlistOnly(false);
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-cyan-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
