import { useState, useMemo } from 'react';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { timelineTasks } from '@/data/timelineTasks';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'weekly' | 'trimester';

const trimesterRanges = [
  { label: 'First trimester (weeks 4–12)', start: 4, end: 12, tri: 1 },
  { label: 'Second trimester (weeks 13–27)', start: 13, end: 27, tri: 2 },
  { label: 'Third trimester (weeks 28–42)', start: 28, end: 42, tri: 3 },
  { label: 'Postpartum (months 0–3)', start: -1, end: -1, tri: 4 },
];

export default function Timeline() {
  const calc = usePregnancyCalc();
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedWeek, setSelectedWeek] = useState(calc ? Math.min(42, Math.max(4, calc.currentWeek)) : 8);

  const weeklyTasks = useMemo(() => {
    return timelineTasks.filter(t =>
      t.weekStart !== undefined && t.weekEnd !== undefined &&
      selectedWeek >= t.weekStart && selectedWeek <= t.weekEnd
    );
  }, [selectedWeek]);

  const trimesterGroups = useMemo(() => {
    return trimesterRanges.map(range => {
      const tasks = range.tri === 4
        ? timelineTasks.filter(t => t.postpartumMonth !== undefined)
        : timelineTasks.filter(t =>
            t.weekStart !== undefined && t.weekEnd !== undefined &&
            t.weekStart <= range.end && t.weekEnd >= range.start
          );
      return { ...range, tasks };
    });
  }, []);

  return (
    <div className="space-y-6 fade-in">
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
        <div className="space-y-4">
          {/* Week selector */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSelectedWeek(w => Math.max(4, w - 1))} disabled={selectedWeek <= 4}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold text-foreground">Week {selectedWeek}</span>
              <p className="text-xs text-muted-foreground">
                {selectedWeek <= 12 ? 'First trimester' : selectedWeek <= 27 ? 'Second trimester' : 'Third trimester'}
              </p>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSelectedWeek(w => Math.min(42, w + 1))} disabled={selectedWeek >= 42}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week slider */}
          <input
            type="range"
            min={4}
            max={42}
            value={selectedWeek}
            onChange={e => setSelectedWeek(Number(e.target.value))}
            className="w-full accent-primary"
          />

          <div className="space-y-3">
            {weeklyTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No tasks for week {selectedWeek}.</p>
            ) : (
              weeklyTasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {trimesterGroups.map(group => (
            <section key={group.tri} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{group.label}</h3>
              {group.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks.</p>
              ) : (
                group.tasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
