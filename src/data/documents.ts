export interface GlobalDocument {
  id: string;
  label: string;
  germanName: string;
  description?: string;
}

/**
 * Global document registry.
 * Each document exists once; tasks reference documents by ID.
 */
export const globalDocuments: GlobalDocument[] = [
  // Identity
  { id: 'doc-parent-passports', label: 'Parent passports', germanName: 'Reisepässe' },
  { id: 'doc-parent-birth-certificates', label: 'Parents\' birth certificates', germanName: 'Geburtsurkunden der Eltern' },
  { id: 'doc-marriage-certificate', label: 'Marriage certificate', germanName: 'Heiratsurkunde' },

  // Paternity & custody
  { id: 'doc-paternity-recognition', label: 'Acknowledgement of paternity', germanName: 'Vaterschaftsanerkennung' },
  { id: 'doc-custody-declaration', label: 'Custody declaration', germanName: 'Sorgerechtserklärung' },

  // Pregnancy
  { id: 'doc-mutterpass', label: 'Mutterpass (pregnancy record)', germanName: 'Mutterpass' },
  { id: 'doc-due-date-confirmation', label: 'Expected due date confirmation', germanName: 'Bescheinigung über den voraussichtlichen Geburtstermin' },

  // Birth
  { id: 'doc-birth-certificate', label: 'Birth certificate', germanName: 'Geburtsurkunde' },
  { id: 'doc-birth-certificate-elterngeld', label: 'Birth certificate for Elterngeld', germanName: 'Geburtsurkunde für Elterngeld' },
  { id: 'doc-geburtsanzeige', label: 'Birth registration confirmation', germanName: 'Geburtsanzeige' },
  { id: 'doc-naming-declaration', label: 'Naming declaration', germanName: 'Namensklärung' },

  // Translations
  { id: 'doc-certified-translations', label: 'Certified translations if documents are foreign', germanName: 'Beglaubigte Übersetzungen' },

  // Employment & leave
  { id: 'doc-elternzeit-letter', label: 'Written Elternzeit request letter', germanName: 'Elternzeit-Antrag' },
  { id: 'doc-employer-confirmation', label: 'Employer confirmation of parental leave', germanName: 'Arbeitgeberbescheinigung' },

  // Financial
  { id: 'doc-salary-statements', label: 'Salary statements from the last 12 months', germanName: 'Gehaltsnachweise' },
  { id: 'doc-parent-tax-id', label: 'Tax ID for parents', germanName: 'Steuer-Identifikationsnummer' },
  { id: 'doc-child-tax-id', label: 'Child\'s tax ID', germanName: 'Steuer-ID des Kindes' },
  { id: 'doc-kindergeld-form', label: 'Kindergeld application form', germanName: 'Kindergeld-Antrag' },

  // Insurance
  { id: 'doc-health-insurance-info', label: 'Health insurance information', germanName: 'Krankenversicherung' },
  { id: 'doc-health-insurance-card', label: 'Health insurance card', germanName: 'Krankenversicherungskarte' },
  { id: 'doc-parent-insurance-number', label: 'Parent insurance details', germanName: 'Versicherungsnummer' },
];

/** Lookup map for quick access */
export const documentMap = new Map(globalDocuments.map(d => [d.id, d]));
