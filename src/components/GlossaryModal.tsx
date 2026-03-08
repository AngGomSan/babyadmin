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
      {/* Desktop: centered dialog. Mobile: bottom sheet */}
      <DialogContent className="
        max-w-md mx-4 rounded-2xl
        md:mx-auto
        max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto
        max-md:mx-0 max-md:w-full max-md:max-w-full
        max-md:rounded-b-none max-md:rounded-t-2xl
        max-md:max-h-[90vh]
        max-md:translate-x-0 max-md:translate-y-0
        max-md:p-5
      ">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground transition-colors md:min-w-0 md:min-h-0"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground pr-8">{term.germanTerm}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-md:max-h-[calc(90vh-120px)] space-y-3">
          {term.pronunciationHint && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="italic">{term.pronunciationHint}</span>
            </div>
          )}
          <p className="text-sm text-foreground leading-relaxed">{term.englishExplanation}</p>
          {term.keywords && term.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
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
