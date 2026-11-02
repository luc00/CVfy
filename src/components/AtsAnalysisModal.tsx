import React from 'react';
import { CheckCircle2, AlertCircle, X, ShieldCheck, Sparkles } from 'lucide-react';
import { AtsScoreResult } from '../types';

interface AtsAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  atsResult: AtsScoreResult;
}

export const AtsAnalysisModal: React.FC<AtsAnalysisModalProps> = ({
  isOpen,
  onClose,
  atsResult,
}) => {
  if (!isOpen) return null;

  const sections = Object.values(atsResult.breakdown);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Analisi ATS & Compatibilità Joinrs
              </h2>
              <p className="text-xs text-slate-400">
                Verifica come gli algoritmi di selezione e i filtri HR valutano il tuo CV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Punteggio Globale ATS
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">{atsResult.score}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Grado: {atsResult.grade}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold ${
                atsResult.score >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {atsResult.score >= 80 ? 'Ottima leggibilità' : 'Miglioramenti consigliati'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Testi conformi e scansionabili</p>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Dettaglio per Sezione
          </span>
          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    {sec.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {sec.label}
                  </span>
                  <span className="font-mono text-slate-400">
                    {sec.score} / {sec.max} pt
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sec.passed ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(sec.score / sec.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Tips */}
        {atsResult.tips.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Consigli per raggiungere il 100%:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {atsResult.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Ho Capito, Continua
          </button>
        </div>
      </div>
    </div>
  );
};
