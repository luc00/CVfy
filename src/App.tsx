import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Sparkles,
  Palette,
  Sliders,
  CheckCircle2,
  FileDown,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { CVData, TemplateId, FontFamily, AccentColor } from './types';
import { defaultCV } from './utils/initialData';
import { calculateAtsScore } from './utils/cvLogic';
import { BRAND_LOGOS } from './utils/brandLogos';
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
  const [accent, setAccent] = useState<AccentColor>('black');

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

      showToast(`PDF scaricato: ${fileName} pronto per Canva & Joinrs.`);
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Apertura finestra di stampa nativa A4...');
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
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

      {/* Minimal Roadmap Banner */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 py-3 px-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-bold text-white tracking-wide uppercase text-[11px]">
              Workflow:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-zinc-400">
            <div
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'editor' ? 'text-white font-bold' : 'hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>Crea CV AI</span>
            </div>
            <ArrowRight className="w-3 h-3 text-zinc-700 hidden sm:block" />

            <div
              onClick={() => setActiveTab('canva')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'canva' ? 'text-white font-bold' : 'hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <img src={BRAND_LOGOS.canva} alt="Canva" className="w-3.5 h-3.5 rounded-xs object-contain" />
              <span>Scarica PDF & Modifica su Canva</span>
            </div>
            <ArrowRight className="w-3 h-3 text-zinc-700 hidden sm:block" />

            <div
              onClick={() => setActiveTab('joinrs')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === 'joinrs' ? 'text-white font-bold' : 'hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              <img src={BRAND_LOGOS.joinrs} alt="Joinrs" className="w-3.5 h-3.5 rounded-xs object-contain" />
              <span>Allega su Joinrs & Attiva Agente</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCv(defaultCV)}
              className="text-zinc-500 hover:text-white flex items-center gap-1.5 text-[11px] cursor-pointer transition-colors"
              title="Reimposta dati di esempio"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Minimal Toast Feedback */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* View Switcher: Split on wide screens, tabbed on mobile/tablet */}
        <div className="space-y-6">
          {/* If Editor tab is active */}
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Editor */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-zinc-400" />
                    Compila i Tuoi Dati & Ottimizza
                  </h2>
                  <span className="text-xs text-zinc-500">Salvataggio automatico</span>
                </div>
                <CvEditor
                  cv={cv}
                  onChange={setCv}
                  onOpenWizard={() => setIsWizardOpen(true)}
                />
              </div>

              {/* Right Column: Live Sticky Mini-Preview */}
              <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-zinc-400" />
                    Anteprima A4 in Tempo Reale
                  </span>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="text-xs text-zinc-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Schermo Intero</span>
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
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 shrink-0">
                    <img
                      src={BRAND_LOGOS.canva}
                      alt="Canva"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Importazione e Modifica su Canva
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                        PDF Vettoriale A4
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Canva sblocca testo, font, titoli e icone convertendo il PDF in elementi grafici 100% editabili.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Scarica il PDF</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Genera il file A4 vettoriale con livelli strutturati.
                    </p>
                    <button
                      onClick={handleDownloadPdf}
                      className="mt-2 w-full py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all cursor-pointer"
                    >
                      Scarica PDF
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Accedi a Canva</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Apri Canva e trascina il PDF o clicca "Carica".
                    </p>
                    <a
                      href="https://www.canva.com/projects"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold transition-all"
                    >
                      <img src={BRAND_LOGOS.canva} alt="Canva" className="w-3.5 h-3.5 object-contain" />
                      <span>Apri Canva</span>
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Personalizza</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Inserisci la tua foto, rifinisci font o grafiche con gli strumenti di Canva.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Carica su Joinrs</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Esporta da Canva in PDF e allegalo su Joinrs per attivare l'agente di carriera.
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
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Centro Agente di Carriera Joinrs
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                        AI Matching
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Genera il prompt di configurazione, i pitch di candidatura e invia il tuo CV alle offerte compatibili.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsJoinrsAgentOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <img src={BRAND_LOGOS.joinrs} alt="Joinrs" className="w-4 h-4 object-contain" />
                  <span>Configura Agente Joinrs</span>
                </button>
              </div>

              {/* Render Joinrs interactive agent inline */}
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
