import React from 'react';
import { ArrowLeft, Clock, PlayCircle, Lock, Check } from 'lucide-react';
import { ProgressBar } from '../components/ui';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useEnrollmentState, enrollmentStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, SkillCategory, Enrollment } from '../lib/types';

export function CourseModuleListScreen() {
  const { currentRoute, navigate } = useRouter();
  const { activeEnrollment } = useEnrollmentState();

  const roleId = currentRoute.params?.roleId || activeEnrollment?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];
  
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
  const progressPercent = Math.round((completedModules.length / role.modules.length) * 100);

  const isModuleUnlocked = (modIndex: number) => {
    if (modIndex === 0) return true;
    const prevModuleId = role.modules[modIndex - 1].id;
    return completedModules.includes(prevModuleId);
  };

  const handleModuleClick = (moduleId: string) => {
    navigate('course-modules', { roleId: role.id, moduleId });
  };

  return (
    <div className="w-full bg-[#FDFDFE] min-h-screen pb-20">
      <header className="bg-emerald-50/80 backdrop-blur-md border-b border-emerald-100/50 sticky top-16 sm:top-18 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('role-detail', { roleId: role.id })}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-lg font-black text-[#0B192C]">{role.title}</h1>
              <p className="text-xs text-slate-500">{role.modules.length} Modules • Step-by-step curriculum</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{progressPercent}%</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <section className="space-y-4">

          <div className="space-y-3">
            {role.modules.map((m, idx) => {
              const isDone = completedModules.includes(m.id);
              const isUnlocked = isModuleUnlocked(idx);

              return (
                <div 
                  key={m.id}
                  onClick={() => isUnlocked && handleModuleClick(m.id)}
                  className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between gap-3 ${isUnlocked ? 'cursor-pointer hover:border-blue-400 hover:shadow-xs' : 'opacity-60 cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border ${isDone ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200/70'}`}>
                      {isDone ? <Check className="w-5 h-5" /> : `0${m.moduleNumber}`}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-500">{m.durationMinutes} mins</p>
                    </div>
                  </div>
                  {!isUnlocked && <Lock className="w-4 h-4 text-slate-400" />}
                  {isUnlocked && <PlayCircle className="w-5 h-5 text-slate-400" />}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
