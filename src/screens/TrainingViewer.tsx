import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '../lib/router';

export const TrainingViewerScreen: React.FC = () => {
  const { currentRoute, navigate } = useRouter();
  const { url, title, returnTo, backTo, roleId, skillId } = currentRoute.params || {};

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-slate-100 shadow-2xs">
        <button
          onClick={() => navigate(returnTo || backTo || 'practical-training', { roleId, skillId })}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900 truncate">
          {title || 'Training Document'}
        </h1>
      </div>
      
      {/* iframe */}
      <div className="flex-1 w-full bg-white">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
        />
      </div>
    </div>
  );
};
