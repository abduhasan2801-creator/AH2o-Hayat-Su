import React from 'react';
import { Home, Calculator, History, Lightbulb, Settings } from 'lucide-react';
import { Language, translations } from '../translations';

export type ActiveTab = 'dashboard' | 'calculator' | 'history' | 'tips' | 'settings';

interface BottomNavProps {
  lang: Language;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  lang,
  activeTab,
  onChangeTab,
}) => {
  const t = translations[lang];

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: Home },
    { id: 'calculator', label: t.navCalculator, icon: Calculator },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'tips', label: t.navTips, icon: Lightbulb },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#080511]/95 backdrop-blur-xl border-t border-purple-200/80 dark:border-purple-800/50 pb-safe transition-colors duration-300 shadow-2xl">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const IconComp = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all relative ${
                isSelected
                  ? 'text-purple-700 dark:text-purple-300 font-extrabold'
                  : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition ${
                isSelected ? 'bg-purple-100 dark:bg-purple-900/60 shadow-xs' : ''
              }`}>
                <IconComp className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
              {isSelected && (
                <div className="w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
