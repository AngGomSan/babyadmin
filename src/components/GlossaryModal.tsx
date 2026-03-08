import { GlossaryTerm } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Volume2, X } from 'lucide-react';

interface GlossaryModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
}

export default function GlossaryModal({ term, onClose }: GlossaryModalProps) {
  if (!term) return null;

  return (
    <Dialog open={!!term} onOpenChange={open => { if (!open) onClose(); }}>
      {/* Desktop: standard centered dialog (hideDefaultClose=false). Mobile: bottom sheet with custom close. */}
      <DialogContent
        hideDefaultClose
        className="
          max-w-md rounded-2xl p-0 gap-0 border-0
          md:mx-auto md:p-6 md:gap-4 md:border
          max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto
          max-md:mx-0 max-md:w-full max-md:max-w-full
          max-md:rounded-b-none max-md:rounded-t-2xl
          max-md:max-h-[78vh]
          max-md:translate-x-0 max-md:translate-y-0
          max-md:data-[state=open]:slide-in-from-bottom-full max-md:data-[state=closed]:slide-out-to-bottom-full
          max-md:data-[state=open]:slide-in-from-left-0 max-md:data-[state=closed]:slide-out-to-left-0
        "
      >
        {/* Drag handle indicator – mobile only */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 md:px-0 md:pt-0">
          <DialogHeader className="flex-1 space-y-0">
            <DialogTitle className="text-lg font-bold text-foreground text-left">{term.germanTerm}</DialogTitle>
          </DialogHeader>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors -mr-2 shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body – scrollable */}
        <div className="overflow-y-auto px-5 pb-5 md:px-0 md:pb-0 space-y-4" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
          {term.pronunciationHint && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <span className="italic">{term.pronunciationHint}</span>
            </div>
          )}

          <p className="text-sm text-foreground leading-relaxed">{term.englishExplanation}</p>

          {term.keywords && term.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 pb-1">
              {term.keywords.map(keyword => (
                <span key={keyword} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
