import React, { useState, useEffect } from 'react';
import { Unit } from '../data/skillGoTypes';

export function RealTalkMode({ unit, onBack }: { unit: Unit, onBack: () => void }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hi! Let\'s practice real talk. How can I help you today?' }
  ]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e: any) => setTranscript(e.results[0][0].transcript);
    rec.start();
  };

  const sendMessage = () => {
    if (!transcript) return;
    setConversation([...conversation, { role: 'user', text: transcript }]);
    setTranscript('');
    // Simple mock response engine
    setTimeout(() => {
      setConversation(prev => [...prev, { role: 'ai', text: 'That\'s great to hear! Tell me more.' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <button onClick={onBack} className="self-start text-[#7d8ba3] mb-4">← Back</button>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {conversation.map((msg, i) => (
          <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white self-end ml-auto' : 'bg-slate-100 text-slate-900 self-start'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          value={transcript} 
          onChange={(e) => setTranscript(e.target.value)}
          className="flex-1 p-4 rounded-xl border border-slate-200"
          placeholder="Speak or type..."
        />
        <button onClick={startListening} className={`p-4 rounded-xl ${isListening ? 'bg-rose-500' : 'bg-slate-200'}`}>🎤</button>
        <button onClick={sendMessage} className="p-4 rounded-xl bg-indigo-600 text-white">➤</button>
      </div>
    </div>
  );
}
