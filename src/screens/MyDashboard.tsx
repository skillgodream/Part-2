import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  MapPin, 
  Calendar, 
  Ticket, 
  GraduationCap, 
  TrendingUp, 
  Hourglass,
  CheckCircle2,
  BookOpen,
  Zap,
  ChevronRight,
  Compass,
  Award,
  Sparkles,
  BarChart3,
  Flame,
  Clock,
  Target,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { Enrollment, JobRole } from '../lib/types';
import { Modal } from '../components/ui';

export function MyDashboardScreen() {
  const { navigate } = useRouter();
  const { certificates, profile } = useEnrollmentState();

  const allEnrollments: Enrollment[] = enrollmentStore.getEnrollments();
  const inProgressEnrollments = allEnrollments.filter(e => !e.isCompleted && !e.assessmentPassed);
  const completedEnrollments = allEnrollments.filter(e => e.isCompleted || e.assessmentPassed);

  // Time / Pace filter pill state: '2 min' | '5 min' | '15 min' | '10 min'
  const [selectedPace, setSelectedPace] = useState<'2 min' | '5 min' | '15 min' | '10 min'>('15 min');
  // Journey mode: 'departure' (Starting Career / Baseline) | 'arrival' (Target Role / Career Goal)
  const [journeyMode, setJourneyMode] = useState<'departure' | 'arrival'>('arrival');
  
  // Interactive Modals
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'none' | 'schedule' | 'tickets' | 'skills' | 'modules' | 'progress' | 'pending' | 'competency'>('none');

  // Metrics Calculations
  const totalSkillsCount = allEnrollments.length || 1;
  
  // Total completed modules across all enrolled skills
  const totalModulesLearned = allEnrollments.reduce((acc, curr) => {
    return acc + (curr.completedModules?.length || 0);
  }, 0);

  // Total modules available across enrolled skills
  const totalEnrolledModulesCount = allEnrollments.reduce((acc, curr) => {
    const role = JOB_ROLES.find(r => r.id === curr.roleId);
    return acc + (role?.modules?.length || 4);
  }, 0) || 4;

  // Total pending modules
  const pendingModulesCount = Math.max(0, totalEnrolledModulesCount - totalModulesLearned);

  // Overall progress percentage
  const overallProgressPercent = totalEnrolledModulesCount > 0 
    ? Math.min(100, Math.round((totalModulesLearned / totalEnrolledModulesCount) * 100))
    : 0;

  // Primary enrolled role or default
  const primaryEnrollment = allEnrollments[0];
  const primaryRole: JobRole = primaryEnrollment ? (JOB_ROLES.find(r => r.id === primaryEnrollment.roleId) || JOB_ROLES[0]) : JOB_ROLES[0];
  const primarySkill = primaryEnrollment ? (SKILL_CATEGORIES.find(s => s.id === primaryEnrollment.skillId) || SKILL_CATEGORIES[0]) : SKILL_CATEGORIES[0];

  // Static non-editable From & To Roles
  const originRoleTitle = 'Warehouse Associate Trainee';
  const targetRoleTitle = primaryRole.title || 'Logistics Operations Supervisor';

  // Analytics helper metrics
  const paceMinutes = selectedPace === '2 min' ? 2 : selectedPace === '5 min' ? 5 : selectedPace === '10 min' ? 10 : 15;
  const estimatedDaysToFinish = Math.max(1, Math.ceil((pendingModulesCount * 30) / paceMinutes));
  
  // Weekly study minutes dataset
  const weeklyData = [
    { day: 'Mon', mins: Math.round(paceMinutes * 1.2), goal: paceMinutes },
    { day: 'Tue', mins: Math.round(paceMinutes * 1.5), goal: paceMinutes },
    { day: 'Wed', mins: Math.round(paceMinutes * 0.8), goal: paceMinutes },
    { day: 'Thu', mins: Math.round(paceMinutes * 1.4), goal: paceMinutes },
    { day: 'Fri', mins: Math.round(paceMinutes * 1.8), goal: paceMinutes },
    { day: 'Sat', mins: Math.round(paceMinutes * 0.9), goal: paceMinutes },
    { day: 'Sun', mins: Math.round(paceMinutes * 1.1), goal: paceMinutes },
  ];

  // Competency skill breakdown
  const competencies = [
    { name: 'Warehouse Safety & Protocols', level: 94, status: 'Mastered', color: 'bg-emerald-400' },
    { name: 'RF Scanner & Barcode Systems', level: 68, status: 'Proficient', color: 'bg-sky-300' },
    { name: 'Pallet Stacking & QC Inspection', level: 45, status: 'In Progress', color: 'bg-amber-300' },
    { name: 'Inventory Reconciliation Rig', level: 20, status: 'Upcoming', color: 'bg-indigo-300' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] flex justify-center selection:bg-sky-200 select-none pb-28 overflow-y-auto">
      
      {/* Mobile-First Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* =========================================================================
            1. TOP MAP SECTION WITH INTEGRATED METRICS OVERLAY
           ========================================================================= */}
        <div className="relative w-full h-[320px] bg-[#E8EEF5] overflow-hidden shrink-0">
          
          {/* Stylized Vector Map Graphic */}
          <svg className="absolute inset-0 w-full h-full object-cover opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D3DFEE" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#F3F6FA" />
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Map Roads / Highway Vectors */}
            <path d="M -20 180 Q 80 160 160 200 T 360 120 T 420 140" fill="none" stroke="#FFFFFF" strokeWidth="14" />
            <path d="M -20 180 Q 80 160 160 200 T 360 120 T 420 140" fill="none" stroke="#E2EBF5" strokeWidth="10" />
            
            <path d="M 60 -20 Q 140 100 120 220 T 260 340" fill="none" stroke="#FFFFFF" strokeWidth="12" />
            <path d="M 60 -20 Q 140 100 120 220 T 260 340" fill="none" stroke="#E2EBF5" strokeWidth="8" />

            <path d="M 180 -20 L 320 340" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="6 6" />
            <path d="M 280 40 Q 320 180 420 240" fill="none" stroke="#FFFFFF" strokeWidth="10" />

            {/* City zones / Learning hubs */}
            <rect x="220" y="30" width="120" height="70" rx="8" fill="#E7EFF8" stroke="#D3DFEE" strokeWidth="1.5" />
            <rect x="40" y="230" width="100" height="60" rx="8" fill="#E7EFF8" stroke="#D3DFEE" strokeWidth="1.5" />
            <circle cx="340" cy="80" r="28" fill="#DDE8F5" />
          </svg>

          {/* Top Floating App Bar: Back Button | Center Pin | More Menu */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <button 
              onClick={() => navigate('home')}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Center Blue Location Pin (Career Milestone Hub) */}
            <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#0094FF]">
              <MapPin className="w-6 h-6 fill-[#0094FF] text-white" />
            </div>

            {/* Right More Action */}
            <button 
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Live Career Pin Indicator on Map with Pulse Effect */}
          <div className="absolute top-24 left-20 z-10 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-10 rounded-full bg-sky-400/40 animate-ping" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0094FF] shadow-lg flex items-center justify-center text-white relative z-10">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-md border border-slate-200/80 text-[10px] font-black text-slate-800 whitespace-nowrap">
              {overallProgressPercent}% Complete
            </div>
          </div>

          {/* Intelligently displayed broader metrics badge in top-left map area */}
          <div className="absolute bottom-6 left-5 z-10 flex items-center gap-2">
            <div 
              onClick={() => setActiveModal('progress')}
              className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2 cursor-pointer hover:bg-white transition-all"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold text-slate-800">
                {totalModulesLearned} / {totalEnrolledModulesCount} Modules Done
              </span>
            </div>
          </div>

          {/* "OPEN MAP" Action Button in Lower-Right */}
          <div className="absolute bottom-5 right-4 z-20">
            <button
              onClick={() => setIsMapExpanded(true)}
              className="bg-[#0099FF] hover:bg-[#0088EE] active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-[0_6px_20px_rgba(0,153,255,0.35)] transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              OPEN MAP
            </button>
          </div>

        </div>

        {/* =========================================================================
            2. MIDDLE SECTION: NON-EDITABLE LEARNING TIMELINE (FROM & TO)
           ========================================================================= */}
        <div className="w-full bg-white px-6 py-5 z-20 relative border-b border-slate-100">
          <div className="flex items-start gap-4">
            
            {/* Vertical Timeline Graphic: Solid Blue Dot -> Dashed Line -> Hollow Circle */}
            <div className="flex flex-col items-center pt-2">
              {/* Top Solid Blue Circle */}
              <div className="w-4 h-4 rounded-full bg-[#0094FF] ring-4 ring-sky-100 shrink-0" />
              
              {/* Vertical Dashed Route Line */}
              <div className="w-0.5 h-16 border-l-2 border-dashed border-slate-300 my-1" />
              
              {/* Bottom Hollow Circle */}
              <div className="w-4 h-4 rounded-full border-2 border-slate-400 bg-white shrink-0" />
            </div>

            {/* From & To Static Non-Editable Text Fields */}
            <div className="flex-1 space-y-3.5">
              
              {/* "From" Origin Field (Non-editable) */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex-1 pr-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    From (Current Baseline)
                  </span>
                  <span className="text-base font-black text-[#0094FF] tracking-tight leading-tight block">
                    {originRoleTitle}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-sky-50 text-[10px] font-extrabold text-[#0094FF] border border-sky-100 shrink-0">
                  Origin
                </div>
              </div>

              {/* "To" Destination Field (Non-editable) */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex-1 pr-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    To (Target Career Role)
                  </span>
                  <span className="text-base font-black text-[#0094FF] tracking-tight leading-tight block">
                    {targetRoleTitle}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-blue-50 text-[10px] font-extrabold text-[#0094FF] border border-blue-100 shrink-0">
                  Target
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =========================================================================
            3. BOTTOM CYAN / BLUE ARCHED ACTION PANEL WITH EXPANDED ANALYTICS
           ========================================================================= */}
        <div className="w-full bg-[#1892FA] rounded-t-[34px] -mt-3 z-30 flex-1 px-6 pt-5 pb-8 flex flex-col justify-between shadow-[0_-12px_32px_rgba(0,148,255,0.22)] space-y-6">
          
          <div className="space-y-5">
            
            {/* Departure vs Arrival Segmented Toggle */}
            <div className="flex items-center justify-center gap-6 text-white font-extrabold text-base tracking-wide">
              <button 
                onClick={() => setJourneyMode('departure')}
                className={`flex items-center gap-2 cursor-pointer transition-all ${journeyMode === 'departure' ? 'text-white scale-105' : 'text-white/70 hover:text-white'}`}
              >
                <span>Departure</span>
              </button>
              
              {/* Radio Dot indicator */}
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white bg-transparent flex items-center justify-center">
                <div className={`w-1 h-1 rounded-full ${journeyMode === 'arrival' ? 'bg-white' : 'bg-transparent'}`} />
              </div>

              <button 
                onClick={() => setJourneyMode('arrival')}
                className={`flex items-center gap-2 cursor-pointer transition-all ${journeyMode === 'arrival' ? 'text-white scale-105' : 'text-white/70 hover:text-white'}`}
              >
                <span>Arrival</span>
              </button>
            </div>

            {/* Time / Pace Duration Filter Pills (2 min, 5 min, 15 min, 10 min) */}
            <div className="flex items-center justify-between gap-2">
              {(['2 min', '5 min', '15 min', '10 min'] as const).map((pace) => {
                const isActive = selectedPace === pace;
                return (
                  <button
                    key={pace}
                    onClick={() => setSelectedPace(pace)}
                    className={`flex-1 py-2 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                      isActive 
                        ? 'bg-transparent text-white border-2 border-white shadow-sm' 
                        : 'bg-white text-[#1892FA] hover:bg-white/90 shadow-xs'
                    }`}
                  >
                    {pace}
                  </button>
                );
              })}
            </div>

            {/* Broader Numbers Quick Summary Tile */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-center justify-around text-white">
              <div 
                onClick={() => setActiveModal('skills')}
                className="text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="text-[10px] uppercase font-bold text-white/80 block">Skills</span>
                <span className="text-base font-black">{totalSkillsCount} Enrolled</span>
              </div>
              <div className="w-px h-7 bg-white/25" />
              <div 
                onClick={() => setActiveModal('modules')}
                className="text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="text-[10px] uppercase font-bold text-white/80 block">Completed</span>
                <span className="text-base font-black">{totalModulesLearned} Mods</span>
              </div>
              <div className="w-px h-7 bg-white/25" />
              <div 
                onClick={() => setActiveModal('pending')}
                className="text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="text-[10px] uppercase font-bold text-white/80 block">Pending</span>
                <span className="text-base font-black">{pendingModulesCount} Mods</span>
              </div>
            </div>

            {/* =========================================================================
                ADDITIONAL ANALYTICS EXPANSION: METRIC TILES & VELOCITY
               ========================================================================= */}
            
            {/* 1. Daily Study Velocity & Streak Analytics */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span className="text-xs font-black uppercase tracking-wider">Weekly Learning Velocity</span>
                </div>
                <span className="text-[11px] font-bold text-sky-200">
                  Target: {paceMinutes}m / day
                </span>
              </div>

              {/* Weekly Mini Bar Chart */}
              <div className="grid grid-cols-7 gap-1.5 items-end h-16 pt-2">
                {weeklyData.map((item, idx) => {
                  const barHeightPercent = Math.min(100, Math.round((item.mins / 25) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full bg-white/20 rounded-t-md h-full flex items-end overflow-hidden">
                        <div 
                          className="w-full bg-white rounded-t-md transition-all duration-500"
                          style={{ height: `${barHeightPercent}%` }}
                          title={`${item.day}: ${item.mins} mins`}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-white/80">{item.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Key Highlights row */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-white/80" />
                  <span className="font-semibold text-white/90">Est. Completion:</span>
                </div>
                <span className="font-black text-white">{estimatedDaysToFinish} Days Remaining</span>
              </div>
            </div>

            {/* 2. Competency Mastery Breakdown */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-xs font-black uppercase tracking-wider">Competency Breakdown</span>
                </div>
                <button 
                  onClick={() => setActiveModal('competency')}
                  className="text-[10px] font-extrabold text-white/90 hover:underline cursor-pointer"
                >
                  View Detail
                </button>
              </div>

              <div className="space-y-2.5">
                {competencies.map((comp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-white/90 truncate max-w-[200px]">{comp.name}</span>
                      <span className="font-black text-white">{comp.level}%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${comp.color} transition-all duration-500`}
                        style={{ width: `${comp.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Performance Diagnostics Summary Tile */}
            <div className="grid grid-cols-2 gap-3 text-white">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold uppercase">Assessment Score</span>
                </div>
                <div className="text-xl font-black">94%</div>
                <span className="text-[10px] text-white/70 block">QC & Safety Exams</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold uppercase">Practical Lab</span>
                </div>
                <div className="text-xl font-black">88%</div>
                <span className="text-[10px] text-white/70 block">Hands-on VR Score</span>
              </div>
            </div>

          </div>

          {/* Dual Action Buttons: SCHEDULE & TICKETS */}
          <div className="flex items-center gap-3 pt-4">
            
            {/* SCHEDULE (White Pill Button) */}
            <button
              onClick={() => setActiveModal('schedule')}
              className="flex-1 bg-white hover:bg-slate-50 active:scale-98 text-[#0094FF] py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 stroke-[2.5]" />
              <span>SCHEDULE</span>
            </button>

            {/* TICKETS (Black Pill Button) */}
            <button
              onClick={() => setActiveModal('tickets')}
              className="flex-1 bg-black hover:bg-slate-900 active:scale-98 text-white py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>TICKETS</span>
            </button>

          </div>

        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE MODALS FOR MAP & ACTIONS
         ========================================================================= */}
      
      {/* 1. EXPANDED MAP MODAL */}
      <Modal 
        isOpen={isMapExpanded} 
        onClose={() => setIsMapExpanded(false)} 
        title="Career Learning Roadmap Map"
      >
        <div className="space-y-4">
          <div className="relative w-full h-48 bg-sky-50 rounded-2xl overflow-hidden border border-sky-200 flex items-center justify-center">
            <div className="text-center p-4">
              <Compass className="w-10 h-10 text-[#0094FF] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Operational Learning Map</h4>
              <p className="text-xs text-slate-500 mt-1">Connecting your trainee foundation to supervisor readiness across 4 milestones.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Milestone Stops</h5>
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Stop 1: Safety & Compliance</span>
                <span className="text-[11px] font-extrabold text-emerald-700">100% Passed</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">Stop 2: RF Scanning & Picking</span>
                <span className="text-[11px] font-extrabold text-blue-700">In Progress (60%)</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Stop 3: Practical Lab Rig</span>
                <span className="text-[11px] font-semibold text-slate-400">Locked</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMapExpanded(false)}
            className="w-full py-2.5 rounded-xl bg-[#0094FF] text-white font-bold text-xs uppercase cursor-pointer"
          >
            Close Map
          </button>
        </div>
      </Modal>

      {/* 2. SCHEDULE MODAL */}
      <Modal 
        isOpen={activeModal === 'schedule'} 
        onClose={() => setActiveModal('none')} 
        title="Training Schedule & Daily Pace"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Selected daily commitment pace: <strong className="text-[#0094FF]">{selectedPace} / day</strong>.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Next Training Session:</span>
              <strong className="text-slate-900">Today, 5:30 PM</strong>
            </div>
            <div className="flex justify-between">
              <span>Estimated Certification Date:</span>
              <strong className="text-emerald-600">In ~{estimatedDaysToFinish} days</strong>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveModal('none');
              navigate('course-modules', { roleId: primaryRole.id });
            }}
            className="w-full py-2.5 rounded-xl bg-[#0094FF] text-white font-bold text-xs uppercase cursor-pointer"
          >
            Go to Active Course
          </button>
        </div>
      </Modal>

      {/* 3. TICKETS (CAREER PASS) MODAL */}
      <Modal 
        isOpen={activeModal === 'tickets'} 
        onClose={() => setActiveModal('none')} 
        title="Your Career Passes & Tickets"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl space-y-3 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">BOARDING PASS</span>
                <h4 className="text-sm font-black text-white">{primaryRole.title}</h4>
              </div>
              <Ticket className="w-6 h-6 text-sky-400" />
            </div>
            <div className="border-t border-dashed border-slate-700 pt-2 flex justify-between text-xs">
              <div>
                <span className="text-[9px] text-slate-400 block">ENROLLMENT</span>
                <span className="font-bold text-white uppercase">{primaryEnrollment?.plan || 'PRO PASS'}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">STATUS</span>
                <span className="font-bold text-emerald-400">ACTIVE</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModal('none');
              navigate('certificate');
            }}
            className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs uppercase cursor-pointer"
          >
            View Certificates
          </button>
        </div>
      </Modal>

      {/* 4. COMPETENCY DETAIL MODAL */}
      <Modal
        isOpen={activeModal === 'competency'}
        onClose={() => setActiveModal('none')}
        title="Detailed Competency Matrix"
      >
        <div className="space-y-3 text-xs text-slate-700">
          {competencies.map((comp, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{comp.name}</span>
                <span className="text-[#0094FF]">{comp.level}%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Status: <strong>{comp.status}</strong></span>
                <span>Verified via practical simulations</span>
              </div>
            </div>
          ))}
          <button
            onClick={() => setActiveModal('none')}
            className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase cursor-pointer mt-2"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* 5. METRICS DETAILS MODAL */}
      <Modal
        isOpen={activeModal === 'skills' || activeModal === 'modules' || activeModal === 'progress' || activeModal === 'pending'}
        onClose={() => setActiveModal('none')}
        title="Learning Journey Analytics"
      >
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
            <div className="flex justify-between font-bold">
              <span>Total Skills Enrolled:</span>
              <span>{totalSkillsCount}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Completed Modules:</span>
              <span className="text-emerald-600">{totalModulesLearned}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Pending Modules:</span>
              <span className="text-amber-600">{pendingModulesCount}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Progress:</span>
              <span className="text-[#0094FF]">{overallProgressPercent}%</span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase cursor-pointer"
          >
            Close
          </button>
        </div>
      </Modal>

    </div>
  );
}
