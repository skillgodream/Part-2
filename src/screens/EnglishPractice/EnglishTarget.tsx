import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { 
  ArrowLeft, 
  Target, 
  Flame, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Compass, 
  Clock, 
  Award, 
  BookOpen, 
  ChevronRight,
  Headphones
} from 'lucide-react';

export function EnglishTarget() {
  const { navigate, goBack, currentRoute } = useRouter();
  
  // Daily target selections designed by instructional design best practices
  const [targetType, setTargetType] = useState<'quick' | 'standard' | 'intensive'>('standard');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(15);
  const [dailySentenceGoal, setDailySentenceGoal] = useState<number>(10);
  const [isTargetSaved, setIsTargetSaved] = useState<boolean>(false);
  const [completedToday, setCompletedToday] = useState<number>(4);

  useEffect(() => {
    const saved = localStorage.getItem('english_daily_target');
    if (saved) {
      const data = JSON.parse(saved);
      setTargetType(data.targetType);
      setDailyGoalMinutes(data.dailyGoalMinutes);
      setDailySentenceGoal(data.dailySentenceGoal);
      setIsTargetSaved(true);
    }
  }, []);

  const saveTarget = (type: 'quick' | 'standard' | 'intensive', mins: number, sentences: number) => {
    setTargetType(type);
    setDailyGoalMinutes(mins);
    setDailySentenceGoal(sentences);
    setIsTargetSaved(true);
    localStorage.setItem('english_daily_target', JSON.stringify({
      targetType: type,
      dailyGoalMinutes: mins,
      dailySentenceGoal: sentences
    }));
  };

  const handleStartTodaySession = () => {
    // Navigate directly to the main audio practice unit / studio flow smoothly
    navigate('skillgo-english', { roleId: currentRoute.params?.roleId, skillId: currentRoute.params?.skillId });
  };

  const handleBack = () => {
    if (currentRoute.params?.roleId) {
      navigate('role-detail', { roleId: currentRoute.params.roleId, skillId: currentRoute.params.skillId });
    } else {
      goBack();
    }
  };

  return (
    <div className="min-h-screen neu-bg flex justify-center items-start p-3 sm:p-6 font-sans select-none antialiased">
      {/* Neumorphic Device / Studio Container */}
      <div className="w-full max-w-md neu-bg rounded-[38px] p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
        
        {/* 1. TOP HEADER NAVIGATION */}
        <header className="flex items-center justify-between w-full mb-6">
          <button
            onClick={handleBack}
            className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
              LEARNING ARCHITECT
            </span>
            <span className="text-xs font-bold text-slate-700 mt-0.5 tracking-tight">
              Daily Target & Goal Studio
            </span>
          </div>

          <button
            onClick={() => navigate('skillgo-english')}
            className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer"
            title="Open Studio"
          >
            <Headphones className="w-5 h-5 stroke-[2.2]" />
          </button>
        </header>

        {/* 2. INSTRUCTIONAL DESIGN HERO CARD (TODAY'S PROGRESS) */}
        <div className="neu-flat p-5 rounded-3xl mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-indigo-600 text-[10px] font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Streak: 5 Days Active</span>
            </div>
            <span className="text-xs font-black text-slate-500">
              {completedToday} / {dailySentenceGoal} Sentences
            </span>
          </div>

          <h2 className="text-lg font-black text-slate-800 leading-snug">
            {completedToday >= dailySentenceGoal ? '🎉 Daily Goal Achieved!' : '🎯 Today’s Fluency Target'}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Complete {dailySentenceGoal} sentences & 1 AI roleplay to build workplace confidence.
          </p>

          {/* Progress Bar Inset */}
          <div className="w-full h-3 neu-inset rounded-full mt-4 overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#5b7ef8] to-[#809aff] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedToday / dailySentenceGoal) * 100)}%` }}
            />
          </div>

          <button
            onClick={handleStartTodaySession}
            className="w-full mt-5 neu-glow-btn text-white py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Play className="w-4 h-4 fill-white stroke-none" />
            <span>Continue Today's Journey</span>
          </button>
        </div>

        {/* 3. INSTRUCTIONAL GOAL SELECTOR CARDS */}
        <div className="space-y-3.5 mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Choose Your Daily Pace (Instructional Plan)
          </div>

          {/* Option 1: Quick Practice */}
          <div
            onClick={() => saveTarget('quick', 5, 5)}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
              targetType === 'quick'
                ? 'neu-inset border border-indigo-300/60'
                : 'neu-flat hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black ${
                targetType === 'quick' ? 'neu-glow-btn text-white' : 'neu-btn-circle text-blue-600'
              }`}>
                ⚡
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-slate-800">
                  Quick Habit Builder (5 Mins / day)
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  5 Sentences • Best for busy work schedules
                </div>
              </div>
            </div>
            {targetType === 'quick' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
          </div>

          {/* Option 2: Standard Professional (Recommended) */}
          <div
            onClick={() => saveTarget('standard', 15, 10)}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
              targetType === 'standard'
                ? 'neu-inset border border-indigo-300/60'
                : 'neu-flat hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black ${
                targetType === 'standard' ? 'neu-glow-btn text-white' : 'neu-btn-circle text-indigo-600'
              }`}>
                🎯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm text-slate-800">Standard Workplace Pace</span>
                  <span className="px-2 py-0.5 rounded-full neu-inset-sm text-[9px] font-extrabold text-indigo-600">Recommended</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  10 Sentences + 1 Roleplay • 15 mins daily
                </div>
              </div>
            </div>
            {targetType === 'standard' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
          </div>

          {/* Option 3: Intensive Mastery */}
          <div
            onClick={() => saveTarget('intensive', 30, 20)}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
              targetType === 'intensive'
                ? 'neu-inset border border-indigo-300/60'
                : 'neu-flat hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black ${
                targetType === 'intensive' ? 'neu-glow-btn text-white' : 'neu-btn-circle text-emerald-600'
              }`}>
                🚀
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-slate-800">
                  Intensive Fluency Mastery (30 Mins)
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  20 Sentences + All Drills • Rapid promotion prep
                </div>
              </div>
            </div>
            {targetType === 'intensive' && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
          </div>
        </div>

        {/* 4. SMOOTH STEP-BY-STEP LEARNING ROADMAP */}
        <div className="neu-flat p-4 rounded-3xl mb-2">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-1 flex items-center justify-between">
            <span>Seamless 4-Step Journey</span>
            <span className="text-[10px] text-indigo-600 font-extrabold">Guided Flow</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div onClick={() => navigate('skillgo-english')} className="neu-inset-sm p-2 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-base mb-1">🎧</div>
              <div className="text-[10px] font-bold text-slate-700">1. Audio</div>
            </div>
            <div onClick={() => navigate('english-practice-home')} className="neu-inset-sm p-2 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-base mb-1">🃏</div>
              <div className="text-[10px] font-bold text-slate-700">2. Flash</div>
            </div>
            <div onClick={() => navigate('english-practice-translate')} className="neu-inset-sm p-2 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-base mb-1">🎙️</div>
              <div className="text-[10px] font-bold text-slate-700">3. Speak</div>
            </div>
            <div onClick={() => navigate('english-practice-real')} className="neu-inset-sm p-2 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
              <div className="text-base mb-1">🤖</div>
              <div className="text-[10px] font-bold text-slate-700">4. Talk</div>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="w-full flex items-center justify-between pt-4 mt-2 text-[10px] font-bold text-slate-400 border-t border-slate-200/50">
          <span>Instructional Designer Certified</span>
          <span>Adaptive Pace</span>
        </div>
      </div>
    </div>
  );
}
