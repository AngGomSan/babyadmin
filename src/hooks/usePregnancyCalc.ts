import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { useApp } from '@/contexts/AppContext';

export interface PregnancyCalc {
  currentWeek: number;
  currentTrimester: 1 | 2 | 3;
  daysUntilDue: number;
  trimesterProgress: number;
  overallProgress: number;
  isPostpartum: boolean;
  postpartumMonth: number;
  postpartumDay: number;
}

export function usePregnancyCalc(): PregnancyCalc | null {
  const { state } = useApp();

  return useMemo(() => {
    if (!state.dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(state.dueDate);
    due.setHours(0, 0, 0, 0);

    const daysUntilDue = differenceInDays(due, today);
    const currentWeek = Math.max(1, 40 - Math.floor(daysUntilDue / 7));

    const currentTrimester: 1 | 2 | 3 = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3;

    const trimesterRanges = { 1: [1, 12], 2: [13, 27], 3: [28, 42] } as const;
    const [start, end] = trimesterRanges[currentTrimester];
    const trimesterProgress = Math.min(100, Math.max(0, ((currentWeek - start) / (end - start + 1)) * 100));

    const overallProgress = Math.min(100, Math.max(0, (currentWeek / 42) * 100));

    let isPostpartum = state.babyBorn || currentWeek > 42;
    let postpartumMonth = 0;
    let postpartumDay = 0;

    if (state.birthDate) {
      const birth = new Date(state.birthDate);
      birth.setHours(0, 0, 0, 0);
      const daysSinceBirth = differenceInDays(today, birth);
      postpartumMonth = Math.min(3, Math.floor(daysSinceBirth / 30));
      postpartumDay = daysSinceBirth;
      isPostpartum = true;
    } else if (currentWeek > 42) {
      isPostpartum = true;
    }

    return {
      currentWeek: Math.min(currentWeek, 42),
      currentTrimester,
      daysUntilDue: Math.max(0, daysUntilDue),
      trimesterProgress,
      overallProgress,
      isPostpartum,
      postpartumMonth,
      postpartumDay,
    };
  }, [state.dueDate, state.babyBorn, state.birthDate]);
}
