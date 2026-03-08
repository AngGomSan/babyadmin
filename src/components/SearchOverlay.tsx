import { useState, useMemo } from 'react';
import { Search, BookOpen, CheckSquare, X } from 'lucide-react';
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

  const handleClose = () => {
    onClose();
    setQuery('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:flex md:items-start md:justify-center md:pt-[15vh]">
      <div className="
        flex flex-col
        h-full w-full
        md:h-auto md:max-h-[70vh] md:max-w-lg md:w-full
        md:rounded-2xl md:border md:border-border md:shadow-lg
        bg-background
      ">
        {/* Search input - pinned top */}
        <div className="flex items-center gap-3 px-4 h-14 md:h-12 border-b border-border shrink-0 safe-area-top">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks and glossary..."
            className="flex-1 h-full bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors md:min-w-0 md:min-h-0"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors md:min-w-0 md:min-h-0 -mr-2"
            aria-label="Close search"
          >
            <span className="text-sm font-medium md:hidden">Cancel</span>
            <X className="w-4 h-4 hidden md:block" />
          </button>
        </div>

        {/* Results - scrollable */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() && !hasResults && (
            <p className="text-sm text-muted-foreground text-center py-8">No results for "{query}"</p>
          )}

          {results.tasks.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Tasks</p>
              {results.tasks.slice(0, 8).map(task => (
                <button
                  key={task.id}
                  onClick={() => { navigate('/timeline'); handleClose(); }}
                  className="w-full text-left px-3 py-3 md:py-2.5 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5 active:bg-muted"
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
                  onClick={() => { navigate('/glossary'); handleClose(); }}
                  className="w-full text-left px-3 py-3 md:py-2.5 rounded-lg hover:bg-muted transition-colors flex items-start gap-2.5 active:bg-muted"
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
      </div>

      {/* Click outside to close on desktop */}
      <div className="hidden md:block fixed inset-0 -z-10" onClick={handleClose} />
    </div>
  );
}
