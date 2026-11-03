import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Building2,
  MapPin,
  TrendingUp,
  Sliders,
  Send,
  X,
} from 'lucide-react';
import { CVData, JoinrsPreferences, JoinrsAgentOutput } from '../types';
import { BRAND_LOGOS } from '../utils/brandLogos';

interface JoinrsAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CVData;
  onDownloadPdf: () => void;
  isInline?: boolean;
}

export const JoinrsAgentModal: React.FC<JoinrsAgentModalProps> = ({
  isOpen,
  onClose,
  cv,
  onDownloadPdf,
  isInline = false,
}) => {
  const [preferences, setPreferences] = useState<JoinrsPreferences>({
    targetRole: cv.personal.jobTitle || 'Digital Product Manager',
    workModel: 'Ibrido',
    targetCities: ['Milano', 'Remoto Italia'],
    seniority: 'Mid-Level (2-5 anni)',
    salaryRange: '€32.000 - €42.000',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [agentOutput, setAgentOutput] = useState<JoinrsAgentOutput | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  // Sync role if empty
  useEffect(() => {
    if (!preferences.targetRole && cv.personal.jobTitle) {
      setPreferences((p) => ({ ...p, targetRole: cv.personal.jobTitle }));
    }
  }, [cv.personal.jobTitle]);

  const handleGenerateAgent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/joinrs-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData: cv,
          preferences,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setAgentOutput(data.data);
      }
    } catch (err) {
      console.error('Failed to generate Joinrs agent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate on first open if null
  useEffect(() => {
    if (isOpen && !agentOutput && !isLoading) {
      handleGenerateAgent();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    if (!agentOutput) return;
    navigator.clipboard.writeText(agentOutput.systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleCopyPitch = () => {
    if (!agentOutput) return;
    navigator.clipboard.writeText(agentOutput.candidatePitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleApplySimulated = (companyName: string) => {
    setAppliedJobs((prev) => ({ ...prev, [companyName]: true }));
  };

  const content = (
    <div
      className={`relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl text-zinc-100 space-y-6 ${
        isInline ? 'mx-auto' : 'my-6'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 shrink-0">
            <img
              src={BRAND_LOGOS.joinrs}
              alt="Joinrs"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Agente AI Personalizzato per Joinrs
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                Match Ottimizzato
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configura i criteri di ricerca, genera il prompt per l'assistente Joinrs e ottieni pitch di candidatura immediati.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Chiudi finestra Agente Joinrs"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 1. Preferenze di Ricerca Agente */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            Parametri di Ricerca per l'Agente Joinrs
          </span>
          <button
            onClick={handleGenerateAgent}
            disabled={isLoading}
            className="px-3 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Elaborazione AI...' : 'Aggiorna Agente'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Ruolo Target</label>
            <input
              type="text"
              value={preferences.targetRole}
              onChange={(e) => setPreferences({ ...preferences, targetRole: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Modalità di Lavoro</label>
            <select
              value={preferences.workModel}
              onChange={(e) =>
                setPreferences({ ...preferences, workModel: e.target.value as any })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            >
              <option value="Ibrido">Ibrido (2-3 gg remoto)</option>
              <option value="Full Remote">Full Remote</option>
              <option value="In Sede">In Sede</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Seniority</label>
            <select
              value={preferences.seniority}
              onChange={(e) =>
                setPreferences({ ...preferences, seniority: e.target.value as any })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            >
              <option value="Junior (0-2 anni)">Junior / Entry Level (0-2 anni)</option>
              <option value="Mid-Level (2-5 anni)">Mid-Level (2-5 anni)</option>
              <option value="Senior (5+ anni)">Senior (5+ anni)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Range Retributivo (RAL)</label>
            <input
              type="text"
              value={preferences.salaryRange}
              onChange={(e) => setPreferences({ ...preferences, salaryRange: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Agent Artifacts Generated */}
      {agentOutput && (
        <div className="space-y-5">
          {/* Split row: System Prompt & Candidate Pitch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Joinrs Agent System Prompt */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <img src={BRAND_LOGOS.joinrs} alt="Joinrs" className="w-4 h-4 object-contain" />
                    Prompt di Configurazione per Joinrs
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-zinc-700"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'Copiato!' : 'Copia Prompt'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Istruzioni da incollare nell'assistente o nella sezione profilo di Joinrs:
                </p>
                <div className="mt-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed max-h-36 overflow-y-auto">
                  {agentOutput.systemPrompt}
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 flex items-center gap-1 pt-1">
                <Check className="w-3 h-3 text-white" /> Ottimizzato per l'algoritmo di matching AI di Joinrs
              </div>
            </div>

            {/* Box 2: Candidate Pitch */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <img src={BRAND_LOGOS.joinrs} alt="Joinrs" className="w-4 h-4 object-contain" />
                    Pitch Rapido di Presentazione
                  </span>
                  <button
                    onClick={handleCopyPitch}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-zinc-700"
                  >
                    {copiedPitch ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPitch ? 'Copiato!' : 'Copia Pitch'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Messaggio di accompagnamento ad alto impatto per distinguerti al momento dell'invio:
                </p>
                <div className="mt-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto">
                  "{agentOutput.candidatePitch}"
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 flex items-center gap-1 pt-1">
                <Check className="w-3 h-3 text-white" /> Lunghezza calibrata per recruiter digitali
              </div>
            </div>
          </div>

          {/* 3. Joinrs ATS Score & Tips */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-zinc-400" />
                Indice di Compatibilità Algoritmo Joinrs: {agentOutput.atsScore}%
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">Screening Automatico Idoneo</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-zinc-300">
              {agentOutput.atsOptimizationTips.map((tip, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Simulatore di Opportunità Joinrs */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-400" />
                Opportunità Raccomandate dall'Agente per Te
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Posizioni individuate basate sulle competenze del tuo CV
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {agentOutput.matchedCompanyTypes.map((job, idx) => {
                const isApplied = appliedJobs[job.company];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-white">{job.role}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 shrink-0">
                          {job.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-300">{job.company}</p>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {job.location} • {job.sector}
                      </p>
                      <p className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded-lg border border-zinc-800 leading-relaxed">
                        💡 <em>{job.whyFit}</em>
                      </p>
                    </div>

                    <button
                      onClick={() => handleApplySimulated(job.company)}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isApplied
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : 'bg-white hover:bg-zinc-200 text-black shadow-xs'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Candidatura Inviata con CV!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Invia CV con Pitch</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onDownloadPdf}
          className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <img src={BRAND_LOGOS.joinrs} alt="Joinrs" className="w-4 h-4 object-contain" />
          <span>Scarica CV Ottimizzato (PDF)</span>
        </button>

        <a
          href="https://www.joinrs.com/it/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-sm transition-all"
        >
          <img src={BRAND_LOGOS.joinrs} alt="Joinrs" className="w-4 h-4 object-contain" />
          <span>Accedi a Joinrs & Attiva Agente</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {content}
    </div>
  );
};
