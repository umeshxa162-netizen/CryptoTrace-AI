import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Sliders,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Check
} from 'lucide-react';
import { ThemeMode, EventRuleConfig, MonitoredEventType } from '../types';
import { AlertIntelligenceService } from '../services/alertIntelligenceService';

interface AlertRuleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AlertRuleConfigModal: React.FC<AlertRuleConfigModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [rules, setRules] = useState<EventRuleConfig[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isDark = theme === 'dark';

  const loadRules = () => {
    setRules(AlertIntelligenceService.getEventRules());
  };

  useEffect(() => {
    if (isOpen) {
      loadRules();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleRule = (id: MonitoredEventType) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    const updated = AlertIntelligenceService.updateEventRule(id, {
      enabled: !rule.enabled,
    });
    setRules([...updated]);
  };

  const handleWeightChange = (id: MonitoredEventType, weight: number) => {
    const updated = AlertIntelligenceService.updateEventRule(id, {
      severityWeight: weight,
    });
    setRules([...updated]);
  };

  const handleThresholdChange = (id: MonitoredEventType, val: number) => {
    const updated = AlertIntelligenceService.updateEventRule(id, {
      thresholdValue: val,
    });
    setRules([...updated]);
  };

  const handleResetDefaults = () => {
    const defaults = AlertIntelligenceService.resetEventRules();
    setRules([...defaults]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

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
        className={`relative w-full max-w-3xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col z-10 ${
          isDark
            ? 'bg-zinc-950 border-cyan-900/60 text-zinc-100 shadow-cyan-950/40'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                MONITORED EVENT TYPES & SENSITIVITY CONFIGURATION
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Independently tune event detection triggers, thresholds, and priority weights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset Rules to SIH Default Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Reset!' : 'Defaults'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rule List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all ${
                rule.enabled
                  ? isDark
                    ? 'bg-zinc-900/70 border-zinc-800/90'
                    : 'bg-white border-zinc-200'
                  : 'opacity-50 bg-zinc-950/40 border-zinc-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        rule.baseSeverity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : rule.baseSeverity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      }`}
                    >
                      {rule.baseSeverity}
                    </span>
                    <span className="font-bold text-sm text-zinc-100">{rule.name}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {rule.description}
                  </p>
                </div>

                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all shrink-0 cursor-pointer ${
                    rule.enabled
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                  }`}
                >
                  {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>

              {/* Threshold & Weight Sliders */}
              {rule.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 mt-3 border-t border-zinc-800/60 text-xs font-mono">
                  {/* Severity Weight Slider */}
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Priority Weight (1–30):</span>
                      <span className="text-cyan-400 font-bold">+{rule.severityWeight} pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={rule.severityWeight}
                      onChange={(e) => handleWeightChange(rule.id, parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  {/* Sensitivity Threshold (if numeric) */}
                  {rule.thresholdValue !== undefined && (
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Trigger Sensitivity:</span>
                        <span className="text-indigo-400 font-bold">
                          {rule.thresholdValue} {rule.thresholdUnit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={rule.id === 'LARGE_TX' ? 5000 : 1}
                        max={rule.id === 'LARGE_TX' ? 100000 : 100}
                        step={rule.id === 'LARGE_TX' ? 5000 : 1}
                        value={rule.thresholdValue}
                        onChange={(e) =>
                          handleThresholdChange(rule.id, parseInt(e.target.value))
                        }
                        className="w-full accent-indigo-400 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex justify-between items-center text-xs font-mono text-zinc-500">
          <span>All rule changes take effect immediately in real-time scoring.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
