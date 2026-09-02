import React, { useState } from 'react';
import { Unit } from '../data/skillGoTypes';
import { ArrowLeft, Volume2, RotateCw, SkipBack, SkipForward, CheckCircle2, Sparkles } from 'lucide-react';

export function LearnMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const phrase = unit.phrases[index] || unit.phrases[0];

  const playAudio = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(phrase.en);
    utter.lang = 'en-IN';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  const progressPercent = Math.round(((index + 1) / unit.phrases.length) * 100);

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  };

  const handleNext = () => {
    if (index < unit.phrases.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col items-center w-full font-sans select-none antialiased">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-5">
        <button 
          onClick={onBack} 
          className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
          title="Back to Lesson"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            FLASHCARDS • UNIT {unit.id}
          </span>
          <span className="text-xs font-black text-slate-700">
            Phrase {index + 1} of {unit.phrases.length}
          </span>
        </div>

        <div className="w-11 h-11 rounded-full neu-inset flex items-center justify-center text-indigo-600 font-black text-xs">
          {progressPercent}%
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 neu-inset rounded-full overflow-hidden mb-6">
        <div 
          className="bg-gradient-to-r from-[#6284ff] to-[#829eff] h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Neumorphic Flip Card */}
      <div 
        className="w-full max-w-sm h-72 perspective-1000 cursor-pointer select-none mb-6" 
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front: Hindi Card */}
          <div className="absolute inset-0 neu-flat rounded-3xl p-6 flex flex-col justify-between backface-hidden border border-white/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 neu-inset-sm px-3 py-1 rounded-full">
                Hindi Meaning
              </span>
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Tap to reveal English
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-slate-800 text-center my-auto px-2 leading-relaxed">
              {phrase.hi}
            </div>

            <div className="text-center text-xs font-extrabold text-indigo-500">
              Flip for pronunciation & audio ➔
            </div>
          </div>

          {/* Back: English Card */}
          <div className="absolute inset-0 neu-flat rounded-3xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 border border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 neu-inset-sm px-3 py-1 rounded-full">
                English Translation
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(); }}
                className="w-9 h-9 rounded-full neu-glow-btn text-white flex items-center justify-center cursor-pointer"
                title="Play Speech"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center my-auto px-2">
              <div className="text-xl sm:text-2xl font-black text-indigo-600 leading-snug">
                {phrase.en}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-2 neu-inset-sm px-3 py-1 rounded-full">
                🗣️ {phrase.pron}
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); playAudio(); }}
              className="w-full neu-btn-circle py-2.5 rounded-2xl text-xs font-black text-indigo-600 flex items-center justify-center gap-2 cursor-pointer hover:text-indigo-800"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear Speech Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 w-full max-w-sm">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className={`w-14 h-14 rounded-full neu-btn-circle flex items-center justify-center transition-all cursor-pointer ${
            index === 0 ? 'opacity-40 pointer-events-none' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Previous Phrase"
        >
          <SkipBack className="w-5 h-5 fill-current stroke-none" />
        </button>

        <button
          onClick={() => setFlipped(!flipped)}
          className="w-16 h-16 rounded-full neu-glow-btn text-white flex items-center justify-center transition-all cursor-pointer"
          title="Flip Flashcard"
        >
          <RotateCw className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
          title="Next Phrase"
        >
          <SkipForward className="w-5 h-5 fill-current stroke-none" />
        </button>
      </div>
    </div>
  );
}
