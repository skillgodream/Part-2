import { Message } from '../types';

export type ConversationState = {
  scenario: string;
  mainTopic: string;
  currentLearningObjective: string;
  knownFacts: string[];
  answeredIntents: string[];
  recentQuestions: string[];
  learnerMistakes: string[];
  conversationHistory: Message[];
  completedObjectives: string[];
};

export const chatWithAI = async (
  message: string,
  conversationState: ConversationState
) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationState }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to communicate with AI');
  }
  
  return await response.json();
};
