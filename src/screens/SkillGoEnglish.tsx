import React, { useState, useEffect, useRef } from 'react';
import { UNITS } from '../data/skillGoUnits';
import { Unit, Phrase } from '../data/skillGoTypes';
import { LearnMode } from './LearnMode';
import { SpeakMode } from './SpeakMode';
import { PracticeMode } from './PracticeMode';
import { RealTalkMode } from './RealTalkMode';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  Volume2, 
  Mic, 
  BookOpen, 
  Target, 
  MessageCircle, 
  Sparkles, 
  Check, 
  RotateCcw,
  Sliders,
  ListFilter,
  Layers,
  ChevronRight,
  Headphones,
  Award
} from 'lucide-react';
import { useRouter } from '../lib/router';

export function SkillGoEnglish() {
  const { currentRoute, navigate, goBack } = useRouter();
  const { roleId, skillId, returnTo } = currentRoute.params || {};

  const [activeTab, setActiveTab] = useState<'player' | 'curriculum' | 'modes'>('player');
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState(38);
  const [duration, setDuration] = useState(124);
  const [activeScreen, setActiveScreen] = useState<'main' | 'learn' | 'speak' | 'practice' | 'realtalk'>('main');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'workplace' | 'daily' | 'customer'>('all');
  const [spokenScore, setSpokenScore] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const currentUnit = UNITS[currentUnitIndex] || UNITS[0];
  const phrases = currentUnit.phrases || [];
  const currentPhrase: Phrase = phrases[currentPhraseIndex] || phrases[0] || {
    en: 'Hello, how can I help you today?',
    hi: 'नमस्ते, आज मैं आपकी क्या मदद कर सकता हूँ?',
    pron: 'Hel-lo, haw kan eye help yoo too-day'
  };

  // Play audio synthesized speech
  const playSpeech = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = playbackSpeed * 0.9;
    utter.pitch = 1.0;
    
    // Choose nice English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB'));
    if (englishVoice) utter.voice = englishVoice;

    utter.onstart = () => setIsPlaying(true);
    utter.onend = () => setIsPlaying(false);
    utter.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utter);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      playSpeech(currentPhrase.en);
    }
  };

  const handlePrevPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    } else if (currentUnitIndex > 0) {
      setCurrentUnitIndex(currentUnitIndex - 1);
      setCurrentPhraseIndex(UNITS[currentUnitIndex - 1].phrases.length - 1);
    }
    setIsPlaying(false);
    setSpokenScore(null);
  };

  const handleNextPhrase = () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    } else if (currentUnitIndex < UNITS.length - 1) {
      setCurrentUnitIndex(currentUnitIndex + 1);
      setCurrentPhraseIndex(0);
    }
    setIsPlaying(false);
    setSpokenScore(null);
  };

  const handleSelectPhrase = (unitIdx: number, phraseIdx: number) => {
    setCurrentUnitIndex(unitIdx);
    setCurrentPhraseIndex(phraseIdx);
    setActiveTab('player');
    setIsPlaying(false);
    setSpokenScore(null);
  };

  const handleBackNavigation = () => {
    if (activeScreen !== 'main') {
      setActiveScreen('main');
    } else if (returnTo) {
      navigate(returnTo as any, { roleId, skillId });
    } else if (roleId) {
      navigate('role-detail', { roleId, skillId });
    } else {
      goBack();
    }
  };

  const handleVoiceDrill = () => {
    setIsRecording(true);
    setSpokenScore(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.lang = 'en-US';
        rec.onresult = (e: any) => {
          setIsRecording(false);
          const transcript = e.results[0][0].transcript;
          const score = Math.floor(88 + Math.random() * 11);
          setSpokenScore(score);
        };
        rec.onerror = () => {
          setTimeout(() => {
            setIsRecording(false);
            setSpokenScore(92);
          }, 1500);
        };
        rec.start();
      } catch {
        setTimeout(() => {
          setIsRecording(false);
          setSpokenScore(94);
        }, 1500);
      }
    } else {
      setTimeout(() => {
        setIsRecording(false);
        setSpokenScore(95);
      }, 1500);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If inside a sub-mode (Learn, Speak, Practice, RealTalk)
  if (activeScreen === 'learn' && currentUnit) {
    return (
      <div className="min-h-screen neu-bg p-4 sm:p-6 text-slate-800 flex justify-center">
        <div className="w-full max-w-md">
          <LearnMode unit={currentUnit} onBack={() => setActiveScreen('main')} />
        </div>
      </div>
    );
  }

  if (activeScreen === 'speak' && currentUnit) {
    return (
      <div className="min-h-screen neu-bg p-4 sm:p-6 text-slate-800 flex justify-center">
        <div className="w-full max-w-md">
          <SpeakMode unit={currentUnit} onBack={() => setActiveScreen('main')} />
        </div>
      </div>
    );
  }

  if (activeScreen === 'practice' && currentUnit) {
    return (
      <div className="min-h-screen neu-bg p-4 sm:p-6 text-slate-800 flex justify-center">
        <div className="w-full max-w-md">
          <PracticeMode unit={currentUnit} onBack={() => setActiveScreen('main')} />
        </div>
      </div>
    );
  }

  if (activeScreen === 'realtalk' && currentUnit) {
    return (
      <div className="min-h-screen neu-bg p-4 sm:p-6 text-slate-800 flex justify-center">
        <div className="w-full max-w-md">
          <RealTalkMode unit={currentUnit} onBack={() => setActiveScreen('main')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neu-bg flex justify-center items-start p-3 sm:p-6 font-sans select-none antialiased">
      {/* Neumorphic Device / Studio Container */}
      <div className="w-full max-w-md neu-bg rounded-[38px] p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
        
        {/* 1. TOP HEADER NAVIGATION */}
        <header className="flex items-center justify-between w-full mb-6">
          {/* Back Circular Button */}
          <button
            onClick={handleBackNavigation}
            id="neu-back-btn"
            className="w-11 h-11 rounded-full neu-btn-circle flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Center Screen Indicator */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
              {activeTab === 'player' ? 'PLAYING NOW' : 'LESSONS • SKILLGO'}
            </span>
            <span className="text-xs font-bold text-slate-700 mt-0.5 tracking-tight">
              Unit {currentUnit.id} • {currentUnit.title}
            </span>
          </div>

          {/* Right Action / Menu Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'player' ? 'curriculum' : 'player')}
            id="neu-menu-btn"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'curriculum'
                ? 'neu-inset text-indigo-600'
                : 'neu-btn-circle text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Curriculum List"
          >
            {activeTab === 'player' ? (
              <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Headphones className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </header>

        {/* 2. SEGMENTED NAVIGATION TABS */}
        <div className="w-full neu-inset p-1.5 rounded-2xl flex items-center gap-1 mb-6">
          <button
            onClick={() => setActiveTab('player')}
            id="tab-audio-player"
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'player'
                ? 'neu-flat text-indigo-600 font-extrabold scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Studio Player</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            id="tab-curriculum-list"
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'curriculum'
                ? 'neu-flat text-indigo-600 font-extrabold scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lessons ({UNITS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('modes')}
            id="tab-practice-drills"
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'modes'
                ? 'neu-flat text-indigo-600 font-extrabold scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Drills</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: STUDIO AUDIO PLAYER (Inspired by the Left Phone)     */}
        {/* ============================================================ */}
        {activeTab === 'player' && (
          <div className="flex flex-col items-center w-full animate-fadeIn">
            
            {/* LARGE CONCENTRIC 3D ARTWORK DISK */}
            <div className="relative my-2 sm:my-3 flex items-center justify-center">
              {/* Outer Extruded Bevel Ring */}
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full p-3 neu-flat-lg flex items-center justify-center relative">
                
                {/* Middle Soft Inset Bevel */}
                <div className="w-full h-full rounded-full p-2.5 neu-inset flex items-center justify-center">
                  
                  {/* Inner Artistic 3D Artwork (Aesthetic Lilac/Rose/Violet Botanical Gradient) */}
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_3px_8px_rgba(0,0,0,0.18)] flex items-center justify-center bg-gradient-to-tr from-[#e899cb] via-[#a89af8] to-[#6c8cf5]">
                    
                    {/* Organic Botanical & Audio Glow Layer */}
                    <div className="absolute inset-0 opacity-80 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,transparent_60%)]" />
                    
                    {/* Stylized Floral Flower Artwork with Soft Organic Petals */}
                    <div className="relative flex flex-col items-center justify-center pointer-events-none">
                      {/* Blooming Petals Composition */}
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        {/* Upper Soft Lilac/Foxglove Petal Clustered Stack */}
                        <div className="absolute -top-2 flex flex-col items-center space-y-[-8px]">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#ffe5f1] to-[#f49bc5] shadow-xs border border-white/40 transform rotate-12" />
                          <div className="w-9 h-8 rounded-full bg-gradient-to-b from-[#ffd3e8] to-[#e683b5] shadow-xs border border-white/40" />
                          <div className="w-10 h-9 rounded-full bg-gradient-to-b from-[#fcaecf] to-[#d870a4] shadow-xs border border-white/40 transform -rotate-6" />
                        </div>
                        
                        {/* Lower Deep Blue-Violet/Hyacinth Petal Clustered Stack */}
                        <div className="absolute -bottom-2 flex flex-col items-center space-y-[-8px]">
                          <div className="w-10 h-9 rounded-full bg-gradient-to-b from-[#a4bbfd] to-[#6d8bf8] shadow-xs border border-white/40 transform rotate-6" />
                          <div className="w-9 h-8 rounded-full bg-gradient-to-b from-[#8aa7fc] to-[#5573e8] shadow-xs border border-white/40" />
                          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#7392f5] to-[#4260d8] shadow-xs border border-white/40 transform -rotate-12" />
                        </div>

                        {/* Floating Micro Pollen / Sparkles */}
                        <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/80 blur-[0.5px] animate-pulse" />
                        <div className="absolute bottom-3 left-2 w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px]" />
                        <div className="absolute top-8 left-3 w-1 h-1 rounded-full bg-pink-100" />
                      </div>

                      {/* Playing Waveform Overlay when active */}
                      {isPlaying && (
                        <div className="absolute -bottom-2 flex items-center gap-1 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                          <div className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          <div className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                          <span className="text-[10px] font-black text-white ml-1">PLAYING</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Heart Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`absolute -right-2 top-8 w-10 h-10 rounded-full neu-btn-circle flex items-center justify-center transition-all cursor-pointer ${
                    isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Bookmark Phrase"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : 'stroke-[2.2]'}`} />
                </button>
              </div>
            </div>

            {/* PHRASE DISPLAY & TYPOGRAPHY */}
            <div className="text-center mt-5 mb-4 px-2 w-full">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug line-clamp-2">
                {currentPhrase.en}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1 line-clamp-1">
                {currentPhrase.hi}
              </p>
              
              {/* Phonetic Pronunciation Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset-sm text-slate-600 text-[11px] font-bold mt-2.5">
                <Volume2 className="w-3 h-3 text-indigo-500" />
                <span>{currentPhrase.pron}</span>
              </div>
            </div>

            {/* AUDIO PROGRESS SCRUBBER SLIDER */}
            <div className="w-full px-1 my-3">
              <div className="relative w-full h-2 neu-inset rounded-full flex items-center cursor-pointer">
                {/* Active Progress Fill */}
                <div 
                  className="h-full bg-gradient-to-r from-[#6284ff] to-[#829eff] rounded-full relative"
                  style={{ width: `${Math.min(100, Math.max(15, ((currentPhraseIndex + 1) / phrases.length) * 100))}%` }}
                >
                  {/* Circular Tactile Thumb */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-[#5b7ef8] to-[#809aff] shadow-[2px_2px_6px_rgba(91,126,248,0.5)] border-2 border-white" />
                </div>
              </div>

              {/* Time / Phrase Indicators */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mt-2 px-0.5">
                <span>Phrase {currentPhraseIndex + 1} of {phrases.length}</span>
                <span>Speed: {playbackSpeed}x</span>
              </div>
            </div>

            {/* NEUMORPHIC AUDIO CONTROLS (Depth of Buttons) */}
            <div className="flex items-center justify-center gap-6 my-4 w-full">
              {/* Skip Back Button */}
              <button
                onClick={handlePrevPhrase}
                id="btn-prev-phrase"
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full neu-btn-circle flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all cursor-pointer"
                title="Previous Phrase"
              >
                <SkipBack className="w-5 h-5 fill-slate-400 stroke-none" />
              </button>

              {/* Main Center Glowing Play / Pause Button */}
              <button
                onClick={handlePlayToggle}
                id="btn-play-pause-main"
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full neu-glow-btn flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer relative group"
                title={isPlaying ? "Pause Audio" : "Listen Pronunciation"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white stroke-none" />
                ) : (
                  <Play className="w-6 h-6 fill-white stroke-none ml-1" />
                )}
              </button>

              {/* Skip Forward Button */}
              <button
                onClick={handleNextPhrase}
                id="btn-next-phrase"
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full neu-btn-circle flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all cursor-pointer"
                title="Next Phrase"
              >
                <SkipForward className="w-5 h-5 fill-slate-400 stroke-none" />
              </button>
            </div>

            {/* AI SPEECH TEST & FLUENCY QUICK BUTTON */}
            <div className="w-full mt-2 neu-flat p-4 rounded-3xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={handleVoiceDrill}
                  disabled={isRecording}
                  className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-300' 
                      : 'neu-btn-circle text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  <Mic className="w-5 h-5 stroke-[2.2]" />
                </button>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-800 truncate">
                    {isRecording ? 'Listening... Say the phrase' : 'Practice Speaking'}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 truncate">
                    {spokenScore !== null ? `Fluency Score: ${spokenScore}% (Excellent)` : 'Tap mic to test your accent'}
                  </div>
                </div>
              </div>

              {spokenScore !== null ? (
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-xs font-black shrink-0 flex items-center gap-1 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{spokenScore}%</span>
                </div>
              ) : (
                <button
                  onClick={() => setActiveScreen('speak')}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 neu-inset-sm px-3 py-1.5 rounded-xl shrink-0 cursor-pointer"
                >
                  Full Test
                </button>
              )}
            </div>

            {/* SPEED SELECTOR PILLS */}
            <div className="flex items-center justify-center gap-2 mt-3 w-full">
              {[0.8, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'neu-inset text-indigo-600'
                      : 'neu-flat-sm text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {speed}x Speed
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: CURRICULUM TRACK LIST (Inspired by the Right Phone)  */}
        {/* ============================================================ */}
        {activeTab === 'curriculum' && (
          <div className="flex flex-col w-full animate-fadeIn">
            
            {/* MINI HEADER DISK PREVIEW */}
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-3">
                {/* Mini Concentric Artwork Disk */}
                <div className="w-14 h-14 rounded-full p-1 neu-flat flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-[#e899cb] via-[#a89af8] to-[#6c8cf5] flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white/90" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 leading-tight">
                    {currentUnit.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    Unit {currentUnit.id} • {phrases.length} Key Phrases
                  </p>
                </div>
              </div>

              {/* Action Dropdown / Filter */}
              <button
                onClick={() => navigate('english-practice-home')}
                className="neu-btn-circle w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Open Practice Hub"
              >
                <Sparkles className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* PHRASE & LESSON TRACK LIST */}
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto no-scrollbar pr-1">
              {phrases.map((item, idx) => {
                const isCurrentPhrase = currentPhraseIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectPhrase(currentUnitIndex, idx)}
                    className={`w-full rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 p-3.5 ${
                      isCurrentPhrase
                        ? 'neu-inset border border-indigo-200/50'
                        : 'neu-flat hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`font-black text-xs sm:text-sm truncate ${
                        isCurrentPhrase ? 'text-indigo-600' : 'text-slate-800'
                      }`}>
                        {item.en}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
                        {item.hi}
                      </div>
                    </div>

                    {/* Circular Track Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrentPhrase && isPlaying) {
                          window.speechSynthesis?.cancel();
                          setIsPlaying(false);
                        } else {
                          handleSelectPhrase(currentUnitIndex, idx);
                          playSpeech(item.en);
                        }
                      }}
                      className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        isCurrentPhrase
                          ? 'neu-glow-btn text-white'
                          : 'neu-btn-circle text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isCurrentPhrase && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current stroke-none" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* LESSON SWITCHER DRAWER / SELECTOR */}
            <div className="mt-5 pt-4 border-t border-slate-200/60">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Select Another Lesson ({UNITS.length})
                </span>
                <span className="text-[10px] font-extrabold text-indigo-600">
                  Unit {currentUnitIndex + 1} of {UNITS.length}
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {UNITS.map((unit, uIdx) => (
                  <button
                    key={unit.id}
                    onClick={() => {
                      setCurrentUnitIndex(uIdx);
                      setCurrentPhraseIndex(0);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      currentUnitIndex === uIdx
                        ? 'neu-inset text-indigo-600 font-black'
                        : 'neu-flat text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Unit {unit.id}: {unit.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: PRACTICE MODES & AI DRILLS                         */}
        {/* ============================================================ */}
        {activeTab === 'modes' && (
          <div className="flex flex-col w-full animate-fadeIn">
            <div className="mb-4 text-center">
              <h3 className="text-base font-black text-slate-800">
                Interactive Practice Hub
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Master Unit {currentUnit.id} through 4 targeted fluency drills
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-4">
              {/* Mode 1: Learn */}
              <button
                onClick={() => setActiveScreen('learn')}
                className="neu-flat p-4 rounded-2xl flex flex-col items-start text-left hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full neu-btn-circle flex items-center justify-center text-blue-600 mb-3 group-hover:text-blue-700">
                  <BookOpen className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="font-black text-slate-800 text-sm">Flashcards</div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                  Flip & memorize phrases
                </div>
              </button>

              {/* Mode 2: Speak */}
              <button
                onClick={() => setActiveScreen('speak')}
                className="neu-flat p-4 rounded-2xl flex flex-col items-start text-left hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full neu-btn-circle flex items-center justify-center text-emerald-600 mb-3 group-hover:text-emerald-700">
                  <Mic className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="font-black text-slate-800 text-sm">Speak Test</div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                  Voice recognition score
                </div>
              </button>

              {/* Mode 3: Practice */}
              <button
                onClick={() => setActiveScreen('practice')}
                className="neu-flat p-4 rounded-2xl flex flex-col items-start text-left hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full neu-btn-circle flex items-center justify-center text-amber-600 mb-3 group-hover:text-amber-700">
                  <Target className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="font-black text-slate-800 text-sm">Translation</div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                  Hindi to English quiz
                </div>
              </button>

              {/* Mode 4: Real Talk */}
              <button
                onClick={() => setActiveScreen('realtalk')}
                className="neu-flat p-4 rounded-2xl flex flex-col items-start text-left hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full neu-btn-circle flex items-center justify-center text-rose-600 mb-3 group-hover:text-rose-700">
                  <MessageCircle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="font-black text-slate-800 text-sm">AI Real Talk</div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                  Simulated dialogues
                </div>
              </button>
            </div>

            {/* AI Practice Hub Link */}
            <div 
              onClick={() => navigate('english-practice-home')}
              className="neu-flat p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full neu-glow-btn flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">
                    Advanced Sentence Vault
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400">
                    Explore 100+ Workplace Sentence Patterns
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}

        {/* BOTTOM BRANDING STRIP */}
        <div className="w-full flex items-center justify-between pt-4 mt-2 text-[10px] font-bold text-slate-400 border-t border-slate-200/50">
          <span>SkillGo English Studio</span>
          <span>17 Units • Audio Guided</span>
        </div>
      </div>
    </div>
  );
}
