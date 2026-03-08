import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { AppState } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'babyadmin-state';

const defaultState: AppState = {
  dueDate: null,
  onboardingComplete: false,
  introSeen: false,
  completedTasks: [],
  completedChecklist: [],
  completedDocuments: [],
  babyBorn: false,
  birthDate: null,
  reassuranceDismissed: false,
};

interface AppContextType {
  state: AppState;
  loading: boolean;
  setDueDate: (date: string) => void;
  completeOnboarding: () => void;
  dismissIntro: () => void;
  toggleTask: (taskId: string) => void;
  toggleChecklist: (itemId: string) => void;
  toggleDocument: (docId: string) => void;
  isTaskComplete: (taskId: string) => boolean;
  isChecklistComplete: (itemId: string) => boolean;
  isDocumentComplete: (docId: string) => boolean;
  markBabyBorn: (birthDate: string) => void;
  dismissReassurance: () => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadLocalState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultState, ...JSON.parse(stored) };
  } catch {}
  return defaultState;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>(loadLocalState);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load state from DB when user logs in
  useEffect(() => {
    if (!user) {
      setState(loadLocalState());
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('user_app_state')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data) {
          const dbState: AppState = {
            dueDate: data.due_date,
            onboardingComplete: data.onboarding_complete,
            introSeen: data.intro_seen,
            completedTasks: data.completed_tasks || [],
            completedChecklist: data.completed_checklist || [],
            completedDocuments: (data as any).completed_documents || [],
            babyBorn: data.baby_born,
            birthDate: data.birth_date,
            reassuranceDismissed: data.reassurance_dismissed,
          };
          setState(dbState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbState));
        } else if (!data && !error) {
          // Row doesn't exist yet (trigger may not have fired); create it
          supabase
            .from('user_app_state')
            .insert({ user_id: user.id })
            .then(() => {
              setState(defaultState);
            });
        }
        setLoading(false);
      });
  }, [user]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (!user) return;

    // Debounce DB writes
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from('user_app_state')
        .update({
          due_date: state.dueDate,
          onboarding_complete: state.onboardingComplete,
          intro_seen: state.introSeen,
          completed_tasks: state.completedTasks,
          completed_checklist: state.completedChecklist,
          completed_documents: state.completedDocuments,
          baby_born: state.babyBorn,
          birth_date: state.birthDate,
          reassurance_dismissed: state.reassuranceDismissed,
        } as any)
        .eq('user_id', user.id)
        .then();
    }, 500);
  }, [state, user]);

  const setDueDate = useCallback((date: string) => {
    setState(s => ({ ...s, dueDate: date }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(s => ({ ...s, onboardingComplete: true }));
  }, []);

  const dismissIntro = useCallback(() => {
    setState(s => ({ ...s, introSeen: true }));
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setState(s => ({
      ...s,
      completedTasks: s.completedTasks.includes(taskId)
        ? s.completedTasks.filter(id => id !== taskId)
        : [...s.completedTasks, taskId],
    }));
  }, []);

  const toggleChecklist = useCallback((itemId: string) => {
    setState(s => ({
      ...s,
      completedChecklist: s.completedChecklist.includes(itemId)
        ? s.completedChecklist.filter(id => id !== itemId)
        : [...s.completedChecklist, itemId],
    }));
  }, []);

  const isTaskComplete = useCallback((taskId: string) => {
    return state.completedTasks.includes(taskId);
  }, [state.completedTasks]);

  const isChecklistComplete = useCallback((itemId: string) => {
    return state.completedChecklist.includes(itemId);
  }, [state.completedChecklist]);

  const markBabyBorn = useCallback((birthDate: string) => {
    setState(s => ({ ...s, babyBorn: true, birthDate }));
  }, []);

  const dismissReassurance = useCallback(() => {
    setState(s => ({ ...s, reassuranceDismissed: true }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    if (user) {
      supabase
        .from('user_app_state')
        .update({
          due_date: null,
          onboarding_complete: false,
          intro_seen: false,
          completed_tasks: [],
          completed_checklist: [],
          baby_born: false,
          birth_date: null,
          reassurance_dismissed: false,
        })
        .eq('user_id', user.id)
        .then();
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      state,
      loading,
      setDueDate,
      completeOnboarding,
      dismissIntro,
      toggleTask,
      toggleChecklist,
      isTaskComplete,
      isChecklistComplete,
      markBabyBorn,
      dismissReassurance,
      resetState,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
