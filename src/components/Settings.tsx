import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePregnancyCalc } from '@/hooks/usePregnancyCalc';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Baby, Trash2, LogOut, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function SettingsPage() {
  const { state, setDueDate, markBabyBorn, resetState } = useApp();
  const { user, signOut } = useAuth();
  const calc = usePregnancyCalc();
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(state.dueDate ? new Date(state.dueDate) : undefined);
  const [babyBornDialog, setBabyBornDialog] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveDueDate = () => {
    if (tempDate) {
      setDueDate(tempDate.toISOString().split('T')[0]);
      setEditingDueDate(false);
    }
  };

  const handleBabyBorn = () => {
    if (birthDate) {
      markBabyBorn(birthDate.toISOString().split('T')[0]);
      setBabyBornDialog(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      {/* Account */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Account</h2>
        <div className="rounded-xl bg-card shadow-card p-4 space-y-3">
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </section>

      {/* Due date */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Due date</h2>
        <div className="rounded-xl bg-card shadow-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                {state.dueDate ? format(new Date(state.dueDate), 'PPP') : 'Not set'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setTempDate(state.dueDate ? new Date(state.dueDate) : undefined); setEditingDueDate(true); }}>
              Edit
            </Button>
          </div>
          {calc && !calc.isPostpartum && (
            <p className="text-xs text-muted-foreground">Week {calc.currentWeek} · {calc.daysUntilDue} days until due date</p>
          )}
        </div>
      </section>

      {/* Baby born */}
      {!state.babyBorn && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Baby is born</h2>
          <div className="rounded-xl bg-card shadow-card p-4">
            <p className="text-sm text-muted-foreground mb-3">
              When the baby arrives, switch to postpartum mode to see your next steps.
            </p>
            <Button onClick={() => setBabyBornDialog(true)} className="bg-gradient-primary text-primary-foreground">
              <Baby className="w-4 h-4 mr-2" />
              Baby is born
            </Button>
          </div>
        </section>
      )}

      {state.babyBorn && state.birthDate && (
        <section className="space-y-2">
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Birth</h2>
          <div className="rounded-xl bg-card shadow-card p-4 flex items-center gap-2">
            <Baby className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Born {format(new Date(state.birthDate), 'PPP')}</span>
          </div>
        </section>
      )}

      {/* Progress */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Progress</h2>
        <div className="rounded-xl bg-card shadow-card p-4 space-y-1">
          <p className="text-sm text-foreground">{state.completedTasks.length} tasks completed</p>
          <p className="text-sm text-foreground">{state.completedChecklist.length} checklist items completed</p>
        </div>
      </section>

      {/* Reset */}
      <section>
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setConfirmReset(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Reset all data
        </Button>
      </section>

      {/* Edit due date dialog */}
      <Dialog open={editingDueDate} onOpenChange={setEditingDueDate}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit due date</DialogTitle>
          </DialogHeader>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start', !tempDate && 'text-muted-foreground')}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {tempDate ? format(tempDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={tempDate} onSelect={setTempDate} defaultMonth={tempDate || addWeeks(new Date(), 20)} className={cn('p-3 pointer-events-auto')} />
            </PopoverContent>
          </Popover>
          <DialogFooter>
            <Button onClick={handleSaveDueDate} disabled={!tempDate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Baby born dialog */}
      <Dialog open={babyBornDialog} onOpenChange={setBabyBornDialog}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>When was the baby born?</DialogTitle>
          </DialogHeader>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start', !birthDate && 'text-muted-foreground')}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} toDate={new Date()} className={cn('p-3 pointer-events-auto')} />
            </PopoverContent>
          </Popover>
          <DialogFooter>
            <Button onClick={handleBabyBorn} disabled={!birthDate} className="bg-gradient-primary text-primary-foreground">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset confirmation */}
      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reset all data?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will clear your due date, progress and all completed tasks. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { resetState(); setConfirmReset(false); }}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
