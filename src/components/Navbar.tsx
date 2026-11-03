import React, { useState } from 'react';
import { 
  Droplet, Moon, Sun, Globe, Download, 
  Smartphone, Share2, PlusSquare, X 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const t = translations[lang];
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#080511]/90 border-b border-purple-200/70 dark:border-purple-800/40 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
              <Droplet className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 dark:from-purple-300 dark:via-purple-200 dark:to-indigo-300 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
                  H₂O
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Actions (Install, Language, Dark Mode) */}
          <div className="flex items-center gap-2">
            {/* PWA Install Button */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition animate-pulse"
                title={t.pwaInstallTitle}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.installAppBtn}</span>
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold transition border border-purple-200 dark:border-purple-800"
                title={t.iosInstallGuideTitle}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{lang === 'ar' ? 'تثبيت iPhone' : 'iPhone\'a Yükle'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-purple-800/60 bg-slate-50 dark:bg-purple-950/40 hover:bg-slate-100 dark:hover:bg-purple-900/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-xs"
              title={t.languageLabel}
            >
              <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{lang === 'ar' ? 'TR' : 'عربي'}</span>
            </button>

            {/* Distinct Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer ${
                isDarkMode
                  ? 'bg-purple-950/70 border-purple-700/60 text-amber-300 hover:bg-purple-900/80 shadow-purple-900/20'
                  : 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100'
              }`}
              title={isDarkMode ? t.lightMode : t.darkMode}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="text-[11px] font-bold text-amber-300">
                    {lang === 'ar' ? 'نهاري' : 'Gündüz'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-purple-700" />
                  <span className="text-[11px] font-bold text-purple-800">
                    {lang === 'ar' ? 'ليلي' : 'Gece'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* iOS Safari Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#130e26] border border-purple-200 dark:border-purple-800 p-6 shadow-2xl relative text-slate-900 dark:text-white">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold mb-3">{t.iosInstallGuideTitle}</h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-900/30">
                <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{t.iosStep1}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-900/30">
                <PlusSquare className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{t.iosStep2}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-900/30">
                <Droplet className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.iosStep3}</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
            >
              {lang === 'ar' ? 'فهمت ذلك' : 'Anladım'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
