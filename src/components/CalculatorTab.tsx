import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Snowflake, Flower2, Leaf, Calculator, 
  Check, Info, Sparkles, User, Plus, Minus, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Language, translations } from '../translations';
import { UserProfile, Season, calculateHydration, ActivityLevel, Gender } from '../utils/calculator';
import { soundEngine } from '../utils/audio';

interface CalculatorTabProps {
  lang: Language;
  profile: UserProfile;
  onSaveProfile: (newProfile: UserProfile) => void;
  onNavigateToDashboard?: () => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  lang,
  profile,
  onSaveProfile,
  onNavigateToDashboard,
}) => {
  const t = translations[lang];

  const [age, setAge] = useState<number>(profile.age);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [height, setHeight] = useState<number>(profile.height);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [season, setSeason] = useState<Season>(profile.season);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [savedGoalAmount, setSavedGoalAmount] = useState<number>(0);

  // Live calculation preview based on current form values
  const currentCalc = calculateHydration({
    age,
    weight,
    height,
    gender,
    season,
    activityLevel,
  });

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const updatedProfile: UserProfile = {
      age,
      weight,
      height,
      gender,
      season,
      activityLevel,
    };

    // Calculate final target
    const finalCalc = calculateHydration(updatedProfile);
    setSavedGoalAmount(finalCalc.dailyTargetMl);

    // Save to state and localStorage via parent callback
    onSaveProfile(updatedProfile);

    // Play pleasant water drop sound
    soundEngine.playTone('drop', 0.8);

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessModal(true);
    }, 300);
  };

  const seasonsList: { id: Season; name: string; icon: React.ComponentType<{ className?: string }>; desc: string; badge: string; color: string }[] = [
    {
      id: 'summer',
      name: t.summer,
      icon: Sun,
      desc: t.summerDesc,
      badge: '+20%',
      color: 'from-amber-500 to-orange-500 text-amber-500',
    },
    {
      id: 'winter',
      name: t.winter,
      icon: Snowflake,
      desc: t.winterDesc,
      badge: 'Base',
      color: 'from-blue-500 to-cyan-500 text-blue-500',
    },
    {
      id: 'spring',
      name: t.spring,
      icon: Flower2,
      desc: t.springDesc,
      badge: '+5%',
      color: 'from-emerald-500 to-teal-500 text-emerald-500',
    },
    {
      id: 'autumn',
      name: t.autumn,
      icon: Leaf,
      desc: t.autumnDesc,
      badge: '+5%',
      color: 'from-orange-500 to-amber-600 text-orange-500',
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-md">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {t.calculatorTitle}
            </h2>
            <p className="mt-1 text-xs text-purple-200/90 leading-relaxed">
              {t.calculatorSubtitle}
            </p>
          </div>
        </div>

        {/* Live Calculation Badge Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-white/10 dark:bg-black/25 backdrop-blur-md border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">
              {t.dailyTarget}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black font-mono text-white drop-shadow-sm">
                {currentCalc.dailyTargetMl}
              </span>
              <span className="text-sm font-bold text-purple-200">{t.ml}</span>
            </div>
          </div>
          <div className="text-end">
            <span className="text-xs font-bold text-purple-100 block">
              ≈ {currentCalc.glassesCount} {t.dailyTargetGlasses}
            </span>
            <span className="text-[11px] text-purple-200/80">
              {lang === 'ar' ? 'موزعة على مدار ساعات يقظتك' : 'Uyanık kaldığınız saatlere dağıtılır'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Body Metrics Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-100 dark:border-purple-800/40 shadow-xl shadow-purple-500/5 space-y-5 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-purple-900/40">
            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {lang === 'ar' ? 'البيانات الجسدية' : 'Fiziksel Bilgiler'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Age with Stepper */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/25 border border-slate-200/80 dark:border-purple-900/30">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.age}
              </label>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setAge((prev) => Math.max(5, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-purple-50 active:scale-95 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="5"
                  max="110"
                  value={age}
                  onChange={(e) => setAge(Math.max(5, Math.min(110, parseInt(e.target.value) || 25)))}
                  className="w-16 py-1 text-center bg-transparent font-mono text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAge((prev) => Math.min(110, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-purple-50 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weight with Stepper */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/25 border border-slate-200/80 dark:border-purple-900/30">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.weight}
              </label>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.max(25, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-purple-50 active:scale-95 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="20"
                  max="250"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(20, Math.min(250, parseInt(e.target.value) || 70)))}
                  className="w-16 py-1 text-center bg-transparent font-mono text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.min(250, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-purple-50 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Height with Stepper */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-purple-950/25 border border-slate-200/80 dark:border-purple-900/30">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t.height}
              </label>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setHeight((prev) => Math.max(90, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-purple-50 active:scale-95 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="80"
                  max="240"
                  value={height}
                  onChange={(e) => setHeight(Math.max(80, Math.min(240, parseInt(e.target.value) || 170)))}
                  className="w-16 py-1 text-center bg-transparent font-mono text-lg font-black text-slate-900 dark:text-white focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setHeight((prev) => Math.min(240, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-purple-900/60 border border-slate-200 dark:border-purple-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-purple-50 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Gender & Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.gender}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                    gender === 'male'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
                      : 'bg-slate-50 dark:bg-purple-950/25 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-900/40'
                  }`}
                >
                  {t.male}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                    gender === 'female'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
                      : 'bg-slate-50 dark:bg-purple-950/25 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-900/40'
                  }`}
                >
                  {t.female}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.activityLevel}
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1433] border border-slate-200 dark:border-purple-800/40 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="sedentary">{t.activitySedentary}</option>
                <option value="moderate">{t.activityModerate}</option>
                <option value="active">{t.activityActive}</option>
                <option value="athlete">{t.activityVeryActive}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Season Selector Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#130e26] backdrop-blur-md border border-purple-100 dark:border-purple-800/40 shadow-xl shadow-purple-500/5 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-purple-900/40">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t.seasonLabel}
              </h3>
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-300 font-bold">
              {lang === 'ar' ? 'تأثير درجات الحرارة' : 'Sıcaklık ve Nem Etkisi'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {t.seasonHint}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seasonsList.map((item) => {
              const isSelected = season === item.id;
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setSeason(item.id)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 shadow-md ring-2 ring-purple-600/30'
                      : 'border-slate-200 dark:border-purple-900/30 bg-slate-50/60 dark:bg-purple-950/20 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-purple-900/60 text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <p className="mt-2.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculation Breakdown Explanation */}
        <div className="p-5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/40 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-950 dark:text-purple-200">
            <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{t.calculationDetails}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
            <div>• {t.baseWaterNeed}: <strong className="text-slate-900 dark:text-white font-mono">{currentCalc.baseWeightNeed} {t.ml}</strong></div>
            <div>• {t.seasonAdjustment.replace('{season}', t[season])}: <strong className="text-purple-700 dark:text-purple-300 font-mono">+{currentCalc.seasonAdjustmentMl} {t.ml}</strong></div>
            <div>• {t.activityAdjustment}: <strong className="text-slate-900 dark:text-white font-mono">+{currentCalc.activityAdjustmentMl} {t.ml}</strong></div>
            <div>• {t.heightBmiFactor}: <strong className="text-slate-900 dark:text-white font-mono">{currentCalc.heightAdjustmentMl >= 0 ? `+${currentCalc.heightAdjustmentMl}` : currentCalc.heightAdjustmentMl} {t.ml}</strong></div>
          </div>
        </div>

        {/* Primary Save Button (Requested by user: تفعيل زرار حفظ وتحديث الاحتياج اليومي) */}
        <motion.button
          type="button"
          onClick={() => handleSave()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSaving}
          className="w-full py-4 px-6 rounded-2xl font-black text-white text-base shadow-xl shadow-purple-600/30 transition-all bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:bg-purple-800 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{lang === 'ar' ? 'جارٍ الحفظ وتحديث الهدف...' : 'Kaydediliyor ve güncelleniyor...'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{t.saveProfile}</span>
              <Sparkles className="w-4 h-4 opacity-80" />
            </div>
          )}
        </motion.button>
      </form>

      {/* Success Modal Confirmation */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#130e26] border border-purple-200 dark:border-purple-800 p-6 shadow-2xl text-center space-y-4 text-slate-900 dark:text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg font-black">
                  {lang === 'ar' ? 'تم حفظ وتحديث الاحتياج اليومي بنجاح!' : 'Günlük İhtiyacınız Başarıyla Güncellendi!'}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {lang === 'ar' ? 'هدفك اليومي المخصص الجديد هو:' : 'Yeni kişisel günlük hedefiniz:'}
                </p>
                <div className="mt-2 inline-flex items-baseline gap-1 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-black text-2xl">
                  <span>{savedGoalAmount}</span>
                  <span className="text-xs font-bold">{t.ml}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {onNavigateToDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(false);
                      onNavigateToDashboard();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <span>{lang === 'ar' ? 'الانتقال إلى الرئيسية لمتابعة الشرب' : 'Ana Sayfaya Git ve Takibe Başla'}</span>
                    {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-purple-900 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-purple-950/40 transition"
                >
                  {lang === 'ar' ? 'إغلاق ومتابعة التعديل' : 'Kapat ve Düzenlemeye Devam Et'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
