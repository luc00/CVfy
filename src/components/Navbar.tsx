import React from 'react';
import { Sparkles, FileDown, Palette, Bot, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';
import { AtsScoreResult } from '../types';

interface NavbarProps {
  activeTab: 'editor' | 'preview' | 'canva' | 'joinrs';
  setActiveTab: (tab: 'editor' | 'preview' | 'canva' | 'joinrs') => void;
  atsResult: AtsScoreResult;
  onOpenWizard: () => void;
  onOpenAtsModal: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  atsResult,
  onOpenWizard,
  onOpenAtsModal,
  onDownloadPdf,
  isDownloading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
            CV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">CVfy AI</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Canva & Joinrs Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Curriculum con AI • Modifica su Canva • Trova lavoro su Joinrs
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="Scheda Editor CV"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">1. Compila</span> CV
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="Scheda Anteprima & Stili"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden md:inline">2. Anteprima &</span> Stili
          </button>

          <button
            onClick={() => setActiveTab('canva')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'canva'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="Scheda Modifica su Canva"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Guida Canva
          </button>

          <button
            onClick={() => setActiveTab('joinrs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'joinrs'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            aria-label="Scheda Agente Joinrs"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            Agente Joinrs
          </button>
        </nav>

        {/* Actions & ATS badge */}
        <div className="flex items-center gap-2">
          {/* ATS score pill */}
          <button
            onClick={onOpenAtsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors text-xs"
            title="Analisi ATS e raccomandazioni"
            aria-label={`Punteggio ATS ${atsResult.score} su 100`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${atsResult.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-400 hidden lg:inline">ATS:</span>
            <span className="font-bold text-white">{atsResult.score}/100</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
              {atsResult.grade}
            </span>
          </button>

          {/* AI Wizard button */}
          <button
            onClick={onOpenWizard}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            aria-label="Crea CV con AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Wizard</span>
          </button>

          {/* Download PDF button */}
          <button
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60"
            aria-label="Scarica PDF del Curriculum"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isDownloading ? 'Generazione...' : 'Scarica PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
