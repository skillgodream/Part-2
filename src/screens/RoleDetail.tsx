import React, { useState } from 'react';
import animatedPic from '../assets/animated.jpeg';
import inboundPic from '../assets/inbound.jpeg';
import inventoryPic from '../assets/invrentory.jpeg';
import pickerPic from '../assets/picker.jpeg';
import warehousePic from '../assets/warehouse pic.jpeg';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ChevronRight,
  Check,
  ShoppingBag,
  Plus,
  PlayCircle,
  Award,
  Boxes,
  PackageCheck,
  ClipboardCheck,
  Truck,
  Store,
  CreditCard,
  Eye,
  Zap,
  Navigation,
  UtensilsCrossed,
  ConciergeBell,
  Calendar,
  Wrench,
  Cpu,
  Flame,
  BatteryCharging,
  Sliders,
  ShieldAlert,
  Sprout,
  Activity,
  LucideIcon
} from 'lucide-react';
import { JOB_ROLES, SKILL_CATEGORIES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { useCartState, useEnrollmentState } from '../lib/enrollmentStore';
import { PlanType, JobRole, SkillCategory, CourseModule } from '../lib/types';
import { CartModal } from '../components/CartModal';
import { LiquidGlassCard } from '../components/LiquidGlassCard';

// Modern icon mapping per role
const ROLE_ICONS: Record<string, LucideIcon> = {
  // Logistics
  'warehouse-associate': Boxes,
  'qc-inbound-inspector': ClipboardCheck,
  'inventory-staging-specialist': Layers,
  'dispatch-fleet-coordinator': Truck,

  // Retail
  'retail-store-associate': Store,
  'cashier-pos-specialist': CreditCard,
  'visual-merchandiser': Eye,
  'store-inventory-supervisor': PackageCheck,

  // Quick Commerce
  'dark-store-picker-packer': Zap,
  'hub-dispatch-rider-coordinator': Navigation,
  'inbound-fresh-quality-grader': Sprout,
  'dark-store-shift-lead': Activity,

  // Hospitality
  'fb-service-specialist': UtensilsCrossed,
  'guest-relations-associate': ConciergeBell,
  'food-safety-hygiene-officer': ShieldCheck,
  'banquet-event-coordinator': Calendar,

  // Facility Management
  'facility-maintenance-technician': Wrench,
  'bms-operations-executive': Cpu,
  'fls-fire-safety-officer': Flame,
  'utility-hvac-lead': BatteryCharging,
};

// Color accents for modern role icon badges
const ROLE_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  'logistics-supply-chain': { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-200' },
  'retail-operations': { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
  'quick-commerce': { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
  'hospitality': { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
  'facility-management': { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
};

// Role-specific person photo mapping as requested
const getRolePhoto = (roleId: string): string => {
  switch (roleId) {
    case 'warehouse-associate':
      return animatedPic; // warehouse worker
    case 'qc-inbound-inspector':
      return '/assets/images/inbound dp.jpeg';
    case 'inventory-staging-specialist':
      return '/assets/images/inventory.jpeg';
    case 'dispatch-fleet-coordinator':
      return '/assets/images/outbound.jpeg';
    case 'dark-store-picker-packer':
      return '/assets/images/Picker dp.jpeg';
    default:
      return 'https://images.unsplash.com/photo-1586528116493-a025325555d4?auto=format&fit=crop&w=1200&q=80';
  }
};

export function RoleDetailScreen() {
  const { currentRoute, navigate } = useRouter();
  const { addToCart, isInCart, isSkillEnrolled } = useCartState();
  const { activeEnrollment } = useEnrollmentState();
  
  // Resolve Role and Skill dynamically from route parameters
  const roleId = currentRoute.params?.roleId || JOB_ROLES[0].id;
  const role: JobRole = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const skill: SkillCategory = SKILL_CATEGORIES.find(s => s.id === role.skillId) || SKILL_CATEGORIES[0];

  // Selected Plan state
  const [selectedPlan, setSelectedPlan] = useState<PlanType>((currentRoute.params?.selectedPlan as PlanType) || 'pro');
  const [showCartModal, setShowCartModal] = useState(false);

  const isEnrolled = isSkillEnrolled(role.id);
  const isLiteInCart = isInCart(role.id, 'lite');
  const isProInCart = isInCart(role.id, 'pro');

  // Role Modern Icon
  const RoleIcon = ROLE_ICONS[role.id] || Boxes;
  const colorTheme = ROLE_COLORS[skill.id] || { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' };

  // Ensure 4 standard modules for display
  const getModulesList = (): { id: string; moduleNumber: number; title: string; durationMinutes: number }[] => {
    if (role.modules && role.modules.length >= 4) {
      return role.modules.map((m, idx) => ({
        id: m.id,
        moduleNumber: idx + 1,
        title: m.title,
        durationMinutes: m.durationMinutes || 25,
      }));
    }

    if (role.modules && role.modules.length > 0) {
      const existing = role.modules.map((m, idx) => ({
        id: m.id,
        moduleNumber: idx + 1,
        title: m.title,
        durationMinutes: m.durationMinutes || 25,
      }));

      const defaultTitles = [
        'Foundational SOPs & Standard Workflows',
        'Operating Systems, Tools & Digital Equipment',
        'Quality Audits, Safety & Anomaly Resolution',
        'Shift Handovers, SLA Tracking & Practical Mastery'
      ];

      while (existing.length < 4) {
        const nextNum = existing.length + 1;
        existing.push({
          id: `${role.id}-mod-${nextNum}`,
          moduleNumber: nextNum,
          title: defaultTitles[nextNum - 1] || `Module ${nextNum}: Workplace Execution`,
          durationMinutes: 25,
        });
      }
      return existing;
    }

    return [
      { id: `${role.id}-mod-1`, moduleNumber: 1, title: 'Inbound Verification & Foundational SOPs', durationMinutes: 25 },
      { id: `${role.id}-mod-2`, moduleNumber: 2, title: 'Digital Systems & Tool Operation', durationMinutes: 30 },
      { id: `${role.id}-mod-3`, moduleNumber: 3, title: 'Quality Audits & Safety Compliance', durationMinutes: 25 },
      { id: `${role.id}-mod-4`, moduleNumber: 4, title: 'SLA Throughput & Shift Performance', durationMinutes: 20 },
    ];
  };

  const moduleList = getModulesList();

  // Selecting the level immediately adds it to cart and pops up the separate cart screen to pay or add more
  const handleSelectLevelAndOpenCart = (plan: PlanType) => {
    if (isEnrolled) {
      navigate('course-modules', { roleId: role.id, skillId: skill.id });
      return;
    }
    const price = plan === 'pro' ? role.proPrice : role.litePrice;
    addToCart({
      id: `cart-skill-${role.id}-${plan}`,
      productId: role.id,
      productType: 'skill',
      title: role.title,
      price,
      selectedPlan: plan,
      skillId: skill.id,
      duration: `${role.durationWeeks} Weeks`
    });
    setSelectedPlan(plan);
    setShowCartModal(true);
  };

  const handleModuleClick = (moduleNum: number) => {
    if (isEnrolled) {
      navigate('course-modules', { roleId: role.id, skillId: skill.id });
    }
  };

  return (
    <div className="w-full bg-white min-h-screen pb-20 font-sans">
      
      {/* 1. BREADCRUMB / TOP BAR NAVIGATION */}
      <div 
        className="fixed top-0 left-0 right-0 w-full h-32 z-10 shadow-2xs overflow-hidden pt-10"
        style={{ viewTransitionName: `skill-card-${role.id}` }}
      >
        {/* Background Image */}
        <img src={getRolePhoto(role.id)} alt={role.title} className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-4 sm:px-6 mt-10">
          <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
            <button 
              onClick={() => navigate('choose-skill', { selectedSkillId: skill.id })} 
              className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">{role.title}</h1>
          </div>
        </div>
      </div>
      <div className="h-32" /> {/* Spacer */}

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-8 space-y-6 sm:space-y-10">
        
        {/* BANNERS FOR LEARNING VIDEO, PRACTICAL, INTERVIEW, ENGLISH PREP */}
        <section id="additional-prep-section" className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
            <LiquidGlassCard 
              onClick={() => navigate('course-module-list', { roleId: role.id })}
              className="p-5 flex flex-col items-center text-center gap-3 text-slate-900 bg-emerald-100/20 backdrop-blur-md border border-emerald-200/50"
            >
              <div className="w-16 h-16 bg-white/40 backdrop-blur-sm text-emerald-800 rounded-2xl flex items-center justify-center">
                <PlayCircle className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-slate-900">Learning Videos</h3>
              <p className="text-xs text-emerald-900">{skill.name} • {role.durationWeeks} Weeks</p>
            </LiquidGlassCard>
            <LiquidGlassCard 
              onClick={() => navigate('practical-training', { roleId: role.id })}
              className="p-5 flex flex-col items-center text-center gap-3 text-slate-900 bg-emerald-100/20 backdrop-blur-md border border-emerald-200/50"
            >
              <div className="w-16 h-16 bg-white/40 backdrop-blur-sm text-emerald-800 rounded-2xl flex items-center justify-center">
                <ClipboardCheck className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-slate-900">Practical Labs</h3>
              <p className="text-xs text-emerald-900">Apply skills in real-world scenarios.</p>
            </LiquidGlassCard>
            <LiquidGlassCard 
              onClick={() => navigate('interview-prep', { roleId: role.id, returnTo: 'role-detail' })}
              className="p-5 flex flex-col items-center text-center gap-3 text-slate-900 bg-emerald-100/20 backdrop-blur-md border border-emerald-200/50"
            >
              <div className="w-16 h-16 bg-white/40 backdrop-blur-sm text-emerald-800 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-slate-900">Interview Prep</h3>
              <p className="text-xs text-emerald-900">Master interviews with confidence.</p>
            </LiquidGlassCard>
            <LiquidGlassCard 
              onClick={() => navigate('training-viewer', { url: '/English/english-foundations-v10.html', title: 'English Foundations', returnTo: 'role-detail' })}
              className="p-5 flex flex-col items-center text-center gap-3 text-slate-900 bg-emerald-100/20 backdrop-blur-md border border-emerald-200/50"
            >
              <div className="w-16 h-16 bg-white/40 backdrop-blur-sm text-emerald-800 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-slate-900">English Prep</h3>
              <p className="text-xs text-emerald-900">Build your workplace English skills</p>
            </LiquidGlassCard>
        </section>

        {/* 4. SELECT THE LEVEL (AT THE BOTTOM) */}
        <section id="select-level-section" className="pt-4 sm:pt-6 space-y-4">
          <div className="max-w-md mx-auto">
            
            {/* SINGLE COMPREHENSIVE PROFESSIONAL PLAN CARD (₹199) */}
            <LiquidGlassCard
              id="level-card-pro"
              onClick={() => handleSelectLevelAndOpenCart('pro')}
              className="p-4 border-2 border-blue-600 flex flex-col justify-between relative ring-2 ring-blue-600/10 !overflow-visible"
            >
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-10">
                All Access • Recommended
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Professional All-Access</span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">Complete Career Mastery</h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Digital + Lab
                  </span>
                </div>

                <div className="flex items-baseline gap-2.5 pt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">₹199</span>
                  <span className="text-sm font-bold text-slate-400 line-through">₹599</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">66% OFF</span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>All {moduleList.length} Video Modules & SOP Guides</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Module Quizzes & SkillGo Digital Certificate</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Practical Simulation Labs & Interactive Hardware Sims</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Barcode Scanner & Warehouse Handheld Simulators</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Priority Partner Hiring Referral & Direct Interview Pass</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {isEnrolled ? (
                  <div className="w-full py-3 text-center text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 rounded-2xl border border-emerald-200">
                    Enrolled
                  </div>
                ) : isProInCart ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCartModal(true);
                    }}
                    className="w-full py-3 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>In Cart • Pay or Add More →</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLevelAndOpenCart('pro');
                    }}
                    id="choose-pro-btn"
                    className="w-full py-3 text-xs sm:text-sm font-black rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enroll Now (₹199) →</span>
                  </button>
                )}
              </div>
            </LiquidGlassCard>
          </div>
        </section>

        {/* 5. GO BACK BUTTON AT THE BOTTOM */}
        <div className="pt-6 sm:pt-8 flex justify-center">
          <button
            onClick={() => navigate('choose-skill', { selectedSkillId: skill.id })}
            id="role-detail-bottom-back-btn"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm border border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Go Back</span>
          </button>
        </div>

      </div>

      {/* Cart Modal Screen Pop-up */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />

    </div>
  );
}
