import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { questions, PracticeProgress } from '../../data/englishPractice';
import { Volume2, ArrowLeft, ChevronRight, Mic, CheckCircle2 } from 'lucide-react';

export const AnswerImprove: React.FC = () => {
  const { navigate } = useRouter();
  const items = questions;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [answer, setAnswer] = useState('');

  const item = items[index] || items[0];

  useEffect(() => {
    const saved = localStorage.getItem('english_progress');
    if (saved) {
      const p: PracticeProgress = JSON.parse(saved);
      if (p.activeSession?.topic === item.topic) {
        setIndex(p.activeSession.index);
      }
    }
  }, []);

  const saveProgress = (newIndex: number) => {
    const p: PracticeProgress = JSON.parse(localStorage.getItem('english_progress') || '{}');
    const updatedP = {
      ...p,
      activeSession: { route: 'english-practice-answer', topic: item.topic, index: newIndex }
    };
    localStorage.setItem('english_progress', JSON.stringify(updatedP));
  };

  const playAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
      saveProgress(index + 1);
      setFeedback(null);
      setAnswer('');
    } else {
      localStorage.removeItem('english_continue');
      navigate('english-practice-home');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-4 sm:p-6 text-white pb-24 font-sans">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('english-practice-home')} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-indigo-100 font-bold text-xs transition-all backdrop-blur-md border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
          Question {index + 1} / {items.length}
        </span>
      </div>

      <div className="w-full bg-indigo-900/60 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-amber-400 h-full rounded-full transition-all duration-300" 
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>
      
      {!feedback ? (
        <GlassCard className="space-y-6 p-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
            {item.topic}
          </span>

          <div>
            <h3 className="text-xl sm:text-2xl font-black flex items-center justify-between gap-3 text-white">
              <span>{item.question}</span>
              <button 
                onClick={() => playAudio(item.question)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer shrink-0"
                title="Play Question Audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </h3>
            <p className="text-xs text-indigo-200 mt-1">How would you respond to this workplace question?</p>
          </div>

          <textarea 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
            rows={3}
            className="w-full bg-white/10 border border-white/15 focus:border-amber-400 focus:bg-white/15 p-4 rounded-2xl text-white text-sm outline-none transition-all resize-none" 
            placeholder="Type your response in English..." 
          />

          <button 
            disabled={!answer.trim()}
            className="w-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-indigo-950 py-3.5 rounded-2xl font-extrabold text-sm disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md cursor-pointer" 
            onClick={() => setFeedback({ answer, correct: item.acceptableAnswerExamples[0] })}
          >
            Submit & Compare
          </button>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-5 p-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">What you answered</h3>
            <p className="bg-white/10 p-3.5 rounded-2xl text-sm font-semibold text-slate-100">{feedback.answer}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">Natural / Professional Way</h3>
              <button 
                onClick={() => playAudio(feedback.correct)}
                className="flex items-center gap-1 text-xs font-bold text-teal-300 hover:text-teal-200 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Listen
              </button>
            </div>
            <p className="bg-teal-900/60 border border-teal-500/40 p-3.5 rounded-2xl text-sm font-bold text-teal-100">
              {feedback.correct}
            </p>
          </div>

          <button 
            className="w-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-indigo-950 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg" 
            onClick={handleNext}
          >
            <span>{index === items.length - 1 ? 'Finish Practice' : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </GlassCard>
      )}
    </div>
  );
};
