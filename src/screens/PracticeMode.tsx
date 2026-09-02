import React, { useState } from 'react';
import { Unit } from '../data/skillGoTypes';
import { ArrowLeft, CheckCircle2, XCircle, Volume2, ChevronRight, HelpCircle, Check, RotateCcw } from 'lucide-react';

export function PracticeMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  
  const phrase = unit.phrases[index] || unit.phrases[0];

  const playAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  const checkAnswer = (answer: string) => {
    const cleanAnswer = answer.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    const cleanTarget = phrase.en.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    
    if (cleanAnswer === cleanTarget) {
      setFeedback({ isCorrect: true, message: 'Excellent! Perfect translation.' });
      playAudio(phrase.en);
    } else {
      setFeedback({ 
        isCorrect: false, 
        message: `Correct phrase: "${phrase.en}" (${phrase.pron})` 
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setUserInput('');
    if (index < unit.phrases.length - 1) {
      setIndex(index + 1);
    } else {
      onBack();
    }
  };

  // Generate word bank chips for easier mobile translation
  const words = React.useMemo(() => {
    const raw = phrase.en.split(' ');
    // add some distractor words
    const distractors = ['please', 'now', 'tomorrow', 'help', 'sir', 'check', 'ready'];
    const extra = distractors.filter(d => !raw.map(w => w.toLowerCase()).includes(d)).slice(0, 2);
    return [...raw, ...extra].sort(() => 0.5 - Math.random());
  }, [phrase]);

  return (
    <div className="flex flex-col items-center w-full font-sans select-none antialiased">
      {/* Top bar */}
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
            TRANSLATE QUIZ • UNIT {unit.id}
          </span>
          <span className="text-xs font-black text-slate-700">
            Question {index + 1} of {unit.phrases.length}
          </span>
        </div>

        <button 
          onClick={() => playAudio(phrase.en)}
          className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-indigo-600 active:scale-95 transition-all cursor-pointer"
          title="Hear Audio"
        >
          <Volume2 className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Target Hindi Prompt */}
      <div className="w-full neu-flat p-6 rounded-3xl mb-5 text-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 neu-inset-sm px-3 py-1 rounded-full">
          Translate to English
        </span>
        <div className="text-xl sm:text-2xl font-black text-slate-800 my-3">
          {phrase.hi}
        </div>
      </div>

      {/* Interactive Word Bank */}
      <div className="w-full mb-5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-2">
          Tap words to construct response
        </div>
        <div className="flex flex-wrap gap-2">
          {words.map((word, wIdx) => (
            <button
              key={wIdx}
              onClick={() => {
                const nextVal = userInput ? `${userInput} ${word}` : word;
                setUserInput(nextVal);
              }}
              className="neu-flat-sm px-3.5 py-2 rounded-xl text-xs font-black text-slate-700 hover:text-indigo-600 active:scale-95 transition-all cursor-pointer"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* User Input Area */}
      <div className="w-full mb-5">
        <div className="w-full neu-inset p-4 rounded-2xl min-h-[60px] flex items-center justify-between text-sm font-black text-slate-800">
          <span>{userInput || <span className="text-slate-400 font-normal italic">Tap words above or type your translation...</span>}</span>
          {userInput && (
            <button
              onClick={() => setUserInput('')}
              className="neu-btn-circle w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Feedback Card */}
      {feedback && (
        <div className={`w-full p-4 rounded-2xl mb-5 text-center transition-all ${
          feedback.isCorrect 
            ? 'neu-inset border border-emerald-300/60 bg-emerald-50/50' 
            : 'neu-inset border border-rose-300/60 bg-rose-50/50'
        }`}>
          <div className="flex items-center justify-center gap-1.5 font-black text-sm">
            {feedback.isCorrect ? (
              <span className="text-emerald-700 flex items-center gap-1"><Check className="w-4 h-4 stroke-[3]" /> Correct!</span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1"><XCircle className="w-4 h-4" /> Try Again</span>
            )}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">{feedback.message}</div>
        </div>
      )}

      {/* Submit / Next Button */}
      <div className="w-full mt-auto">
        {!feedback ? (
          <button
            onClick={() => checkAnswer(userInput)}
            disabled={!userInput.trim()}
            className="w-full neu-glow-btn text-white font-black py-4 rounded-2xl text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50"
          >
            Check Translation
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full neu-glow-btn text-white font-black py-4 rounded-2xl text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
