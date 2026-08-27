import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { ThemeMode } from '../types';

interface FAQSectionProps {
  theme: ThemeMode;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ theme }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isDark = theme === 'dark';

  const faqs = [
    {
      question: 'How does CryptoTrace AI distinguish cryptographic facts from AI inferences?',
      answer:
        'CryptoTrace AI implements a strict Evidence-First Provenance Architecture. Every data point is tagged as OBSERVED FACT (raw on-chain transaction hash and block number), REPORTED (crowdsourced threat intelligence from Chainabuse / ScamSniffer), or INFERRED (heuristic peel-chain cluster detection). The AI Copilot only narrates structured computed evidence and is strictly prohibited from inventing facts.',
    },
    {
      question: 'Which blockchain networks are supported for multi-hop tracing?',
      answer:
        'The engine natively indexes EVM and non-EVM chains including Ethereum Mainnet, Bitcoin, BNB Chain, Polygon, Arbitrum, Solana, and Tron with unified address resolution and cross-chain bridge tracking.',
    },
    {
      question: 'What is the "ONE WALLET → FULL MONEY TRAIL" 7-stage pipeline?',
      answer:
        'The pipeline automates: 1. Ingest suspect wallet → 2. Understand behavioral stats → 3. Trace multi-hop transfers → 4. Connect counterparties & clusters → 5. Rank investigative priority leads → 6. Explain risk via provenance → 7. Generate exportable court-ready PDF dossiers.',
    },
    {
      question: 'How are risk scores computed and counterfactually verified?',
      answer:
        'Risk scores (0–100) are generated through weighted anomaly contributors (velocity, counterparty risk, sanctions match, mixer usage). Each contributor logs its raw evidence reference, allowing counterfactual explanation: "If counterparty X was untainted, the risk score drops from 91 to 46."',
    },
    {
      question: 'Can law enforcement export standardized case dossiers?',
      answer:
        'Yes. Investigators can instantly generate exportable PDF and JSON intelligence packages complete with cryptographic audit timestamps, multi-hop topology maps, counterparty exchange lists, and recommended subpoena targets.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Forensic Methodology FAQ</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4"
        >
          <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>Frequently Answered </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            Forensic Inquiries
          </span>
        </motion.h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDark
                  ? 'bg-zinc-900/70 border-zinc-800/90'
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm cursor-pointer"
              >
                <span className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`px-5 pb-5 text-xs leading-relaxed border-t pt-3 ${
                        isDark ? 'text-zinc-400 border-zinc-800/60' : 'text-zinc-600 border-zinc-100'
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
