import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Clock, 
  BookOpen, 
  Check, 
  RotateCcw,
  Sparkles,
  Building,
  FileCheck,
  ChevronRight,
  Volume2,
  Maximize2
} from 'lucide-react';
import { Button, Badge, ProgressBar, Modal } from '../components/ui';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { CourseModule, JobRole, SkillCategory, Enrollment } from '../lib/types';

export function CourseModulesScreen() {
  const { currentRoute, navigate } = useRouter();
  const { activeEnrollment } = useEnrollmentState();

  // Resolve Role, Skill & Enrollment
  const roleId = currentRoute.params?.roleId || activeEnrollment?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];
  
  // Resolve or create enrollment if none exists for this role
  const enrollment: Enrollment = (activeEnrollment && activeEnrollment.roleId === role.id)
    ? activeEnrollment
    : enrollmentStore.getEnrollments().find(e => e.roleId === role.id) || {
        id: `enr-${Date.now()}`,
        roleId: role.id,
        skillId: skill.id,
        plan: (currentRoute.params?.plan as any) || 'pro',
        enrollmentDate: new Date().toISOString().split('T')[0],
        completedModules: [],
        currentModuleId: role.modules[0]?.id || 'mod-1',
        quizScores: {},
        practicalBooked: false,
        isCompleted: false
      };

  const completedModules = enrollment.completedModules || [];
  
  // Current active module in the player/workspace
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() => {
    if (currentRoute.params?.moduleId) return currentRoute.params.moduleId;
    if (enrollment.currentModuleId) return enrollment.currentModuleId;
    return role.modules[0]?.id || 'mod-1';
  });

  const activeModule = role.modules.find(m => m.id === selectedModuleId) || role.modules[0];
  const activeModuleIndex = role.modules.findIndex(m => m.id === activeModule.id);

  // Lesson player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(() => {
    return completedModules.includes(activeModule.id);
  });

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizLockWarning, setQuizLockWarning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleOpenQuiz = () => {
    if (!completedModules.includes(activeModule.id) && videoProgress < 80) {
      setQuizLockWarning(true);
      setTimeout(() => setQuizLockWarning(false), 4000);
      return;
    }
    setShowQuizModal(true);
  };

  // Synchronize when module changes
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setLessonCompleted(completedModules.includes(activeModule.id));
  }, [activeModule.id, completedModules.length]);

  // Video progress simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setLessonCompleted(true);
            return 100;
          }
          return prev + 10;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Progress Calculations
  const progressPercent = Math.round((completedModules.length / role.modules.length) * 100);
  const isCourseComplete = completedModules.length === role.modules.length;

  // Module lock checking logic
  const isModuleUnlocked = (modIndex: number) => {
    if (modIndex === 0) return true;
    const prevModuleId = role.modules[modIndex - 1].id;
    return completedModules.includes(prevModuleId);
  };

  const handleSelectModule = (mod: CourseModule, idx: number) => {
    if (isModuleUnlocked(idx)) {
      setSelectedModuleId(mod.id);
    }
  };

  // Complete module via quiz passing
  const quiz = activeModule.quiz;
  const totalQuestions = quiz?.questions?.length || 1;
  const correctCount = Object.entries(quizAnswers).filter(
    ([qIdx, optIdx]) => quiz.questions[Number(qIdx)]?.correctIndex === optIdx
  ).length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const isQuizPassed = scorePercentage >= (quiz?.passingScore || 70);

  const handleCompleteQuiz = () => {
    setQuizSubmitted(true);
    if (isQuizPassed) {
      enrollmentStore.completeModule(enrollment.id, activeModule.id, scorePercentage);
      setLessonCompleted(true);
      
      // Auto unlock next module in state
      if (activeModuleIndex < role.modules.length - 1) {
        const nextMod = role.modules[activeModuleIndex + 1];
        setTimeout(() => {
          setShowQuizModal(false);
          setSelectedModuleId(nextMod.id);
        }, 1200);
      }
    }
  };

  const handleNextModuleAction = () => {
    if (activeModuleIndex < role.modules.length - 1) {
      const nextMod = role.modules[activeModuleIndex + 1];
      if (isModuleUnlocked(activeModuleIndex + 1)) {
        setSelectedModuleId(nextMod.id);
      }
    }
  };

  const handlePreviousModuleAction = () => {
    if (activeModuleIndex > 0) {
      setSelectedModuleId(role.modules[activeModuleIndex - 1].id);
    }
  };

  return (
    <div className="w-full bg-[#FDFDFE] min-h-screen pb-20">

      {/* TOP LEFT DEDICATED BACK BUTTON ICON TO ROLE DETAIL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1 flex items-center">
        <button 
          onClick={() => navigate('role-detail', { roleId: role.id, skillId: skill.id })}
          className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-slate-100/90 text-slate-800 hover:text-[#1864DB] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Back to Team Leader Curriculum"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5] text-slate-800 group-hover:text-[#1864DB] group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2. MAIN LEARNING WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        
        {/* 1. TOP TEAM LEADER COURSE PROGRESS FLAT CARD (Home page green background & curved card styling with depth) */}
        <div className="w-full bg-[#DCEAF0] rounded-[22px] p-5 sm:p-6 mb-6 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)] border border-white/80 transition-all relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Course Progress
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B192C] tracking-tight">
                {role.title} Course Progress
              </h2>
            </div>

            <div className="flex items-baseline sm:flex-col sm:items-end gap-2 sm:gap-0.5">
              <span className="text-sm sm:text-base font-black text-[#0B192C]">
                {completedModules.length} to {role.modules.length} Modules ({progressPercent}%)
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {completedModules.length} of {role.modules.length} Completed
              </span>
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#1864DB] transition-all duration-500 shadow-xs" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* COURSE COMPLETED BANNER (If All Modules Finished) */}
        {isCourseComplete && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-[22px] border border-emerald-200 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-lg">
                <Award className="w-6 h-6 text-emerald-600" />
                <span>Learning Complete</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-700 max-w-xl">
                You have completed all sequential digital modules for <strong>{role.title}</strong>. Your verifiable SkillGo credential is ready for review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={() => navigate('course-complete', { enrollmentId: enrollment.id, roleId: role.id })}
                id="view-course-completion-btn"
              >
                Proceed to Course Completion
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT / MAIN LESSON WORKSPACE (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Current Lesson Header */}
            <div className="bg-white rounded-[22px] p-6 sm:p-8 border border-slate-100/90 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)]">
              
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0B192C] text-white text-xs font-bold">
                    MODULE {activeModule.moduleNumber < 10 ? `0${activeModule.moduleNumber}` : activeModule.moduleNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Lesson {activeModule.moduleNumber}.1
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeModule.durationMinutes} mins total</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-2.5xl font-black text-[#0B192C] tracking-tight mb-2">
                {activeModule.title}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                {activeModule.summary}
              </p>

            </div>

            {/* VIDEO / INTERACTIVE PLAYER AREA */}
            <div className="bg-slate-950 rounded-[22px] overflow-hidden shadow-md border border-slate-800 text-white relative">
              
              <div className="relative aspect-video w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                
                {!isPlaying && videoProgress === 0 && (
                  <div className="text-center p-6 space-y-4 z-10 max-w-md">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6B00] hover:bg-[#FF7A1A] active:scale-95 text-white flex items-center justify-center mx-auto shadow-2xl transition-all cursor-pointer group z-30 pointer-events-auto"
                      id="play-lesson-video-btn"
                      aria-label="Play lesson video"
                    >
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white group-hover:scale-110 transition-transform" />
                    </button>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                        {activeModule.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Interactive Video SOP Demonstration • {activeModule.videoDuration || '12:45'}
                      </p>
                    </div>
                  </div>
                )}

                {isPlaying && (
                  activeModule.videoUrl ? (
                    <div className="w-full h-full flex flex-col justify-between z-20 relative bg-slate-950 pointer-events-auto">
                      <div className="flex-1 w-full relative bg-black pointer-events-auto">
                        <iframe 
                          src={activeModule.videoUrl} 
                          loading="lazy" 
                          className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" 
                          allowFullScreen
                        />
                      </div>
                      <div className="p-3 bg-slate-900 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800 shrink-0">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Watching Lesson ({videoProgress}%)
                        </span>
                        <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#FF6B00] h-full transition-all duration-300" style={{ width: `${videoProgress}%` }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-between p-6 z-10">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Playing SOP Demonstration
                        </span>
                        <span>{Math.round((videoProgress / 100) * 12)}:30 / 12:30</span>
                      </div>

                      <div className="text-center space-y-2">
                        <div className="text-lg sm:text-xl font-bold text-white">
                          Standard Operating Procedure Walkthrough
                        </div>
                        <p className="text-xs text-slate-300 max-w-sm mx-auto">
                          Observing scanning checkpoints, location coordinates & quality standards.
                        </p>
                      </div>

                      {/* Simulation progress bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#FF6B00] h-full transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}

                {!isPlaying && videoProgress === 100 && (
                  <div className="text-center p-6 space-y-4 z-10">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-black text-xl">
                      <Check className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                        Lesson Completed
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        You have completed the video walkthrough. Take the module quiz to verify your knowledge and unlock the next module.
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => { setVideoProgress(0); setIsPlaying(true); }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Rewatch
                      </button>

                      <button
                        onClick={handleOpenQuiz}
                        className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#FF7A1A] text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Take Module Quiz</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* WHAT YOU'LL LEARN IN THIS LESSON & KEY TAKEAWAYS */}
            <div className="bg-white rounded-[22px] p-6 sm:p-8 border border-slate-100/90 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)] space-y-6">
              
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0B192C] mb-1">
                  What you'll learn in this module
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Core competencies and on-floor execution guidelines:
                </p>
              </div>

              <div className="space-y-3">
                {activeModule.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-6 border-t border-slate-100">
                {quizLockWarning && (
                  <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center gap-2">
                    <span>Quiz is locked! Please watch at least 80% of the video lesson (Current: {videoProgress}%) to unlock the assessment.</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeModuleIndex === 0}
                    onClick={handlePreviousModuleAction}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                      activeModuleIndex === 0 
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 cursor-pointer'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    disabled={activeModuleIndex >= role.modules.length - 1 || !isModuleUnlocked(activeModuleIndex + 1)}
                    onClick={handleNextModuleAction}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                      activeModuleIndex >= role.modules.length - 1 || !isModuleUnlocked(activeModuleIndex + 1)
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 cursor-pointer'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Action Button */}
                <div>
                  {completedModules.includes(activeModule.id) ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Module Completed ({enrollment.quizScores?.[activeModule.id] || 85}%)</span>
                      </span>

                      {activeModuleIndex < role.modules.length - 1 && (
                        <Button
                          size="md"
                          variant="primary"
                          iconRight={ArrowRight}
                          onClick={handleNextModuleAction}
                        >
                          Continue to Next Module
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      size="md"
                      variant="primary"
                      iconRight={ArrowRight}
                      onClick={handleOpenQuiz}
                      id="take-module-quiz-btn"
                    >
                      Take Module Assessment Quiz
                    </Button>
                  )}
                </div>

              </div>
              </div>

            </div>

          </div>

          {/* RIGHT / SUPPORT SIDEBAR (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-36">
            
            {/* SEQUENTIAL MODULE LIST CARD (Curved with Depth) */}
            <div className="bg-white rounded-[22px] p-6 border border-slate-100/90 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)] space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-[#0B192C]">
                    Course Curriculum
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {completedModules.length} of {role.modules.length} Completed
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1864DB]">
                  {progressPercent}%
                </span>
              </div>

              <div className="space-y-2.5">
                {role.modules.map((m, idx) => {
                  const isDone = completedModules.includes(m.id);
                  const isUnlocked = isModuleUnlocked(idx);
                  const isCurrent = m.id === activeModule.id;
                  const score = enrollment.quizScores?.[m.id];

                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectModule(m, idx)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isCurrent
                          ? 'border-[#1864DB] bg-[#EFF5FA] shadow-xs'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 cursor-pointer'
                          : isUnlocked
                          ? 'border-slate-200/80 bg-white hover:border-slate-300 cursor-pointer'
                          : 'border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Status Icon Indicator */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#1864DB] text-white'
                          : isUnlocked
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isDone ? (
                          <Check className="w-4 h-4" />
                        ) : isUnlocked ? (
                          `0${idx + 1}`
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Module {idx + 1}
                          </span>
                          {isDone && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                              Passed {score ? `${score}%` : ''}
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="text-[10px] font-medium text-slate-400">
                              Locked
                            </span>
                          )}
                        </div>

                        <h4 className={`text-xs font-bold truncate mt-0.5 ${
                          isCurrent ? 'text-[#0B192C]' : isDone ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {m.title}
                        </h4>

                        {!isUnlocked && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Pass Module {idx} to unlock
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* PRACTICAL TRAINING / CERTIFICATE GATE */}
            <div className="bg-white rounded-[22px] p-6 border border-slate-100/90 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.06)] text-xs text-slate-700 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Certification Gate</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Pass all {role.moduleCount} module quizzes with ≥ 70% score to generate your official verifiable SkillGo certificate.
              </p>

              {isCourseComplete ? (
                <button
                  onClick={() => {
                    if (enrollment.assessmentPassed && enrollment.certificateId) {
                      navigate('certificate', { enrollmentId: enrollment.id, roleId: role.id });
                    } else {
                      navigate('course-complete', { enrollmentId: enrollment.id, roleId: role.id });
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[#0B192C] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{enrollment.assessmentPassed ? 'View Verified Certificate' : 'Proceed to Next Step →'}</span>
                </button>
              ) : (
                <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked until course completion</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* 3. MODULE QUIZ MODAL */}
      <Modal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        title={`${activeModule.title} — Assessment Quiz`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-6 text-sm text-slate-700">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              Passing Mark: {quiz?.passingScore || 70}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {quiz?.questions?.length || 1} Scenarios
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Select the correct standard procedure. Score ≥ 70% to complete this module.
          </p>

          {/* Question List */}
          <div className="space-y-5">
            {quiz?.questions?.map((q, qIndex) => {
              const selectedOpt = quizAnswers[qIndex];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#0B192C] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {q.question}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedOpt === optIndex;
                      let btnStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

                      if (quizSubmitted) {
                        if (optIndex === q.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'border-[#0B192C] bg-blue-50 text-[#0B192C] font-bold ring-1 ring-[#0B192C]';
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results Feedback */}
          {quizSubmitted && (
            <div className={`p-4 rounded-2xl border text-xs ${
              isQuizPassed 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {isQuizPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Module Passed! Score: {scorePercentage}%</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Quiz Incomplete — Score: {scorePercentage}% (Need {quiz.passingScore}%)</span>
                  </>
                )}
              </div>
              <p>
                {isQuizPassed 
                  ? 'Great job! You have unlocked the next module in your curriculum.' 
                  : 'Review the module takeaways and retry the assessment.'}
              </p>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            {quizSubmitted && !isQuizPassed ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
              >
                Retry Quiz
              </Button>
            ) : !quizSubmitted ? (
              <Button
                variant="primary"
                size="md"
                disabled={Object.keys(quizAnswers).length < (quiz?.questions?.length || 1)}
                onClick={handleCompleteQuiz}
                id="submit-quiz-answers-btn"
              >
                Submit & Complete Module
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowQuizModal(false)}
              >
                Continue Course
              </Button>
            )}
          </div>

        </div>
      </Modal>

    </div>
  );
}
