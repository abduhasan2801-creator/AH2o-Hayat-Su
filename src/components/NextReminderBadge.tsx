import React from 'react';
import { Bell, Volume2, Sparkles, Clock } from 'lucide-react';
import { Language, translations } from '../translations';
import { SoundTone } from '../utils/audio';

interface NextReminderBadgeProps {
  lang: Language;
  nextReminderDate: Date | null;
  intervalMinutes: number;
  tone: SoundTone;
  isReminderActive: boolean;
  onTestReminder: () => void;
  onNavigateToSettings: () => void;
}

export const NextReminderBadge: React.FC<NextReminderBadgeProps> = ({
  lang,
  nextReminderDate,
  intervalMinutes,
  tone,
  isReminderActive,
  onTestReminder,
  onNavigateToSettings,
}) => {
  const t = translations[lang];

  // Tone names translation
  const getToneLabel = (soundTone: SoundTone) => {
    switch (soundTone) {
      case 'bubbles':
        return lang === 'ar' ? 'فقاقيع المياه' : 'Su Baloncukları';
      case 'drop':
        return lang === 'ar' ? 'قطرة ماء' : 'Su Damlası';
      case 'zen':
        return lang === 'ar' ? 'جرس زن' : 'Zen Zili';
      case 'ocean':
        return lang === 'ar' ? 'موج البحر' : 'Sakin Dalga';
      case 'crystal':
        return lang === 'ar' ? 'رنين بلوري' : 'Kristal Çan';
    }
  };

  const formatReminderTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-white dark:bg-[#130e26] border border-purple-200/80 dark:border-purple-800/50 shadow-md shadow-purple-500/5 dark:shadow-purple-950/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-300">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
          <Bell className="w-5 h-5 animate-wiggle" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {t.nextReminderAt}:
            </span>
            <span className="text-sm font-extrabold text-purple-700 dark:text-purple-300 font-mono">
              {formatReminderTime(nextReminderDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-500" />
              {lang === 'ar' ? `كل ${intervalMinutes} دقيقة` : `${intervalMinutes} dk arayla`}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-purple-500" />
              {getToneLabel(tone)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onTestReminder}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-800/60 text-purple-800 dark:text-purple-200 text-xs font-semibold transition"
          title={t.testReminderBtn}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{lang === 'ar' ? 'جرّب الصوت' : 'Sesi Dene'}</span>
        </button>

        <button
          onClick={onNavigateToSettings}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {lang === 'ar' ? 'تعديل' : 'Düzenle'}
        </button>
      </div>
    </div>
  );
};
