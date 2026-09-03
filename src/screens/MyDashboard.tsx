import React, { useState } from 'react';
import { 
  Bell, 
  ChevronRight, 
  BookOpen, 
  Award, 
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  FileText,
  HelpCircle,
  Wrench,
  GraduationCap,
  Users,
  TrendingUp
} from 'lucide-react';
import { useEnrollmentState } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JOB_ROLES } from '../lib/catalog';

export function MyDashboardScreen() {
  const { navigate } = useRouter();
  const { profile, activeEnrollment, role: currentRole } = useEnrollmentState();
  const [activityFilter, setActivityFilter] = useState<'This Week' | 'This Month'>('This Week');

  const role = currentRole || JOB_ROLES[0];
  const roleEmoji = role.id.includes('f-b') ? '👨‍🍳' : role.id.includes('warehouse') ? '📦' : role.id.includes('dark-store') ? '⚡' : '🏢';
  const completedCount = activeEnrollment?.completedModules?.length || 1;
  const totalCount = role.modules?.length || 4;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // 7-Day Activity data matching reference image
  const weeklyActivityData = [
    { day: 'M', count: 4, height: '55%' },
    { day: 'T', count: 8, height: '95%' },
    { day: 'W', count: 6, height: '70%' },
    { day: 'T', count: 9, height: '100%' },
    { day: 'F', count: 5, height: '60%' },
    { day: 'S', count: 8, height: '90%' },
    { day: 'S', count: 2, height: '30%' },
  ];

  return (
    <div id="my-dashboard-container" className="w-full min-h-screen bg-[#F5F8FC] flex justify-center selection:bg-blue-200 select-none pb-32 overflow-y-auto">
      
      {/* Mobile-First Container (~390px - 414px optimal width) */}
      <div className="w-full max-w-[412px] min-h-screen bg-[#F5F8FC] flex flex-col px-4 pt-3 space-y-4">
        
        {/* =========================================================================
            HEADER
           ========================================================================= */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-3">
            {/* Profile Avatar with initials */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md ring-2 ring-white">
              {profile.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'LE'}
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Good morning, {profile.name || 'Learner'}</span>
                <span className="inline-block">👋</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Here’s how your learning is going</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell with red dot */}
            <button 
              onClick={() => {}} 
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 relative cursor-pointer"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            1. COURSE PROGRESS — MAIN HERO GRADIENT CARD
           ========================================================================= */}
        <div className="w-[98%] mx-auto bg-gradient-to-br from-[#1E62FE] via-[#1652E1] to-[#0A3EC8] rounded-xl p-4 sm:p-5 text-white shadow-[0_18px_35px_rgba(30,98,254,0.35)] relative overflow-hidden min-h-[230px] flex flex-col justify-between">
          {/* Background decorative glow */}
          <div className="absolute right-0 top-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            
            {/* Top row: Title + Role Icon */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/75 block">YOUR COURSE</span>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">{role.title}</h2>
              </div>
              
              {/* Role Icon Circle */}
              <div className="w-12 h-12 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner shrink-0">
                <span className="text-xl">{roleEmoji}</span>
              </div>
            </div>

            {/* Middle Main Content: Circular Progress | Divider | Stats */}
            <div className="flex items-center gap-5 sm:gap-7 pt-2 pb-1">
              
              {/* Circular Progress (Left) */}
              <div className="flex flex-col items-center justify-center shrink-0 pr-2 sm:pr-4">
                <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/20"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-white drop-shadow-md"
                      strokeDasharray="60, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl sm:text-2xl font-black tracking-tight leading-none mb-0.5">60%</span>
                    <span className="text-[9px] font-bold text-white/85 uppercase tracking-wider">Completed</span>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-24 bg-white/25 shrink-0" />

              {/* Right Side Stats */}
              <div className="flex-1 space-y-3 pl-2">
                
                {/* Stat 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 text-white">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-white leading-tight block">6 of 10</span>
                    <span className="text-[10px] font-medium text-white/85 leading-tight block">Modules Completed</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 text-white">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] sm:text-xs font-black text-white leading-tight block">4 Modules Remaining</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 text-amber-300">
                    <Flame className="w-3.5 h-3.5 fill-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] sm:text-xs font-black text-white leading-tight block">18 Days Left</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* =========================================================================
            2. YOUR ACTIVITY
           ========================================================================= */}
        <div className="w-full mt-3 bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E62FE] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h2 className="text-sm font-black text-slate-900">Your Activity</h2>
            </div>
            
            {/* Filter Pill */}
            <div className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors">
              <span>{activityFilter}</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-400" />
            </div>
          </div>

          {/* Activities Completed Header */}
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">42</span>
            <span className="text-xs font-bold text-slate-500 ml-2">Activities Completed</span>
          </div>

          {/* 7-Day Activity Chart */}
          <div className="pt-2 pb-1">
            <div className="flex items-end justify-between h-28 px-1 relative">
              
              {/* Background horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="w-full border-b border-slate-100"></div>
                <div className="w-full border-b border-slate-100"></div>
                <div className="w-full border-b border-slate-100"></div>
              </div>

              {/* Vertical Bars */}
              {weeklyActivityData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 z-10 flex-1 group">
                  <div className="w-full max-w-[26px] bg-slate-100 rounded-xl h-20 flex items-end p-1">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg transition-all duration-500 group-hover:brightness-110 shadow-sm"
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Category Breakdown Below Chart */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
              <span className="text-base block mb-0.5">📖</span>
              <span className="text-xs font-black text-slate-900 block">28</span>
              <span className="text-[9px] font-bold text-slate-500 block uppercase">Learning</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
              <span className="text-base block mb-0.5">❓</span>
              <span className="text-xs font-black text-slate-900 block">8</span>
              <span className="text-[9px] font-bold text-slate-500 block uppercase">Quick Checks</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
              <span className="text-base block mb-0.5">🔧</span>
              <span className="text-xs font-black text-slate-900 block">4</span>
              <span className="text-[9px] font-bold text-slate-500 block uppercase">Practice</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
              <span className="text-base block mb-0.5">🎯</span>
              <span className="text-xs font-black text-slate-900 block">2</span>
              <span className="text-[9px] font-bold text-slate-500 block uppercase">Assessments</span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            3. YOUR PERFORMANCE
           ========================================================================= */}
        <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h2 className="text-sm font-black text-slate-900">Your Performance</h2>
            </div>
            
            <button 
              onClick={() => navigate('choose-skill')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>See Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Four Compact Colored Metric Tiles in 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Tile 1: Overall Score (Green) */}
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-900">Overall Score</span>
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-700 block tracking-tight">78%</span>
              </div>
            </div>

            {/* Tile 2: Practice Score (Blue) */}
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-900">Practice Score</span>
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Target className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-blue-600 block tracking-tight">82%</span>
              </div>
            </div>

            {/* Tile 3: Assessment Score (Orange) */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-amber-900">Assessment Score</span>
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-600 block tracking-tight">74%</span>
              </div>
            </div>

            {/* Tile 4: Best Score (Purple) */}
            <div className="bg-purple-50/70 border border-purple-200/60 rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-purple-900">Best Score</span>
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-purple-700 block tracking-tight">84%</span>
                </div>
                <span className="text-[10px] font-bold text-purple-600 block mt-0.5">Keep it up!</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            4. COURSE PROGRESS BY AREA
           ========================================================================= */}
        <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
          
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h2 className="text-sm font-black text-slate-900">Course Progress by Area</h2>
            </div>
          </div>

          {/* Four Equal Compact Tiles */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Tile 1: Core Course */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  📖
                </div>
                <span className="text-lg font-black text-emerald-600">60%</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Core Course</h3>
                <p className="text-[10px] text-slate-500 font-medium mb-2">6 / 10 Modules</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            {/* Tile 2: English Prep */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  🗣️
                </div>
                <span className="text-lg font-black text-amber-600">50%</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">English Prep</h3>
                <p className="text-[10px] text-slate-500 font-medium mb-2">3 / 6 Modules</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            {/* Tile 3: Interview Prep */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  👥
                </div>
                <span className="text-lg font-black text-purple-600">40%</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Interview Prep</h3>
                <p className="text-[10px] text-slate-500 font-medium mb-2">2 / 5 Modules</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>

            {/* Tile 4: Assessments */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  📋
                </div>
                <span className="text-lg font-black text-blue-600">70%</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Assessments</h3>
                <p className="text-[10px] text-slate-500 font-medium mb-2">7 / 10 Completed</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyDashboardScreen;
