import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Sparkles,
  Palette,
  Bot,
  Sliders,
  CheckCircle2,
  FileDown,
  Layers,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { CVData, TemplateId, FontFamily, AccentColor } from './types';
import { defaultCV } from './utils/initialData';
import { calculateAtsScore } from './utils/cvLogic';
import { Navbar } from './components/Navbar';
import { CvEditor } from './components/CvEditor';
import { CvPreview } from './components/CvPreview';
import { CanvaWorkflowModal } from './components/CanvaWorkflowModal';
import { JoinrsAgentModal } from './components/JoinrsAgentModal';
import { AiWizardModal } from './components/AiWizardModal';
import { AtsAnalysisModal } from './components/AtsAnalysisModal';

export default function App() {
  const [cv, setCv] = useState<CVData>(defaultCV);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'canva' | 'joinrs'>('editor');
  const [template, setTemplate] = useState<TemplateId>('milano-modern');
  const [font, setFont] = useState<FontFamily>('font-sans');
  const [accent, setAccent] = useState<AccentColor>('indigo');

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isCanvaGuideOpen, setIsCanvaGuideOpen] = useState(false);
  const [isJoinrsAgentOpen, setIsJoinrsAgentOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Calculate live ATS score
  const atsResult = useMemo(() => calculateAtsScore(cv), [cv]);

  // Show temporary toast
  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // High-fidelity PDF generation
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    showToast('Generazione PDF in corso...');
    try {
      const paperElement = document.getElementById('cv-preview-paper');
      if (!paperElement) {
        throw new Error('Elemento CV non trovato.');
      }

      // Render canvas at 2x scale for crisp text on Canva import
      const canvas = await html2canvas(paperElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      const fileName = `CV_${(cv.personal.fullName || 'Candidato').replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      showToast(`PDF scaricato con successo: ${fileName}! Pronto per Canva & Joinrs.`);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: trigger print
      showToast('Apertura finestra di stampa nativa A4...');
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        atsResult={atsResult}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenAtsModal={() => setIsAtsModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        isDownloading={isDownloading}
      />

      {/* Hero Pipeline Roadmap Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800/80 py-3 px-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span className="font-bold text-white">Il Tuo Flusso di Successo:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-300">
            <div
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors ${
                activeTab === 'editor' ? 'text-indigo-400 font-bold' : ''
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>Crea CV con AI</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:block" />

            <div
              onClick={() => {
                setActiveTab('preview');
                setIsCanvaGuideOpen(true);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-400 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span>Scarica PDF & Modifica su Canva</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:block" />

            <div
              onClick={() => {
                setActiveTab('preview');
                setIsJoinrsAgentOpen(true);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-400 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <span>Allega su Joinrs & Attiva Agente</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCv(defaultCV)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
              title="Reimposta dati di esempio"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Dati</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Toast Feedback */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* View Switcher: Split on wide screens, tabbed on mobile/tablet */}
        <div className="space-y-6">
          {/* If Editor tab is active */}
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Comprehensive Form Editor */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Compila i Tuoi Dati & Potenzia con AI
                  </h2>
                  <span className="text-xs text-slate-400">Salvataggio automatico</span>
                </div>
                <CvEditor
                  cv={cv}
                  onChange={setCv}
                  onOpenWizard={() => setIsWizardOpen(true)}
                />
              </div>

              {/* Right Column: Live Sticky Mini-Preview */}
              <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-400" />
                    Anteprima in Tempo Reale
                  </span>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Espandi a Schermo Intero</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <CvPreview
                  cv={cv}
                  template={template}
                  setTemplate={setTemplate}
                  font={font}
                  setFont={setFont}
                  accent={accent}
                  setAccent={setAccent}
                  onDownloadPdf={handleDownloadPdf}
                  isDownloading={isDownloading}
                  onOpenCanvaGuide={() => setIsCanvaGuideOpen(true)}
                />
              </div>
            </div>
          )}

          {/* If Preview tab is active */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <CvPreview
                cv={cv}
                template={template}
                setTemplate={setTemplate}
                font={font}
                setFont={setFont}
                accent={accent}
                setAccent={setAccent}
                onDownloadPdf={handleDownloadPdf}
                isDownloading={isDownloading}
                onOpenCanvaGuide={() => setIsCanvaGuideOpen(true)}
              />
            </div>
          )}

          {/* If Canva tab is active */}
          {activeTab === 'canva' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Guida all'Importazione e Modifica su Canva
                    </h2>
                    <p className="text-xs text-slate-400">
                      Canva dispone della funzione "Importa PDF" per trasformare questo documento in livelli grafici sbloccati.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-white">Scarica il PDF</h3>
                    <p className="text-xs text-slate-400">
                      Usa il pulsante qui sotto per ottenere il file A4 pronto.
                    </p>
                    <button
                      onClick={handleDownloadPdf}
                      className="mt-2 w-full py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                    >
                      Scarica PDF
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-white">Accedi a Canva</h3>
                    <p className="text-xs text-slate-400">
                      Vai nella tua dashboard Canva e clicca "Carica".
                    </p>
                    <a
                      href="https://www.canva.com/projects"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold"
                    >
                      <span>Apri Canva</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-white">Personalizza la Grafica</h3>
                    <p className="text-xs text-slate-400">
                      Canva sblocca font, colori, icone e ti consente di aggiungere foto profilo in 1 click.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <h3 className="text-sm font-bold text-white">Carica su Joinrs</h3>
                    <p className="text-xs text-slate-400">
                      Esporta il PDF definitivo e allegalo al tuo account Joinrs per attivare l'agente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Show preview underneath */}
              <CvPreview
                cv={cv}
                template={template}
                setTemplate={setTemplate}
                font={font}
                setFont={setFont}
                accent={accent}
                setAccent={setAccent}
                onDownloadPdf={handleDownloadPdf}
                isDownloading={isDownloading}
                onOpenCanvaGuide={() => setIsCanvaGuideOpen(true)}
              />
            </div>
          )}

          {/* If Joinrs tab is active */}
          {activeTab === 'joinrs' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Centro Agente di Carriera Joinrs
                    </h2>
                    <p className="text-xs text-slate-300">
                      Genera la configurazione, il prompt intelligente e i pitch di candidatura automatica per trovare il lavoro ideale su Joinrs.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsJoinrsAgentOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Configura & Visualizza Agente Joinrs</span>
                </button>
              </div>

              {/* Render Joinrs interactive agent right on the page */}
              <JoinrsAgentModal
                isOpen={true}
                onClose={() => setActiveTab('editor')}
                cv={cv}
                onDownloadPdf={handleDownloadPdf}
                isInline={true}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AiWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyGeneratedCv={(newCv) => {
          setCv(newCv);
          showToast('Curriculum generato con successo!');
        }}
      />

      <CanvaWorkflowModal
        isOpen={isCanvaGuideOpen && activeTab !== 'canva'}
        onClose={() => setIsCanvaGuideOpen(false)}
        cv={cv}
        onDownloadPdf={handleDownloadPdf}
      />

      {activeTab !== 'joinrs' && (
        <JoinrsAgentModal
          isOpen={isJoinrsAgentOpen}
          onClose={() => setIsJoinrsAgentOpen(false)}
          cv={cv}
          onDownloadPdf={handleDownloadPdf}
        />
      )}

      <AtsAnalysisModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        atsResult={atsResult}
      />
    </div>
  );
}
