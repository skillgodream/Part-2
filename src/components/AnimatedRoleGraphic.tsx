import React from 'react';
import { Boxes, ShoppingBag, Truck, Utensils, Wrench, ShieldCheck, QrCode, ClipboardCheck, Sparkles, Zap, Package, Compass, Scan, UserCheck } from 'lucide-react';

interface AnimatedRoleGraphicProps {
  roleId: string;
  roleTitle: string;
  category?: string;
}

export const AnimatedRoleGraphic: React.FC<AnimatedRoleGraphicProps> = ({ roleId, roleTitle }) => {
  // Determine relevant icon and color theme based on roleId
  const getRoleTheme = (id: string) => {
    if (id.includes('warehouse') || id.includes('inventory') || id.includes('dispatch') || id.includes('staging')) {
      return {
        icon: Boxes,
        gradient: 'from-amber-500/20 via-blue-600/30 to-slate-900',
        ringColor: 'border-amber-400/40',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        accentColor: 'text-amber-400',
        glow: 'bg-amber-500/20'
      };
    }
    if (id.includes('retail') || id.includes('cashier') || id.includes('merchandiser') || id.includes('store')) {
      return {
        icon: ShoppingBag,
        gradient: 'from-emerald-500/20 via-teal-600/30 to-slate-900',
        ringColor: 'border-emerald-400/40',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        accentColor: 'text-emerald-400',
        glow: 'bg-emerald-500/20'
      };
    }
    if (id.includes('dark-store') || id.includes('rider') || id.includes('grader') || id.includes('quick')) {
      return {
        icon: Truck,
        gradient: 'from-blue-500/20 via-indigo-600/30 to-slate-900',
        ringColor: 'border-blue-400/40',
        badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        accentColor: 'text-blue-400',
        glow: 'bg-blue-500/20'
      };
    }
    if (id.includes('fb') || id.includes('guest') || id.includes('food') || id.includes('banquet')) {
      return {
        icon: Utensils,
        gradient: 'from-rose-500/20 via-orange-600/30 to-slate-900',
        ringColor: 'border-rose-400/40',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        accentColor: 'text-rose-400',
        glow: 'bg-rose-500/20'
      };
    }
    return {
      icon: Wrench,
      gradient: 'from-purple-500/20 via-indigo-600/30 to-slate-900',
      ringColor: 'border-purple-400/40',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      accentColor: 'text-purple-400',
      glow: 'bg-purple-500/20'
    };
  };

  const theme = getRoleTheme(roleId);
  const IconComponent = theme.icon;

  return (
    <div className={`w-full h-full relative overflow-hidden bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4 group`}>
      {/* Background Animated Glow */}
      <div className={`absolute inset-0 ${theme.glow} rounded-full blur-2xl animate-pulse pointer-events-none`} />
      
      {/* Concentric rotating radar rings */}
      <div className={`absolute w-36 h-36 rounded-full border border-dashed ${theme.ringColor} animate-[spin_20s_linear_infinite] opacity-40 pointer-events-none`} />
      <div className={`absolute w-24 h-24 rounded-full border ${theme.ringColor} animate-[spin_12s_linear_infinite_reverse] opacity-30 pointer-events-none`} />

      {/* Center Interactive Floating Card */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-3">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${theme.badgeBg} border backdrop-blur-md flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500 mb-2`}>
          <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${theme.accentColor} animate-bounce`} />
        </div>

        {/* Animated Live Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 text-white border border-white/10 text-[10px] font-bold shadow-lg">
          <span className={`w-2 h-2 rounded-full ${theme.accentColor.replace('text-', 'bg-')} animate-ping`} />
          <span className="tracking-wide uppercase">Live Skill Lab</span>
        </div>
      </div>

      {/* Floating decorative particles */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-white/40 animate-pulse" />
      <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" />
    </div>
  );
};

