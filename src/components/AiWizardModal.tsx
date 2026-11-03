import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
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
    { title: 'Software Engineer', exp: '2-4 anni', notes: 'Sviluppo full-stack TypeScript, React, Node.js, architetture cloud e CI/CD.' },
    { title: 'Data Analyst & BI', exp: '2-5 anni', notes: 'Query SQL avanzate, Python per analisi dati, dashboard PowerBI e KPI di business.' },
    { title: 'Digital Marketing Lead', exp: '3-6 anni', notes: 'Growth marketing, campagne Meta & Google Ads, ottimizzazione conversioni e SEO.' },
    { title: 'Junior Neo-Laureato', exp: '0-1 anno', notes: 'Laurea con lode, progetti universitari, forte motivazione e ottima conoscenza dell\'inglese.' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Generatore Rapido CV AI
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Crea un CV completo, ottimizzato per ATS e pronto per la personalizzazione
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

        {/* Preset chips */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Profili Rapidi di Esempio:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Ruolo Target Desiderato</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Es. Senior UX/UI Designer"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Livello di Seniority</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              >
                <option value="0-1 anno (Junior)">0-1 anno (Junior)</option>
                <option value="2-4 anni (Mid-Level)">2-4 anni (Mid-Level)</option>
                <option value="5-8 anni (Senior)">5-8 anni (Senior)</option>
                <option value="8+ anni (Lead/Director)">8+ anni (Lead/Director)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Lingua di Redazione</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'it' | 'en')}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              >
                <option value="it">Italiano (Predefinito)</option>
                <option value="en">Inglese (Internazionale)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Note, Competenze Chiave o Esperienze Pregresse (Opzionale)
            </label>
            <textarea
              rows={3}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Indica aziende passate, progetti o competenze che desideri evidenziare..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white leading-relaxed"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-zinc-300">
            {errorMsg}
          </div>
        )}

        {/* Action button */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !role.trim()}
            className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Generazione in corso...' : 'Genera CV con AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
