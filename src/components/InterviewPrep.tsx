import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { enrollmentStore } from '../lib/enrollmentStore';
import { 
  QUESTIONS, 
  STRUCTURES, 
  PROFILE_FIELDS, 
  answerFor, 
  structureChecklist,
  QuestionDef 
} from '../lib/interviewData';
import { useRouter } from '../lib/router';
import { JOB_ROLES } from '../lib/catalog';
import './InterviewPrep.css';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Mic, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Star, 
  User, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  Layers, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  ArrowRight,
  Plus,
  BarChart3,
  MapPin,
  Settings,
  ShieldCheck,
  FileText
} from 'lucide-react';

const STORAGE_KEY = 'skillgo_interview_prep_v1';

function loadStoredData(uid: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const userStore = parsed[uid] || {};
      const rawLearned: number[] = (userStore.learnedSet || []).map((x: any) => Number(x));
      return {
        profile: userStore.profile || {},
        learnedSet: new Set<number>(rawLearned),
        scores: userStore.scores || {}
      };
    }
  } catch (e) {
    console.error('Failed to load local interview prep data:', e);
  }
  return { profile: {}, learnedSet: new Set<number>(), scores: {} };
}

function saveStoredData(uid: string, data: { profile: any; learnedSet: Set<number>; scores: any }) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[uid] = {
      profile: data.profile,
      learnedSet: Array.from(data.learnedSet),
      scores: data.scores
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to save local interview prep data:', e);
  }
}

const REQUIRED_KEYS = PROFILE_FIELDS.flatMap(sec => sec.fields.filter(f => f.required).map(f => f.key));

function camelToSnake(k: string) {
  return k.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
}

function computeReadiness(learnedSet: Set<number>, scores: Record<number, any>) {
  const total = QUESTIONS.length;
  const attempted = Object.keys(scores).length;
  const avg = attempted > 0 
    ? (Object.values(scores).reduce((s: number, r: any) => s + (Number(r.overall) || 0), 0) as number) / attempted 
    : 0;
  const learnPct = learnedSet.size / total;
  const practicePct = (attempted / total) * (avg / 10);
  return Math.min(100, Math.round((learnPct * 0.4 + practicePct * 0.6) * 100));
}

export function InterviewPrep() {
  const { navigate, currentRoute } = useRouter();
  const roleId = currentRoute.params?.roleId;
  const role = JOB_ROLES.find(r => r.id === roleId);

  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const [profile, setProfile] = useState<Record<string, any>>({});
  const [learnedSet, setLearnedSet] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<Record<number, any>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'learn' | 'practice' | 'progress' | 'profile'>('overview');
  const [openCard, setOpenCard] = useState<number | null>(1);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [micWarning, setMicWarning] = useState<string>('');
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const resumeIntervalRef = useRef<any>(null);
  const stuckTimerRef = useRef<any>(null);

  // Auth + initial data load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      let uid = session?.user?.id;
      if (!uid) {
        const p = enrollmentStore.getProfile();
        if (p && p.id) {
          uid = p.id;
        }
      }
      if (!uid) {
        uid = 'guest-learner';
      }
      setUserId(uid);
      const stored = loadStoredData(uid);
      setProfile(stored.profile);
      setLearnedSet(stored.learnedSet);
      setScores(stored.scores);
      setLoadingUser(false);
    });
  }, []);

  const missingRequired = () => {
    const missing: string[] = [];
    if (!profile.has_experience) missing.push('Whether you have work experience');
    REQUIRED_KEYS.forEach(key => {
      const dbKey = camelToSnake(key);
      if (!(profile[dbKey] || '').toString().trim()) {
        const field = PROFILE_FIELDS.flatMap(s => s.fields).find(f => f.key === key);
        if (field) missing.push(field.label);
      }
    });
    return missing;
  };

  async function saveProfile(formValues: Record<string, any>) {
    if (!userId) return;
    const row = { ...formValues, updated_at: new Date().toISOString() };
    setProfile(row);
    saveStoredData(userId, { profile: row, learnedSet, scores });
  }

  async function toggleLearned(qid: number) {
    if (!userId) return;
    const next = new Set<number>(learnedSet);
    if (next.has(qid)) {
      next.delete(qid);
    } else {
      next.add(qid);
    }
    setLearnedSet(next);
    saveStoredData(userId, { profile, learnedSet: next, scores });
  }

  // Text-to-speech with audio state indicator
  function speak(text: string, btnKey: string) {
    if (!('speechSynthesis' in window)) {
      alert('Voice playback is not supported on this browser.');
      return;
    }
    const synth = window.speechSynthesis;
    const wasThisPlaying = synth.speaking && playingKey === btnKey;
    synth.cancel();
    if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
    setPlayingKey(null);
    if (wasThisPlaying) return;

    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.92;
      setPlayingKey(btnKey);
      utter.onend = () => { setPlayingKey(null); };
      utter.onerror = () => { setPlayingKey(null); };
      synth.speak(utter);
      resumeIntervalRef.current = setInterval(() => {
        if (synth.speaking) { synth.pause(); synth.resume(); }
        else { clearInterval(resumeIntervalRef.current); }
      }, 4000);
    }, 80);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
    setPlayingKey(null);
  }

  // Speech recognition
  useEffect(() => {
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) {
      setMicWarning('Voice recording is optimized on Chrome. You can also type or edit your answer directly.');
      return;
    }
    try {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        if (stuckTimerRef.current) { clearTimeout(stuckTimerRef.current); stuckTimerRef.current = null; }
        let interim = '', final = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
          else interim += event.results[i][0].transcript;
        }
        finalTranscriptRef.current = final.trim();
        setTranscript((final + interim).trim() || '...');
      };
      const msgs: Record<string, string> = {
        'not-allowed': "Microphone permission blocked. Please allow mic access in your browser or type your answer.",
        'audio-capture': 'No microphone detected on your device. You can type your answer below.',
        network: 'Network connection issue with speech recognition. Typing is supported anytime.',
        'service-not-allowed': "Voice recognition unavailable. You can type your answer below.",
        'no-speech': 'No speech heard — tap the microphone button and speak clearly.'
      };
      rec.onerror = (e: any) => {
        setMicWarning(msgs[e.error] || `Mic notice (${e.error}) — feel free to type your answer.`);
        setIsRecording(false);
      };
      rec.onend = () => setIsRecording(prev => { if (prev) return false; return prev; });
      recognitionRef.current = rec;
    } catch (e) {
      // Speech recognition fallback
    }
  }, []);

  function startRecording() {
    const rec = recognitionRef.current;
    if (!rec) {
      setMicWarning('Browser voice recognition not ready. Please type your response directly below.');
      return;
    }
    stopSpeech();
    finalTranscriptRef.current = '';
    setTranscript('Listening... Speak now.');
    setMicWarning('');
    setIsRecording(true);
    try {
      rec.start();
    } catch (e) {
      setMicWarning('Could not start recording. You can type your answer instead.');
      setIsRecording(false);
      return;
    }
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    stuckTimerRef.current = setTimeout(() => {
      if (finalTranscriptRef.current.trim().length === 0) {
        try { rec.stop(); } catch (e) {}
        setIsRecording(false);
        setMicWarning('No voice input detected. Feel free to tap and type your answer below.');
        setTranscript('');
      }
    }, 7000);
  }

  function stopRecording() {
    if (stuckTimerRef.current) { clearTimeout(stuckTimerRef.current); stuckTimerRef.current = null; }
    setIsRecording(false);
    try { recognitionRef.current && recognitionRef.current.stop(); } catch (e) {}
  }

  // Self-assessment saving
  async function saveSelfAssessment(checkedItems: string[], confidenceRating: number, note: string) {
    const q = QUESTIONS[currentQIdx];
    const answerText = (finalTranscriptRef.current || transcript).trim();
    const totalItems = structureChecklist(q.cat).length;
    const completeness = totalItems > 0 ? Math.round((checkedItems.length / totalItems) * 10) : 0;
    const confidence = Math.round((confidenceRating || 0) * 2);

    const record = {
      accuracy: completeness,
      completeness,
      fluency: confidence,
      overall: Math.round((completeness + confidence) / 2),
      feedback: note || '',
      transcript: answerText,
      created_at: new Date().toISOString()
    };

    const nextScores = { ...scores, [q.id]: record };
    setScores(nextScores);

    if (userId) {
      saveStoredData(userId, { profile, learnedSet, scores: nextScores });
    }
  }

  function profileForFill() {
    const learnerProfile = enrollmentStore.getProfile();
    const out: Record<string, any> = {
      name: learnerProfile.name || 'Candidate',
      city: learnerProfile.city || 'Bangalore',
      education: learnerProfile.education || 'Graduate'
    };
    PROFILE_FIELDS.forEach(sec => sec.fields.forEach(f => { out[f.key] = profile[camelToSnake(f.key)] || ''; }));
    out.hasExperience = profile.has_experience || 'no';
    return out;
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#edf7f9] flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4" />
        <p className="text-teal-800 font-semibold text-sm">Loading Interview Prep Studio...</p>
      </div>
    );
  }

  const missing = missingRequired();
  const locked = missing.length > 0;
  const readiness = computeReadiness(learnedSet, scores);
  const learnerData = profileForFill();

  return (
    <div className="min-h-screen bg-[#edf7f9] text-slate-800 font-sans pb-24 selection:bg-teal-500 selection:text-white">
      {/* Top App Header & User Avatar Profile Header (Inspired by reference) */}
      <header className="sticky top-0 z-30 bg-[#edf7f9]/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => {
              const returnTo = currentRoute.params?.returnTo;
              if (returnTo) {
                navigate(returnTo, { roleId });
              } else if (roleId) {
                navigate('role-detail', { roleId });
              } else {
                navigate('my-learning');
              }
            }}
            className="w-10 h-10 rounded-full ip-neo-button-circle flex items-center justify-center text-teal-800 hover:text-teal-950 transition-all cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center flex-1">
            <h1 className="text-xs font-black uppercase tracking-widest text-teal-900">
              SkillGo Interview Studio
            </h1>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-full ip-neo-button-circle flex items-center justify-center text-teal-800 hover:text-teal-950 transition-all cursor-pointer"
            title="Candidate Profile"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Shaped like Modern Mobile Canvas */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-2 space-y-5">

        {/* Candidate Profile Avatar & Header (Exact match to Reference Mockup) */}
        <div className="flex flex-col items-center justify-center text-center pt-2 pb-1">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#16cbb9] to-[#34ecd9] p-1 shadow-lg shadow-teal-500/25 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-teal-500 flex items-center justify-center overflow-hidden border-2 border-white">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-teal-100">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
            {learnerData.name || 'Candidate Name'}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-700 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            <span>{learnerData.city || 'Bangalore'}</span>
            <span>•</span>
            <span>{role ? role.title : 'Workplace Track'}</span>
          </div>
        </div>

        {/* Segment Tabs Navigation with Clean Active Underline (Matching Mockup 1) */}
        <div className="flex items-center justify-around border-b border-teal-200/60 pb-1 px-2 text-xs font-bold text-slate-500">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'learn', label: 'Questions' },
            { id: 'practice', label: 'Voice Studio' },
            { id: 'progress', label: 'Progress' },
            { id: 'profile', label: 'My Details' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  stopSpeech();
                }}
                className={`relative py-2 px-1 transition-all cursor-pointer ${
                  isActive ? 'text-teal-900 font-black' : 'hover:text-teal-700'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {locked ? (
          <ProfileForm
            profile={profile}
            missing={missing}
            onSave={saveProfile}
            landing={true}
          />
        ) : (
          <>
            {/* VIEW 1: OVERVIEW (Main Layout Inspired by Mockup 2 Center Screen) */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 1. Teal Gradient Hero Card (Matching Mockup 2 & Card in Mockup 1) */}
                <div className="ip-teal-card-bg rounded-[26px] p-5 text-white relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="absolute -left-10 -top-10 w-28 h-28 rounded-full bg-teal-300/20 blur-lg pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10 mb-2">
                    <span className="text-xs font-semibold text-teal-100 uppercase tracking-wider">
                      Interview Readiness Score
                    </span>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all cursor-pointer"
                      title="Edit Profile"
                    >
                      <Settings className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
                      <span>{readiness}%</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/25 text-white">
                        {readiness >= 75 ? 'Job Ready' : readiness >= 40 ? 'In Training' : 'Getting Started'}
                      </span>
                    </div>
                    <p className="text-xs text-teal-50 font-medium mt-1">
                      {learnedSet.size} of {QUESTIONS.length} Questions Mastered • {Object.keys(scores).length} Voice Drills
                    </p>
                  </div>
                </div>

                {/* 2. Three Circular Action Buttons (Matching Mockup 2: Plus, Search, Chart) */}
                <div className="flex items-center justify-center gap-6 py-1">
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="w-14 h-14 ip-neo-button-circle flex items-center justify-center text-teal-600 hover:text-teal-700 cursor-pointer"
                    title="Start Voice Drill"
                  >
                    <Plus className="w-7 h-7 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('learn')}
                    className="w-14 h-14 ip-neo-button-circle flex items-center justify-center text-teal-600 hover:text-teal-700 cursor-pointer"
                    title="Search & Browse Questions"
                  >
                    <Search className="w-6 h-6 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('progress')}
                    className="w-14 h-14 ip-neo-button-circle flex items-center justify-center text-teal-600 hover:text-teal-700 cursor-pointer"
                    title="Readiness Stats"
                  >
                    <BarChart3 className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </div>

                {/* 3. Centerpiece Circular Radial Gauge (Matching Mockup 2 middle circular ring) */}
                <div className="flex items-center justify-center py-2">
                  <div className="w-52 h-52 ip-gauge-outer flex flex-col items-center justify-center relative p-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="76"
                        stroke="#e2f5f6"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="76"
                        stroke="url(#tealGradient)"
                        strokeWidth="10"
                        strokeDasharray={477.5}
                        strokeDashoffset={477.5 - (477.5 * readiness) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                      <defs>
                        <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38e1ce" />
                          <stop offset="100%" stopColor="#0ba89b" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-3xl font-black text-slate-800 tracking-tight">
                        {readiness}%
                      </span>
                      <span className="text-[11px] font-bold text-teal-600 mt-0.5">
                        Readiness
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Dual Split Neumorphic Action Cards (Matching Mockup 2 bottom 2 cards with pills) */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="ip-neo-card p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500">Mastered</span>
                      <div className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">
                        {learnedSet.size} / {QUESTIONS.length}
                      </div>
                      <span className="text-[10px] text-teal-600 font-semibold block">Questions</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('learn')}
                      className="w-full py-2 px-3 rounded-full ip-pill-btn text-white text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="ip-neo-card p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500">Voice Drills</span>
                      <div className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">
                        {Object.keys(scores).length} Done
                      </div>
                      <span className="text-[10px] text-teal-600 font-semibold block">Practice Sessions</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('practice')}
                      className="w-full py-2 px-3 rounded-full ip-pill-btn text-white text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Practice</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5. Recent Questions Preview Tiles (Matching Mockup 3 transaction list) */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                      Core Interview Modules
                    </span>
                    <button
                      onClick={() => setActiveTab('learn')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                    >
                      View All 20 →
                    </button>
                  </div>

                  {QUESTIONS.slice(0, 4).map(item => {
                    const isLearned = learnedSet.has(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setOpenCard(item.id);
                          setActiveTab('learn');
                        }}
                        className="ip-neo-card p-3.5 flex items-center justify-between gap-3 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isLearned ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isLearned ? <Check className="w-4 h-4 stroke-[3]" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase text-teal-600">{item.cat}</span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                              {item.q}
                            </h4>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isLearned ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isLearned ? 'Mastered' : `Q${item.id}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 2: QUESTIONS LIST */}
            {activeTab === 'learn' && (
              <LearnList
                learnedSet={learnedSet}
                openCard={openCard}
                setOpenCard={setOpenCard}
                onToggleLearned={toggleLearned}
                onPractice={(idx: number) => {
                  setCurrentQIdx(idx);
                  setActiveTab('practice');
                  stopSpeech();
                }}
                profileForFill={profileForFill}
                speak={speak}
                playingKey={playingKey}
              />
            )}

            {/* VIEW 3: VOICE STUDIO */}
            {activeTab === 'practice' && (
              <PracticePanel
                currentQIdx={currentQIdx}
                setCurrentQIdx={setCurrentQIdx}
                profileForFill={profileForFill}
                transcript={transcript}
                setTranscript={setTranscript}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                micWarning={micWarning}
                saveSelfAssessment={saveSelfAssessment}
                scores={scores}
                speak={speak}
                playingKey={playingKey}
                showModelAnswer={showModelAnswer}
                setShowModelAnswer={setShowModelAnswer}
                finalTranscriptRef={finalTranscriptRef}
              />
            )}

            {/* VIEW 4: PROGRESS & ANALYTICS (Inspired by Mockup 3 Chart & Transaction style) */}
            {activeTab === 'progress' && (
              <ProgressView
                learnedSet={learnedSet}
                scores={scores}
                readiness={readiness}
                onJumpPractice={(idx: number) => {
                  setCurrentQIdx(idx);
                  setActiveTab('practice');
                }}
              />
            )}

            {/* VIEW 5: CANDIDATE PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <ProfileForm
                profile={profile}
                missing={[]}
                onSave={saveProfile}
                landing={false}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-10 text-center text-xs text-teal-800/70 font-medium">
        <span>SkillGo AI Studio • Master 20 Workplace Interview Drills</span>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Learn List (Matching Soft Neumorphic Card Styling)
// -------------------------------------------------------------
function LearnList({
  learnedSet,
  openCard,
  setOpenCard,
  onToggleLearned,
  onPractice,
  profileForFill,
  speak,
  playingKey
}: any) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', ...Array.from(new Set(QUESTIONS.map(q => q.cat)))];

  const filteredQuestions = QUESTIONS.filter(item => {
    const matchCat = selectedCat === 'all' || item.cat === selectedCat;
    const matchSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.cat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Search & Category Pills */}
      <div className="ip-neo-card p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search interview questions or topics..."
            className="w-full bg-[#f1f9fa] border border-teal-100 pl-10 pr-4 py-2.5 rounded-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-400 transition-colors font-medium shadow-inner"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isSel = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'ip-pill-btn text-white shadow-md'
                    : 'bg-[#f1f9fa] text-slate-600 hover:bg-teal-50 hover:text-teal-900 border border-teal-100/60'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-3">
        {filteredQuestions.map((item) => {
          const originalIdx = QUESTIONS.findIndex(q => q.id === item.id);
          const isOpen = openCard === item.id;
          const isLearned = learnedSet.has(item.id);
          const answerText = answerFor(item, profileForFill());
          const flowSteps = structureChecklist(item.cat);
          const isPlayingQ = playingKey === `q${item.id}`;
          const isPlayingA = playingKey === `a${item.id}`;

          return (
            <div
              key={item.id}
              className={`ip-neo-card overflow-hidden transition-all duration-200 ${
                isOpen ? 'ring-2 ring-teal-400/50 shadow-lg' : ''
              }`}
            >
              {/* Question Header Tile */}
              <div
                onClick={() => setOpenCard(isOpen ? null : item.id)}
                className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                    isLearned
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-teal-50 text-teal-700 border border-teal-100'
                  }`}>
                    {String(item.id).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-full">
                        {item.cat}
                      </span>
                      {isLearned && (
                        <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Mastered
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                      {item.q}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => speak(item.q, `q${item.id}`)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isPlayingQ
                        ? 'bg-teal-500 text-white shadow-md animate-pulse'
                        : 'bg-[#f1f9fa] hover:bg-teal-100 text-teal-800 border border-teal-100'
                    }`}
                    title="Listen to question"
                  >
                    {isPlayingQ ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <ChevronRight className={`w-5 h-5 text-teal-600 transition-transform duration-200 ${isOpen ? 'rotate-90 text-teal-800' : ''}`} />
                </div>
              </div>

              {/* Accordion Expanded Content */}
              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-teal-100/60 space-y-3.5 bg-gradient-to-b from-white to-[#f7fcfd]">
                  {/* Flow Strategy Blueprint */}
                  <div className="ip-neo-card-inset p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Recommended Response Structure</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {flowSteps.map((step: string, idx: number) => (
                        <React.Fragment key={idx}>
                          <span className="text-[11px] font-bold bg-white text-slate-700 border border-teal-100 px-2.5 py-1 rounded-full shadow-xs">
                            <span className="text-teal-600 font-extrabold mr-1">{idx + 1}.</span> {step}
                          </span>
                          {idx < flowSteps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-teal-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Model Answer Box */}
                  <div className="ip-neo-card-subtle p-3.5 space-y-2 border-l-4 border-l-teal-500">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-teal-900">
                        Personalized Model Answer
                      </span>
                      <button
                        onClick={() => speak(answerText, `a${item.id}`)}
                        className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                          isPlayingA
                            ? 'bg-teal-500 text-white shadow-md animate-pulse'
                            : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200/80'
                        }`}
                      >
                        {isPlayingA ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isPlayingA ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      {answerText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={() => onToggleLearned(item.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isLearned
                          ? 'bg-teal-100 text-teal-900 hover:bg-teal-200 border border-teal-300/60'
                          : 'bg-[#f1f9fa] text-slate-600 hover:bg-teal-50 border border-teal-100'
                      }`}
                    >
                      {isLearned ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <Circle className="w-4 h-4" />}
                      <span>{isLearned ? 'Mastered' : 'Mark as Mastered'}</span>
                    </button>

                    <button
                      onClick={() => onPractice(originalIdx)}
                      className="px-4 py-2 rounded-full ip-pill-btn text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Practice Drill</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Practice Studio (Voice Studio)
// -------------------------------------------------------------
function PracticePanel({
  currentQIdx,
  setCurrentQIdx,
  profileForFill,
  transcript,
  setTranscript,
  isRecording,
  startRecording,
  stopRecording,
  micWarning,
  saveSelfAssessment,
  scores,
  speak,
  playingKey,
  showModelAnswer,
  setShowModelAnswer,
  finalTranscriptRef
}: any) {
  const q = QUESTIONS[currentQIdx] || QUESTIONS[0];
  const modelAnswer = answerFor(q, profileForFill());
  const record = scores[q.id];
  const checklist = structureChecklist(q.cat);

  const [checked, setChecked] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [showAssess, setShowAssess] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    finalTranscriptRef.current = record ? record.transcript : '';
    setTranscript(record ? record.transcript : '');
    setShowModelAnswer(false);
    setShowAssess(false);
    setChecked([]);
    setConfidence(0);
    setNote('');
    setSaved(false);
  }, [currentQIdx]); // eslint-disable-line

  function toggleCheck(item: string) {
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  async function handleSave() {
    await saveSelfAssessment(checked, confidence, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const isPlayingQ = playingKey === 'practiceQ';
  const isPlayingModel = playingKey === 'practiceModel';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Question Selector Bar */}
      <div className="ip-neo-card p-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentQIdx((currentQIdx - 1 + QUESTIONS.length) % QUESTIONS.length)}
          className="w-9 h-9 rounded-full ip-neo-button-circle flex items-center justify-center text-teal-800 cursor-pointer"
          title="Previous Question"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <select
          value={currentQIdx}
          onChange={(e) => setCurrentQIdx(parseInt(e.target.value))}
          className="flex-1 bg-[#f1f9fa] border border-teal-100 text-slate-800 text-xs sm:text-sm font-bold py-2 px-3 rounded-full outline-none focus:border-teal-400 cursor-pointer shadow-inner text-center"
        >
          {QUESTIONS.map((qq, i) => (
            <option key={qq.id} value={i} className="bg-white text-slate-800">
              Q{qq.id}. {qq.q} ({qq.cat})
            </option>
          ))}
        </select>

        <button
          onClick={() => setCurrentQIdx((currentQIdx + 1) % QUESTIONS.length)}
          className="w-9 h-9 rounded-full ip-neo-button-circle flex items-center justify-center text-teal-800 cursor-pointer"
          title="Next Question"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recruiter Question Hero Card */}
      <div className="ip-neo-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-extrabold text-xs flex items-center justify-center">
              {q.id}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-full">
              {q.cat}
            </span>
          </div>

          <button
            onClick={() => speak(q.q, 'practiceQ')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isPlayingQ
                ? 'bg-teal-500 text-white shadow-md animate-pulse'
                : 'bg-[#f1f9fa] hover:bg-teal-100 text-teal-800 border border-teal-100'
            }`}
          >
            {isPlayingQ ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingQ ? 'Stop' : 'Listen to Recruiter'}</span>
          </button>
        </div>

        <h2 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
          "{q.q}"
        </h2>

        {/* Structure Strategy */}
        <div className="pt-2 border-t border-teal-100/60">
          <div className="text-[10px] font-black uppercase tracking-wider text-teal-700 mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-teal-500" />
            <span>Recommended Structure Flow</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {checklist.map((step: string, idx: number) => (
              <span key={idx} className="text-xs font-semibold bg-[#f1f9fa] text-slate-700 border border-teal-100 px-2.5 py-1 rounded-full">
                <span className="text-teal-600 font-bold">{idx + 1}.</span> {step}
              </span>
            ))}
          </div>
        </div>

        {/* Model Answer Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowModelAnswer((v: boolean) => !v)}
            className="w-full py-2 px-3 rounded-full bg-[#f1f9fa] hover:bg-teal-50 border border-teal-100 text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>{showModelAnswer ? 'Hide Model Answer' : 'View Sample Answer & Listen'}</span>
          </button>

          {showModelAnswer && (
            <div className="mt-2.5 p-3.5 rounded-2xl ip-neo-card-inset space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                  Ideal Script
                </span>
                <button
                  onClick={() => speak(modelAnswer, 'practiceModel')}
                  className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  {isPlayingModel ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlayingModel ? 'Stop' : 'Play'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {modelAnswer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Voice Recording Studio Box */}
      <div className="ip-neo-card p-5 space-y-4 text-center">
        {micWarning && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs font-medium text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{micWarning}</span>
          </div>
        )}

        {/* Large Tactile Microphone Button */}
        <div className="flex flex-col items-center justify-center py-2">
          <button
            onClick={() => (isRecording ? stopRecording() : startRecording())}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all shadow-xl cursor-pointer active:scale-95 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'ip-teal-gradient text-white shadow-teal-500/40'
            }`}
          >
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-sm bg-white mb-1" />
                <span className="text-[9px] font-black uppercase tracking-wider">Stop</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Mic className="w-7 h-7 mb-0.5" />
                <span className="text-[9px] font-black uppercase tracking-wider">Speak</span>
              </div>
            )}
          </button>

          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-3">
            {isRecording ? (
              <span className="text-rose-600 flex items-center justify-center gap-1.5 font-black">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Recording in progress... Speak clearly
              </span>
            ) : (
              'Tap microphone to record your practice answer'
            )}
          </p>
        </div>

        {/* Editable Transcript Box */}
        <div className="text-left space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 px-1">
            <span>Your Spoken Answer (Editable)</span>
            <span>{wordCount} words</span>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => {
              finalTranscriptRef.current = e.target.value;
              setTranscript(e.target.value);
            }}
            rows={3}
            placeholder="Your spoken words will appear here in real-time, or you can tap here to type your answer..."
            className="w-full bg-[#f1f9fa] border border-teal-100 focus:border-teal-400 p-3 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all resize-none font-medium leading-relaxed shadow-inner"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => {
              setTranscript('');
              finalTranscriptRef.current = '';
              setShowAssess(false);
            }}
            disabled={!transcript}
            className="px-4 py-2 rounded-full bg-[#f1f9fa] hover:bg-teal-50 disabled:opacity-30 disabled:pointer-events-none text-slate-600 text-xs font-bold transition-all cursor-pointer border border-teal-100"
          >
            Clear Text
          </button>

          <button
            disabled={!transcript.trim()}
            onClick={() => setShowAssess((v: boolean) => !v)}
            className="flex-1 py-2.5 px-4 rounded-full ip-pill-btn text-white text-xs font-black disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{showAssess ? 'Hide Evaluation' : 'Score & Self-Check Response'}</span>
          </button>
        </div>
      </div>

      {/* Self Assessment Box */}
      {showAssess && (
        <div className="ip-neo-card p-5 space-y-5 border-2 border-teal-400/60 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Step 1: Flow Checklist</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Did your response cover each key element of this interview framework?</p>

            <div className="space-y-2">
              {checklist.map((item: string) => {
                const isChecked = checked.includes(item);
                return (
                  <div
                    key={item}
                    onClick={() => toggleCheck(item)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                      isChecked
                        ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold'
                        : 'bg-[#f1f9fa] border-teal-100 text-slate-600 hover:bg-teal-50/50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-xs">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-800 mb-1">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Step 2: Confidence & Fluency Rating</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">How articulate did you sound?</p>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setConfidence(n)}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    confidence >= n
                      ? 'bg-amber-400 text-white shadow-sm'
                      : 'bg-[#f1f9fa] border border-teal-100 text-slate-400'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold text-amber-600 text-center mt-1.5">
              {confidence === 5 ? '5/5 — Fluent & Interview Ready!' : confidence === 4 ? '4/5 — Very Clear & Strong' : confidence === 3 ? '3/5 — Good Foundation' : confidence === 2 ? '2/5 — Needs More Practice' : confidence === 1 ? '1/5 — Starting Out' : 'Select your rating'}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">Personal Note (Optional)</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., mention specific metric next time..."
              className="w-full bg-[#f1f9fa] border border-teal-100 p-2.5 rounded-full text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-400 shadow-inner px-4"
            />
          </div>

          <button
            disabled={confidence === 0}
            onClick={handleSave}
            className="w-full py-3 rounded-full ip-pill-btn text-white font-black text-xs sm:text-sm shadow-md disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save Assessment to Progress</span>
          </button>

          {saved && (
            <div className="p-2.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold text-center">
              ✓ Successfully saved to your interview progress ledger!
            </div>
          )}
        </div>
      )}

      {/* Latest Score Card */}
      {record && !showAssess && (
        <div className="ip-neo-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-teal-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-900">
              Latest Recorded Score
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {new Date(record.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#f1f9fa] p-3 rounded-2xl border border-teal-100">
              <span className="text-lg font-black text-teal-700">{record.overall}/10</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Overall</span>
            </div>
            <div className="bg-[#f1f9fa] p-3 rounded-2xl border border-teal-100">
              <span className="text-lg font-black text-teal-700">{record.completeness}/10</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Structure</span>
            </div>
            <div className="bg-[#f1f9fa] p-3 rounded-2xl border border-teal-100">
              <span className="text-lg font-black text-teal-700">{record.fluency}/10</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Fluency</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: Progress & Analytics (Inspired by Mockup 3 Chart)
// -------------------------------------------------------------
function ProgressView({ learnedSet, scores, readiness, onJumpPractice }: any) {
  const attemptedCount = Object.keys(scores).length;
  const scoreValues = Object.values(scores) as Array<{ overall?: number }>;
  const avgOverall = attemptedCount > 0
    ? Math.round(((scoreValues.reduce((s: number, r) => s + (Number(r.overall) || 0), 0) / attemptedCount)) * 10) / 10
    : 0;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Visual Chart Card (Inspired by Mockup 3 Top Teal Chart Card) */}
      <div className="ip-teal-card-bg rounded-[26px] p-5 text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              i
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Interview Readiness Curve
            </span>
          </div>
          <span className="text-lg font-black text-white">{readiness}% Ready</span>
        </div>

        {/* SVG Wave Line & Shaded Area Chart */}
        <div className="h-36 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Filled Wave Area */}
            <path
              d="M 0 100 Q 40 40, 80 65 T 160 30 T 240 70 T 300 20 L 300 120 L 0 120 Z"
              fill="url(#chartGradient)"
            />
            {/* Smooth Top Curve */}
            <path
              d="M 0 100 Q 40 40, 80 65 T 160 30 T 240 70 T 300 20"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Glowing Peak Dot */}
            <circle cx="160" cy="30" r="5" fill="#ffffff" stroke="#14b8a6" strokeWidth="2.5" />
            <circle cx="300" cy="20" r="5" fill="#ffffff" stroke="#14b8a6" strokeWidth="2.5" />
          </svg>

          <div className="flex justify-between text-[10px] text-teal-100 font-bold px-1 mt-1">
            <span>Intro Drill</span>
            <span>Experience</span>
            <span>Strengths</span>
            <span>Live Recruiter</span>
          </div>
        </div>
      </div>

      {/* Dual Stats Pill Row (Matching Mockup 3) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ip-neo-card p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <span className="text-base font-black text-slate-800">{learnedSet.size} / {QUESTIONS.length}</span>
            <span className="block text-[10px] font-bold text-slate-500">Learned Qs</span>
          </div>
        </div>

        <div className="ip-neo-card p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-current text-teal-600" />
          </div>
          <div>
            <span className="text-base font-black text-slate-800">{avgOverall} / 10</span>
            <span className="block text-[10px] font-bold text-slate-500">Avg Fluency</span>
          </div>
        </div>
      </div>

      {/* Recent Practice History (Matching Mockup 3 Transaction Cards) */}
      <div className="space-y-2.5 pt-1">
        <span className="text-xs font-black uppercase tracking-wider text-slate-600 px-1">
          Recent Practice Sessions
        </span>

        {attemptedCount === 0 ? (
          <div className="ip-neo-card p-6 text-center space-y-2">
            <Mic className="w-8 h-8 text-teal-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No practice drills recorded yet.</p>
            <button
              onClick={() => onJumpPractice(0)}
              className="px-4 py-2 rounded-full ip-pill-btn text-white text-xs font-black cursor-pointer inline-flex items-center gap-1"
            >
              <span>Start First Drill</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          Object.entries(scores).map(([qidStr, sc]: [string, any]) => {
            const qid = Number(qidStr);
            const questionItem = QUESTIONS.find(q => q.id === qid);
            if (!questionItem) return null;
            const originalIdx = QUESTIONS.findIndex(q => q.id === qid);

            return (
              <div
                key={qid}
                className="ip-neo-card p-3.5 flex items-center justify-between gap-3 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-teal-600">Q{qid} • {questionItem.cat}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {questionItem.q}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(sc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-black text-teal-700">
                    +{sc.overall}/10
                  </span>
                  <button
                    onClick={() => onJumpPractice(originalIdx)}
                    className="p-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 cursor-pointer"
                    title="Retry Drill"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Profile Personalization Form
// -------------------------------------------------------------
function ProfileForm({ profile, missing, onSave, landing }: any) {
  const [hasExp, setHasExp] = useState<string>(profile.has_experience || 'no');
  const [form, setForm] = useState<Record<string, any>>({ ...profile });
  const [saved, setSaved] = useState<boolean>(false);

  function handleChange(key: string, val: any) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({ ...form, has_experience: hasExp });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="ip-neo-card p-5 space-y-4 animate-in fade-in duration-200">
      <div>
        <h3 className="text-base font-black text-slate-800">
          {landing ? 'Complete Your Interview Profile' : 'Edit Your Profile Details'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          These details automatically customize all 20 interview scripts to your background.
        </p>
      </div>

      {/* Experience Toggle */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Do you have prior work experience?</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setHasExp('no')}
            className={`py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              hasExp === 'no'
                ? 'ip-pill-btn text-white shadow-md'
                : 'bg-[#f1f9fa] text-slate-600 border border-teal-100'
            }`}
          >
            I am a Fresher (No Exp)
          </button>
          <button
            type="button"
            onClick={() => setHasExp('yes')}
            className={`py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              hasExp === 'yes'
                ? 'ip-pill-btn text-white shadow-md'
                : 'bg-[#f1f9fa] text-slate-600 border border-teal-100'
            }`}
          >
            I have Work Experience
          </button>
        </div>
      </div>

      {/* Dynamic Profile Fields */}
      {PROFILE_FIELDS.map(sec => {
        return (
          <div key={sec.section} className="space-y-3 pt-2 border-t border-teal-100">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800">
              {sec.section}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sec.fields.map(f => {
                const dbKey = camelToSnake(f.key);
                return (
                  <div key={f.key} className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form[dbKey] || ''}
                      onChange={e => handleChange(dbKey, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full bg-[#f1f9fa] border border-teal-100 focus:border-teal-400 p-2.5 rounded-full text-xs text-slate-800 placeholder:text-slate-400 outline-none shadow-inner px-4"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full py-3 rounded-full ip-pill-btn text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>Save & Update All Interview Answers</span>
      </button>

      {saved && (
        <div className="p-2.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold text-center">
          ✓ Profile updated! Model answers have been personalized.
        </div>
      )}
    </form>
  );
}
