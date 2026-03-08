import { useApp } from '@/contexts/AppContext';
import { globalDocuments } from '@/data/documents';
import { timelineTasks } from '@/data/timelineTasks';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardList } from 'lucide-react';

/** For each document, find which tasks reference it */
function getTasksForDocument(docId: string) {
  return timelineTasks
    .filter(t => t.requiredDocuments?.includes(docId))
    .map(t => t.title);
}

export default function DocumentsPage() {
  const { isDocumentComplete, toggleDocument } = useApp();

  const completedCount = globalDocuments.filter(d => isDocumentComplete(d.id)).length;
  const totalCount = globalDocuments.length;

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
            {completedCount} of {totalCount} documents prepared
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

      {/* Document list */}
      <div className="rounded-xl bg-card shadow-card divide-y divide-border">
        {globalDocuments.map((doc) => {
          const checked = isDocumentComplete(doc.id);
          const relatedTasks = getTasksForDocument(doc.id);

          return (
            <div key={doc.id} className="px-4 py-3">
              <label className="flex items-baseline gap-3 cursor-pointer min-h-[1.75rem]">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleDocument(doc.id)}
                  className={`rounded relative top-[3px] h-[18px] w-[18px] shrink-0 ${!checked ? 'border-primary' : ''}`}
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[13px] leading-snug ${checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {doc.label} <span className="text-muted-foreground">({doc.germanName})</span>
                  </span>
                  {relatedTasks.length > 0 && !checked && (
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">
                      Needed for: {relatedTasks.join(' · ')}
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
}
