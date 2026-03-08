import { TaskCategory } from '@/types';

export interface GlobalDocument {
  id: string;
  label: string;
  germanName: string;
  description?: string;
  category?: TaskCategory;
}

/**
 * Global document registry.
 * Each document exists once; tasks reference documents by ID.
 */
export const globalDocuments: GlobalDocument[] = [
  // Identity
  { id: 'doc-parent-passports', label: 'Parent passports', germanName: 'Reisepässe', category: 'paperwork' },
  { id: 'doc-parent-birth-certificates', label: 'Parents\' birth certificates', germanName: 'Geburtsurkunden der Eltern', category: 'paperwork' },
  { id: 'doc-marriage-certificate', label: 'Marriage certificate', germanName: 'Heiratsurkunde', category: 'paperwork' },

  // Paternity & custody
  { id: 'doc-paternity-recognition', label: 'Acknowledgement of paternity', germanName: 'Vaterschaftsanerkennung', category: 'paperwork' },
  { id: 'doc-custody-declaration', label: 'Custody declaration', germanName: 'Sorgerechtserklärung', category: 'paperwork' },

  // Pregnancy
  { id: 'doc-mutterpass', label: 'Mutterpass (pregnancy record)', germanName: 'Mutterpass', category: 'medical_care' },
  { id: 'doc-due-date-confirmation', label: 'Expected due date confirmation', germanName: 'Bescheinigung über den voraussichtlichen Geburtstermin', category: 'medical_care' },

  // Birth
  { id: 'doc-birth-certificate', label: 'Birth certificate', germanName: 'Geburtsurkunde', category: 'paperwork' },
  { id: 'doc-birth-certificate-elterngeld', label: 'Birth certificate for Elterngeld', germanName: 'Geburtsurkunde für Elterngeld', category: 'benefits_and_finances' },
  { id: 'doc-geburtsanzeige', label: 'Hospital birth confirmation', germanName: 'Geburtsanzeige', description: 'Provided by the hospital after birth. Make sure you receive a copy before discharge.', category: 'paperwork' },
  { id: 'doc-naming-declaration', label: 'Naming declaration', germanName: 'Namensklärung', category: 'paperwork' },

  // Translations
  { id: 'doc-certified-translations', label: 'Certified translations if documents are foreign', germanName: 'Beglaubigte Übersetzungen', category: 'paperwork' },

  // Employment & leave
  { id: 'doc-elternzeit-letter', label: 'Written Elternzeit request letter', germanName: 'Elternzeit-Antrag', category: 'benefits_and_finances' },
  { id: 'doc-employer-confirmation', label: 'Employer confirmation of parental leave', germanName: 'Arbeitgeberbescheinigung', category: 'benefits_and_finances' },

  // Financial
  { id: 'doc-salary-statements', label: 'Salary statements from the last 12 months', germanName: 'Gehaltsnachweise', category: 'benefits_and_finances' },
  { id: 'doc-parent-tax-id', label: 'Tax ID for parents', germanName: 'Steuer-Identifikationsnummer', category: 'benefits_and_finances' },
  { id: 'doc-child-tax-id', label: 'Child\'s tax ID', germanName: 'Steuer-ID des Kindes', category: 'benefits_and_finances' },
  { id: 'doc-kindergeld-form', label: 'Kindergeld application form', germanName: 'Kindergeld-Antrag', category: 'benefits_and_finances' },

  // Insurance
  { id: 'doc-health-insurance-info', label: 'Health insurance information', germanName: 'Krankenversicherung', category: 'medical_care' },
  { id: 'doc-health-insurance-card', label: 'Health insurance card', germanName: 'Krankenversicherungskarte', category: 'medical_care' },
  { id: 'doc-parent-insurance-number', label: 'Parent insurance details', germanName: 'Versicherungsnummer', category: 'medical_care' },
];

/** Lookup map for quick access */
export const documentMap = new Map(globalDocuments.map(d => [d.id, d]));
