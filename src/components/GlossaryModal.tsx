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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">{term.term}</DialogTitle>
        </DialogHeader>
        {term.pronunciation && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Volume2 className="w-4 h-4" />
            <span>{term.pronunciation}</span>
          </div>
        )}
        <p className="text-sm text-foreground leading-relaxed">{term.explanation}</p>
      </DialogContent>
    </Dialog>
  );
}
