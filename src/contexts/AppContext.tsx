import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppState } from '@/types';

const STORAGE_KEY = 'babyadmin-state';

const defaultState: AppState = {
  dueDate: null,
  onboardingComplete: false,
  introSeen: false,
  completedTasks: [],
  completedChecklist: [],
  babyBorn: false,
  birthDate: null,
  reassuranceDismissed: false,
};

interface AppContextType {
  state: AppState;
  setDueDate: (date: string) => void;
  completeOnboarding: () => void;
  dismissIntro: () => void;
  toggleTask: (taskId: string) => void;
  toggleChecklist: (itemId: string) => void;
  isTaskComplete: (taskId: string) => boolean;
  isChecklistComplete: (itemId: string) => boolean;
  markBabyBorn: (birthDate: string) => void;
  dismissReassurance: () => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultState;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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
  }, []);

  return (
    <AppContext.Provider value={{
      state,
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
