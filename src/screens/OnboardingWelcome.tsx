import React from 'react';
import { useRouter } from '../lib/router';
import { ArrowRight } from 'lucide-react';
import { SkillGoLogo } from '../components/ui';

export function OnboardingWelcomeScreen() {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col justify-end">
      {/* Full-bleed background image */}
      <img 
        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop" 
        alt="Warehouse team" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Hero Content Section */}
      <main className="relative z-20 p-6 md:p-12 pb-6 flex flex-col justify-end flex-grow">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter mb-4 max-w-lg">
          Your career,<br />
          accelerated.
        </h1>
        <p className="text-white text-xs md:text-sm mb-8 max-w-sm">
          Join thousands of professionals in mastering new skills and finding better job opportunities today.
        </p>
        <button 
          onClick={() => navigate('onboarding-details')}
          className="self-start bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg"
        >
          Get Started
        </button>
      </main>

      {/* Persistent Navigation Bar (Bottom 15%) */}
      <nav className="relative z-20 h-24 border-t border-white/20 flex items-center justify-between px-6 md:px-12 bg-black/30 backdrop-blur-md">
        {['Logistics', 'Operations', 'Quality', 'Management', 'Safety'].map((tab, i) => (
          <button key={i} className="text-xs md:text-sm font-bold text-white hover:text-slate-200 flex items-center gap-1 md:gap-2">
            {tab}
            {i === 4 && <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
