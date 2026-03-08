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
      if (t.timing.type !== 'weekRange') return false;
      // Task's window has passed (endWeek < current week)
      if (t.timing.endWeek >= calc.currentWeek) return false;
      // Not completed and not optional
      if (isTaskComplete(t.id)) return false;
      // Only count "do_this_now" urgency tasks as overdue
      if (t.urgency !== 'do_this_now') return false;
      return true;
    }).length;
  }, [calc, state.completedTasks]);

  if (overdueCount === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/60 border border-border px-4 py-3">
      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
      <p className="text-sm text-muted-foreground flex-1">
        You have <span className="font-medium text-foreground">{overdueCount}</span> overdue {overdueCount === 1 ? 'task' : 'tasks'} from earlier weeks.
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
