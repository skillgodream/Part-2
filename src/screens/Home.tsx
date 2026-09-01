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
    <div className="w-full min-h-screen bg-[#DCEAF0] flex flex-col pb-36 overflow-y-auto select-none">
      
      {/* 1. HERO BANNER - Preserved full size and height */}
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
      
      {/* 2. COMPACT CARD CONTENT CONTAINER (Smaller cards to fit comfortably above menu dock) */}
      <div className="px-4 flex flex-col gap-2 pt-2.5">
        
        {/* MAIN COMPACT CARD: Your Career skills */}
        <div 
          onClick={() => navigate('choose-skill')}
          className="w-full bg-white rounded-[20px] py-2 px-3.5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_10px_24px_-4px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 cursor-pointer transition-all duration-300 flex flex-col items-center text-center relative group"
        >
          {/* Top Label */}
          <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Skill Mastery
          </span>

          {/* Centered Avatar Icon Ring */}
          <div className="relative mb-1 transition-transform duration-300 group-hover:scale-105">
            <div className="w-9 h-9 rounded-full p-[2px] border-2 border-emerald-500/40 group-hover:border-emerald-500 group-hover:ring-2 group-hover:ring-emerald-400/20 flex items-center justify-center transition-all">
              <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-white rounded-full p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
            Your Career skills
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-tight max-w-[240px]">
            Unlock your path to professional growth & certifications
          </p>

          <div className="absolute top-2.5 right-3 text-slate-300 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        
        {/* SUPPLEMENTARY COMPACT CARDS (2-Column Grid) */}
        <section className="grid grid-cols-2 gap-2">
          {/* Reel To Skill */}
          <button
            onClick={() => navigate('library')}
            className="flex flex-col items-center justify-center py-2 px-2 bg-white rounded-[16px] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.05)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_8px_18px_-4px_rgba(16,185,129,0.16)] hover:-translate-y-0.5 transition-all duration-300 text-center group cursor-pointer"
          >
            <div className="w-8 h-8 bg-slate-50 group-hover:bg-emerald-50 group-hover:border border-emerald-500 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 transform group-hover:scale-105">
              <Clapperboard className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="text-[11px] text-slate-800 font-bold tracking-tight group-hover:text-emerald-700 transition-colors">Reel To Skill</span>
            <span className="text-[9px] text-slate-400 font-medium">Short video lessons</span>
          </button>

          {/* AI Roleplay */}
          <button
            onClick={() => navigate('roleplay', { returnTo: 'role-detail', roleId: 'warehouse-associate' })}
            className="flex flex-col items-center justify-center py-2 px-2 bg-white rounded-[16px] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.05)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_8px_18px_-4px_rgba(16,185,129,0.16)] hover:-translate-y-0.5 transition-all duration-300 text-center group cursor-pointer"
          >
            <div className="w-8 h-8 bg-slate-50 group-hover:bg-emerald-50 group-hover:border border-emerald-500 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 transform group-hover:scale-105">
              <Bot className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            </div>
            <span className="text-[11px] text-slate-800 font-bold tracking-tight group-hover:text-emerald-700 transition-colors">AI Roleplay</span>
            <span className="text-[9px] text-slate-400 font-medium">Interactive practice</span>
          </button>
        </section>

      </div>
    </div>
  );
}


