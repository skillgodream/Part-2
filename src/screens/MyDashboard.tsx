import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Award, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  GraduationCap, 
  Hourglass,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Boxes,
  Barcode,
  Lock,
  Wrench,
  Smartphone,
  X,
  BarChart3,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { Enrollment, JobRole, CourseModule } from '../lib/types';

export function MyDashboardScreen() {
  const { navigate } = useRouter();
  const { certificates, profile } = useEnrollmentState();

  const allEnrollments: Enrollment[] = enrollmentStore.getEnrollments();
  const inProgressEnrollments = allEnrollments.filter(e => !e.isCompleted && !e.assessmentPassed);
  const completedEnrollments = allEnrollments.filter(e => e.isCompleted || e.assessmentPassed);

  // Analytical Modal State: 'none' | 'skills' | 'modules' | 'progress' | 'pending' | 'purchased' | 'completed-courses' | 'featured-modules' | 'sim-lab'
  const [activeModal, setActiveModal] = useState<'none' | 'skills' | 'modules' | 'progress' | 'pending' | 'purchased' | 'completed-courses' | 'featured-modules' | 'sim-lab'>('none');

  // Completed modules across enrollments
  const completedModulesList = allEnrollments.flatMap(e => {
    const role = JOB_ROLES.find(r => r.id === e.roleId);
    if (!role || !role.modules) return [];
    return role.modules.filter(m => e.completedModules?.includes(m.id)).map(m => ({
      ...m,
      roleTitle: role.title,
      roleId: role.id
    }));
  });

  // Check if learner has any Professional Plan (which includes Practical Simulation Lab)
  const proEnrollments = allEnrollments.filter(e => e.plan === 'pro');
  const hasProPlan = proEnrollments.length > 0;
  const primaryProEnrollment = proEnrollments[0] || (allEnrollments.length > 0 ? allEnrollments[0] : null);
  const proRole = primaryProEnrollment ? (JOB_ROLES.find(r => r.id === primaryProEnrollment.roleId) || JOB_ROLES[0]) : JOB_ROLES[0];
  const proCompletedPracticals = primaryProEnrollment?.completedPracticalActivities || [];

  // Time-aware wishing greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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

  // Active ongoing enrollments (or fallback to primary)
  const activeOngoingCourses = inProgressEnrollments.length > 0 
    ? inProgressEnrollments 
    : (allEnrollments.length > 0 ? [allEnrollments[0]] : []);

  // Learner display picture (LinkedIn style avatar)
  const learnerAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pb-20 font-sans text-slate-900">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-7">

        {/* 1. DASHBOARD HEADER: LEFT DISPLAY PIC (LINKEDIN STYLE) + WISHING + LEARNER NAME */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4" id="learner-profile-header">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Picture Avatar */}
            <div className="relative shrink-0 group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      enrollmentStore.updateProfile({ avatarUrl: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <img
                src={profile.avatarUrl || learnerAvatarUrl}
                alt={profile.name || 'Learner'}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-blue-500/20 shadow-sm border-2 border-white group-hover:ring-blue-500/40 transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                Edit
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Wishing (Good morning / afternoon) + Name (3X larger) */}
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-0.5">
                {getGreeting()},
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight truncate">
                {profile.name || 'Daizy Shah'}
              </h1>
            </div>
          </div>

          {/* Quick learning streak indicator */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200/60 text-xs font-bold">
            <span>🔥</span>
            <span className="hidden sm:inline">6 Day Streak</span>
            <span className="sm:hidden">6d</span>
          </div>
        </div>

        {/* 2. OVERVIEW CARDS */}
        <section id="overview-metrics-section" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Overview
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                       {/* CARD 1: TOTAL SKILL ENROLLED (Light Peach / Warm Orange) */}
            <div 
              id="metric-card-skills"
              onClick={() => setActiveModal('skills')}
              className="bg-[#FFF6F0] border border-orange-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-md hover:border-orange-400 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-orange-600 shadow-2xs flex items-center justify-center">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-orange-950/70 uppercase tracking-wider block">
                  Total Skill Enrolled
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {totalSkillsCount} <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{totalSkillsCount === 1 ? 'Skill' : 'Skills'}</span>
                </div>
              </div>
            </div>

            {/* CARD 2: TOTAL MODULE LEARNED (Light Lavender / Soft Purple) */}
            <div 
              id="metric-card-modules-learned"
              onClick={() => setActiveModal('modules')}
              className="bg-[#F6F2FF] border border-purple-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-md hover:border-purple-400 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-purple-600 shadow-2xs flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-purple-950/70 uppercase tracking-wider block">
                  Total Module Learned
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {totalModulesLearned} <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{totalModulesLearned === 1 ? 'Module' : 'Modules'}</span>
                </div>
              </div>
            </div>

            {/* CARD 3: PROGRESS IN PERCENTAGE (Light Sky Blue) */}
            <div 
              id="metric-card-progress"
              onClick={() => setActiveModal('progress')}
              className="bg-[#F0F7FF] border border-sky-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-md hover:border-sky-400 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-sky-600 shadow-2xs flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-sky-950/70 uppercase tracking-wider block">
                  Progress
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {overallProgressPercent}%
                </div>
              </div>
            </div>

            {/* CARD 4: PENDING (Light Rose / Soft Pink) */}
            <div 
              id="metric-card-pending"
              onClick={() => setActiveModal('pending')}
              className="bg-[#FFF1F2] border border-rose-200/70 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 flex flex-col justify-between transition-all hover:shadow-md hover:border-rose-400 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/90 text-rose-600 shadow-2xs flex items-center justify-center">
                  <Hourglass className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-950/70 uppercase tracking-wider block">
                  Pending
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {pendingModulesCount} <span className="text-[11px] sm:text-xs font-semibold text-slate-500">Modules</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. NEWLY PURCHASED CARDS SECTION (WARM COOL BLUE) */}
        <section id="newly-purchased-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={() => setActiveModal('purchased')}>
              Newly Purchased
            </h2>
            <span 
              onClick={() => setActiveModal('purchased')}
              className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              {allEnrollments.length} {allEnrollments.length === 1 ? 'Course' : 'Courses'}
            </span>
          </div>

          <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-indigo-50/90 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            {allEnrollments.length === 0 ? (
              <div className="text-center py-5 bg-white/60 rounded-xl border border-blue-100/60 p-4">
                <p className="text-xs font-semibold text-slate-600">No purchased courses yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore skills and enroll to view your purchased items here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allEnrollments.map((enr) => {
                  const role: JobRole = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                  const skill = SKILL_CATEGORIES.find(s => s.id === enr.skillId) || SKILL_CATEGORIES[0];
                  const itemThumb = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80";

                  return (
                    <div
                      key={`purchased-card-${enr.id}`}
                      onClick={() => navigate('course-modules', { roleId: role.id, skillId: skill.id, plan: enr.plan })}
                      className="bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-blue-100/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80">
                        <img
                          src={itemThumb}
                          alt={role.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded uppercase">
                            {enr.plan}
                          </span>
                          <span className="text-[9px] text-slate-500 truncate">
                            {skill.name}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate mt-0.5">
                          {role.title}
                        </h4>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> Unlocked
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 4. COMPLETED COURSES CARD (Warm Amber / Cool Tone) */}
        <section id="completed-courses-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider cursor-pointer hover:text-amber-700" onClick={() => setActiveModal('completed-courses')}>
              Completed Courses
            </h2>
            <span 
              onClick={() => setActiveModal('completed-courses')}
              className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              {completedEnrollments.length} Completed
            </span>
          </div>

          <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-yellow-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            {completedEnrollments.length === 0 ? (
              <div className="text-center py-5 bg-white/60 rounded-xl border border-amber-100/60 p-4">
                <p className="text-xs font-semibold text-slate-600">No completed courses yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Finish all course modules to complete your courses and earn certificates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedEnrollments.map((enr) => {
                  const role: JobRole = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                  const skill = SKILL_CATEGORIES.find(s => s.id === enr.skillId) || SKILL_CATEGORIES[0];
                  return (
                    <div
                      key={`completed-course-${enr.id}`}
                      onClick={() => navigate('course-modules', { roleId: role.id, skillId: skill.id, plan: enr.plan })}
                      className="bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                          Completed
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {role.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {skill.name} • 100% Score
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 5. FEATURED / COMPLETED MODULES CARD (Warm Purple / Rose Cool Tone) */}
        <section id="featured-modules-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider cursor-pointer hover:text-purple-700" onClick={() => setActiveModal('featured-modules')}>
              Completed Modules (Featured)
            </h2>
            <span 
              onClick={() => setActiveModal('featured-modules')}
              className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/80 cursor-pointer hover:bg-purple-100 transition-colors"
            >
              {completedModulesList.length} Learned
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-50/90 via-fuchsia-50/75 to-pink-50/80 border border-purple-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            {completedModulesList.length === 0 ? (
              <div className="text-center py-5 bg-white/60 rounded-xl border border-purple-100/60 p-4">
                <p className="text-xs font-semibold text-slate-600">No modules completed yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Start learning ongoing course modules to see them featured here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedModulesList.map((mod, idx) => (
                  <div
                    key={`featured-mod-${mod.id}-${idx}`}
                    onClick={() => navigate('module-video', { roleId: mod.roleId, moduleId: mod.id })}
                    className="bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-purple-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      M0{mod.moduleNumber || idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded uppercase">
                        {mod.roleTitle}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5 group-hover:text-purple-600 transition-colors">
                        {mod.title}
                      </h4>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" /> Completed
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. SMART DIRECT ACCESS: SIMULATION LAB (FOR ENROLLED PRO PLAN LEARNERS) */}
        <section id="simulation-lab-smart-access-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider cursor-pointer hover:text-emerald-600" onClick={() => setActiveModal('sim-lab')}>
                Simulation Lab
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-300">
                {hasProPlan ? 'Pro Access Active' : 'Simulation Lab'}
              </span>
            </div>
            <span 
              onClick={() => setActiveModal('sim-lab')}
              className="text-xs text-emerald-600 font-semibold cursor-pointer hover:underline"
            >
              View Analytics →
            </span>
          </div>

          <div 
            id="simulation-lab-card"
            onClick={() => {
              if (hasProPlan || primaryProEnrollment) {
                navigate('practical-training', { roleId: proRole.id, from: 'my-dashboard' });
              } else {
                navigate('choose-plan', { roleId: proRole.id });
              }
            }}
            className="bg-gradient-to-br from-[#0B192C] via-[#1E293B] to-[#0F172A] rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden border border-slate-700/60 cursor-pointer hover:border-emerald-400/60 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Left Details */}
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg text-[11px] font-bold">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>Practical Simulation Lab</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    Simulation Lab Sandbox
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Interactive hands-on practical simulations and scenario-based training sandbox.
                  </p>
                </div>
              </div>

              {/* Two separate tabs: Enrolled & Completed */}
              <div className="shrink-0 flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
                {/* Tab 1: Enrolled */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal('sim-lab');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-emerald-500/50 text-center cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Enrolled</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-0.5 block">{allEnrollments.length} {allEnrollments.length === 1 ? 'Lab' : 'Labs'}</span>
                </div>

                {/* Tab 2: Completed */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal('sim-lab');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 text-center cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-semibold text-emerald-400 block uppercase tracking-wider">Completed</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-300 mt-0.5 block">{proCompletedPracticals.length} / 4</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. ONGOING COURSES: MODULE SNAP CARD WITH PROGRESS PERCENTAGE */}
        <section id="ongoing-courses-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Ongoing Courses
            </h2>
            <span className="text-xs font-medium text-slate-400">
              {activeOngoingCourses.length} In Progress
            </span>
          </div>

          <div className="space-y-3" id="ongoing-courses-list">
            {activeOngoingCourses.length === 0 ? (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">No ongoing courses yet</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Explore skills and enroll to start your learning journey.</p>
                </div>
                <div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('choose-skill')}
                  >
                    Explore Skills
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOngoingCourses.map((enr) => {
              const role: JobRole = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
              const skill = SKILL_CATEGORIES.find(s => s.id === enr.skillId) || SKILL_CATEGORIES[0];
              
              const totalCourseModules = role.modules?.length || 4;
              const completedCourseCount = enr.completedModules?.length || 0;
              const courseProgressPercent = Math.round((completedCourseCount / totalCourseModules) * 100);
              
              // Next module to continue
              const currentMod = role.modules.find(m => !enr.completedModules?.includes(m.id)) || role.modules[0];

              // Course visual snap thumbnail
              const snapImage = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80";

              return (
                <div
                  key={enr.id}
                  id={`ongoing-snap-card-${enr.id}`}
                  onClick={() => {
                    if (currentMod) {
                      navigate('module-video', { roleId: role.id, moduleId: currentMod.id, enrollmentId: enr.id });
                    } else {
                      navigate('course-modules', { roleId: role.id });
                    }
                  }}
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs p-3 sm:p-5 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    
                    {/* Top/Left Section on mobile: Thumbnail + Info side by side */}
                    <div className="flex items-center sm:items-start gap-3 flex-1 min-w-0">
                      {/* Snap Thumbnail with Play overlay */}
                      <div className="relative w-20 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                        <img
                          src={snapImage}
                          alt={role.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-sm">
                            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Middle Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {skill.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">
                            {enr.plan.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {role.title}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                          {currentMod ? `M0${currentMod.moduleNumber}: ${currentMod.title}` : 'All theory completed'}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="w-full sm:w-auto flex flex-col justify-between gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Progress Bar & Percentage */}
                      <div className="space-y-1 sm:min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-blue-600 font-bold">{courseProgressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                            style={{ width: `${courseProgressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons: Resume Video & Direct Sim Lab for Pro */}
                      <div className="flex items-center gap-2">
                        {enr.plan === 'pro' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('practical-training', { roleId: role.id, from: 'my-dashboard' });
                            }}
                            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                            title="Direct Access to Practical Simulation Lab"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sim Lab</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentMod) {
                              navigate('module-video', { roleId: role.id, moduleId: currentMod.id, enrollmentId: enr.id });
                            } else {
                              navigate('course-modules', { roleId: role.id });
                            }
                          }}
                          className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg sm:rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Resume</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ANALYTICAL DETAILS MODAL */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  activeModal === 'skills' ? 'bg-orange-100 text-orange-700' :
                  activeModal === 'modules' ? 'bg-purple-100 text-purple-700' :
                  activeModal === 'progress' ? 'bg-sky-100 text-sky-700' :
                  activeModal === 'pending' ? 'bg-rose-100 text-rose-700' :
                  activeModal === 'purchased' ? 'bg-blue-100 text-blue-700' :
                  activeModal === 'completed-courses' ? 'bg-amber-100 text-amber-700' :
                  activeModal === 'sim-lab' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 capitalize">
                    {activeModal === 'skills' && 'Total Enrolled Skills Analytics'}
                    {activeModal === 'modules' && 'Total Modules Learned Analytics'}
                    {activeModal === 'progress' && 'Learning Progress Velocity'}
                    {activeModal === 'pending' && 'Pending Modules Breakdown'}
                    {activeModal === 'purchased' && 'Newly Purchased Courses Analytics'}
                    {activeModal === 'completed-courses' && 'Completed Courses & Certificates'}
                    {activeModal === 'featured-modules' && 'Completed Modules Breakdown'}
                    {activeModal === 'sim-lab' && 'Simulation Lab Performance Analytics'}
                  </h3>
                  <p className="text-xs text-slate-500">Detailed performance metrics and records</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content based on activeModal */}
            <div className="space-y-4">
              {activeModal === 'skills' && (
                <div className="space-y-3">
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs space-y-1">
                    <span className="font-bold text-orange-900">Total Enrolled Tracks: {totalSkillsCount}</span>
                    <p className="text-orange-800">You are actively building professional expertise across your chosen career tracks.</p>
                  </div>
                  <div className="space-y-2">
                    {allEnrollments.map((enr, i) => {
                      const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold">
                          <span className="text-slate-900 font-bold">{role.title}</span>
                          <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded uppercase text-[10px] font-bold">{enr.plan} Plan</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeModal === 'modules' && (
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-1">
                    <span className="font-bold text-purple-900">Total Completed Modules: {totalModulesLearned}</span>
                    <p className="text-purple-800">You have successfully mastered {totalModulesLearned} video lectures and operational topics.</p>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {completedModulesList.map((mod, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-purple-700 font-bold block">{mod.roleTitle}</span>
                          <span className="text-slate-900 font-medium">{mod.title}</span>
                        </div>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Done</span>
                      </div>
                    ))}
                    {completedModulesList.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">No modules completed yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeModal === 'progress' && (
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-sky-950">
                      <span>Overall Progress Rate</span>
                      <span>{overallProgressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: `${overallProgressPercent}%` }} />
                    </div>
                    <p className="text-sky-800 pt-1">Velocity score is high based on your consistent daily learning streak.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Completed</span>
                      <span className="text-lg font-black text-slate-900">{totalModulesLearned}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Remaining</span>
                      <span className="text-lg font-black text-slate-900">{pendingModulesCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'pending' && (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs space-y-1">
                    <span className="font-bold text-rose-900">Pending Modules: {pendingModulesCount}</span>
                    <p className="text-rose-800">Complete these modules to achieve 100% mastery and earn your verified certificate.</p>
                  </div>
                  <div className="space-y-2">
                    {allEnrollments.map((enr) => {
                      const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                      const pendingMods = role.modules?.filter(m => !enr.completedModules?.includes(m.id)) || [];
                      return pendingMods.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-rose-700 font-bold block">{role.title}</span>
                            <span className="text-slate-900 font-medium">M0{m.moduleNumber}: {m.title}</span>
                          </div>
                          <span className="text-xs font-semibold text-rose-600">Pending</span>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}

              {activeModal === 'purchased' && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs space-y-1">
                    <span className="font-bold text-blue-900">Purchased Courses: {allEnrollments.length}</span>
                    <p className="text-blue-800">All purchased tracks have lifetime access and verified certificate eligibility.</p>
                  </div>
                  <div className="space-y-2">
                    {allEnrollments.map((enr, i) => {
                      const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                      return (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{role.title}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-bold text-[10px]">{enr.plan}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeModal === 'completed-courses' && (
                <div className="space-y-3">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
                    <span className="font-bold text-amber-900">Completed Courses: {completedEnrollments.length}</span>
                    <p className="text-amber-800">Earned official professional certificates and verified credentials.</p>
                  </div>
                  <div className="space-y-2">
                    {completedEnrollments.map((enr, i) => {
                      const role = JOB_ROLES.find(r => r.id === enr.roleId) || JOB_ROLES[0];
                      return (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{role.title}</span>
                          <span className="text-emerald-600 font-bold">100% Completed</span>
                        </div>
                      );
                    })}
                    {completedEnrollments.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">No completed courses yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeModal === 'featured-modules' && (
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs space-y-1">
                    <span className="font-bold text-purple-900">Featured Completed Modules: {completedModulesList.length}</span>
                    <p className="text-purple-800">Quick breakdown of completed learning chapters.</p>
                  </div>
                  <div className="space-y-2">
                    {completedModulesList.map((m, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-900">{m.title}</span>
                        <span className="text-purple-700 font-bold text-[10px]">{m.roleTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'sim-lab' && (
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-950">Simulation Lab Status: {hasProPlan ? 'Active (Pro Plan)' : 'Standard Sandbox'}</span>
                    <p className="text-emerald-900">Completed Practical Activities: {proCompletedPracticals.length} of 4</p>
                  </div>
                  <div className="space-y-2">
                    {['Barcode Scanning Simulation', 'Inventory Audit Drill', 'Hazard Identification', 'Customer Incident Resolution'].map((drill, idx) => {
                      const isDone = proCompletedPracticals.includes(String(idx + 1)) || proCompletedPracticals.length > idx;
                      return (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900">{drill}</span>
                          <span className={isDone ? "text-emerald-600 font-bold" : "text-slate-400 font-medium"}>
                            {isDone ? 'Completed ✓' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setActiveModal('none')}>
                Close Analytics
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
