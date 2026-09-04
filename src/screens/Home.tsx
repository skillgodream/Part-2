import React, { useState, useEffect } from 'react';
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

const HERO_BANNERS = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    subtitle: 'We Are Here to Help',
    title: 'For Your Dream Job',
    alt: 'Traveler overlooking mountains'
  },
  {
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Skill Up Your Future',
    title: 'Industry-Ready Certifications',
    alt: 'Modern workspace collaboration'
  },
  {
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Learn & Grow',
    title: 'Master Practical Workplace SOPs',
    alt: 'Professional training session'
  },
  {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Accelerate Your Career',
    title: 'Verified Digital Credentials',
    alt: 'Team success and growth'
  },
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Confidence Guaranteed',
    title: 'AI-Powered Interview Practice',
    alt: 'Interview preparation'
  }
];

export function HomeScreen() {
  const { navigate } = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#B8D3DE] flex flex-col pb-44 overflow-y-auto select-none">
      
      {/* 1. HERO BANNER - Preserved full size and height with Auto-Scroll */}
      <section className="w-full px-4 pt-0 h-[48vh] sm:h-[62.4vh] shrink-0 relative">
        <div className="w-full h-full relative rounded-b-[36px] overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.18)]">
          {HERO_BANNERS.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent flex flex-col justify-end items-center text-center p-6 text-white">
                <span className="text-xs font-semibold tracking-widest uppercase text-sky-200/90 mb-1">
                  {banner.subtitle}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {banner.title}
                </h1>
              </div>
            </div>
          ))}
          
          {/* Translucent Logo */}
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
              <SkillGoLogo size="sm" theme="light" />
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {HERO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentBanner ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* 2. COMPACT CARD CONTENT CONTAINER (Smaller cards to fit comfortably above menu dock) */}
      <div className="px-4 flex flex-col gap-2 pt-2">
        
        {/* MAIN COMPACT CARD: Your Career skills */}
        <div 
          onClick={() => navigate('choose-skill')}
          className="w-full bg-white rounded-[22px] py-3.5 px-4 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] border border-slate-100/90 hover:border-emerald-500/80 hover:shadow-[0_10px_24px_-4px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 cursor-pointer transition-all duration-300 flex flex-col items-center text-center relative group"
        >
          {/* Top Label */}
          <span className="text-[11px] font-bold text-emerald-600 tracking-wide uppercase mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Skill Mastery
          </span>

          {/* Centered Avatar Icon Ring */}
          <div className="relative mb-1.5 transition-transform duration-300 group-hover:scale-105">
            <div className="w-11 h-11 rounded-full p-[2px] border-2 border-emerald-500/40 group-hover:border-emerald-500 group-hover:ring-2 group-hover:ring-emerald-400/20 flex items-center justify-center transition-all">
              <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <Briefcase className="w-5.5 h-5.5 stroke-[2.2]" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
            Your Career skills
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight max-w-[260px]">
            Unlock your path to professional growth & certifications
          </p>

          <div className="absolute top-3 right-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
            <ArrowUpRight className="w-4 h-4" />
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


