import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';
import { CVData, ExperienceItem, EducationItem } from '../types';

interface CvEditorProps {
  cv: CVData;
  onChange: (updated: CVData) => void;
  onOpenWizard: () => void;
}

export const CvEditor: React.FC<CvEditorProps> = ({ cv, onChange, onOpenWizard }) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'summary' | 'exp' | 'edu' | 'skills' | 'langs'>('personal');
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<string[]>([]);
  const [optimizingExpId, setOptimizingExpId] = useState<string | null>(null);
  const [newHardSkill, setNewHardSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  // Update Personal
  const handlePersonalChange = (field: keyof CVData['personal'], value: string) => {
    onChange({
      ...cv,
      personal: { ...cv.personal, [field]: value },
    });
  };

  // AI Enhance Summary
  const handleEnhanceSummary = async () => {
    setIsEnhancingSummary(true);
    try {
      const res = await fetch('/api/gemini/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSummary: cv.summary,
          role: cv.personal.jobTitle,
        }),
      });
      const data = await res.json();
      if (data.options && data.options.length > 0) {
        setSummaryOptions(data.options);
      }
    } catch (err) {
      console.error('Enhance summary failed:', err);
    } finally {
      setIsEnhancingSummary(false);
    }
  };

  // AI Optimize Experience Bullets
  const handleOptimizeBullets = async (expId: string, role: string, company: string, currentBullets: string[]) => {
    setOptimizingExpId(expId);
    try {
      const res = await fetch('/api/gemini/optimize-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          company,
          roughTasks: currentBullets.join('. '),
        }),
      });
      const data = await res.json();
      if (data.bullets && data.bullets.length > 0) {
        const updatedExps = cv.experiences.map((exp) =>
          exp.id === expId ? { ...exp, bullets: data.bullets } : exp
        );
        onChange({ ...cv, experiences: updatedExps });
      }
    } catch (err) {
      console.error('Optimize bullets failed:', err);
    } finally {
      setOptimizingExpId(null);
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Nuova Azienda',
      role: 'Ruolo / Posizione',
      location: 'Città, Italia',
      startDate: '2023',
      endDate: '',
      current: true,
      bullets: ['Responsabile delle attività operative e di coordinamento del progetto.'],
    };
    onChange({ ...cv, experiences: [newExp, ...cv.experiences] });
  };

  const handleUpdateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    const updated = cv.experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...cv, experiences: updated });
  };

  const handleRemoveExperience = (id: string) => {
    onChange({
      ...cv,
      experiences: cv.experiences.filter((exp) => exp.id !== id),
    });
  };

  // Bullet handlers
  const handleAddBullet = (expId: string) => {
    const exp = cv.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const bullets = [...exp.bullets, 'Nuovo obiettivo o risultato misurabile conseguito.'];
    handleUpdateExperience(expId, 'bullets', bullets);
  };

  const handleUpdateBullet = (expId: string, index: number, value: string) => {
    const exp = cv.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const bullets = [...exp.bullets];
    bullets[index] = value;
    handleUpdateExperience(expId, 'bullets', bullets);
  };

  const handleRemoveBullet = (expId: string, index: number) => {
    const exp = cv.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const bullets = exp.bullets.filter((_, i) => i !== index);
    handleUpdateExperience(expId, 'bullets', bullets);
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'Università o Istituto',
      degree: 'Laurea o Diploma',
      field: 'Area di studio',
      location: 'Città',
      startDate: '2020',
      endDate: '2023',
      grade: '110/110',
    };
    onChange({ ...cv, education: [...cv.education, newEdu] });
  };

  const handleUpdateEducation = (id: string, field: keyof EducationItem, value: any) => {
    const updated = cv.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...cv, education: updated });
  };

  const handleRemoveEducation = (id: string) => {
    onChange({
      ...cv,
      education: cv.education.filter((edu) => edu.id !== id),
    });
  };

  // Skills
  const handleAddHardSkill = () => {
    if (!newHardSkill.trim()) return;
    if (!cv.hardSkills.includes(newHardSkill.trim())) {
      onChange({ ...cv, hardSkills: [...cv.hardSkills, newHardSkill.trim()] });
    }
    setNewHardSkill('');
  };

  const handleRemoveHardSkill = (skill: string) => {
    onChange({
      ...cv,
      hardSkills: cv.hardSkills.filter((s) => s !== skill),
    });
  };

  const handleAddSoftSkill = () => {
    if (!newSoftSkill.trim()) return;
    if (!cv.softSkills.includes(newSoftSkill.trim())) {
      onChange({ ...cv, softSkills: [...cv.softSkills, newSoftSkill.trim()] });
    }
    setNewSoftSkill('');
  };

  const handleRemoveSoftSkill = (skill: string) => {
    onChange({
      ...cv,
      softSkills: cv.softSkills.filter((s) => s !== skill),
    });
  };

  // Languages
  const handleAddLanguage = () => {
    onChange({
      ...cv,
      languages: [...cv.languages, { language: 'Nuova Lingua', level: 'B2 - Intermedio' }],
    });
  };

  const handleUpdateLanguage = (index: number, field: 'language' | 'level', val: string) => {
    const updated = [...cv.languages];
    updated[index][field] = val;
    onChange({ ...cv, languages: updated });
  };

  const handleRemoveLanguage = (index: number) => {
    onChange({
      ...cv,
      languages: cv.languages.filter((_, i) => i !== index),
    });
  };

  // Certifications
  const handleAddCert = () => {
    if (!newCert.trim()) return;
    onChange({ ...cv, certifications: [...cv.certifications, newCert.trim()] });
    setNewCert('');
  };

  const handleRemoveCert = (index: number) => {
    onChange({
      ...cv,
      certifications: cv.certifications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* Minimal AI Quick Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Assistente AI</h3>
            <p className="text-xs text-zinc-400">
              Genera o compila l'intero CV da zero per il tuo ruolo target
            </p>
          </div>
        </div>
        <button
          onClick={onOpenWizard}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          aria-label="Apri generatore rapido AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generatore Rapido AI</span>
        </button>
      </div>

      {/* Minimal Section Accordions */}
      <div className="space-y-2.5">
        {/* 1. Dati Personali */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === 'personal' ? ('' as any) : 'personal')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={activeSection === 'personal'}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-100">
                1. Dati Personali & Contatti
              </span>
            </div>
            {activeSection === 'personal' ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {activeSection === 'personal' && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome e Cognome</label>
                <input
                  type="text"
                  value={cv.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  placeholder="Es. Marco Rossi"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Titolo Professionale Target</label>
                <input
                  type="text"
                  value={cv.personal.jobTitle}
                  onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                  placeholder="Es. Senior Product Manager"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={cv.personal.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  placeholder="m.rossi@email.it"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Telefono</label>
                <input
                  type="tel"
                  value={cv.personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  placeholder="+39 347 123 4567"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Città & Nazione</label>
                <input
                  type="text"
                  value={cv.personal.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  placeholder="Milano, Italia"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Profilo LinkedIn</label>
                <input
                  type="text"
                  value={cv.personal.linkedin}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/marcorossi"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">Sito Web / Portfolio (Opzionale)</label>
                <input
                  type="text"
                  value={cv.personal.website || ''}
                  onChange={(e) => handlePersonalChange('website', e.target.value)}
                  placeholder="marcorossi.it o github.com/marcorossi"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Profilo Professionale / Summary */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === 'summary' ? ('' as any) : 'summary')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={activeSection === 'summary'}
          >
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-100">
                2. Sommario Professionale (Bio)
              </span>
            </div>
            {activeSection === 'summary' ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {activeSection === 'summary' && (
            <div className="p-4 space-y-3 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {cv.summary ? cv.summary.trim().split(/\s+/).length : 0} parole (consigliate: 35-60)
                </span>
                <button
                  onClick={handleEnhanceSummary}
                  disabled={isEnhancingSummary}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Migliora bio con AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                  <span>{isEnhancingSummary ? 'Generazione...' : 'Ottimizza Bio con AI'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={cv.summary}
                onChange={(e) => onChange({ ...cv, summary: e.target.value })}
                placeholder="Descrivi brevemente il tuo percorso, i punti di forza e gli obiettivi professionali..."
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white leading-relaxed"
              />

              {/* AI Suggestions dropdown if available */}
              {summaryOptions.length > 0 && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-700 space-y-2">
                  <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-white" /> Opzioni generate (clicca per applicare):
                  </span>
                  <div className="space-y-2">
                    {summaryOptions.map((opt, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          onChange({ ...cv, summary: opt });
                          setSummaryOptions([]);
                        }}
                        className="p-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 cursor-pointer text-xs text-zinc-300 hover:text-white transition-all flex items-start justify-between gap-2"
                      >
                        <p className="leading-relaxed">{opt}</p>
                        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] bg-white text-black font-semibold">
                          Usa questa
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Esperienze Lavorative */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === 'exp' ? ('' as any) : 'exp')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={activeSection === 'exp'}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-100">
                3. Esperienze Lavorative ({cv.experiences.length})
              </span>
            </div>
            {activeSection === 'exp' ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {activeSection === 'exp' && (
            <div className="p-4 space-y-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-500">
                  Usa il metodo STAR (Azione + Risultato) per ciascun punto
                </p>
                <button
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  aria-label="Aggiungi nuova esperienza"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Aggiungi Esperienza</span>
                </button>
              </div>

              {cv.experiences.map((exp, expIdx) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Esperienza #{expIdx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Elimina esperienza"
                      aria-label={`Elimina esperienza ${exp.role}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">Ruolo</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                        placeholder="Es. Senior Specialist"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">Azienda</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Nome Azienda"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">Località</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                        placeholder="Milano, Italia (o Remoto)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Data Inizio</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="2022"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Data Fine</label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? 'Presente' : exp.endDate}
                          onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="2024"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => handleUpdateExperience(exp.id, 'current', e.target.checked)}
                      className="rounded border-zinc-700 text-black focus:ring-0"
                    />
                    <label htmlFor={`current-${exp.id}`} className="text-xs text-zinc-300">
                      Lavoro attualmente in questa posizione
                    </label>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300">
                        Punti elenco & Risultati misurabili ({exp.bullets?.length || 0})
                      </span>
                      <button
                        onClick={() => handleOptimizeBullets(exp.id, exp.role, exp.company, exp.bullets || [])}
                        disabled={optimizingExpId === exp.id}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-medium flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                        aria-label="Genera punti STAR con AI"
                      >
                        <Sparkles className="w-3 h-3 text-zinc-400" />
                        <span>{optimizingExpId === exp.id ? 'Ottimizzazione...' : 'Ottimizza Punti con AI'}</span>
                      </button>
                    </div>

                    {exp.bullets?.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-xs text-zinc-500 font-bold mt-2">•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                        />
                        <button
                          onClick={() => handleRemoveBullet(exp.id, bIdx)}
                          className="p-1 text-zinc-500 hover:text-white transition-colors mt-1 cursor-pointer"
                          title="Rimuovi punto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddBullet(exp.id)}
                      className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 mt-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Aggiungi punto elenco
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Formazione */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === 'edu' ? ('' as any) : 'edu')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={activeSection === 'edu'}
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-100">
                4. Formazione & Istruzione ({cv.education.length})
              </span>
            </div>
            {activeSection === 'edu' ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {activeSection === 'edu' && (
            <div className="p-4 space-y-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-500">Inserisci titoli accademici, master o diplomi</p>
                <button
                  onClick={handleAddEducation}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  aria-label="Aggiungi formazione"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Aggiungi Titolo</span>
                </button>
              </div>

              {cv.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Titolo #{eduIdx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="p-1 rounded-md text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title="Elimina formazione"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">Istituzione / Università</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="Es. Politecnico di Milano"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">Titolo di Studio</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Es. Laurea Magistrale"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">Campo / Indirizzo</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
                        placeholder="Es. Ingegneria Gestionale"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Anni</label>
                        <input
                          type="text"
                          value={`${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`}
                          onChange={(e) => {
                            const parts = e.target.value.split('-');
                            handleUpdateEducation(edu.id, 'startDate', parts[0]?.trim() || '');
                            handleUpdateEducation(edu.id, 'endDate', parts[1]?.trim() || '');
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Voto</label>
                        <input
                          type="text"
                          value={edu.grade || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, 'grade', e.target.value)}
                          placeholder="110L"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Competenze Hard & Soft */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === 'skills' ? ('' as any) : 'skills')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={activeSection === 'skills'}
          >
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-100">
                5. Competenze Tecniche & Soft Skills
              </span>
            </div>
            {activeSection === 'skills' ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {activeSection === 'skills' && (
            <div className="p-4 space-y-4 border-t border-zinc-800">
              {/* Hard Skills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  Competenze Tecniche (Hard Skills)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {cv.hardSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveHardSkill(skill)}
                        className="hover:text-white cursor-pointer"
                        title="Rimuovi"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newHardSkill}
                    onChange={(e) => setNewHardSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddHardSkill()}
                    placeholder="Es. Python, TypeScript, Figma..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />
                  <button
                    onClick={handleAddHardSkill}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    + Aggiungi
                  </button>
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2 pt-3 border-t border-zinc-800">
                <label className="block text-xs font-bold text-zinc-300">
                  Competenze Trasversali (Soft Skills)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {cv.softSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSoftSkill(skill)}
                        className="hover:text-white cursor-pointer"
                        title="Rimuovi"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSoftSkill()}
                    placeholder="Es. Problem Solving, Leadership..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />
                  <button
                    onClick={handleAddSoftSkill}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    + Aggiungi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Lingue & Certificazioni */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <button
            onClick={() => setActiveSection(activeSection === 'langs' ? ('' as any) : 'langs')}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            aria-expanded={activeSection === 'langs'}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-100">
                6. Lingue Straniere & Certificazioni
              </span>
            </div>
            {activeSection === 'langs' ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {activeSection === 'langs' && (
            <div className="p-4 space-y-4 border-t border-zinc-800">
              {/* Languages */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-300">Lingue Conosciute</span>
                  <button
                    onClick={handleAddLanguage}
                    className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Aggiungi Lingua
                  </button>
                </div>
                <div className="space-y-2">
                  {cv.languages.map((l, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={l.language}
                        onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                        placeholder="Lingua"
                        className="w-1/2 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                      <input
                        type="text"
                        value={l.level}
                        onChange={(e) => handleUpdateLanguage(idx, 'level', e.target.value)}
                        placeholder="Livello"
                        className="w-1/2 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                      />
                      <button
                        onClick={() => handleRemoveLanguage(idx)}
                        className="p-1 text-zinc-500 hover:text-white cursor-pointer"
                        title="Rimuovi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2 pt-3 border-t border-zinc-800">
                <span className="text-xs font-bold text-zinc-300">Certificazioni Professionali</span>
                <div className="space-y-1.5">
                  {cv.certifications.map((cert, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <span>{cert}</span>
                      <button
                        onClick={() => handleRemoveCert(cIdx)}
                        className="text-zinc-500 hover:text-white ml-2 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCert()}
                    placeholder="Es. Scrum Master, AWS Cloud Practitioner..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />
                  <button
                    onClick={handleAddCert}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    + Aggiungi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
