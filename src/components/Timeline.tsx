import { useState, useMemo } from 'react';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { timelineTasks } from '@/data/timelineTasks';
import { TimelineTask } from '@/types';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import BabyBornPrompt from '@/components/BabyBornPrompt';

type ViewMode = 'weekly' | 'trimester';

const trimesterRanges = [
  { label: 'First trimester (weeks 4–12)', start: 4, end: 12, tri: 1 },
  { label: 'Second trimester (weeks 13–27)', start: 13, end: 27, tri: 2 },
  { label: 'Third trimester (weeks 28–42)', start: 28, end: 42, tri: 3 },
  { label: 'Postpartum (months 0–3)', start: -1, end: -1, tri: 4 },
];

function taskInWeekRange(task: TimelineTask, rangeStart: number, rangeEnd: number): boolean {
  if (task.timing.type !== 'weekRange') return false;
  return task.timing.startWeek <= rangeEnd && task.timing.endWeek >= rangeStart;
}

function taskIsPostpartum(task: TimelineTask): boolean {
  return task.timing.type === 'postpartumMonth' || task.timing.type === 'postpartumRange';
}

function taskInWeek(task: TimelineTask, week: number): boolean {
  if (task.timing.type !== 'weekRange') return false;
  return week >= task.timing.startWeek && week <= task.timing.endWeek;
}

export default function Timeline() {
  const calc = usePregnancyCalc();
  const { state } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedWeek, setSelectedWeek] = useState(calc ? Math.min(42, Math.max(4, calc.currentWeek)) : 8);

  const weeklyTasks = useMemo(() => {
    return timelineTasks.filter(t => taskInWeek(t, selectedWeek));
  }, [selectedWeek]);

  const doNowTasks = useMemo(() => weeklyTasks.filter(t => t.urgency === 'do_this_now'), [weeklyTasks]);
  const planTasks = useMemo(() => weeklyTasks.filter(t => t.urgency === 'plan_ahead'), [weeklyTasks]);

  const trimesterGroups = useMemo(() => {
    return trimesterRanges.map(range => {
      const tasks = range.tri === 4
        ? timelineTasks.filter(taskIsPostpartum)
        : timelineTasks.filter(t => taskInWeekRange(t, range.start, range.end));
      return { ...range, tasks };
    });
  }, []);

  const trimesterLabel = selectedWeek <= 12 ? 'First trimester' : selectedWeek <= 27 ? 'Second trimester' : 'Third trimester';

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Timeline</h1>
        <div className="flex bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'weekly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('trimester')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'trimester' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Trimester
          </button>
        </div>
      </div>

      {viewMode === 'weekly' ? (
        <div className="space-y-5">
          {/* Week selector */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setSelectedWeek(w => Math.max(4, w - 1))} disabled={selectedWeek <= 4}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold text-foreground">Week {selectedWeek}</span>
              <p className="text-xs text-muted-foreground">{trimesterLabel}</p>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setSelectedWeek(w => Math.min(42, w + 1))} disabled={selectedWeek >= 42}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min={4}
              max={42}
              value={selectedWeek}
              onChange={e => setSelectedWeek(Number(e.target.value))}
              className="w-full accent-primary h-1.5"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/60 px-0.5">
              <span>Week 4</span>
              <span>Week 12</span>
              <span>Week 27</span>
              <span>Week 42</span>
            </div>
          </div>

          {/* Tasks split by urgency */}
          {weeklyTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No tasks for week {selectedWeek}.</p>
          ) : (
            <>
              {doNowTasks.length > 0 && (
                <section className="space-y-2.5">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Do this now</h3>
                  {doNowTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </section>
              )}
              {planTasks.length > 0 && (
                <section className="space-y-2.5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan ahead</h3>
                  {planTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </section>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {trimesterGroups.map(group => (
            <section key={group.tri} className="space-y-2.5">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{group.label}</h3>
              {group.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks.</p>
              ) : (
                <div className="space-y-2.5">
                  {group.tasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
