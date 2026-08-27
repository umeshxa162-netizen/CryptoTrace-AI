import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Globe,
  Upload,
  AlertTriangle,
  FileText,
  Lock,
  Zap
} from 'lucide-react';
import { ThemeMode, BlockchainNetwork, IntakeFormData } from '../types';

interface IntakeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onSubmitCase: (formData: IntakeFormData) => void;
}

export const IntakeWizardModal: React.FC<IntakeWizardModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSubmitCase,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>({
    reporterName: 'Sgt. Ramesh Kumar',
    reporterEmail: 'r.kumar@cybercell.gov.in',
    reporterPhone: '+91 98765 43210',
    reporterRole: 'Law Enforcement Officer',
    suspectAddress: '0x7A3c9e9b384f912c0192837461abcef0192891F2',
    blockchain: 'Ethereum',
    lossAmountUsd: '25400',
    incidentDate: '2026-08-27',
    incidentDescription: 'Victim reports fraudulent Uniswap airdrop smart contract drainer transferred 10 ETH into suspect wallet.',
    urgency: 'CRITICAL',
    attachments: [],
  });

  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const chains: BlockchainNetwork[] = [
    'Ethereum',
    'Bitcoin',
    'BNB Chain',
    'Polygon',
    'Arbitrum',
    'Solana',
    'Tron',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCase(formData);
    onClose();
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden z-10 ${
          isDark
            ? 'bg-zinc-950 border-cyan-900/60 text-zinc-100 shadow-cyan-950/40'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">START NEW CASE INTAKE</h3>
              <p className="text-xs text-zinc-400">Evidence-first blockchain intelligence wizard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-4 pb-2 border-b border-zinc-800/40 flex items-center justify-between text-xs font-mono">
          {[
            { num: 1, label: 'Reporter' },
            { num: 2, label: 'Wallet & Chain' },
            { num: 3, label: 'Incident' },
            { num: 4, label: 'Review' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  currentStep >= s.num
                    ? 'bg-cyan-500 text-zinc-950 font-bold'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {s.num}
              </span>
              <span className={currentStep >= s.num ? 'text-cyan-300 font-bold hidden sm:inline' : 'text-zinc-500 hidden sm:inline'}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: REPORTER DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm font-display text-cyan-400">Step 1 — Reporter Identification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-400 mb-1">Full Name / Badge No.</label>
                  <input
                    type="text"
                    required
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.reporterPhone}
                    onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Reporter Role</label>
                  <select
                    value={formData.reporterRole}
                    onChange={(e) => setFormData({ ...formData, reporterRole: e.target.value as any })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  >
                    <option>Law Enforcement Officer</option>
                    <option>Victim</option>
                    <option>Legal Representative</option>
                    <option>Compliance Analyst</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WALLET & BLOCKCHAIN */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm font-display text-cyan-400">Step 2 — Suspect Target & Network</h4>
              <div className="text-xs font-mono">
                <label className="block text-zinc-400 mb-1">Suspect Wallet Address (0x...)</label>
                <input
                  type="text"
                  required
                  value={formData.suspectAddress}
                  onChange={(e) => setFormData({ ...formData, suspectAddress: e.target.value })}
                  placeholder="0x..."
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-cyan-300' : 'bg-zinc-50 border-zinc-300 text-cyan-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-400 mb-1">Blockchain Network</label>
                  <select
                    value={formData.blockchain}
                    onChange={(e) => setFormData({ ...formData, blockchain: e.target.value as any })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  >
                    {chains.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Estimated Fund Loss (USD)</label>
                  <input
                    type="number"
                    value={formData.lossAmountUsd}
                    onChange={(e) => setFormData({ ...formData, lossAmountUsd: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INCIDENT DETAILS & URGENCY */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs font-mono">
              <h4 className="font-bold text-sm font-display text-cyan-400">Step 3 — Incident Narrative & Priority</h4>
              <div>
                <label className="block text-zinc-400 mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  value={formData.incidentDescription}
                  onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                  className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Urgency Priority</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  >
                    <option value="STANDARD">STANDARD (Normal Processing)</option>
                    <option value="PRIORITY">PRIORITY (Expedited Queue)</option>
                    <option value="CRITICAL">CRITICAL (Emergency Off-Ramp Freeze)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Incident Date</label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:outline-none focus:border-cyan-400 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm font-display text-cyan-400">Step 4 — Case Review & Submission</h4>
              <div
                className={`p-4 rounded-2xl border space-y-2 text-xs font-mono ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-300'
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reporter:</span>
                  <span className="font-bold">{formData.reporterName} ({formData.reporterRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Address:</span>
                  <span className="text-cyan-400 font-bold truncate max-w-[220px]">{formData.suspectAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Blockchain Network:</span>
                  <span>{formData.blockchain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Claimed Loss:</span>
                  <span className="text-red-400 font-bold">${Number(formData.lossAmountUsd).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Urgency:</span>
                  <span className="text-red-400 font-bold">{formData.urgency}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>On submission, case will trigger automated multi-hop peel-chain analysis.</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Submit & Run Analysis</span>
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
