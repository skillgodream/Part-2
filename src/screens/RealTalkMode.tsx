import React, { useState, useEffect, useRef } from 'react';
import { Unit } from '../data/skillGoTypes';
import { ArrowLeft, Mic, Send, Volume2, Sparkles, Bot, User as UserIcon } from 'lucide-react';

export function RealTalkMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'ai' | 'user'; text: string; time: string }[]>([
    { 
      role: 'ai', 
      text: `Hello! I am your workplace supervisor. Let's practice conversations for "${unit.title}". How would you start this discussion?`, 
      time: 'Just now' 
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const playAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const samplePhrase = unit.phrases[Math.floor(Math.random() * unit.phrases.length)]?.en || "Good morning, I am ready for today's tasks.";
        setTranscript(samplePhrase);
      }, 1500);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (e: any) => {
        setTranscript(e.results[0][0].transcript);
      };
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const sendMessage = () => {
    const trimmed = transcript.trim();
    if (!trimmed) return;

    const newConvo = [
      ...conversation,
      { role: 'user' as const, text: trimmed, time: 'Just now' }
    ];
    setConversation(newConvo);
    setTranscript('');

    // AI dynamic reply
    setTimeout(() => {
      const responses = [
        `Great response! In standard workplace English, that sounds clear and professional. Can you also confirm the timeline?`,
        `Understood! You spoke that with very clear pronunciation. What would you do next in this situation?`,
        `Excellent articulation. Let's make sure everything is logged properly for the floor team.`
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setConversation([
        ...newConvo,
        { role: 'ai' as const, text: reply, time: 'Just now' }
      ]);
      playAudio(reply);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full font-sans select-none antialiased">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button 
          onClick={onBack} 
          className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
          title="Back to Lesson"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            REAL TALK • UNIT {unit.id}
          </span>
          <span className="text-xs font-black text-slate-700">
            AI Supervisor Roleplay
          </span>
        </div>

        <div className="w-11 h-11 rounded-full neu-inset flex items-center justify-center text-rose-500">
          <Bot className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="w-full neu-inset p-4 rounded-3xl h-[340px] overflow-y-auto no-scrollbar space-y-3 mb-4">
        {conversation.map((msg, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] font-black uppercase text-slate-400">
                {msg.role === 'user' ? 'You' : 'Floor Supervisor (AI)'}
              </span>
            </div>
            
            <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-semibold leading-relaxed ${
              msg.role === 'user' 
                ? 'neu-glow-btn text-white rounded-br-xs' 
                : 'neu-flat text-slate-800 rounded-bl-xs'
            }`}>
              {msg.text}
            </div>

            {msg.role === 'ai' && (
              <button
                onClick={() => playAudio(msg.text)}
                className="neu-btn-circle p-1.5 rounded-full mt-1 text-slate-400 hover:text-indigo-600 self-start text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear</span>
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Phrases */}
      <div className="w-full mb-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-1.5">
          Suggested Phrases
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {unit.phrases.slice(0, 3).map((p, idx) => (
            <button
              key={idx}
              onClick={() => setTranscript(p.en)}
              className="neu-flat-sm px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-indigo-600 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {p.en}
            </button>
          ))}
        </div>
      </div>

      {/* Input / Speak Bar */}
      <div className="w-full flex items-center gap-2">
        <button
          onClick={startListening}
          disabled={isListening}
          className={`w-12 h-12 rounded-full neu-btn-circle flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-indigo-600 hover:text-indigo-800'
          }`}
          title="Tap to speak your answer"
        >
          <Mic className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex-1 neu-inset rounded-2xl px-3.5 py-2.5 flex items-center">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isListening ? 'Listening...' : 'Type or speak reply...'}
            className="w-full bg-transparent text-xs font-black text-slate-800 focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        <button
          onClick={sendMessage}
          disabled={!transcript.trim()}
          className="w-12 h-12 rounded-full neu-glow-btn text-white flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          title="Send reply"
        >
          <Send className="w-4 h-4 ml-0.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
