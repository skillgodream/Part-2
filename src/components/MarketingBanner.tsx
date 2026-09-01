import React from 'react';
import { X } from 'lucide-react';

interface MarketingBannerProps {
  onClose: () => void;
}

export function MarketingBanner({ onClose }: MarketingBannerProps) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <img 
          src="/Images/full page marketing.jpeg" 
          alt="Marketing" 
          className="w-full h-auto max-h-[400px] object-cover"
        />
        
        <div className="p-6">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
