import React from 'react';
import { Globe, Landmark, Castle, Building2, Check, X } from 'lucide-react';

export interface LanguageOption {
  code: string;
  nameEnglish: string;
  nameVernacular: string;
  landmark: string;
  icon: any;
  colorBg: string;
  borderColor: string;
  textColor: string;
  tagline: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    nameEnglish: 'English',
    nameVernacular: 'English',
    landmark: 'Global / Big Ben',
    icon: Globe,
    colorBg: 'bg-blue-50 hover:bg-blue-100/80',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    tagline: 'Global Standard'
  },
  {
    code: 'hi',
    nameEnglish: 'Hindi',
    nameVernacular: 'हिन्दी',
    landmark: 'India Gate / Taj Mahal',
    icon: Landmark,
    colorBg: 'bg-amber-50 hover:bg-amber-100/80',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    tagline: 'राष्ट्रीय भाषा'
  },
  {
    code: 'ka',
    nameEnglish: 'Kannada',
    nameVernacular: 'ಕನ್ನಡ',
    landmark: 'Mysore Palace',
    icon: Castle,
    colorBg: 'bg-emerald-50 hover:bg-emerald-100/80',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-900',
    tagline: 'ಕರ್ನಾಟಕ'
  },
  {
    code: 'te',
    nameEnglish: 'Telugu',
    nameVernacular: 'తెలుగు',
    landmark: 'Charminar',
    icon: Building2,
    colorBg: 'bg-purple-50 hover:bg-purple-100/80',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    tagline: 'తెలుగు రాష్ట్రాలు'
  }
];

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export function LanguageModal({ isOpen, onClose, currentLanguage, onSelectLanguage }: LanguageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" id="language-modal-backdrop">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        id="language-modal-container"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <Globe className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Select Preferred Language</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Choose your language for operational training, SOP guides, and interface.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            id="language-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Language Cards Grid */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((lang) => {
              const IconComponent = lang.icon;
              const isSelected = currentLanguage === lang.code;

              return (
                <div
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  className={`aspect-square p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-between text-center group ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                      : `${lang.borderColor} ${lang.colorBg} hover:shadow-md hover:-translate-y-0.5`
                  }`}
                  id={`lang-card-${lang.code}`}
                >
                  {/* Top: Icon & Check */}
                  <div className="w-full flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200/80'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/80 text-slate-600 border border-slate-200">
                        {lang.code.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Language Names */}
                  <div className="space-y-0.5 my-auto">
                    <h4 className="text-base font-black text-slate-900 tracking-tight">{lang.nameVernacular}</h4>
                    <p className="text-[11px] font-semibold text-slate-600">{lang.nameEnglish}</p>
                    <p className="text-[9px] text-slate-400 truncate max-w-[110px]">{lang.landmark}</p>
                  </div>

                  {/* Bottom indicator */}
                  <div className="w-full pt-1.5 border-t border-slate-200/60 flex items-center justify-center">
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                      {isSelected ? 'Active' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>You can switch languages anytime from the top navigation bar.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
