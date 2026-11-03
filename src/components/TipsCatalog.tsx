import React, { useState } from 'react';
import { 
  Sun, Utensils, Snowflake, Flame, Brain, Sparkles, 
  Dumbbell, ShieldCheck, Moon, Flower2, Lightbulb, Search 
} from 'lucide-react';
import { Language, translations, hydrationTipsData, HydrationTip } from '../translations';

interface TipsCatalogProps {
  lang: Language;
}

export const TipsCatalog: React.FC<TipsCatalogProps> = ({ lang }) => {
  const t = translations[lang];
  const tips = hydrationTipsData[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t.allTips },
    { id: 'timing', label: t.timingCategory },
    { id: 'season', label: t.seasonCategory },
    { id: 'health', label: t.healthCategory },
    { id: 'fitness', label: t.fitnessCategory },
  ];

  const filteredTips = tips.filter((tip) => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t.tipsTitle}</h2>
            <p className="text-xs text-purple-200">{t.tipsSubtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث في النصائح الطبية...' : 'İpuçlarında ara...'}
            className="w-full py-2.5 px-9 rounded-2xl bg-white/15 backdrop-blur-md text-white placeholder-purple-200 text-xs focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
          />
          <Search className="w-4 h-4 text-purple-200 absolute top-3 left-3 pointer-events-none" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tips Cards List */}
      <div className="space-y-3.5">
        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="p-5 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-md shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300 flex items-start gap-3.5"
          >
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100/60 dark:border-purple-900/40">
              {renderIcon(tip.icon)}
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full mb-1.5 inline-block">
                {t[`${tip.category}Category` as keyof typeof t] || tip.category}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {tip.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {tip.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
