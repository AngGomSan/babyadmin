import { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, CheckSquare } from 'lucide-react';
import { timelineTasks } from '@/data/timelineTasks';
import { glossaryTerms } from '@/data/glossaryTerms';
import { CATEGORY_LABELS } from '@/types';
import { useNavigate } from 'react-router-dom';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return { tasks: [], glossary: [] };
    const q = query.toLowerCase();
    return {
      tasks: timelineTasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      ),
      glossary: glossaryTerms.filter(t =>
        t.germanTerm.toLowerCase().includes(q) ||
        t.englishExplanation.toLowerCase().includes(q) ||
        (t.keywords && t.keywords.some(k => k.toLowerCase().includes(q)))
      ),
    };
  }, [query]);

  const hasResults = results.tasks.length > 0 || results.glossary.length > 0;

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) { onClose(); setQuery(''); } }}>
      <DialogContent className="max-w-lg p-0 gap-0 mx-4 rounded-2xl">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks and glossary..."
            className="border-0 focus-visible:ring-0 px-0 h-auto text-base"
            autoFocus
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() && !hasResults && (
            <p className="text-sm text-muted-foreground text-center py-8">No results for "{query}"</p>
          )}

          {results.tasks.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Tasks</p>
              {results.tasks.slice(0, 8).map(task => (
                <button
                  key={task.id}
                  onClick={() => { navigate('/timeline'); onClose(); setQuery(''); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5 active:bg-muted"
                >
                  <CheckSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[task.category]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.glossary.length > 0 && (
            <div className="space-y-0.5 mt-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Glossary</p>
              {results.glossary.map(term => (
                <button
                  key={term.id}
                  onClick={() => { navigate('/glossary'); onClose(); setQuery(''); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5 active:bg-muted"
                >
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{term.germanTerm}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{term.englishExplanation}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && (
            <p className="text-sm text-muted-foreground text-center py-8">Search tasks and glossary terms</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
