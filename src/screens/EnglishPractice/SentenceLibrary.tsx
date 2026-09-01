import React, { useState } from 'react';
import { GlassCard } from '../../components/EnglishPractice/GlassCard';
import { useRouter } from '../../lib/router';
import { sentences } from '../../data/englishPractice';
import { ArrowLeft, Search } from 'lucide-react';

export const SentenceLibrary: React.FC = () => {
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'workplace' | 'daily_routine' | 'all'>('all');

  const filtered = sentences.filter(i => 
    (filter === 'all' || i.category === filter) &&
    (i.english.toLowerCase().includes(search.toLowerCase()) || i.hindi.includes(search))
  );

  return (
    <div className="min-h-screen bg-indigo-950 p-6 pt-10 text-white">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('english-practice-home')} className="text-indigo-200">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Sentence Library</h1>
        </div>
        
        <div className="flex gap-2 mb-6">
            <input value={search} onChange={e => setSearch(e.target.value)} className="flex-grow bg-white/10 p-3 rounded-xl" placeholder="Search sentences..." />
        </div>
        <div className="flex gap-2 mb-6">
            {['all', 'workplace', 'daily_routine'].map(f => (
                <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-full ${filter === f ? 'bg-teal-500' : 'bg-white/10'}`}>{f.toUpperCase()}</button>
            ))}
        </div>

      {filtered.map(item => (
        <GlassCard key={item.id} className="mb-4">
            <h3 className="font-bold text-lg">{item.english}</h3>
            <p className="text-indigo-200 mb-2">{item.hindi}</p>
            <p className="text-xs text-teal-400 font-mono bg-black/20 p-2 rounded">{item.pattern}</p>
            <button onClick={() => navigate('english-practice-translate')} className="mt-4 text-xs bg-white text-indigo-900 px-3 py-1 rounded-full">Practice this</button>
        </GlassCard>
      ))}
    </div>
  );
};
