import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface BabyBornPromptProps {
  variant: 'card' | 'inline';
}

export default function BabyBornPrompt({ variant }: BabyBornPromptProps) {
  const { markBabyBorn } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());

  const handleConfirm = () => {
    if (birthDate) {
      markBabyBorn(birthDate.toISOString().split('T')[0]);
      setDialogOpen(false);
    }
  };

  if (variant === 'inline') {
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <Baby className="w-4 h-4 text-primary" />
              <span>Has your baby arrived? <span className="underline underline-offset-2">Mark as born</span>.</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-[260px]">
            Record your baby's birth date so the timeline can switch to postpartum tasks.
          </TooltipContent>
        </Tooltip>
        <BabyBornDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-primary-soft rounded-xl p-4 space-y-3 opacity-[0.85]">
        <div className="flex items-start gap-3">
          <Baby className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
             <p className="text-sm font-medium text-foreground">Almost there</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When your baby arrives, click the button below to record the birth date so the app can switch to postpartum tasks.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm"
          onClick={() => setDialogOpen(true)}
        >
          Baby is born
        </Button>
      </div>
      <BabyBornDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function BabyBornDialog({
  open,
  onOpenChange,
  birthDate,
  setBirthDate,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birthDate: Date | undefined;
  setBirthDate: (d: Date | undefined) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">When was your baby born?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-2">
          <Calendar
            mode="single"
            selected={birthDate}
            onSelect={setBirthDate}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </div>
        {birthDate && (
          <p className="text-sm text-muted-foreground text-center">
            {format(birthDate, 'MMMM d, yyyy')}
          </p>
        )}
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm} disabled={!birthDate}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
