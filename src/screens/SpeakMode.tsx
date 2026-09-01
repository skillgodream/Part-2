import React, { useState } from 'react';
import { Unit } from '../data/skillGoTypes';

export function SpeakMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [step, setStep] = useState<'study' | 'assess'>('study');
  const [index, setIndex] = useState(0);
  const phrase = unit.phrases[index];

  if (step === 'study') {
    return (
      <div className="flex flex-col items-center">
        <button onClick={onBack} className="self-start text-[#7d8ba3] mb-4">← Back</button>
        <h2 className="text-xl font-bold mb-6">Read & Remember</h2>
        {unit.phrases.map((p, i) => (
          <div key={i} className="w-full bg-[#101d2e] p-4 rounded-xl mb-4 border border-[#223349]">
            <div className="font-bold text-lg">{p.hi}</div>
            <div className="text-[#22d3ee] font-bold">{p.en}</div>
          </div>
        ))}
        <button onClick={() => setStep('assess')} className="w-full bg-[#22d3ee] text-[#04212b] font-bold p-4 rounded-xl mt-4">Start Speaking</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="self-start text-[#7d8ba3] mb-4">← Back</button>
      <h2 className="text-xl font-bold mb-6">Speak</h2>
      <div className="w-full bg-[#101d2e] p-6 rounded-xl text-center mb-8 border border-[#223349]">
        <div className="text-lg font-bold mb-4">{phrase.hi}</div>
        <button 
          onClick={() => alert('Mic listening... (Not implemented in preview)')} 
          className="w-20 h-20 bg-[#152436] rounded-full flex items-center justify-center text-4xl border-2 border-[#22d3ee] text-[#22d3ee] mx-auto"
        >🎤</button>
      </div>
      <button 
        onClick={() => { if(index < unit.phrases.length - 1) setIndex(index + 1); else onBack(); }} 
        className="w-full bg-[#22d3ee] text-[#04212b] font-bold p-4 rounded-xl"
      >
        {index === unit.phrases.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}
