import React from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/55 backdrop-blur-[28px] saturate-[180%]
        border border-white/30
        rounded-[24px]
        shadow-[0_10px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.55)]
        transition-all duration-220 ease-in-out
        hover:translate-y-[-2px] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:bg-white/60
        active:scale-[0.985]
        cursor-pointer
        ${className}
      `}
    >
      {/* Subtle vertical highlight */}
      <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
