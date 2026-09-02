import React, { useState } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { situations } from '../../data/englishPractice';
import { Send, Mic, Volume2, ArrowLeft, Bot, User as UserIcon, Sparkles } from 'lucide-react';

export const RealConversations: React.FC = () => {
  const { navigate } = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [turn, setTurn] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const convo = situations[selectedIdx] || situations[0];

  const playAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    if (turn < convo.turns.length - 1) {
      setTurn(turn + 1);
      setInputText('');
    } else {
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
          setInputText(spoken);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.start();
        return;
      } catch (e) {
        // fallback
      }
    }
    setTimeout(() => {
      setIsListening(false);
      const nextSpeakerTurn = convo.turns[turn + 1];
      if (nextSpeakerTurn) {
        setInputText(nextSpeakerTurn.text);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-4 sm:p-6 text-white pb-36 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('english-practice-home')} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-indigo-100 font-bold text-xs transition-all backdrop-blur-md border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <span className="text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Scenario {selectedIdx + 1} / {situations.length}
        </span>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {situations.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedIdx(idx);
              setTurn(0);
              setInputText('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedIdx === idx 
                ? 'bg-teal-400 text-indigo-950 shadow-md' 
                : 'bg-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-black text-white">{convo.title}</h2>
        <p className="text-xs text-indigo-200 mt-0.5">Roleplay practice with your team supervisor</p>
      </div>
      
      {/* Dialogue List */}
      <div className="space-y-3.5 mb-6">
        {convo.turns.slice(0, turn + 1).map((t, i) => {
          const isManager = t.speaker === 'Manager' || t.speaker === 'Supervisor';
          return (
            <div 
              key={i} 
              className={`p-4 rounded-2xl max-w-[88%] shadow-sm ${
                isManager 
                  ? 'bg-indigo-900/90 border border-indigo-700/60 text-white mr-auto rounded-tl-xs' 
                  : 'bg-teal-900/90 border border-teal-600/60 text-teal-50 ml-auto rounded-tr-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 gap-4">
                <span className="text-[11px] font-extrabold tracking-wide uppercase flex items-center gap-1 text-indigo-300">
                  {isManager ? <Bot className="w-3 h-3 text-teal-300" /> : <UserIcon className="w-3 h-3 text-teal-300" />}
                  {t.speaker}
                </span>
                {isManager && (
                  <button 
                    onClick={() => playAudio(t.text)}
                    className="flex items-center gap-1 text-[11px] text-teal-300 hover:text-teal-200 font-bold cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen
                  </button>
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed">{t.text}</p>
            </div>
          );
        })}
      </div>

      {/* Fixed bottom interactive bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-indigo-950/95 backdrop-blur-xl border-t border-white/10 space-y-2 z-40 max-w-lg mx-auto right-0">
        <div className="flex gap-2">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNext();
            }}
            className="flex-grow bg-white/10 border border-white/15 focus:border-teal-400 p-3 rounded-xl text-white text-xs sm:text-sm outline-none placeholder:text-indigo-300"
            placeholder="Type your response or use mic..."
          />
          <button 
            onClick={handleMicClick}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Speak"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <button 
          className="w-full bg-teal-400 hover:bg-teal-300 active:scale-95 text-indigo-950 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all" 
          onClick={handleNext}
        >
          <Send className="w-4 h-4" /> 
          <span>{turn >= convo.turns.length - 1 ? 'Finish Scenario' : 'Send & Continue Conversation'}</span>
        </button>
      </div>
    </div>
  );
};
