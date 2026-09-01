import React, { useState } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { situations } from '../../data/englishPractice';
import { Send, Mic, Volume2, ArrowLeft } from 'lucide-react';

export const RealConversations: React.FC = () => {
  const { navigate } = useRouter();
  const [convo, setConvo] = useState(situations[0]);
  const [turn, setTurn] = useState(0);
  const [inputText, setInputText] = useState('');

  const handleNext = () => {
    if (turn < convo.turns.length - 1) {
      setTurn(turn + 1);
      setInputText('');
    } else {
      navigate('english-practice-home');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-6 pt-10 text-white">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('english-practice-home')} className="text-indigo-200">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">{convo.title}</h2>
        </div>
        
        <div className="space-y-4 mb-32">
            {convo.turns.slice(0, turn + 1).map((t, i) => (
                <div key={i} className={`p-4 rounded-2xl ${t.speaker === 'Manager' ? 'bg-indigo-900' : 'bg-teal-900 ml-auto'}`}>
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-indigo-200">{t.speaker}</p>
                        {t.speaker === 'Manager' && <Volume2 className="w-4 h-4 text-indigo-400 cursor-pointer" onClick={() => alert('Simulated audio playback')} />}
                    </div>
                    <p>{t.text}</p>
                </div>
            ))}
        </div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-indigo-950 border-t border-white/10 space-y-2">
            <div className="flex gap-2">
                <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-grow bg-white/10 p-3 rounded-xl"
                    placeholder="Type your response..."
                />
                <button className="bg-white/10 p-3 rounded-xl"><Mic className="w-5 h-5" /></button>
            </div>
            <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2" onClick={handleNext}>
                <Send className="w-4 h-4" /> Send
            </button>
        </div>
    </div>
  );
};
