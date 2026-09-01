import React, { useState } from 'react';
import { UNITS } from '../data/skillGoUnits';
import { Unit } from '../data/skillGoTypes';
import { LearnMode } from './LearnMode';
import { SpeakMode } from './SpeakMode';
import { PracticeMode } from './PracticeMode';
import { RealTalkMode } from './RealTalkMode';
import { BookOpen, Mic, Target, MessageCircle, ChevronRight, Home, BarChart2 } from 'lucide-react';

const ONBOARDING_SLIDES = [
  { icon: '🎓', title: 'Welcome to SkillGo English', sub: 'Learn English by speaking, not by reading rules.' },
  { icon: '🏠', title: '17 Lessons Inside', sub: 'Real English for your job, your family, and your friends.' },
  { icon: '🎯', title: '4 Simple Steps', sub: 'See it, say it, practice it, then use it in real talk.' },
  { icon: '🚀', title: 'Ready? Let\'s start!', sub: 'Pick any lesson and start speaking today.' }
];

export function SkillGoEnglish() {
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [activeScreen, setActiveScreen] = useState<'units' | 'home' | 'learn' | 'speak' | 'practice' | 'realtalk'>('units');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [obIndex, setObIndex] = useState(0);

  const handleNext = () => {
    if (obIndex < ONBOARDING_SLIDES.length - 1) {
      setObIndex(obIndex + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const showUnit = (unit: Unit) => {
    setCurrentUnit(unit);
    setActiveScreen('home');
  };

  const handleAction = (mode: 'learn' | 'speak' | 'practice' | 'realtalk') => {
    setActiveScreen(mode);
  };

  if (showOnboarding) {
    const slide = ONBOARDING_SLIDES[obIndex];
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen p-8 flex flex-col items-center justify-center text-center">
        <div className="text-8xl mb-8">{slide.icon}</div>
        <h2 className="text-3xl font-bold mb-3 text-slate-900 tracking-tight">{slide.title}</h2>
        <p className="text-slate-500 text-lg mb-12">{slide.sub}</p>
        <button 
          onClick={handleNext}
          className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl text-lg shadow-lg shadow-indigo-200"
        >
          {obIndex < ONBOARDING_SLIDES.length - 1 ? 'Next' : 'Get Started'}
        </button>
        {obIndex < ONBOARDING_SLIDES.length - 1 && (
          <button onClick={() => setShowOnboarding(false)} className="mt-6 text-slate-400 font-medium">Skip</button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 text-slate-900 min-h-screen pb-24 font-sans">
      <header className="p-6 flex justify-between items-center bg-white border-b border-slate-100">
        <h1 className="text-xl font-bold tracking-tight">English Foundations</h1>
        {activeScreen !== 'units' && (
          <button onClick={() => setActiveScreen('units')} className="text-slate-500 font-medium text-sm">Close</button>
        )}
      </header>
      
      <main className="p-4">
        {activeScreen === 'units' && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">Curriculum</h2>
            <div className="grid grid-cols-1 gap-3">
              {UNITS.map(unit => (
                <button 
                  key={unit.id}
                  onClick={() => showUnit(unit)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex items-center gap-4 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">📚</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{unit.title}</div>
                    <div className="text-xs text-slate-500">{unit.desc}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeScreen === 'home' && currentUnit && (
          <div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
              <h2 className="text-2xl font-bold mb-2 tracking-tight">{currentUnit.title}</h2>
              <p className="text-slate-500 text-sm">{currentUnit.desc}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '30%' }}></div>
                </div>
                <span className="text-xs font-bold text-slate-700">30% Mastery</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Learn', icon: BookOpen, mode: 'learn', color: 'bg-blue-50 text-blue-600' },
                { label: 'Speak', icon: Mic, mode: 'speak', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Practice', icon: Target, mode: 'practice', color: 'bg-amber-50 text-amber-600' },
                { label: 'Real Talk', icon: MessageCircle, mode: 'realtalk', color: 'bg-rose-50 text-rose-600' },
              ].map(action => (
                <button 
                  key={action.mode}
                  onClick={() => handleAction(action.mode as any)}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-slate-200 transition-all"
                >
                  <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {['learn', 'speak', 'practice', 'realtalk'].includes(activeScreen) && (
          <div className="pt-2">
            <h2 className="text-lg font-bold mb-6 capitalize tracking-tight">{activeScreen} Mode</h2>
            {activeScreen === 'learn' && currentUnit && <LearnMode unit={currentUnit} onBack={() => setActiveScreen('home')} />}
            {activeScreen === 'speak' && currentUnit && <SpeakMode unit={currentUnit} onBack={() => setActiveScreen('home')} />}
            {activeScreen === 'practice' && currentUnit && <PracticeMode unit={currentUnit} onBack={() => setActiveScreen('home')} />}
            {activeScreen === 'realtalk' && currentUnit && <RealTalkMode unit={currentUnit} onBack={() => setActiveScreen('home')} />}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex p-2 gap-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50">
        <button onClick={() => setActiveScreen('units')} className="flex-1 flex flex-col items-center p-3 text-indigo-600 font-semibold text-xs">
          <Home className="w-6 h-6 mb-1" />Home
        </button>
        <button className="flex-1 flex flex-col items-center p-3 text-slate-400 font-semibold text-xs">
          <MessageCircle className="w-6 h-6 mb-1" />Talk
        </button>
        <button className="flex-1 flex flex-col items-center p-3 text-slate-400 font-semibold text-xs">
          <BarChart2 className="w-6 h-6 mb-1" />Progress
        </button>
      </div>
    </div>
  );
}
