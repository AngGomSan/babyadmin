import { useState, useMemo } from 'react';
import { glossaryTerms } from '@/data/glossaryTerms';
import { GlossaryTerm } from '@/types';
import GlossaryModal from '@/components/GlossaryModal';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<GlossaryTerm | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return glossaryTerms;
    const q = search.toLowerCase();
    return glossaryTerms.filter(t =>
      t.germanTerm.toLowerCase().includes(q) ||
      t.englishExplanation.toLowerCase().includes(q) ||
      (t.keywords && t.keywords.some(k => k.toLowerCase().includes(q)))
    );
  }, [search]);

  return (
    <div className="space-y-5 fade-in">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Glossary</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          German pregnancy and admin terms explained in plain English.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="pl-10 h-11"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No matching terms found.</p>
        ) : (
          filtered.map(term => (
            <button
              key={term.id}
              onClick={() => setSelected(term)}
              className="w-full text-left rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-200 p-4 flex items-center gap-3 group active:scale-[0.99]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{term.germanTerm}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{term.englishExplanation}</p>
              </div>
              {term.pronunciationHint && (
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                  {term.pronunciationHint}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            </button>
          ))
        )}
      </div>

      <GlossaryModal term={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
