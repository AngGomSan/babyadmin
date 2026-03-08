import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { globalDocuments, GlobalDocument } from '@/data/documents';
import { timelineTasks } from '@/data/timelineTasks';
import { glossaryTerms } from '@/data/glossaryTerms';
import { Checkbox } from '@/components/ui/checkbox';
import GlossaryModal from '@/components/GlossaryModal';
import { FolderOpen, Hospital, Landmark, LucideIcon } from 'lucide-react';
import { GlossaryTerm } from '@/types';

/** Map German document names to glossary entries (case-insensitive, partial match) */
const glossaryByGerman = new Map<string, GlossaryTerm>();
glossaryTerms.forEach(term => {
  glossaryByGerman.set(term.germanTerm.toLowerCase(), term);
});

const sectionIcons: Record<string, LucideIcon> = {
  'Prepare during pregnancy': FolderOpen,
  'Needed for birth registration': Hospital,
  'Needed after birth': Landmark,
};

const sections: { title: string; docIds: string[] }[] = [
  {
    title: 'Prepare during pregnancy',
    docIds: [
      'doc-parent-passports',
      'doc-parent-birth-certificates',
      'doc-marriage-certificate',
      'doc-paternity-recognition',
      'doc-custody-declaration',
      'doc-naming-declaration',
      'doc-certified-translations',
    ],
  },
  {
    title: 'Needed for birth registration',
    docIds: [
      'doc-geburtsanzeige',
      'doc-birth-certificate',
      'doc-birth-certificate-elterngeld',
    ],
  },
  {
    title: 'Needed after birth',
    docIds: [
      'doc-due-date-confirmation',
      'doc-elternzeit-letter',
      'doc-employer-confirmation',
      'doc-salary-statements',
      'doc-parent-tax-id',
      'doc-child-tax-id',
      'doc-kindergeld-form',
      'doc-health-insurance-info',
      'doc-health-insurance-card',
      'doc-parent-insurance-number',
      'doc-mutterpass',
    ],
  },
];

function getTasksForDocument(docId: string) {
  return timelineTasks
    .filter(t => t.requiredDocuments?.includes(docId))
    .map(t => t.title);
}

export default function DocumentsPage() {
  const { isDocumentComplete, toggleDocument } = useApp();

  const completedCount = globalDocuments.filter(d => isDocumentComplete(d.id)).length;
  const totalCount = globalDocuments.length;
  const docMap = new Map(globalDocuments.map(d => [d.id, d]));

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track documents you need across all tasks.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl bg-card shadow-card p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Documents ready: {completedCount} / {totalCount}
          </span>
          <span className="text-xs text-muted-foreground">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Grouped document list */}
      <div className="space-y-5">
        {sections.map((section) => {
          const docs = section.docIds.map(id => docMap.get(id)).filter(Boolean) as GlobalDocument[];
          if (docs.length === 0) return null;

          return (
            <div key={section.title}>
              <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-1">
                {(() => { const Icon = sectionIcons[section.title]; return Icon ? <Icon className="h-3.5 w-3.5" /> : null; })()}
                {section.title}
              </h2>
              <div className="rounded-xl bg-card shadow-card divide-y divide-border">
                {docs.map((doc) => {
                  const checked = isDocumentComplete(doc.id);
                  const relatedTasks = getTasksForDocument(doc.id);

                  return (
                    <div key={doc.id} className="px-4 py-3.5">
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleDocument(doc.id)}
                          className={`rounded mt-[3px] h-[18px] w-[18px] shrink-0 ${!checked ? 'border-primary' : ''}`}
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-[13px] leading-snug block ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {doc.label} <span className="text-muted-foreground">({doc.germanName})</span>
                          </span>
                          {relatedTasks.length > 0 && !checked && (
                            <p className="text-[11px] mt-1 leading-relaxed">
                              <span className="text-muted-foreground/70">Needed for: </span>
                              {relatedTasks.map((name, i) => (
                                <span key={i}>
                                  {i > 0 && <span className="text-muted-foreground/40 mx-1">·</span>}
                                  <span className="text-muted-foreground/80">{name}</span>
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}