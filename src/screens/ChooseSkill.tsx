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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(currentRoute.params?.selectedSkillId || null);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  
  // Video preview popup modal state
  const [previewingIndustryVideo, setPreviewingIndustryVideo] = useState<IndustryItem | null>(null);
  const [featureDetail, setFeatureDetail] = useState<typeof FEATURE_PILLARS[0] | null>(null);

  const activeIndustry = INDUSTRIES[activeIndex] || INDUSTRIES[0];

  const filteredRoles = selectedCategory
    ? JOB_ROLES.filter(r => r.skillId === selectedCategory)
    : [];

  const handleOpenIndustry = (industryId: string) => {
    setSelectedCategory(industryId);
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
      <div className="w-full max-w-md px-5 pt-3 flex flex-col flex-1">
        
        {/* 1. TOP HEADER */}
        <header className="w-full flex items-center justify-between py-1.5 mb-2">
          {selectedCategory ? (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-200/60 transition-colors text-slate-800"
              title="Back to Industries"
            >
              <Menu className="w-6 h-6" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('home')}
              className="p-2 -ml-2 rounded-full hover:bg-slate-200/60 transition-colors text-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Center Brand / Industry Name (Replaces GoFast with Industry Name) */}
          <div className="flex-1 text-center px-2">
            <span className="text-base font-extrabold text-[#0D1F3C] tracking-tight">
              {selectedCategory 
                ? (INDUSTRIES.find(c => c.id === selectedCategory)?.name || 'Career Roles')
                : 'SkillGo'}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-slate-300 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-xs overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* 2. TEXT ON TOP: "Find Your Favorite Career / And Grow With Us" */}
        {!selectedCategory && (
          <div className="text-center mt-1 mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0D1F3C] tracking-tight leading-tight">
              Find Your Favorite Career
            </h1>
            <p className="text-xl sm:text-2xl font-extrabold text-[#0D1F3C] tracking-tight leading-tight mt-0.5">
              And Grow With Us
            </p>
          </div>
        )}

        {/* VIEW 1: Main Industries Landing (Matches Reference Image) */}
        {!selectedCategory ? (
          <div className="flex flex-col items-center w-full flex-1">
            
            {/* 3. COVERFLOW CAROUSEL OF INDUSTRIES (Ultra-Premium Apple Style: Less curvy border, rich deep shadow) */}
            <div className="relative w-full overflow-hidden my-1 flex items-center justify-center" style={{ perspective: '1200px' }}>
              <div className="relative h-[270px] w-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {INDUSTRIES.map((item, index) => {
                  const activeTrackIndex = index - activeIndex;
                  const isActive = activeTrackIndex === 0;

                  return (
                    <motion.div
                      key={item.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 40) setActiveIndex((prev) => (prev - 1 + INDUSTRIES.length) % INDUSTRIES.length);
                        if (info.offset.x < -40) setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
                      }}
                      className="absolute cursor-pointer overflow-hidden rounded-[20px] shadow-[0_22px_45px_-8px_rgba(0,0,0,0.32),0_8px_16px_-4px_rgba(0,0,0,0.18)] w-[300px] sm:w-[320px] h-[255px] bg-slate-900 border border-white/40"
                      initial={false}
                      animate={{
                        x: activeTrackIndex * 65,
                        z: Math.abs(activeTrackIndex) * -140,
                        rotateY: activeTrackIndex * -35,
                        scale: isActive ? 1 : 0.86,
                        opacity: Math.abs(activeTrackIndex) > 1 ? 0 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
                      onClick={() => {
                        if (isActive) {
                          // Clicking on pic opens video screen modal for learner to see industry
                          setPreviewingIndustryVideo(item);
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                      style={{
                        zIndex: 50 - Math.abs(activeTrackIndex),
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Apple Glass Dark Gradient Overlay (No play icon) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 flex flex-col justify-between p-4">
                        
                        {/* Top Category Badge & Video Preview Hint */}
                        <div className="flex justify-between items-center">
                          <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/30 shadow-sm">
                            Domain #{index + 1}
                          </span>
                          <span className="bg-black/30 backdrop-blur-md text-white/90 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-white/20">
                            Tap to preview
                          </span>
                        </div>

                        {/* Bottom Card Title */}
                        <div>
                          <h3 className="text-lg font-extrabold text-white leading-tight drop-shadow-md">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/85 line-clamp-1 mt-0.5 font-medium">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 4. INDUSTRY ACTION BUTTON (Replaces "Log In" with Industry Name) */}
            <div className="w-full mt-4 px-1">
              <button
                onClick={() => handleOpenIndustry(activeIndustry.id)}
                className="w-full py-3.5 bg-[#1E75FF] hover:bg-blue-600 active:scale-[0.98] text-white rounded-full text-base font-bold shadow-[0_10px_25px_-5px_rgba(30,117,255,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>{activeIndustry.name}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* 5. 4 COLORFUL CHARACTER / FEATURE ELEMENT ICONS (No circle around icons, colorful standalone icons with small labels) */}
            <div className="w-full grid grid-cols-4 gap-2 mt-7 mb-1 px-1">
              {FEATURE_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setFeatureDetail(pillar)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-slate-100/80 active:scale-95 transition-all text-center focus:outline-none group"
                  >
                    <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${pillar.color} transition-transform group-hover:scale-110 drop-shadow-sm`} />
                    <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight text-center">
                      {pillar.label}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* VIEW 2: Selected Industry Roles View (Matches Reference Screenshot) */
          <div className="flex flex-col w-full flex-1 mt-1">
            
            {/* Header: Popular Roles + View All */}
            <div className="flex items-center justify-between mb-3.5 px-0.5">
              <h2 className="text-lg font-extrabold text-[#0D1F3C] tracking-tight">
                Popular Roles
              </h2>
              <button 
                onClick={() => {}}
                className="text-sm font-semibold text-[#1E75FF] hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>

            {/* 2x2 Grid of Full-Bleed Picture Cards */}
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              {filteredRoles.map((roleItem: JobRole, index: number) => {
                const roleImage = ROLE_IMAGES[roleItem.id] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
                const tagLabels = ['$250', '$300', '$450', '$400'];
                const priceTag = tagLabels[index % tagLabels.length];
                
                return (
                  <div 
                    key={roleItem.id}
                    onClick={() => handleSelectRole(roleItem)}
                    className="w-full aspect-[3/4] relative rounded-[22px] overflow-hidden cursor-pointer shadow-[0_12px_28px_-6px_rgba(0,0,0,0.18)] hover:shadow-xl transition-all duration-300 group border border-black/5"
                  >
                    {/* Background Image */}
                    <img 
                      src={roleImage} 
                      alt={roleItem.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />

                    {/* Top Left Price / Certification Badge (e.g. $250, $300) */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#1E75FF] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md tracking-tight">
                        {priceTag}
                      </span>
                    </div>

                    {/* Bottom Dark Gradient & Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                      <h3 className="text-sm font-extrabold text-white leading-tight drop-shadow-md line-clamp-2">
                        {roleItem.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom "Explore Now" Wide Action Button */}
            <div className="w-full mt-auto mb-3 px-0.5">
              <button
                onClick={() => filteredRoles[0] && handleSelectRole(filteredRoles[0])}
                className="w-full py-4 bg-[#081226] hover:bg-slate-900 active:scale-[0.98] text-white rounded-full text-base font-bold shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Now</span>
              </button>
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


