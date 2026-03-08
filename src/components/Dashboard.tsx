import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { timelineTasks } from '@/data/timelineTasks';
import { TimelineTask } from '@/types';
import TaskCard from '@/components/TaskCard';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state, dismissReassurance } = useApp();
  const calc = usePregnancyCalc();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);

  if (!calc) return null;

  const viewWeek = calc.isPostpartum ? calc.currentWeek : Math.min(42, Math.max(4, calc.currentWeek + weekOffset));
  const viewMonth = calc.isPostpartum ? Math.min(3, calc.postpartumMonth + weekOffset) : 0;
  const isCurrentView = weekOffset === 0;

  const { nowTasks, planTasks } = useMemo(() => {
    let now: TimelineTask[] = [];
    let plan: TimelineTask[] = [];

    if (calc.isPostpartum) {
      now = timelineTasks.filter(t => t.postpartumMonth !== undefined && t.postpartumMonth === viewMonth);
      plan = timelineTasks.filter(t => t.postpartumMonth !== undefined && t.postpartumMonth === viewMonth + 1);
    } else {
      now = timelineTasks.filter(t =>
        t.weekStart !== undefined && t.weekEnd !== undefined &&
        viewWeek >= t.weekStart && viewWeek <= t.weekEnd
      );
      plan = timelineTasks.filter(t =>
        t.weekStart !== undefined && t.weekEnd !== undefined &&
        t.weekStart > viewWeek && t.weekStart <= viewWeek + 6 &&
        !now.includes(t)
      );
    }
    return { nowTasks: now, planTasks: plan };
  }, [calc.isPostpartum, viewWeek, viewMonth]);

  const completedNow = nowTasks.filter(t => state.completedTasks.includes(t.id)).length;
  const trimesterLabel = calc.currentTrimester === 1 ? 'First trimester' : calc.currentTrimester === 2 ? 'Second trimester' : 'Third trimester';

  return (
    <div className="space-y-6 fade-in">
      {/* Reassurance */}
      {!state.reassuranceDismissed && (
        <div className="bg-gradient-primary-soft rounded-xl p-4 relative">
          <button onClick={dismissReassurance} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm text-foreground leading-relaxed pr-6">
            You do not need to figure everything out at once. This app helps you focus on what matters now and what to prepare next.
          </p>
        </div>
      )}

      {/* Status header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {calc.isPostpartum ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Baby className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Month {viewMonth}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isCurrentView ? `Day ${calc.postpartumDay} postpartum` : `Viewing month ${viewMonth}`}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground">Week {viewWeek}</h2>
                <p className="text-sm text-muted-foreground">
                  {isCurrentView ? `${trimesterLabel} · ${calc.daysUntilDue} days to go` : `Viewing week ${viewWeek}`}
                </p>
              </>
            )}
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-primary">{completedNow}/{nowTasks.length}</span>
            <p className="text-xs text-muted-foreground">completed</p>
          </div>
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWeekOffset(o => o - 1)}
            disabled={calc.isPostpartum ? viewMonth <= 0 : viewWeek <= 4}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {!isCurrentView && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setWeekOffset(0)}>
              Back to current
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setWeekOffset(o => o + 1)}
            disabled={calc.isPostpartum ? viewMonth >= 3 : viewWeek >= 42}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate('/timeline')}>
            Full timeline →
          </Button>
        </div>

        {/* Progress bar */}
        {!calc.isPostpartum && isCurrentView && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{trimesterLabel}</span>
              <span>{Math.round(calc.trimesterProgress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${calc.trimesterProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Do this now */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Do this now</h3>
        {nowTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No tasks for this period.</p>
        ) : (
          nowTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </section>

      {/* Plan ahead */}
      {planTasks.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Plan ahead</h3>
          {planTasks.map(task => <TaskCard key={task.id} task={task} />)}
        </section>
      )}
    </div>
  );
}
