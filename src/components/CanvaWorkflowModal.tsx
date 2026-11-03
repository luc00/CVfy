import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Sparkles, ArrowRight, X } from 'lucide-react';
import { CVData } from '../types';
import { BRAND_LOGOS } from '../utils/brandLogos';

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
      desc: 'Il nostro PDF viene generato con livelli vettoriali puliti e testo nativo selezionabile, ottimizzato per il motore di importazione di Canva.',
      action: (
        <button
          onClick={onDownloadPdf}
          className="mt-2 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>Scarica il PDF Adesso</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ),
    },
    {
      num: '2',
      title: 'Apri Canva & Trascina il file',
      desc: 'Accedi su Canva.com, clicca in alto su "Carica" o trascina direttamente il file PDF appena scaricato.',
      action: (
        <a
          href="https://www.canva.com/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold transition-all shadow-sm"
        >
          <img src={BRAND_LOGOS.canva} alt="Canva" className="w-3.5 h-3.5 rounded-xs object-contain" />
          <span>Apri Canva (Importa PDF)</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
        </a>
      ),
    },
    {
      num: '3',
      title: 'Canva sblocca ogni elemento',
      desc: 'Canva trasforma automaticamente ogni titolo, blocco di testo ed elenco in livelli grafici 100% modificabili. Puoi aggiungere la tua foto, cambiare font e grafiche a piacere!',
      action: null,
    },
    {
      num: '4',
      title: 'Esporta per Joinrs',
      desc: 'Completata la personalizzazione grafica su Canva, clicca su "Condividi" -> "Scarica" -> "PDF Standard", e caricalo su Joinrs per attivare l\'Agente di Carriera!',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-100 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 shrink-0">
              <img
                src={BRAND_LOGOS.canva}
                alt="Canva"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Modifica il Tuo CV su Canva
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                  Importa PDF
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Guida rapida per convertire il PDF in grafica editabile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Chiudi guida Canva"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="space-y-3">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3.5 hover:border-zinc-700 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
                {st.num}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">{st.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
                {st.action}
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Pro Tip Callout */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 space-y-0.5">
            <span className="font-bold text-white">Consiglio Canva:</span>
            <p className="text-zinc-400">
              Una volta aperto il PDF su Canva, usa il menù "Elementi" per aggiungere una cornice rotonda per la foto profilo.
            </p>
          </div>
        </div>

        {/* Quick Clipboard Backup */}
        <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-zinc-400">
            Preferisci incollare direttamente i testi in una grafica già aperta?
          </span>
          <button
            onClick={handleCopyFormattedText}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
          >
            <img src={BRAND_LOGOS.canva} alt="Canva" className="w-3.5 h-3.5 object-contain" />
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiato!' : 'Copia Testo per Canva'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
