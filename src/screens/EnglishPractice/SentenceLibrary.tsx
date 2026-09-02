import React, { useState } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { sentences } from '../../data/englishPractice';
import { ArrowLeft, Search, Volume2, ArrowRight, BookOpen } from 'lucide-react';

export const SentenceLibrary: React.FC = () => {
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'workplace' | 'daily_routine' | 'all'>('all');

  const filtered = sentences.filter(i => 
    (filter === 'all' || i.category === filter) &&
    (i.english.toLowerCase().includes(search.toLowerCase()) || i.hindi.includes(search))
  );

  const playAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-4 sm:p-6 text-white pb-24 font-sans">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('english-practice-home')} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-indigo-100 font-bold text-xs transition-all backdrop-blur-md border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <span className="text-xs font-bold text-teal-300 bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> {filtered.length} Patterns
        </span>
      </div>

      <header className="mb-4">
        <h1 className="text-2xl font-black">Sentence Library</h1>
        <p className="text-xs text-indigo-200 mt-0.5">Learn sentence structures and patterns used in daily operations</p>
      </header>
      
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-indigo-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full bg-white/10 border border-white/15 focus:border-teal-400 pl-10 pr-4 py-2.5 rounded-xl text-white text-xs sm:text-sm outline-none placeholder:text-indigo-300" 
          placeholder="Search phrases in Hindi or English..." 
        />
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'all', label: 'All Patterns' },
          { id: 'workplace', label: '💼 Workplace' },
          { id: 'daily_routine', label: '🏠 Daily Routine' }
        ].map(f => (
          <button 
            key={f.id} 
            onClick={() => setFilter(f.id as any)} 
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f.id ? 'bg-teal-400 text-indigo-950 shadow-sm' : 'bg-white/10 text-indigo-200 hover:bg-white/15'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(item => (
          <GlassCard key={item.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">{item.english}</h3>
                <p className="text-xs text-indigo-200 mt-0.5">{item.hindi}</p>
              </div>
              <button 
                onClick={() => playAudio(item.english)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-teal-300 transition-colors cursor-pointer shrink-0"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <span className="text-[11px] text-teal-300 font-mono bg-teal-950/80 border border-teal-500/30 px-2.5 py-1 rounded-lg">
                {item.pattern}
              </span>
              <button 
                onClick={() => navigate('english-practice-translate')} 
                className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Practice</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
