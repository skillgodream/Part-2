import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { sentences, PracticeProgress } from '../../data/englishPractice';
import { Mic, Volume2, ArrowLeft, ChevronRight } from 'lucide-react';

export const TranslateSpeak: React.FC = () => {
  const { navigate } = useRouter();
  const items = sentences;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [typedInput, setTypedInput] = useState('');

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
          activeSession: { route: 'english-practice-translate', topic: item.topic, index: newIndex }
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
      setTypedInput('');
    } else {
      localStorage.removeItem('english_continue');
      navigate('english-practice-home');
    }
  };

  const handleMicClick = () => {
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setIsListening(false);
          setFeedback({ answer: spoken, correct: item.english });
        };
        recognition.onerror = () => {
          setTimeout(() => {
            setIsListening(false);
            setFeedback({ answer: item.english, correct: item.english });
          }, 1200);
        };
        recognition.start();
        return;
      } catch (e) {
        // Fallback
      }
    }
    setTimeout(() => {
      setIsListening(false);
      setFeedback({ answer: item.english, correct: item.english });
    }, 1500);
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

        <span className="text-xs font-bold text-teal-300 bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
          Sentence {index + 1} / {items.length}
        </span>
      </div>
      
      <div className="w-full bg-indigo-900/60 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-teal-400 h-full rounded-full transition-all duration-300" 
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>
      
      {!feedback ? (
        <GlassCard className="text-center p-6 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-500/30">
              {item.topic}
            </span>

            <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white pt-2">{item.hindi}</h3>
            <p className="text-indigo-200 text-xs sm:text-sm mb-6">Translate and speak this phrase in English</p>
            <div 
              onClick={handleMicClick}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 cursor-pointer transition-all active:scale-90 shadow-xl ${
                isListening ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50' : 'bg-teal-500 hover:bg-teal-400 text-indigo-950'
              }`}
            >
                <Mic className="w-10 h-10" />
            </div>
            <p className="text-xs text-indigo-300 font-semibold mb-3">
              {isListening ? 'Listening... Speak in English' : 'Tap the microphone to speak'}
            </p>

            <div className="pt-2 border-t border-white/10">
              <input 
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Or type English translation..."
                className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white text-xs outline-none focus:border-teal-400 mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && typedInput.trim()) {
                    setFeedback({ answer: typedInput, correct: item.english });
                  }
                }}
              />
              {typedInput.trim() && (
                <button 
                  onClick={() => setFeedback({ answer: typedInput, correct: item.english })}
                  className="w-full py-2 bg-teal-500 text-indigo-950 text-xs font-bold rounded-xl"
                >
                  Submit Written Answer
                </button>
              )}
            </div>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-4 p-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">Your Spoken Answer</h3>
              <p className="bg-white/10 p-3.5 rounded-2xl text-sm font-semibold">{feedback.answer}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">Natural English</h3>
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
              className="w-full bg-teal-400 hover:bg-teal-300 active:scale-95 text-indigo-950 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg" 
              onClick={handleNext}
            >
              <span>{index === items.length - 1 ? 'Finish Practice' : 'Next Sentence'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
        </GlassCard>
      )}
    </div>
  );
};
