import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/router';
import { 
  ArrowRight, 
  Mic, 
  MessageCircle, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  BookMarked,
  Volume2,
  Headphones,
  Compass,
  Award,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { PracticeProgress, sentences, questions, situations } from '../../data/englishPractice';

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

  return (
    <div className="neu-bg min-h-screen p-4 sm:p-6 text-slate-800 flex justify-center pb-24 font-sans select-none antialiased">
      <div className="w-full max-w-md flex flex-col justify-between">
        
        {/* 1. TOP HEADER NAVIGATION */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handleBack} 
            className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              SKILLGO ENGLISH
            </span>
            <span className="text-xs font-black text-slate-700">
              AI Fluency Lab
            </span>
          </div>

          <button 
            onClick={() => navigate('skillgo-english')}
            className="neu-btn-circle px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer"
            title="View 17 Units Curriculum"
          >
            <BookMarked className="w-4 h-4 stroke-[2.2]" />
            <span>Lessons</span>
          </button>
        </div>

        {/* 2. HERO VISUAL ARTWORK DISK & STATS */}
        <div className="neu-flat p-5 rounded-3xl mb-6 flex items-center gap-4 relative overflow-hidden">
          {/* Mini Concentric Floral / Audio Disk */}
          <div className="w-18 h-18 rounded-full p-1.5 neu-flat-sm flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-[#e899cb] via-[#a89af8] to-[#6c8cf5] flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]">
              <Headphones className="w-6 h-6 text-white/95 drop-shadow-sm" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full neu-inset-sm text-indigo-600 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              Active Practice
            </div>
            <h2 className="text-base font-black text-slate-800 leading-tight">
              Workplace Fluency Engine
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Instant feedback on speech, clarity & grammar
            </p>
          </div>
        </div>

        {/* 3. RESUME SESSION BANNER (IF ACTIVE) */}
        {progress?.activeSession && (
          <div 
            onClick={() => navigate(progress.activeSession!.route)}
            className="neu-inset p-4 rounded-3xl mb-5 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-all border border-indigo-200/50"
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

        {/* 4. TACTILE PRACTICE ACTION CARDS */}
        <div className="space-y-3.5 mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Choose Fluency Drill
          </div>

          {/* Drill 1: Translate & Speak */}
          <div 
            onClick={() => navigate('english-practice-translate')} 
            className="neu-flat p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="w-12 h-12 rounded-full neu-btn-circle flex items-center justify-center text-indigo-600 group-hover:text-indigo-800 shrink-0">
              <Mic className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-slate-800">
                Translate & Speak
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {sentences.length} daily drills with real-time accent scoring
              </p>
            </div>
            <div className="w-8 h-8 rounded-full neu-btn-circle flex items-center justify-center text-slate-400 group-hover:text-slate-700 shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Drill 2: Answer & Improve */}
          <div 
            onClick={() => navigate('english-practice-answer')} 
            className="neu-flat p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="w-12 h-12 rounded-full neu-btn-circle flex items-center justify-center text-emerald-600 group-hover:text-emerald-800 shrink-0">
              <MessageCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-slate-800">
                Answer & Improve
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {questions.length} workplace scenarios with AI polish
              </p>
            </div>
            <div className="w-8 h-8 rounded-full neu-btn-circle flex items-center justify-center text-slate-400 group-hover:text-slate-700 shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Drill 3: Real Conversations */}
          <div 
            onClick={() => navigate('english-practice-real')} 
            className="neu-flat p-4 rounded-2xl flex items-center gap-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="w-12 h-12 rounded-full neu-btn-circle flex items-center justify-center text-rose-600 group-hover:text-rose-800 shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-slate-800">
                Real Roleplays
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {situations.length} realistic floor manager dialogues
              </p>
            </div>
            <div className="w-8 h-8 rounded-full neu-btn-circle flex items-center justify-center text-slate-400 group-hover:text-slate-700 shrink-0">
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* 5. SENTENCE VAULT & FORMULAE */}
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 mb-2.5">
            Knowledge Vault
          </div>
          
          <div 
            onClick={() => navigate('english-practice-library')} 
            className="neu-flat p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full neu-glow-btn flex items-center justify-center text-white shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-800">
                  Grammar Formulae & Sentence Vault
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  100+ patterns to construct sentences naturally
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
          </div>
        </div>

        {/* 6. STATS METRICS ROW */}
        <div className="grid grid-cols-2 gap-3 mb-2">
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
