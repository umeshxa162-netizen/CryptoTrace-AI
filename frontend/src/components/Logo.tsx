import React from 'react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types';

interface LogoProps {
  theme: ThemeMode;
  scrolled?: boolean;
  onClick?: () => void;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  theme,
  scrolled = false,
  onClick,
  showSubtitle = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <motion.button
      id="nav-brand-logo"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -0.5 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center gap-3 group text-left cursor-pointer focus:outline-none select-none"
      aria-label="CryptoTrace-AI Home"
    >
      {/* 1. Subtle Ambient Radial Light Sweep behind the Logo Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0.4, 0.25],
          scale: [0.8, 1.2, 1],
        }}
        transition={{
          duration: 1.2,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute -inset-2 bg-gradient-to-r from-cyan-500/25 via-indigo-500/25 to-purple-500/20 rounded-2xl blur-lg pointer-events-none group-hover:opacity-75 transition-opacity duration-300"
      />

      {/* 2. Geometric Trace Symbol Icon with Animated Node & Connection Formation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: scrolled ? 0.92 : 1 }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 group-hover:scale-105 transition-all duration-300 overflow-hidden ${
          scrolled ? 'w-8 h-8' : 'w-10 h-10'
        }`}
      >
        {/* Specular gleam shimmer */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20 animate-gleam" />

        <div
          className={`w-full h-full rounded-[14px] flex items-center justify-center transition-colors relative z-10 p-1.5 ${
            isDark ? 'bg-zinc-950' : 'bg-white'
          }`}
        >
          {/* Animated SVG Geometric Trace Symbol (Connected Blockchain Nodes forming shield/trace) */}
          <svg
            className="w-full h-full text-cyan-400"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Step 1 & 2: Connecting Trace Lines */}
            <motion.path
              d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            />
            {/* Internal Tri-Node Trace Flow */}
            <motion.path
              d="M16 8 L22 19 L10 19 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            />
            {/* Step 3: Central AI Pulse Node */}
            <motion.circle
              cx="16"
              cy="15"
              r="2.5"
              fill="#06b6d4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'backOut' }}
            />
            {/* Corner Nodes */}
            <motion.circle
              cx="16"
              cy="8"
              r="1.8"
              fill="#6366f1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
            <motion.circle
              cx="22"
              cy="19"
              r="1.8"
              fill="#a855f7"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            />
            <motion.circle
              cx="10"
              cy="19"
              r="1.8"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          </svg>
        </div>
      </motion.div>

      {/* 3. Logo Typography with Staggered Word Reveal */}
      <div className="flex flex-col">
        <div className="font-display font-bold tracking-tight leading-tight flex items-center gap-1.5 overflow-hidden">
          {/* Word "CryptoTrace" */}
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`font-extrabold tracking-tight text-sm sm:text-base transition-all duration-200 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            CryptoTrace
          </motion.span>

          {/* Badge "AI" */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'backOut' }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 font-extrabold text-xs px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30"
          >
            AI
          </motion.span>

          {/* Live Status Beacon Ping */}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: 'backOut' }}
            className="relative flex h-2 w-2 ml-0.5"
            title="Forensics Engine Online"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-sm shadow-cyan-500/50" />
          </motion.span>
        </div>

        {/* Optional Subtitle */}
        {showSubtitle && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-[10px] font-mono text-zinc-400 font-normal tracking-wide"
          >
            AI-Powered Blockchain Forensic Intelligence
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
