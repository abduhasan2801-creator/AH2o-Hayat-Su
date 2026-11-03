import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, RotateCcw, GlassWater, Coffee, CupSoda } from 'lucide-react';
import { Language, translations } from '../translations';

interface QuickAddBarProps {
  lang: Language;
  onAddWater: (amount: number) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  lang,
  onAddWater,
  onUndo,
  canUndo,
}) => {
  const t = translations[lang];
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustom, setShowCustom] = useState<boolean>(false);

  const presets = [
    { label: '150', ml: 150, icon: Coffee, sub: lang === 'ar' ? 'فنجان' : 'Fincan' },
    { label: '250', ml: 250, icon: GlassWater, sub: lang === 'ar' ? 'كوب' : 'Bardak' },
    { label: '330', ml: 330, icon: CupSoda, sub: lang === 'ar' ? 'علبة' : 'Kutu' },
    { label: '500', ml: 500, icon: GlassWater, sub: lang === 'ar' ? 'قارورة' : 'Şişe' },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0 && val <= 3000) {
      onAddWater(val);
      setCustomInput('');
      setShowCustom(false);
    }
  };

  return (
    <div className="w-full p-5 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {t.quickAdd}
        </h3>

        {canUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full transition border border-rose-200 dark:border-rose-900/40"
            title={t.undo}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.undo}</span>
          </button>
        )}
      </div>

      {/* Preset cards grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {presets.map((preset) => {
          const IconComponent = preset.icon;
          return (
            <motion.button
              key={preset.ml}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddWater(preset.ml)}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl border border-purple-200/70 dark:border-purple-800/40 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100/80 dark:hover:bg-purple-900/60 transition group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-purple-200/80 dark:bg-purple-800/60 flex items-center justify-center text-purple-700 dark:text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white font-mono">
                +{preset.label}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300">
                {preset.sub}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Amount Expander */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="w-full py-2 text-xs font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.customAmount}</span>
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="10"
              max="3000"
              step="10"
              placeholder={`100 - 2000 ${t.ml}`}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
            >
              {t.addCustom}
            </button>
            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="px-2.5 py-2 rounded-xl text-slate-500 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
