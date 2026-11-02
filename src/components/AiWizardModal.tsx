import React, { useState } from 'react';
import { Sparkles, Wand2, X, Check, ArrowRight } from 'lucide-react';
import { CVData } from '../types';

interface AiWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedCv: (newCv: CVData) => void;
}

export const AiWizardModal: React.FC<AiWizardModalProps> = ({
  isOpen,
  onClose,
  onApplyGeneratedCv,
}) => {
  const [role, setRole] = useState('Senior Product Manager');
  const [experienceLevel, setExperienceLevel] = useState('3-5 anni (Intermedio)');
  const [userNotes, setUserNotes] = useState(
    'Ho lavorato in una scale-up digitale guidando team Agile, ridisegnato il funnel di acquisto e migliorato la retention. Laurea in Ingegneria Gestionale.'
  );
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    { title: 'Product Manager', exp: '3-5 anni', notes: 'Esperienza in startup SaaS, metodologie Agile, backlog, user testing e OKR.' },
    { title: 'Software Engineer', exp: '2-4 anni', notes: 'Sviluppo full-stack TypeScript, React, Node.js, architetture cloud AWS/GCP e CI/CD.' },
    { title: 'Data Analyst & BI', exp: '2-5 anni', notes: 'Query SQL avanzate, Python per data analysis, dashboard interattive PowerBI e KPI di business.' },
    { title: 'Digital Marketing Lead', exp: '3-6 anni', notes: 'Growth marketing, campagne Meta & Google Ads con ROAS elevato, SEO e analytics.' },
    { title: 'Junior Neo-Laureato', exp: '0-1 anno', notes: 'Laurea brillante, tirocini universitari, forte motivazione, ottima conoscenza inglese e progetti accademici.' },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setRole(p.title);
    setExperienceLevel(p.exp);
    setUserNotes(p.notes);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gemini/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: role,
          experienceLevel,
          userBrief: userNotes,
          language,
        }),
      });
      const data = await res.json();
      if (data.data) {
        onApplyGeneratedCv(data.data);
        onClose();
      } else {
        setErrorMsg('Errore nella generazione del CV. Riprova tra poco.');
      }
    } catch (err: any) {
      console.error('Wizard error:', err);
      setErrorMsg('Impossibile completare la richiesta. Verifica la connessione.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Generatore Rapido CV con AI</h2>
              <p className="text-xs text-slate-400">
                L'intelligenza artificiale crea un CV pronto e personalizzato per il tuo settore
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

        {/* Preset chips */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-400">
            Oppure seleziona un profilo di esempio:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Ruolo Target Desiderato</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Es. Senior Full-Stack Engineer"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Livello di Esperienza</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="0-1 anno (Junior/Neo-Laureato)">Junior / Neo-Laureato (0-1 anno)</option>
                <option value="2-4 anni (Intermedio)">Intermedio (2-4 anni)</option>
                <option value="5-8 anni (Senior)">Senior (5-8 anni)</option>
                <option value="8+ anni (Lead / Executive)">Lead / Executive (8+ anni)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Lingua del Curriculum</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="it">Italiano (Ideale per mercato IT/Joinrs)</option>
                <option value="en">Inglese (International ATS)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Note o Competenze Chiave da Includere (Opzionale)
            </label>
            <textarea
              rows={3}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Descrivi brevemente cosa hai fatto, strumenti usati o obiettivi che vuoi valorizzare..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
            {errorMsg}
          </p>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Annulla
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Generazione in corso...' : 'Genera CV Completo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
