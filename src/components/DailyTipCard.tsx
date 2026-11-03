import React, { useState } from 'react';
import { 
  Sun, Utensils, Snowflake, Flame, Brain, Sparkles, 
  Dumbbell, ShieldCheck, Moon, Flower2, RefreshCw, Lightbulb 
} from 'lucide-react';
import { Language, translations, hydrationTipsData, HydrationTip } from '../translations';

interface DailyTipCardProps {
  lang: Language;
}

export const DailyTipCard: React.FC<DailyTipCardProps> = ({ lang }) => {
  const t = translations[lang];
  const tips = hydrationTipsData[lang];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTip: HydrationTip = tips[currentIndex] || tips[0];

  const handleNextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0' };
    switch (iconName) {
      case 'Sun': return <Sun {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Snowflake': return <Snowflake {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Moon': return <Moon {...props} />;
      case 'Flower2': return <Flower2 {...props} />;
      default: return <Lightbulb {...props} />;
    }
  };

  return (
    <div className="w-full p-5 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-purple-900/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t.dailyTipHeader}
          </h4>
        </div>

        <button
          onClick={handleNextTip}
          className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{t.nextTip}</span>
        </button>
      </div>

      <div className="mt-3.5 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100/60 dark:border-purple-900/40">
          {renderIcon(currentTip.icon)}
        </div>
        <div className="flex-1">
          <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
            {currentTip.title}
          </h5>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentTip.content}
          </p>
        </div>
      </div>
    </div>
  );
};
