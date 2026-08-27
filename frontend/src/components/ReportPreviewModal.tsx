import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  FileText,
  Download,
  Check,
  Shield,
  Copy,
  Printer,
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThemeMode } from '../types';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
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

      {/* Report Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col z-10 ${
          isDark
            ? 'bg-zinc-950 border-cyan-900/60 text-zinc-100 shadow-cyan-950/40'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">FORENSIC INTELLIGENCE DOSSIER</h3>
              <p className="text-xs text-zinc-400 font-mono">Case #CT-2026-0184 · SHA256 Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all"
            >
              {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloading ? 'Compiling PDF...' : downloaded ? 'Downloaded' : 'Download PDF Dossier'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content Body (Scrollable Document) */}
        <div className="p-6 sm:p-10 overflow-y-auto font-mono text-xs space-y-6">
          {/* Document Header */}
          <div className="border-b border-zinc-800 pb-6 flex justify-between items-start">
            <div>
              <div className="text-sm font-extrabold text-cyan-400">CRYPTOTRACE AI FORENSIC LABS</div>
              <div className="text-zinc-400 text-[11px]">National Cyber Crime Forensics Standard (SIH Compliance)</div>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              <div>Date: 2026-08-27 12:00 UTC</div>
              <div>Classification: LAW ENFORCEMENT SENSITIVE</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div>
            <h4 className="font-bold text-sm font-display text-zinc-200 uppercase tracking-wider mb-2 border-b border-zinc-800/60 pb-1">
              1. Executive Forensic Summary
            </h4>
            <p className="text-zinc-300 leading-relaxed font-sans text-xs">
              On 2026-08-27, a high-severity fraudulent transaction was detected originating from victim address{' '}
              <span className="font-mono text-cyan-400">0x3892...4b19</span> into suspect ingress wallet{' '}
              <span className="font-mono text-cyan-400">0x7A3c...91F2</span> for a total sum of 10.00 ETH ($25,400.00 USD).
              Multi-hop automated graph traversal identified rapid peel-chain dispersion over 4 distinct hops with 68.8% of funds terminating at a verified Tier-1 exchange deposit endpoint.
            </p>
          </div>

          {/* Section 2: Suspect Ingress Profile */}
          <div>
            <h4 className="font-bold text-sm font-display text-zinc-200 uppercase tracking-wider mb-2 border-b border-zinc-800/60 pb-1">
              2. Target Wallet Profile & Risk Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">RISK SCORE</span>
                <div className="text-red-400 font-bold text-base">91 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">SEVERITY</span>
                <div className="text-red-400 font-bold text-base">CRITICAL</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">CONFIDENCE</span>
                <div className="text-cyan-400 font-bold text-base">94%</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">CHAIN</span>
                <div className="text-zinc-200 font-bold text-base">Ethereum</div>
              </div>
            </div>
          </div>

          {/* Section 3: Provenance Table */}
          <div>
            <h4 className="font-bold text-sm font-display text-zinc-200 uppercase tracking-wider mb-2 border-b border-zinc-800/60 pb-1">
              3. Evidence Provenance & Cryptographic Proofs
            </h4>
            <table className="w-full text-left text-[11px]">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="py-2">Type</th>
                  <th className="py-2">Evidence Reference</th>
                  <th className="py-2">Source</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
                <tr>
                  <td className="py-2 font-bold text-cyan-400">FACT</td>
                  <td className="py-2">TX Block #21,908,412 (10 ETH Ingress)</td>
                  <td className="py-2">EVM RPC Node</td>
                  <td className="py-2 text-emerald-400">Verified (100%)</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-amber-400">REPORT</td>
                  <td className="py-2">14 Victim Scam Filings (ID #CR-2026-891)</td>
                  <td className="py-2">Chainabuse Intel</td>
                  <td className="py-2 text-emerald-400">Verified (96%)</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-purple-400">INFERENCE</td>
                  <td className="py-2">Peel Topology Match (Cluster #CL-441)</td>
                  <td className="py-2">CryptoTrace Analytics</td>
                  <td className="py-2 text-emerald-400">Model High (91%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Recommended Investigative Action */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
            <h5 className="font-bold text-cyan-400 text-xs uppercase">Recommended Law Enforcement Next Steps:</h5>
            <ol className="list-decimal pl-4 space-y-1 text-zinc-300 font-sans text-xs">
              <li>Issue emergency preservation letter to recipient Tier-1 exchange for deposit wallet <code className="text-cyan-300">0x28C6...8290</code>.</li>
              <li>Execute subpoena against hosting provider of associated phishing landing domain.</li>
              <li>Monitor peeling sub-wallet <code className="text-cyan-300">0x44F0...11AA</code> for future unmixing withdrawal signals.</li>
            </ol>
          </div>

          {/* Document Footer */}
          <div className="pt-6 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
            <span>Cryptographic Digital Signature: <strong>0x7F8B...992A</strong></span>
            <span>Generated via CryptoTrace AI Forensics Engine</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
