import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { format, addWeeks } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const { setDueDate, completeOnboarding, state, dismissIntro } = useApp();
  const [step, setStep] = useState<'date' | 'intro'>(state.dueDate ? 'intro' : 'date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.dueDate ? new Date(state.dueDate) : undefined
  );

  const handleDateConfirm = () => {
    if (selectedDate) {
      setDueDate(selectedDate.toISOString().split('T')[0]);
      setStep('intro');
    }
  };

  const handleFinish = () => {
    dismissIntro();
    completeOnboarding();
  };

  if (step === 'date') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm space-y-8 text-center fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary mb-2">BabyAdmin</h1>
            <p className="text-sm text-muted-foreground">The German bureaucracy survival guide for expecting parents.</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">When is your due date?</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-12',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Select your due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  defaultMonth={selectedDate || addWeeks(new Date(), 20)}
                  fromDate={new Date()}
                  toDate={addWeeks(new Date(), 42)}
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleDateConfirm}
              disabled={!selectedDate}
              className="w-full h-12 bg-gradient-primary text-primary-foreground font-medium"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8 text-center fade-in">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">You're all set</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            BabyAdmin helps you stay ahead of Germany-specific pregnancy admin. It shows you what to do, when to start and why starting then matters.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You don't need to figure everything out at once. Focus on what matters now and what to prepare next.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleFinish}
            className="w-full h-12 bg-gradient-primary text-primary-foreground font-medium"
          >
            Get started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <button
            onClick={handleFinish}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
