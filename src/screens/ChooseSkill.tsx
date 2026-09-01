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
  CheckCircle2
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

interface IndustryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  videoUrl?: string;
  videoTitle: string;
  videoDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
}

const INDUSTRIES: IndustryItem[] = [
  { 
    id: 'logistics-supply-chain', 
    name: 'Warehouse & Logistics', 
    subtitle: 'Inventory, Inbound & Supply Chain Operations',
    image: warehousePic || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', 
    videoTitle: 'Day in the Life: Warehouse & Logistics Operations',
    videoDescription: 'Discover how modern smart hubs orchestrate barcode staging, automated conveyor sorting, RF scanning, and rapid freight dispatching.',
    icon: Package,
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-400 to-teal-600'
  },
  { 
    id: 'retail-operations', 
    name: 'Retail Operations', 
    subtitle: 'Store Merchandising, POS & Customer Experience',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80', 
    videoTitle: 'Modern Retail & Merchandising Mastery',
    videoDescription: 'Step inside premium store environments: learn omni-channel POS checkouts, inventory planograms, and high-impact visual merchandising.',
    icon: ShoppingCart,
    color: 'text-blue-500',
    bgGradient: 'from-blue-500 to-indigo-600'
  },
  { 
    id: 'quick-commerce', 
    name: 'Quick Commerce', 
    subtitle: 'Dark Store Dispatch, Picking & Fresh Sorting',
    image: pickerPic || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80', 
    videoTitle: 'Inside 10-Minute Dark Store Fulfillment',
    videoDescription: 'Explore hyper-fast dark store pick-and-pack loops, real-time rider dispatch orchestration, and freshness grading protocols.',
    icon: Zap,
    color: 'text-amber-500',
    bgGradient: 'from-amber-400 to-orange-500'
  },
  { 
    id: 'hospitality', 
    name: 'Hospitality & F&B', 
    subtitle: 'Guest Services, Dining & Banquet Coordination',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 
    videoTitle: 'Excellence in Guest Experience & F&B',
    videoDescription: 'Learn five-star guest reception, fine-dining table turnover, food safety HACCP workflows, and luxury banquet event hosting.',
    icon: Utensils,
    color: 'text-rose-500',
    bgGradient: 'from-rose-400 to-pink-600'
  },
];

// 4 Feature Elements as requested
const FEATURE_PILLARS = [
  {
    id: 'mobile',
    label: '100% Mobile',
    icon: Smartphone,
    color: 'text-emerald-500',
    description: 'Learn on any smartphone with bite-sized, interactive micro-modules.'
  },
  {
    id: 'practical',
    label: 'Practical Lab',
    icon: FlaskConical,
    color: 'text-indigo-500',
    description: 'Hands-on task simulations mirroring actual floor operations.'
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    icon: UserCheck,
    color: 'text-amber-500',
    description: 'AI-assisted behavioral drills and real recruiter interview scenarios.'
  },
  {
    id: 'english',
    label: 'English Prep',
    icon: Languages,
    color: 'text-rose-500',
    description: 'Workplace conversation practice, industry phrases & vocabulary builder.'
  }
];

export function ChooseSkillScreen() {
  const { navigate, currentRoute } = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  
  const selectedCategory = currentRoute.params?.selectedSkillId || null;
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  
  // Video preview popup modal state
  const [previewingIndustryVideo, setPreviewingIndustryVideo] = useState<IndustryItem | null>(null);
  const [featureDetail, setFeatureDetail] = useState<typeof FEATURE_PILLARS[0] | null>(null);

  const activeIndustry = INDUSTRIES[activeIndex] || INDUSTRIES[0];

  const filteredRoles = selectedCategory
    ? JOB_ROLES.filter(r => r.skillId === selectedCategory)
    : [];

  const activeRole = filteredRoles[activeRoleIndex] || filteredRoles[0];

  const handleOpenIndustry = (industryId: string) => {
    navigate('choose-skill', { selectedSkillId: industryId });
    setActiveRoleIndex(0);
  };

  const handleSelectRole = (role: JobRole) => {
    navigate('role-detail', { 
      roleId: role.id, 
      skillId: selectedCategory || role.skillId
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F7FAFC] font-sans text-slate-900 pb-28 select-none flex flex-col items-center">
      
      {/* Container restricted to mobile width */}
      <div className="w-full max-w-md px-5 pt-1 flex flex-col flex-1">
        
        {/* 1. TOP HEADER: "Find Your Favorite Career" or "Popular Roles" in middle top center */}
        {!selectedCategory ? (
          <div className="text-center mt-1 mb-3">
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#0D1F3C] tracking-tight leading-tight">
              Find Your Favorite Career
            </h1>
            <p className="text-sm font-semibold text-slate-500 tracking-tight mt-0.5">
              And Grow With Us
            </p>
          </div>
        ) : (
          <div className="text-center mt-1 mb-3">
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#0D1F3C] tracking-tight leading-tight text-center">
              Popular Roles
            </h1>
          </div>
        )}

        {/* VIEW 1: Main Industries Landing */}
        {!selectedCategory ? (
          <div className="flex flex-col items-center w-full flex-1">
            
            {/* 2. 360-DEGREE CIRCULAR COVERFLOW CAROUSEL (Behind card visible, blurred & smaller) */}
            <div className="relative w-full overflow-visible my-2 flex items-center justify-center" style={{ perspective: '1100px' }}>
              <div className="relative h-[260px] w-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {INDUSTRIES.map((item, index) => {
                  const count = INDUSTRIES.length;
                  // Circular offset in range [-count/2, count/2]
                  let diff = (index - activeIndex) % count;
                  if (diff > count / 2) diff -= count;
                  if (diff < -count / 2) diff += count;

                  const isActive = diff === 0;
                  const isBehind = Math.abs(diff) === 2;
                  const isSide = Math.abs(diff) === 1;

                  // 360-degree positioning calculations
                  let xOffset = 0;
                  let zOffset = 0;
                  let rotateY = 0;
                  let scale = 1;
                  let opacity = 1;
                  let blurAmount = 'blur(0px)';
                  let zIndex = 30;

                  if (isActive) {
                    xOffset = 0;
                    zOffset = 0;
                    rotateY = 0;
                    scale = 1;
                    opacity = 1;
                    blurAmount = 'blur(0px)';
                    zIndex = 40;
                  } else if (isSide) {
                    xOffset = diff * 105;
                    zOffset = -110;
                    rotateY = diff * -28;
                    scale = 0.82;
                    opacity = 0.88;
                    blurAmount = 'blur(1.5px)';
                    zIndex = 25;
                  } else if (isBehind) {
                    xOffset = 0;
                    zOffset = -220;
                    rotateY = 0;
                    scale = 0.66;
                    opacity = 0.55;
                    blurAmount = 'blur(4px)';
                    zIndex = 10;
                  }

                  return (
                    <motion.div
                      key={item.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 35) setActiveIndex((prev) => (prev - 1 + INDUSTRIES.length) % INDUSTRIES.length);
                        if (info.offset.x < -35) setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
                      }}
                      className="absolute cursor-pointer overflow-hidden rounded-[24px] w-[275px] sm:w-[295px] h-[245px] bg-slate-900 border border-white/50"
                      initial={false}
                      animate={{
                        x: xOffset,
                        z: zOffset,
                        rotateY: rotateY,
                        scale: scale,
                        opacity: opacity,
                        filter: blurAmount,
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                      onClick={() => {
                        if (isActive) {
                          setPreviewingIndustryVideo(item);
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                      style={{
                        zIndex,
                        transformStyle: 'preserve-3d',
                        boxShadow: isActive 
                          ? '0 20px 40px -10px rgba(0,0,0,0.35), 0 8px 18px -4px rgba(0,0,0,0.18)' 
                          : isBehind 
                            ? '0 10px 25px -8px rgba(0,0,0,0.2)' 
                            : '0 14px 28px -6px rgba(0,0,0,0.25)',
                      }}
                    >
                      {/* Clean High-Resolution Picture - NO TEXT */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 3. WAREHOUSE & LOGISTICS / INDUSTRY DEPTH CARD (White card with deep shadows and blue font) */}
            <div className="w-full mt-3 px-1">
              <button
                onClick={() => handleOpenIndustry(activeIndustry.id)}
                className="w-full py-4 px-5 bg-white hover:bg-slate-50 active:scale-[0.98] rounded-[22px] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] border border-slate-100/90 transition-all duration-300 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {React.createElement(activeIndustry.icon, { className: 'w-5 h-5 text-[#1E75FF]' })}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-[17px] font-extrabold text-[#1E75FF] tracking-tight leading-tight">
                      {activeIndustry.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                      {activeIndustry.subtitle}
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* 4. 4 FEATURE ELEMENTS - Icons resized 25% less (w-5 h-5), text non-bold and small */}
            <div className="w-full grid grid-cols-4 gap-1.5 mt-5 mb-1 px-1">
              {FEATURE_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setFeatureDetail(pillar)}
                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-slate-100/70 active:scale-95 transition-all text-center focus:outline-none group cursor-pointer"
                  >
                    <div className="p-1.5 transition-transform group-hover:scale-110">
                      <IconComponent className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${pillar.color} drop-shadow-xs`} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-normal text-slate-600 mt-0.5 leading-tight text-center">
                      {pillar.label}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* VIEW 2: Selected Industry Roles View - 2-Column Grid with Banner Depth, No Outline & Role Cards under each picture */
          <div className="flex flex-col items-center w-full flex-1 pt-3 sm:pt-4">
            
            {/* 1. 2-COLUMN GRID OF ROLE PICTURES + CARDS (Shifted ~10% towards bottom) */}
            <div className="w-full grid grid-cols-2 gap-x-3.5 gap-y-4 my-2">
              {filteredRoles.map((roleItem: JobRole) => {
                const roleImage = ROLE_IMAGES[roleItem.id] || roleItem.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={roleItem.id}
                    onClick={() => handleSelectRole(roleItem)}
                    className="flex flex-col gap-2 cursor-pointer group select-none"
                  >
                    {/* Picture Container with rich carousel banner depth & NO outline */}
                    <div className="relative w-full aspect-[4/3.2] rounded-[22px] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.26),0_8px_16px_-4px_rgba(0,0,0,0.12)] bg-slate-900 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_24px_45px_-10px_rgba(0,0,0,0.32)]">
                      <img 
                        src={roleImage} 
                        alt={roleItem.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>

                    {/* Small Depth Card Underneath Picture with Role Title */}
                    <div className="w-full py-2 px-2.5 bg-white hover:bg-slate-50 active:scale-[0.98] rounded-[16px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] border border-slate-100/90 transition-all duration-300 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 pr-1 text-left">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Briefcase className="w-3.5 h-3.5 text-[#1E75FF]" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-[13px] font-extrabold text-[#1E75FF] tracking-tight leading-tight truncate">
                            {roleItem.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                            {roleItem.startingSalary ? `Starting ${roleItem.startingSalary}` : 'Certified Training'}
                          </p>
                        </div>
                      </div>

                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/25 group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* 6. INDUSTRY VIDEO SCREEN POPUP MODAL (Learner views industry experience video) */}
      <AnimatePresence>
        {previewingIndustryVideo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-950 text-white rounded-[22px] max-w-sm w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/15 relative flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setPreviewingIndustryVideo(null)}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Video Player Mockup Screen */}
              <div className="w-full h-52 relative bg-black flex items-center justify-center overflow-hidden">
                <img 
                  src={previewingIndustryVideo.image} 
                  alt={previewingIndustryVideo.name}
                  className="w-full h-full object-cover opacity-70"
                />
                
                {/* Video Play HUD Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 flex flex-col justify-between p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded text-white tracking-wider uppercase">
                      Overview
                    </span>
                    <span className="text-[11px] text-white/80 font-medium">Industry Preview</span>
                  </div>

                  {/* Big Play Button inside video screen */}
                  <div className="self-center">
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
                      <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-blue-500 rounded-full" />
                    </div>
                    <span className="text-[10px] text-white/70">01:42</span>
                  </div>
                </div>
              </div>

              {/* Video Info Content */}
              <div className="p-4.5 flex flex-col gap-2.5">
                <div>
                  <span className="text-[11px] font-semibold text-blue-400 tracking-wide uppercase">
                    {previewingIndustryVideo.name}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {previewingIndustryVideo.videoTitle}
                  </h3>
                  <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
                    {previewingIndustryVideo.videoDescription}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      const id = previewingIndustryVideo.id;
                      setPreviewingIndustryVideo(null);
                      handleOpenIndustry(id);
                    }}
                    className="flex-1 py-2.5 bg-[#1E75FF] hover:bg-blue-600 text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25"
                  >
                    <span>View Career Roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewingIndustryVideo(null)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold rounded-full transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feature Pillar Detail Popup Modal */}
      <AnimatePresence>
        {featureDetail && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[22px] max-w-xs w-full p-5 shadow-2xl border border-slate-100 relative text-center flex flex-col items-center"
            >
              <button 
                onClick={() => setFeatureDetail(null)}
                className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-3 mb-2">
                <featureDetail.icon className={`w-10 h-10 ${featureDetail.color}`} />
              </div>

              <h3 className="text-base font-bold text-slate-900">{featureDetail.label}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {featureDetail.description}
              </p>

              <button
                onClick={() => setFeatureDetail(null)}
                className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-colors"
              >
                Awesome
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role Detail Popup */}
      {selectedRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setSelectedRole(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-sm font-bold"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2 text-slate-900">{selectedRole.title}</h2>
            <div className="space-y-3 text-xs text-slate-600">
              <p><strong>Overview:</strong> {selectedRole.description}</p>
              <p><strong>Estimated Duration:</strong> {selectedRole.durationWeeks || 4} Weeks</p>
            </div>
            <button 
              onClick={() => handleSelectRole(selectedRole)}
              className="w-full mt-5 py-3 bg-[#1E75FF] text-white rounded-full font-bold text-sm"
            >
              Start Role Training
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


