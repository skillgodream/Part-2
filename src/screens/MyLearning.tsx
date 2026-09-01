import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Zap,
  GraduationCap,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Award,
  MessageSquare,
  Mic,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { JOB_ROLES, LIBRARY_ITEMS } from '../lib/catalog';
import animatedPic from '../assets/animated.jpeg';
import inboundPic from '../assets/inbound.jpeg';
import inventoryPic from '../assets/invrentory.jpeg';
import pickerPic from '../assets/picker.jpeg';
import warehousePic from '../assets/warehouse pic.jpeg';
import { enrollmentStore, cartStore } from '../lib/enrollmentStore';
import { useRouter } from '../lib/router';
import { JobRole, LibraryItem, Enrollment } from '../lib/types';
import { Button } from '../components/ui';
import { WarehouseAssociateCardImage } from '../components/WarehouseAssociateCardImage';
import { useLanguage, t } from '../lib/i18n';

export function MyLearningScreen() {
  const { navigate } = useRouter();
  const lang = useLanguage();

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => enrollmentStore.getEnrollments());
  const [purchasedLibraryItemIds, setPurchasedLibraryItemIds] = useState<string[]>(() => cartStore.getPurchasedLibraryItemIds());

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

  // activeTab: 'none' (main 2 cards), 'career' (5 career cards), 'reel' (purchased reels), 
  // or specific sub-sections under career: 'career-modules', 'career-interview', 'career-english'
  const [activeTab, setActiveTab] = useState<'none' | 'career' | 'reel' | 'career-modules' | 'career-interview'>('none');

  const ROLE_IMAGES: Record<string, string> = {
    'warehouse-associate': animatedPic,
    'qc-inbound-inspector': '/assets/images/inbound dp.jpeg',
    'inventory-staging-specialist': '/assets/images/inventory.jpeg',
    'dispatch-fleet-coordinator': '/assets/images/outbound.jpeg',
    'dark-store-picker-packer': '/assets/images/Picker dp.jpeg',
    'retail-store-associate': 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    'cashier-pos-specialist': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
    'visual-merchandiser': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    'store-inventory-supervisor': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  };

  // Purchased Career Skills (Enrollments)
  const purchasedCareerRoles = enrollments.map(enr => {
    const role = JOB_ROLES.find(r => r.id === enr.roleId);
    return { enrollment: enr, role };
  }).filter(item => item.role !== undefined) as { enrollment: Enrollment; role: JobRole }[];

  // Purchased Reel to Skill Items
  const purchasedReelItems = purchasedLibraryItemIds.map(id => {
    return LIBRARY_ITEMS.find(item => item.id === id);
  }).filter(item => item !== undefined) as LibraryItem[];

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pb-24 font-sans text-slate-900">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* 1. HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{t('learningHub', lang)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('myLearningTitle', lang)}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-medium">
              {t('myLearningSubtitle', lang)}
            </p>
          </div>
        </div>

        {/* 2. MAIN VIEW: TWO CARDS */}
        {activeTab === 'none' && (
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Choose a Category</h2>
              <p className="text-xs sm:text-sm text-slate-500">Select a learning category below</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              
              {/* CARD 1: CAREER SKILLS (WARM TONE TEMPERATURE) */}
              <div
                id="learning-category-career"
                onClick={() => setActiveTab('career')}
                className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/40 rounded-2xl border-2 border-amber-200/90 shadow-xs hover:shadow-lg hover:border-amber-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/15 rounded-full blur-xl group-hover:bg-amber-500/25 transition-all" />
                
                <div className="space-y-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-300">
                        {purchasedCareerRoles.length} Enrolled
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-800 transition-colors mt-1.5">
                      Career Skills
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                      Certification tracks, video modules, practical training, interview & English practice.
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-bold text-amber-800 relative z-10">
                  <span>Open Hub</span>
                  <div className="w-7 h-7 rounded-full bg-amber-200/70 group-hover:bg-amber-600 text-amber-800 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 2: REEL TO SKILL (COOL TONE TEMPERATURE) */}
              <div
                id="learning-category-reel"
                onClick={() => setActiveTab('reel')}
                className="bg-gradient-to-br from-cyan-50/90 via-blue-50/40 to-indigo-100/40 rounded-2xl border-2 border-cyan-200/90 shadow-xs hover:shadow-lg hover:border-cyan-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/15 rounded-full blur-xl group-hover:bg-cyan-500/25 transition-all" />
                
                <div className="space-y-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-200/70 text-cyan-800 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-cyan-300">
                        {purchasedReelItems.length} Unlocked
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-cyan-800 transition-colors mt-1.5">
                      Reel to Skill
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                      Quick 5 mins learning modules, masterclasses, and tactical standard operating procedures.
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-cyan-200/60 flex items-center justify-between text-[11px] font-bold text-cyan-800 relative z-10">
                  <span>View Reels</span>
                  <div className="w-7 h-7 rounded-full bg-cyan-200/70 group-hover:bg-cyan-600 text-cyan-800 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. SUB-VIEW: CAREER SKILLS 5 CARDS (2 CARDS IN ONE LINE, APPLE CARD STYLE) */}
        {activeTab === 'career' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('none')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Categories</span>
              </button>

              <div className="text-xs font-bold text-amber-800 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
                Career Skills Hub
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Career Development Suite</h2>
                <p className="text-xs text-slate-500">Select a learning track below to access professional training</p>
              </div>

              {/* 5 CARDS IN 2-COLUMN GRID (WARM & COOL TEMPERATURES) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                
                {/* 1. MODULES (Cool Tone) */}
                <div
                  onClick={() => setActiveTab('career-modules')}
                  className="bg-gradient-to-br from-cyan-50/80 to-slate-50/80 rounded-2xl border border-cyan-200/90 shadow-xs hover:shadow-lg hover:border-cyan-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
                  <div className="space-y-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-cyan-200">
                        Curriculum
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1.5 group-hover:text-cyan-800 transition-colors">
                        Modules
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        Video lessons, learning chapters, and step-by-step role curriculum.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-cyan-200/60 flex items-center justify-between text-[11px] font-bold text-cyan-800 relative z-10">
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. PRACTICAL (Warm Tone) */}
                <div
                  onClick={() => navigate('practical-training')}
                  className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl border border-amber-200/90 shadow-xs hover:shadow-lg hover:border-amber-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
                  <div className="space-y-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                        Hands-on
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1.5 group-hover:text-amber-800 transition-colors">
                        Practical
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        Simulation labs, barcode scanning drills, and workplace scenarios.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-bold text-amber-800 relative z-10">
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. CERTIFICATION (Warm Tone) */}
                <div
                  onClick={() => navigate('certificate')}
                  className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 rounded-2xl border border-orange-200/90 shadow-xs hover:shadow-lg hover:border-orange-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all" />
                  <div className="space-y-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-200">
                        Credential
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1.5 group-hover:text-orange-800 transition-colors">
                        Certification
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        Final assessment tests, verified professional certificates, and badge downloads.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-orange-200/60 flex items-center justify-between text-[11px] font-bold text-orange-800 relative z-10">
                    <span>Certificates</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. INTERVIEW PREP (Cool Tone) */}
                <div
                  onClick={() => navigate('interview-prep', { returnTo: 'my-learning' })}
                  className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-2xl border border-indigo-200/90 shadow-xs hover:shadow-lg hover:border-indigo-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
                  <div className="space-y-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200">
                        Career Success
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1.5 group-hover:text-indigo-800 transition-colors">
                        Interview Prep
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        Common interview questions, HR rounds preparation, and resume tips.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-indigo-200/60 flex items-center justify-between text-[11px] font-bold text-indigo-800 relative z-10">
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 5. ENGLISH PRACTICE (Cool Tone - spans 2 columns) */}
                <div
                  onClick={() => navigate('english-practice-home')}
                  className="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 rounded-2xl border border-teal-200/90 shadow-xs hover:shadow-lg hover:border-teal-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between group relative overflow-hidden col-span-2"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all" />
                  <div className="space-y-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-teal-200">
                        Communication
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1.5 group-hover:text-teal-800 transition-colors">
                        English Practice
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Build your workplace English skills
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-teal-200/60 flex items-center justify-between text-[11px] font-bold text-teal-800 relative z-10">
                    <span>Start English Practice</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 4. SUB-SUB-VIEW: MODULES (PURCHASED CAREER ROLES) */}
        {activeTab === 'career-modules' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('career')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Career Suite</span>
              </button>

              <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                {purchasedCareerRoles.length} Enrolled Roles
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Your Enrolled Career Modules</h2>
              {purchasedCareerRoles.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">No Career Tracks Enrolled Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Explore our certified job roles and unlock your career path.
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('choose-skill')}
                    >
                      Explore Career Skills →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {purchasedCareerRoles.map(({ enrollment, role }) => {
                    const roleImage = ROLE_IMAGES[role.id] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
                    return (
                      <div
                        key={enrollment.id}
                        onClick={() => navigate('course-modules', { roleId: role.id, plan: enrollment.plan })}
                        className={`${role.id === 'warehouse-associate'
                          ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-md'
                          : 'bg-white border border-slate-200/90 text-slate-900 shadow-sm'
                        } rounded-3xl hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer p-4 flex flex-col justify-between group relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/15 before:to-white/5 before:pointer-events-none`}
                      >
                        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                          <img
                            src={roleImage}
                            alt={role.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            {enrollment.plan} Plan • Unlocked
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {role.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {role.shortDescription}
                          </p>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                            <span className="text-emerald-600 font-bold">Open Video Modules →</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. SUB-SUB-VIEW: INTERVIEW PREP */}
        {activeTab === 'career-interview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('career')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Career Suite</span>
              </button>

              <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
                Interview Masterclass
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">Top Interview Questions & Tips</h2>
                <p className="text-xs sm:text-sm text-slate-500">Prepare for your HR and operations rounds with top employer questions</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { q: "Tell me about your previous experience in logistics/retail.", tip: "Highlight punctuality, safety record, and handling peak hours." },
                  { q: "How do you handle an upset or difficult customer?", tip: "Emphasize active listening, staying calm, and offering prompt solutions." },
                  { q: "Are you comfortable with rotating shifts and targets?", tip: "Confirm your reliability, physical stamina, and punctuality." },
                  { q: "Why do you want to join our organization?", tip: "Mention growth opportunities, professional standards, and team spirit." },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-2xs hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.q}</h4>
                        <p className="text-xs text-indigo-700 bg-indigo-50/60 p-2.5 rounded-xl mt-2 border border-indigo-100 font-medium">
                          💡 <strong>Pro Tip:</strong> {item.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. SUB-VIEW: PURCHASED REEL TO SKILL */}
        {activeTab === 'reel' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('none')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Categories</span>
              </button>

              <div className="text-xs font-bold text-pink-700 bg-pink-50 px-3.5 py-1.5 rounded-full border border-pink-200">
                {purchasedReelItems.length} Reel Modules Unlocked
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-black text-slate-900">Your Purchased Reel to Skill Modules</h2>
              {purchasedReelItems.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">No Reel Modules Purchased Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Explore our bite-sized Reel to Skill library and unlock quick 5-minute operational masterclasses.
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('library')}
                    >
                      Explore Reel Library →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {purchasedReelItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate('library-detail', { libraryId: item.id })}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-pink-500 transition-all cursor-pointer p-4 flex flex-col justify-between group"
                    >
                      <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          Unlocked
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded uppercase">
                            {item.category || 'Quick Reel'}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {item.summary}
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                          <div className="inline-flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-pink-600" />
                            <span>{item.duration || item.readTime || '5 mins'}</span>
                          </div>
                          <span className="text-pink-600 font-bold">Watch Module →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
