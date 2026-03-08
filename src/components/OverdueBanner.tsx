import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { timelineTasks } from '@/data/timelineTasks';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OverdueBanner() {
  const { state, isTaskComplete } = useApp();
  const calc = usePregnancyCalc();
  const navigate = useNavigate();

  const overdueCount = useMemo(() => {
    if (!calc || calc.isPostpartum) return 0;

    return timelineTasks.filter(t => {
      if (t.timing.type !== 'weekRange' || t.dueWeek == null) return false;
      // Overdue: past dueWeek but still within expiresWeek (endWeek)
      if (calc.currentWeek <= t.dueWeek) return false;
      if (calc.currentWeek > t.timing.endWeek) return false;
      if (isTaskComplete(t.id)) return false;
      return true;
    }).length;
  }, [calc, state.completedTasks]);

  if (overdueCount === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/60 border border-border px-4 py-3">
      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
      <p className="text-sm text-muted-foreground flex-1">
        You have tasks from earlier weeks that may still be relevant.
      </p>
      <button
        onClick={() => navigate('/overdue')}
        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
      >
        Review →
      </button>
    </div>
  );
}
