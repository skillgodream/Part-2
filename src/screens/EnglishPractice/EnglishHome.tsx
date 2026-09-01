import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { ArrowRight, Mic, MessageCircle, Users, BookOpen } from 'lucide-react';
import { PracticeProgress, sentences, questions, situations } from '../../data/englishPractice';

export const EnglishPracticeHome: React.FC = () => {
  const { navigate, goBack } = useRouter();
  const [progress, setProgress] = useState<PracticeProgress | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('english_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  return (
    <div className="bg-indigo-950 p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <button onClick={goBack} className="text-indigo-200">← Back</button>
      </div>
      
      <header className="mb-6">
        <h1 className="text-2xl font-bold">English Practice</h1>
        <p className="text-indigo-200 mt-1 text-sm">Speak. Practice. Improve.</p>
      </header>

      {progress?.activeSession && (
        <GlassCard className="mb-6 border-teal-500" onClick={() => navigate(progress.activeSession!.route)}>
            <h3 className="font-semibold text-lg">Continue Practice</h3>
            <p className="text-sm text-indigo-200">{progress.activeSession.topic}</p>
        </GlassCard>
      )}

      <div className="grid gap-3 mb-6">
        <GlassCard onClick={() => navigate('english-practice-translate')} className="flex items-center gap-4">
            <Mic className="w-8 h-8 text-indigo-300" />
            <div><h3 className="font-semibold">Translate & Speak</h3><p className="text-xs text-indigo-200">{sentences.length} sentences</p></div>
        </GlassCard>
        <GlassCard onClick={() => navigate('english-practice-answer')} className="flex items-center gap-4">
            <MessageCircle className="w-8 h-8 text-indigo-300" />
            <div><h3 className="font-semibold">Answer & Improve</h3><p className="text-xs text-indigo-200">{questions.length} questions</p></div>
        </GlassCard>
        <GlassCard onClick={() => navigate('english-practice-real')} className="flex items-center gap-4">
            <Users className="w-8 h-8 text-indigo-300" />
            <div><h3 className="font-semibold">Real Conversations</h3><p className="text-xs text-indigo-200">{situations.length} situations</p></div>
        </GlassCard>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
        <GlassCard className="bg-indigo-900">
            <h3 className="font-bold">🏠 Daily Routine</h3>
            <p className="text-indigo-200">75 sent. • 75 ques. • 10 situ.</p>
        </GlassCard>
        <GlassCard className="bg-indigo-900">
            <h3 className="font-bold">💼 Workplace</h3>
            <p className="text-indigo-200">75 sent. • 75 ques. • 10 situ.</p>
        </GlassCard>
      </div>

      <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><BookOpen /> Sentence Library</h2>
      <GlassCard onClick={() => navigate('english-practice-library')}>
        <p className="text-sm text-indigo-200">Learn how English sentences are made.</p>
      </GlassCard>
    </div>
  );
};
