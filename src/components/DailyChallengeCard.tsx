import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import questions from '../data/englishQuestions.json';

interface ChallengeCardProps {
  onChallengeComplete?: (isCorrect: boolean) => void;
  variant?: 'default' | 'compact';
}

export function DailyChallengeCard({ onChallengeComplete, variant = 'default' }: ChallengeCardProps) {
  const [status, setStatus] = useState<'pending' | 'correct' | 'incorrect'>('pending');
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (status === 'correct' || status === 'incorrect') {
      const duration = status === 'incorrect' ? 300000 : 5000;
      const timer = setTimeout(() => {
        setStatus('pending');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleOpen = () => {
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
    setIsOpen(true);
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'correct': return 'border-green-500 bg-green-100';
      case 'incorrect': return 'border-red-500 bg-red-100';
      default: return 'border-slate-100 bg-white';
    }
  };

  if (variant === 'compact') {
      return (
        <>
          <div
            onClick={handleOpen}
            className="relative p-0.5 rounded-[12px] cursor-pointer flex items-center justify-center w-20 h-10 overflow-hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute -inset-[200%] rounded-[12px] bg-[conic-gradient(from_0deg,transparent_320deg,#a855f7_360deg)]"
            />
            <div className={`relative w-full h-full rounded-[10px] shadow-sm border-2 flex items-center justify-center transition-all duration-300 ${getStatusStyles()}`}>
               <span className="text-[10px] font-bold text-purple-600">{points} pts</span>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <QuestionModal
                question={currentQuestion}
                onClose={() => setIsOpen(false)}
                onAnswer={(isCorrect) => {
                  setStatus(isCorrect ? 'correct' : 'incorrect');
                  if (isCorrect) setPoints(p => p + 1);
                  onChallengeComplete?.(isCorrect);
                  setIsOpen(false);
                }}
              />
            )}
          </AnimatePresence>
        </>
      )
  }

  return (
    <>
      <div
        onClick={handleOpen}
        className="relative p-1 rounded-[24px] cursor-pointer"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute -inset-1 rounded-[24px] bg-[conic-gradient(from_0deg,transparent_320deg,#10b981_360deg)]"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center p-3 rounded-[20px] shadow-sm border-2 w-16 h-16 transition-all duration-300 ${getStatusStyles()}`}
        >
          <span className="text-xl font-bold text-purple-600">{points}</span>
        </motion.div>
        <span className="text-[10px] font-semibold text-purple-600 tracking-tight uppercase mt-1">Challenge</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <QuestionModal
            question={currentQuestion}
            onClose={() => setIsOpen(false)}
            onAnswer={(isCorrect) => {
              setStatus(isCorrect ? 'correct' : 'incorrect');
              if (isCorrect) setPoints(p => p + 1);
              onChallengeComplete?.(isCorrect);
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function QuestionModal({ question, onClose, onAnswer }: { question: any, onClose: () => void, onAnswer: (isCorrect: boolean) => void }) {
  const [input, setInput] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <p className="text-lg font-medium text-slate-800 mb-4">{question.sentence.replace('____', '______')}</p>
        <input 
          autoFocus
          className="w-full p-3 border-2 border-slate-200 rounded-xl mb-4 focus:border-purple-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
        />
        <button 
          onClick={() => onAnswer(input.toLowerCase().trim() === question.answer.toLowerCase())}
          className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          Submit
        </button>
      </motion.div>
    </motion.div>
  );
}
