import React from 'react';
import { Sparkles, FileDown, Palette, CheckCircle2, Sliders } from 'lucide-react';
import { AtsScoreResult } from '../types';
import { BRAND_LOGOS } from '../utils/brandLogos';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/90 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand with attached official logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 shadow-sm shrink-0">
            <img
              src={BRAND_LOGOS.appLogo}
              alt="CV (PDF) Logo"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">
                CV (PDF)
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <img
                  src={BRAND_LOGOS.canva}
                  alt="Canva"
                  className="w-3.5 h-3.5 rounded-xs object-contain"
                />
                <span className="font-semibold text-zinc-200">Canva</span>
                <span className="text-zinc-600">•</span>
                <img
                  src={BRAND_LOGOS.joinrs}
                  alt="Joinrs"
                  className="w-3.5 h-3.5 rounded-xs object-contain"
                />
                <span className="font-semibold text-zinc-200">Joinrs</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block tracking-wide">
              Minimal AI Builder • Esporta PDF • Modifica Canva • Agente Joinrs
            </p>
          </div>
        </div>

        {/* Minimal Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white text-black shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            }`}
            aria-label="Scheda Editor CV"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">1. Compila</span> CV
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-black shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            }`}
            aria-label="Scheda Anteprima & Stili"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden md:inline">2. Anteprima &</span> Stili
          </button>

          <button
            onClick={() => setActiveTab('canva')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'canva'
                ? 'bg-white text-black shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            }`}
            aria-label="Scheda Modifica su Canva"
          >
            <img
              src={BRAND_LOGOS.canva}
              alt="Canva Logo"
              className="w-3.5 h-3.5 rounded-xs object-contain"
            />
            <span>Canva</span>
          </button>

          <button
            onClick={() => setActiveTab('joinrs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'joinrs'
                ? 'bg-white text-black shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
            }`}
            aria-label="Scheda Agente Joinrs"
          >
            <img
              src={BRAND_LOGOS.joinrs}
              alt="Joinrs Logo"
              className="w-3.5 h-3.5 rounded-xs object-contain"
            />
            <span>Agente Joinrs</span>
          </button>
        </nav>

        {/* Minimal Actions & ATS score */}
        <div className="flex items-center gap-2">
          {/* ATS score pill */}
          <button
            onClick={onOpenAtsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors text-xs cursor-pointer text-zinc-300"
            title="Analisi ATS e raccomandazioni"
            aria-label={`Punteggio ATS ${atsResult.score} su 100`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-zinc-400 hidden lg:inline">ATS:</span>
            <span className="font-bold text-white">{atsResult.score}/100</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
              {atsResult.grade}
            </span>
          </button>

          {/* AI Wizard button */}
          <button
            onClick={onOpenWizard}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
            aria-label="Crea CV con AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>AI Wizard</span>
          </button>

          {/* Download PDF button */}
          <button
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-60"
            aria-label="Scarica PDF del Curriculum"
          >
            <FileDown className="w-3.5 h-3.5 text-black" />
            <span>{isDownloading ? 'Generazione...' : 'Scarica PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
