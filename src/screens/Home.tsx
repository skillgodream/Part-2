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
      
      {/* 1. HERO BANNER - Increased length/height by 20% (from 52vh to 62.4vh) */}
      <section className="w-full px-4 pt-0 h-[62.4vh] shrink-0 relative">
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
              We Are Here to Help
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              For Your Dream Job
            </h1>
          </div>
        </div>
      </section>
      
      {/* 2. CARD CONTENT CONTAINER */}
      <div className="px-4 flex flex-col gap-2.5 pt-3">
        
        {/* MAIN CARD: Your Career skills (Size reduced by 15% - icons and text sizes preserved) */}
        <div 
          onClick={() => navigate('choose-skill')}
          className="w-full bg-white rounded-[22px] py-3 px-4 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_12px_28px_-4px_rgba(16,185,129,0.2)] hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col items-center text-center relative group"
        >
          {/* Top Label */}
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Skill Mastery
          </span>

          {/* Centered Avatar Icon Ring with Pop Up effect */}
          <div className="relative mb-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full p-[2.5px] border-2 border-emerald-500/40 group-hover:border-emerald-500 group-hover:ring-4 group-hover:ring-emerald-400/20 flex items-center justify-center transition-all">
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
          <h2 className="text-base font-bold text-slate-800 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
            Your Career skills
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug max-w-[250px]">
            Unlock your path to professional growth & certifications
          </p>

          <div className="absolute top-3.5 right-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        
        {/* SUPPLEMENTARY CARDS (2-Column Grid - Size reduced by 20% - icons and text sizes preserved) */}
        <section className="grid grid-cols-2 gap-2.5">
          {/* Reel To Skill */}
          <button
            onClick={() => navigate('library')}
            className="flex flex-col items-center justify-center py-2.5 px-2.5 bg-white rounded-[18px] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.05)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_10px_20px_-4px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer"
          >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-emerald-50 group-hover:border-2 group-hover:border-emerald-500 rounded-xl flex items-center justify-center mb-1 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-0.5">
              <Clapperboard className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="text-xs text-slate-800 font-bold tracking-tight group-hover:text-emerald-700 transition-colors">Reel To Skill</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Short video lessons</span>
          </button>

          {/* AI Roleplay */}
          <button
            onClick={() => navigate('roleplay', { returnTo: 'role-detail', roleId: 'warehouse-associate' })}
            className="flex flex-col items-center justify-center py-2.5 px-2.5 bg-white rounded-[18px] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.05)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_10px_20px_-4px_rgba(16,185,129,0.18)] hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer"
          >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-emerald-50 group-hover:border-2 group-hover:border-emerald-500 rounded-xl flex items-center justify-center mb-1 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-0.5">
              <Bot className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="text-xs text-slate-800 font-bold tracking-tight group-hover:text-emerald-700 transition-colors">AI Roleplay</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Interactive practice</span>
          </button>
        </section>

      </div>
    </div>
  );
}


