import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { timelineTasks } from '@/data/timelineTasks';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS } from '@/types';

export default function OverdueTasks() {
  const { state, isTaskComplete } = useApp();
  const calc = usePregnancyCalc();
  const navigate = useNavigate();

  const overdueTasks = useMemo(() => {
    if (!calc || calc.isPostpartum) return [];

    return timelineTasks.filter(t => {
      if (t.timing.type !== 'weekRange' || t.dueWeek == null) return false;
      if (calc.currentWeek <= t.dueWeek) return false;
      if (calc.currentWeek > t.timing.endWeek) return false;
      if (isTaskComplete(t.id)) return false;
      return true;
    }).sort((a, b) => {
      // Sort by most overdue first: (currentWeek - dueWeek) descending
      const aOverdue = calc.currentWeek - (a.dueWeek ?? 0);
      const bOverdue = calc.currentWeek - (b.dueWeek ?? 0);
      return bOverdue - aOverdue;
    });
  }, [calc, state.completedTasks]);

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Earlier tasks</h1>
          <p className="text-xs text-muted-foreground mt-0.5">These tasks from earlier weeks may still be relevant.</p>
        </div>
      </div>

      {overdueTasks.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">You're all caught up! Nothing to review.</p>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        </div>
      ) : (
        <section className="space-y-3">
          {overdueTasks.map(task => (
            <div key={task.id} className="relative">
              <TaskCard task={task} />
              <p className="text-[11px] text-muted-foreground mt-1 ml-12">
                Due by week {task.dueWeek ?? '—'}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
