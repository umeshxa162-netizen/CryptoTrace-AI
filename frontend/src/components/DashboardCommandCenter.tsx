import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  Shield,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Radio,
  Download,
  Eye,
  SlidersHorizontal,
  Bell,
  Layers,
  FolderOpen
} from 'lucide-react';
import {
  ThemeMode,
  CaseFile,
  RiskLevel,
  IntelligenceAlert,
  BlockchainNetwork
} from '../types';
import { mockCaseQueue } from '../data/mockInvestigationData';
import { AlertFeedPanel } from './AlertFeedPanel';
import { AlertIntelligenceService } from '../services/alertIntelligenceService';

interface DashboardCommandCenterProps {
  theme: ThemeMode;
  onSelectCase: (caseItem: CaseFile) => void;
  onStartNewCase: () => void;
  onSelectAlert?: (alert: IntelligenceAlert) => void;
  onInvestigateTarget?: (target: string, chain: BlockchainNetwork) => void;
  onOpenWatchlistModal?: () => void;
  onOpenRulesModal?: () => void;
  activeSubTab?: 'cases' | 'alerts';
}

export const DashboardCommandCenter: React.FC<DashboardCommandCenterProps> = ({
  theme,
  onSelectCase,
  onStartNewCase,
  onSelectAlert,
  onInvestigateTarget,
  onOpenWatchlistModal,
  onOpenRulesModal,
  activeSubTab = 'cases',
}) => {
  const [currentTab, setCurrentTab] = useState<'cases' | 'alerts'>(activeSubTab);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [casesList, setCasesList] = useState<CaseFile[]>(mockCaseQueue);
  const [unreviewedAlertsCount, setUnreviewedAlertsCount] = useState(0);

  const isDark = theme === 'dark';

  useEffect(() => {
    setCurrentTab(activeSubTab);
  }, [activeSubTab]);

  useEffect(() => {
    const updateCount = () => {
      setUnreviewedAlertsCount(AlertIntelligenceService.getUnacknowledgedCount());
    };
    updateCount();
    const unsub = AlertIntelligenceService.subscribe(updateCount);
    return () => unsub();
  }, []);

  const handlePromoteAlertToCase = (alert: IntelligenceAlert) => {
    const newCaseId = `CT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const promotedCase: CaseFile = {
      id: newCaseId,
      title: `${alert.triggerLabel} (${alert.chain})`,
      victimAddress: alert.evidence.counterpartyAddress || '0x38923a10...4b19',
      suspectAddress: alert.walletAddress,
      chain: alert.chain,
      totalLossUsd: alert.amountUsd,
      currentRisk: alert.severity,
      status: 'ACTIVE_INVESTIGATION',
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      lastActivity: 'Just now',
      assignedOfficer: 'Forensic Alert Triage',
    };

    setCasesList((prev) => [promotedCase, ...prev]);
    AlertIntelligenceService.promoteAlertToCase(alert.id, newCaseId);
    setCurrentTab('cases');
  };

  const filteredCases = casesList.filter((c) => {
    const matchesRisk = filterRisk === 'ALL' || c.currentRisk === filterRisk;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.suspectAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Dashboard Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3 border ${
              isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Forensic Operations Hub</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            <span className={isDark ? 'text-white' : 'text-zinc-950'}>INVESTIGATION </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              COMMAND CENTER
            </span>
          </motion.h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time surveillance triage & multi-hop fraud investigation dossiers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Main Hub Tabs */}
          <div className="flex items-center p-1 rounded-2xl border border-zinc-800 bg-zinc-900/80">
            <button
              onClick={() => setCurrentTab('cases')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === 'cases'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Active Cases ({casesList.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('alerts')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === 'alerts'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Alerts</span>
              {unreviewedAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-bold">
                  {unreviewedAlertsCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onStartNewCase}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold font-mono shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>+ New Intake</span>
          </button>
        </div>
      </div>

      {/* RENDER ALERTS TAB */}
      {currentTab === 'alerts' ? (
        <AlertFeedPanel
          theme={theme}
          onSelectAlert={onSelectAlert || (() => {})}
          onInvestigateTarget={onInvestigateTarget || (() => {})}
          onOpenWatchlistModal={onOpenWatchlistModal || (() => {})}
          onOpenRulesModal={onOpenRulesModal || (() => {})}
          onPromoteToCase={handlePromoteAlertToCase}
        />
      ) : (
        /* RENDER CASES QUEUE TAB */
        <>
          {/* 1. High Priority Urgent Alert Strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-zinc-900/90 to-zinc-900/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shadow-lg shadow-red-950/20"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/40 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                    CRITICAL ALERT
                  </span>
                  <span className="text-xs font-mono text-zinc-400">Active Peel-Chain Detected · Case #CT-2026-0184</span>
                </div>
                <div className="text-sm font-bold text-zinc-100 mt-1">
                  $25,400 routed into High-Risk Aggregator C (0x10B4...88EE). Immediate off-ramp freeze advised.
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectCase(casesList[0])}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 shrink-0 transition-colors shadow-md cursor-pointer"
            >
              <span>Triage Case</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* 2. Grid Overview (Risk Barometer + Real-time Fund Movement + Threat Signal Feed) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Risk Distribution Barometer (Span 4) */}
            <div
              className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Severity Barometer
                </span>
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>

              {/* Barometer Segments */}
              <div className="space-y-3 my-2">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-red-400 font-bold">Critical Severity (Score &gt; 85)</span>
                    <span className="font-bold">4 Cases</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold">High Severity (Score 65–85)</span>
                    <span className="font-bold">5 Cases</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-cyan-400 font-bold">Medium Severity (Score 40–64)</span>
                    <span className="font-bold">3 Cases</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Total Value at Risk: <strong className="text-cyan-400">$269,000 USD</strong></span>
              </div>
            </div>

            {/* Real-time Fund Movement Ticker (Span 4) */}
            <div
              className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Live Fund Flow Ticker
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="space-y-2.5 font-mono text-xs my-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-cyan-400 truncate max-w-[120px]">0x7A3c...91F2</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-zinc-300">Splitter A</span>
                  <span className="text-emerald-400 font-bold">+7.16 ETH</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-cyan-400 truncate max-w-[120px]">0x99D1...E204</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-zinc-300">Aggregator C</span>
                  <span className="text-emerald-400 font-bold">+6.88 ETH</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-cyan-400 truncate max-w-[120px]">0x44F0...11AA</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-red-400">Mixer Pool</span>
                  <span className="text-red-400 font-bold">+2.71 ETH</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Flow Rate: <strong className="text-emerald-400">3.4 tx/min</strong></span>
                <span>Network: Ethereum Mainnet</span>
              </div>
            </div>

            {/* Live Threat Intelligence Signal Feed (Span 4) */}
            <div
              className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Threat Intelligence Signal Log
                </span>
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>

              <div className="space-y-2.5 text-xs font-mono my-2">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="text-purple-400 font-bold">CHAINABUSE MATCH</span>
                    <span>2m ago</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] line-clamp-1">
                    14 new reports matching address 0x7A3c...91F2
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="text-cyan-400 font-bold">EXCHANGE KYC MATCH</span>
                    <span>12m ago</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] line-clamp-1">
                    Deposit endpoint identified on Tier-1 KYC exchange
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Sources: <strong>Chainabuse + ScamSniffer</strong></span>
              </div>
            </div>
          </div>

          {/* 3. Dense Investigation Queue Table */}
          <div
            className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-xl' : 'bg-white border-zinc-200 shadow-lg'
            }`}
          >
            {/* Table Filter & Search Controls */}
            <div className="p-5 border-b border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase text-zinc-400">Filter Risk:</span>
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      filterRisk === r
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : isDark
                        ? 'text-zinc-400 hover:bg-zinc-800'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search case ID, wallet, title..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                  }`}
                />
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead
                  className={`border-b ${
                    isDark ? 'border-zinc-800 bg-zinc-950/60 text-zinc-400' : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                  }`}
                >
                  <tr>
                    <th className="p-4 font-semibold">Case ID</th>
                    <th className="p-4 font-semibold">Incident / Case Title</th>
                    <th className="p-4 font-semibold">Suspect Ingress Wallet</th>
                    <th className="p-4 font-semibold">Blockchain</th>
                    <th className="p-4 font-semibold">Loss Exposure</th>
                    <th className="p-4 font-semibold">Risk Level</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {filteredCases.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCase(c)}
                      className={`transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-cyan-500/5' : 'hover:bg-cyan-50/50'
                      }`}
                    >
                      <td className="p-4 font-bold text-cyan-400">{c.id}</td>
                      <td className="p-4 font-sans font-medium text-zinc-200">{c.title}</td>
                      <td className="p-4 text-zinc-400 truncate max-w-[140px]">{c.suspectAddress}</td>
                      <td className="p-4 text-zinc-300">{c.chain}</td>
                      <td className="p-4 font-bold text-zinc-100">${c.totalLossUsd.toLocaleString()}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded font-bold text-[10px] border ${
                            c.currentRisk === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : c.currentRisk === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                          }`}
                        >
                          {c.currentRisk}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">{c.status.replace('_', ' ')}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Examine</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
