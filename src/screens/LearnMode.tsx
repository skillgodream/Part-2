import React, { useState } from 'react';
import { Unit } from '../data/skillGoTypes';

export function LearnMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const phrase = unit.phrases[index];

  const playAudio = () => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(phrase.en);
    utter.lang = 'en-IN';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="self-start text-[#7d8ba3] mb-4">← Back</button>
      <div className="text-[#7d8ba3] mb-4">{index + 1} / {unit.phrases.length}</div>
      <div 
        className="w-full max-w-sm h-60 perspective-1000 cursor-pointer" 
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 bg-[#101d2e] border border-[#223349] rounded-xl flex flex-col items-center justify-center p-6 backface-hidden text-white">
            <div className="text-xs uppercase text-[#7d8ba3] mb-2">Hindi</div>
            <div className="text-2xl font-bold">{phrase.hi}</div>
          </div>
          <div className="absolute inset-0 bg-[#152436] border border-[#22d3ee] rounded-xl flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180 text-white">
            <div className="text-xs uppercase text-[#7d8ba3] mb-2">English</div>
            <div className="text-xl font-bold text-[#22d3ee]">{phrase.en}</div>
            <div className="text-sm text-[#f5a524] mt-2 mb-4">🔊 {phrase.pron}</div>
            <button 
              onClick={(e) => { e.stopPropagation(); playAudio(); }}
              className="bg-[#101d2e] border border-[#22d3ee] text-[#22d3ee] text-xs px-4 py-2 rounded-full flex items-center gap-2"
            >
              🔊 Hear it & repeat
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-8 w-full max-w-sm">
        <button onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false); }} disabled={index === 0} className="flex-1 bg-[#152436] p-4 rounded-xl">Back</button>
        <button onClick={() => { if(index < unit.phrases.length - 1) { setIndex(index + 1); setFlipped(false); } else { onBack(); } }} className="flex-1 bg-[#22d3ee] text-[#04212b] font-bold p-4 rounded-xl">{index === unit.phrases.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}
