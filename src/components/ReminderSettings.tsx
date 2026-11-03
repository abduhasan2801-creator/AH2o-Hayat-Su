import React, { useState } from 'react';
import { 
  Bell, Volume2, Play, Sparkles, Clock, CheckCircle2, 
  AlertCircle, Waves, Droplet, Music, Compass, BellRing 
} from 'lucide-react';
import { Language, translations } from '../translations';
import { SoundTone, soundEngine } from '../utils/audio';

export interface ReminderConfig {
  enabled: boolean;
  intervalMinutes: number;
  wakeTime: string; // "07:30"
  bedTime: string;  // "23:00"
  soundEnabled: boolean;
  soundTone: SoundTone;
  volume: number;   // 0.1 - 1.0
}

interface ReminderSettingsProps {
  lang: Language;
  config: ReminderConfig;
  onUpdateConfig: (newConfig: ReminderConfig) => void;
  onSendTestReminder: () => void;
}

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  lang,
  config,
  onUpdateConfig,
  onSendTestReminder,
}) => {
  const t = translations[lang];
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [playingTone, setPlayingTone] = useState<SoundTone | null>(null);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          new Notification(t.appName, {
            body: t.permissionGranted,
            icon: '/icon-192.png',
          });
        }
      } catch (err) {
        console.error('Permission request failed', err);
      }
    }
  };

  const handleTonePreview = (tone: SoundTone) => {
    setPlayingTone(tone);
    soundEngine.playTone(tone, config.volume);
    setTimeout(() => {
      setPlayingTone(null);
    }, 1500);
  };

  const tonesList: { id: SoundTone; name: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    {
      id: 'bubbles',
      name: t.toneBubbles,
      icon: Waves,
      desc: lang === 'ar' ? 'صوت فقاقيع ماء حقيقية صاعدة ومنعشة (موصى بها)' : 'Canlandırıcı yükselen doğal su kabarcıkları sesi',
    },
    {
      id: 'drop',
      name: t.toneDrop,
      icon: Droplet,
      desc: lang === 'ar' ? 'رنة قطرة ماء نقية في بحيرة صافية' : 'Berrak bir su damlasının tınısı',
    },
    {
      id: 'zen',
      name: t.toneZen,
      icon: Compass,
      desc: lang === 'ar' ? 'جرس زن ناعم يمنح الهدوء والسكينة' : 'Huzur veren meditasyon kasesi tonu',
    },
    {
      id: 'ocean',
      name: t.toneOcean,
      icon: Waves,
      desc: lang === 'ar' ? 'موجة بحر هادئة تتدفق وتنسحب' : 'Kıyıya vuran nazik deniz dalgası',
    },
    {
      id: 'crystal',
      name: t.toneCrystal,
      icon: BellRing,
      desc: lang === 'ar' ? 'رنين بلورات كريستالية واضحة ولطيفة' : 'Net ve berrak kristal çan sesi',
    },
  ];

  const intervals = [
    { value: 30, label: t.interval30m },
    { value: 45, label: t.interval45m },
    { value: 60, label: t.interval60m },
    { value: 90, label: t.interval90m },
    { value: 120, label: t.interval120m },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3 p-5 rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{t.reminderSettingsTitle}</h2>
          <p className="text-xs text-purple-200">
            {lang === 'ar' ? 'تحكم في وتيرة التنبيهات، النغمات المائية وساعات الاستيقاظ' : 'Hatırlatma sıklığını, su seslerini ve aktif saatleri ayarlayın'}
          </p>
        </div>
      </div>

      {/* Enable / Disable Master Switch & Notification Status */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                {t.reminderEnable}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {config.enabled ? (lang === 'ar' ? 'التنبيه نشط ويعمل بالخلفية' : 'Hatırlatıcı devrede') : (lang === 'ar' ? 'التنبيه متوقف' : 'Hatırlatıcı duraklatıldı')}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onUpdateConfig({ ...config, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Browser Notification Permission Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40">
          <div className="flex items-center gap-2.5">
            {notificationPermission === 'granted' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <div className="text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                {t.notificationPermission}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                {notificationPermission === 'granted' ? t.permissionGranted : (lang === 'ar' ? 'اضغط للسماح باستقبال إشعارات الموبايل' : 'Mobil bildirimler için izin verin')}
              </span>
            </div>
          </div>

          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
            >
              {t.enableNotificationsBtn}
            </button>
          )}
        </div>
      </div>

      {/* Interval Selector */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {t.reminderInterval}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {intervals.map((item) => {
            const isSelected = config.intervalMinutes === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onUpdateConfig({ ...config, intervalMinutes: item.value })}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold text-start transition flex items-center justify-between ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </button>
            );
          })}
        </div>

        {/* Waking hours (wake time & bed time) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            {t.activeHours}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                {t.wakeTime}
              </span>
              <input
                type="time"
                value={config.wakeTime}
                onChange={(e) => onUpdateConfig({ ...config, wakeTime: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                {t.bedTime}
              </span>
              <input
                type="time"
                value={config.bedTime}
                onChange={(e) => onUpdateConfig({ ...config, bedTime: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sound Tone Selection (Crucial user requirement: "إمكانية ضبط النغمة والتبديل بينها ويكون من ضمن النغمات صوت فقاقيع المياه") */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-200/80 dark:border-purple-800/50 shadow-xl shadow-purple-500/5 dark:shadow-purple-950/60 transition-colors duration-300 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t.soundToneLabel}
            </h3>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={config.soundEnabled}
              onChange={(e) => onUpdateConfig({ ...config, soundEnabled: e.target.checked })}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span>{t.soundEnabled}</span>
          </label>
        </div>

        {/* Volume slider */}
        {config.soundEnabled && (
          <div className="flex items-center gap-3 px-2 py-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.soundVolume}
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={config.volume}
              onChange={(e) => onUpdateConfig({ ...config, volume: parseFloat(e.target.value) })}
              className="flex-1 accent-purple-600"
            />
            <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 w-8">
              {Math.round(config.volume * 100)}%
            </span>
          </div>
        )}

        {/* Tone options cards */}
        <div className="space-y-2.5">
          {tonesList.map((tone) => {
            const isSelected = config.soundTone === tone.id;
            const isPreviewing = playingTone === tone.id;
            const IconComp = tone.icon;

            return (
              <div
                key={tone.id}
                onClick={() => onUpdateConfig({ ...config, soundTone: tone.id })}
                className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 shadow-sm ring-1 ring-purple-600/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {tone.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {tone.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTonePreview(tone.id);
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                      isPreviewing
                        ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    }`}
                    title={t.previewSound}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Test Alert Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onSendTestReminder}
            className="w-full py-3 px-4 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-800/60 text-purple-900 dark:text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{t.testReminderBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
