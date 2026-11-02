import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAtsScore, formatDateRange, buildJoinrsAgentConfig, CVData } from './cvLogic';

const mockCV: CVData = {
  personal: {
    fullName: 'Giulia Bianchi',
    jobTitle: 'Data Analyst & BI Specialist',
    email: 'giulia.bianchi@example.com',
    phone: '+39 340 9876543',
    location: 'Milano, Italia',
    linkedin: 'linkedin.com/in/giuliabianchi',
  },
  summary: 'Data Analyst con oltre 4 anni di esperienza nella progettazione di dashboard interattive in PowerBI, estrazione dati complessi con SQL e supporto decisionale al top management con orientamento al risultato.',
  experiences: [
    {
      id: '1',
      company: 'Tech Solutions Spa',
      role: 'Senior Data Analyst',
      location: 'Milano',
      startDate: '2022',
      endDate: '',
      current: true,
      bullets: [
        'Sviluppato modelli predittivi aumentando l accuratezza delle previsioni del 28%.',
        'Ottimizzato pipeline ETL riducendo i tempi di elaborazione di 15 ore a settimana.',
        'Presentato report analitici settimanali al C-level con raccomandazioni strategiche.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Università Bocconi',
      degree: 'Laurea Magistrale in Data Science',
      field: 'Economia e Analisi Quantitativa',
      location: 'Milano',
      startDate: '2019',
      endDate: '2021',
      grade: '110L',
    },
  ],
  hardSkills: ['SQL', 'Python', 'PowerBI', 'Tableau', 'Excel Avanzato', 'Git'],
  softSkills: ['Problem Solving', 'Comunicazione', 'Critical Thinking'],
  languages: [
    { language: 'Italiano', level: 'Madrelingua' },
    { language: 'Inglese', level: 'C1' },
  ],
  certifications: ['Microsoft Certified: Power BI Data Analyst Associate'],
};

test('calculateAtsScore evaluates high-quality CV with an A grade', () => {
  const result = calculateAtsScore(mockCV);
  assert.ok(result.score >= 85, `Expected score >= 85, got ${result.score}`);
  assert.equal(result.grade, 'A+');
  assert.equal(result.breakdown.contactInfo.passed, true);
  assert.equal(result.breakdown.summary.passed, true);
  assert.equal(result.breakdown.experience.passed, true);
  assert.equal(result.breakdown.skills.passed, true);
});

test('calculateAtsScore handles sparse CV and returns actionable tips', () => {
  const sparseCV: CVData = {
    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '' },
    summary: '',
    experiences: [],
    education: [],
    hardSkills: [],
    softSkills: [],
    languages: [],
    certifications: [],
  };
  const result = calculateAtsScore(sparseCV);
  assert.ok(result.score < 20, `Expected low score, got ${result.score}`);
  assert.equal(result.grade, 'D');
  assert.ok(result.tips.length > 0);
});

test('formatDateRange formats dates correctly for current and past roles', () => {
  assert.equal(formatDateRange('2021', '2023', false), '2021 - 2023');
  assert.equal(formatDateRange('2023', '', true), '2023 - Presente');
  assert.equal(formatDateRange('2020', '', false), '2020');
});

test('buildJoinrsAgentConfig builds prompt including target role and candidate skills', () => {
  const config = buildJoinrsAgentConfig(mockCV, 'Senior Data Analyst');
  assert.ok(config.agentTitle.includes('Giulia Bianchi'));
  assert.ok(config.copyReadyPrompt.includes('Senior Data Analyst'));
  assert.ok(config.copyReadyPrompt.includes('PowerBI'));
});
