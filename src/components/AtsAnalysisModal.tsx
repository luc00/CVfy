import React from 'react';
import { CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Analisi ATS & Compatibilità Joinrs
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Verifica come i parser automatici e i filtri di selezione valutano il tuo CV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Card */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Punteggio Globale ATS
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white font-mono">{atsResult.score}</span>
              <span className="text-sm font-semibold text-zinc-500">/ 100</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-zinc-800 text-white border border-zinc-700">
                Grado: {atsResult.grade}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {atsResult.score >= 80 ? 'Ottima compatibilità' : 'Ottimizzazioni consigliate'}
            </span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Testo strutturato e leggibile</p>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Dettaglio Sezioni
          </span>
          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-200 font-medium flex items-center gap-1.5">
                    {sec.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                    {sec.label}
                  </span>
                  <span className="font-mono text-zinc-400">
                    {sec.score} / {sec.max} pt
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sec.passed ? 'bg-white' : 'bg-zinc-500'
                    }`}
                    style={{ width: `${(sec.score / sec.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  {sec.passed ? 'Criteri soddisfatti pienamente' : 'Informazioni incomplete o non ottimali'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Tips */}
        {atsResult.tips.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Suggerimenti per Migliorare il Punteggio
            </span>
            <ul className="space-y-1.5">
              {atsResult.tips.map((tip, i) => (
                <li
                  key={i}
                  className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2"
                >
                  <span className="text-white font-bold shrink-0 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 flex justify-end border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all cursor-pointer"
          >
            Chiudi Analisi
          </button>
        </div>
      </div>
    </div>
  );
};
