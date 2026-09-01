import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { questions, PracticeProgress } from '../../data/englishPractice';
import { Volume2, ArrowLeft } from 'lucide-react';

export const AnswerImprove: React.FC = () => {
  const { navigate } = useRouter();
  const items = questions;
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [answer, setAnswer] = useState('');

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
          activeSession: { route: 'english-practice-answer', topic: item.topic, index: newIndex }
      };
      localStorage.setItem('english_progress', JSON.stringify(updatedP));
  }

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
    <div className="min-h-screen bg-indigo-950 p-6 pt-10 text-white">
      <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('english-practice-home')} className="text-indigo-200">
              <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{item.topic}</h2>
      </div>
      
      {!feedback ? (
        <GlassCard className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
                {item.question}
                <Volume2 className="w-5 h-5 text-indigo-400 cursor-pointer" />
            </h3>
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full bg-white/10 p-4 rounded-xl text-white" placeholder="Type your answer..." />
            <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold" onClick={() => setFeedback({ answer, correct: item.acceptableAnswerExamples[0] })}>Submit</button>
        </GlassCard>
      ) : (
        <GlassCard className="space-y-4">
            <h3 className="text-lg font-bold">What you said</h3>
            <p className="bg-white/5 p-4 rounded-xl">{feedback.answer}</p>
            <h3 className="text-lg font-bold flex items-center gap-2">
                A better way to say it
                <Volume2 className="w-5 h-5 text-teal-400 cursor-pointer" />
            </h3>
            <p className="bg-teal-900/50 p-4 rounded-xl text-teal-200">{feedback.correct}</p>
            <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold mt-4" onClick={handleNext}>Next Question</button>
        </GlassCard>
      )}
    </div>
  );
};
