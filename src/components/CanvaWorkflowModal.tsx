import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, Layers, Palette, FileText, ArrowRight, X } from 'lucide-react';
import { CVData } from '../types';

interface CanvaWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CVData;
  onDownloadPdf: () => void;
}

export const CanvaWorkflowModal: React.FC<CanvaWorkflowModalProps> = ({
  isOpen,
  onClose,
  cv,
  onDownloadPdf,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Scarica il PDF dal nostro sito',
      desc: 'Il nostro PDF viene generato con livelli vettoriali puliti e testo nativo selezionabile, appositamente ottimizzato per il motore di importazione di Canva.',
      action: (
        <button
          onClick={onDownloadPdf}
          className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>Scarica il PDF Adesso</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ),
    },
    {
      num: '2',
      title: 'Apri Canva & Trascina il file',
      desc: 'Accedi su Canva.com, clicca in alto a destra su "Carica" o "Importa file" (oppure trascina direttamente il PDF nella home page di Canva).',
      action: (
        <a
          href="https://www.canva.com/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>Apri Canva (Importa PDF)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ),
    },
    {
      num: '3',
      title: 'Canva sblocca ogni elemento',
      desc: 'Canva trasforma automaticamente ogni titolo, blocco di testo, colore ed elenco in livelli grafici 100% modificabili. Puoi aggiungere la tua foto, cambiare font e grafiche a piacere!',
      action: null,
    },
    {
      num: '4',
      title: 'Esporta per Joinrs',
      desc: 'Quando hai completato il restyling grafico su Canva, clicca su "Condividi" -> "Scarica" -> seleziona formato "PDF Standard", e caricalo su Joinrs per attivare l\'Agente di Carriera!',
      action: null,
    },
  ];

  const handleCopyFormattedText = () => {
    const text = `${cv.personal.fullName}
${cv.personal.jobTitle}
${cv.personal.email} | ${cv.personal.phone} | ${cv.personal.location} | ${cv.personal.linkedin}

SOMMARIO
${cv.summary}

ESPERIENZE LAVORATIVE
${cv.experiences
  .map(
    (e) => `${e.role} presso ${e.company} (${e.startDate} - ${e.current ? 'Presente' : e.endDate})
${e.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

FORMAZIONE
${cv.education.map((ed) => `${ed.degree} - ${ed.institution} (${ed.startDate} - ${ed.endDate})`).join('\n')}

COMPETENZE
Hard skills: ${cv.hardSkills.join(', ')}
Soft skills: ${cv.softSkills.join(', ')}

LINGUE
${cv.languages.map((l) => `${l.language}: ${l.level}`).join(', ')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Come Modificare il tuo CV su Canva
              </h2>
              <p className="text-xs text-slate-400">
                Guida ufficiale all'importazione e personalizzazione grafica
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Chiudi guida Canva"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="space-y-3.5">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0 mt-0.5">
                {st.num}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-semibold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                {st.action}
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip Callout */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-cyan-300">Suggerimento per Canva:</span>
            <p>
              Una volta caricato il PDF su Canva, puoi cercare tra gli elementi grafici "cornice circolare" per inserire la tua foto profilo con un semplice trascinamento.
            </p>
          </div>
        </div>

        {/* Quick Clipboard Backup */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Preferisci incollare direttamente i testi nelle caselle di Canva?
          </span>
          <button
            onClick={handleCopyFormattedText}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Testo CV Copiato!' : 'Copia Testo per Canva'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
