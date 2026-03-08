export type TaskCategory = 'medical' | 'paperwork' | 'benefits' | 'planning';

export interface ChecklistItem {
  id: string;
  label: string;
  explanation?: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  category: TaskCategory;
  weekStart?: number;
  weekEnd?: number;
  postpartumMonth?: number;
  isOptional?: boolean;
  hasInternationalFlag?: boolean;
  explanation?: string;
  checklist?: ChecklistItem[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  explanation: string;
  pronunciation?: string;
}

export interface AppState {
  dueDate: string | null;
  onboardingComplete: boolean;
  introSeen: boolean;
  completedTasks: string[];
  completedChecklist: string[];
  babyBorn: boolean;
  birthDate: string | null;
  reassuranceDismissed: boolean;
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  medical: 'Medical care',
  paperwork: 'Paperwork',
  benefits: 'Benefits & finances',
  planning: 'Planning & preparation',
};
