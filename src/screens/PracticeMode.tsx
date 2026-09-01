import React, { useState, useEffect, useRef } from 'react';
import { Unit } from '../data/skillGoTypes';
import { Mic, RotateCcw } from 'lucide-react';

export function PracticeMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const phrase = unit.phrases[index];

  const checkAnswer = (answer: string) => {
    if (answer.toLowerCase() === phrase.en.toLowerCase()) {
      setFeedback('✓ Correct!');
    } else {
      setFeedback(`✗ Correct: ${phrase.en}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button onClick={onBack} className="self-start text-[#7d8ba3] mb-4">← Back</button>
      <h2 className="text-xl font-bold mb-6">Practice</h2>
      <div className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="text-sm text-slate-500 mb-2">Translate:</div>
        <div className="text-xl font-bold mb-6">{phrase.hi}</div>
        <input 
          type="text" 
          placeholder="Type here..." 
          className="w-full p-4 rounded-xl border border-slate-200 mb-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter') checkAnswer(e.currentTarget.value);
          }}
        />
        {feedback && <div className={`p-4 rounded-xl font-bold ${feedback.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{feedback}</div>}
      </div>
      <button 
        onClick={() => { setFeedback(null); if(index < unit.phrases.length - 1) setIndex(index + 1); else onBack(); }} 
        className="w-full bg-indigo-600 text-white font-bold p-4 rounded-xl"
      >
        {index === unit.phrases.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}
