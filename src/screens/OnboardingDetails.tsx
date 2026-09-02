import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../lib/router';
import { enrollmentStore } from '../lib/enrollmentStore';
import { SkillGoLogo } from '../components/ui';
import { User, Phone, MapPin, Search, ChevronDown, Check, Sparkles, CheckCircle2, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { sendSupabaseOtp, verifySupabaseOtp } from '../lib/supabase';

const POPULAR_CITIES = [
  'Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Indore', 'Chandigarh', 'Kochi', 'Coimbatore', 'Bhopal',
  'Patna', 'Nagpur', 'Surat', 'Vadodara', 'Visakhapatnam'
];

export function OnboardingDetailsScreen() {
  const { navigate } = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [education, setEducation] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (step === 5 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  useEffect(() => {
    setError(null);
    if (step === 1) setTimeout(() => nameInputRef.current?.focus(), 100);
    else if (step === 4) setTimeout(() => phoneInputRef.current?.focus(), 100);
    else if (step === 5) setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
  }, [step]);

  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your full name to proceed.'); return; }
    setError(null);
    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) { setError('Please select or enter your city.'); return; }
    setError(null);
    setStep(3);
  };

  const handleNextFromStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!education.trim()) { setError('Please select your education.'); return; }
    setError(null);
    setStep(4);
  };

  const handleNextFromStep4 = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!validatePhone(cleanPhone)) { setError('Please enter a valid 10-digit mobile number.'); return; }
    setError(null);
    await sendSupabaseOtp({ phone: cleanPhone, name: name.trim(), city: city.trim(), education: education.trim() });
    setStep(5);
    setResendTimer(30);
    setCanResend(false);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) { const newOtp = [...otp]; newOtp[index] = ''; setOtp(newOtp); return; }
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => { if (i < 6) newOtp[i] = d; });
      setOtp(newOtp);
      if (digits.length === 6) triggerVerifyOtp(newOtp.join(''));
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = cleanValue.charAt(0);
    setOtp(newOtp);
    setOtpError(null);
    if (index < 5 && cleanValue) otpInputRefs.current[index + 1]?.focus();
    if (index === 5 && cleanValue && newOtp.every(d => d !== '')) triggerVerifyOtp(newOtp.join(''));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
  };

  const triggerVerifyOtp = async (code: string) => {
    if (code.length < 6) { setOtpError('Please enter all 6 digits'); return; }
    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      await verifySupabaseOtp({ phone, token: code });
      setIsVerifyingOtp(false);
      setIsOtpVerified(true);
      enrollmentStore.completeOnboarding({ name: name.trim(), phone: phone.trim(), city: city.trim() });
      setTimeout(() => navigate('home'), 600);
    } catch (err: any) {
      setIsVerifyingOtp(false);
      setOtpError(err?.message || 'Verification failed. Please check OTP.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setResendSuccess(true);
    setOtpError(null);
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();
    await sendSupabaseOtp({ phone, name: name.trim(), city: city.trim() });
    setTimeout(() => setResendSuccess(false), 3000);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setIsCityDropdownOpen(false);
    setCitySearch('');
    setError(null);
    setStep(3);
  };

  const filteredCities = POPULAR_CITIES.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()));

  const getStepTheme = () => {
    switch (step) {
      case 1: return { buttonClass: 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 hover:opacity-95 shadow-lg shadow-rose-500/25 text-white' };
      case 2: return { buttonClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:opacity-95 shadow-lg shadow-orange-500/25 text-white' };
      case 3:
      case 4:
      default: return { buttonClass: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 hover:opacity-95 shadow-lg shadow-purple-600/25 text-white' };
    }
  };
  const theme = getStepTheme();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col justify-between selection:bg-purple-600 selection:text-white" id="onboarding-wizard-screen">
      
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => navigate('home')}
          className="text-xs font-semibold text-slate-500 hover:text-purple-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition-all border border-slate-200/80 cursor-pointer"
        >
          Skip to Home
        </button>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-0">
        <div className="w-full max-w-lg mb-6 sm:mb-8 flex justify-center pt-8">
          <SkillGoLogo size="3xl" />
        </div>
        <div className="w-full h-full sm:h-auto sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200/80 p-6 sm:p-10 shadow-2xl shadow-slate-900/5 flex flex-col">
          <div className="flex-1 flex flex-col gap-6">
            {step === 1 && (
              <form onSubmit={handleNextFromStep1} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label htmlFor="name-input" className="block text-sm font-bold text-slate-800">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User className="w-5 h-5" /></div>
                    <input ref={nameInputRef} id="name-input" type="text" value={name} onChange={(e) => { setName(e.target.value); setError(null); }} placeholder="e.g. Rahul Sharma" className="w-full pl-12 pr-4 py-3.5 text-base rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all font-medium" autoFocus />
                  </div>
                </div>
                {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}
                <div className="pt-2">
                  <button type="submit" className={'w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ' + theme.buttonClass}><span>Continue to City</span><ArrowRight className="w-5 h-5" /></button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleNextFromStep2} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-800">Select or Search City <span className="text-rose-500">*</span></label>
                  <button type="button" onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)} className="w-full flex items-center justify-between pl-12 pr-4 py-3.5 text-left text-base rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all font-medium cursor-pointer">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><MapPin className="w-5 h-5 text-amber-500" /></div>
                    <span className={city ? 'text-slate-900 font-bold' : 'text-slate-400'}>{city || 'Choose your city'}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isCityDropdownOpen && (
                    <div className="absolute z-30 mt-2 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Type city name..." className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium" autoFocus />
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto p-1.5">
                        {citySearch && !filteredCities.includes(citySearch) && (
                          <button type="button" onClick={() => handleCitySelect(citySearch)} className="w-full text-left px-4 py-2.5 text-sm rounded-xl hover:bg-amber-50 text-amber-800 font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-600" /><span>Use "{citySearch}"</span></button>
                        )}
                        {filteredCities.map((cityName) => (
                          <button key={cityName} type="button" onClick={() => handleCitySelect(cityName)} className={`w-full text-left px-4 py-2.5 text-sm rounded-xl flex items-center justify-between transition-colors font-medium ${city === cityName ? 'bg-amber-50 text-amber-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'}`}><span>{cityName}</span>{city === cityName && <Check className="w-4 h-4 text-amber-600" />}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}
                <div className="pt-2">
                  <button type="submit" className={'w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ' + theme.buttonClass}><span>Continue to Education</span><ArrowRight className="w-5 h-5" /></button>
                </div>
              </form>
            )}
            {step === 3 && (
              <form onSubmit={handleNextFromStep3} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-800">Highest Education <span className="text-rose-500">*</span></label>
                  <select value={education} onChange={(e) => setEducation(e.target.value)} className="w-full px-4 py-3.5 text-base rounded-2xl border border-slate-200 bg-slate-50/60 text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all font-medium">
                    <option value="">Select your education</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Graduation">Graduation</option>
                    <option value="ITI/Diploma">ITI/Diploma</option>
                  </select>
                </div>
                {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}
                <div className="pt-2">
                  <button type="submit" className={'w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ' + theme.buttonClass}><span>Continue to Mobile Number</span><ArrowRight className="w-5 h-5" /></button>
                </div>
              </form>
            )}
            {step === 4 && (
              <form onSubmit={handleNextFromStep4} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label htmlFor="phone-input" className="block text-sm font-bold text-slate-800">Mobile Number <span className="text-rose-500">*</span></label>
                  <div className="relative flex rounded-2xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-600/15 transition-all overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 bg-slate-100 border-r border-slate-200 text-slate-800 font-bold text-sm select-none"><span>🇮🇳</span><span>+91</span></div>
                    <div className="relative flex-1 flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Phone className="w-5 h-5 text-purple-600" /></div>
                      <input ref={phoneInputRef} id="phone-input" type="tel" inputMode="numeric" pattern="[0-9]*" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(null); }} placeholder="98765 43210" className="w-full pl-11 pr-4 py-3.5 text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-bold tracking-wide" maxLength={10} autoFocus />
                    </div>
                  </div>
                </div>
                {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}
                <div className="pt-2">
                  <button type="submit" className={'w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ' + theme.buttonClass}><span>Send Verification OTP</span><ArrowRight className="w-5 h-5" /></button>
                </div>
              </form>
            )}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg mb-2"><Lock className="w-3.5 h-3.5" /> SMS Sent to +91 {phone}</div>
                {resendSuccess && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>New OTP sent successfully via SMS</span></div>}
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input key={idx} ref={(el) => (otpInputRefs.current[idx] = el)} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={digit} disabled={isOtpVerified || isVerifyingOtp} onChange={(e) => handleOtpDigitChange(idx, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(idx, e)} className={'w-12 h-14 text-center text-xl font-black rounded-2xl border transition-all ' + (isOtpVerified ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : digit ? 'border-purple-600 bg-purple-50/50 text-purple-900 ring-4 ring-purple-600/15' : 'border-slate-200 bg-slate-50/60 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/15')} />
                  ))}
                </div>
                {(otpError || error) && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-200">{otpError || error}</p>}
                {isVerifyingOtp && <div className="text-center py-2 text-sm font-bold text-purple-600 animate-pulse">Verifying OTP securely with Supabase...</div>}
                {isOtpVerified && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-extrabold flex items-center justify-center gap-2 border border-emerald-200"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span>Verification Successful! Launching SkillGo...</span></div>}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>{canResend ? <button type="button" onClick={handleResendOtp} className="font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer">Resend SMS OTP</button> : <span className="text-slate-400 font-medium">Resend code in <strong className="text-slate-700">{resendTimer}s</strong></span>}</div>
                  <button type="button" onClick={() => setStep(4)} className="font-bold text-slate-500 hover:text-slate-900 cursor-pointer">Change mobile number</button>
                </div>
                <div className="pt-2">
                  <button type="button" onClick={() => triggerVerifyOtp(otp.join(''))} disabled={otp.join('').length < 6 || isVerifyingOtp || isOtpVerified} className={'w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ' + (otp.join('').length === 6 && !isOtpVerified ? theme.buttonClass : 'bg-slate-200 text-slate-400 cursor-not-allowed')}><span>{isVerifyingOtp ? 'Verifying...' : isOtpVerified ? 'Verified Successfully' : 'Verify & Launch SkillGo'}</span>{!isVerifyingOtp && !isOtpVerified && <Check className="w-5 h-5" />}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">SkillGo • Job-Ready Vocational Career Acceleration • Bank-Grade Secure Supabase Auth</footer>
    </div>
  );
}
