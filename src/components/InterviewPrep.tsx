import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { enrollmentStore } from '../lib/enrollmentStore';
import { QUESTIONS, STRUCTURES, PROFILE_FIELDS, answerFor, structureChecklist } from '../lib/interviewData';
import { useRouter } from '../lib/router';
import { JOB_ROLES } from '../lib/catalog';
import './InterviewPrep.css';
import { ArrowLeft } from 'lucide-react';

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

function saveStoredData(uid: string, data: { profile: any, learnedSet: Set<number>, scores: any }) {
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

export function InterviewPrep() {
  const { navigate, currentRoute } = useRouter();
  const roleId = currentRoute.params?.roleId;
  const role = JOB_ROLES.find(r => r.id === roleId);

  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const [profile, setProfile] = useState<Record<string, any>>({});
  const [learnedSet, setLearnedSet] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<Record<number, any>>({}); // question_id -> latest record
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'progress' | 'profile'>('learn');
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [micWarning, setMicWarning] = useState<string>('');
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const speakingBtnRef = useRef<string | null>(null);
  const resumeIntervalRef = useRef<any>(null);
  const stuckTimerRef = useRef<any>(null);

  // ---------- Auth + initial data load ----------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      let uid = session?.user?.id;
      if (!uid) {
        const profile = enrollmentStore.getProfile();
        if (profile && profile.id) {
          uid = profile.id;
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

  function camelToSnake(k: string) {
    return k.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
  }

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

  // ---------- Text-to-speech ----------
  function speak(text: string, btnKey: string) {
    if (!('speechSynthesis' in window)) {
      alert('Voice playback is not supported on this browser.');
      return;
    }
    const synth = window.speechSynthesis;
    const wasThisPlaying = synth.speaking && speakingBtnRef.current === btnKey;
    synth.cancel();
    if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
    speakingBtnRef.current = null;
    if (wasThisPlaying) return; // toggle-stop

    setTimeout(() => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-IN';
      utter.rate = 0.95;
      speakingBtnRef.current = btnKey;
      utter.onend = () => { speakingBtnRef.current = null; };
      utter.onerror = () => { speakingBtnRef.current = null; };
      synth.speak(utter);
      resumeIntervalRef.current = setInterval(() => {
        if (synth.speaking) { synth.pause(); synth.resume(); }
        else { clearInterval(resumeIntervalRef.current); }
      }, 4000);
    }, 120);
  }
  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
    speakingBtnRef.current = null;
  }

  // ---------- Speech recognition ----------
  useEffect(() => {
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) {
      setMicWarning('Voice recording needs Chrome. You can type your answer instead.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
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
      'not-allowed': "Mic blocked — allow microphone access for this site in your browser settings, then try again.",
      'audio-capture': 'No microphone found. Check your device mic is connected and enabled.',
      network: 'Network error — voice recognition needs an internet connection.',
      'service-not-allowed': "Voice recognition isn't available here. Try typing your answer instead.",
      'no-speech': 'No speech detected — tap the mic and try again.'
    };
    rec.onerror = (e: any) => {
      setMicWarning(msgs[e.error] || `Mic error: ${e.error} — you can type your answer instead.`);
      setIsRecording(false);
    };
    rec.onend = () => setIsRecording(prev => { if (prev) return false; return prev; });
    recognitionRef.current = rec;
  }, []);

  function startRecording() {
    const rec = recognitionRef.current;
    if (!rec) return;
    stopSpeech();
    finalTranscriptRef.current = '';
    setTranscript('Listening...');
    setMicWarning('');
    setIsRecording(true);
    try {
      rec.start();
    } catch (e) {
      setMicWarning('Could not start recording — type your answer instead.');
      setIsRecording(false);
      return;
    }
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    stuckTimerRef.current = setTimeout(() => {
      if (finalTranscriptRef.current.trim().length === 0) {
        try { rec.stop(); } catch (e) {}
        setIsRecording(false);
        setMicWarning('No audio detected — your mic may be blocked. You can type your answer below instead.');
        setTranscript('');
      }
    }, 7000);
  }
  function stopRecording() {
    if (stuckTimerRef.current) { clearTimeout(stuckTimerRef.current); stuckTimerRef.current = null; }
    setIsRecording(false);
    try { recognitionRef.current && recognitionRef.current.stop(); } catch (e) {}
  }

  // ---------- Self-assessment (no AI, no API calls — fully local + free) ----------
  async function saveSelfAssessment(checkedItems: string[], confidenceRating: number, note: string) {
    const q = QUESTIONS[currentQIdx];
    const answerText = (finalTranscriptRef.current || transcript).trim();
    const totalItems = structureChecklist(q.cat).length;
    const completeness = totalItems > 0 ? Math.round((checkedItems.length / totalItems) * 10) : 0;
    const confidence = Math.round((confidenceRating || 0) * 2); // 1-5 stars → 2-10

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
      name: learnerProfile.name || '',
      city: learnerProfile.city || '',
      education: learnerProfile.education || ''
    };
    PROFILE_FIELDS.forEach(sec => sec.fields.forEach(f => { out[f.key] = profile[camelToSnake(f.key)] || ''; }));
    out.hasExperience = profile.has_experience || '';
    return out;
  }

  if (loadingUser) return <div className="ip-wrap"><p className="ip-dim">Loading...</p></div>;
  if (!userId) return <div className="ip-wrap"><p className="ip-dim">Please log in to your SkillGo account to use Interview Prep.</p></div>;

  const missing = missingRequired();
  const locked = missing.length > 0;

  return (
    <div className="ip-wrap">
      <header className="ip-header">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const returnTo = currentRoute.params?.returnTo;
              if (returnTo) {
                navigate(returnTo, { roleId: roleId });
              } else if (roleId) {
                navigate('role-detail', { roleId });
              } else {
                navigate('my-learning');
              }
            }}
            className="p-1 text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Interview Prep</span>
            <span className="text-white text-sm font-bold">{role?.title || 'General'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('role-detail', { roleId: roleId })}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Back to Roles
          </button>
          <div className="ip-brand">SKILL<span>GO</span></div>
          {!locked && (
            <div className="ip-readiness">
              <b>{computeReadiness(learnedSet, scores)}%</b>
              <small>Ready</small>
            </div>
          )}
        </div>
      </header>

      {locked ? (
        <ProfileForm
          profile={profile}
          missing={missing}
          onSave={saveProfile}
          landing={true}
        />
      ) : (
        <>
          <div className="ip-tabs">
            {(['learn', 'practice', 'progress', 'profile'] as const).map(t => (
              <div key={t} className={`ip-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => { setActiveTab(t); stopSpeech(); }}>
                {t === 'profile' ? 'My Details' : t[0].toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

          {activeTab === 'learn' && (
            <LearnList
              learnedSet={learnedSet}
              openCard={openCard}
              setOpenCard={setOpenCard}
              onToggleLearned={toggleLearned}
              onPractice={(idx: number) => { setCurrentQIdx(idx); setActiveTab('practice'); }}
              profileForFill={profileForFill}
              speak={speak}
            />
          )}

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
              showModelAnswer={showModelAnswer}
              setShowModelAnswer={setShowModelAnswer}
              finalTranscriptRef={finalTranscriptRef}
            />
          )}

          {activeTab === 'progress' && <ProgressView learnedSet={learnedSet} scores={scores} />}

          {activeTab === 'profile' && <ProfileForm profile={profile} missing={[]} onSave={saveProfile} landing={false} />}
        </>
      )}
      <footer className="ip-footer">SKILLGO · PRACTICE UNTIL IT SOUNDS NATURAL</footer>
    </div>
  );
}

function computeReadiness(learnedSet: Set<number>, scores: Record<number, any>) {
  const total = QUESTIONS.length;
  const attempted = Object.keys(scores).length;
  const avg = attempted > 0 ? Object.values(scores).reduce((s: number, r: any) => s + (r.overall || 0), 0) / attempted : 0;
  const learnPct = learnedSet.size / total;
  const practicePct = (attempted / total) * (avg / 10);
  return Math.round((learnPct * 0.4 + practicePct * 0.6) * 100);
}

// ---------- Learn tab ----------
function LearnList({ learnedSet, openCard, setOpenCard, onToggleLearned, onPractice, profileForFill, speak }: any) {
  let lastCat: string | null = null;
  return (
    <div>
      {QUESTIONS.map((item, idx) => {
        const showCatHeader = item.cat !== lastCat;
        lastCat = item.cat;
        const isOpen = openCard === item.id;
        const isLearned = learnedSet.has(item.id);
        const answerText = answerFor(item, profileForFill());
        return (
          <div key={item.id}>
            {showCatHeader && (
              <>
                <div className="ip-cat-label">{item.cat}</div>
                <div className="ip-cat-tip"><b>Flow:</b> {STRUCTURES[item.cat]}</div>
              </>
            )}
            <div className={`ip-qcard ${isLearned ? 'learned' : ''}`} onClick={() => setOpenCard(isOpen ? null : item.id)}>
              <div className="ip-qcard-top">
                <span className="ip-qnum">{String(item.id).padStart(2, '0')}</span>
                <div className="ip-qtext-row">
                  <span className="ip-qtext">{item.q}</span>
                  <button className="ip-listen-btn" onClick={(e) => { e.stopPropagation(); speak(item.q, `q${item.id}`); }}>🔊</button>
                </div>
              </div>
              <div className={`ip-qstatus ${isLearned ? 'done' : ''}`}>{isLearned ? '✓ LEARNED' : 'TAP TO OPEN'}</div>
              {isOpen && (
                <div className="ip-qanswer">
                  <div className="ip-answer-head">
                    <div className="ip-answer-head-label">Model Answer</div>
                    <button className="ip-listen-btn" onClick={(e) => { e.stopPropagation(); speak(answerText, `a${item.id}`); }}>🔊 Listen</button>
                  </div>
                  {answerText}
                  <div className="ip-qcard-actions">
                    <button className="ip-btn ip-btn-sm" onClick={(e) => { e.stopPropagation(); onToggleLearned(item.id); }}>
                      {isLearned ? 'Unmark' : 'Mark Learned'}
                    </button>
                    <button className="ip-btn ip-btn-sm ip-btn-primary" onClick={(e) => { e.stopPropagation(); onPractice(idx); }}>
                      Practice
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Practice tab ----------
function PracticePanel({
  currentQIdx, setCurrentQIdx, profileForFill, transcript, setTranscript,
  isRecording, startRecording, stopRecording, micWarning, saveSelfAssessment,
  scores, speak, showModelAnswer, setShowModelAnswer, finalTranscriptRef
}: any) {
  const q = QUESTIONS[currentQIdx];
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

  return (
    <div className="ip-practice-panel">
      {micWarning && <div className="ip-warn">{micWarning}</div>}

      <div className="ip-qpicker">
        <button className="ip-navbtn" onClick={() => setCurrentQIdx((currentQIdx - 1 + QUESTIONS.length) % QUESTIONS.length)}>←</button>
        <select value={currentQIdx} onChange={(e) => setCurrentQIdx(parseInt(e.target.value))}>
          {QUESTIONS.map((qq, i) => (
            <option key={qq.id} value={i}>{String(qq.id).padStart(2, '0')} — {qq.q.slice(0, 40)}{qq.q.length > 40 ? '…' : ''}</option>
          ))}
        </select>
        <button className="ip-navbtn" onClick={() => setCurrentQIdx((currentQIdx + 1) % QUESTIONS.length)}>→</button>
      </div>

      <div className="ip-prompt-box">
        <div className="ip-prompt-head">
          <div className="ip-prompt-label">Question</div>
          <button className="ip-listen-btn" onClick={() => speak(q.q, 'currentQ')}>🔊 Listen</button>
        </div>
        <div className="ip-prompt-q">{q.q}</div>
        <button className="ip-btn ip-btn-sm ip-btn-full" style={{ marginTop: 14 }} onClick={() => setShowModelAnswer((v: boolean) => !v)}>
          {showModelAnswer ? 'Hide Model Answer' : 'Show & Listen to Model Answer'}
        </button>
        {showModelAnswer && (
          <div className="ip-model-answer-box open">
            <div className="ip-answer-head">
              <div className="ip-answer-head-label">Model Answer</div>
              <button className="ip-listen-btn" onClick={() => speak(modelAnswer, 'modelA')}>🔊 Listen</button>
            </div>
            <div className="ip-model-answer-text">{modelAnswer}</div>
          </div>
        )}
      </div>

      <div className="ip-structure-box">
        <div className="ip-structure-label">Use this flow — don't memorize word for word</div>
        <div className="ip-structure-flow">{STRUCTURES[q.cat]}</div>
      </div>

      <div className="ip-rec-row">
        <button className={`ip-rec-btn ${isRecording ? 'recording' : ''}`} onClick={() => (isRecording ? stopRecording() : startRecording())}>●</button>
      </div>
      <div className="ip-rec-status">{isRecording ? 'Recording... tap to stop' : 'Tap to record your answer'}</div>

      <div
        className={`ip-transcript-box ${!transcript ? 'empty' : ''}`}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          const text = e.currentTarget.textContent || '';
          finalTranscriptRef.current = text;
          setTranscript(text);
        }}
      >
        {transcript || 'Your spoken answer will appear here or tap here to type...'}
      </div>

      <div className="ip-assess-actions">
        <button className="ip-btn ip-btn-primary ip-btn-sm" disabled={!transcript} onClick={() => setShowAssess((v: boolean) => !v)}>
          {showAssess ? 'Hide Self-Check' : 'Self-Check My Answer'}
        </button>
        <button className="ip-btn ip-btn-sm" onClick={() => { setTranscript(''); finalTranscriptRef.current = ''; setShowAssess(false); }}>Clear</button>
      </div>

      {showAssess && (
        <div className="ip-feedback-card">
          <div className="ip-answer-head-label" style={{ marginBottom: 10 }}>Did you cover each part of the flow?</div>
          {checklist.map((item: string) => (
            <label key={item} className="ip-check-row">
              <input type="checkbox" checked={checked.includes(item)} onChange={() => toggleCheck(item)} />
              <span>{item}</span>
            </label>
          ))}

          <div className="ip-answer-head-label" style={{ margin: '18px 0 10px' }}>How natural and confident did it feel?</div>
          <div className="ip-star-row">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" className={`ip-star ${confidence >= n ? 'filled' : ''}`} onClick={() => setConfidence(n)}>★</button>
            ))}
          </div>

          <div className="ip-answer-head-label" style={{ margin: '18px 0 8px' }}>One thing to improve next time (optional)</div>
          <textarea className="ip-form-input" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. speak a bit slower, mention my strength earlier..." />

          <button className="ip-btn ip-btn-primary ip-btn-full" style={{ marginTop: 14 }}
            disabled={confidence === 0} onClick={handleSave}>
            Save My Self-Assessment
          </button>
          {saved && <div className="ip-save-note">✓ Saved to your progress.</div>}
        </div>
      )}

      {record && !showAssess && (
        <div className="ip-feedback-card">
          <div className="ip-fb-scores">
            <div className="ip-fb-score overall"><div className="num">{record.overall}</div><div className="lbl">Overall</div></div>
            <div className="ip-fb-score"><div className="num">{record.completeness}</div><div className="lbl">Structure</div></div>
            <div className="ip-fb-score"><div className="num">{record.fluency}</div><div className="lbl">Confidence</div></div>
          </div>
          {record.feedback && <div className="ip-fb-text"><b>Your note:</b> {record.feedback}</div>}
        </div>
      )}
    </div>
  );
}

// ---------- Progress tab ----------
function ProgressView({ learnedSet, scores }: { learnedSet: Set<number>, scores: Record<number, any> }) {
  const total = QUESTIONS.length;
  const attempted = Object.keys(scores).length;
  const avg = attempted > 0 ? (Object.values(scores).reduce((s: number, r: any) => s + r.overall, 0) / attempted).toFixed(1) : '—';
  return (
    <div>
      <div className="ip-progress-summary">
        <div className="ip-stat-box"><div className="num">{learnedSet.size}/{total}</div><div className="lbl">Learned</div></div>
        <div className="ip-stat-box"><div className="num">{attempted}/{total}</div><div className="lbl">Practiced</div></div>
        <div className="ip-stat-box"><div className="num">{avg}</div><div className="lbl">Avg Score</div></div>
      </div>
      <div>
        {QUESTIONS.map(q => {
          const s = scores[q.id];
          return (
            <div key={q.id} className="ip-prog-row">
              <div className="ip-prog-num">{String(q.id).padStart(2, '0')}</div>
              <div className="ip-prog-q">{q.q}</div>
              {s ? (
                <span className={`ip-score-pill ${s.overall >= 8 ? 'hi' : s.overall >= 5 ? 'mid' : 'lo'}`}>{s.overall}/10</span>
              ) : <span className="ip-dash">—</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Profile / My Details tab ----------
function ProfileForm({ profile, missing, onSave, landing }: { profile: Record<string, any>, missing: string[], onSave: (v: any) => void, landing: boolean }) {
  const learnerProfile = enrollmentStore.getProfile();
  const [values, setValues] = useState(() => {
    const init: Record<string, any> = {};
    PROFILE_FIELDS.forEach(sec => sec.fields.forEach(f => {
      init[camelToSnakeLocal(f.key)] = profile[camelToSnakeLocal(f.key)] || '';
    }));
    init.has_experience = profile.has_experience || '';
    return init;
  });
  const [error, setError] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  function camelToSnakeLocal(k: string) { return k.replace(/[A-Z]/g, m => '_' + m.toLowerCase()); }

  function validate() {
    const problems: string[] = [];
    if (!values.has_experience) problems.push('Whether you have work experience');
    PROFILE_FIELDS.forEach(sec => sec.fields.forEach(f => {
      if (f.required && !(values[camelToSnakeLocal(f.key)] || '').trim()) problems.push(f.label);
    }));
    return problems;
  }

  async function handleSave() {
    const problems = validate();
    if (problems.length) {
      setError('Please fill in required fields: ' + problems.join(', '));
      return;
    }
    setError('');
    await onSave(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="ip-cat-tip" style={{ margin: '0 2px 18px' }}>
        {landing
          ? "Welcome to SkillGo Interview Prep. Your Full Name, City, and Highest Education are automatically loaded from your SkillGo profile. Please complete your work experience and background details below."
          : "Your answers use your SkillGo profile details (Name, City, Highest Education) and your work background below so both text and audio are personalized to you."}
      </div>

      <div className="ip-form-section-title">Captured Learner Profile (from SkillGo)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20, background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{learnerProfile.name || 'Not set'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>City</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{learnerProfile.city || 'Not set'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Highest Education</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{learnerProfile.education || 'Not set'}</div>
        </div>
      </div>

      <div className="ip-form-section-title">Work Experience</div>
      <div className="ip-form-group">
        <label className="ip-form-label">Do you have previous work experience? <span className="req">*</span></label>
        <div className="ip-form-hint">This changes how your Background &amp; Experience answers are written.</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className={`ip-btn ${values.has_experience === 'yes' ? 'ip-btn-primary' : ''}`} style={{ flex: 1 }}
            onClick={() => setValues((v: any) => ({ ...v, has_experience: 'yes' }))}>Yes, I have experience</button>
          <button type="button" className={`ip-btn ${values.has_experience === 'no' ? 'ip-btn-primary' : ''}`} style={{ flex: 1 }}
            onClick={() => setValues((v: any) => ({ ...v, has_experience: 'no' }))}>No, I'm a fresher</button>
        </div>
      </div>

      {PROFILE_FIELDS.map(sec => (
        <div key={sec.section}>
          <div className="ip-form-section-title">{sec.section}</div>
          {sec.fields.map(f => {
            const dbKey = camelToSnakeLocal(f.key);
            return (
              <div className="ip-form-group" key={f.key}>
                <label className="ip-form-label">{f.label}{f.required && <span className="req"> *</span>}</label>
                <div className="ip-form-hint">{f.hint}</div>
                <input className="ip-form-input" type="text" value={values[dbKey] || ''}
                  onChange={(e) => setValues((v: any) => ({ ...v, [dbKey]: e.target.value }))} />
              </div>
            );
          })}
        </div>
      ))}

      {error && <div className="ip-warn">{error}</div>}
      <button className="ip-btn ip-btn-primary ip-btn-full" style={{ marginTop: 6 }} onClick={handleSave}>
        {landing ? 'Save & Start' : 'Save My Details'}
      </button>
      {saved && <div className="ip-save-note">✓ Saved. Your answers are now personalized.</div>}
    </div>
  );
}
