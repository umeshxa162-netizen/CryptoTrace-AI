import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Activity } from 'lucide-react';
import { ThemeMode } from '../types';

interface LogoProps {
  theme: ThemeMode;
  scrolled?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  theme,
  scrolled = false,
  onClick,
}) => {
  const isDark = theme === 'dark';

  return (
    <motion.button
      id="nav-brand-logo"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -0.5 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none select-none"
      aria-label="CryptoTrace AI Home"
    >
      {/* 1. Subtle Ambient Radial Light Sweep behind the Logo Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0.5, 0.3],
          scale: [0.8, 1.25, 1],
        }}
        transition={{
          duration: 1.4,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute -inset-2.5 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/25 rounded-2xl blur-lg pointer-events-none group-hover:opacity-80 transition-opacity duration-300"
      />

      {/* 2. Logo Icon Container with Staggered Entrance & Specular Gleam */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 4 }}
        animate={{ opacity: 1, scale: scrolled ? 0.94 : 1, filter: 'blur(0px)', y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 group-hover:scale-105 transition-all duration-300 overflow-hidden ${
          scrolled ? 'w-8 h-8' : 'w-9 h-9'
        }`}
      >
        {/* Continuous Specular gleam light sweep across the icon container */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20 animate-gleam" />

        <div
          className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors relative z-10 ${
            isDark ? 'bg-zinc-950' : 'bg-white'
          }`}
        >
          <motion.div
            initial={{ scale: 0.85, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Shield
              className={`text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300 ${
                scrolled ? 'w-4 h-4' : 'w-4.5 h-4.5'
              }`}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 3. Logo Typography with Staggered Word Reveal */}
      <div className="flex flex-col">
        <div className="font-display font-bold tracking-tight leading-tight flex items-center gap-1.5 overflow-hidden">
          {/* Word "CRYPTO" */}
          <motion.span
            initial={{ opacity: 0, scale: 0.95, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`font-extrabold tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            Crypto
          </motion.span>

          {/* Word "TRACE" */}
          <motion.span
            initial={{ opacity: 0, scale: 0.95, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`font-semibold tracking-wide text-xs sm:text-sm uppercase ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            trace
          </motion.span>

          {/* Word "AI" Gradient */}
          <motion.span
            initial={{ opacity: 0, scale: 0.95, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 font-extrabold text-xs sm:text-sm px-1 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30"
          >
            AI
          </motion.span>

          {/* Live Status Beacon Ping */}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.55,
              ease: 'backOut',
            }}
            className="relative flex h-2 w-2 ml-0.5"
            title="Forensics Engine Online"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-sm shadow-cyan-500/50" />
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
};
