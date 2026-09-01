import React, { useState } from 'react';
import { Button } from '../components/ui';
import { Send, RotateCcw } from 'lucide-react';

interface Message {
  role: 'AI' | 'Learner';
  text: string;
  rephrased?: string; // Add this to show the rephrased version
}

export const AiRoleplayPrototype: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{ role: 'AI', text: "You're 20 minutes late today. What happened?" }]);
  const [input, setInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [performance, setPerformance] = useState<string | null>(null);

  const sendMessageToAI = async (text: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationState: {} }), // Simplification for now
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API error:", error);
      return { empathy: "Sorry, I'm having trouble.", rephrased: "", nextQuestion: "Try again?", isScenarioComplete: false };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const learnerMessage = input;
    setInput('');

    // Add learner message
    setMessages(prev => [...prev, { role: 'Learner', text: learnerMessage }]);

    // Get AI response
    const aiData = await sendMessageToAI(learnerMessage);

    // Add AI response
    setMessages(prev => [
        ...prev, 
        { 
            role: 'AI', 
            text: `${aiData.empathy || ""} ${aiData.nextQuestion || "Could you tell me more?"}`.trim(), 
            rephrased: aiData.rephrased || undefined
        }
    ]);

    if (aiData.isScenarioComplete) {
        setIsCompleted(true);
        setPerformance(aiData.performanceSummary);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">AI Roleplay: Reporting Late</h1>
      
      {!isCompleted ? (
        <>
            <div className="space-y-4 h-96 overflow-y-auto border p-4 rounded-lg bg-slate-50">
                {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-lg ${m.role === 'AI' ? 'bg-blue-100' : 'bg-white border border-blue-200 ml-auto'}`}>
                        {m.text}
                        {m.rephrased && <p className="text-xs text-slate-600 mt-1 italic">Better: {m.rephrased}</p>}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    className="border p-3 flex-1 rounded-lg" 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type your response..."
                />
                <Button onClick={handleSend}><Send size={18}/></Button>
            </div>
        </>
      ) : (
        <div className="space-y-4 p-6 border rounded-lg bg-green-50">
            <h2 className="text-xl font-bold">Scenario Completed!</h2>
            <p className="text-sm">{performance || "Great job practicing your workplace English!"}</p>
            <Button onClick={() => window.location.reload()}><RotateCcw className="mr-2" size={16}/> Try Again</Button>
        </div>
      )}
    </div>
  );
};
