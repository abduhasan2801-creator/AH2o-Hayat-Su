import React from 'react';
import { motion } from 'motion/react';
import { Droplet, Sparkles, Trophy } from 'lucide-react';
import { Language, translations } from '../translations';

interface WaterGlassVisualProps {
  currentMl: number;
  targetMl: number;
  lang: Language;
  onDrankNow: () => void;
}

export const WaterGlassVisual: React.FC<WaterGlassVisualProps> = ({
  currentMl,
  targetMl,
  lang,
  onDrankNow,
}) => {
  const t = translations[lang];
  const percentage = Math.min(100, Math.round((currentMl / (targetMl || 2500)) * 100));
  const isGoalReached = currentMl >= targetMl && targetMl > 0;
  const remainingMl = Math.max(0, targetMl - currentMl);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/10 dark:shadow-purple-950/60 transition-colors duration-300">
      {/* Subtle background ambient purple glow */}
      <div className="absolute inset-0 bg-radial from-purple-500/10 via-transparent to-transparent rounded-3xl pointer-events-none" />

      {/* Main Fluid Vessel Container */}
      <div className="relative w-56 h-64 sm:w-64 sm:h-72 flex items-center justify-center">
        {/* Glass Container Outer Outline */}
        <div className="relative w-44 h-56 sm:w-52 sm:h-64 rounded-b-[48px] rounded-t-[20px] border-4 border-white/90 dark:border-purple-300/30 bg-purple-50/30 dark:bg-purple-950/20 backdrop-blur-sm overflow-hidden shadow-2xl flex flex-col justify-end">
          
          {/* Glass measurement ticks on the side */}
          <div className="absolute inset-y-4 right-2 sm:right-3 flex flex-col justify-between items-end z-20 pointer-events-none opacity-40">
            <span className="text-[10px] font-mono font-bold text-purple-900 dark:text-purple-200">100%</span>
            <div className="w-2.5 h-[1.5px] bg-purple-900 dark:bg-purple-200" />
            <span className="text-[10px] font-mono font-bold text-purple-900 dark:text-purple-200">75%</span>
            <div className="w-2.5 h-[1.5px] bg-purple-900 dark:bg-purple-200" />
            <span className="text-[10px] font-mono font-bold text-purple-900 dark:text-purple-200">50%</span>
            <div className="w-2.5 h-[1.5px] bg-purple-900 dark:bg-purple-200" />
            <span className="text-[10px] font-mono font-bold text-purple-900 dark:text-purple-200">25%</span>
            <div className="w-2.5 h-[1.5px] bg-purple-900 dark:bg-purple-200" />
          </div>

          {/* Animated Water Level */}
          <motion.div
            className="relative w-full overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 60 }}
            style={{
              background: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 45%, #6366f1 100%)',
            }}
          >
            {/* Top liquid wave ripple */}
            <div className="absolute top-0 inset-x-0 h-4 -translate-y-2 opacity-80 pointer-events-none overflow-hidden">
              <div className="w-[200%] h-full bg-white/30 animate-pulse rounded-full" />
            </div>

            {/* Rising Bubbles inside fluid */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="absolute bottom-1 left-4 w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="absolute bottom-3 left-12 w-3 h-3 rounded-full bg-white/50 animate-bounce" style={{ animationDuration: '2.8s' }} />
              <span className="absolute bottom-2 right-8 w-2.5 h-2.5 rounded-full bg-white/35 animate-bounce" style={{ animationDuration: '2.3s' }} />
              <span className="absolute bottom-6 right-14 w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDuration: '1.8s' }} />
            </div>

            {/* Surface light reflection highlight */}
            <div className="absolute top-1 inset-x-2 h-1.5 bg-white/30 rounded-full blur-[1px]" />
          </motion.div>

          {/* Front Glass Curvature & Reflections */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Vertical gloss shine on left */}
            <div className="absolute top-3 left-3 bottom-6 w-2 rounded-full bg-gradient-to-b from-white/60 via-white/20 to-transparent" />
            {/* Inner bottom glow */}
            <div className="absolute bottom-2 inset-x-4 h-3 rounded-full bg-white/10 blur-[2px]" />
          </div>

          {/* Center Content Overlay inside glass */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none text-center px-2">
            <div className="p-2.5 rounded-2xl bg-white/95 dark:bg-[#1c1538]/95 backdrop-blur-md shadow-lg border border-purple-200 dark:border-purple-500/40">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-900 dark:text-purple-100 font-mono">
                {percentage}%
              </span>
              <p className="text-[11px] font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                {currentMl} / {targetMl} {t.ml}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target status info */}
      <div className="mt-4 text-center">
        {isGoalReached ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-sm shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            <span>{t.goalReachedCongrat}</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.remaining}: <strong className="text-purple-700 dark:text-purple-300 font-bold text-sm">{remainingMl} {t.ml}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Primary Drink Now Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onDrankNow}
        className="mt-5 w-full max-w-xs flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg shadow-purple-600/30 transition-all bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        <Droplet className="w-5 h-5 fill-white text-white animate-pulse" />
        <span className="text-base tracking-wide">{t.drankNowBtn}</span>
        <Sparkles className="w-4 h-4 opacity-75" />
      </motion.button>
    </div>
  );
};
