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
  FileText,
  PhoneCall,
  Video,
  PhoneOff
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
  
  // SEQUENTIAL STEPS: 1 = Overview & Readiness, 2 = Question Bank & Strategies, 3 = Live Interview Call Studio, 4 = Profile Settings
  const [activeStep, setActiveStep] = useState<number>(1);
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
      }, 5000);
    }, 50);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
    setPlayingKey(null);
  }

  function startRecording() {
    setMicWarning('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicWarning('Speech recognition is not fully supported in this browser. You can type your answer below.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (e: any) => {
        let interim = '';
        let final = finalTranscriptRef.current;
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += (final ? ' ' : '') + e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        finalTranscriptRef.current = final;
        setTranscript(final + (interim ? ' ' + interim : ''));
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      setMicWarning('Microphone access could not be initialized.');
      setIsRecording(false);
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecording(false);
  }

  async function saveSelfAssessment(checkedItems: string[], confidence: number, note: string) {
    if (!userId) return;
    const q = QUESTIONS[currentQIdx];
    const answerText = transcript.trim() || '(No spoken transcript recorded)';
    const totalChecks = structureChecklist(q.cat).length;
    const checkScore = totalChecks > 0 ? (checkedItems.length / totalChecks) * 5 : 5;
    const overall = Math.min(10, Math.round(((checkScore + confidence * 1.5) / 12.5) * 10) / 10);

    const record = {
      overall,
      confidence,
      checked: checkedItems,
      feedback: note || '',
      transcript: answerText,
      created_at: new Date().toISOString()
    };

    const nextScores = { ...scores, [q.id]: record };
    setScores(nextScores);
    saveStoredData(userId, { profile, learnedSet, scores: nextScores });
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
        <p className="text-teal-800 font-semibold text-sm">Loading Interview Studio...</p>
      </div>
    );
  }

  const missing = missingRequired();
  const locked = missing.length > 0;
  const readiness = computeReadiness(learnedSet, scores);
  const learnerData = profileForFill();

  return (
    <div className="min-h-screen bg-[#edf7f9] text-slate-800 font-sans pb-24 selection:bg-teal-500 selection:text-white">
      {/* Top App Header */}
      <header className="sticky top-0 z-30 bg-[#edf7f9]/95 backdrop-blur-md px-4 py-3 sm:px-6 border-b border-teal-200/50">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => {
              const returnTo = currentRoute.params?.returnTo;
              if (returnTo) navigate(returnTo, { roleId });
              else if (roleId) navigate('role-detail', { roleId });
              else navigate('my-learning');
            }}
            className="w-10 h-10 rounded-full ip-neo-button-circle flex items-center justify-center text-teal-800 hover:text-teal-950 transition-all cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center flex-1">
            <h1 className="text-xs font-black uppercase tracking-widest text-teal-900">
              {role ? role.title : 'Interview Studio'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeech();
                setActiveStep(1);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                activeStep === 1
                  ? 'ip-teal-gradient text-white shadow-md'
                  : 'ip-neo-button-circle text-teal-800 hover:text-teal-950'
              }`}
              title="Overview & Readiness"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopSpeech();
                setActiveStep(4);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                activeStep === 4
                  ? 'ip-teal-gradient text-white shadow-md'
                  : 'ip-neo-button-circle text-teal-800 hover:text-teal-950'
              }`}
              title="Candidate Profile Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-3 space-y-5">

        {locked && activeStep !== 4 ? (
          <ProfileForm
            profile={profile}
            missing={missing}
            onSave={saveProfile}
            landing={true}
          />
        ) : (
          <>
            {/* STEP 1: OVERVIEW & READINESS */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Hero Card */}
                <div className="ip-teal-card-bg rounded-[22px] p-4 text-white relative overflow-hidden shadow-md">
                  <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/25 px-2.5 py-1 rounded-full">
                      Sequential Mastery
                    </span>
                    <span className="text-xs font-bold text-teal-100">{learnerData.name || 'Candidate'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="py-2.5 px-5 rounded-full bg-white text-teal-900 font-black text-xs shadow-md hover:bg-teal-50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-teal-600" />
                      <span>Start AI Interview Call</span>
                    </button>
                    <button
                      onClick={() => setActiveStep(2)}
                      className="py-2.5 px-4 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Browse Qs
                    </button>
                  </div>
                </div>

                {/* Circular Gauge */}
                <div className="ip-neo-card p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                    Overall Interview Readiness
                  </span>

                  <div className="w-48 h-48 ip-gauge-outer flex flex-col items-center justify-center relative p-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="90" cy="90" r="72" stroke="#e2f5f6" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="90"
                        cy="90"
                        r="72"
                        stroke="url(#tealGradient)"
                        strokeWidth="10"
                        strokeDasharray={452.38}
                        strokeDashoffset={452.38 - (452.38 * readiness) / 100}
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
                        Ready
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-teal-100/60">
                    <div className="text-center">
                      <span className="text-lg font-black text-slate-800">{learnedSet.size} / 20</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Questions Mastered</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-black text-slate-800">{Object.keys(scores).length} Done</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Call Drills Completed</span>
                    </div>
                  </div>
                </div>

                {/* Jump to Next Action */}
                <div className="ip-neo-card p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full ip-teal-gradient text-white flex items-center justify-center shrink-0 shadow-md">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">Ready for Live Practice?</h4>
                      <p className="text-xs text-slate-500">Jump directly into the AI Interview Call simulator.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2.5 rounded-full ip-pill-btn text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Start Call</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: QUESTION BANK & STRATEGIES */}
            {activeStep === 2 && (
              <LearnList
                learnedSet={learnedSet}
                openCard={openCard}
                setOpenCard={setOpenCard}
                onToggleLearned={toggleLearned}
                onStartCall={(idx: number) => {
                  setCurrentQIdx(idx);
                  setActiveStep(3);
                  stopSpeech();
                }}
                profileForFill={profileForFill}
                speak={speak}
                playingKey={playingKey}
              />
            )}

            {/* STEP 3: LIVE AI INTERVIEW CALL EXPERIENCE */}
            {activeStep === 3 && (
              <LiveInterviewCallStudio
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
                onFinishCall={() => setActiveStep(1)}
              />
            )}

            {/* STEP 4: PROFILE SETTINGS */}
            {activeStep === 4 && (
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

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-teal-800/70 font-medium">
        <span>SkillGo AI Studio • Sequential Workplace Interview Studio</span>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Learn List (Question Bank & Strategy)
// -------------------------------------------------------------
function LearnList({
  learnedSet,
  openCard,
  setOpenCard,
  onToggleLearned,
  onStartCall,
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
      <div className="ip-neo-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800">Core 20 Interview Questions</h3>
          <span className="text-xs font-bold text-teal-700">{learnedSet.size}/20 Mastered</span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search interview questions..."
            className="w-full bg-[#f1f9fa] border border-teal-100 pl-10 pr-4 py-2.5 rounded-full text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-400 font-medium shadow-inner"
          />
        </div>

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
                    : 'bg-[#f1f9fa] text-slate-600 hover:bg-teal-50 border border-teal-100/60'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filteredQuestions.map((item) => {
          const originalIdx = QUESTIONS.findIndex(q => q.id === item.id);
          const isOpen = openCard === item.id;
          const isLearned = learnedSet.has(item.id);
          const answerText = answerFor(item, profileForFill());
          const flowSteps = structureChecklist(item.cat);
          const isPlayingQ = playingKey === `q${item.id}`;

          return (
            <div key={item.id} className="ip-neo-card overflow-hidden transition-all duration-200">
              <div
                onClick={() => setOpenCard(isOpen ? null : item.id)}
                className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                    isLearned ? 'bg-teal-500 text-white shadow-sm' : 'bg-teal-50 text-teal-700 border border-teal-100'
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
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {item.q}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => speak(item.q, `q${item.id}`)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isPlayingQ ? 'bg-teal-500 text-white shadow-md animate-pulse' : 'bg-[#f1f9fa] text-teal-800 border border-teal-100'
                    }`}
                    title="Listen"
                  >
                    {isPlayingQ ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <ChevronRight className={`w-5 h-5 text-teal-600 transition-transform ${isOpen ? 'rotate-90 text-teal-800' : ''}`} />
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-teal-100/60 space-y-3.5 bg-gradient-to-b from-white to-[#f7fcfd]">
                  <div className="ip-neo-card-inset p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Response Structure Strategy</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {flowSteps.map((step: string, idx: number) => (
                        <span key={idx} className="text-xs font-semibold bg-white text-slate-700 border border-teal-100 px-2.5 py-1 rounded-full shadow-xs">
                          <span className="text-teal-600 font-bold">{idx + 1}.</span> {step}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">Sample Tailored Answer</span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{answerText}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onToggleLearned(item.id)}
                      className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        isLearned ? 'bg-teal-100 text-teal-900 border-teal-300' : 'bg-white text-slate-600 border-teal-200'
                      }`}
                    >
                      {isLearned ? '✓ Marked as Mastered' : 'Mark as Mastered'}
                    </button>

                    <button
                      onClick={() => onStartCall(originalIdx)}
                      className="px-4 py-2 rounded-full ip-pill-btn text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Practice in AI Call</span>
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
// Component: Live AI Interview Call Studio (Immersive Call Experience)
// -------------------------------------------------------------
function LiveInterviewCallStudio({
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
  finalTranscriptRef,
  onFinishCall
}: any) {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'evaluating'>('connected');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [showAssess, setShowAssess] = useState<boolean>(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  const q = QUESTIONS[currentQIdx];
  const modelAnswer = answerFor(q, profileForFill());
  const checklist = structureChecklist(q.cat);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setShowModelAnswer(false);
    setShowAssess(false);
    setChecked([]);
    setConfidence(0);
    setNote('');
    setSaved(false);
  }, [currentQIdx]); // eslint-disable-line

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function toggleCheck(item: string) {
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  async function handleSave() {
    await saveSelfAssessment(checked, confidence, note);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      // Automatically advance to next question in interview call
      if (currentQIdx < QUESTIONS.length - 1) {
        setCurrentQIdx(currentQIdx + 1);
      } else {
        onFinishCall();
      }
    }, 2000);
  }

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const isPlayingQ = playingKey === 'practiceQ';
  const isPlayingModel = playingKey === 'practiceModel';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* IMMERSIVE LIVE CALL BANNER (Inspired by iPhone / WhatsApp Video Call UI) */}
      <div className="ip-teal-card-bg rounded-[28px] p-5 text-white shadow-xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Decorative background ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-56 h-56 rounded-full border-2 border-white" />
        </div>

        <div className="flex items-center justify-between w-full mb-3 z-10">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/80 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live AI Recruiter Call
          </span>
          <span className="text-xs font-mono font-bold bg-black/20 px-3 py-1 rounded-full text-teal-100">
            {formatTime(callDuration)}
          </span>
        </div>

        {/* Recruiter Avatar */}
        <div className="relative my-3 z-10">
          <div className="w-20 h-20 rounded-full bg-white/20 p-1.5 shadow-xl flex items-center justify-center border-2 border-white/40">
            <div className="w-full h-full rounded-full bg-teal-600 flex items-center justify-center text-white">
              <User className="w-10 h-10" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow">
            <Mic className="w-3 h-3" />
          </div>
        </div>

        <h3 className="text-base font-black text-white tracking-tight z-10">
          AI Senior Hiring Manager
        </h3>
        <p className="text-xs text-teal-100 font-medium z-10 mt-0.5">
          Question {currentQIdx + 1} of {QUESTIONS.length} • {q.cat}
        </p>

        {/* Audio Waveform Simulator */}
        <div className="flex items-center gap-1 my-3 z-10">
          {[12, 24, 18, 30, 15, 26, 20, 32, 14, 22].map((h, i) => (
            <span 
              key={i} 
              className="w-1 bg-white/80 rounded-full animate-pulse"
              style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }} 
            />
          ))}
        </div>
      </div>

      {/* Recruiter Question Box */}
      <div className="ip-neo-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-full">
            {q.cat}
          </span>

          <button
            onClick={() => speak(q.q, 'practiceQ')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isPlayingQ ? 'bg-teal-500 text-white shadow-md animate-pulse' : 'bg-[#f1f9fa] hover:bg-teal-100 text-teal-800 border border-teal-100'
            }`}
          >
            {isPlayingQ ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingQ ? 'Stop' : 'Listen to Question'}</span>
          </button>
        </div>

        <h2 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
          "{q.q}"
        </h2>

        {/* Checklist structure hint */}
        <div className="pt-2 border-t border-teal-100/60">
          <div className="text-[10px] font-black uppercase tracking-wider text-teal-700 mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-teal-500" />
            <span>Framework Key Points</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {checklist.map((step: string, idx: number) => (
              <span key={idx} className="text-xs font-semibold bg-[#f1f9fa] text-slate-700 border border-teal-100 px-2.5 py-1 rounded-full">
                <span className="text-teal-600 font-bold">{idx + 1}.</span> {step}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowModelAnswer((v: boolean) => !v)}
          className="w-full py-2 px-3 rounded-full bg-[#f1f9fa] hover:bg-teal-50 border border-teal-100 text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>{showModelAnswer ? 'Hide Sample Answer' : 'View Sample Answer'}</span>
        </button>

        {showModelAnswer && (
          <div className="p-3.5 rounded-2xl ip-neo-card-inset space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">Sample Script</span>
              <button
                onClick={() => speak(modelAnswer, 'practiceModel')}
                className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
              >
                {isPlayingModel ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>Play Sample</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{modelAnswer}</p>
          </div>
        )}
      </div>

      {/* Voice Call Recording Studio Box */}
      <div className="ip-neo-card p-5 space-y-4 text-center">
        {micWarning && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs font-medium text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{micWarning}</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-2">
          <button
            onClick={() => (isRecording ? stopRecording() : startRecording())}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all shadow-xl cursor-pointer active:scale-95 ${
              isRecording ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30' : 'ip-teal-gradient text-white shadow-teal-500/40'
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
                Listening to your answer... Speak into mic
              </span>
            ) : (
              'Tap microphone to speak your response to the recruiter'
            )}
          </p>
        </div>

        <div className="text-left space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 px-1">
            <span>Your Spoken Answer Transcript</span>
            <span>{wordCount} words</span>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => {
              finalTranscriptRef.current = e.target.value;
              setTranscript(e.target.value);
            }}
            rows={3}
            placeholder="Spoken words will appear here instantly, or type your answer..."
            className="w-full bg-[#f1f9fa] border border-teal-100 focus:border-teal-400 p-3 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all resize-none font-medium leading-relaxed shadow-inner"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => {
              setTranscript('');
              finalTranscriptRef.current = '';
              setShowAssess(false);
            }}
            disabled={!transcript}
            className="px-4 py-2 rounded-full bg-[#f1f9fa] hover:bg-teal-50 disabled:opacity-30 text-slate-600 text-xs font-bold transition-all cursor-pointer border border-teal-100"
          >
            Clear
          </button>

          <button
            disabled={!transcript.trim()}
            onClick={() => setShowAssess((v: boolean) => !v)}
            className="flex-1 py-2.5 px-4 rounded-full ip-pill-btn text-white text-xs font-black disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{showAssess ? 'Hide Evaluation' : 'Score & Evaluate Response'}</span>
          </button>
        </div>
      </div>

      {/* Evaluation & Self Assessment Box */}
      {showAssess && (
        <div className="ip-neo-card p-5 space-y-5 border-2 border-teal-400/60 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Step 1: Framework Checklist</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">Did your response cover key elements?</p>

            <div className="space-y-2">
              {checklist.map((item: string) => {
                const isChecked = checked.includes(item);
                return (
                  <div
                    key={item}
                    onClick={() => toggleCheck(item)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                      isChecked ? 'bg-teal-50 border-teal-400 text-teal-900 font-bold' : 'bg-[#f1f9fa] border-teal-100 text-slate-600'
                    }`}
                  >
                    {isChecked ? <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                    <span className="text-xs">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-800 mb-1">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Step 2: Fluency & Confidence Score</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setConfidence(n)}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    confidence >= n ? 'bg-amber-400 text-white shadow-sm' : 'bg-[#f1f9fa] border border-teal-100 text-slate-400'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={confidence === 0}
            onClick={handleSave}
            className="w-full py-3 rounded-full ip-pill-btn text-white font-black text-xs sm:text-sm shadow-md disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{saved ? 'Saved Successfully! Next Q →' : 'Save Score & Proceed to Next Question'}</span>
          </button>

          {saved && (
            <p className="text-xs text-teal-700 font-bold text-center">✓ Saved to your interview ledger! Advancing...</p>
          )}
        </div>
      )}

      {/* Call Controls Bar at Bottom */}
      <div className="flex items-center justify-between px-6 py-4 ip-neo-card bg-slate-900 text-white">
        <button
          onClick={() => setCurrentQIdx((currentQIdx - 1 + QUESTIONS.length) % QUESTIONS.length)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Q</span>
        </button>

        <button
          onClick={onFinishCall}
          className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>

        <button
          onClick={() => setCurrentQIdx((currentQIdx + 1) % QUESTIONS.length)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Next Q</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Profile Form
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

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">Do you have prior work experience?</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setHasExp('no')}
            className={`py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              hasExp === 'no' ? 'ip-pill-btn text-white shadow-md' : 'bg-[#f1f9fa] text-slate-600 border border-teal-100'
            }`}
          >
            I am a Fresher (No Exp)
          </button>
          <button
            type="button"
            onClick={() => setHasExp('yes')}
            className={`py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              hasExp === 'yes' ? 'ip-pill-btn text-white shadow-md' : 'bg-[#f1f9fa] text-slate-600 border border-teal-100'
            }`}
          >
            I have Work Experience
          </button>
        </div>
      </div>

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
        <span>Save & Update Interview Profile</span>
      </button>

      {saved && (
        <div className="p-2.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold text-center">
          ✓ Profile updated! Model answers personalized.
        </div>
      )}
    </form>
  );
}
