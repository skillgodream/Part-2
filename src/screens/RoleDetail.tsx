import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UserCheck, 
  Languages, 
  Play, 
  Sparkles,
  FlaskConical,
  CheckCircle2,
  Lock,
  Layers,
  BookOpen,
  X
} from 'lucide-react';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { useCartState, useEnrollmentState } from '../lib/enrollmentStore';
import { JobRole, SkillCategory, CourseModule } from '../lib/types';
import { CartModal } from '../components/CartModal';

interface PracticalLabItem {
  id: string;
  moduleNumber: number;
  title: string;
  durationText: string;
  toolEquipment: string;
  categoryTag: string;
  status: 'started' | 'not-started' | 'completed';
  progressPercent: number;
}

export function RoleDetailScreen() {
  const { currentRoute, navigate } = useRouter();
  const { addToCart, isSkillEnrolled } = useCartState();
  const { enrollSkill, enrollments } = useEnrollmentState();

  // Resolve Role and Skill dynamically from route parameters
  const roleId = currentRoute.params?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];

  // 1. Navigation / Filter Tabs Modification
  const [activeTab, setActiveTab] = useState<'video-training' | 'practical-lab' | 'open-roles'>('video-training');
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedModuleModal, setSelectedModuleModal] = useState<CourseModule | PracticalLabItem | null>(null);

  const currentEnrollment = enrollments.find(e => e.roleId === role.id);
  const isEnrolled = isSkillEnrolled(role.id) || !!currentEnrollment;
  
  // Calculate completion percent based on modules
  const completedCount = currentEnrollment?.completedModules?.length || 0;
  const totalModulesCount = role.modules && role.modules.length > 0 ? role.modules.length : 3;
  const totalCompletionPercent = isEnrolled 
    ? Math.min(100, Math.round((completedCount / totalModulesCount) * 100) || (currentEnrollment ? 35 : 0))
    : 0;

  // Video modules for this role
  const videoModules = role.modules && role.modules.length > 0 ? role.modules : [
    {
      id: `${role.id}-mod-1`,
      roleId: role.id,
      moduleNumber: 1,
      title: 'Foundation & Operating SOPs',
      durationMinutes: 30,
      summary: 'Master the core digital operating protocols, equipment setup, and baseline procedures.',
      videoDuration: '12:45',
      keyTakeaways: ['Core safety guidelines', 'Digital system operations'],
      quiz: { id: 'q1', moduleId: 'm1', title: 'Basics Quiz', passingScore: 70, questions: [] }
    },
    {
      id: `${role.id}-mod-2`,
      roleId: role.id,
      moduleNumber: 2,
      title: 'Workflow Execution & Scanning',
      durationMinutes: 45,
      summary: 'Standard dispatch, barcode verification, error containment, and quality audits.',
      videoDuration: '18:20',
      keyTakeaways: ['High-speed scanning', 'Zero-defect handling'],
      quiz: { id: 'q2', moduleId: 'm2', title: 'Workflow Quiz', passingScore: 70, questions: [] }
    },
    {
      id: `${role.id}-mod-3`,
      roleId: role.id,
      moduleNumber: 3,
      title: 'Advanced Operations & Escalation',
      durationMinutes: 40,
      summary: 'Exception logging, team coordination, shift handover, and SLA compliance.',
      videoDuration: '15:10',
      keyTakeaways: ['Exception protocols', 'Speed optimizations'],
      quiz: { id: 'q3', moduleId: 'm3', title: 'Operations Quiz', passingScore: 70, questions: [] }
    }
  ];

  // Dynamic Practical Labs generated for this role
  const practicalLabs: PracticalLabItem[] = videoModules.map((mod, idx) => {
    let labStatus: 'started' | 'not-started' | 'completed' = 'not-started';
    let progress = 0;
    if (idx === 0) {
      labStatus = 'started';
      progress = 65;
    } else if (idx === 1 && currentEnrollment?.completedModules?.includes(mod.id)) {
      labStatus = 'completed';
      progress = 100;
    }

    return {
      id: `lab-${mod.id}`,
      moduleNumber: idx + 1,
      title: `Lab ${idx + 1}: ${mod.title.split('&')[0].trim()} Simulation`,
      durationText: `${mod.durationMinutes + 15} mins`,
      toolEquipment: idx === 0 ? 'RF Handheld Scanner' : idx === 1 ? 'Terminal Simulator' : 'Barcode & WMS Rig',
      categoryTag: idx === 0 ? 'Hands-on Drill' : idx === 1 ? 'Live Environment' : 'Capstone Exam',
      status: labStatus,
      progressPercent: progress
    };
  });

  const getModuleStatus = (mod: CourseModule, index: number): { status: 'started' | 'not-started' | 'completed'; label: string; progress: number } => {
    const isCompleted = currentEnrollment?.completedModules?.includes(mod.id);
    if (isCompleted) {
      return { status: 'completed', label: 'Completed', progress: 100 };
    }
    if (index === 0 || (currentEnrollment && currentEnrollment.currentModuleId === mod.id)) {
      return { status: 'started', label: 'Started', progress: 45 };
    }
    return { status: 'not-started', label: 'Not Started', progress: 0 };
  };

  const handleLaunchModule = (moduleId: string) => {
    if (!isEnrolled) {
      enrollSkill(role.id);
    }
    navigate('course-modules', { roleId: role.id, skillId: skill.id, moduleId });
  };

  return (
    <div className="w-full min-h-screen bg-[#1157C7] flex justify-center selection:bg-blue-300 select-none pb-16 overflow-y-auto">
      
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-md bg-[#135ED1] min-h-screen relative flex flex-col shadow-2xl">
        
        {/* 1. TOP HERO SECTION (Airplane boarding background + Floating pill) */}
        <div className="relative w-full h-[220px] shrink-0 overflow-hidden">
          {/* Background Airport / Airplane Image */}
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80" 
            alt="Boarding Gateway" 
            className="w-full h-full object-cover object-center"
          />
          
          {/* Subtle dark glass overlay for perfect readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />

          {/* Top Bar with Back Button */}
          <div className="absolute top-4 left-4 z-20">
            <button 
              onClick={() => navigate('choose-skill', { selectedSkillId: skill.id })}
              className="w-9 h-9 rounded-xl bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#0E2856] stroke-[2.5]" />
            </button>
          </div>

          {/* Center Origin & Destination Floating Widget: Role Name + Program Completion % */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 px-6 z-10 text-center">
            <span className="text-[11px] uppercase tracking-wider text-white/80 font-bold">Career Track</span>
            <h1 className="text-[29px] sm:text-[33px] font-black text-white tracking-tight drop-shadow-md leading-tight mt-0.5 max-w-[340px]">
              {role.title}
            </h1>
            
            {/* Pill Badge: Program Completion % */}
            <div className="mt-2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">Completion :</span>
              <span className="text-[11px] font-black text-[#1864DB]">{totalCompletionPercent}% Completed</span>
            </div>
          </div>
        </div>

        {/* 2. ROYAL BLUE ARCHED CONTAINER */}
        <div className="w-full bg-[#1864DB] rounded-t-[34px] -mt-6 z-20 flex-1 px-5 pt-4 pb-20 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
          
          {/* Mini Action Icons (Interview Prep navigates to interview page, English Prep navigates to english page) */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button 
              onClick={() => navigate('interview-prep', { roleId: role.id, skillId: skill.id })}
              className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Interview Prep"
            >
              <UserCheck className="w-5 h-5 text-[#1864DB] stroke-[2.2]" />
            </button>
            <button 
              onClick={() => navigate('skillgo-english', { roleId: role.id, skillId: skill.id })}
              className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="English Practice"
            >
              <Languages className="w-5 h-5 text-[#1864DB] stroke-[2.2]" />
            </button>
          </div>

          {/* Filter Tabs: Solid complete white card when active */}
          <div className="flex items-center justify-between px-1 mb-5 gap-2">
            <button
              onClick={() => setActiveTab('video-training')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'video-training'
                  ? 'bg-white text-[#1864DB] shadow-md scale-100'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              Video Training
            </button>
            <button
              onClick={() => setActiveTab('practical-lab')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'practical-lab'
                  ? 'bg-white text-[#1864DB] shadow-md scale-100'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              Practical Lab
            </button>
            <button
              onClick={() => setActiveTab('open-roles')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer text-center ${
                activeTab === 'open-roles'
                  ? 'bg-white text-[#1864DB] shadow-md scale-100'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              Open Roles
            </button>
          </div>

          {/* 3. DYNAMICALLY RENDERED MODULE CARDS */}
          {activeTab === 'video-training' && (
            <div className="space-y-4">
              {videoModules.map((mod, index) => {
                const { status, label, progress } = getModuleStatus(mod, index);
                
                // Color-coded pill button for status: Blue (Started), Grey (Not Started), Green (Completed)
                let statusPillClass = 'bg-[#1864DB] text-white hover:bg-blue-700';
                if (status === 'completed') {
                  statusPillClass = 'bg-emerald-600 text-white hover:bg-emerald-700';
                } else if (status === 'not-started') {
                  statusPillClass = 'bg-slate-400 text-white hover:bg-slate-500';
                }

                return (
                  <div 
                    key={mod.id}
                    onClick={() => handleLaunchModule(mod.id)}
                    className="w-full bg-white rounded-[22px] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-white/60 transition-transform active:scale-[0.99] cursor-pointer"
                  >
                    {/* Top Half: Module Name, Progress Bar, Duration */}
                    <div className="flex items-center justify-between px-1">
                      
                      {/* Top-Left: Module Name replaced Video Lesson with Module Title in Blue */}
                      <div className="flex flex-col max-w-[135px]">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Module {mod.moduleNumber || index + 1}
                        </span>
                        <span className="text-sm font-extrabold text-[#1864DB] mt-1 leading-snug line-clamp-2">
                          {mod.title}
                        </span>
                      </div>

                      {/* Middle Flight Icon replacement: Completion Progress Bar */}
                      <div className="flex flex-col items-center justify-center px-2 flex-1 max-w-[105px]">
                        <div className="text-[#1864DB] mb-1 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-[#1864DB] text-[#1864DB]" />
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full rounded-full ${status === 'completed' ? 'bg-emerald-500' : 'bg-[#1864DB]'}`} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1">
                          {progress}% Done
                        </span>
                      </div>

                      {/* Top-Right: Video Length / Duration */}
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-slate-900 leading-none">
                          {mod.durationMinutes ? `${mod.durationMinutes} mins` : '45 mins'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                          {mod.videoDuration || '15:00'} runtime
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 mt-2">
                          HD Video
                        </span>
                      </div>

                    </div>

                    {/* Perforated Dashed Divider */}
                    <div className="w-full border-b border-dashed border-slate-300 my-3" />

                    {/* Bottom Half: Class Icons & Status Pill */}
                    <div className="flex items-center justify-between px-1">
                      
                      {/* Bottom-Left: Sub-text & Module Icons */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                            <BookOpen className="w-3.5 h-3.5" />
                          </div>
                          <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-600 font-bold mt-1">
                          Curriculum Track
                        </span>
                      </div>

                      {/* Bottom-Right: Status Pill Box */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-extrabold text-[#1864DB]">
                          Module Status
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchModule(mod.id);
                          }}
                          className={`${statusPillClass} active:scale-95 text-xs font-extrabold px-5 py-1.5 rounded-full shadow-md transition-all cursor-pointer`}
                        >
                          {label}
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* PRACTICAL LAB VIEW: Warm sage / soft grey warm tone card colors */}
          {activeTab === 'practical-lab' && (
            <div className="space-y-4">
              {practicalLabs.map((lab) => {
                let statusPillClass = 'bg-[#1864DB] text-white hover:bg-blue-700';
                let label = 'Started';
                if (lab.status === 'completed') {
                  statusPillClass = 'bg-emerald-600 text-white hover:bg-emerald-700';
                  label = 'Completed';
                } else if (lab.status === 'not-started') {
                  statusPillClass = 'bg-slate-400 text-white hover:bg-slate-500';
                  label = 'Not Started';
                }

                return (
                  <div 
                    key={lab.id}
                    onClick={() => {
                      const matchingMod = videoModules[lab.moduleNumber - 1];
                      handleLaunchModule(matchingMod?.id || videoModules[0].id);
                    }}
                    className="w-full bg-[#F4F6F0] rounded-[22px] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-[#E1E6DC] transition-transform active:scale-[0.99] cursor-pointer"
                  >
                    {/* Top Half */}
                    <div className="flex items-center justify-between px-1">
                      
                      {/* Top-Left: Lab Title in Blue */}
                      <div className="flex flex-col max-w-[135px]">
                        <span className="text-xs font-bold text-[#4A5D4D] uppercase tracking-wider">
                          Lab {lab.moduleNumber}
                        </span>
                        <span className="text-sm font-extrabold text-[#1864DB] mt-1 leading-snug line-clamp-2">
                          {lab.title}
                        </span>
                      </div>

                      {/* Middle Flight Icon replacement: Progress Bar */}
                      <div className="flex flex-col items-center justify-center px-2 flex-1 max-w-[105px]">
                        <div className="text-[#3B6645] mb-1 flex items-center justify-center">
                          <FlaskConical className="w-4 h-4 text-[#3B6645]" />
                        </div>
                        <div className="w-full bg-[#E5EBE0] rounded-full h-1.5 overflow-hidden border border-[#D5DDD0]">
                          <div 
                            className={`h-full rounded-full ${lab.status === 'completed' ? 'bg-emerald-600' : 'bg-[#3B6645]'}`} 
                            style={{ width: `${lab.progressPercent}%` }} 
                          />
                        </div>
                        <span className="text-[10px] text-[#556958] font-semibold mt-1">
                          {lab.progressPercent}% Done
                        </span>
                      </div>

                      {/* Top-Right: Lab Duration */}
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-[#1E2E20] leading-none">
                          {lab.durationText}
                        </span>
                        <span className="text-[11px] text-[#4A5D4D] font-semibold mt-0.5">
                          Interactive
                        </span>
                        <span className="text-sm font-extrabold text-[#2C402E] mt-2">
                          VR / Sim
                        </span>
                      </div>

                    </div>

                    {/* Perforated Dashed Divider */}
                    <div className="w-full border-b border-dashed border-[#D2DCD0] my-3" />

                    {/* Bottom Half: Tool info & Status Pill */}
                    <div className="flex items-center justify-between px-1">
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg bg-[#2D3E30] flex items-center justify-center text-white">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <div className="w-6 h-6 rounded-lg bg-[#2D3E30] flex items-center justify-center text-white">
                            <FlaskConical className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <span className="text-[11px] text-[#3D5240] font-bold mt-1">
                          {lab.toolEquipment}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-extrabold text-[#2D5A37]">
                          Lab Status
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const matchingMod = videoModules[lab.moduleNumber - 1];
                            handleLaunchModule(matchingMod?.id || videoModules[0].id);
                          }}
                          className={`${statusPillClass} active:scale-95 text-xs font-extrabold px-5 py-1.5 rounded-full shadow-md transition-all cursor-pointer`}
                        >
                          {label}
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* OPEN ROLES VIEW */}
          {activeTab === 'open-roles' && (
            <div className="space-y-4">
              {role.hiringPartners && role.hiringPartners.length > 0 ? (
                role.hiringPartners.map((partner, index) => (
                  <div 
                    key={index}
                    className="w-full bg-white rounded-[22px] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)] border border-white/60 transition-transform active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between px-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 leading-tight">
                          {role.title}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                          {partner}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 mt-2">
                          {role.startingSalary || '₹25,000 / mo'}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-slate-900 leading-none">
                          Full-Time
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                          Verified Recruiter
                        </span>
                        <span className="text-sm font-extrabold text-emerald-600 mt-2">
                          Actively Hiring
                        </span>
                      </div>
                    </div>

                    <div className="w-full border-b border-dashed border-slate-300 my-3" />

                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] text-slate-600 font-bold">
                        Certification Direct Referral
                      </span>
                      <button
                        onClick={() => handleLaunchModule(videoModules[0].id)}
                        className="bg-[#1864DB] hover:bg-blue-700 active:scale-95 text-white text-xs font-extrabold px-5 py-1.5 rounded-full shadow-md transition-all cursor-pointer"
                      >
                        Apply with Skill
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[22px] p-6 text-center shadow-lg">
                  <p className="text-sm font-bold text-slate-800">Direct hiring partner vacancies opening soon for this role.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Cart Modal */}
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
        />

      </div>

    </div>
  );
}

