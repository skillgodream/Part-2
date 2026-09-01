import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle2, ArrowRight, Clock, Lock, RotateCcw } from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { JOB_ROLES } from '../lib/catalog';
import { useRouter } from '../lib/router';

export function ModuleVideoScreen() {
  const { currentRoute, navigate, goBack } = useRouter();
  const roleId = currentRoute.params?.roleId || JOB_ROLES[0].id;
  const moduleId = currentRoute.params?.moduleId || 'mod-1';

  const role = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
  const moduleItem = role.modules.find(m => m.id === moduleId) || role.modules[0];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showLockedWarning, setShowLockedWarning] = useState(false);

  // Video progress tracking simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoProgress]);

  const requiredPercentage = 80;
  const isQuizUnlocked = videoProgress >= requiredPercentage;

  const handleAttemptQuiz = () => {
    if (!isQuizUnlocked) {
      setShowLockedWarning(true);
      setTimeout(() => setShowLockedWarning(false), 4000);
      return;
    }
    navigate('module-quiz', { roleId: role.id, moduleId: moduleItem.id });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={goBack} className="inline-flex items-center gap-1 hover:text-slate-900 font-medium cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-slate-900 font-semibold">{role.title}</span>
      </div>

      {/* Video Frame */}
      <div className="relative bg-slate-950 rounded-3xl overflow-hidden aspect-video flex items-center justify-center mb-6 shadow-lg border border-slate-800 text-white">
        {!isPlaying && videoProgress === 0 && (
          <div className="text-center p-6 space-y-3 z-10">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center mx-auto shadow-xl transition-all cursor-pointer"
            >
              <Play className="w-8 h-8 ml-1 fill-white" />
            </button>
            <div className="text-white font-bold text-base sm:text-lg">{moduleItem.title}</div>
            <div className="text-slate-400 text-xs flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Duration: {moduleItem.videoDuration}
            </div>
          </div>
        )}

        {isPlaying && (
          <div className="w-full h-full flex flex-col justify-between z-10 relative">
            {moduleItem.videoUrl ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', height: '100%' }}>
                <iframe 
                  src={moduleItem.videoUrl} 
                  loading="lazy" 
                  style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} 
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" 
                  allowfullscreen="true"
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-950 p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-lg">Masterclass Lesson Simulated Player</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  You are reviewing the key operating procedures for {moduleItem.title}.
                </p>
              </div>
            )}

            {/* Floating Progress Bar overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-slate-950/80 backdrop-blur-md flex flex-col gap-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Video Progress: {videoProgress}% watched
                </span>
                <span>{videoProgress >= requiredPercentage ? 'Quiz Unlocked ✓' : `Watch ${requiredPercentage}% to unlock quiz`}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {!isPlaying && videoProgress === 100 && (
          <div className="text-center p-6 space-y-4 z-10">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-black text-xl">
              ✓
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                Lesson Completed ({videoProgress}%)
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have watched the required video percentage. The assessment quiz is now unlocked!
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setVideoProgress(0); setIsPlaying(true); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Rewatch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary and Takeaways */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="orange">Module {moduleItem.moduleNumber}</Badge>
          <Badge variant="default">{moduleItem.durationMinutes} Mins Total</Badge>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">{moduleItem.title}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{moduleItem.summary}</p>

        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Key Operational Takeaways</h4>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          {moduleItem.keyTakeaways.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        {/* Quiz Unlock Status & Warning Banner */}
        {showLockedWarning && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center gap-2 animate-bounce">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Quiz is locked! Please watch at least {requiredPercentage}% of the video lesson (Current: {videoProgress}%) to unlock.</span>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            {isQuizUnlocked ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Quiz Unlocked</span>
            ) : (
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Quiz Locked (Watch {requiredPercentage}%+ to unlock • {videoProgress}%)
              </span>
            )}
          </div>

          <Button
            size="md"
            variant={isQuizUnlocked ? 'primary' : 'secondary'}
            iconRight={isQuizUnlocked ? ArrowRight : Lock}
            onClick={handleAttemptQuiz}
          >
            {isQuizUnlocked ? 'Take Module Assessment Quiz' : 'Quiz Locked (Watch Video)'}
          </Button>
        </div>
      </div>
    </div>
  );
}
