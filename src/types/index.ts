export type TaskCategory = 'medical_care' | 'paperwork' | 'benefits_and_finances' | 'planning_and_preparation';

export type TaskUrgency = 'do_this_now' | 'plan_ahead';

export type TaskPhase = 'pregnancy' | 'postpartum';

export type TaskTiming =
  | { type: 'weekRange'; startWeek: number; endWeek: number }
  | { type: 'postpartumMonth'; month: number }
  | { type: 'postpartumRange'; startMonth: number; endMonth: number };

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export interface DocumentItem {
  id: string;
  label: string;
  germanName?: string;
}

export interface TimelineTask {
  id: string;
  taskGroup: string;
  title: string;
  phase: TaskPhase;
  timing: TaskTiming;
  urgency: TaskUrgency;
  category: TaskCategory;
  international: boolean;
  optional: boolean;
  dueWeek?: number;
  description?: string;
  unlocks?: string[];
  checklist?: ChecklistItem[];
}

export interface GlossaryTerm {
  id: string;
  germanTerm: string;
  englishExplanation: string;
  pronunciationHint?: string;
  keywords?: string[];
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
  medical_care: 'Medical care',
  paperwork: 'Paperwork',
  benefits_and_finances: 'Benefits and finances',
  planning_and_preparation: 'Planning and preparation',
};

