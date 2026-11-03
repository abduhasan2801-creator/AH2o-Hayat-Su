/**
 * AH20 Hayat - Akıllı Su Hatırlatıcı ve Takipçisi
 * منبه ومتابع شرب المياه الذكي
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Droplet, Flame, Trophy, Sparkles, RefreshCw, 
  CheckCircle, BellRing 
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { WaterGlassVisual } from './components/WaterGlassVisual';
import { QuickAddBar } from './components/QuickAddBar';
import { NextReminderBadge } from './components/NextReminderBadge';
import { DailyTipCard } from './components/DailyTipCard';
import { CalculatorTab } from './components/CalculatorTab';
import { ReminderSettings, ReminderConfig } from './components/ReminderSettings';
import { TipsCatalog } from './components/TipsCatalog';
import { HistoryTab, DrinkLogEntry, DayHistoryRecord } from './components/HistoryTab';
import { Language, translations } from './translations';
import { 
  UserProfile, 
  defaultProfile, 
  calculateHydration, 
  getCurrentCalendarSeason 
} from './utils/calculator';
import { soundEngine, SoundTone } from './utils/audio';

export default function App() {
  // 1. Language state (Arabic default, Turkish switch)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('ah20_lang');
    return (saved === 'tr' || saved === 'ar') ? saved : 'ar';
  });

  // 2. Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ah20_theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 3. User Profile & Calculation
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ah20_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      ...defaultProfile,
      season: getCurrentCalendarSeason(),
    };
  });

  // 4. Reminder Configuration
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>(() => {
    const saved = localStorage.getItem('ah20_reminder_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      enabled: true,
      intervalMinutes: 60,
      wakeTime: '07:30',
      bedTime: '23:00',
      soundEnabled: true,
      soundTone: 'bubbles', // user requested water bubbles as a highlighted default
      volume: 0.8,
    };
  });

  // 5. Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // 6. Today's hydration consumption
  const [todayLogs, setTodayLogs] = useState<DrinkLogEntry[]>(() => {
    const saved = localStorage.getItem('ah20_today_logs');
    const savedDate = localStorage.getItem('ah20_today_date');
    const todayStr = new Date().toISOString().split('T')[0];

    if (savedDate === todayStr && saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 7. Streak & History
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('ah20_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [weekHistory, setWeekHistory] = useState<DayHistoryRecord[]>(() => {
    const saved = localStorage.getItem('ah20_week_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Seed sample realistic past 6 days
    const arr: DayHistoryRecord[] = [];
    const today = new Date();
    for (let i = 6; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      arr.push({
        date: d.toISOString().split('T')[0],
        total: Math.round(2000 + Math.random() * 800),
        target: 2500,
      });
    }
    return arr;
  });

  // 8. Next scheduled reminder calculation
  const [nextReminderDate, setNextReminderDate] = useState<Date | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[lang];

  // Derived calculation based on current profile
  const calculation = calculateHydration(profile);
  const todayTotalMl = todayLogs.reduce((acc, log) => acc + log.amount, 0);

  // Sync Language and Direction
  useEffect(() => {
    localStorage.setItem('ah20_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Theme
  useEffect(() => {
    localStorage.setItem('ah20_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync Profile to LocalStorage
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('ah20_profile', JSON.stringify(newProfile));
    const newCalc = calculateHydration(newProfile);
    showToast(
      lang === 'ar'
        ? `تم تحديث هدفك اليومي بنجاح إلى ${newCalc.dailyTargetMl} مل 💧`
        : `Günlük su hedefiniz başarıyla ${newCalc.dailyTargetMl} ml olarak güncellendi! 💧`
    );
  };

  // Sync Reminder Config
  const handleUpdateReminderConfig = (newConfig: ReminderConfig) => {
    setReminderConfig(newConfig);
    localStorage.setItem('ah20_reminder_config', JSON.stringify(newConfig));
  };

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Calculate Next Reminder Date
  const scheduleNextReminder = useCallback(() => {
    if (!reminderConfig.enabled) {
      setNextReminderDate(null);
      return;
    }
    const next = new Date();
    next.setMinutes(next.getMinutes() + reminderConfig.intervalMinutes);
    setNextReminderDate(next);
  }, [reminderConfig.enabled, reminderConfig.intervalMinutes]);

  // Trigger real reminder alert (sound + notification)
  const triggerReminderAlert = useCallback((isTest: boolean = false) => {
    // 1. Play chosen sound
    if (reminderConfig.soundEnabled) {
      soundEngine.playTone(reminderConfig.soundTone, reminderConfig.volume);
    }

    // 2. Browser Notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(t.appName, {
          body: isTest ? t.testReminderSent : t.notificationBodyDrinkNow,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      } catch (err) {
        console.warn('Notification trigger error:', err);
      }
    }

    // 3. In-App toast
    showToast(isTest ? t.testReminderSent : t.notificationBodyDrinkNow);

    // Reschedule
    scheduleNextReminder();
  }, [reminderConfig, t, showToast, scheduleNextReminder]);

  // Check reminder interval every minute
  useEffect(() => {
    scheduleNextReminder();
    const interval = setInterval(() => {
      if (nextReminderDate && new Date() >= nextReminderDate) {
        triggerReminderAlert(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [reminderConfig.intervalMinutes, reminderConfig.enabled]);

  // Log water intake
  const handleAddWater = (amount: number) => {
    const now = new Date();
    const newEntry: DrinkLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      amount,
      timestamp: now.toISOString(),
    };

    const updated = [...todayLogs, newEntry];
    setTodayLogs(updated);

    const todayStr = now.toISOString().split('T')[0];
    localStorage.setItem('ah20_today_logs', JSON.stringify(updated));
    localStorage.setItem('ah20_today_date', todayStr);

    // Play subtle bubble sound for logging
    if (reminderConfig.soundEnabled) {
      soundEngine.playDrinkSuccess(reminderConfig.volume);
    }

    // Check if goal reached with this drink
    const newTotal = todayTotalMl + amount;
    if (newTotal >= calculation.dailyTargetMl && todayTotalMl < calculation.dailyTargetMl) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#a855f7', '#38bdf8', '#ffffff'],
      });
      showToast(t.goalReachedCongrat);
    } else {
      showToast(t.justDrankSuccess.replace('{amount}', amount.toString()));
    }

    // Reset reminder clock when user drinks!
    scheduleNextReminder();
  };

  // Undo last logged drink
  const handleUndo = () => {
    if (todayLogs.length === 0) return;
    const updated = todayLogs.slice(0, -1);
    setTodayLogs(updated);

    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('ah20_today_logs', JSON.stringify(updated));
    localStorage.setItem('ah20_today_date', todayStr);
    showToast(lang === 'ar' ? 'تم التراجع عن آخر كمية' : 'Son kayıt geri alındı');
  };

  // Clear today's history
  const handleClearTodayLogs = () => {
    setTodayLogs([]);
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('ah20_today_logs', JSON.stringify([]));
    localStorage.setItem('ah20_today_date', todayStr);
    showToast(lang === 'ar' ? 'تمت إعادة تعيين سجل اليوم' : 'Bugünkü kayıtlar sıfırlandı');
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f8fafc] dark:bg-[#080511] text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'tr' : 'ar'))}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-w-md w-full bg-slate-900/95 dark:bg-purple-950/95 text-white py-3 px-4 rounded-2xl shadow-xl backdrop-blur-md border border-purple-500/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
              <Droplet className="w-4 h-4 fill-white text-white" />
            </div>
            <p className="text-xs font-bold leading-snug flex-1">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 pt-4 sm:pt-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* Live Next Reminder Header Card */}
            <NextReminderBadge
              lang={lang}
              nextReminderDate={nextReminderDate}
              intervalMinutes={reminderConfig.intervalMinutes}
              tone={reminderConfig.soundTone}
              isReminderActive={reminderConfig.enabled}
              onTestReminder={() => triggerReminderAlert(true)}
              onNavigateToSettings={() => setActiveTab('settings')}
            />

            {/* Main Interactive Water Glass Visual */}
            <WaterGlassVisual
              currentMl={todayTotalMl}
              targetMl={calculation.dailyTargetMl}
              lang={lang}
              onDrankNow={() => handleAddWater(calculation.portionMl)}
            />

            {/* Quick Portions Logging Bar */}
            <QuickAddBar
              lang={lang}
              onAddWater={handleAddWater}
              onUndo={handleUndo}
              canUndo={todayLogs.length > 0}
            />

            {/* Daily Tip Widget */}
            <DailyTipCard lang={lang} />
          </div>
        )}

        {/* TAB 2: CALCULATOR & SEASONAL ADJUSTMENT */}
        {activeTab === 'calculator' && (
          <CalculatorTab
            lang={lang}
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* TAB 3: HISTORY & STATS */}
        {activeTab === 'history' && (
          <HistoryTab
            lang={lang}
            todayLogs={todayLogs}
            weekHistory={[
              ...weekHistory,
              {
                date: new Date().toISOString().split('T')[0],
                total: todayTotalMl,
                target: calculation.dailyTargetMl,
              },
            ]}
            streakDays={streakDays}
            onClearTodayLogs={handleClearTodayLogs}
          />
        )}

        {/* TAB 4: HYDRATION TIPS GUIDE */}
        {activeTab === 'tips' && (
          <TipsCatalog lang={lang} />
        )}

        {/* TAB 5: REMINDER & SOUND SETTINGS */}
        {activeTab === 'settings' && (
          <ReminderSettings
            lang={lang}
            config={reminderConfig}
            onUpdateConfig={handleUpdateReminderConfig}
            onSendTestReminder={() => triggerReminderAlert(true)}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav
        lang={lang}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
