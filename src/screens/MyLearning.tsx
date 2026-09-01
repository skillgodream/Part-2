import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Search, 
  User, 
  Menu, 
  MapPin, 
  Clock, 
  Zap, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Sparkles,
  Play,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Target,
  FileCheck,
  Video,
  ShieldCheck,
  Package,
  Layers,
  BarChart3,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { JOB_ROLES, LIBRARY_ITEMS } from '../lib/catalog';
import { enrollmentStore, cartStore, useEnrollmentState } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, LibraryItem, Enrollment } from '../lib/types';
import { Modal } from '../components/ui';

// ============================================================================
// RETRO BLUE SCOOTER ILLUSTRATION (Exact replica of the reference cartoon vector)
// ============================================================================
export function RetroBlueScooter({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="scooterBodyBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FA5FF" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="scooterLightBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="scooterWhiteShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="seatGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#334155" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground Contact Shadow */}
      <ellipse cx="200" cy="285" rx="145" ry="18" fill="url(#groundShadow)" />

      {/* Rear Wheel System */}
      <g id="rear-wheel">
        <circle cx="120" cy="225" r="48" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <circle cx="120" cy="225" r="41" fill="#334155" />
        <circle cx="120" cy="225" r="32" fill="url(#scooterWhiteShine)" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="120" cy="225" r="22" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="120" cy="225" r="12" fill="#0F172A" />
        <circle cx="120" cy="225" r="6" fill="#94A3B8" />
      </g>

      {/* Front Wheel System */}
      <g id="front-wheel">
        <circle cx="295" cy="225" r="48" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <circle cx="295" cy="225" r="41" fill="#334155" />
        <circle cx="295" cy="225" r="32" fill="url(#scooterWhiteShine)" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="295" cy="225" r="22" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="295" cy="225" r="12" fill="#0F172A" />
        <circle cx="295" cy="225" r="6" fill="#94A3B8" />
      </g>

      {/* Kickstand */}
      <g id="kickstand">
        <path d="M 185 240 L 175 282 L 182 284 L 194 240 Z" fill="#0F172A" />
        <circle cx="180" cy="283" r="3" fill="#64748B" />
      </g>

      {/* Exhaust Muffler Pipe */}
      <g id="exhaust">
        <path d="M 85 240 C 70 235 60 215 90 210 L 155 210 C 165 210 170 225 155 245 C 135 258 100 248 85 240 Z" 
              fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <ellipse cx="78" cy="232" rx="7" ry="12" fill="#0F172A" />
      </g>

      {/* Rear Engine Bodywork & Fender */}
      <g id="rear-chassis">
        <path d="M 50 210 C 45 180 65 145 120 140 C 180 135 205 165 210 215 C 205 245 170 255 120 255 C 75 255 55 235 50 210 Z" 
              fill="url(#scooterBodyBlue)" stroke="#0F172A" strokeWidth="3.5" />
        
        {/* White Curved Side Cowl Panel */}
        <path d="M 68 200 C 65 175 80 155 120 152 C 160 150 175 175 178 205 C 172 230 150 240 115 240 C 85 240 70 220 68 200 Z" 
              fill="url(#scooterWhiteShine)" stroke="#0F172A" strokeWidth="2.5" />

        {/* Side Vents Air Slits */}
        <path d="M 95 180 L 140 180 M 93 190 L 142 190 M 98 200 L 138 200" 
              stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

        {/* Rear Taillight */}
        <path d="M 46 185 C 40 185 38 195 44 202 L 52 198 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
      </g>

      {/* Footboard Platform & Chrome Side Trim */}
      <g id="footboard">
        <path d="M 140 235 C 180 238 240 235 270 210 L 275 220 C 240 248 180 250 135 245 Z" 
              fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
        <path d="M 155 238 L 245 230" stroke="#0F172A" strokeWidth="2" strokeDasharray="6 4" />
      </g>

      {/* Front Legshield / Fairing */}
      <g id="front-fairing">
        <path d="M 215 160 C 225 105 260 85 275 85 C 285 85 300 110 305 160 C 310 200 300 230 270 230 C 235 230 210 200 215 160 Z" 
              fill="url(#scooterBodyBlue)" stroke="#0F172A" strokeWidth="3.5" />
        
        {/* Glovebox Column */}
        <path d="M 228 150 C 235 125 255 120 262 120 C 270 120 275 130 275 165 C 272 190 255 195 240 195 C 230 195 225 175 228 150 Z" 
              fill="#1D4ED8" stroke="#0F172A" strokeWidth="2" />
        
        {/* Chrome Fairing Edge */}
        <path d="M 270 86 C 285 88 303 115 306 160 C 310 195 302 225 275 228" 
              stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* Front Mudguard */}
      <g id="front-mudguard">
        <path d="M 260 205 C 265 175 295 170 325 185 C 335 195 338 215 330 228 C 315 220 295 215 260 205 Z" 
              fill="url(#scooterBodyBlue)" stroke="#0F172A" strokeWidth="3" />
        <path d="M 285 172 C 300 172 312 178 318 184" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Saddle */}
      <g id="seat">
        <path d="M 90 152 C 85 140 105 120 140 120 C 180 120 195 138 200 150 Z" fill="#0F172A" />
        <path d="M 85 148 C 80 135 105 115 145 115 C 185 115 202 135 205 148 C 185 152 140 152 85 148 Z" 
              fill="url(#seatGradient)" stroke="#0F172A" strokeWidth="3" />
        <path d="M 92 144 C 115 130 165 130 198 142" stroke="#93C5FD" strokeWidth="2" fill="none" />
        <path d="M 88 150 C 75 148 70 135 80 130 L 95 130" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* Handlebars & Headlamp */}
      <g id="handlebar-assembly">
        <path d="M 268 95 L 255 60 L 265 58 L 278 95 Z" fill="url(#scooterBodyBlue)" stroke="#0F172A" strokeWidth="2.5" />
        <ellipse cx="254" cy="52" rx="14" ry="12" fill="url(#scooterBodyBlue)" stroke="#0F172A" strokeWidth="3" />
        <ellipse cx="260" cy="52" rx="8" ry="10" fill="#E0F2FE" stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="262" cy="50" rx="3" ry="5" fill="#FFFFFF" />

        <path d="M 245 54 L 228 58" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
        <path d="M 230 57 L 226 58" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" />
        <path d="M 262 52 L 278 50" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />

        {/* Mirrors */}
        <path d="M 238 52 Q 228 35 220 28" stroke="#0F172A" strokeWidth="2.5" fill="none" />
        <circle cx="218" cy="26" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        <path d="M 252 48 Q 256 30 258 20" stroke="#0F172A" strokeWidth="2.5" fill="none" />
        <circle cx="258" cy="18" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
      </g>

      {/* Highlights */}
      <path d="M 120 148 Q 155 145 185 160" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="270" cy="100" r="3" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

// ============================================================================
// TECH REEL SCOOTER ILLUSTRATION (For Reel-to-Skill View)
// ============================================================================
export function TechReelScooter({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="techBlueGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <radialGradient id="techShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0369A1" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#0F172A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="285" rx="145" ry="16" fill="url(#techShadow)" />

      {/* Speed Lines */}
      <path d="M 20 190 L 70 190 M 10 220 L 50 220 M 35 150 L 75 150" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" opacity="0.5" strokeDasharray="8 6" />

      {/* Wheels */}
      <circle cx="115" cy="225" r="48" fill="#0F172A" stroke="#0284C7" strokeWidth="2.5" />
      <circle cx="115" cy="225" r="34" fill="#1E293B" />
      <circle cx="115" cy="225" r="20" fill="#38BDF8" opacity="0.4" />
      <circle cx="115" cy="225" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

      <circle cx="295" cy="225" r="48" fill="#0F172A" stroke="#0284C7" strokeWidth="2.5" />
      <circle cx="295" cy="225" r="34" fill="#1E293B" />
      <circle cx="295" cy="225" r="20" fill="#38BDF8" opacity="0.4" />
      <circle cx="295" cy="225" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

      {/* Kickstand */}
      <path d="M 180 240 L 170 282 L 180 284 L 190 240 Z" fill="#0F172A" />

      {/* Bodywork */}
      <path d="M 55 210 C 50 170 80 135 130 135 C 190 135 210 170 215 220 C 195 248 150 252 110 252 C 70 252 58 230 55 210 Z" 
            fill="url(#techBlueGrad)" stroke="#0F172A" strokeWidth="3.5" />
      
      <path d="M 75 195 C 70 170 90 150 130 148 C 170 145 185 170 188 198 C 175 225 140 235 105 235 C 80 235 75 215 75 195 Z" 
            fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />

      {/* Play Icon Graphic */}
      <circle cx="130" cy="190" r="18" fill="#0284C7" />
      <path d="M 125 180 L 140 190 L 125 200 Z" fill="#FFFFFF" />

      {/* Fairing */}
      <path d="M 215 155 C 230 95 265 80 280 80 C 290 80 305 105 310 155 C 315 200 300 230 270 230 C 235 230 210 200 215 155 Z" 
            fill="url(#techBlueGrad)" stroke="#0F172A" strokeWidth="3.5" />
      
      <path d="M 260 95 L 275 175 L 268 175 L 255 95 Z" fill="#38BDF8" />
      <path d="M 260 205 C 265 175 300 170 330 185 C 340 195 338 215 330 228 C 315 220 295 215 260 205 Z" 
            fill="url(#techBlueGrad)" stroke="#0F172A" strokeWidth="3" />

      {/* Saddle */}
      <path d="M 85 142 C 80 130 110 112 150 112 C 185 112 205 130 208 142 C 185 146 140 146 85 142 Z" 
            fill="#0F172A" stroke="#0284C7" strokeWidth="3" />

      {/* Headlight */}
      <ellipse cx="258" cy="50" rx="14" ry="10" fill="url(#techBlueGrad)" stroke="#0F172A" strokeWidth="3" />
      <ellipse cx="264" cy="50" rx="8" ry="8" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
      <circle cx="266" cy="48" r="3" fill="#FFFFFF" />

      <path d="M 245 52 L 228 54" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
      <path d="M 265 50 L 282 48" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function MyLearningScreen() {
  const { navigate } = useRouter();
  const { profile } = useEnrollmentState();

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => enrollmentStore.getEnrollments());
  const [purchasedLibraryItemIds, setPurchasedLibraryItemIds] = useState<string[]>(() => cartStore.getPurchasedLibraryItemIds());

  // Active Swipe Category: 'career' (Career Skills) | 'reel' (Reel to Skill)
  const [activeCategory, setActiveCategory] = useState<'career' | 'reel'>('career');

  // Active Video Modal for Reel Preview
  const [activeReelModal, setActiveReelModal] = useState<LibraryItem | null>(null);

  // Swipe detection touch state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setEnrollments(enrollmentStore.getEnrollments());
      setPurchasedLibraryItemIds(cartStore.getPurchasedLibraryItemIds());
    };

    window.addEventListener('skillgo_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('skillgo_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Purchased Career Skills
  const purchasedCareerRoles = enrollments.map(enr => {
    const role = JOB_ROLES.find(r => r.id === enr.roleId);
    return { enrollment: enr, role };
  }).filter(item => item.role !== undefined) as { enrollment: Enrollment; role: JobRole }[];

  const primaryCareerRole = purchasedCareerRoles[0]?.role || JOB_ROLES[0];
  const secondaryCareerRole = purchasedCareerRoles[1]?.role || JOB_ROLES[1];

  // Purchased Reel Items
  const purchasedReelItems = purchasedLibraryItemIds.map(id => {
    return LIBRARY_ITEMS.find(item => item.id === id);
  }).filter(item => item !== undefined) as LibraryItem[];

  const primaryReelItem = purchasedReelItems[0] || LIBRARY_ITEMS[0];
  const secondaryReelItem = purchasedReelItems[1] || LIBRARY_ITEMS[1];

  // Touch Swipe Handlers (Differentiates between horizontal swipe and vertical scroll)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = touchStartX - endX;
    const diffY = touchStartY - endY;

    // Only trigger horizontal category swipe if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0 && activeCategory === 'career') {
        setActiveCategory('reel');
      } else if (diffX < 0 && activeCategory === 'reel') {
        setActiveCategory('career');
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] flex justify-center selection:bg-sky-200">
      
      {/* Mobile-First Frame Container (Vertically Scrollable with smooth momentum) */}
      <div 
        className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col pb-24"
      >
        
        {/* =========================================================================
            1. TOP STATUS & NAVIGATION BAR (Exact Replica of Mockup Header)
           ========================================================================= */}
        <div className="pt-3 px-6 shrink-0 space-y-2 z-20 bg-white sticky top-0 border-b border-slate-100/60 pb-2">
          
          {/* Mockup Status Bar: 10:41 | 5G & Battery */}
          <div className="flex items-center justify-between text-slate-800 text-xs font-black tracking-tight">
            <span>10:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold">5G</span>
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-0.5 h-1 bg-slate-800 rounded-xs" />
                <div className="w-0.5 h-1.5 bg-slate-800 rounded-xs" />
                <div className="w-0.5 h-2 bg-slate-800 rounded-xs" />
                <div className="w-0.5 h-2.5 bg-slate-800 rounded-xs" />
              </div>
              <div className="w-5 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Navigation Bar: Left Blue Circle Icon | Center Subtext | Scroll Indicator | Hamburger Menu */}
          <div className="flex items-center justify-between pt-1">
            
            {/* Left Circular Blue Icon */}
            <div 
              onClick={() => navigate('home')}
              className="w-9 h-9 rounded-full bg-[#1A73E8] shadow-md flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform"
            >
              <span className="font-black text-base italic font-serif">h</span>
            </div>

            {/* Subtext description next to brand icon */}
            <div className="flex-1 px-3">
              <span className="text-[11px] font-bold text-slate-800 block leading-tight truncate">
                {activeCategory === 'career' ? 'Career Skills Certification' : 'Reel to Skill Masterclass'}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 block leading-tight">
                {activeCategory === 'career' ? 'Interactive Vocational Training' : '5-Min Tactical Operating SOPs'}
              </span>
            </div>

            {/* Scroll / Swipe page indicator (Scroll 1/2 or Scroll 2/2) */}
            <div 
              onClick={() => setActiveCategory(activeCategory === 'career' ? 'reel' : 'career')}
              className="text-[11px] font-extrabold text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              {activeCategory === 'career' ? 'Scroll 1/2' : 'Scroll 2/2'}
            </div>

            {/* Right Hamburger Menu Icon */}
            <button 
              onClick={() => navigate('choose-skill')}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors cursor-pointer ml-1"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>

          </div>

        </div>

        {/* =========================================================================
            2. HERO CARTOON SHOWCASE BANNER (SWIPEABLE RIGHT & LEFT)
           ========================================================================= */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[310px] flex items-center justify-center px-4 overflow-hidden shrink-0"
        >
          
          {/* Soft Curved Wave Background Graphic (Slate / Blue tint) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 320" fill="none" preserveAspectRatio="none">
              <path d="M 0 60 Q 200 20 400 90 L 400 320 L 0 320 Z" fill="#F4F8FC" opacity="0.9" />
              <circle cx="200" cy="180" r="130" fill="#EBF3FC" opacity="0.7" />
            </svg>
          </div>

          {/* Swipe Indicator Arrows */}
          <button 
            onClick={() => setActiveCategory('career')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md shadow-sm border border-slate-200/60 flex items-center justify-center text-slate-600 z-10 transition-all ${activeCategory === 'career' ? 'opacity-25 cursor-default' : 'opacity-90 hover:scale-105 cursor-pointer'}`}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button 
            onClick={() => setActiveCategory('reel')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md shadow-sm border border-slate-200/60 flex items-center justify-center text-slate-600 z-10 transition-all ${activeCategory === 'reel' ? 'opacity-25 cursor-default' : 'opacity-90 hover:scale-105 cursor-pointer'}`}
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* DYNAMIC SWIPEABLE CARTOON VEHICLE DISPLAY */}
          <div className="relative z-10 w-full max-w-[320px] h-[250px] flex items-center justify-center transition-all duration-500 ease-out">
            {activeCategory === 'career' ? (
              <div 
                key="career-banner" 
                className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300"
              >
                <RetroBlueScooter className="w-full h-full drop-shadow-md" />
              </div>
            ) : (
              <div 
                key="reel-banner" 
                className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300"
              >
                <TechReelScooter className="w-full h-full drop-shadow-md" />
              </div>
            )}
          </div>

          {/* Swipe Dots Indicator */}
          <div className="absolute bottom-2 flex items-center gap-1.5 z-10">
            <div 
              onClick={() => setActiveCategory('career')}
              className={`h-2 rounded-full transition-all cursor-pointer ${activeCategory === 'career' ? 'w-6 bg-[#0094FF]' : 'w-2 bg-slate-300'}`} 
            />
            <div 
              onClick={() => setActiveCategory('reel')}
              className={`h-2 rounded-full transition-all cursor-pointer ${activeCategory === 'reel' ? 'w-6 bg-[#0094FF]' : 'w-2 bg-slate-300'}`} 
            />
          </div>

        </div>

        {/* =========================================================================
            3. MIDDLE CONTROL SEGMENT (Left Blue Pill & Right Search/Profile Pill)
           ========================================================================= */}
        <div className="px-6 py-2 shrink-0 z-20">
          <div className="flex items-center gap-3">
            
            {/* Left Vibrant Blue Pill Button ("Pell" / Active Category Name) */}
            <button
              onClick={() => setActiveCategory(activeCategory === 'career' ? 'reel' : 'career')}
              className="bg-[#2684FF] hover:bg-[#1A73E8] active:scale-95 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-[0_4px_16px_rgba(38,132,255,0.3)] transition-all cursor-pointer tracking-wider shrink-0"
            >
              {activeCategory === 'career' ? 'Pell' : 'Reels'}
            </button>

            {/* Right Soft Light Pill Container with Profile Icon & Search Icon */}
            <div 
              onClick={() => navigate(activeCategory === 'career' ? 'choose-skill' : 'library')}
              className="flex-1 bg-[#F1F4F9] hover:bg-[#EAEFF6] px-4 py-2.5 rounded-full flex items-center justify-between text-slate-500 cursor-pointer transition-colors shadow-2xs border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#0094FF] text-white flex items-center justify-center text-[10px]">
                  <User className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {activeCategory === 'career' ? 'Courses' : 'Masterclasses'}
                </span>
              </div>
              <Search className="w-4 h-4 text-[#0094FF] stroke-[2.5]" />
            </div>

          </div>
        </div>

        {/* =========================================================================
            4. INFORMATION SECTION: "calll now / Snor Cotororf" & TWO SIDE-BY-SIDE CARDS
           ========================================================================= */}
        <div className="px-6 py-3 space-y-3 shrink-0 z-20">
          
          {/* Main Title & Blue Subtitle */}
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {activeCategory === 'career' ? 'calll now' : 'watch now'}
            </h3>
            <span className="text-xs font-extrabold text-[#0094FF] block leading-tight">
              {activeCategory === 'career' ? 'Career Certification Hub' : 'Reel to Skill Library'}
            </span>
          </div>

          {/* TWO SIDE-BY-SIDE SOFT BLUE CARDS (Exact replica of mockup layout) */}
          <div className="grid grid-cols-2 gap-3.5">
            
            {/* CARD 1: PRIMARY ROLE / REEL */}
            <div
              onClick={() => {
                if (activeCategory === 'career') {
                  navigate('course-modules', { roleId: primaryCareerRole.id, plan: 'pro' });
                } else {
                  navigate('library-detail', { libraryId: primaryReelItem.id });
                }
              }}
              className="bg-[#E7ECF4] hover:bg-[#DEE5EF] active:scale-98 rounded-3xl p-3 flex flex-col justify-between shadow-xs transition-all cursor-pointer group border border-slate-200/60 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-12 flex items-center justify-center">
                  <RetroBlueScooter className="w-full h-full group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[10px] font-black text-slate-700 bg-white/80 px-2 py-0.5 rounded-full shadow-2xs">
                  {activeCategory === 'career' ? '$89' : '5 min'}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-300/40">
                <span className="text-xs font-black text-slate-900 truncate">
                  {activeCategory === 'career' ? 'Warehouse QC' : primaryReelItem.title}
                </span>
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
              </div>
            </div>

            {/* CARD 2: SECONDARY ROLE / REEL */}
            <div
              onClick={() => {
                if (activeCategory === 'career') {
                  navigate('role-detail', { roleId: secondaryCareerRole.id });
                } else {
                  navigate('library-detail', { libraryId: secondaryReelItem.id });
                }
              }}
              className="bg-[#E7ECF4] hover:bg-[#DEE5EF] active:scale-98 rounded-3xl p-3 flex flex-col justify-between shadow-xs transition-all cursor-pointer group border border-slate-200/60 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-12 flex items-center justify-center">
                  <TechReelScooter className="w-full h-full group-hover:scale-105 transition-transform" />
                </div>
                <div className="w-5 h-5 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-[#0094FF]">
                  <Sparkles className="w-3 h-3 text-[#0094FF]" />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-300/40">
                <span className="text-xs font-black text-slate-900 truncate">
                  {activeCategory === 'career' ? 'QC Inbound' : secondaryReelItem.title}
                </span>
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            5. BOTTOM ACTION BAR: USER AVATAR PILL + SOLID BLUE "CALL NOW" PILL
           ========================================================================= */}
        <div className="px-6 pt-2 pb-3 shrink-0 z-20">
          <div className="flex items-center gap-3">
            
            {/* Left Pill: User Avatar + Name ("Jesus Peters") */}
            <div 
              onClick={() => navigate('my-dashboard')}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-200/80 px-3 py-2.5 rounded-full flex items-center gap-2.5 shadow-xs cursor-pointer transition-all"
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                alt="Learner" 
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs font-black text-slate-900 truncate">
                {profile?.fullName || 'Jesus Peters'}
              </span>
            </div>

            {/* Right Solid Blue Button: "Aall now" with Chevron Up */}
            <button
              onClick={() => {
                if (activeCategory === 'career') {
                  navigate('course-modules', { roleId: primaryCareerRole.id });
                } else {
                  navigate('library');
                }
              }}
              className="flex-1 bg-[#1A62E8] hover:bg-[#1554C8] active:scale-98 text-white font-extrabold text-xs py-3 px-4 rounded-full shadow-[0_6px_20px_rgba(26,98,232,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
            >
              <span>Aall now</span>
              <ChevronUp className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        </div>

        {/* =========================================================================
            6. FLOATING BOTTOM ICON DOCK (5 Soft Rounded Icon Pills)
           ========================================================================= */}
        <div className="px-6 pb-6 pt-1 flex items-center justify-between shrink-0 z-20">
          
          <button 
            onClick={() => navigate('interview-prep')}
            className="w-11 h-10 rounded-2xl bg-[#E2EAF4] hover:bg-[#D3E0EE] active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Interview Prep"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button 
            onClick={() => navigate('choose-skill')}
            className="w-11 h-10 rounded-2xl bg-[#E2EAF4] hover:bg-[#D3E0EE] active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Explore Skills"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>

          <button 
            onClick={() => navigate('practical-training')}
            className="w-11 h-10 rounded-2xl bg-[#E2EAF4] hover:bg-[#D3E0EE] active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Practical Simulation Lab"
          >
            <Zap className="w-4 h-4" />
          </button>

          <button 
            onClick={() => navigate('certificate')}
            className="w-11 h-10 rounded-2xl bg-[#E2EAF4] hover:bg-[#D3E0EE] active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Certificates"
          >
            <Award className="w-4 h-4" />
          </button>

          <button 
            onClick={() => navigate('my-dashboard')}
            className="w-11 h-10 rounded-2xl bg-[#E2EAF4] hover:bg-[#D3E0EE] active:scale-95 flex items-center justify-center text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="My Dashboard & Velocity"
          >
            <Clock className="w-4 h-4" />
          </button>

        </div>

        {/* =========================================================================
            7. EXPANDED SCROLLABLE CONTENT SECTION (INTELLIGENT DYNAMIC FEED)
            When Career Skill is selected -> All Career Information comes
            When Reel to Skill is selected -> All Reel to Skill Information comes
           ========================================================================= */}
        <div className="px-6 pt-2 pb-8 space-y-6 border-t border-slate-100 bg-[#F8FAFC]">

          {/* DYNAMIC CONTENT FOR CAREER SKILL MODE */}
          {activeCategory === 'career' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* SECTION 1: Active Enrollment Status & Progress */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black tracking-wider uppercase text-slate-500">Active Curriculum</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#0094FF] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    65% Mastered
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">{primaryCareerRole.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{primaryCareerRole.shortDescription || primaryCareerRole.fullDescription}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-[#0094FF] h-full rounded-full w-[65%]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>4 of 6 Modules Completed</span>
                    <span>~3.5 hrs left</span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={() => navigate('course-modules', { roleId: primaryCareerRole.id, plan: 'pro' })}
                  className="w-full py-3 bg-[#1A73E8] hover:bg-[#155CBD] active:scale-98 text-white text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Next Module: Inventory Discrepancy SOP</span>
                </button>
              </div>

              {/* SECTION 2: Core Course Modules Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#0094FF]" />
                    <span>Certified Modules Curriculum</span>
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">6 Modules</span>
                </div>

                <div className="space-y-2.5">
                  {primaryCareerRole.modules.map((mod, idx) => (
                    <div 
                      key={mod.id || idx}
                      onClick={() => navigate('course-modules', { roleId: primaryCareerRole.id, plan: 'pro' })}
                      className="bg-white hover:bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${idx < 4 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                          {idx < 4 ? <CheckCircle2 className="w-4 h-4" /> : `0${idx + 1}`}
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-slate-900">{mod.title}</h5>
                          <span className="text-[10px] text-slate-400 font-semibold">{mod.durationMinutes || 45} mins • Practical Lab & Quiz</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Competency Matrix & Diagnostic Scores */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#0094FF]" />
                  <span>Vocational Mastery Matrix</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Warehouse Safety & OSHA Protocols</span>
                      <span className="text-emerald-600 font-extrabold">98%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>RF Scanner & Barcode Systems</span>
                      <span className="text-blue-600 font-extrabold">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Pallet Stacking & QC Inspection</span>
                      <span className="text-amber-600 font-extrabold">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[85%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Inventory Reconciliation & ERP</span>
                      <span className="text-indigo-600 font-extrabold">78%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full w-[78%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Practical Simulation Lab Access */}
              <div 
                onClick={() => navigate('practical-training')}
                className="bg-gradient-to-br from-[#1A73E8] to-[#0052CC] rounded-3xl p-5 text-white shadow-md cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                      Interactive VR Lab
                    </span>
                    <h4 className="text-base font-black mt-2">Inbound Receiving & Inspection</h4>
                    <p className="text-xs text-sky-100 mt-1">Practice forklift dock safety and barcode scanning in realistic 3D simulation.</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-yellow-300" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold">
                  <span>Start Practical Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          ) : (
            /* DYNAMIC CONTENT FOR REEL TO SKILL MODE */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* SECTION 1: Featured 5-Minute Tactical Reels */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>Trending Reel Masterclasses</span>
                  </h4>
                  <button 
                    onClick={() => navigate('library')}
                    className="text-[11px] font-extrabold text-[#0094FF] hover:underline"
                  >
                    View All ({LIBRARY_ITEMS.length})
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {LIBRARY_ITEMS.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => navigate('library-detail', { libraryId: item.id })}
                      className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer shadow-2xs transition-all group"
                    >
                      {/* Video Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-slate-900">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80'} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#0094FF]">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-black text-white px-1.5 py-0.5 rounded">
                          {item.duration}
                        </span>
                      </div>

                      {/* Video Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold uppercase bg-sky-50 text-[#0094FF] px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">★ 4.9 (1.2k)</span>
                        </div>
                        <h5 className="text-xs font-black text-slate-900 mt-1 truncate">{item.title}</h5>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.summary}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>{item.level || 'Beginner'}</span>
                          <span className="text-[#0094FF] flex items-center gap-0.5">
                            Watch Reel <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: Reel-to-Skill Tactical SOP Highlights */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Tactical Standard Operating Procedures</span>
                </h4>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">Dock Safety Verification SOP</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Step-by-step 3-minute reel checklist</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">Heavy Pallet Wrap & Corner Securing</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Zero damage loading technique</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      Play SOP
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
