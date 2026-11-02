import React, { useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  FileDown,
  Printer,
  Sparkles,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { CVData, TemplateId, FontFamily, AccentColor } from '../types';
import { formatDateRange } from '../utils/cvLogic';

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
  const [zoom, setZoom] = React.useState(75);

  const handlePrint = () => {
    window.print();
  };

  // Accent styling mappings
  const accentClasses = {
    indigo: {
      primary: 'text-indigo-600',
      bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      border: 'border-indigo-600',
      headerBg: 'bg-indigo-700 text-white',
      badgeBg: 'bg-indigo-100 text-indigo-800',
    },
    emerald: {
      primary: 'text-emerald-700',
      bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      border: 'border-emerald-600',
      headerBg: 'bg-emerald-700 text-white',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
    sky: {
      primary: 'text-sky-700',
      bgLight: 'bg-sky-50 text-sky-800 border-sky-200',
      border: 'border-sky-600',
      headerBg: 'bg-sky-700 text-white',
      badgeBg: 'bg-sky-100 text-sky-800',
    },
    rose: {
      primary: 'text-rose-700',
      bgLight: 'bg-rose-50 text-rose-800 border-rose-200',
      border: 'border-rose-600',
      headerBg: 'bg-rose-700 text-white',
      badgeBg: 'bg-rose-100 text-rose-800',
    },
    slate: {
      primary: 'text-slate-800',
      bgLight: 'bg-slate-100 text-slate-800 border-slate-300',
      border: 'border-slate-800',
      headerBg: 'bg-slate-900 text-white',
      badgeBg: 'bg-slate-200 text-slate-800',
    },
  }[accent];

  const fontClass = {
    'font-sans': 'font-sans',
    'font-serif': 'font-serif',
    'font-mono': 'font-mono text-[13px]',
  }[font];

  return (
    <div className="space-y-4">
      {/* Top Customizer Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md no-print">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Template:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTemplate('milano-modern')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                template === 'milano-modern'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Milano Modern
            </button>
            <button
              onClick={() => setTemplate('executive-minimal')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                template === 'executive-minimal'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Executive ATS
            </button>
            <button
              onClick={() => setTemplate('creative-canva')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                template === 'creative-canva'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Canva-Ready
            </button>
          </div>
        </div>

        {/* Accent Colors */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Colore:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'indigo', bg: 'bg-indigo-600' },
              { id: 'emerald', bg: 'bg-emerald-600' },
              { id: 'sky', bg: 'bg-sky-600' },
              { id: 'rose', bg: 'bg-rose-600' },
              { id: 'slate', bg: 'bg-slate-800' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setAccent(c.id as AccentColor)}
                className={`w-5 h-5 rounded-full ${c.bg} transition-transform ${
                  accent === c.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title={c.id}
              />
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setZoom(Math.max(65, zoom - 15))}
            className="text-slate-400 hover:text-white p-0.5"
            title="Riduci zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-300 font-mono w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(130, zoom + 15))}
            className="text-slate-400 hover:text-white p-0.5"
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
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            aria-label="Scarica PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Scaricamento...' : 'Scarica PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            title="Stampa ad alta risoluzione vettoriale"
            aria-label="Stampa o Salva PDF nativo"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Stampa A4</span>
          </button>

          <button
            onClick={onOpenCanvaGuide}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1.5 transition-all"
            aria-label="Apri istruzioni Canva"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Importa su Canva</span>
          </button>
        </div>
      </div>

      {/* A4 Paper Container with Zoom scale */}
      <div className="overflow-x-auto pb-8 flex justify-center bg-slate-950/80 p-4 sm:p-8 rounded-2xl border border-slate-800/80">
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
            className={`w-[794px] min-h-[1123px] bg-white text-slate-900 p-10 shadow-2xl rounded-sm ${fontClass} relative flex flex-col justify-between`}
          >
            {/* TEMPLATE 1: MILANO MODERN */}
            {template === 'milano-modern' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b-2 border-slate-200 pb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                        {cv.personal.fullName || 'Il Tuo Nome'}
                      </h1>
                      <p className={`text-base font-bold mt-1 tracking-wide ${accentClasses.primary}`}>
                        {cv.personal.jobTitle || 'Titolo Professionale Target'}
                      </p>
                    </div>
                  </div>

                  {/* Contact row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3.5 text-xs text-slate-600">
                    {cv.personal.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {cv.personal.email}
                      </span>
                    )}
                    {cv.personal.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {cv.personal.phone}
                      </span>
                    )}
                    {cv.personal.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {cv.personal.location}
                      </span>
                    )}
                    {cv.personal.linkedin && (
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Linkedin className="w-3 h-3 text-slate-400" />
                        {cv.personal.linkedin}
                      </span>
                    )}
                    {cv.personal.website && (
                      <span className="flex items-center gap-1 text-slate-700">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {cv.personal.website}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {cv.summary && (
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                      Profilo Professionale
                    </h2>
                    <p className="text-xs leading-relaxed text-slate-700 text-justify">
                      {cv.summary}
                    </p>
                  </div>
                )}

                {/* Main 2-column or structured body */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column: Experience (7 cols) */}
                  <div className="col-span-8 space-y-5">
                    <div>
                      <h2 className={`text-xs font-black uppercase tracking-widest border-b pb-1 mb-3.5 ${accentClasses.border} ${accentClasses.primary}`}>
                        Esperienza Professionale
                      </h2>

                      <div className="space-y-4">
                        {cv.experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1.5">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                              <span className="text-[11px] font-semibold text-slate-500">
                                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                              </span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-600 flex items-center justify-between">
                              <span>{exp.company}</span>
                              <span className="text-slate-400 italic">{exp.location}</span>
                            </div>

                            <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 leading-normal">
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
                              <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                              <span className="text-[11px] text-slate-500">
                                {edu.startDate} - {edu.endDate}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600">
                              {edu.institution} {edu.location && `• ${edu.location}`}
                            </p>
                            {edu.field && <p className="text-[11px] text-slate-500">{edu.field}</p>}
                            {edu.grade && (
                              <p className="text-[10px] font-semibold text-indigo-700">Voto: {edu.grade}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Skills, Languages, Certifications (4 cols) */}
                  <div className="col-span-4 space-y-5 border-l border-slate-100 pl-4">
                    {/* Hard Skills */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                        Competenze Tecniche
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {cv.hardSkills.map((s, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${accentClasses.badgeBg}`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                        Soft Skills
                      </h2>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {cv.softSkills.map((s, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Languages */}
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                        Lingue
                      </h2>
                      <div className="space-y-1.5 text-xs text-slate-700">
                        {cv.languages.map((l, i) => (
                          <div key={i} className="text-[11px]">
                            <span className="font-bold text-slate-900">{l.language}:</span>{' '}
                            <span className="text-slate-600">{l.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    {cv.certifications.length > 0 && (
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                          Certificazioni
                        </h2>
                        <ul className="space-y-1.5 text-[10px] text-slate-700">
                          {cv.certifications.map((c, i) => (
                            <li key={i} className="leading-snug font-medium text-slate-800">
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

            {/* TEMPLATE 2: EXECUTIVE MINIMAL (CLASSIC ATS) */}
            {template === 'executive-minimal' && (
              <div className="space-y-5">
                {/* Centered Classic Header */}
                <div className="text-center border-b pb-4 border-slate-300">
                  <h1 className="text-2xl font-serif font-bold tracking-normal text-slate-950 uppercase">
                    {cv.personal.fullName || 'Il Tuo Nome'}
                  </h1>
                  <p className="text-xs font-serif font-semibold italic text-slate-700 mt-1">
                    {cv.personal.jobTitle}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-2 text-[11px] text-slate-600 font-sans">
                    {cv.personal.location && <span>{cv.personal.location}</span>}
                    {cv.personal.phone && <span>• {cv.personal.phone}</span>}
                    {cv.personal.email && <span>• {cv.personal.email}</span>}
                    {cv.personal.linkedin && <span>• {cv.personal.linkedin}</span>}
                  </div>
                </div>

                {/* Summary */}
                {cv.summary && (
                  <div>
                    <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5">
                      Profilo
                    </h2>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {cv.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div>
                  <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2.5">
                    Esperienza Lavorativa
                  </h2>
                  <div className="space-y-3.5">
                    {cv.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-slate-900 font-serif">
                            {exp.role} — <span className="font-normal italic">{exp.company}</span>
                          </span>
                          <span className="text-[11px] font-sans text-slate-600">
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)} | {exp.location}
                          </span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-800 leading-normal">
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
                  <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                    Formazione Accademica
                  </h2>
                  <div className="space-y-2">
                    {cv.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="font-bold font-serif text-slate-900">{edu.degree}</span> in{' '}
                          <span className="italic">{edu.field}</span> — {edu.institution}
                          {edu.grade && <span className="text-slate-600"> ({edu.grade})</span>}
                        </div>
                        <span className="text-[11px] text-slate-600">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Others */}
                <div className="pt-2">
                  <h2 className="text-xs font-serif font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2">
                    Competenze & Informazioni Aggiuntive
                  </h2>
                  <div className="text-[11px] text-slate-800 space-y-1 leading-relaxed">
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

            {/* TEMPLATE 3: CREATIVE CANVA-READY */}
            {template === 'creative-canva' && (
              <div className="space-y-5">
                {/* Canva Header Bar */}
                <div className={`p-6 rounded-xl ${accentClasses.headerBg} shadow-sm`}>
                  <h1 className="text-2xl font-black tracking-tight">{cv.personal.fullName}</h1>
                  <p className="text-sm font-semibold opacity-90 mt-0.5 tracking-wide">
                    {cv.personal.jobTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs opacity-90">
                    <span>✉ {cv.personal.email}</span>
                    <span>☎ {cv.personal.phone}</span>
                    <span>📍 {cv.personal.location}</span>
                    <span>🔗 {cv.personal.linkedin}</span>
                  </div>
                </div>

                {/* Summary Card */}
                {cv.summary && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <h3 className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[11px]">
                      Chi Sono & Obiettivo
                    </h3>
                    <p>{cv.summary}</p>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-8 space-y-4">
                    <h3 className={`font-black text-xs uppercase tracking-wider ${accentClasses.primary}`}>
                      Percorso Lavorativo
                    </h3>
                    <div className="space-y-3.5">
                      {cv.experiences.map((exp) => (
                        <div key={exp.id} className="p-3 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600">
                            {exp.company} • {exp.location}
                          </p>
                          <ul className="list-disc ml-4 space-y-1 text-[11px] text-slate-700">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <h3 className={`font-black text-xs uppercase tracking-wider pt-2 ${accentClasses.primary}`}>
                      Istruzione
                    </h3>
                    <div className="space-y-2">
                      {cv.education.map((edu) => (
                        <div key={edu.id} className="p-2.5 rounded-lg border border-slate-200 text-xs">
                          <span className="font-bold text-slate-900">{edu.degree}</span>
                          <p className="text-[11px] text-slate-600">
                            {edu.institution} • {edu.startDate} - {edu.endDate} {edu.grade && `(${edu.grade})`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 space-y-4">
                    <div>
                      <h3 className={`font-black text-xs uppercase tracking-wider mb-2 ${accentClasses.primary}`}>
                        Competenze
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {cv.hardSkills.map((s, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold ${accentClasses.badgeBg}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                        Soft Skills
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {cv.softSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                        Lingue
                      </h3>
                      <div className="space-y-1 text-xs text-slate-700">
                        {cv.languages.map((l, i) => (
                          <p key={i} className="text-[11px]">
                            <strong>{l.language}:</strong> {l.level}
                          </p>
                        ))}
                      </div>
                    </div>

                    {cv.certifications.length > 0 && (
                      <div>
                        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                          Certificati
                        </h3>
                        <ul className="text-[10px] text-slate-700 space-y-1">
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
            <div className="border-t border-slate-100 pt-3 text-[9px] text-slate-400 text-center leading-tight">
              Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR). • Generato con CVfy AI per Canva & Joinrs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
