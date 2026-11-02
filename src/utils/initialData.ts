import { CVData } from './cvLogic';

export const defaultCV: CVData = {
  personal: {
    fullName: 'Alessandro Conti',
    jobTitle: 'Digital Product Manager & Strategy Specialist',
    email: 'alessandro.conti@email.it',
    phone: '+39 349 765 4321',
    location: 'Milano, Italia',
    linkedin: 'linkedin.com/in/alessandroconti-pm',
    website: 'alessandroconti.me',
  },
  summary:
    'Product Manager orientato ai dati con 4+ anni di esperienza nella guida di prodotti digitali B2B e B2C ad alto traffico. Abile nella definizione della product vision, prioritizzazione del backlog secondo metodologie Agile/Scrum e allineamento di team cross-funzionali (design, tech, sales). Comprovata capacità di incrementare l’engagement degli utenti e i ricavi ricorrenti attraverso sperimentazioni A/B e continuous discovery.',
  experiences: [
    {
      id: 'exp-1',
      company: 'AppScale Technologies',
      role: 'Senior Digital Product Manager',
      location: 'Milano / Ibrido',
      startDate: '2023-01',
      endDate: '',
      current: true,
      bullets: [
        'Guidato il ridisegno della piattaforma web & mobile aumentando il tasso di conversione all’onboarding del +34% in 6 mesi.',
        'Coordinato un team interfunzionale di 9 tra sviluppatori, product designer e QA engineer, riducendo il tempo di rilascio da 4 a 2 settimane.',
        'Definito e monitorato OKR di prodotto e metriche chiave (NPS, MAU, Retention rate), presentando i progressi mensili al board direttivo.',
      ],
    },
    {
      id: 'exp-2',
      company: 'NextGen Digital Hub',
      role: 'Associate Product Manager',
      location: 'Torino, Italia',
      startDate: '2021-03',
      endDate: '2022-12',
      current: false,
      bullets: [
        'Condotto oltre 40 interviste qualitative con utenti finali e analisi quantitative su Mixpanel per individuare colli di bottiglia nel funnel.',
        'Collaborato al lancio di 3 nuove funzionalità SaaS che hanno generato oltre 180.000€ di nuovo ARR nel primo anno.',
        'Redatto specifiche di prodotto (PRD), user stories e criteri di accettazione dettagliati su Jira e Confluence.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Politecnico di Milano',
      degree: 'Laurea Magistrale in Ingegneria Gestionale',
      field: 'Management & Innovazione Digitale',
      location: 'Milano',
      startDate: '2018',
      endDate: '2020',
      grade: '110/110 con Lode',
    },
    {
      id: 'edu-2',
      institution: 'Università degli Studi di Torino',
      degree: 'Laurea Triennale in Economia Aziendale',
      field: 'Finanza e Organizzazione',
      location: 'Torino',
      startDate: '2015',
      endDate: '2018',
      grade: '108/110',
    },
  ],
  hardSkills: [
    'Product Strategy & Roadmap',
    'Agile & Scrum Framework',
    'Data Analysis (SQL, Mixpanel, GA4)',
    'UI/UX Wireframing (Figma)',
    'A/B Testing & User Research',
    'Jira & Linear Backlog Management',
  ],
  softSkills: [
    'Stakeholder Management',
    'Pensiero Strategico',
    'Problem Solving Analitico',
    'Leadership Collaborativa',
    'Comunicazione Efficace',
  ],
  languages: [
    { language: 'Italiano', level: 'Madrelingua' },
    { language: 'Inglese', level: 'Fluente (C1 - Cambridge Advanced)' },
    { language: 'Francese', level: 'Intermedio (B1)' },
  ],
  certifications: [
    'Professional Scrum Product Owner™ (PSPO I)',
    'Google Project Management Professional Certificate',
    'ProductLed Certified: Product-Led Growth Micro-Certification',
  ],
};
