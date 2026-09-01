import React from 'react';
import { Play } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  onClick: () => void;
}

export function LearningVideoCard({ title, description, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{title}</h2>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
      <div className="bg-white/20 p-4 rounded-2xl">
        <Play className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}
