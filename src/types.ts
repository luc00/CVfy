import { CVData, AtsScoreResult, ExperienceItem, EducationItem } from './utils/cvLogic';

export type TemplateId = 'milano-modern' | 'executive-minimal' | 'creative-canva';
export type FontFamily = 'font-sans' | 'font-serif' | 'font-mono';
export type AccentColor = 'black' | 'charcoal' | 'graphite' | 'minimal' | 'slate' | 'indigo' | 'emerald' | 'sky' | 'rose';

export interface JoinrsPreferences {
  targetRole: string;
  workModel: 'Ibrido' | 'Full Remote' | 'In Sede';
  targetCities: string[];
  seniority: 'Junior (0-2 anni)' | 'Mid-Level (2-5 anni)' | 'Senior (5+ anni)';
  salaryRange: string;
}

export interface JoinrsAgentOutput {
  agentName: string;
  systemPrompt: string;
  searchCriteria: {
    roleKeywords: string[];
    idealIndustries: string[];
    seniorityLevel: string;
    preferredWorkModel: string;
    targetCities: string[];
    expectedSalaryRange: string;
  };
  candidatePitch: string;
  atsScore: number;
  atsOptimizationTips: string[];
  matchedCompanyTypes: Array<{
    company: string;
    sector: string;
    matchScore: number;
    role: string;
    location: string;
    whyFit: string;
  }>;
}

export type { CVData, AtsScoreResult, ExperienceItem, EducationItem };
