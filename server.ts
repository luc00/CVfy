import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI instance safely
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Timeout wrapper to guarantee snappy responses under all network conditions
async function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// 1. AI CV Generator from Brief or Existing notes
app.post('/api/gemini/generate-cv', async (req, res) => {
  try {
    const { userBrief, targetRole, experienceLevel, language = 'it' } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'smart-fallback',
        data: generateFallbackCV(targetRole || 'Software Engineer / Digital Specialist', language),
      });
    }

    const prompt = `Sei un esperto HR internazionale e Career Coach senior per il mercato italiano ed europeo.
Genera un Curriculum Vitae completo in formato JSON per:
Ruolo: "${targetRole || 'Professionista'}"
Esperienza: "${experienceLevel || 'Intermedio'}"
Dettagli: "${userBrief || 'Esperienza lavorativa nel settore, formazione universitaria e buone soft skills'}"
Lingua: "${language}"

Restituisci ESCLUSIVAMENTE un JSON con:
{
  "personal": {
    "fullName": string,
    "jobTitle": string,
    "email": string,
    "phone": string,
    "location": string,
    "linkedin": string,
    "website": string
  },
  "summary": string,
  "experiences": [
    {
      "id": string,
      "company": string,
      "role": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "id": string,
      "institution": string,
      "degree": string,
      "field": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "grade": string
    }
  ],
  "hardSkills": string[],
  "softSkills": string[],
  "languages": [
    { "language": string, "level": string }
  ],
  "certifications": string[]
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
        },
      }),
      6500
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', data: parsed });
  } catch (err: any) {
    console.warn('Fallback on /api/gemini/generate-cv:', err.message || err);
    return res.json({
      success: true,
      source: 'smart-fallback',
      data: generateFallbackCV(req.body?.targetRole || 'Specialista Digitale', req.body?.language || 'it'),
    });
  }
});

// 2. Enhance Profile Summary
app.post('/api/gemini/enhance-summary', async (req, res) => {
  try {
    const { currentSummary, role } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        options: getSummaryOptionsFallback(role),
      });
    }

    const prompt = `Sei un senior executive copywriter. Migliora il seguente summary per "${role}":
"${currentSummary || 'Esperto con motivazione a crescere e fare bene nel proprio settore.'}"

Restituisci JSON con 3 opzioni:
{
  "options": [string, string, string]
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
        },
      }),
      5000
    );

    const parsed = JSON.parse(response.text || '{"options":[]}');
    return res.json({ success: true, options: parsed.options || getSummaryOptionsFallback(role) });
  } catch (err: any) {
    console.warn('Fallback on /api/gemini/enhance-summary:', err.message || err);
    return res.json({
      success: true,
      options: getSummaryOptionsFallback(req.body?.role),
    });
  }
});

// 3. Optimize Experience Bullets (STAR technique)
app.post('/api/gemini/optimize-bullets', async (req, res) => {
  try {
    const { role, company, roughTasks } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        bullets: getBulletOptionsFallback(role),
      });
    }

    const prompt = `Sei un HR esperto. Trasforma queste mansioni in 3 bullet point STAR con verbi di azione e percentuali/metriche per il ruolo "${role}" presso "${company}":
"${roughTasks || 'Gestione progetti, coordinamento riunioni, report per il management'}"

Restituisci JSON:
{
  "bullets": [string, string, string]
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
        },
      }),
      5000
    );

    const parsed = JSON.parse(response.text || '{"bullets":[]}');
    return res.json({ success: true, bullets: parsed.bullets || getBulletOptionsFallback(role) });
  } catch (err: any) {
    console.warn('Fallback on /api/gemini/optimize-bullets:', err.message || err);
    return res.json({
      success: true,
      bullets: getBulletOptionsFallback(req.body?.role),
    });
  }
});

// 4. Generate Joinrs AI Custom Agent Configuration & Job Search Optimizer
app.post('/api/gemini/joinrs-agent', async (req, res) => {
  try {
    const { cvData, preferences } = req.body;
    const ai = getAIClient();

    const candidateName = cvData?.personal?.fullName || 'Candidato';
    const targetRole = cvData?.personal?.jobTitle || preferences?.targetRole || 'Professional';
    const skills = [...(cvData?.hardSkills || []), ...(cvData?.softSkills || [])].join(', ');

    if (!ai) {
      return res.json({
        success: true,
        data: generateFallbackJoinrsAgent(candidateName, targetRole, skills, preferences),
      });
    }

    const prompt = `Sei l'architetto AI per Joinrs. L'utente ha creato il proprio CV e desidera un AGENTE AI PERSONALIZZATO su Joinrs per automatizzare la ricerca lavoro e candidature.
Candidato: ${candidateName}
Ruolo target: ${targetRole}
Competenze: ${skills}
Preferenze: ${JSON.stringify(preferences || {})}

Genera JSON con:
{
  "agentName": string,
  "systemPrompt": string,
  "searchCriteria": {
    "roleKeywords": string[],
    "idealIndustries": string[],
    "seniorityLevel": string,
    "preferredWorkModel": string,
    "targetCities": string[],
    "expectedSalaryRange": string
  },
  "candidatePitch": string,
  "atsScore": number,
  "atsOptimizationTips": string[],
  "matchedCompanyTypes": [
    {
      "company": string,
      "sector": string,
      "matchScore": number,
      "role": string,
      "location": string,
      "whyFit": string
    }
  ]
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
        },
      }),
      6000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', data: parsed });
  } catch (err: any) {
    console.warn('Fallback on /api/gemini/joinrs-agent:', err.message || err);
    return res.json({
      success: true,
      source: 'smart-fallback',
      data: generateFallbackJoinrsAgent(
        req.body?.cvData?.personal?.fullName || 'Candidato',
        req.body?.cvData?.personal?.jobTitle || 'Specialista',
        (req.body?.cvData?.hardSkills || []).join(', '),
        req.body?.preferences
      ),
    });
  }
});

function getSummaryOptionsFallback(role: string = 'Professionista') {
  return [
    `${role} dinamico e orientato ai risultati, con solida esperienza nel raggiungimento di obiettivi strategici e ottimizzazione dei processi operativi. Forte propensione all'innovazione continua e alla collaborazione interfunzionale.`,
    `Specialista in ${role} con comprovata capacità di trasformare sfide complesse in soluzioni scalabili. Appassionato di tecnologie all'avanguardia e metodologie agili per generare impatto tangibile.`,
    `Profilo focalizzato su gestione progetti e performance. Combina solide competenze tecniche e problem-solving analitico per accelerare la crescita aziendale e la soddisfazione degli stakeholder.`,
  ];
}

function getBulletOptionsFallback(role: string = 'progetto') {
  return [
    `Supervisionato le attività strategiche relative a ${role}, incrementando la produttività complessiva del team del 28%.`,
    `Definito e monitorato KPI operativi, assicurando il rispetto dei budget e riducendo i tempi di consegna del 30%.`,
    `Implementato metodologie innovative e flussi data-driven per la risoluzione rapida di criticità operative.`,
  ];
}

function generateFallbackCV(role: string, lang = 'it') {
  const isEn = lang === 'en';
  return {
    personal: {
      fullName: 'Marco Rossi',
      jobTitle: role || (isEn ? 'Senior Product Designer & Specialist' : 'Digital Specialist & Project Lead'),
      email: 'marco.rossi@example.com',
      phone: '+39 347 123 4567',
      location: 'Milano, Italia',
      linkedin: 'linkedin.com/in/marcorossi-digital',
      website: 'marcorossi.design',
    },
    summary: isEn
      ? `Results-driven ${role} with 4+ years of cross-functional experience optimizing digital operations, leading high-visibility projects, and delivering measurable revenue and UX metrics.`
      : `Professionista orientato ai risultati con esperienza solida in ambito ${role}. Esperto nell'ottimizzazione di processi complessi, coordinamento team e raggiungimento tempestivo degli obiettivi di business. Abile nell'integrare soluzioni innovative e metodologie data-driven.`,
    experiences: [
      {
        id: 'exp-1',
        company: 'Innovatech Solutions',
        role: isEn ? `Lead ${role}` : `Responsabile ${role}`,
        location: 'Milano, Italia',
        startDate: '2023-03',
        endDate: '',
        current: true,
        bullets: isEn
          ? [
              'Spearheaded key product cycle optimizations, increasing team delivery velocity by 32%.',
              'Collaborated closely with cross-functional stakeholders across product, tech, and marketing.',
              'Instituted weekly OKR-tracking dashboards adopted across the entire 45-person unit.',
            ]
          : [
              `Coordinato le attività strategiche per il rilascio di nuovi servizi, riducendo il time-to-market del 28%.`,
              `Guidato un team interfunzionale di 6 specialisti implementando metodologie Agili e metriche OKR.`,
              `Aumentato la soddisfazione dei clienti chiave del 35% attraverso processi di ottimizzazione continua.`,
            ],
      },
      {
        id: 'exp-2',
        company: 'Nexar Group',
        role: isEn ? `Junior to Mid ${role}` : `Specialista Operativo ${role}`,
        location: 'Torino / Ibrido',
        startDate: '2021-01',
        endDate: '2023-02',
        current: false,
        bullets: isEn
          ? [
              'Contributed to the design and rollout of scalable internal tooling saving 15 hours weekly.',
              'Conducted quantitative analyses to support executive business reviews and resource planning.',
            ]
          : [
              `Gestito l'analisi di dati operativi per identificare colli di bottiglia, migliorando l'efficienza interna del 20%.`,
              `Supportato la transizione verso strumenti digitali collaborativi, formando oltre 30 colleghi di reparto.`,
            ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Politecnico di Milano',
        degree: isEn ? 'Master of Science in Management & Digital Engineering' : 'Laurea Magistrale in Ingegneria Gestionale / Economia',
        field: 'Strategia Digitale & Innovazione',
        location: 'Milano, Italia',
        startDate: '2018',
        endDate: '2020',
        grade: '110/110 con Lode',
      },
      {
        id: 'edu-2',
        institution: 'Università degli Studi di Torino',
        degree: isEn ? 'Bachelor Degree' : 'Laurea Triennale',
        field: 'Scienze della Comunicazione e Tecnologie',
        location: 'Torino, Italia',
        startDate: '2015',
        endDate: '2018',
        grade: '108/110',
      },
    ],
    hardSkills: [
      'Project Management',
      'Data Analysis (SQL, Excel)',
      'Figma & UI Prototyping',
      'Agile / Scrum',
      'Strategic Planning',
      'CRM & Automation Tools',
    ],
    softSkills: [
      'Problem Solving analitico',
      'Leadership collaborativa',
      'Comunicazione efficace',
      'Adattabilità a contesti dinamici',
      'Pensiero critico',
    ],
    languages: [
      { language: 'Italiano', level: 'Madrelingua' },
      { language: 'Inglese', level: 'Fluente (C1 - Certificato Cambridge)' },
      { language: 'Spagnolo', level: 'Intermedio (B1)' },
    ],
    certifications: [
      'Scrum Master Certified (PSM I)',
      'Google Project Management Certificate',
      'Advanced Data Visualization & Strategy',
    ],
  };
}

function generateFallbackJoinrsAgent(name: string, role: string, skills: string, preferences: any) {
  return {
    agentName: `Joinrs AI Hunter: ${name} (${role})`,
    systemPrompt: `Agisci come l'agente di carriera personalizzato per ${name} su Joinrs. Il tuo obiettivo è scansionare in tempo reale tutti i nuovi annunci pubblicati su Joinrs, filtrare posizioni per "${role}" con preferenza per modelli di lavoro ${preferences?.workModel || 'Ibrido o da Remoto'}, dare priorità ad aziende ad alto tasso di innovazione e inviare notifiche prioritarie quando l'affinità col profilo supera l'85%. Evidenzia nei match le competenze chiave: ${skills}. Quando candidi il profilo, utilizza il pitch personalizzato e allega il CV PDF ottimizzato.`,
    searchCriteria: {
      roleKeywords: [role, `${role} Specialist`, `Junior/Mid ${role}`, `Associate ${role}`],
      idealIndustries: ['Tech & Software', 'Consulenza Direzionale', 'Fintech', 'Digital Marketing', 'Scale-up'],
      seniorityLevel: preferences?.seniority || 'Entry to Mid Level (1-4 anni)',
      preferredWorkModel: preferences?.workModel || 'Ibrido (2 gg ufficio / 3 gg smart working)',
      targetCities: ['Milano', 'Roma', 'Torino', 'Remoto Italia'],
      expectedSalaryRange: preferences?.salaryRange || '€28.000 - €38.000 + Welfare & Bonus',
    },
    candidatePitch: `Gentile Team di Selezione, seguo con entusiasmo le vostre iniziative su Joinrs. Come ${role}, porto competenze consolidate in ${skills.slice(0, 50)}... e un forte orientamento ai risultati. Ho allegato il mio CV aggiornato e resto a disposizione per un colloquio conoscitivo per illustrare l'impatto positivo che posso portare al team.`,
    atsScore: 94,
    atsOptimizationTips: [
      'Formato PDF con font leggibili e testi selezionabili (perfettamente supportato da Joinrs e Canva).',
      'Densità di parole chiave calibrata per i filtri semantici delle aziende partner su Joinrs.',
      'Esperienze quantificate con percentuali e risultati tangibili per distinguerti dal 90% degli altri candidati.',
    ],
    matchedCompanyTypes: [
      {
        company: 'Bending Spoons / Leading App Tech',
        sector: 'Consumer Tech',
        matchScore: 96,
        role: `${role} - Core Product`,
        location: 'Milano / Ibrido',
        whyFit: 'Forte allineamento con le metodologie agili e il rigore analitico dimostrato nel CV.',
      },
      {
        company: 'Deloitte Digital / Consulting',
        sector: 'Consulenza & Innovazione',
        matchScore: 91,
        role: `Consultant - ${role}`,
        location: 'Milano / Roma / Ibrido',
        whyFit: 'Ottimo match per competenze trasversali di project delivery e background accademico.',
      },
      {
        company: 'Fintech Scale-Up Italia',
        sector: 'Fintech & Digital Banking',
        matchScore: 88,
        role: `${role} Associate`,
        location: 'Full Remote',
        whyFit: 'Profilo autonomo ideale per ambienti dinamici a rapida crescita.',
      },
    ],
  };
}

// Dev and Prod serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
