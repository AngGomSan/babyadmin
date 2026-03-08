import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { timelineTasks } from '@/data/timelineTasks';
import { TimelineTask } from '@/types';
import TaskCard from '@/components/TaskCard';
import { X, ChevronLeft, ChevronRight, Baby } from 'lucide-react';
import BabyBornPrompt from '@/components/BabyBornPrompt';
import OverdueBanner from '@/components/OverdueBanner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function getTaskWeekRange(task: TimelineTask): { start: number; end: number } | null {
  if (task.timing.type === 'weekRange') return { start: task.timing.startWeek, end: task.timing.endWeek };
  return null;
}

function getTaskPostpartumRange(task: TimelineTask): { start: number; end: number } | null {
  if (task.timing.type === 'postpartumMonth') return { start: task.timing.month, end: task.timing.month };
  if (task.timing.type === 'postpartumRange') return { start: task.timing.startMonth, end: task.timing.endMonth };
  return null;
}

export default function Dashboard() {
  const { state, dismissReassurance } = useApp();
  const calc = usePregnancyCalc();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);

  const viewWeek = calc ? (calc.isPostpartum ? calc.currentWeek : Math.min(42, Math.max(4, calc.currentWeek + weekOffset))) : 4;
  const viewMonth = calc ? (calc.isPostpartum ? Math.min(3, Math.max(0, calc.postpartumMonth + weekOffset)) : 0) : 0;
  const isCurrentView = weekOffset === 0;

  const { nowTasks, planTasks } = useMemo(() => {
    if (!calc) return { nowTasks: [], planTasks: [] };
    let now: TimelineTask[] = [];
    let plan: TimelineTask[] = [];

    if (calc.isPostpartum) {
      now = timelineTasks.filter(t => {
        const range = getTaskPostpartumRange(t);
        return range && viewMonth >= range.start && viewMonth <= range.end && t.urgency === 'do_this_now';
      });
      plan = timelineTasks.filter(t => {
        const range = getTaskPostpartumRange(t);
        if (!range) return false;
        if (t.urgency === 'plan_ahead' && viewMonth >= range.start && viewMonth <= range.end) return true;
        if (range.start > viewMonth && range.start <= viewMonth + 1) return true;
        return false;
      }).filter(t => !now.includes(t));
    } else {
      now = timelineTasks.filter(t => {
        const range = getTaskWeekRange(t);
        return range && viewWeek >= range.start && viewWeek <= range.end && t.urgency === 'do_this_now';
      });
      plan = timelineTasks.filter(t => {
        const range = getTaskWeekRange(t);
        if (!range) return false;
        if (t.urgency === 'plan_ahead' && viewWeek >= range.start && viewWeek <= range.end) return true;
        if (range.start > viewWeek && range.start <= viewWeek + 6 && !now.some(n => n.id === t.id)) return true;
        return false;
      }).filter(t => !now.includes(t));
    }
    return { nowTasks: now, planTasks: plan };
  }, [calc, viewWeek, viewMonth]);

  if (!calc) return null;

  const completedNow = nowTasks.filter(t => state.completedTasks.includes(t.id)).length;
  const trimesterLabel = calc.currentTrimester === 1 ? 'First trimester' : calc.currentTrimester === 2 ? 'Second trimester' : 'Third trimester';

  return (
    <div className="space-y-5 fade-in">
      {/* Reassurance */}
      {!state.reassuranceDismissed && (
        <div className="bg-gradient-primary-soft rounded-xl p-4 relative opacity-[0.85]">
          <button onClick={dismissReassurance} className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm text-foreground leading-relaxed pr-8">
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
                <div className="flex items-center gap-2 mb-0.5">
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
                  {isCurrentView ? `${trimesterLabel} · ${calc.daysUntilDue} days until due date` : `Viewing week ${viewWeek}`}
                </p>
              </>
            )}
          </div>
          {nowTasks.length > 0 && (
            <div className="text-right">
              <span className="text-sm font-medium text-primary">{completedNow}/{nowTasks.length}</span>
              <p className="text-[11px] text-muted-foreground">completed</p>
            </div>
          )}
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
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
            className="h-9 w-9 shrink-0"
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
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{trimesterLabel}</span>
              <span>{Math.round(calc.trimesterProgress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${calc.trimesterProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Baby born prompt — visible from week 36 onward, pre-birth only */}
      {!calc.isPostpartum && viewWeek >= 36 && (
        <BabyBornPrompt variant="card" />
      )}

      {/* Overdue banner */}
      {!calc.isPostpartum && isCurrentView && <OverdueBanner />}

      {/* Do this now */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-bold text-[hsl(215,25%,27%)] uppercase tracking-wider">Do this now</h3>
        {nowTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">No tasks for this period.</p>
        ) : (
          nowTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </section>

      {/* Plan ahead */}
      {planTasks.length > 0 && (
        <section className="space-y-2.5">
          <h3 className="text-xs font-semibold text-[hsl(215,16%,47%)] uppercase tracking-wider">Plan ahead</h3>
          {planTasks.map(task => <TaskCard key={task.id} task={task} />)}
        </section>
      )}
    </div>
  );
}
