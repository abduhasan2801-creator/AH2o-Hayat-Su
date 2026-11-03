import React from 'react';
import { Calendar, Trash2, Trophy, Clock, Flame, GlassWater } from 'lucide-react';
import { Language, translations } from '../translations';

export interface DrinkLogEntry {
  id: string;
  amount: number;
  timestamp: string; // ISO string
}

export interface DayHistoryRecord {
  date: string; // YYYY-MM-DD
  total: number;
  target: number;
}

interface HistoryTabProps {
  lang: Language;
  todayLogs: DrinkLogEntry[];
  weekHistory: DayHistoryRecord[];
  streakDays: number;
  onClearTodayLogs: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  lang,
  todayLogs,
  weekHistory,
  streakDays,
  onClearTodayLogs,
}) => {
  const t = translations[lang];

  const formatLogTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'tr-TR', { weekday: 'short' });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header & Streak Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t.historyTitle}</h2>
            <p className="text-xs text-purple-200">{t.streakDays}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-lg font-black font-mono">{streakDays}</span>
          <span className="text-xs font-semibold text-purple-100">{lang === 'ar' ? 'يوم' : 'gün'}</span>
        </div>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Calendar className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {lang === 'ar' ? 'استهلاك آخر 7 أيام' : 'Son 7 Günlük Tüketim'}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4 items-end h-44">
          {weekHistory.map((day, idx) => {
            const ratio = day.target > 0 ? Math.min(1.2, day.total / day.target) : 0;
            const heightPercent = Math.min(100, Math.round(ratio * 80));
            const isCompleted = day.total >= day.target && day.target > 0;

            return (
              <div key={day.date || idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {Math.round(day.total / 100) / 10}L
                </span>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-28 relative flex items-end justify-center overflow-hidden">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-t from-purple-700 to-indigo-500 shadow-sm'
                        : 'bg-gradient-to-t from-purple-400/80 to-purple-300'
                    }`}
                    style={{ height: `${Math.max(6, heightPercent)}%` }}
                  />
                </div>

                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[36px]">
                  {getDayName(day.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Log List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <GlassWater className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.todayLogs}
            </h3>
          </div>

          {todayLogs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(t.confirmClear)) {
                  onClearTodayLogs();
                }
              }}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearTodayHistory}</span>
            </button>
          )}
        </div>

        {todayLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            {t.noLogsToday}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {todayLogs.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                    💧
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      +{entry.amount} {t.ml}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatLogTime(entry.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
