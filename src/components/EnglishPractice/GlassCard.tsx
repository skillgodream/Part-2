
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-sm transition-all hover:bg-white/15 ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
