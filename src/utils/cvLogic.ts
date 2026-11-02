export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  grade?: string;
}

export interface LanguageItem {
  language: string;
  level: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  hardSkills: string[];
  softSkills: string[];
  languages: LanguageItem[];
  certifications: string[];
}

export interface AtsScoreResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    contactInfo: { score: number; max: number; label: string; passed: boolean };
    summary: { score: number; max: number; label: string; passed: boolean };
    experience: { score: number; max: number; label: string; passed: boolean };
    skills: { score: number; max: number; label: string; passed: boolean };
    education: { score: number; max: number; label: string; passed: boolean };
    languages: { score: number; max: number; label: string; passed: boolean };
  };
  tips: string[];
}

/**
 * Evaluates CV content against modern ATS (Applicant Tracking Systems)
 * and Joinrs recruiter AI algorithms.
 */
export function calculateAtsScore(cv: CVData): AtsScoreResult {
  let score = 0;
  const tips: string[] = [];

  // 1. Contact info (15 pts)
  let contactScore = 0;
  if (cv.personal?.fullName && cv.personal.fullName.trim().length > 3) contactScore += 4;
  if (cv.personal?.email && cv.personal.email.includes('@')) contactScore += 4;
  if (cv.personal?.phone && cv.personal.phone.length > 5) contactScore += 4;
  if (cv.personal?.linkedin && cv.personal.linkedin.length > 3) contactScore += 3;
  if (contactScore < 15) {
    tips.push('Aggiungi tutti i recapiti completi (incluso profilo LinkedIn attivo) per facilitare il contatto dei recruiter.');
  }
  score += contactScore;

  // 2. Summary (15 pts)
  let summaryScore = 0;
  const summaryLen = cv.summary ? cv.summary.trim().split(/\s+/).length : 0;
  if (summaryLen >= 30) {
    summaryScore = 15;
  } else if (summaryLen >= 15) {
    summaryScore = 10;
    tips.push('Arricchisci il sommario professionale con almeno 35-50 parole che spieghino i tuoi punti di forza.');
  } else {
    tips.push('Inserisci un sommario professionale (Executive Summary) per catturare subito l’attenzione di chi legge.');
  }
  score += summaryScore;

  // 3. Experience & Bullet Points (30 pts)
  let expScore = 0;
  if (cv.experiences && cv.experiences.length > 0) {
    expScore += 10;
    const allBullets = cv.experiences.flatMap((e) => e.bullets || []);
    if (allBullets.length >= 4) {
      expScore += 10;
    } else {
      tips.push('Aggiungi più punti elenco dettagliati per descrivere le tue responsabilità e progetti.');
    }

    // Check action verbs and metrics
    const hasMetrics = allBullets.some((b) => /\d+%|\d+\s*(ore|clienti|persone|k|€|progetti)/i.test(b));
    if (hasMetrics) {
      expScore += 10;
    } else {
      tips.push('Usa cifre o percentuali (es. "+25% di efficienza") nei punti elenco per quantificare l’impatto del tuo lavoro.');
    }
  } else {
    tips.push('Aggiungi almeno una esperienza lavorativa, tirocinio o progetto pratico.');
  }
  score += expScore;

  // 4. Skills (20 pts)
  let skillScore = 0;
  const hardCount = cv.hardSkills?.length || 0;
  const softCount = cv.softSkills?.length || 0;
  if (hardCount >= 4) skillScore += 10;
  else if (hardCount >= 2) skillScore += 5;

  if (softCount >= 3) skillScore += 10;
  else if (softCount >= 1) skillScore += 5;

  if (hardCount < 4 || softCount < 3) {
    tips.push('Includi almeno 4-6 competenze tecniche (hard skills) e 3-4 soft skills rilevanti per la tua posizione.');
  }
  score += skillScore;

  // 5. Education (10 pts)
  let eduScore = 0;
  if (cv.education && cv.education.length > 0 && cv.education[0].institution) {
    eduScore = 10;
  } else {
    tips.push('Inserisci il tuo percorso formativo (laurea, diploma o corsi specializzati).');
  }
  score += eduScore;

  // 6. Languages (10 pts)
  let langScore = 0;
  if (cv.languages && cv.languages.length >= 2) {
    langScore = 10;
  } else if (cv.languages && cv.languages.length === 1) {
    langScore = 6;
    tips.push('Indica almeno una seconda lingua (es. Inglese) specificando il livello di competenza (es. B2, C1).');
  }
  score += langScore;

  let grade: AtsScoreResult['grade'] = 'F' as any;
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 65) grade = 'B';
  else if (score >= 50) grade = 'C';
  else grade = 'D';

  return {
    score: Math.min(100, score),
    grade,
    breakdown: {
      contactInfo: { score: contactScore, max: 15, label: 'Dati di contatto', passed: contactScore >= 12 },
      summary: { score: summaryScore, max: 15, label: 'Sommario profilo', passed: summaryScore >= 12 },
      experience: { score: expScore, max: 30, label: 'Esperienze e risultati', passed: expScore >= 20 },
      skills: { score: skillScore, max: 20, label: 'Competenze Hard & Soft', passed: skillScore >= 15 },
      education: { score: eduScore, max: 10, label: 'Formazione', passed: eduScore >= 10 },
      languages: { score: langScore, max: 10, label: 'Lingue straniere', passed: langScore >= 10 },
    },
    tips: tips.slice(0, 4),
  };
}

/**
 * Formats a start/end date cleanly for display
 */
export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  if (!startDate) return '';
  const start = startDate.trim();
  if (current) {
    return `${start} - Presente`;
  }
  if (!endDate) return start;
  return `${start} - ${endDate.trim()}`;
}

/**
 * Generates actionable instructions to open and edit the PDF in Canva
 */
export function getCanvaWorkflowGuide() {
  return [
    {
      step: 1,
      title: 'Scarica il PDF dal nostro sito',
      desc: 'Clicca su "Scarica PDF per Canva" per ottenere un file vettoriale pulito con testi selezionabili.',
    },
    {
      step: 2,
      title: 'Accedi a Canva & Carica il file',
      desc: 'Vai su canva.com, fai clic sul pulsante in alto a destra "Carica" (o "Importa file") e seleziona il PDF appena scaricato.',
    },
    {
      step: 3,
      title: 'Modifica liberamente su Canva',
      desc: 'Canva convertirà automaticamente testi, titoli, colori e spazi in blocchi modificabili. Personalizza grafica, font e aggiungi la tua foto se desiderata!',
    },
    {
      step: 4,
      title: 'Esporta da Canva per Joinrs',
      desc: 'Quando hai finito le modifiche grafiche su Canva, fai clic su "Condividi" -> "Scarica" -> "PDF Standard" per avere il CV definitivo.',
    },
  ];
}

/**
 * Prepares the Joinrs Agent instruction bundle
 */
export function buildJoinrsAgentConfig(cv: CVData, targetJobTitle?: string) {
  const role = targetJobTitle || cv.personal?.jobTitle || 'Professionista';
  const name = cv.personal?.fullName || 'Candidato';
  const skillsList = [...cv.hardSkills, ...cv.softSkills].join(', ');

  return {
    agentTitle: `Joinrs Agent: ${name} (${role})`,
    role,
    skillsList,
    copyReadyPrompt: `Sei l'Agente di Carriera Joinrs di ${name}. 
Cerca e monitora attivamente opportunità per il ruolo di "${role}".
Priorità alle aziende con forte cultura meritocratica, orari flessibili o lavoro ibrido/remoto.
Competenze principali da valorizzare: ${skillsList}.
Invia notifiche solo per offerte con match elevato (>80%) e prepara candidature rapide allegando il CV in PDF.`,
  };
}
