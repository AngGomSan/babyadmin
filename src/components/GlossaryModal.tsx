import { GlossaryTerm } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Volume2 } from 'lucide-react';

interface GlossaryModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
}

export default function GlossaryModal({ term, onClose }: GlossaryModalProps) {
  if (!term) return null;

  return (
    <Dialog open={!!term} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">{term.germanTerm}</DialogTitle>
        </DialogHeader>
        {term.pronunciationHint && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-1">
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
      </DialogContent>
    </Dialog>
  );
}
