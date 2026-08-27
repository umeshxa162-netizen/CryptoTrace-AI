import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Eye,
  Plus,
  Trash2,
  Search,
  Shield,
  Star,
  Link2,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Tag,
  Clock,
  Zap,
  Globe
} from 'lucide-react';
import { ThemeMode, WatchlistItem, WatchlistType, BlockchainNetwork } from '../types';
import { WatchlistService } from '../services/watchlistService';

interface WatchlistManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onInvestigateTarget: (target: string, chain: BlockchainNetwork) => void;
}

export const WatchlistManagerModal: React.FC<WatchlistManagerModalProps> = ({
  isOpen,
  onClose,
  theme,
  onInvestigateTarget,
}) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newType, setNewType] = useState<WatchlistType>('Wallet');
  const [newTarget, setNewTarget] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newChain, setNewChain] = useState<BlockchainNetwork>('Ethereum');
  const [newIsCaseLinked, setNewIsCaseLinked] = useState(true);
  const [newLinkedCaseId, setNewLinkedCaseId] = useState('CT-2026-0184');
  const [newIsHighPriority, setNewIsHighPriority] = useState(true);
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('Drainer, High-Risk');

  const isDark = theme === 'dark';

  const loadItems = () => {
    setItems(WatchlistService.getWatchlist());
  };

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim() || !newLabel.trim()) return;

    WatchlistService.addWatchlistItem({
      type: newType,
      target: newTarget.trim(),
      label: newLabel.trim(),
      chain: newChain,
      isCaseLinked: newIsCaseLinked,
      linkedCaseId: newIsCaseLinked ? newLinkedCaseId.trim() : undefined,
      isHighPriority: newIsHighPriority,
      notes: newNotes.trim() || undefined,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    loadItems();
    setShowAddForm(false);
    setNewTarget('');
    setNewLabel('');
    setNewNotes('');
  };

  const handleDeleteItem = (id: string) => {
    WatchlistService.removeWatchlistItem(id);
    loadItems();
  };

  const handleResetDefaults = () => {
    WatchlistService.resetToDefaults();
    loadItems();
  };

  const chains: BlockchainNetwork[] = [
    'Ethereum',
    'Bitcoin',
    'BNB Chain',
    'Polygon',
    'Arbitrum',
    'Solana',
    'Tron',
  ];

  const filteredItems = items.filter((item) => {
    const matchesFilter = activeFilter === 'ALL' || item.type === activeFilter;
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.linkedCaseId && item.linkedCaseId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display flex items-center gap-2">
                <span>INVESTIGATION WATCHLIST DIRECTORY</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                  {items.length} Targets Active
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Continuous surveillance & AI alert join points for high-priority targets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'View Watchlist' : 'Add Target'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ADD TARGET FORM ACCORDION */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddItem}
                className={`p-5 rounded-2xl border mb-6 space-y-4 ${
                  isDark ? 'bg-zinc-900/80 border-cyan-900/40' : 'bg-zinc-50 border-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                    Add New Watchlist Target
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Live alerting will trigger immediately upon addition
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-zinc-400 mb-1">Target Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as WatchlistType)}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300'
                      }`}
                    >
                      <option value="Wallet">Wallet Address</option>
                      <option value="Transaction">Transaction Hash</option>
                      <option value="Entity">Entity / VASP / Cluster</option>
                      <option value="Case">Entire Case File</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Blockchain Network</label>
                    <select
                      value={newChain}
                      onChange={(e) => setNewChain(e.target.value as BlockchainNetwork)}
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300'
                      }`}
                    >
                      {chains.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Target Identifier</label>
                    <input
                      type="text"
                      required
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      placeholder="0x... or Entity ID"
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-400 font-mono text-xs ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-cyan-300' : 'bg-white border-zinc-300 text-cyan-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-zinc-400 mb-1">Descriptive Label</label>
                    <input
                      type="text"
                      required
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="e.g. Lazarus Split Mule 03"
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="Phishing, Mixer, Mule"
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Metadata Flags */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsHighPriority}
                        onChange={(e) => setNewIsHighPriority(e.target.checked)}
                        className="accent-amber-400 w-4 h-4 rounded"
                      />
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        High Priority Flag (+20 Score Boost)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsCaseLinked}
                        onChange={(e) => setNewIsCaseLinked(e.target.checked)}
                        className="accent-cyan-400 w-4 h-4 rounded"
                      />
                      <span className="flex items-center gap-1 text-cyan-300 font-bold">
                        <Link2 className="w-3.5 h-3.5" />
                        Case-Linked Flag (+25 Score Boost)
                      </span>
                    </label>
                  </div>

                  {newIsCaseLinked && (
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Case ID:</span>
                      <input
                        type="text"
                        value={newLinkedCaseId}
                        onChange={(e) => setNewLinkedCaseId(e.target.value)}
                        className={`px-2 py-1 rounded-lg border text-xs font-mono focus:outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-300'
                        }`}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 text-xs font-mono">Investigative Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Context for intelligence analysts..."
                    className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-400 text-xs font-mono ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold font-mono shadow-md shadow-cyan-500/25"
                  >
                    Save & Start Surveillance
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* FILTER & SEARCH BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['ALL', 'Wallet', 'Transaction', 'Entity', 'Case'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                    activeFilter === type
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : isDark
                      ? 'text-zinc-400 hover:bg-zinc-800'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter targets, labels, case..."
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono border focus:outline-none ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <button
                onClick={handleResetDefaults}
                className="p-2 rounded-xl border text-zinc-400 hover:text-cyan-300 transition-colors border-zinc-800"
                title="Reset to SIH Demo Targets"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WATCHLIST ITEMS LIST */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-cyan-500/40 hover:bg-zinc-900/90'
                    : 'bg-white border-zinc-200 hover:border-cyan-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {item.chain}
                      </span>
                      {item.isHighPriority && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          High Priority
                        </span>
                      )}
                      {item.isCaseLinked && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          Case #{item.linkedCaseId}
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-sm text-zinc-100">{item.label}</div>
                    <div className="font-mono text-xs text-cyan-400 truncate max-w-md">
                      {item.target}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-zinc-400 line-clamp-1">{item.notes}</p>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center gap-1 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-800/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                    <div className="text-right font-mono text-[11px] text-zinc-500">
                      <div className="text-cyan-400 font-bold">{item.alertCount} Alerts Fired</div>
                      <div>Active {item.lastActive || 'recently'}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onInvestigateTarget(item.target, item.chain);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold font-mono flex items-center gap-1 border border-cyan-500/30 transition-colors cursor-pointer"
                      >
                        <span>Investigate</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-xl hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-xs font-mono text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                No watchlist targets matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
