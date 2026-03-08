import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  { label: 'First trimester (weeks 4–12)', shortLabel: 'First trimester', start: 4, end: 12, tri: 1 },
  { label: 'Second trimester (weeks 13–27)', shortLabel: 'Second trimester', start: 13, end: 27, tri: 2 },
  { label: 'Third trimester (weeks 28–42)', shortLabel: 'Third trimester', start: 28, end: 42, tri: 3 },
  { label: 'Postpartum (months 0–3)', shortLabel: 'Postpartum', start: -1, end: -1, tri: 4 },
];

const postpartumMonthLabels = ['Month 0', 'Month 1', 'Month 2', 'Month 3'];

function getPostpartumTasksForMonth(month: number): TimelineTask[] {
  return timelineTasks.filter(t => {
    if (t.timing.type === 'postpartumMonth') return t.timing.month === month;
    if (t.timing.type === 'postpartumRange') return month >= t.timing.startMonth && month <= t.timing.endMonth;
    return false;
  });
}

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
  const [activeTri, setActiveTri] = useState(1);

  // Refs for trimester sections
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingToSection = useRef(false);

  const isPostpartumView = selectedWeek > 42;
  const postpartumMonth = selectedWeek - 43;

  const weeklyTasks = useMemo(() => {
    if (isPostpartumView) return getPostpartumTasksForMonth(postpartumMonth);
    return timelineTasks.filter(t => taskInWeek(t, selectedWeek));
  }, [selectedWeek, isPostpartumView, postpartumMonth]);

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

  const headerLabel = isPostpartumView
    ? postpartumMonthLabels[postpartumMonth]
    : `Week ${selectedWeek}`;

  const subLabel = isPostpartumView
    ? 'Postpartum'
    : selectedWeek <= 12 ? 'First trimester' : selectedWeek <= 27 ? 'Second trimester' : 'Third trimester';

  // Scroll-based active section detection for trimester view
  useEffect(() => {
    if (viewMode !== 'trimester') return;

    const handleScroll = () => {
      if (isScrollingToSection.current) return;

      const navHeight = navRef.current?.getBoundingClientRect().bottom ?? 0;
      const offset = navHeight + 16;

      let closest = 1;
      let closestDist = Infinity;

      for (const tri of [1, 2, 3, 4]) {
        const el = sectionRefs.current[tri];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - offset);
        if (rect.top <= offset + 100 && dist < closestDist) {
          closestDist = dist;
          closest = tri;
        }
      }

      setActiveTri(closest);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const scrollToSection = useCallback((tri: number) => {
    const el = sectionRefs.current[tri];
    if (!el) return;

    setActiveTri(tri);
    isScrollingToSection.current = true;

    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 72;

    window.scrollTo({ top, behavior: 'smooth' });

    setTimeout(() => {
      isScrollingToSection.current = false;
    }, 600);
  }, []);

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Your timeline</h1>
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
          {/* Week/month selector */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setSelectedWeek(w => w - 1)} disabled={selectedWeek <= 4}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-lg font-semibold text-foreground">{headerLabel}</span>
              <p className="text-xs text-muted-foreground">{subLabel}</p>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setSelectedWeek(w => w + 1)} disabled={selectedWeek >= 46}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week slider — only in pregnancy range */}
          {!isPostpartumView && (
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
          )}

          {/* Baby born inline prompt — week 36+, pre-birth only */}
          {!state.babyBorn && !isPostpartumView && selectedWeek >= 36 && (
            <BabyBornPrompt variant="inline" />
          )}

          {/* Tasks split by urgency */}
          {weeklyTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No tasks for {isPostpartumView ? postpartumMonthLabels[postpartumMonth].toLowerCase() : `week ${selectedWeek}`}.
            </p>
          ) : (
            <>
              {doNowTasks.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Do this now</h3>
                  {doNowTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </section>
              )}
              {planTasks.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan ahead</h3>
                  {planTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </section>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          {/* Sticky trimester pill navigation */}
          <div
            ref={navRef}
            className="sticky top-0 md:top-[57px] z-30 bg-background/95 backdrop-blur-sm pb-3 pt-1 -mx-4 px-4"
          >
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {trimesterRanges.map(range => (
                <button
                  key={range.tri}
                  onClick={() => scrollToSection(range.tri)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-center transition-all duration-200 ${
                    activeTri === range.tri
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="text-xs font-medium leading-tight">{range.shortLabel}</span>
                  {range.tri < 4 && (
                    <span className={`block text-[10px] leading-tight ${
                      activeTri === range.tri ? 'text-primary-foreground/70' : 'text-muted-foreground/60'
                    }`}>
                      {range.tri === 1 ? '1–13' : range.tri === 2 ? '14–27' : '28–42'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Trimester sections */}
          <div className="space-y-12 mt-2">
            {trimesterGroups.map(group => (
              <section
                key={group.tri}
                ref={el => { sectionRefs.current[group.tri] = el; }}
                className="scroll-mt-28"
              >
                <div className="mb-5">
                  <h3 className="text-[13px] font-semibold text-foreground tracking-tight">{group.label}</h3>
                  <div className="mt-2.5 h-px bg-border" />
                </div>
                {group.tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tasks.</p>
                ) : (
                  <div className="space-y-3">
                    {group.tasks.map(task => <TaskCard key={task.id} task={task} />)}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
