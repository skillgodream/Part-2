import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight,
  Package,
  ShoppingCart,
  Zap,
  Utensils,
  Menu,
  Play,
  Pause,
  Briefcase,
  Layers,
  ArrowRight,
  Smartphone,
  FlaskConical,
  UserCheck,
  Languages,
  X,
  Volume2,
  Sparkles,
  CheckCircle2,
  Bot,
  Palette,
  Shirt,
  Armchair,
  Calculator,
  Music,
  Monitor,
  UtensilsCrossed,
  ShieldCheck,
  Users,
  Clock,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JOB_ROLES } from '../lib/catalog';
import { useRouter } from '../lib/router';
import { JobRole } from '../lib/types';
import animatedPic from '../assets/animated.jpeg';
import inboundPic from '../assets/inbound.jpeg';
import inventoryPic from '../assets/invrentory.jpeg';
import pickerPic from '../assets/picker.jpeg';
import warehousePic from '../assets/warehouse pic.jpeg';

const ROLE_IMAGES: Record<string, string> = {
  'warehouse-associate': animatedPic,
  'qc-inbound-inspector': inboundPic || '/assets/images/inbound dp.jpeg',
  'inventory-staging-specialist': inventoryPic || '/assets/images/inventory.jpeg',
  'dispatch-fleet-coordinator': '/assets/images/outbound.jpeg',
  'dark-store-picker-packer': pickerPic || '/assets/images/Picker dp.jpeg',
  'retail-store-associate': 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
  'cashier-pos-specialist': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
  'visual-merchandiser': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  'store-inventory-supervisor': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
  'hub-dispatch-rider-coordinator': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
  'inbound-fresh-quality-grader': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  'dark-store-shift-lead': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'fb-service-specialist': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'guest-relations-associate': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'food-safety-hygiene-officer': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
  'banquet-event-coordinator': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
};

interface CourseItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  clickable?: boolean;
}

const COURSES: CourseItem[] = [
  { id: 'warehouse', name: 'Warehouse', icon: Package, clickable: true },
  { id: 'retail', name: 'Retail', icon: ShoppingCart, clickable: true },
  { id: 'hotel', name: 'Hotel', icon: Utensils, clickable: true },
  { id: 'quick-commerce', name: 'Quick Commerce', icon: Zap, clickable: true },
  { id: 'qsr', name: 'QSR', icon: UtensilsCrossed, clickable: false },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, clickable: false },
  { id: 'cleaning', name: 'Cleaning', icon: ShieldCheck, clickable: false },
  { id: 'service', name: 'Service', icon: Users, clickable: false },
];

const COURSE_DETAILS: Record<string, { title: string; subtitle: string; description: string; duration: string; studentCount: string; poster: string; highlights: string[] }> = {
  warehouse: {
    title: 'Warehouse & Logistics Operations',
    subtitle: 'Master modern warehouse management, inbound inspection & dispatch',
    description: 'Gain practical workplace skills in inventory management, safe forklift operations, inbound quality control, and rapid fulfillment dispatch.',
    duration: '2 Hours 30 Mins',
    studentCount: '1,240+ Enrolled',
    poster: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    highlights: ['Inbound Quality Inspection', 'Inventory Staging & Barcoding', 'Dispatch & Fleet Coordination', 'Safety SOPs & Compliance']
  },
  retail: {
    title: 'Retail Store Operations & POS',
    subtitle: 'Deliver exceptional customer experience and master point-of-sale systems',
    description: 'Learn modern retail store management, visual merchandising, cashier POS transactions, stock auditing, and customer relationship best practices.',
    duration: '2 Hours 15 Mins',
    studentCount: '980+ Enrolled',
    poster: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    highlights: ['POS Cashier Operations', 'Visual Merchandising', 'Stock Auditing & Replenishment', 'Customer Delight Strategies']
  },
  hotel: {
    title: 'Hospitality & Guest Relations',
    subtitle: 'Excel in hotel front desk, F&B service, and guest hospitality',
    description: 'Master hospitality standards, front desk management, banquet coordination, food safety & hygiene, and memorable guest experiences.',
    duration: '3 Hours 00 Mins',
    studentCount: '850+ Enrolled',
    poster: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    highlights: ['Front Desk & Check-in SOPs', 'F&B Service Excellence', 'Food Safety & Hygiene', 'Banquet & Event Coordination']
  },
  'quick-commerce': {
    title: 'Quick Commerce & Dark Store',
    subtitle: 'Master 10-minute delivery dark store picking, packing, and dispatch',
    description: 'Designed for hyper-local fulfillment centers. Learn rapid batch picking, real-time inventory packing, quality grading, and rider dispatch coordination.',
    duration: '1 Hours 45 Mins',
    studentCount: '2,150+ Enrolled',
    poster: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    highlights: ['Rapid Dark Store Picking', 'Fresh Produce Quality Grading', 'Dispatch Rider Coordination', 'Shift Lead Operations']
  }
};

export function ChooseSkillScreen() {
  const { navigate, currentRoute } = useRouter();
  const [activeCourseId, setActiveCourseId] = useState('warehouse');
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [modalCourse, setModalCourse] = useState<CourseItem | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  
  const selectedCategory = currentRoute.params?.selectedSkillId || null;

  const filteredRoles = selectedCategory
    ? JOB_ROLES.filter(r => r.skillId === selectedCategory)
    : JOB_ROLES.filter(r => r.skillId === 'logistics-supply-chain');

  const activeRole = filteredRoles[activeRoleIndex] || filteredRoles[0];

  // Touch swipe handling for swiping left/right between roles
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left -> next role
      setActiveRoleIndex((prev) => (prev + 1) % filteredRoles.length);
    } else if (isRightSwipe) {
      // Swipe right -> prev role
      setActiveRoleIndex((prev) => (prev - 1 + filteredRoles.length) % filteredRoles.length);
    }
  };

  const handleSelectCourse = (course: CourseItem) => {
    if (course.clickable === false) return;
    setActiveCourseId(course.id);
    setModalCourse(course);
    setIsPlayingVideo(false);
  };

  const handleProceedToNextScreen = (courseId: string) => {
    setModalCourse(null);
    setActiveCourseId(courseId);
    setActiveRoleIndex(0);
    if (courseId === 'warehouse') {
      navigate('choose-skill', { selectedSkillId: 'logistics-supply-chain' });
    } else if (courseId === 'retail') {
      navigate('choose-skill', { selectedSkillId: 'retail-operations' });
    } else if (courseId === 'hotel') {
      navigate('choose-skill', { selectedSkillId: 'hospitality' });
    } else if (courseId === 'quick-commerce') {
      navigate('choose-skill', { selectedSkillId: 'quick-commerce' });
    } else {
      navigate('choose-skill', { selectedSkillId: 'logistics-supply-chain' });
    }
  };

  const handleGetStarted = () => {
    const course = COURSES.find(c => c.id === activeCourseId) || COURSES[0];
    handleSelectCourse(course);
  };

  const handleLaunchCareerTrack = () => {
    navigate('role-detail', { 
      roleId: activeRole.id, 
      skillId: selectedCategory || activeRole.skillId
    });
  };

  const activeCourseDetails = modalCourse ? COURSE_DETAILS[modalCourse.id] : null;

  return (
    <div className="w-full min-h-screen bg-white font-sans text-slate-900 pb-28 select-none flex flex-col items-center">
      
      {/* Container restricted to mobile width */}
      <div className="w-full max-w-md px-6 pt-8 sm:pt-10 flex flex-col flex-1 justify-between relative">
        
        {!selectedCategory ? (
          <div className="flex flex-col w-full">
            
            {/* Header matching reference image */}
            <div className="mb-5 text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Choose Your Course
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Trending industries to explore
              </p>
              {/* Indicator dot */}
              <div className="flex justify-center mt-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Grid matching the reference screenshot: Vertical square cards with gradient icon at top */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {COURSES.map((course) => {
                const isActive = activeCourseId === course.id;
                const IconComponent = course.icon;
                const isClickable = course.clickable !== false;
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSelectCourse(course)}
                    className={`aspect-square rounded-[22px] p-3 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
                      !isClickable
                        ? 'bg-gradient-to-b from-slate-100 to-slate-200/90 text-slate-400 cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border border-slate-200/80 opacity-75'
                        : isActive
                        ? 'bg-gradient-to-b from-[#2563EB] to-[#1E40AF] text-white shadow-[0_10px_22px_-4px_rgba(37,99,235,0.4)] border border-blue-400/40 scale-[1.03] z-10'
                        : 'bg-gradient-to-b from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 text-slate-700 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.08)] border border-slate-200/80 cursor-pointer'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mb-2 ${!isClickable ? 'bg-slate-200 text-slate-400' : isActive ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className={`text-xs font-extrabold tracking-tight truncate w-full ${!isClickable ? 'text-slate-400' : isActive ? 'text-white' : 'text-slate-800'}`}>
                      {course.name}
                    </span>
                    <span className={`text-[9px] font-medium mt-0.5 ${!isClickable ? 'text-slate-400' : isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                      {isClickable ? 'Explore' : 'Soon'}
                    </span>
                    {!isClickable && (
                      <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500">
                        Soon
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Get Started Now Button */}
            <div className="w-full mt-auto pb-4">
              <button
                onClick={handleGetStarted}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#00C6FF] to-[#7B2CBF] text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Get Started Now
              </button>
            </div>

          </div>
        ) : (
          /* VIEW 2: Swipable Popular Career Roles Screen matching screenshot */
          <div className="w-full min-h-screen bg-[#1157C7] flex justify-center selection:bg-blue-300 select-none pb-16 overflow-y-auto">
            <div 
              className="w-full max-w-md bg-[#1864DB] min-h-screen relative flex flex-col shadow-2xl"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              
              {/* Top Hero Image Section for Active Role */}
              <div className="relative w-full h-[280px] shrink-0 overflow-hidden">
                <img 
                  src={ROLE_IMAGES[activeRole.id] || activeRole.image || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80'} 
                  alt={activeRole.title} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                  <button 
                    onClick={() => navigate('choose-skill', { selectedSkillId: null })}
                    className="w-9 h-9 rounded-xl bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#0E2856] stroke-[2.5]" />
                  </button>
                </div>

                {/* Role Title Banner */}
                <div className="absolute inset-x-0 bottom-8 text-center px-6 z-10">
                  <span className="text-[11px] uppercase tracking-wider text-white/80 font-bold">CAREER TRACK</span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                    {activeRole.title}
                  </h1>
                  
                  {/* Swipe indicators */}
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {filteredRoles.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all ${idx === activeRoleIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* White Arched Card matching Screenshot */}
              <div className="w-full bg-white rounded-t-[34px] -mt-6 z-20 flex-1 px-6 pt-6 pb-20 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
                
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">About Course</h2>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setActiveRoleIndex((prev) => (prev - 1 + filteredRoles.length) % filteredRoles.length)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold"
                    >
                      ‹
                    </button>
                    <span className="text-xs font-bold text-slate-400">{activeRoleIndex + 1}/{filteredRoles.length}</span>
                    <button 
                      onClick={() => setActiveRoleIndex((prev) => (prev + 1) % filteredRoles.length)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 my-2">
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} className="text-purple-600 text-base">★</span>
                  ))}
                  <span className="text-slate-300 text-base">★</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  {activeRole.fullDescription || activeRole.shortDescription || 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.'}
                </p>

                <div className="space-y-3 mb-6 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Course Teacher :</span>
                    <span className="font-extrabold text-slate-900">Jane Doe</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Course Duration :</span>
                    <span className="font-extrabold text-slate-900">2 Hours 35 minutes</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Course Students :</span>
                    <span className="font-extrabold text-slate-900">14+</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-slate-400">Target Audience :</span>
                    <span className="font-extrabold text-slate-900">8-12 years old</span>
                  </div>
                </div>

                <button
                  onClick={handleLaunchCareerTrack}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#00C6FF] to-[#7B2CBF] text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-center mt-auto"
                >
                  Get Started Now
                </button>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* INDUSTRY OVERVIEW MODAL / TAB */}
      <AnimatePresence>
        {modalCourse && activeCourseDetails && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[28px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative p-5 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                    Industry Brief
                  </span>
                  <h3 className="text-lg font-black tracking-tight mt-1">
                    {activeCourseDetails.title}
                  </h3>
                </div>
                <button
                  onClick={() => setModalCourse(null)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                
                {/* Video Format Brief Preview */}
                <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
                  <img 
                    src={activeCourseDetails.poster} 
                    alt={activeCourseDetails.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isPlayingVideo ? 'scale-105 opacity-90' : 'opacity-80'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {!isPlayingVideo ? (
                    <div 
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xl shadow-blue-600/50 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                      <span className="text-xs font-bold text-white mt-2.5 tracking-wide drop-shadow">
                        Watch Industry Briefing (1:45)
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 animate-pulse">
                        <Video className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-white mb-1">Playing Industry Overview Video...</p>
                      <p className="text-[10px] text-slate-300">Learn core operations, safety, and career growth in {modalCourse.name}.</p>
                      <button
                        onClick={() => setIsPlayingVideo(false)}
                        className="mt-3 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold cursor-pointer"
                      >
                        Pause / Reset
                      </button>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
                    <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Clock className="w-3 h-3 text-blue-400" /> {activeCourseDetails.duration}
                    </span>
                    <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Users className="w-3 h-3 text-emerald-400" /> {activeCourseDetails.studentCount}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Overview</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeCourseDetails.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Key Curriculum Highlights</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeCourseDetails.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => setModalCourse(null)}
                  className="px-5 py-3.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleProceedToNextScreen(modalCourse.id)}
                  className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#00C6FF] to-[#7B2CBF] text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}



