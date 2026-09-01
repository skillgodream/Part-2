import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { sentences, PracticeProgress } from '../../data/englishPractice';
import { Mic, Volume2, ArrowLeft } from 'lucide-react';

export const TranslateSpeak: React.FC = () => {
  const { navigate } = useRouter();
  const items = sentences;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);

  const item = items[index];

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
  }

  const handleNext = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
      saveProgress(index + 1);
      setFeedback(null);
    } else {
      localStorage.removeItem('english_continue');
      navigate('english-practice-home');
    }
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
        setIsListening(false);
        setFeedback({ answer: 'Mock spoken answer', correct: item.english });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-6 pt-10 text-white">
      <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('english-practice-home')} className="text-indigo-200">
              <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{item.topic}</h2>
      </div>
      
      <div className="w-full bg-indigo-900 h-2 rounded-full mb-6">
        <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${(index + 1) * (100/items.length)}%` }}></div>
      </div>
      
      {!feedback ? (
        <GlassCard className="text-center">
            <h3 className="text-3xl font-bold mb-4">{item.hindi}</h3>
            <p className="text-indigo-200 mb-8">Say this in English</p>
            <div 
              onClick={handleMicClick}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 cursor-pointer ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
                <Mic className="w-10 h-10" />
            </div>
            <button className="text-indigo-200 underline" onClick={() => setFeedback({ answer: 'User answer', correct: item.english })}>Type your answer instead</button>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-4">
            <h3 className="text-lg font-bold">Your answer</h3>
            <p className="bg-white/5 p-4 rounded-xl">{feedback.answer}</p>
            <h3 className="text-lg font-bold flex items-center gap-2">
                Better English 
                <Volume2 className="w-5 h-5 text-teal-400 cursor-pointer" />
            </h3>
            <p className="bg-teal-900/50 p-4 rounded-xl text-teal-200">{feedback.correct}</p>
            <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold mt-4" onClick={handleNext}>Next Sentence</button>
        </GlassCard>
      )}
    </div>
  );
};
