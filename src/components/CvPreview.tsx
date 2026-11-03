import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  FileDown,
  Printer,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CVData, TemplateId, FontFamily, AccentColor } from '../types';
import { formatDateRange } from '../utils/cvLogic';
import { BRAND_LOGOS } from '../utils/brandLogos';

interface CvPreviewProps {
  cv: CVData;
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  font: FontFamily;
  setFont: (f: FontFamily) => void;
  accent: AccentColor;
  setAccent: (a: AccentColor) => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  onOpenCanvaGuide: () => void;
}

export const CvPreview: React.FC<CvPreviewProps> = ({
  cv,
  template,
  setTemplate,
  font,
  setFont,
  accent,
  setAccent,
  onDownloadPdf,
  isDownloading,
  onOpenCanvaGuide,
}) => {
  const [zoom, setZoom] = useState(75);

  const handlePrint = () => {
    window.print();
  };

  // Pure Minimalist Black & White Accent Mappings
  const accentClasses = {
    black: {
      primary: 'text-black',
      bgLight: 'bg-zinc-100 text-black border-zinc-300',
      border: 'border-black',
      headerBg: 'bg-black text-white',
      badgeBg: 'bg-zinc-100 text-black border border-zinc-300',
    },
    charcoal: {
      primary: 'text-zinc-900',
      bgLight: 'bg-zinc-100 text-zinc-900 border-zinc-300',
      border: 'border-zinc-800',
      headerBg: 'bg-zinc-900 text-white',
      badgeBg: 'bg-zinc-200 text-zinc-900',
    },
    graphite: {
      primary: 'text-zinc-800',
      bgLight: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      border: 'border-zinc-600',
      headerBg: 'bg-zinc-800 text-white',
      badgeBg: 'bg-zinc-100 text-zinc-800',
    },
    minimal: {
      primary: 'text-zinc-900',
      bgLight: 'bg-zinc-50 text-zinc-800 border-zinc-200',
      border: 'border-zinc-400',
      headerBg: 'bg-zinc-100 text-black border border-zinc-300',
      badgeBg: 'bg-zinc-100 text-zinc-700',
    },
    slate: {
      primary: 'text-zinc-900',
      bgLight: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      border: 'border-zinc-700',
      headerBg: 'bg-zinc-900 text-white',
      badgeBg: 'bg-zinc-200 text-zinc-800',
    },
    indigo: {
      primary: 'text-black',
      bgLight: 'bg-zinc-100 text-black border-zinc-300',
      border: 'border-black',
      headerBg: 'bg-black text-white',
      badgeBg: 'bg-zinc-100 text-black',
    },
    emerald: {
      primary: 'text-zinc-900',
      bgLight: 'bg-zinc-100 text-zinc-900 border-zinc-300',
      border: 'border-zinc-800',
      headerBg: 'bg-zinc-900 text-white',
      badgeBg: 'bg-zinc-200 text-zinc-900',
    },
    sky: {
      primary: 'text-zinc-800',
      bgLight: 'bg-zinc-100 text-zinc-800 border-zinc-200',
      border: 'border-zinc-600',
      headerBg: 'bg-zinc-800 text-white',
      badgeBg: 'bg-zinc-100 text-zinc-800',
    },
    rose: {
      primary: 'text-black',
      bgLight: 'bg-zinc-50 text-black border-zinc-200',
      border: 'border-zinc-900',
      headerBg: 'bg-black text-white',
      badgeBg: 'bg-zinc-100 text-black',
    },
  }[accent] || {
    primary: 'text-black',
    bgLight: 'bg-zinc-100 text-black border-zinc-300',
    border: 'border-black',
    headerBg: 'bg-black text-white',
    badgeBg: 'bg-zinc-100 text-black',
  };

  const fontClass = {
    'font-sans': 'font-sans',
    'font-serif': 'font-serif',
    'font-mono': 'font-mono text-[13px]',
  }[font];

  return (
    <div className="space-y-4">
      {/* Top Customizer Bar - Minimal Black & White */}
      <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm no-print">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Template:</span>
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setTemplate('milano-modern')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                template === 'milano-modern'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Milano B&W
            </button>
            <button
              onClick={() => setTemplate('executive-minimal')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                template === 'executive-minimal'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Executive ATS
            </button>
            <button
              onClick={() => setTemplate('creative-canva')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                template === 'creative-canva'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <img src={BRAND_LOGOS.canva} alt="Canva" className="w-3.5 h-3.5 object-contain" />
              <span>Canva-Ready</span>
            </button>
          </div>
        </div>

        {/* Minimalist Monochrome Tone Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Tono B&W:</span>
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'black', label: 'Nero Puro', dot: 'bg-black border border-zinc-500' },
              { id: 'charcoal', label: 'Antracite', dot: 'bg-zinc-800' },
              { id: 'graphite', label: 'Grafite', dot: 'bg-zinc-600' },
              { id: 'minimal', label: 'Minimal', dot: 'bg-zinc-400' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setAccent(c.id as AccentColor)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  accent === c.id
                    ? 'bg-zinc-800 text-white border border-zinc-600'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={c.label}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Font:</span>
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setFont('font-sans')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                font === 'font-sans' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sans
            </button>
            <button
              onClick={() => setFont('font-serif')}
              className={`px-2 py-0.5 rounded text-[10px] font-serif cursor-pointer ${
                font === 'font-serif' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => setFont('font-mono')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                font === 'font-mono' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mono
            </button>
          </div>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setZoom(Math.max(65, zoom - 15))}
            className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
            title="Riduci zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-zinc-300 font-mono w-10 text-center text-xs">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(130, zoom + 15))}
            className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
            title="Aumenta zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            aria-label="Scarica PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generazione...' : 'Scarica PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
            title="Stampa ad alta risoluzione vettoriale"
            aria-label="Stampa o Salva PDF nativo"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Stampa A4</span>
          </button>

          <button
            onClick={onOpenCanvaGuide}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            aria-label="Apri istruzioni Canva"
          >
            <img src={BRAND_LOGOS.canva} alt="Canva" className="w-3.5 h-3.5 object-contain" />
            <span>Modifica su Canva</span>
          </button>
        </div>
      </div>

      {/* A4 Paper Container with Zoom scale */}
      <div className="overflow-x-auto pb-8 flex justify-center bg-zinc-950 p-4 sm:p-8 rounded-2xl border border-zinc-800/80">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            marginBottom: zoom < 100 ? `calc((1123px * ${zoom / 100}) - 1123px)` : undefined,
          }}
          className="transition-transform duration-200"
        >
          {/* A4 Sheet: Standard 794px width (210mm @ 96dpi), min-height 1123px */}
          <div
            id="cv-preview-paper"
            className={`w-[794px] min-h-[1123px] bg-white text-black p-10 shadow-2xl rounded-xs ${fontClass} relative flex flex-col justify-between`}
          >
            {/* TEMPLATE 1: MILANO MODERN (SWISS B&W) */}
            {template === 'milano-modern' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b-2 border-black pb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-black uppercase">
                        {cv.personal.fullName || 'Il Tuo Nome'}
                      </h1>
                      <p className={`text-base font-bold mt-1 tracking-wide ${accentClasses.primary}`}>
                        {cv.personal.jobTitle || 'Titolo Professionale Target'}
                      </p>
                    </div>
                  </div>

                  {/* Contact row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3.5 text-xs text-zinc-700 font-medium">
                    {cv.personal.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-black" />
                        {cv.personal.email}
                      </span>
                    )}
                    {cv.personal.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-black" />
                        {cv.personal.phone}
                      </span>
                    )}
                    {cv.personal.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-black" />
                        {cv.personal.location}
                      </span>
                    )}
                    {cv.personal.linkedin && (
                      <span className="flex items-center gap-1 font-semibold text-black">
                        <Linkedin className="w-3 h-3 text-black" />
                        {cv.personal.linkedin}
                      </span>
                    )}
                    {cv.personal.website && (
                      <span className="flex items-center gap-1 text-black">
                        <Globe className="w-3 h-3 text-black" />
                        {cv.personal.website}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {cv.summary && (
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-200 pb-1">
                      Profilo Professionale
                    </h2>
                    <p className="text-xs leading-relaxed text-zinc-800 text-justify">
                      {cv.summary}
                    </p>
                  </div>
                )}

                {/* Main 2-column body */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column: Experience (8 cols) */}
                  <div className="col-span-8 space-y-5">
                    <div>
                      <h2 className={`text-xs font-black uppercase tracking-widest border-b pb-1 mb-3.5 ${accentClasses.border} ${accentClasses.primary}`}>
                        Esperienza Professionale
                      </h2>

                      <div className="space-y-4">
                        {cv.experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1.5">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-xs font-bold text-black">{exp.role}</h3>
                              <span className="text-[11px] font-semibold text-zinc-600">
                                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                              </span>
                            </div>
                            <div className="text-[11px] font-medium text-zinc-700 flex items-center justify-between">
                              <span className="font-semibold">{exp.company}</span>
                              <span className="text-zinc-500 italic">{exp.location}</span>
                            </div>

                            <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-zinc-800 leading-normal">
                              {exp.bullets?.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h2 className={`text-xs font-black uppercase tracking-widest border-b pb-1 mb-3 ${accentClasses.border} ${accentClasses.primary}`}>
                        Istruzione & Formazione
                      </h2>
                      <div className="space-y-3">
                        {cv.education.map((edu) => (
                          <div key={edu.id} className="text-xs space-y-0.5">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-bold text-black">{edu.degree}</h3>
                              <span className="text-[11px] text-zinc-600">
                                {edu.startDate} - {edu.endDate}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-zinc-700">
                              {edu.institution} {edu.location && `• ${edu.location}`}
                            </p>
                            {edu.field && <p className="text-[11px] text-zinc-600">{edu.field}</p>}
                            {edu.grade && (
                              <p className="text-[10px] font-semibold text-black">Voto: {edu.grade}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Skills, Languages, Certifications (4 cols) */}
                  <div className="col-span-4 space-y-5 border-l border-zinc-200 pl-4">
                    {/* Hard Skills */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-200 pb-1">
                        Competenze Tecniche
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {cv.hardSkills.map((s, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold ${accentClasses.badgeBg}`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-200 pb-1">
                        Soft Skills
                      </h2>
                      <ul className="text-xs text-zinc-800 space-y-1">
                        {cv.softSkills.map((s, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Languages */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-200 pb-1">
                        Lingue
                      </h2>
                      <div className="space-y-1.5 text-xs text-zinc-800">
                        {cv.languages.map((l, i) => (
                          <div key={i} className="text-[11px]">
                            <span className="font-bold text-black">{l.language}:</span>{' '}
                            <span className="text-zinc-600">{l.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    {cv.certifications.length > 0 && (
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 border-b border-zinc-200 pb-1">
                          Certificazioni
                        </h2>
                        <ul className="space-y-1.5 text-[10px] text-zinc-800">
                          {cv.certifications.map((c, i) => (
                            <li key={i} className="leading-snug font-medium text-black">
                              ✓ {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 2: EXECUTIVE MINIMAL (ATS MONOCHROME) */}
            {template === 'executive-minimal' && (
              <div className="space-y-5">
                {/* Centered Classic Header */}
                <div className="text-center border-b-2 border-black pb-4">
                  <h1 className="text-2xl font-serif font-bold tracking-normal text-black uppercase">
                    {cv.personal.fullName || 'Il Tuo Nome'}
                  </h1>
                  <p className="text-xs font-serif font-semibold italic text-zinc-800 mt-1">
                    {cv.personal.jobTitle}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-2 text-[11px] text-zinc-700 font-sans">
                    {cv.personal.location && <span>{cv.personal.location}</span>}
                    {cv.personal.phone && <span>• {cv.personal.phone}</span>}
                    {cv.personal.email && <span>• {cv.personal.email}</span>}
                    {cv.personal.linkedin && <span>• {cv.personal.linkedin}</span>}
                  </div>
                </div>

                {/* Summary */}
                {cv.summary && (
                  <div>
                    <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
                      Profilo
                    </h2>
                    <p className="text-[11px] text-zinc-800 leading-relaxed text-justify">
                      {cv.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div>
                  <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2.5">
                    Esperienza Lavorativa
                  </h2>
                  <div className="space-y-3.5">
                    {cv.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-black font-serif">
                            {exp.role} — <span className="font-normal italic">{exp.company}</span>
                          </span>
                          <span className="text-[11px] font-sans text-zinc-600">
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)} | {exp.location}
                          </span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-zinc-800 leading-normal">
                          {exp.bullets?.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                    Formazione Accademica
                  </h2>
                  <div className="space-y-2">
                    {cv.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="font-bold font-serif text-black">{edu.degree}</span> in{' '}
                          <span className="italic">{edu.field}</span> — {edu.institution}
                          {edu.grade && <span className="text-zinc-600"> ({edu.grade})</span>}
                        </div>
                        <span className="text-[11px] text-zinc-600">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Others */}
                <div className="pt-2">
                  <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
                    Competenze & Informazioni Aggiuntive
                  </h2>
                  <div className="text-[11px] text-zinc-800 space-y-1 leading-relaxed">
                    <p>
                      <strong>Competenze Tecniche:</strong> {cv.hardSkills.join(', ')}
                    </p>
                    <p>
                      <strong>Soft Skills:</strong> {cv.softSkills.join(', ')}
                    </p>
                    <p>
                      <strong>Lingue:</strong>{' '}
                      {cv.languages.map((l) => `${l.language} (${l.level})`).join(' • ')}
                    </p>
                    {cv.certifications.length > 0 && (
                      <p>
                        <strong>Certificazioni:</strong> {cv.certifications.join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: CANVA-READY MINIMALIST B&W */}
            {template === 'creative-canva' && (
              <div className="space-y-5">
                {/* Canva Header Bar - Pure Minimalist Black Box */}
                <div className={`p-6 rounded-lg ${accentClasses.headerBg} shadow-xs`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-black tracking-tight uppercase">{cv.personal.fullName}</h1>
                      <p className="text-sm font-semibold opacity-90 mt-0.5 tracking-wide">
                        {cv.personal.jobTitle}
                      </p>
                    </div>
                    {/* Placeholder Frame for Canva Photo */}
                    <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center text-[9px] font-mono text-center p-1 text-white/80">
                      Foto Canva
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs opacity-90">
                    <span>✉ {cv.personal.email}</span>
                    <span>☎ {cv.personal.phone}</span>
                    <span>📍 {cv.personal.location}</span>
                    <span>🔗 {cv.personal.linkedin}</span>
                  </div>
                </div>

                {/* Summary Card */}
                {cv.summary && (
                  <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 leading-relaxed">
                    <h3 className="font-bold text-black mb-1 uppercase tracking-wider text-[11px]">
                      Chi Sono & Profilo
                    </h3>
                    <p>{cv.summary}</p>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-8 space-y-4">
                    <h3 className="font-black text-xs uppercase tracking-wider text-black border-b border-black pb-1">
                      Percorso Lavorativo
                    </h3>
                    <div className="space-y-3.5">
                      {cv.experiences.map((exp) => (
                        <div key={exp.id} className="p-3 rounded-lg border border-zinc-200 space-y-1.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-black">{exp.role}</span>
                            <span className="text-[10px] font-semibold text-zinc-500">
                              {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-zinc-700">
                            {exp.company} • {exp.location}
                          </p>
                          <ul className="list-disc ml-4 space-y-1 text-[11px] text-zinc-800">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <h3 className="font-black text-xs uppercase tracking-wider text-black border-b border-black pb-1 pt-2">
                      Istruzione
                    </h3>
                    <div className="space-y-2">
                      {cv.education.map((edu) => (
                        <div key={edu.id} className="p-2.5 rounded-lg border border-zinc-200 text-xs">
                          <span className="font-bold text-black">{edu.degree}</span>
                          <p className="text-[11px] text-zinc-700">
                            {edu.institution} • {edu.startDate} - {edu.endDate} {edu.grade && `(${edu.grade})`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 space-y-4">
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
                        Competenze
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {cv.hardSkills.map((s, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${accentClasses.badgeBg}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                        Soft Skills
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {cv.softSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-xs text-[10px] bg-zinc-100 text-black font-medium border border-zinc-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                        Lingue
                      </h3>
                      <div className="space-y-1 text-xs text-zinc-800">
                        {cv.languages.map((l, i) => (
                          <p key={i} className="text-[11px]">
                            <strong>{l.language}:</strong> {l.level}
                          </p>
                        ))}
                      </div>
                    </div>

                    {cv.certifications.length > 0 && (
                      <div>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                          Certificati
                        </h3>
                        <ul className="text-[10px] text-zinc-800 space-y-1">
                          {cv.certifications.map((c, i) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy note & ATS tag at bottom of A4 */}
            <div className="border-t border-zinc-200 pt-3 text-[9px] text-zinc-400 text-center leading-tight">
              Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR). • Generato con CV (PDF) per Canva & Joinrs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
