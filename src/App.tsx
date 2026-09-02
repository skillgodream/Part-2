import React, { useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { SkillGoLogo, Button, Badge, Modal } from './components/ui';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingWelcomeScreen } from './screens/OnboardingWelcome';
import { OnboardingDetailsScreen } from './screens/OnboardingDetails';
import { OnboardingOtpScreen } from './screens/OnboardingOtp';
import { HomeScreen } from './screens/Home';
import { ChooseSkillScreen } from './screens/ChooseSkill';
import { RoleDetailScreen } from './screens/RoleDetail';
import { ChoosePlanScreen } from './screens/ChoosePlan';
import { CourseModulesScreen } from './screens/CourseModules';
import { CourseModuleListScreen } from './screens/CourseModuleList';
import { ModuleVideoScreen } from './screens/ModuleVideo';
import { ModuleQuizScreen } from './screens/ModuleQuiz';
import { CourseCompleteScreen } from './screens/CourseComplete';
import { PracticalTrainingScreen } from './screens/PracticalTraining';
import { FinalAssessmentScreen } from './screens/FinalAssessment';
import { MyLearningScreen } from './screens/MyLearning';
import { MyDashboardScreen } from './screens/MyDashboard';
import { LibraryScreen } from './screens/Library';
import { LibraryDetailScreen } from './screens/LibraryDetail';
import { CertificateScreen } from './screens/Certificate';
import { TrainingViewerScreen } from './screens/TrainingViewer';
import { AiRoleplayPrototype } from './screens/AiRoleplayPrototype';
import { InterviewPrep } from './components/InterviewPrep';
import { SkillGoEnglish } from './screens/SkillGoEnglish';
import { EnglishTarget } from './screens/EnglishPractice/EnglishTarget';
import { EnglishPracticeHome } from './screens/EnglishPractice/EnglishHome';
import { TranslateSpeak } from './screens/EnglishPractice/TranslateSpeak';
import { AnswerImprove } from './screens/EnglishPractice/AnswerImprove';
import { RealConversations } from './screens/EnglishPractice/RealConversations';
import { SentenceLibrary } from './screens/EnglishPractice/SentenceLibrary';
import { useEnrollmentState, useCartState, enrollmentStore, cartStore } from './lib/enrollmentStore';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  BookOpen, 
  Layers, 
  Award, 
  Sparkles,
  Compass,
  Briefcase,
  GraduationCap,
  Zap,
  Home,
  TrendingUp,
  Receipt,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  LogOut,
  Settings,
  Globe
} from 'lucide-react';
import { CartModal } from './components/CartModal';
import { LanguageModal } from './components/LanguageModal';
import { DailyChallengeCard } from './components/DailyChallengeCard';

function AppLayout() {
  const { currentRoute, navigate } = useRouter();
  const { profile } = useEnrollmentState();
  const { itemCount } = useCartState();
  const [loadingStage, setLoadingStage] = useState<'splash' | 'banner' | 'app'>('splash');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [orderHistoryModalOpen, setOrderHistoryModalOpen] = useState(false);
  const [selectedOrderRecord, setSelectedOrderRecord] = useState<any | null>(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('skillgo_active_language_v1') || 'en';
  });

  const handleSelectLanguage = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem('skillgo_active_language_v1', code);
    window.dispatchEvent(new Event('skillgo-lang-change'));
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifySearched, setVerifySearched] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<{ type: 'success' | 'failed'; message: string; txnid?: string } | null>(null);

  // Check URL hash for direct verification links like #verify=SG-CERT-884912 and PayU return parameters
  React.useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify=')) {
        const queryId = decodeURIComponent(hash.replace('#verify=', ''));
        if (queryId) {
          setVerifyInput(queryId);
          const result = enrollmentStore.verifyCertificate(queryId);
          setVerifyResult(result);
          setVerifySearched(true);
          setVerifyModalOpen(true);
        }
      }
    };

    const handleQueryParamsCheck = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const txnid = urlParams.get('txnid');

      if (paymentStatus === 'success') {
        // Unlock items in cart
        const cart = cartStore.getCart();
        let orderResult = null;
        if (cart.length > 0) {
          orderResult = cartStore.checkoutOrder('upi');
        }
        setPaymentNotice({
          type: 'success',
          message: 'PayU Payment Successful! Your course access is activated.',
          txnid: txnid || undefined
        });
        // Clean URL search params without reload
        window.history.replaceState({}, document.title, window.location.pathname);

        // Navigate to the main My Learning screen
        navigate('my-learning');
      } else if (paymentStatus === 'failed') {
        setPaymentNotice({
          type: 'failed',
          message: 'PayU Payment was cancelled or could not be completed.',
          txnid: txnid || undefined
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleHashCheck();
    handleQueryParamsCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;
    const result = enrollmentStore.verifyCertificate(verifyInput);
    setVerifyResult(result);
    setVerifySearched(true);
  };

  const handleSplashComplete = () => {
    setLoadingStage('app');
  };

  // If currently on Onboarding flow, render standalone onboarding experience
  if (currentRoute.screen === 'onboarding-welcome') {
    return (
      <>
        {loadingStage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
        <OnboardingWelcomeScreen />
      </>
    );
  }

  if (currentRoute.screen === 'onboarding-details') {
    return (
      <>
        {loadingStage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
        <OnboardingDetailsScreen />
      </>
    );
  }

  if (currentRoute.screen === 'onboarding-otp') {
    return (
      <>
        {loadingStage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
        <OnboardingOtpScreen />
      </>
    );
  }

  const navLinks = [
    { label: 'Home', screen: 'home' as const },
    { label: 'Courses', screen: 'choose-skill' as const },
    { label: 'Skills', screen: 'choose-skill' as const },
    { label: 'Library', screen: 'library' as const },
    { label: 'My Learning', screen: 'my-learning' as const },
    { label: 'My Dashboard', screen: 'my-dashboard' as const },
  ];

  // Determine active bottom tab for mobile
  const getActiveTab = () => {
    const s = currentRoute.screen;
    if (s === 'home') return 'home';
    if (s === 'choose-skill' || s === 'skill-detail' || s === 'role-detail' || s === 'choose-plan') return 'careers';
    if (s === 'my-learning') return 'learning';
    if (s === 'my-dashboard' || s === 'course-modules' || s === 'module-video' || s === 'module-quiz' || s === 'course-complete' || s === 'final-assessment') return 'dashboard';
    if (s === 'practical-training') return 'practice';
    if (s === 'certificate') return 'dashboard';
    if (s === 'library' || s === 'library-detail') return 'home';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* 0. PREMIUM ANIMATED SPLASH SCREEN (Initial Load Only) */}
      {loadingStage === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

      {loadingStage === 'app' && (
        <div className={`h-screen flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white ${currentRoute.screen === 'home' ? 'bg-[#DCEAF0]' : currentRoute.screen === 'library' ? 'bg-[#FFF8F9]' : 'bg-[#FDFDFE]'}`}>
          
          {/* 1. APPLE-STYLE TRANSLUCENT TOP NAVIGATION BAR (Hidden on Home, Role Detail, and My Learning Screen; Transparent on Choose Skill) */}
          {currentRoute.screen !== 'home' && currentRoute.screen !== 'role-detail' && currentRoute.screen !== 'my-learning' && (
            <nav className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 transition-colors ${
              currentRoute.screen === 'choose-skill' || currentRoute.screen === 'skill-detail'
                ? 'bg-transparent border-none'
                : 'bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-xs'
            }`}>
              {currentRoute.screen === 'choose-skill' || currentRoute.screen === 'skill-detail' ? (
                <button 
                  onClick={() => {
                    if (currentRoute.screen === 'choose-skill' && currentRoute.params?.selectedSkillId) {
                      navigate('choose-skill');
                    } else {
                      navigate('home');
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/60 hover:bg-white/90 active:scale-95 backdrop-blur-md border border-white/70 shadow-sm flex items-center justify-center text-slate-800 transition-all cursor-pointer"
                  title={currentRoute.params?.selectedSkillId ? "Back to Industries" : "Back to Home"}
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
              ) : (
                <SkillGoLogo onClick={() => navigate('home')} />
              )}
              
              <div className="flex items-center gap-2">
                <button onClick={() => setLanguageModalOpen(true)} className="p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/60 shadow-xs text-slate-700 transition-all cursor-pointer"><Globe className="w-4.5 h-4.5" /></button>
                <button onClick={() => setCartModalOpen(true)} className="p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/60 shadow-xs text-slate-700 transition-all cursor-pointer"><ShoppingBag className="w-4.5 h-4.5" /></button>
                <button onClick={() => setProfileModalOpen(true)} className="p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/60 shadow-xs text-slate-700 transition-all cursor-pointer"><User className="w-4.5 h-4.5" /></button>
              </div>
            </nav>
          )}

          {/* 2. DYNAMIC SCREEN CONTENT */}
          {(() => {
            const isChooseSkill = currentRoute.screen === 'choose-skill' || currentRoute.screen === 'skill-detail';
            return (
              <main className={`flex-1 overflow-y-auto ${
                currentRoute.screen === 'home' || currentRoute.screen === 'role-detail' || currentRoute.screen === 'my-learning' 
                  ? 'pt-0 pb-0' 
                  : isChooseSkill
                    ? 'pt-14 pb-4'
                    : 'pt-16 pb-20 md:pb-0'
              } flex flex-col`}>
                {currentRoute.screen === 'home' && <HomeScreen />}
                {currentRoute.screen === 'choose-skill' && <ChooseSkillScreen />}
                {currentRoute.screen === 'skill-detail' && <ChooseSkillScreen />}
                {currentRoute.screen === 'role-detail' && <RoleDetailScreen />}
                {currentRoute.screen === 'choose-plan' && <ChoosePlanScreen />}
                {currentRoute.screen === 'course-modules' && <CourseModulesScreen />}
                {currentRoute.screen === 'course-module-list' && <CourseModuleListScreen />}
                {currentRoute.screen === 'module-video' && <ModuleVideoScreen />}
                {currentRoute.screen === 'module-quiz' && <ModuleQuizScreen />}
                {currentRoute.screen === 'course-complete' && <CourseCompleteScreen />}
                {currentRoute.screen === 'practical-training' && <PracticalTrainingScreen />}
                {currentRoute.screen === 'training-viewer' && <TrainingViewerScreen />}
                {currentRoute.screen === 'final-assessment' && <FinalAssessmentScreen />}
                {currentRoute.screen === 'my-learning' && <MyLearningScreen />}
                {currentRoute.screen === 'my-dashboard' && <MyDashboardScreen />}
                {currentRoute.screen === 'library' && <LibraryScreen />}
                {currentRoute.screen === 'library-detail' && <LibraryDetailScreen />}
                {currentRoute.screen === 'certificate' && <CertificateScreen />}
                {currentRoute.screen === 'roleplay' && <AiRoleplayPrototype />}
                {currentRoute.screen === 'interview-prep' && <InterviewPrep />}
                {currentRoute.screen === 'skillgo-english' && <SkillGoEnglish />}
                {currentRoute.screen === 'english-target' && <EnglishTarget />}
                {currentRoute.screen === 'english-practice-home' && <EnglishPracticeHome />}
                {currentRoute.screen === 'english-practice-translate' && <TranslateSpeak />}
                {currentRoute.screen === 'english-practice-answer' && <AnswerImprove />}
                {currentRoute.screen === 'english-practice-real' && <RealConversations />}
                {currentRoute.screen === 'english-practice-library' && <SentenceLibrary />}
              </main>
            );
          })()}

          {/* 3. TRANSLUCENT APPLE GLASS DOCK NAVIGATION BAR WITH APPLE-STYLE FROSTED GLASS ICONS */}
          {currentRoute.screen !== 'role-detail' && 
           currentRoute.screen !== 'my-learning' && 
           currentRoute.screen !== 'choose-skill' && 
           currentRoute.screen !== 'skill-detail' && (
            <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
              <nav 
                id="mobile-bottom-nav"
                className="pointer-events-auto bg-white/40 hover:bg-white/50 backdrop-blur-3xl border border-white/70 shadow-[0_14px_38px_rgba(0,0,0,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.95)] px-3 py-2 rounded-[28px] w-full max-w-[375px] flex items-center justify-between gap-1 transition-all"
              >
                {/* Tab 1: Home */}
                <button
                  onClick={() => navigate('home')}
                  id="mobile-bottom-tab-home"
                  className="group relative flex flex-col items-center justify-center flex-1 py-0.5 cursor-pointer select-none"
                >
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-1.5 group-hover:scale-110 ${
                    activeTab === 'home' 
                      ? '-translate-y-1 scale-105 border border-emerald-500/60 bg-emerald-500/15 text-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)]' 
                      : 'border border-white/60 text-slate-700 bg-white/50 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50/50'
                  }`}>
                    <Home className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'home' ? 'stroke-[2.5] text-emerald-600' : 'stroke-[2]'}`} />
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight transition-all duration-200 ${activeTab === 'home' ? 'font-extrabold text-emerald-600' : 'font-semibold text-slate-700'}`}>
                    Home
                  </span>
                </button>

                {/* Tab 2: Careers */}
                <button
                  onClick={() => navigate('choose-skill')}
                  id="mobile-bottom-tab-careers"
                  className="group relative flex flex-col items-center justify-center flex-1 py-0.5 cursor-pointer select-none"
                >
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-1.5 group-hover:scale-110 ${
                    activeTab === 'careers' 
                      ? '-translate-y-1 scale-105 border border-emerald-500/60 bg-emerald-500/15 text-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)]' 
                      : 'border border-white/60 text-slate-700 bg-white/50 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50/50'
                  }`}>
                    <ShoppingBag className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'careers' ? 'stroke-[2.5] text-emerald-600' : 'stroke-[2]'}`} />
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight transition-all duration-200 ${activeTab === 'careers' ? 'font-extrabold text-emerald-600' : 'font-semibold text-slate-700'}`}>
                    Careers
                  </span>
                </button>

                {/* Tab 3: My Learning */}
                <button
                  onClick={() => navigate('my-learning')}
                  id="mobile-bottom-tab-learning"
                  className="group relative flex flex-col items-center justify-center flex-1 py-0.5 cursor-pointer select-none"
                >
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-1.5 group-hover:scale-110 ${
                    activeTab === 'learning' 
                      ? '-translate-y-1 scale-105 border border-emerald-500/60 bg-emerald-500/15 text-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)]' 
                      : 'border border-white/60 text-slate-700 bg-white/50 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50/50'
                  }`}>
                    <BookOpen className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'learning' ? 'stroke-[2.5] text-emerald-600' : 'stroke-[2]'}`} />
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight transition-all duration-200 ${activeTab === 'learning' ? 'font-extrabold text-emerald-600' : 'font-semibold text-slate-700'}`}>
                    Learning
                  </span>
                </button>

                {/* Tab 4: Dashboard */}
                <button
                  onClick={() => navigate('my-dashboard')}
                  id="mobile-bottom-tab-dashboard"
                  className="group relative flex flex-col items-center justify-center flex-1 py-0.5 cursor-pointer select-none"
                >
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-1.5 group-hover:scale-110 ${
                    activeTab === 'dashboard' 
                      ? '-translate-y-1 scale-105 border border-emerald-500/60 bg-emerald-500/15 text-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)]' 
                      : 'border border-white/60 text-slate-700 bg-white/50 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50/50'
                  }`}>
                    <TrendingUp className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'dashboard' ? 'stroke-[2.5] text-emerald-600' : 'stroke-[2]'}`} />
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight transition-all duration-200 ${activeTab === 'dashboard' ? 'font-extrabold text-emerald-600' : 'font-semibold text-slate-700'}`}>
                    Dashboard
                  </span>
                </button>

                {/* Tab 5: Profile */}
                <button
                  onClick={() => setProfileModalOpen(true)}
                  id="mobile-bottom-tab-profile"
                  className="group relative flex flex-col items-center justify-center flex-1 py-0.5 cursor-pointer select-none"
                >
                  <div className="w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 ease-out transform group-hover:-translate-y-1.5 group-hover:scale-110 border border-white/60 text-slate-700 bg-white/50 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50/50">
                    <User className="w-5 h-5 stroke-[2] transition-transform duration-200" />
                  </div>
                  <span className="text-[10px] mt-1 font-semibold text-slate-700 tracking-tight transition-all duration-200">
                    Profile
                  </span>
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* VERIFY CERTIFICATE MODAL */}
      <Modal
        isOpen={verifyModalOpen}
        onClose={() => {
          setVerifyModalOpen(false);
          setVerifySearched(false);
          setVerifyResult(null);
          setVerifyInput('');
        }}
        title="Verify SkillGo Certificate"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter a unique Certificate ID (e.g. <code>SG-CERT-884912</code>) to verify authenticity.
          </p>

          <form onSubmit={handleVerify} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="SG-CERT-884912"
                value={verifyInput}
                onChange={e => setVerifyInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Verify
            </Button>
          </form>

          {verifySearched && (
            <div className="mt-4 transition-all">
              {verifyResult ? (
                <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-950 rounded-2xl p-4 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ VERIFIED</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Status: Valid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Learner</span>
                      <strong className="text-slate-900">{verifyResult.candidateName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Certificate ID</span>
                      <strong className="font-mono text-slate-900">{verifyResult.id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Role</span>
                      <span className="font-semibold text-slate-900">{verifyResult.roleTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Skill Domain</span>
                      <span className="font-semibold text-slate-900">{verifyResult.skillCategory}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Issued On</span>
                      <span className="font-semibold text-slate-900">{verifyResult.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Track</span>
                      <span className="font-semibold text-slate-900">{verifyResult.plan.toUpperCase()} Track</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex justify-end">
                    <button
                      onClick={() => {
                        setVerifyModalOpen(false);
                        navigate('certificate', { certificateId: verifyResult.id });
                      }}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      View Full Certificate Document →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-4 text-xs space-y-1">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5">
                    <span>Certificate Not Found</span>
                  </div>
                  <p className="text-rose-700 text-[11px] leading-relaxed">
                    The credential could not be verified. Please check the Certificate ID or authorization code.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* PROFILE MODAL */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Learner Profile"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center">
              {(profile.name || 'Vikram Sharma').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{profile.name}</h4>
              <p className="text-xs text-slate-500">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Phone:</span>
              <span className="font-semibold text-slate-900">{profile.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">City / Hub:</span>
              <span className="font-semibold text-slate-900">{profile.city}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Education:</span>
              <span className="font-semibold text-slate-900">{profile.education}</span>
            </div>
          </div>

          <div className="pt-3 space-y-3">
            <div 
              onClick={() => { setProfileModalOpen(false); navigate('my-dashboard'); }}
              className="group p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-amber-500/10 hover:from-blue-500/15 hover:to-amber-500/15 backdrop-blur-2xl border border-blue-200/80 rounded-xl cursor-pointer transition-all shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">View My Learning Dashboard</h5>
                  <p className="text-[11px] text-slate-500">Track active enrollments & progress</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            </div>

            <div 
              onClick={() => { 
                setProfileModalOpen(false); 
                setSelectedOrderRecord(null);
                setOrderHistoryModalOpen(true); 
              }}
              className="group p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-amber-500/10 hover:from-emerald-500/15 hover:to-amber-500/15 backdrop-blur-2xl border border-emerald-200/80 rounded-xl cursor-pointer transition-all shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">View Order History & Purchases</h5>
                  <p className="text-[11px] text-slate-500">{enrollmentStore.getOrderHistory().length} order receipt{enrollmentStore.getOrderHistory().length !== 1 ? 's' : ''} stored</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            </div>
          </div>

          {/* Account / Settings Section */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>Account / Settings</span>
            </div>
            <button
              onClick={() => { setProfileModalOpen(false); navigate('my-learning'); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>My Learning</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { setProfileModalOpen(false); navigate('certificate'); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>My Certificates</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { setProfileModalOpen(false); navigate('my-learning'); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>My Progress</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { setProfileModalOpen(false); navigate('support'); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Help & Support</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => { 
                setProfileModalOpen(false); 
                navigate('home');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Privacy Policy</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setProfileModalOpen(false);
                enrollmentStore.logout();
                navigate('onboarding-details');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer mt-1"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </Modal>

      {/* ORDER HISTORY & PURCHASES REPOSITORY MODAL */}
      <Modal
        isOpen={orderHistoryModalOpen}
        onClose={() => {
          setOrderHistoryModalOpen(false);
          setSelectedOrderRecord(null);
        }}
        title="Learner Order & Purchase History"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
          {enrollmentStore.getOrderHistory().length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">No Purchase Orders Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                When you enroll in skill programs or purchase library modules, your complete transaction records, dates, and item receipts will appear here.
              </p>
              <Button size="sm" variant="primary" onClick={() => { setOrderHistoryModalOpen(false); navigate('library'); }}>
                Explore Library & Skills
              </Button>
            </div>
          ) : selectedOrderRecord ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/80 p-3.5 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Order Receipt</span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{selectedOrderRecord.orderId}</div>
                  <div className="text-xs text-slate-500">{selectedOrderRecord.purchaseDate} • {selectedOrderRecord.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Total Paid</div>
                  <div className="font-black text-slate-900 text-base">₹{selectedOrderRecord.totalAmount}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Purchased Items ({selectedOrderRecord.items.length})</h5>
                  <button 
                    onClick={() => setSelectedOrderRecord(null)}
                    className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    ← Back to All Orders
                  </button>
                </div>

                <div className="space-y-2.5">
                  {selectedOrderRecord.items.map((item: any, idx: number) => (
                    <div
                      key={`order-item-${idx}`}
                      onClick={() => {
                        setOrderHistoryModalOpen(false);
                        setSelectedOrderRecord(null);
                        if (item.productType === 'library') {
                          navigate('library-detail', { libraryId: item.productId });
                        } else {
                          navigate('role-detail', { roleId: item.productId });
                        }
                      }}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          item.productType === 'skill' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.productType === 'skill' ? 'SK' : 'LIB'}
                        </div>
                        <div className="min-w-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            item.productType === 'skill' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                          }`}>
                            {item.productType === 'skill' ? `${(item.selectedPlan || 'pro').toUpperCase()} Plan` : 'Standalone Module'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate mt-1 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate">
                            ID: {item.productId}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">₹{item.price}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Select an order below to view purchase details, line items, and navigate directly to your enrolled courses or library modules.
              </p>
              <div className="space-y-2.5">
                {enrollmentStore.getOrderHistory().map((order: any, idx: number) => (
                  <div
                    key={`order-row-${idx}`}
                    onClick={() => setSelectedOrderRecord(order)}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                        <Receipt className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                          {order.orderId}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{order.purchaseDate}</span>
                          <span>•</span>
                          <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <div className="font-black text-slate-900 text-sm">₹{order.totalAmount}</div>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Paid</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* UNIFIED CART & CHECKOUT MODAL */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
      />

      {/* LANGUAGE SELECTION MODAL */}
      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppLayout />
    </RouterProvider>
  );
}

