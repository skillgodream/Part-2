import React from 'react';
import { 
  Clapperboard, 
  Bot, 
  Briefcase, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useRouter } from '../lib/router';
import { SkillGoLogo } from '../components/ui';

export function HomeScreen() {
  const { navigate } = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#DCEAF0] flex flex-col pb-24 overflow-y-auto select-none">
      
      {/* 1. HERO BANNER - Starts from top edge, side margins, extends to 52vh */}
      <section className="w-full px-4 pt-0 h-[52vh] shrink-0 relative">
        <div className="w-full h-full relative rounded-b-[36px] overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Traveler overlooking mountains"
            className="w-full h-full object-cover"
          />
          
          {/* Translucent Logo */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <SkillGoLogo size="sm" theme="light" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent flex flex-col justify-end items-center text-center p-6 text-white">
            <span className="text-xs font-semibold tracking-widest uppercase text-sky-200/90 mb-1">
              World Travelling Agency
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              For Your Dream Trip
            </h1>
          </div>
        </div>
      </section>
      
      {/* 2. CARD CONTENT CONTAINER */}
      <div className="px-4 flex flex-col gap-3.5 pt-4">
        
        {/* MAIN CARD: Your Career skills */}
        <div 
          onClick={() => navigate('choose-skill')}
          className="w-full bg-white rounded-[26px] p-5 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.07)] border border-slate-100/90 cursor-pointer hover:shadow-md transition-all flex flex-col items-center text-center relative group"
        >
          {/* Top Label */}
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Skill Mastery
          </span>

          {/* Centered Avatar Icon Ring */}
          <div className="relative mb-2.5">
            <div className="w-14 h-14 rounded-full p-[3px] border-2 border-emerald-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <h2 className="text-base font-bold text-slate-800 tracking-tight leading-tight">
            Your Career skills
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug max-w-[250px]">
            Unlock your path to professional growth & certifications
          </p>

          <div className="absolute top-4 right-4 text-slate-300 group-hover:text-emerald-600 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        
        {/* SUPPLEMENTARY CARDS (2-Column Grid) */}
        <section className="grid grid-cols-2 gap-3.5">
          {/* Reel To Skill */}
          <button
            onClick={() => navigate('library')}
            className="flex flex-col items-center justify-center py-4 px-3 bg-white rounded-[22px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] border border-slate-100/90 hover:shadow-md transition-all text-center group"
          >
            <div className="w-11 h-11 bg-slate-50 group-hover:bg-rose-50 rounded-2xl flex items-center justify-center mb-2 transition-colors">
              <Clapperboard className="w-5 h-5 text-slate-600 group-hover:text-rose-600 transition-colors" />
            </div>
            <span className="text-xs text-slate-800 font-bold tracking-tight">Reel To Skill</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Short video lessons</span>
          </button>

          {/* AI Roleplay */}
          <button
            onClick={() => navigate('roleplay', { returnTo: 'role-detail', roleId: 'warehouse-associate' })}
            className="flex flex-col items-center justify-center py-4 px-3 bg-white rounded-[22px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] border border-slate-100/90 hover:shadow-md transition-all text-center group"
          >
            <div className="w-11 h-11 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center mb-2 transition-colors">
              <Bot className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-xs text-slate-800 font-bold tracking-tight">AI Roleplay</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Interactive practice</span>
          </button>
        </section>

      </div>
    </div>
  );
}


