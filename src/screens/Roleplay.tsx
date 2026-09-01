import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../lib/router';
import { ArrowLeft, Send, RotateCcw, Award } from 'lucide-react';
import { Button } from '../components/ui';
import { Message } from '../types';
import { chatWithAI, ConversationState } from '../lib/roleplayEngine';

const SCENARIO_TITLE = "Reporting Late to Work";
const INITIAL_AI_MESSAGE = "I noticed you were late to your shift today. This is the second time this week. What happened?";

export function RoleplayScreen() {
  const { navigate, goBack, currentRoute } = useRouter();
  const returnTo = currentRoute.params?.returnTo;
  const roleId = currentRoute.params?.roleId;

  const [messages, setMessages] = useState<Message[]>([{ sender: 'supervisor', text: INITIAL_AI_MESSAGE }]);
  const [input, setInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    scenario: SCENARIO_TITLE,
    mainTopic: "Late arrival at work",
    currentLearningObjective: "Explain why late",
    knownFacts: [],
    answeredIntents: [],
    recentQuestions: [],
    learnerMistakes: [],
    conversationHistory: [{ sender: 'supervisor', text: INITIAL_AI_MESSAGE }],
    completedObjectives: []
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isCompleted) return;

    const learnerMsg: Message = { sender: 'learner', text: input };
    const newMessages = [...messages, learnerMsg];
    setMessages(newMessages);
    setInput('');

    try {
        const aiResponse = await chatWithAI(input, {
            ...conversationState,
            conversationHistory: newMessages
        });

        const supervisorMsg: Message = { sender: 'supervisor', text: aiResponse.response };
        setMessages(prev => [...prev, supervisorMsg]);
        
        setConversationState(prev => ({
            ...prev,
            knownFacts: [...prev.knownFacts, ...aiResponse.newFacts],
            answeredIntents: [...prev.answeredIntents, ...aiResponse.intentAnswered],
            currentLearningObjective: aiResponse.nextObjective,
            conversationHistory: [...newMessages, supervisorMsg]
        }));
        
        if (aiResponse.shouldMoveForward && aiResponse.nextObjective === "Finished") {
            setIsCompleted(true);
        }
    } catch (e) {
        setMessages(prev => [...prev, { sender: 'supervisor', text: "I'm having trouble thinking right now. Could you please try again?" }]);
    }
  };

  const handleRetry = () => {
    setMessages([{ sender: 'supervisor', text: INITIAL_AI_MESSAGE }]);
    setConversationState({
        scenario: SCENARIO_TITLE,
        mainTopic: "Late arrival at work",
        currentLearningObjective: "Explain why late",
        knownFacts: [],
        answeredIntents: [],
        recentQuestions: [],
        learnerMistakes: [],
        conversationHistory: [{ sender: 'supervisor', text: INITIAL_AI_MESSAGE }],
        completedObjectives: []
    });
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFE] text-slate-900 font-sans">
      <header className="flex items-center gap-3 p-4 border-b border-slate-100 bg-white">
        <button onClick={() => returnTo ? navigate(returnTo, { id: roleId }) : goBack()} className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{SCENARIO_TITLE}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'learner' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'learner' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {isCompleted ? (
        <div className="p-6 bg-white border-t border-slate-200 text-center">
          <Award className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Scenario Completed!</h2>
          <Button onClick={handleRetry} className="w-full flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      ) : (
        <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your reply..."
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} className="p-3 bg-blue-600 text-white rounded-xl cursor-pointer">
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
