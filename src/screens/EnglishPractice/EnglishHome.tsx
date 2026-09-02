import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { 
  ArrowRight, 
  Mic, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight,
  Flame,
  BarChart3,
  Settings,
  TrendingUp
} from 'lucide-react';
import { PracticeProgress, sentences, questions } from '../../data/englishPractice';

export const EnglishPracticeHome: React.FC = () => {
  const { navigate, goBack, currentRoute } = useRouter();
  const [progress, setProgress] = useState<PracticeProgress | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('english_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const handleBack = () => {
    if (currentRoute.params?.roleId) {
      navigate('role-detail', { roleId: currentRoute.params.roleId, skillId: currentRoute.params.skillId });
    } else {
      goBack();
    }
  };

  const primaryModules = [
    {
      id: 'overview',
      title: '1. Overview',
      subtitle: 'Know where you stand',
      desc: 'Fluency score & streak',
      route: 'english-target',
      icon: BarChart3,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      id: 'phrases',
      title: '2. Phrase Bank',
      subtitle: 'Learn useful English',
      desc: 'Greetings & audio',
      route: 'english-practice-library',
      icon: BookOpen,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      id: 'speaking',
      title: '3. AI Speaking',
      subtitle: 'Practice real voice',
      desc: 'Live coaching & drills',
      route: 'english-practice-translate',
      icon: Mic,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    {
      id: 'progress',
      title: '4. Progress',
      subtitle: 'Track improvement',
      desc: 'Mastered words & goals',
      route: 'english-target',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="neu-bg min-h-screen p-4 sm:p-6 text-slate-800 flex justify-center pb-24 font-sans select-none antialiased">
      <div className="w-full max-w-md flex flex-col justify-between">
        
        {/* 1. TOP HEADER NAVIGATION */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handleBack} 
            className="w-10 h-10 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              ENGLISH PREP
            </span>
            <span className="text-xs font-black text-slate-700">
              Home Hub
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => navigate('english-target')}
              className="w-9 h-9 rounded-full neu-btn-circle flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer"
              title="Overview & Stats"
            >
              <BarChart3 className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button 
              onClick={() => navigate('english-target')}
              className="w-9 h-9 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              title="Settings & Profile"
            >
              <Settings className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* 2. RECOMMENDED JOURNEY CARD (Small Green Card matching Overview size) */}
        <div 
          onClick={() => navigate('english-target')}
          className="p-4 rounded-2xl mb-4 text-white bg-gradient-to-r from-emerald-600 to-teal-700 shadow-md cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Recommended Journey
                </span>
                <span className="text-[10px] font-bold text-emerald-100 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-current text-amber-300" /> 5d Streak
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-black mt-1">
                Overview ➔ Phrase Bank ➔ AI Speaking ➔ Progress
              </h2>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* 3. ALL PRIMARY MODULES IN 2x2 GRID PLACEMENTS */}
        <div className="mb-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 mb-3 flex items-center justify-between">
            <span>Primary Modules</span>
            <span className="text-[10px] text-slate-400 font-semibold">2x2 Grid</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {primaryModules.map((mod) => {
              const IconComponent = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => navigate(mod.route)}
                  className="neu-flat p-4 rounded-2xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="w-6 h-6 rounded-full neu-btn-circle flex items-center justify-center text-slate-400 group-hover:text-slate-700 text-xs font-bold">
                      ›
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-slate-800 leading-tight">{mod.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1 line-clamp-1">{mod.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. RESUME SESSION BANNER (IF ACTIVE) */}
        {progress?.activeSession && (
          <div 
            onClick={() => navigate(progress.activeSession!.route)}
            className="neu-inset p-4 rounded-3xl mb-4 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-all border border-indigo-200/50"
          >
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                Continue Last Drill
              </span>
              <h3 className="font-black text-sm text-slate-800 mt-0.5">
                {progress.activeSession.topic}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-full neu-glow-btn text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        )}

        {/* 5. QUICK DRILLS & PRACTICE */}
        <div className="space-y-3 mb-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Quick Drills & Roleplays
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => navigate('english-practice-translate')}
              className="neu-flat p-3.5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all text-center"
            >
              <div className="text-xl mb-1">🎙️</div>
              <div className="font-black text-xs text-slate-800">Translate & Speak</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{sentences.length} Drills</div>
            </div>

            <div 
              onClick={() => navigate('english-practice-answer')}
              className="neu-flat p-3.5 rounded-2xl cursor-pointer hover:scale-[1.01] transition-all text-center"
            >
              <div className="text-xl mb-1">💬</div>
              <div className="font-black text-xs text-slate-800">Answer & Improve</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{questions.length} Scenarios</div>
            </div>
          </div>
        </div>

        {/* 6. STATS METRICS ROW */}
        <div className="grid grid-cols-2 gap-3">
          <div className="neu-inset-sm p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Daily Practice</span>
            <div className="text-sm font-black text-slate-800 mt-0.5">75+ Sentences</div>
          </div>
          <div className="neu-inset-sm p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Roleplays</span>
            <div className="text-sm font-black text-slate-800 mt-0.5">10 Scenarios</div>
          </div>
        </div>

      </div>
    </div>
  );
};
